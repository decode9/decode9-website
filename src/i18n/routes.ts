import { i18n, type Locale } from './config';

export const SITE_URL = 'https://decode9.codes';

/** Static route of each locale (trailingSlash is on). */
export const localePath = (locale: Locale): string => (locale === i18n.defaultLocale ? '/' : `/${locale}/`);

export const localeUrl = (locale: Locale): string => `${SITE_URL}${localePath(locale)}`;

export const isLocale = (value: string | undefined | null): value is Locale =>
  i18n.locales.some((locale) => locale === value);

/** Cookie remembering an explicit language choice (also honoured by the first-visit redirect). */
export const LOCALE_COOKIE = 'NEXT_LOCALE';
