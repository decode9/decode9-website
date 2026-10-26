import type { Locale } from '@/i18n';

export interface LocaleSwitchProps {
  current: Locale;
  label: string;
  /** Where each language points. Defaults to that locale's home. */
  hrefs?: Partial<Record<Locale, string>>;
}
