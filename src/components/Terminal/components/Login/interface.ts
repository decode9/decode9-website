import type { CSSProperties, RefObject } from 'react';
import type { Bilingual } from '@/interfaces/terminal';

export interface LoginProps {
  reduceMotion: boolean;
  /** Top-bar logo: the emblem flies there. */
  logoRef: RefObject<HTMLSpanElement>;
  /** Submit gesture with a valid name: lets the shell prime Web Audio. */
  onPrime: () => void;
  /** Access granted (original setUser at enterOS). */
  onAuthorized: (name: string) => void;
  /** Gates open (650 ms): the shell assembles. */
  onGateOpen: () => void;
  /** Login layer hidden (1580 ms). */
  onDone: () => void;
  /** Welcome message (2600 ms). */
  onWelcome: (name: string) => void;
  setLogoHidden: (hidden: boolean) => void;
}

/** Visual state flags of the login root (original classes on #login). */
export type LoginFlag = 'loading' | 'lgscan' | 'forming' | 'formed' | 'fly' | 'seam' | 'open';

export interface LoginMessage {
  t: Bilingual;
  err?: boolean;
}

/** Random start of an emblem piece before it forms (original scatterLogo). */
export type PieceScatter = CSSProperties & { '--ix': string; '--iy': string; '--ir': string; '--dl': string };
