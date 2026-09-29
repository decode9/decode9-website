import Image from 'next/image';
import { ArrowUpRight, FileText } from 'lucide-react';
import Button from '@/components/UI/Button';
import { toCode } from '@/utils/format';
import { withBase } from '@/utils/asset';
import BrandMark from './components/BrandMark';
import DeviceShots from './components/DeviceShots';
import type { CaseCardProps } from './interface';

const CaseCard = ({ study, copy, labels, index, total, onOpen, onVisit }: CaseCardProps) => (
  <article
    data-case
    aria-labelledby={`case-${study.id}`}
    className="relative grid w-full flex-shrink-0 items-center gap-10 overflow-hidden border border-white/[0.07] p-6 md:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] h:max-h-[calc(100svh-var(--header-h)-48px)] h:w-[min(1120px,78vw)] h:gap-8 h:p-8"
    style={{
      background: `radial-gradient(ellipse at 85% 10%, ${study.brand.primary}22, transparent 55%), linear-gradient(160deg, ${study.brand.background}f2, rgba(11,12,14,.94) 70%)`,
    }}
  >
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <BrandMark brand={study.brand} name={study.name} />
        <span className="font-code text-[11px] text-ink-400">
          {toCode(index + 1)} / {toCode(total)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="d9-badge d9-badge--success d9-badge--dot">{labels.status[study.status]}</span>
        <span className="d9-badge d9-badge--muted">{copy.sector}</span>
        {study.poweredByEmpire ? (
          <span className="d9-badge d9-badge--muted gap-1.5 normal-case tracking-normal">
            <Image src={withBase('/work/the-empire/isotype.png')} alt="" width={14} height={12} aria-hidden="true" />
            {labels.poweredBy}
          </span>
        ) : null}
      </div>

      <div>
        <h3 id={`case-${study.id}`} className="d9-h1 mb-1 text-[clamp(26px,3vw,38px)]">
          {study.name}
        </h3>
        <p className="font-code text-[12px] uppercase tracking-[0.12em]" style={{ color: study.brand.primary }}>
          {labels.labels.role}: {copy.role}
        </p>
      </div>

      <p className="d9-body text-ink-200 h:line-clamp-4">{copy.summary}</p>

      <dl className="grid grid-cols-3 gap-3 border-y border-white/[0.08] py-4">
        {copy.metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col">
            <dt className="order-2 text-[11.5px] leading-snug text-ink-400">{metric.label}</dt>
            <dd className="font-heading text-[clamp(20px,2.2vw,28px)] font-bold leading-tight text-ink-50">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="flex flex-wrap gap-1.5" aria-label={labels.labels.stack}>
        {study.stack.map((tech) => (
          <li key={tech} className="d9-tech-chip">
            {tech}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <Button size="sm" variant="secondary" onClick={onOpen}>
          <FileText size={14} />
          <span>{labels.details}</span>
        </Button>
        {study.url ? (
          <Button size="sm" variant="outline" href={study.url} external onClick={onVisit}>
            <span>{labels.visit}</span>
            <ArrowUpRight size={14} />
          </Button>
        ) : null}
      </div>
    </div>

    <DeviceShots
      desktop={study.media.desktop}
      mobile={study.media.mobile}
      alt={copy.alt}
      url={study.url}
      accent={study.brand.primary}
    />
  </article>
);

export default CaseCard;
