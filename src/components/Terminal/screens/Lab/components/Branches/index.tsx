import { RESEARCH_BRANCHES } from '@/data/terminal/lab';
import content from '../../../../styles/content.module.scss';
import SlotRow from '../../../components/SlotRow';
import type { PickerProps } from '../../../interface';
import usePicker from '../../../usePicker';

const ITEMS = RESEARCH_BRANCHES.map((s) => ({ ic: s.ic, label: s.sh }));

/** Laboratorio: research-branch slots (original key 'ramas'). */
const Branches = ({ onPick, auto }: PickerProps) => {
  const { selected, pick } = usePicker(0, onPick, auto && { value: 0, ...auto });
  return (
    <div className={content.pane}>
      <SlotRow items={ITEMS} selected={selected} onPick={pick} two />
    </div>
  );
};

export default Branches;
