import { Terminal } from 'lucide-react';
import NotchCard from '@/components/UI/NotchCard';
import ScrambleText from '@/components/UI/ScrambleText';
import type { ProfileCardProps } from './interface';

/** Jorge as a config file — each value decodes as the card scrolls in. */
const ProfileCard = ({ title, rows }: ProfileCardProps) => (
  <NotchCard className="overflow-hidden bg-ink-900/90" notchSize="lg">
    <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-800/80 px-5 py-3">
      <Terminal size={14} className="text-brand-red" aria-hidden="true" />
      <span className="d9-mono-label">{title}</span>
    </div>
    <dl className="divide-y divide-ink-700/70 font-code text-[13px]">
      {rows.map((row, index) => (
        <div key={row.k} className="grid grid-cols-[110px_1fr] gap-4 px-5 py-3">
          <dt className="text-ink-400">{row.k}</dt>
          <dd className={index === rows.length - 1 ? 'font-semibold text-success' : 'text-ink-100'}>
            <ScrambleText text={row.v} delay={index * 0.08} duration={0.9} />
          </dd>
        </div>
      ))}
    </dl>
  </NotchCard>
);

export default ProfileCard;
