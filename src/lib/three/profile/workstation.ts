import * as THREE from 'three';
import type { StageFrame, StageModuleFactory, WorkstationModule } from './modules';
import { createLegacyPointLight, legacyIntensity } from './stage';

/* ---------- pure logic (tested in workstation.test.ts) ---------- */

export const SCREEN_W = 192;
export const SCREEN_H = 120;
export const SCREEN_PALETTE = ['#9fd8ff', '#7fd28e', '#ffb86b', '#c9b6ff', '#eef0ff'] as const;
const MAX_LINES = 10;

/** One line of fake code on the monitor: indent (px), width (px) and colour. */
export interface ScreenLine {
  i: number;
  w: number;
  c: string;
}

/** Scrolls the monitor one line (drawScreen of L1830): keeps the last 10 lines. */
export const pushScreenLine = (lines: ScreenLine[], random: () => number): ScreenLine[] => {
  const next = lines.length >= MAX_LINES ? lines.slice(1) : lines.slice();
  next.push({
    i: Math.floor(random() * 3) * 14,
    w: 30 + random() * 120,
    c: SCREEN_PALETTE[Math.floor(random() * SCREEN_PALETTE.length)],
  });
  return next;
};

/** Seconds between two monitor redraws: fast while Jorge works, slow otherwise. */
export const screenInterval = (working: boolean): number => (working ? 0.16 : 0.5);

/** How hard Jorge types (0.5 at the mystery, 1 while terraforming, 0.3 idle). */
export const typingAmount = (working: boolean, atMystery: boolean): number => (atMystery ? 0.5 : working ? 1 : 0.3);

/** Arm pitch target while typing (arm 0 or 1). */
export const typingArmTarget = (tt: number, arm: number, typing: number): number => -0.62 + Math.sin(tt * 14 + arm * 2) * 0.05 * typing;

/** Arm pitch target while floating ("¡yuhu!": both arms up). */
export const floatArmTarget = (tt: number, arm: number, fl: number): number => -0.62 + fl * (2.45 + Math.sin(tt * 3.2 + arm * 1.6) * 0.16);

/** Cable sag (0.07 on the ground, taut without gravity). */
export const cableSag = (fl: number): number => 0.07 * (1 - fl);

/* ---------- module ---------- */

/** Extra controls the night mode needs (screen off / boot / on, hide the seated Jorge). */
export interface ProfileWorkstation extends WorkstationModule {
  /** 'on' draws code, 'off' and 'boot' leave the canvas to `screenOff` / `screenBoot`. */
  setScreenMode: (mode: 'on' | 'off' | 'boot') => void;
  /** Black monitor and no glow (screenOff, L1951). */
  screenOff: () => void;
  /** Boot animation at progress k 0–1 (screenBoot, L1958). */
  screenBoot: (k: number) => void;
  /** Back to code: mode 'on', full glow, one redraw. */
  screenOn: () => void;
  /** Shows / hides Jorge (legs, body, head, hose and arms), not the desk. */
  setJorgeVisible: (visible: boolean) => void;
}

export interface WorkstationDeps {
  /** Canvas for the monitor texture (DOM-free in tests). */
  createCanvas: () => HTMLCanvasElement;
}

const MONITOR = new THREE.Vector3(0, 0.47, -0.2235);
const GLOW = 0.6;
const SKIN = 0xc98f6a;
const HAIR = 0x2a1d16;
const SHIRT = 0xd9a441;
const PANTS = 0x3b3f58;

/**
 * Jorge's workstation (perfil/index.html L1736–1841 and the station part of the loop L2415–2443):
 * desk, monitor with a CanvasTexture of scrolling code, keyboard, CPU, cables that sag or float,
 * chair with thruster, and voxel Jorge with helmet and arms. Meshes hang from `ctx.station`.
 */
