import { describe, expect, it, vi } from 'vitest';
import createShare, { shareUrl } from './createShare';

const item = { id: 'tx01', title: 'Hola' };
const base = 'https://decode9.codes/decode9/movil/#viejo';

describe('createShare', () => {
  it('builds base#id without the previous hash', () => {
    expect(shareUrl(base, 'tx01')).toBe('https://decode9.codes/decode9/movil/#tx01');
  });

  it('uses navigator.share when available', async () => {
    const share = vi.fn(async () => undefined);
    const outcome = await createShare({ base, navigator: { share } as unknown as Navigator })(item);
    expect(outcome).toBe('shared');
    expect(share).toHaveBeenCalledWith({ title: 'Hola', text: 'decode9 · Hola', url: 'https://decode9.codes/decode9/movil/#tx01' });
  });

  it('falls back to the clipboard', async () => {
    const writeText = vi.fn(async () => undefined);
    const nav = { clipboard: { writeText } } as unknown as Navigator;
    await expect(createShare({ base, navigator: nav })(item)).resolves.toBe('copied');
    expect(writeText).toHaveBeenCalledWith('https://decode9.codes/decode9/movil/#tx01');
  });

  it('reports failed when cancelled or unsupported', async () => {
    const share = vi.fn(async () => Promise.reject(new Error('AbortError')));
    await expect(createShare({ base, navigator: { share } as unknown as Navigator })(item)).resolves.toBe('failed');
    await expect(createShare({ base, navigator: undefined })(item)).resolves.toBe('failed');
  });
});
