import Stop from './components/Stop';
import type { TrackProps } from './interface';
import useTrack from './useTrack';
import styles from './styles.module.scss';

/** The scroll journey: one full-height stop per world, with its caption on the left. */
const Track = ({ stations, inStop, stopRefs, onCta }: TrackProps) => {
  const register = useTrack(stopRefs);
  return (
    <main className={styles.track}>
      {stations.map((s, i) => (
        <Stop key={s.sec} index={i} station={s} active={i === inStop} stopRef={register(i)} onCta={onCta} />
      ))}
    </main>
  );
};

export default Track;
