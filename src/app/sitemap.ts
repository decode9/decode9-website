import type { MetadataRoute } from 'next';
import { i18n, localeUrl } from '@/i18n';

export const dynamic = 'force-static';

const sitemap = (): MetadataRoute.Sitemap =>
  i18n.locales.map((locale) => ({
    url: localeUrl(locale),
    changeFrequency: 'monthly',
    priority: locale === i18n.defaultLocale ? 1 : 0.9,
    alternates: { languages: Object.fromEntries(i18n.locales.map((code) => [code, localeUrl(code)])) },
  }));

export default sitemap;
