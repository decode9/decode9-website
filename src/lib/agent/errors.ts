import type { AgentError, AgentErrorKind } from '@/interfaces/agent';

export const createAgentError = (kind: AgentErrorKind, message: string = kind): AgentError =>
  Object.assign(new Error(message), { kind });

export const isAgentError = (error: unknown): error is AgentError =>
  error instanceof Error && typeof (error as Partial<AgentError>).kind === 'string';

export const errorKindOf = (error: unknown): AgentErrorKind => (isAgentError(error) ? error.kind : 'network');
