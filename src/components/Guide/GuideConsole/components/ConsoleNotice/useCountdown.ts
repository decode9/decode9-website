import { useEffect, useState } from 'react';

/** Milliseconds left until `until`, ticking every second. */
const useCountdown = (until: number | null): number => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until === null) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [until]);

  return until === null ? 0 : Math.max(0, until - now);
};

export default useCountdown;
