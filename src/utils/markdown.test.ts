import { describe, expect, it } from 'vitest';
import { parseInline, parseMarkdown, toPlainText } from './markdown';

describe('parseInline', () => {
  it('parses double and WhatsApp-style bold', () => {
    expect(parseInline('**hola** y *chau*.')).toEqual([
      { type: 'strong', children: [{ type: 'text', value: 'hola' }] },
      { type: 'text', value: ' y ' },
      { type: 'strong', children: [{ type: 'text', value: 'chau' }] },
      { type: 'text', value: '.' },
    ]);
  });

  it('does not treat a lone asterisk inside words as bold', () => {
    expect(parseInline('2*3*4')).toEqual([{ type: 'text', value: '2*3*4' }]);
  });

  it('parses labelled and bare links, only http(s)', () => {
    expect(parseInline('ver [sitio](https://decode9.codes) o https://solvo.lat')).toEqual([
      { type: 'text', value: 'ver ' },
      { type: 'link', href: 'https://decode9.codes', children: [{ type: 'text', value: 'sitio' }] },
      { type: 'text', value: ' o ' },
      { type: 'link', href: 'https://solvo.lat', children: [{ type: 'text', value: 'https://solvo.lat' }] },
    ]);
    expect(parseInline('[x](javascript:alert(1))')).toEqual([{ type: 'text', value: '[x](javascript:alert(1))' }]);
  });

  it('keeps raw HTML as text', () => {
    expect(toPlainText(parseInline('<img src=x onerror=alert(1)>'))).toBe('<img src=x onerror=alert(1)>');
  });
});

describe('parseMarkdown', () => {
  it('groups consecutive bullets into one list and skips blank lines', () => {
    const blocks = parseMarkdown('Servicios:\n- MVP\n• *IA*\n\nListo');
    expect(blocks.map((block) => block.type)).toEqual(['paragraph', 'list', 'paragraph']);
    const list = blocks[1];
    expect(list?.type === 'list' && list.items.length).toBe(2);
  });
});
