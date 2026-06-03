'use client';

import Image from 'next/image';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks';
import { useDictionary } from '@/context/DictionaryContext';

export function CTASection() {
  const { dictionary } = useDictionary();
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true });
  const d = dictionary.cta;

  return (
    <section
      className="relative py-28 overflow-hidden"
      aria-labelledby="cta-title"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/brand/bg-hero-dark.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ink-950/75" aria-hidden="true" />

      <div className="d9-container relative z-10 flex flex-col items-center text-center" ref={ref}>
        {/* Isotype watermark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Image
            src="/brand/decode9-isotype.png"
            alt=""
            width={80}
            height={80}
            aria-hidden="true"
          />
        </motion.div>

        {/* Headline */}
        <motion.h2
          id="cta-title"
          className="d9-h1 max-w-2xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          dangerouslySetInnerHTML={{ __html: d.title }}
        />

        {/* Sub */}
        <motion.p
          className="d9-body-lg max-w-xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          {d.sub}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <a
            href="mailto:jbastidas@theempire.tech?subject=Project%20inquiry%20%E2%80%94%20decode9"
            className="d9-btn d9-btn--energy d9-notch-tr d9-btn--lg inline-flex items-center gap-2"
          >
            <span>{d.start}</span>
            <ArrowRight size={18} />
          </a>
          <a
            href="#work"
            className="d9-btn d9-btn--secondary d9-btn--lg inline-flex items-center gap-2"
          >
            <LayoutGrid size={16} />
            <span>{d.seework}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
