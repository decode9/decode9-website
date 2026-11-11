import { BAD_ROOTS, BAD_WORDS } from '@/data/profanity';

/** Lowercases, strips accents and undoes leetspeak (0→o, 1/!/|→i, 3→e, 4/@→a, 5/$→s, 7→t). */
export const normalizeName = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/0/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/3/g, 'e')
    .replace(/[4@]/g, 'a')
    .replace(/[5$]/g, 's')
    .replace(/7/g, 't');

/** True when the text contains a blocked word (as a token) or a blocked root (anywhere). */
export const isBad = (text: string): boolean => {
  const normalized = normalizeName(text);
  const tokens = normalized.split(/[^a-zñ]+/).filter(Boolean);
  if (tokens.some((word) => BAD_WORDS.includes(word))) return true;
  const flat = normalized.replace(/[^a-zñ]/g, '');
  return BAD_ROOTS.some((root) => flat.includes(root));
};

/** Collapses inner whitespace and trims (original cleanName). */
export const cleanName = (text: string): string => text.replace(/\s+/g, ' ').trim();

/** 2–24 chars, starts with a letter, letters/numbers/space . _ ' - only, with at least two letters in a row. */
export const validName = (text: string): boolean =>
  /^[A-Za-zÀ-ÖØ-öø-ÿÑñ][A-Za-zÀ-ÖØ-öø-ÿÑñ0-9 ._'-]{1,23}$/.test(text) && /[A-Za-zÀ-ÿ]{2}/.test(text);
