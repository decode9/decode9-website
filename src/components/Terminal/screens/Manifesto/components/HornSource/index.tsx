import { MANIFESTO_LINKS as L, MANIFESTO_TEXT as T } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import styles from '../../styles.module.scss';

/** Manifiesto · Sesgo: UT Austin source (original key 'fuente'). */
const HornSource = () => (
  <div className={content.pane}>
    <div data-dec>
      <p className={`${content.body} ${styles.italic}`}>
        <Bi t={T.sourceQuote} />
      </p>
      <span className={`${content.lbl} ${styles.block}`}>{L.sourceBy}</span>
      <p className={styles.right}>
        <a className={content.ext} href={L.source} target="_blank" rel="noopener">
          <Bi t={T.sourceLink} />
        </a>
      </p>
    </div>
  </div>
);

export default HornSource;
