import type { AgentMessage, ConversationalAgent, SendResult } from '@/interfaces/agent';
import { createAgentError } from './errors';

export interface OfflineAgentCopy {
  /** Honest canned answer: the live agent isn't reachable, here is how to reach Jorge. */
  reply: string;
}

/**
 * Used when Solvo isn't configured or can't be reached. It doesn't pretend to
 * understand the question; it answers transparently and points to the quick
 * replies and to email.
 */
const createOfflineAgent = (copy: OfflineAgentCopy, now: () => Date = () => new Date()): ConversationalAgent => {
  let sequence = 0;

  const message = (role: AgentMessage['role'], text: string): AgentMessage => {
    sequence += 1;
    return { id: `offline-${role}-${sequence}`, role, text, at: now().toISOString(), attachment: null };
  };

  const send = async (text: string): Promise<SendResult> => ({
    state: 'answered',
    messages: [message('visitor', text), message('agent', copy.reply)],
  });

  return {
    capabilities: { live: false, identify: false },
    open: async () => ({ name: null, greeting: null, history: [] }),
    send,
    poll: async () => [],
    identify: async () => {
      throw createAgentError('unavailable');
    },
  };
};

export default createOfflineAgent;
