import type { ReactNode } from 'react';

export interface ErrorBoxProps {
  message: string;
  tone?: 'error' | 'info';
  action?: ReactNode;
}
