import type { AimCursorProps } from './interface';
import useAimCursor from './useAimCursor';
import styles from './styles.module.scss';

/** Shooter-style crosshair replacing the mouse cursor. */
const AimCursor = ({ enabled, onAimingChange }: AimCursorProps) => {
  const ref = useAimCursor(enabled, onAimingChange, styles.lock, styles.fire);
  return (
    <div ref={ref} className={styles.aim} aria-hidden="true">
      <svg viewBox="0 0 44 44">
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="22" cy="22" r="13" />
          <path d="M22 2v10M22 32v10M2 22h10M32 22h10" />
        </g>
        <circle cx="22" cy="22" r="2" fill="currentColor" />
      </svg>
    </div>
  );
};

export default AimCursor;
