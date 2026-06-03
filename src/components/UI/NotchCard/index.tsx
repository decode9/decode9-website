'use client';

import { cn } from '@/utils';

interface NotchCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'service' | 'project' | 'code' | 'spec';
  notch?: 'tr' | 'none';
  notchSize?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function NotchCard({
  children,
  className,
  variant = 'default',
  notch = 'tr',
  notchSize = 'md',
  hover = false,
}: NotchCardProps) {
  const notchClass = notch === 'tr'
    ? notchSize === 'lg' ? 'd9-notch-tr-lg' : 'd9-notch-tr'
    : '';

  const variantStyles = {
    default: 'bg-ink-800 border border-ink-700',
    service: 'bg-ink-800 border border-ink-700',
    project: 'bg-ink-800 border border-ink-700',
    code: 'bg-ink-900 border border-ink-700',
    spec: 'bg-ink-800 border border-ink-700',
  }[variant];

  const accentSize = notchSize === 'lg' ? 'w-6 h-6' : 'w-4 h-4';

  return (
    <div
      className={cn(
        'relative transition-all duration-300',
        notchClass,
        variantStyles,
        hover && 'hover:bg-ink-700 hover:border-ink-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30',
        className,
      )}
    >
      {notch === 'tr' && (
        <div
          className={cn('absolute top-0 right-0 pointer-events-none', accentSize)}
          style={{
            background: 'var(--brand-red)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
