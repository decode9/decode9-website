/*
 * Podcast cover visualiser (original mountMedia tick): 48 bars, amber up to the play head and red after.
 * Live analyser levels when there is sound; a synthetic wave while playing silently; a low idle ripple
 * when paused.
 */
const BARS = 48;

/** Height (0–1) of bar `k`: live level, synthetic wave or idle ripple. */
export const barLevel = (k: number, t: number, playing: boolean, levels: Uint8Array | null): number => {
  if (levels) return 0.06 + (levels[Math.floor((k / BARS) * levels.length * 0.8)] / 255) * 0.94;
  if (playing) return 0.15 + Math.abs(Math.sin(k * 0.5 + t / 180)) * 0.6;
  return 0.06 + 0.04 * Math.sin(k);
};

/** True when the analyser carries signal (any bin above 4). */
export const hasSignal = (levels: Uint8Array | null): boolean => !!levels && levels.some((v) => v > 4);

export const drawMediaBars = (
  canvas: HTMLCanvasElement,
  t: number,
  opts: { playing: boolean; progress: number; levels: Uint8Array | null },
): void => {
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  if (W && canvas.width !== W) {
    canvas.width = W;
    canvas.height = H;
  }
  const g = canvas.getContext('2d');
  if (!g) return;
  g.clearRect(0, 0, W, H);
  const bw = W / BARS;
  const live = opts.playing && hasSignal(opts.levels) ? opts.levels : null;
  for (let k = 0; k < BARS; k += 1) {
    const a = barLevel(k, t, opts.playing, live);
    g.fillStyle = k / BARS < opts.progress ? 'rgba(255,178,28,.9)' : 'rgba(255,60,40,.7)';
    g.fillRect(k * bw + 1, H / 2 - a * H * 0.45, bw - 2, a * H * 0.9);
  }
};
