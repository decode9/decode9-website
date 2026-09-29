'use client';

import Image from 'next/image';
import ChapterHeading from '@/components/UI/ChapterHeading';
import ChapterSection from '@/components/UI/ChapterSection';
import { useDictionary } from '@/context/DictionaryContext';
import { withBase } from '@/utils/asset';
import ProfileCard from './components/ProfileCard';
import StatsRow from './components/StatsRow';
import useAbout from './useAbout';

const About = () => {
  const { dictionary } = useDictionary();
  const { ref } = useAbout();
  const origin = dictionary.origin;

  return (
    <ChapterSection id="origin" code="01" label={dictionary.nav.chapters.origin} labelledBy="origin-title" veil="side">
      <div
        ref={ref}
        className="d9-container-wide grid items-start gap-14 lg:grid-cols-[1fr_400px] h:items-center h:gap-12"
      >
        <div>
          <ChapterHeading id="origin-title" eyebrow={origin.eyebrow} title={origin.title} />
          <div className="mb-10 max-w-2xl space-y-5 h:mb-7 h:space-y-3">
            <p className="d9-body-lg" data-reveal>
              {origin.p1}
            </p>
            <p className="d9-body" data-reveal>
              {origin.p2}
            </p>
            <p className="d9-body" data-reveal>
              {origin.p3}
            </p>
          </div>
          <div className="mb-10 flex items-center gap-4 h:mb-7" data-reveal>
            <Image src={withBase('/brand/decode9-isotype.png')} alt="" width={40} height={43} aria-hidden="true" />
            <div>
              <div className="d9-label">Jorge Bastidas</div>
              <div className="d9-caption">{origin.sig}</div>
            </div>
          </div>
          <StatsRow stats={origin.stats} />
        </div>
        <div className="lg:sticky lg:top-28 h:static" data-reveal>
          <ProfileCard title={origin.specTitle} rows={origin.spec} />
        </div>
      </div>
    </ChapterSection>
  );
};

export default About;
