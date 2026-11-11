import * as THREE from 'three';
import type { WorldConfig } from '@/interfaces';
import { createCrew, type CrewArc } from './crew';
import type { Primitives } from './primitives';
import { createPropFactory } from './props';
import {
  atmosphereOpacity,
  createSeededRandom,
  FULL_FRONT,
  faceTone,
  itemScale,
  networkProgress,
  paintFront,
  PAINT_EPSILON,
  worldHeight,
  type FaceInfo,
} from './terraform';

export interface WorldItem {
  o: THREE.Group;
  n: THREE.Vector3;
  node: boolean;
  rev: boolean;
  hub: boolean;
  /** Progress at which it pops up. */
  pA: number;
}

/** Something the camera stops at: worlds, mystery and averno share this shape. */
export interface SceneBody {
  group: THREE.Group;
  /** Spins with the drag gesture and the idle rotation. */
  spinner: THREE.Group;
  R: number;
  /** Height of the north pole above the centre (where Jorge stands). */
  top: number;
  /** Residual drag velocity. */
  spin: number;
}

export interface WorldHandle extends SceneBody {
  cfg: WorldConfig;
  /** Terraform progress 0–1 (mutable: the loop advances it). */
  p: number;
  /** Already jumped to the next world after finishing. */
  advanced: boolean;
  items: WorldItem[];
  arcs: CrewArc[];
  linkMat: THREE.LineBasicMaterial;
  atmo: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  aurora: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial> | null;
  /** Paints the surface up to the given polar front. */
  paint: (front: number) => void;
  /** Applies the visuals of the current `p` (surface, atmosphere, props, crew, network). */
  update: (dt: number, tt: number) => void;
}

export interface BuildWorldDeps {
  primitives: Primitives;
  reduce: boolean;
}

const UP = new THREE.Vector3(0, 1, 0);

