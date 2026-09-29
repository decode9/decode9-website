export interface DebounceDemoProps {
  copy: { d: string; placeholder: string; typed: string; fired: string };
  onHighlight: (lines: readonly number[]) => void;
}

export interface DebounceEvent {
  id: number;
  at: number;
  kind: 'key' | 'fire';
}
