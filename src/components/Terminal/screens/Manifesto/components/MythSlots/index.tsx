import { MYTHS } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import SlotRow from '../../../components/SlotRow';
import usePicker from '../../../usePicker';
import type { PickerProps } from '../../../interface';

const ITEMS = MYTHS.map((x) => ({ ic: x.ic, label: x.t }));

/** Manifiesto · Lo que ves: the four trait slots (original key 'myths'). */
const MythSlots = ({ onPick, auto }: PickerProps) => {
  const { selected, pick } = usePicker(0, onPick, auto && { value: 0, ...auto });
  return (
    <div className={content.pane}>
      <SlotRow items={ITEMS} selected={selected} onPick={pick} />
    </div>
  );
};

export default MythSlots;
