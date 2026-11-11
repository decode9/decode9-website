import type { FaceProps } from './interface';
import styles from './styles.module.scss';

/** Jorge in the middle: halo plus the canvas where the face frames are drawn. */
const Face = ({ heroRef, canvasRef }: FaceProps) => (
  <div ref={heroRef} className={styles.hero} aria-hidden="true">
    <div className={styles.halo} />
    <canvas ref={canvasRef} className={styles.canvas} />
  </div>
);

export default Face;
