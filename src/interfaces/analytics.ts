import type { SignalOrigin } from './signal';

/**
 * Analytics events of the site. Params are closed values only (ids, enums, booleans):
 * never visitor-written text (messages, names, emails).
 */
export type AnalyticsEvent =
  | { name: 'choose_side'; params: { side: 'red' | 'blue' } }
  | { name: 'signal_sent'; params: { origen: SignalOrigin; ok: boolean } }
  | { name: 'walkie_sent'; params: { ok: boolean } }
  | { name: 'post_open'; params: { type: string; id: string } }
  | { name: 'd9_jump'; params?: undefined };

/** Port: records an analytics event (implemented by lib/tracking over GA4). Never throws. */
export interface Analytics {
  track: (event: AnalyticsEvent) => void;
}
