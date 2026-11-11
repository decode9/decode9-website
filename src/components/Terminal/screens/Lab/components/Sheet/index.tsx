import { LAB_TEXT, SHEET_ATTRIBUTES, SHEET_ROWS } from '@/data/terminal/lab';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import styles from './styles.module.scss';

const SEGMENTS = Array.from({ length: 10 }, (_, k) => k);

/** Laboratorio: character sheet (original key 'ficha'). */
const Sheet = () => (
  <div className={content.pane}>
    <dl className={content.fmeta}>
      {SHEET_ROWS.map((r) => (
        <div key={r.t[0]}>
          <dt>
            <Bi t={r.t} />
          </dt>
          <dd className={cn(r.green && content.g)}>
            <Bi t={r.v} />
          </dd>
        </div>
      ))}
    </dl>
    <div className={styles.attrs}>
      {SHEET_ATTRIBUTES.map((a) => (
        <div key={a.t[0]}>
          <div className={styles.row}>
            <span>
              <Bi t={a.t} />
            </span>
            <em>{a.badge ?? ''}</em>
          </div>
          <div className={styles.seg}>
            {SEGMENTS.map((k) => (
              <i key={k} className={cn(k < a.v && styles.f)} />
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className={styles.passive}>
      <span className={content.lbl}>
        <Bi t={LAB_TEXT.passive} />
      </span>
      <div className={styles.xp}>
        <i />
      </div>
    </div>
  </div>
);

export default Sheet;
