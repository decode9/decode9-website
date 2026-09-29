import { useRef } from 'react';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { motionQuery, scrambleChars } from '@/lib/motion/tokens';
import type { UseScrambleTextOptions } from './interface';

/** "Decodes" the text in place: glyph noise resolving left to right. The real text is in the HTML from the start. */
const useScrambleText = ({ text, trigger, delay, duration }: UseScrambleTextOptions) => {
  const ref = useRef<HTMLElement>(null);
  const { inView } = useScrollLayout();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return undefined;
      const media = gsap.matchMedia();
      media.add(motionQuery, () => {
        gsap.to(element, {
          duration,
          delay,
          ease: 'none',
          scrambleText: { text, chars: scrambleChars, revealDelay: duration * 0.35, speed: 0.55 },
          scrollTrigger:
            trigger === 'view' ? inView(element, { vertical: 'top 90%', horizontal: 'left 92%' }) : undefined,
        });
      });
      return () => media.revert();
    },
    { dependencies: [text, trigger, delay, duration, inView], scope: ref, revertOnUpdate: true },
  );

  return ref;
};

export default useScrambleText;
