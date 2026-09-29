import { useEffect, useState } from 'react';
import { formatCountdown } from '@/utils/format';

/** Session timecode shown in the HUD. */
const useHud = (): { elapsed: string } => {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => setElapsedMs(Date.now() - started), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return { elapsed: formatCountdown(elapsedMs) };
};

export default useHud;
