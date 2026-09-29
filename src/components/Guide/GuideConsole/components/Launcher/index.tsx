'use client';

import { MessageSquareText } from 'lucide-react';
import { cn } from '@/utils/cn';
import CoreAvatar from '../CoreAvatar';
import type { LauncherProps } from './interface';
import useLauncher from './useLauncher';

const Launcher = ({ name, subtitle, openLabel, thinking, live, onOpen }: LauncherProps) => {
  const { displayedText, isTyping, expanded, onEnter, onLeave } = useLauncher(subtitle);

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-expanded={false}
      className={cn(
        'd9-console group ml-auto flex items-center gap-3 overflow-hidden text-left transition-[width,padding,border-radius] duration-500 ease-out',
        expanded ? 'd9-notch-tr w-full px-3.5 py-3 md:w-[360px]' : 'h-[60px] w-[60px] justify-center rounded-full p-0',
      )}
    >
      <CoreAvatar thinking={thinking} live={live} />
      <span className={cn('min-w-0 flex-1', !expanded && 'sr-only')}>
        <span className="block font-code text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--accent)]">
          {name}
        </span>
        <span className="sr-only">{openLabel}</span>
        <span aria-hidden="true" className="line-clamp-2 block text-[13px] leading-snug text-ink-200">
          <span className={isTyping ? 'd9-caret' : undefined}>{displayedText}</span>
        </span>
      </span>
      {expanded ? (
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-ink-600 text-ink-300 transition-colors group-hover:border-brand-red group-hover:text-ink-50">
          <MessageSquareText size={16} />
        </span>
      ) : null}
    </button>
  );
};

export default Launcher;
