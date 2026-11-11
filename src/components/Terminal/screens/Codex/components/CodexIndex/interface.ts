import type { PickerProps } from '../../../interface';

export interface CodexIndexProps extends PickerProps {
  /** Indexes into CODEX shown for the selected tab. */
  entries: readonly number[];
}
