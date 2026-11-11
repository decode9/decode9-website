export interface WelcomeProps {
  name: string;
  reduceMotion: boolean;
  /** After the 300 ms exit animation. */
  onClose: () => void;
}

/** State of one seal: idle, being deciphered, deciphered. */
export type SealState = '' | 'on' | 'done';
