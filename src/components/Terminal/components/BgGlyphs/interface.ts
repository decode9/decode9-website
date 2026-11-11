import type { CSSProperties } from 'react';

export interface BgGlyphsProps {
  /** Bumped on every screen change: triggers the fade-out / re-shuffle (original bgSwap). */
  screenVersion: number;
  reduceMotion: boolean;
  /** Assembly variables (--d) of the layer. */
  style?: CSSProperties;
}

/** One blurred glyph block. */
export interface GlyphBlock {
  text: string;
  boxed: boolean;
  left: number;
  top: number;
  size: number;
}

export interface UseBgGlyphsResult {
  blocks: GlyphBlock[];
  swapping: boolean;
}
