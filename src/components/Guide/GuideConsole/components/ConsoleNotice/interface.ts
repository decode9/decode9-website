import type { NoticeKind } from '@/hooks/useAgentConversation';

export interface ConsoleNoticeProps {
  kind: NoticeKind;
  messages: Record<string, string>;
  cooldownUntil: number | null;
  onDismiss: () => void;
  dismissLabel: string;
}
