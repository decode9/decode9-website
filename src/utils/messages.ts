import type { AgentMessage } from '@/interfaces/agent';

/**
 * Merges messages by id: known ids are updated in place, new ones are appended
 * (or prepended, for history loaded after the transcript already started).
 * Never trusts the backend to send only new messages — Solvo returns the full
 * window when it doesn't recognise the cursor.
 */
export const mergeMessages = (
  current: AgentMessage[],
  incoming: AgentMessage[],
  position: 'append' | 'prepend' = 'append',
): AgentMessage[] => {
  const incomingById = new Map(incoming.map((message) => [message.id, message]));
  const knownIds = new Set(current.map((message) => message.id));
  const updated = current.map((message) => incomingById.get(message.id) ?? message);
  const fresh = incoming.filter(
    (message, index) => !knownIds.has(message.id) && incoming.findIndex((other) => other.id === message.id) === index,
  );
  return position === 'append' ? [...updated, ...fresh] : [...fresh, ...updated];
};

/** Drops optimistic visitor messages once the backend has confirmed the real ones. */
export const withoutPending = (messages: AgentMessage[]): AgentMessage[] =>
  messages.filter((message) => !message.pending);

export const lastIdFrom = (
  messages: AgentMessage[],
  roles: AgentMessage['role'][] = ['visitor', 'agent'],
): string | null =>
  [...messages].reverse().find((message) => roles.includes(message.role) && !message.pending)?.id ?? null;

export type TranscriptAction =
  | { type: 'append'; messages: AgentMessage[] }
  | { type: 'merge'; messages: AgentMessage[]; position?: 'append' | 'prepend' }
  | { type: 'dropPending' };

export const transcriptReducer = (state: AgentMessage[], action: TranscriptAction): AgentMessage[] => {
  switch (action.type) {
    case 'append':
      return mergeMessages(state, action.messages);
    case 'merge':
      return mergeMessages(state, action.messages, action.position);
    case 'dropPending':
      return withoutPending(state);
    default:
      return state;
  }
};
