import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** `false` during prerender; follows the OS setting live in the browser. */
const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
};

export default useReducedMotion;
