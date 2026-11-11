import type { CSSProperties, RefObject } from 'react';
import type { WireTarget } from '@/interfaces/terminal';
import type { WireLogo, WireLogoDeps } from '@/lib/canvas/wireLogo';

export interface WireCanvasProps {
  target: WireTarget;
  reduceMotion: boolean;
  /** Side nav: the logo avoids it (its right edge and the bottom of its menu). */
  navRef: RefObject<HTMLElement>;
  create: (deps: WireLogoDeps) => WireLogo;
  style?: CSSProperties;
}
