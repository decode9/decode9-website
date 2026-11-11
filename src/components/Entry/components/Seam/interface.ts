import type { RefObject } from 'react';

export interface SeamProps {
  lineRef: RefObject<SVGLineElement>;
  glowRef: RefObject<SVGLineElement>;
}
