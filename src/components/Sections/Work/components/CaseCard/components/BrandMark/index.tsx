import Image from 'next/image';
import { withBase } from '@/utils/asset';
import type { BrandMarkProps } from './interface';

/** The project's own logo on its own brand background — each case keeps its identity. */
const BrandMark = ({ brand, name }: BrandMarkProps) => (
  <div
    className="inline-flex h-16 items-center justify-center px-5"
    style={{ background: brand.background, boxShadow: `inset 0 0 0 1px ${brand.primary}33` }}
  >
    {brand.logo.shape === 'round' ? (
      <Image
        src={withBase(brand.logo.src)}
        alt={name}
        width={44}
        height={44}
        className="h-11 w-11 rounded-full object-cover"
      />
    ) : (
      <Image
        src={withBase(brand.logo.src)}
        alt={name}
        width={brand.logo.width}
        height={brand.logo.height}
        className="h-8 w-auto max-w-[180px] object-contain"
      />
    )}
  </div>
);

export default BrandMark;
