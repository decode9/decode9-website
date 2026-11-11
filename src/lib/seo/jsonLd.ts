import { CONTENT_LANG, OG_IMAGE_SIZE, PAGES, PERSON, SITE_NAME, SITE_URL, absoluteUrl, type PageKey } from './site';

/** Stable node ids so every page's graph points at the same Person and WebSite. */
export const JSON_LD_IDS = {
  person: `${SITE_URL}/#jorge`,
  website: `${SITE_URL}/#website`,
  page: (key: PageKey) => `${absoluteUrl(PAGES[key].path)}#webpage`,
} as const;

/** Pages whose main subject is Jorge himself: they carry the full Person node. */
const PERSON_PAGES: readonly PageKey[] = ['entry', 'profile'];

const ref = (id: string) => ({ '@id': id });

const buildPerson = () => ({
  '@type': 'Person',
  '@id': JSON_LD_IDS.person,
  name: PERSON.name,
  alternateName: PERSON.alternateName,
  description: PAGES.profile.description,
  jobTitle: PERSON.jobTitle,
  worksFor: { '@type': 'Organization', name: PERSON.worksFor.name, url: PERSON.worksFor.url },
  url: absoluteUrl(PAGES.profile.path),
  image: absoluteUrl(PERSON.image),
  email: `mailto:${PERSON.email}`,
  sameAs: [...PERSON.sameAs],
  knowsLanguage: [...PERSON.knowsLanguage],
  knowsAbout: [...PERSON.knowsAbout],
});

/** Minimal node elsewhere, so the publisher/author references resolve inside every page. */
const buildPersonRef = () => ({ '@type': 'Person', '@id': JSON_LD_IDS.person, name: PERSON.name, url: absoluteUrl(PAGES.profile.path) });

const buildWebSite = () => ({
  '@type': 'WebSite',
  '@id': JSON_LD_IDS.website,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  alternateName: `${PERSON.name} · ${SITE_NAME}`,
  description: PAGES.entry.description,
  inLanguage: CONTENT_LANG,
  publisher: ref(JSON_LD_IDS.person),
  author: ref(JSON_LD_IDS.person),
});

const buildWebPage = (key: PageKey) => {
  const page = PAGES[key];
  const isProfile = key === 'profile';
  return {
    '@type': isProfile ? 'ProfilePage' : 'WebPage',
    '@id': JSON_LD_IDS.page(key),
    url: absoluteUrl(page.path),
    name: page.title,
    description: page.description,
    inLanguage: CONTENT_LANG,
    isPartOf: ref(JSON_LD_IDS.website),
    author: ref(JSON_LD_IDS.person),
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(page.image.url),
      ...OG_IMAGE_SIZE,
      caption: page.image.alt,
    },
    ...(isProfile ? { mainEntity: ref(JSON_LD_IDS.person) } : { about: ref(JSON_LD_IDS.person) }),
  };
};

/** Structured data of one route: WebSite + its WebPage (ProfilePage on /perfil/), plus the full Person where Jorge is the subject. */
export const buildJsonLd = (key: PageKey) => ({
  '@context': 'https://schema.org',
  '@graph': [
    buildWebSite(),
    buildWebPage(key),
    PERSON_PAGES.includes(key) ? buildPerson() : buildPersonRef(),
  ],
});

export const serializeJsonLd = (key: PageKey): string => JSON.stringify(buildJsonLd(key)).replace(/</g, '\\u003c');
