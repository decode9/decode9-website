import { QUOTES } from '@/data/terminal/manifesto';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import styles from '../../styles.module.scss';
import type { DetailProps } from '../../../interface';

/** Manifiesto · Conocimiento: one quote (original quoteHTML). */
const QuoteDetail = ({ index }: DetailProps) => {
  const q = QUOTES[index];
  return (
    <div className={content.pane}>
      <div data-dec>
        <span className={content.lbl}>
          {q.author} · <Bi t={q.src} />
        </span>
        <p className={`${content.quote} glow ${styles.quote}`}>
          <Bi t={q.quote} />
        </p>
        <p className={content.gloss}>
          <Bi t={q.gloss} />
        </p>
      </div>
    </div>
  );
};

export default QuoteDetail;
