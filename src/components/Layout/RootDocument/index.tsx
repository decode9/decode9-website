import Script from 'next/script';
import { getDictionary } from '@/i18n';
import { GA_ID } from '@/lib/analytics';
import { fontVariables } from '@/lib/fonts';
import { buildJsonLd } from '@/lib/seo/jsonLd';
import { bootScript, gtagScript } from '@/lib/seo/inlineScripts';
import type { RootDocumentProps } from './interface';
import 'lenis/dist/lenis.css';
import '@/app/globals.css';

/** The <html> shell shared by every locale's root layout. */
const RootDocument = ({ locale, children }: RootDocumentProps) => {
  const dictionary = getDictionary(locale);
  const jsonLd = JSON.stringify(buildJsonLd(locale, dictionary));

  return (
    <html lang={locale} className={fontVariables} translate="no" data-boot="full" suppressHydrationWarning>
      {/* App Router root layouts own <head>; the rule targets the pages router. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta name="theme-color" content="#0B0C0E" />
        <script dangerouslySetInnerHTML={{ __html: bootScript(locale === 'en') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </head>
      <body className="bg-ink-950 text-ink-100 antialiased font-body">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {gtagScript(GA_ID)}
        </Script>
        <a href="#main" className="d9-skip-link">
          {dictionary.nav.skip}
        </a>
        {children}
      </body>
    </html>
  );
};

export default RootDocument;
