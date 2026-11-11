import type { SeamProps } from './interface';
import styles from './styles.module.scss';

/** White diagonal cut between the sides; x1/x2 are moved by the animation loop. */
const Seam = ({ lineRef, glowRef }: SeamProps) => (
  <svg className={styles.seam} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <line ref={glowRef} className={styles.glow} x1="55" y1="0" x2="45" y2="100" />
    <line ref={lineRef} className={styles.line} x1="55" y1="0" x2="45" y2="100" />
  </svg>
);

export default Seam;
