import shared from '../../../../shared.module.scss';
import useSlideToAnswer from './useSlideToAnswer';
import type { SlideToAnswerProps } from './interface';
import styles from './styles.module.scss';

/** "DESLIZA PARA CONTESTAR" slider of the incoming call. */
const SlideToAnswer = ({ label, onPress, onAnswer }: SlideToAnswerProps) => {
  const { slideRef, knobRef, knobStyle, onPointerDown, onPointerMove, onPointerUp, onKeyDown } = useSlideToAnswer({
    onPress,
    onAnswer,
  });
  return (
    <div
      ref={slideRef}
      className={`${shared.cut} ${styles.slide}`}
      role="button"
      tabIndex={0}
      aria-label="Desliza para contestar"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div ref={knobRef} className={styles.knob} style={knobStyle}>
        ▶
      </div>
      <div className={styles.txt}>
        <span>{label}</span>
      </div>
    </div>
  );
};

export default SlideToAnswer;
