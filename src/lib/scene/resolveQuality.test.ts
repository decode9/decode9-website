import { describe, expect, it } from 'vitest';
import { resolveQuality, type QualitySignals } from './resolveQuality';

const desktop: QualitySignals = {
  override: null,
  webgl: true,
  reducedMotion: false,
  cores: 12,
  memoryGb: 16,
  mobile: false,
};

describe('resolveQuality', () => {
  it('gives strong desktops the full stage', () => {
    expect(resolveQuality(desktop).tier).toBe('high');
  });

  it('turns the stage off without WebGL or with reduced motion', () => {
    expect(resolveQuality({ ...desktop, webgl: false }).tier).toBe('off');
    expect(resolveQuality({ ...desktop, reducedMotion: true }).tier).toBe('off');
  });

  it('scales down on weak desktops and always keeps phones light', () => {
    expect(resolveQuality({ ...desktop, cores: 4 }).tier).toBe('medium');
    expect(resolveQuality({ ...desktop, mobile: true, cores: 8, memoryGb: 8 }).tier).toBe('low');
    expect(resolveQuality({ ...desktop, mobile: true, cores: 4 }).tier).toBe('low');
  });

  it('honours an explicit override', () => {
    expect(resolveQuality({ ...desktop, override: 'low' }).tier).toBe('low');
    expect(resolveQuality({ ...desktop, webgl: false, override: 'off' }).tier).toBe('off');
  });
});
