'use client';

import { Play, RotateCcw } from 'lucide-react';
import Button from '@/components/UI/Button';
import NotchCard from '@/components/UI/NotchCard';
import { pipelineNodes } from '@/data/labs';
import PipelineGraph from './components/PipelineGraph';
import PipelineLog from './components/PipelineLog';
import type { AutomationPipelineProps } from './interface';
import useAutomationPipeline from './useAutomationPipeline';

const AutomationPipeline = ({ copy }: AutomationPipelineProps) => {
  const { scopeRef, status, activeNode, logCount, hours, run, actionLabel } = useAutomationPipeline(copy);

  return (
    <NotchCard notchSize="lg" className="p-6 md:p-8">
      <div ref={scopeRef}>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h3 className="d9-h3 mb-2">{copy.t}</h3>
            <p className="d9-body">{copy.d}</p>
          </div>
          <Button onClick={run} disabled={status === 'running'} size="sm">
            {status === 'done' ? <RotateCcw size={14} /> : <Play size={14} />}
            <span>{actionLabel}</span>
          </Button>
        </div>
        <PipelineGraph labels={pipelineNodes.map((node) => copy.nodes[node] ?? node)} activeNode={activeNode} />
        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_220px]">
          <PipelineLog lines={copy.logs} visible={logCount} idle={copy.idle} />
          <div className="flex flex-col justify-center border border-ink-700 bg-ink-950/60 p-4">
            <span className="font-heading text-[44px] font-bold leading-none text-ink-50">
              {hours}
              <span className="text-[color:var(--accent)]">h</span>
            </span>
            <span className="mt-2 text-[12.5px] leading-snug text-ink-400">{copy.saved}</span>
          </div>
        </div>
      </div>
    </NotchCard>
  );
};

export default AutomationPipeline;
