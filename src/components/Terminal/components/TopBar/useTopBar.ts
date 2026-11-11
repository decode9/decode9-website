'use client';

import { useEffect, useState } from 'react';
import { BG_GLYPHS } from '@/data/terminal';
import { glyphString } from '@/utils/glyphString';
import type { TopBarLive } from './interface';

const pad = (n: number) => `0${n}`.slice(-2);

/** Uptime clock "AV-09 · hh:mm:ss" from mount. */
export const formatUptime = (seconds: number): string =>
  `AV-09 · ${[Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(pad).join(':')}`;

const INITIAL: TopBarLive = { clock: formatUptime(0), glyph: 'ㅈㅊ⊐ ㄷㅋ⊓ 09', sync: 40, signal: [1, 1, 1, 1, 1, 1] };

/** Live top bar: clock every second and, without reduced motion, glyphs, SYNC bar and signal flicker. */
const useTopBar = (reduceMotion: boolean): TopBarLive => {
  const [live, setLive] = useState<TopBarLive>(INITIAL);
  useEffect(() => {
    const t0 = Date.now();
    const id = window.setInterval(() => {
      const clock = formatUptime(Math.floor((Date.now() - t0) / 1000));
      if (reduceMotion) {
        setLive((l) => ({ ...l, clock }));
        return;
      }
      setLive({
        clock,
        glyph: glyphString(9, BG_GLYPHS),
        sync: 30 + Math.random() * 65,
        signal: Array.from({ length: 6 }, (_, i) => (Math.random() < 0.8 || i < 3 ? 1 : 0.25)),
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);
  return live;
};

export default useTopBar;
