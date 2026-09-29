export interface RetryDemoProps {
  copy: { d: string; run: string; attempt: string; ok: string; fail: string };
  onHighlight: (lines: readonly number[]) => void;
}

export interface RetryAttempt {
  attempt: number;
  status: 'pending' | 'fail' | 'ok';
  waitMs: number;
}
