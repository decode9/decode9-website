import type { RefObject } from 'react';

export interface UseFrameTicksReturn {
  svgRef: RefObject<SVGSVGElement>;
  viewBox: string | undefined;
  paths: string[];
}
