import type { Chapter, ChapterId } from '@/interfaces/profile';

/** Destination of the "otro lado" CTAs (TERRAFORM_RUTAS.decode9 of the original). */
export const DECODE9_PATH = '/decode9/';

/**
 * Chapter content as data (CHAPTERS of the original). Each item may carry icon, kicker, title,
 * subtitle, body, caps and cta; whatever is not written is not painted. Key order = chapter order.
 */
export const CHAPTERS: Record<ChapterId, Chapter> = {
  perfil: {
    n: '01',
    world: 'Origen',
    acc: '#9be59f',
    ghost: 'Perfil',
    prov: 'contenido provisional · se reemplaza con la hoja de vida',
    title: ['Construye ', { em: 'mundos' }, ' que funcionan solos'],
    intro:
      'Ingeniero de the empire. Toma un terreno vacío, una idea o una necesidad, y lo convierte en un sistema completo: arquitectura, producto y el equipo que lo sostiene.',
    items: [
      {
        icon: 'target',
        kicker: 'Misión',
        title: 'Terraformar ideas',
        subtitle: 'De terreno vacío a sistema vivo',
        body: 'Primero el suelo firme, después lo que crece encima, luego la infraestructura y al final la red que lo conecta todo.',
        caps: [
          ['suelo', '()'],
          ['vida', '()'],
          ['infraestructura', '()'],
          ['red', '()'],
        ],
        cta: { label: 'Ver su kit', action: 'chapter:habilidades' },
      },
      {
        icon: 'compass',
        kicker: 'Enfoque',
        title: 'Entender antes de construir',
        subtitle: 'Investigar el terreno',
        body: 'Cada proyecto empieza con preguntas: qué existe, qué falta y qué recursos hay para aprovechar.',
        cta: { label: 'Volver a Origen', action: 'world:0' },
      },
      {
        icon: 'spark',
        kicker: 'Otro lado',
        title: 'decode9',
        subtitle: 'La parte que investiga y crea',
        body: 'Detrás del ingeniero hay un universo propio. decode9 es la parte que desarma, investiga y vuelve a construir.',
        cta: { label: 'Ver el otro lado', href: DECODE9_PATH },
      },
    ],
  },
  trayectoria: {
    n: '02',
    world: 'Arena',
    acc: '#ffb86b',
    ghost: 'Bitácora',
    prov: 'contenido provisional · fechas y cargos por completar',
    title: ['Bitácora de ', { em: 'vuelo' }],
    intro: 'Los mundos por donde ha pasado y lo que dejó construido en cada uno.',
    items: [
      {
        icon: 'rocket',
        kicker: 'Actual',
        title: 'Ingeniería · the empire',
        subtitle: 'Productos y plataformas',
        body: 'Dirección técnica de los productos y plataformas de la agencia.',
        caps: [
          ['productos', '.ts'],
          ['plataformas', '.api'],
          ['equipo', '.md'],
        ],
        cta: { label: 'Ver proyectos', action: 'chapter:proyectos' },
      },
      {
        icon: 'flag',
        kicker: 'Antes',
        title: 'aiMonkey',
        subtitle: 'Cargo por confirmar',
        body: 'Etapa por documentar con la hoja de vida.',
        caps: [['cargo', '?.confirmar()']],
        cta: { label: 'Preguntarle a Jorge', action: 'walkie' },
      },
      {
        icon: 'book',
        kicker: 'Formación',
        title: 'Por completar',
        subtitle: 'Título e institución',
        body: 'Estudios y certificaciones por agregar.',
        caps: [
          ['título', '.pdf'],
          ['certificaciones', '[]'],
        ],
      },
    ],
  },
  proyectos: {
    n: '03',
    world: 'Hielo',
    acc: '#9fd8ff',
    ghost: 'Proyectos',
    prov: 'contenido provisional · descripciones por validar con Jorge',
    title: ['Mundos ', { em: 'construidos' }],
    intro: 'Sistemas que hoy funcionan solos.',
    items: [
      {
        icon: 'layers',
        kicker: 'Producto',
        title: 'Solvo y Finami',
        subtitle: 'Construido de punta a punta',
        body: 'Proyecto central de the empire, construido por Jorge.',
        caps: [
          ['arquitectura', '.yml'],
          ['construcción', '--prod'],
          ['de punta a punta', '&&'],
        ],
        cta: { label: 'Preguntar por este proyecto', action: 'walkie' },
      },
      {
        icon: 'signal',
        kicker: 'Impacto social',
        title: 'Búsqueda de personas desaparecidas',
        subtitle: 'Hoy evoluciona dentro de Reconexión',
        body: 'Liderazgo técnico y vocería ante medios.',
        caps: [
          ['liderazgo técnico', '()'],
          ['vocería', '.live'],
          ['reconexión', 'v2'],
        ],
        cta: { label: 'Preguntar por este proyecto', action: 'walkie' },
      },
    ],
  },
  habilidades: {
    n: '04',
    world: 'Núcleo',
    acc: '#ff9a6b',
    ghost: 'Kit',
    prov: 'contenido provisional · se completa con la hoja de vida',
    title: ['Kit de ', { em: 'terraformación' }],
    intro: 'Las herramientas que lleva en cada viaje.',
    items: [
      {
        icon: 'code',
        kicker: 'Técnicas',
        title: 'Por completar',
        subtitle: 'Lenguajes e infraestructura',
        body: 'Lenguajes, arquitectura, infraestructura y herramientas.',
        caps: [
          ['lenguajes', '.js'],
          ['arquitectura', '.yml'],
          ['infraestructura', '.tf'],
          ['herramientas', '.sh'],
        ],
      },
      {
        icon: 'users',
        kicker: 'Liderazgo',
        title: 'Por completar',
        subtitle: 'Equipos y producto',
        body: 'Dirección de equipos, producto y vocería.',
        caps: [
          ['equipos', '.team'],
          ['producto', '.road'],
          ['vocería', '.live'],
        ],
        cta: { label: 'Ir a Colonia', action: 'world:4' },
      },
      {
        icon: 'spark',
        kicker: 'Disparador',
        title: 'decode9',
        subtitle: 'Creatividad y hacking',
        body: 'La parte creativa y hacker, como habilidad propia.',
        caps: [
          ['creatividad', '()'],
          ['hacking', '</>'],
        ],
        cta: { label: 'Ver el otro lado', href: DECODE9_PATH },
      },
    ],
  },
  liderazgo: {
    n: '05',
    world: 'Colonia',
    acc: '#c9e88a',
    ghost: 'Equipo',
    prov: 'contenido provisional · por validar con Jorge',
    title: ['Liderar es hacer ', { em: 'crecer' }, ' al equipo'],
    intro: 'El logro es del proyecto, no del jefe.',
    items: [
      {
        icon: 'ear',
        kicker: 'Escuchar',
        title: 'Entender antes de mandar',
        subtitle: 'Conocer a cada persona',
        body: 'Saber qué sabe cada quien y qué le falta antes de repartir el trabajo.',
        caps: [
          ['qué sabe', '?'],
          ['qué le falta', '?'],
        ],
      },
      {
        icon: 'grid',
        kicker: 'Organizar',
        title: 'Cada quien en su mejor lugar',
        subtitle: 'Roles claros y ritmo',
        body: 'Reparte el trabajo para que el equipo avance junto.',
        caps: [
          ['roles claros', '.yml'],
          ['ritmo', 'cron'],
          ['prioridades', 'sort()'],
        ],
      },
      {
        icon: 'users',
        kicker: 'Construir juntos',
        title: 'El proyecto por encima del ego',
        subtitle: 'Bienestar del equipo',
        body: 'El objetivo es el bienestar del proyecto y de la gente que lo hace.',
        caps: [
          ['bienestar', '++'],
          ['logros compartidos', 'merge'],
        ],
        cta: { label: 'Ir a Colonia', action: 'world:4' },
      },
    ],
  },
  contacto: {
    n: '06',
    world: 'Por descubrir',
    acc: '#ffb86b',
    ghost: 'Señal',
    prov: 'contenido provisional · datos por confirmar',
    title: [{ em: 'Hablemos' }],
    intro: 'Si tienes un mundo por construir, este es el canal.',
    items: [
      {
        icon: 'signal',
        kicker: 'Canal abierto',
        title: 'El walkie de Jorge',
        subtitle: '¿Qué mundo construimos ahora?',
        body: 'Escribe tu idea en una línea y deja tu correo o tu número.',
        cta: { label: 'Abrir el walkie', action: 'walkie' },
      },
      {
        icon: 'planet',
        kicker: 'Otro lado',
        title: 'decode9.codes',
        subtitle: 'El universo de decode9',
        body: 'Archivos, transmisiones y el canal del investigador del Averno.',
        cta: { label: 'Visitar decode9', href: DECODE9_PATH },
      },
    ],
  },
};

export const CHAPTER_ORDER = Object.keys(CHAPTERS) as ChapterId[];

/** Chapter that follows `id` (wraps to the first). */
export const nextChapter = (id: ChapterId): ChapterId =>
  CHAPTER_ORDER[(CHAPTER_ORDER.indexOf(id) + 1) % CHAPTER_ORDER.length];

/** Headline without its accents (plain() of the original). */
export const plainText = (rich: Chapter['title']): string => rich.map((s) => (typeof s === 'string' ? s : s.em)).join('');
