'use client';

import { Mail } from 'lucide-react';
import Button from '@/components/UI/Button';
import ErrorBox from '@/components/UI/ErrorBox';
import type { IdentifyFormProps } from './interface';
import useIdentifyForm from './useIdentifyForm';

const INPUT =
  'w-full rounded-sm border border-ink-600 bg-ink-900/80 px-3 py-2 text-[14px] text-ink-50 placeholder:text-ink-500 focus:border-brand-red focus:outline-none';

/** Leave name/email for Jorge (Solvo stores it on the contact). Falls back to email when not possible. */
const IdentifyForm = ({ copy, canIdentify, mailto, onIdentify }: IdentifyFormProps) => {
  const { name, setName, email, setEmail, state, onSubmit } = useIdentifyForm(onIdentify);

  const mailButton = (
    <Button href={mailto} variant="secondary" size="sm">
      <Mail size={14} />
      <span>{copy.mailto}</span>
    </Button>
  );

  if (!canIdentify || state === 'notAllowed' || state === 'error') {
    return (
      <div className="flex flex-col gap-2 px-4 pb-3">
        <ErrorBox tone="info" message={state === 'error' ? copy.error : copy.notAllowed} />
        <div>{mailButton}</div>
      </div>
    );
  }

  if (state === 'done') {
    return (
      <div className="px-4 pb-3">
        <ErrorBox tone="info" message={copy.done} />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-4 mb-3 flex flex-col gap-2 border border-white/[0.07] bg-white/[0.02] p-3">
      <p className="text-[13px] font-semibold text-ink-100">{copy.title}</p>
      <label className="flex flex-col gap-1 text-[12px] text-ink-400">
        {copy.name}
        <input
          className={INPUT}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          maxLength={120}
        />
      </label>
      <label className="flex flex-col gap-1 text-[12px] text-ink-400">
        {copy.email}
        <input
          className={INPUT}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          maxLength={254}
        />
      </label>
      <Button type="submit" size="sm" disabled={state === 'sending'}>
        {state === 'sending' ? copy.sending : copy.submit}
      </Button>
    </form>
  );
};

export default IdentifyForm;
