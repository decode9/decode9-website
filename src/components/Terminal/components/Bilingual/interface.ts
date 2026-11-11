import type { Bilingual } from '@/interfaces/terminal';

export interface BilingualProps {
  /** [es, en] pair, or a plain string shown in both languages. */
  t: Bilingual | string;
}
