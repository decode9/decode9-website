import type { Metadata } from 'next';
import { legalPath, type LegalKind } from '@/data/legal';
import { i18n, type Locale } from '@/i18n';
import { getDictionary } from '@/i18n/get-dictionary';

export const buildLegalMetadata = (locale: Locale, kind: LegalKind): Metadata => {
  const page = getDictionary(locale).legal[kind];
  const path = legalPath(locale, kind);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(i18n.locales.map((code) => [code, legalPath(code, kind)])),
        'x-default': legalPath(i18n.defaultLocale, kind),
      },
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: path,
    },
    twitter: {
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
};
