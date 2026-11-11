export interface QrCardProps {
  /** Link the QR carries. */
  url: string;
  /** Researcher name shown under the code ('—' when none). */
  user: string | null;
  drawQr: (canvas: HTMLCanvasElement, text: string) => boolean;
}
