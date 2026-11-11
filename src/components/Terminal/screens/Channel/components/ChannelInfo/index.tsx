import { ICONS } from '@/data/terminal/icons';
import { CHANNEL_TEXT, POST_TYPE_LABEL } from '@/data/terminal/channel';
import type { PostType } from '@/interfaces/post';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import styles from './styles.module.scss';

const TYPES: PostType[] = ['doc', 'video', 'audio'];

/** Canal: what the channel carries and its legend (original key 'pinfo'). */
const ChannelInfo = () => (
  <div className={content.pane}>
    <p className={cn(content.body, styles.text)} data-dec>
      <Bi t={CHANNEL_TEXT.info} />
    </p>
    <p className={styles.pkey}>
      {TYPES.map((t) => (
        <span key={t}>
          <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[t] }} />
          <Bi t={POST_TYPE_LABEL[t]} />
        </span>
      ))}
    </p>
  </div>
);

export default ChannelInfo;
