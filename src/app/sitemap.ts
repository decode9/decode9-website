import type { MetadataRoute } from 'next';
import { PAGES, SITE_URL } from '@/lib/seo/site';

export const dynamic = 'force-static';

const sitemap = (): MetadataRoute.Sitemap =>
  Object.values(PAGES).map((page) => ({
    url: `${SITE_URL}${page.path}`,
    changeFrequency: 'monthly',
    priority: page.priority,
  }));

export default sitemap;
