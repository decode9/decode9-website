import type { Metadata, Viewport } from 'next';
import { LEGAL_COPY, LEGAL_DEFAULT_LOCALE, LEGAL_ENTITY, LEGAL_LOCALES, legalPath, otherLegalLocale } from '@/data/legal';
import type { LegalKind, LegalLocale } from '@/interfaces/legal';
import { buildDocumentMetadata, buildViewport } from './metadata';
import { LEGAL_SEO, SITE_NAME, SITE_URL } from './site';

export const legalUrl = (locale: LegalLocale, kind: LegalKind): string => `${SITE_URL}${legalPath(locale, kind)}`;

/** hreflang alternates EN ↔ ES of one legal document, plus x-default. */
export const legalAlternates = (
  kind: LegalKind,
  toHref: (locale: LegalLocale) => string = (code) => legalPath(code, kind),
) => ({
  ...Object.fromEntries(LEGAL_LOCALES.map((code) => [code, toHref(code)])),
  'x-default': toHref(LEGAL_DEFAULT_LOCALE),
});

export const buildLegalMetadata = (locale: LegalLocale, kind: LegalKind): Metadata => {
  const page = LEGAL_COPY[locale][kind];
  return buildDocumentMetadata({
    path: legalPath(locale, kind),
    title: page.metaTitle,
    description: page.metaDescription,
    image: { url: LEGAL_SEO.image.url, alt: LEGAL_SEO.image.alt[locale] },
    ogLocale: LEGAL_SEO.ogLocale[locale],
    alternateLocale: [LEGAL_SEO.ogLocale[otherLegalLocale(locale)]],
    languages: legalAlternates(kind),
  });
};

export const legalViewport: Viewport = buildViewport(LEGAL_SEO.themeColor);

/** WebPage structured data published by the legal person (name and tax ID). */
export const buildLegalJsonLd = (locale: LegalLocale, kind: LegalKind): string =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: LEGAL_COPY[locale][kind].metaTitle,
    url: legalUrl(locale, kind),
    description: LEGAL_COPY[locale][kind].metaDescription,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, url: `${SITE_URL}/` },
    publisher: {
      '@type': 'Person',
      name: LEGAL_ENTITY.name,
      taxID: LEGAL_ENTITY.cuil,
      email: LEGAL_ENTITY.email,
      telephone: '+1-786-531-8494',
      url: SITE_URL,
    },
  });
