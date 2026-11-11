import { MYTHS, MANIFESTO_TEXT as T } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import Hex from '../../../components/Hex';
import styles from '../../styles.module.scss';
import type { DetailProps } from '../../../interface';

/** Manifiesto · Lo que ves: one trait (original mythHTML). */
const MythDetail = ({ index }: DetailProps) => {
  const y = MYTHS[index];
  return (
    <div className={content.pane}>
      <div data-dec>
        <span className={`${content.lbl} ${styles.struck}`}>
          <Bi t={T.youSee} />
          <Bi t={y.s} />
        </span>
        <div className={`${styles.row} ${styles.mt8}`}>
          <Hex ic={y.ic} big />
          <h3 className={content.h2}>
            <Bi t={y.t} />
          </h3>
        </div>
        <p className={`${content.body} ${styles.mt12}`}>
          <Bi t={y.d} />
        </p>
        <p className={styles.mt12}>
          <span className={`${content.tag} ${content.tagA}`}>
            ✓ <Bi t={y.k} />
          </span>
        </p>
      </div>
    </div>
  );
};

export default MythDetail;
