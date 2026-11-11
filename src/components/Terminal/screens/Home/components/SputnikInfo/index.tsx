import { SPUTNIK_TEXT as T } from '@/data/terminal/home';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import styles from './styles.module.scss';

/** Window of the "SPUTNIK 1 ?" button (original key 'sputnik'). */
const SputnikInfo = () => (
  <div className={content.pane}>
    <div data-dec>
      <span className={content.lbl}>{T.date}</span>
      <p className={`${content.quote} ${styles.quote}`}>
        <Bi t={T.quote} />
      </p>
      <p className={`${content.body} ${styles.body}`}>
        <Bi t={T.body} />
      </p>
      <p className={styles.link}>
        <a className={content.ext} href={T.link} target="_blank" rel="noopener">
          {T.linkLabel}
        </a>
      </p>
    </div>
  </div>
);

export default SputnikInfo;
