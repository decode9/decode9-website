import type { AgentMessage } from '@/interfaces';

export interface MessageBubbleProps {
  message: AgentMessage;
  /** Guide lines are templates with `{name}`. */
  name: string;
  youLabel: string;
  attachmentLabel: string;
  attachmentHint: string;
  /** Animate on mount (new messages only). */
  animate: boolean;
}
