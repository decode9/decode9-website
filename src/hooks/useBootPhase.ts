import { useEffect, useState } from 'react';
import { useBootSequence } from '@/context/SceneContext';
import type { BootPhase } from '@/lib/scene/createBootSequence';

/** Re-renders when the preloader hands over to the tour. */
const useBootPhase = (): BootPhase => {
  const boot = useBootSequence();
  const [phase, setPhase] = useState<BootPhase>(boot.get().phase);

  useEffect(() => {
    setPhase(boot.get().phase);
    return boot.subscribe((state) => setPhase(state.phase));
  }, [boot]);

  return phase;
};

export default useBootPhase;
