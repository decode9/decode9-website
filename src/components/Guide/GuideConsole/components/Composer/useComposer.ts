import { useCallback, useState, type FormEvent, type KeyboardEvent } from 'react';

const useComposer = (onSend: (text: string) => Promise<boolean>, disabled: boolean) => {
  const [text, setText] = useState('');

  const submit = useCallback(async () => {
    const value = text.trim();
    if (!value || disabled) return;
    setText('');
    const sent = await onSend(value);
    // Give the text back if it didn't go through, so nothing typed is lost.
    if (!sent) setText((current) => current || value);
  }, [text, disabled, onSend]);

  const onSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      void submit();
    },
    [submit],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault();
        void submit();
      }
    },
    [submit],
  );

  return { text, setText, onSubmit, onKeyDown };
};

export default useComposer;
