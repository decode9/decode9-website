'use client';

import { Zap } from 'lucide-react';
import Button from '@/components/UI/Button';
import { cn } from '@/utils/cn';
import type { CancelDemoProps, SearchRequest } from './interface';
import useCancelDemo from './useCancelDemo';

const BAR_CLASS: Record<SearchRequest['status'], string> = {
  pending: 'bg-ink-300',
  aborted: 'bg-ink-600',
  used: 'bg-success',
};

const CancelDemo = ({ copy, onHighlight }: CancelDemoProps) => {
  const { requests, running, run } = useCancelDemo(onHighlight);
  const statusLabel: Record<SearchRequest['status'], string> = { pending: '…', aborted: copy.stale, used: copy.fresh };

  return (
    <div className="flex flex-col gap-4">
      <p className="d9-body text-[14px]">{copy.d}</p>
      <div>
        <Button size="sm" variant="secondary" onClick={run} disabled={running}>
          <Zap size={13} />
          <span>{copy.run}</span>
        </Button>
      </div>
      <ol className="flex min-h-[150px] flex-col gap-2 font-code text-[12px]" aria-live="polite">
        {requests.map((request) => (
          <li key={request.query} className="flex items-center gap-3 border border-ink-700 bg-ink-950/80 px-3 py-2">
            <span className="w-16 text-ink-200">?q={request.query}</span>
            <span className="relative h-1 flex-1 overflow-hidden bg-ink-800">
              <span
                className={cn('absolute inset-y-0 left-0', BAR_CLASS[request.status])}
                style={
                  request.status === 'pending'
                    ? { animation: `grow ${request.latencyMs}ms linear forwards` }
                    : { width: request.status === 'aborted' ? `${request.progress}%` : '100%' }
                }
              />
            </span>
            <span className={request.status === 'used' ? 'text-success' : 'text-ink-500'}>
              {statusLabel[request.status]}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CancelDemo;
