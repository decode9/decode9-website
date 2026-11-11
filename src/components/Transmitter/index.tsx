'use client';

import { Fragment, useMemo } from 'react';
import { createRadioEngine } from '@/lib/audio/createRadioEngine';
import { createSpeech } from '@/lib/audio/createSpeech';
import { vibrate } from '@/lib/audio/haptics';
import { createMotionSensor } from '@/lib/canvas/motionDistortion';
import { drawMediaTrack, drawRadioWave } from '@/lib/canvas/radioWave';
import createApiClient from '@/lib/api/createApiClient';
import createSignalGateway from '@/lib/api/createSignalGateway';
import { analytics, withSignalTracking } from '@/lib/tracking';
import { env } from '@/lib/config/env';
import createShare from '@/lib/share/createShare';
import { DEFAULT_MEDIA, POSTS } from '@/data/posts';
import { buildChannel, PROFILE_URL, SHARE_BASE } from '@/data/transmitter/channel';
import { browserStorage } from '@/utils/storage';
import { cn } from '@/utils/cn';
import shared from './shared.module.scss';
import AudioSheet from './components/AudioSheet';
import CallScreen from './components/CallScreen';
import ChannelBridge from './components/ChannelBridge';
import ChannelList from './components/ChannelList';
import ChannelProvider from './components/Channel';
import ContactForm from './components/ContactForm';
import FullscreenPlayer from './components/FullscreenPlayer';
import OffAir from './components/OffAir';
import ReaderSheet from './components/ReaderSheet';
import VideoSheet from './components/VideoSheet';
import type { ChannelDeps } from './components/Channel/interface';
import DeviceFrame from './components/DeviceFrame';
import FrameTicks from './components/FrameTicks';
import MainScreen from './components/MainScreen';
import StatusBar from './components/StatusBar';
import { TransmitterApiContext } from './context';
import useTransmitter from './useTransmitter';
import type { TransmitterDeps, TransmitterProps, TransmitterSlots } from './interface';
import styles from './styles.module.scss';

/** Composition root: the only place that wires lib/ infrastructure into the transmitter. */
const createDeps = (): TransmitterDeps => ({
  createRadio: ({ muted }) => createRadioEngine({ muted }),
  createSpeech,
  createMotion: () => createMotionSensor(window),
  drawWave: drawRadioWave,
  vibrate,
  storage: browserStorage,
});

/** Channel infrastructure: posts, POST /senal, share sheet/clipboard and the media track painter. */
const createChannelDeps = (): ChannelDeps => ({
  content: buildChannel(POSTS, DEFAULT_MEDIA),
  signal: withSignalTracking(
    createSignalGateway(createApiClient({ baseUrl: env.apiUrl, fetch: (...args) => window.fetch(...args) })),
    analytics,
  ),
  share: createShare({ base: SHARE_BASE, navigator: window.navigator }),
  drawTrack: drawMediaTrack,
  profileUrl: PROFILE_URL,
  analytics,
});

const recall = () => window.location.reload();

/** The 4 panes, the sheets, the off-air screen and the fullscreen player of the channel. */
const CHANNEL_SLOTS: TransmitterSlots = {
  panes: [
    <ContactForm key="contacto" />,
    <ChannelList key="videos" kind="video" />,
    <ChannelList key="lecturas" kind="doc" />,
    <ChannelList key="audios" kind="audio" />,
  ],
  mainOverlays: (
    <>
      <VideoSheet />
      <AudioSheet />
      <ReaderSheet />
      <ChannelBridge />
    </>
  ),
  offScreen: <OffAir profileUrl={PROFILE_URL} onRecall={recall} />,
  fullscreen: <FullscreenPlayer />,
};

/** decode9 · Transmisor (/decode9/movil/): emergency walkie with an incoming call and a channel dial. */
const Transmitter = ({ slots = CHANNEL_SLOTS }: TransmitterProps) => {
  const deps = useMemo(createDeps, []);
  const channelDeps = useMemo(createChannelDeps, []);
  const t = useTransmitter(deps);

  return (
    <ChannelProvider deps={channelDeps}>
      <TransmitterApiContext.Provider value={t.api}>
        <div ref={t.rootRef} className={styles.root}>
          <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <filter id="rojo" colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="0.42 0.82 0.16 0 0.02  0.06 0.12 0.03 0 0  0.04 0.08 0.02 0 0  0 0 0 1 0"
              />
            </filter>
          </svg>
          <DeviceFrame>
            <StatusBar muted={t.muted} onToggleMute={t.toggleMute} />
            <div className={styles.hud}>
              <FrameTicks />
              <CallScreen active={t.screen === 'call'} status={t.status} onToMain={t.toMain} />
              <MainScreen
                active={t.screen === 'main'}
                status={t.status}
                station={t.station}
                portrait={t.mainPortrait}
                panes={slots.panes}
                overlays={slots.mainOverlays}
                toastMessage={t.toastMessage}
                toastVisible={t.toastVisible}
                onTune={t.tune}
                onClick={t.api.click}
                onPress={t.api.ensureAudio}
                onExit={t.api.exit}
                getTilt={t.getTilt}
              />
              {t.screen === 'off' && (
                <Fragment key={t.exitCount}>
                  {slots.offScreen ?? (
                    <section className={cn(shared.screen, shared.screenOn)} aria-label="Transmisión cerrada" />
                  )}
                </Fragment>
              )}
            </div>
          </DeviceFrame>
          {slots.fullscreen}
        </div>
      </TransmitterApiContext.Provider>
    </ChannelProvider>
  );
};

export default Transmitter;
