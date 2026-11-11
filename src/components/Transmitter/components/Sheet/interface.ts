import type { ReactNode, Ref } from 'react';

export interface SheetProps {
  open: boolean;
  /** id of the heading that labels the dialog. */
  labelledBy: string;
  /** Amber kicker on the header (e.g. "TRANSMISIÓN 01 · 00:16"). */
  kicker: string;
  onClose: () => void;
  bodyClassName?: string;
  bodyRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}
