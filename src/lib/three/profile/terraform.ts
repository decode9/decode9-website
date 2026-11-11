/**
 * Pure terraform math of the profile scene (no three, no DOM): progress → visuals.
 * Values are those of the original frame loop (perfil/index.html L2310–2400).
 */

/** Progress at which each of the four phases starts (PH of the original). */
export const PHASE_STARTS = [0, 0.2, 0.5, 0.76] as const;

/** Seconds a world takes to terraform from 0 to 1. */
export const TERRAFORM_DURATION = 26;

/** The paint front reaches the south pole (π + jitter margin). */
export const FULL_FRONT = Math.PI + 0.2;

export const clamp = (x: number, min: number, max: number): number => Math.min(max, Math.max(min, x));

export const smooth = (x: number): number => x * x * (3 - 2 * x);

export const easeBack = (x: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/** Index (0–3) of the phase the world is in. */
export const phaseIndex = (p: number): number => {
  for (let i = 0; i < 4; i++) {
    const end = i < 3 ? PHASE_STARTS[i + 1] : 1;
    if (p < end) return i;
  }
  return 3;
};

/** Polar angle reached by the green front (painted twice as fast as the whole terraform). */
export const paintFront = (p: number): number => Math.min(1, p / 0.48) * FULL_FRONT;

export const atmosphereOpacity = (p: number): number => 0.03 + 0.2 * Math.min(1, p / 0.6);

/** 0→1 progress of the "Red" phase (network arcs, aurora). */
export const networkProgress = (p: number): number => clamp((p - PHASE_STARTS[3]) / (1 - PHASE_STARTS[3]), 0, 1);

/** Scale of a prop that appears at `pA` (or disappears, when `reverse`). */
export const itemScale = (p: number, pA: number, reverse = false): number => {
  const x = clamp((p - pA) * 14, 0, 1);
  if (reverse) return Math.max(0.0001, 1 - x * x);
  return x <= 0 ? 0.0001 : easeBack(x);
};

/** Next value of a world's progress after `dt` seconds of terraforming. */
export const advanceProgress = (p: number, dt: number, reduce = false): number =>
  reduce ? 1 : Math.min(1, p + dt / TERRAFORM_DURATION);

export type ToneGroup = 'deep' | 'water' | 'edge' | 'main' | 'lava' | 'barren';

export interface FaceInfo {
  /** Polar angle of the face centre. */
  t: number;
  /** Height noise at the face centre. */
  h: number;
  /** Jitter added to the polar angle so the front looks ragged. */
  j: number;
}

export interface ToneSlot {
  group: ToneGroup;
  /** Index inside `main` / `barren` (0 for single colours). */
  index: number;
}

/** Palette slot of a face for a given paint front (`paint` of the original). */
export const faceTone = (face: FaceInfo, front: number, hasLava: boolean): ToneSlot => {
  const t = face.t + face.j;
  const { h } = face;
  if (t < front) {
    if (h < -0.42) return { group: 'deep', index: 0 };
    if (h < -0.3) return { group: 'water', index: 0 };
    if (front - t < 0.14) return { group: 'edge', index: 0 };
    return { group: 'main', index: h > 0.3 ? 2 : h > -0.05 ? 1 : 0 };
  }
  if (hasLava && h < -0.3) return { group: 'lava', index: 0 };
  return { group: 'barren', index: h > 0.25 ? 2 : h > -0.2 ? 1 : 0 };
};

/** Minimum front change that triggers a repaint. */
export const PAINT_EPSILON = 0.004;

/** Park–Miller generator used to place props deterministically (seed = 7 + wi·131). */
export const createSeededRandom = (seed: number): (() => number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/** Height noise of a world (H of buildWorld). */
export const worldHeight =
  (off: readonly number[]) =>
  (x: number, y: number, z: number): number =>
    Math.sin(3 * x + off[0]) * Math.sin(3 * y + off[1]) * Math.sin(3 * z + off[2]) +
    0.5 * Math.sin(7 * x + off[3]) * Math.sin(6 * y + 1) * Math.sin(8 * z + off[4]);
