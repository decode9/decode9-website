import type { SoundSource } from '@/interfaces/audio';

/**
 * Space ambience of /perfil/ generated in the browser (no files): a very low suspended chord that
 * breathes slowly, filtered brown-noise "stellar wind" and a random chime every 10–20 s, through a
 * long reverb. Fades in over 4 s and out over 1.2 s. Pauses while the tab is hidden.
 */
export interface AmbientSynthDeps {
  /** AudioContext constructor (window.AudioContext || webkitAudioContext); absent → silent no-op. */
  AudioContextCtor?: typeof AudioContext;
  doc?: Document;
}

const CHORD = [55, 82.41, 110, 164.81, 246.94];
const CHIME_NOTES = [659.25, 739.99, 880, 987.77];
const MASTER_LEVEL = 0.26;

const resolveCtor = (): typeof AudioContext | undefined => {
  if (typeof window === 'undefined') return undefined;
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
};

const createAmbientSynth = ({
  AudioContextCtor = resolveCtor(),
  doc = typeof document === 'undefined' ? undefined : document,
}: AmbientSynthDeps = {}): SoundSource => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let bus: BiquadFilterNode | null = null;
  let on = false;
  let chimeT: ReturnType<typeof setTimeout> | undefined;
  let suspendT: ReturnType<typeof setTimeout> | undefined;

  const impulse = (c: AudioContext, sec: number, decay: number) => {
    const len = Math.floor(c.sampleRate * sec);
    const b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  };

  const lfoTo = (c: AudioContext, freq: number, depth: number, target: AudioParam) => {
    const l = c.createOscillator();
    const g = c.createGain();
    l.frequency.value = freq;
    g.gain.value = depth;
    l.connect(g).connect(target);
    l.start();
  };

  const build = (): boolean => {
    if (!AudioContextCtor) return false;
    const c = new AudioContextCtor();
    ctx = c;
    master = c.createGain();
    master.gain.value = 0;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -24;
    comp.ratio.value = 3;
    const rev = c.createConvolver();
    rev.buffer = impulse(c, 5, 2.4);
    const wet = c.createGain();
    wet.gain.value = 0.6;
    const dry = c.createGain();
    dry.gain.value = 0.45;
    bus = c.createBiquadFilter();
    bus.type = 'lowpass';
    bus.frequency.value = 1000;
    bus.Q.value = 0.3;
    lfoTo(c, 0.022, 380, bus.frequency);
    bus.connect(dry).connect(comp);
    bus.connect(rev).connect(wet).connect(comp);
    comp.connect(master).connect(c.destination);

    // acorde suspendido muy grave que respira despacio
    CHORD.forEach((f, i) => {
      (['sine', 'triangle'] as const).forEach((type, j) => {
        const o = c.createOscillator();
        o.type = type;
        o.frequency.value = f;
        o.detune.value = (j ? 6 : -6) + i * 1.3;
        const g = c.createGain();
        const base = (type === 'sine' ? 0.09 : 0.03) / (1 + i * 0.6);
        g.gain.value = base;
        lfoTo(c, 0.035 + i * 0.017 + j * 0.005, base * 0.65, g.gain);
        o.connect(g).connect(bus as BiquadFilterNode);
        o.start();
      });
    });

    // viento estelar: ruido marrón filtrado
    const nb = c.createBuffer(1, c.sampleRate * 4, c.sampleRate);
    const d = nb.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    }
    const ns = c.createBufferSource();
    ns.buffer = nb;
    ns.loop = true;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 520;
    bp.Q.value = 0.6;
    lfoTo(c, 0.045, 300, bp.frequency);
    const ng = c.createGain();
    ng.gain.value = 0.05;
    ns.connect(bp).connect(ng).connect(bus);
    ns.start();
    return true;
  };

  const chime = () => {
    if (!on || !ctx || !bus) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.022, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 6);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + 6.2);
    chimeT = setTimeout(chime, 10000 + Math.random() * 10000);
  };

  const rampTo = (level: number, seconds: number) => {
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(level, t + seconds);
  };

  const onVisibility = () => {
    if (!ctx || !doc) return;
    if (doc.hidden) void ctx.suspend();
    else if (on) void ctx.resume();
  };
  doc?.addEventListener('visibilitychange', onVisibility);

  const start = () => {
    if (!ctx && !build()) return;
    void ctx?.resume();
    on = true;
    clearTimeout(suspendT);
    rampTo(MASTER_LEVEL, 4);
    clearTimeout(chimeT);
    chimeT = setTimeout(chime, 6000);
  };

  const stop = () => {
    on = false;
    clearTimeout(chimeT);
    if (!ctx) return;
    rampTo(0, 1.2);
    suspendT = setTimeout(() => {
      if (!on && ctx) void ctx.suspend();
    }, 1400);
  };

  const dispose = () => {
    on = false;
    clearTimeout(chimeT);
    clearTimeout(suspendT);
    doc?.removeEventListener('visibilitychange', onVisibility);
    void ctx?.close().catch(() => undefined);
    ctx = null;
    master = null;
    bus = null;
  };

  return {
    start,
    stop,
    get playing() {
      return on;
    },
    dispose,
  };
};

export default createAmbientSynth;
