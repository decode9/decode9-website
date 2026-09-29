import { toCode } from '@/utils/format';
import type { ProcessStepItemProps } from './interface';

const ProcessStepItem = ({ step, title, description }: ProcessStepItemProps) => (
  <li data-step data-reveal className="relative flex gap-4 lg:flex-col lg:items-center lg:gap-5 lg:text-center">
    <span
      data-step-badge
      className="d9-notch-num relative z-10 flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center border border-white/15 bg-ink-800 font-code text-lg font-bold text-ink-100"
    >
      {toCode(step)}
    </span>
    <div data-step-copy>
      <h3 className="d9-h4 mb-2">{title}</h3>
      <p className="text-[13.5px] leading-snug text-ink-300">{description}</p>
    </div>
  </li>
);

export default ProcessStepItem;
