'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { architectureExamples } from '@/data/architecture';
import { cn } from '@/utils';
import { useDictionary } from '@/context/DictionaryContext';
import { CodeBlock } from '@/components/UI/CodeBlock';

export function Architecture() {
  const [activeExample, setActiveExample] = useState(architectureExamples[0]);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { dictionary } = useDictionary();

  const getExampleTranslation = (id: string) => {
    const translations: Record<string, { title: string; description: string }> = {
      'microservices': dictionary.architecture.examples.microservices,
      'clean-architecture': dictionary.architecture.examples.clean,
      'event-driven': dictionary.architecture.examples.event,
      'cqrs': dictionary.architecture.examples.cqrs,
    };
    return translations[id] || { title: activeExample.title, description: activeExample.description };
  };

  return (
    <section id="architecture" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-950" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div ref={ref}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary-400 font-mono text-sm mb-4 block">{dictionary.architecture.tag}</span>
            <h2 className="section-title text-white mb-6">
              {dictionary.architecture.title} <span className="text-gradient">{dictionary.architecture.titleHighlight}</span>
            </h2>
            <p className="section-subtitle mx-auto">
              {dictionary.architecture.subtitle}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Architecture List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              {architectureExamples.map((example) => {
                const translation = getExampleTranslation(example.id);
                return (
                  <button
                    key={example.id}
                    onClick={() => setActiveExample(example)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl transition-all duration-200',
                      activeExample.id === example.id
                        ? 'bg-primary-500/10 border border-primary-500/30'
                        : 'bg-dark-800/50 border border-dark-700 hover:border-dark-600'
                    )}
                  >
                    <h3 className={cn(
                      'font-semibold mb-1 transition-colors',
                      activeExample.id === example.id ? 'text-primary-400' : 'text-white'
                    )}>
                      {translation.title}
                    </h3>
                    <p className="text-dark-400 text-sm line-clamp-2">
                      {translation.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {example.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-dark-700 text-dark-400 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </motion.div>

            {/* Code Display */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExample.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="code-block"
                >
                  {/* Code Header */}
                  <div className="code-header">
                    <div className="code-dot bg-red-500" />
                    <div className="code-dot bg-yellow-500" />
                    <div className="code-dot bg-green-500" />
                    <span className="ml-4 text-dark-400 text-sm font-mono">
                      {activeExample.title.toLowerCase().replace(/\s+/g, '-')}.ts
                    </span>
                  </div>

                  {/* Code Content */}
                  <div className="max-h-[500px] overflow-auto">
                    <CodeBlock
                      code={activeExample.code || '// No code available'}
                      language={activeExample.language || 'typescript'}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 glass-card"
              >
                <h4 className="text-white font-semibold mb-2">{dictionary.architecture.description}</h4>
                <p className="text-dark-400 leading-relaxed">
                  {getExampleTranslation(activeExample.id).description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {activeExample.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tech-badge"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
