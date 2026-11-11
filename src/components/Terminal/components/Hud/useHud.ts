'use client';

import { useEffect, useState } from 'react';
import { HUD_SIGNAL } from '@/data/terminal';

const FULL = Array.from({ length: HUD_SIGNAL.bars }, () => 1);

/** Signal bars flicker every second (original setInterval of the live top bar); still under reduced motion. */
const useHud = (reduceMotion: boolean): number[] => {
  const [signal, setSignal] = useState<number[]>(FULL);
  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setSignal(FULL.map((_, i) => (Math.random() < 0.8 || i < 3 ? 1 : 0.25)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);
  return signal;
};

export default useHud;
