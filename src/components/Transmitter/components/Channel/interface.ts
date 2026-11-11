import type { ReactNode } from 'react';
import type { Analytics } from '@/interfaces/analytics';
import type { SignalGateway } from '@/interfaces/signal';
import type { ChannelAudio, ChannelContent, ChannelDoc, ChannelVideo } from '@/data/transmitter/channel';

export type ChannelSheet = 'video' | 'audio' | 'reader' | null;

/** Item handed to the share adapter: its id becomes the URL hash. */
export interface ShareItem {
  id: string;
  title: string;
}

export type ShareResult = 'shared' | 'copied' | 'failed';

/** Infrastructure of the channel (panes, sheets, fullscreen), injected by Transmitter/index.tsx. */
export interface ChannelDeps {
  content: ChannelContent;
  signal: SignalGateway;
  share: (item: ShareItem) => Promise<ShareResult>;
  drawTrack: (canvas: HTMLCanvasElement, progress: number, t: number, live: boolean) => void;
  profileUrl: string;
  /** Records visitor actions (`post_open`). */
  analytics: Analytics;
}

export interface ChannelProviderProps {
  deps: ChannelDeps;
  children: ReactNode;
}

export interface MediaClock {
  playing: boolean;
  time: number;
  duration: number;
}

/** Shared state of the channel: the two media elements, the open sheet and the fullscreen player. */
export interface ChannelState {
  deps: ChannelDeps;
  video: HTMLVideoElement;
  audio: HTMLAudioElement;
  sheet: ChannelSheet;
  videoClock: MediaClock;
  audioClock: MediaClock;
  currentVideo: ChannelVideo | null;
  currentAudio: ChannelAudio | null;
  currentDoc: ChannelDoc | null;
  docIndex: number;
  fullscreen: boolean;
  fullscreenHidden: boolean;
  /** Last video/audio shown: what the sheets' COMPARTIR shares (original `shareItem`). */
  shareTarget: ShareItem | null;
  setSheet: (sheet: ChannelSheet) => void;
  showDoc: (index: number) => void;
  loadVideo: (index: number, play: boolean) => void;
  loadAudio: (index: number, play: boolean) => void;
  pauseMedia: (except?: HTMLMediaElement) => void;
  setFullscreen: (on: boolean) => void;
  /** Shows the fullscreen controls and hides them after 3 s while playing. */
  peek: () => void;
  /** Hosts where the single <video> element lives: the sheet box or the fullscreen view. */
  setSheetHost: (host: HTMLElement | null) => void;
  setFullscreenHost: (host: HTMLElement | null) => void;
}
