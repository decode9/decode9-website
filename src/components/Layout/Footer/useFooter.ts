import { useCallback } from 'react';
import type { ChapterId } from '@/interfaces';
import useChapterNavigation from '@/hooks/useChapterNavigation';
import { trackEvent } from '@/lib/analytics';

const useFooter = () => {
  const navigate = useChapterNavigation();
  const goTo = useCallback(
    (id: ChapterId) => {
      navigate(id);
      trackEvent('nav_click', { section: id, source: 'footer' });
    },
    [navigate],
  );
  return { goTo };
};

export default useFooter;
