import type { AgentMessage, AgentSession, ConversationalAgent, IdentifyData, SendResult } from '@/interfaces/agent';
import type { KeyValueStorage } from '@/interfaces/storage';
import { createAgentError, isAgentError } from '../errors';
import type { SolvoErrorDto, SolvoPollDto, SolvoSendDto, SolvoSessionDto } from './dto';
import { toAgentError, toAgentMessage, toAgentSession, toReplyState } from './mappers';

export interface SolvoAgentDeps {
  /** Origin of the Solvo API, e.g. https://api.example.com (a trailing /api is tolerated). */
  baseUrl: string;
  /** Public web-chat key (`wpk_…`). */
  chatKey: string;
  fetch: typeof fetch;
  storage: KeyValueStorage;
  /** The agent turn runs inside the request; model + tools can take a while. */
  sendTimeoutMs?: number;
  readTimeoutMs?: number;
}

interface RequestOptions {
  method: 'GET' | 'POST';
  body?: Record<string, unknown>;
  query?: Record<string, string>;
  timeoutMs: number;
}

const normalizeBase = (baseUrl: string): string => baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');

/**
 * Adapter for Solvo's public web-chat channel. Mirrors the official widget:
 * the visitor pass lives in `solvo-chat:<key>` so a conversation started with
 * the widget and with this site is the same one.
 */
const createSolvoAgent = ({
  baseUrl,
  chatKey,
  fetch: fetcher,
  storage,
  sendTimeoutMs = 45_000,
  readTimeoutMs = 15_000,
}: SolvoAgentDeps): ConversationalAgent => {
  const passKey = `solvo-chat:${chatKey}`;
  const endpoint = `${normalizeBase(baseUrl)}/api/publico/chat/`;

  const request = async <T>(path: string, { method, body, query, timeoutMs }: RequestOptions): Promise<T | null> => {
    const pass = storage.get(passKey);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const search = query ? `?${new URLSearchParams(query).toString()}` : '';
    try {
      const response = await fetcher(`${endpoint}${path}${search}`, {
        method,
        signal: controller.signal,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(pass ? { Authorization: `Visitante ${pass}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({}))) as SolvoErrorDto;
        throw toAgentError(response.status, errorBody, path);
      }
      return response.status === 204 ? null : ((await response.json()) as T);
    } catch (error) {
      if (isAgentError(error)) throw error;
      if (controller.signal.aborted) throw createAgentError('timeout');
      throw createAgentError('network', error instanceof Error ? error.message : 'network');
    } finally {
      clearTimeout(timer);
    }
  };

  let session: Promise<AgentSession> | null = null;

  const openSession = async (): Promise<AgentSession> => {
    const dto = await request<SolvoSessionDto>('sesion', {
      method: 'POST',
      body: { clave: chatKey },
      timeoutMs: readTimeoutMs,
    });
    if (!dto) throw createAgentError('unavailable');
    storage.set(passKey, dto.pase);
    return toAgentSession(dto);
  };

  /** Lazy and memoised: `/sesion` writes on the server, so it runs once per page. */
  const open = (): Promise<AgentSession> => {
    session ??= openSession().catch((error: unknown) => {
      session = null;
      throw error;
    });
    return session;
  };

  /**
   * Runs an authenticated call; on an expired pass reopens the session and
   * retries exactly once. Safe for sends too: Solvo validates the pass before
   * recording the message.
   */
  const authenticated = async <T>(call: () => Promise<T>): Promise<T> => {
    await open();
    try {
      return await call();
    } catch (error) {
      if (!isAgentError(error) || error.kind !== 'sessionExpired') throw error;
      storage.remove(passKey);
      session = null;
      await open();
      return call();
    }
  };

  const send = (text: string): Promise<SendResult> =>
    authenticated(async () => {
      const dto = await request<SolvoSendDto>('mensajes', {
        method: 'POST',
        body: { clave: chatKey, texto: text },
        timeoutMs: sendTimeoutMs,
      });
      if (!dto) throw createAgentError('unavailable');
      return { state: toReplyState(dto.estado), messages: dto.mensajes.map(toAgentMessage) };
    });

  const poll = (afterId: string | null): Promise<AgentMessage[]> =>
    authenticated(async () => {
      const dto = await request<SolvoPollDto>('mensajes', {
        method: 'GET',
        query: afterId ? { clave: chatKey, despues: afterId } : { clave: chatKey },
        timeoutMs: readTimeoutMs,
      });
      return (dto?.mensajes ?? []).map(toAgentMessage);
    });

  const identify = (data: IdentifyData): Promise<void> =>
    authenticated(async () => {
      await request<null>('datos', {
        method: 'POST',
        body: { clave: chatKey, ...data },
        timeoutMs: readTimeoutMs,
      });
    });

  return {
    capabilities: { live: true, identify: true },
    open,
    send,
    poll,
    identify,
  };
};

export default createSolvoAgent;
