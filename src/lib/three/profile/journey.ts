import * as THREE from 'three';
import type { CameraAnchor } from './anchors';
import { advanceProgress, smooth } from './terraform';

/**
 * Pure logic of the scroll journey (bucle `frame` of the original, L2310–2365): scroll → stops,
 * inertia, camera between anchors, Jorge's orbital trajectory and the terraform autopilot.
 */

/**
 * Scroll in stops, clamped to [0, last]. `stopHeight` is the real height of one stop (the snap unit,
 * 100svh), not `innerHeight`: on mobile with the browser bar hidden the window is taller than a stop
 * and dividing by it leaves Jorge hanging mid-flight on a snapped stop.
 */
export const scrollToStops = (scrollY: number, stopHeight: number, last: number): number =>
  THREE.MathUtils.clamp(scrollY / Math.max(1, stopHeight), 0, last);

/** Inertia: the camera follows the scroll with lag, like a body with mass (spS of the original). */
export const followScroll = (spS: number, sp: number, dt: number, reduce: boolean): number => {
  const next = spS + (sp - spS) * (reduce ? 1 : 1 - Math.exp(-dt * 2.4));
  return Math.abs(sp - next) < 0.0004 ? sp : next;
};

export interface JourneySegment {
  /** Stop the camera leaves (0 … last-1). */
  a: number;
  /** Raw fraction of the way to stop a+1. */
  f: number;
  /** Smoothed fraction (camera interpolation). */
  e: number;
  /** Between stops (orbit flight). */
  flying: boolean;
  /** Stop the camera is closest to (`current`). */
  current: number;
}

export const segmentAt = (spS: number, last: number): JourneySegment => {
  const a = Math.min(last - 1, Math.floor(spS));
  const f = spS >= last ? 1 : spS - a;
  return { a, f, e: smooth(f), flying: f > 0.004 && f < 0.996, current: Math.round(spS) };
};

/** Stop where both the scroll and the camera rest, or -1 while moving. */
export const settledStop = (sp: number, spS: number): number => {
  const nearest = Math.round(sp);
  return Math.abs(sp - nearest) < 0.03 && Math.abs(spS - nearest) < 0.02 ? nearest : -1;
};

/** Camera position and look target between two anchors. */
export const cameraBetween = (A: CameraAnchor, B: CameraAnchor, e: number, outCam: THREE.Vector3, outLook: THREE.Vector3): void => {
  outCam.lerpVectors(A.cam, B.cam, e);
  outLook.lerpVectors(A.look, B.look, e);
};

export interface OrbitBody {
  group: { position: THREE.Vector3 };
  top: number;
}

const UP = new THREE.Vector3(0, 1, 0);
const vU = new THREE.Vector3();
const vC = new THREE.Vector3();
const vPA = new THREE.Vector3();
const vPB = new THREE.Vector3();
const vG = new THREE.Vector3();
const vUp = new THREE.Vector3();

/**
 * Pose of Jorge's station (L2325–2348): spirals out of body A and into body B while flying, with
 * the feet towards the centre of mass between them; otherwise it stands on the anchor.
 */
export const stationPose = (
  target: THREE.Object3D,
  seg: JourneySegment,
  A: CameraAnchor,
  B: CameraAnchor,
  bodyA: OrbitBody,
  bodyB: OrbitBody,
  cam: THREE.Vector3,
  look: THREE.Vector3,
  t: number,
  reduce: boolean,
): void => {
  const { f, e } = seg;
  if (!seg.flying) {
    const S = f > 0.5 ? B : A;
    target.position.copy(S.jorge);
    target.quaternion.identity();
    target.rotateY(S.yaw);
    return;
  }
  const cA = bodyA.group.position;
  const cB = bodyB.group.position;
  vU.subVectors(cB, cA);
  vU.y = 0;
  if (vU.lengthSq() < 1e-4) vU.set(1, 0, 0);
  vU.normalize();
  vC.subVectors(cam, look);
  vC.y = 0;
  vC.normalize();
  const rA = bodyA.top - 0.01 + f * 3.4;
  const th = f * 0.95 * Math.PI;
  const rB = bodyB.top - 0.01 + (1 - f) * 3.4;
  const ph = (1 - f) * 0.95 * Math.PI;
  vPA.copy(cA).addScaledVector(UP, Math.cos(th) * rA).addScaledVector(vU, Math.sin(th) * rA);
  vPB.copy(cB).addScaledVector(UP, Math.cos(ph) * rB).addScaledVector(vU, -Math.sin(ph) * rB);
  const w = smooth(f);
  target.position.lerpVectors(vPA, vPB, w).addScaledVector(vC, Math.sin(Math.PI * f) * 1.4);
  vG.lerpVectors(cA, cB, w);
  vUp.subVectors(target.position, vG).normalize();
  target.quaternion.setFromUnitVectors(UP, vUp);
  target.rotateY(A.yaw + (B.yaw - A.yaw) * e + Math.sin(Math.PI * f) * 0.8);
  target.rotateZ(Math.sin(Math.PI * f) * (0.12 + (reduce ? 0 : Math.sin(t * 0.8) * 0.06)));
};

/** Weightlessness 0–1 (fl of the original): rises fast when the flight starts, settles slower. */
export const floatTowards = (fl: number, flying: boolean, f: number, dt: number): number => {
  const target = flying ? Math.sin(Math.PI * f) : 0;
  const next = fl + (target - fl) * Math.min(1, dt * (target > fl ? 2.5 : 1.6));
  return next < 0.001 ? 0 : next;
};

/** Seconds between a terraformed world and the autopilot flight to the next one. */
export const AUTOPILOT_DELAY_MS = 2600;

export interface TerraformWorld {
  p: number;
  advanced: boolean;
}

export interface TerraformStepInput {
  now: number;
  dt: number;
  /** Pending autopilot deadline (0 = none). */
  advanceAt: number;
  reduce: boolean;
  /** A chapter panel is open: the autopilot waits. */
  hold: boolean;
  /** Night: Jorge sleeps, the world does not advance. */
  paused: boolean;
}

export interface TerraformStepResult {
  advanceAt: number;
  /** Seconds shown in "viajando al siguiente mundo en N…" (0 = none). */
  countdown: number;
  /** Time to fly to the next stop (the world is marked `advanced`). */
  goNext: boolean;
}

/** Advances the settled world and runs the autopilot countdown (L2351–2361). Mutates `w`. */
export const terraformStep = (w: TerraformWorld | undefined, s: TerraformStepInput): TerraformStepResult => {
  if (!w) return { advanceAt: 0, countdown: 0, goNext: false };
  if (w.p < 1 && !s.paused) w.p = advanceProgress(w.p, s.dt, s.reduce);
  if (!(w.p >= 1 && !w.advanced && !s.hold && !s.reduce)) return { advanceAt: 0, countdown: 0, goNext: false };
  const advanceAt = s.advanceAt || s.now + AUTOPILOT_DELAY_MS;
  const countdown = Math.max(1, Math.ceil((advanceAt - s.now) / 1000));
  if (s.now < advanceAt) return { advanceAt, countdown, goNext: false };
  w.advanced = true;
  return { advanceAt: 0, countdown, goNext: true };
};

/** Projects a world point to CSS px. Call after `camera.updateMatrixWorld()`. */
export const toScreen = (p: THREE.Vector3, camera: THREE.Camera, width: number, height: number, out = new THREE.Vector3()) => {
  out.copy(p).project(camera);
  return { x: (out.x * 0.5 + 0.5) * width, y: (-out.y * 0.5 + 0.5) * height, z: out.z };
};
