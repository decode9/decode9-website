/* eslint-disable @next/next/no-img-element -- static export; plain <img> like the original */
import { CODEX, CODEX_TEXT } from '@/data/terminal/codex';
import { withBase } from '@/utils/asset';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import type { DetailProps } from '../../../interface';
import styles from './styles.module.scss';

/** Códice: one entry (original cxHTML). */
const CodexDetail = ({ index }: DetailProps) => {
  const c = CODEX[index];
  return (
    <div className={content.pane}>
      <div className={styles.img}>
        <img src={withBase(`/decode9/img/${c.img}.jpg`)} alt="" />
      </div>
      <div className={styles.text} data-dec>
        <span className={content.lbl}>
          <Bi t={c.kind} />
        </span>
        <h3 className={content.h2}>
          <Bi t={c.nm} />
        </h3>
        <p className={cn(content.body, styles.body)}>
          <Bi t={c.d} />
        </p>
        <dl className={cn(content.fmeta, styles.meta)}>
          <div>
            <dt>
              <Bi t={CODEX_TEXT.trait} />
            </dt>
            <dd>
              <Bi t={c.a} />
            </dd>
          </div>
          <div>
            <dt>
              <Bi t={CODEX_TEXT.contribution} />
            </dt>
            <dd>
              <Bi t={c.b} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default CodexDetail;
