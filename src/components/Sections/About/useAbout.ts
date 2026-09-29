import { useRef } from 'react';
import useReveal from '@/hooks/useReveal';

const useAbout = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return { ref };
};

export default useAbout;
