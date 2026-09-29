import { useCallback, useMemo, useReducer } from 'react';
import type { AgentMessage } from '@/interfaces/agent';
import { transcriptReducer } from '@/utils/messages';

export interface Transcript {
  messages: AgentMessage[];
  append: (messages: AgentMessage[]) => void;
  merge: (messages: AgentMessage[], position?: 'append' | 'prepend') => void;
  dropPending: () => void;
}

/** Single ordered log of guide narration, visitor messages and agent replies. */
const useTranscript = (): Transcript => {
  const [messages, dispatch] = useReducer(transcriptReducer, []);
  const append = useCallback((next: AgentMessage[]) => dispatch({ type: 'append', messages: next }), []);
  const merge = useCallback(
    (next: AgentMessage[], position?: 'append' | 'prepend') => dispatch({ type: 'merge', messages: next, position }),
    [],
  );
  const dropPending = useCallback(() => dispatch({ type: 'dropPending' }), []);
  return useMemo(() => ({ messages, append, merge, dropPending }), [messages, append, merge, dropPending]);
};

export default useTranscript;
