import type { MetadataRoute } from 'next';
import { LEGAL_KINDS, legalUrl } from '@/data/legal';
import { i18n, localeUrl } from '@/i18n';

export const dynamic = 'force-static';

const languages = (urlFor: (locale: (typeof i18n.locales)[number]) => string) =>
  Object.fromEntries(i18n.locales.map((code) => [code, urlFor(code)]));

const sitemap = (): MetadataRoute.Sitemap => [
  ...i18n.locales.map((locale) => ({
    url: localeUrl(locale),
    changeFrequency: 'monthly' as const,
    priority: locale === i18n.defaultLocale ? 1 : 0.9,
    alternates: { languages: languages(localeUrl) },
  })),
  ...LEGAL_KINDS.flatMap((kind) =>
    i18n.locales.map((locale) => ({
      url: legalUrl(locale, kind),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
      alternates: { languages: languages((code) => legalUrl(code, kind)) },
    })),
  ),
];

export default sitemap;
