import { METHOD, MANIFESTO_TEXT as T } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import Hex from '../../../components/Hex';
import styles from '../../styles.module.scss';
import type { DetailProps } from '../../../interface';

/** Manifiesto · Método: one step (original stepHTML). */
const StepDetail = ({ index }: DetailProps) => {
  const x = METHOD[index];
  const tag = index === 0 ? T.prejudice : index === METHOD.length - 1 ? T.knowledgeStarts : null;
  return (
    <div className={content.pane}>
      <div data-dec>
        <div className={styles.row}>
          <Hex ic={x.ic} big />
          <div>
            <span className={content.lbl}>
              <Bi t={T.step} /> 0{index + 1} / 06
            </span>
            <h3 className={content.h2}>
              <Bi t={x.t} />
            </h3>
          </div>
        </div>
        <p className={`${content.body} ${styles.mt12}`}>
          <Bi t={x.d} />
        </p>
        {tag && (
          <p className={styles.mt12}>
            <span className={index === 0 ? content.tag : `${content.tag} ${content.tagA}`}>
              <Bi t={tag} />
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StepDetail;
