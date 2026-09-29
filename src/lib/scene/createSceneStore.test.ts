import { describe, expect, it, vi } from 'vitest';
import type { SceneSnapshot } from '@/interfaces/scene';
import createSceneStore from './createSceneStore';

const initial: SceneSnapshot = {
  shape: 'isotype',
  camera: 'hero',
  accent: '#E5121B',
  solid: 1,
  intensity: 1,
  focus: null,
  thinking: false,
  loading: null,
};

describe('createSceneStore', () => {
  it('notifies with next and previous snapshots, skipping no-op updates', () => {
    const store = createSceneStore(initial);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.set({ thinking: false });
    expect(listener).not.toHaveBeenCalled();
    store.set({ shape: 'helix', thinking: true });
    expect(listener).toHaveBeenCalledWith({ ...initial, shape: 'helix', thinking: true }, initial);
    unsubscribe();
    store.set({ shape: 'grid' });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.get().shape).toBe('grid');
  });
});
