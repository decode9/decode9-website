import { useCallback, useEffect, useRef, useState } from 'react';
import { retrySchedule, snippetLines } from '@/data/labs';
import { isAbortError, sleep } from '@/utils/async';
import type { RetryAttempt } from './interface';

const REQUEST_MS = 600;

/** Plays the retry-with-backoff schedule: fail, wait 500 ms, fail, wait 1 s, succeed. */
const useRetryDemo = (onHighlight: (lines: readonly number[]) => void) => {
  const [attempts, setAttempts] = useState<RetryAttempt[]>([]);
  const [waiting, setWaiting] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  const run = useCallback(async () => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setAttempts([]);
    setRunning(true);
    try {
      for (const [index, step] of retrySchedule.entries()) {
        setAttempts((list) => [...list, { attempt: index + 1, status: 'pending', waitMs: step.waitAfterMs }]);
        onHighlight(snippetLines.retry.attempt);
        await sleep(REQUEST_MS, current.signal);
        setAttempts((list) =>
          list.map((item) => (item.attempt === index + 1 ? { ...item, status: step.ok ? 'ok' : 'fail' } : item)),
        );
        if (step.ok) {
          onHighlight(snippetLines.retry.success);
          break;
        }
        onHighlight(snippetLines.retry.wait);
        setWaiting(step.waitAfterMs);
        await sleep(step.waitAfterMs, current.signal);
        setWaiting(null);
      }
    } catch (error) {
      if (!isAbortError(error)) throw error;
    } finally {
      setRunning(false);
    }
  }, [onHighlight]);

  return { attempts, waiting, running, run };
};

export default useRetryDemo;
