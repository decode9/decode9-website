export interface PortalProps {
  /** The original layer is inactive (hidden); kept so the shell can enable it again. */
  open: boolean;
  reduceMotion: boolean;
  /** Red pill on desktop: hide the portal and focus the login. */
  onEnter: () => void;
}

export type PillReveal = { kind: 'r' | 'b'; text: string } | null;
