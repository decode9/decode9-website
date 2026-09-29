import { cn } from '@/utils/cn';
import type { NotchCardProps } from './interface';

/** Card with the decode9 signature: a 45° notch in the top-right corner. */
const NotchCard = ({ children, className, notchSize = 'md', hover = false, accent, style }: NotchCardProps) => (
  <div
    className={cn(
      'relative border border-ink-700 bg-ink-800/85 transition-all duration-300',
      notchSize === 'lg' ? 'd9-notch-tr-lg' : 'd9-notch-tr',
      hover && 'hover:-translate-y-0.5 hover:border-ink-600 hover:bg-ink-700/90 hover:shadow-lg hover:shadow-black/30',
      className,
    )}
    style={style}
  >
    <span
      aria-hidden="true"
      className={cn('pointer-events-none absolute right-0 top-0', notchSize === 'lg' ? 'h-6 w-6' : 'h-4 w-4')}
      style={{ background: accent ?? 'var(--accent)', clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
    />
    {children}
  </div>
);

export default NotchCard;
