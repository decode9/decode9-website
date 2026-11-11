import { describe, expect, it } from 'vitest';
import { nodeProgress, scrambleFrame } from './decodeText';

const fixed = () => 0; // always picks the first charset char

describe('scrambleFrame', () => {
  it('reveals nothing at 0 and everything at 1', () => {
    expect(scrambleFrame('abc', 0, fixed, 'X')).toBe('XXX');
    expect(scrambleFrame('abc', 1, fixed, 'X')).toBe('abc');
  });
  it('reveals the leading share and keeps spaces and line breaks', () => {
    expect(scrambleFrame('ab cd', 0.4, fixed, 'X')).toBe('ab XX');
    expect(scrambleFrame('a\nb', 0, fixed, 'X')).toBe('X\nX');
  });
  it('clamps out-of-range progress', () => {
    expect(scrambleFrame('ab', -1, fixed, 'X')).toBe('XX');
    expect(scrambleFrame('ab', 2, fixed, 'X')).toBe('ab');
  });
});

describe('nodeProgress', () => {
  it('starts after the delay and finishes 65% later', () => {
    expect(nodeProgress(0.1, 0.2)).toBe(0);
    expect(nodeProgress(0.9, 0.2)).toBe(1);
    expect(nodeProgress(0.525, 0.2)).toBeCloseTo(0.5);
  });
});
