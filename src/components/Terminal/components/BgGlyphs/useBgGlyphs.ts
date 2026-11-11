'use client';

import { useEffect, useState } from 'react';
import { BG_BLOCKS, BG_GLYPHS } from '@/data/terminal';
import { glyphString } from '@/utils/glyphString';
import type { GlyphBlock, UseBgGlyphsResult } from './interface';

/** Random layout of the background blocks (original bgSwap body). */
export const shuffleBlocks = (random: () => number = Math.random): GlyphBlock[] =>
  Array.from({ length: BG_BLOCKS }, () => {
    const lines = 1 + Math.floor(random() * 3);
    const text = Array.from({ length: lines }, () => glyphString(6 + Math.floor(random() * 14), BG_GLYPHS, random)).join('\n');
    return { text, boxed: random() < 0.35, left: random() * 92, top: random() * 90, size: 12 + random() * 16 };
  });

/** Fades the blocks out and re-shuffles them 400 ms later on every screen change. */
const useBgGlyphs = (screenVersion: number, reduceMotion: boolean): UseBgGlyphsResult => {
  const [blocks, setBlocks] = useState<GlyphBlock[]>([]);
  const [swapping, setSwapping] = useState(false);
  useEffect(() => {
    if (screenVersion === 0) return undefined;
    setSwapping(true);
    const id = window.setTimeout(() => {
      setBlocks(shuffleBlocks());
      setSwapping(false);
    }, reduceMotion ? 0 : 400);
    return () => window.clearTimeout(id);
  }, [screenVersion, reduceMotion]);
  return { blocks, swapping };
};

export default useBgGlyphs;
