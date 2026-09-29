export const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number =>
  outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);

export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Per-particle morph progress. Each particle starts after a delay proportional
 * to its random seed, so shapes resolve progressively instead of all at once.
 * The particle vertex shader implements the exact same curve (see
 * lib/three/shaders/particles.ts) so a morph interrupted mid-way can be rebased
 * on the CPU without a visible jump.
 */
export const staggeredProgress = (global: number, seed: number, spread: number): number =>
  easeInOutCubic(clamp((global - seed * spread) / (1 - spread)));

/** Deterministic PRNG (mulberry32) so sampled shapes are identical on every visit. */
export const createRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Parses "#RRGGBB" into 0–1 RGB channels. */
export const hexToRgb = (hex: string): [number, number, number] => {
  const value = hex.replace('#', '');
  const channel = (offset: number) => parseInt(value.slice(offset, offset + 2), 16) / 255;
  return [channel(0), channel(2), channel(4)];
};
