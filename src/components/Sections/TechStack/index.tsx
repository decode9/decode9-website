'use client';

import ChapterHeading from '@/components/UI/ChapterHeading';
import ChapterSection from '@/components/UI/ChapterSection';
import { useDictionary } from '@/context/DictionaryContext';
import { stackCategories } from '@/data/stack';
import StackCard from './components/StackCard';
import StackFilters from './components/StackFilters';
import useTechStack from './useTechStack';

const TechStack = () => {
  const { dictionary } = useDictionary();
  const { scopeRef, filter, setFilter, ordered } = useTechStack();
  const stack = dictionary.stack;

  return (
    <ChapterSection
      id="stack"
      code="05"
      label={dictionary.nav.chapters.stack}
      labelledBy="stack-title"
      veil="side"
      layout="wide"
    >
      <div className="d9-container-wide grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] h:flex h:w-max h:max-w-none h:items-center h:gap-14 h:px-[max(24px,5vw)]">
        <div ref={scopeRef} className="h:flex h:items-center h:gap-14">
          <div className="h:w-[440px] h:flex-none">
            <ChapterHeading id="stack-title" eyebrow={stack.eyebrow} title={stack.title} sub={stack.sub} />
            <StackFilters
              label={stack.eyebrow}
              allLabel={stack.all}
              names={stack.cat}
              keys={stackCategories.map((category) => category.key)}
              active={filter}
              onChange={setFilter}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 h:grid-flow-col h:grid-rows-2 h:auto-cols-[300px] h:grid-cols-none">
            {ordered.map((category) => (
              <StackCard
                key={category.key}
                category={category}
                name={stack.cat[category.key]}
                dimmed={filter !== 'all' && filter !== category.key}
                selected={filter === category.key}
              />
            ))}
          </div>
        </div>
        {/* Open space for the 3D sphere. */}
        <div aria-hidden="true" className="hidden lg:block h:w-[30vw] h:flex-none" />
      </div>
    </ChapterSection>
  );
};

export default TechStack;
