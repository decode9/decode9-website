import type { LegalCopy } from '@/interfaces/legal';

/** Spanish legal texts (privacy and terms), for the new site (entrada, terminal, transmisor y perfil). */
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
  updated: '11 de noviembre de 2026',
  privacy: {
    kicker: 'Legal · 01',
    title: 'Privacidad',
    metaTitle: 'Privacidad — decode9',
    metaDescription:
      'Quién opera decode9.codes (Jorge Bastidas Araujo, CUIL 20964746193), qué guarda tu navegador y qué pasa con lo que envías desde la terminal o el perfil.',
    lead: 'decode9.codes lo opera Jorge Bastidas Araujo, CUIL 20964746193. Esta página dice qué queda en tu dispositivo, qué envías cuando usas un formulario, quién más recibe datos y cómo pedir que se borren.',
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
          'Este aviso cubre el sitio público decode9.codes: la entrada, la terminal decode9 (/decode9/), el transmisor para celular (/decode9/movil/), el perfil profesional (/perfil/) y estas páginas legales.',
          'No cubre los sitios a los que enlaza, como GitHub, LinkedIn, theempire.tech, los sitios de los proyectos del perfil, las fuentes de noticias o las redes sociales. Esos servicios tienen sus propios términos.',
        ],
      },
      {
        heading: 'Qué puedes enviar',
        paragraphs: [
          'El sitio no tiene cuentas ni cobros. Puedes recorrerlo sin identificarte.',
          'Señal: la terminal y el transmisor tienen un formulario para escribirle a Jorge. Pide un alias (obligatorio), un correo o un número de WhatsApp (al menos uno de los dos), un mensaje opcional y los temas que marques. También se envía el idioma de la página y si escribes desde la terminal o desde el transmisor.',
          'Walkie: el perfil tiene un walkie para dejar un mensaje de texto libre. Si en ese texto escribes un correo o un número de teléfono, el servicio lo detecta y lo guarda aparte para poder responderte. También se envía el idioma de la página.',
          'Solo se envía lo que escribes cuando pulsas enviar. Si escribes por correo o por WhatsApp, ese mensaje lo gestiona tu proveedor de correo o WhatsApp, y Jorge.',
        ],
      },
      {
        heading: 'Dónde se guarda lo que envías',
        paragraphs: [
          'Los formularios se envían a decode9-api, un servicio propio que corre en Cloudflare Workers. Cada señal o mensaje se guarda en una base de datos Cloudflare D1 con la fecha y hora del envío. Cada señal recibe además un código de referencia (por ejemplo SOS-1234).',
          'Hoy no hay borrado automático: las señales y los mensajes se conservan hasta que se borran a mano. Puedes pedir que se borre lo que enviaste escribiendo a decode9.dev@gmail.com.',
        ],
      },
      {
        heading: 'Límite de envíos y huella anónima',
        paragraphs: [
          'Para limitar abusos, cada formulario acepta como máximo 5 envíos cada 10 minutos desde una misma conexión. Para contarlos, el servicio calcula una huella anónima de tu dirección IP: un hash SHA-256 de la IP junto con una sal secreta, recortado a 16 caracteres. La dirección IP en sí no se guarda.',
          'La huella se guarda junto a cada señal o mensaje y en un contador de envíos. Las filas del contador se borran cuando quedan fuera de la ventana de 10 minutos, al llegar un envío nuevo.',
        ],
      },
      {
        heading: 'Aviso por correo',
        paragraphs: [
          'El servicio puede avisar a Jorge por correo de cada señal o mensaje nuevo, con su contenido, a través de Resend, un servicio de envío de correos. Hoy ese aviso no está activo. Si se activa, Resend tratará el contenido del aviso como encargado de ese envío.',
        ],
      },
      {
        heading: 'Qué queda en tu dispositivo',
        paragraphs: [
          'El sitio no crea cookies propias. Guarda unas pocas preferencias en el localStorage de tu navegador:',
          'd9crt-lang (idioma de la terminal), d9crt-fx (efecto de pantalla CRT encendido o apagado) y d9crt-mute (sonido de la terminal); d9m-mute (sonido del transmisor); y tf-sound (sonido ambiente del perfil). Ninguna de estas claves guarda lo que escribes en los formularios.',
          'Al abrir la terminal, el sitio borra la clave antigua d9crt-user si existía. Borrar los datos del sitio decode9.codes en tu navegador elimina todas estas entradas.',
        ],
      },
      {
        heading: 'Medición y anuncios',
        paragraphs: [
          'El sitio carga Google Analytics (GA4), ID de medición G-VMLFSX6GXW, para saber qué partes se usan. Además de las visitas, registra unos pocos eventos: qué lado eliges en la entrada, qué publicación abres, si un envío de señal o de walkie salió bien o no, y el salto a decode9 desde el perfil. Google Analytics nunca recibe el texto que escribes, ni tu alias, correo o número. Google puede guardar sus propias cookies para esta medición, según sus políticas.',
          'El sitio declara una cuenta de Google AdSense, editor ca-pub-1675722214703683, en una etiqueta de la página y en /ads.txt. Hoy el sitio no carga el código de anuncios de Google. Si eso cambia, esta página se actualizará.',
        ],
      },
      {
        heading: 'Contenido y enlaces externos',
        paragraphs: [
          'Las tipografías se incluyen en el propio sitio al publicarlo, así que tu navegador no las pide a Google Fonts.',
          'La cinta de noticias del perfil muestra titulares públicos de php.net, CoinDesk, Hacker News, Ars Technica y TechCrunch. Esas fuentes las consulta el servidor (decode9-api), no tu navegador. Si ese servicio no responde, tu navegador pide directamente la portada de Hacker News a hn.algolia.com, que recibe entonces los datos técnicos normales de cualquier petición web, como tu dirección IP.',
          'Los botones para compartir abren X, Facebook, LinkedIn, WhatsApp o Telegram con el enlace de la publicación, y el perfil enlaza a los sitios de sus proyectos, a GitHub, a LinkedIn y a theempire.tech. Esos servicios solo reciben datos si abres el enlace. Copiar un enlace o usar el menú de compartir de tu teléfono se resuelve en tu dispositivo.',
        ],
      },
      {
        heading: 'Funciones de tu dispositivo',
        paragraphs: [
          'El sonido se genera en tu navegador con Web Audio. El transmisor puede leer textos en voz alta con la síntesis de voz del navegador y usar la vibración del teléfono. La entrada y el transmisor pueden usar el giroscopio para reaccionar a la inclinación del teléfono; en iOS, el navegador te pide permiso antes.',
          'Todo esto ocurre solo en tu dispositivo. El sitio no envía a ningún servidor datos del sonido, de la voz, de la vibración ni del giroscopio.',
        ],
      },
      {
        heading: 'Quién más recibe datos',
        paragraphs: [
          'Jorge Bastidas Araujo recibe las señales y los mensajes del walkie, y los mensajes que envías al correo y al WhatsApp de arriba.',
          'Cloudflare aloja el servicio decode9-api y su base de datos, y por eso trata lo que envías por los formularios.',
          'Google recibe los datos de medición descritos arriba. Resend recibiría el contenido de los avisos por correo si esos avisos se activan.',
          'Este sitio no vende información personal.',
        ],
      },
      {
        heading: 'Tus opciones',
        paragraphs: [
          'Puedes recorrer el sitio sin usar los formularios, bloquear cookies en tu navegador, borrar los datos del sitio y usar una ventana privada. Puedes pedir acceso a la información que Jorge tenga sobre ti, o su eliminación, escribiendo a decode9.dev@gmail.com.',
          'El sitio es un portafolio profesional. No está dirigido a niños.',
        ],
      },
      {
        heading: 'Cambios',
        paragraphs: [
          'La versión vigente de este aviso está fechada el 11 de noviembre de 2026. La página que estás leyendo es la versión en vigor.',
        ],
      },
    ],
  },
  terms: {
    kicker: 'Legal · 02',
    title: 'Términos',
    metaTitle: 'Términos — decode9',
    metaDescription:
      'Términos de uso de decode9.codes (entrada, terminal decode9, transmisor y perfil), operado por Jorge Bastidas Araujo, CUIL 20964746193.',
    lead: 'Estos términos cubren el uso de decode9.codes, operado por Jorge Bastidas Araujo, CUIL 20964746193. Usar el sitio no crea un contrato de trabajo de ingeniería.',
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
          'El sitio es un portafolio con cuatro partes: la entrada, donde eliges lado; la terminal decode9, con el manifiesto, el expediente, el laboratorio, el códice y las publicaciones; el transmisor para celular, con contacto, videos, lecturas y audios; y el perfil profesional de Jorge, con su trayectoria, sus proyectos, una cinta de noticias y el walkie.',
          'Nada de esto es asesoría legal, financiera o laboral, ni una oferta para comprar un producto en la página.',
        ],
      },
      {
        heading: 'Cómo usarlo',
        paragraphs: [
          'Puedes recorrer el sitio y compartir enlaces. No atribuyas una relación con decode9 que no exista, no copies el sitio para presentarlo como tuyo y no uses los formularios para enviar spam, contenido ilegal o envíos automáticos. Los formularios tienen un límite de envíos para evitar abusos.',
        ],
      },
      {
        heading: 'Trabajar juntos',
        paragraphs: [
          'Enviar una señal desde la terminal o el transmisor, dejar un mensaje en el walkie del perfil o escribir por correo o WhatsApp abre una conversación. No contrata a Jorge y no fija un precio. El alcance, el honorario y el plazo se acuerdan por escrito antes de empezar el trabajo.',
        ],
      },
      {
        heading: 'Propiedad intelectual',
        paragraphs: [
          'El nombre decode9, la marca, los textos, las ilustraciones y el código del sitio pertenecen a Jorge Bastidas Araujo, salvo cuando un caso nombra a un cliente. Los nombres y las marcas de los clientes y de los proyectos siguen siendo de sus dueños. Los casos describen trabajo; no transfieren la marca de nadie.',
          'Los titulares de la cinta de noticias pertenecen a sus fuentes y enlazan a la nota original.',
        ],
      },
      {
        heading: 'Otros servicios',
        paragraphs: [
          'Los enlaces a GitHub, LinkedIn, theempire.tech, los sitios de los proyectos, las fuentes de noticias y los botones para compartir en X, Facebook, LinkedIn, WhatsApp y Telegram salen de este sitio. A partir de ahí aplican sus términos.',
        ],
      },
      {
        heading: 'Publicidad',
        paragraphs: [
          'El sitio declara una cuenta de Google AdSense, editor ca-pub-1675722214703683. El archivo de vendedores autorizados está en /ads.txt. Hoy el sitio no muestra anuncios.',
        ],
      },
      {
        heading: 'Sin garantía',
        paragraphs: [
          'El sitio se ofrece como portafolio. Sus partes, sus contenidos, la cinta de noticias y los formularios pueden cambiar o quedar fuera de línea. En la medida en que la ley lo permite, Jorge Bastidas Araujo no responde por decisiones que tomes a partir del contenido, ni por caídas de servicios de terceros.',
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
          'La versión vigente de estos términos está fechada el 11 de noviembre de 2026. Seguir usando el sitio después de un cambio en esta página significa que lo usas bajo los términos actualizados.',
        ],
      },
    ],
  },
};
