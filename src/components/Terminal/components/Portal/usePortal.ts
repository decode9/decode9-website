'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TERMINAL_URLS } from '@/data/terminal';
import { shouldUseMobile } from '@/hooks/useDevice';
import { decodeText } from '@/utils/decodeText';
import type { PillReveal, PortalProps } from './interface';

/** Pill hover reveal and red-pill routing (phone → movil/ unless ?escritorio=1). */
const usePortal = ({ reduceMotion, onEnter }: PortalProps) => {
  const [reveal, setReveal] = useState<PillReveal>(null);
  const revRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reveal?.kind === 'r') decodeText(revRef.current, 500, { reduceMotion });
  }, [reduceMotion, reveal]);
  const enterRed = useCallback(() => {
    if (shouldUseMobile()) {
      window.location.href = TERMINAL_URLS.mobileUrl + window.location.hash;
      return;
    }
    onEnter();
  }, [onEnter]);
  return { reveal, setReveal, revRef, enterRed, blueHref: TERMINAL_URLS.jorgeUrl };
};

export default usePortal;
