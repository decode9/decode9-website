'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { getYearsOfExperience } from '@/utils';
import { useDictionary } from '@/context/DictionaryContext';

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/25024663?v=4';

export function About() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { dictionary } = useDictionary();

  const stats = [
    { value: getYearsOfExperience(2014), label: dictionary.about.stats.years, suffix: '+' },
    { value: 41, label: dictionary.about.stats.repos, suffix: '' },
    { value: 50, label: dictionary.about.stats.projects, suffix: '+' },
    { value: 100, label: dictionary.about.stats.satisfaction, suffix: '%' },
  ];

  const highlights = [
    {
      title: dictionary.about.highlights.fullstack.title,
      description: dictionary.about.highlights.fullstack.description,
      icon: '🚀',
    },
    {
      title: dictionary.about.highlights.architecture.title,
      description: dictionary.about.highlights.architecture.description,
      icon: '🏗️',
    },
    {
      title: dictionary.about.highlights.devops.title,
      description: dictionary.about.highlights.devops.description,
      icon: '☁️',
    },
    {
      title: dictionary.about.highlights.automation.title,
      description: dictionary.about.highlights.automation.description,
      icon: '⚡',
    },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div ref={ref}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-primary-400 font-mono text-sm mb-4 block">{dictionary.about.tag}</span>
            <h2 className="section-title text-white mb-6">
              {dictionary.about.title} <span className="text-gradient">{dictionary.about.titleHighlight}</span>
            </h2>
            <p className="section-subtitle mx-auto">
              {dictionary.about.subtitle}
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Profile Image for mobile */}
              <div className="lg:hidden mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-purple rounded-2xl blur-xl opacity-30" />
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-dark-700">
                    <Image
                      src={GITHUB_AVATAR}
                      alt="Jorge Bastidas - decode9"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-dark-300 leading-relaxed mb-6">
                  <span className="text-white font-semibold">Jorge Bastidas</span>,{' '}
                  <span className="text-primary-400 font-mono">decode9</span>.{' '}
                  {dictionary.about.intro.replace(/<[^>]+>[^<]+<\/[^>]+>/g, '')}
                </p>
                <p className="text-dark-400 leading-relaxed mb-6">
                  {dictionary.about.paragraph1.replace(/<[^>]+>[^<]+<\/[^>]+>/g, '')}
                </p>
                <p className="text-dark-400 leading-relaxed mb-8">
                  {dictionary.about.paragraph2}
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card !p-4">
                  <span className="text-dark-500 text-sm">{dictionary.about.location}</span>
                  <p className="text-white font-medium">{dictionary.about.locationValue}</p>
                </div>
                <div className="glass-card !p-4">
                  <span className="text-dark-500 text-sm">{dictionary.about.languages}</span>
                  <p className="text-white font-medium">{dictionary.about.languagesValue}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Image + Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Profile Image for desktop */}
              <div className="hidden lg:block mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-accent-purple to-accent-cyan rounded-2xl blur-2xl opacity-30" />
                  <div className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-dark-700 shadow-2xl">
                    <Image
                      src={GITHUB_AVATAR}
                      alt="Jorge Bastidas - decode9"
                      fill
                      className="object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
                    {/* Name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-display font-bold text-xl">Jorge Bastidas</p>
                      <p className="text-primary-400 font-mono text-sm">@decode9</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights Grid */}
              <div className="grid grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="glass-card group"
                  >
                    <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-dark-400 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="text-center glass-card"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
