'use client';

import type { RefObject } from 'react';
import type { ScrambleTextProps } from './interface';
import useScrambleText from './useScrambleText';

const ScrambleText = ({
  text,
  as: Tag = 'span',
  className,
  trigger = 'view',
  delay = 0,
  duration = 1,
}: ScrambleTextProps) => {
  const ref = useScrambleText({ text, trigger, delay, duration });
  return (
    <Tag ref={ref as RefObject<never>} className={className}>
      {text}
    </Tag>
  );
};

export default ScrambleText;
