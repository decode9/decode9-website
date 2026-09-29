import { describe, expect, it, vi } from 'vitest';
import { createMemoryStorage } from '@/utils/storage';
import type { SolvoMessageDto } from './dto';
import createSolvoAgent from './createSolvoAgent';

const KEY = `wpk_${'a'.repeat(32)}`;
const BASE = 'http://localhost:4000';

const dto = (id: string, autor: SolvoMessageDto['autor'] = 'negocio', texto = id): SolvoMessageDto => ({
  id,
  autor,
  texto,
  enviadoAt: '2026-09-28T12:00:00.000Z',
  adjunto: null,
});

const json = (status: number, body: unknown): Response =>
  new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const session = (pase = 'pass-1') =>
  json(200, {
    pase,
    apariencia: { color: '#01E3FD', saludo: 'Hola', posicion: 'derecha', nombreVisible: 'Nine' },
    mensajes: [dto('h1', 'visitante'), dto('h2')],
  });

type Route = (url: URL, init: RequestInit) => Response | Promise<Response>;

const fakeFetch = (routes: Route[]) => {
  const calls: { url: URL; init: RequestInit }[] = [];
  const queue = [...routes];
  const fetcher = vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = new URL(String(input));
    calls.push({ url, init });
    const route = queue.shift();
    if (!route) throw new Error(`Unexpected request ${url.pathname}`);
    return route(url, init);
  });
  return { fetcher: fetcher as unknown as typeof fetch, calls };
};

const agentWith = (routes: Route[], storage = createMemoryStorage()) => {
  const { fetcher, calls } = fakeFetch(routes);
  return {
    agent: createSolvoAgent({ baseUrl: `${BASE}/api/`, chatKey: KEY, fetch: fetcher, storage }),
    calls,
    storage,
  };
};

const authHeader = (init: RequestInit) => (init.headers as Record<string, string>).Authorization;

describe('createSolvoAgent', () => {
  it('opens the session lazily once and stores the visitor pass', async () => {
    const { agent, calls, storage } = agentWith([() => session()]);
    expect(calls).toHaveLength(0);
    const [first, second] = await Promise.all([agent.open(), agent.open()]);
    expect(first).toBe(second);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url.pathname).toBe('/api/publico/chat/sesion');
    expect(storage.get(`solvo-chat:${KEY}`)).toBe('pass-1');
    expect(first.name).toBe('Nine');
    expect(first.history.map((message) => message.role)).toEqual(['visitor', 'agent']);
  });

  it('sends with the visitor pass and maps the reply state', async () => {
    const { agent, calls } = agentWith([
      () => session(),
      (url, init) => {
        expect(JSON.parse(String(init.body))).toEqual({ clave: KEY, texto: 'hola' });
        return json(200, { estado: 'respondido', mensajes: [dto('m1', 'visitante', 'hola'), dto('m2')] });
      },
    ]);
    const result = await agent.send('hola');
    expect(authHeader(calls[1]!.init)).toBe('Visitante pass-1');
    expect(result.state).toBe('answered');
    expect(result.messages.map((message) => message.id)).toEqual(['m1', 'm2']);
  });

  it.each([
    ['acumulado', 'queued'],
    ['control_humano', 'human'],
    ['pausado', 'paused'],
    ['filtrado', 'queued'],
  ])('maps estado %s to %s', async (estado, state) => {
    const { agent } = agentWith([() => session(), () => json(200, { estado, mensajes: [] })]);
    expect((await agent.send('x')).state).toBe(state);
  });

  it('reopens an expired session and retries exactly once', async () => {
    const { agent, calls, storage } = agentWith([
      () => session('old'),
      () => json(401, { error: 'UnauthorizedError', message: 'La sesión del chat venció.' }),
      () => session('new'),
      () => json(200, { estado: 'respondido', mensajes: [dto('m1')] }),
    ]);
    await agent.send('hola');
    expect(calls.map((call) => call.url.pathname.split('/').pop())).toEqual([
      'sesion',
      'mensajes',
      'sesion',
      'mensajes',
    ]);
    expect(authHeader(calls[3]!.init)).toBe('Visitante new');
    expect(storage.get(`solvo-chat:${KEY}`)).toBe('new');
  });

  it('does not loop when the retry is also unauthorized', async () => {
    const unauthorized = () => json(401, { message: 'x' });
    const { agent } = agentWith([() => session(), unauthorized, () => session(), unauthorized]);
    await expect(agent.send('hola')).rejects.toMatchObject({ kind: 'sessionExpired' });
  });

  it('maps channel off / origin not allowed to unavailable', async () => {
    const { agent } = agentWith([() => json(404, { message: 'Este chat no está disponible.' })]);
    await expect(agent.open()).rejects.toMatchObject({ kind: 'unavailable' });
  });

  it('tells the per-minute limit apart from the daily cap', async () => {
    const perMinute = agentWith([() => session(), () => json(429, { error: 'TooManyRequests', message: 'rápido' })]);
    await expect(perMinute.agent.send('x')).rejects.toMatchObject({ kind: 'rateLimited' });
    const daily = agentWith([
      () => session(),
      () => json(429, { error: 'TooManyRequestsError', message: 'muchas', details: { code: 'tope_diario' } }),
    ]);
    await expect(daily.agent.send('x')).rejects.toMatchObject({ kind: 'dailyCap' });
  });

  it('polls after a cursor and maps 409 on identify', async () => {
    const { agent, calls } = agentWith([
      () => session(),
      () => json(200, { mensajes: [dto('m3')] }),
      () => json(409, { message: 'Escribe un mensaje antes de dejar tus datos.' }),
    ]);
    expect((await agent.poll('m2')).map((message) => message.id)).toEqual(['m3']);
    expect(calls[1]?.url.searchParams.get('despues')).toBe('m2');
    expect(calls[1]?.init.method).toBe('GET');
    await expect(agent.identify({ email: 'a@b.co' })).rejects.toMatchObject({ kind: 'identifyNotAllowed' });
  });

  it('accepts 204 on identify', async () => {
    const { agent } = agentWith([() => session(), () => json(204, null)]);
    await expect(agent.identify({ name: 'Ana' })).resolves.toBeUndefined();
  });

  it('turns network failures and aborts into typed errors', async () => {
    const network = agentWith([() => Promise.reject(new TypeError('Failed to fetch'))]);
    await expect(network.agent.open()).rejects.toMatchObject({ kind: 'network' });

    vi.useFakeTimers();
    const { fetcher } = fakeFetch([
      () => session(),
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
        }),
    ]);
    const slow = createSolvoAgent({
      baseUrl: BASE,
      chatKey: KEY,
      fetch: fetcher,
      storage: createMemoryStorage(),
      sendTimeoutMs: 1000,
    });
    const pending = slow.send('x');
    const assertion = expect(pending).rejects.toMatchObject({ kind: 'timeout' });
    await vi.advanceTimersByTimeAsync(1001);
    await assertion;
    vi.useRealTimers();
  });
});
