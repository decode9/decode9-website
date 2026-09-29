import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let instance: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/**
 * One smooth-scroll instance for the whole site, driven by gsap.ticker so
 * GSAP, Lenis and the WebGL render share a single clock.
 */
export const startLenis = (): Lenis => {
  if (instance) return instance;
  // `gestureOrientation: 'both'` lets horizontal trackpad swipes drive the (horizontal) tour too.
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.09,
    wheelMultiplier: 0.95,
    anchors: false,
    gestureOrientation: 'both',
  });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  instance = lenis;
  return lenis;
};

export const getLenis = (): Lenis | null => instance;

export const stopLenis = (): void => {
  if (tick) gsap.ticker.remove(tick);
  instance?.destroy();
  instance = null;
  tick = null;
};
