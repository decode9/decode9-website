import { describe, expect, it } from 'vitest';
import type { Post } from '@/interfaces/post';
import { filterPosts, formatPostDate, paginate, paragraphs, resolveMedia, sortPosts, timecode } from './postFeed';

const post = (id: string, type: Post['type'], at: string, title = id): Post => ({ id, type, at, title, body: '', dur: '', link: '' });

describe('postFeed', () => {
  const posts = sortPosts([
    post('a', 'doc', '2026-01-01'),
    post('b', 'audio', '2026-03-01'),
    post('c', 'video', '2026-02-01'),
    post('d', 'doc', '2026-04-01', ''),
  ]);

  it('drops untitled posts and sorts newest first', () => {
    expect(posts.map((p) => p.id)).toEqual(['b', 'c', 'a']);
  });

  it('filters by tab keeping the global index', () => {
    expect(filterPosts(posts, 'all').map((x) => x.index)).toEqual([0, 1, 2]);
    expect(filterPosts(posts, 'doc')).toEqual([{ post: posts[2], index: 2 }]);
    expect(filterPosts(posts, 'video').map((x) => x.post.id)).toEqual(['c']);
  });

  it('paginates and clamps the page', () => {
    const list = Array.from({ length: 14 }, (_, i) => i);
    expect(paginate(list, 0, 6)).toEqual({ items: [0, 1, 2, 3, 4, 5], page: 0, pages: 3 });
    expect(paginate(list, 2, 6).items).toEqual([12, 13]);
    expect(paginate(list, 9, 6).page).toBe(2);
    expect(paginate(list, -1, 6).page).toBe(0);
    expect(paginate([], 0, 6)).toEqual({ items: [], page: 0, pages: 0 });
  });

  it('formats dates and timecodes', () => {
    expect(formatPostDate('2026-10-20T15:00:00')).toBe('20·10·2026');
    expect(formatPostDate('nope')).toBe('');
    expect(timecode(0)).toBe('00:00');
    expect(timecode(125.7)).toBe('02:05');
    expect(timecode(Number.NaN)).toBe('00:00');
  });

  it('resolves media paths like the original', () => {
    expect(resolveMedia(undefined, '/x.mp4')).toBe('/x.mp4');
    expect(resolveMedia('clip.mp4', '/x.mp4')).toBe('/decode9/img/clip.mp4');
    expect(resolveMedia('/a/clip.mp4', '/x.mp4')).toBe('/a/clip.mp4');
    expect(resolveMedia('https://cdn/x.mp3', '')).toBe('https://cdn/x.mp3');
  });

  it('splits paragraphs on blank lines', () => {
    expect(paragraphs('uno\n\ndos\n  \ntres')).toEqual(['uno', 'dos', 'tres']);
  });
});
