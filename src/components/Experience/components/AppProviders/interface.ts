import type { ReactNode } from 'react';
import type { Dictionary, Locale } from '@/i18n';

export interface AppProvidersProps {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}
