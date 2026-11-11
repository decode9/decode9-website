import type { MetadataRoute } from 'next';
import { AUTHOR_NAME, PAGES, SITE_LANG, SITE_NAME } from '@/lib/seo/site';

export const dynamic = 'force-static';

const manifest = (): MetadataRoute.Manifest => ({
  name: `${AUTHOR_NAME} · ${SITE_NAME}`,
  short_name: SITE_NAME,
  description: PAGES.entry.description,
  lang: SITE_LANG,
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#0b0b10',
  theme_color: PAGES.entry.themeColor,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
});

export default manifest;
