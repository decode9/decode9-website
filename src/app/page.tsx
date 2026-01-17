'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import {
  Hero,
  About,
  TechStack,
  Projects,
  Architecture,
  CodeProblems,
  Contact,
} from '@/components/Sections';
import { DictionaryProvider } from '@/context/DictionaryContext';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n';

// Import dictionaries directly for client-side use
import enDict from '@/i18n/dictionaries/en.json';
import esDict from '@/i18n/dictionaries/es.json';

const dictionaries: Record<Locale, Dictionary> = {
  en: enDict as Dictionary,
  es: esDict as Dictionary,
};

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  
  // Check cookie first
  const cookieLocale = document.cookie
    .split('; ')
    .find(row => row.startsWith('NEXT_LOCALE='))
    ?.split('=')[1];
  
  if (cookieLocale === 'en' || cookieLocale === 'es') {
    return cookieLocale;
  }
  
  // Check browser language
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
    // Update cookie when locale changes
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    // Update html lang attribute
    document.documentElement.lang = locale;
  }, [locale]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DictionaryProvider dictionary={dictionary} locale={locale} setLocale={setLocale}>
      <Header />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Architecture />
        <CodeProblems />
        <Contact />
      </main>
      <Footer />
    </DictionaryProvider>
  );
}

