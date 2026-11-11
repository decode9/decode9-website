'use client';

import { POSTS } from '@/data/posts';
import { LOGO_SVG_MARKUP } from '@/data/terminal/logo';
import { env } from '@/lib/config/env';
import { createApiClient, createSignalGateway } from '@/lib/api';
import { analytics, withSignalTracking } from '@/lib/tracking';
import { createCrtSynth } from '@/lib/audio/createCrtSynth';
import { createMediaMeter } from '@/lib/audio/createMediaMeter';
import { drawStyledQr } from '@/lib/canvas/styledQr';
import { createWireLogo } from '@/lib/canvas/wireLogo';
import { cn } from '@/utils/cn';
import { browserStorage } from '@/utils/storage';
import type { PieceStyle, TerminalDeps } from '../../interface';
import useTerminal from '../../useTerminal';
import BgGlyphs from '../BgGlyphs';
import Hud from '../Hud';
import Login from '../Login';
import MainNav from '../MainNav';
import Portal from '../Portal';
import PowerOff from '../PowerOff';
import Stage from '../Stage';
import Ticker from '../Ticker';
import TopBar from '../TopBar';
import Welcome from '../Welcome';
import WireCanvas from '../WireCanvas';
import type { ShellProps } from './interface';
import styles from './styles.module.scss';

/* Composition root: the infrastructure (storage, Web Audio, canvas) is wired here. */
const DEPS: TerminalDeps = {
  storage: browserStorage,
  createSynth: createCrtSynth,
  createWireLogo,
  services: {
    posts: { list: () => Promise.resolve(POSTS) },
    signal: withSignalTracking(
      createSignalGateway(createApiClient({ baseUrl: env.apiUrl, fetch: (...args) => window.fetch(...args) })),
      analytics,
    ),
    drawQr: (canvas, text) => drawStyledQr(canvas, text, LOGO_SVG_MARKUP),
    createMediaMeter,
    analytics,
  },
};

/**
 * CRT shell of the terminal (original #crt). Grid: top bar / nav · stage · HUD / footer.
 * Assembly contract for the pieces (styles of this file): `data-piece` fades in during `asm`
 * using the inline --d/--px variables, `data-layer` (wire, glyph background) and `data-stage` fade.
 */
const Shell = (_props: ShellProps) => {
  const t = useTerminal(DEPS);
  const piece = (ms: number | undefined, px?: number): PieceStyle | undefined =>
    t.assembly && ms !== undefined ? { '--d': `${ms}ms`, ...(px !== undefined ? { '--px': `${px}px` } : {}) } : undefined;

  return (
    <div
      className={cn(styles.crt, t.phase === 'pre' && styles.pre, t.phase === 'asm' && styles.asm, !t.crtOn && styles.nocrt)}
      data-lang={t.lang}
      lang={t.lang}
      style={t.flashOn ? { filter: 'brightness(1.35) contrast(1.1)' } : undefined}
    >
      <WireCanvas
        target={t.wireTarget}
        reduceMotion={t.reduceMotion}
        navRef={t.navRef}
        create={DEPS.createWireLogo}
        style={piece(t.assembly?.background)}
      />
      <BgGlyphs screenVersion={t.screenVersion} reduceMotion={t.reduceMotion} style={piece(t.assembly?.background)} />

      <Login
          reduceMotion={t.reduceMotion}
          logoRef={t.logoRef}
          onPrime={t.onPrime}
          onAuthorized={t.onAuthorized}
          onGateOpen={t.onGateOpen}
          onDone={t.onLoginDone}
          onWelcome={t.onWelcome}
          setLogoHidden={t.setLogoHidden}
        />
      {t.welcomeName && <Welcome name={t.welcomeName} reduceMotion={t.reduceMotion} onClose={t.onWelcomeClosed} />}
      {t.poweringOff && <PowerOff />}
      <Portal open={false} reduceMotion={t.reduceMotion} onEnter={() => undefined} />

      <TopBar
        user={t.user}
        lang={t.lang}
        onLang={t.setLang}
        crtOn={t.crtOn}
        onToggleCrt={t.toggleCrt}
        onExit={t.exit}
        logoRef={t.logoRef}
        logoHidden={t.logoHidden}
        reduceMotion={t.reduceMotion}
        style={piece(t.assembly?.top, 0)}
      />

      <MainNav navRef={t.navRef} current={t.screen} go={t.go} assembly={t.assembly} reduceMotion={t.reduceMotion} />

      <Stage
        stageRef={t.stageRef}
        deskRef={t.deskRef}
        wm={t.wm}
        screen={t.screen}
        screenVersion={t.screenVersion}
        leaving={t.screenLeaving}
        tab={t.tab}
        selectTab={t.selectTab}
        lang={t.lang}
        reduceMotion={t.reduceMotion}
        style={piece(t.assembly?.stage)}
      />

      <Hud screen={t.screen} target={t.wireTarget} assembly={t.assembly} reduceMotion={t.reduceMotion} />
      <Ticker style={piece(t.assembly?.bottom, 0)} />
    </div>
  );
};

export default Shell;
