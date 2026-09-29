'use client';

import type { RefObject } from 'react';
import { ArrowRight, CalendarCheck, Globe, MapPin, Play } from 'lucide-react';
import Button from '@/components/UI/Button';
import ScrambleText from '@/components/UI/ScrambleText';
import { useDictionary } from '@/context/DictionaryContext';
import { CONTACT } from '@/data/contact';
import ScrollCue from './components/ScrollCue';
import useHero from './useHero';

const META_ICONS = [MapPin, Globe, CalendarCheck];

const Hero = () => {
  const { dictionary } = useDictionary();
  const { ref, startTour, workWithMe } = useHero();
  const hero = dictionary.hero;

  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      id="handshake"
      data-chapter="handshake"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden h:h-full h:w-screen h:flex-none"
    >
      <div className="d9-container-wide relative z-10 pb-24 pt-32 h:pb-10 h:pt-[var(--header-h)]" data-hero-content>
        <div className="max-w-[680px]">
          <span className="d9-pill mb-7" data-hero-in>
            <span className="d9-pill__dot d9-pill__dot--live" aria-hidden="true" />
            {hero.pill}
          </span>

          <h1 id="hero-title" className="d9-display-lg mb-6">
            {hero.titleLead}{' '}
            <ScrambleText
              text={hero.titleAccent}
              trigger="mount"
              delay={0.6}
              duration={1.4}
              className="d9-text-energy"
            />
          </h1>

          {/* Visible from the first paint: it's the LCP element on most screens. */}
          <p className="d9-body-lg mb-10 max-w-xl">{hero.sub}</p>

          <div className="mb-10 flex flex-wrap items-center gap-4" data-hero-in>
            <Button href={CONTACT.mailto} size="lg" onClick={workWithMe}>
              <span>{hero.cta1}</span>
              <ArrowRight size={18} />
            </Button>
            <Button variant="outline" size="lg" onClick={startTour}>
              <Play size={15} />
              <span>{hero.cta2}</span>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2" data-hero-in>
            {hero.meta.map((label, index) => {
              const Icon = META_ICONS[index] ?? MapPin;
              return (
                <li key={label} className="flex items-center gap-1.5 text-sm text-ink-400">
                  <Icon size={14} className="flex-shrink-0" aria-hidden="true" />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <ScrollCue label={dictionary.hud.scroll} onClick={startTour} />
    </section>
  );
};

export default Hero;
