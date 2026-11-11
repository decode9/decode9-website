import { useEffect, useRef } from 'react';

/** Focuses the close button when the About opens. */
const useAboutDialog = (open: boolean) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 60);
    return () => clearTimeout(t);
  }, [open]);
  return { closeRef };
};

export default useAboutDialog;
