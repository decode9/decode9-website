import { CHANNEL_TEXT, POST_TABS } from '@/data/terminal/channel';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import Hex from '../../../components/Hex';
import { formatPostDate } from '../../postFeed';
import type { PostListProps } from './interface';
import styles from './styles.module.scss';
import usePostList from './usePostList';

/** Canal: type tabs, tile grid and pager (original postListHTML, key 'plist'). */
const PostList = (props: PostListProps) => {
  const { loaded, tab, view, total, selected, gridRef, selectTab, goPage, pick } = usePostList(props);

  const tabs = (
    <div className={styles.ptabs} role="tablist">
      {POST_TABS.map((t, i) => (
        <button key={t.key} type="button" role="tab" className={styles.ptab} aria-selected={i === tab} onClick={() => selectTab(i)}>
          <Bi t={t.t} />
        </button>
      ))}
    </div>
  );

  if (!loaded) {
    return (
      <div className={content.pane}>
        {tabs}
        <p className={content.note}>
          <Bi t={CHANNEL_TEXT.tuning} />
        </p>
      </div>
    );
  }

  if (!total) {
    return (
      <div className={content.pane}>
        {tabs}
        <div className={styles.pempty}>
          <Hex ic="doc" />
          <p className={cn(content.body, styles.emptyText)}>
            <Bi t={CHANNEL_TEXT.empty} />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={content.pane}>
      {tabs}
      <ul className={styles.pgrid} ref={gridRef}>
        {view.items.map(({ post, index }) => (
          <li key={post.id}>
            <button
              type="button"
              className={cn(styles.ptile, post.type !== 'doc' && styles.tBlue, selected === index && styles.sel)}
              aria-label={post.title}
              onClick={() => pick(index)}
            >
              <span className={styles.pdt}>{formatPostDate(post.at)}</span>
              <Hex ic={post.type} blue={post.type !== 'doc'} className={styles.thex} />
              <b className={styles.pt}>{post.title}</b>
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.ppager}>
        <button type="button" className={styles.ppg} disabled={view.page === 0} aria-label={CHANNEL_TEXT.prev} onClick={() => goPage(view.page - 1)}>
          ◀
        </button>
        {Array.from({ length: view.pages }, (_, k) => (
          <button
            key={k}
            type="button"
            className={cn(styles.ppg, k === view.page && styles.on)}
            aria-current={k === view.page ? 'page' : undefined}
            onClick={() => goPage(k)}
          >
            {k + 1}
          </button>
        ))}
        <button
          type="button"
          className={styles.ppg}
          disabled={view.page >= view.pages - 1}
          aria-label={CHANNEL_TEXT.next}
          onClick={() => goPage(view.page + 1)}
        >
          ▶
        </button>
        <span className={styles.pcount}>
          {total} <Bi t={CHANNEL_TEXT.files} />
        </span>
      </div>
    </div>
  );
};

export default PostList;
