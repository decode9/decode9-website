import { useEffect, useRef } from 'react';
import type { AgentMessage } from '@/interfaces';

/** Keeps the newest message in view; remembers which messages existed at mount so only new ones animate. */
const useTranscriptScroll = (messages: AgentMessage[], thinking: boolean) => {
  const listRef = useRef<HTMLDivElement>(null);
  const seenAtMount = useRef<Set<string> | null>(null);
  if (seenAtMount.current === null) seenAtMount.current = new Set(messages.map((message) => message.id));

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages.length, thinking]);

  const isNew = (id: string) => !seenAtMount.current?.has(id);
  return { listRef, isNew };
};

export default useTranscriptScroll;
