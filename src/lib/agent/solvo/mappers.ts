import type { AgentError, AgentMessage, AgentSession, ReplyState } from '@/interfaces/agent';
import { createAgentError } from '../errors';
import type { SolvoErrorDto, SolvoMessageDto, SolvoSessionDto } from './dto';

export const toAgentMessage = (dto: SolvoMessageDto): AgentMessage => ({
  id: dto.id,
  role: dto.autor === 'visitante' ? 'visitor' : 'agent',
  text: dto.texto,
  at: dto.enviadoAt,
  attachment: dto.adjunto ? { title: dto.adjunto.titulo, url: dto.adjunto.url, kind: dto.adjunto.tipo } : null,
});

export const toAgentSession = (dto: SolvoSessionDto): AgentSession => ({
  name: dto.apariencia.nombreVisible?.trim() || null,
  greeting: dto.apariencia.saludo?.trim() || null,
  history: dto.mensajes.map(toAgentMessage),
});

const REPLY_STATES: Record<string, ReplyState> = {
  respondido: 'answered',
  control_humano: 'human',
  pausado: 'paused',
};

/** Anything that isn't an immediate answer means the reply (if any) will arrive by polling. */
export const toReplyState = (estado: string): ReplyState => REPLY_STATES[estado] ?? 'queued';

const isDailyCap = (body: SolvoErrorDto): boolean => {
  const details = body.details as { code?: string } | undefined;
  return body.code === 'tope_diario' || details?.code === 'tope_diario';
};

export const toAgentError = (status: number, body: SolvoErrorDto, path: string): AgentError => {
  const message = body.message ?? `HTTP ${status}`;
  if (status === 401) return createAgentError('sessionExpired', message);
  if (status === 404) return createAgentError('unavailable', message);
  if (status === 409 && path.startsWith('datos')) return createAgentError('identifyNotAllowed', message);
  if (status === 429) return createAgentError(isDailyCap(body) ? 'dailyCap' : 'rateLimited', message);
  if (status === 400) return createAgentError('invalid', message);
  return createAgentError('unavailable', message);
};
