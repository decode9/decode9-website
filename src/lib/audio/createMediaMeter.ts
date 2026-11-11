import type { MediaMeter } from '@/interfaces/terminal';

type AudioContextCtor = typeof AudioContext;

/**
 * Frequency analyser over an <audio>/<video> element (original setupAn: fftSize 128, routed to the
 * speakers). A media element can be wired to one context only, so build it once per element.
 * Returns null when Web Audio is not available.
 */
export const createMediaMeter = (media: HTMLMediaElement): MediaMeter | null => {
  const w = window as Window & { webkitAudioContext?: AudioContextCtor };
  const Ctor: AudioContextCtor | undefined = window.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;
  try {
    const ctx = new Ctor();
    const src = ctx.createMediaElementSource(media);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    const data = new Uint8Array(analyser.frequencyBinCount);
    src.connect(analyser);
    analyser.connect(ctx.destination);
    return {
      resume: () => {
        if (ctx.state === 'suspended') ctx.resume().catch(() => undefined);
      },
      levels: () => {
        analyser.getByteFrequencyData(data);
        return data;
      },
      dispose: () => {
        ctx.close().catch(() => undefined);
      },
    };
  } catch {
    return null;
  }
};
