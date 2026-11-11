import { CALL_TEXT } from '@/data/transmitter/callScript';
import shared from '../../../../shared.module.scss';
import SlideToAnswer from '../SlideToAnswer';
import useLockScreen from './useLockScreen';
import type { LockScreenProps } from './interface';
import styles from './styles.module.scss';

const DOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/** Lock screen with the incoming call: clock, date, greeting, emblem and slide-to-answer. */
const LockScreen = ({ alias, onPress, onAnswer }: LockScreenProps) => {
  const { hours, minutes, date, tag } = useLockScreen(alias);
  return (
    <div className={`${shared.cut} ${styles.lock}`}>
      <div className={shared.holes}>
        <i />
        <i />
        <i />
        <i />
      </div>
      <span className={styles.tag}>{tag}</span>
      <div className={`${shared.dots} ${shared.amber}`} aria-hidden="true">
        {DOTS.map((i) => (
          <i key={i} />
        ))}
      </div>
      <div className={`${shared.cut} ${styles.clock}`} aria-label="Hora local">
        <span className={styles.live}>{CALL_TEXT.live}</span>
        <span className={styles.d}>{hours}</span>
        <small>h</small>
        <span className={styles.d} style={{ marginLeft: 10 }}>
          {minutes}
        </span>
        <small>m</small>
      </div>
      <div className={styles.date}>{date}</div>
      {alias && (
        <div className={styles.hello}>
          <span>{CALL_TEXT.hello}</span>
          <b>{alias}</b>
        </div>
      )}
      <div className={shared.hz} />
      <div className={styles.emb} aria-hidden="true">
        <svg viewBox="0 0 1024 1137">
          <path d="M513,106 L205,283 L205,491 L534,681 L535,574 L299,438 L297,338 L511,213 L726,338 L726,767 L496,900 L496,1008 L818,822 L818,283Z" fill="#ff2b1c" />
          <path d="M837,6 L932,253 L822,319 L855,375 L1019,279Z" fill="#ff2b1c" />
          <path d="M186,6 L4,279 L168,375 L201,319 L91,253Z" fill="#ff2b1c" />
          <path d="M959,595 L866,649 L866,833 L530,1027 L529,1135 L959,887Z" fill="#7a1810" />
          <path d="M64,595 L64,887 L494,1135 L493,1027 L157,833 L157,649Z" fill="#7a1810" />
          <path d="M205,530 L205,637 L456,782 L456,675Z" fill="#7a1810" />
          <path d="M959,355 L866,409 L866,614 L959,561Z" fill="#7a1810" />
          <path d="M64,355 L64,561 L157,614 L157,409Z" fill="#7a1810" />
        </svg>
      </div>
      <div className={shared.hz} />
      <div className={styles.warn}>
        <b className={shared.blink}>{CALL_TEXT.warnTitle}</b>
        <span>
          {CALL_TEXT.warnBody[0]}
          <br />
          {CALL_TEXT.warnBody[1]}
        </span>
      </div>
      <div className={shared.dots} aria-hidden="true">
        {DOTS.map((i) => (
          <i key={i} className={i === 0 || i === 8 ? shared.dotOn : undefined} />
        ))}
      </div>
      <SlideToAnswer label={CALL_TEXT.slide} onPress={onPress} onAnswer={onAnswer} />
    </div>
  );
};

export default LockScreen;
