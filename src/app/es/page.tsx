import type { Metadata } from 'next';

/** Old Spanish URL (/es/) of the previous site: sends visitors to the entry page. */
export const metadata: Metadata = {
  title: 'decode9',
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
};

const REDIRECT_SCRIPT = "location.replace('/'+location.search+location.hash)";

const LegacySpanishRedirect = () => (
  <>
    <meta httpEquiv="refresh" content="0; url=/" />
    <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
    <p>
      <a href="/">decode9.codes</a>
    </p>
  </>
);

export default LegacySpanishRedirect;
