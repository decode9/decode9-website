import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';
import { fontVariables } from '@/lib/fonts';
import { buildJsonLd } from '@/lib/seo/jsonLd';
import { gtagScript } from '@/lib/seo/inlineScripts';
import { SITE_LANG } from '@/lib/seo/site';
import type { RootDocumentProps } from './interface';
import '@/app/globals.css';

/** The single <html> shell (Spanish only): fonts, GA and JSON-LD. */
const RootDocument = ({ children }: RootDocumentProps) => {
  const jsonLd = JSON.stringify(buildJsonLd());

  return (
    <html lang={SITE_LANG} className={fontVariables} translate="no" suppressHydrationWarning>
      {/* App Router root layouts own <head>; the rule targets the pages router. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </head>
      <body>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {gtagScript(GA_ID)}
        </Script>
        {children}
      </body>
    </html>
  );
};

export default RootDocument;
