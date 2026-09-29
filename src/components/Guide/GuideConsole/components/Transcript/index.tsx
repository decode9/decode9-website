'use client';

import Spinner from '@/components/UI/Spinner';
import MessageBubble from '../MessageBubble';
import type { TranscriptProps } from './interface';
import useTranscriptScroll from './useTranscriptScroll';

const Transcript = ({
  messages,
  name,
  label,
  live,
  thinking,
  thinkingLabel,
  youLabel,
  attachmentLabel,
  attachmentHint,
}: TranscriptProps) => {
  const { listRef, isNew } = useTranscriptScroll(messages, thinking);

  return (
    <div ref={listRef} data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
      <ol role="log" aria-label={label} aria-live={live ? 'polite' : 'off'} className="flex flex-col gap-3">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            name={name}
            youLabel={youLabel}
            attachmentLabel={attachmentLabel}
            attachmentHint={attachmentHint}
            animate={isNew(message.id)}
          />
        ))}
      </ol>
      {thinking ? (
        <div className="mt-3">
          <Spinner label={thinkingLabel} />
        </div>
      ) : null}
    </div>
  );
};

export default Transcript;
