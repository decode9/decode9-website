import type { D9JumpProps } from './interface';
import useD9JumpDialog from './useD9JumpDialog';
import styles from './styles.module.scss';

/** "¿Quieres ir a decode9?" dialog and the red warp screen with the loading log. */
const D9Jump = ({ asking, warpLog, onAnswer }: D9JumpProps) => {
  const { yesRef, noRef, onKeyDown } = useD9JumpDialog(asking, onAnswer);
  return (
    <>
      <div className={styles.scrim} hidden={!asking} onClick={() => onAnswer(false)} />
      <section className={styles.ask} role="dialog" aria-modal="true" aria-labelledby="d9AskT" aria-describedby="d9AskD" hidden={!asking} onKeyDown={onKeyDown}>
        <span className={styles.k}>
          $ señal entrante <i />
        </span>
        <h2 id="d9AskT">
          ¿Quieres ir a <b>decode9</b>?
        </h2>
        <p id="d9AskD">Es mi versión investigadora. Jorge vuela al planeta de fuego y te abre decode9.</p>
        <div className={styles.row}>
          <button ref={yesRef} type="button" className={styles.yes} onClick={() => onAnswer(true)}>
            Sí, llévame <span aria-hidden="true">→</span>
          </button>
          <button ref={noRef} type="button" className={styles.no} onClick={() => onAnswer(false)}>
            No, me quedo
          </button>
        </div>
      </section>
      <div className={styles.warp} role="status" aria-live="polite" hidden={warpLog === null}>
        <div className={styles.w}>
          <div className={styles.ttl}>decode9</div>
          <div className={styles.log}>{warpLog}</div>
        </div>
      </div>
    </>
  );
};

export default D9Jump;
