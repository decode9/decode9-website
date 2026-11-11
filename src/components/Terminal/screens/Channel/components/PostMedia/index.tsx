import type { RefObject } from 'react';
import { DEFAULT_MEDIA } from '@/data/posts';
import { CHANNEL_TEXT, POST_SHARE_HASH, POST_TYPE_LABEL } from '@/data/terminal/channel';
import { LOGO_PATHS, LOGO_VIEWBOX } from '@/data/terminal/logo';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import ShareRow from '../../../components/ShareRow';
import { formatPostDate, resolveMedia } from '../../postFeed';
import type { PostMediaProps } from './interface';
import styles from './styles.module.scss';
import useMediaPlayer from './useMediaPlayer';

/** Canal: a broadcast (video) or podcast (audio) with its own player (original mediaHTML + mountMedia). */
const PostMedia = (props: PostMediaProps) => {
  const { post } = props;
  const p = useMediaPlayer(props);
  const playLabel = p.playing ? CHANNEL_TEXT.pause : CHANNEL_TEXT.play;
  const playIcon = p.playing ? '❚❚' : '▶';

  return (
    <div className={content.pane}>
      <div className={cn(styles.pmedia, p.playing && styles.playing)}>
        {p.isVideo ? (
          <div className={styles.pscreen} ref={p.screenRef}>
            <video
              className={styles.pvid}
              ref={p.mediaRef as RefObject<HTMLVideoElement>}
              src={resolveMedia(post.src, DEFAULT_MEDIA.video)}
              poster={resolveMedia(post.poster, DEFAULT_MEDIA.poster)}
              playsInline
              preload="metadata"
            />
            <span className={styles.pbadge}>
              ● REC · <Bi t={CHANNEL_TEXT.rec} />
            </span>
            <button type="button" className={styles.pbig} aria-label={playLabel} onClick={p.toggle}>
              {playIcon}
            </button>
          </div>
        ) : (
          <div className={styles.pcover}>
            <div className={styles.pcovEmb}>
              <svg aria-hidden="true" viewBox={LOGO_VIEWBOX}>
                {LOGO_PATHS.map((l) => (
                  <path key={l.d} d={l.d} fill={l.fill} />
                ))}
              </svg>
            </div>
            <canvas className={styles.pcv} ref={p.canvasRef} />
            <audio ref={p.mediaRef as RefObject<HTMLAudioElement>} src={resolveMedia(post.src, DEFAULT_MEDIA.audio)} preload="metadata" />
          </div>
        )}
        <div className={styles.pctl}>
          <button type="button" className={styles.pplay} aria-label={playLabel} onClick={p.toggle}>
            {playIcon}
          </button>
          <span className={styles.ptc} ref={p.timeRef}>
            00:00
          </span>
          <div
            className={styles.pprog}
            role="slider"
            aria-label={CHANNEL_TEXT.progress}
            aria-valuenow={0}
            tabIndex={-1}
            onClick={(e) => p.seek(e.clientX, e.currentTarget)}
          >
            <i ref={p.barRef} />
          </div>
          <span className={cn(styles.ptc, styles.ptot)}>{p.total}</span>
          <button type="button" className={styles.pmute} aria-label={p.muted ? CHANNEL_TEXT.unmute : CHANNEL_TEXT.mute} onClick={p.toggleMute}>
            {p.muted ? '🔇' : '🔊'}
          </button>
          {p.isVideo && (
            <button type="button" className={styles.pfs} aria-label={CHANNEL_TEXT.fullscreen} title={CHANNEL_TEXT.fullscreen} onClick={p.fullscreen}>
              ⛶
            </button>
          )}
        </div>
        {/* Direct grid children of .pmedia, like the original, so the 10px gap applies between them. */}
        <span className={content.lbl}>
          <Bi t={POST_TYPE_LABEL[post.type]} /> · {formatPostDate(post.at)} · {post.dur}
        </span>
        <h3 className={cn(content.h3, styles.title)}>{post.title}</h3>
        <p className={cn(content.body, styles.text)}>{post.body}</p>
        <p className={cn(content.note, styles.mt8)}>
          <Bi t={p.isVideo ? CHANNEL_TEXT.sample.video : CHANNEL_TEXT.sample.audio} />
        </p>
        {post.link && (
          <p className={styles.link}>
            <a className={content.ext} href={post.link} target="_blank" rel="noopener">
              <Bi t={CHANNEL_TEXT.viewOriginal} /> ↗
            </a>
          </p>
        )}
        <ShareRow title={post.title} hash={POST_SHARE_HASH} />
      </div>
    </div>
  );
};

export default PostMedia;
