import { describe, expect, it } from 'vitest';
import { readSolvoConfig } from './env';

describe('readSolvoConfig', () => {
  const chatKey = `wpk_${'0f'.repeat(16)}`;

  it('accepts a valid key and URL', () => {
    expect(readSolvoConfig({ baseUrl: 'https://api.solvo.lat', chatKey })).toEqual({
      baseUrl: 'https://api.solvo.lat',
      chatKey,
    });
  });

  it('rejects missing or malformed values', () => {
    expect(readSolvoConfig({})).toBeNull();
    expect(readSolvoConfig({ baseUrl: 'https://x', chatKey: 'wpk_nope' })).toBeNull();
    expect(readSolvoConfig({ baseUrl: 'ftp://x', chatKey })).toBeNull();
  });
});
