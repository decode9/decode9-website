import { ArrowRight } from 'lucide-react';
import type { ScrollCueProps } from './interface';

/** "Scroll to begin": a falling line on the vertical layout, an arrow pointing the way on the horizontal tour. */
const ScrollCue = ({ label, onClick }: ScrollCueProps) => (
  <button
    type="button"
    onClick={onClick}
    className="group absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex h:bottom-10 h:left-auto h:right-[max(24px,5vw)] h:translate-x-0 h:flex-row"
  >
    <span className="d9-hud-label transition-colors group-hover:text-ink-200">{label}</span>
    <span className="relative h-12 w-px overflow-hidden bg-ink-700 h:hidden">
      <span
        className="absolute inset-x-0 top-0 h-1/2 bg-[color:var(--accent)]"
        style={{ animation: 'scan 1.8s ease-in-out infinite' }}
      />
    </span>
    <span className="hidden items-center gap-2 text-[color:var(--accent)] h:flex">
      <span className="relative h-px w-16 overflow-hidden bg-ink-700">
        <span
          className="absolute inset-y-0 left-0 w-1/2 bg-[color:var(--accent)]"
          style={{ animation: 'scan-x 1.8s ease-in-out infinite' }}
        />
      </span>
      <ArrowRight size={14} />
    </span>
  </button>
);

export default ScrollCue;
