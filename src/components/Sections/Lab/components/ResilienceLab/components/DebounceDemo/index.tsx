'use client';

import type { DebounceDemoProps } from './interface';
import useDebounceDemo from './useDebounceDemo';

const DebounceDemo = ({ copy, onHighlight }: DebounceDemoProps) => {
  const { value, onChange, events, counts } = useDebounceDemo(onHighlight);

  return (
    <div className="flex flex-col gap-4">
      <p className="d9-body text-[14px]">{copy.d}</p>
      <input
        value={value}
        onChange={onChange}
        placeholder={copy.placeholder}
        aria-label={copy.placeholder}
        className="w-full rounded-sm border border-ink-600 bg-ink-900/80 px-3 py-2.5 font-code text-[13px] text-ink-50 placeholder:text-ink-500 focus:border-brand-red focus:outline-none"
      />
      <div className="relative h-20 overflow-hidden border border-ink-700 bg-ink-950/80" aria-hidden="true">
        <span className="absolute left-2 top-1.5 font-code text-[10px] uppercase tracking-widest text-ink-500">
          {copy.typed}
        </span>
        <span className="absolute bottom-1.5 left-2 font-code text-[10px] uppercase tracking-widest text-ink-500">
          {copy.fired}
        </span>
        <span className="absolute inset-x-0 top-1/2 h-px bg-ink-800" />
        {events.map((event) =>
          event.kind === 'key' ? (
            <span key={event.id} className="absolute top-3 h-6 w-[2px] bg-ink-300" style={{ left: `${event.left}%` }} />
          ) : (
            <span
              key={event.id}
              className="absolute bottom-3 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-red shadow-[0_0_12px_rgba(229,18,27,0.8)]"
              style={{ left: `${event.left}%` }}
            />
          ),
        )}
      </div>
      <dl className="grid grid-cols-2 gap-3 font-code text-[12px]">
        <div className="border border-ink-700 px-3 py-2">
          <dt className="text-ink-500">{copy.typed}</dt>
          <dd className="text-[20px] font-semibold text-ink-50">{counts.keys}</dd>
        </div>
        <div className="border border-brand-red/40 px-3 py-2">
          <dt className="text-ink-500">{copy.fired}</dt>
          <dd className="text-[20px] font-semibold text-brand-red-light">{counts.fires}</dd>
        </div>
      </dl>
    </div>
  );
};

export default DebounceDemo;