/** A terraformable planet (buildWorld of the original, L1519–1661). */
export const buildWorld = (cfg: WorldConfig, wi: number, { primitives, reduce }: BuildWorldDeps): WorldHandle => {
  const H = worldHeight(cfg.off);
  const R = cfg.R;
  const surf = (n: THREE.Vector3) => R * (1 + 0.035 * H(n.x, n.y, n.z));
  const group = new THREE.Group();
  group.position.fromArray(cfg.pos);
  const spinner = new THREE.Group();
  group.add(spinner);

  const g = new THREE.IcosahedronGeometry(R, 6);
  const P = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) {
    v.fromBufferAttribute(P, i).normalize();
    v.multiplyScalar(surf(v));
    P.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  const faces = P.count / 3;
  const col = new Float32Array(P.count * 3);
  const colorAttr = new THREE.BufferAttribute(col, 3);
  g.setAttribute('color', colorAttr);
  const info: FaceInfo[] = [];
  const c = new THREE.Vector3();
  for (let f = 0; f < faces; f++) {
    c.set(0, 0, 0);
    for (let k = 0; k < 3; k++) c.add(v.fromBufferAttribute(P, f * 3 + k));
    c.divideScalar(3).normalize();
    info.push({ t: Math.acos(THREE.MathUtils.clamp(c.y, -1, 1)), h: H(c.x, c.y, c.z), j: Math.sin(c.x * 11 + c.z * 9) * 0.12 });
  }
  const C = (h: number) => new THREE.Color(h);
  const pal = {
    barren: cfg.barren.map(C),
    main: cfg.main.map(C),
    deep: [C(cfg.deep)],
    water: [C(cfg.water)],
    edge: [C(cfg.edge)],
    lava: cfg.lava !== undefined ? [C(cfg.lava)] : [],
  };
  const hasLava = cfg.lava !== undefined;
  let lastFront = -1;
  const paint = (front: number) => {
    if (Math.abs(front - lastFront) < PAINT_EPSILON) return;
    lastFront = front;
    for (let f = 0; f < faces; f++) {
      const slot = faceTone(info[f], front, hasLava);
      const tc = pal[slot.group][slot.index];
      for (let k = 0; k < 3; k++) col.set([tc.r, tc.g, tc.b], (f * 3 + k) * 3);
    }
    colorAttr.needsUpdate = true;
  };
  spinner.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, metalness: 0 })));
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.16, 48, 32),
    new THREE.MeshBasicMaterial({
      color: cfg.atmo,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  group.add(atmo);

  const rnd = createSeededRandom(7 + wi * 131);
  const factory = createPropFactory(rnd, primitives);
  const items: WorldItem[] = [];
  const okSpot = (n: THREE.Vector3) => H(n.x, n.y, n.z) >= -0.28 && items.every((it) => it.n.angleTo(n) > 0.17);
  cfg.items.forEach(({ prop, windowColor, count, pStart, pSpan, thetaMin, thetaMax, node, reverse = false, hub = false }) => {
    let tries = 0;
    let made = 0;
    while (made < count && tries < 700) {
      tries++;
      const th = thetaMin + rnd() * (thetaMax - thetaMin);
      const ph = rnd() * Math.PI * 2;
      const n = new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph));
      if (!okSpot(n)) continue;
      const obj = factory[prop](windowColor);
      obj.position.copy(n).multiplyScalar(surf(n) - 0.015);
      obj.quaternion.setFromUnitVectors(UP, n);
      obj.rotateY(rnd() * Math.PI * 2);
      obj.scale.setScalar(reverse ? 1 : 0.0001);
      spinner.add(obj);
      items.push({ o: obj, n, node, rev: reverse, hub, pA: pStart + (hub ? rnd() * pSpan : (th / Math.PI) * pSpan) });
      made++;
    }
  });

  // red de nodos: cada nodo se une a sus dos vecinos más cercanos
  const nodes = items.filter((i) => i.node);
  const arcs: CrewArc[] = [];
  const pairs = new Set<string>();
  // depthWrite off: r186 sorts transparents by bounding-sphere centre (r128 used the object origin),
  // so arcs on the far side would be drawn before the atmosphere and punch dark lines into it.
  const linkMat = new THREE.LineBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0, depthWrite: false });
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffe2b8 });
  nodes.forEach((a, ia) => {
    nodes
      .map((b, ib) => ({ ib, d: a.n.angleTo(b.n) }))
      .filter((x) => x.ib !== ia)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2)
      .forEach(({ ib }) => {
        const key = `${Math.min(ia, ib)}-${Math.max(ia, ib)}`;
        if (pairs.has(key)) return;
        pairs.add(key);
        const A = a.n.clone().multiplyScalar(R + 0.12);
        const B = nodes[ib].n.clone().multiplyScalar(R + 0.12);
        const ctrl = a.n
          .clone()
          .add(nodes[ib].n)
          .normalize()
          .multiplyScalar(R + 0.25 + A.distanceTo(B) * 0.35);
        const curve = new THREE.QuadraticBezierCurve3(A, ctrl, B);
        spinner.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), linkMat));
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), pulseMat);
        pulse.visible = false;
        spinner.add(pulse);
        arcs.push({ curve, pulse, off: rnd() });
      });
  });

  const crew = cfg.crew
    ? createCrew({ count: cfg.crew, hubs: items.filter((i) => i.hub), R, surf, rnd, spinner, primitives, linkMat, pulseMat, arcs })
    : null;

  let aurora: WorldHandle['aurora'] = null;
  if (cfg.aurora) {
    aurora = new THREE.Mesh(
      new THREE.TorusGeometry(R * 1.32, 0.05, 6, 80),
      new THREE.MeshBasicMaterial({ color: 0x7dffc4, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    aurora.rotation.set(1.2, 0, 0.3);
    group.add(aurora);
  }

  paint(reduce ? FULL_FRONT : 0);

  const handle: WorldHandle = {
    cfg,
    group,
    spinner,
    R,
    top: surf(UP),
    spin: 0,
    p: reduce ? 1 : 0,
    advanced: false,
    items,
    arcs,
    linkMat,
    atmo,
    aurora,
    paint,
    update: (dt, tt) => {
      const { p } = handle;
      paint(paintFront(p));
      atmo.material.opacity = atmosphereOpacity(p);
      items.forEach((it) => it.o.scale.setScalar(itemScale(p, it.pA, it.rev)));
      crew?.update(p, reduce ? 0 : tt);
      const net = networkProgress(p);
      linkMat.opacity = 0.55 * net;
      arcs.forEach((ar) => {
        ar.pulse.visible = net > 0.3;
        if (ar.pulse.visible) ar.pulse.position.copy(ar.curve.getPoint((tt * 0.35 + ar.off) % 1));
      });
      if (aurora) {
        aurora.material.opacity = 0.45 * net;
        if (!reduce) aurora.rotation.z += dt * 0.15;
      }
    },
  };
  return handle;
};
