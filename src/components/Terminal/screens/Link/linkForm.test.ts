import { describe, expect, it } from 'vitest';
import { LINK_NOTES } from '@/data/terminal/channel';
import { buildSignalPayload, checkLinkForm, failureNote } from './linkForm';

const values = { alias: ' neo ', email: ' a@b.co ', msg: ' hola ', topics: ['IA'] };

describe('linkForm', () => {
  it('requires alias, then a valid email', () => {
    expect(checkLinkForm({ ...values, alias: ' ' }, true).invalid).toBe('alias');
    expect(checkLinkForm({ ...values, email: '' }, true).invalid).toBe('email');
    expect(checkLinkForm(values, false)).toEqual({ invalid: 'email', aliasInvalid: false, emailInvalid: true });
    expect(checkLinkForm(values, true).invalid).toBeNull();
  });

  it('builds the desktop payload', () => {
    expect(buildSignalPayload({ ...values, msg: 'x'.repeat(600) }, 'en')).toEqual({
      alias: 'neo',
      email: 'a@b.co',
      whatsapp: '',
      msg: 'x'.repeat(500),
      origen: 'escritorio',
      topics: ['IA'],
      lang: 'en',
      web: '',
    });
  });

  it('maps gateway errors to notes', () => {
    expect(failureNote({ ok: false, error: 'unavailable' })).toBe(LINK_NOTES.unavailable);
    expect(failureNote({ ok: false, error: 'correo' })).toBe(LINK_NOTES.badEmail);
    expect(failureNote({ ok: false, error: 'net' })).toBe(LINK_NOTES.failed);
  });
});
