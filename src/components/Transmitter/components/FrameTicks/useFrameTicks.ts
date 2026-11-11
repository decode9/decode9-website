import { useEffect, useRef, useState } from 'react';
import { buildFrameTicks } from '@/utils/transmitter';
import type { UseFrameTicksReturn } from './interface';

/** Measures the frame and rebuilds the marks whenever it resizes (original drawTicks). */
const useFrameTicks = (): UseFrameTicksReturn => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const measure = () => {
      const { width, height } = svg.getBoundingClientRect();
      setSize((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return {
    svgRef,
    viewBox: size.w ? `0 0 ${size.w} ${size.h}` : undefined,
    paths: buildFrameTicks(size.w, size.h),
  };
};

export default useFrameTicks;
