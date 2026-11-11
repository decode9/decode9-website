import { cn } from '@/utils/cn';
import ch from '../Channel/styles.module.scss';
import Sheet from '../Sheet';
import useReaderSheet from './useReaderSheet';
import styles from './styles.module.scss';

/** #rs: bitácora reader with LÉEMELO (read aloud) and COMPARTIR. */
const ReaderSheet = () => {
  const r = useReaderSheet();
  return (
    <Sheet open={r.open} labelledBy="r-h" kicker={r.meta} onClose={r.close} bodyClassName={styles.reader} bodyRef={r.bodyRef}>
      <h2 id="r-h">{r.doc?.heading}</h2>
      <div className={ch.tools}>
        <button type="button" className={cn(ch.chip, r.reading && ch.chipOn)} onClick={r.toggleRead}>
          {r.reading ? '❚❚ DETENER' : '▶ LÉEMELO'}
        </button>
        <button type="button" className={ch.chip} onClick={r.share}>
          COMPARTIR
        </button>
      </div>
      <div>
        {r.doc?.paragraphs.map((p, i) => (
          // eslint-disable-next-line react/no-array-index-key -- static paragraphs of one bitácora
          <p key={i}>{p}</p>
        ))}
      </div>
    </Sheet>
  );
};

export default ReaderSheet;
