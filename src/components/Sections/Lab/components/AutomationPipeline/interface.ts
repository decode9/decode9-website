import type { RefObject } from 'react';

export type PipelineStatus = 'idle' | 'running' | 'done';

export interface PipelineCopy {
  t: string;
  d: string;
  run: string;
  running: string;
  replay: string;
  nodes: Record<string, string>;
  logs: string[];
  saved: string;
  idle: string;
}

export interface AutomationPipelineProps {
  copy: PipelineCopy;
}

export interface UseAutomationPipelineReturn {
  scopeRef: RefObject<HTMLDivElement>;
  status: PipelineStatus;
  activeNode: number;
  logCount: number;
  hours: number;
  run: () => void;
  actionLabel: string;
}
