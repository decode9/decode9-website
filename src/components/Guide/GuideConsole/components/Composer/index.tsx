'use client';

import type { CSSProperties } from 'react';
import { ArrowUp } from 'lucide-react';
import type { ComposerProps } from './interface';
import useComposer from './useComposer';

const Composer = ({ textareaRef, placeholder, label, sendLabel, disabled, maxLength, onSend }: ComposerProps) => {
  const { text, setText, onSubmit, onKeyDown } = useComposer(onSend, disabled);
  const nearLimit = text.length > maxLength * 0.8;

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-white/[0.06] p-3">
      <label className="relative flex-1">
        <span className="sr-only">{label}</span>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, maxLength))}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={placeholder}
          maxLength={maxLength}
          className="block max-h-32 min-h-[42px] w-full resize-none rounded-sm border border-ink-600 bg-ink-900/80 px-3 py-2.5 text-[14px] text-ink-50 placeholder:text-ink-500 focus:border-brand-red focus:outline-none"
          style={{ fieldSizing: 'content' } as CSSProperties}
        />
        {nearLimit ? (
          <span className="absolute bottom-1 right-2 font-code text-[10px] text-ink-400">
            {text.length}/{maxLength}
          </span>
        ) : null}
      </label>
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        aria-label={sendLabel}
        className="d9-notch-tr flex h-[42px] w-[42px] items-center justify-center bg-brand-red text-white transition-opacity disabled:opacity-40"
      >
        <ArrowUp size={18} />
      </button>
    </form>
  );
};

export default Composer;
