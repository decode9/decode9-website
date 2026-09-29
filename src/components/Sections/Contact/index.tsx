'use client';

import { ArrowRight, MessageSquareText } from 'lucide-react';
import Button from '@/components/UI/Button';
import ChapterSection from '@/components/UI/ChapterSection';
import ScrambleText from '@/components/UI/ScrambleText';
import { useDictionary } from '@/context/DictionaryContext';
import { CONTACT } from '@/data/contact';
import ContactChannels from './components/ContactChannels';
import useContact from './useContact';

const Contact = () => {
  const { dictionary } = useDictionary();
  const { ref, emailMe, leaveDetails, trackChannel } = useContact();
  const handoff = dictionary.handoff;

  return (
    <ChapterSection
      id="handoff"
      code="07"
      label={dictionary.nav.chapters.handoff}
      labelledBy="handoff-title"
      className="min-h-[100svh]"
    >
      <div
        ref={ref}
        className="d9-container-wide grid items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <div className="flex flex-col gap-10">
          <div>
            <span className="d9-eyebrow" data-reveal>
              {handoff.eyebrow}
            </span>
            <h2 id="handoff-title" className="d9-display-lg mb-6" data-reveal>
              {handoff.titleLead} <ScrambleText text={handoff.titleAccent} className="d9-text-energy" duration={1.3} />
            </h2>
            <p className="d9-body-lg mb-10 max-w-xl" data-reveal>
              {handoff.sub}
            </p>
            <div className="flex flex-wrap gap-4" data-reveal>
              <Button href={CONTACT.mailto} size="lg" onClick={emailMe}>
                <span>{handoff.email}</span>
                <ArrowRight size={18} />
              </Button>
              <Button variant="outline" size="lg" onClick={leaveDetails}>
                <MessageSquareText size={16} />
                <span>{handoff.guide}</span>
              </Button>
            </div>
          </div>
          <ContactChannels labels={handoff.channels} onSelect={trackChannel} />
        </div>
        {/* The mark returns on the right, framed by the notched portal. */}
        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </ChapterSection>
  );
};

export default Contact;
