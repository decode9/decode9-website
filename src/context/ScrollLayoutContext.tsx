'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';
import { getLenis } from '@/lib/motion/lenis';
import { horizontalQuery } from '@/lib/motion/tokens';
import { setTrack, type TrackTween } from '@/lib/motion/track';

export type ScrollMode = 'vertical' | 'horizontal';

interface ViewportEntry {
  /** Vertical layout start, e.g. 'top 80%'. */
  vertical?: string;
  /** Horizontal layout start, e.g. 'left 85%'. */
  horizontal?: string;
}

interface ScrollLayoutValue {
  mode: ScrollMode;
  track: TrackTween | null;
  /** ScrollTrigger vars for "when this element comes into view", in either layout. */
  inView: (trigger: Element | null, entry?: ViewportEntry) => ScrollTrigger.Vars;
}

const ScrollLayoutContext = createContext<ScrollLayoutValue | null>(null);

/**
 * Desktop visits travel sideways: `[data-track-viewport]` is pinned and its
 * `[data-track]` slides left as the page scrolls, so wheel, trackpad, keys and
 * scrollbar all keep working. Phones, short screens and reduced motion keep
 * the vertical layout (the CSS mirrors this with the `h:` Tailwind variant).
 */
export const ScrollLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [track, setTrackState] = useState<TrackTween | null>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(horizontalQuery, () => {
      const viewport = document.querySelector<HTMLElement>('[data-track-viewport]');
      const rail = viewport?.querySelector<HTMLElement>('[data-track]');
      if (!viewport || !rail) return undefined;
      const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth);
      const tween = gsap.to(rail, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          id: 'tour-track',
          trigger: viewport,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      setTrack(tween);
      setTrackState(tween);

      // Keyboard users: focusing something off-screen travels the tour to it
      // (the viewport clips overflow, so the browser can't scroll it itself).
      const onFocusIn = (event: FocusEvent) => {
        const target = event.target as HTMLElement | null;
        const trigger = tween.scrollTrigger;
        if (!target || !trigger || !rail.contains(target)) return;
        const { left, right } = target.getBoundingClientRect();
        if (left >= 0 && right <= window.innerWidth) return;
        const offset = left - rail.getBoundingClientRect().left;
        const destination = trigger.start + Math.max(0, offset - window.innerWidth * 0.2);
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(destination, { duration: 0.9 });
        else window.scrollTo({ top: destination });
      };
      viewport.addEventListener('focusin', onFocusIn);

      return () => {
        viewport.removeEventListener('focusin', onFocusIn);
        setTrack(null);
        setTrackState(null);
      };
    });
    return () => media.revert();
  });

  const inView = useCallback(
    (
      trigger: Element | null,
      { vertical = 'top 80%', horizontal = 'left 88%' }: ViewportEntry = {},
    ): ScrollTrigger.Vars =>
      track
        ? { trigger, containerAnimation: track, start: horizontal, once: true }
        : { trigger, start: vertical, once: true },
    [track],
  );

  const value = useMemo<ScrollLayoutValue>(
    () => ({ mode: track ? 'horizontal' : 'vertical', track, inView }),
    [track, inView],
  );

  return <ScrollLayoutContext.Provider value={value}>{children}</ScrollLayoutContext.Provider>;
};

export const useScrollLayout = (): ScrollLayoutValue => {
  const context = useContext(ScrollLayoutContext);
  if (!context) throw new Error('useScrollLayout must be used within a ScrollLayoutProvider');
  return context;
};

export { ScrollTrigger };
