'use client';

import {
  Layers,
  Rocket,
  Workflow,
  Share2,
  Sparkles,
  Server,
  Compass,
  Gauge,
  Target,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useDictionary } from '@/context/DictionaryContext';
import { NotchCard } from '@/components/UI/NotchCard';
import { services } from '@/data/services';

const iconMap: Record<string, React.ElementType> = {
  Layers,
  Rocket,
  Workflow,
  Share2,
  Sparkles,
  Server,
  Compass,
  Gauge,
};

const svcKeys = [
  'fullstack',
  'mvp',
  'auto',
  'arch',
  'ai',
  'devops',
  'consult',
  'proc',
] as const;

type SvcKey = typeof svcKeys[number];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Services() {
  const { dictionary } = useDictionary();
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true });
  const d = dictionary.svc;

  return (
    <section id="services" className="d9-section d9-section-alt" aria-labelledby="svc-title">
      <div className="d9-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="d9-head"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="d9-eyebrow">{d.eyebrow}</span>
          <h2 id="svc-title" className="d9-h1 mb-4">{d.title}</h2>
          <p className="d9-body-lg">{d.sub}</p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
        >
          {services.map((svc, idx) => {
            const svcKey = svcKeys[idx] as SvcKey;
            const svcData = d[svcKey] as { t: string; d: string; out: string };
            const Icon = iconMap[svc.icon] ?? Layers;

            return (
              <motion.article key={svc.id} variants={item}>
                <NotchCard variant="service" hover className="p-5 h-full flex flex-col gap-4">
                  {/* Icon */}
                  <span className="d9-notch-tr inline-flex items-center justify-center w-10 h-10 bg-ink-700">
                    <Icon size={18} className="text-ink-200" />
                  </span>

                  <div className="flex-1">
                    <h3 className="d9-h4 mb-2">{svcData.t}</h3>
                    <p className="d9-body text-[14px] text-ink-400 mb-4">{svcData.d}</p>
                  </div>

                  {/* Outcome */}
                  <p className="flex items-start gap-2 text-[13px] text-ink-400 border-t border-ink-700 pt-3">
                    <Target size={13} className="flex-shrink-0 mt-0.5 text-ink-500" />
                    <span>{svcData.out}</span>
                  </p>

                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {svc.techChips.map((chip) => (
                      <span key={chip} className="d9-tech-chip">{chip}</span>
                    ))}
                  </div>
                </NotchCard>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
