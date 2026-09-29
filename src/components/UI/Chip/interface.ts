import type { ReactNode } from 'react';

export interface ChipProps {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
}
