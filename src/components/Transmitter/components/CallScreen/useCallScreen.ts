import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildCallLines, CALL_AFTER, CALL_LOST, CALL_TEXT, type CallLine } from '@/data/transmitter/callScript';
import { PORTRAITS, type PortraitImage } from '@/data/transmitter/portraits';
import { formatElapsed, silentLineDuration, typingDelay } from '@/utils/transmitter';
import { useTransmitterApi } from '../../context';
import type { CallPhase, CallScreenProps, TypedLine, UseCallScreenReturn } from './interface';

type Timer = ReturnType<typeof setTimeout>;

/**
 * Incoming call flow (original `answer`, `typeLine`, `goLost`): two voiced lines, the signal drops,
 * then the invitation to the dial. The button skips to the drop and then restores contact.
 */
const useCallScreen = ({ active, onToMain }: Pick<CallScreenProps, 'active' | 'onToMain'>): UseCallScreenReturn => {
  const api = useTransmitterApi();
  const script = useMemo(() => buildCallLines(api.alias), [api.alias]);
  const [phase, setPhase] = useState<CallPhase>(0);
  const phaseRef = useRef<CallPhase>(0);
  const [lines, setLines] = useState<TypedLine[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [portrait, setPortrait] = useState<PortraitImage>(PORTRAITS.talk);
  const [stateLabel, setStateLabel] = useState<string>(CALL_TEXT.online);
  const [restore, setRestore] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const timers = useRef(new Set<Timer>());

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  /* call timer: runs from the answer while this screen is visible */
  useEffect(() => {
    if (phase === 0 || !active) return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase, active]);

  /* the log jumps to the bottom when a new line starts */
  useEffect(() => {
    const panel = logRef.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, [lines.length]);

  const typeLine = useCallback(
    (line: CallLine, onEnd: () => void, withVoice = true) => {
      nextId.current += 1;
      const id = nextId.current;
      setLines((prev) => [...prev, { id, line, shown: 0, done: false }]);
      const plain = line.b + line.x;
      let duration: number;
      if (withVoice) {
        duration = api.speak(plain, onEnd);
      } else {
        duration = silentLineDuration(plain);
        later(onEnd, duration * 1000);
      }
      const delay = typingDelay(duration, plain.length);
      const step = (shown: number) => {
        const done = shown >= plain.length;
        setLines((prev) => prev.map((l) => (l.id === id ? { ...l, shown, done } : l)));
        if (!done) later(() => step(shown + 1), delay);
      };
      step(1);
    },
    [api, later],
  );

  const goLost = useCallback(
    (skip: boolean) => {
      if (phaseRef.current >= 2) return;
      phaseRef.current = 2;
      setPhase(2);
      api.stopSpeak();
      setPortrait(PORTRAITS.lost);
      setStateLabel(CALL_TEXT.interference);
      const ramp = (k: number) => {
        api.setLost(Math.min(0.9, k));
        if (k < 0.9) later(() => ramp(k + 0.08), 60);
      };
      later(() => ramp(0.08), 60);
      api.setStatic(api.isMuted() ? 0 : 0.09, 0.15);
      api.refreshStatus();
      api.vibrate([30, 40, 30]);
      typeLine(
        CALL_LOST,
        () => {
          setPortrait(PORTRAITS.static);
          api.setLost(0.45);
          api.setStatic(api.isMuted() ? 0 : 0.035, 0.4);
          api.refreshStatus();
          typeLine(CALL_AFTER, () => undefined, true);
          setRestore(true);
        },
        !skip,
      );
    },
    [api, later, typeLine],
  );

  const answer = useCallback(() => {
    if (phaseRef.current !== 0) return;
    phaseRef.current = 1;
    setPhase(1);
    api.ensureAudio();
    api.enableMotion();
    api.vibrate(20);
    typeLine(script[0], () => typeLine(script[1], () => goLost(false)));
  }, [api, goLost, script, typeLine]);

  const onButton = useCallback(() => {
    if (phaseRef.current === 1) goLost(true);
    else if (phaseRef.current === 2) onToMain();
  }, [goLost, onToMain]);

  return {
    alias: api.alias,
    phase,
    lines,
    elapsed: formatElapsed(seconds),
    portrait,
    stateLabel,
    restore,
    logRef,
    onPress: api.ensureAudio,
    answer,
    onButton,
    exit: api.exit,
  };
};

export default useCallScreen;
