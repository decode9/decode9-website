'use client';

import { Paperclip } from 'lucide-react';
import Markdown from '@/components/UI/Markdown';
import useTypingEffect from '@/hooks/useTypingEffect';
import { cn } from '@/utils/cn';
import { interpolate } from '@/utils/format';
import type { MessageBubbleProps } from './interface';
import useMessageReveal from './useMessageReveal';

const MessageBubble = ({ message, name, youLabel, attachmentLabel, attachmentHint, animate }: MessageBubbleProps) => {
  const ref = useMessageReveal(animate);
  const isGuide = message.role === 'guide';
  const text = isGuide ? interpolate(message.text, { name }) : message.text;
  const { displayedText, isTyping } = useTypingEffect({ text, enabled: animate && isGuide, speed: 16, step: 2 });

  if (isGuide) {
    return (
      <li ref={ref} className="d9-bubble self-start font-code text-[12.5px] leading-relaxed text-ink-300">
        <span className="mr-1.5 text-[color:var(--accent)]">›</span>
        <span className={isTyping ? 'd9-caret' : undefined}>{displayedText}</span>
      </li>
    );
  }

  const isVisitor = message.role === 'visitor';
  return (
    <li
      ref={ref}
      className={cn(
        'd9-bubble px-3.5 py-2.5',
        isVisitor
          ? 'self-end border border-brand-red/40 bg-brand-red/15 text-ink-50'
          : 'self-start border border-white/[0.07] bg-white/[0.04] text-ink-100',
        message.pending && 'opacity-60',
      )}
    >
      {isVisitor ? <span className="sr-only">{youLabel}: </span> : null}
      {isVisitor ? <p className="whitespace-pre-wrap">{message.text}</p> : <Markdown source={message.text} />}
      {message.attachment ? (
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-ink-300">
          <Paperclip size={13} />
          {message.attachment.url ? (
            <a href={message.attachment.url} target="_blank" rel="noopener noreferrer">
              {message.attachment.title || attachmentLabel}
            </a>
          ) : (
            <span>{message.attachment.title || attachmentLabel}</span>
          )}
          <span className="text-ink-500">· {attachmentHint}</span>
        </p>
      ) : null}
    </li>
  );
};

export default MessageBubble;
