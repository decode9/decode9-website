/** Public origin of the site (GitHub Pages + CNAME). */
export const SITE_URL = 'https://decode9.codes';

/** The site is Spanish only; the terminal offers ES/EN inside the page. */
export const SITE_LANG = 'es';
export const SITE_LOCALE = 'es_ES';

export type PageKey = 'entry' | 'terminal' | 'transmitter' | 'profile';

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  themeColor: string;
  priority: number;
}

/** One entry per route; titles and descriptions are the ones of the original HTML pages. */
export const PAGES: Record<PageKey, PageSeo> = {
  entry: {
    path: '/',
    title: 'Elige tu lado',
    description:
      'Elige tu lado: My Hacker Mode entra a decode9, la versión investigadora; My Professional Mode, al perfil profesional de Jorge Bastidas.',
    themeColor: '#0b0b10',
    priority: 1,
  },
  terminal: {
    path: '/decode9/',
    title: 'decode9 · Terminal',
    description: 'decode9 · archivos del investigador del Averno.',
    themeColor: '#0b0101',
    priority: 0.9,
  },
  transmitter: {
    path: '/decode9/movil/',
    title: 'decode9 · Transmisor',
    description: 'decode9 · transmisor de emergencia. Contacto, transmisiones, bitácoras y audios.',
    themeColor: '#0b0101',
    priority: 0.7,
  },
  profile: {
    path: '/perfil/',
    title: 'Jorge Bastidas · Perfil',
    description:
      'Jorge Bastidas terraforma ideas: viaja por una galaxia de mundos y los convierte en sistemas completos. Perfil profesional.',
    themeColor: '#121831',
    priority: 0.9,
  },
};

export const pageUrl = (key: PageKey): string => `${SITE_URL}${PAGES[key].path}`;
