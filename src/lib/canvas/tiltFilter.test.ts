import { describe, expect, it } from 'vitest';
import { createTiltFilter, isUsableTilt } from './tiltFilter';

describe('tiltFilter', () => {
  it('ignores missing sensors and landscape', () => {
    expect(isUsableTilt(null, null, 0)).toBe(false);
    expect(isUsableTilt(10, 40, 90)).toBe(false);
    expect(isUsableTilt(10, 40, 180)).toBe(true);
  });

  it('calibrates for half a second, then starts frontal', () => {
    const f = createTiltFilter();
    expect(f.read(8, 45, 0, 1000)).toBeNull();
    expect(f.read(8, 45, 0, 1200)).toBeNull();
    const r = f.read(8, 45, 0, 1600);
    expect(r?.value).toBe(0.5);
    expect(r?.fy).toBe(0);
  });

  it('applies the 5° dead zone and reaches the end at ~30°', () => {
    const f = createTiltFilter();
    f.read(0, 45, 0, 100);
    f.read(0, 45, 0, 300);
    f.read(0, 45, 0, 700);
    expect(f.read(4, 45, 0, 800)?.value).toBe(0.5);
    expect(f.read(40, 45, 0, 900)?.value).toBe(1);
    expect(f.read(-40, 45, 0, 1000)?.value).toBe(0);
  });

  it('clamps the parallax offsets', () => {
    const f = createTiltFilter();
    f.read(0, 45, 0, 100);
    f.read(0, 45, 0, 300);
    f.read(0, 45, 0, 700);
    const r = f.read(60, 120, 0, 800);
    expect(r?.fx).toBe(12);
    expect(r?.fy).toBe(9);
  });
});
