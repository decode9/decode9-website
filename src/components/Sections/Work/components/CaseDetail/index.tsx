'use client';

import { ArrowUpRight, Check, X } from 'lucide-react';
import Button from '@/components/UI/Button';
import BrandMark from '../CaseCard/components/BrandMark';
import type { CaseDetailProps } from './interface';
import useCaseDetail from './useCaseDetail';

const CaseDetail = ({ study, copy, labels, onClose, onVisit }: CaseDetailProps) => {
  const dialogRef = useCaseDetail(onClose);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink-950/70 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`detail-${study.id}`}
        data-lenis-prevent
        onClick={(event) => event.stopPropagation()}
        className="d9-console d9-notch-tr-lg max-h-[92svh] w-full max-w-3xl overflow-y-auto p-6 md:p-10"
        style={{ borderTop: `2px solid ${study.brand.primary}` }}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <BrandMark brand={study.brand} name={study.name} />
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="p-2 text-ink-400 hover:text-ink-50"
          >
            <X size={20} />
          </button>
        </div>

        <h3 id={`detail-${study.id}`} className="d9-h1 mb-2" data-detail-in>
          {study.name}
        </h3>
        <p
          className="mb-8 font-code text-[12px] uppercase tracking-[0.12em]"
          style={{ color: study.brand.primary }}
          data-detail-in
        >
          {labels.labels.role}: {copy.role} · {labels.labels.since} {study.since}
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <section data-detail-in>
            <h4 className="d9-eyebrow">{labels.labels.challenge}</h4>
            <p className="d9-body text-ink-200">{copy.challenge}</p>
          </section>
          <section data-detail-in>
            <h4 className="d9-eyebrow">{labels.labels.solution}</h4>
            <p className="d9-body text-ink-200">{copy.solution}</p>
          </section>
        </div>

        <section className="mt-8" data-detail-in>
          <h4 className="d9-eyebrow">{labels.labels.outcomes}</h4>
          <ul className="flex flex-col gap-3">
            {copy.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-3 text-[15px] text-ink-100">
                <Check
                  size={16}
                  className="mt-1 flex-shrink-0"
                  style={{ color: study.brand.primary }}
                  aria-hidden="true"
                />
                {outcome}
              </li>
            ))}
          </ul>
        </section>

        <section
          className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6"
          data-detail-in
        >
          <ul className="flex flex-wrap gap-1.5" aria-label={labels.labels.stack}>
            {study.stack.map((tech) => (
              <li key={tech} className="d9-tech-chip">
                {tech}
              </li>
            ))}
          </ul>
          {study.url ? (
            <Button size="sm" href={study.url} external onClick={onVisit}>
              <span>{labels.visit}</span>
              <ArrowUpRight size={14} />
            </Button>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default CaseDetail;
