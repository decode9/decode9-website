import type { PageSummaryCopy } from '@/interfaces/seo';
import { LEGAL_COPY, legalPath } from '@/data/legal';
import { CHAPTERS } from '@/data/profile/chapters';
import { ENTRY_ROUTES } from '@/data/entry';

/**
 * Indexable summary of each interactive page. Every sentence repeats copy that is visible on the
 * page once it mounts (entrada, terminal, transmisor, capítulos del perfil): no hidden keywords.
 */
const ENTRY = '/';
const LEGAL_LINKS = [
  { href: legalPath('es', 'privacy'), label: LEGAL_COPY.es.labels.privacy },
  { href: legalPath('es', 'terms'), label: LEGAL_COPY.es.labels.terms },
] as const;

export const PAGE_SUMMARIES = {
  entry: {
    heading: 'Jorge Bastidas · decode9: elige tu lado',
    paragraphs: [
      [
        'My Hacker Mode: ',
        { href: ENTRY_ROUTES.decode9, label: 'decode9' },
        ', mi versión investigadora: código, experimentos y lo que nadie te mostró. En el celular, el lado rojo abre el ',
        { href: ENTRY_ROUTES.decode9Mobile, label: 'transmisor de decode9' },
        '.',
      ],
      [
        'My Professional Mode: ',
        { href: ENTRY_ROUTES.profile, label: 'Jorge Bastidas, el ingeniero' },
        ', CTO de The Empire. Mi trayectoria, mis proyectos y cómo construyo: mi perfil profesional completo.',
      ],
    ],
    links: LEGAL_LINKS,
  },
  terminal: {
    heading: 'decode9 · Terminal de los archivos de los demonoides',
    paragraphs: [
      [
        'Sistema operativo de decode9: manifiesto, expediente de origen, laboratorio, códice de razas y lugares, archivo de señales, canal de publicaciones y enlace con el transmisor.',
      ],
      [
        'decode9 es la versión investigadora de ',
        { href: ENTRY_ROUTES.profile, label: 'Jorge Bastidas' },
        '. Desde el enlace se inicia el ',
        { href: ENTRY_ROUTES.decode9Mobile, label: 'transmisor en el celular' },
        ' o se vuelve a la ',
        { href: ENTRY, label: 'entrada para elegir lado' },
        '.',
      ],
    ],
    links: LEGAL_LINKS,
  },
  transmitter: {
    heading: 'decode9 · Transmisor de emergencia',
    paragraphs: [
      [
        'Encendiste el transmisor de emergencia: del otro lado alguien quiere hablar contigo. Cuatro estaciones: contacto en 147.9, videos, lecturas y audios.',
      ],
      [
        'Es la versión para celular de la ',
        { href: ENTRY_ROUTES.decode9, label: 'terminal de decode9' },
        '. El perfil profesional de ',
        { href: ENTRY_ROUTES.profile, label: 'Jorge Bastidas, CTO de The Empire' },
        ', está al otro lado de la ',
        { href: ENTRY, label: 'entrada' },
        '.',
      ],
    ],
    links: LEGAL_LINKS,
  },
  profile: {
    heading: 'Jorge Bastidas · CTO · The Empire',
    paragraphs: [
      [CHAPTERS.perfil.intro ?? ''],
      [
        'Detrás del ingeniero hay un universo propio: ',
        { href: ENTRY_ROUTES.decode9, label: 'decode9' },
        ', la parte que investiga y crea. Desde la ',
        { href: ENTRY, label: 'entrada' },
        ' eliges el lado.',
      ],
    ],
    links: LEGAL_LINKS,
  },
} as const satisfies Record<'entry' | 'terminal' | 'transmitter' | 'profile', PageSummaryCopy>;
