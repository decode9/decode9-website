'use client';

import { useEffect, useRef, useState } from 'react';
import type { MediaMeter } from '@/interfaces/terminal';
import { drawMediaBars } from '@/lib/canvas/mediaBars';
import { timecode } from '../../postFeed';
import type { PostMediaProps } from './interface';

type FsDocument = Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void };
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type IosVideo = HTMLMediaElement & { webkitEnterFullscreen?: () => void };

/**
 * Own player of a broadcast or podcast (original mountMedia): play/pause, seek, mute, fullscreen
 * and, for audio, the analyser bars on the cover. Progress and timecode are written by the frame loop.
 */
const useMediaPlayer = ({ post, group, createMeter, onPlay }: PostMediaProps) => {
  const isVideo = post.type === 'video';
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const meter = useRef<MediaMeter | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [total, setTotal] = useState('--:--');

  useEffect(() => {
    const m = mediaRef.current;
    if (!m) return undefined;
    m.volume = 0.6;
    const remove = group.add(m);
    const sync = () => setPlaying(!m.paused);
    const started = () => {
      group.pauseAll(m);
      sync();
    };
    const meta = () => setTotal(timecode(m.duration));
    m.addEventListener('play', started);
    m.addEventListener('pause', sync);
    m.addEventListener('ended', sync);
    m.addEventListener('loadedmetadata', meta);
    let raf = 0;
    const tick = (t: number) => {
      const d = m.duration || 1;
      if (barRef.current) barRef.current.style.width = `${(m.currentTime / d) * 100}%`;
      if (timeRef.current) timeRef.current.textContent = timecode(m.currentTime);
      if (canvasRef.current) {
        const levels = meter.current && !m.paused ? meter.current.levels() : null;
        drawMediaBars(canvasRef.current, t, { playing: !m.paused, progress: m.currentTime / d, levels });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      m.removeEventListener('play', started);
      m.removeEventListener('pause', sync);
      m.removeEventListener('ended', sync);
      m.removeEventListener('loadedmetadata', meta);
      m.pause();
      remove();
      meter.current?.dispose();
      meter.current = null;
    };
  }, [group]);

  const toggle = () => {
    const m = mediaRef.current;
    if (!m) return;
    if (!m.paused) {
      m.pause();
      return;
    }
    onPlay();
    if (!isVideo && !meter.current) meter.current = createMeter(m);
    meter.current?.resume();
    group.pauseAll(m);
    m.play().catch(() => undefined);
  };

  const seek = (clientX: number, el: HTMLElement) => {
    const m = mediaRef.current;
    if (!m || !m.duration) return;
    const r = el.getBoundingClientRect();
    m.currentTime = Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * m.duration;
  };

  const toggleMute = () => {
    const m = mediaRef.current;
    if (!m) return;
    m.muted = !m.muted;
    setMuted(m.muted);
  };

  const fullscreen = () => {
    const d = document as FsDocument;
    const m = mediaRef.current as IosVideo | null;
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      (d.exitFullscreen ?? d.webkitExitFullscreen)?.call(d);
      return;
    }
    const el = screenRef.current as FsElement | null;
    const rq = el?.requestFullscreen ?? el?.webkitRequestFullscreen;
    if (el && rq) {
      const r = rq.call(el);
      if (r && typeof r.catch === 'function') r.catch(() => m?.webkitEnterFullscreen?.());
    } else m?.webkitEnterFullscreen?.();
  };

  return { isVideo, mediaRef, screenRef, canvasRef, barRef, timeRef, playing, muted, total, toggle, seek, toggleMute, fullscreen };
};

export default useMediaPlayer;
