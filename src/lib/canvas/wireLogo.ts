import type { LogoPolygons, WireTarget } from '@/interfaces/terminal';

export interface WireLogoDeps {
  canvas: HTMLCanvasElement;
  polygons: LogoPolygons;
  depth: number;
  reduceMotion: boolean;
  initial: WireTarget;
  /**
   * Obstacles the logo must not cover: on desktop the right edge of the side nav and the bottom of
   * the menu; on mobile only the bottom of the menu. Return null when not mounted yet.
   */
  getObstacles: () => { desktop: boolean; navRight: number; menuBottom: number } | null;
}

export interface WireLogo {
  setTarget: (target: WireTarget) => void;
  dispose: () => void;
}

const COLORS: ReadonlyArray<['r' | 'g', string]> = [
  ['r', '255,70,40'],
  ['g', '215,205,215'],
];

/** Extruded decode9 logo in wireframe that sways and glides to each screen's target (original draw()). */
export const createWireLogo = ({ canvas, polygons, depth, reduceMotion, initial, getObstacles }: WireLogoDeps): WireLogo => {
  const cx = canvas.getContext('2d');
  const wp = { ...initial };
  let target = { ...initial };
  let raf = 0;
  let disposed = false;

  const draw = (t: number) => {
    if (disposed || !cx) return;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== W * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, W, H);
    wp.x += (target.x - wp.x) * 0.04;
    wp.y += (target.y - wp.y) * 0.04;
    wp.s += (target.s - wp.s) * 0.04;

    const unit = (Math.min(W, H) / 1500) * wp.s;
    const halfW = 512 * unit;
    const halfH = 568 * unit;
    const obs = getObstacles();
    if (obs?.desktop) {
      const nr = obs.navRight + 24;
      const lb = obs.menuBottom + 14;
      if (H * wp.y - halfH < lb && W * wp.x - halfW < nr) wp.x += ((nr + halfW) / W - wp.x) * 0.2;
    } else if (obs) {
      const lb = obs.menuBottom + 10;
      if (H * wp.y - halfH < lb) wp.y += ((lb + halfH) / H - wp.y) * 0.2;
    }

    const ang = reduceMotion ? 0.5 : Math.sin(t / 3200) * 0.75 + 0.2;
    const tilt = 0.14 + Math.sin(t / 4100) * 0.08;
    const sc = (Math.min(W, H) / 1500) * wp.s;
    const ox = W * wp.x;
    const oy = H * wp.y;
    const p3 = (px: number, py: number, pz: number): [number, number] => {
      const x = px - 512;
      const y = py - 568;
      const z = pz - depth / 2;
      const X = x * Math.cos(ang) + z * Math.sin(ang);
      let Z = -x * Math.sin(ang) + z * Math.cos(ang);
      const Y = y * Math.cos(tilt) - Z * Math.sin(tilt);
      Z = y * Math.sin(tilt) + Z * Math.cos(tilt);
      const f = 1600 / (1600 + Z);
      return [ox + X * sc * f, oy + Y * sc * f];
    };

    cx.lineWidth = 1.3;
    cx.shadowBlur = 12;
    COLORS.forEach(([group, col]) => {
      cx.shadowColor = `rgba(${col},.8)`;
      polygons[group].forEach((poly) => {
        [0, depth].forEach((z, zi) => {
          cx.strokeStyle = `rgba(${col},${zi ? 0.45 : 0.9})`;
          cx.beginPath();
          poly.forEach(([px, py], i) => {
            const [qx, qy] = p3(px, py, z);
            if (i) cx.lineTo(qx, qy);
            else cx.moveTo(qx, qy);
          });
          cx.closePath();
          cx.stroke();
        });
        cx.strokeStyle = `rgba(${col},.4)`;
        cx.beginPath();
        poly.forEach(([px, py]) => {
          const a = p3(px, py, 0);
          const b = p3(px, py, depth);
          cx.moveTo(a[0], a[1]);
          cx.lineTo(b[0], b[1]);
        });
        cx.stroke();
      });
    });
    cx.shadowBlur = 0;
    if (!reduceMotion) raf = requestAnimationFrame(draw);
  };

  raf = requestAnimationFrame(draw);

  return {
    setTarget: (next) => {
      target = { ...next };
      if (reduceMotion) raf = requestAnimationFrame(draw);
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
    },
  };
};
