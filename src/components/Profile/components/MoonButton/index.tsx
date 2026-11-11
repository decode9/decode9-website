import { cn } from '@/utils/cn';
import type { MoonButtonProps } from './interface';
import useMoonButton from './useMoonButton';
import styles from './styles.module.scss';

/** Invisible button over the 3D moon: opens the About. */
const MoonButton = ({ moonRef, onToggle, flat }: MoonButtonProps) => {
  const { label } = useMoonButton();
  return (
    <button ref={moonRef} type="button" className={cn(styles.moon, flat && styles.flat)} aria-haspopup="dialog" aria-controls="about" aria-label={label} onClick={onToggle}>
      <span>About</span>
    </button>
  );
};

export default MoonButton;
