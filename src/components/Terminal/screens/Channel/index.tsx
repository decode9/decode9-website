import { CHANNEL_TEXT } from '@/data/terminal/channel';
import type { Post } from '@/interfaces/post';
import createAutoPick from '../autoPick';
import type { ScreenContext } from '../interface';
import ChannelInfo from './components/ChannelInfo';
import PostDoc from './components/PostDoc';
import PostList from './components/PostList';
import PostMedia from './components/PostMedia';
import { createMediaGroup } from './mediaGroup';

/** Canal · publicaciones (original OPENERS.posts + openPost). */
const openChannel = (ctx: ScreenContext): void => {
  const media = createMediaGroup();
  const openPost = (posts: Post[], i: number, auto = false) => {
    const p = posts[i];
    if (!p) return;
    if (!auto) ctx.services.analytics.track({ name: 'post_open', params: { type: p.type, id: p.id } });
    media.pauseAll(null);
    const casc = ctx.cascade.next();
    ctx.wm.open({
      title: [p.title, p.title],
      group: 'post',
      x: 0.46 + (casc % 3) * 0.05,
      y: 0.02 + (casc % 2) * 0.1,
      w: p.type === 'doc' ? 0.5 : 0.48,
      render: () =>
        p.type === 'doc' ? (
          <PostDoc post={p} />
        ) : (
          <PostMedia post={p} group={media} createMeter={ctx.services.createMediaMeter} onPlay={() => ctx.synth.stop()} />
        ),
    });
  };
  const auto = createAutoPick(200);
  ctx.wm.open({
    title: CHANNEL_TEXT.listTitle,
    key: 'plist',
    base: true,
    x: 0,
    y: 0,
    w: 0.52,
    render: () => (
      <PostList source={ctx.services.posts} onPick={openPost} auto={ctx.isDesk() ? auto() : null} reduceMotion={ctx.reduceMotion} />
    ),
  });
  ctx.wm.open({ title: CHANNEL_TEXT.infoTitle, key: 'pinfo', base: true, x: 0.66, y: 0.74, w: 0.32, delay: 300, cls: 'small', render: () => <ChannelInfo /> });
};

export default openChannel;
