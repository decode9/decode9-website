import { ICONS } from '@/data/terminal/icons';
import { cn } from '@/utils/cn';
import type { HexProps } from './interface';
import styles from './styles.module.scss';

/** Hexagonal icon badge (original span.hex). */
const Hex = ({ ic, big, blue, className }: HexProps) => (
  <span className={cn(styles.hex, big && styles.big, blue && styles.blue, className)}>
    <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[ic] }} />
  </span>
);

export default Hex;
