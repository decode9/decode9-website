import { useCallback, useState, type FormEvent } from 'react';
import type { IdentifyData } from '@/interfaces';
import type { IdentifyOutcome } from '@/hooks/useAgentConversation';

type FormState = 'idle' | 'sending' | IdentifyOutcome;

const useIdentifyForm = (onIdentify: (data: IdentifyData) => Promise<IdentifyOutcome>) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!email.trim() && !name.trim()) return;
      setState('sending');
      setState(await onIdentify({ name: name.trim() || undefined, email: email.trim() || undefined }));
    },
    [email, name, onIdentify],
  );

  return { name, setName, email, setEmail, state, onSubmit };
};

export default useIdentifyForm;
