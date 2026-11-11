import { describe, expect, it } from 'vitest';
import { detectInputMode } from './useInputMode';

const env = (queries: string[], userAgent = '', maxTouchPoints = 0) => ({
  matches: (q: string) => queries.includes(q),
  userAgent,
  maxTouchPoints,
});

describe('detectInputMode', () => {
  it('desktop with mouse', () => {
    expect(detectInputMode(env(['(pointer: fine)', '(hover:hover) and (pointer:fine)'], 'X11; Linux'))).toEqual({
      isTouch: false,
      canAim: true,
      reducedMotion: false,
    });
  });

  it('phone', () => {
    expect(detectInputMode(env(['(pointer: coarse)', '(any-pointer: coarse)'], 'iPhone Mobile', 5))).toMatchObject({
      isTouch: true,
      canAim: false,
    });
  });

  it('touch laptop with a mouse is not touch-first', () => {
    expect(detectInputMode(env(['(any-pointer: coarse)', '(pointer: fine)'], 'Windows NT', 10)).isTouch).toBe(false);
  });
});
