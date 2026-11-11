import { LINK_TEXT } from '@/data/terminal/channel';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import type { RadioProps } from './interface';
import styles from './styles.module.scss';
import useRadio from './useRadio';

/** Enlace: transmitter 147.9 with wave, dial and log (original key 'radio'). */
const Radio = (props: RadioProps) => {
  const { canvasRef, dialRef, logRef, lines, bars } = useRadio(props);
  return (
    <div className={content.pane}>
      <div className={styles.radio}>
        <span className={content.lbl}>
          <Bi t={LINK_TEXT.direct} />
        </span>
        <div className={cn(styles.freq, 'glow')}>
          {LINK_TEXT.freq}
          <small>{LINK_TEXT.band}</small>
        </div>
        <canvas className={styles.txwave} ref={canvasRef} />
        <div className={styles.dial} ref={dialRef}>
          {Array.from({ length: bars }, (_, k) => (
            <i key={k} />
          ))}
        </div>
        <div className={styles.txlog} ref={logRef} role="log" aria-live="polite">
          {lines.map((l) => (
            <div key={l.id} className={cn(l.tone === 'ok' && styles.ok, l.tone === 'c' && styles.c)}>
              &gt; <Bi t={l.t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Radio;
