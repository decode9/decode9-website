import type { RefObject } from 'react';
import type { ChapterId } from '@/interfaces';

export interface UseHeaderReturn {
  isScrolled: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  progressRef: RefObject<HTMLDivElement>;
  goTo: (id: ChapterId, source: 'rail' | 'mobile' | 'logo') => void;
}
