import type { AgentMessage } from '@/interfaces';

export interface TranscriptProps {
  messages: AgentMessage[];
  name: string;
  label: string;
  /** Announce new messages to screen readers (only while the console is open). */
  live: boolean;
  thinking: boolean;
  thinkingLabel: string;
  youLabel: string;
  attachmentLabel: string;
  attachmentHint: string;
}
