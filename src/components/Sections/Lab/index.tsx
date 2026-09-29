'use client';

import ChapterHeading from '@/components/UI/ChapterHeading';
import ChapterSection from '@/components/UI/ChapterSection';
import { useDictionary } from '@/context/DictionaryContext';
import AgentTrace from './components/AgentTrace';
import AutomationPipeline from './components/AutomationPipeline';
import ResilienceLab from './components/ResilienceLab';
import useLab from './useLab';

const Lab = () => {
  const { dictionary } = useDictionary();
  const { ref } = useLab();
  const lab = dictionary.lab;

  return (
    <ChapterSection
      id="lab"
      code="03"
      label={dictionary.nav.chapters.lab}
      labelledBy="lab-title"
      veil="full"
      layout="wide"
    >
      <div className="d9-container-wide h:flex h:w-max h:max-w-none h:items-center h:gap-10 h:px-[max(24px,5vw)]">
        <div className="h:w-[400px] h:flex-none">
          <ChapterHeading id="lab-title" eyebrow={lab.eyebrow} title={lab.title} sub={lab.sub} />
        </div>
        <div ref={ref} className="flex flex-col gap-5 h:flex-row h:items-center">
          <div data-reveal className="h:w-[860px] h:flex-none">
            <AutomationPipeline copy={lab.pipeline} />
          </div>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] h:flex h:items-stretch">
            <div data-reveal className="h:w-[960px] h:flex-none">
              <ResilienceLab copy={lab.resilience} />
            </div>
            <div data-reveal className="h:w-[400px] h:flex-none">
              <AgentTrace copy={lab.trace} />
            </div>
          </div>
        </div>
      </div>
    </ChapterSection>
  );
};

export default Lab;
