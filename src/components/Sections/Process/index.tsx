'use client';

import ChapterHeading from '@/components/UI/ChapterHeading';
import ChapterSection from '@/components/UI/ChapterSection';
import { useDictionary } from '@/context/DictionaryContext';
import { processSteps } from '@/data/process';
import ProcessStepItem from './components/ProcessStepItem';
import useProcess from './useProcess';

const Process = () => {
  const { dictionary } = useDictionary();
  const { scopeRef, stepsRef } = useProcess();
  const process = dictionary.process;

  return (
    <ChapterSection
      id="process"
      code="06"
      label={dictionary.nav.chapters.process}
      labelledBy="process-title"
      layout="wide"
    >
      <div
        ref={scopeRef}
        className="d9-container-wide h:flex h:w-max h:max-w-none h:items-center h:gap-16 h:px-[max(24px,5vw)]"
      >
        <div className="h:w-[420px] h:flex-none">
          <ChapterHeading id="process-title" eyebrow={process.eyebrow} title={process.title} sub={process.sub} />
        </div>
        <div ref={stepsRef} className="relative h:w-[1380px] h:flex-none">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[8%] right-[8%] top-[27px] hidden h-[2px] w-[84%] lg:block"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <line
              data-process-line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="var(--accent)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <ol className="grid gap-8 lg:grid-cols-6 lg:gap-4">
            {processSteps.map(({ phase, step }) => (
              <ProcessStepItem
                key={phase}
                step={step}
                title={process.steps[phase].t}
                description={process.steps[phase].d}
              />
            ))}
          </ol>
        </div>
      </div>
    </ChapterSection>
  );
};

export default Process;
