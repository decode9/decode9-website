import { MANIFESTO_TEXT as T } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import styles from '../../styles.module.scss';
import type { BiasLogProps } from './interface';

/** Manifiesto · Sesgo: closing log with the "next: the method" button (original key 'reg'). */
const BiasLog = ({ onNext }: BiasLogProps) => (
  <div className={content.pane}>
    <div data-dec>
      <p className={content.body}>
        <Bi t={T.logBody} />
      </p>
      <p className={styles.mt12}>
        <button type="button" className={`${content.tag} ${content.tagA} ${styles.tagBtn}`} onClick={onNext}>
          <Bi t={T.next} />
        </button>
      </p>
    </div>
  </div>
);

export default BiasLog;
