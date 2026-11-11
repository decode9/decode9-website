import type { LegalCopy, LegalEntity, LegalKind, LegalLocale } from '@/interfaces/legal';
import { LEGAL_EN } from './en';
import { LEGAL_ES } from './es';

/** Public identity of the person who operates decode9.codes. */
export const LEGAL_ENTITY: LegalEntity = {
  name: 'Jorge Bastidas Araujo',
  cuil: '20964746193',
  brand: 'decode9',
  website: 'https://decode9.codes',
  email: 'decode9.dev@gmail.com',
  whatsapp: '+1 (786) 531-8494',
  whatsappUrl: 'https://wa.me/17865318494',
};

export const LEGAL_KINDS: readonly LegalKind[] = ['privacy', 'terms'];
export const LEGAL_LOCALES: readonly LegalLocale[] = ['en', 'es'];
/** Language of the x-default alternate (the English URLs are the original ones). */
export const LEGAL_DEFAULT_LOCALE: LegalLocale = 'en';

/** Public paths; the trailing slash matches `trailingSlash: true` in the static export. */
export const LEGAL_PATHS: Record<LegalLocale, Record<LegalKind, string>> = {
  en: { privacy: '/privacy/', terms: '/terms/' },
  es: { privacy: '/es/privacidad/', terms: '/es/terminos/' },
};

export const LEGAL_COPY: Record<LegalLocale, LegalCopy> = { en: LEGAL_EN, es: LEGAL_ES };

export const legalPath = (locale: LegalLocale, kind: LegalKind): string => LEGAL_PATHS[locale][kind];

export const otherLegalLocale = (locale: LegalLocale): LegalLocale => (locale === 'es' ? 'en' : 'es');
