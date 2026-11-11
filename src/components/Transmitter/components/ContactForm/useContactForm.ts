import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { CONTACT_TEXT, SOS_BEEPS, SOS_MIN_MS, SOS_VIBRATION } from '@/data/transmitter/channel';
import { PORTRAITS } from '@/data/transmitter/portraits';
import { isValidAlias, LIMITS, parseReturnChannel } from '@/utils/validators';
import { useTransmitterApi } from '../../context';
import { useChannel } from '../Channel/context';
import type { ContactErrors, ContactFields, ContactReceipt } from './interface';

const NO_ERRORS: ContactErrors = { alias: false, regreso: false };
const pad2 = (n: number) => String(n).padStart(2, '0');
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** CONTACTO pane: validation, the SOS send animation and the receipt (original #f / #ok). */
const useContactForm = () => {
  const api = useTransmitterApi();
  const { deps } = useChannel();
  const [fields, setFields] = useState<ContactFields>({ alias: api.alias, regreso: '', msg: '', web: '' });
  const [errors, setErrors] = useState<ContactErrors>(NO_ERRORS);
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<ContactReceipt | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true; // StrictMode runs cleanup + effect again in dev
    return () => {
      mounted.current = false;
    };
  }, []);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
  }, []);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (sending) return;
      const alias = fields.alias.trim();
      const channel = parseReturnChannel(fields.regreso);
      const nextErrors = { alias: !isValidAlias(alias), regreso: !channel };
      setErrors(nextErrors);
      if (nextErrors.alias || !channel) {
        api.kick(1);
        api.toast(CONTACT_TEXT.invalid);
        return;
      }

      api.ensureAudio();
      setSending(true);
      api.setMediaOn(true);
      api.setStatic(api.isMuted() ? 0 : 0.05, 0.1);
      SOS_BEEPS.forEach((t, i) => api.beep(980, i > 2 && i < 6 ? 0.2 : 0.08, t));
      api.vibrate([...SOS_VIBRATION]);

      const isMail = channel.kind === 'email';
      const [result] = await Promise.all([
        deps.signal.send({
          alias: alias.slice(0, LIMITS.alias),
          email: isMail ? channel.value : '',
          whatsapp: isMail ? '' : channel.value,
          msg: fields.msg.trim().slice(0, LIMITS.msg),
          origen: 'movil',
          web: fields.web,
        }),
        wait(SOS_MIN_MS),
      ]);
      if (!mounted.current) return;

      api.setMediaOn(false);
      api.setStatic(0);
      setSending(false);
      if (!result.ok) {
        api.setLost(0.5);
        api.refreshStatus();
        setTimeout(() => {
          api.setLost(0);
          api.refreshStatus();
        }, 900);
        api.toast(CONTACT_TEXT.failed);
        return;
      }

      const now = new Date();
      setReceipt({
        code: result.code || `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        meta: `${pad2(now.getHours())}:${pad2(now.getMinutes())} · VÍA ${isMail ? 'CORREO' : 'WHATSAPP'}`,
        alias,
      });
      api.setMainPortrait(PORTRAITS.talk);
      api.speak(CONTACT_TEXT.spoken);
    },
    [api, deps.signal, fields, sending],
  );

  const reset = useCallback(() => {
    api.stopSpeak();
    setFields({ alias: '', regreso: '', msg: '', web: '' });
    setErrors(NO_ERRORS);
    setReceipt(null);
    api.setMainPortrait(PORTRAITS.listen);
  }, [api]);

  return { fields, errors, sending, receipt, onChange, onSubmit, reset };
};

export default useContactForm;
