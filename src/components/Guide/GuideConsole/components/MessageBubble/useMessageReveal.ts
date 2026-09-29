import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { motionQuery } from '@/lib/motion/tokens';

const useMessageReveal = (animate: boolean) => {
  const ref = useRef<HTMLLIElement>(null);

  useGSAP(
    () => {
      if (!animate || !ref.current) return undefined;
      const media = gsap.matchMedia();
      media.add(motionQuery, () => {
        gsap.from(ref.current, { y: 12, autoAlpha: 0, duration: 0.5, ease: 'expo.out' });
      });
      return () => media.revert();
    },
    { scope: ref },
  );

  return ref;
};

export default useMessageReveal;
