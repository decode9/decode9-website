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

export interface SeoDocument {
  path: string;
  title: string;
  description: string;
  /** Open Graph locale; the site default is Spanish. */
  ogLocale?: string;
  /** hreflang → path. */
  languages?: Record<string, string>;
}

/** Title, description, canonical, alternates, Open Graph and Twitter card of one document. */
export const buildDocumentMetadata = ({
  path,
  title,
  description,
  ogLocale = SITE_LOCALE,
  languages,
}: SeoDocument): Metadata => ({
  title,
  description,
  alternates: { canonical: path, ...(languages ? { languages } : {}) },
  openGraph: {
    type: 'website',
    locale: ogLocale,
    url: path,
    siteName: 'decode9',
    title,
    description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'decode9' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@decode9',
    creator: '@decode9',
    title,
    description,
    images: [OG_IMAGE],
  },
});

/** Per-route metadata: title, description, canonical and Open Graph. */
export const buildPageMetadata = (key: PageKey): Metadata => buildDocumentMetadata(PAGES[key]);

export const buildViewport = (themeColor: string): Viewport => ({
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor,
});

export const buildPageViewport = (key: PageKey): Viewport => buildViewport(PAGES[key].themeColor);
