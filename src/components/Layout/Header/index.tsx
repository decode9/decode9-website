'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/utils';
import { useDictionary } from '@/context/DictionaryContext';
import { i18n, type Locale } from '@/i18n';

const navItems = [
  { key: 'services', href: '#services' },
  { key: 'work', href: '#work' },
  { key: 'stack', href: '#stack' },
  { key: 'patterns', href: '#patterns' },
  { key: 'process', href: '#process' },
  { key: 'about', href: '#about' },
];

export function Header() {
  const { dictionary, locale, setLocale } = useDictionary();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sectionIds = [...navItems.map((i) => i.href.replace('#', '')), 'contact'];
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-ink-950/90 backdrop-blur-xl border-b border-ink-800'
          : 'bg-transparent',
      )}
    >
      <div className="d9-container-wide">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" aria-label="decode9 — home" className="flex-shrink-0">
            <Image
              src="/brand/decode9-logo.png"
              alt="decode9"
              width={120}
              height={26}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'd9-nav-link',
                  activeSection === item.href.replace('#', '') && 'active',
                )}
              >
                {dictionary.nav[item.key as keyof typeof dictionary.nav]}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language switcher */}
            <div
              className="flex items-center rounded-sm overflow-hidden border border-ink-700"
              role="group"
              aria-label="Language"
            >
              {i18n.locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => switchLocale(loc)}
                  aria-pressed={locale === loc}
                  className={cn(
                    'px-3 py-1.5 text-xs font-label font-semibold tracking-widest uppercase transition-all duration-150',
                    locale === loc
                      ? 'bg-brand-red text-white'
                      : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800',
                  )}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Contact link */}
            <Link href="#contact" className="d9-nav-link">
              {dictionary.nav.contact}
            </Link>

            {/* CTA */}
            <a
              href="mailto:jbastidas@theempire.tech?subject=Project%20inquiry%20%E2%80%94%20decode9"
              className="d9-btn d9-btn--energy d9-notch-tr d9-btn--sm inline-flex items-center gap-2"
            >
              <span>{dictionary.nav.cta}</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            className="lg:hidden p-2 text-ink-400 hover:text-ink-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-ink-900/98 backdrop-blur-xl border-b border-ink-800 overflow-hidden"
          >
            <div className="d9-container py-5 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 text-sm font-medium transition-colors rounded-sm',
                    activeSection === item.href.replace('#', '')
                      ? 'text-ink-50 bg-ink-800'
                      : 'text-ink-300 hover:text-ink-50 hover:bg-ink-800/50',
                  )}
                >
                  {dictionary.nav[item.key as keyof typeof dictionary.nav]}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-ink-300 hover:text-ink-50 transition-colors"
              >
                {dictionary.nav.contact}
              </Link>

              <div className="flex items-center gap-3 px-4 pt-3 mt-1 border-t border-ink-800">
                <div
                  className="flex items-center rounded-sm overflow-hidden border border-ink-700"
                  role="group"
                  aria-label="Language"
                >
                  {i18n.locales.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => { switchLocale(loc); setIsMobileMenuOpen(false); }}
                      aria-pressed={locale === loc}
                      className={cn(
                        'px-3 py-1.5 text-xs font-label font-semibold tracking-widest uppercase transition-all duration-150',
                        locale === loc
                          ? 'bg-brand-red text-white'
                          : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800',
                      )}
                    >
                      {loc.toUpperCase()}
                    </button>
                  ))}
                </div>
                <a
                  href="mailto:jbastidas@theempire.tech?subject=Project%20inquiry%20%E2%80%94%20decode9"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="d9-btn d9-btn--energy d9-notch-tr d9-btn--sm flex-1 justify-center"
                >
                  {dictionary.nav.cta}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
