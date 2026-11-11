import { cn } from '@/utils/cn';
import { CALL_TEXT } from '@/data/transmitter/callScript';
import shared from '../../shared.module.scss';
import SignalMeter from '../SignalMeter';
import TransmissionUnit from '../TransmissionUnit';
import LockScreen from './components/LockScreen';
import TranscriptLine from './components/TranscriptLine';
import useCallScreen from './useCallScreen';
import type { CallScreenProps } from './interface';
import styles from './styles.module.scss';

/** #s-call: lock screen with the incoming call, then the call with its typed transcript. */
const CallScreen = ({ active, status, onToMain }: CallScreenProps) => {
  const { alias, phase, lines, elapsed, portrait, stateLabel, restore, logRef, onPress, answer, onButton, exit } =
    useCallScreen({ active, onToMain });
  const [buttonSmall, buttonBig] = restore ? CALL_TEXT.restore : CALL_TEXT.skip;

  return (
    <section className={cn(shared.screen, active && shared.screenOn)} aria-label="Transmisor de emergencia">
      {phase === 0 ? (
        <LockScreen alias={alias} onPress={onPress} onAnswer={answer} />
      ) : (
        <>
          <div className={shared.bar}>
            <span>{CALL_TEXT.bar}</span>
            <span className={shared.barRight}>
              <span>{stateLabel}</span>
              <button type="button" className={shared.x} onClick={exit} aria-label="Cerrar transmisión">
                ✕
              </button>
            </span>
          </div>
          <TransmissionUnit
            large
            portrait={portrait}
            rows={[
              { label: 'FREC', value: '147.9 MHz' },
              { label: 'ORIGEN', value: 'AVERNO · AV-09' },
              { label: 'SEÑAL', value: <SignalMeter /> },
              { label: 'ESTADO', value: status },
              { label: 'TIEMPO', value: elapsed },
            ]}
          />
          <div ref={logRef} className={`${shared.cut} ${styles.logp}`}>
            <div className={styles.log} aria-live="polite">
              {lines.map(({ id, line, shown, done }) => (
                <TranscriptLine key={id} line={line} shown={shown} done={done} />
              ))}
            </div>
          </div>
          <button type="button" className={cn(shared.send, !restore && shared.ghost)} onClick={onButton}>
            <span>{buttonSmall}</span>
            <big>{buttonBig}</big>
          </button>
        </>
      )}
    </section>
  );
};

export default CallScreen;
