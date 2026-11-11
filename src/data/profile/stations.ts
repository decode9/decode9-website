import type { Station } from '@/interfaces/profile';

/**
 * The 7 stops of the journey: dial station, right-hand map entry and the caption over the stop.
 * Index 5 is the contact (mystery world), 6 is the Averno (decode9).
 */
export const STATIONS: readonly Station[] = [
  {
    label: 'Perfil',
    ariaLabel: 'Perfil',
    sec: 'perfil',
    x: 4,
    mapLabel: 'Origen',
    caption: {
      eyebrow: 'Origen',
      title: ['Todo sistema empieza con ', { em: 'suelo firme' }],
      body: 'Antes de construir hay que entender el terreno. Aquí Jorge pone las bases: arquitectura clara para que todo lo demás pueda crecer.',
      res: ['tierra fértil', 'fundamentos'],
      acc: '#9be59f',
      open: 'perfil',
      ctaLabel: 'Abrir capítulo · Perfil',
    },
  },
  {
    label: 'Trayectoria',
    ariaLabel: 'Trayectoria',
    sec: 'trayectoria',
    x: 19.5,
    mapLabel: 'Arena',
    caption: {
      eyebrow: 'Arena',
      title: ['Donde otros ven desierto, él ve ', { em: 'energía' }],
      body: 'Un planeta seco y quemado por el sol. En vez de pelear con eso, lo aprovecha: el exceso de sol se convierte en la fuente que alimenta todo.',
      res: ['sol abundante', 'energía solar'],
      acc: '#ffb86b',
      open: 'trayectoria',
      ctaLabel: 'Abrir capítulo · Trayectoria',
    },
  },
  {
    label: 'Proyectos',
    ariaLabel: 'Proyectos',
    sec: 'proyectos',
    x: 35,
    mapLabel: 'Hielo',
    caption: {
      eyebrow: 'Hielo',
      title: ['El ', { em: 'frío' }, ' también trabaja'],
      body: 'El hielo enfría centros de datos y el viento mueve turbinas. Escalar sin recalentar el sistema es cuestión de usar bien el entorno.',
      res: ['hielo y viento', 'datos que escalan'],
      acc: '#9fd8ff',
      open: 'proyectos',
      ctaLabel: 'Abrir capítulo · Proyectos',
    },
  },
  {
    label: 'Habilidades',
    ariaLabel: 'Habilidades',
    sec: 'habilidades',
    x: 50.5,
    mapLabel: 'Núcleo',
    caption: {
      eyebrow: 'Núcleo',
      title: ['La ', { em: 'presión' }, ' mueve la forja'],
      body: 'Un mundo volcánico parece el peor lugar para construir. Jorge canaliza la lava y usa el calor del núcleo para producir.',
      res: ['calor del núcleo', 'geotermia y forja'],
      acc: '#ff9a6b',
      open: 'habilidades',
      ctaLabel: 'Abrir capítulo · Habilidades',
    },
  },
  {
    label: 'Liderazgo',
    ariaLabel: 'Liderazgo',
    sec: 'liderazgo',
    x: 66,
    mapLabel: 'Colonia',
    caption: {
      eyebrow: 'Colonia',
      title: ['Un líder que construye con su ', { em: 'equipo' }],
      body: 'Aquí hay un equipo nuevo, con ganas pero sin rumbo. Jorge primero escucha, después organiza y luego construyen juntos. El logro es del proyecto, no del jefe.',
      res: ['talento en bruto', 'equipo que crece'],
      acc: '#c9e88a',
      open: 'liderazgo',
      ctaLabel: 'Abrir capítulo · Liderazgo',
    },
  },
  { label: 'Contacto', ariaLabel: 'Contacto', sec: 'contacto', x: 81.5, mapLabel: '?' },
  {
    label: 'decode9',
    ariaLabel: 'decode9, mi versión investigadora',
    sec: 'decode9',
    x: 97,
    mapLabel: 'decode9',
    caption: {
      eyebrow: 'Averno · decode9',
      title: ['Mi versión ', { em: 'investigadora' }],
      body: 'Un planeta de fuego donde no hay filtro: código, experimentos y lo que nadie te mostró.',
      acc: '#ff4a2a',
      open: 'decode9',
      ctaLabel: 'Entrar a decode9',
    },
  },
];

/** Index of the Averno stop (decode9) and of the contact stop. */
export const D9_INDEX = STATIONS.length - 1;
export const CONTACT_INDEX = D9_INDEX - 1;

/** Dial positions (%) of each station, for the needle. */
export const DIAL_X = STATIONS.map((s) => s.x);

/** Lines of the warp log while decode9 loads. */
export const D9_LOG = ['> conectando con decode9', '> abriendo los archivos', '> descifrando señal', '> acceso concedido'];

/** Contact frequencies of the walkie (sheet b): the same public channels as the previous site. */
export const FREQUENCIES: readonly { k: string; v: string; copy: string }[] = [
  { k: 'correo', v: 'decode9.dev@gmail.com', copy: 'decode9.dev@gmail.com' },
  { k: 'whatsapp', v: '+1 (786) 531-8494', copy: '+17865318494' },
  { k: 'github', v: '@decode9', copy: 'https://github.com/decode9' },
  { k: 'linkedin', v: '@decode9', copy: 'https://www.linkedin.com/in/decode9/' },
  { k: 'sitio', v: 'decode9.codes', copy: 'https://decode9.codes' },
];

export const EMPIRE_URL = 'https://theempire.tech';
