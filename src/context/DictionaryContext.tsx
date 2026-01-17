'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n';

interface DictionaryContextType {
  dictionary: Dictionary;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const DictionaryContext = createContext<DictionaryContextType | null>(null);

export function DictionaryProvider({
  children,
  dictionary,
  locale,
  setLocale,
}: {
  children: ReactNode;
  dictionary: Dictionary;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  return (
    <DictionaryContext.Provider value={{ dictionary, locale, setLocale }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}
