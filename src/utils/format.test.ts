import { describe, expect, it } from 'vitest';
import { formatCountdown, interpolate, toCode } from './format';
import { createRandom, staggeredProgress } from './math';

describe('format', () => {
  it('interpolates known keys and leaves unknown ones', () => {
    expect(interpolate('Hi, I am {name} ({missing})', { name: 'Nine' })).toBe('Hi, I am Nine ({missing})');
  });

  it('formats codes and countdowns', () => {
    expect(toCode(3)).toBe('03');
    expect(formatCountdown(61_000)).toBe('1:01');
    expect(formatCountdown(-5)).toBe('0:00');
  });
});

describe('math', () => {
  it('staggers progress: every particle starts at 0 and ends at 1', () => {
    expect(staggeredProgress(0, 0.9, 0.35)).toBe(0);
    expect(staggeredProgress(1, 0.9, 0.35)).toBe(1);
    expect(staggeredProgress(0.3, 0, 0.35)).toBeGreaterThan(staggeredProgress(0.3, 1, 0.35));
  });

  it('creates a deterministic random generator', () => {
    const a = createRandom(9);
    const b = createRandom(9);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});
