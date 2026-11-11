import { describe, expect, it } from 'vitest';
import { readEnv } from './env';

describe('readEnv', () => {
  it('allows an empty API URL', () => {
    expect(readEnv({}).apiUrl).toBe('');
  });
  it('trims spaces and trailing slashes', () => {
    expect(readEnv({ apiUrl: ' https://api.example.dev/ ' }).apiUrl).toBe('https://api.example.dev');
  });
});
