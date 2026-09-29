import { useRef } from 'react';
import useReveal from '@/hooks/useReveal';

const useLab = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { vertical: 'top 85%' });
  return { ref };
};

export default useLab;
