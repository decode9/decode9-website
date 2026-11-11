import type { MetadataRoute } from 'next';
import { LEGAL_KINDS, LEGAL_LOCALES } from '@/data/legal';
import { legalAlternates, legalUrl } from '@/lib/seo/legalMetadata';
import { LEGAL_SEO, PAGES, SITE_URL } from '@/lib/seo/site';

export const dynamic = 'force-static';

/**
 * Every indexable route with the build date as lastmod. /decode9/movil/ is listed with its own
 * canonical: it is not a responsive copy of /decode9/ but a different page (transmitter, contact form).
 */
const sitemap = (): MetadataRoute.Sitemap => {
  const lastModified = new Date();
  return [
    ...Object.values(PAGES).map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: page.priority,
    })),
    ...LEGAL_KINDS.flatMap((kind) =>
      LEGAL_LOCALES.map((locale) => ({
        url: legalUrl(locale, kind),
        lastModified,
        changeFrequency: 'yearly' as const,
        priority: LEGAL_SEO.priority,
        alternates: { languages: legalAlternates(kind, (code) => legalUrl(code, kind)) },
      })),
    ),
  ];
};

export default sitemap;
