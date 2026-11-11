import type { SunLinkProps } from './interface';
import useSunLink from './useSunLink';
import styles from './styles.module.scss';

/** Link over the 3D sun (the empire logo) to theempire.tech. Positioned per frame by the stage. */
const SunLink = ({ sunRef, href }: SunLinkProps) => {
  const { label } = useSunLink();
  return (
    <a ref={sunRef} className={styles.sun} href={href} target="_blank" rel="noopener" aria-label={label} hidden>
      <span>theempire.tech ↗</span>
    </a>
  );
};

export default SunLink;
