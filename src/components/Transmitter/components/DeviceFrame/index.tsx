import type { DeviceFrameProps } from './interface';
import styles from './styles.module.scss';

/** Body of the walkie (only drawn on screens ≥560px; full screen on phones) holding the screen. */
const DeviceFrame = ({ children }: DeviceFrameProps) => (
  <div className={styles.device}>
    <span className={styles.slot} />
    <span className={styles.led} />
    <span className={styles.btnSide} style={{ right: -3, top: 180, height: 56 }} />
    <span className={styles.btnSide} style={{ right: -3, top: 250, height: 56 }} />
    <span className={styles.btnSide} style={{ left: -3, top: 220, height: 70, background: 'var(--deep)' }} />
    <div className={styles.screen}>{children}</div>
  </div>
);

export default DeviceFrame;
