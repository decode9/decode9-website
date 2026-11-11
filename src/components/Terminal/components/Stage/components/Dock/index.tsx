import { SHELL_TEXT } from '@/data/terminal';
import Bi from '../../../Bilingual';
import type { DockProps } from './interface';
import styles from './styles.module.scss';

/** Row of closed base windows (original .dock with .dk buttons); hidden when empty. */
const Dock = ({ closed, onRestore }: DockProps) => (
  <div className={styles.dock} aria-live="polite">
    {closed.length > 0 && (
      <>
        <span className={styles.lbl}>
          <Bi t={SHELL_TEXT.closedWindows} />
        </span>
        {closed.map((spec, i) => (
          <button key={`${spec.key ?? spec.title[0]}-${i}`} type="button" className={styles.dk} onClick={() => onRestore(i)}>
            ▢ <Bi t={spec.title} />
          </button>
        ))}
      </>
    )}
  </div>
);

export default Dock;
