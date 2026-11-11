'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { decodeText } from '@/utils/decodeText';

/**
 * Decodes the row on screen change and keeps keyboard focus on the selected tab when ←/→ change it
 * (the global key handler lives in useTerminal; the original focused the new tab).
 */
const useScreenTabs = (selected: number, screenVersion: number, reduceMotion: boolean): RefObject<HTMLDivElement> => {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => decodeText(ref.current, 600, { reduceMotion }), [screenVersion, reduceMotion]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const row = ref.current;
    const active = document.activeElement;
    if (!row || (active && active !== document.body && !row.contains(active))) return;
    row.querySelector<HTMLElement>('[aria-selected="true"]')?.focus({ preventScroll: true });
  }, [selected]);

  return ref;
};

export default useScreenTabs;
