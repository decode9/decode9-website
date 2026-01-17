'use client';

import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useDictionary } from '@/context/DictionaryContext';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/decode9', icon: FaGithub },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/decode9', icon: FaLinkedin },
  { name: 'Email', url: 'mailto:jbastidas@theempire.tech', icon: FaEnvelope },
];

export function Contact() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { dictionary } = useDictionary();

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: dictionary.contact.info.email,
      value: 'jbastidas@theempire.tech',
      href: 'mailto:jbastidas@theempire.tech',
    },
    {
      icon: FaMapMarkerAlt,
      label: dictionary.contact.info.location,
      value: 'Argentina',
      href: null,
    },
    {
      icon: FaGithub,
      label: dictionary.contact.info.github,
      value: '@decode9',
      href: 'https://github.com/decode9',
    },
    {
      icon: FaLinkedin,
      label: dictionary.contact.info.linkedin,
      value: '/in/decode9',
      href: 'https://linkedin.com/in/decode9',
    },
  ];

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-950" />
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div ref={ref}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary-400 font-mono text-sm mb-4 block">{dictionary.contact.tag}</span>
            <h2 className="section-title text-white mb-6">
              {dictionary.contact.title} <span className="text-gradient">{dictionary.contact.titleHighlight}</span>
            </h2>
            <p className="section-subtitle mx-auto">
              {dictionary.contact.subtitle}
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <p className="text-dark-400 mb-8 leading-relaxed text-lg">
                {dictionary.contact.description}
              </p>

              {/* Email CTA */}
              <motion.a
                href="mailto:jbastidas@theempire.tech"
                className="btn-primary text-lg px-8 py-4 mb-12 inline-flex"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope className="w-5 h-5" />
                jbastidas@theempire.tech
              </motion.a>
            </motion.div>

            {/* Contact Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid sm:grid-cols-2 gap-4 mb-12"
            >
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="glass-card flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-primary-400 flex-shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-dark-500 text-sm block">{item.label}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-white hover:text-primary-400 transition-colors font-medium"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-white font-medium">{item.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <p className="text-dark-500 mb-6">{dictionary.contact.findMe}</p>
              <div className="flex items-center justify-center gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-dark-400 hover:text-white hover:bg-primary-500 transition-all duration-200"
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12"
            >
              <div className="glass-card text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-white font-medium">{dictionary.contact.available}</span>
                </div>
                <p className="text-dark-400 text-sm">
                  {dictionary.contact.availableDescription}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
