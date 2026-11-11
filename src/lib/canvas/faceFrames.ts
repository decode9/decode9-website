/**
 * Face of Jorge drawn on a canvas: every frame is decoded up front, so a frame change is a
 * single drawImage with no flicker. Factory with dispose(), no React.
 */
import { headOffset } from './entryMotion';

type Drawable = ImageBitmap | HTMLImageElement;

export interface FaceFramesOptions {
  /** URL of every frame, in sequence order. */
  urls: readonly string[];
  /** Head x position (0–1 of the width) of each frame, used to recentre on phones. */
  headX: readonly number[];
}

export interface FaceFrames {
  /** Decodes every frame; onFrame runs once per frame (loaded or failed). */
  load: (onFrame: () => void) => Promise<void>;
  /** Binds the canvas to draw on. */
  attach: (canvas: HTMLCanvasElement) => void;
  /** Resizes the backing store to the element box (dpr capped at 2) and redraws. */
  fit: (width: number, height: number, dpr: number) => void;
  /** Draws frame i; `centred` shifts it so the head stays in the middle (phones). */
  show: (index: number, centred: boolean) => void;
  /** Frame on screen, -1 before the first draw. */
  current: () => number;
  dispose: () => void;
}

const decodeFrame = async (url: string): Promise<Drawable> => {
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  try {
    await img.decode();
  } catch {
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  }
  try {
    return await createImageBitmap(img);
  } catch {
    return img;
  }
};

export const createFaceFrames = ({ urls, headX }: FaceFramesOptions): FaceFrames => {
  const bitmaps: (Drawable | undefined)[] = new Array(urls.length);
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let cur = -1;
  let centredMode = false;
  let disposed = false;

  const show = (index: number, centred: boolean) => {
    if (!ctx || !canvas) return;
    if (index === cur && centred === centredMode) return;
    const bmp = bitmaps[index];
    if (!bmp) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dx = centred ? headOffset(headX[index] ?? 0.5, canvas.width) : 0;
    ctx.drawImage(bmp, dx, 0, canvas.width, canvas.height);
    cur = index;
    centredMode = centred;
  };

  return {
    load: (onFrame) =>
      Promise.all(
        urls.map(async (url, i) => {
          const bmp = await decodeFrame(url);
          if (!disposed) bitmaps[i] = bmp;
          onFrame();
        }),
      ).then(() => undefined),
    attach: (el) => {
      canvas = el;
      ctx = el.getContext('2d');
    },
    fit: (width, height, dpr) => {
      if (!canvas) return;
      const d = Math.min(2, dpr || 1);
      canvas.width = Math.round(width * d);
      canvas.height = Math.round(height * d);
      const c = cur;
      cur = -1;
      if (c >= 0) show(c, centredMode);
    },
    show,
    current: () => cur,
    dispose: () => {
      disposed = true;
      bitmaps.forEach((b) => {
        if (b && 'close' in b) b.close();
      });
      bitmaps.fill(undefined);
      canvas = null;
      ctx = null;
    },
  };
};
