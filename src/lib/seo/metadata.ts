import type { Metadata } from 'next';
import { i18n, localePath, SITE_URL, type Dictionary, type Locale } from '@/i18n';

const OG_IMAGE = '/brand/decode9-og.jpg';

export const buildMetadata = (locale: Locale, dictionary: Dictionary): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title: dictionary.meta.title,
  description: dictionary.meta.description,
  keywords: [
    'Jorge Bastidas',
    'decode9',
    'CTO',
    'The Empire',
    'Full Stack Engineer',
    'AI agents',
    'Solvo',
    'Scalable Architecture',
    'Automation',
    'MVP Development',
    'Serverless',
    'TypeScript',
  ],
  authors: [{ name: 'Jorge Bastidas', url: 'https://github.com/decode9' }],
  creator: 'Jorge Bastidas',
  alternates: {
    canonical: localePath(locale),
    languages: {
      ...Object.fromEntries(i18n.locales.map((code) => [code, localePath(code)])),
      'x-default': localePath(i18n.defaultLocale),
    },
  },
  icons: {
    icon: [{ url: '/brand/favicon.png', type: 'image/png' }],
    shortcut: '/brand/favicon.png',
    apple: '/brand/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: dictionary.meta.locale,
    url: localePath(locale),
    siteName: 'decode9',
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: dictionary.meta.ogAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@decode9',
    creator: '@decode9',
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    images: [OG_IMAGE],
  },
  other: {
    'google-adsense-account': 'ca-pub-1675722214703683',
    google: 'notranslate',
  },
});
