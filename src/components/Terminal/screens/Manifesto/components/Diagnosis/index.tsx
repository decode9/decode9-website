import { MANIFESTO_TEXT as T } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import styles from '../../styles.module.scss';

/** Manifiesto · Sesgo: "You saw horns…" (original key 'diag'). */
const Diagnosis = () => (
  <div className={content.pane}>
    <div data-dec>
      <h3 className={`${content.h2} ${styles.mb12}`}>
        <Bi t={T.diagHead} />
      </h3>
      <p className={content.body}>
        <Bi t={T.diagPre} />
        <b>
          <Bi t={T.diagTerm} />
        </b>
        <Bi t={T.diagPost} />
      </p>
    </div>
  </div>
);

export default Diagnosis;
