import type { RefObject } from 'react';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { duration, ease, motionQuery, stagger } from '@/lib/motion/tokens';

interface UseRevealOptions {
  /** Selector of the elements to reveal inside the scope. */
  selector?: string;
  vertical?: string;
  horizontal?: string;
}

/**
 * Reveals `[data-reveal]` descendants as they come into view — scrolling down
 * or travelling sideways. Content is visible in the exported HTML; the hidden
 * start state only exists in the browser and never under reduced motion.
 */
const useReveal = (
  scope: RefObject<HTMLElement>,
  { selector = '[data-reveal]', vertical = 'top 78%', horizontal = 'left 85%' }: UseRevealOptions = {},
) => {
  const { inView, mode } = useScrollLayout();

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionQuery, () => {
        const targets = gsap.utils.toArray<HTMLElement>(selector, scope.current);
        if (targets.length === 0) return;
        const axis = mode === 'horizontal' ? 'x' : 'y';
        // Explicit end values: a `from` tween would read the end state from computed styles,
        // which a CSS transition (or a previous reveal being reverted) can leave mid-way.
        gsap.fromTo(
          targets,
          { [axis]: mode === 'horizontal' ? 48 : 28, autoAlpha: 0 },
          {
            [axis]: 0,
            autoAlpha: 1,
            duration: duration.slow,
            ease: ease.reveal,
            stagger: stagger.item,
            scrollTrigger: inView(scope.current, { vertical, horizontal }),
          },
        );
      });
      return () => media.revert();
    },
    { scope, dependencies: [inView, mode], revertOnUpdate: true },
  );
};

export default useReveal;
