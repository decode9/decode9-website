import { QUOTES, MANIFESTO_TEXT as T } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import ListMenu from '../../../components/ListMenu';
import usePicker from '../../../usePicker';
import styles from '../../styles.module.scss';
import type { PickerProps } from '../../../interface';

const ITEMS = QUOTES.map((q, k) => ({ lead: String(k + 1).padStart(2, '0'), label: q.author.toUpperCase(), tail: q.src }));

/** Manifiesto · Conocimiento: index of quotes (original key 'qlist'). */
const QuoteIndex = ({ onPick, auto }: PickerProps) => {
  const { selected, pick } = usePicker(0, onPick, auto && { value: 0, ...auto });
  return (
    <div className={content.pane}>
      <ListMenu items={ITEMS} selected={selected} onPick={pick} />
      <p className={`${content.note} ${styles.mt10}`}>
        <Bi t={T.quotesNote} />
      </p>
    </div>
  );
};

export default QuoteIndex;
