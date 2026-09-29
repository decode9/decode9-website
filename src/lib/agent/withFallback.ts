import type { AgentErrorKind, ConversationalAgent } from '@/interfaces/agent';
import { errorKindOf } from './errors';

/** Failures that mean "this agent won't work for this visit", as opposed to a transient state to show. */
const FALLBACK_KINDS: ReadonlySet<AgentErrorKind> = new Set<AgentErrorKind>(['unavailable', 'network', 'dailyCap']);

/**
 * Decorator: delegates to `primary` until it fails for good, then switches to
 * `fallback` for the rest of the visit. Rate limits and timeouts are rethrown
 * so the UI can explain them instead of silently changing agents. Only opening
 * and sending can trigger the switch: a background poll hitting a network blip
 * must not downgrade the whole visit.
 */
const withFallback = (
  primary: ConversationalAgent,
  fallback: ConversationalAgent,
  onFallback: (kind: AgentErrorKind) => void = () => undefined,
): ConversationalAgent => {
  let active = primary;

  const run = async <T>(operation: (agent: ConversationalAgent) => Promise<T>, canSwitch = true): Promise<T> => {
    try {
      return await operation(active);
    } catch (error) {
      const kind = errorKindOf(error);
      if (!canSwitch || active !== primary || !FALLBACK_KINDS.has(kind)) throw error;
      active = fallback;
      onFallback(kind);
      return operation(fallback);
    }
  };

  return {
    get capabilities() {
      return active.capabilities;
    },
    open: () => run((agent) => agent.open()),
    send: (text) => run((agent) => agent.send(text)),
    poll: (afterId) => run((agent) => agent.poll(afterId), false),
    identify: (data) => run((agent) => agent.identify(data), false),
  };
};

export default withFallback;
