import { METHOD } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import SlotRow from '../../../components/SlotRow';
import usePicker from '../../../usePicker';
import type { PickerProps } from '../../../interface';

const ITEMS = METHOD.map((x) => ({ ic: x.ic, label: x.t }));

/** Manifiesto · Método: the six step slots (original key 'steps'). */
const MethodSteps = ({ onPick, auto }: PickerProps) => {
  const { selected, pick } = usePicker(0, onPick, auto && { value: 0, ...auto });
  return (
    <div className={content.pane}>
      <SlotRow items={ITEMS} selected={selected} onPick={pick} />
    </div>
  );
};

export default MethodSteps;
