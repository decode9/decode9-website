'use client';

import type { ProfileStageProps } from './interface';
import useProfileStage from './useProfileStage';
import styles from './styles.module.scss';

const DEFAULT_LABEL =
  'Galaxia en 3D: Jorge, en versión de bloques y con casco de astronauta, viaja entre planetas áridos y los terraforma programando desde su computador';

/** The 3D journey of /perfil/: the runtime comes from `createStage` and talks to the DOM through `bridge`. */
const ProfileStage = ({ bridge, createStage, label = DEFAULT_LABEL }: ProfileStageProps) => {
  const { canvasRef } = useProfileStage(bridge, createStage);
  return <canvas ref={canvasRef} className={styles.canvas} aria-label={label} />;
};

export default ProfileStage;
