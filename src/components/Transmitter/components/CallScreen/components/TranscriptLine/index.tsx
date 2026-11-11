import type { TranscriptLineProps } from './interface';
import styles from './styles.module.scss';

/** One typed line of the call log: plain text with a cursor while typing, bold lead-in when done. */
const TranscriptLine = ({ line, shown, done }: TranscriptLineProps) => (
  <p className={styles.p}>
    <time>{line.t}</time>
    {done ? (
      <span>
        {line.b && <b>{line.b}</b>}
        {line.x}
      </span>
    ) : (
      <span className={styles.cur}>{(line.b + line.x).slice(0, shown)}</span>
    )}
  </p>
);

export default TranscriptLine;
