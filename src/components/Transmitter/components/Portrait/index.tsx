/* eslint-disable @next/next/no-img-element -- static export; the three layers must stay plain <img> for the glitch */
import { withBase } from '@/utils/asset';
import { PORTRAIT_BASE } from '@/data/transmitter/portraits';
import { cn } from '@/utils/cn';
import type { PortraitProps } from './interface';
import styles from './styles.module.scss';

const NOISE = `url(${withBase(`${PORTRAIT_BASE}codec-estatica.jpg`)})`;

/**
 * Demonoid portrait with glitch layers. `data-por` lets the transmitter frame loop write the
 * distortion variables (--j, --gx, --no, --c1t…) on it.
 */
const Portrait = ({ image, className }: PortraitProps) => {
  const src = withBase(`${PORTRAIT_BASE}${image}`);
  return (
    <div className={cn(styles.por, className)} data-por="">
      <img className={styles.b} src={src} alt="decode9" />
      <img className={styles.g1} src={src} alt="" />
      <img className={styles.g2} src={src} alt="" />
      <div className={styles.nz} style={{ backgroundImage: NOISE }} />
      <div className={styles.bnd} />
    </div>
  );
};

export default Portrait;
