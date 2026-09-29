export type ScrambleTrigger = 'mount' | 'view';

export interface ScrambleTextProps {
  text: string;
  as?: 'span' | 'p' | 'div' | 'strong';
  className?: string;
  trigger?: ScrambleTrigger;
  delay?: number;
  duration?: number;
}

export interface UseScrambleTextOptions {
  text: string;
  trigger: ScrambleTrigger;
  delay: number;
  duration: number;
}
