import { useEffect, useRef, useState } from 'react';

/** Scroll speed of the ticker: ~55 px/s, never faster than a 30 s loop (as the original). */
const useNewsTicker = (key: string) => {
  const runRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState('38s');
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const w = (runRef.current?.scrollWidth ?? 0) / 2;
      setDuration(`${Math.max(30, w / 55).toFixed(0)}s`);
    });
    return () => cancelAnimationFrame(raf);
  }, [key]);
  return { runRef, duration };
};

export default useNewsTicker;
