'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { projects } from '@/data/projects';
import { cn } from '@/utils';
import { useDictionary } from '@/context/DictionaryContext';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { dictionary } = useDictionary();

  const projectCategories = [
    { id: 'all', label: dictionary.projects.categories.all },
    { id: 'web', label: dictionary.projects.categories.web },
    { id: 'mobile', label: dictionary.projects.categories.mobile },
    { id: 'api', label: dictionary.projects.categories.api },
    { id: 'devops', label: dictionary.projects.categories.devops },
    { id: 'automation', label: dictionary.projects.categories.automation },
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((project) => project.category === activeCategory);

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
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
            <span className="text-primary-400 font-mono text-sm mb-4 block">{dictionary.projects.tag}</span>
            <h2 className="section-title text-white mb-6">
              {dictionary.projects.title} <span className="text-gradient">{dictionary.projects.titleHighlight}</span>
            </h2>
            <p className="section-subtitle mx-auto">
              {dictionary.projects.subtitle}
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {projectCategories.map((category) => (
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

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={cn(
                    'glass-card group relative overflow-hidden',
                    project.featured && 'md:col-span-2 lg:col-span-1'
                  )}
                >
                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-medium">
                        {dictionary.projects.featured}
                      </span>
                    </div>
                  )}

                  {/* Project Image Placeholder */}
                  <div className="relative h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-dark-700 to-dark-800">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20">
                        {project.category === 'web' && '🌐'}
                        {project.category === 'mobile' && '📱'}
                        {project.category === 'api' && '⚡'}
                        {project.category === 'devops' && '🐳'}
                        {project.category === 'automation' && '🤖'}
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {project.name}
                      </h3>
                      <span className="text-dark-500 text-sm">{project.year}</span>
                    </div>

                    <p className="text-dark-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded-md bg-dark-800 text-dark-300 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 rounded-md bg-dark-800 text-dark-500 text-xs">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors text-sm"
                        >
                          <FaGithub className="w-4 h-4" />
                          <span>{dictionary.projects.code}</span>
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors text-sm"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                          <span>{dictionary.projects.demo}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* View More */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <a
              href="https://github.com/decode9"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <FaGithub className="w-5 h-5" />
              {dictionary.projects.viewMore}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
