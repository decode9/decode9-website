import type { RefObject } from 'react';
import type { GuideContextValue } from '@/context/GuideContext';

export interface StatusCopy {
  connecting: string;
  ready: string;
  thinking: string;
  offline: string;
}

export interface UseGuideConsoleReturn {
  panelRef: RefObject<HTMLDivElement>;
  composerRef: RefObject<HTMLTextAreaElement>;
  isMobile: boolean;
  statusLabel: string;
  thinking: boolean;
  /** Sending is paused after a rate limit. */
  cooling: boolean;
}

export type GuideConsoleState = Pick<GuideContextValue, 'isOpen' | 'close' | 'live' | 'status' | 'cooldownUntil'>;
