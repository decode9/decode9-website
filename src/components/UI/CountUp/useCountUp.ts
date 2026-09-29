import { useRef } from 'react';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { motionQuery } from '@/lib/motion/tokens';

/** Counts from 0 when scrolled into view; the final number is what the HTML ships. */
const useCountUp = (value: number, suffix: string) => {
  const ref = useRef<HTMLSpanElement>(null);
  const { inView } = useScrollLayout();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return undefined;
      const media = gsap.matchMedia();
      media.add(motionQuery, () => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: inView(element, { vertical: 'top 88%', horizontal: 'left 90%' }),
          onUpdate: () => {
            element.textContent = `${Math.round(counter.value)}${suffix}`;
          },
        });
      });
      return () => media.revert();
    },
    { dependencies: [value, suffix, inView], scope: ref, revertOnUpdate: true },
  );

  return ref;
};

export default useCountUp;
