import { describe, expect, it, vi } from 'vitest';
import createApiClient from './createApiClient';
import createWalkieGateway from './createWalkieGateway';
import createNewsSource, { HN_FALLBACK_URL } from './createNewsSource';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const fakeFetch = (handler: (url: string, init?: RequestInit) => Response | Promise<Response>) =>
  vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => handler(String(input), init)) as unknown as typeof fetch &
    ReturnType<typeof vi.fn>;

const payload = { texto: 'hola jorge', web: '', lang: 'es' };

describe('createApiClient', () => {
  it('joins the base and the path and reports availability', () => {
    const client = createApiClient({ baseUrl: 'https://api.test/', fetch: fakeFetch(() => json({})) });
    expect(client.available).toBe(true);
    expect(client.url('/walkie')).toBe('https://api.test/walkie');
    expect(createApiClient({ baseUrl: '', fetch: fakeFetch(() => json({})) }).available).toBe(false);
  });
});

describe('createWalkieGateway', () => {
  const gateway = (fetchImpl: typeof fetch, baseUrl = 'https://api.test') =>
    createWalkieGateway(createApiClient({ baseUrl, fetch: fetchImpl }));

  it('POSTs {texto,web,lang} as text/plain JSON to /walkie and maps 200 ok', async () => {
    const f = fakeFetch(() => json({ ok: true }));
    await expect(gateway(f).send(payload)).resolves.toEqual({ status: 'ok' });
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.test/walkie');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Content-Type']).toMatch(/^text\/plain/);
    expect(JSON.parse(init.body as string)).toEqual(payload);
  });

  it('maps 429 to rate-limited', async () => {
    await expect(gateway(fakeFetch(() => json({ error: 'limite' }, 429))).send(payload)).resolves.toEqual({
      status: 'rate-limited',
    });
  });

  it("maps 422 {error:'vacio'} to empty", async () => {
    await expect(gateway(fakeFetch(() => json({ error: 'vacio' }, 422))).send(payload)).resolves.toEqual({
      status: 'empty',
    });
  });

  it('maps 500 and network errors to failed', async () => {
    await expect(gateway(fakeFetch(() => json({}, 500))).send(payload)).resolves.toEqual({ status: 'failed' });
    const broken = fakeFetch(() => {
      throw new TypeError('network');
    });
    await expect(gateway(broken).send(payload)).resolves.toEqual({ status: 'failed' });
  });

  it('is unavailable without an API URL and does not call fetch', async () => {
    const f = fakeFetch(() => json({ ok: true }));
    await expect(gateway(f, '').send(payload)).resolves.toEqual({ status: 'unavailable' });
    expect(f).not.toHaveBeenCalled();
  });
});

describe('createNewsSource', () => {
  const item = { cat: 'PHP', fuente: 'php.net', titulo: 'PHP 9', url: 'https://php.net', fecha: '2026-11-01' };
  const hn = { hits: [{ title: 'Show HN', url: null, objectID: '42' }, { title: '', objectID: '1' }] };

  it('loads /noticias from the Worker (max 22)', async () => {
    const f = fakeFetch(() => json({ ok: true, actualizado: 'x', noticias: Array(30).fill(item) }));
    const news = await createNewsSource({ client: createApiClient({ baseUrl: 'https://api.test', fetch: f }), fetch: f }).load();
    expect(news).toHaveLength(22);
    expect(f.mock.calls[0][0]).toBe('https://api.test/noticias');
  });

  it('falls back to Hacker News when the Worker fails', async () => {
    const f = fakeFetch((url) => (url === HN_FALLBACK_URL ? json(hn) : json({}, 500)));
    const news = await createNewsSource({ client: createApiClient({ baseUrl: 'https://api.test', fetch: f }), fetch: f }).load();
    expect(news).toEqual([
      { cat: 'Dev', fuente: 'Hacker News', titulo: 'Show HN', url: 'https://news.ycombinator.com/item?id=42' },
    ]);
  });

  it('goes straight to Hacker News without an API URL, and returns [] when everything fails', async () => {
    const f = fakeFetch(() => json(hn));
    await createNewsSource({ client: createApiClient({ baseUrl: '', fetch: f }), fetch: f }).load();
    expect(f.mock.calls[0][0]).toBe(HN_FALLBACK_URL);
    const broken = fakeFetch(() => {
      throw new Error('offline');
    });
    await expect(
      createNewsSource({ client: createApiClient({ baseUrl: '', fetch: broken }), fetch: broken }).load(),
    ).resolves.toEqual([]);
  });
});
