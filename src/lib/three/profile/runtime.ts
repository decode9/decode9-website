import * as THREE from 'three';
import type { BodyConfig, WorldConfig } from '@/interfaces';
import { createSceneEffects } from './effects';
import {
  cameraBetween,
  floatTowards,
  followScroll,
  scrollToStops,
  segmentAt,
  settledStop,
  stationPose,
  terraformStep,
  toScreen,
} from './journey';
import {
  createNightStub,
  createWorkstationStub,
  type StageContext,
  type StageFrame,
  type StageModule,
  type StageModules,
  type StagePorts,
} from './modules';
import { createProfileScene } from './scene';
import { createProfileStage } from './stage';
import { phaseIndex } from './terraform';
import { createWalkieRig } from './walkie';

export interface ProfileRuntimeData {
  worlds: WorldConfig[];
  mystery: BodyConfig;
  averno: BodyConfig;
  sun: BodyConfig;
  sunLogoUrl: string;
  /** Code lines rising from the monitor (SNIPS). */
  snippets: readonly string[];
}

export interface ProfileRuntimeDeps {
  canvas: HTMLCanvasElement;
  data: ProfileRuntimeData;
  ports: StagePorts;
  modules?: StageModules;
  /** Defaults to the canvas' window. */
  win?: Window;
  random?: () => number;
}

/** Imperative API registered on the bridge (ProfileStageApi). */
export interface ProfileRuntime {
  resetWorld: (index: number) => void;
  resetAll: () => void;
  startNight: (hour: number) => void;
  endNight: () => void;
  dispose: () => void;
}

/**
 * The /perfil/ render loop (L2229–2535): camera flight driven by the scroll, terraform + autopilot,
 * drag to spin, flames and code, walkie flight, sun/moon/hint/bubble placement and the decode9
 * consent checks. Station, night and walkie visuals plug in through `modules` (see modules.ts).
 */
