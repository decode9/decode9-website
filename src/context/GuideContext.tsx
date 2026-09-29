'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AgentMessage, ChapterId, ConversationalAgent, IdentifyData, QuickReplyId } from '@/interfaces';
import type { KeyValueStorage } from '@/interfaces/storage';
import type { SceneStore } from '@/interfaces/scene';
import { chapterById, quickReplies } from '@/data/chapters';
import useAgentConversation, {
  type ConversationStatus,
  type IdentifyOutcome,
  type NoticeKind,
  type SendSource,
} from '@/hooks/useAgentConversation';
import useGuideNarration from '@/hooks/useGuideNarration';
import useTranscript from '@/hooks/useTranscript';
import { trackEvent } from '@/lib/analytics';
import { useDictionary } from './DictionaryContext';

export interface GuideContextValue {
  name: string;
  live: boolean;
  status: ConversationStatus;
  notice: NoticeKind | null;
  cooldownUntil: number | null;
  messages: AgentMessage[];
  subtitle: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  activeChapter: ChapterId;
  enterChapter: (id: ChapterId) => void;
  replies: QuickReplyId[];
  runReply: (id: QuickReplyId) => void;
  send: (text: string, source?: SendSource) => Promise<boolean>;
  identify: (data: IdentifyData) => Promise<IdentifyOutcome>;
  canIdentify: boolean;
  identifyRequested: boolean;
  lastQuestion: string | null;
  dismissNotice: () => void;
}

interface GuideProviderProps {
  agent: ConversationalAgent;
  scene: SceneStore;
  storage: KeyValueStorage;
  navigate: (id: ChapterId) => void;
  children: ReactNode;
}

const GuideContext = createContext<GuideContextValue | null>(null);

/**
 * Application state of the guided session: which chapter is on screen, the
 * narration, and the conversation with the agent. Quick replies are scripted
 * here — the AI itself never triggers actions on the site.
 */
export const GuideProvider = ({ agent, scene, storage, navigate, children }: GuideProviderProps) => {
  const { dictionary } = useDictionary();
  const guideCopy = dictionary.guide;
  const [isOpen, setIsOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState<ChapterId>('handshake');
  const [identifyRequested, setIdentifyRequested] = useState(false);
  const transcript = useTranscript();

  const onThinkingChange = useCallback((thinking: boolean) => scene.set({ thinking }), [scene]);

  const conversation = useAgentConversation({
    agent,
    isOpen,
    storage,
    transcript,
    fallbackName: guideCopy.fallbackName,
    onThinkingChange,
  });

  const { subtitle } = useGuideNarration({
    activeChapter,
    lines: guideCopy.chapters as Record<ChapterId, string[]>,
    greeting: guideCopy.greeting,
    append: transcript.append,
  });

  const open = useCallback(() => {
    setIsOpen(true);
    trackEvent('guide_open');
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => (isOpen ? close() : open()), [isOpen, open, close]);

  const { send } = conversation;
  const sendFromComposer = useCallback((text: string, source: SendSource = 'composer') => send(text, source), [send]);
  const runReply = useCallback(
    (id: QuickReplyId) => {
      const { intent } = quickReplies[id];
      trackEvent('guide_reply', { reply: id });
      if (intent.type === 'navigate') {
        navigate(intent.to);
        return;
      }
      if (intent.type === 'contact') {
        navigate('handoff');
        setIdentifyRequested(true);
        open();
        return;
      }
      const reply = guideCopy.replies[id] as { label: string; prompt?: string };
      open();
      void send(reply.prompt ?? reply.label, 'reply');
    },
    [guideCopy.replies, navigate, open, send],
  );

  const value = useMemo<GuideContextValue>(
    () => ({
      ...conversation,
      send: sendFromComposer,
      messages: transcript.messages,
      subtitle,
      isOpen,
      open,
      close,
      toggle,
      activeChapter,
      enterChapter: setActiveChapter,
      replies: chapterById(activeChapter).replies,
      runReply,
      identifyRequested,
    }),
    [
      conversation,
      sendFromComposer,
      transcript.messages,
      subtitle,
      isOpen,
      open,
      close,
      toggle,
      activeChapter,
      runReply,
      identifyRequested,
    ],
  );

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
};

export const useGuide = (): GuideContextValue => {
  const context = useContext(GuideContext);
  if (!context) throw new Error('useGuide must be used within a GuideProvider');
  return context;
};
