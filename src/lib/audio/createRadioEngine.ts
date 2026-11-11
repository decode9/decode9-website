import type { BabbleOptions, RadioEngine } from '@/interfaces/transmitter';
import { isSentenceEnd, syllablesInWord } from '@/utils/transmitter';

/** Master levels of the original: loud during the call, faint behind the dial. */
export const RADIO_LEVEL_CALL = 0.5;
export const RADIO_LEVEL_BACKGROUND = 0.045;

/** Formant pairs (F1, F2) the babble glides between. */
const VOWELS: ReadonlyArray<readonly [number, number]> = [
  [730, 1090],
  [530, 1840],
  [270, 2290],
  [570, 840],
  [300, 870],
  [660, 1700],
  [400, 1600],
];

interface RadioGraph {
  ctx: AudioContext;
  master: GainNode;
  voiceBus: GainNode;
  staticGain: GainNode;
  analyser: AnalyserNode;
  noise: AudioBuffer;
}

interface RadioEngineOptions {
  muted?: boolean;
  level?: number;
  random?: () => number;
}

type AudioContextCtor = typeof AudioContext;

const audioContextCtor = (): AudioContextCtor | null => {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { AudioContext?: AudioContextCtor; webkitAudioContext?: AudioContextCtor };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
};

const distortionCurve = (): Float32Array<ArrayBuffer> => {
  const curve = new Float32Array(1024);
  curve.forEach((_, i) => {
    curve[i] = Math.tanh((i / 512 - 1) * 2.6);
  });
  return curve;
};

const buildGraph = (Ctor: AudioContextCtor, gain: number, random: () => number): RadioGraph => {
  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = gain;
  master.connect(ctx.destination);

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 320;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 3200;
  const shaper = ctx.createWaveShaper();
  shaper.curve = distortionCurve();

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  const voiceBus = ctx.createGain();
  voiceBus.gain.value = 0.8;
  voiceBus.connect(highpass);
  highpass.connect(shaper);
  shaper.connect(lowpass);
  lowpass.connect(analyser);
  analyser.connect(master);

  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const samples = noise.getChannelData(0);
  samples.forEach((_, i) => {
    samples[i] = random() * 2 - 1;
  });
  const source = ctx.createBufferSource();
  source.buffer = noise;
  source.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1800;
  band.Q.value = 0.7;
  const staticGain = ctx.createGain();
  staticGain.gain.value = 0;
  source.connect(band);
  band.connect(staticGain);
  staticGain.connect(analyser);
  source.start();

  return { ctx, master, voiceBus, staticGain, analyser, noise };
};

/**
 * Radio engine of the mobile transmitter: static, crackle, squelch, beeps and the demonoid babble
 * (sawtooth through two formant filters, never a real voice). Port of the original `ensureAudio`,
 * `crackle`, `squelch`, `beep`, `syllable`, `laugh` and `babble`.
 */