export const createProfileRuntime = ({ canvas, data, ports, modules = {}, win: winIn, random = Math.random }: ProfileRuntimeDeps): ProfileRuntime => {
  const win = winIn ?? canvas.ownerDocument.defaultView ?? window;
  const doc = canvas.ownerDocument;
  const reduce = ports.getState().reduceMotion;
  const stage = createProfileStage({ canvas, pixelRatio: win.devicePixelRatio, onContextRestored: () => win.location.reload() });
  const profile = createProfileScene({ scene: stage.scene, ...data, reduce });
  const { camera } = stage;
  const NW = profile.worldCount;
  const LAST = profile.lastIndex;

  const station = new THREE.Group();
  station.name = 'station';
  station.scale.setScalar(1.3);
  profile.root.add(station);

  const ctx: StageContext = { scene: stage.scene, camera, profile, station, ports, random };
  const workstation = (modules.workstation ?? createWorkstationStub)(ctx);
  const night = (modules.night ?? createNightStub)(ctx);
  const walkie = (modules.walkie ?? createWalkieRig(ports.onWalkieShown))(ctx);
  const extensions: StageModule[] = (modules.extensions ?? []).map((make) => make(ctx));
  const effects = createSceneEffects({ parent: profile.root, snippets: data.snippets, createCanvas: () => doc.createElement('canvas'), random });

  const viewport = { width: win.innerWidth, height: win.innerHeight };
  const resize = () => {
    viewport.width = win.innerWidth;
    viewport.height = win.innerHeight;
    stage.resize(viewport.width, viewport.height);
    profile.computeAnchors(camera.aspect, viewport.height);
  };
  win.addEventListener('resize', resize);
  resize();

  /* ---------- arrastre y toques ---------- */
  let current = 0;
  let drag: { x: number } | null = null;
  let downAt: { x: number; y: number } | null = null;
  const onDown = (e: PointerEvent) => {
    drag = { x: e.clientX };
    downAt = { x: e.clientX, y: e.clientY };
    canvas.dataset.dragging = '';
  };
  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    drag.x = e.clientX;
    profile.dragSpin(current, dx);
  };
  const endDrag = () => {
    drag = null;
    delete canvas.dataset.dragging;
  };
  const onClick = (e: MouseEvent) => {
    if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return;
    if (walkie.hits(e.clientX, e.clientY)) ports.openWalkie(false);
  };
  const onHover = (e: MouseEvent) => {
    if (!drag) canvas.style.cursor = walkie.hits(e.clientX, e.clientY) ? 'pointer' : '';
  };
  // tocar fuera de la tarjeta y del walkie lo devuelve al escritorio
  const onDocDown = (e: PointerEvent) => {
    if (walkie.mode !== 'open' && walkie.mode !== 'out') return;
    const bubble = ports.elements().bubble;
    if (bubble && e.target instanceof Node && bubble.contains(e.target)) return;
    if (e.target === canvas && walkie.hits(e.clientX, e.clientY)) return;
    ports.closeWalkie();
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('mousemove', onHover);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', endDrag);
  doc.addEventListener('pointerdown', onDocDown, true);

  /* ---------- bucle ---------- */
  const vCam = new THREE.Vector3();
  const vLook = new THREE.Vector3();
  const vTmp = new THREE.Vector3();
  const vProj = new THREE.Vector3();
  let last = performance.now();
  let spawnClock = 0;
  let flameClock = 0;
  let advanceAt = 0;
  let fl = 0;
  let hintSeen = false;
  let autoWalkie = false;
  let raf = 0;
  let spS = scrollToStops(win.scrollY, win.innerHeight, LAST);

  const syncWalkie = (open: boolean, strato: boolean) => {
    if (open && (walkie.mode === 'dock' || walkie.mode === 'back')) walkie.open(strato);
    else if (!open && (walkie.mode === 'out' || walkie.mode === 'open')) walkie.close();
  };

  const placeDom = (frame: StageFrame) => {
    const { width: W, height: H } = viewport;
    const el = ports.elements();
    // tarjeta junto al walkie
    if (walkie.mode === 'open' && el.bubble) {
      const s = toScreen(walkie.group.position, camera, W, H, vProj);
      const bw = el.bubble.offsetWidth;
      const bh = el.bubble.offsetHeight;
      let left: number;
      let top: number;
      if (W <= 720) {
        left = (W - bw) / 2;
        top = Math.min(s.y + 64, H - 62 - bh - 12);
        el.bubble.style.setProperty('--ox', '50%');
        el.bubble.style.setProperty('--oy', '0%');
      } else {
        left = Math.max(16, s.x - bw - 60);
        top = Math.min(Math.max(96, s.y - bh * 0.5), H - 46 - bh - 14);
        el.bubble.style.setProperty('--ox', '100%');
        el.bubble.style.setProperty('--oy', '50%');
      }
      el.bubble.style.left = `${left}px`;
      el.bubble.style.top = `${top}px`;
    }
    // pista "toca el walkie" la primera vez que se puede usar
    const w = profile.worlds[current];
    const showHint = walkie.mode === 'dock' && !frame.seg.flying && !hintSeen && current < NW && Boolean(w) && w.p > 0.08;
    if (el.walkieHint) {
      el.walkieHint.toggleAttribute('data-on', showHint);
      if (showHint) {
        const s = toScreen(walkie.group.position, camera, W, H, vProj);
        el.walkieHint.style.left = `${s.x}px`;
        el.walkieHint.style.top = `${s.y - 22}px`;
      }
    }
    if (walkie.mode !== 'dock') hintSeen = true;
    // enlace sobre el sol
    if (el.sunHit) {
      const sun = profile.sunScreenState(camera, viewport);
      const show = sun.visible && walkie.mode === 'dock';
      if (el.sunHit.hidden === show) el.sunHit.hidden = !show;
      if (show) {
        el.sunHit.style.left = `${sun.x}px`;
        el.sunHit.style.top = `${sun.y}px`;
        el.sunHit.style.width = el.sunHit.style.height = `${sun.size}px`;
      }
    }
    // la luna detrás del botón About
    if (el.moonHit) {
      const r = el.moonHit.getBoundingClientRect();
      profile.placeMoon({ left: r.left, top: r.top, width: r.width, height: r.height }, viewport, camera);
    }
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const tt = now / 1000;
    const ui = ports.getState();
    const sp = scrollToStops(win.scrollY, viewport.height, LAST);
    // si alguien baja más allá del contacto sin haber dicho que sí, se le pregunta
    if (!ui.d9.ok && !ui.d9.asking && !ui.d9.leaving && sp > NW + 0.12) ports.askD9();
    if (ui.d9.ok && !ui.d9.leaving && sp < NW - 0.25) ports.revokeD9();
    spS = followScroll(spS, sp, dt, reduce);
    const seg = segmentAt(spS, LAST);
    const settled = settledStop(sp, spS);
    current = seg.current;
    const A = profile.anchors[seg.a];
    const B = profile.anchors[seg.a + 1];
    cameraBetween(A, B, seg.e, vCam, vLook);
    camera.position.copy(vCam);
    camera.lookAt(vLook);
    stationPose(station, seg, A, B, profile.bodies[seg.a], profile.bodies[seg.a + 1], vCam, vLook, tt, reduce);

    const atMystery = !seg.flying && current === NW;
    const working = (!seg.flying && current < NW && profile.worlds[current].p < 1) || atMystery;
    fl = floatTowards(fl, seg.flying, seg.f, dt);
    const fr: StageFrame = { now, dt, t: tt, sp, spS, seg, settled, fl, working, atMystery, reduce, viewport };

    night.update?.(fr, ctx);
    // terraformación del mundo donde está Jorge
    const step = terraformStep(settled >= 0 && settled < NW ? profile.worlds[settled] : undefined, {
      now,
      dt,
      advanceAt,
      reduce,
      hold: ui.panelOpen,
      paused: night.active,
    });
    advanceAt = step.advanceAt;
    if (step.goNext) ports.goTo(settled + 1);

    profile.update({ dt, t: tt, draggingIndex: drag ? current : -1 });
    // al llegar al planeta de fuego (después de decir que sí) se abre decode9
    if (settled === LAST && ui.d9.ok && !ui.d9.leaving && !seg.flying) ports.leaveToD9();

    workstation.update?.(fr, ctx);
    if (!reduce) {
      if (fl > 0.02 && seg.flying && (seg.f < 0.1 || seg.f > 0.9)) {
        flameClock += dt;
        if (flameClock > 0.05) {
          flameClock = 0;
          effects.spawnFlame(workstation.thrusterOrigin(vTmp));
        }
      }
      if (!seg.flying && !night.active) {
        spawnClock += dt;
        if (spawnClock > (working ? 0.85 : 1.8)) {
          spawnClock = 0;
          effects.spawnCode(workstation.monitorOrigin(vTmp));
        }
      }
    }
    effects.update(dt);

    // interfaz
    ports.onReadout({
      index: Math.min(LAST, current),
      countdown: step.countdown,
      flying: seg.flying,
      progress: profile.worlds.map((w) => w.p),
      phase: current < NW ? phaseIndex(profile.worlds[current].p) : 0,
      night: night.active ? night.label : null,
    });
    ports.onStopProgress(spS, !seg.flying && Math.abs(spS - Math.round(spS)) < 0.02);
    // walkie: al llegar al último mundo sale disparado al espacio y baja hasta la cámara
    const atLast = !seg.flying && current === NW && fl < 0.05 && Math.abs(spS - NW) < 0.03;
    if (atLast && !autoWalkie && !ui.panelOpen) {
      autoWalkie = true;
      ports.openWalkie(true);
    }
    if (!atLast && Math.abs(spS - NW) > 0.5) autoWalkie = false;
    if (seg.flying && fl > 0.15 && (walkie.mode === 'open' || walkie.mode === 'out') && ui.walkieStrato) ports.closeWalkie();
    syncWalkie(ui.walkieOpen, ui.walkieStrato);
    camera.updateMatrixWorld();
    walkie.update?.(fr, ctx);
    extensions.forEach((m) => m.update?.(fr, ctx));

    placeDom(fr);
    stage.render();
    raf = win.requestAnimationFrame(frame);
  };
  raf = win.requestAnimationFrame(frame);

  return {
    resetWorld: profile.resetWorld,
    resetAll: profile.resetAll,
    startNight: night.start,
    endNight: night.end,
    dispose: () => {
      win.cancelAnimationFrame(raf);
      win.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('mousemove', onHover);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', endDrag);
      canvas.removeEventListener('pointercancel', endDrag);
      canvas.removeEventListener('pointerleave', endDrag);
      doc.removeEventListener('pointerdown', onDocDown, true);
      [...extensions, walkie, night, workstation].forEach((m) => m.dispose?.());
      effects.dispose();
      profile.dispose();
      stage.dispose();
    },
  };
};
