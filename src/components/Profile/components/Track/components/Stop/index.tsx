import { cn } from '@/utils/cn';
import type { StopProps } from './interface';
import useStop from './useStop';
import styles from './styles.module.scss';

/** One stop of the journey (100svh, snap) with its caption. The contact stop is empty: the walkie talks. */
const Stop = ({ index, station, active, stopRef, onCta }: StopProps) => {
  const cap = station.caption;
  const { words, label } = useStop(cap?.title);
  return (
    <section ref={stopRef} className={cn(styles.stop, active && styles.in)} data-i={index} aria-label={cap ? undefined : station.label}>
      {cap && (
        <div className={cn(styles.cap, cap.open === 'decode9' && styles.capD9)} style={{ ['--acc' as string]: cap.acc }}>
          <span className={styles.eyebrow}>{cap.eyebrow}</span>
          <h2 aria-label={label}>
            {words.map((w, i) => (
              <span key={i}>
                <span className={styles.w} aria-hidden="true">
                  <span className={cn(styles.wi, w.acc && styles.acc)} style={{ ['--d' as string]: w.delay }}>
                    {w.word}
                  </span>
                </span>{' '}
              </span>
            ))}
          </h2>
          <p>{cap.body}</p>
          {cap.res && (
            <div className={styles.res}>
              <span className={styles.from}>{cap.res[0]}</span>
              <i>→</i>
              <span className={styles.to}>{cap.res[1]}</span>
            </div>
          )}
          <button type="button" className={styles.ghost} onClick={() => onCta(cap.open)}>
            {cap.ctaLabel}
          </button>
        </div>
      )}
    </section>
  );
};

export default Stop;
