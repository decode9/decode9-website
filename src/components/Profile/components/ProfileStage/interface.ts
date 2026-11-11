import type { ProfileStageBridge, ProfileStageFactory } from '../../interface';

/** Props of <ProfileStage />: the fixed full-screen WebGL canvas of /perfil/. */
export interface ProfileStageProps {
  /** Contract with the DOM (stable for the life of the page). */
  bridge: ProfileStageBridge;
  /** Builds the 3D runtime on the canvas (injected by the composition root). */
  createStage: ProfileStageFactory;
  /** Accessible description of the scene (aria-label of the original #scene canvas). */
  label?: string;
}
