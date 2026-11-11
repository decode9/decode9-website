import type { PickerProps } from './interface';

/**
 * One-shot auto-pick for a list window (original `setTimeout(function(){ACT.x(0)}, 260)` after openWin).
 * The render closure keeps it, so the window restored from the dock does not pick again.
 */
const createAutoPick = (delay: number): (() => PickerProps['auto']) => {
  let pending = true;
  const done = () => {
    pending = false;
  };
  return () => (pending ? { delay, done } : null);
};

export default createAutoPick;
