/** Public origin of the site (GitHub Pages + CNAME). */
export const SITE_URL = 'https://decode9.codes';
export const SITE_NAME = 'decode9';
export const AUTHOR_NAME = 'Jorge Bastidas';

/** The site is Spanish only (Latin American audience); the terminal offers ES/EN inside the page. */
export const SITE_LANG = 'es';
/** BCP 47 tag of the content (JSON-LD inLanguage): Spanish for Latin America. */
export const CONTENT_LANG = 'es-419';
/** Open Graph locale: Facebook/LinkedIn know es_LA (not es_419). Used everywhere in Spanish. */
export const SITE_LOCALE = 'es_LA';

export type PageKey = 'entry' | 'terminal' | 'transmitter' | 'profile';

export interface OgImage {
  url: string;
  alt: string;
}

export interface PageSeo {
  path: string;
  /** 50–60 characters, already branded (rendered with title.absolute). */
  title: string;
  /** 140–160 characters. */
  description: string;
  image: OgImage;
  themeColor: string;
  priority: number;
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const OG_IMAGES = {
  entry: {
    url: '/og/entrada.jpg',
    alt: 'Jorge Bastidas · decode9: la entrada «Elige tu lado», con el lado rojo de decode9 y el lado azul del perfil profesional.',
  },
  terminal: {
    url: '/og/terminal.jpg',
    alt: 'decode9 · Terminal: escritorio rojo con el escaneo del demonoide, el expediente D9-09 y la bitácora.',
  },
  transmitter: {
    url: '/og/transmisor.jpg',
    alt: 'decode9 · Transmisor: pantalla del transmisor de emergencia en el celular con la llamada entrante en 147.9.',
  },
  profile: {
    url: '/og/perfil.jpg',
    alt: 'Jorge Bastidas, CTO de The Empire: perfil profesional en 3D con el planeta Origen y sus capítulos.',
  },
} as const satisfies Record<PageKey, OgImage>;

/**
 * One entry per route. Copy comes from the visible content of each page (entrada, terminal,
 * transmisor y src/data/profile/chapters.ts).
 */
export const PAGES: Record<PageKey, PageSeo> = {
  entry: {
    path: '/',
    title: 'Jorge Bastidas · decode9 — Elige tu lado: hacker o CTO',
    description:
      'Elige tu lado: decode9, la versión investigadora de Jorge Bastidas, o su perfil profesional como CTO de The Empire en arquitectura, IA y automatización.',
    image: OG_IMAGES.entry,
    themeColor: '#0b0b10',
    priority: 1,
  },
  terminal: {
    path: '/decode9/',
    title: 'Terminal decode9: archivos del investigador del Averno',
    description:
      'La terminal de decode9: manifiesto, expediente de origen, laboratorio, códice de razas y lugares, señales y publicaciones. La versión hacker de Jorge Bastidas.',
    image: OG_IMAGES.terminal,
    themeColor: '#0b0101',
    priority: 0.8,
  },
  transmitter: {
    path: '/decode9/movil/',
    title: 'Transmisor decode9: contacto, videos, lecturas y audios',
    description:
      'Transmisor de emergencia de decode9 para el celular: contacto directo con Jorge Bastidas en 147.9, más estaciones de videos, lecturas y audios del investigador.',
    image: OG_IMAGES.transmitter,
    themeColor: '#0b0101',
    priority: 0.6,
  },
  profile: {
    path: '/perfil/',
    title: 'Jorge Bastidas, CTO de The Empire · Ingeniero full stack',
    description:
      'Jorge Bastidas, CTO de The Empire e ingeniero full stack desde 2014: arquitectura, agentes de IA, automatización y productos como Solvo, Finami y Desaparecidos.',
    image: OG_IMAGES.profile,
    themeColor: '#121831',
    priority: 0.9,
  },
};

export const pageUrl = (key: PageKey): string => `${SITE_URL}${PAGES[key].path}`;
export const absoluteUrl = (path: string): string => `${SITE_URL}${path}`;

/** Facts about Jorge shown on the site (entrada, perfil, páginas legales). */
export const PERSON = {
  name: AUTHOR_NAME,
  alternateName: SITE_NAME,
  jobTitle: 'CTO',
  worksFor: { name: 'The Empire', url: 'https://theempire.tech' },
  email: 'decode9.dev@gmail.com',
  /** Frontal portrait of the entry page. */
  image: '/entrada/frames/f03.webp',
  /** Only profiles linked from the site's own content. */
  sameAs: ['https://github.com/decode9'],
  /** Languages of the chapter «Bitácora» (Base). */
  knowsLanguage: ['es', 'en'],
  /** Chapter «Kit de terraformación» of the profile (src/data/profile/chapters.ts). */
  knowsAbout: [
    'Arquitectura de software',
    'Desarrollo full stack',
    'Liderazgo técnico',
    'Agentes LLM',
    'RAG',
    'MCP',
    'Automatización con n8n',
    'TypeScript',
    'Python',
    'Kotlin',
    'React',
    'Next.js',
    'React Native',
    'Node.js',
    'NestJS',
    'FastAPI',
    'AWS Lambda',
    'Terraform',
    'Docker',
    'Kubernetes',
    'GitHub Actions',
    'PostgreSQL',
  ],
} as const;

/** Legal pages (/privacy/, /terms/, /es/privacidad/, /es/terminos/): sober dark page, low sitemap priority. */
export const LEGAL_SEO = {
  themeColor: '#0b0b10',
  priority: 0.3,
  ogLocale: { es: SITE_LOCALE, en: 'en_US' },
  image: {
    url: OG_IMAGES.entry.url,
    alt: { es: 'decode9.codes · Jorge Bastidas', en: 'decode9.codes · Jorge Bastidas' },
  },
} as const;
