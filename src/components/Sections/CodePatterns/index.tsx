'use client';

import { Filter, RefreshCw, Zap, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useDictionary } from '@/context/DictionaryContext';
import { NotchCard } from '@/components/UI/NotchCard';
import { CodeBlock } from '@/components/UI/CodeBlock';
import {
  debounceSnippet,
  fetchRetrySnippet,
  optimisticUpdateSnippet,
  cancelableSearchSnippet,
} from '@/data/codeSnippets';

const patterns = [
  { key: 'c1', Icon: Filter,    lang: 'TypeScript', code: debounceSnippet },
  { key: 'c2', Icon: RefreshCw, lang: 'TypeScript', code: fetchRetrySnippet },
  { key: 'c3', Icon: Zap,       lang: 'TypeScript', code: optimisticUpdateSnippet },
  { key: 'c4', Icon: Ban,       lang: 'TypeScript', code: cancelableSearchSnippet },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function CodePatterns() {
  const { dictionary } = useDictionary();
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true });
  const d = dictionary.code;

  return (
    <section id="patterns" className="d9-section" aria-labelledby="code-title">
      <div className="d9-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="d9-head"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="d9-eyebrow">{d.eyebrow}</span>
          <h2 id="code-title" className="d9-h1 mb-4">{d.title}</h2>
          <p className="d9-body-lg">{d.sub}</p>
        </motion.div>

        {/* Pattern cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-5"
          variants={container}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
        >
          {patterns.map(({ key, Icon, lang, code }) => {
            const cardData = d[key] as { t: string; d: string };

            return (
              <motion.article key={key} variants={item} className="min-w-0">
                <NotchCard variant="code" className="overflow-hidden p-0">
                  {/* Card header */}
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-ink-700 bg-ink-800">
                    <span className="w-8 h-8 flex items-center justify-center rounded-sm bg-ink-700 text-ink-300">
                      <Icon size={15} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="d9-h4 text-[14px] leading-tight">{cardData.t}</h3>
                      <p className="d9-caption text-[12px]">{cardData.d}</p>
                    </div>
                    <span className="font-label text-[11px] text-ink-500 uppercase tracking-widest flex-shrink-0">
                      {lang}
                    </span>
                  </div>

                  {/* Code */}
                  <div style={{ background: 'var(--ink-950)' }} className="font-code">
                    <CodeBlock code={code} language="typescript" showLineNumbers={false} />
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
