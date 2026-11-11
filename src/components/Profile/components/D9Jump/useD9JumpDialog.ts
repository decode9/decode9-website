import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';

/** Focus on "Sí" when asked; Escape answers no; Tab cycles between the two buttons. */
const useD9JumpDialog = (asking: boolean, onAnswer: (go: boolean) => void) => {
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!asking) return undefined;
    const t = setTimeout(() => yesRef.current?.focus({ preventScroll: true }), 60);
    return () => clearTimeout(t);
  }, [asking]);
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onAnswer(false);
      }
      if (e.key === 'Tab') {
        const f = [yesRef.current, noRef.current];
        const i = f.indexOf(document.activeElement as HTMLButtonElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + 2) % 2]?.focus();
      }
    },
    [onAnswer],
  );
  return { yesRef, noRef, onKeyDown };
};

export default useD9JumpDialog;
