import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChapterId } from '@/interfaces';
import useChapterNavigation from '@/hooks/useChapterNavigation';
import { trackEvent } from '@/lib/analytics';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';
import { getLenis } from '@/lib/motion/lenis';
import type { UseHeaderReturn } from './interface';

const useHeader = (): UseHeaderReturn => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const navigate = useChapterNavigation();

  useGSAP(() => {
    const bar = progressRef.current;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setIsScrolled(self.scroll() > 40);
        if (bar) gsap.set(bar, { scaleX: self.progress });
      },
    });
    return () => trigger.kill();
  });

  useEffect(() => {
    const lenis = getLenis();
    if (isMenuOpen) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((open) => {
      if (!open) trackEvent('mobile_menu_open');
      return !open;
    });
  }, []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const goTo = useCallback(
    (id: ChapterId, source: 'rail' | 'mobile' | 'logo') => {
      setIsMenuOpen(false);
      getLenis()?.start();
      navigate(id);
      trackEvent('nav_click', { section: id, source });
    },
    [navigate],
  );

  return { isScrolled, isMenuOpen, toggleMenu, closeMenu, progressRef, goTo };
};

export default useHeader;
