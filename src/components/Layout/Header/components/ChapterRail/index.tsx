import { chapters } from '@/data/chapters';
import { cn } from '@/utils/cn';
import type { ChapterRailProps } from './interface';

/** The tour map: every chapter by code; the current one shows its name. */
const ChapterRail = ({ label, activeChapter, names, onSelect }: ChapterRailProps) => (
  <nav aria-label={label} className="hidden lg:block">
    <ol className="flex items-center gap-1">
      {chapters.map(({ id, code }) => {
        const active = id === activeChapter;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active ? 'step' : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(id);
              }}
              className={cn(
                'group flex items-center gap-2 px-2 py-1.5 font-code text-[11px] tracking-[0.12em] transition-colors duration-200',
                active ? 'text-ink-50' : 'text-ink-400 hover:text-ink-100',
              )}
            >
              <span className={cn('transition-colors', active && 'text-[color:var(--accent)]')}>{code}</span>
              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap font-body text-[12.5px] font-medium tracking-normal transition-all duration-300',
                  active
                    ? 'max-w-[140px] opacity-100'
                    : 'max-w-0 opacity-0 group-hover:max-w-[140px] group-hover:opacity-100',
                )}
              >
                {names[id]}
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  </nav>
);

export default ChapterRail;
