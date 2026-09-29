/**
 * The conversational agent port. The UI only knows this contract; Solvo, the
 * offline agent and any future provider are adapters behind it.
 */

export type AgentRole = 'visitor' | 'agent' | 'guide';

export interface AgentAttachment {
  title: string;
  /** Signed links expire (Solvo: 15 minutes). `null` when the link could not be signed. */
  url: string | null;
  kind: string;
}

export interface AgentMessage {
  id: string;
  role: AgentRole;
  text: string;
  /** ISO timestamp. */
  at: string;
  attachment: AgentAttachment | null;
  /** Visitor message not yet confirmed by the agent backend. */
  pending?: boolean;
}

/** What happened to the visitor's message on the agent side. */
export type ReplyState = 'answered' | 'queued' | 'human' | 'paused';

export interface AgentSession {
  /** Display name configured for the agent, if the provider has one. */
  name: string | null;
  greeting: string | null;
  history: AgentMessage[];
}

export interface SendResult {
  state: ReplyState;
  messages: AgentMessage[];
}

export interface IdentifyData {
  name?: string;
  email?: string;
}

export interface AgentCapabilities {
  /** Backed by a live model (false for the offline agent). */
  live: boolean;
  /** Can store the visitor's name/email. */
  identify: boolean;
}

export interface ConversationalAgent {
  readonly capabilities: AgentCapabilities;
  open: () => Promise<AgentSession>;
  send: (text: string) => Promise<SendResult>;
  poll: (afterId: string | null) => Promise<AgentMessage[]>;
  identify: (data: IdentifyData) => Promise<void>;
}

export type AgentErrorKind =
  | 'rateLimited'
  | 'dailyCap'
  | 'unavailable'
  | 'sessionExpired'
  | 'timeout'
  | 'identifyNotAllowed'
  | 'invalid'
  | 'network';

export type AgentError = Error & { kind: AgentErrorKind };

/** Longest message a visitor can send (mirrors Solvo's LARGO_MAXIMO_DEL_MENSAJE). */
export const AGENT_MESSAGE_MAX_LENGTH = 1000;
