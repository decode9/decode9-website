'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Dictionary, Locale } from '@/i18n';

interface DictionaryContextValue {
  dictionary: Dictionary;
  locale: Locale;
}

interface DictionaryProviderProps extends DictionaryContextValue {
  children: ReactNode;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export const DictionaryProvider = ({ children, dictionary, locale }: DictionaryProviderProps) => {
  const value = useMemo(() => ({ dictionary, locale }), [dictionary, locale]);
  return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>;
};

export const useDictionary = (): DictionaryContextValue => {
  const context = useContext(DictionaryContext);
  if (!context) throw new Error('useDictionary must be used within a DictionaryProvider');
  return context;
};
