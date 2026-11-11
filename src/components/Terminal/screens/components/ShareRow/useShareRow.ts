'use client';

import { useEffect, useRef, useState } from 'react';
import { TERMINAL_URLS } from '@/data/terminal/config';
import { SHARE_TARGETS } from '@/data/terminal/share';

/** Builds the share links and handles "copy link" (original shareHTML + .shcopy handler). */
const useShareRow = (title: string, hash: string) => {
  const url = `${TERMINAL_URLS.shareBase.replace(/\/$/, '')}#${hash || 'canal'}`;
  const eu = encodeURIComponent(url);
  const et = encodeURIComponent(`${title} · decode9`);
  const links = SHARE_TARGETS.map((s) => ({ id: s.id, label: s.label, href: s.href(eu, et) }));
  const [copied, setCopied] = useState(false);
  const [copyTitle, setCopyTitle] = useState<string | null>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = () => {
    const ok = () => {
      setCopied(true);
      setCopyTitle('✓');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1400);
    };
    try {
      navigator.clipboard.writeText(url).then(ok, () => setCopyTitle(url));
    } catch {
      setCopyTitle(url);
    }
  };

  return { links, copy, copied, copyTitle };
};

export default useShareRow;
