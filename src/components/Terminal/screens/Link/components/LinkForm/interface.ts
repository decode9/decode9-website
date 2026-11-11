import type { SignalGateway } from '@/interfaces/signal';
import type { TerminalLang } from '@/interfaces/terminal';
import type { TxBus } from '../../txBus';

export interface LinkFormProps {
  bus: TxBus;
  gateway: SignalGateway;
  /** Login name: prefills the alias. */
  user: string | null;
  lang: TerminalLang;
}
