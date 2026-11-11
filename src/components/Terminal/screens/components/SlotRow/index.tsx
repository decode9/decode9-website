import { cn } from '@/utils/cn';
import Bi from '../../../components/Bilingual';
import Hex from '../Hex';
import type { SlotRowProps } from './interface';
import styles from './styles.module.scss';

/** Row of hexagon slots (original slotRow()). */
const SlotRow = ({ items, selected, onPick, two }: SlotRowProps) => (
  <div className={cn(styles.slots, two && styles.two)}>
    {items.map((x, i) => (
      <button
        key={x.label[0]}
        type="button"
        className={cn(styles.slot, i === selected && styles.sel)}
        onClick={() => onPick(i)}
      >
        <Hex ic={x.ic} blue={two} className={styles.hex} />
        {!two && <span className={styles.n}>0{i + 1}</span>}
        <span>
          <Bi t={x.label} />
        </span>
      </button>
    ))}
  </div>
);

export default SlotRow;
