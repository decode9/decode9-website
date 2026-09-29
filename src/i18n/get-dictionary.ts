import type { Locale } from './config';
import en from './dictionaries/en.json';
import es from './dictionaries/es.json';

/** English is the source of truth; Spanish must match its shape exactly. */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  es: es satisfies Dictionary,
};

/** Server-side only: each page serialises just its own dictionary to the client. */
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
