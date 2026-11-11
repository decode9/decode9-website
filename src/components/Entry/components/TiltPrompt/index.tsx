import type { TiltPromptProps } from './interface';
import styles from './styles.module.scss';

/** Gyroscope notice (phones): «Inclina tu celular», or on iOS a button that asks for permission. */
const TiltPrompt = ({ visible, ask, on, onRequest }: TiltPromptProps) => (
  <button
    type="button"
    className={`${styles.tilt} ${on ? styles.on : ''} ${ask ? styles.ask : ''}`}
    hidden={!visible}
    onClick={(e) => {
      e.stopPropagation();
      onRequest();
    }}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M3 9c-1 2-1 4 0 6M21 9c1 2 1 4 0 6" />
    </svg>
    <span className={styles.t1}>Inclina tu celular</span>
    <span className={styles.t2}>Toca para mover a Jorge con tu celular</span>
  </button>
);

export default TiltPrompt;
