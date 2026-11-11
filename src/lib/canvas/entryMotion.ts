/**
 * Pure motion math of the entry page (/): which face frame matches a pointer position,
 * where the red/blue seam sits and which side is active. No DOM, fully testable.
 */

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

/** Fractional frame for a position 0 (red) → 1 (blue); 0.5 maps to the frontal frame. */
export const fractionalFrame = (x: number, center: number, last: number): number =>
  x <= 0.5 ? (x / 0.5) * center : center + ((x - 0.5) / 0.5) * (last - center);

/** Nearest frame for a position 0–1. */
export const frameFor = (x: number, center: number, last: number): number =>
  x <= 0.5 ? Math.round((x / 0.5) * center) : center + Math.round(((x - 0.5) / 0.5) * (last - center));

/** Horizontal correction (in canvas px) that recentres the head on phones; ±7% max. */
export const headOffset = (headX: number, width: number): number => clamp(0.5 - headX, -0.07, 0.07) * width;

export interface SeamInput {
  /** Smoothed position 0–1. */
  pos: number;
  /** Phone layout (max-aspect-ratio 9/10). */
  mobile: boolean;
  /** Touch device: the seam stays still. */
  touch: boolean;
  leaving: 'red' | 'blue' | null;
  /** Exit progress 0–1. */
  take: number;
}

/** Top/bottom x (in %) of the diagonal seam; the red side is clipped to it. */
export const seamEdges = ({ pos, mobile, touch, leaving, take }: SeamInput): { top: number; bottom: number } => {
  let shift = touch ? 0 : (0.5 - pos) * (mobile ? 14 : 26);
  if (leaving) shift += (leaving === 'red' ? 1 : -1) * take * 90;
  return { top: (mobile ? 60 : 55) + shift, bottom: (mobile ? 40 : 45) + shift };
};

/** Highlighted side: only while the visitor actively points (not idle, not touch). */
export const activeSide = (pos: number, idle: boolean): '' | 'red' | 'blue' =>
  idle ? '' : pos < 0.44 ? 'red' : pos > 0.56 ? 'blue' : '';

/** Idle sway around the centre (only alternates the frontal frame and the next one). */
export const idleTarget = (now: number): number => 0.5 + Math.sin(now / 1100) * 0.07;

/** Terminal-style progress lines for the red warp. */
export const warpLog = (lines: readonly string[], p: number): string => {
  const n = Math.round(p * 100);
  const k = Math.min(lines.length, 1 + Math.floor(p * lines.length));
  const filled = Math.round(p * 16);
  const bar = `[${'█'.repeat(filled)}${'·'.repeat(16 - filled)}] ${n}%`;
  return `${lines.slice(0, k).join('\n')}\n${bar}`;
};
