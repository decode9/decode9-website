/*
 * Bar waveforms of the transmitter: the live wave next to the portrait (`drawRadioWave`) and the
 * seekable media track of the players (`drawMediaTrack`, used by the sheets of phase 3b).
 */

const RED = '#ff2b1c';
const DEEP = '#4a0b07';

/** Matches the canvas backing store to its CSS size × devicePixelRatio. Returns the ratio. */
export const sizeCanvas = (canvas: HTMLCanvasElement): number => {
  const rect = canvas.getBoundingClientRect();
  const ratio = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
  const width = Math.round(rect.width * ratio);
  if (canvas.width !== width) {
    canvas.width = width;
    canvas.height = Math.round(rect.height * ratio);
  }
  return ratio;
};

/**
 * Height (0–1+) of bar `i` of `n`: from the analyser spectrum when `spectrum` is given, otherwise a
 * synthetic sum of sines scaled by `amp`. Edges are tapered and the floor is .04.
 */
export const radioWaveValue = (i: number, n: number, amp: number, t: number, spectrum: Uint8Array | null): number => {
  const raw = spectrum
    ? (spectrum[Math.floor(3 + i * (56 / n))] / 255) * 1.3
    : Math.abs(Math.sin(t * 0.011 + i * 0.55) * 0.5 + Math.sin(t * 0.023 + i * 1.7) * 0.35 + Math.sin(t * 0.005 + i * 0.21) * 0.3) * amp;
  return Math.max(0.04, raw * (0.55 + 0.45 * Math.sin((i / n) * Math.PI)));
};

/** Live wave: `spectrum` (analyser bytes) when the voice is on air, synthetic otherwise. */
export const drawRadioWave = (canvas: HTMLCanvasElement, amp: number, t: number, spectrum: Uint8Array | null): void => {
  const ratio = sizeCanvas(canvas);
  const { width: w, height: h } = canvas;
  const g = canvas.getContext('2d');
  if (!g) return;
  g.clearRect(0, 0, w, h);
  const n = Math.max(16, Math.floor(w / (6 * ratio)));
  const bw = w / n;
  for (let i = 0; i < n; i += 1) {
    const v = radioWaveValue(i, n, amp, t, spectrum);
    const bh = Math.max(2 * ratio, Math.min(1, v) * h * 0.92);
    g.fillStyle = v < 0.08 ? DEEP : RED;
    g.fillRect(i * bw + ratio, (h - bh) / 2, bw - 2 * ratio, bh);
  }
};

/** Media track: played part in red; bars near the playhead dance while `live`. */
export const drawMediaTrack = (canvas: HTMLCanvasElement, progress: number, t: number, live: boolean): void => {
  const ratio = sizeCanvas(canvas);
  const { width: w, height: h } = canvas;
  const g = canvas.getContext('2d');
  if (!g) return;
  g.clearRect(0, 0, w, h);
  const n = Math.max(8, Math.floor(w / (5 * ratio)));
  const bw = w / n;
  for (let i = 0; i < n; i += 1) {
    const at = i / n;
    let s = Math.abs(Math.sin(i * 1.37) * 0.6 + Math.sin(i * 0.31) * 0.4);
    if (live && at < progress + 0.02 && at > progress - 0.06) s = Math.min(1, s + Math.abs(Math.sin(t * 0.02 + i)) * 0.5);
    const bh = Math.max(2 * ratio, (0.2 + s * 0.8) * h);
    g.fillStyle = at <= progress ? RED : DEEP;
    g.fillRect(i * bw + ratio, (h - bh) / 2, bw - 2 * ratio, bh);
  }
};
