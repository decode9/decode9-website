import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';
import { fontVariables } from '@/lib/fonts';
import { gtagScript } from '@/lib/seo/inlineScripts';
import { SITE_LANG } from '@/lib/seo/site';
import type { RootDocumentProps } from './interface';
import '@/app/globals.css';

/** The single <html> shell (Spanish only): fonts and GA. Each page brings its own JSON-LD. */
const RootDocument = ({ children }: RootDocumentProps) => {
  return (
    <html lang={SITE_LANG} className={fontVariables} translate="no" suppressHydrationWarning>
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
