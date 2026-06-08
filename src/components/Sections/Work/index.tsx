'use client';

import { ArrowUpRight, Lock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useDictionary } from '@/context/DictionaryContext';
import { NotchCard } from '@/components/UI/NotchCard';
import { projects } from '@/data/projects';
import { trackEvent } from '@/lib/analytics';

const badgeKeys = ['ecom', 'fin', 'sus', 'ent'] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Work() {
  const { dictionary } = useDictionary();
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true });
  const d = dictionary.work;

  const descKeys = ['yujju', 'finami', 'gg', 'avianca'] as const;

  return (
    <section id="work" className="d9-section d9-section-alt" aria-labelledby="work-title">
      <div className="d9-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="d9-head"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="d9-eyebrow">{d.eyebrow}</span>
          <h2 id="work-title" className="d9-h1 mb-4">{d.title}</h2>
          <p className="d9-body-lg">{d.sub}</p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-5"
          variants={container}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
        >
          {projects.map((project, idx) => {
            const badgeKey = badgeKeys[idx];
            const descKey = descKeys[idx];

            return (
              <motion.article key={project.id} variants={item}>
                <NotchCard
                  variant="project"
                  notchSize="lg"
                  hover
                  className="p-6 h-full flex flex-col gap-4"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <span className="d9-badge d9-badge--brand text-[11px]">
                      {d.badge[badgeKey]}
                    </span>
                    {project.locked ? (
                      <span className="text-ink-600 cursor-default" aria-hidden="true">
                        <Lock size={16} />
                      </span>
                    ) : project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('project_click', { project: project.name })}
                        className="text-ink-400 hover:text-ink-100 transition-colors"
                        aria-label={`Visit ${project.name}`}
                      >
                        <ArrowUpRight size={17} />
                      </a>
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="d9-h3 mb-3">{project.name}</h3>
                    <p className="d9-body text-[14px] text-ink-400 mb-4">
                      {d.desc[descKey]}
                    </p>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-ink-700">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="d9-tech-chip">{tech}</span>
                    ))}
                  </div>
                </NotchCard>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Footer link */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="https://github.com/decode9"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('contact_link_click', { channel: 'github', source: 'work_section' })}
            className="d9-btn d9-btn--secondary inline-flex items-center gap-2"
          >
            <ExternalLink size={16} />
            {d.viewGithub}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
