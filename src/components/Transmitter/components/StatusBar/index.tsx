import type { StatusBarProps } from './interface';
import styles from './styles.module.scss';

/** Top status bar: mute button (volume 40 / 0) and the AV-09 frequency. */
const StatusBar = ({ muted, onToggleMute }: StatusBarProps) => (
  <div className={styles.status}>
    <div className={styles.left}>
      <button type="button" onClick={onToggleMute} aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}>
        <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
          <path d="M1 5h3l4-4v12L4 9H1z" fill="currentColor" />
          {!muted && (
            <path d="M11 4.5c1 1.4 1 3.6 0 5M13.2 2.5c2 2.6 2 6.4 0 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
          )}
        </svg>
        <span>{muted ? '0' : '40'}</span>
      </button>
    </div>
    <div className={styles.right}>AV-09 · 147.9</div>
  </div>
);

export default StatusBar;
