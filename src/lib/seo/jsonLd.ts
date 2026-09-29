import { localeUrl, SITE_URL, type Dictionary, type Locale } from '@/i18n';

/** Structured data: who decode9 is, for search engines. */
export const buildJsonLd = (locale: Locale, dictionary: Dictionary) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#jorge`,
      name: 'Jorge Bastidas',
      alternateName: 'decode9',
      jobTitle: ['Senior Full Stack Engineer', 'CTO'],
      worksFor: { '@type': 'Organization', name: 'The Empire', url: 'https://theempire.tech' },
      url: SITE_URL,
      image: `${SITE_URL}/brand/decode9-og.jpg`,
      email: 'mailto:jbastidas@theempire.tech',
      sameAs: ['https://github.com/decode9', 'https://www.linkedin.com/in/decode9/'],
      knowsAbout: ['Software architecture', 'AI agents', 'Automation', 'Serverless', 'TypeScript', 'React', 'Node.js'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: localeUrl(locale),
      name: 'decode9',
      description: dictionary.meta.description,
      inLanguage: locale,
      publisher: { '@id': `${SITE_URL}/#jorge` },
    },
  ],
});
