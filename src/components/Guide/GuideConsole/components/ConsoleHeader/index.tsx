import { Minus } from 'lucide-react';
import CoreAvatar from '../CoreAvatar';
import type { ConsoleHeaderProps } from './interface';

const ConsoleHeader = ({
  name,
  statusLabel,
  thinking,
  live,
  minimizeLabel,
  onMinimize,
  titleId,
}: ConsoleHeaderProps) => (
  <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
    <CoreAvatar thinking={thinking} live={live} />
    <div className="min-w-0 flex-1">
      <h2 id={titleId} className="truncate font-heading text-[15px] font-semibold text-ink-50">
        {name}
      </h2>
      <p className="flex items-center gap-1.5 font-code text-[10.5px] uppercase tracking-[0.12em] text-ink-400">
        <span className={live ? 'h-1.5 w-1.5 rounded-full bg-success' : 'h-1.5 w-1.5 rounded-full bg-ink-500'} />
        {statusLabel}
      </p>
    </div>
    <button
      type="button"
      onClick={onMinimize}
      aria-label={minimizeLabel}
      className="p-1.5 text-ink-400 transition-colors hover:text-ink-50"
    >
      <Minus size={18} />
    </button>
  </div>
);

export default ConsoleHeader;
