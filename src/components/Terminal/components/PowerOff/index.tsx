import type { PowerOffProps } from './interface';
import styles from './styles.module.scss';

/** CRT switch-off flash shown before leaving to the entry page (original #poweroff). */
const PowerOff = (_props: PowerOffProps) => (
  <div className={styles.poweroff} aria-hidden="true">
    <i />
  </div>
);

export default PowerOff;
