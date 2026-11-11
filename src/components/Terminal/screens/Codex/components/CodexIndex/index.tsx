/* eslint-disable @next/next/no-img-element -- static export; plain <img> like the original */
import { CODEX } from '@/data/terminal/codex';
import { withBase } from '@/utils/asset';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import usePicker from '../../../usePicker';
import type { CodexIndexProps } from './interface';
import styles from './styles.module.scss';

/** Códice: index with portraits (original key 'cxlist'); picks by CODEX index. */
const CodexIndex = ({ entries, onPick, auto }: CodexIndexProps) => {
  const first = entries[0] ?? 0;
  const { selected, pick } = usePicker(first, onPick, auto && { value: first, ...auto });
  return (
    <div className={content.pane}>
      <div className={styles.list}>
        {entries.map((i) => (
          <button key={i} type="button" className={cn(styles.cx, i === selected && styles.sel)} onClick={() => pick(i)}>
            <img src={withBase(`/decode9/img/${CODEX[i].img}.jpg`)} alt="" />
            <span>
              <b className={styles.nm}>
                <Bi t={CODEX[i].nm} />
              </b>
              <span className={styles.kd}>
                <Bi t={CODEX[i].kind} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CodexIndex;
