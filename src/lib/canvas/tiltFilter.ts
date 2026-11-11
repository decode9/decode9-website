/**
 * Turns raw deviceorientation readings into a 0–1 position plus small parallax offsets.
 * Starts frontal: during the first half second it only measures how the phone is held,
 * then re-centres very slowly. Pure (time is passed in), so it is testable.
 */
export interface TiltReading {
  /** 0 (red) – 1 (blue). */
  value: number;
  /** Parallax offsets in px. */
  fx: number;
  fy: number;
  /** Raw gamma and current base, for the ?giro=1 debug panel. */
  raw: number;
  base: number;
}

export interface TiltFilter {
  /** True when a reading counts (sensor present, portrait). */
  accepts: (gamma: number | null, beta: number | null, angle: number) => boolean;
  /** Returns null while calibrating, in landscape or without sensor data. */
  read: (gamma: number | null, beta: number | null, angle: number, now: number) => TiltReading | null;
  reset: () => void;
}

const CALIBRATION_MS = 500;
const DEAD_ZONE = 5;
const RANGE = 50;

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

/** A reading counts when the device has a sensor and is held in portrait. */
export const isUsableTilt = (gamma: number | null, beta: number | null, angle: number): boolean =>
  !(gamma == null && beta == null) && (angle === 0 || angle === 180);

export const createTiltFilter = (): TiltFilter => {
  let base: number | null = null;
  let t0 = 0;
  let samples: number[] = [];

  const read: TiltFilter['read'] = (gamma, beta, angle, now) => {
    if (!isUsableTilt(gamma, beta, angle)) return null; // no sensor, or landscape (the entry is portrait only)
    const lr = gamma || 0;
    const fb = (beta || 0) - 45;
    if (base === null) {
      if (!t0) t0 = now;
      samples.push(lr);
      if (now - t0 < CALIBRATION_MS) return null;
      const sorted = samples.slice().sort((a, b) => a - b);
      base = sorted[sorted.length >> 1];
    }
    base += (lr - base) * 0.004;
    const d = lr - base;
    // a hand shakes: ignore the first 5° and need ±30° to cover the whole sequence
    const dz = Math.abs(d) < DEAD_ZONE ? 0 : d - Math.sign(d) * DEAD_ZONE;
    return {
      value: clamp(0.5 + dz / RANGE, 0, 1),
      fx: clamp(d * 0.5, -12, 12),
      fy: clamp(fb * 0.25, -9, 9),
      raw: lr,
      base,
    };
  };

  const reset = () => {
    base = null;
    t0 = 0;
    samples = [];
  };

  return { accepts: isUsableTilt, read, reset };
};
