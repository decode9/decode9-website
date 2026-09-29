'use client';

import ChapterHeading from '@/components/UI/ChapterHeading';
import ChapterSection from '@/components/UI/ChapterSection';
import { useDictionary } from '@/context/DictionaryContext';
import { services } from '@/data/services';
import ServiceCard from './components/ServiceCard';
import useServices from './useServices';

const Services = () => {
  const { dictionary } = useDictionary();
  const { ref, focusNode } = useServices();
  const capabilities = dictionary.capabilities;

  return (
    <ChapterSection
      id="capabilities"
      code="02"
      label={dictionary.nav.chapters.capabilities}
      labelledBy="capabilities-title"
      layout="wide"
    >
      <div className="d9-container-wide lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-x-10 h:flex h:w-max h:max-w-none h:items-center h:gap-14 h:px-[max(24px,5vw)]">
        <div className="lg:col-start-1 h:w-[420px] h:flex-none">
          <ChapterHeading
            id="capabilities-title"
            eyebrow={capabilities.eyebrow}
            title={capabilities.title}
            sub={capabilities.sub}
          />
        </div>
        <div
          ref={ref}
          className="grid gap-4 sm:grid-cols-2 lg:col-start-1 h:grid-flow-col h:grid-rows-2 h:auto-cols-[290px] h:grid-cols-none"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.key}
              service={service}
              copy={capabilities.services[service.key]}
              index={index}
              outcomeLabel={capabilities.outcome}
              onFocus={focusNode}
            />
          ))}
        </div>
        {/* Open space: the 3D constellation answers to the cards from here. */}
        <div
          aria-hidden="true"
          className="hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block h:w-[34vw] h:flex-none"
        />
      </div>
    </ChapterSection>
  );
};

export default Services;
