/** One line of the call transcript: time stamp, bold lead-in and the rest of the text. */
export interface CallLine {
  t: string;
  b: string;
  x: string;
}

/** Opening lines; the first one greets the investigator by alias when coming from the terminal QR. */
export const buildCallLines = (alias: string): readonly [CallLine, CallLine] => [
  alias
    ? {
        t: '00:01',
        b: `Hola, investigador ${alias}.`,
        x: ' Aquí decode9; te reconozco, vienes de la terminal. Activaste el transmisor de emergencia y nadie lo enciende por curiosidad.',
      }
    : { t: '00:01', b: 'Aquí decode9.', x: ' Veo que activaste el transmisor de emergencia. Nadie lo enciende por curiosidad.' },
  {
    t: '00:06',
    b: '',
    x: 'Eso significa que necesitamos contactarnos y hablar. Mantente en la frecuencia, voy a abrir el canal con el investigador…',
  },
];

/** The call drops. */
export const CALL_LOST: CallLine = { t: '00:11', b: '', x: '…la interferencia del Averno no me deja sostener la lla—' };

/** After the drop: invitation to the dial. */
export const CALL_AFTER: CallLine = {
  t: '00:14',
  b: 'Mientras lo logramos:',
  x: ' déjame tu frecuencia y te devuelvo la llamada. Y para la espera, te dejo mis videos y lecturas en el dial.',
};

export const CALL_TEXT = {
  tag: 'DECODE9 · TRANSMISOR',
  linkedTag: (alias: string) => `ENLAZADO · ${alias.toUpperCase()}`,
  hello: 'HOLA, INVESTIGADOR',
  live: 'EN VIVO',
  warnTitle: '! LLAMADA ENTRANTE · 147.9',
  warnBody: ['Encendiste el transmisor de emergencia.', 'Del otro lado alguien quiere hablar contigo.'],
  slide: 'DESLIZA PARA CONTESTAR',
  bar: 'FRECUENCIA DE EMERGENCIA',
  online: '● EN LÍNEA',
  interference: '○ INTERFERENCIA',
  skip: ['TOCA PARA', 'SALTAR'],
  restore: ['RESTABLECER', 'CONTACTO'],
} as const;
