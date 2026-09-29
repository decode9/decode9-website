import type { IdentifyData } from '@/interfaces';
import type { IdentifyOutcome } from '@/hooks/useAgentConversation';

export interface IdentifyCopy {
  title: string;
  name: string;
  email: string;
  submit: string;
  sending: string;
  done: string;
  notAllowed: string;
  error: string;
  mailto: string;
}

export interface IdentifyFormProps {
  copy: IdentifyCopy;
  /** The backend only accepts details from visitors who already wrote. */
  canIdentify: boolean;
  mailto: string;
  onIdentify: (data: IdentifyData) => Promise<IdentifyOutcome>;
}
