import { useCallback, useState } from 'react';
import { cancelableSearchSnippet, debounceSnippet, fetchRetrySnippet } from '@/data/codeSnippets';
import type { ResilienceTab } from '@/data/labs';
import { trackEvent } from '@/lib/analytics';
import type { UseResilienceLabReturn } from './interface';

const SNIPPETS: Record<ResilienceTab, string> = {
  debounce: debounceSnippet,
  retry: fetchRetrySnippet,
  cancel: cancelableSearchSnippet,
};

const useResilienceLab = (): UseResilienceLabReturn => {
  const [tab, setTabState] = useState<ResilienceTab>('debounce');
  const [highlight, setHighlightState] = useState<number[]>([]);

  const setTab = useCallback((next: ResilienceTab) => {
    setTabState(next);
    setHighlightState([]);
    trackEvent('lab_run', { lab: `resilience_${next}` });
  }, []);

  const setHighlight = useCallback((lines: readonly number[]) => setHighlightState([...lines]), []);

  return { tab, setTab, highlight, setHighlight, code: SNIPPETS[tab] };
};

export default useResilienceLab;
