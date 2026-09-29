'use client';

import { useDictionary } from '@/context/DictionaryContext';
import { cn } from '@/utils/cn';
import FallbackMark from './components/FallbackMark';
import usePreloader from './usePreloader';

/**
 * Opening sequence overlay. The mark itself is assembled by the WebGL stage
 * behind this layer; here live the boot log, the progress and — without
 * WebGL — a 2D version of the mark. Shown only when the inline boot script set
 * `html[data-loading]` (never under reduced motion or without JavaScript).
 */
const Preloader = () => {
  const { dictionary } = useDictionary();
  const hud = dictionary.hud;
  const { phase, percent, line, stage } = usePreloader(hud.boot);

  if (phase === 'done') return null;

  return (
    <div
      className={cn('d9-preloader', phase === 'leaving' && 'd9-preloader--leaving')}
      data-phase={phase}
      role="progressbar"
      aria-label={hud.loading}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      {stage === 'fallback' ? <FallbackMark percent={percent} /> : null}
      <div className="absolute bottom-[12svh] left-1/2 flex w-[260px] -translate-x-1/2 flex-col items-center gap-3 text-center">
        <span className="d9-hud-code">› {phase === 'loading' ? line : hud.decoded}</span>
        <span className="font-heading text-[40px] font-bold leading-none tabular-nums text-ink-50">
          {String(percent).padStart(3, '0')}
          <span className="text-[color:var(--brand-red)]">%</span>
        </span>
        <span className="relative h-px w-full overflow-hidden bg-ink-700">
          <span className="absolute inset-y-0 left-0 bg-brand-red" style={{ width: `${percent}%` }} />
        </span>
        <span className="d9-hud-label">decode9 · {hud.session}</span>
      </div>
    </div>
  );
};

export default Preloader;
