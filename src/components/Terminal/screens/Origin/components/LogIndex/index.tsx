import { ORIGIN_LOGS } from '@/data/terminal/origin';
import content from '../../../../styles/content.module.scss';
import ListMenu from '../../../components/ListMenu';
import type { PickerProps } from '../../../interface';
import usePicker from '../../../usePicker';

const ITEMS = ORIGIN_LOGS.map((l, k) => ({ lead: `0${k + 1}`, label: l.t, tail: 'LOG' }));

/** Expediente de origen: index of the eight logs (original key 'logs'). */
const LogIndex = ({ onPick, auto }: PickerProps) => {
  const { selected, pick } = usePicker(0, onPick, auto && { value: 0, ...auto });
  return (
    <div className={content.pane}>
      <ListMenu items={ITEMS} selected={selected} onPick={pick} />
    </div>
  );
};

export default LogIndex;
