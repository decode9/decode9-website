import type { CSSProperties } from 'react';
import Bi from '../../../Bilingual';
import type { ScreenTabsProps } from './interface';
import useScreenTabs from './useScreenTabs';
import styles from './styles.module.scss';

/** Tab row of a screen with L2/R2 shoulder hints (original tabs()). ←/→ are handled by the terminal. */
const ScreenTabs = ({ tabs, selected, onSelect, screenVersion, reduceMotion }: ScreenTabsProps) => {
  const ref = useScreenTabs(selected, screenVersion, reduceMotion);
  return (
    <div ref={ref} className={styles.tabs} role="tablist" style={{ '--i': 1 } as CSSProperties}>
      <span className={styles.lr} aria-hidden="true">
        L2
      </span>
      {tabs.map((t, i) => (
        <button
          key={t[0]}
          type="button"
          role="tab"
          className={styles.tab}
          aria-selected={i === selected}
          tabIndex={i === selected ? 0 : -1}
          onClick={() => i !== selected && onSelect(i)}
        >
          <Bi t={t} />
        </button>
      ))}
      <span className={styles.lr} aria-hidden="true">
        R2
      </span>
    </div>
  );
};

export default ScreenTabs;
