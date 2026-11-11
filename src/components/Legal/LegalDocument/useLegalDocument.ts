import { LEGAL_COPY, LEGAL_ENTITY, LEGAL_KINDS, legalPath, otherLegalLocale } from '@/data/legal';
import type { LegalKind, LegalLocale } from '@/interfaces/legal';
import { withBase } from '@/utils/asset';
import type { LegalFact, LegalLink } from './interface';

/** Everything the legal page renders, derived from the typed data (no state: it renders on the server). */
const useLegalDocument = (locale: LegalLocale, kind: LegalKind) => {
  const copy = LEGAL_COPY[locale];
  const { labels } = copy;
  const other = otherLegalLocale(locale);

  const facts: LegalFact[] = [
    { id: 'name', term: labels.legalName, value: LEGAL_ENTITY.name, emphasis: true },
    { id: 'cuil', term: labels.cuil, value: LEGAL_ENTITY.cuil, emphasis: true },
    { id: 'brand', term: labels.brand, value: LEGAL_ENTITY.brand },
    { id: 'website', term: labels.website, value: LEGAL_ENTITY.website, href: withBase('/') },
    { id: 'email', term: labels.email, value: LEGAL_ENTITY.email, href: `mailto:${LEGAL_ENTITY.email}` },
    {
      id: 'whatsapp',
      term: labels.whatsapp,
      value: LEGAL_ENTITY.whatsapp,
      href: LEGAL_ENTITY.whatsappUrl,
      external: true,
    },
  ];

  const documents: LegalLink[] = LEGAL_KINDS.map((k) => ({
    href: withBase(legalPath(locale, k)),
    label: labels[k],
    current: k === kind,
  }));

  return {
    labels,
    page: copy[kind],
    updated: copy.updated,
    facts,
    documents,
    home: withBase('/'),
    translation: { href: withBase(legalPath(other, kind)), label: labels.otherLanguage, lang: other },
  };
};

export default useLegalDocument;
