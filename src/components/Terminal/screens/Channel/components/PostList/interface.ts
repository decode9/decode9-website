import type { Post, PostSource } from '@/interfaces/post';
import type { PickerProps } from '../../../interface';

export interface PostListProps {
  source: PostSource;
  /** Opens post `index` of `posts` (the sorted list); `auto` is true for the desktop auto-open. */
  onPick: (posts: Post[], index: number, auto?: boolean) => void;
  /** Desktop only: opens the newest post once the list has loaded (original setTimeout(openPost(0), 200)). */
  auto: PickerProps['auto'];
  reduceMotion: boolean;
}
