'use client';

import Image from 'next/image';
import { Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useDictionary } from '@/context/DictionaryContext';
import { NotchCard } from '@/components/UI/NotchCard';

export function About() {
  const { dictionary } = useDictionary();
  const { ref: refCopy, isVisible: visibleCopy } = useScrollAnimation({ triggerOnce: true });
  const { ref: refSpec, isVisible: visibleSpec } = useScrollAnimation({ triggerOnce: true });
  const ab = dictionary.about;
  const sp = dictionary.spec;

  const specRows: Array<[string, string, boolean?]> = [
    [sp.k.role, sp.v.role],
    [sp.k.exp, sp.v.exp],
    [sp.k.focus, sp.v.focus],
    [sp.k.loc, sp.v.loc],
    [sp.k.eng, sp.v.eng],
    [sp.k.status, sp.v.status, true],
  ];

  return (
    <section id="about" className="d9-section" aria-labelledby="about-title">
      <div className="d9-container">
        <div className="grid lg:grid-cols-[1fr_340px] gap-16 items-start">
          {/* Bio copy */}
          <div ref={refCopy}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={visibleCopy ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="d9-eyebrow">{ab.eyebrow}</span>
              <h2 id="about-title" className="d9-h1 mb-6">{ab.title}</h2>

              <div className="space-y-5">
                <p
                  className="d9-body-lg"
                  dangerouslySetInnerHTML={{ __html: ab.p1 }}
                />
                <p className="d9-body">{ab.p2}</p>
                <p className="d9-body">{ab.p3}</p>
              </div>

              {/* Signature */}
              <div className="flex items-center gap-4 mt-10">
                <Image
                  src="/brand/decode9-isotype.png"
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden="true"
                />
                <div>
                  <div className="d9-label text-[15px]">Jorge Bastidas</div>
                  <div className="d9-caption">{ab.sig}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Profile spec card */}
          <div ref={refSpec}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={visibleSpec ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <NotchCard variant="spec" className="p-0 overflow-hidden">
                {/* Card header */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700 bg-ink-900">
                  <Terminal size={14} style={{ color: 'var(--brand-red)' }} />
                  <span className="d9-mono-label">profile.json</span>
                </div>

                {/* Spec rows */}
                <div className="divide-y divide-ink-700">
                  {specRows.map(([key, val, isStatus]) => (
                    <div key={key} className="flex items-start gap-4 px-5 py-3">
                      <span className="d9-mono-label w-24 flex-shrink-0 pt-0.5">{key}</span>
                      <span
                        className="d9-body text-[14px] leading-snug"
                        style={isStatus ? { color: 'var(--success-fg)', fontWeight: 500 } : undefined}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </NotchCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
