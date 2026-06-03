'use client';

import {
  Code2,
  LayoutDashboard,
  ServerCog,
  Database,
  Cloud,
  GitBranch,
  Bot,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useDictionary } from '@/context/DictionaryContext';

const stackCategories = [
  {
    key: 'lang',
    Icon: Code2,
    tags: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'PHP'],
  },
  {
    key: 'front',
    Icon: LayoutDashboard,
    tags: ['React', 'Angular', 'React Native', 'GraphQL'],
  },
  {
    key: 'back',
    Icon: ServerCog,
    tags: ['Node.js', 'REST', 'gRPC', 'Microservices'],
  },
  {
    key: 'db',
    Icon: Database,
    tags: ['MySQL', 'MSSQL', 'MongoDB', 'SQLite'],
  },
  {
    key: 'cloud',
    Icon: Cloud,
    tags: ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean'],
  },
  {
    key: 'devops',
    Icon: GitBranch,
    tags: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'SonarQube', 'Ubuntu'],
  },
  {
    key: 'ai',
    Icon: Bot,
    tags: ['MCP', 'AI agents', 'n8n'],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function TechStack() {
  const { dictionary } = useDictionary();
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true });
  const d = dictionary.stack;

  return (
    <section id="stack" className="d9-section" aria-labelledby="stack-title">
      <div className="d9-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="d9-head"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="d9-eyebrow">{d.eyebrow}</span>
          <h2 id="stack-title" className="d9-h1 mb-4">{d.title}</h2>
          <p className="d9-body-lg">{d.sub}</p>
        </motion.div>

        {/* Category cards grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
        >
          {stackCategories.map(({ key, Icon, tags }) => (
            <motion.article
              key={key}
              variants={item}
              className="d9-card p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-sm bg-ink-700 text-ink-300">
                  <Icon size={16} />
                </span>
                <h3 className="d9-h4 text-[15px]">
                  {d.cat[key as keyof typeof d.cat]}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="d9-tag text-[12px] py-0.5 px-2.5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
