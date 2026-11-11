import type { WindowSpec } from '../../../../useWindowManager';

export interface DockProps {
  /** Base windows closed with ✕, in closing order. */
  closed: readonly WindowSpec[];
  onRestore: (index: number) => void;
}
