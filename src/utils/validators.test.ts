import { describe, expect, it } from 'vitest';
import { isValidAlias, isValidEmail, isValidWalkieText, isValidWhatsapp, parseReturnChannel } from './validators';

describe('isValidAlias', () => {
  it('needs two characters after trimming', () => {
    expect(isValidAlias('Jo')).toBe(true);
    expect(isValidAlias(' J ')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it('follows name@domain.tld', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('a b@c.com')).toBe(false);
  });
});

describe('isValidWhatsapp', () => {
  it('accepts +, digits, spaces and dashes from 7 chars', () => {
    expect(isValidWhatsapp('+57 300-123 4567')).toBe(true);
    expect(isValidWhatsapp('1234567')).toBe(true);
    expect(isValidWhatsapp('123456')).toBe(false);
    expect(isValidWhatsapp('300abc4567')).toBe(false);
  });
});

describe('parseReturnChannel', () => {
  it('chooses email when there is an @', () => {
    expect(parseReturnChannel(' yo@mail.com ')).toEqual({ kind: 'email', value: 'yo@mail.com' });
    expect(parseReturnChannel('yo@mail')).toBeNull();
  });
  it('chooses WhatsApp otherwise', () => {
    expect(parseReturnChannel('+1 786 555 0000')).toEqual({ kind: 'whatsapp', value: '+1 786 555 0000' });
    expect(parseReturnChannel('hola')).toBeNull();
  });
});

describe('isValidWalkieText', () => {
  it('needs three characters', () => {
    expect(isValidWalkieText('hey')).toBe(true);
    expect(isValidWalkieText('  hi ')).toBe(false);
  });
});
