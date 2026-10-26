import { describe, expect, it } from 'vitest';
import { SESSION_PATH, bootScript } from './inlineScripts';

describe('bootScript', () => {
  it('treats only the session homes as the preloader routes', () => {
    expect(SESSION_PATH.test('/')).toBe(true);
    expect(SESSION_PATH.test('/es/')).toBe(true);
    expect(SESSION_PATH.test('/privacy/')).toBe(false);
    expect(SESSION_PATH.test('/terms/')).toBe(false);
    expect(SESSION_PATH.test('/es/privacidad/')).toBe(false);
    expect(SESSION_PATH.test('/es/terminos/')).toBe(false);
  });

  it('arms the preloader from that same path check', () => {
    const script = bootScript(true);
    expect(script).toContain(`/${SESSION_PATH.source}/.test(location.pathname)`);
    expect(script).toContain("if(session&&!matchMedia('(prefers-reduced-motion: reduce)').matches)");
    expect(script).toContain('location.pathname===\'/\'');
  });
});
