'use client';

import { ArrowRight, X } from 'lucide-react';
import Button from '@/components/UI/Button';
import { chapters } from '@/data/chapters';
import { CONTACT } from '@/data/contact';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/utils/cn';
import LocaleSwitch from '../LocaleSwitch';
import type { MobileMenuProps } from './interface';
import useMobileMenu from './useMobileMenu';

const MobileMenu = ({
  open,
  label,
  activeChapter,
  names,
  locale,
  languageLabel,
  ctaLabel,
  closeLabel,
  onSelect,
  onClose,
}: MobileMenuProps) => {
  const panelRef = useMobileMenu(open, onClose);
  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[60] flex flex-col bg-ink-950/97 backdrop-blur-xl lg:hidden"
    >
      <div className="flex h-[var(--header-h)] items-center justify-end px-6">
        <button type="button" onClick={onClose} aria-label={closeLabel} className="p-2 text-ink-300 hover:text-ink-50">
          <X size={22} />
        </button>
      </div>
      <ol className="flex flex-1 flex-col justify-center gap-1 px-8">
        {chapters.map(({ id, code }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={id === activeChapter ? 'step' : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(id);
              }}
              className={cn(
                'flex items-baseline gap-4 py-2 font-heading text-[28px] font-semibold transition-colors',
                id === activeChapter ? 'text-ink-50' : 'text-ink-400 hover:text-ink-100',
              )}
            >
              <span className="font-code text-xs text-[color:var(--accent)]">{code}</span>
              {names[id]}
            </a>
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-3 border-t border-ink-800 px-8 py-6">
        <LocaleSwitch current={locale} label={languageLabel} />
        <Button
          href={CONTACT.mailto}
          size="sm"
          className="flex-1"
          onClick={() => trackEvent('cta_click', { location: 'header_mobile', label: 'email_cta' })}
        >
          <span>{ctaLabel}</span>
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;
