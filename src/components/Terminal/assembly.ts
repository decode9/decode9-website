/** Delays (ms) and slide offsets (px) of the post-login assembly (original assemble()). */
export interface AssemblyPlan {
  top: number;
  menu: number[];
  hud: number[];
  navfoot: number;
  bottom: number;
  background: number;
  stage: number;
  total: number;
}

export const ASSEMBLY_OFFSETS = { menu: -30, hud: 30, navfoot: -20, bottom: 0, top: 0 } as const;

export const planAssembly = (menuCount: number, hudCount: number, reduceMotion: boolean): AssemblyPlan => {
  const step = reduceMotion ? 0 : 70;
  let t = 0;
  const top = t;
  t += 140;
  const menu = Array.from({ length: menuCount }, () => {
    const d = t;
    t += step;
    return d;
  });
  t += 60;
  const hud = Array.from({ length: hudCount }, () => {
    const d = t;
    t += step;
    return d;
  });
  const navfoot = t;
  t += step;
  const bottom = t;
  t += step;
  return { top, menu, hud, navfoot, bottom, background: t * 0.4, stage: t, total: t };
};
