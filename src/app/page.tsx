'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import {
  Hero,
  TrustStrip,
  About,
  Services,
  TechStack,
  CodePatterns,
  Work,
  Process,
  CTASection,
  Contact,
} from '@/components/Sections';
import { DictionaryProvider } from '@/context/DictionaryContext';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n';

import enDict from '@/i18n/dictionaries/en.json';
import esDict from '@/i18n/dictionaries/es.json';

const dictionaries: Record<Locale, Dictionary> = {
  en: enDict as Dictionary,
  es: esDict as Dictionary,
};

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  const cookieLocale = document.cookie
    .split('; ')
    .find(row => row.startsWith('NEXT_LOCALE='))
    ?.split('=')[1];

  if (cookieLocale === 'en' || cookieLocale === 'es') return cookieLocale;

  const browserLang = navigator.language.substring(0, 2);
  if (browserLang === 'es') return 'es';

  return 'en';
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en');
  const [dictionary, setDictionary] = useState<Dictionary>(enDict as Dictionary);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const detectedLocale = getInitialLocale();
    setLocale(detectedLocale);
    setDictionary(dictionaries[detectedLocale]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    setDictionary(dictionaries[locale]);
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    document.documentElement.lang = locale;
  }, [locale]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--brand-red)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <DictionaryProvider dictionary={dictionary} locale={locale} setLocale={setLocale}>
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        <TechStack />
        <CodePatterns />
        <Work />
        <Process />
        <CTASection />
        <Contact />
      </main>
      <Footer />
    </DictionaryProvider>
  );
}
