import type { Post } from '@/interfaces/post';
import type { PostTabKey } from '@/data/terminal/channel';

/** Valid posts (type and title present), newest first (original loadPosts). */
export const sortPosts = (posts: readonly Post[]): Post[] =>
  posts.filter((p) => p.type && p.title).sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));

/** Posts of a tab with their index in the full list (the index opens the post). */
export const filterPosts = (posts: readonly Post[], key: PostTabKey): Array<{ post: Post; index: number }> =>
  posts.map((post, index) => ({ post, index })).filter((x) => key === 'all' || x.post.type === key);

export interface FeedPage<T> {
  items: T[];
  /** Clamped page actually shown. */
  page: number;
  pages: number;
}

/** Slice of `page` (clamped to the last page, original PS.page fix-up). */
export const paginate = <T>(list: readonly T[], page: number, per: number): FeedPage<T> => {
  const pages = Math.ceil(list.length / per);
  const p = Math.max(0, Math.min(page, pages - 1));
  return { items: list.slice(p * per, p * per + per), page: p, pages };
};

const two = (n: number) => `0${n}`.slice(-2);

/** dd·mm·yyyy in local time (original fmtDate); '' when unreadable. */
export const formatPostDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${two(d.getDate())}·${two(d.getMonth() + 1)}·${d.getFullYear()}`;
};

/** mm:ss of a number of seconds (original tc). */
export const timecode = (s: number): string => {
  const v = Math.max(0, Math.floor(Number.isFinite(s) ? s : 0));
  return `${two(Math.floor(v / 60))}:${two(v % 60)}`;
};

/** Media URL of a post: absolute and root paths stay, bare names live in /decode9/img/, empty → fallback. */
export const resolveMedia = (src: string | undefined, fallback: string): string => {
  if (!src) return fallback;
  return /^(https?:)?\/\//.test(src) || src.startsWith('/') ? src : `/decode9/img/${src}`;
};

/** Paragraphs of a doc body (blank-line separated). */
export const paragraphs = (body: string): string[] => String(body || '').split(/\n\s*\n/);
