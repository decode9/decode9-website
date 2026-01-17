'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useScrollAnimation } from '@/hooks';
import { codeProblems } from '@/data/codeProblems';
import { cn } from '@/utils';
import { useDictionary } from '@/context/DictionaryContext';

export function CodeProblems() {
  const [activeProblem, setActiveProblem] = useState(codeProblems[0]);
  const [showSolution, setShowSolution] = useState(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { dictionary } = useDictionary();

  const handleProblemChange = (problem: typeof codeProblems[0]) => {
    setActiveProblem(problem);
    setShowSolution(false);
  };

  const getDifficultyLabel = (difficulty: string) => {
    return dictionary.problems.difficulty[difficulty as keyof typeof dictionary.problems.difficulty] || difficulty;
  };

  return (
    <section id="problems" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div ref={ref}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary-400 font-mono text-sm mb-4 block">{dictionary.problems.tag}</span>
            <h2 className="section-title text-white mb-6">
              {dictionary.problems.title} <span className="text-gradient">{dictionary.problems.titleHighlight}</span>
            </h2>
            <p className="section-subtitle mx-auto">
              {dictionary.problems.subtitle}
            </p>
          </motion.div>

          {/* Problem Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {codeProblems.map((problem) => (
              <button
                key={problem.id}
                onClick={() => handleProblemChange(problem)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                  activeProblem.id === problem.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700'
                )}
              >
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  problem.difficulty === 'easy' && 'bg-emerald-500',
                  problem.difficulty === 'medium' && 'bg-amber-500',
                  problem.difficulty === 'hard' && 'bg-red-500',
                )} />
                {problem.title}
              </button>
            ))}
          </motion.div>

          {/* Problem Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProblem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* Problem Code */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="text-red-500">❌</span>
                    {dictionary.problems.problem}
                  </h3>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    activeProblem.difficulty === 'easy' && 'bg-emerald-500/20 text-emerald-400',
                    activeProblem.difficulty === 'medium' && 'bg-amber-500/20 text-amber-400',
                    activeProblem.difficulty === 'hard' && 'bg-red-500/20 text-red-400',
                  )}>
                    {getDifficultyLabel(activeProblem.difficulty)}
                  </span>
                </div>
                
                <div className="code-block">
                  <div className="code-header">
                    <div className="code-dot bg-red-500" />
                    <div className="code-dot bg-yellow-500" />
                    <div className="code-dot bg-green-500" />
                    <span className="ml-4 text-dark-400 text-sm font-mono">
                      problem.{activeProblem.language}
                    </span>
                  </div>
                  <div className="max-h-[400px] overflow-auto">
                    <SyntaxHighlighter
                      language={activeProblem.language}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.8rem',
                      }}
                      showLineNumbers
                      lineNumberStyle={{
                        color: '#4a5568',
                        paddingRight: '1rem',
                        minWidth: '2.5rem',
                      }}
                    >
                      {activeProblem.problem}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>

              {/* Solution Code */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="text-emerald-500">✅</span>
                    {dictionary.problems.solution}
                  </h3>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="btn-secondary !py-1.5 !px-3 text-sm"
                  >
                    {showSolution ? dictionary.problems.hideSolution : dictionary.problems.showSolution}
                  </button>
                </div>
                
                <div className={cn(
                  'code-block transition-all duration-300',
                  !showSolution && 'blur-sm'
                )}>
                  <div className="code-header">
                    <div className="code-dot bg-red-500" />
                    <div className="code-dot bg-yellow-500" />
                    <div className="code-dot bg-green-500" />
                    <span className="ml-4 text-dark-400 text-sm font-mono">
                      solution.{activeProblem.language}
                    </span>
                  </div>
                  <div className="max-h-[400px] overflow-auto">
                    <SyntaxHighlighter
                      language={activeProblem.language}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.8rem',
                      }}
                      showLineNumbers
                      lineNumberStyle={{
                        color: '#4a5568',
                        paddingRight: '1rem',
                        minWidth: '2.5rem',
                      }}
                    >
                      {activeProblem.solution}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 glass-card"
          >
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span>💡</span>
              {dictionary.problems.explanation}
            </h4>
            <p className="text-dark-300 leading-relaxed mb-4">
              {activeProblem.explanation}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeProblem.tags.map((tag) => (
                <span key={tag} className="tech-badge">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
