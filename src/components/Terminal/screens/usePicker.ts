'use client';

import { useEffect, useRef, useState } from 'react';

/** Picks the first item automatically this many ms after the list window opens (original setTimeout(ACT.x(0), 260)). */
export interface AutoPick<T> {
  value: T;
  delay: number;
  /** Called once fired, so a list restored from the dock does not pick again. */
  done: () => void;
}

/**
 * Selection of a list window (original selIn + data-act): `pick` marks the item and calls `onPick`.
 * The optional auto-pick is tied to the window life-cycle, so it never fires after leaving the screen.
 */
const usePicker = <T>(initial: T, onPick: (value: T) => void, auto?: AutoPick<T> | null) => {
  const [selected, setSelected] = useState<T>(initial);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    if (!auto) return undefined;
    const timer = window.setTimeout(() => {
      auto.done();
      setSelected(auto.value);
      onPickRef.current(auto.value);
    }, auto.delay);
    return () => window.clearTimeout(timer);
    // Runs once per window mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (value: T) => {
    setSelected(value);
    onPickRef.current(value);
  };

  return { selected, pick };
};

export default usePicker;
