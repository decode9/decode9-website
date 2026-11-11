'use client';

import { useCallback, useEffect, useRef, type KeyboardEvent, type RefObject } from 'react';
import { decodeText } from '@/utils/decodeText';
import type { UseMainNavResult } from './interface';

/** Boot decode of the menu (original decodeText(.nav, 1100)) and ↑/↓ focus cycling between entries. */
const useMainNav = (navRef: RefObject<HTMLElement>, reduceMotion: boolean): UseMainNavResult => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => decodeText(navRef.current, 1100, { reduceMotion }), [navRef, reduceMotion]);

  const onListKeyDown = useCallback((e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
    next.focus();
  }, []);

  return { listRef, onListKeyDown };
};

export default useMainNav;
