'use client';

import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useDictionary } from '@/context/DictionaryContext';

const GITHUB_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LINKEDIN_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const contactRows = [
  {
    key: 'email',
    Icon: <Mail size={20} />,
    label: 'email',
    value: 'jbastidas@theempire.tech',
    href: 'mailto:jbastidas@theempire.tech?subject=Project%20inquiry%20%E2%80%94%20decode9',
    external: false,
  },
  {
    key: 'github',
    Icon: GITHUB_SVG,
    label: 'github',
    value: 'github.com/decode9',
    href: 'https://github.com/decode9',
    external: true,
  },
  {
    key: 'linkedin',
    Icon: LINKEDIN_SVG,
    label: 'linkedin',
    value: 'linkedin.com/in/decode9',
    href: 'https://www.linkedin.com/in/decode9/',
    external: true,
  },
] as const;

export function Contact() {
  const { dictionary } = useDictionary();
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true });
  const d = dictionary.contact;

  return (
    <section
      id="contact"
      className="d9-section d9-section-alt"
      aria-labelledby="contact-title"
    >
      <div className="d9-container" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="d9-eyebrow">{d.eyebrow}</span>
            <h2 id="contact-title" className="d9-h1 mb-5">{d.title}</h2>
            <p className="d9-body-lg mb-8">{d.sub}</p>
            <a
              href="mailto:jbastidas@theempire.tech?subject=Project%20inquiry%20%E2%80%94%20decode9"
              className="d9-btn d9-btn--energy d9-notch-tr d9-btn--lg inline-flex items-center gap-2"
            >
              <span>{dictionary.cta.emailme}</span>
              <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* Contact rows */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {contactRows.map(({ key, Icon, label, value, href, external }) => (
              <a
                key={key}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="d9-card d9-card--hover flex items-center gap-4 px-5 py-4 group"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-sm bg-ink-700 text-ink-300 group-hover:text-ink-100 transition-colors flex-shrink-0">
                  {Icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="d9-mono-label block">{label}</span>
                  <span className="d9-label text-[14px]">{value}</span>
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-ink-600 group-hover:text-ink-300 transition-colors flex-shrink-0"
                />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
