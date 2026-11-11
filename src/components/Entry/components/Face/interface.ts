import type { RefObject } from 'react';

export interface FaceProps {
  heroRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
}
