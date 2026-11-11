'use client';

import { useEffect, useRef } from 'react';
import { LOGO_DEPTH, LOGO_POLYGONS } from '@/data/terminal';
import type { WireLogo } from '@/lib/canvas/wireLogo';
import type { WireCanvasProps } from './interface';

/** Mounts the wire logo on the canvas and glides it to each screen's target. */
const useWireCanvas = ({ target, reduceMotion, navRef, create }: WireCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logo = useRef<WireLogo | null>(null);
  const first = useRef(target);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    logo.current = create({
      canvas,
      polygons: LOGO_POLYGONS,
      depth: LOGO_DEPTH,
      reduceMotion,
      initial: first.current,
      getObstacles: () => {
        const nav = navRef.current;
        if (!nav) return null;
        const menu = nav.querySelector('ul') ?? nav;
        return {
          desktop: window.innerWidth > 900,
          navRight: nav.getBoundingClientRect().right,
          menuBottom: menu.getBoundingClientRect().bottom,
        };
      },
    });
    return () => {
      logo.current?.dispose();
      logo.current = null;
    };
  }, [create, navRef, reduceMotion]);

  useEffect(() => {
    logo.current?.setTarget(target);
  }, [target]);

  return { canvasRef };
};

export default useWireCanvas;
