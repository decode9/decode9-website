/** Sections of the profile's "About" sheet: a short version of /es/privacidad/ and /es/terminos/. */
export interface AboutSection {
  h: string;
  p: string[];
}

export const ABOUT_SECTIONS: readonly AboutSection[] = [
  {
    h: 'Derechos',
    p: [
      '© 2026 decode9 · Jorge Bastidas. Los textos, la marca, las ilustraciones y el código de este sitio no se pueden reproducir sin autorización.',
    ],
  },
  {
    h: 'Privacidad',
    p: [
      'Si escribes por el walkie, tu mensaje y el correo o número que incluyas se guardan en el servicio del sitio (Cloudflare) para poder responderte. No se borran solos: pide su eliminación a decode9.dev@gmail.com. No se venden.',
      'Para limitar abusos (5 envíos cada 10 minutos) se guarda una huella anónima de la conexión, un hash con sal, nunca tu dirección IP.',
    ],
  },
  {
    h: 'En tu navegador',
    p: [
      'El sitio no crea cookies propias. Solo recuerda en el localStorage si dejaste el sonido encendido o apagado. Google Analytics mide las visitas sin recibir lo que escribes.',
    ],
  },
  {
    h: 'Contenido de terceros',
    p: [
      'La sección Actualidad muestra titulares públicos de php.net, CoinDesk, Hacker News, Ars Technica y TechCrunch, con enlace a cada nota. Los consulta el servidor; si falla, tu navegador pide la portada de Hacker News. Las tipografías vienen incluidas en el sitio.',
    ],
  },
  {
    h: 'Sonido',
    p: ['El ambiente espacial se genera en tu navegador y puedes apagarlo con el botón de la barra inferior.'],
  },
];
