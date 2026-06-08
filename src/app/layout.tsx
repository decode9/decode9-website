import type { Metadata } from 'next';
import Script from 'next/script';
import { Space_Grotesk, Manrope, Chakra_Petch, JetBrains_Mono } from 'next/font/google';
import { GA_ID } from '@/lib/analytics';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-label',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-code',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://decode9.codes'),
  title: 'decode9 — Jorge Bastidas · Senior Full Stack Developer',
  description: 'Senior full stack developer with 10+ years building scalable architecture, automation systems, and production MVPs for founders and product teams.',
  keywords: [
    'Jorge Bastidas',
    'decode9',
    'Full Stack Developer',
    'Software Engineer',
    'Scalable Architecture',
    'Automation',
    'MVP Development',
    'DevOps',
    'AI',
    'TypeScript',
    'React',
    'Node.js',
  ],
  authors: [{ name: 'Jorge Bastidas', url: 'https://github.com/decode9' }],
  creator: 'Jorge Bastidas',
  icons: {
    icon: [{ url: '/brand/favicon.png', type: 'image/png' }],
    shortcut: '/brand/favicon.png',
    apple: '/brand/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://decode9.codes/',
    siteName: 'decode9',
    title: 'decode9 — Jorge Bastidas · Senior Full Stack Developer',
    description: 'Senior full stack developer. 10+ years building scalable architecture, automation, and MVPs that move businesses faster.',
    images: [
      {
        url: '/brand/decode9-og.png',
        width: 1200,
        height: 630,
        alt: 'decode9 — Jorge Bastidas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@decode9',
    creator: '@decode9',
    title: 'decode9 — Jorge Bastidas · Senior Full Stack Developer',
    description: 'Senior full stack developer. 10+ years building scalable architecture, automation, and MVPs that move businesses faster.',
    images: ['/brand/decode9-og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${spaceGrotesk.variable} ${manrope.variable} ${chakraPetch.variable} ${jetbrainsMono.variable}`}
      translate="no"
    >
      <head>
        <meta name="google" content="notranslate" />
        <meta name="theme-color" content="#0B0C0E" />
      </head>
      <body className="bg-ink-950 text-ink-100 antialiased font-body">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-red focus:text-white focus:rounded"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
