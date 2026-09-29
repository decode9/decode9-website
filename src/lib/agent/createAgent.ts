import type { AgentErrorKind, ConversationalAgent } from '@/interfaces/agent';
import type { KeyValueStorage } from '@/interfaces/storage';
import type { SolvoConfig } from '@/lib/config/env';
import createOfflineAgent, { type OfflineAgentCopy } from './createOfflineAgent';
import createSolvoAgent from './solvo/createSolvoAgent';
import withFallback from './withFallback';

export interface CreateAgentDeps {
  solvo: SolvoConfig | null;
  copy: OfflineAgentCopy;
  storage: KeyValueStorage;
  fetch: typeof fetch;
  onFallback?: (kind: AgentErrorKind) => void;
}

/** Composition of the agent used by the site: Solvo when configured, always backed by the offline agent. */
const createAgent = ({ solvo, copy, storage, fetch, onFallback }: CreateAgentDeps): ConversationalAgent => {
  const offline = createOfflineAgent(copy);
  if (!solvo) return offline;
  return withFallback(createSolvoAgent({ ...solvo, storage, fetch }), offline, onFallback);
};

export default createAgent;
