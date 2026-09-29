import { ArrowUpRight, Mail } from 'lucide-react';
import SocialIcon from '@/components/UI/SocialIcon';
import { CONTACT } from '@/data/contact';
import type { ContactChannelsProps } from './interface';

const ContactChannels = ({ labels, onSelect }: ContactChannelsProps) => {
  const channels = [
    {
      key: 'email',
      label: labels.email,
      value: CONTACT.email,
      href: CONTACT.mailto,
      icon: <Mail size={19} />,
      external: false,
    },
    {
      key: 'github',
      label: labels.github,
      value: 'github.com/decode9',
      href: CONTACT.github,
      icon: <SocialIcon network="github" />,
      external: true,
    },
    {
      key: 'linkedin',
      label: labels.linkedin,
      value: 'linkedin.com/in/decode9',
      href: CONTACT.linkedin,
      icon: <SocialIcon network="linkedin" />,
      external: true,
    },
  ];

  return (
    <ul className="grid grid-cols-2 gap-3">
      {channels.map((channel) => (
        <li key={channel.key} data-reveal className={channel.key === 'email' ? 'col-span-2' : undefined}>
          <a
            href={channel.href}
            target={channel.external ? '_blank' : undefined}
            rel={channel.external ? 'noopener noreferrer' : undefined}
            onClick={() => onSelect(channel.key)}
            className="d9-card d9-card--hover group flex h-full items-center gap-3 px-4 py-3.5"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-ink-700 text-ink-300 transition-colors group-hover:text-ink-50">
              {channel.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="d9-mono-label block">{channel.label}</span>
              <span className="d9-label block truncate text-[13px]">{channel.value}</span>
            </span>
            <ArrowUpRight size={15} className="flex-shrink-0 text-ink-500 transition-colors group-hover:text-ink-200" />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ContactChannels;
