'use client';

import Image from 'next/image';
import { ArrowRight, Menu } from 'lucide-react';
import Button from '@/components/UI/Button';
import { useDictionary } from '@/context/DictionaryContext';
import { useGuide } from '@/context/GuideContext';
import { CONTACT } from '@/data/contact';
import type { ChapterId } from '@/interfaces';
import { trackEvent } from '@/lib/analytics';
import { withBase } from '@/utils/asset';
import { cn } from '@/utils/cn';
import ChapterRail from './components/ChapterRail';
import LocaleSwitch from './components/LocaleSwitch';
import MobileMenu from './components/MobileMenu';
import useHeader from './useHeader';

const Header = () => {
  const { dictionary, locale } = useDictionary();
  const { activeChapter } = useGuide();
  const { isScrolled, isMenuOpen, toggleMenu, closeMenu, progressRef, goTo } = useHeader();
  const nav = dictionary.nav;
  const names = nav.chapters as Record<ChapterId, string>;

  return (
    <header
      data-ui="header"
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        isScrolled ? 'border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="d9-container-wide flex h-[var(--header-h)] items-center justify-between gap-6">
        <a
          href="#handshake"
          aria-label={nav.home}
          className="flex-shrink-0"
          onClick={(event) => {
            event.preventDefault();
            goTo('handshake', 'logo');
          }}
        >
          <Image src={withBase('/brand/decode9-logo.png')} alt="decode9" width={120} height={26} priority />
        </a>

        <ChapterRail
          label={nav.primary}
          activeChapter={activeChapter}
          names={names}
          onSelect={(id) => goTo(id, 'rail')}
        />

        <div className="hidden items-center gap-4 lg:flex">
          <LocaleSwitch current={locale} label={nav.language} />
          <Button
            href={CONTACT.mailto}
            size="sm"
            onClick={() => trackEvent('cta_click', { location: 'header', label: 'email_cta' })}
          >
            <span>{nav.cta}</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        <button
          type="button"
          className="p-2 text-ink-300 transition-colors hover:text-ink-50 lg:hidden"
          aria-label={nav.menu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
        >
          <Menu size={22} />
        </button>
      </div>

      <div
        ref={progressRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0"
        style={{ background: 'linear-gradient(90deg, var(--brand-red), var(--accent))' }}
      />

      <MobileMenu
        open={isMenuOpen}
        label={nav.primary}
        activeChapter={activeChapter}
        names={names}
        locale={locale}
        languageLabel={nav.language}
        ctaLabel={nav.cta}
        closeLabel={nav.close}
        onSelect={(id) => goTo(id, 'mobile')}
        onClose={closeMenu}
      />
    </header>
  );
};

export default Header;
