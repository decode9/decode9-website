import { useCallback, useEffect, useRef, useState } from 'react';
import type { SoundSource } from '@/interfaces/audio';
import type { KeyValueStorage } from '@/interfaces/storage';

export const SOUND_KEY = 'tf-sound';

/**
 * Ambient sound preference (`tf-sound`: 'on' by default, 'off' when muted). Browsers only allow audio
 * after a gesture, so it starts with the first pointerdown/keydown (not on the sound button itself),
 * unless Jorge is asleep (night mode).
 */
const useAmbientSound = (createSound: () => SoundSource, storage: KeyValueStorage, isAsleep: () => boolean) => {
  const soundRef = useRef<SoundSource | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [wanted, setWanted] = useState(() => storage.get(SOUND_KEY) !== 'off');
  const [playing, setPlaying] = useState(false);
  const wantedRef = useRef(wanted);
  wantedRef.current = wanted;

  useEffect(() => {
    const sound = createSound();
    soundRef.current = sound;
    return () => {
      sound.dispose();
      soundRef.current = null;
    };
  }, [createSound]);

  const start = useCallback(() => {
    soundRef.current?.start();
    setPlaying(Boolean(soundRef.current?.playing));
  }, []);

  useEffect(() => {
    const firstGesture = (e: Event) => {
      if (buttonRef.current?.contains(e.target as Node)) return;
      window.removeEventListener('pointerdown', firstGesture, true);
      window.removeEventListener('keydown', firstGesture, true);
      if (wantedRef.current && !soundRef.current?.playing && !isAsleep()) start();
    };
    window.addEventListener('pointerdown', firstGesture, true);
    window.addEventListener('keydown', firstGesture, true);
    return () => {
      window.removeEventListener('pointerdown', firstGesture, true);
      window.removeEventListener('keydown', firstGesture, true);
    };
  }, [isAsleep, start]);

  const toggle = useCallback(() => {
    const sound = soundRef.current;
    if (!sound) return;
    const next = !sound.playing;
    if (next) sound.start();
    else sound.stop();
    setPlaying(sound.playing);
    setWanted(next);
    storage.set(SOUND_KEY, next ? 'on' : 'off');
  }, [storage]);

  /** After the night: resume if wanted and the visitor already interacted with the page. */
  const wake = useCallback(() => {
    const active = navigator.userActivation ? navigator.userActivation.hasBeenActive : false;
    if (wantedRef.current && !soundRef.current?.playing && active) start();
  }, [start]);

  return { wanted, playing, toggle, wake, buttonRef };
};

export default useAmbientSound;
