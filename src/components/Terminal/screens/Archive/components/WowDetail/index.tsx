import type { CSSProperties } from 'react';
import { WOW_SIGNAL } from '@/data/terminal/archive';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import ShareRow from '../../../components/ShareRow';
import styles from './styles.module.scss';

/** Bar height of each character of 6EQUJ5 (base-36 value over 30) and its entry delay (original wowAnim). */
const BARS = WOW_SIGNAL.code.split('').map((c, k) => ({
  c,
  k,
  h: `${Math.round((parseInt(c, 36) / 30) * 100)}%`,
}));

/** Archivo: the Wow! signal (original wowHTML). */
const WowDetail = () => (
  <div className={content.pane}>
    <div className={styles.wow}>
      <div className={styles.bars}>
        {BARS.map(({ c, k, h }) => (
          <span key={k} className={styles.wb} style={{ animationDelay: `${k * 140}ms` }}>
            <i style={{ '--h': h } as CSSProperties} />
            <b>{c}</b>
          </span>
        ))}
      </div>
      <div data-dec>
        <span className={content.lbl}>{WOW_SIGNAL.source}</span>
        <h3 className={`${content.h2} ${styles.title}`}>Wow!</h3>
        <p className={`${content.body} ${styles.body}`}>
          <Bi t={WOW_SIGNAL.body} />
        </p>
        <p className={`${content.gloss} ${styles.mt10}`}>
          <Bi t={WOW_SIGNAL.gloss} />
        </p>
        <p className={styles.link}>
          <a className={content.ext} href={WOW_SIGNAL.link} target="_blank" rel="noopener">
            {WOW_SIGNAL.linkLabel}
          </a>
        </p>
        <ShareRow title="Wow! · 6EQUJ5" hash="archivo" />
      </div>
    </div>
  </div>
);

export default WowDetail;
