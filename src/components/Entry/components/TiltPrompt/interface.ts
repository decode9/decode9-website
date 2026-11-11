export interface TiltPromptProps {
  visible: boolean;
  /** iOS: tap to grant the gyroscope permission. */
  ask: boolean;
  on: boolean;
  onRequest: () => void;
}
