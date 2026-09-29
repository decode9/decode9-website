import type { RefObject } from 'react';

export type StageMode = 'pending' | 'webgl' | 'fallback';

export interface UseStageReturn {
  hostRef: RefObject<HTMLDivElement>;
  mode: StageMode;
}
