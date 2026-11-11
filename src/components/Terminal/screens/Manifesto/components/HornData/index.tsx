import { MANIFESTO_LINKS as L, MANIFESTO_TEXT as T } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import styles from '../../styles.module.scss';

/** Manifiesto · Sesgo: Thorndike 1920 (original key 'dato'). */
const HornData = () => (
  <div className={content.pane}>
    <div data-dec>
      <span className={content.lbl}>{L.thorndike}</span>
      <p className={`${content.quote} ${styles.dataQuote}`}>
        <Bi t={T.dataQuote} />
      </p>
      <p className={`${content.body} ${styles.fs15}`}>
        <Bi t={T.dataBody} />
      </p>
    </div>
  </div>
);

export default HornData;
