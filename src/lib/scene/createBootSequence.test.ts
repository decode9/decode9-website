import { describe, expect, it, vi } from 'vitest';
import createBootSequence from './createBootSequence';

describe('createBootSequence', () => {
  it('weights milestones and counts each once', () => {
    const boot = createBootSequence();
    boot.complete('fonts');
    boot.complete('fonts');
    boot.complete('page');
    expect(boot.get().progress).toBeCloseTo(0.4);
    boot.complete('stage');
    boot.complete('model');
    expect(boot.get().progress).toBeCloseTo(1);
  });

  it('treats a WebGL fallback as a finished stage', () => {
    const boot = createBootSequence();
    boot.setStage('fallback');
    expect(boot.get()).toMatchObject({ stage: 'fallback', progress: expect.closeTo(0.6) });
  });

  it('notifies listeners and reveals', () => {
    const boot = createBootSequence();
    const listener = vi.fn();
    boot.subscribe(listener);
    boot.reveal();
    expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({ phase: 'revealed' }));
  });
});
