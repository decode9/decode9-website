import { cn } from '@/utils/cn';
import type { BgGlyphsProps } from './interface';
import useBgGlyphs from './useBgGlyphs';
import styles from './styles.module.scss';

/** Blurred glyph background layer (original .bgg). */
const BgGlyphs = ({ screenVersion, reduceMotion, style }: BgGlyphsProps) => {
  const { blocks, swapping } = useBgGlyphs(screenVersion, reduceMotion);
  return (
    <div className={cn(styles.bgg, swapping && styles.swap)} aria-hidden="true" data-layer style={style}>
      {blocks.map((b, i) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={cn(b.boxed && styles.b)}
          style={{ left: `${b.left}%`, top: `${b.top}%`, fontSize: `${b.size}px` }}
        >
          {b.text}
        </span>
      ))}
    </div>
  );
};

export default BgGlyphs;
