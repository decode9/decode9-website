'use client';

import Image from 'next/image';
import { Mail } from 'lucide-react';
import SocialIcon from '@/components/UI/SocialIcon';
import { useDictionary } from '@/context/DictionaryContext';
import { chapters } from '@/data/chapters';
import { CONTACT } from '@/data/contact';
import type { ChapterId } from '@/interfaces';
import { trackEvent } from '@/lib/analytics';
import { withBase } from '@/utils/asset';
import useFooter from './useFooter';

const Footer = () => {
  const { dictionary } = useDictionary();
  const { goTo } = useFooter();
  const footer = dictionary.footer;
  const names = dictionary.nav.chapters as Record<ChapterId, string>;

  const connect = [
    { key: 'email', label: 'Email', href: `mailto:${CONTACT.email}`, external: false },
    { key: 'github', label: 'GitHub', href: CONTACT.github, external: true },
    { key: 'linkedin', label: 'LinkedIn', href: CONTACT.linkedin, external: true },
  ];

  return (
    <footer data-ui="main" className="relative border-t border-ink-800 bg-ink-950/90 backdrop-blur-sm">
      <div className="d9-container-wide grid grid-cols-1 gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Image src={withBase('/brand/decode9-logo.png')} alt="decode9" width={120} height={26} />
          <p className="d9-body max-w-xs text-ink-400">{footer.tagline}</p>
          <div className="flex items-center gap-2">
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="d9-social"
              aria-label="GitHub"
            >
              <SocialIcon network="github" />
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="d9-social"
              aria-label="LinkedIn"
            >
              <SocialIcon network="linkedin" />
            </a>
            <a href={`mailto:${CONTACT.email}`} className="d9-social" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <nav aria-label={footer.navigate}>
          <h2 className="d9-h4 mb-5">{footer.navigate}</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {chapters.map(({ id, code }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(id);
                  }}
                  className="d9-body flex items-baseline gap-2 text-ink-400 transition-colors hover:text-ink-100"
                >
                  <span className="font-code text-[10px] text-ink-500">{code}</span>
                  {names[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="d9-h4 mb-5">{footer.connect}</h2>
          <ul className="flex flex-col gap-3">
            {connect.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  onClick={() => trackEvent('contact_link_click', { channel: link.key, source: 'footer' })}
                  className="d9-body text-ink-400 transition-colors hover:text-ink-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="d9-container-wide flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <span className="d9-caption">{footer.rights}</span>
          <span className="d9-caption">{footer.tag}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
