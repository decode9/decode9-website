import { useEffect, useRef, useState } from 'react';
import type { GuideConsoleState, StatusCopy, UseGuideConsoleReturn } from './interface';

/** Focus the composer on open, close on Escape, trap focus while the mobile sheet is modal. */
const useGuideConsole = (
  { isOpen, close, live, status, cooldownUntil }: GuideConsoleState,
  statusCopy: StatusCopy,
): UseGuideConsoleReturn => {
  const panelRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => composerRef.current?.focus({ preventScroll: true }), 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (!isMobile || event.key !== 'Tab') return;
      const items = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input') ?? [],
      );
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
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      if (isMobile) previous?.focus();
    };
  }, [isOpen, isMobile, close]);

  const thinking = status === 'thinking';
  const cooling = cooldownUntil !== null && cooldownUntil > Date.now();
  const statusLabel = live ? statusCopy[status === 'idle' ? 'ready' : status] : statusCopy.offline;

  return { panelRef, composerRef, isMobile, statusLabel, thinking, cooling };
};

export default useGuideConsole;
