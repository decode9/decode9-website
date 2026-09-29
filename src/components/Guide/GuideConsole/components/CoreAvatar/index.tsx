import { cn } from '@/utils/cn';
import type { CoreAvatarProps } from './interface';

/** The guide's face in the UI: a small core that breathes, and races while thinking. */
const CoreAvatar = ({ thinking, live, size = 34 }: CoreAvatarProps) => (
  <span
    className="relative inline-flex flex-shrink-0 items-center justify-center"
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <span
      className="absolute inset-0 rounded-full border border-[color:var(--accent)]"
      style={{ animation: `breathe ${thinking ? 0.9 : 2.8}s ease-out infinite` }}
    />
    <span
      className={cn('absolute inset-[3px] rounded-full', !live && 'grayscale')}
      style={{
        background: 'conic-gradient(from 210deg, #ff2a33, #8e0408, #22242a, #e5121b, #ff2a33)',
        animation: `spin ${thinking ? 1.2 : 6}s linear infinite`,
      }}
    />
    <span className="absolute inset-[9px] rounded-full bg-ink-950" />
    <span className="absolute h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_10px_var(--accent)]" />
  </span>
);

export default CoreAvatar;
