export type PostType = 'doc' | 'video' | 'audio';

/** A publication of the decode9 «Canal» (bitácoras, podcasts, transmisiones). */
export interface Post {
  id: string;
  /** ISO date; lists are sorted by it, newest first. */
  at: string;
  type: PostType;
  title: string;
  /** Paragraphs separated by blank lines. */
  body: string;
  /** "mm:ss" for audio/video, empty for docs. */
  dur: string;
  /** Optional external link; empty when none. */
  link: string;
  /** Media file. Absent → the player uses the default media (see data/posts.ts). */
  src?: string;
  poster?: string;
}

/** Reads the publications (static data today; could be the API later). */
export interface PostSource {
  list: () => Promise<Post[]>;
}
