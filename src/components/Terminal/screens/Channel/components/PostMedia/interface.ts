import type { Post } from '@/interfaces/post';
import type { MediaMeter } from '@/interfaces/terminal';
import type { MediaGroup } from '../../mediaGroup';

export interface PostMediaProps {
  post: Post;
  /** Players of the screen: starting one pauses the others. */
  group: MediaGroup;
  createMeter: (media: HTMLMediaElement) => MediaMeter | null;
  /** Called on play (stops the Sputnik beep, original audioOff()). */
  onPlay: () => void;
}
