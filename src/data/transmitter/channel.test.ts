import { describe, expect, it } from 'vitest';
import type { Post } from '@/interfaces/post';
import { buildChannel, readingMinutes, splitTitle } from './channel';

const media = { video: '/v.mp4', poster: '/p.jpg', audio: '/a.mp3' };
const post = (id: string, type: Post['type'], at: string, extra: Partial<Post> = {}): Post => ({
  id, type, at, title: `K ${id} · Título ${id}`, body: '', dur: '', link: '', ...extra,
});

describe('channel', () => {
  it('splits the title on " · "', () => {
    expect(splitTitle('A · B · C')).toEqual({ kicker: 'A', heading: 'B · C' });
    expect(splitTitle('Solo')).toEqual({ kicker: '', heading: 'Solo' });
  });

  it('rounds reading time to at least one minute', () => {
    expect(readingMinutes('hola')).toBe(1);
    expect(readingMinutes(Array(450).fill('x').join(' '))).toBe(2);
  });

  it('filters by type, newest first, with default media', () => {
    const c = buildChannel(
      [post('v1', 'video', '2026-01-01'), post('v2', 'video', '2026-02-01', { src: '/x.mp4' }), post('d1', 'doc', '2026-01-01', { body: 'a\n\nb' }), post('a1', 'audio', '2026-01-01')],
      media,
    );
    expect(c.videos.map((v) => v.id)).toEqual(['v2', 'v1']);
    expect(c.videos[0].src).toBe('/x.mp4');
    expect(c.videos[1]).toMatchObject({ src: '/v.mp4', poster: '/p.jpg', kicker: 'K v1' });
    expect(c.docs[0].paragraphs).toEqual(['a', 'b']);
    expect(c.audios[0].src).toBe('/a.mp3');
  });
});
