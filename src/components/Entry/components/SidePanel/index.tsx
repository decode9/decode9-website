import type { SidePanelProps } from './interface';
import styles from './styles.module.scss';

const GHOST = { red: 'd9', blue: 'ENGINEER' } as const;

/** Coloured half of the split, with its huge ghost word. The red one is clipped by --t/--b. */
const SidePanel = ({ side, onSelect }: SidePanelProps) => (
  <div className={`${styles.side} ${styles[side]}`} aria-hidden="true" onClick={(e) => onSelect(side, e)}>
    <div className={`${styles.ghost} ${side === 'red' ? styles.gRed : styles.gBlue}`}>{GHOST[side]}</div>
  </div>
);

export default SidePanel;
