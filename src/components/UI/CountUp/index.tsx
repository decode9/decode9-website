'use client';

import type { CountUpProps } from './interface';
import useCountUp from './useCountUp';

const CountUp = ({ value, suffix = '', className }: CountUpProps) => {
  const ref = useCountUp(value, suffix);
  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
};

export default CountUp;
