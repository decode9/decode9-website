import { SHARE_ICONS, SHARE_TEXT } from '@/data/terminal/share';
import { cn } from '@/utils/cn';
import content from '../../../styles/content.module.scss';
import Bi from '../../../components/Bilingual';
import type { ShareRowProps } from './interface';
import styles from './styles.module.scss';
import useShareRow from './useShareRow';

/** "Share" row at the end of a detail window (original shareHTML). */
const ShareRow = ({ title, hash }: ShareRowProps) => {
  const { links, copy, copied, copyTitle } = useShareRow(title, hash);
  return (
    <div className={styles.share}>
      <span className={content.lbl}>
        <Bi t={SHARE_TEXT.share} />
      </span>
      <div className={styles.shr}>
        {links.map((l) => (
          <a key={l.id} className={styles.shb} href={l.href} target="_blank" rel="noopener" aria-label={l.label} title={l.label}>
            <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: SHARE_ICONS[l.id] }} />
          </a>
        ))}
        <button
          type="button"
          className={cn(styles.shb, copied && styles.ok)}
          aria-label={SHARE_TEXT.copy}
          title={copyTitle ?? SHARE_TEXT.copy}
          onClick={copy}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: SHARE_ICONS.ln }} />
        </button>
      </div>
    </div>
  );
};

export default ShareRow;
