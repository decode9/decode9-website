'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { technologies } from '@/data/technologies';
import { cn } from '@/utils';
import { useDictionary } from '@/context/DictionaryContext';
import {
  SiTypescript, SiJavascript, SiPython, SiOpenjdk, SiCsharp, SiPhp,
  SiReact, SiNextdotjs, SiTailwindcss, SiGraphql,
  SiNodedotjs, SiExpress, SiNestjs,
  SiPostgresql, SiMongodb, SiMysql, SiRedis, SiSqlite,
  SiDocker, SiKubernetes, SiAmazonwebservices, SiDigitalocean, SiGithubactions, SiJenkins,
  SiGit, SiVisualstudiocode, SiFigma, SiLinux
} from 'react-icons/si';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  SiTypescript, SiJavascript, SiPython, SiOpenjdk, SiCsharp, SiPhp,
  SiReact, SiNextdotjs, SiTailwindcss, SiGraphql,
  SiNodedotjs, SiExpress, SiNestjs,
  SiPostgresql, SiMongodb, SiMysql, SiRedis, SiSqlite,
  SiDocker, SiKubernetes, SiAmazonwebservices, SiDigitalocean, SiGithubactions, SiJenkins,
  SiGit, SiVisualstudiocode, SiFigma, SiLinux,
  SiGrpc: SiGraphql,
};

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { dictionary } = useDictionary();

  const techCategories = [
    { id: 'all', label: dictionary.tech.categories.all },
    { id: 'language', label: dictionary.tech.categories.language },
    { id: 'frontend', label: dictionary.tech.categories.frontend },
    { id: 'backend', label: dictionary.tech.categories.backend },
    { id: 'database', label: dictionary.tech.categories.database },
    { id: 'devops', label: dictionary.tech.categories.devops },
    { id: 'tools', label: dictionary.tech.categories.tools },
  ];

  const filteredTech = activeCategory === 'all'
    ? technologies
    : technologies.filter((tech) => tech.category === activeCategory);

  const getProficiencyLabel = (proficiency: string) => {
    return dictionary.tech.proficiency[proficiency as keyof typeof dictionary.tech.proficiency] || proficiency;
  };

  return (
    <section id="tech" className="py-32 relative overflow-hidden">
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
            <span className="text-primary-400 font-mono text-sm mb-4 block">{dictionary.tech.tag}</span>
            <h2 className="section-title text-white mb-6">
              {dictionary.tech.title} <span className="text-gradient">{dictionary.tech.titleHighlight}</span>
            </h2>
            <p className="section-subtitle mx-auto">
              {dictionary.tech.subtitle}
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {techCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  activeCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700'
                )}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Tech Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredTech.map((tech, index) => {
                const IconComponent = iconMap[tech.icon];
                
                return (
                  <motion.div
                    key={tech.name}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="glass-card !p-4 group cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      {IconComponent && (
                        <IconComponent
                          className="w-10 h-10 mb-3 transition-all duration-300 group-hover:scale-110"
                          style={{ color: tech.color }}
                        />
                      )}
                      <span className="text-white font-medium text-sm mb-1">{tech.name}</span>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        tech.proficiency === 'expert' && 'bg-emerald-500/20 text-emerald-400',
                        tech.proficiency === 'advanced' && 'bg-blue-500/20 text-blue-400',
                        tech.proficiency === 'intermediate' && 'bg-amber-500/20 text-amber-400',
                      )}>
                        {getProficiencyLabel(tech.proficiency)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-dark-400">
              {dictionary.tech.footer.replace(/<highlight>([^<]+)<\/highlight>/g, '')}
              <span className="text-primary-400"> {dictionary.tech.footer.match(/<highlight>([^<]+)<\/highlight>/)?.[1]}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
