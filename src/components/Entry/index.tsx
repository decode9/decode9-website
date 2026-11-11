'use client';

import { ENTRY_ROUTES, FACE_FRAMES, FACE_FRAME_URL, FACE_HEADX, WARP_LOG } from '@/data/entry';
import { warpLog } from '@/lib/canvas/entryMotion';
import { createFaceFrames } from '@/lib/canvas/faceFrames';
import { createTiltFilter } from '@/lib/canvas/tiltFilter';
import { createBytePreloader } from '@/lib/net/bytePreloader';
import { analytics } from '@/lib/tracking';
import { withBase } from '@/utils/asset';
import AimCursor from './components/AimCursor';
import BootOverlay from './components/BootOverlay';
import Face from './components/Face';
import RotateHint from './components/RotateHint';
import Seam from './components/Seam';
import SideCopy from './components/SideCopy';
import SidePanel from './components/SidePanel';
import TiltPrompt from './components/TiltPrompt';
import Warp from './components/Warp';
import type { EntryDeps, EntryProps } from './interface';
import useEntry from './useEntry';
import styles from './styles.module.scss';

/* Composition root: the infrastructure (canvas, network, sensor filter) is wired here. */
const FRAME_URLS = FACE_FRAMES.map((name) => withBase(FACE_FRAME_URL(name)));
const DEPS: EntryDeps = {
  createFace: () => createFaceFrames({ urls: FRAME_URLS, headX: FACE_HEADX }),
  createPreloader: () => createBytePreloader({ fetch: (...args) => fetch(...args) }),
  createTiltFilter,
  analytics,
};

/** Elige tu lado (/): red decode9 vs blue Jorge, with Jorge's face following the pointer or the gyroscope. */
const Entry = (_props: EntryProps) => {
  const e = useEntry(DEPS);

  return (
    <div
      ref={e.refs.root}
      className={styles.root}
      data-ready={e.ready ? '' : undefined}
      data-leaving={e.leaving ? '' : undefined}
      data-aiming={e.aiming ? '' : undefined}
    >
      <main className={styles.stage}>
        <SidePanel side="blue" onSelect={e.onSideClick} />
        <SidePanel side="red" onSelect={e.onSideClick} />
        <Seam lineRef={e.refs.seamLine} glowRef={e.refs.seamGlow} />
        <Face heroRef={e.refs.hero} canvasRef={e.refs.canvas} />
        <SideCopy
          side="red"
          href={withBase(ENTRY_ROUTES.decode9)}
          elRef={e.refs.copyRed}
          onGo={e.go}
          onFocusCta={e.onCtaFocus}
        />
        <SideCopy
          side="blue"
          href={withBase(ENTRY_ROUTES.profile)}
          elRef={e.refs.copyBlue}
          onGo={e.go}
          onFocusCta={e.onCtaFocus}
        />
        <div className={styles.grain} />
      </main>

      <BootOverlay percent={e.bootPercent} done={e.ready} />
      <Warp to={e.warp.to} show={e.warp.show} progress={e.warp.progress} log={WARP_LOG} formatLog={warpLog} />
      <TiltPrompt
        visible={e.tiltPrompt.visible}
        ask={e.tiltPrompt.ask}
        on={e.tiltPrompt.on}
        onRequest={e.requestTilt}
      />
      <RotateHint />
      <AimCursor enabled={e.canAim} onAimingChange={e.setAiming} />
      {e.debugText !== null && <pre className={styles.debug}>{e.debugText}</pre>}
    </div>
  );
};

export default Entry;
