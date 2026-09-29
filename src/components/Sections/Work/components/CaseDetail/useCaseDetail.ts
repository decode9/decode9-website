import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { getLenis } from '@/lib/motion/lenis';
import { motionQuery } from '@/lib/motion/tokens';

/** Modal behaviour for the case study: pause smooth scroll, trap focus, Escape to close, animated entrance. */
const useCaseDetail = (onClose: () => void) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionQuery, () => {
        gsap.from(dialogRef.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.out' });
        gsap.from('[data-detail-in]', {
          y: 18,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.06,
          delay: 0.2,
        });
      });
      return () => media.revert();
    },
    { scope: dialogRef },
  );

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>('button')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button'));
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      lenis?.start();
      previous?.focus();
    };
  }, [onClose]);

  return dialogRef;
};

export default useCaseDetail;
