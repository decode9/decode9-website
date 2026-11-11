import { cn } from '@/utils/cn';
import { PANE_INTROS, STATIONS } from '@/data/transmitter/stations';
import shared from '../../shared.module.scss';
import Dial from '../Dial';
import SignalMeter from '../SignalMeter';
import TransmissionUnit from '../TransmissionUnit';
import type { MainScreenProps } from './interface';
import styles from './styles.module.scss';

/** #s-main: unit, the 4 pane slots (one per station), the dial and the toast. */
const MainScreen = ({
  active,
  status,
  station,
  portrait,
  panes = [],
  overlays,
  toastMessage,
  toastVisible,
  onTune,
  onClick,
  onPress,
  onExit,
  getTilt,
}: MainScreenProps) => {
  const current = STATIONS[station];
  return (
    <section className={cn(shared.screen, active && shared.screenOn)} aria-label="Transmisor">
      <div className={shared.bar}>
        <span>{`${current.freq} · ${current.name}`}</span>
        <span className={shared.barRight}>
          <span>{`● ${status}`}</span>
          <button type="button" className={shared.x} onClick={onExit} aria-label="Cerrar transmisión">
            ✕
          </button>
        </span>
      </div>
      <TransmissionUnit
        portrait={portrait}
        rows={[
          { label: 'FREC', value: `${current.freq} MHz` },
          { label: 'CANAL', value: current.name },
          { label: 'SEÑAL', value: <SignalMeter /> },
          { label: 'ESTADO', value: status },
        ]}
      />
      <div className={`${shared.cut} ${styles.panes}`}>
        {STATIONS.map((s, i) => (
          <div key={s.name} className={cn(styles.pane, i === station && styles.paneOn)} data-pane={i}>
            {panes[i] ?? (
              <p className={shared.line}>
                <b>DECODE9:</b> {PANE_INTROS[i]}
              </p>
            )}
          </div>
        ))}
      </div>
      <Dial station={station} onTune={onTune} onClick={onClick} onPress={onPress} getTilt={getTilt} active={active} />
      <div className={cn(styles.toast, toastVisible && styles.toastOn)} role="status">
        {toastMessage}
      </div>
      {overlays}
    </section>
  );
};

export default MainScreen;
