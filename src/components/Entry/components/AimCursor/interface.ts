export interface AimCursorProps {
  /** Only with a mouse ((hover:hover) and (pointer:fine)). */
  enabled: boolean;
  /** Reports the first mouse move, so the page hides the native cursor. */
  onAimingChange: (aiming: boolean) => void;
}
