import { useEffect, useRef } from 'react';
import type { ProfileStageBridge, ProfileStageFactory } from '../../interface';

/**
 * Mounts the 3D runtime on the canvas and registers its API on the bridge. If WebGL is not
 * available the factory throws: the DOM keeps its fallbacks (scroll dial, walkie timer).
 */
const useProfileStage = (bridge: ProfileStageBridge, createStage: ProfileStageFactory) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let stage: ReturnType<ProfileStageFactory>;
    try {
      stage = createStage(canvas, bridge);
    } catch (err) {
      console.warn('[perfil] escena 3D no disponible', err);
      return undefined;
    }
    const { resetWorld, resetAll, startNight, endNight } = stage;
    bridge.registerApi({ resetWorld, resetAll, startNight, endNight });
    return () => {
      bridge.registerApi(null);
      stage.dispose();
    };
  }, [bridge, createStage]);

  return { canvasRef };
};

export default useProfileStage;
