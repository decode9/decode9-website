import type { MutableSound } from '@/interfaces/audio';

export interface CrtSynth extends MutableSound {
  /** Creates/resumes the AudioContext inside a user gesture (login submit) without playing. */
  prime: () => void;
  /** Listeners are told when `playing` changes. Returns the unsubscribe function. */
  subscribe: (listener: () => void) => () => void;
}

type AudioCtor = typeof AudioContext;

/**
 * Sputnik 1 signal recreation (original AU): band-passed noise + 840 Hz square beeps of ~0.3 s
 * every 0.6 s, scheduled 1.4 s ahead. Mute state is persisted by the caller.
 */
export const createCrtSynth = (initiallyMuted = false): CrtSynth => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let gate: GainNode | null = null;
  let timer: ReturnType<typeof setInterval> | undefined;
  let next = 0;
  let playing = false;
  let muted = initiallyMuted;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());

  const init = (): boolean => {
    if (ctx) return true;
    if (typeof window === 'undefined') return false;
    const Ctor: AudioCtor | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
    if (!Ctor) return false;
    try {
      ctx = new Ctor();
    } catch {
      return false;
    }
    const c = ctx;
    master = c.createGain();
    master.gain.value = 0;
    master.connect(c.destination);
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = c.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1800;
    bp.Q.value = 0.7;
    const ng = c.createGain();
    ng.gain.value = 0.12;
    noise.connect(bp).connect(ng).connect(master);
    noise.start();
    const osc = c.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 840;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2200;
    gate = c.createGain();
    gate.gain.value = 0;
    osc.connect(lp).connect(gate).connect(master);
    osc.start();
    return true;
  };

  const schedule = () => {
    if (!ctx || !gate) return;
    const g = gate.gain;
    const now = ctx.currentTime;
    let from = Math.max(now, next || now);
    while (from < now + 1.4) {
      g.setValueAtTime(0, from);
      g.linearRampToValueAtTime(0.55, from + 0.008);
      g.setValueAtTime(0.55, from + 0.29);
      g.linearRampToValueAtTime(0, from + 0.3);
      from += 0.6;
    }
    next = from;
  };

  const start = () => {
    if (!init() || !ctx || !master) return;
    if (ctx.state === 'suspended') void ctx.resume();
    playing = true;
    next = ctx.currentTime + 0.05;
    schedule();
    clearInterval(timer);
    timer = setInterval(schedule, 500);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.05, ctx.currentTime, 0.4);
    notify();
  };

  const stop = () => {
    if (!ctx || !master || !gate) return;
    playing = false;
    clearInterval(timer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
    gate.gain.cancelScheduledValues(ctx.currentTime);
    next = 0;
    notify();
  };

  return {
    start,
    stop,
    get playing() {
      return playing;
    },
    get muted() {
      return muted;
    },
    setMuted: (value) => {
      muted = value;
      notify();
    },
    prime: () => {
      if (!muted && init() && ctx?.state === 'suspended') void ctx.resume();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose: () => {
      clearInterval(timer);
      listeners.clear();
      void ctx?.close().catch(() => undefined);
      ctx = null;
      master = null;
      gate = null;
      playing = false;
    },
  };
};
