import qrcode from 'qrcode-generator';

/*
 * Styled QR of the terminal transmitter (original d9QR): cream plate, rounded dark-red modules with a
 * sprinkle of bright red, chamfered finder patterns and the decode9 emblem in a cleared centre.
 */
const COLORS = { plate: '#ffe6d8', dot: '#5a0806', accent: '#d3161e', ink: '#1a0202' } as const;
/** Quiet zone in modules. */
const QUIET = 3;
/** Size of the cleared centre as a fraction of the module count. */
const CENTER = 0.24;
/** Emblem aspect (viewBox 1024×1137). */
const LOGO_ASPECT = 1137 / 1024;

/** Module positions that belong to the three finder patterns (drawn apart). */
export const inFinder = (r: number, c: number, n: number): boolean =>
  (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);

/** First module and size of the cleared centre where the emblem goes. */
export const centerBox = (n: number): { c0: number; cs: number } => {
  const cs = Math.ceil(n * CENTER);
  return { c0: Math.floor((n - cs) / 2), cs };
};

/** True when the module falls in the cleared centre (one module of margin). */
export const inCenter = (r: number, c: number, n: number): boolean => {
  const { c0, cs } = centerBox(n);
  return r >= c0 - 1 && r < c0 + cs + 1 && c >= c0 - 1 && c < c0 + cs + 1;
};

/** Deterministic accent sprinkle of the original ((r*7 + c*13) % 9 === 0). */
export const isAccent = (r: number, c: number): boolean => (r * 7 + c * 13) % 9 === 0;

const roundRect = (g: CanvasRenderingContext2D, x: number, y: number, s: number, rad: number) => {
  g.beginPath();
  g.moveTo(x + rad, y);
  g.arcTo(x + s, y, x + s, y + s, rad);
  g.arcTo(x + s, y + s, x, y + s, rad);
  g.arcTo(x, y + s, x, y, rad);
  g.arcTo(x, y, x + s, y, rad);
  g.closePath();
  g.fill();
};

const chamfer = (g: CanvasRenderingContext2D, x: number, y: number, s: number, k: number, col: string) => {
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(x + k, y);
  g.lineTo(x + s, y);
  g.lineTo(x + s, y + s - k);
  g.lineTo(x + s - k, y + s);
  g.lineTo(x, y + s);
  g.lineTo(x, y + k);
  g.closePath();
  g.fill();
};

/**
 * Draws `text` as the styled QR (error correction H) over the whole canvas. `logoSvg` is standalone SVG
 * markup (with xmlns) painted in the centre once it loads. Returns false when nothing could be drawn.
 */
export const drawStyledQr = (canvas: HTMLCanvasElement, text: string, logoSvg?: string): boolean => {
  const g = canvas.getContext('2d');
  if (!g) return false;
  let q: ReturnType<typeof qrcode>;
  try {
    q = qrcode(0, 'H');
    q.addData(text);
    q.make();
  } catch {
    return false;
  }
  const n = q.getModuleCount();
  const S = canvas.width;
  const m = S / (n + QUIET * 2);
  g.fillStyle = COLORS.plate;
  g.fillRect(0, 0, S, S);

  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (!q.isDark(r, c) || inFinder(r, c, n) || inCenter(r, c, n)) continue;
      g.fillStyle = isAccent(r, c) ? COLORS.accent : COLORS.dot;
      roundRect(g, (c + QUIET) * m + m * 0.08, (r + QUIET) * m + m * 0.08, m * 0.84, m * 0.28);
    }
  }
  [
    [0, 0],
    [0, n - 7],
    [n - 7, 0],
  ].forEach(([pr, pc]) => {
    const x = (pc + QUIET) * m;
    const y = (pr + QUIET) * m;
    chamfer(g, x, y, 7 * m, m * 1.6, COLORS.ink);
    chamfer(g, x + m, y + m, 5 * m, m * 1.1, COLORS.plate);
    chamfer(g, x + 2 * m, y + 2 * m, 3 * m, m * 0.8, COLORS.accent);
  });

  const { c0, cs } = centerBox(n);
  const px = (c0 + QUIET) * m;
  const pw = cs * m;
  chamfer(g, px - m * 0.6, px - m * 0.6, pw + m * 1.2, m * 1.4, COLORS.ink);
  chamfer(g, px, px, pw, m * 1.1, COLORS.plate);

  if (logoSvg && typeof Image !== 'undefined') {
    const im = new Image();
    im.onload = () => {
      const lw = pw * 0.74;
      const lh = lw * LOGO_ASPECT;
      g.drawImage(im, px + (pw - lw) / 2, px + (pw - lh) / 2, lw, lh);
    };
    im.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg)}`;
  }
  return true;
};
