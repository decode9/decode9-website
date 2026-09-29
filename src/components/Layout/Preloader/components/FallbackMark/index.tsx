import Image from 'next/image';
import { withBase } from '@/utils/asset';
import type { FallbackMarkProps } from './interface';

/** Without WebGL the mark decodes bottom-up with the progress, behind a scanline. */
const FallbackMark = ({ percent }: FallbackMarkProps) => (
  <div className="relative h-[180px] w-[168px]" aria-hidden="true">
    <Image
      src={withBase('/brand/decode9-isotype.png')}
      alt=""
      fill
      sizes="168px"
      className="object-contain opacity-15"
      priority
    />
    <div className="absolute inset-0" style={{ clipPath: `inset(${100 - percent}% 0 0 0)` }}>
      <Image
        src={withBase('/brand/decode9-isotype.png')}
        alt=""
        fill
        sizes="168px"
        className="object-contain"
        priority
      />
    </div>
    <span
      className="absolute inset-x-0 h-px bg-brand-red shadow-[0_0_12px_var(--brand-red)]"
      style={{ top: `${100 - percent}%` }}
    />
  </div>
);

export default FallbackMark;
