import { useEffect } from 'react';
import { formatMediaTime } from '@/utils/transmitter';
import { useChannel } from '../Channel/context';
import useChannelActions from '../Channel/useChannelActions';

/** #vs: the <video> lives in the sheet box unless the fullscreen player is open. */
const useVideoSheet = () => {
  const ch = useChannel();
  const actions = useChannelActions();
  const { video, fullscreen, videoClock, currentVideo, loadVideo, setSheetHost } = ch;

  useEffect(() => {
    const onClick = () => {
      if (!fullscreen) actions.toggleVideo();
    };
    video.addEventListener('click', onClick);
    return () => video.removeEventListener('click', onClick);
  }, [video, fullscreen, actions]);

  const index = currentVideo ? ch.deps.content.videos.indexOf(currentVideo) : 0;
  return {
    open: ch.sheet === 'video',
    video,
    item: currentVideo,
    playing: videoClock.playing,
    time: formatMediaTime(videoClock.time),
    hostRef: setSheetHost,
    prev: () => loadVideo(index - 1, !video.paused),
    next: () => loadVideo(index + 1, !video.paused),
    toggle: actions.toggleVideo,
    openFullscreen: actions.openFullscreen,
    share: () => actions.share(ch.shareTarget),
    close: actions.closeSheets,
  };
};

export default useVideoSheet;
