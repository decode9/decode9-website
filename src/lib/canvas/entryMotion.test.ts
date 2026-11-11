import { describe, expect, it } from 'vitest';
import { activeSide, fractionalFrame, frameFor, headOffset, seamEdges, warpLog } from './entryMotion';

describe('entryMotion', () => {
  it('maps the pointer to frames: left edge, centre, right edge', () => {
    expect(frameFor(0, 3, 11)).toBe(0);
    expect(frameFor(0.5, 3, 11)).toBe(3);
    expect(frameFor(1, 3, 11)).toBe(11);
    expect(frameFor(0.75, 3, 11)).toBe(7);
    expect(fractionalFrame(0.25, 3, 11)).toBeCloseTo(1.5);
  });

  it('recentres the head within ±7% of the width', () => {
    expect(headOffset(0.5, 1000)).toBe(0);
    expect(headOffset(0.388, 1000)).toBeCloseTo(70);
    expect(headOffset(0.45, 1000)).toBeCloseTo(50);
  });

  it('places the seam like the original (desktop 55/45, phone 60/40, still on touch)', () => {
    expect(seamEdges({ pos: 0.5, mobile: false, touch: false, leaving: null, take: 0 })).toEqual({ top: 55, bottom: 45 });
    expect(seamEdges({ pos: 0, mobile: false, touch: false, leaving: null, take: 0 })).toEqual({ top: 68, bottom: 58 });
    expect(seamEdges({ pos: 0, mobile: true, touch: true, leaving: null, take: 0 })).toEqual({ top: 60, bottom: 40 });
    expect(seamEdges({ pos: 0.5, mobile: false, touch: false, leaving: 'blue', take: 1 })).toEqual({ top: -35, bottom: -45 });
  });

  it('highlights a side only outside the dead centre and when not idle', () => {
    expect(activeSide(0.2, false)).toBe('red');
    expect(activeSide(0.5, false)).toBe('');
    expect(activeSide(0.9, false)).toBe('blue');
    expect(activeSide(0.9, true)).toBe('');
  });

  it('writes the terminal log progressively', () => {
    const lines = ['a', 'b', 'c', 'd'];
    expect(warpLog(lines, 0)).toBe('a\n[················] 0%');
    expect(warpLog(lines, 1)).toBe('a\nb\nc\nd\n[████████████████] 100%');
    expect(warpLog(lines, 0.5).split('\n')).toHaveLength(4);
  });
});
