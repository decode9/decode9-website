import { describe, expect, it } from 'vitest';
import type { AgentMessage } from '@/interfaces/agent';
import { lastIdFrom, mergeMessages, withoutPending } from './messages';

const message = (
  id: string,
  role: AgentMessage['role'] = 'agent',
  extra: Partial<AgentMessage> = {},
): AgentMessage => ({
  id,
  role,
  text: id,
  at: '2026-09-28T00:00:00.000Z',
  attachment: null,
  ...extra,
});

describe('mergeMessages', () => {
  it('appends only unknown ids and updates known ones in place', () => {
    const current = [message('g1', 'guide'), message('a1')];
    const merged = mergeMessages(current, [message('a1', 'agent', { text: 'edited' }), message('a2'), message('a2')]);
    expect(merged.map((item) => item.id)).toEqual(['g1', 'a1', 'a2']);
    expect(merged[1]?.text).toBe('edited');
  });

  it('prepends history', () => {
    expect(mergeMessages([message('g1', 'guide')], [message('old')], 'prepend').map((item) => item.id)).toEqual([
      'old',
      'g1',
    ]);
  });
});

describe('helpers', () => {
  it('drops pending messages and finds the last confirmed conversation id', () => {
    const list = [message('a1'), message('g1', 'guide'), message('tmp', 'visitor', { pending: true })];
    expect(withoutPending(list).map((item) => item.id)).toEqual(['a1', 'g1']);
    expect(lastIdFrom(list)).toBe('a1');
  });
});
