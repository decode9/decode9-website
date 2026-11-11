import { describe, expect, it, vi } from 'vitest';
import type { SignalPayload } from '@/interfaces/signal';
import createApiClient from './createApiClient';
import createSignalGateway from './createSignalGateway';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const fakeFetch = (handler: () => Response | Promise<Response>) =>
  vi.fn(async () => handler()) as unknown as typeof fetch & ReturnType<typeof vi.fn>;

const payload: SignalPayload = { alias: 'Ana', email: 'ana@x.co', whatsapp: '', msg: 'hola', origen: 'movil', web: '' };

const gateway = (fetchImpl: typeof fetch, baseUrl = 'https://api.test') =>
  createSignalGateway(createApiClient({ baseUrl, fetch: fetchImpl }));

describe('createSignalGateway', () => {
  it('POSTs the payload as text/plain JSON to /senal and returns the receipt', async () => {
    const f = fakeFetch(() => json({ ok: true, code: 'SOS-1234' }));
    await expect(gateway(f).send(payload)).resolves.toEqual({ ok: true, code: 'SOS-1234' });
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.test/senal');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Content-Type']).toMatch(/^text\/plain/);
    expect(JSON.parse(String(init.body))).toEqual(payload);
  });

  it.each([
    [422, 'alias'],
    [422, 'correo'],
    [422, 'whatsapp'],
    [422, 'regreso'],
    [429, 'espera'],
    [500, 'almacenamiento'],
  ])('maps %i {error:%s}', async (status, error) => {
    await expect(gateway(fakeFetch(() => json({ ok: false, error }, status))).send(payload)).resolves.toEqual({ ok: false, error });
  });

  it('maps a bare 429 to espera and unknown failures to net', async () => {
    await expect(gateway(fakeFetch(() => new Response('', { status: 429 }))).send(payload)).resolves.toEqual({ ok: false, error: 'espera' });
    await expect(gateway(fakeFetch(() => json({ ok: false }, 502))).send(payload)).resolves.toEqual({ ok: false, error: 'net' });
    await expect(gateway(fakeFetch(() => json({ ok: false }, 200))).send(payload)).resolves.toEqual({ ok: false, error: 'net' });
  });

  it('never throws on network errors', async () => {
    const f = fakeFetch(() => Promise.reject(new TypeError('offline')));
    await expect(gateway(f).send(payload)).resolves.toEqual({ ok: false, error: 'net' });
  });

  it('is unavailable without an API URL and does not fetch', async () => {
    const f = fakeFetch(() => json({ ok: true }));
    await expect(gateway(f, '').send(payload)).resolves.toEqual({ ok: false, error: 'unavailable' });
    expect(f).not.toHaveBeenCalled();
  });
});
