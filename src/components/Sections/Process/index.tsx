'use client';

import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useDictionary } from '@/context/DictionaryContext';
import { processSteps } from '@/data/process';

const stepKeys = ['s1', 's2', 's3', 's4', 's5', 's6'] as const;

export function Process() {
  const { dictionary } = useDictionary();
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true });
  const d = dictionary.proc;

  return (
    <section id="process" className="d9-section" aria-labelledby="proc-title">
      <div className="d9-container" ref={ref}>
        {/* Header — centered */}
        <motion.div
          className="d9-head-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="d9-eyebrow justify-center">{d.eyebrow}</span>
          <h2 id="proc-title" className="d9-h1 mb-4">{d.title}</h2>
          <p className="d9-body-lg">{d.sub}</p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-0">
          {/* Horizontal connector line — desktop only */}
          <div
            aria-hidden="true"
            className="absolute hidden lg:block"
            style={{
              top: '27px',
              left: '8%',
              right: '8%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16) 12%, rgba(255,255,255,0.16) 88%, transparent)',
            }}
          />

          {processSteps.map(({ id, step }, idx) => {
            const sk = stepKeys[idx];
            const stepData = d[sk] as { t: string; d: string };
            const delay = idx * 0.07;
            const isFirst = idx === 0;

            return (
              <motion.div
                key={id}
                className="flex flex-col items-center text-center gap-4 px-3"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay }}
              >
                {/* Number badge */}
                <div
                  className="d9-notch-num w-[54px] h-[54px] flex items-center justify-center font-code font-bold text-lg flex-shrink-0 relative z-10"
                  style={
                    isFirst
                      ? {
                          background: 'var(--red-energy)',
                          border: '1px solid var(--brand-red)',
                          color: '#fff',
                        }
                      : {
                          background: 'var(--ink-800)',
                          border: '1px solid rgba(255,255,255,0.16)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                          color: 'var(--ink-50)',
                        }
                  }
                >
                  {String(step).padStart(2, '0')}
                </div>

                <div>
                  <h3 className="d9-h4 mb-2">{stepData.t}</h3>
                  <p className="d9-body text-[13px] text-ink-400 leading-snug">{stepData.d}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
