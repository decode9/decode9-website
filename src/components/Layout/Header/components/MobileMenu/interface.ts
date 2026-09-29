import type { ChapterId } from '@/interfaces';
import type { Locale } from '@/i18n';

export interface MobileMenuProps {
  open: boolean;
  label: string;
  activeChapter: ChapterId;
  names: Record<ChapterId, string>;
  locale: Locale;
  languageLabel: string;
  ctaLabel: string;
  closeLabel: string;
  onSelect: (id: ChapterId) => void;
  onClose: () => void;
}
