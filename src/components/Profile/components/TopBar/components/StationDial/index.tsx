import type { RefObject } from 'react';
import { cn } from '@/utils/cn';
import type { StationDialProps } from './interface';
import useStationDial from './useStationDial';
import styles from './styles.module.scss';

/** Radio dial: each chapter is a station; the needle follows the journey (moved by useProfile.setDial). */
const StationDial = ({ stations, status, dialRef, needleRef, onStation }: StationDialProps) => {
  const { isD9, isContact } = useStationDial();
  return (
    <nav className={styles.dial} aria-label="Mundos" ref={dialRef as RefObject<HTMLElement>}>
      <div className={styles.stations}>
        {stations.map((s, i) => (
          <button
            key={s.sec}
            type="button"
            aria-label={s.ariaLabel}
            aria-current={String(i === status.index) as 'true' | 'false'}
            data-world={i}
            className={cn(isD9(i) && styles.d9)}
            style={{ ['--x' as string]: `${s.x}%` }}
            onClick={() => onStation(i)}
          >
            <span className={styles.lb}>{s.label}</span>
            {isContact(i) && <span className={styles.q}>?</span>}
          </button>
        ))}
      </div>
      <div className={styles.ticks} aria-hidden="true" />
      <i className={styles.needle} ref={needleRef as RefObject<HTMLElement>} aria-hidden="true" />
      <p className={styles.readout} aria-live="polite">
        <i className={styles.dot} />
        <span className={styles.nm}>{status.name}</span>
        <span className={styles.ph}>{status.phase}</span>
        <b>{status.pct}</b>
      </p>
    </nav>
  );
};

export default StationDial;