export const createWorkstation =
  ({ createCanvas }: WorkstationDeps): StageModuleFactory<ProfileWorkstation> =>
  ({ station, profile, random }) => {
    const { box, registry } = profile.primitives;
    const owned: THREE.Material[] = [];
    const own = <M extends THREE.Material>(m: M): M => {
      owned.push(m);
      return m;
    };
    const first = station.children.length;

    // escritorio y monitor (pesados: no se mueven)
    box(station, 0.62, 0.04, 0.3, 0x8a5a3c, 0, 0.3, -0.12);
    [
      [-0.28, -0.24],
      [0.28, -0.24],
      [-0.28, 0],
      [0.28, 0],
    ].forEach(([x, z]) => box(station, 0.035, 0.28, 0.035, 0x5d3c28, x, 0.14, z));
    box(station, 0.05, 0.04, 0.05, 0x2b2f3d, 0, 0.34, -0.22);
    box(station, 0.36, 0.23, 0.03, 0x22263a, 0, 0.47, -0.24);
    const scr = createCanvas();
    scr.width = SCREEN_W;
    scr.height = SCREEN_H;
    const sctx = scr.getContext('2d');
    const scrTex = new THREE.CanvasTexture(scr);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.19), own(new THREE.MeshBasicMaterial({ map: scrTex })));
    screen.position.copy(MONITOR);
    station.add(screen);
    const glow = createLegacyPointLight(0x9fd8ff, GLOW, 1.4);
    glow.position.set(0, 0.5, -0.1);
    station.add(glow);
    const setGlow = (k: number) => {
      glow.intensity = legacyIntensity(GLOW * k);
    };

    // teclado (suelto: flota sin gravedad, Jorge lo sujeta)
    const kb = new THREE.Group();
    kb.position.set(0, 0.327, -0.06);
    station.add(kb);
    box(kb, 0.24, 0.015, 0.07, 0x3a3f55, 0, 0, 0);
    for (let r = 0; r < 3; r++) box(kb, 0.2, 0.004, 0.012, 0x6c7290, 0, 0.009, -0.02 + r * 0.02);
    const KB0 = kb.position.clone();

    // CPU en el piso, al lado del escritorio (suelta: flota en el viaje)
    const cpu = new THREE.Group();
    cpu.position.set(-0.43, 0.145, -0.1);
    station.add(cpu);
    box(cpu, 0.13, 0.29, 0.26, 0xc9cee0, 0, 0, 0);
    box(cpu, 0.11, 0.27, 0.006, 0x2a2e40, 0, 0, -0.131);
    for (let i = 0; i < 2; i++) box(cpu, 0.08, 0.025, 0.004, 0x4a4f66, 0, 0.09 - i * 0.035, -0.135);
    registry.leds.push(box(cpu, 0.02, 0.02, 0.006, 0x7fd28e, 0, -0.08, -0.136, true));
    [-1, 1].forEach((sx) => {
      box(cpu, 0.004, 0.2, 0.19, 0x1d2133, sx * 0.066, 0.01, 0.01);
      box(cpu, 0.005, 0.06, 0.06, 0x9fd8ff, sx * 0.067, 0.05, 0.03, true);
      box(cpu, 0.005, 0.06, 0.06, 0xc58bff, sx * 0.067, -0.04, -0.03, true);
    });
    box(cpu, 0.13, 0.02, 0.26, 0x9aa0b8, 0, -0.135, 0);
    const CPU0 = cpu.position.clone();

    // cables: se tensan o cuelgan según la gravedad
    const cableMat = own(new THREE.MeshStandardMaterial({ color: 0x1b1d29, roughness: 0.6 }));
    const cables = [new THREE.Mesh(new THREE.BufferGeometry(), cableMat), new THREE.Mesh(new THREE.BufferGeometry(), cableMat)];
    cables.forEach((c) => station.add(c));
    const tA = new THREE.Vector3();
    const tB = new THREE.Vector3();
    let lastCable = -1;
    const updateCables = (fl: number) => {
      if (fl === 0 && lastCable === 0) return;
      lastCable = fl;
      const sag = cableSag(fl);
      // CPU → monitor
      tA.set(0.04, 0.12, -0.1).applyEuler(cpu.rotation).add(cpu.position);
      const c1 = new THREE.CatmullRomCurve3([
        tA.clone(),
        new THREE.Vector3((tA.x - 0.31) / 2, Math.max(0.02, (tA.y + 0.3) / 2 - sag), -0.25),
        new THREE.Vector3(-0.27, 0.33, -0.275),
        new THREE.Vector3(-0.12, 0.34, -0.27),
        new THREE.Vector3(-0.04, 0.42, -0.258),
      ]);
      // teclado → CPU
      tB.set(-0.08, 0, -0.036).applyEuler(kb.rotation).add(kb.position);
      tA.set(0.04, 0.12, 0.06).applyEuler(cpu.rotation).add(cpu.position);
      const c2 = new THREE.CatmullRomCurve3([
        tB.clone(),
        new THREE.Vector3(tB.x - 0.05, tB.y + 0.01, (tB.z - 0.16) / 2),
        new THREE.Vector3(-0.31, 0.31, -0.1),
        new THREE.Vector3((tA.x - 0.33) / 2, Math.max(0.02, (tA.y + 0.27) / 2 - sag), -0.02),
        tA.clone(),
      ]);
      [c1, c2].forEach((c, i) => {
        cables[i].geometry.dispose();
        cables[i].geometry = new THREE.TubeGeometry(c, 28, 0.007, 5, false);
      });
    };

    // silla y propulsor
    box(station, 0.21, 0.04, 0.21, 0x3b3550, 0, 0.18, 0.13);
    box(station, 0.21, 0.28, 0.04, 0x3b3550, 0, 0.34, 0.24);
    box(station, 0.04, 0.16, 0.04, 0x262233, 0, 0.08, 0.13);
    box(station, 0.12, 0.14, 0.06, 0x6c7290, 0, 0.3, 0.29);
    box(station, 0.04, 0.03, 0.04, 0xff8a3d, -0.03, 0.215, 0.29, true);
    box(station, 0.04, 0.03, 0.04, 0xff8a3d, 0.03, 0.215, 0.29, true);

    // Jorge
    const JB0 = station.children.length;
    [-0.046, 0.046].forEach((x) => {
      box(station, 0.075, 0.075, 0.19, PANTS, x, 0.235, 0.04);
      box(station, 0.075, 0.2, 0.075, PANTS, x, 0.1, -0.06);
      box(station, 0.08, 0.04, 0.11, 0x1e1f2a, x, 0.02, -0.08);
    });
    box(station, 0.19, 0.22, 0.11, SHIRT, 0, 0.38, 0.12);
    const head = new THREE.Group();
    head.position.set(0, 0.575, 0.12);
    station.add(head);
    box(head, 0.165, 0.165, 0.165, SKIN, 0, 0, 0);
    box(head, 0.175, 0.05, 0.175, HAIR, 0, 0.09, 0);
    box(head, 0.175, 0.12, 0.04, HAIR, 0, 0.03, 0.07);
    box(head, 0.03, 0.08, 0.12, HAIR, -0.085, 0.04, 0.03);
    box(head, 0.03, 0.08, 0.12, HAIR, 0.085, 0.04, 0.03);
    box(head, 0.17, 0.03, 0.01, 0x111118, 0, 0.01, -0.086);
    const lens = own(new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.35 }));
    [-0.04, 0.04].forEach((x) => {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.012), lens);
      l.position.set(x, 0.01, -0.09);
      head.add(l);
    });
    // casco de astronauta
    const helmet = new THREE.Mesh(
      new THREE.BoxGeometry(0.27, 0.26, 0.27),
      own(new THREE.MeshStandardMaterial({ color: 0xd6ecff, transparent: true, opacity: 0.2, roughness: 0.05, metalness: 0.2, depthWrite: false })),
    );
    helmet.position.set(0, 0.03, 0);
    head.add(helmet);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(helmet.geometry),
      own(new THREE.LineBasicMaterial({ color: 0xe8f4ff, transparent: true, opacity: 0.55 })),
    );
    edges.position.copy(helmet.position);
    head.add(edges);
    box(head, 0.29, 0.04, 0.29, 0xe8edf7, 0, -0.11, 0);
    box(head, 0.1, 0.03, 0.02, 0xd9a441, 0, -0.11, -0.15);
    const glare = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.11, 0.003),
      own(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 })),
    );
    glare.position.set(-0.085, 0.07, -0.137);
    head.add(glare);
    box(head, 0.012, 0.08, 0.012, 0xb9bed8, 0.1, 0.2, 0.08);
    registry.leds.push(box(head, 0.026, 0.026, 0.026, 0x7fd28e, 0.1, 0.25, 0.08, true));
    // manguera de aire hacia el propulsor
    const hose = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([new THREE.Vector3(0.06, 0.47, 0.25), new THREE.Vector3(0.1, 0.42, 0.29), new THREE.Vector3(0.05, 0.35, 0.32)]),
        12,
        0.012,
        5,
        false,
      ),
      own(new THREE.MeshStandardMaterial({ color: 0xb9bed8, roughness: 0.6 })),
    );
    station.add(hose);
    const arms = [-1, 1].map((s) => {
      const sh = new THREE.Group();
      sh.position.set(s * 0.125, 0.465, 0.12);
      station.add(sh);
      box(sh, 0.06, 0.06, 0.2, SHIRT, 0, 0, -0.09);
      box(sh, 0.055, 0.05, 0.05, SKIN, 0, 0, -0.205);
      sh.rotation.x = -0.62;
      sh.rotation.y = s * 0.12;
      return sh;
    });
    const jorgeParts = station.children.slice(JB0);
    const parts = station.children.slice(first);

    /* ---------- monitor ---------- */
    let screenMode: 'on' | 'off' | 'boot' = 'on';
    let lines: ScreenLine[] = [];
    const paint = (fill: string, x: number, y: number, w: number, h: number) => {
      if (!sctx) return;
      sctx.fillStyle = fill;
      sctx.fillRect(x, y, w, h);
    };
    const drawScreen = () => {
      if (screenMode !== 'on') return;
      lines = pushScreenLine(lines, random);
      paint('#0f1426', 0, 0, SCREEN_W, SCREEN_H);
      lines.forEach((l, n) => paint(l.c, 10 + l.i, 10 + n * 11, l.w, 5));
      paint('#ffb86b', 10, 10 + lines.length * 11, 8, 6);
      scrTex.needsUpdate = true;
    };
    const screenOff = () => {
      paint('#04050a', 0, 0, SCREEN_W, SCREEN_H);
      paint('#1a1f33', 6, 6, 180, 108);
      paint('#04050a', 8, 8, 176, 104);
      scrTex.needsUpdate = true;
      setGlow(0);
    };
    const screenBoot = (k: number) => {
      paint('#04050a', 0, 0, SCREEN_W, SCREEN_H);
      if (k < 0.35) {
        const w = SCREEN_W * (k / 0.35);
        paint('#e8f6ff', 96 - w / 2, 59, w, 2);
      } else if (k < 0.6) {
        const h = SCREEN_H * ((k - 0.35) / 0.25);
        paint('#cfe9ff', 0, 60 - h / 2, SCREEN_W, h);
      } else if (sctx) {
        paint('#0f1426', 0, 0, SCREEN_W, SCREEN_H);
        sctx.fillStyle = '#9fd8ff';
        sctx.font = '700 16px "JetBrains Mono", monospace';
        sctx.fillText('jorge@origen:~$', 12, 30);
        if (k > 0.8) {
          sctx.fillStyle = '#7fd28e';
          sctx.fillText('terraform init', 12, 54);
        }
      }
      scrTex.needsUpdate = true;
      setGlow(Math.min(1, k * 1.6));
    };
    const screenOn = () => {
      screenMode = 'on';
      setGlow(1);
      drawScreen();
    };
    drawScreen();
    updateCables(0);

    /* ---------- animación (bucle L2415–2443) ---------- */
    const vH = new THREE.Vector3();
    let screenClock = 0;
    const update = ({ dt, t: tt, fl, working, atMystery, reduce }: StageFrame) => {
      const bob = reduce ? 0 : 1;
      cpu.position.set(CPU0.x + fl * 0.07, CPU0.y + fl * (0.2 + Math.sin(tt * 1.7) * 0.05 * bob), CPU0.z + fl * Math.sin(tt * 1.1) * 0.03 * bob);
      cpu.rotation.set(fl * Math.sin(tt * 1.3) * 0.2 * bob, fl * Math.sin(tt * 0.7) * 0.25 * bob, fl * (0.25 + Math.sin(tt * 0.9) * 0.12 * bob));
      arms.forEach((ar, i) => {
        ar.rotation.z = -(i ? 1 : -1) * fl * 0.38;
      });
      // el teclado va en la mano derecha
      vH.set(0, 0, -0.21).applyEuler(arms[1].rotation).add(arms[1].position);
      vH.x -= 0.1;
      vH.y += 0.03;
      kb.position.lerpVectors(KB0, vH, Math.min(1, fl * 1.6));
      kb.rotation.set(fl * (0.5 + Math.sin(tt * 2.2) * 0.12 * bob), fl * Math.sin(tt * 0.8) * 0.2 * bob, -fl * 0.12);
      updateCables(fl);
      if (reduce) return;
      if (fl > 0.02) {
        // ¡yuhu!: los dos brazos arriba, el derecho sin soltar el teclado
        arms.forEach((ar, i) => {
          ar.rotation.x += (floatArmTarget(tt, i, fl) - ar.rotation.x) * Math.min(1, dt * 6);
        });
        head.rotation.x = Math.sin(tt * 0.9) * 0.1 * fl;
        head.rotation.y = Math.sin(tt * 0.6) * 0.35 * fl;
      } else {
        const typing = typingAmount(working, atMystery);
        arms.forEach((ar, i) => {
          ar.rotation.x += (typingArmTarget(tt, i, typing) - ar.rotation.x) * Math.min(1, dt * 8);
        });
        head.rotation.x = Math.sin(tt * 1.3) * 0.04;
        head.rotation.y = Math.sin(tt * 0.5) * 0.08;
      }
      screenClock += dt;
      if (screenClock > screenInterval(working)) {
        screenClock = 0;
        drawScreen();
      }
    };

    return {
      monitorOrigin: (out) => station.localToWorld(out.copy(MONITOR)),
      thrusterOrigin: (out) => station.localToWorld(out.set((random() - 0.5) * 0.08, 0.18, 0.3)),
      setScreenMode: (mode) => {
        screenMode = mode;
      },
      screenOff,
      screenBoot,
      screenOn,
      setJorgeVisible: (visible) => jorgeParts.forEach((o) => (o.visible = visible)),
      update,
      // the shared `box` materials belong to primitives; geometries, own materials and the texture are freed here
      dispose: () => {
        parts.forEach((p) => {
          p.removeFromParent();
          p.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
        });
        owned.forEach((m) => m.dispose());
        scrTex.dispose();
      },
    };
  };
