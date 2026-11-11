'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { LINK_NOTES, TX_LOG, TX_TIMING } from '@/data/terminal/channel';
import type { Bilingual } from '@/interfaces/terminal';
import { TX_AMP } from '../../txBus';
import { buildSignalPayload, checkLinkForm, checkNote, failureNote } from '../../linkForm';
import type { LinkFormProps } from './interface';

/** «Enlace» form: validation, send through the SignalGateway and transmitter feedback (original initCanal submit). */
const useLinkForm = ({ bus, gateway, user, lang }: LinkFormProps) => {
  const [alias, setAlias] = useState(user ?? '');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [invalid, setInvalid] = useState({ alias: false, email: false });
  const [note, setNote] = useState<{ t: Bilingual; err: boolean }>({ t: LINK_NOTES.idle, err: false });
  const [sending, setSending] = useState(false);
  const aliasRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const timer = useRef(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      window.clearTimeout(timer.current);
    };
  }, []);

  const typed = (set: (v: string) => void) => (v: string) => {
    set(v);
    bus.bump();
  };

  const toggleTopic = (value: string) =>
    setTopics((list) => (list.includes(value) ? list.filter((t) => t !== value) : [...list, value]));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const values = { alias, email, msg, topics };
    const check = checkLinkForm(values, emailRef.current?.checkValidity() ?? true);
    setInvalid({ alias: check.aliasInvalid, email: check.emailInvalid });
    if (check.invalid) {
      setNote({ t: checkNote(check.invalid), err: true });
      (check.invalid === 'alias' ? aliasRef : emailRef).current?.focus();
      return;
    }
    setSending(true);
    bus.setAmp(TX_AMP.max);
    setNote({ t: LINK_NOTES.sending, err: false });
    bus.log(TX_LOG.sending);
    const result = await gateway.send(buildSignalPayload(values, lang));
    if (!alive.current) return;
    if (result.ok) {
      timer.current = window.setTimeout(() => {
        bus.log(TX_LOG.received);
        bus.setAmp(TX_AMP.done);
        setNote({ t: LINK_NOTES.done, err: false });
      }, TX_TIMING.success);
      return;
    }
    setSending(false);
    bus.setAmp(TX_AMP.idle);
    bus.log(TX_LOG.cancelled);
    setNote({ t: failureNote(result), err: true });
  };

  return {
    alias,
    email,
    msg,
    topics,
    invalid,
    note,
    sending,
    aliasRef,
    emailRef,
    setAlias: typed(setAlias),
    setEmail: typed(setEmail),
    setMsg: typed(setMsg),
    toggleTopic,
    submit,
  };
};

export default useLinkForm;
