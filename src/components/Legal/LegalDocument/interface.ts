import type { LegalKind } from '@/data/legal';
import type { Locale } from '@/i18n';

export interface LegalDocumentProps {
  locale: Locale;
  kind: LegalKind;
}
