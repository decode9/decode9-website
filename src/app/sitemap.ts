import type { MetadataRoute } from 'next';
import { LEGAL_KINDS, LEGAL_LOCALES } from '@/data/legal';
import { legalAlternates, legalUrl } from '@/lib/seo/legalMetadata';
import { LEGAL_SEO, PAGES, SITE_URL } from '@/lib/seo/site';

export const dynamic = 'force-static';

const sitemap = (): MetadataRoute.Sitemap => [
  ...Object.values(PAGES).map((page) => ({
    url: `${SITE_URL}${page.path}`,
    changeFrequency: 'monthly' as const,
    priority: page.priority,
  })),
  ...LEGAL_KINDS.flatMap((kind) =>
    LEGAL_LOCALES.map((locale) => ({
      url: legalUrl(locale, kind),
      changeFrequency: 'yearly' as const,
      priority: LEGAL_SEO.priority,
      alternates: { languages: legalAlternates(kind, (code) => legalUrl(code, kind)) },
    })),
  ),
];

export default sitemap;
