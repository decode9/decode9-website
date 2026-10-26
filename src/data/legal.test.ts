import { describe, expect, it } from 'vitest';
import en from '../i18n/dictionaries/en.json';
import es from '../i18n/dictionaries/es.json';
import { LEGAL_ENTITY, LEGAL_PATHS } from './legal';

describe('legal identity', () => {
  it('publishes the legal name and CUIL in both languages', () => {
    for (const dictionary of [en, es]) {
      expect(dictionary.legal.privacy.lead).toContain(LEGAL_ENTITY.name);
      expect(dictionary.legal.privacy.lead).toContain(LEGAL_ENTITY.cuil);
      expect(dictionary.legal.terms.lead).toContain(LEGAL_ENTITY.name);
      expect(dictionary.legal.terms.lead).toContain(LEGAL_ENTITY.cuil);
      expect(JSON.stringify(dictionary.legal)).toContain(LEGAL_ENTITY.name);
      expect(JSON.stringify(dictionary.legal)).toContain(LEGAL_ENTITY.cuil);
    }
  });

  it('keeps the public paths stable', () => {
    expect(LEGAL_PATHS.en.privacy).toBe('/privacy/');
    expect(LEGAL_PATHS.en.terms).toBe('/terms/');
    expect(LEGAL_PATHS.es.privacy).toBe('/es/privacidad/');
    expect(LEGAL_PATHS.es.terms).toBe('/es/terminos/');
  });
});
