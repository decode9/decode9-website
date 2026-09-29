import { useEffect, useRef, useState } from 'react';
import { useBootSequence, useSceneStore } from '@/context/SceneContext';
import useQualityTier from '@/hooks/useQualityTier';
import useReducedMotion from '@/hooks/useReducedMotion';
import { trackEvent } from '@/lib/analytics';
import { withBase } from '@/utils/asset';
import type { StageMode, UseStageReturn } from './interface';

type IdleCallback = (callback: () => void, options?: { timeout: number }) => number;

/** Resolves once the page has loaded and the main thread has a quiet moment. */
const afterLoadAndIdle = (): Promise<void> =>
  new Promise((resolve) => {
    const idle: IdleCallback = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 200));
    const schedule = () => idle(() => resolve(), { timeout: 2500 });
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
  });

/**
 * Loads the three.js runtime only when the device and the visitor's settings
 * allow it. While the preloader is up the stage *is* the show, so it starts at
 * once; otherwise it waits for a quiet moment after load.
 */
const useStage = (): UseStageReturn => {
  const store = useSceneStore();
  const boot = useBootSequence();
  const reducedMotion = useReducedMotion();
  const quality = useQualityTier(reducedMotion);
  const hostRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<StageMode>('pending');

  useEffect(() => {
    if (!quality) return undefined;
    const fallback = (reason: string) => {
      setMode('fallback');
      boot.setStage('fallback');
      trackEvent('stage_fallback', { reason });
    };
    if (quality.tier === 'off') {
      fallback(reducedMotion ? 'reduced_motion' : 'capability');
      return undefined;
    }

    let disposed = false;
    let runtime: { dispose: () => void } | null = null;

    const start = async () => {
      const { default: createStageRuntime } = await import('@/lib/three/createStageRuntime');
      if (disposed || !hostRef.current) return;
      runtime = createStageRuntime({
        host: hostRef.current,
        store,
        quality,
        assetUrl: withBase,
        onContextLost: () => fallback('context_lost'),
        onFirstFrame: () => {
          setMode('webgl');
          boot.setStage('webgl');
          boot.complete('stage');
        },
        onModelSettled: () => boot.complete('model'),
      });
    };

    const booting = boot.get().phase === 'loading';
    (booting ? Promise.resolve() : afterLoadAndIdle()).then(start).catch(() => fallback('error'));

    return () => {
      disposed = true;
      runtime?.dispose();
    };
  }, [boot, quality, reducedMotion, store]);

  return { hostRef, mode };
};

export default useStage;
