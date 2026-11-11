import type { Analytics, AnalyticsEvent } from '@/interfaces/analytics';
import type { SignalGateway } from '@/interfaces/signal';
import type { WalkieGateway } from '@/interfaces/walkie';
import { trackEvent } from './analytics';

type TrackFn = typeof trackEvent;

/** GA4 adapter of the Analytics port. `send` is injectable for tests. */
export const createAnalytics = (send: TrackFn = trackEvent): Analytics => ({
  track: (event: AnalyticsEvent) => {
    try {
      send(event.name, event.params);
    } catch {
      /* analytics must never break the page */
    }
  },
});

/** Shared GA4 instance for the composition roots. */
export const analytics: Analytics = createAnalytics();

/**
 * Decorator: records `signal_sent` {origen, ok} after each send. Only the outcome travels,
 * never the payload; when no API is configured nothing was sent, so nothing is recorded.
 */
export const withSignalTracking = (gateway: SignalGateway, tracker: Analytics): SignalGateway => ({
  send: async (payload) => {
    const result = await gateway.send(payload);
    if (result.error !== 'unavailable') {
      tracker.track({ name: 'signal_sent', params: { origen: payload.origen, ok: result.ok } });
    }
    return result;
  },
});

/** Decorator: records `walkie_sent` {ok} after each send (skipped when no API is configured). */
export const withWalkieTracking = (gateway: WalkieGateway, tracker: Analytics): WalkieGateway => ({
  send: async (payload) => {
    const result = await gateway.send(payload);
    if (result.status !== 'unavailable') {
      tracker.track({ name: 'walkie_sent', params: { ok: result.status === 'ok' } });
    }
    return result;
  },
});
