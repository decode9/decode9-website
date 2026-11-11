import type { ReactNode } from 'react';

export interface UnitRow {
  label: string;
  value: ReactNode;
}

export interface TransmissionUnitProps {
  /** Portrait file name (PORTRAITS.*). */
  portrait: string;
  rows: readonly UnitRow[];
  /** Bigger portrait and wave (call screen). */
  large?: boolean;
}
