import type { WorldTick } from '@/interfaces/profile';

/** Ticker text per stop while there are no headlines (TICK of the original). */
export const TICKS: readonly WorldTick[] = [
  ['Origen', 'tierra fértil', 'fundamentos', 'Suelo › Vida › Infraestructura › Red'],
  ['Arena', 'sol abundante', 'energía solar', 'Polvo › Energía solar › Hábitat › Red'],
  ['Hielo', 'hielo y viento', 'datos que escalan', 'Deshielo › Viento › Datos › Red'],
  ['Núcleo', 'calor del núcleo', 'geotermia y forja', 'Enfriar › Geotermia › Forja › Red'],
  ['Colonia', 'talento en bruto', 'equipo que crece', 'Escuchar › Organizar › Construir juntos › Red'],
  ['Mundo por descubrir', 'tu idea', 'un sistema completo', 'Idea › Conversación › Plan › Construcción'],
  ['Averno · decode9', 'fuego', 'la versión investigadora', 'Entender › Romper › Construir › Evolucionar'],
];
