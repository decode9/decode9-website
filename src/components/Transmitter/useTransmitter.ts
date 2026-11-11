import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useTransmitterFrame from '@/hooks/useTransmitterFrame';
import type { MotionSensor, RadioEngine, SpeechReader } from '@/interfaces/transmitter';
import { PORTRAITS, type PortraitImage } from '@/data/transmitter/portraits';
import { STATIONS } from '@/data/transmitter/stations';
import {
  clampStation,
  distortionLevel,
  portraitGlitch,
  sanitizeAlias,
  signalBars,
  transmitterStatus,
  type TransmitterStatus,
} from '@/utils/transmitter';
import type {
  TransmitterApi,
  TransmitterDeps,
  TransmitterEvent,
  TransmitterScreen,
  UseTransmitterReturn,
} from './interface';

const MUTE_KEY = 'd9m-mute';
/** Master levels of the original (call vs. behind the dial). */
const LEVEL_BACKGROUND = 0.045;
const TOAST_MS = 2600;
const SIGNAL_SELECTOR = '[data-sig]';
const PORTRAIT_SELECTOR = '[data-por]';
const WAVE_SELECTOR = '[data-wave]';

const readAlias = (): string =>
  typeof window === 'undefined' ? '' : sanitizeAlias(new URLSearchParams(window.location.search).get('alias'));

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isVisible = (el: HTMLElement): boolean => el.offsetParent !== null;

/**
 * Composition of the mobile transmitter: sound, speech, motion, status, screens, dial station and
 * the per-frame distortion of portraits, waves and signal bars (original `frame()`).
 * High-frequency values live in refs and are written to the DOM inside the frame loop.
 */
