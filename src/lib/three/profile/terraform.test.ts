import { describe, expect, it } from 'vitest';
import {
  advanceProgress,
  atmosphereOpacity,
  createSeededRandom,
  faceTone,
  FULL_FRONT,
  itemScale,
  networkProgress,
  paintFront,
  phaseIndex,
  TERRAFORM_DURATION,
} from './terraform';

describe('terraform math', () => {
  it('maps progress to the four phases at 0 / .2 / .5 / .76', () => {
    expect([0, 0.19, 0.2, 0.49, 0.5, 0.75, 0.76, 1].map(phaseIndex)).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
  });

  it('paints the whole surface by 48 % progress', () => {
    expect(paintFront(0)).toBe(0);
    expect(paintFront(0.24)).toBeCloseTo(FULL_FRONT / 2);
    expect(paintFront(0.48)).toBeCloseTo(FULL_FRONT);
    expect(paintFront(1)).toBeCloseTo(FULL_FRONT);
  });

  it('fades the atmosphere in and the network after .76', () => {
    expect(atmosphereOpacity(0)).toBeCloseTo(0.03);
    expect(atmosphereOpacity(0.6)).toBeCloseTo(0.23);
    expect(networkProgress(0.76)).toBe(0);
    expect(networkProgress(0.88)).toBeCloseTo(0.5);
    expect(networkProgress(1)).toBe(1);
  });

  it('pops props with an overshoot and shrinks reverse ones', () => {
    expect(itemScale(0.1, 0.2)).toBe(0.0001);
    expect(itemScale(0.2 + 1 / 14, 0.2)).toBeCloseTo(1);
    expect(Math.max(...[0.3, 0.5, 0.7].map((x) => itemScale(0.2 + x / 14, 0.2)))).toBeGreaterThan(1);
    expect(itemScale(0.1, 0.2, true)).toBe(1);
    expect(itemScale(1, 0.2, true)).toBe(0.0001);
  });

  it('advances in TERRAFORM_DURATION seconds and jumps to 1 with reduced motion', () => {
    expect(advanceProgress(0, TERRAFORM_DURATION / 2)).toBeCloseTo(0.5);
    expect(advanceProgress(0.99, 5)).toBe(1);
    expect(advanceProgress(0, 0.01, true)).toBe(1);
  });

  it('chooses the palette slot of a face like the original paint()', () => {
    const face = (t: number, h: number) => ({ t, h, j: 0 });
    expect(faceTone(face(1, 0.5), 0, false)).toEqual({ group: 'barren', index: 2 });
    expect(faceTone(face(1, 0), 0, false)).toEqual({ group: 'barren', index: 1 });
    expect(faceTone(face(1, -0.5), 0, true)).toEqual({ group: 'lava', index: 0 });
    expect(faceTone(face(1, -0.5), 2, false)).toEqual({ group: 'deep', index: 0 });
    expect(faceTone(face(1, -0.35), 2, false)).toEqual({ group: 'water', index: 0 });
    expect(faceTone(face(1, 0.5), 1.1, false)).toEqual({ group: 'edge', index: 0 });
    expect(faceTone(face(1, 0.5), 2, false)).toEqual({ group: 'main', index: 2 });
    expect(faceTone(face(1, -0.1), 2, false)).toEqual({ group: 'main', index: 0 });
  });

  it('reproduces the Park–Miller sequence', () => {
    const rnd = createSeededRandom(7);
    expect(rnd()).toBeCloseTo((7 * 16807 - 1) / 2147483646, 12);
    const a = createSeededRandom(138);
    const b = createSeededRandom(138);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});
