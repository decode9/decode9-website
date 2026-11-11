import { ARCHIVE_SIGNALS, WOW_SIGNAL } from '@/data/terminal/archive';
import content from '../../../../styles/content.module.scss';
import ListMenu from '../../../components/ListMenu';
import usePicker from '../../../usePicker';
import type { SignalIndexProps } from './interface';

const WOW = -1;
const ITEMS = ARCHIVE_SIGNALS.map((a, i) => ({ lead: `CH·0${i + 1}`, label: a.n.toUpperCase(), tail: a.f }));

/** Archivo: received signals plus the ghost Wow! row (original key 'arclist'). */
const SignalIndex = ({ onPick, onWow, auto }: SignalIndexProps) => {
  const { selected, pick } = usePicker(0, (i: number) => (i === WOW ? onWow() : onPick(i)), auto && { value: 0, ...auto });
  return (
    <div className={content.pane}>
      <ListMenu
        items={ITEMS}
        selected={selected}
        onPick={pick}
        ghost={{
          lead: WOW_SIGNAL.channel,
          label: WOW_SIGNAL.code,
          tail: WOW_SIGNAL.freq,
          selected: selected === WOW,
          onPick: () => pick(WOW),
        }}
      />
    </div>
  );
};

export default SignalIndex;
