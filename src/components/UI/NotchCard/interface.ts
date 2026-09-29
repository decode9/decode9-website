import type { CSSProperties, ReactNode } from 'react';

export interface NotchCardProps {
  children: ReactNode;
  className?: string;
  notchSize?: 'md' | 'lg';
  hover?: boolean;
  /** Colour of the corner accent (defaults to the scene accent). */
  accent?: string;
  style?: CSSProperties;
}
