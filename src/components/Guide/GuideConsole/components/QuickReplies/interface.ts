import type { QuickReplyId } from '@/interfaces';

export interface QuickReplyOption {
  id: QuickReplyId;
  label: string;
}

export interface QuickRepliesProps {
  label: string;
  options: QuickReplyOption[];
  disabled: boolean;
  onSelect: (id: QuickReplyId) => void;
}
