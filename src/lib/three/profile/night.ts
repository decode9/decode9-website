import * as THREE from 'three';
import type { NightModule, StageContext, StageFrame, StageModuleFactory } from './modules';

/**
 * Night mode (L1842–2137): Jorge sleeps on an asteroid and an alarm clock tied to the pointer wakes him.
 * sleep → ring → wake (no clothes) → hop out of bed (censored) → dress (clothes, jetpack, helmet)
 * → fly to his chair → the monitor boots and the page "wakes up" with him.
 *
 * When it is night (Argentina's hour, `?hora=`) is decided by the DOM with `utils/nightClock`.
 */

/** Seated Jorge and the monitor live in the workstation module; night only switches them. */
export interface NightDesk {
  /** Shows/hides the seated Jorge (`station.children.slice(JB0)` of the original). */
  setJorgeVisible: (visible: boolean) => void;
  /** Stops the code redraw while 'off'/'boot' (screenMode of the original). */
  setScreenMode: (mode: 'on' | 'off' | 'boot') => void;
  /** Monitor off while he sleeps (screenOff). */
  screenOff: () => void;
  /** Boot animation, k 0–1 (screenBoot). */
  screenBoot: (k: number) => void;
  /** Back to the normal screen (screenMode 'on', glow .6, drawScreen). */
  screenOn: () => void;
}

export interface NightDeps {
  /** Resolved lazily (the workstation may be built after this module). Default: toggles a `station` child named "jorge". */
  desk?: (ctx: StageContext) => NightDesk | null | undefined;
  /** Alarm ring sound (Web Audio square beeps of the original). */
  createAudioContext?: () => AudioContext | null;
  win?: Window;
}

type Phase = 'init' | 'sleep' | 'ring' | 'wake' | 'hop' | 'dress' | 'fly' | 'boot' | 'done';

const SKIN = 0xc98f6a;
const HAIR = 0x2a1d16;
const SHIRT = 0xd9a441;
const PANTS = 0x3b3f58;
const CAP = 0x3a6fd8;
const EYE = 0x111118;

const smooth = (x: number) => x * x * (3 - 2 * x);

/** Fallback desk: hides/shows a `station` child named "jorge"; the monitor is left alone. */
const nameDesk = (station: THREE.Object3D): NightDesk => ({
  setJorgeVisible: (v) => {
    const j = station.getObjectByName('jorge');
    if (j) j.visible = v;
  },
  setScreenMode: () => undefined,
  screenOff: () => undefined,
  screenBoot: () => undefined,
  screenOn: () => undefined,
});

const defaultAudio = (win: Window) => (): AudioContext | null => {
  const w = win as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  const Ctor = w.AudioContext ?? w.webkitAudioContext;
  return Ctor ? new Ctor() : null;
};

