import { cn } from '@/utils/cn';
import type { MapNavProps } from './interface';
import useMapNav from './useMapNav';
import styles from './styles.module.scss';

/** Right-hand map of the worlds (desktop). */
const MapNav = ({ stations, current, done, onGo }: MapNavProps) => {
  const { isD9 } = useMapNav();
  return (
    <ul className={styles.map} aria-label="Mundos">
      {stations.map((s, i) => (
        <li key={s.sec} className={cn(isD9(i) && styles.d9)}>
          <button type="button" className={cn(i === current && styles.here, done[i] && styles.done)} onClick={() => onGo(i)}>
            <span>{s.mapLabel}</span>
            <b />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MapNav;
