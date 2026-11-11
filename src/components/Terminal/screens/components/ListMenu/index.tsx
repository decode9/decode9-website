import { cn } from '@/utils/cn';
import Bi from '../../../components/Bilingual';
import type { ListMenuProps } from './interface';
import styles from './styles.module.scss';

/** Vertical index of a list window (original ul.list > button.li). */
const ListMenu = ({ items, selected, onPick, ghost }: ListMenuProps) => (
  <ul className={styles.list}>
    {items.map((x, i) => (
      <li key={x.lead}>
        <button type="button" className={cn(styles.li, i === selected && styles.sel)} onClick={() => onPick(i)}>
          <span className={styles.x}>{x.lead}</span>
          <span>
            <Bi t={x.label} />
          </span>
          <span className={styles.x}>
            <Bi t={x.tail} />
          </span>
        </button>
      </li>
    ))}
    {ghost && (
      <li>
        <button
          type="button"
          className={cn(styles.li, styles.ghost, ghost.selected && styles.sel)}
          title="?"
          onClick={ghost.onPick}
        >
          <span className={styles.x}>{ghost.lead}</span>
          <span className={styles.gl}>
            <Bi t={ghost.label} />
          </span>
          <span className={styles.x}>
            <Bi t={ghost.tail} />
          </span>
        </button>
      </li>
    )}
  </ul>
);

export default ListMenu;
