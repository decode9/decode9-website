import { useEffect, useState } from 'react';
import type { QualitySettings } from '@/interfaces/scene';
import { resolveQuality } from '@/lib/scene/resolveQuality';

const hasWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

/** `null` until measured in the browser (prerender never ships a stage). */
const useQualityTier = (reducedMotion: boolean): QualitySettings | null => {
  const [quality, setQuality] = useState<QualitySettings | null>(null);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    setQuality(
      resolveQuality({
        override: new URLSearchParams(window.location.search).get('stage'),
        webgl: hasWebGL(),
        reducedMotion,
        cores: nav.hardwareConcurrency ?? 4,
        memoryGb: nav.deviceMemory ?? null,
        mobile: window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768,
      }),
    );
  }, [reducedMotion]);

  return quality;
};

export default useQualityTier;
