'use client';

import { useState } from 'react';

/**
 * How the visitor points, read synchronously on the first client render (so rAF loops and
 * effects do not restart when it arrives). Complements useDevice (phone/desktop routing).
 *  - isTouch:       touch-first device: coarse pointer without a fine one, or a mobile UA with touch points.
 *  - canAim:        a real mouse ((hover:hover) and (pointer:fine)): custom cursors allowed.
 *  - reducedMotion: prefers-reduced-motion: reduce.
 */
export interface InputMode {
  isTouch: boolean;
  canAim: boolean;
  reducedMotion: boolean;
}

export interface InputEnv {
  matches: (query: string) => boolean;
  userAgent: string;
  maxTouchPoints: number;
}

const SERVER_MODE: InputMode = { isTouch: false, canAim: false, reducedMotion: false };

export const detectInputMode = ({ matches, userAgent, maxTouchPoints }: InputEnv): InputMode => {
  const safe = (q: string) => {
    try {
      return matches(q);
    } catch {
      return false;
    }
  };
  return {
    isTouch:
      (safe('(any-pointer: coarse)') && !safe('(pointer: fine)')) ||
      (maxTouchPoints > 0 && /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)),
    canAim: safe('(hover:hover) and (pointer:fine)'),
    reducedMotion: safe('(prefers-reduced-motion: reduce)'),
  };
};

const useInputMode = (): InputMode => {
  const [mode] = useState<InputMode>(() =>
    typeof window === 'undefined'
      ? SERVER_MODE
      : detectInputMode({
          matches: (q) => window.matchMedia(q).matches,
          userAgent: navigator.userAgent || '',
          maxTouchPoints: navigator.maxTouchPoints || 0,
        }),
  );
  return mode;
};

export default useInputMode;
