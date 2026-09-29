import { useCallback, useEffect, useRef, useState } from 'react';
import { CANCEL_TYPING_GAP_MS, cancelQueries, snippetLines } from '@/data/labs';
import type { SearchRequest } from './interface';

/** Four searches typed in quick succession: each new one aborts the previous; only the last answer is used. */
const useCancelDemo = (onHighlight: (lines: readonly number[]) => void) => {
  const [requests, setRequests] = useState<SearchRequest[]>([]);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startedAt = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const run = useCallback(() => {
    clearTimers();
    setRequests([]);
    setRunning(true);
    startedAt.current = [];

    cancelQueries.forEach(({ query, latencyMs }, index) => {
      const start = setTimeout(() => {
        const now = Date.now();
        startedAt.current[index] = now;
        onHighlight(index > 0 ? snippetLines.cancel.abort : snippetLines.cancel.request);
        setRequests((list) => [
          ...list.map((request, previous) =>
            request.status === 'pending'
              ? {
                  ...request,
                  status: 'aborted' as const,
                  progress: Math.min(100, ((now - (startedAt.current[previous] ?? now)) / request.latencyMs) * 100),
                }
              : request,
          ),
          { query, status: 'pending', latencyMs, progress: 100 },
        ]);
      }, index * CANCEL_TYPING_GAP_MS);

      const finish = setTimeout(
        () => {
          setRequests((list) =>
            list.map((request, position) =>
              position === index && request.status === 'pending' ? { ...request, status: 'used' } : request,
            ),
          );
          if (index === cancelQueries.length - 1) {
            onHighlight(snippetLines.cancel.use);
            setRunning(false);
          }
        },
        index * CANCEL_TYPING_GAP_MS + latencyMs,
      );
      timers.current.push(start, finish);
    });
  }, [onHighlight]);

  return { requests, running, run };
};

export default useCancelDemo;
