import type { ReactNode } from 'react';
import type { Locale } from '@/i18n';

export interface RootDocumentProps {
  locale: Locale;
  children: ReactNode;
}
