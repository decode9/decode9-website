import type { LegalKind, LegalLocale } from '@/interfaces/legal';

export interface LegalDocumentProps {
  locale: LegalLocale;
  kind: LegalKind;
  /** WebPage JSON-LD, built by the page (lib/seo) and injected as is. */
  jsonLd: string;
}

/** One row of the operator card. */
export interface LegalFact {
  id: 'name' | 'cuil' | 'brand' | 'website' | 'email' | 'whatsapp';
  term: string;
  value: string;
  href?: string;
  external?: boolean;
  /** Name and CUIL span the whole row and stand out. */
  emphasis?: boolean;
}

export interface LegalLink {
  href: string;
  label: string;
  current: boolean;
}
