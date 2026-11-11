import { afterEach, describe, expect, it, vi } from 'vitest';
import { argentinaHour, isNightHour, NIGHT_END, NIGHT_START, parseHourParam, resolveNightHour, showsNightSimulator } from './nightClock';

describe('argentinaHour', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is UTC-3 regardless of the visitor time zone', () => {
    expect(argentinaHour(new Date('2026-11-11T02:30:00Z'))).toBe(23);
    expect(argentinaHour(new Date('2026-11-11T03:00:00Z'))).toBe(0);
    expect(argentinaHour(new Date('2026-07-01T15:59:00Z'))).toBe(12);
  });

  it('falls back to UTC-3 when Intl fails', () => {
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
      throw new RangeError('no tz data');
    });
    expect(argentinaHour(new Date('2026-11-11T01:00:00Z'))).toBe(22);
    expect(argentinaHour(new Date('2026-11-11T10:00:00Z'))).toBe(7);
  });
});

describe('isNightHour', () => {
  it('runs from 20:00 to 07:00', () => {
    expect(NIGHT_START).toBe(20);
    expect(NIGHT_END).toBe(7);
    expect(isNightHour(19)).toBe(false);
    expect(isNightHour(20)).toBe(true);
    expect(isNightHour(23)).toBe(true);
    expect(isNightHour(0)).toBe(true);
    expect(isNightHour(6)).toBe(true);
    expect(isNightHour(7)).toBe(false);
    expect(isNightHour(12)).toBe(false);
  });
});

describe('?hora= and ?sim=', () => {
  it('parses any numeric hour, ignores empty or invalid values', () => {
    expect(parseHourParam('?hora=23')).toBe(23);
    expect(parseHourParam('?hora=0')).toBe(0);
    expect(parseHourParam('?sim=1&hora=5')).toBe(5);
    expect(parseHourParam('?hora=')).toBeNull();
    expect(parseHourParam('?hora=noche')).toBeNull();
    expect(parseHourParam('')).toBeNull();
  });

  it('prefers ?hora= over the clock', () => {
    const noonInAr = new Date('2026-11-11T15:00:00Z');
    expect(resolveNightHour('?hora=23', noonInAr)).toBe(23);
    expect(resolveNightHour('', noonInAr)).toBe(12);
    expect(resolveNightHour('?hora=x', noonInAr)).toBe(12);
  });

  it('shows the simulator only with sim=1', () => {
    expect(showsNightSimulator('?sim=1')).toBe(true);
    expect(showsNightSimulator('?hora=23&sim=1')).toBe(true);
    expect(showsNightSimulator('?sim=0')).toBe(false);
    expect(showsNightSimulator('')).toBe(false);
  });
});
