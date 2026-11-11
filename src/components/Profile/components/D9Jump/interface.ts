export interface D9JumpProps {
  asking: boolean;
  /** Warp terminal text while leaving; null = hidden. */
  warpLog: string | null;
  onAnswer: (go: boolean) => void;
}
