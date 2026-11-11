import type { SpeechReader } from '@/interfaces/transmitter';

const PREFERRED_VOICE = /es[-_](419|MX|US|CO)/i;
const SPANISH_VOICE = /^es/i;
const FALLBACK_LANG = 'es-419';

const pickVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null =>
  voices.find((v) => PREFERRED_VOICE.test(v.lang)) ?? voices.find((v) => SPANISH_VOICE.test(v.lang)) ?? null;

/**
 * Browser text-to-speech (speechSynthesis) for the transmitter's reader. Prefers a Latin American
 * Spanish voice, like the original `pickVoice`/`readAloud` (rate 1, pitch .9).
 * `speak` resolves when the utterance ends or fails; it never rejects.
 */
export const createSpeech = (): SpeechReader => {
  const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  let voice: SpeechSynthesisVoice | null = null;
  const refreshVoice = () => {
    if (synth) voice = pickVoice(synth.getVoices());
  };
  if (synth) {
    refreshVoice();
    synth.addEventListener('voiceschanged', refreshVoice);
  }

  return {
    supported: synth !== null,
    get speaking() {
      return synth?.speaking ?? false;
    },
    speak: (text, options = {}) =>
      new Promise<void>((resolve) => {
        if (!synth) {
          resolve();
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options.lang ?? voice?.lang ?? FALLBACK_LANG;
        if (voice) utterance.voice = voice;
        utterance.rate = options.rate ?? 1;
        utterance.pitch = options.pitch ?? 0.9;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        synth.speak(utterance);
      }),
    cancel: () => synth?.cancel(),
    dispose: () => {
      synth?.removeEventListener('voiceschanged', refreshVoice);
      synth?.cancel();
    },
  };
};

export default createSpeech;
