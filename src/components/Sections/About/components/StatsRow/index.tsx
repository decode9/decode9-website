import CountUp from '@/components/UI/CountUp';
import type { StatsRowProps } from './interface';

const StatsRow = ({ stats }: StatsRowProps) => (
  <dl className="grid grid-cols-3 gap-4 border-t border-ink-700/70 pt-6">
    {stats.map((stat) => (
      <div key={stat.label} className="flex flex-col" data-reveal>
        <dt className="order-2 mt-1 text-[12.5px] leading-snug text-ink-400">{stat.label}</dt>
        <dd className="font-heading text-[clamp(28px,3.4vw,40px)] font-bold leading-none text-ink-50">
          <CountUp value={stat.value} suffix={stat.suffix} />
        </dd>
      </div>
    ))}
  </dl>
);

export default StatsRow;
