import { Target } from 'lucide-react';
import DynamicIcon from '@/components/UI/DynamicIcon';
import NotchCard from '@/components/UI/NotchCard';
import { toCode } from '@/utils/format';
import type { ServiceCardProps } from './interface';

/** Hovering or focusing a capability lights its node in the 3D constellation. */
const ServiceCard = ({ service, copy, index, outcomeLabel, onFocus }: ServiceCardProps) => (
  <article
    data-reveal
    tabIndex={0}
    onMouseEnter={() => onFocus(index)}
    onMouseLeave={() => onFocus(null)}
    onFocus={() => onFocus(index)}
    onBlur={() => onFocus(null)}
    className="outline-none focus-visible:ring-1 focus-visible:ring-brand-red"
  >
    <NotchCard hover className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="d9-notch-tr inline-flex h-10 w-10 items-center justify-center bg-ink-700">
          <DynamicIcon name={service.icon} size={18} className="text-ink-100" />
        </span>
        <span className="font-code text-[11px] text-ink-500">{toCode(index + 1)}</span>
      </div>
      <div className="flex-1">
        <h3 className="d9-h4 mb-2">{copy.t}</h3>
        <p className="text-[14px] leading-relaxed text-ink-300">{copy.d}</p>
      </div>
      <p className="flex items-start gap-2 border-t border-ink-700 pt-3 text-[13px] text-ink-300">
        <Target size={13} className="mt-0.5 flex-shrink-0 text-brand-red" aria-hidden="true" />
        <span>
          <span className="sr-only">{outcomeLabel}: </span>
          {copy.out}
        </span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {service.techChips.map((chip) => (
          <span key={chip} className="d9-tech-chip">
            {chip}
          </span>
        ))}
      </div>
    </NotchCard>
  </article>
);

export default ServiceCard;
