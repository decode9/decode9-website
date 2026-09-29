import { useEffect, useState } from 'react';
import { useBootSequence, useSceneStore } from '@/context/SceneContext';
import { chapterIds } from '@/data/chapters';
import type { ChapterId } from '@/interfaces';
import useChapterNavigation from '@/hooks/useChapterNavigation';
import type { StageStatus } from '@/lib/scene/createBootSequence';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { getLenis } from '@/lib/motion/lenis';
import type { PreloaderPhase, UsePreloaderReturn } from './interface';

/** The mark needs time to be *seen* assembling, even on a warm cache. */
const MIN_MS = { full: 2200, short: 900 };
/** Never hold a visitor hostage: after this, reveal whatever is ready. */
const MAX_MS = 9000;
/** Solid mark materialises + spark burst, then it glides into place. */
const DECODED_HOLD_MS = 1300;
const LEAVE_MS = 1100;

/**
 * Drives the opening sequence. Real milestones (fonts, page, WebGL runtime, 3D
 * model) set the pace, a minimum duration keeps it from flashing by, and the
 * shown progress feeds the stage so the particles assemble the mark with it.
 */
const usePreloader = (lines: string[]): UsePreloaderReturn => {
  const store = useSceneStore();
  const boot = useBootSequence();
  const navigate = useChapterNavigation();
  const [phase, setPhase] = useState<PreloaderPhase>('loading');
  const [percent, setPercent] = useState(0);
  const [stage, setStage] = useState<StageStatus>('pending');

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.loading !== 'on') {
      store.set({ loading: null });
      boot.reveal();
      setPhase('done');
      return undefined;
    }

    const started = performance.now();
    const minMs = html.dataset.boot === 'short' ? MIN_MS.short : MIN_MS.full;
    const timers: number[] = [];
    let shown = 0;
    let finished = false;

    document.fonts?.ready.then(() => boot.complete('fonts')).catch(() => boot.complete('fonts'));
    const onLoad = () => boot.complete('page');
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    const finish = () => {
      if (finished) return;
      finished = true;
      gsap.ticker.remove(tick);
      setPercent(100);
      setPhase('decoded');
      store.set({ loading: 1 });
      timers.push(
        window.setTimeout(() => {
          store.set({ loading: null });
          delete html.dataset.loading;
          boot.reveal();
          getLenis()?.start();
          setPhase('leaving');
          ScrollTrigger.refresh();
          const hash = window.location.hash.slice(1);
          if (chapterIds.includes(hash as ChapterId) && hash !== 'handshake') navigate(hash as ChapterId);
        }, DECODED_HOLD_MS),
        window.setTimeout(() => setPhase('done'), DECODED_HOLD_MS + LEAVE_MS),
      );
    };

    // Shown progress eases towards the real one, but never faster than the minimum duration allows.
    const tick = () => {
      const elapsed = performance.now() - started;
      const target = Math.min(boot.get().progress, elapsed / minMs);
      shown += (target - shown) * 0.08;
      if (target - shown < 0.004) shown = target;
      setPercent(Math.floor(shown * 100));
      store.set({ loading: Math.min(shown, 0.999) });
      if (shown >= 1) finish();
    };
    gsap.ticker.add(tick);

    const unsubscribe = boot.subscribe((state) => setStage(state.stage));
    setStage(boot.get().stage);
    timers.push(window.setTimeout(finish, MAX_MS));

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('load', onLoad);
      unsubscribe();
      timers.forEach(window.clearTimeout);
    };
  }, [boot, navigate, store]);

  const line = lines[Math.min(lines.length - 1, Math.floor((percent / 100) * lines.length))] ?? '';
  return { phase, percent, line, stage };
};

export default usePreloader;
