export type LoadMilestone = 'fonts' | 'page' | 'stage' | 'model';

export type StageStatus = 'pending' | 'webgl' | 'fallback';

export type BootPhase = 'loading' | 'revealed';

export interface BootState {
  /** 0–1, weighted by milestone. */
  progress: number;
  stage: StageStatus;
  phase: BootPhase;
}

export interface BootSequence {
  get: () => BootState;
  complete: (milestone: LoadMilestone) => void;
  setStage: (stage: StageStatus) => void;
  reveal: () => void;
  subscribe: (listener: (state: BootState) => void) => () => void;
}

const WEIGHTS: Record<LoadMilestone, number> = { fonts: 0.2, page: 0.2, stage: 0.25, model: 0.35 };

/**
 * What the first seconds of a visit are waiting for: fonts, the page, the
 * WebGL runtime and the 3D mark. The preloader shows this progress and the
 * stage assembles the mark with it; `reveal` hands over to the tour.
 */
const createBootSequence = (initialPhase: BootPhase = 'loading'): BootSequence => {
  const done = new Set<LoadMilestone>();
  let state: BootState = { progress: 0, stage: 'pending', phase: initialPhase };
  const listeners = new Set<(state: BootState) => void>();

  const update = (patch: Partial<BootState>) => {
    const next = { ...state, ...patch };
    if (next.progress === state.progress && next.stage === state.stage && next.phase === state.phase) return;
    state = next;
    listeners.forEach((listener) => listener(state));
  };

  const complete = (milestone: LoadMilestone) => {
    done.add(milestone);
    update({ progress: [...done].reduce((sum, item) => sum + WEIGHTS[item], 0) });
  };

  return {
    get: () => state,
    complete,
    setStage: (stage) => {
      update({ stage });
      // Without WebGL there is nothing else to wait for on the stage side.
      if (stage === 'fallback') {
        complete('stage');
        complete('model');
      }
    },
    reveal: () => update({ phase: 'revealed' }),
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export default createBootSequence;
