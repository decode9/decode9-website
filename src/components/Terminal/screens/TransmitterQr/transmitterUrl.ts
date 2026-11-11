import { QR_ALIAS_MAX } from '@/data/terminal/channel';

/**
 * Link the QR carries (original d9TxUrl): the mobile transmitter resolved against the current page,
 * without hash or query, plus `?alias=<name>&tx=1`. On decode9.codes it is
 * https://decode9.codes/decode9/movil/?alias=<name>&tx=1.
 */
export const transmitterUrl = (user: string | null, mobileUrl: string, pageHref: string): string => {
  const name = (user ?? '').trim().slice(0, QR_ALIAS_MAX);
  let base: string;
  try {
    base = new URL(mobileUrl || 'movil/', pageHref).href;
  } catch {
    base = 'movil/';
  }
  return `${base.split('#')[0].split('?')[0]}?alias=${encodeURIComponent(name)}&tx=1`;
};
