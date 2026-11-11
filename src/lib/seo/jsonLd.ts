import { PAGES, SITE_LANG, SITE_URL } from './site';

/** Structured data: who Jorge / decode9 is, for search engines. */
export const buildJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#jorge`,
      name: 'Jorge Bastidas',
      alternateName: 'decode9',
      description: PAGES.profile.description,
      jobTitle: ['Senior Full Stack Engineer', 'CTO'],
      worksFor: { '@type': 'Organization', name: 'The Empire', url: 'https://theempire.tech' },
      url: `${SITE_URL}${PAGES.profile.path}`,
      image: `${SITE_URL}/brand/decode9-og.jpg`,
      email: 'mailto:decode9.dev@gmail.com',
      sameAs: ['https://github.com/decode9', 'https://www.linkedin.com/in/decode9/'],
      knowsAbout: ['Arquitectura de software', 'Agentes de IA', 'Automatización', 'Serverless', 'TypeScript', 'React', 'Node.js'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'decode9',
      description: PAGES.entry.description,
      inLanguage: SITE_LANG,
      publisher: { '@id': `${SITE_URL}/#jorge` },
      author: { '@id': `${SITE_URL}/#jorge` },
    },
  ],
});
