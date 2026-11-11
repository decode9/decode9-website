import { describe, expect, it } from 'vitest';
import { SITE_URL } from '@/lib/seo/site';
import { LEGAL_COPY, LEGAL_ENTITY, LEGAL_PATHS } from '.';

describe('legal identity', () => {
  it('publishes the legal name and CUIL in both languages', () => {
    for (const copy of Object.values(LEGAL_COPY)) {
      expect(copy.privacy.lead).toContain(LEGAL_ENTITY.name);
      expect(copy.privacy.lead).toContain(LEGAL_ENTITY.cuil);
      expect(copy.terms.lead).toContain(LEGAL_ENTITY.name);
      expect(copy.terms.lead).toContain(LEGAL_ENTITY.cuil);
      expect(JSON.stringify(copy)).toContain(LEGAL_ENTITY.name);
      expect(JSON.stringify(copy)).toContain(LEGAL_ENTITY.cuil);
    }
  });

  it('keeps the public paths stable', () => {
    expect(LEGAL_PATHS.en.privacy).toBe('/privacy/');
    expect(LEGAL_PATHS.en.terms).toBe('/terms/');
    expect(LEGAL_PATHS.es.privacy).toBe('/es/privacidad/');
    expect(LEGAL_PATHS.es.terms).toBe('/es/terminos/');
  });

  it('points the website at the public origin', () => {
    expect(LEGAL_ENTITY.website).toBe(SITE_URL);
  });
});
