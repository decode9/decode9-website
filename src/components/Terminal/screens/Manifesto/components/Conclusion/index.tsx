import { MANIFESTO_TEXT as T } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import styles from '../../styles.module.scss';

/** Manifiesto · Conocimiento: conclusion (original key 'concl'). */
const Conclusion = () => (
  <div className={content.pane}>
    <p className={`${content.body} ${styles.fs16}`} data-dec>
      <Bi t={T.conclusion} />
    </p>
  </div>
);

export default Conclusion;
