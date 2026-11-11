import type { LegalCopy } from '@/interfaces/legal';

/** Spanish legal texts (privacy and terms), as published on main in e44cac9. */
export const LEGAL_ES: LegalCopy = {
  labels: {
    back: 'Volver al inicio',
    updatedLabel: 'Actualizado',
    operator: 'Responsable',
    legalName: 'Nombre legal',
    cuil: 'CUIL',
    brand: 'Marca',
    website: 'Sitio',
    email: 'Email',
    whatsapp: 'WhatsApp',
    legalNav: 'Legal',
    privacy: 'Privacidad',
    terms: 'Términos',
    rights: '© 2026 decode9 · Jorge Bastidas. Todos los derechos reservados.',
    otherLanguage: 'English',
  },
  updated: '26 de octubre de 2026',
  privacy: {
    kicker: 'Legal · 01',
    title: 'Privacidad',
    metaTitle: 'Privacidad — decode9',
    metaDescription:
      'Quién opera decode9.codes: Jorge Bastidas Araujo, CUIL 20964746193. Qué guarda el sitio, qué sale del navegador y cómo escribir.',
    lead: 'decode9.codes lo opera Jorge Bastidas Araujo, CUIL 20964746193. Esta página dice qué queda en tu dispositivo, qué sale del navegador y cómo llegar a la persona responsable.',
    sections: [
      {
        heading: 'La persona responsable',
        paragraphs: [
          'La persona responsable de este sitio es Jorge Bastidas Araujo, persona humana con base en Argentina, que trabaja bajo la marca decode9. El identificador fiscal público es el CUIL 20964746193. El sitio se publica en https://decode9.codes.',
          'Las consultas de privacidad van a decode9.dev@gmail.com o a WhatsApp +1 (786) 531-8494. Esos son los únicos canales de contacto. Este sitio no publica un domicilio postal aparte.',
        ],
      },
      {
        heading: 'Qué cubre esto',
        paragraphs: [
          'Este aviso cubre el sitio público decode9.codes, incluida la sesión guiada, el guía dentro de la página y estas páginas legales. No cubre GitHub, LinkedIn, WhatsApp, Google ni un producto de clientes enlazado desde el capítulo de trabajo. Esos servicios tienen sus propios términos.',
        ],
      },
      {
        heading: 'Qué puedes enviar',
        paragraphs: [
          'El sitio no tiene cuenta ni cobro. Puedes leerlo sin identificarte.',
          'Si escribes a decode9.dev@gmail.com o por WhatsApp al +1 (786) 531-8494, ese mensaje lo gestiona tu proveedor de correo o WhatsApp, y Jorge. Este sitio no tiene un formulario de contacto.',
          'El guía puede recibir un mensaje que escribas. Dejar un nombre o un email en el guía es opcional, y solo se envía cuando el guía en vivo está conectado. Cuando el guía está sin conexión, la conversación se queda en tu navegador y no se transmite.',
        ],
      },
      {
        heading: 'Qué queda en tu dispositivo',
        paragraphs: [
          'Una cookie llamada NEXT_LOCALE recuerda el idioma que eliges, inglés o español, durante un año. Solo se guarda cuando cambias de idioma.',
          'La clave d9-session-seen en localStorage registra que ya abriste la sesión, para que la próxima visita use una intro más corta.',
          'La clave d9-agent-name en localStorage puede guardar el nombre visible que usa el guía. Borrar los datos del sitio decode9.codes elimina estas entradas.',
        ],
      },
      {
        heading: 'Medición y anuncios',
        paragraphs: [
          'El sitio carga Google Analytics, ID de medición G-VMLFSX6GXW, para entender qué capítulos usa la gente. Esos eventos no incluyen el texto que le escribes al guía.',
          'El sitio está vinculado a Google AdSense, editor ca-pub-1675722214703683, y publica esa relación en /ads.txt. Si Google muestra o mide anuncios en tu navegador, puede guardar sus propias cookies y recibir datos técnicos como páginas vistas, dispositivo y ubicación aproximada, según las políticas de Google.',
        ],
      },
      {
        heading: 'Quién más recibe datos',
        paragraphs: [
          'Jorge Bastidas Araujo recibe los mensajes que envías al email y al WhatsApp de arriba, y los mensajes del guía cuando el guía en vivo está conectado.',
          'Google recibe los datos de analítica y publicidad descritos arriba.',
          'El servicio del guía en vivo recibe el texto que le envías, y un nombre o email solo si los dejas.',
          'Este sitio no vende información personal.',
        ],
      },
      {
        heading: 'Cuánto tiempo se guarda',
        paragraphs: [
          'La cookie de idioma dura hasta un año, o hasta que la borres. Las entradas de localStorage duran hasta que limpias los datos del sitio.',
          'Los mensajes que envías por email o WhatsApp se guardan el tiempo necesario para responder y para conservar un registro del trabajo. La retención de analítica y anuncios la define Google.',
        ],
      },
      {
        heading: 'Tus opciones',
        paragraphs: [
          'Puedes navegar sin el guía, bloquear cookies en tu navegador y usar una ventana privada. Puedes pedir acceso a la información que Jorge tenga sobre ti, o su eliminación, escribiendo a decode9.dev@gmail.com.',
          'El sitio es un portafolio profesional. No está dirigido a niños.',
        ],
      },
      {
        heading: 'Cambios',
        paragraphs: [
          'La versión vigente de este aviso está fechada el 26 de octubre de 2026. La página que estás leyendo es la versión en vigor.',
        ],
      },
    ],
  },
  terms: {
    kicker: 'Legal · 02',
    title: 'Términos',
    metaTitle: 'Términos — decode9',
    metaDescription: 'Términos de uso de decode9.codes, operado por Jorge Bastidas Araujo, CUIL 20964746193.',
    lead: 'Estos términos cubren el uso de decode9.codes, operado por Jorge Bastidas Araujo, CUIL 20964746193. Leer el sitio no crea un contrato de trabajo de ingeniería.',
    sections: [
      {
        heading: 'Quién ofrece el sitio',
        paragraphs: [
          'decode9.codes lo ofrece Jorge Bastidas Araujo, CUIL 20964746193, con base en Argentina, bajo la marca decode9. El contacto es decode9.dev@gmail.com y WhatsApp +1 (786) 531-8494.',
        ],
      },
      {
        heading: 'Qué es el sitio',
        paragraphs: [
          'El sitio es un portafolio y una sesión guiada por el trabajo. Las demos del laboratorio corren en tu navegador como ilustración. Nada de esto es asesoría legal, financiera o laboral, y nada de esto es una oferta para comprar un producto en la página.',
        ],
      },
      {
        heading: 'Cómo usarlo',
        paragraphs: [
          'Puedes leer el sitio y compartir enlaces. No atribuyas una relación con decode9 que no exista, no interfieras la sesión de otras personas y no copies el sitio para presentarlo como tuyo.',
        ],
      },
      {
        heading: 'Trabajar juntos',
        paragraphs: [
          'Escribir por email, WhatsApp o el guía abre una conversación. No contrata a Jorge y no fija un precio. El alcance, el honorario y el plazo se acuerdan por escrito antes de empezar el trabajo.',
        ],
      },
      {
        heading: 'Propiedad intelectual',
        paragraphs: [
          'El nombre decode9, la marca, los textos y la sesión pertenecen a Jorge Bastidas Araujo, salvo cuando un caso nombra a un cliente. Los nombres y las marcas de los clientes siguen siendo de esos clientes. Los casos describen trabajo; no transfieren la marca de un cliente.',
        ],
      },
      {
        heading: 'Otros servicios',
        paragraphs: [
          'Los enlaces a GitHub, LinkedIn, WhatsApp y Google salen de este sitio. A partir de ahí aplican sus términos. El guía en vivo, cuando está conectado, es un servicio de terceros usado para responder mensajes.',
        ],
      },
      {
        heading: 'Publicidad',
        paragraphs: [
          'El sitio puede mostrar o medir anuncios a través de Google AdSense, editor ca-pub-1675722214703683. El archivo de vendedores autorizados está en /ads.txt.',
        ],
      },
      {
        heading: 'Sin garantía',
        paragraphs: [
          'El sitio se ofrece como portafolio. Los capítulos, las demos y el guía pueden cambiar o quedar fuera de línea. En la medida en que la ley lo permite, Jorge Bastidas Araujo no responde por decisiones que tomes a partir del contenido, ni por caídas de servicios de terceros.',
          'Nada de esto renuncia a derechos que la ley argentina, o la ley imperativa del lugar donde vives, no permite renunciar.',
        ],
      },
      {
        heading: 'Controversias',
        paragraphs: [
          'Escribe primero a decode9.dev@gmail.com. El sitio lo opera desde Argentina Jorge Bastidas Araujo. Si una controversia necesita un tribunal, el fuero previsto son los tribunales de Argentina, sin quitar las protecciones imperativas que apliquen donde vives.',
        ],
      },
      {
        heading: 'Cambios',
        paragraphs: [
          'La versión vigente de estos términos está fechada el 26 de octubre de 2026. Seguir usando el sitio después de un cambio en esta página significa que lo usas bajo los términos actualizados.',
        ],
      },
    ],
  },
};
