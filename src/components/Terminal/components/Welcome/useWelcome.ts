'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SEAL_COUNT, SEAL_GLYPHS } from '@/data/terminal';
import { decodeText } from '@/utils/decodeText';
import type { SealState, WelcomeProps } from './interface';

export const SEALS: readonly string[] = Array.from({ length: SEAL_COUNT }, (_, k) => [...SEAL_GLYPHS][k % [...SEAL_GLYPHS].length]);

/** Seals are deciphered one by one (190 ms); then Continue, Escape or a click outside closes (original showWelcome). */
const useWelcome = ({ reduceMotion, onClose }: WelcomeProps) => {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const ready = step > SEAL_COUNT;

  useEffect(() => {
    decodeText(titleRef.current, 700, { reduceMotion });
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setStep(i);
      if (i > SEAL_COUNT) window.clearInterval(id);
    }, reduceMotion ? 20 : 190);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (ready) goRef.current?.focus();
  }, [ready]);

  const start = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onClose, reduceMotion ? 0 : 300);
  }, [leaving, onClose, reduceMotion]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && ready) {
        e.preventDefault();
        start();
      }
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [ready, start]);

  /** Seal k is "on" while it is the latest one, "done" after. */
  const sealState = (k: number): SealState => (k < step - 1 ? 'done' : k === step - 1 ? 'on' : '');

  return { ready, leaving, start, sealState, titleRef, goRef };
};

export default useWelcome;
