import { useCallback, useRef } from 'react';
import { useGuide } from '@/context/GuideContext';
import useReveal from '@/hooks/useReveal';
import { trackEvent } from '@/lib/analytics';

const useContact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { runReply } = useGuide();
  useReveal(ref);

  const emailMe = useCallback(() => trackEvent('cta_click', { location: 'contact', label: 'email_me' }), []);
  const leaveDetails = useCallback(() => {
    trackEvent('cta_click', { location: 'contact', label: 'guide_details' });
    runReply('contact');
  }, [runReply]);
  const trackChannel = useCallback(
    (channel: string) => trackEvent('contact_link_click', { channel, source: 'contact' }),
    [],
  );

  return { ref, emailMe, leaveDetails, trackChannel };
};

export default useContact;
