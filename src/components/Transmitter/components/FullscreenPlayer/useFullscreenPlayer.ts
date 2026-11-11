import { useCallback, useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';
import { formatMediaTime } from '@/utils/transmitter';
import { useChannel } from '../Channel/context';
import { requestFullscreen } from '../Channel/fullscreen';
import useChannelActions from '../Channel/useChannelActions';

/** #fs: takes the <video> over, asks for browser fullscreen and auto-hides its controls. */
const useFullscreenPlayer = () => {
  const ch = useChannel();
  const { closeFullscreen } = useChannelActions();
  const { video, fullscreen, fullscreenHidden, peek, loadVideo, currentVideo, videoClock } = ch;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fullscreen) requestFullscreen(rootRef.current);
  }, [fullscreen]);

  useEffect(() => {
    if (!fullscreen) return undefined;
    const onChange = () => {
      if (!document.fullscreenElement) closeFullscreen();
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [fullscreen, closeFullscreen]);

  const toggle = useCallback(() => {
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  }, [video]);

  const index = currentVideo ? ch.deps.content.videos.indexOf(currentVideo) : 0;
  const withPeek = (fn: () => void) => () => {
    fn();
    peek();
  };

  return {
    rootRef,
    hostRef: ch.setFullscreenHost,
    open: fullscreen,
    hidden: fullscreenHidden,
    video,
    playing: videoClock.playing,
    title: currentVideo ? `${currentVideo.kicker || 'TX'} · ${currentVideo.heading}` : '',
    time: `${formatMediaTime(videoClock.time)} / ${formatMediaTime(videoClock.duration)}`,
    close: closeFullscreen,
    toggle: withPeek(toggle),
    prev: withPeek(() => loadVideo(index - 1, true)),
    next: withPeek(() => loadVideo(index + 1, true)),
    onViewClick: () => {
      if (!fullscreenHidden) toggle();
      peek();
    },
    onPointerMove: (e: PointerEvent) => {
      if (e.pointerType === 'mouse') peek();
    },
  };
};

export default useFullscreenPlayer;
