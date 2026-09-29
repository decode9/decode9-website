'use client';

import ChapterHeading from '@/components/UI/ChapterHeading';
import ChapterSection from '@/components/UI/ChapterSection';
import { useDictionary } from '@/context/DictionaryContext';
import { alsoBuilt, caseStudies } from '@/data/projects';
import type { ProjectId } from '@/interfaces';
import AlsoBuiltStrip from './components/AlsoBuiltStrip';
import CaseCard from './components/CaseCard';
import CaseDetail from './components/CaseDetail';
import type { CaseCopy } from './interface';
import useWork from './useWork';

const Work = () => {
  const { dictionary } = useDictionary();
  const { sectionRef, trackRef, openStudy, open, close, visit } = useWork();
  const work = dictionary.work;
  const projects = work.projects as Record<ProjectId, CaseCopy>;

  return (
    <ChapterSection
      id="work"
      code="04"
      label={dictionary.nav.chapters.work}
      labelledBy="work-title"
      layout="wide"
      className="!pb-0 h:!pb-0"
    >
      <div ref={sectionRef} className="h:flex h:h-full h:items-center h:gap-10 h:px-[max(24px,5vw)]">
        <div className="d9-container-wide h:mx-0 h:w-[400px] h:flex-none h:px-0">
          <ChapterHeading id="work-title" eyebrow={work.eyebrow} title={work.title} sub={work.sub} />
        </div>
        <div ref={trackRef} className="flex flex-col gap-6 px-6 h:flex-row h:gap-8 h:px-0">
          {caseStudies.map((study, index) => (
            <CaseCard
              key={study.id}
              study={study}
              copy={projects[study.id]}
              labels={work}
              index={index}
              total={caseStudies.length}
              onOpen={() => open(study.id)}
              onVisit={() => visit(study.id)}
            />
          ))}
        </div>
        <AlsoBuiltStrip title={work.also.title} items={alsoBuilt} descriptions={work.also.items} />
      </div>
      {openStudy ? (
        <CaseDetail
          study={openStudy}
          copy={projects[openStudy.id]}
          labels={work}
          onClose={close}
          onVisit={() => visit(openStudy.id)}
        />
      ) : null}
    </ChapterSection>
  );
};

export default Work;
