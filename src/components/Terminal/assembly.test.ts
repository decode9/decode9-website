import { describe, expect, it } from 'vitest';
import { planAssembly } from './assembly';

describe('planAssembly', () => {
  it('chains the pieces like the original (top, 9 menu items, 4 hud boxes, navfoot, footer)', () => {
    const p = planAssembly(9, 4, false);
    expect(p.top).toBe(0);
    expect(p.menu[0]).toBe(140);
    expect(p.menu[8]).toBe(140 + 8 * 70);
    expect(p.hud[0]).toBe(140 + 9 * 70 + 60);
    expect(p.total).toBe(140 + 9 * 70 + 60 + 4 * 70 + 140);
    expect(p.background).toBeCloseTo(p.total * 0.4);
  });
  it('keeps only the fixed gaps with reduced motion', () => {
    expect(planAssembly(9, 4, true).total).toBe(200);
  });
});
