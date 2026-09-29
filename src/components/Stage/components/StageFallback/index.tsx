import { cn } from '@/utils/cn';
import { withBase } from '@/utils/asset';
import type { StageFallbackProps } from './interface';

/** Blender render of the mark: shown without WebGL and under reduced motion (never swapped mid-load). */
const StageFallback = ({ visible }: StageFallbackProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={withBase('/brand/core-poster.v1.webp')}
    alt=""
    width={1920}
    height={1080}
    decoding="async"
    className={cn(
      'd9-stage__poster transition-opacity duration-1000',
      visible ? 'opacity-[0.28] md:opacity-[0.55]' : 'opacity-0',
    )}
  />
);

export default StageFallback;
