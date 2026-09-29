import type { SpinnerProps } from './interface';

/** Three pulsing bars — "decoding". */
const Spinner = ({ label }: SpinnerProps) => (
  <span role="status" className="inline-flex items-center gap-2 text-ink-300">
    <span className="flex h-3 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="w-[3px] rounded-sm bg-brand-red"
          style={{ height: '100%', animation: `pulse-dot 0.9s ${bar * 0.15}s ease-in-out infinite` }}
        />
      ))}
    </span>
    <span className="font-code text-[11px] uppercase tracking-[0.14em]">{label}</span>
  </span>
);

export default Spinner;
