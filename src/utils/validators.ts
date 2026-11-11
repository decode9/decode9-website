/*
 * Contact-form rules shared by the terminal «canal» and the mobile «contacto».
 * Same rules as the original JS and senal.php (the worker re-checks them).
 */

export const LIMITS = { alias: 40, email: 120, whatsapp: 40, msg: 500, topics: 10, walkieMin: 3 } as const;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const WHATSAPP_PATTERN = /^\+?[\d\s-]{7,}$/;

/** Alias: at least 2 characters once trimmed (senal.php → error 'alias'). */
export const isValidAlias = (alias: string): boolean => alias.trim().length >= 2;

export const isValidEmail = (email: string): boolean => EMAIL_PATTERN.test(email.trim());

/** Digits, spaces and dashes, optional leading +, at least 7 characters. */
export const isValidWhatsapp = (phone: string): boolean => WHATSAPP_PATTERN.test(phone.trim());

export type ReturnChannel = { kind: 'email'; value: string } | { kind: 'whatsapp'; value: string };

/**
 * Mobile «regreso» field: one input that takes an email or a WhatsApp number.
 * Contains '@' → email, otherwise WhatsApp (original: `isMail = rg.includes('@')`). Null when invalid.
 */
export const parseReturnChannel = (raw: string): ReturnChannel | null => {
  const value = raw.trim();
  if (value.includes('@')) return isValidEmail(value) ? { kind: 'email', value: value.slice(0, LIMITS.email) } : null;
  return isValidWhatsapp(value) ? { kind: 'whatsapp', value: value.slice(0, LIMITS.whatsapp) } : null;
};

/** Walkie message: at least 3 characters once trimmed. */
export const isValidWalkieText = (text: string): boolean => text.trim().length >= LIMITS.walkieMin;
