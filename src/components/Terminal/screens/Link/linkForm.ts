import { LINK_LIMITS, LINK_NOTES } from '@/data/terminal/channel';
import type { SignalPayload, SignalResult } from '@/interfaces/signal';
import type { Bilingual, TerminalLang } from '@/interfaces/terminal';

export interface LinkFormValues {
  alias: string;
  email: string;
  msg: string;
  topics: string[];
}

export type LinkFormField = 'alias' | 'email';

export interface LinkFormCheck {
  /** First field to fix (focus goes there), null when valid. */
  invalid: LinkFormField | null;
  aliasInvalid: boolean;
  emailInvalid: boolean;
}

/**
 * Client checks of the original submit handler: alias required, email required and valid.
 * `emailValid` is the browser's type=email validity.
 */
export const checkLinkForm = (v: LinkFormValues, emailValid: boolean): LinkFormCheck => {
  const aliasInvalid = !v.alias.trim();
  const emailInvalid = !v.email.trim() || !emailValid;
  return { invalid: aliasInvalid ? 'alias' : emailInvalid ? 'email' : null, aliasInvalid, emailInvalid };
};

/** Note shown for a failed check. */
export const checkNote = (field: LinkFormField): Bilingual => (field === 'alias' ? LINK_NOTES.noAlias : LINK_NOTES.badEmail);

/** Body of POST /senal from the desktop terminal. */
export const buildSignalPayload = (v: LinkFormValues, lang: TerminalLang): SignalPayload => ({
  alias: v.alias.trim().slice(0, LINK_LIMITS.alias),
  email: v.email.trim().slice(0, LINK_LIMITS.email),
  whatsapp: '',
  msg: v.msg.trim().slice(0, LINK_LIMITS.msg),
  origen: 'escritorio',
  topics: v.topics,
  lang,
  web: '',
});

/** Note for a failed send: server-side alias/email rejections reuse the client texts. */
export const failureNote = (result: SignalResult): Bilingual => {
  if (result.error === 'unavailable') return LINK_NOTES.unavailable;
  if (result.error === 'alias') return LINK_NOTES.noAlias;
  if (result.error === 'correo') return LINK_NOTES.badEmail;
  return LINK_NOTES.failed;
};
