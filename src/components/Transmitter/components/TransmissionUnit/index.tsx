import { cn } from '@/utils/cn';
import Portrait from '../Portrait';
import type { TransmissionUnitProps } from './interface';
import styles from './styles.module.scss';

/** Portrait + live wave (`data-wave`, drawn by the frame loop) + data list (FREC, SEÑAL, ESTADO…). */
const TransmissionUnit = ({ portrait, rows, large = false }: TransmissionUnitProps) => (
  <div className={cn(styles.unit, large && styles.large)}>
    <Portrait image={portrait} />
    <div className={styles.info}>
      <canvas className={styles.wave} data-wave="" />
      <dl className={styles.data}>
        {rows.map(({ label, value }) => (
          <div key={label} className={styles.pair}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
);

export default TransmissionUnit;
