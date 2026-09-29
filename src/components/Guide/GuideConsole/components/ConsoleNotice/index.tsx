'use client';

import { X } from 'lucide-react';
import ErrorBox from '@/components/UI/ErrorBox';
import { formatCountdown, interpolate } from '@/utils/format';
import type { ConsoleNoticeProps } from './interface';
import useCountdown from './useCountdown';

const INFO_KINDS = new Set(['queued', 'human', 'paused']);

const ConsoleNotice = ({ kind, messages, cooldownUntil, onDismiss, dismissLabel }: ConsoleNoticeProps) => {
  const remaining = useCountdown(kind === 'rateLimited' ? cooldownUntil : null);
  const template = messages[kind] ?? messages.unavailable ?? '';

  return (
    <div className="px-4 pb-3">
      <ErrorBox
        tone={INFO_KINDS.has(kind) ? 'info' : 'error'}
        message={interpolate(template, { time: formatCountdown(remaining) })}
        action={
          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            className="text-ink-400 hover:text-ink-50"
          >
            <X size={14} />
          </button>
        }
      />
    </div>
  );
};

export default ConsoleNotice;
