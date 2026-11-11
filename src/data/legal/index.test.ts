import { describe, expect, it } from 'vitest';
import { ABOUT_SECTIONS } from '@/data/profile/about';
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

/** Things of the old site that no longer exist and must not come back into the legal texts. */
const RETIRED = ['NEXT_LOCALE', 'd9-session-seen', 'd9-agent-name', 'Solvo', 'guía en vivo', 'live guide'];
const STORAGE_KEYS = ['d9crt-lang', 'd9crt-fx', 'd9crt-mute', 'd9m-mute', 'tf-sound'];

describe('legal content of the new site', () => {
  const about = JSON.stringify(ABOUT_SECTIONS);

  it.each(RETIRED)('does not mention %s', (term) => {
    for (const copy of Object.values(LEGAL_COPY)) {
      expect(JSON.stringify(copy).toLowerCase()).not.toContain(term.toLowerCase());
    }
    expect(about.toLowerCase()).not.toContain(term.toLowerCase());
  });

  it('lists every localStorage key the site uses, in both languages', () => {
    for (const copy of Object.values(LEGAL_COPY)) {
      const text = JSON.stringify(copy.privacy);
      for (const key of STORAGE_KEYS) expect(text).toContain(key);
    }
  });

  it('names the form backend, the rate limit and the analytics id', () => {
    for (const copy of Object.values(LEGAL_COPY)) {
      const text = JSON.stringify(copy.privacy);
      for (const fact of ['decode9-api', 'Cloudflare D1', 'SHA-256', 'G-VMLFSX6GXW', 'hn.algolia.com', 'Resend']) {
        expect(text).toContain(fact);
      }
    }
  });

  it('dates both documents on 11 November 2026', () => {
    expect(LEGAL_COPY.es.updated).toBe('11 de noviembre de 2026');
    expect(LEGAL_COPY.en.updated).toBe('11 November 2026');
  });

  it('keeps the same sections in both languages', () => {
    for (const kind of ['privacy', 'terms'] as const) {
      expect(LEGAL_COPY.en[kind].sections.map((s) => s.paragraphs.length)).toEqual(
        LEGAL_COPY.es[kind].sections.map((s) => s.paragraphs.length),
      );
    }
  });

  it('keeps meta descriptions within search snippet length', () => {
    for (const copy of Object.values(LEGAL_COPY)) {
      for (const kind of ['privacy', 'terms'] as const) {
        expect(copy[kind].metaDescription.length).toBeGreaterThanOrEqual(50);
        expect(copy[kind].metaDescription.length).toBeLessThanOrEqual(160);
      }
    }
  });
});
