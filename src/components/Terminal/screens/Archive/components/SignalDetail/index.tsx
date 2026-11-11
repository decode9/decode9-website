import { ARCHIVE_SIGNALS } from '@/data/terminal/archive';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import ShareRow from '../../../components/ShareRow';
import type { DetailProps } from '../../../interface';
import styles from './styles.module.scss';

const BARS = [0, 1, 2, 3, 4];

/** Archivo: one signal with its strength bars (original arcHTML). */
const SignalDetail = ({ index }: DetailProps) => {
  const a = ARCHIVE_SIGNALS[index];
  return (
    <div className={content.pane}>
      <div data-dec>
        <span className={content.lbl}>
          CH·0{index + 1} · {a.f} MHZ · <Bi t={a.k} />
        </span>
        <h3 className={`${content.h2} ${styles.title}`}>{a.n}</h3>
        <span className={styles.bars}>
          {BARS.map((k) => (
            <i key={k} style={{ height: 6 + k * 4, opacity: k < a.s ? 1 : 0.25 }} />
          ))}
        </span>
        <p className={content.body}>
          <Bi t={a.d} />
        </p>
        <ShareRow title={a.n} hash="archivo" />
      </div>
    </div>
  );
};

export default SignalDetail;
