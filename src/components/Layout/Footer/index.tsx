'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useDictionary } from '@/context/DictionaryContext';

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/25024663?v=4';

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/decode9', icon: FaGithub },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/decode9', icon: FaLinkedin },
  { name: 'Email', url: 'mailto:jbastidas@theempire.tech', icon: FaEnvelope },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { dictionary } = useDictionary();

  const footerLinks = [
    {
      title: dictionary.footer.navigation,
      links: [
        { label: dictionary.nav.home, href: '#hero' },
        { label: dictionary.nav.about, href: '#about' },
        { label: dictionary.nav.projects, href: '#projects' },
        { label: dictionary.nav.contact, href: '#contact' },
      ],
    },
    {
      title: dictionary.footer.resources,
      links: [
        { label: dictionary.nav.architecture, href: '#architecture' },
        { label: dictionary.nav.problems, href: '#problems' },
        { label: dictionary.nav.technologies, href: '#tech' },
      ],
    },
  ];

  return (
    <footer className="relative bg-dark-950 border-t border-dark-800">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-dark-700 group-hover:border-primary-500 transition-colors">
                <Image
                  src={GITHUB_AVATAR}
                  alt="decode9"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-white font-display font-bold text-xl">decode9</span>
                <span className="text-dark-500 text-sm block">Jorge Bastidas</span>
              </div>
            </Link>
            
            <p className="text-dark-400 max-w-md mb-6 leading-relaxed">
              {dictionary.footer.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-700 transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-white font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-dark-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © {currentYear} Jorge Bastidas (decode9). {dictionary.footer.rights}
          </p>
          <div className="flex items-center gap-2 text-dark-500 text-sm">
            <span>{dictionary.footer.madeWith}</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-primary-500"
            >
              ❤️
            </motion.span>
            <span>{dictionary.footer.using}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
