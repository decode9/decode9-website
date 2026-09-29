import Image from 'next/image';
import { withBase } from '@/utils/asset';
import type { DeviceShotsProps } from './interface';

/** Real captures of the live product: a browser window with the phone view in front. */
const DeviceShots = ({ desktop, mobile, alt, url, accent }: DeviceShotsProps) => (
  <div className="relative" data-case-media>
    <figure className="overflow-hidden border border-white/10 bg-ink-900 shadow-2xl shadow-black/50">
      <figcaption className="flex items-center gap-1.5 border-b border-white/10 bg-ink-800 px-3 py-2">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="h-2 w-2 rounded-full bg-ink-600" aria-hidden="true" />
        ))}
        <span className="ml-3 truncate font-code text-[11px] text-ink-200">{url?.replace(/^https?:\/\//, '')}</span>
      </figcaption>
      <Image
        src={withBase(desktop)}
        alt={alt}
        width={1600}
        height={1000}
        className="aspect-[16/10] h-auto w-full object-cover object-top"
      />
    </figure>
    {mobile ? (
      <div
        className="absolute -bottom-6 right-4 w-[26%] overflow-hidden rounded-[18px] border-[5px] border-ink-900 bg-ink-900 shadow-2xl shadow-black/60 md:right-8"
        style={{ boxShadow: `0 20px 60px rgba(0,0,0,.6), 0 0 0 1px ${accent}40` }}
        aria-hidden="true"
      >
        <Image
          src={withBase(mobile)}
          alt=""
          width={600}
          height={1300}
          className="aspect-[9/19.5] h-auto w-full object-cover object-top"
        />
      </div>
    ) : null}
  </div>
);

export default DeviceShots;
