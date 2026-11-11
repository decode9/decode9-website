import type { RefObject } from 'react';

export interface SunLinkProps {
  sunRef: RefObject<HTMLAnchorElement>;
  href: string;
}
