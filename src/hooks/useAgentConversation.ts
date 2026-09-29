import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AGENT_MESSAGE_MAX_LENGTH,
  type AgentErrorKind,
  type AgentMessage,
  type ConversationalAgent,
  type IdentifyData,
  type ReplyState,
} from '@/interfaces/agent';
import type { KeyValueStorage } from '@/interfaces/storage';
import { errorKindOf } from '@/lib/agent/errors';
import { trackEvent } from '@/lib/analytics';
import { lastIdFrom } from '@/utils/messages';
import type { Transcript } from './useTranscript';

export type ConversationStatus = 'idle' | 'connecting' | 'ready' | 'thinking';

export type NoticeKind = AgentErrorKind | Exclude<ReplyState, 'answered'>;

export type IdentifyOutcome = 'done' | 'notAllowed' | 'error';

export type SendSource = 'composer' | 'reply';

interface UseAgentConversationOptions {
  agent: ConversationalAgent;
  isOpen: boolean;
  fallbackName: string;
  storage: KeyValueStorage;
  transcript: Transcript;
  onThinkingChange: (thinking: boolean) => void;
}

export interface UseAgentConversationReturn {
  name: string;
  live: boolean;
  status: ConversationStatus;
  notice: NoticeKind | null;
  cooldownUntil: number | null;
  hasWritten: boolean;
  canIdentify: boolean;
  lastQuestion: string | null;
  send: (text: string, source: SendSource) => Promise<boolean>;
  identify: (data: IdentifyData) => Promise<IdentifyOutcome>;
  dismissNotice: () => void;
}

const NAME_KEY = 'd9-agent-name';
const COOLDOWN_MS = 60_000;
/** Solvo's read limiter is 60/min per IP and shared with /sesion and /datos: stay well below it. */
const POLL_DELAYS_MS = [3_000, 3_000, 5_000, 10_000, 10_000, 30_000];
const SLOW_POLL = POLL_DELAYS_MS.length - 1;

const useAgentConversation = ({
  agent,
  isOpen,
  fallbackName,
  storage,
  transcript,
  onThinkingChange,
}: UseAgentConversationOptions): UseAgentConversationReturn => {
  const [name, setName] = useState(fallbackName);
  const [live, setLive] = useState(agent.capabilities.live);
  const [status, setStatus] = useState<ConversationStatus>('idle');
  const [notice, setNotice] = useState<NoticeKind | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [hasWritten, setHasWritten] = useState(false);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [pollKick, setPollKick] = useState(0);

  const opened = useRef(false);
  const pollStart = useRef(SLOW_POLL);
  const messages = useRef<AgentMessage[]>(transcript.messages);
  messages.current = transcript.messages;
  const { merge, append, dropPending } = transcript;

  const syncLive = useCallback(() => {
    const nowLive = agent.capabilities.live;
    setLive((wasLive) => {
      if (wasLive && !nowLive) setNotice('unavailable');
      return nowLive;
    });
  }, [agent]);

  const handleError = useCallback(
    (error: unknown) => {
      const kind = errorKindOf(error);
      if (kind === 'rateLimited') setCooldownUntil(Date.now() + COOLDOWN_MS);
      setNotice(kind);
      trackEvent('guide_error', { kind });
      syncLive();
    },
    [syncLive],
  );

  useEffect(() => {
    const cached = storage.get(NAME_KEY);
    if (cached) setName(cached);
  }, [storage]);

  // The session opens lazily, the first time the console is opened.
  useEffect(() => {
    if (!isOpen || opened.current) return;
    opened.current = true;
    setStatus('connecting');
    agent
      .open()
      .then((session) => {
        if (session.name) {
          setName(session.name);
          storage.set(NAME_KEY, session.name);
        }
        if (session.history.length > 0) {
          merge(session.history, 'prepend');
          setHasWritten(session.history.some((message) => message.role === 'visitor'));
        }
        syncLive();
      })
      .catch(handleError)
      .finally(() => setStatus('ready'));
  }, [agent, isOpen, merge, storage, syncLive, handleError]);

  useEffect(() => {
    if (cooldownUntil === null) return undefined;
    const timer = setTimeout(
      () => {
        setCooldownUntil(null);
        setNotice((current) => (current === 'rateLimited' ? null : current));
      },
      Math.max(0, cooldownUntil - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [cooldownUntil]);

  const send = useCallback(
    async (text: string, source: SendSource): Promise<boolean> => {
      const clean = text.trim().slice(0, AGENT_MESSAGE_MAX_LENGTH);
      if (!clean || status === 'thinking' || (cooldownUntil !== null && cooldownUntil > Date.now())) return false;
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setNotice('network');
        return false;
      }
      append([
        {
          id: `pending-${Date.now()}`,
          role: 'visitor',
          text: clean,
          at: new Date().toISOString(),
          attachment: null,
          pending: true,
        },
      ]);
      setLastQuestion(clean);
      setStatus('thinking');
      setNotice(null);
      onThinkingChange(true);
      trackEvent('guide_send', { source });
      try {
        const result = await agent.send(clean);
        dropPending();
        merge(result.messages);
        setHasWritten(true);
        setNotice(result.state === 'answered' ? null : result.state);
        pollStart.current = result.state === 'answered' ? SLOW_POLL : 0;
        setPollKick((kick) => kick + 1);
        syncLive();
        return true;
      } catch (error) {
        dropPending();
        handleError(error);
        return false;
      } finally {
        setStatus('ready');
        onThinkingChange(false);
      }
    },
    [agent, append, cooldownUntil, dropPending, handleError, merge, onThinkingChange, status, syncLive],
  );

  // Adaptive polling: replies that didn't come back inline (queued, human takeover).
  useEffect(() => {
    if (!isOpen || !hasWritten || !live) return undefined;
    let attempt = pollStart.current;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const schedule = () => {
      timer = setTimeout(run, POLL_DELAYS_MS[Math.min(attempt, SLOW_POLL)]);
    };
    const run = async () => {
      if (!document.hidden) {
        try {
          const known = new Set(messages.current.map((message) => message.id));
          const fresh = await agent.poll(lastIdFrom(messages.current));
          merge(fresh);
          const gotReply = fresh.some((message) => !known.has(message.id) && message.role === 'agent');
          if (gotReply) setNotice((current) => (current === 'queued' || current === 'paused' ? null : current));
          attempt = gotReply ? 0 : attempt + 1;
        } catch (error) {
          attempt = SLOW_POLL;
          if (errorKindOf(error) !== 'network') handleError(error);
        }
      }
      if (!cancelled) schedule();
    };

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [agent, handleError, hasWritten, isOpen, live, merge, pollKick]);

  const canIdentify = live && agent.capabilities.identify && hasWritten;

  const identify = useCallback(
    async (data: IdentifyData): Promise<IdentifyOutcome> => {
      if (!canIdentify) return 'notAllowed';
      try {
        await agent.identify(data);
        trackEvent('guide_identify');
        return 'done';
      } catch (error) {
        return errorKindOf(error) === 'identifyNotAllowed' ? 'notAllowed' : 'error';
      }
    },
    [agent, canIdentify],
  );

  const dismissNotice = useCallback(() => setNotice(null), []);

  return useMemo(
    () => ({
      name,
      live,
      status,
      notice,
      cooldownUntil,
      hasWritten,
      canIdentify,
      lastQuestion,
      send,
      identify,
      dismissNotice,
    }),
    [name, live, status, notice, cooldownUntil, hasWritten, canIdentify, lastQuestion, send, identify, dismissNotice],
  );
};

export default useAgentConversation;
