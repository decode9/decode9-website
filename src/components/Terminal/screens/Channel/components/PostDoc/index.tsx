import { CHANNEL_TEXT, POST_SHARE_HASH, POST_TYPE_LABEL } from '@/data/terminal/channel';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import ShareRow from '../../../components/ShareRow';
import { formatPostDate, paragraphs } from '../../postFeed';
import type { PostDocProps } from './interface';
import styles from './styles.module.scss';

/** Canal: a written log (original docHTML). */
const PostDoc = ({ post }: PostDocProps) => (
  <div className={content.pane}>
    <article className={styles.pdoc} data-dec>
      <span className={content.lbl}>
        <Bi t={POST_TYPE_LABEL.doc} /> · {formatPostDate(post.at)}
      </span>
      <h3 className={cn(content.h2, styles.title)}>{post.title}</h3>
      {paragraphs(post.body).map((par, k) => (
        <p key={k} className={content.body}>
          {par}
        </p>
      ))}
      {post.link && (
        <p className={styles.link}>
          <a className={content.ext} href={post.link} target="_blank" rel="noopener">
            <Bi t={CHANNEL_TEXT.source} /> ↗
          </a>
        </p>
      )}
      <ShareRow title={post.title} hash={POST_SHARE_HASH} />
    </article>
  </div>
);

export default PostDoc;
