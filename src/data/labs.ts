/** Declarative data for the Lab demos. Copy lives in `lab.*`; the snippets in codeSnippets.ts. */

export type PipelineNodeId = 'lead' | 'qualify' | 'crm' | 'invoice' | 'notify';

export const pipelineNodes: PipelineNodeId[] = ['lead', 'qualify', 'crm', 'invoice', 'notify'];

export const PIPELINE_HOURS_SAVED = 14;

export type ResilienceTab = 'debounce' | 'retry' | 'cancel';

export const resilienceTabs: ResilienceTab[] = ['debounce', 'retry', 'cancel'];

/** 1-based lines of each snippet that light up at each moment of its simulation. */
export const snippetLines = {
  debounce: { keystroke: [7, 8], fire: [12] },
  retry: { attempt: [8, 9], wait: [12, 13, 14], success: [10] },
  cancel: { request: [6, 7], abort: [15], use: [10] },
} as const;

export const DEBOUNCE_WAIT_MS = 300;
export const DEBOUNCE_WINDOW_MS = 5000;

/** Attempt outcomes and the backoff before each retry. */
export const retrySchedule = [
  { ok: false, waitAfterMs: 500 },
  { ok: false, waitAfterMs: 1000 },
  { ok: true, waitAfterMs: 0 },
] as const;

export const cancelQueries = [
  { query: 'd', latencyMs: 1400 },
  { query: 'de', latencyMs: 900 },
  { query: 'dec', latencyMs: 1200 },
  { query: 'deco', latencyMs: 700 },
] as const;

export const CANCEL_TYPING_GAP_MS = 220;

export type TraceStepId = 'receive' | 'retrieve' | 'guard' | 'answer';

export const traceSteps: TraceStepId[] = ['receive', 'retrieve', 'guard', 'answer'];
