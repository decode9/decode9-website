import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { withBase } from '@/utils/asset';
import type { ChannelDeps, ChannelSheet, ChannelState, MediaClock, ShareItem } from './interface';

const PEEK_MS = 3000;
const IDLE: MediaClock = { playing: false, time: 0, duration: 0 };

const wrap = (index: number, length: number) => (length ? (index + length) % length : 0);

const createVideo = (): HTMLVideoElement => {
  const video = document.createElement('video');
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.preload = 'metadata';
  return video;
};

const createAudio = (): HTMLAudioElement => {
  const audio = document.createElement('audio');
  audio.preload = 'metadata';
  return audio;
};

const play = (media: HTMLMediaElement) => {
  media.play().catch(() => undefined);
};

/** Keeps a MediaClock in sync with a media element's events. */
const useMediaClock = (media: HTMLMediaElement): MediaClock => {
  const [clock, setClock] = useState<MediaClock>(IDLE);
  useEffect(() => {
    const sync = () => setClock({ playing: !media.paused, time: media.currentTime, duration: media.duration });
    const events = ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata', 'durationchange', 'emptied'];
    events.forEach((e) => media.addEventListener(e, sync));
    return () => events.forEach((e) => media.removeEventListener(e, sync));
  }, [media]);
  return clock;
};

/** State of the channel: one <video> (moved between the sheet and fullscreen) and one <audio>. */
const useChannelState = (deps: ChannelDeps): ChannelState => {
  const { videos, audios, docs } = deps.content;
  const [video] = useState(createVideo);
  const [audio] = useState(createAudio);
  const [sheet, setSheet] = useState<ChannelSheet>(null);
  const [videoIndex, setVideoIndex] = useState(0);
  const [audioIndex, setAudioIndex] = useState(0);
  const [docIndex, setDocIndex] = useState(0);
  const [shareTarget, setShareTarget] = useState<ShareItem | null>(null);
  const [fullscreen, setFullscreenState] = useState(false);
  const [fullscreenHidden, setFullscreenHidden] = useState(false);
  const videoClock = useMediaClock(video);
  const audioClock = useMediaClock(audio);

  const sheetHost = useRef<HTMLElement | null>(null);
  const fullscreenHost = useRef<HTMLElement | null>(null);
  const fullscreenRef = useRef(false);
  const audioIndexRef = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const placeVideo = useCallback(() => {
    const host = fullscreenRef.current ? fullscreenHost.current : sheetHost.current;
    if (host && video.parentNode !== host) host.insertBefore(video, host.firstChild);
  }, [video]);

  const setSheetHost = useCallback((host: HTMLElement | null) => {
    sheetHost.current = host;
    placeVideo();
  }, [placeVideo]);

  const setFullscreenHost = useCallback((host: HTMLElement | null) => {
    fullscreenHost.current = host;
    placeVideo();
  }, [placeVideo]);

  const setFullscreen = useCallback((on: boolean) => {
    fullscreenRef.current = on;
    setFullscreenState(on);
    if (!on) setFullscreenHidden(false);
    placeVideo();
  }, [placeVideo]);

  const peek = useCallback(() => {
    setFullscreenHidden(false);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!video.paused) setFullscreenHidden(true);
    }, PEEK_MS);
  }, [video]);

  const pauseMedia = useCallback((except?: HTMLMediaElement) => {
    [video, audio].forEach((m) => {
      if (m !== except && !m.paused) m.pause();
    });
  }, [video, audio]);

  const loadVideo = useCallback((index: number, autoplay: boolean) => {
    const i = wrap(index, videos.length);
    const item = videos[i];
    if (!item) return;
    setVideoIndex(i);
    setShareTarget({ id: item.id, title: item.heading });
    video.pause();
    video.src = withBase(item.src);
    video.poster = withBase(item.poster);
    if (autoplay) play(video);
  }, [video, videos]);

  const loadAudio = useCallback((index: number, autoplay: boolean) => {
    const i = wrap(index, audios.length);
    const item = audios[i];
    if (!item) return;
    audioIndexRef.current = i;
    setAudioIndex(i);
    setShareTarget({ id: item.id, title: item.heading });
    audio.src = withBase(item.src);
    if (autoplay) play(audio);
  }, [audio, audios]);

  const showDoc = useCallback((index: number) => setDocIndex(index), []);

  useEffect(() => {
    const next = () => {
      if (audioIndexRef.current < audios.length - 1) loadAudio(audioIndexRef.current + 1, true);
    };
    const reveal = () => setFullscreenHidden(false);
    audio.addEventListener('ended', next);
    video.addEventListener('ended', reveal);
    return () => {
      audio.removeEventListener('ended', next);
      video.removeEventListener('ended', reveal);
    };
  }, [audio, video, audios.length, loadAudio]);

  useEffect(
    () => () => {
      clearTimeout(hideTimer.current);
      video.pause();
      audio.pause();
    },
    [video, audio],
  );

  return useMemo(
    () => ({
      deps,
      video,
      audio,
      sheet,
      videoClock,
      audioClock,
      currentVideo: videos[videoIndex] ?? null,
      currentAudio: audios[audioIndex] ?? null,
      currentDoc: docs[docIndex] ?? null,
      docIndex,
      fullscreen,
      fullscreenHidden,
      shareTarget,
      setSheet,
      showDoc,
      loadVideo,
      loadAudio,
      pauseMedia,
      setFullscreen,
      peek,
      setSheetHost,
      setFullscreenHost,
    }),
    [deps, video, audio, sheet, videoClock, audioClock, videos, videoIndex, audios, audioIndex, docs, docIndex, fullscreen,
      fullscreenHidden, shareTarget, showDoc, loadVideo, loadAudio, pauseMedia, setFullscreen, peek, setSheetHost, setFullscreenHost],
  );
};

export default useChannelState;
