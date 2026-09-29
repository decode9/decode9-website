'use client';

import { DictionaryProvider } from '@/context/DictionaryContext';
import { GuideProvider } from '@/context/GuideContext';
import { SceneProvider } from '@/context/SceneContext';
import { ScrollLayoutProvider } from '@/context/ScrollLayoutContext';
import type { AppProvidersProps } from './interface';
import useAppProviders from './useAppProviders';

const AppProviders = ({ locale, dictionary, children }: AppProvidersProps) => {
  const { agent, scene, boot, navigate, storage } = useAppProviders(dictionary);

  return (
    <DictionaryProvider dictionary={dictionary} locale={locale}>
      <SceneProvider store={scene} boot={boot}>
        <ScrollLayoutProvider>
          <GuideProvider agent={agent} scene={scene} storage={storage} navigate={navigate}>
            {children}
          </GuideProvider>
        </ScrollLayoutProvider>
      </SceneProvider>
    </DictionaryProvider>
  );
};

export default AppProviders;