export const createRadioEngine = ({
  muted: initialMuted = false,
  level: initialLevel = RADIO_LEVEL_CALL,
  random = Math.random,
}: RadioEngineOptions = {}): RadioEngine => {
  let graph: RadioGraph | null = null;
  let muted = initialMuted;
  let level = initialLevel;
  let crackleTimer: ReturnType<typeof setTimeout> | undefined;
  const tailTimers = new Set<ReturnType<typeof setTimeout>>();
  let disposed = false;

  const pick = <T>(list: ReadonlyArray<T>): T => list[Math.floor(random() * list.length)];

  const crackle = () => {
    if (!graph || disposed) return;
    const { ctx, staticGain, noise, voiceBus } = graph;
    const t = ctx.currentTime;
    const base = staticGain.gain.value;
    if (base > 0.004 && random() < 0.6) {
      const source = ctx.createBufferSource();
      source.buffer = noise;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12 + base * 2, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.03 + random() * 0.05);
      source.connect(gain);
      gain.connect(voiceBus);
      source.start(t, random());
      source.stop(t + 0.1);
    }
    crackleTimer = setTimeout(crackle, 90 + random() * 420);
  };

  const ensure = (): boolean => {
    if (disposed) return false;
    if (graph) {
      if (graph.ctx.state === 'suspended') void graph.ctx.resume();
      return true;
    }
    const Ctor = audioContextCtor();
    if (!Ctor) return false;
    graph = buildGraph(Ctor, muted ? 0 : level, random);
    crackle();
    return true;
  };

  const applyMaster = (timeConstant: number) => {
    if (graph) graph.master.gain.setTargetAtTime(muted ? 0 : level, graph.ctx.currentTime, timeConstant);
  };

  const squelch = (duration = 0.16, volume = 0.35) => {
    if (!graph) return;
    const { ctx, noise, voiceBus } = graph;
    const t = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2400;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(voiceBus);
    source.start(t, random());
    source.stop(t + duration + 0.02);
  };

  const beep = (frequency = 1400, duration = 0.09, delay = 0) => {
    if (!graph) return;
    const { ctx, voiceBus } = graph;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.005);
    gain.gain.setValueAtTime(0.08, t + duration - 0.01);
    gain.gain.linearRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(voiceBus);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  };

  const syllable = (g: RadioGraph, t: number, duration: number, f0: number, glide: number, breath: number) => {
    const { ctx, voiceBus, noise } = g;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.linearRampToValueAtTime(f0 * glide, t + duration);
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.value = 5 + random() * 3;
    vibratoGain.gain.value = f0 * 0.03;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    const [a, b] = pick(VOWELS);
    const [c, d] = pick(VOWELS);
    const formant = (from: number, to: number, q: number) => {
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = q;
      filter.frequency.setValueAtTime(from, t);
      filter.frequency.linearRampToValueAtTime(to, t + duration);
      return filter;
    };
    const f1 = formant(a, c, 7);
    const f2 = formant(b, d, 9);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.9, t + Math.min(0.03, duration * 0.25));
    gain.gain.setValueAtTime(0.8, t + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0005, t + duration);
    osc.connect(f1);
    osc.connect(f2);
    f1.connect(gain);
    f2.connect(gain);
    gain.connect(voiceBus);
    osc.start(t);
    vibrato.start(t);
    osc.stop(t + duration + 0.02);
    vibrato.stop(t + duration + 0.02);

    if (breath) {
      const source = ctx.createBufferSource();
      source.buffer = noise;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = a * 2;
      filter.Q.value = 1.5;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, t);
      noiseGain.gain.linearRampToValueAtTime(breath, t + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.0005, t + duration * 0.8);
      source.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(voiceBus);
      source.start(t, random());
      source.stop(t + duration);
    }
  };

  const laugh = (g: RadioGraph, start: number): number => {
    const count = 3 + Math.floor(random() * 3);
    const base = 120 + random() * 60;
    return Array.from({ length: count }).reduce<number>((t, _, i) => {
      const duration = 0.065 + random() * 0.03;
      syllable(g, t, duration, base * (1 - i * 0.06), 0.75, 0.55);
      return t + duration + 0.045;
    }, start);
  };

  const babble = (text: string, { laughs = true, pitch = 1 }: BabbleOptions = {}): number => {
    if (!ensure() || !graph) return Math.max(1.4, text.length * 0.055);
    const g = graph;
    let t = g.ctx.currentTime + 0.18;
    squelch(0.14, 0.3);
    let since = 0;
    text
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => {
        const count = syllablesInWord(word);
        for (let s = 0; s < count; s += 1) {
          const duration = 0.07 + random() * 0.11;
          const f0 = (78 + random() * 44) * pitch;
          syllable(g, t, duration, f0, 0.8 + random() * 0.45, random() < 0.25 ? 0.25 : 0);
          t += duration + 0.012;
        }
        t += 0.03 + random() * 0.06;
        since += 1;
        const end = isSentenceEnd(word);
        if (end) t += 0.18 + random() * 0.15;
        if (laughs && ((end && random() < 0.55) || (since > 9 && random() < 0.3))) {
          since = 0;
          t = laugh(g, t) + 0.12;
        }
      });
    t += 0.05;
    const tail = t - g.ctx.currentTime;
    const timer = setTimeout(() => {
      tailTimers.delete(timer);
      squelch(0.12, 0.25);
      beep(1250, 0.07, 0);
      beep(1650, 0.07, 0.08);
    }, tail * 1000);
    tailTimers.add(timer);
    return tail + 0.25;
  };

  return {
    ensure,
    get ready() {
      return graph !== null;
    },
    setMuted: (value) => {
      muted = value;
      applyMaster(0.05);
    },
    setLevel: (value) => {
      level = value;
      applyMaster(0.3);
    },
    setStatic: (value, timeConstant = 0.25) => {
      if (graph) graph.staticGain.gain.setTargetAtTime(value, graph.ctx.currentTime, timeConstant);
    },
    squelch,
    beep,
    click: () => beep(1900, 0.025),
    babble,
    silenceVoice: () => {
      if (!graph) return;
      const { ctx, voiceBus } = graph;
      voiceBus.gain.cancelScheduledValues(ctx.currentTime);
      voiceBus.gain.setValueAtTime(0, ctx.currentTime);
      voiceBus.gain.setTargetAtTime(0.8, ctx.currentTime + 0.08, 0.02);
    },
    readFrequencies: (target) => {
      if (!graph) return false;
      graph.analyser.getByteFrequencyData(target as Uint8Array<ArrayBuffer>);
      return true;
    },
    dispose: () => {
      disposed = true;
      clearTimeout(crackleTimer);
      tailTimers.forEach(clearTimeout);
      tailTimers.clear();
      if (graph) void graph.ctx.close().catch(() => undefined);
      graph = null;
    },
  };
};

export default createRadioEngine;
