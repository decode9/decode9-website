import { describe, expect, it } from 'vitest';
import { buildJsonLd, serializeJsonLd } from './jsonLd';
import { buildPageMetadata } from './metadata';
import { PAGES, type PageKey } from './site';

const KEYS = Object.keys(PAGES) as PageKey[];

describe('site SEO copy', () => {
  it.each(KEYS)('%s: title 50–60 and description 140–160 characters', (key) => {
    expect(PAGES[key].title.length).toBeGreaterThanOrEqual(50);
    expect(PAGES[key].title.length).toBeLessThanOrEqual(60);
    expect(PAGES[key].description.length).toBeGreaterThanOrEqual(140);
    expect(PAGES[key].description.length).toBeLessThanOrEqual(160);
  });

  it.each(KEYS)('%s: own OG image with a descriptive alt, Latin American locale, no twitter handle', (key) => {
    const meta = buildPageMetadata(key);
    const og = meta.openGraph as { locale: string; images: { url: string; alt: string }[] };
    expect(og.locale).toBe('es_LA');
    expect(og.images[0].url).toMatch(/^\/og\/.+\.jpg$/);
    expect(og.images[0].alt.length).toBeGreaterThan(30);
    expect(meta.twitter).not.toHaveProperty('site');
    expect(meta.twitter).not.toHaveProperty('creator');
  });
});

describe('JSON-LD', () => {
  it.each(KEYS)('%s: serializes to valid JSON with WebSite, a WebPage and a Person', (key) => {
    const graph = JSON.parse(serializeJsonLd(key))['@graph'] as { '@type': string }[];
    const types = graph.map((node) => node['@type']);
    expect(types).toContain('WebSite');
    expect(types).toContain('Person');
    expect(types).toContain(key === 'profile' ? 'ProfilePage' : 'WebPage');
  });

  it('profile: ProfilePage mainEntity is the full Person', () => {
    const graph = buildJsonLd('profile')['@graph'] as Record<string, unknown>[];
    const page = graph.find((n) => n['@type'] === 'ProfilePage') as { mainEntity: { '@id': string } };
    const person = graph.find((n) => n['@type'] === 'Person') as { '@id': string; knowsAbout: string[] };
    expect(page.mainEntity['@id']).toBe(person['@id']);
    expect(person.knowsAbout.length).toBeGreaterThan(3);
  });
});
