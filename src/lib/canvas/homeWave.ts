/*
 * Signal wave at the bottom of the home scan (original initHome tick). Bars every 4 px; the centre band
 * is amber. `gate` follows the Sputnik beep (1 on, .18 between beeps, 1 when silent).
 */
export const drawHomeWave = (canvas: HTMLCanvasElement, t: number, playing: boolean, gate: number): void => {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== w) {
    canvas.width = w;
    canvas.height = h;
  }
  const g = canvas.getContext('2d');
  if (!g) return;
  g.clearRect(0, 0, w, h);
  for (let x = 0; x < w; x += 4) {
    const a = Math.abs(Math.sin(x * 0.035 + t / (playing ? 120 : 300)) * Math.sin(x * 0.011 - t / 900)) * (h * 0.42) * gate + Math.random() * 3;
    const mid = Math.abs(x - w / 2) < w * 0.12;
    g.fillStyle = mid ? 'rgba(255,178,28,.85)' : 'rgba(255,60,40,.7)';
    g.fillRect(x, h / 2 - a, 2, a * 2);
  }
};

/** Beep gate of the Sputnik rhythm: 0.3 s on every 0.6 s since `startedAt` (ms). */
export const sputnikGate = (now: number, startedAt: number, playing: boolean): number =>
  playing ? (((now - startedAt) / 1000) % 0.6 < 0.3 ? 1 : 0.18) : 1;
