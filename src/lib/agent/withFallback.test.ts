import { describe, expect, it, vi } from 'vitest';
import type { ConversationalAgent } from '@/interfaces/agent';
import createOfflineAgent from './createOfflineAgent';
import { createAgentError } from './errors';
import withFallback from './withFallback';

const failing = (kind: Parameters<typeof createAgentError>[0]): ConversationalAgent => ({
  capabilities: { live: true, identify: true },
  open: () => Promise.reject(createAgentError(kind)),
  send: () => Promise.reject(createAgentError(kind)),
  poll: () => Promise.reject(createAgentError(kind)),
  identify: () => Promise.reject(createAgentError(kind)),
});

const offline = () => createOfflineAgent({ reply: 'offline reply' }, () => new Date('2026-09-28T00:00:00Z'));

describe('withFallback', () => {
  it('switches to the fallback for good when the primary is unavailable', async () => {
    const onFallback = vi.fn();
    const agent = withFallback(failing('unavailable'), offline(), onFallback);
    expect(agent.capabilities.live).toBe(true);
    const result = await agent.send('hola');
    expect(result.messages.map((message) => message.role)).toEqual(['visitor', 'agent']);
    expect(result.messages[1]?.text).toBe('offline reply');
    expect(agent.capabilities.live).toBe(false);
    expect(onFallback).toHaveBeenCalledWith('unavailable');
  });

  it('rethrows transient states so the UI can explain them', async () => {
    const agent = withFallback(failing('rateLimited'), offline());
    await expect(agent.send('x')).rejects.toMatchObject({ kind: 'rateLimited' });
    expect(agent.capabilities.live).toBe(true);
  });
});

describe('withFallback background calls', () => {
  it('never switches agents because of a failed poll', async () => {
    const agent = withFallback(failing('network'), offline());
    await expect(agent.poll('m1')).rejects.toMatchObject({ kind: 'network' });
    expect(agent.capabilities.live).toBe(true);
  });
});

describe('createOfflineAgent', () => {
  it('never claims identify support', async () => {
    const agent = offline();
    expect(agent.capabilities.identify).toBe(false);
    await expect(agent.identify({ email: 'a@b.co' })).rejects.toMatchObject({ kind: 'unavailable' });
    expect(await agent.poll(null)).toEqual([]);
  });
});
