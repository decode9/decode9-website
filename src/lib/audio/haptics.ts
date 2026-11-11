import type { Vibrate } from '@/interfaces/transmitter';

/** navigator.vibrate when the device supports it; silent no-op otherwise. */
export const vibrate: Vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
};

export default vibrate;
