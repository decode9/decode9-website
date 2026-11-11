import { describe, expect, it } from 'vitest';
import { buildCallLines } from '@/data/transmitter/callScript';
import { MONTHS, WEEKDAYS } from '@/data/transmitter/calendar';
import {
  buildDialTicks,
  buildFrameTicks,
  clampDialAngle,
  clampStation,
  dialWobbleTarget,
  formatElapsed,
  formatLockDate,
  formatMediaTime,
  isSentenceEnd,
  portraitGlitch,
  sanitizeAlias,
  signalBars,
  stationAtAngle,
  stationFromTap,
  syllablesInWord,
  transmitterStatus,
  typingDelay,
} from './transmitter';

describe('transmitter helpers', () => {
  it('sanitises the alias from the QR', () => {
    expect(sanitizeAlias(' <Ana>"\' ')).toBe('Ana');
    expect(sanitizeAlias(null)).toBe('');
    expect(sanitizeAlias('x'.repeat(40))).toHaveLength(24);
  });

  it('counts babble syllables and sentence ends', () => {
    expect(syllablesInWord('a')).toBe(1);
    expect(syllablesInWord('transmisor')).toBe(4);
    expect(syllablesInWord('interferencia')).toBe(4);
    expect(isSentenceEnd('curiosidad.')).toBe(true);
    expect(isSentenceEnd('lla—')).toBe(true);
    expect(isSentenceEnd('hola')).toBe(false);
  });

  it('formats clock, date and times', () => {
    const date = new Date(2026, 10, 11, 9, 5);
    expect(formatLockDate(date, WEEKDAYS, MONTHS)).toBe('MIÉ · 11 NOV 2026');
    expect(formatElapsed(75)).toBe('01:15');
    expect(formatMediaTime(Number.NaN)).toBe('00:00');
    expect(formatMediaTime(61.9)).toBe('01:01');
  });

  it('builds frame ticks only once measured', () => {
    expect(buildFrameTicks(0, 100)).toEqual([]);
    expect(buildFrameTicks(400, 500)).toHaveLength(8);
  });

  it('derives status with lost > speaking > media priority', () => {
    expect(transmitterStatus({ lost: 0.6, speaking: true, mediaOn: true })).toBe('INTERFERENCIA');
    expect(transmitterStatus({ lost: 0.45, speaking: true, mediaOn: false })).toBe('HABLANDO');
    expect(transmitterStatus({ lost: 0, speaking: false, mediaOn: true })).toBe('TRANSMITIENDO');
    expect(transmitterStatus({ lost: 0, speaking: false, mediaOn: false })).toBe('ESCUCHANDO');
  });

  it('computes signal bars and typing speed', () => {
    expect(signalBars(0, 0)).toBe(5);
    expect(signalBars(1, 0.9)).toBe(0);
    expect(typingDelay(1, 1000)).toBe(14);
    expect(typingDelay(10, 10)).toBe(42);
  });

  it('maps the dial geometry', () => {
    expect(buildDialTicks(195, 306)).toHaveLength(121);
    expect(buildDialTicks(195, 306).filter((t) => t.major)).toHaveLength(21);
    expect(clampDialAngle(50, 4, 24)).toBe(10);
    expect(clampDialAngle(-200, 4, 24)).toBe(-82);
    expect(stationAtAngle(-30, 24)).toBe(1);
    expect(stationAtAngle(5, 24)).toBe(0);
    expect(clampStation(7, 4)).toBe(3);
    expect(stationFromTap(0.1, 2)).toBe(1);
    expect(stationFromTap(0.5, 2)).toBe(2);
    expect(stationFromTap(0.9, 2)).toBe(3);
    expect(dialWobbleTarget(1, false)).toBe(0);
    expect(dialWobbleTarget(12, false)).toBeCloseTo(0.7);
    expect(dialWobbleTarget(12, true)).toBe(0);
  });

  it('glitches portraits proportionally and not at all with reduced motion', () => {
    const still = portraitGlitch(1, true, () => 0.9);
    expect(still['--no']).toBe('0.00');
    const loud = portraitGlitch(1, false, () => 0.1);
    expect(loud['--no']).toBe('0.85');
    expect(loud['--c1t']).toBeDefined();
  });

  it('greets by alias in the first call line', () => {
    expect(buildCallLines('Ana')[0].b).toBe('Hola, investigador Ana.');
    expect(buildCallLines('')[0].b).toBe('Aquí decode9.');
  });
});
