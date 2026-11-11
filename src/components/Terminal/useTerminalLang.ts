'use client';

import { useCallback, useEffect, useState } from 'react';
import type { KeyValueStorage } from '@/interfaces/storage';
import type { Bilingual, TerminalLang } from '@/interfaces/terminal';
import { TERMINAL_STORAGE } from '@/data/terminal/config';

/** ES/EN of the terminal, persisted in d9crt-lang. `pick` resolves a pair for attributes (aria-label…). */
const useTerminalLang = (storage: KeyValueStorage) => {
  const [lang, setLangState] = useState<TerminalLang>('es');
  useEffect(() => {
    const saved = storage.get(TERMINAL_STORAGE.lang);
    if (saved === 'en' || saved === 'es') setLangState(saved);
  }, [storage]);
  const setLang = useCallback(
    (next: TerminalLang) => {
      setLangState(next);
      storage.set(TERMINAL_STORAGE.lang, next);
    },
    [storage],
  );
  const pick = useCallback((pair: Bilingual) => pair[lang === 'en' ? 1 : 0], [lang]);
  return { lang, setLang, pick };
};

export default useTerminalLang;
