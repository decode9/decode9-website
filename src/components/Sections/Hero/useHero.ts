import { useCallback, useRef } from 'react';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import useBootPhase from '@/hooks/useBootPhase';
import useChapterNavigation from '@/hooks/useChapterNavigation';
import { trackEvent } from '@/lib/analytics';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { duration, ease, motionQuery, stagger } from '@/lib/motion/tokens';

/**
 * Entrance when the preloader hands over (the H1 stays put) and an exit that
 * follows the tour: up when scrolling down, aside when travelling sideways.
 */
const useHero = () => {
  const ref = useRef<HTMLElement>(null);
  const navigate = useChapterNavigation();
  const revealed = useBootPhase() === 'revealed';
  const { track } = useScrollLayout();

  useGSAP(
    () => {
      if (!revealed) return undefined;
      const media = gsap.matchMedia();
      media.add(motionQuery, () => {
        gsap.from('[data-hero-in]', {
          y: 22,
          autoAlpha: 0,
          duration: duration.slow,
          ease: ease.reveal,
          stagger: stagger.item,
          delay: 0.45,
        });
        gsap.to('[data-hero-content]', {
          ...(track ? { xPercent: -14 } : { yPercent: -18 }),
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: track
            ? { trigger: ref.current, containerAnimation: track, start: 'left left', end: 'right 35%', scrub: true }
            : { trigger: ref.current, start: 'top top', end: 'bottom 20%', scrub: true },
        });
      });
      return () => media.revert();
    },
    { scope: ref, dependencies: [revealed, track], revertOnUpdate: true },
  );

  const startTour = useCallback(() => {
    trackEvent('cta_click', { location: 'hero', label: 'take_tour' });
    navigate('origin');
  }, [navigate]);

  const workWithMe = useCallback(() => trackEvent('cta_click', { location: 'hero', label: 'start_project' }), []);

  return { ref, startTour, workWithMe };
};

export default useHero;
