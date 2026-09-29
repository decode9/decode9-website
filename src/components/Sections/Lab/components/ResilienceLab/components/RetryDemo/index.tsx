'use client';

import { Play } from 'lucide-react';
import Button from '@/components/UI/Button';
import { cn } from '@/utils/cn';
import type { RetryAttempt, RetryDemoProps } from './interface';
import useRetryDemo from './useRetryDemo';

const BAR_CLASS: Record<RetryAttempt['status'], string> = {
  pending: 'bg-ink-300',
  fail: 'bg-brand-red',
  ok: 'bg-success',
};
const LABEL_CLASS: Record<RetryAttempt['status'], string> = {
  pending: 'text-ink-500',
  fail: 'text-brand-red-light',
  ok: 'text-success',
};

const RetryDemo = ({ copy, onHighlight }: RetryDemoProps) => {
  const statusLabel: Record<RetryAttempt['status'], string> = { pending: '…', fail: copy.fail, ok: copy.ok };
  const { attempts, waiting, running, run } = useRetryDemo(onHighlight);

  return (
    <div className="flex flex-col gap-4">
      <p className="d9-body text-[14px]">{copy.d}</p>
      <div>
        <Button size="sm" variant="secondary" onClick={() => void run()} disabled={running}>
          <Play size={13} />
          <span>{copy.run}</span>
        </Button>
      </div>
      <ol className="flex min-h-[150px] flex-col gap-2 font-code text-[12px]" aria-live="polite">
        {attempts.map((attempt) => (
          <li key={attempt.attempt} className="flex flex-col gap-2">
            <div className="flex items-center gap-3 border border-ink-700 bg-ink-950/80 px-3 py-2">
              <span className="text-ink-400">
                {copy.attempt} {attempt.attempt}
              </span>
              <span className="relative h-1 flex-1 overflow-hidden bg-ink-800">
                <span
                  className={cn('absolute inset-y-0 left-0', BAR_CLASS[attempt.status])}
                  style={attempt.status === 'pending' ? { animation: 'grow 600ms linear forwards' } : { width: '100%' }}
                />
              </span>
              <span className={LABEL_CLASS[attempt.status]}>{statusLabel[attempt.status]}</span>
            </div>
            {attempt.status === 'fail' && waiting === attempt.waitMs ? (
              <span className="pl-3 text-ink-500">↻ backoff {attempt.waitMs} ms</span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RetryDemo;
