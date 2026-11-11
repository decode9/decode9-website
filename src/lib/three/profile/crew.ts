import * as THREE from 'three';
import { clamp, smooth } from './terraform';
import type { Primitives } from './primitives';

/** A spot on a world: object + unit normal where it stands. */
export interface WorldSpot {
  n: THREE.Vector3;
}

export interface CrewArc {
  curve: THREE.QuadraticBezierCurve3;
  pulse: THREE.Mesh;
  off: number;
}

interface CrewMember {
  m: THREE.Group;
  body: THREE.Group;
  legs: THREE.Group[];
  armL: THREE.Mesh;
  armR: THREE.Mesh;
  start: THREE.Vector3;
  listen: THREE.Vector3;
  target: THREE.Vector3;
  hub: WorldSpot;
  wob: number;
  delay: number;
  cur: THREE.Vector3;
}

export interface CrewDeps {
  count: number;
  hubs: WorldSpot[];
  R: number;
  surf: (n: THREE.Vector3) => number;
  rnd: () => number;
  spinner: THREE.Group;
  primitives: Primitives;
  linkMat: THREE.LineBasicMaterial;
  pulseMat: THREE.MeshBasicMaterial;
  /** The member's tie to its group is pushed here (it pulses in the network phase). */
  arcs: CrewArc[];
}

const SUITS = [0x7fb3ff, 0xff9a8a, 0xa3e07a, 0xc9a8ff, 0xffd36b, 0x6fd6d0];
const Y = new THREE.Vector3(0, 1, 0);
const X = new THREE.Vector3(1, 0, 0);
const dirAt = (th: number, ph: number) => new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph));

/**
 * The Colonia team (L1590–1645): arrives scattered, listens to Jorge at the pole,
 * splits into groups around the hubs and builds. Returns `update(p, t)`.
 */
export const createCrew = ({ count, hubs, R, surf, rnd, spinner, primitives, linkMat, pulseMat, arcs }: CrewDeps) => {
  const { box } = primitives;
  const crew: CrewMember[] = [];
  for (let i = 0; i < count; i++) {
    const m = new THREE.Group();
    const body = new THREE.Group();
    m.add(body);
    const suit = SUITS[i % SUITS.length];
    const legs = [-1, 1].map((sx) => {
      const l = new THREE.Group();
      l.position.set(sx * 0.018, 0.05, 0);
      body.add(l);
      box(l, 0.026, 0.05, 0.026, 0x3b3f58, 0, -0.025, 0);
      return l;
    });
    box(body, 0.07, 0.07, 0.045, suit, 0, 0.085, 0);
    box(body, 0.055, 0.055, 0.055, 0xd9a07a, 0, 0.15, 0);
    box(body, 0.058, 0.018, 0.058, 0x2a1d16, 0, 0.18, 0);
    const armL = box(body, 0.018, 0.055, 0.018, suit, -0.044, 0.09, 0);
    const armR = box(body, 0.018, 0.055, 0.018, suit, 0.044, 0.09, 0);
    spinner.add(m);
    const hub = hubs[i % hubs.length];
    const start = dirAt(0.6 + rnd() * 2.1, rnd() * Math.PI * 2);
    const listen = dirAt(0.48 + rnd() * 0.14, rnd() * Math.PI * 2);
    const t = new THREE.Vector3().crossVectors(hub.n, Y).normalize();
    const b2 = new THREE.Vector3().crossVectors(hub.n, t).normalize();
    const k = Math.floor(i / hubs.length);
    const ang = (k / Math.ceil(count / hubs.length)) * Math.PI * 2 + (i % hubs.length);
    const target = hub.n
      .clone()
      .addScaledVector(t, Math.cos(ang) * 0.13)
      .addScaledVector(b2, Math.sin(ang) * 0.13)
      .normalize();
    crew.push({ m, body, legs, armL, armR, start, listen, target, hub, wob: rnd() * 6, delay: rnd() * 0.06, cur: start.clone() });
    // lazo del miembro con su grupo, para la fase de red
    const A = target.clone().multiplyScalar(R + 0.16);
    const B = hub.n.clone().multiplyScalar(R + 0.12);
    const curve = new THREE.QuadraticBezierCurve3(A, target.clone().add(hub.n).normalize().multiplyScalar(R + 0.3), B);
    spinner.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(16)), linkMat));
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 4), pulseMat);
    pulse.visible = false;
    spinner.add(pulse);
    arcs.push({ curve, pulse, off: rnd() });
  }

  const qT = new THREE.Quaternion();
  const nD = new THREE.Vector3();
  const prevD = new THREE.Vector3();
  const loc = new THREE.Vector3();

  const update = (p: number, tt: number) => {
    crew.forEach((c) => {
      const wob = tt * 0.35 + c.wob;
      // deambular: cada uno por su lado
      nD.copy(c.start)
        .applyAxisAngle(Y, Math.sin(wob) * 0.5)
        .applyAxisAngle(X, Math.cos(wob * 0.8) * 0.12)
        .normalize();
      const g1 = smooth(clamp((p - 0.05 - c.delay) / 0.17, 0, 1));
      const g2 = smooth(clamp((p - 0.26 - c.delay) / 0.22, 0, 1));
      nD.lerp(c.listen, g1).normalize().lerp(c.target, g2).normalize();
      prevD.copy(c.cur);
      c.cur.copy(nD);
      c.m.position.copy(nD).multiplyScalar(surf(nD) - 0.01);
      c.m.quaternion.setFromUnitVectors(Y, nD);
      const moving = prevD.distanceTo(nD) > 1e-5;
      // mirar: a Jorge (polo) mientras escucha; a su grupo cuando trabaja
      const lookTo = g1 > 0.9 && g2 < 0.1 ? Y : g2 > 0.9 ? c.hub.n : null;
      if (lookTo) {
        loc.copy(lookTo).sub(nD).applyQuaternion(qT.copy(c.m.quaternion).invert());
        c.body.rotation.y = Math.atan2(-loc.x, -loc.z) + Math.PI;
      } else if (moving) {
        loc.copy(nD).sub(prevD).applyQuaternion(qT.copy(c.m.quaternion).invert());
        c.body.rotation.y = Math.atan2(loc.x, loc.z);
      }
      const step = moving ? Math.sin(tt * 12 + c.wob) * 0.6 : 0;
      c.legs[0].rotation.x = step;
      c.legs[1].rotation.x = -step;
      const work = g2 > 0.9 && p > 0.5 ? Math.max(0, Math.sin(tt * 7 + c.wob)) * 1.4 : 0;
      const cheer = g1 > 0.9 && g2 < 0.1 ? 0.3 + Math.sin(tt * 2 + c.wob) * 0.1 : 0;
      c.armR.rotation.x = -work - cheer;
      c.armL.rotation.x = step * 0.5 - cheer;
      c.body.position.y = moving ? Math.abs(Math.sin(tt * 12 + c.wob)) * 0.01 : 0;
    });
  };

  return { update };
};
