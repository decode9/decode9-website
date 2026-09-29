import type { TraceStepId } from '@/data/labs';

export interface TraceCopy {
  t: string;
  d: string;
  illustrative: string;
  empty: string;
  question: string;
  replay: string;
  open: string;
  steps: Record<TraceStepId, { t: string; d: string }>;
}

export interface AgentTraceProps {
  copy: TraceCopy;
}
