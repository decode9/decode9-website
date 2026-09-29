import { useRef } from 'react';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import useReveal from '@/hooks/useReveal';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { ease, motionQuery } from '@/lib/motion/tokens';

/** On the horizontal tour the line draws and each step lights up as the panel crosses the screen. */
const useProcess = () => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const { track } = useScrollLayout();
  useReveal(stepsRef);

  useGSAP(
    () => {
      if (!track) return undefined;
      const media = gsap.matchMedia();
      media.add(motionQuery, () => {
        const steps = gsap.utils.toArray<HTMLElement>('[data-step]');
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stepsRef.current,
            containerAnimation: track,
            start: 'left 75%',
            end: 'right 70%',
            scrub: 0.6,
          },
        });
        timeline.fromTo('[data-process-line]', { drawSVG: '0%' }, { drawSVG: '100%', duration: steps.length });
        steps.forEach((step, index) => {
          timeline.fromTo(
            step.querySelector('[data-step-badge]'),
            { backgroundColor: '#18191C', color: '#7E8290', borderColor: 'rgba(255,255,255,0.16)' },
            { backgroundColor: '#E5121B', color: '#FFFFFF', borderColor: '#E5121B', duration: 0.3, ease: ease.soft },
            index + 0.2,
          );
        });
      });
      return () => media.revert();
    },
    { scope: scopeRef, dependencies: [track], revertOnUpdate: true },
  );

  return { scopeRef, stepsRef };
};

export default useProcess;
