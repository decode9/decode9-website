import { useEffect, useRef } from 'react';
import type { ChapterId } from '@/interfaces';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import { ScrollTrigger } from '@/lib/motion/gsap';
import { chapterTriggerId } from './useChapterNavigation';

/**
 * One ScrollTrigger per chapter section (`<section id={chapterId}>`): a chapter
 * is active while it crosses the middle of the viewport — vertically, or
 * horizontally along the tour track. After every measurement pass the active
 * chapter is re-derived from positions, so a stale toggle fired while the
 * layout was still settling can't win.
 */
const useChapterTriggers = (ids: ChapterId[], onEnter: (id: ChapterId) => void): void => {
  const callback = useRef(onEnter);
  callback.current = onEnter;
  const { track } = useScrollLayout();

  useEffect(() => {
    const entries = ids.flatMap((id) => {
      const element = document.getElementById(id);
      if (!element) return [];
      const range = track
        ? { containerAnimation: track, start: 'left center', end: 'right center' }
        : { start: 'top center', end: 'bottom center' };
      const trigger = ScrollTrigger.create({
        id: chapterTriggerId(id),
        trigger: element,
        ...range,
        onToggle: (self) => {
          if (self.isActive) callback.current(id);
        },
      });
      return [{ id, trigger }];
    });

    const sync = () => {
      const current = entries.find(({ trigger }) => trigger.isActive) ?? entries[0];
      if (current) callback.current(current.id);
    };
    ScrollTrigger.addEventListener('refresh', sync);
    sync();

    return () => {
      ScrollTrigger.removeEventListener('refresh', sync);
      entries.forEach(({ trigger }) => trigger.kill());
    };
  }, [ids, track]);
};

export default useChapterTriggers;
