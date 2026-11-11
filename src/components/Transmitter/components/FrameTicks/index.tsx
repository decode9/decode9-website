import useFrameTicks from './useFrameTicks';
import styles from './styles.module.scss';

/** Thin corner and edge marks around the floating frame. */
const FrameTicks = () => {
  const { svgRef, viewBox, paths } = useFrameTicks();
  return (
    <div className={styles.tick} aria-hidden="true">
      <svg ref={svgRef} viewBox={viewBox} preserveAspectRatio="none">
        {paths.map((d) => (
          <path key={d} d={d} stroke="rgba(255,236,230,.38)" strokeWidth="1" fill="none" />
        ))}
      </svg>
    </div>
  );
};

export default FrameTicks;
