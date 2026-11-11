import type { RotateHintProps } from './interface';
import styles from './styles.module.scss';

/** Phone in landscape: the entry is portrait only (pure CSS, shown by media query). */
const RotateHint = (_props: RotateHintProps) => (
  <div className={styles.rotar} role="alert">
    <div>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="2.5" width="10" height="19" rx="2" />
        <path d="M11 18.5h2" />
      </svg>
      Gira tu celular
      <br />
      para elegir tu lado
    </div>
  </div>
);

export default RotateHint;
