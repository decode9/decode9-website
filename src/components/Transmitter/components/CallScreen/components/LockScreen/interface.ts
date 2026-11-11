export interface LockScreenProps {
  /** Investigator alias from the terminal QR ('' when absent). */
  alias: string;
  onPress: () => void;
  onAnswer: () => void;
}

export interface UseLockScreenReturn {
  hours: string;
  minutes: string;
  date: string;
  tag: string;
}
