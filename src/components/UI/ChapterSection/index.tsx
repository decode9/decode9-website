import { cn } from '@/utils/cn';
import type { ChapterSectionProps } from './interface';

/** A chapter of the guided session: a vertical section, or a panel of the horizontal tour. */
const ChapterSection = ({
  id,
  code,
  label,
  labelledBy,
  children,
  className,
  veil,
  layout = 'screen',
}: ChapterSectionProps) => (
  <section
    id={id}
    data-chapter={id}
    aria-labelledby={labelledBy}
    className={cn(
      'd9-chapter',
      veil === 'side' && 'd9-chapter--veil',
      veil === 'full' && 'd9-chapter--veil-full',
      'h:flex h:h-full h:flex-none h:flex-col h:justify-center h:py-0 h:pt-[var(--header-h)]',
      layout === 'wide' ? 'h:w-max h:!bg-none' : 'h:w-screen',
      className,
    )}
  >
    <div
      className="d9-container-wide pointer-events-none mb-10 hidden md:block h:absolute h:left-[max(24px,5vw)] h:top-[calc(var(--header-h)+18px)] h:mb-0 h:w-auto h:px-0"
      aria-hidden="true"
    >
      <span className="d9-hud-code">
        CH.{code} <span className="text-ink-500">{'//'}</span> <span className="text-ink-400">{label}</span>
      </span>
    </div>
    {children}
  </section>
);

export default ChapterSection;
