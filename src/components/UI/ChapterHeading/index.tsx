'use client';

import type { RefObject } from 'react';
import ScrambleText from '@/components/UI/ScrambleText';
import { cn } from '@/utils/cn';
import type { ChapterHeadingProps } from './interface';
import useChapterHeading from './useChapterHeading';

const ChapterHeading = ({ id, eyebrow, title, sub, align = 'left' }: ChapterHeadingProps) => {
  const ref = useChapterHeading();

  return (
    <header ref={ref as RefObject<HTMLElement>} className={align === 'center' ? 'd9-head-center' : 'd9-head'}>
      <ScrambleText
        text={eyebrow}
        className={cn('d9-eyebrow', align === 'center' && 'justify-center')}
        duration={0.9}
      />
      <h2 id={id} className="d9-h1 mb-4" data-heading-title>
        {title}
      </h2>
      {sub ? (
        <p className="d9-body-lg" data-heading-sub>
          {sub}
        </p>
      ) : null}
    </header>
  );
};

export default ChapterHeading;
