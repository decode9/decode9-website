/* eslint-disable @next/next/no-img-element -- static export; plain <img> like the original */
import { LAB_TEXT, RESEARCH_BRANCHES } from '@/data/terminal/lab';
import { withBase } from '@/utils/asset';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import Hex from '../../../components/Hex';
import type { DetailProps } from '../../../interface';
import styles from './styles.module.scss';

const PIPS = [0, 1, 2, 3, 4];

/** Laboratorio: one branch with its cut-out (original skillHTML). */
const BranchDetail = ({ index }: DetailProps) => {
  const s = RESEARCH_BRANCHES[index];
  return (
    <div className={content.pane}>
      <div className={styles.skw}>
        <div data-dec>
          <div className={styles.head}>
            <Hex ic={s.ic} blue />
            <span className={content.lbl}>
              <Bi t={LAB_TEXT.branch} /> · <Bi t={s.br} />
            </span>
          </div>
          <h3 className={cn(content.h2, styles.title)}>
            <Bi t={s.n} />
          </h3>
          <p className={cn(content.body, styles.body)}>
            <Bi t={s.d} />
          </p>
          <div className={styles.chips}>
            {s.t.map((t, k) => (
              <span key={typeof t === 'string' ? t : t[0]} className={styles.chip}>
                <Bi t={t} />
                {k === 0 && <span className={styles.star}>★</span>}
              </span>
            ))}
          </div>
          <div className={styles.pipRow}>
            <span className={styles.pips}>
              {PIPS.map((k) => (
                <i key={k} className={cn(k < s.pv && styles.f)} />
              ))}
            </span>
          </div>
          <span className={cn(content.lbl, styles.researching)}>
            ● <Bi t={LAB_TEXT.researching} />
          </span>
        </div>
        <div className={styles.cut}>
          <img src={withBase(`/decode9/img/cut-${s.img}.webp`)} alt="" />
        </div>
      </div>
    </div>
  );
};

export default BranchDetail;
