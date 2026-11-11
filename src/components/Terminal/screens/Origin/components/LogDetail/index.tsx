/* eslint-disable @next/next/no-img-element -- static export; plain <img> like the original */
import { ORIGIN_LOGS } from '@/data/terminal/origin';
import { withBase } from '@/utils/asset';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import type { DetailProps } from '../../../interface';
import styles from './styles.module.scss';

/** Expediente de origen: one log with its picture (original logHTML). */
const LogDetail = ({ index }: DetailProps) => {
  const l = ORIGIN_LOGS[index];
  return (
    <div className={content.pane}>
      <div className={styles.logimg}>
        <img src={withBase(`/decode9/img/${l.img}.jpg`)} alt="" />
      </div>
      <div className={styles.text} data-dec>
        <span className={content.lbl}>LOG·0{index + 1} / 08</span>
        <h3 className={content.h2}>
          <Bi t={l.t} />
        </h3>
        <p className={`${content.body} ${styles.body}`}>
          <Bi t={l.d} />
        </p>
      </div>
    </div>
  );
};

export default LogDetail;
