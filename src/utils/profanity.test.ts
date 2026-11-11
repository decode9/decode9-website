import { describe, expect, it } from 'vitest';
import { cleanName, isBad, validName } from './profanity';

describe('isBad', () => {
  it('accepts normal names', () => {
    expect(isBad('Jorge')).toBe(false);
    expect(isBad('María José')).toBe(false);
  });
  it('rejects blocked words as tokens', () => {
    expect(isBad('el idiota')).toBe(true);
    expect(isBad('ASS')).toBe(true);
  });
  it('rejects blocked roots inside the name and leetspeak', () => {
    expect(isBad('superfuckguy')).toBe(true);
    expect(isBad('p.u.t.a')).toBe(true);
    expect(isBad('5h1t')).toBe(true);
    expect(isBad('Cabrón')).toBe(true);
  });
  it('does not block words that only contain a short token', () => {
    expect(isBad('Cassandra')).toBe(false);
  });
});

describe('validName', () => {
  it('accepts letters, numbers, dot and hyphen', () => {
    expect(validName('Jo')).toBe(true);
    expect(validName('Ñandú-9')).toBe(true);
    expect(validName("O'Neil Jr.")).toBe(true);
  });
  it('rejects bad shapes', () => {
    expect(validName('J')).toBe(false);
    expect(validName('9lives')).toBe(false);
    expect(validName('a1')).toBe(false);
    expect(validName('a'.repeat(25))).toBe(false);
    expect(validName('hola<script>')).toBe(false);
  });
});

describe('cleanName', () => {
  it('collapses whitespace', () => {
    expect(cleanName('  Ana   Paula ')).toBe('Ana Paula');
  });
});
