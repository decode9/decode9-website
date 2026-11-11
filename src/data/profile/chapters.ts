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
    title: ['Construye ', { em: 'mundos' }, ' que funcionan solos'],
    intro:
      'Jorge Bastidas, arquitecto de software y cofundador y CTO de The Empire. Desde 2014 toma una idea o una necesidad y la convierte en un sistema completo: arquitectura, producto y el equipo que lo sostiene.',
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
        body: 'Validar una idea, escalar bajo carga o salir de procesos manuales: la meta es un sistema que funcione y siga funcionando.',
        caps: [
          ['arquitectura', '.yml'],
          ['agentes de IA', '()'],
          ['automatización', '.sh'],
        ],
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
    title: ['Bitácora de ', { em: 'vuelo' }],
    intro: 'Los mundos por donde ha pasado desde 2014 y lo que dejó construido en cada uno.',
    items: [
      {
        icon: 'rocket',
        kicker: 'Ago 2022 – hoy',
        title: 'Cofundador y CTO · The Empire',
        subtitle: 'Productos y plataformas',
        body: 'Define la estrategia técnica, los procesos de ingeniería y los equipos detrás de sus productos y de las plataformas de sus clientes.',
        caps: [
          ['productos', '.ts'],
          ['plataformas', '.api'],
          ['15+ entregados', '--prod'],
        ],
        cta: { label: 'Ver proyectos', action: 'chapter:proyectos' },
      },
      {
        icon: 'layers',
        kicker: 'Mar 2025 – hoy',
        title: 'Director de Tecnología · SICEE',
        subtitle: 'Microservicios en AWS',
        body: 'Lidera la arquitectura de una plataforma de procesamiento de información crítica: APIs distribuidas, nube y frentes en Angular y React.',
        caps: [
          ['microservicios', '.aws'],
          ['APIs', '.api'],
          ['angular · react', '.tsx'],
        ],
      },
      {
        icon: 'code',
        kicker: 'Abr 2021 – ene 2025',
        title: 'Arquitecto de software · aiMonkey',
        subtitle: 'Antes, desarrollador senior',
        body: 'Diseñó arquitecturas escalables y seguras, lideró equipos y pipelines de CI/CD y llevó tiempo real con WebSockets a productos de clientes.',
        caps: [
          ['arquitectura', '.yml'],
          ['CI/CD', 'ci'],
          ['websockets', '.ws'],
        ],
      },
      {
        icon: 'grid',
        kicker: 'Oct 2019 – jul 2022',
        title: 'Cofundador · The Code Workers',
        subtitle: 'Líder de infraestructura',
        body: 'Microservicios con gRPC y GraphQL, contenedores en Docker y Kubernetes y despliegues en AWS y DigitalOcean.',
        caps: [
          ['microservicios', '.grpc'],
          ['kubernetes', '.yml'],
          ['aws', '.tf'],
        ],
      },
      {
        icon: 'signal',
        kicker: '2017 – 2022',
        title: 'CTO en fintech y blockchain',
        subtitle: 'Union Block · Coinspree · Flow',
        body: 'CTO de Union Block (2017–2022) y de Coinspree (2018–2019), con custodia cripto y nodos Bitcoin; en Flow (2022), apps Web3 en React Native.',
        caps: [
          ['fintech', '$'],
          ['bitcoin', '.btc'],
          ['web3', '.sol'],
        ],
      },
      {
        icon: 'flag',
        kicker: 'Oct 2014 – oct 2019',
        title: 'Desarrollador independiente',
        subtitle: 'Startups y negocios',
        body: 'Apps web y móviles con React, React Native y Node.js, publicadas en Google Play y desplegadas en AWS y DigitalOcean.',
        caps: [
          ['react native', '.tsx'],
          ['MVPs', '--prod'],
          ['despliegues', '.sh'],
        ],
        cta: { label: 'Preguntarle a Jorge', action: 'walkie' },
      },
      {
        icon: 'book',
        kicker: 'Formación',
        title: 'Ciencias de la Computación',
        subtitle: 'Universidad Nueva Esparta · 2015–2016',
        body: 'Tres semestres de la licenciatura, más certificaciones en Angular y TypeScript, Python, Docker y DevOps con Jenkins y Kubernetes (2019–2021).',
        caps: [
          ['3 semestres', '.edu'],
          ['docker', '.cert'],
          ['devops', '.cert'],
        ],
      },
      {
        icon: 'planet',
        kicker: 'Base',
        title: 'Argentina · todo el mundo',
        subtitle: 'Remoto · contrato o alianza',
        body: 'Trabaja desde Buenos Aires, en remoto, por contrato o como alianza técnica. Español nativo e inglés B2.',
        caps: [
          ['español', '.es'],
          ['inglés B2', '.en'],
        ],
      },
    ],
  },
  proyectos: {
    n: '03',
    world: 'Hielo',
    acc: '#9fd8ff',
    ghost: 'Proyectos',
    title: ['Mundos ', { em: 'construidos' }],
    intro: 'Productos reales en producción, la mayoría construidos con The Empire.',
    items: [
      {
        icon: 'layers',
        kicker: 'IA · WhatsApp',
        title: 'Solvo',
        subtitle: 'Arquitectura e ingeniería principal',
        body: 'Agente comercial que conoce catálogo, stock, precios, agenda y pedidos; deriva a una persona cuando hay dinero en juego.',
        caps: [
          ['15 herramientas', '()'],
          ['13 estados', '.log'],
          ['terraform', '.tf'],
        ],
        cta: { label: 'Visitar sitio', href: 'https://solvo.lat' },
      },
      {
        icon: 'signal',
        kicker: 'Impacto social · hoy Reconexión',
        title: 'Desaparecidos Terremoto Venezuela',
        subtitle: 'CTO · arquitectura y operación',
        body: 'Reconecta familias tras el terremoto de La Guaira (2026): ~52k usuarios la primera semana, 44k+ registros y cobertura en 108+ medios de 15 países.',
        caps: [
          ['~52k usuarios', '.live'],
          ['150+ voluntarios', '++'],
          ['EC2 → Lambda', '-60%'],
        ],
        cta: { label: 'Visitar sitio', href: 'https://desaparecidosterremotovenezuela.com' },
      },
      {
        icon: 'grid',
        kicker: 'Fintech · desde 2021',
        title: 'Finami',
        subtitle: 'Fundador e ingeniero principal',
        body: 'App de finanzas personales offline-first con los datos cifrados en el teléfono y un ERP financiero multi-tenant para negocios.',
        caps: [
          ['cifrado E2E', '.lock'],
          ['multi-tenant', '1:1'],
          ['1.647 tests', 'pass'],
        ],
        cta: { label: 'Visitar sitio', href: 'https://finami.app' },
      },
      {
        icon: 'flag',
        kicker: 'Sin fines de lucro',
        title: 'Latin Freedom',
        subtitle: 'Ingeniería de punta a punta',
        body: 'Sitio público, donaciones, voluntariado y back office de una red que financia iniciativas comunitarias en América Latina.',
        caps: [
          ['4 apps', '.api'],
          ['12 campañas', '[]'],
          ['donaciones', '$'],
        ],
        cta: { label: 'Visitar sitio', href: 'https://latinfreedom.org' },
      },
      {
        icon: 'rocket',
        kicker: 'Medios · videojuegos',
        title: 'La Patilla Games',
        subtitle: 'Co-líder técnico',
        body: 'Vertical de videojuegos de La Patilla: juegos propios de menos de 3 MB, game jams y marca blanca para otros medios.',
        caps: [
          ['12 juegos', '()'],
          ['< 3 MB', '.zip'],
          ['marca blanca', '--fork'],
        ],
        cta: { label: 'Visitar sitio', href: 'https://games.lapatilla.com' },
      },
      {
        icon: 'grid',
        kicker: 'E-commerce · desde 2022',
        title: 'Wove Made',
        subtitle: 'Arquitectura',
        body: 'Arquitectura de una tienda en línea con Next.js, Remix y MongoDB.',
        caps: [
          ['next.js', '.tsx'],
          ['remix', '.tsx'],
          ['mongodb', '{}'],
        ],
      },
    ],
  },
  habilidades: {
    n: '04',
    world: 'Núcleo',
    acc: '#ff9a6b',
    ghost: 'Kit',
    title: ['Kit de ', { em: 'terraformación' }],
    intro: 'Las herramientas que lleva en cada viaje, elegidas por confiabilidad y escala, no por moda.',
    items: [
      {
        icon: 'code',
        kicker: 'Técnicas',
        title: 'Full stack de punta a punta',
        subtitle: 'Lenguajes y frameworks',
        body: 'TypeScript, JavaScript, Python, Java, Kotlin, C# y PHP; React, Next.js, React Native, Angular, Node.js, NestJS, Spring Boot y FastAPI.',
        caps: [
          ['typescript', '.ts'],
          ['python', '.py'],
          ['kotlin', '.kt'],
          ['react', '.tsx'],
        ],
      },
      {
        icon: 'grid',
        kicker: 'Arquitectura',
        title: 'Sistemas que escalan',
        subtitle: 'Distribuidos y de alta disponibilidad',
        body: 'Microservicios, APIs REST, GraphQL y gRPC, tiempo real con WebSockets e integración de sistemas pensada para crecer.',
        caps: [
          ['microservicios', '.grpc'],
          ['graphql', '.gql'],
          ['alta disponibilidad', '.ha'],
        ],
      },
      {
        icon: 'layers',
        kicker: 'Infraestructura',
        title: 'La nube como código',
        subtitle: 'AWS serverless por defecto',
        body: 'AWS (Lambda, EC2, S3, CloudFront), DigitalOcean, Terraform, Docker, Kubernetes y Linux; CI/CD con GitHub Actions y Jenkins; datos en PostgreSQL, MySQL, MongoDB y Redis.',
        caps: [
          ['terraform', '.tf'],
          ['docker', '.yml'],
          ['github actions', 'ci'],
        ],
      },
      {
        icon: 'target',
        kicker: 'IA y automatización',
        title: 'Agentes que se lanzan',
        subtitle: 'Medidos y protegidos',
        body: 'Agentes LLM con tool calling, RAG y MCP, guardarraíles en código y automatizaciones con n8n.',
        caps: [
          ['tool calling', '()'],
          ['RAG', 'pgvector'],
          ['n8n', '.flow'],
        ],
      },
      {
        icon: 'signal',
        kicker: 'Fintech',
        title: 'Blockchain y finanzas',
        subtitle: 'Bitcoin, Ethereum y Web3',
        body: 'Nodos Bitcoin, custodia cripto, integración con exchanges, WalletConnect y contratos ERC-721 en Solidity.',
        caps: [
          ['bitcoin', '.btc'],
          ['ethereum', '.sol'],
          ['web3', '()'],
        ],
      },
      {
        icon: 'users',
        kicker: 'Liderazgo',
        title: 'Liderazgo técnico',
        subtitle: 'Arquitectura, estrategia y equipos',
        body: 'Guía a nivel CTO: estrategia, decisiones de arquitectura, Scrum y revisión de código; criterio senior cuando la decisión importa.',
        caps: [
          ['equipos', '.team'],
          ['estrategia', '.road'],
          ['arquitectura', '.yml'],
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
    title: ['Un ingeniero que entrega ', { em: 'y lidera' }],
    intro: 'Del primer MVP a los equipos que mantienen los productos funcionando.',
    items: [
      {
        icon: 'ear',
        kicker: 'Descubrir',
        title: 'Qué significa el éxito',
        subtitle: 'Antes de la primera línea',
        body: 'Entender el objetivo y las restricciones, y diseñar un sistema que encaje con el problema y esté hecho para crecer.',
        caps: [
          ['objetivo', '?'],
          ['restricciones', '?'],
        ],
      },
      {
        icon: 'grid',
        kicker: 'Organizar',
        title: 'Un mismo manual en cada repo',
        subtitle: 'Estándares para todos los equipos',
        body: 'Arquitecturas por capas, infraestructura como código y compuertas de calidad en CI/CD, de Blueprint a Platforms.',
        caps: [
          ['capas', '.yml'],
          ['terraform', '.tf'],
          ['calidad', 'ci'],
        ],
      },
      {
        icon: 'users',
        kicker: 'Bajo presión',
        title: 'Liderar en plena crisis',
        subtitle: 'Desaparecidos Terremoto Venezuela',
        body: 'Salir en vivo a horas de un desastre, operar la plataforma con 150+ voluntarios y moderadores y migrarla a serverless en plena crisis.',
        caps: [
          ['en vivo', '.live'],
          ['150+ voluntarios', '++'],
        ],
        cta: { label: 'Ver proyectos', action: 'chapter:proyectos' },
      },
      {
        icon: 'compass',
        kicker: 'Traducir',
        title: 'Del negocio al plan técnico',
        subtitle: 'Junto al cliente desde el inicio',
        body: 'Participa en el levantamiento, la negociación y la definición del alcance, y convierte objetivos de negocio en soluciones que escalan.',
        caps: [
          ['levantamiento', '?'],
          ['alcance', '.md'],
          ['plan', '.road'],
        ],
      },
      {
        icon: 'users',
        kicker: 'Formar',
        title: 'Equipos que entregan',
        subtitle: 'Reclutar, planificar, revisar',
        body: 'Recluta perfiles técnicos, planifica en sprints con Scrum y revisa el código del equipo como líder técnico, arquitecto y CTO.',
        caps: [
          ['scrum', '.sprint'],
          ['code review', '--pr'],
          ['mentoría', '.team'],
        ],
      },
    ],
  },
  contacto: {
    n: '06',
    world: 'Por descubrir',
    acc: '#ffb86b',
    ghost: 'Señal',
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
