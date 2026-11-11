import type { CSSProperties } from 'react';
import type { WarpProps } from './interface';
import styles from './styles.module.scss';

/** Exit screen: red terminal log towards decode9, blue speed bar towards the profile. */
const Warp = ({ to, show, progress, log, formatLog }: WarpProps) => {
  const n = Math.round(progress * 100);
  return (
    <div
      className={`${styles.warp} ${show ? styles.show : ''}`}
      data-to={to ?? undefined}
      role="status"
      aria-live="polite"
    >
      <div className={`${styles.w} ${styles.wRed}`}>
        <div className={styles.ttl}>decode9</div>
        <div className={styles.log}>{to === 'red' ? formatLog(log, progress) : ''}</div>
      </div>
      <div className={`${styles.w} ${styles.wBlue}`}>
        <div className={styles.ttl}>
          Cargando<span>perfil profesional</span>
        </div>
        <div className={styles.track}>
          <i style={{ '--p': `${to === 'blue' ? n : 0}%` } as CSSProperties} />
        </div>
        <div className={styles.num}>{to === 'blue' ? n : 0}%</div>
      </div>
    </div>
  );
};

export default Warp;
