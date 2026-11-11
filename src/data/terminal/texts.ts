import type { Bilingual } from '@/interfaces/terminal';

/** Shell texts of the terminal (login, welcome, bars). Content screens keep their own data files. */
export const LOGIN_TEXT = {
  system: ['decode9 OS · enlace interdimensional', 'decode9 OS · interdimensional link'],
  ask: ['Usuario que requiere acceso', 'User requesting access'],
  enter: ['Entrar', 'Enter'],
  hint: ['Tu nombre o tu alias. Nada más.', 'Your name or alias. Nothing else.'],
  empty: ['Escribe tu nombre o tu alias.', 'Type your name or alias.'],
  bad: ['Ese nombre no pasa el filtro. Usa tu nombre o un alias.', 'That name doesn’t pass the filter. Use your name or an alias.'],
  invalid: ['Solo nombres: letras y, si quieres, números, punto o guion.', 'Names only: letters and, if you like, numbers, dot or hyphen.'],
  granted: ['Acceso autorizado', 'Access granted'],
} as const satisfies Record<string, Bilingual>;

/** Loading steps after a valid name: message and bar percentage. */
export const LOGIN_STEPS: ReadonlyArray<{ t: Bilingual; pct: number }> = [
  { t: ['verificando usuario…', 'verifying user…'], pct: 22 },
  { t: ['sincronizando con el Averno…', 'syncing with the Averno…'], pct: 48 },
  { t: ['cargando archivos del investigador…', 'loading researcher archives…'], pct: 74 },
  { t: ['preparando compuerta…', 'preparing gate…'], pct: 100 },
];

export const WELCOME_TEXT = {
  bar: ['Mensaje del sistema', 'System message'],
  authorized: ['Usuario autorizado · investigador', 'Authorized user · researcher'],
  entering: ['Ingresando a los archivos de los demonoides…', 'Entering the demonoid archives…'],
  premise: ['Premisa', 'Premise'],
  method: ['observar → preguntar → suponer → experimentar → probar', 'observe → ask → hypothesize → experiment → test'],
  quote: [
    'El conocimiento no es lo que ya sabes: es lo que sigue en pie después de intentar refutarlo. Empieza por tus propias certezas.',
    'Knowledge isn’t what you already know: it’s what’s still standing after you try to refute it. Start with your own certainties.',
  ],
  go: ['Continuar', 'Continue'],
  deciphering: ['Descifrando los sellos del archivo…', 'Deciphering the archive seals…'],
  deciphered: ['Sellos descifrados · acceso de investigador concedido', 'Seals deciphered · researcher access granted'],
} as const satisfies Record<string, Bilingual>;

export const PORTAL_TEXT = {
  ask: ['Elige tu camino.', 'Choose your path.'],
  foot: ['Roja: entras a los archivos de decode9. Azul: el perfil profesional.', 'Red: enter the decode9 archives. Blue: the professional profile.'],
  redLabel: 'Pastilla roja: entrar a decode9 / Red pill: enter decode9',
  blueLabel: 'Pastilla azul: perfil profesional de Jorge Bastidas / Blue pill: Jorge Bastidas professional profile',
} as const;

export const SHELL_TEXT = {
  exit: ['Salir', 'Exit'],
  subject: ['SUJETO', 'SUBJECT'],
  signal: ['SEÑAL', 'SIGNAL'],
  researching: 'EN INVESTIGACIÓN',
  ticker: 'UNDERSTAND · BREAK · BUILD · EVOLVE',
  closedWindows: ['Ventanas cerradas', 'Closed windows'],
  desktop: ['Escritorio', 'Desktop'],
  sessionOpened: ['sesión abierta: ', 'session opened: '],
} as const;

/** Context menu of the window manager. */
export const CONTEXT_MENU_TEXT = {
  front: ['Traer al frente', 'Bring to front'],
  minimize: ['Minimizar', 'Minimize'],
  restore: ['Restaurar', 'Restore'],
  close: ['Cerrar ventana', 'Close window'],
  arrange: ['Reorganizar por tema', 'Arrange by topic'],
  cascade: ['Organizar en cascada', 'Cascade'],
  closeAll: ['Cerrar todas', 'Close all'],
} as const satisfies Record<string, Bilingual>;
