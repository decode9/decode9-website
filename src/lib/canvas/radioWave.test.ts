import { describe, expect, it } from 'vitest';
import { radioWaveValue } from './radioWave';

describe('radioWaveValue', () => {
  it('never drops below the floor', () => {
    expect(radioWaveValue(0, 20, 0, 0, null)).toBe(0.04);
  });

  it('reads the analyser spectrum when live', () => {
    const spectrum = new Uint8Array(128).fill(255);
    expect(radioWaveValue(10, 20, 0, 0, spectrum)).toBeCloseTo(1.3 * (0.55 + 0.45 * Math.sin(0.5 * Math.PI)));
  });
});
