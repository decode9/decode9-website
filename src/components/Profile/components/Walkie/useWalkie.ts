import { useCallback, useRef, useState, type FormEvent } from 'react';
import type { WalkieGateway } from '@/interfaces/walkie';
import { isValidWalkieText } from '@/utils/validators';
import type { WalkieNotes } from './interface';

export const NOTES: WalkieNotes = {
  short: 'Escribe tu idea, tu número o tu correo primero.',
  unavailable: 'El canal todavía no está conectado.',
  sending: 'Transmitiendo…',
  ok: 'Mensaje recibido. Jorge te responde pronto.',
  'rate-limited': 'Muchos mensajes seguidos. Intenta de nuevo en unos minutos.',
  empty: 'Escribe un poco más para que Jorge sepa de qué se trata.',
  failed: 'No se pudo enviar. Revisa tu conexión e intenta otra vez.',
};

/** Walkie form (idea + honeypot) and the copy buttons of the frequencies. */
const useWalkie = (gateway: WalkieGateway) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const honeyRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const input = inputRef.current;
      const text = (input?.value ?? '').trim();
      if (!isValidWalkieText(text)) {
        setNote(NOTES.short);
        input?.focus();
        return;
      }
      setSending(true);
      setNote(NOTES.sending);
      const { status } = await gateway.send({ texto: text, web: honeyRef.current?.value ?? '', lang: document.documentElement.lang || 'es' });
      setNote(NOTES[status]);
      if (status === 'ok' && input) input.value = '';
      setSending(false);
    },
    [gateway],
  );

  const copy = useCallback((i: number, value: string, valueEl: HTMLElement | null) => {
    if (!value) return;
    const select = () => {
      if (!valueEl) return;
      const r = document.createRange();
      r.selectNodeContents(valueEl);
      const g = getSelection();
      g?.removeAllRanges();
      g?.addRange(r);
    };
    try {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(i);
        setTimeout(() => setCopied((c) => (c === i ? null : c)), 1400);
      }, select);
    } catch {
      select();
    }
  }, []);

  return { inputRef, honeyRef, note, sending, submit, copied, copy };
};

export default useWalkie;