const useTransmitter = (deps: TransmitterDeps): UseTransmitterReturn => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [alias] = useState(readAlias);
  const [reduceMotion] = useState(prefersReducedMotion);

  const engine = useRef<RadioEngine | null>(null);
  const speech = useRef<SpeechReader | null>(null);
  const motion = useRef<MotionSensor | null>(null);

  const [muted, setMuted] = useState(() => deps.storage.get(MUTE_KEY) === '1');
  const mutedRef = useRef(muted);
  const [screen, setScreen] = useState<TransmitterScreen>('call');
  const [exitCount, setExitCount] = useState(0);
  const [station, setStation] = useState(0);
  const [mainPortrait, setMainPortrait] = useState<PortraitImage>(PORTRAITS.listen);
  const [status, setStatus] = useState<TransmitterStatus>('ESCUCHANDO');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const lost = useRef(0);
  const speaking = useRef(false);
  const mediaOn = useRef(false);
  const envelope = useRef(0);
  const spectrum = useRef(new Uint8Array(128));
  const sayToken = useRef(0);
  const sayTimer = useRef<ReturnType<typeof setTimeout>>();
  const readerEnd = useRef<(() => void) | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const listeners = useRef(new Map<TransmitterEvent, Set<() => void>>());

  /* ---------- infrastructure lifetime ---------- */
  useEffect(() => {
    engine.current = deps.createRadio({ muted: mutedRef.current });
    speech.current = deps.createSpeech();
    motion.current = deps.createMotion();
    return () => {
      clearTimeout(sayTimer.current);
      clearTimeout(toastTimer.current);
      engine.current?.dispose();
      speech.current?.dispose();
      motion.current?.dispose();
      engine.current = null;
      speech.current = null;
      motion.current = null;
    };
  }, [deps]);

  const emit = useCallback((event: TransmitterEvent) => {
    listeners.current.get(event)?.forEach((listener) => listener());
  }, []);

  const on = useCallback((event: TransmitterEvent, listener: () => void) => {
    const set = listeners.current.get(event) ?? new Set<() => void>();
    set.add(listener);
    listeners.current.set(event, set);
    return () => {
      set.delete(listener);
    };
  }, []);

  const refreshStatus = useCallback(() => {
    setStatus(transmitterStatus({ lost: lost.current, speaking: speaking.current, mediaOn: mediaOn.current }));
  }, []);

  const ensureAudio = useCallback(() => {
    engine.current?.ensure();
  }, []);

  const setStatic = useCallback((level: number, timeConstant?: number) => {
    engine.current?.setStatic(level, timeConstant);
  }, []);

  const toast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), TOAST_MS);
  }, []);

  /* ---------- voice ---------- */
  const stopSpeak = useCallback(() => {
    sayToken.current += 1;
    clearTimeout(sayTimer.current);
    speaking.current = false;
    speech.current?.cancel();
    engine.current?.silenceVoice();
    const end = readerEnd.current;
    readerEnd.current = null;
    end?.();
    refreshStatus();
  }, [refreshStatus]);

  const speak = useCallback<TransmitterApi['speak']>(
    (text, onEnd, options) => {
      stopSpeak();
      sayToken.current += 1;
      const token = sayToken.current;
      speaking.current = true;
      refreshStatus();
      engine.current?.setStatic(mutedRef.current ? 0 : 0.012);
      const duration = engine.current?.babble(text, options) ?? Math.max(1.4, text.length * 0.055);
      sayTimer.current = setTimeout(() => {
        if (token !== sayToken.current) return;
        speaking.current = false;
        engine.current?.setStatic(lost.current > 0.3 ? 0.05 : 0);
        refreshStatus();
        onEnd?.();
      }, duration * 1000);
      return duration;
    },
    [refreshStatus, stopSpeak],
  );

  const readAloud = useCallback<TransmitterApi['readAloud']>(
    (text, onEnd) => {
      stopSpeak();
      const reader = speech.current;
      if (!reader?.supported) {
        toast('ESTE NAVEGADOR NO TRAE LECTOR DE VOZ');
        onEnd?.();
        return;
      }
      sayToken.current += 1;
      const token = sayToken.current;
      speaking.current = true;
      refreshStatus();
      readerEnd.current = onEnd ?? null;
      void reader.speak(text).then(() => {
        if (token !== sayToken.current) return;
        speaking.current = false;
        readerEnd.current = null;
        refreshStatus();
        onEnd?.();
      });
    },
    [refreshStatus, stopSpeak, toast],
  );

  /* ---------- mute ---------- */
  const toggleMute = useCallback(() => {
    ensureAudio();
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    deps.storage.set(MUTE_KEY, next ? '1' : '0');
    engine.current?.setMuted(next);
  }, [deps.storage, ensureAudio]);

  /* ---------- screens ---------- */
  const stationRef = useRef(0);
  const tuneTo = useCallback(
    (index: number, first: boolean) => {
      const next = clampStation(index, STATIONS.length);
      const changed = next !== stationRef.current;
      stationRef.current = next;
      setStation(next);
      if (!changed && !first) return;
      setMainPortrait(STATIONS[next].portrait);
      motion.current?.kick(0.5);
      if (!first) {
        engine.current?.click();
        deps.vibrate(8);
      }
      emit('station');
      stopSpeak();
    },
    [deps, emit, stopSpeak],
  );

  const tune = useCallback((index: number) => tuneTo(index, false), [tuneTo]);

  const toMain = useCallback(() => {
    stopSpeak();
    lost.current = 0;
    setStatic(0);
    engine.current?.setLevel(LEVEL_BACKGROUND);
    setScreen('main');
    refreshStatus();
    tuneTo(0, true);
    engine.current?.squelch(0.2, 0.3);
  }, [refreshStatus, setStatic, stopSpeak, tuneTo]);

  const exit = useCallback(() => {
    stopSpeak();
    emit('exit');
    lost.current = 0;
    setStatic(0);
    engine.current?.squelch(0.35, 0.4);
    setScreen('off');
    setExitCount((n) => n + 1);
    deps.vibrate(40);
  }, [deps, emit, setStatic, stopSpeak]);

  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) return;
      stopSpeak();
      emit('hidden');
      setStatic(0);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [emit, setStatic, stopSpeak]);

  /* ---------- frame loop (original frame()) ---------- */
  useTransmitterFrame((t) => {
    const root = rootRef.current;
    const sensor = motion.current;
    if (!root) return;
    sensor?.decay();
    const talking = speaking.current || mediaOn.current;
    envelope.current += ((talking ? 1 : 0.04) - envelope.current) * 0.12;
    const k = distortionLevel(sensor?.shake ?? 0, lost.current, talking);

    root.querySelectorAll<HTMLElement>(PORTRAIT_SELECTOR).forEach((portrait) => {
      if (!isVisible(portrait)) return;
      Object.entries(portraitGlitch(k, reduceMotion, Math.random)).forEach(([name, value]) =>
        portrait.style.setProperty(name, value),
      );
    });

    const live =
      !!engine.current?.ready &&
      (speaking.current || lost.current > 0.3) &&
      !mutedRef.current &&
      !speech.current?.speaking &&
      engine.current.readFrequencies(spectrum.current);
    const amp = envelope.current * (1 - lost.current * 0.8) * (0.75 + Math.random() * 0.25);
    root.querySelectorAll<HTMLCanvasElement>(WAVE_SELECTOR).forEach((canvas) => {
      if (isVisible(canvas)) deps.drawWave(canvas, amp, t, live ? spectrum.current : null);
    });

    const bars = signalBars(k, lost.current);
    root.querySelectorAll<HTMLElement>(SIGNAL_SELECTOR).forEach((meter) =>
      Array.from(meter.children).forEach((bar, n) => bar.toggleAttribute('data-off', n >= bars)),
    );
  });

  const getTilt = useCallback(() => motion.current?.tilt ?? 0, []);

  const api = useMemo<TransmitterApi>(
    () => ({
      alias,
      ensureAudio,
      speak,
      stopSpeak,
      readAloud,
      get speechSupported() {
        return speech.current?.supported ?? false;
      },
      isReading: () => speech.current?.speaking ?? false,
      setStatic,
      beep: (frequency, duration, delay) => engine.current?.beep(frequency, duration, delay),
      squelch: (duration, volume) => engine.current?.squelch(duration, volume),
      click: () => {
        engine.current?.click();
        deps.vibrate(8);
      },
      vibrate: deps.vibrate,
      kick: (amount) => motion.current?.kick(amount),
      setLost: (level) => {
        lost.current = level;
      },
      getLost: () => lost.current,
      refreshStatus,
      setMediaOn: (value) => {
        mediaOn.current = value;
        refreshStatus();
      },
      setMainPortrait,
      toast,
      isMuted: () => mutedRef.current,
      on,
      exit,
      enableMotion: () => {
        void motion.current?.enable();
      },
    }),
    [alias, deps, ensureAudio, exit, on, readAloud, refreshStatus, setStatic, speak, stopSpeak, toast],
  );

  return {
    rootRef,
    api,
    screen,
    exitCount,
    muted,
    toggleMute,
    status,
    station,
    mainPortrait,
    toastMessage,
    toastVisible,
    tune,
    toMain,
    getTilt,
  };
};

export default useTransmitter;
