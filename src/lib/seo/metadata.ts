import type { Metadata, Viewport } from 'next';
import { AUTHOR_NAME, OG_IMAGE_SIZE, PAGES, SITE_LOCALE, SITE_NAME, SITE_URL, type OgImage, type PageKey } from './site';

/** Defaults shared by every route (root layout); pages override title, description and Open Graph. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: PAGES.entry.title, template: `%s · ${SITE_NAME}` },
  description: PAGES.entry.description,
  keywords: [
    'Jorge Bastidas',
    'decode9',
    'CTO The Empire',
    'ingeniero full stack',
    'arquitectura de software',
    'inteligencia artificial',
    'automatización',
    'liderazgo técnico',
  ],
  authors: [{ name: AUTHOR_NAME, url: `${SITE_URL}${PAGES.profile.path}` }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  formatDetection: { telephone: false, email: false, address: false },
  other: {
    'google-adsense-account': 'ca-pub-1675722214703683',
    google: 'notranslate',
  },
};

export interface SeoDocument {
  path: string;
  title: string;
  description: string;
  image: OgImage;
  /** Open Graph locale; the site default is Latin American Spanish. */
  ogLocale?: string;
  /** Other Open Graph locales of the same document. */
  alternateLocale?: string[];
  /** hreflang → path. */
  languages?: Record<string, string>;
}

/**
 * Title, description, canonical, alternates, Open Graph and Twitter card of one document.
 * There is no twitter:site/creator: the site does not link any X/Twitter account.
 */
export const buildDocumentMetadata = ({
  path,
  title,
  description,
  image,
  ogLocale = SITE_LOCALE,
  alternateLocale,
  languages,
}: SeoDocument): Metadata => ({
  title: { absolute: title },
  description,
  alternates: { canonical: path, ...(languages ? { languages } : {}) },
  openGraph: {
    type: 'website',
    locale: ogLocale,
    ...(alternateLocale ? { alternateLocale } : {}),
    url: path,
    siteName: SITE_NAME,
    title,
    description,
    images: [{ url: image.url, ...OG_IMAGE_SIZE, alt: image.alt, type: 'image/jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: image.url, alt: image.alt }],
  },
});

/** Per-route metadata: title, description, canonical, Open Graph and Twitter card. */
export const buildPageMetadata = (key: PageKey): Metadata => buildDocumentMetadata(PAGES[key]);

export const buildViewport = (themeColor: string): Viewport => ({
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor,
});

export const buildPageViewport = (key: PageKey): Viewport => buildViewport(PAGES[key].themeColor);
