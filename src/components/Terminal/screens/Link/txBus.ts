import { TX_TIMING, type TxLine } from '@/data/terminal/channel';

/**
 * Shared state of the two «Enlace» windows (original globals txAmp + txlog()): the form drives the
 * wave amplitude and writes lines to the transmitter log.
 */
export interface TxBus {
  /** Current wave amplitude (0.25 idle … 0.9 transmitting). */
  amp: () => number;
  setAmp: (v: number) => void;
  /** A keystroke: +0.08 for half a second. */
  bump: () => void;
  /** Appends lines one by one (260 ms apart). Returns a cancel for the lines not yet written. */
  log: (lines: readonly TxLine[]) => () => void;
  subscribe: (fn: (line: TxLine) => void) => () => void;
}

export const TX_AMP = { idle: 0.25, max: 0.9, done: 0.3, step: 0.08, bumpMs: 500 } as const;

export const createTxBus = (): TxBus => {
  let amp: number = TX_AMP.idle;
  const subs = new Set<(line: TxLine) => void>();
  return {
    amp: () => amp,
    setAmp: (v) => {
      amp = v;
    },
    bump: () => {
      amp = Math.min(TX_AMP.max, amp + TX_AMP.step);
      window.setTimeout(() => {
        amp = Math.max(TX_AMP.idle, amp - TX_AMP.step);
      }, TX_AMP.bumpMs);
    },
    log: (lines) => {
      const timers = lines.map((line, k) => window.setTimeout(() => subs.forEach((fn) => fn(line)), k * TX_TIMING.line));
      return () => timers.forEach((t) => window.clearTimeout(t));
    },
    subscribe: (fn) => {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    },
  };
};
