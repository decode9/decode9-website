import type { CSSProperties } from 'react';
import type { BootOverlayProps } from './interface';
import styles from './styles.module.scss';

/** Initial loading screen: red/blue spinning reticle, percent and bar. */
const BootOverlay = ({ percent, done }: BootOverlayProps) => (
  <div className={`${styles.boot} ${done ? styles.done : ''}`} role="status" aria-live="polite">
    <div className={styles.in}>
      <svg className={styles.ret} viewBox="0 0 120 120" aria-hidden="true">
        <g className={styles.spin} fill="none" strokeWidth="3">
          <path d="M60 8 a52 52 0 0 1 52 52" stroke="#e3122b" />
          <path d="M60 112 a52 52 0 0 1 -52 -52" stroke="#1636ff" />
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="60" cy="60" r="30" />
          <path d="M60 22v16M60 82v16M22 60h16M82 60h16" />
        </g>
        <circle cx="60" cy="60" r="3" fill="currentColor" />
      </svg>
      <div className={styles.pct}>{percent}%</div>
      <div className={styles.bar}>
        <i style={{ '--p': `${percent}%` } as CSSProperties} />
      </div>
      <div className={styles.lbl}>Cargando a Jorge…</div>
    </div>
  </div>
);

export default BootOverlay;
