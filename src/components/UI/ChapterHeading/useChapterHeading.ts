import { useRef } from 'react';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import { gsap, SplitText, useGSAP } from '@/lib/motion/gsap';
import { duration, ease, motionQuery, stagger } from '@/lib/motion/tokens';

/** Title lines rise out of masks, then the subtitle settles in. */
const useChapterHeading = () => {
  const ref = useRef<HTMLElement>(null);
  const { inView } = useScrollLayout();

  useGSAP(
    () => {
      const root = ref.current;
      const title = root?.querySelector<HTMLElement>('[data-heading-title]');
      if (!root || !title) return undefined;
      const media = gsap.matchMedia();
      media.add(motionQuery, () => {
        const trigger = inView(root, { vertical: 'top 82%', horizontal: 'left 85%' });
        const split = SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'd9-split-line',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: duration.slow,
              ease: ease.reveal,
              stagger: stagger.line,
              scrollTrigger: trigger,
            }),
        });
        const sub = root.querySelector('[data-heading-sub]');
        if (!sub) return () => split.revert();
        gsap.from(sub, {
          autoAlpha: 0,
          y: 16,
          duration: duration.slow,
          ease: ease.reveal,
          delay: 0.25,
          scrollTrigger: trigger,
        });
        return () => split.revert();
      });
      return () => media.revert();
    },
    { scope: ref, dependencies: [inView], revertOnUpdate: true },
  );

  return ref;
};

export default useChapterHeading;
