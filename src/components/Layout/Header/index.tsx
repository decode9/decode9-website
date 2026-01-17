'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { useDictionary } from '@/context/DictionaryContext';
import { i18n, type Locale } from '@/i18n';

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/25024663?v=4';

const navItems = [
  { key: 'home', href: '#hero' },
  { key: 'about', href: '#about' },
  { key: 'technologies', href: '#tech' },
  { key: 'projects', href: '#projects' },
  { key: 'architecture', href: '#architecture' },
  { key: 'problems', href: '#problems' },
  { key: 'contact', href: '#contact' },
];

export function Header() {
  const { dictionary, locale, setLocale } = useDictionary();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleSectionChange = () => {
      const sections = navItems.map((item) => item.href.replace('#', ''));
      
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleSectionChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionChange);
    };
  }, []);

  const getNavLabel = (key: string) => {
    return dictionary.nav[key as keyof typeof dictionary.nav] || key;
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-dark-700 group-hover:border-primary-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={GITHUB_AVATAR}
                alt="decode9"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-white font-display font-semibold">decode9</span>
              <span className="text-dark-500 text-sm block -mt-1">Developer</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  activeSection === item.href.replace('#', '')
                    ? 'text-white bg-dark-800/50'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/30'
                )}
              >
                {getNavLabel(item.key)}
              </Link>
            ))}
          </div>

          {/* Language Switcher & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-dark-800/50 rounded-lg p-1">
              {i18n.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                    locale === loc
                      ? 'bg-primary-500 text-white'
                      : 'text-dark-400 hover:text-white'
                  )}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>

            <Link
              href="#contact"
              className="btn-primary text-sm"
            >
              {dictionary.nav.letsChat}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-dark-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-900/95 backdrop-blur-xl border-b border-dark-800"
          >
            <div className="container mx-auto px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg font-medium transition-all duration-200',
                    activeSection === item.href.replace('#', '')
                      ? 'text-white bg-dark-800'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                  )}
                >
                  {getNavLabel(item.key)}
                </Link>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="text-dark-500 text-sm">Language:</span>
                <div className="flex items-center gap-1 bg-dark-800 rounded-lg p-1">
                  {i18n.locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        switchLocale(loc);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                        locale === loc
                          ? 'bg-primary-500 text-white'
                          : 'text-dark-400 hover:text-white'
                      )}
                    >
                      {loc.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary w-full mt-4"
              >
                {dictionary.nav.letsChat}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
