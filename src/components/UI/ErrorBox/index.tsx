import { cn } from '@/utils/cn';
import type { ErrorBoxProps } from './interface';

const ErrorBox = ({ message, tone = 'error', action }: ErrorBoxProps) => (
  <div
    role={tone === 'error' ? 'alert' : 'status'}
    className={cn(
      'flex items-start justify-between gap-3 border-l-2 px-3 py-2 text-[13px] leading-snug',
      tone === 'error'
        ? 'border-brand-red bg-brand-red/10 text-ink-100'
        : 'border-ink-400 bg-white/[0.03] text-ink-200',
    )}
  >
    <span>{message}</span>
    {action}
  </div>
);

export default ErrorBox;
