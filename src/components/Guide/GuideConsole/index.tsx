'use client';

import { useId } from 'react';
import { AGENT_MESSAGE_MAX_LENGTH, type QuickReplyId } from '@/interfaces';
import { useDictionary } from '@/context/DictionaryContext';
import { useGuide } from '@/context/GuideContext';
import { CONTACT } from '@/data/contact';
import { cn } from '@/utils/cn';
import { interpolate } from '@/utils/format';
import Composer from './components/Composer';
import ConsoleHeader from './components/ConsoleHeader';
import ConsoleNotice from './components/ConsoleNotice';
import IdentifyForm from './components/IdentifyForm';
import Launcher from './components/Launcher';
import QuickReplies from './components/QuickReplies';
import Transcript from './components/Transcript';
import useGuideConsole from './useGuideConsole';

/** The guide, docked: a caption pill while you watch, a conversation when you open it. */
const GuideConsole = () => {
  const { dictionary } = useDictionary();
  const guide = useGuide();
  const copy = dictionary.guide;
  const { panelRef, composerRef, isMobile, statusLabel, thinking, cooling } = useGuideConsole(guide, copy.status);
  const titleId = useId();
  const replies = copy.replies as Record<QuickReplyId, { label: string }>;

  return (
    <aside
      data-ui="chrome"
      className="fixed bottom-4 right-4 z-[55] flex justify-end max-md:left-4 md:bottom-5 md:right-6"
      aria-label={copy.console.title}
    >
      {guide.isOpen ? (
        <div
          ref={panelRef}
          role={isMobile ? 'dialog' : undefined}
          aria-modal={isMobile ? true : undefined}
          aria-labelledby={titleId}
          className={cn(
            'd9-console d9-notch-tr-lg flex flex-col',
            'max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:h-[85svh]',
            'md:h-[min(620px,calc(100svh-120px))] md:w-[410px]',
          )}
        >
          <ConsoleHeader
            name={guide.name}
            statusLabel={statusLabel}
            thinking={thinking}
            live={guide.live}
            minimizeLabel={copy.console.minimize}
            onMinimize={guide.close}
            titleId={titleId}
          />
          <Transcript
            messages={guide.messages}
            name={guide.name}
            label={interpolate(copy.console.transcript, { name: guide.name })}
            live={guide.isOpen}
            thinking={thinking}
            thinkingLabel={copy.status.thinking}
            youLabel={copy.console.you}
            attachmentLabel={copy.console.attachment}
            attachmentHint={copy.console.attachmentHint}
          />
          {guide.notice ? (
            <ConsoleNotice
              kind={guide.notice}
              messages={copy.status}
              cooldownUntil={guide.cooldownUntil}
              onDismiss={guide.dismissNotice}
              dismissLabel={copy.console.minimize}
            />
          ) : null}
          {guide.identifyRequested ? (
            <IdentifyForm
              copy={copy.identify}
              canIdentify={guide.canIdentify}
              mailto={CONTACT.mailto}
              onIdentify={guide.identify}
            />
          ) : null}
          <QuickReplies
            label={copy.console.suggestions}
            options={guide.replies.map((id) => ({ id, label: replies[id].label }))}
            disabled={thinking}
            onSelect={guide.runReply}
          />
          <Composer
            textareaRef={composerRef}
            placeholder={copy.console.placeholder}
            label={interpolate(copy.console.label, { name: guide.name })}
            sendLabel={copy.console.send}
            disabled={thinking || cooling}
            maxLength={AGENT_MESSAGE_MAX_LENGTH}
            onSend={(text) => guide.send(text)}
          />
          {guide.live ? (
            <p className="px-4 pb-2 text-right font-code text-[10px] uppercase tracking-[0.14em] text-ink-500">
              {copy.console.poweredBy}
            </p>
          ) : null}
        </div>
      ) : (
        <Launcher
          name={guide.name}
          subtitle={interpolate(guide.subtitle, { name: guide.name })}
          openLabel={interpolate(copy.console.open, { name: guide.name })}
          thinking={thinking}
          live={guide.live}
          onOpen={guide.open}
        />
      )}
    </aside>
  );
};

export default GuideConsole;
