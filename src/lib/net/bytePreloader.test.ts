import { describe, expect, it } from 'vitest';
import { createBytePreloader } from './bytePreloader';

const streamed = (chunks: number[], length?: number) =>
  new Response(
    new ReadableStream({
      start(controller) {
        chunks.forEach((n) => controller.enqueue(new Uint8Array(n)));
        controller.close();
      },
    }),
    { headers: length ? { 'content-length': String(length) } : {} },
  );

describe('bytePreloader', () => {
  it('reports real byte progress up to 1', async () => {
    const fetchStub = (async (url: string) => (url === '/a' ? streamed([50, 50], 100) : streamed([300], 300))) as unknown as typeof fetch;
    const progress: number[] = [];
    await createBytePreloader({ fetch: fetchStub }).preload(['/a', '/b'], (p) => progress.push(p));
    expect(progress.at(-1)).toBe(1);
    expect(progress.every((p, i) => i === 0 || p >= progress[i - 1] - 1e-9)).toBe(true);
  });

  it('counts failed files as done', async () => {
    const fetchStub = (async () => {
      throw new Error('offline');
    }) as unknown as typeof fetch;
    const progress: number[] = [];
    await createBytePreloader({ fetch: fetchStub }).preload(['/x'], (p) => progress.push(p));
    expect(progress).toEqual([1]);
  });
});
