'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { ContextMenuTarget, UseContextMenuResult } from './interface';

/** Clamps the menu inside the viewport, fades it in, focuses the first item and cycles focus with ↑/↓. */
const useContextMenu = (target: ContextMenuTarget, visible: boolean): UseContextMenuResult => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: target.x, top: target.y });
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const r = m.getBoundingClientRect();
    setPos({
      left: Math.min(target.x, window.innerWidth - r.width - 6),
      top: Math.min(target.y, window.innerHeight - r.height - 6),
    });
    m.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus({ preventScroll: true });
  }, [target]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [target]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? []);
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
  }, []);

  return { ref, on: shown && visible, pos, onKeyDown };
};

export default useContextMenu;
