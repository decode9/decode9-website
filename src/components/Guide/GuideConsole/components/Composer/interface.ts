import type { RefObject } from 'react';

export interface ComposerProps {
  textareaRef: RefObject<HTMLTextAreaElement>;
  placeholder: string;
  label: string;
  sendLabel: string;
  disabled: boolean;
  maxLength: number;
  onSend: (text: string) => Promise<boolean>;
}
