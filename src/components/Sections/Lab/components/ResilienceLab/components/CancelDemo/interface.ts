export interface CancelDemoProps {
  copy: { d: string; run: string; stale: string; fresh: string };
  onHighlight: (lines: readonly number[]) => void;
}

export interface SearchRequest {
  query: string;
  status: 'pending' | 'aborted' | 'used';
  latencyMs: number;
  /** 0–100, frozen when the request is aborted. */
  progress: number;
}
