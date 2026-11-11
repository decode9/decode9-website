import type { NightProps } from './interface';
import useNight from './useNight';
import styles from './styles.module.scss';

/** Night mode DOM: hour simulator (?sim=1) and the alarm clock the stage shows/moves (hidden + data-on). */
const Night = ({ alarmRef, showSim, onSimulate }: NightProps) => {
  const { options } = useNight();
  return (
    <>
      <div className={styles.sim} hidden={!showSim}>
        <span>simular hora · temporal</span>
        {options.map((o) => (
          <button
            key={o.h}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSimulate(o.h);
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div ref={alarmRef} className={styles.alarm} aria-hidden="true" hidden>
        <svg viewBox="0 0 64 64">
          <g shapeRendering="crispEdges">
            <rect x="8" y="6" width="14" height="10" fill="#ffd23f" />
            <rect x="42" y="6" width="14" height="10" fill="#ffd23f" />
            <rect x="30" y="4" width="4" height="8" fill="#2a2e40" />
            <rect x="12" y="14" width="40" height="40" fill="#e0552e" />
            <rect x="12" y="14" width="40" height="5" fill="#ff7a5c" />
            <rect x="18" y="20" width="28" height="28" fill="#f6f3ea" />
            <rect x="31" y="24" width="3" height="11" fill="#15182b" />
            <rect x="31" y="33" width="9" height="3" fill="#15182b" />
            <rect x="14" y="54" width="6" height="6" fill="#2a2e40" />
            <rect x="44" y="54" width="6" height="6" fill="#2a2e40" />
          </g>
        </svg>
        <span>RIIING</span>
      </div>
    </>
  );
};

export default Night;
