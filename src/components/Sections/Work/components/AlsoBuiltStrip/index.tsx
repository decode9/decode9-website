import { ArrowUpRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { AlsoBuiltStripProps } from './interface';

const AlsoBuiltStrip = ({ title, items, descriptions }: AlsoBuiltStripProps) => (
  <div className="d9-container-wide mt-16 h:mx-0 h:mt-0 h:w-[620px] h:flex-none h:px-0">
    <h3 className="d9-eyebrow">{title}</h3>
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 h:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="d9-card flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="d9-label">{item.name}</span>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                onClick={() => trackEvent('project_click', { project: item.id, action: 'visit' })}
                className="text-ink-400 transition-colors hover:text-ink-50"
              >
                <ArrowUpRight size={16} />
              </a>
            ) : null}
          </div>
          <p className="flex-1 text-[13.5px] leading-relaxed text-ink-300">{descriptions[item.id]}</p>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="d9-tech-chip">
                {tag}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default AlsoBuiltStrip;
