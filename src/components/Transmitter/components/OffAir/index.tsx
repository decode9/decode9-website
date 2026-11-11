import { cn } from '@/utils/cn';
import { withBase } from '@/utils/asset';
import shared from '../../shared.module.scss';
import type { OffAirProps } from './interface';
import styles from './styles.module.scss';

/** #s-off: CRT switch-off animation, then "TRANSMISIÓN CERRADA" (remounted on every exit). */
const OffAir = ({ profileUrl, onRecall }: OffAirProps) => (
  <section className={cn(shared.screen, shared.screenOn, styles.off)} aria-label="Transmisión cerrada">
    <div className={styles.crt} />
    <div className={styles.msg}>
      <span className={cn(shared.lbl, shared.amb)}>147.9 · FUERA DEL AIRE</span>
      <span className={cn(shared.big, styles.title)}>
        TRANSMISIÓN
        <br />
        CERRADA
      </span>
      <p className={cn(shared.line, styles.center)}>
        <b>DECODE9:</b> Me quedo en la frecuencia. Cuando quieras volver, enciende el transmisor.
      </p>
      <button type="button" className={shared.send} onClick={onRecall}>
        <span>VOLVER A</span>
        <big>LLAMAR</big>
      </button>
      <a className={cn(shared.send, shared.ghost)} href={withBase(profileUrl)}>
        <span>CONOCER AL</span>
        <big>INVESTIGADOR</big>
      </a>
    </div>
  </section>
);

export default OffAir;
