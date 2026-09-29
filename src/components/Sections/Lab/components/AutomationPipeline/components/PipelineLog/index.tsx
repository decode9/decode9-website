import type { PipelineLogProps } from './interface';

const PipelineLog = ({ lines, visible, idle }: PipelineLogProps) => (
  <div
    data-lenis-prevent
    className="h-[150px] overflow-hidden border border-ink-700 bg-ink-950/90 p-4 font-code text-[12px] leading-6"
  >
    {visible === 0 ? (
      <p className="d9-caret text-ink-500">{idle}</p>
    ) : (
      <ol aria-live="polite">
        {lines.slice(0, visible).map((line, index) => (
          <li key={line} className={index === visible - 1 ? 'text-ink-100' : 'text-ink-400'}>
            {line}
          </li>
        ))}
      </ol>
    )}
  </div>
);

export default PipelineLog;
