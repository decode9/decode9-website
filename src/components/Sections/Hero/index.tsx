'use client';

import { MapPin, Globe, CalendarCheck, ArrowRight, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDictionary } from '@/context/DictionaryContext';
import { useScrollAnimation } from '@/hooks';

export function Hero() {
  const { dictionary } = useDictionary();
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true });
  const d = dictionary.hero;
  const con = d.console;

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.5, delay, ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number] },
  });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/brand/bg-hero-dark.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ink-950/70" aria-hidden="true" />

      <div className="d9-container-wide relative z-10 py-32" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div>
            {/* Availability pill */}
            <motion.div {...fadeUp(0)}>
              <span className="d9-pill">
                <span className="d9-pill__dot d9-pill__dot--live" aria-hidden="true" />
                {d.pill}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-title"
              className="d9-display-lg mb-6"
              {...fadeUp(0.08)}
              dangerouslySetInnerHTML={{ __html: d.title }}
            />

            {/* Sub */}
            <motion.p className="d9-body-lg mb-10 max-w-xl" {...fadeUp(0.14)}>
              {d.sub}
            </motion.p>

            {/* CTAs */}
            <motion.div className="flex flex-wrap items-center gap-4 mb-10" {...fadeUp(0.2)}>
              <a
                href="mailto:jbastidas@theempire.tech?subject=Project%20inquiry%20%E2%80%94%20decode9"
                className="d9-btn d9-btn--energy d9-notch-tr d9-btn--lg inline-flex items-center gap-2"
              >
                <span>{d.cta1}</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="#work"
                className="d9-btn d9-btn--outline d9-btn--lg inline-flex items-center gap-2"
              >
                <LayoutGrid size={16} />
                <span>{d.cta2}</span>
              </a>
            </motion.div>

            {/* Meta badges */}
            <motion.div className="flex flex-wrap gap-x-6 gap-y-2" {...fadeUp(0.26)}>
              {([
                [MapPin, d.meta1],
                [Globe, d.meta2],
                [CalendarCheck, d.meta3],
              ] as Array<[React.ElementType, string]>).map(([Icon, label]) => (
                <span key={label} className="flex items-center gap-1.5 text-ink-400 text-sm">
                  <Icon size={14} className="flex-shrink-0" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Console panel */}
          <motion.div {...fadeUp(0.1)} className="hidden lg:block">
            <div
              className="d9-notch-tr-lg bg-ink-900 border border-ink-700 overflow-hidden"
              role="img"
              aria-label="decode9 build console"
            >
              {/* Bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700 bg-ink-800">
                <span className="w-3 h-3 rounded-full bg-ink-600" />
                <span className="w-3 h-3 rounded-full bg-ink-600" />
                <span className="w-3 h-3 rounded-full bg-ink-600" />
                <span className="d9-mono-label ml-2 flex-1">{con.title}</span>
                <span className="d9-badge d9-badge--brand d9-badge--dot text-[11px]">live</span>
              </div>

              <div className="p-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b border-ink-800">
                  {([
                    [con.uptime, '99.9%'],
                    [con.services, '12'],
                    [con.deploy, '3.4s'],
                  ] as Array<[string, string]>).map(([label, val]) => (
                    <div key={label}>
                      <span className="d9-mono-label block mb-1">{label}</span>
                      <span className="d9-data">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Code lines */}
                <div className="mb-5 space-y-1 font-code text-[13px] leading-6" aria-hidden="true">
                  <div>
                    <span className="d9s-c-mut">$</span>{' '}
                    <span className="d9s-c-fn">decode9</span> ship{' '}
                    <span className="d9s-c-str">--env production</span>
                  </div>
                  <div>
                    <span className="d9s-c-key">›</span> build{' '}
                    <span className="d9s-c-str">ok</span>{' '}
                    <span className="d9s-c-mut">·</span> tests{' '}
                    <span className="d9s-c-str">passed</span>{' '}
                    <span className="d9s-c-mut">·</span> scan{' '}
                    <span className="d9s-c-str">clean</span>
                  </div>
                  <div>
                    <span className="d9s-c-key">›</span> rollout{' '}
                    <span className="d9s-c-mut">k8s/api</span>{' '}
                    <span className="d9s-c-str">100%</span>
                  </div>
                  <div className="d9s-c-mut"># shipped without drama</div>
                </div>

                {/* Service status rows */}
                <div className="space-y-2">
                  {([
                    [con.svc1, con.status1, 'success'],
                    [con.svc2, con.status2, 'success'],
                    [con.svc3, con.status3, 'brand'],
                  ] as Array<[string, string, string]>).map(([svc, status, badge]) => (
                    <div
                      key={svc}
                      className="flex items-center justify-between px-3 py-2 rounded-sm bg-ink-800 border border-ink-700"
                    >
                      <span className="font-code text-[12px] text-ink-300">{svc}</span>
                      <span className={`d9-badge d9-badge--${badge} d9-badge--dot text-[11px]`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
