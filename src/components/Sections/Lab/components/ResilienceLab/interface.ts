import type { ResilienceTab } from '@/data/labs';

export interface ResilienceCopy {
  t: string;
  d: string;
  tabs: {
    debounce: { t: string; d: string; placeholder: string; typed: string; fired: string };
    retry: { t: string; d: string; run: string; attempt: string; ok: string; fail: string };
    cancel: { t: string; d: string; run: string; stale: string; fresh: string };
  };
}

export interface ResilienceLabProps {
  copy: ResilienceCopy;
}

export interface UseResilienceLabReturn {
  tab: ResilienceTab;
  setTab: (tab: ResilienceTab) => void;
  highlight: number[];
  setHighlight: (lines: readonly number[]) => void;
  code: string;
}
