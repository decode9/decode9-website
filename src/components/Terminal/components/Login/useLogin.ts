'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { LOGIN_STEPS, LOGIN_TEXT, LOGO_PATHS } from '@/data/terminal';
import { decodeText } from '@/utils/decodeText';
import { cleanName, isBad, validName } from '@/utils/profanity';
import type { LoginFlag, LoginMessage, LoginProps, PieceScatter } from './interface';

/** Scattered start positions of the emblem pieces (original scatterLogo). */
export const scatterPieces = (count: number, random: () => number = Math.random): PieceScatter[] =>
  Array.from({ length: count }, (_, i) => {
    const an = (i / count) * Math.PI * 2 + random() * 0.7;
    const d = 420 + random() * 380;
    return {
      '--ix': `${Math.round(Math.cos(an) * d)}px`,
      '--iy': `${Math.round(Math.sin(an) * d)}px`,
      '--ir': `${Math.round((random() - 0.5) * 540)}deg`,
      '--dl': `${i * 0.11}s`,
    };
  });

/** Login gate: validation, loading steps, greeting and the emblem flight to the top bar (original enterOS). */
const useLogin = ({ reduceMotion, logoRef, onPrime, onAuthorized, onGateOpen, onDone, onWelcome, setLogoHidden }: LoginProps) => {
  const [flags, setFlags] = useState<Set<LoginFlag>>(() => new Set());
  const [scatter, setScatter] = useState(() => scatterPieces(LOGO_PATHS.length));
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<LoginMessage>({ t: LOGIN_TEXT.hint });
  const [bar, setBar] = useState(0);
  const [greeted, setGreeted] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const askRef = useRef<HTMLLabelElement>(null);
  const hiRef = useRef<HTMLDivElement>(null);
  const embRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const flag = (f: LoginFlag) => setFlags((s) => new Set(s).add(f));

  useEffect(() => {
    const id = window.setTimeout(() => {
      decodeText(askRef.current, 800, { reduceMotion });
      inputRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(id);
    // First paint only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (greeted) decodeText(hiRef.current, 600, { reduceMotion });
  }, [greeted, reduceMotion]);

  const enterOS = useCallback(
    (name: string) => {
      onAuthorized(name);
      const emb = embRef.current;
      const tgt = logoRef.current;
      const D = reduceMotion ? 0 : 1500;
      if (emb && tgt) {
        const er = emb.getBoundingClientRect();
        const tr = tgt.getBoundingClientRect();
        const dx = tr.left + tr.width / 2 - (er.left + er.width / 2);
        const dy = tr.top + tr.height / 2 - (er.top + er.height / 2);
        const sc = Math.max(0.05, tr.height / er.height);
        emb.style.transition = reduceMotion ? 'none' : `transform ${D}ms cubic-bezier(.65,0,.25,1), filter ${D}ms`;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            emb.style.transform = `translate(${dx}px,${dy}px) scale(${sc}) rotateY(720deg)`;
          }),
        );
      }
      flag('fly');
      setLogoHidden(true);
      later(() => flag('seam'), reduceMotion ? 0 : 350);
      later(() => {
        flag('open');
        onGateOpen();
      }, reduceMotion ? 0 : 650);
      later(() => {
        setLogoHidden(false);
        setHidden(true);
        if (emb) {
          emb.style.transition = '';
          emb.style.transform = '';
        }
        onDone();
      }, reduceMotion ? 0 : D + 80);
      later(() => onWelcome(name), reduceMotion ? 0 : 2600);
    },
    // Timeline callbacks are stable for the life of the login.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [logoRef, reduceMotion],
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const name = cleanName(value);
    if (!name) {
      setMsg({ t: LOGIN_TEXT.empty, err: true });
      inputRef.current?.focus();
      return;
    }
    if (isBad(name)) {
      setMsg({ t: LOGIN_TEXT.bad, err: true });
      setValue('');
      inputRef.current?.focus();
      return;
    }
    if (!validName(name)) {
      setMsg({ t: LOGIN_TEXT.invalid, err: true });
      inputRef.current?.focus();
      return;
    }
    setBusy(true);
    flag('loading');
    flag('lgscan');
    setScatter(scatterPieces(LOGO_PATHS.length));
    requestAnimationFrame(() => flag('forming'));
    later(() => flag('formed'), reduceMotion ? 0 : 1900);
    onPrime();
    const dt = reduceMotion ? 60 : 520;
    let k = 0;
    const next = () => {
      if (k < LOGIN_STEPS.length) {
        const step = LOGIN_STEPS[k];
        k += 1;
        setMsg({ t: step.t });
        setBar(step.pct);
        later(next, dt);
      } else {
        setGreeted(name);
        later(() => enterOS(name), reduceMotion ? 200 : 900);
      }
    };
    next();
  };

  return { flags, scatter, value, setValue, busy, msg, bar, greeted, hidden, submit, inputRef, askRef, hiRef, embRef };
};

export default useLogin;
