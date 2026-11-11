/** Base path of the demonoid portraits (config D9M.assets of the original). */
export const PORTRAIT_BASE = '/decode9/img/m/';

export const PORTRAITS = {
  listen: 'codec-escucha.jpg',
  talk: 'codec-habla.jpg',
  think: 'codec-piensa.jpg',
  lost: 'codec-perdida.jpg',
  static: 'codec-estatica.jpg',
} as const;

export type PortraitImage = (typeof PORTRAITS)[keyof typeof PORTRAITS];
