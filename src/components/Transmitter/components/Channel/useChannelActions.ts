import { useCallback, useMemo } from 'react';
import { useTransmitterApi } from '../../context';
import { useChannel } from './context';
import { exitFullscreen } from './fullscreen';
import type { ShareItem } from './interface';

const toggle = (media: HTMLMediaElement) => {
  if (media.paused) media.play().catch(() => undefined);
  else media.pause();
};

/**
 * Channel behaviour that needs both the channel state and the transmitter API
 * (original: render rows, showVid/loadVid, openFs/closeFs, loadAud, share, openDoc, closeSheets).
 */
const useChannelActions = () => {
  const api = useTransmitterApi();
  const ch = useChannel();
  const { deps, video, audio, pauseMedia, setSheet, loadVideo, loadAudio, showDoc, setFullscreen, peek, fullscreen } = ch;

  const closeSheets = useCallback(() => {
    setSheet(null);
    audio.pause();
    if (!fullscreen) video.pause();
    if (api.isReading()) api.stopSpeak();
  }, [api, audio, video, fullscreen, setSheet]);

  const trackOpen = useCallback(
    (type: 'video' | 'audio' | 'doc', id: string | undefined) => {
      if (id) deps.analytics.track({ name: 'post_open', params: { type, id } });
    },
    [deps],
  );

  const openVideo = useCallback((index: number) => {
    trackOpen('video', deps.content.videos[index]?.id);
    api.stopSpeak();
    pauseMedia();
    loadVideo(index, false);
    setSheet('video');
  }, [api, pauseMedia, loadVideo, setSheet, trackOpen, deps]);

  const openAudio = useCallback((index: number) => {
    trackOpen('audio', deps.content.audios[index]?.id);
    api.stopSpeak();
    pauseMedia();
    loadAudio(index, true);
    setSheet('audio');
  }, [api, pauseMedia, loadAudio, setSheet, trackOpen, deps]);

  const openDoc = useCallback((index: number) => {
    trackOpen('doc', deps.content.docs[index]?.id);
    showDoc(index);
    api.stopSpeak();
    pauseMedia();
    setSheet('reader');
  }, [api, showDoc, pauseMedia, setSheet, trackOpen, deps]);

  const toggleVideo = useCallback(() => {
    if (video.paused) {
      pauseMedia(video);
      api.stopSpeak();
      video.play().catch(() => undefined);
    } else video.pause();
  }, [api, video, pauseMedia]);

  const toggleAudio = useCallback(() => toggle(audio), [audio]);

  /** The player itself requests the browser fullscreen once it is shown (FullscreenPlayer). */
  const openFullscreen = useCallback(() => {
    pauseMedia(video);
    api.stopSpeak();
    setFullscreen(true);
    if (video.paused) video.play().catch(() => undefined);
    peek();
  }, [api, video, pauseMedia, setFullscreen, peek]);

  const closeFullscreen = useCallback(() => {
    setFullscreen(false);
    exitFullscreen();
  }, [setFullscreen]);

  const share = useCallback(async (item: ShareItem | null) => {
    if (!item) return;
    if ((await ch.deps.share(item)) === 'copied') api.toast('ENLACE COPIADO');
  }, [api, ch.deps]);

  return useMemo(
    () => ({ closeSheets, openVideo, openAudio, openDoc, toggleVideo, toggleAudio, openFullscreen, closeFullscreen, share }),
    [closeSheets, openVideo, openAudio, openDoc, toggleVideo, toggleAudio, openFullscreen, closeFullscreen, share],
  );
};

export default useChannelActions;