export const makeNightModule =
  (deps: NightDeps = {}): StageModuleFactory<NightModule> =>
  (ctx) => {
    const { scene, camera, profile, station, ports } = ctx;
    const win = deps.win ?? (typeof window !== 'undefined' ? window : undefined);
    if (!win) throw new Error('night module needs a window');
    const doc = win.document;
    const random = ctx.random;
    const { box } = profile.primitives;
    const desk = () => deps.desk?.(ctx) ?? nameDesk(station);
    const createAudio = deps.createAudioContext ?? defaultAudio(win);

    const state = { active: false, phase: 'done' as Phase, t: 0, hour: 0, label: '', zClock: 0, placed: false, helmPuff: false };
    let reduce = false;

    /* ---------- mallas propias (todo lo que no viene del caché de primitives se libera en dispose) ---------- */
    const own: { dispose: () => void }[] = [];
    const keep = <T extends { dispose: () => void }>(r: T) => {
      own.push(r);
      return r;
    };
    const uMat = (c: number) => keep(new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, flatShading: true }));
    const ubox = (parent: THREE.Object3D, w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) => {
      const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
      o.position.set(x, y, z);
      parent.add(o);
      return o;
    };

    // asteroide
    const nightG = new THREE.Group();
    nightG.name = 'night';
    nightG.visible = false;
    scene.add(nightG);
    {
      const g = new THREE.IcosahedronGeometry(0.62, 1);
      const P = g.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < P.count; i++) {
        v.fromBufferAttribute(P, i);
        const k = 1 + 0.14 * Math.sin(v.x * 7.1) * Math.sin(v.y * 5.3 + 1) * Math.sin(v.z * 6.7 + 2);
        v.multiplyScalar(k);
        v.y = Math.min(v.y, 0.34);
        P.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
      nightG.add(new THREE.Mesh(g, keep(new THREE.MeshStandardMaterial({ color: 0x7a6f82, flatShading: true, roughness: 1 }))));
      const craterMat = keep(new THREE.MeshStandardMaterial({ color: 0x5c5466, flatShading: true }));
      [
        [-0.35, 0, 0.3],
        [0.32, -0.1, 0.32],
        [0.05, -0.3, 0.4],
      ].forEach(([x, y, z]) => {
        const c = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 0), craterMat);
        c.position.set(x, y, z);
        nightG.add(c);
      });
    }

    // cama
    const bedG = new THREE.Group();
    bedG.position.set(-0.1, 0.34, 0);
    nightG.add(bedG);
    box(bedG, 0.66, 0.06, 0.34, 0x8a5a3c, 0, 0.06, 0);
    [
      [-0.3, -0.14],
      [0.3, -0.14],
      [-0.3, 0.14],
      [0.3, 0.14],
    ].forEach(([x, z]) => box(bedG, 0.04, 0.06, 0.04, 0x5d3c28, x, 0.02, z));
    box(bedG, 0.05, 0.2, 0.34, 0x8a5a3c, -0.33, 0.15, 0);
    box(bedG, 0.6, 0.06, 0.3, 0xe9ecf6, 0, 0.12, 0);
    box(bedG, 0.13, 0.05, 0.22, 0xffffff, -0.24, 0.17, 0);
    const blanket = new THREE.Group();
    bedG.add(blanket);
    box(blanket, 0.4, 0.07, 0.32, CAP, 0.1, 0.17, 0);
    box(blanket, 0.4, 0.012, 0.322, 0x9fd8ff, 0.1, 0.206, 0);

    // Jorge dormido, sin ropa: el torso gira sobre la cadera para sentarse
    const sleeper = new THREE.Group();
    sleeper.position.set(-0.08, 0.17, 0);
    bedG.add(sleeper);
    const upper = new THREE.Group();
    sleeper.add(upper);
    const skinMat = uMat(SKIN);
    const nippleMat = uMat(0x8a5a44);
    ubox(upper, 0.17, 0.2, 0.11, skinMat, 0, 0.1, 0);
    ubox(upper, 0.02, 0.02, 0.01, nippleMat, -0.04, 0.15, 0.056);
    ubox(upper, 0.02, 0.02, 0.01, nippleMat, 0.04, 0.15, 0.056);
    const sHead = new THREE.Group();
    sHead.position.set(0, 0.29, 0);
    upper.add(sHead);
    box(sHead, 0.16, 0.16, 0.16, SKIN, 0, 0, 0);
    box(sHead, 0.17, 0.05, 0.17, HAIR, 0, 0.08, 0);
    box(sHead, 0.17, 0.11, 0.04, HAIR, 0, 0.02, -0.065);
    const cap = new THREE.Group();
    cap.position.set(0, 0.11, 0);
    sHead.add(cap);
    box(cap, 0.17, 0.05, 0.17, CAP, 0, 0, 0);
    box(cap, 0.1, 0.06, 0.1, CAP, 0.03, 0.05, 0);
    box(cap, 0.05, 0.05, 0.05, 0xffffff, 0.08, 0.08, 0, true);
    const eyesC = [-0.035, 0.035].map((x) => box(sHead, 0.04, 0.008, 0.01, EYE, x, 0.005, 0.083));
    const eyesO = [-0.035, 0.035].map((x) => {
      const e = box(sHead, 0.03, 0.03, 0.01, EYE, x, 0.01, 0.083);
      e.visible = false;
      return e;
    });
    const sArms = [-1, 1].map((s) => {
      const a = new THREE.Group();
      a.position.set(s * 0.11, 0.17, 0);
      upper.add(a);
      ubox(a, 0.05, 0.2, 0.05, skinMat, 0, -0.09, 0);
      return a;
    });

    // Jorge de pie: primero sin ropa (censurado), luego vestido con jetpack y casco
    const fMat = { legs: uMat(SKIN), torso: uMat(SKIN), sleeve: uMat(SKIN), shoes: uMat(SKIN) };
    const flyer = new THREE.Group();
    flyer.name = 'night-flyer';
    flyer.visible = false;
    scene.add(flyer);
    [-0.046, 0.046].forEach((x) => {
      ubox(flyer, 0.075, 0.2, 0.075, fMat.legs, x, 0.1, 0);
      ubox(flyer, 0.08, 0.035, 0.1, fMat.shoes, x, 0.017, 0.012);
    });
    ubox(flyer, 0.19, 0.22, 0.11, fMat.torso, 0, 0.31, 0);
    const fHead = new THREE.Group();
    fHead.position.set(0, 0.505, 0);
    flyer.add(fHead);
    box(fHead, 0.165, 0.165, 0.165, SKIN, 0, 0, 0);
    box(fHead, 0.175, 0.05, 0.175, HAIR, 0, 0.09, 0);
    box(fHead, 0.175, 0.12, 0.04, HAIR, 0, 0.03, -0.07);
    [-0.04, 0.04].forEach((x) => box(fHead, 0.03, 0.03, 0.01, EYE, x, 0.01, 0.086));
    const fCap = new THREE.Group();
    fCap.position.set(0, 0.115, 0);
    fHead.add(fCap);
    box(fCap, 0.18, 0.05, 0.18, CAP, 0, 0, 0);
    box(fCap, 0.1, 0.06, 0.1, CAP, 0.03, 0.05, 0);
    box(fCap, 0.05, 0.05, 0.05, 0xffffff, 0.08, 0.08, 0, true);
    const fHelm = new THREE.Group();
    fHead.add(fHelm);
    const helmGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.27, 0.26, 0.27),
      keep(new THREE.MeshStandardMaterial({ color: 0xd6ecff, transparent: true, opacity: 0.2, roughness: 0.05, depthWrite: false })),
    );
    helmGlass.position.y = 0.03;
    fHelm.add(helmGlass);
    fHelm.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(helmGlass.geometry),
        keep(new THREE.LineBasicMaterial({ color: 0xe8f4ff, transparent: true, opacity: 0.55 })),
      ).translateY(0.03),
    );
    box(fHelm, 0.29, 0.04, 0.29, 0xe8edf7, 0, -0.11, 0);
    const fPack = new THREE.Group();
    fPack.position.set(0, 0.32, -0.09);
    flyer.add(fPack);
    box(fPack, 0.13, 0.16, 0.07, 0x6c7290, 0, 0, 0);
    box(fPack, 0.04, 0.03, 0.04, 0xff8a3d, -0.03, -0.095, 0, true);
    box(fPack, 0.04, 0.03, 0.04, 0xff8a3d, 0.03, -0.095, 0, true);
    const fStraps = new THREE.Group();
    flyer.add(fStraps);
    [-0.05, 0.05].forEach((x) => box(fStraps, 0.025, 0.2, 0.01, 0x2a2e40, x, 0.32, 0.058));
    box(fStraps, 0.13, 0.025, 0.01, 0x2a2e40, 0, 0.36, 0.059);
    const fArms = [-1, 1].map((s) => {
      const a = new THREE.Group();
      a.position.set(s * 0.125, 0.4, 0);
      flyer.add(a);
      ubox(a, 0.06, 0.2, 0.06, fMat.sleeve, 0, -0.09, 0);
      box(a, 0.055, 0.05, 0.05, SKIN, 0, -0.2, 0);
      return a;
    });
    const dress = (on: boolean) => {
      fMat.legs.color.setHex(on ? PANTS : SKIN);
      fMat.torso.color.setHex(on ? SHIRT : SKIN);
      fMat.sleeve.color.setHex(on ? SHIRT : SKIN);
      fMat.shoes.color.setHex(on ? 0x1e1f2a : SKIN);
      fHelm.visible = on;
      fPack.visible = on;
      fStraps.visible = on;
      fCap.visible = !on;
      fPack.position.set(0, 0.32, -0.09);
      fHelm.position.set(0, 0, 0);
      fHelm.scale.setScalar(1);
    };

    /* ---------- sprites: censura, zetas, «!» y bocanadas ---------- */
    const archivo = () => win.getComputedStyle(doc.body).getPropertyValue('--font-archivo').trim() || '"Archivo"';
    const spriteMat = (c: HTMLCanvasElement, extra: THREE.SpriteMaterialParameters) =>
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, ...extra });
    const disposeSprite = (s: THREE.Sprite) => {
      s.removeFromParent();
      s.material.map?.dispose();
      s.material.dispose();
    };

    // censura en mosaico (siempre mirando a la cámara)
    const censor = (() => {
      const c = doc.createElement('canvas');
      c.width = 320;
      c.height = 128;
      const x = c.getContext('2d');
      if (x) {
        x.fillStyle = '#0b0b0d';
        x.fillRect(0, 0, 320, 128);
        x.strokeStyle = '#ffffff';
        x.lineWidth = 6;
        x.strokeRect(9, 9, 302, 110);
        x.fillStyle = '#ffffff';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        let fz = 60;
        do {
          x.font = `900 ${fz}px ${archivo()}, "Arial Black", sans-serif`;
          fz -= 2;
        } while (x.measureText('CENSURADO').width > 270 && fz > 20);
        x.fillText('CENSURADO', 160, 67);
      }
      const s = new THREE.Sprite(spriteMat(c, { depthTest: false }));
      s.renderOrder = 20;
      s.visible = false;
      scene.add(s);
      return s;
    })();
    const textSprite = (txt: string, color: string, h: number) => {
      const c = doc.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const x = c.getContext('2d');
      if (x) {
        x.font = `800 52px ${archivo()}, sans-serif`;
        x.fillStyle = color;
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText(txt, 32, 34);
      }
      const s = new THREE.Sprite(spriteMat(c, { depthWrite: false }));
      s.scale.set(h, h, 1);
      return s;
    };

    interface Z {
      s: THREE.Sprite;
      t: number;
      life: number;
      vx: number;
      base: number;
    }
    interface Puff {
      m: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
      t: number;
      life: number;
      v: THREE.Vector3;
    }
    const zs: Z[] = [];
    const puffs: Puff[] = [];
    const puffGeo = keep(new THREE.BoxGeometry(0.035, 0.035, 0.035));
    const spawnZ = () => {
      const s = textSprite('z', '#c9d4ff', 0.12);
      sHead.getWorldPosition(s.position);
      s.position.y += 0.14;
      scene.add(s);
      zs.push({ s, t: 0, life: 2.4, vx: 0.08 + random() * 0.06, base: nightG.scale.x });
    };
    const spawnPuffs = (at: THREE.Vector3, n: number) => {
      for (let i = 0; i < n; i++) {
        const m = new THREE.Mesh(puffGeo, new THREE.MeshBasicMaterial({ color: i % 3 ? 0xffffff : 0xffd23f, transparent: true }));
        m.position.copy(at);
        const a = random() * Math.PI * 2;
        const e = random() * 0.8;
        scene.add(m);
        puffs.push({ m, t: 0, life: 0.6 + random() * 0.4, v: new THREE.Vector3(Math.cos(a) * 0.5, 0.2 + e * 0.5, Math.sin(a) * 0.5) });
      }
    };
    const bang = textSprite('!', '#ffb86b', 0.3);
    bang.visible = false;
    scene.add(bang);

    /* ---------- despertador atado al puntero ---------- */
    const ptr = { x: win.innerWidth * 0.5, y: win.innerHeight * 0.45 };
    const onPointerMove = (e: PointerEvent) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
    };
    win.addEventListener('pointermove', onPointerMove, { passive: true });
    const touchOnly = win.matchMedia?.('(hover: none)');
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = win.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    };
    let ringT = 0;
    let ringCtx: AudioContext | null = null;
    const ringSound = () => {
      try {
        ringCtx = ringCtx ?? createAudio();
        if (!ringCtx) return;
        void ringCtx.resume();
        const t0 = ringCtx.currentTime;
        for (let i = 0; i < 10; i++) {
          const o = ringCtx.createOscillator();
          const g = ringCtx.createGain();
          o.type = 'square';
          o.frequency.value = i % 2 ? 1320 : 1180;
          const t = t0 + i * 0.14 + Math.floor(i / 2) * 0.12;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.035, t + 0.01);
          g.gain.linearRampToValueAtTime(0, t + 0.1);
          o.connect(g).connect(ringCtx.destination);
          o.start(t);
          o.stop(t + 0.12);
        }
      } catch {
        /* sin audio */
      }
    };
    const alarmEl = () => ports.elements().alarm;
    const showAlarm = () => {
      const a = alarmEl();
      if (!a) return;
      a.hidden = false;
      win.requestAnimationFrame(() => a.setAttribute('data-on', ''));
    };
    const hideAlarm = (delay = 0) => {
      const a = alarmEl();
      if (!a) return;
      a.removeAttribute('data-on');
      if (delay) later(() => (a.hidden = true), delay);
      else a.hidden = true;
    };

    /* ---------- estados ---------- */
    const pageAsleep = (on: boolean) => ports.onAsleep(on);

    const placeAsteroid = () => {
      const narrow = win.innerWidth <= 720;
      camera.updateMatrixWorld();
      const o = profile.bodies[0].group.getWorldPosition(new THREE.Vector3());
      const d = camera.position.distanceTo(o) * (narrow ? 0.8 : 0.86);
      const v = new THREE.Vector3(narrow ? 0.52 : 0.6, narrow ? 0.3 : 0.28, 0.5).unproject(camera).sub(camera.position).normalize();
      nightG.position.copy(camera.position).addScaledVector(v, d);
      nightG.userData.base = nightG.position.clone();
      nightG.rotation.set(0, -0.35, 0);
      nightG.scale.setScalar((narrow ? 0.62 : 0.78) * 0.7);
      state.placed = true;
    };

    const clearZs = () => {
      zs.forEach((z) => disposeSprite(z.s));
      zs.length = 0;
    };

    const start = (hour: number) => {
      Object.assign(state, { active: true, phase: 'init', t: 0, hour, placed: false });
      const w0 = profile.worlds[0];
      if (w0) {
        w0.p = 0;
        w0.advanced = false;
      }
      desk().setJorgeVisible(false);
      nightG.visible = true;
      sleeper.visible = true;
      flyer.visible = false;
      bang.visible = false;
      censor.visible = false;
      upper.rotation.z = Math.PI / 2;
      sHead.rotation.set(0, 0, 0);
      eyesC.forEach((e) => (e.visible = true));
      eyesO.forEach((e) => (e.visible = false));
      cap.visible = true;
      sArms.forEach((a) => (a.rotation.z = 0));
      blanket.position.set(0, 0, 0);
      blanket.rotation.set(0, 0, 0);
      desk().setScreenMode('off');
      desk().screenOff();
      pageAsleep(true);
    };

    const end = (skip = true) => {
      if (!state.active && !skip) return;
      state.active = false;
      state.phase = 'done';
      desk().setJorgeVisible(true);
      flyer.visible = false;
      bang.visible = false;
      censor.visible = false;
      if (skip) nightG.visible = false;
      hideAlarm();
      win.clearTimeout(ringT);
      clearZs();
      desk().screenOn();
      pageAsleep(false);
    };

    const wakeNow = () => {
      if (state.active && (state.phase === 'sleep' || state.phase === 'ring')) {
        ringSound();
        state.phase = 'wake';
        state.t = 0;
      }
    };
    const onPointerDown = () => {
      if (state.active && state.phase === 'ring') wakeNow();
    };
    win.addEventListener('pointerdown', onPointerDown, true);

    /* ---------- cuadro a cuadro ---------- */
    const vFrom = new THREE.Vector3();
    const vTo = new THREE.Vector3();
    const vMid = new THREE.Vector3();
    const vTmp = new THREE.Vector3();
    const qFrom = new THREE.Quaternion();
    const STAND = new THREE.Vector3(0.5, 0.06, 0.1);

    const sleepPhases = (fr: StageFrame, hh: string) => {
      const { dt, t: tt } = fr;
      if (state.phase === 'sleep') {
        state.label = `Jorge duerme · ${hh}`;
        upper.rotation.z = Math.PI / 2 + Math.sin(tt * 1.6) * 0.015;
        state.zClock += dt;
        if (state.zClock > 0.85) {
          state.zClock = 0;
          spawnZ();
        }
        if (state.t > 2.2) {
          state.phase = 'ring';
          state.t = 0;
          showAlarm();
          ringSound();
          ringT = later(ringSound, 1300);
        }
      } else {
        state.label = '¡suena el despertador!';
        upper.rotation.z = Math.PI / 2 + Math.sin(tt * 18) * 0.03;
        state.zClock += dt;
        if (state.zClock > 1.4) {
          state.zClock = 0;
          spawnZ();
        }
        if (state.t > 2.8) {
          state.phase = 'wake';
          state.t = 0;
        }
      }
    };

    const wakePhase = (s: number) => {
      state.label = 'despertando…';
      const a = alarmEl();
      if (state.t > 0.45 && a && !a.hidden && a.hasAttribute('data-on')) hideAlarm(300);
      const k = smooth(Math.min(1, state.t / 0.6));
      upper.rotation.z = (Math.PI / 2) * (1 - k);
      eyesC.forEach((e) => (e.visible = state.t < 0.3));
      eyesO.forEach((e) => (e.visible = state.t >= 0.3));
      bang.visible = state.t > 0.3 && state.t < 1.1;
      if (bang.visible) {
        sHead.getWorldPosition(bang.position);
        bang.position.y += (0.26 * s) / 0.55;
        bang.scale.setScalar((0.3 * s) / 0.55);
      }
      const st = Math.max(0, Math.min(1, (state.t - 0.7) / 0.5));
      sArms.forEach((arm, i) => (arm.rotation.z = (i ? -1 : 1) * Math.PI * 0.85 * Math.sin(st * Math.PI)));
      sHead.rotation.y = Math.sin(Math.max(0, state.t - 1.1) * 9) * 0.25;
      if (state.t > 1.5) {
        state.phase = 'hop';
        state.t = 0;
        bang.visible = false;
        sleeper.getWorldPosition(vFrom);
        sleeper.visible = false;
        flyer.visible = true;
        dress(false);
        flyer.scale.setScalar(s);
        bedG.localToWorld(vTo.copy(STAND));
        fArms.forEach((arm) => arm.rotation.set(0, 0, 0));
      }
    };

    const hopPhase = (s: number) => {
      state.label = 'saltando de la cama';
      const k = Math.min(1, state.t / 0.8);
      const e2 = smooth(k);
      bedG.localToWorld(vTo.copy(STAND));
      flyer.position.lerpVectors(vFrom, vTo, e2);
      flyer.position.y += Math.sin(Math.PI * k) * 0.35 * s;
      flyer.quaternion.copy(nightG.quaternion);
      flyer.rotateY(0.5);
      blanket.position.x = 0.12 * e2;
      blanket.rotation.z = -0.25 * e2;
      blanket.position.y = 0.03 * e2;
      fArms.forEach((arm, i) => (arm.rotation.z = (i ? -1 : 1) * 0.6 * Math.sin(Math.PI * k)));
      censor.visible = k > 0.15;
      if (k >= 1) {
        state.phase = 'dress';
        state.t = 0;
      }
    };

    const dressPhase = () => {
      state.label = 'vistiéndose';
      bedG.localToWorld(vTo.copy(STAND));
      flyer.position.copy(vTo);
      const t = state.t;
      // se da la vuelta un momento para mostrar cómo se pone el jetpack
      const turn = t > 1 && t < 1.9 ? Math.sin((Math.PI * (t - 1)) / 0.9) : 0;
      flyer.quaternion.copy(nightG.quaternion);
      flyer.rotateY(0.5 + turn * 2.3);
      // brazo derecho agarra el cartel y lo quita
      fArms[1].rotation.x = t > 0.35 && t < 1 ? -1.6 * Math.sin((Math.PI * (t - 0.35)) / 0.65) : 0;
      if (t > 0.7 && fCap.visible) {
        dress(true);
        fPack.visible = false;
        fStraps.visible = false;
        fHelm.visible = false;
        spawnPuffs(flyer.localToWorld(vTmp.set(0, 0.3, 0.05)), 12);
      }
      // jetpack: baja y se ajusta a la espalda
      if (t > 1.05) {
        const q = smooth(Math.min(1, (t - 1.05) / 0.45));
        fPack.visible = true;
        fPack.position.set(0, 0.32 + (1 - q) * 0.45, -0.09 - (1 - q) * 0.12);
        fStraps.visible = q > 0.85;
        if (t < 1.6) fArms.forEach((arm) => (arm.rotation.x = -1.1 * Math.sin(Math.PI * Math.min(1, (t - 1.05) / 0.55))));
      }
      // casco: baja sobre la cabeza
      if (t > 1.75) {
        const q = smooth(Math.min(1, (t - 1.75) / 0.4));
        fHelm.visible = true;
        fHelm.position.set(0, (1 - q) * 0.3, 0);
        fHelm.scale.setScalar(1 + (1 - q) * 0.25);
        fArms.forEach((arm) => (arm.rotation.x = -2.4 * Math.sin(Math.PI * Math.min(1, (t - 1.75) / 0.4))));
        if (q >= 1 && !state.helmPuff) {
          state.helmPuff = true;
          spawnPuffs(flyer.localToWorld(vTmp.set(0, 0.55, 0)), 8);
        }
      }
      if (t > 2.4) {
        state.phase = 'fly';
        state.t = 0;
        state.helmPuff = false;
        vFrom.copy(flyer.position);
        qFrom.copy(flyer.quaternion);
        fArms.forEach((arm) => (arm.rotation.x = 0));
      }
    };

    const flyPhase = (s: number, tt: number) => {
      state.label = 'volando a Origen';
      const k = Math.min(1, state.t / 2.4);
      const e2 = smooth(k);
      station.localToWorld(vTo.set(0, 0.16, 0.12));
      vMid.lerpVectors(vFrom, vTo, 0.5);
      vMid.y += 0.75;
      const u = 1 - e2;
      flyer.position
        .set(0, 0, 0)
        .addScaledVector(vFrom, u * u)
        .addScaledVector(vMid, 2 * u * e2)
        .addScaledVector(vTo, e2 * e2);
      flyer.scale.setScalar(THREE.MathUtils.lerp(s, 1.3, e2));
      flyer.quaternion.copy(qFrom).slerp(station.getWorldQuaternion(new THREE.Quaternion()), e2);
      flyer.rotateY(Math.PI * 2 * e2);
      flyer.rotateZ(Math.sin(Math.PI * k) * 0.35);
      fArms.forEach((arm, i) => {
        arm.rotation.x = 0;
        arm.rotation.z = (i ? -1 : 1) * (2.6 + Math.sin(tt * 8 + i) * 0.15) * Math.sin(Math.PI * Math.min(1, k * 1.15));
      });
      if (k >= 1) {
        state.phase = 'boot';
        state.t = 0;
        flyer.visible = false;
        desk().setJorgeVisible(true);
        desk().setScreenMode('boot');
        pageAsleep(false);
      }
    };

    const bootPhase = () => {
      state.label = 'encendiendo el sistema';
      const k = Math.min(1, state.t / 1.1);
      desk().screenBoot(k);
      if (k >= 1) {
        state.active = false;
        state.phase = 'done';
        desk().screenOn();
      }
    };

    // cartel CENSURADO: tapa de la cintura a los muslos; al vestirse lo levanta y lo lanza como un letrero
    const placeCensor = () => {
      if (!censor.visible) return;
      const fs = flyer.scale.x;
      const W = 0.62 * fs;
      const H = 0.25 * fs;
      if (state.phase === 'dress' && state.t > 0.35) {
        const q = Math.min(1, (state.t - 0.35) / 0.75);
        vTmp.set(0.04 + q * 0.35, 0.17 + Math.sin(Math.min(1, q * 1.6) * (Math.PI / 2)) * 0.38 - Math.max(0, q - 0.6) * 0.5, 0.12);
        censor.position.copy(flyer.localToWorld(vTmp));
        censor.material.rotation = -q * 2.2;
        censor.scale.set(W * (1 - q * 0.3), H * (1 - q * 0.3), 1);
        censor.material.opacity = q < 0.7 ? 1 : Math.max(0, 1 - (q - 0.7) / 0.3);
        if (q >= 1) {
          censor.visible = false;
          censor.material.opacity = 1;
          censor.material.rotation = 0;
        }
      } else {
        censor.position.copy(flyer.localToWorld(vTmp.set(0, 0.17, 0.12)));
        censor.scale.set(W, H, 1);
        censor.material.rotation = 0;
      }
    };

    const particles = (dt: number, s: number) => {
      for (let i = zs.length - 1; i >= 0; i--) {
        const z = zs[i];
        z.t += dt;
        const q = z.t / z.life;
        z.s.position.y += dt * 0.16;
        z.s.position.x += z.vx * dt;
        z.s.material.opacity = Math.sin(Math.min(1, q) * Math.PI);
        z.s.scale.setScalar(((0.09 + q * 0.09) * z.base) / 0.55);
        if (q >= 1) {
          disposeSprite(z.s);
          zs.splice(i, 1);
        }
      }
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.t += dt;
        const q = p.t / p.life;
        p.m.position.addScaledVector(p.v, dt * s);
        p.m.scale.setScalar((Math.max(0.01, 1 - q) * s) / 0.55);
        p.m.material.opacity = 1 - q;
        if (q >= 1) {
          p.m.removeFromParent();
          p.m.material.dispose();
          puffs.splice(i, 1);
        }
      }
    };

    const followPointer = (vw: number, vh: number) => {
      const a = alarmEl();
      if (!a || a.hidden) return;
      // en celular no hay puntero: el despertador suena junto a la cama
      const touch = touchOnly?.matches ?? false;
      const ax = touch ? Math.round(vw * 0.56) : Math.min(ptr.x + 18, vw - 120);
      const ay = touch ? Math.round(vh * 0.22) : Math.min(ptr.y + 14, vh - 120);
      a.style.transform = `translate(${ax.toFixed(0)}px, ${ay.toFixed(0)}px)`;
    };

    const update = (fr: StageFrame) => {
      reduce = fr.reduce;
      if (!state.active) return;
      if (fr.settled !== 0 && fr.settled !== -1) {
        end(true);
        return;
      }
      if (!state.placed) placeAsteroid();
      state.t += fr.dt;
      const tt = fr.t;
      const b = nightG.userData.base as THREE.Vector3 | undefined;
      if (b && !reduce) {
        nightG.position.set(b.x + Math.sin(tt * 0.4) * 0.04, b.y + Math.sin(tt * 0.9) * 0.07, b.z);
        nightG.rotation.set(Math.sin(tt * 0.5) * 0.05, -0.35 + Math.sin(tt * 0.3) * 0.1, Math.sin(tt * 0.7) * 0.04);
      }
      const s = nightG.scale.x;
      const hh = `${String(state.hour).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
      switch (state.phase) {
        case 'init':
          state.phase = 'sleep';
          state.t = 0;
          break;
        case 'sleep':
        case 'ring':
          sleepPhases(fr, hh);
          break;
        case 'wake':
          wakePhase(s);
          break;
        case 'hop':
          hopPhase(s);
          break;
        case 'dress':
          dressPhase();
          break;
        case 'fly':
          flyPhase(s, tt);
          break;
        case 'boot':
          bootPhase();
          break;
        default:
          break;
      }
      placeCensor();
      particles(fr.dt, s);
      followPointer(fr.viewport.width, fr.viewport.height);
    };

    const disposeTree = (root: THREE.Object3D) => {
      root.traverse((o) => {
        const g = (o as THREE.Mesh).geometry as THREE.BufferGeometry | undefined;
        g?.dispose();
      });
      root.removeFromParent();
    };

    const dispose = () => {
      win.removeEventListener('pointermove', onPointerMove);
      win.removeEventListener('pointerdown', onPointerDown, true);
      timers.forEach((id) => win.clearTimeout(id));
      timers.clear();
      if (state.active) hideAlarm();
      clearZs();
      puffs.forEach((p) => {
        p.m.removeFromParent();
        p.m.material.dispose();
      });
      puffs.length = 0;
      disposeSprite(censor);
      disposeSprite(bang);
      disposeTree(nightG);
      disposeTree(flyer);
      own.forEach((r) => r.dispose());
      void ringCtx?.close().catch(() => undefined);
      ringCtx = null;
    };

    return {
      get active() {
        return state.active;
      },
      get label() {
        return state.label;
      },
      start,
      end: () => end(true),
      update,
      dispose,
    };
  };

/** Night module with the default desk (station child named "jorge"; monitor untouched). */
export const createNightModule: StageModuleFactory<NightModule> = makeNightModule();
