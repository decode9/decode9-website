/** Wire format of Solvo's public web-chat channel (panel-ia-api, F12). */

export interface SolvoMessageDto {
  id: string;
  autor: 'visitante' | 'negocio';
  texto: string;
  enviadoAt: string;
  adjunto: { titulo: string; url: string | null; tipo: string } | null;
}

export interface SolvoAppearanceDto {
  color: string;
  saludo: string;
  posicion: 'derecha' | 'izquierda';
  nombreVisible: string;
}

export interface SolvoSessionDto {
  pase: string;
  apariencia: SolvoAppearanceDto;
  mensajes: SolvoMessageDto[];
}

/** `estado` is Solvo's IncomingResult status: respondido, acumulado, control_humano, pausado, filtrado, registrado, duplicado. */
export interface SolvoSendDto {
  estado: string;
  mensajes: SolvoMessageDto[];
}

export interface SolvoPollDto {
  mensajes: SolvoMessageDto[];
}

export interface SolvoErrorDto {
  error?: string;
  message?: string;
  code?: string;
  details?: { code?: string } | unknown;
}
