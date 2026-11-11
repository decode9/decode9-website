import { describe, expect, it } from 'vitest';
import createCascade from './cascade';

describe('createCascade', () => {
  it('keeps counting across callers until reset', () => {
    const c = createCascade();
    expect(c.next()).toBe(1);
    expect(c.next()).toBe(2);
    c.reset();
    expect(c.next()).toBe(1);
  });
});
