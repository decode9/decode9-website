import { useCallback } from 'react';
import type { ChapterId } from '@/interfaces';
import { ScrollTrigger } from '@/lib/motion/gsap';
import { getLenis } from '@/lib/motion/lenis';
import { getTrack } from '@/lib/motion/track';

export const chapterTriggerId = (id: ChapterId): string => `chapter-${id}`;

/**
 * Scroll position that brings a chapter to the start of the viewport. On the
 * horizontal tour, scroll maps 1:1 to the track's x, so it is the track's
 * start plus the panel's offset; vertically it uses the chapter trigger (which
 * accounts for pin spacers).
 */
const chapterScroll = (id: ChapterId): number | null => {
  const element = document.getElementById(id);
  if (!element) return null;
  const track = getTrack()?.scrollTrigger;
  if (track) return track.start + element.offsetLeft;
  const trigger = ScrollTrigger.getById(chapterTriggerId(id));
  if (trigger) return trigger.start + window.innerHeight * 0.5;
  return element.getBoundingClientRect().top + window.scrollY;
};

const useChapterNavigation = (): ((id: ChapterId) => void) =>
  useCallback((id: ChapterId) => {
    const target = chapterScroll(id);
    if (target === null) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(Math.max(0, target), { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, target), behavior: reduced ? 'auto' : 'smooth' });
  }, []);

export default useChapterNavigation;
