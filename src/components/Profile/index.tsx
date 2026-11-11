'use client';

import { CHAPTERS } from '@/data/profile/chapters';
import { SNIPPETS, SNIPPET_COUNT } from '@/data/profile/snippets';
import { D9_LOG, EMPIRE_URL, FREQUENCIES, STATIONS } from '@/data/profile/stations';
import { TICKS } from '@/data/profile/ticks';
import { isMobileDevice } from '@/hooks/useDevice';
import { createApiClient, createNewsSource, createWalkieGateway } from '@/lib/api';
import { analytics, withWalkieTracking } from '@/lib/tracking';
import createAmbientSynth from '@/lib/audio/createAmbientSynth';
import { warpLog } from '@/lib/canvas/entryMotion';
import { env } from '@/lib/config/env';
import { createBytePreloader } from '@/lib/net/bytePreloader';
import { browserStorage } from '@/utils/storage';
import { withBase } from '@/utils/asset';
import AboutDialog from './components/AboutDialog';
import ChapterPanel from './components/ChapterPanel';
import CodeField from './components/CodeField';
import D9Jump from './components/D9Jump';
import Footer from './components/Footer';
import MapNav from './components/MapNav';
import MoonButton from './components/MoonButton';
import Night from './components/Night';
import ProfileStage from './components/ProfileStage';
import SunLink from './components/SunLink';
import TopBar from './components/TopBar';
import Track from './components/Track';
import Walkie from './components/Walkie';
import { makeStageFactory } from './createStage';
import type { ProfileDeps, ProfileProps } from './interface';
import useProfile, { type ProfileEnv } from './useProfile';
import styles from './styles.module.scss';

/* Composition root: infrastructure (HTTP, Web Audio, preloader, storage) is wired here only. */
const doFetch: typeof fetch = (...args) => fetch(...args);
const api = createApiClient({ baseUrl: env.apiUrl, fetch: doFetch });
const DEPS: ProfileDeps = {
  walkieGateway: withWalkieTracking(createWalkieGateway(api), analytics),
  newsSource: createNewsSource({ client: api, fetch: doFetch }),
  createSound: () => createAmbientSynth(),
  preload: (files, onProgress) => {
    const preloader = createBytePreloader({ fetch: doFetch });
    return preloader.preload(files, onProgress);
  },
  storage: browserStorage,
};
/* 3D stage: phase 4c-2 passes { workstation, night, walkie } modules here. */
const CREATE_STAGE = makeStageFactory();
const DECODE9 = withBase('/decode9/');
const ENV: ProfileEnv = {
  deps: DEPS,
  isMobile: isMobileDevice,
  navigate: (url) => {
    window.location.href = url;
  },
  formatWarp: (p) => warpLog(D9_LOG, p),
  analytics,
  urls: {
    desktop: DECODE9,
    mobile: withBase('/decode9/movil/'),
    desktopAssets: [withBase('/decode9/img/d9-cut.webp'), withBase('/decode9/img/d9-lockup.webp')],
  },
};

/** Jorge Bastidas · Perfil (/perfil/): a scroll journey across the worlds he terraforms. */
const Profile = (_props: ProfileProps) => {
  const p = useProfile(ENV);
  const { actions: a } = p;
  return (
    <div className={styles.root}>
      <CodeField snippets={SNIPPETS} count={SNIPPET_COUNT} />
      <ProfileStage bridge={p.bridge} createStage={CREATE_STAGE} />
      <TopBar stations={STATIONS} status={p.status} dialRef={p.dialRef} needleRef={p.needleRef} onStation={a.pressStation} />
      <Track stations={STATIONS} inStop={p.inStop} stopRefs={p.stopRefs} onCta={a.pressStopCta} />
      <Walkie
        view={p.walkie}
        gateway={DEPS.walkieGateway}
        frequencies={FREQUENCIES}
        bubbleRef={p.bridge.refs.bubble}
        hintRef={p.bridge.refs.walkieHint}
        centered={!p.stageReady}
        onRestart={a.restart}
        onClose={a.closeWalkie}
      />
      <SunLink sunRef={p.bridge.refs.sunHit} href={EMPIRE_URL} />
      <MapNav stations={STATIONS} current={p.status.index} done={p.status.done} onGo={(i) => (a.closeChapter(), a.goTo(i))} />
      <Footer
        progress={p.status.progress}
        replayDisabled={p.status.replayDisabled}
        homeHref={withBase('/')}
        onReplay={a.replay}
        sound={p.sound}
        news={p.news}
        tick={TICKS[Math.max(0, Math.min(TICKS.length - 1, p.status.index))]}
      />
      <MoonButton moonRef={p.bridge.refs.moonHit} onToggle={a.toggleAbout} flat={false} />
      <AboutDialog open={p.aboutOpen} onClose={a.closeAbout} />
      <Night alarmRef={p.bridge.refs.alarm} showSim={p.showSim} onSimulate={a.simulate} />
      <div className={styles.sleepGuard} aria-hidden="true" />
      <D9Jump asking={p.d9.asking} warpLog={p.d9.warpLog} onAnswer={p.d9.close} />
      <ChapterPanel
        chapter={p.chapter in CHAPTERS ? p.chapter : 'perfil'}
        open={p.panelOpen}
        onClose={a.closeChapter}
        onNext={a.goChapter}
        onAction={a.chapterAction}
        onWalkie={a.walkieFromChapter}
      />
    </div>
  );
};

export default Profile;
