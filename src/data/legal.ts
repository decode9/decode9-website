import { SITE_URL, type Locale } from '@/i18n';

/** Public identity of the person who operates decode9.codes. */
export const LEGAL_ENTITY = {
  name: 'Jorge Bastidas Araujo',
  cuil: '20964746193',
  brand: 'decode9',
} as const;

export const LEGAL_KINDS = ['privacy', 'terms'] as const;

export type LegalKind = (typeof LEGAL_KINDS)[number];

/** Trailing slash matches `trailingSlash: true` in the static export. */
export const LEGAL_PATHS: Record<Locale, Record<LegalKind, string>> = {
  en: { privacy: '/privacy/', terms: '/terms/' },
  es: { privacy: '/es/privacidad/', terms: '/es/terminos/' },
};

export const legalPath = (locale: Locale, kind: LegalKind): string => LEGAL_PATHS[locale][kind];

export const legalUrl = (locale: Locale, kind: LegalKind): string => `${SITE_URL}${legalPath(locale, kind)}`;
