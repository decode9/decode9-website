import type { QualitySettings, QualityTier } from '@/interfaces/scene';

export interface QualitySignals {
  /** `?stage=off|low|medium|high` override (QA, Playwright). */
  override: string | null;
  webgl: boolean;
  reducedMotion: boolean;
  cores: number;
  memoryGb: number | null;
  mobile: boolean;
}

export const QUALITY_PRESETS: Record<QualityTier, QualitySettings> = {
  high: { tier: 'high', particles: 40_000, maxDpr: 1.75, bloom: true },
  medium: { tier: 'medium', particles: 20_000, maxDpr: 1.5, bloom: true },
  low: { tier: 'low', particles: 8_000, maxDpr: 1.25, bloom: false },
  off: { tier: 'off', particles: 0, maxDpr: 1, bloom: false },
};

const isTier = (value: string | null): value is QualityTier =>
  value === 'high' || value === 'medium' || value === 'low' || value === 'off';

/** Picks how much WebGL this device gets. Pure: all browser probing happens in the caller. */
export const resolveQuality = (signals: QualitySignals): QualitySettings => {
  if (isTier(signals.override)) return QUALITY_PRESETS[signals.override];
  if (!signals.webgl || signals.reducedMotion) return QUALITY_PRESETS.off;
  // Phones always get the light stage: battery and thermals matter more than particle count.
  if (signals.mobile) return QUALITY_PRESETS.low;
  const weak = signals.cores <= 4 || (signals.memoryGb !== null && signals.memoryGb <= 4);
  return QUALITY_PRESETS[weak ? 'medium' : 'high'];
};
