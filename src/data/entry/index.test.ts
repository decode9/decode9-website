import { describe, expect, it } from 'vitest';
import { resolveDestination } from '.';

describe('resolveDestination', () => {
  it('blue always goes to the profile', () => {
    expect(resolveDestination('blue', { isMobile: true, forceDesktop: false }).url).toBe('/perfil/');
  });

  it('red goes to the transmitter on phones, unless ?escritorio=1', () => {
    expect(resolveDestination('red', { isMobile: true, forceDesktop: false }).url).toBe('/decode9/movil/');
    expect(resolveDestination('red', { isMobile: true, forceDesktop: true }).url).toBe('/decode9/?escritorio=1');
    expect(resolveDestination('red', { isMobile: false, forceDesktop: false }).url).toBe('/decode9/');
  });
});
