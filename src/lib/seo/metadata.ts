import type { Metadata, Viewport } from 'next';
import { PAGES, SITE_LOCALE, SITE_URL, type PageKey } from './site';

const OG_IMAGE = '/brand/decode9-og.jpg';

/** Defaults shared by every route (root layout). */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PAGES.entry.title,
  description: PAGES.entry.description,
  keywords: ['Jorge Bastidas', 'decode9', 'CTO', 'The Empire', 'Full Stack', 'Agentes de IA', 'Automatización', 'TypeScript'],
  authors: [{ name: 'Jorge Bastidas', url: 'https://github.com/decode9' }],
  creator: 'Jorge Bastidas',
  icons: {
    icon: [{ url: '/brand/favicon.png', type: 'image/png' }],
    shortcut: '/brand/favicon.png',
    apple: '/brand/favicon.png',
  },
  other: {
    'google-adsense-account': 'ca-pub-1675722214703683',
    google: 'notranslate',
  },
};

/** Per-route metadata: title, description, canonical and Open Graph. */
export const buildPageMetadata = (key: PageKey): Metadata => {
  const page = PAGES[key];
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: 'website',
      locale: SITE_LOCALE,
      url: page.path,
      siteName: 'decode9',
      title: page.title,
      description: page.description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'decode9' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@decode9',
      creator: '@decode9',
      title: page.title,
      description: page.description,
      images: [OG_IMAGE],
    },
  };
};

export const buildPageViewport = (key: PageKey): Viewport => ({
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: PAGES[key].themeColor,
});
