import { SNIPPETS } from '@/data/profile/snippets';
import { AVERNO, MYSTERY, SUN, SUN_LOGO_URL, WORLDS } from '@/data/profile/worlds';
import { createProfileRuntime, type StageModules, type StagePorts } from '@/lib/three/profile';
import { createWalkie } from '@/lib/three/profile/walkieModel';
import { makeNightModule } from '@/lib/three/profile/night';
import { createWorkstation, type ProfileWorkstation } from '@/lib/three/profile/workstation';
import { formatStatus } from './hooks/stationStatus';
import type { ProfileStageBridge, ProfileStageFactory } from './interface';

/** Adapts the DOM bridge to the runtime ports: element lookup, UI snapshot and the deduped status. */
export const toStagePorts = (bridge: ProfileStageBridge): StagePorts => {
  let statusKey = '';
  return {
    elements: () => ({
      moonHit: bridge.refs.moonHit.current,
      sunHit: bridge.refs.sunHit.current,
      bubble: bridge.refs.bubble.current,
      walkieHint: bridge.refs.walkieHint.current,
      alarm: bridge.refs.alarm.current,
    }),
    getState: () => {
      const s = bridge.getState();
      return { panelOpen: s.panelOpen, walkieOpen: s.walkie.open, walkieStrato: s.walkie.strato, d9: s.d9, reduceMotion: s.reduceMotion };
    },
    onStopProgress: bridge.onStopProgress,
    onReadout: (r) => {
      const { key, status } = formatStatus(r, WORLDS);
      if (key === statusKey) return;
      statusKey = key;
      bridge.onStatus(status);
    },
    onWalkieShown: bridge.onWalkieShown,
    openWalkie: (strato) => bridge.openWalkie(strato),
    closeWalkie: bridge.closeWalkie,
    onAsleep: bridge.onAsleep,
    askD9: bridge.askD9,
    leaveToD9: bridge.leaveToD9,
    revokeD9: bridge.revokeD9,
    goTo: bridge.goTo,
  };
};

/**
 * Stage factory for <ProfileStage />. Modules (`{ workstation, night, walkie, extensions }`, see
 * lib/three/profile/modules.ts) override the defaults: Jorge's workstation, the night mode and the 3D walkie.
 */
export const makeStageFactory =
  (modules: StageModules = {}): ProfileStageFactory =>
  (canvas, bridge) => {
    // The night module drives the workstation (screen off/boot, Jorge hidden while asleep).
    let desk: ProfileWorkstation | null = null;
    const makeWorkstation = createWorkstation({ createCanvas: () => canvas.ownerDocument.createElement('canvas') });
    const runtime = createProfileRuntime({
      canvas,
      data: { worlds: WORLDS, mystery: MYSTERY, averno: AVERNO, sun: SUN, sunLogoUrl: SUN_LOGO_URL, snippets: SNIPPETS },
      ports: toStagePorts(bridge),
      modules: {
        workstation: (ctx) => (desk = makeWorkstation(ctx)),
        night: makeNightModule({ desk: () => desk }),
        walkie: createWalkie,
        ...modules,
      },
    });
    return runtime;
  };
