import type { StageStatus } from '@/lib/scene/createBootSequence';

export type PreloaderPhase = 'loading' | 'decoded' | 'leaving' | 'done';

export interface UsePreloaderReturn {
  phase: PreloaderPhase;
  /** 0–100 as shown. */
  percent: number;
  line: string;
  stage: StageStatus;
}
