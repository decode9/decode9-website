'use client';

import { useEffect, useRef } from 'react';

/** Selector of the elements that lock the crosshair (the two CTAs). */
const LOCK_SELECTOR = '[data-cta]';

/** Moves the crosshair with the mouse; locks over the CTAs and "fires" on press. */
const useAimCursor = (enabled: boolean, onAimingChange: (aiming: boolean) => void, lockClass: string, fireClass: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const notify = useRef(onAimingChange);
  notify.current = onAimingChange;

  useEffect(() => {
    const aim = ref.current;
    if (!enabled || !aim) return undefined;
    let aiming = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!aiming) {
        aiming = true;
        notify.current(true);
      }
      aim.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      const target = e.target as Element | null;
      aim.classList.toggle(lockClass, !!target?.closest?.(LOCK_SELECTOR));
    };
    const onDown = () => {
      aim.classList.remove(fireClass);
      void aim.offsetWidth; // restart the animation
      aim.classList.add(fireClass);
    };
    const onLeave = () => {
      aim.style.opacity = '0';
    };
    const onEnter = () => {
      aim.style.opacity = '';
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled, lockClass, fireClass]);

  return ref;
};

export default useAimCursor;
