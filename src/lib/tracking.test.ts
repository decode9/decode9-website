import { describe, expect, it, vi } from 'vitest';
import type { Analytics } from '@/interfaces/analytics';
import type { SignalPayload } from '@/interfaces/signal';
import { createAnalytics, withSignalTracking, withWalkieTracking } from './tracking';

const payload: SignalPayload = {
  alias: 'neo',
  email: 'neo@example.com',
  whatsapp: '',
  msg: 'texto privado del visitante',
  origen: 'movil',
  web: '',
};

const spyTracker = () => {
  const track = vi.fn();
  return { tracker: { track } as Analytics, track };
};

describe('createAnalytics', () => {
  it('forwards the event name and params to GA', () => {
    const send = vi.fn();
    createAnalytics(send).track({ name: 'choose_side', params: { side: 'red' } });
    expect(send).toHaveBeenCalledWith('choose_side', { side: 'red' });
  });

  it('never throws when GA fails', () => {
    const send = vi.fn(() => {
      throw new Error('gtag');
    });
    expect(() => createAnalytics(send).track({ name: 'd9_jump' })).not.toThrow();
  });
});

describe('withSignalTracking', () => {
  it('records origin and outcome, never the visitor text', async () => {
    const { tracker, track } = spyTracker();
    const gateway = withSignalTracking({ send: async () => ({ ok: true, code: 'SOS-1234' }) }, tracker);
    await expect(gateway.send(payload)).resolves.toEqual({ ok: true, code: 'SOS-1234' });
    expect(track).toHaveBeenCalledWith({ name: 'signal_sent', params: { origen: 'movil', ok: true } });
    expect(JSON.stringify(track.mock.calls)).not.toContain('privado');
    expect(JSON.stringify(track.mock.calls)).not.toContain('neo');
  });

  it('records failures and skips when the API is not configured', async () => {
    const { tracker, track } = spyTracker();
    await withSignalTracking({ send: async () => ({ ok: false, error: 'net' }) }, tracker).send(payload);
    expect(track).toHaveBeenLastCalledWith({ name: 'signal_sent', params: { origen: 'movil', ok: false } });
    await withSignalTracking({ send: async () => ({ ok: false, error: 'unavailable' }) }, tracker).send(payload);
    expect(track).toHaveBeenCalledTimes(1);
  });
});

describe('withWalkieTracking', () => {
  it.each([
    ['ok', true],
    ['failed', false],
    ['rate-limited', false],
    ['empty', false],
  ] as const)('status %s → ok:%s', async (status, ok) => {
    const { tracker, track } = spyTracker();
    await withWalkieTracking({ send: async () => ({ status }) }, tracker).send({ texto: 'hola', web: '', lang: 'es' });
    expect(track).toHaveBeenCalledWith({ name: 'walkie_sent', params: { ok } });
  });

  it('skips when the API is not configured', async () => {
    const { tracker, track } = spyTracker();
    await withWalkieTracking({ send: async () => ({ status: 'unavailable' }) }, tracker).send({ texto: 'hola', web: '', lang: 'es' });
    expect(track).not.toHaveBeenCalled();
  });
});
