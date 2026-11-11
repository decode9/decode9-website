import { describe, expect, it } from 'vitest';
import { transmitterUrl } from './transmitterUrl';

describe('transmitterUrl', () => {
  it('points to the mobile transmitter with the alias', () => {
    expect(transmitterUrl('Neo', 'movil/', 'https://decode9.codes/decode9/#tx')).toBe(
      'https://decode9.codes/decode9/movil/?alias=Neo&tx=1',
    );
  });

  it('trims, cuts to 24 chars and encodes', () => {
    expect(transmitterUrl('  ana maría  ', 'movil/', 'https://decode9.codes/decode9/?x=1')).toBe(
      'https://decode9.codes/decode9/movil/?alias=ana%20mar%C3%ADa&tx=1',
    );
    expect(transmitterUrl('x'.repeat(30), 'movil/', 'https://d/decode9/')).toContain(`alias=${'x'.repeat(24)}&`);
  });

  it('works without a user', () => {
    expect(transmitterUrl(null, 'movil/', 'http://localhost:3000/decode9/')).toBe('http://localhost:3000/decode9/movil/?alias=&tx=1');
  });
});
