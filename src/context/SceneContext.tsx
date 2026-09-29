'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { SceneStore } from '@/interfaces/scene';
import type { BootSequence } from '@/lib/scene/createBootSequence';

interface SceneContextValue {
  store: SceneStore;
  boot: BootSequence;
}

const SceneContext = createContext<SceneContextValue | null>(null);

interface SceneProviderProps extends SceneContextValue {
  children: ReactNode;
}

export const SceneProvider = ({ store, boot, children }: SceneProviderProps) => {
  const value = useMemo(() => ({ store, boot }), [store, boot]);
  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
};

const useSceneContext = (): SceneContextValue => {
  const context = useContext(SceneContext);
  if (!context) throw new Error('Scene hooks must be used within a SceneProvider');
  return context;
};

/** The desired stage state. Writing to it never re-renders React. */
export const useSceneStore = (): SceneStore => useSceneContext().store;

/** Load progress and phase of the visit's opening sequence. */
export const useBootSequence = (): BootSequence => useSceneContext().boot;
