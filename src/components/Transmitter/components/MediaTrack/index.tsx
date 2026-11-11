import { cn } from '@/utils/cn';
import ch from '../Channel/styles.module.scss';
import useMediaTrack from './useMediaTrack';
import type { MediaTrackProps } from './interface';

/** Seekable bar track of a player (#vs-trk, #a-trk, #fv-trk). */
const MediaTrack = ({ media, active, big, className }: MediaTrackProps) => {
  const { canvasRef, onSeek } = useMediaTrack(media, active);
  return (
    <div className={cn(ch.trk, big && ch.trkBig, className)}>
      <canvas ref={canvasRef} onClick={onSeek} />
    </div>
  );
};

export default MediaTrack;
