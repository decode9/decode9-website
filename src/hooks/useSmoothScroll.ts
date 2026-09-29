import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/motion/gsap';
import { startLenis, stopLenis } from '@/lib/motion/lenis';

/** Starts Lenis unless the visitor prefers reduced motion, and keeps ScrollTrigger measurements fresh. */
const useSmoothScroll = (reducedMotion: boolean): void => {
  useEffect(() => {
    // Held still while the preloader is on screen; the preloader starts it on reveal.
    if (!reducedMotion && document.documentElement.dataset.loading !== 'on') startLenis();
    else if (!reducedMotion) startLenis().stop();
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      stopLenis();
    };
  }, [reducedMotion]);
};

export default useSmoothScroll;
