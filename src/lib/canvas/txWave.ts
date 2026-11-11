/*
 * «Enlace» transmitter wave and dial (original initCanal tk). `amp` grows while the visitor types
 * (0.25 idle … 0.9 transmitting).
 */
export const drawTxWave = (canvas: HTMLCanvasElement, t: number, amp: number): void => {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== w) {
    canvas.width = w;
    canvas.height = h;
  }
  const x = canvas.getContext('2d');
  if (!x) return;
  x.clearRect(0, 0, w, h);
  x.strokeStyle = 'rgba(255,90,60,.9)';
  x.lineWidth = 1.5;
  x.shadowColor = 'rgba(255,40,20,.9)';
  x.shadowBlur = 8;
  x.beginPath();
  for (let i = 0; i <= w; i += 3) {
    const y = h / 2 + Math.sin(i * 0.05 + t / 180) * h * amp * Math.sin(i * 0.013 + t / 700) + (Math.random() - 0.5) * 4 * amp;
    if (i) x.lineTo(i, y);
    else x.moveTo(i, y);
  }
  x.stroke();
};

/** How many of the `count` dial bars are lit at time `t`. */
export const dialLit = (count: number, t: number, amp: number): number =>
  Math.round((0.3 + amp) * count * (0.6 + 0.4 * Math.sin(t / 400)));

/** Height (%) of dial bar `k` at time `t`. */
export const dialHeight = (k: number, t: number, amp: number): number => 20 + Math.abs(Math.sin(k * 0.6 + t / 250)) * 80 * amp + 10;
