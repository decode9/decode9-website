'use client';

import { MessageSquareText, RotateCcw } from 'lucide-react';
import Button from '@/components/UI/Button';
import NotchCard from '@/components/UI/NotchCard';
import { traceSteps } from '@/data/labs';
import { cn } from '@/utils/cn';
import type { AgentTraceProps } from './interface';
import useAgentTrace from './useAgentTrace';

const AgentTrace = ({ copy }: AgentTraceProps) => {
  const { lastQuestion, activeStep, replay, openGuide } = useAgentTrace();

  return (
    <NotchCard className="flex h-full flex-col p-6">
      <h3 className="d9-h3 mb-2">{copy.t}</h3>
      <p className="d9-body mb-2">{copy.d}</p>
      <p className="mb-5 font-code text-[10.5px] uppercase tracking-[0.12em] text-ink-500">{copy.illustrative}</p>

      <div className="mb-5 border border-ink-700 bg-ink-950/80 px-3 py-2.5">
        <span className="block font-code text-[10.5px] uppercase tracking-[0.12em] text-ink-500">{copy.question}</span>
        <span className="line-clamp-2 text-[13.5px] text-ink-100">{lastQuestion ?? copy.empty}</span>
      </div>

      <ol className="relative mb-6 flex flex-1 flex-col gap-4 pl-6">
        <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-ink-700" />
        {traceSteps.map((step, index) => (
          <li key={step} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                'absolute -left-6 top-1 h-[15px] w-[15px] rounded-full border transition-all duration-300',
                index <= activeStep
                  ? 'border-brand-red bg-brand-red shadow-[0_0_14px_rgba(229,18,27,0.7)]'
                  : 'border-ink-600 bg-ink-900',
              )}
            />
            <p
              className={cn(
                'text-[14px] font-semibold transition-colors',
                index <= activeStep ? 'text-ink-50' : 'text-ink-400',
              )}
            >
              {copy.steps[step].t}
            </p>
            <p className="text-[13px] leading-snug text-ink-400">{copy.steps[step].d}</p>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-2">
        {lastQuestion ? (
          <Button size="sm" variant="secondary" onClick={replay}>
            <RotateCcw size={13} />
            <span>{copy.replay}</span>
          </Button>
        ) : null}
        <Button size="sm" variant="outline" onClick={openGuide}>
          <MessageSquareText size={13} />
          <span>{copy.open}</span>
        </Button>
      </div>
    </NotchCard>
  );
};

export default AgentTrace;
