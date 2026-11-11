import type { RefObject } from 'react';

export interface MoonButtonProps {
  moonRef: RefObject<HTMLButtonElement>;
  onToggle: () => void;
  /** No WebGL: paint a CSS moon instead of the 3D one. */
  flat: boolean;
}
