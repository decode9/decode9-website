import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useChannel } from '../Channel/context';

/** Draws the seekable track of `media` every frame while `active`; a click seeks. */
const useMediaTrack = (media: HTMLMediaElement, active: boolean) => {
  const { deps } = useChannel();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return undefined;
    let raf = 0;
    const frame = (t: number) => {
      const canvas = canvasRef.current;
      if (canvas) deps.drawTrack(canvas, media.duration ? media.currentTime / media.duration : 0, t, !media.paused);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, media, deps]);

  const onSeek = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (media.duration) media.currentTime = ((e.clientX - r.left) / r.width) * media.duration;
  }, [media]);

  return { canvasRef, onSeek };
};

export default useMediaTrack;
