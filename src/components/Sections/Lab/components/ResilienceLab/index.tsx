'use client';

import dynamic from 'next/dynamic';
import NotchCard from '@/components/UI/NotchCard';
import { resilienceTabs } from '@/data/labs';
import { cn } from '@/utils/cn';
import CancelDemo from './components/CancelDemo';
import DebounceDemo from './components/DebounceDemo';
import RetryDemo from './components/RetryDemo';
import type { ResilienceLabProps } from './interface';
import useResilienceLab from './useResilienceLab';

// Prism is only downloaded when the Lab renders, keeping it out of the first bundle.
const CodeBlock = dynamic(() => import('@/components/UI/CodeBlock'), { ssr: false });

const ResilienceLab = ({ copy }: ResilienceLabProps) => {
  const { tab, setTab, highlight, setHighlight, code } = useResilienceLab();

  return (
    <NotchCard className="flex h-full flex-col p-6">
      <h3 className="d9-h3 mb-2">{copy.t}</h3>
      <p className="d9-body mb-5">{copy.d}</p>
      <div role="tablist" aria-label={copy.t} className="mb-5 flex flex-wrap gap-2">
        {resilienceTabs.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`resilience-tab-${id}`}
            aria-selected={tab === id}
            aria-controls="resilience-panel"
            onClick={() => setTab(id)}
            className={cn('d9-chip', tab === id && 'border-brand-red bg-brand-red/15')}
          >
            {copy.tabs[id].t}
          </button>
        ))}
      </div>
      <div
        id="resilience-panel"
        role="tabpanel"
        aria-labelledby={`resilience-tab-${tab}`}
        className="grid gap-5 xl:grid-cols-2"
      >
        {tab === 'debounce' ? <DebounceDemo copy={copy.tabs.debounce} onHighlight={setHighlight} /> : null}
        {tab === 'retry' ? <RetryDemo copy={copy.tabs.retry} onHighlight={setHighlight} /> : null}
        {tab === 'cancel' ? <CancelDemo copy={copy.tabs.cancel} onHighlight={setHighlight} /> : null}
        <div className="min-w-0 border border-ink-700 bg-ink-950/90 font-code">
          <CodeBlock code={code} highlightLines={highlight} />
        </div>
      </div>
    </NotchCard>
  );
};

export default ResilienceLab;
