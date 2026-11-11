import { cn } from '@/utils/cn';
import type { WalkieProps } from './interface';
import useWalkie from './useWalkie';
import styles from './styles.module.scss';

/** Jorge's walkie card (contact form + direct frequencies) and the "tap the walkie" hint. */
const Walkie = ({ view, gateway, frequencies, bubbleRef, hintRef, centered, onRestart, onClose }: WalkieProps) => {
  const w = useWalkie(gateway);
  return (
    <>
      <div
        ref={bubbleRef}
        className={cn(styles.bubble, centered && styles.centered)}
        data-on={view.shown ? '' : undefined}
        role="dialog"
        aria-label="Contacto con Jorge"
        aria-hidden={!view.shown}
      >
        <section className={cn(styles.sheet, styles.a)}>
          <p className={styles.whoSays}>
            <i className={styles.rx} />
            Canal abierto · Jorge
          </p>
          <h2>
            ¿Qué <em>mundo</em> construimos ahora?
          </h2>
          <p className={styles.pitch}>Cuéntame tu idea en una línea y déjame tu correo o tu número para responderte.</p>
          <form noValidate onSubmit={w.submit}>
            <label htmlFor="idea" className={styles.sr}>
              Tu idea, tu número o tu correo
            </label>
            <input ref={w.inputRef} id="idea" name="idea" type="text" autoComplete="email" maxLength={600} placeholder="Tu idea, tu número o tu correo" />
            <input ref={w.honeyRef} type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.hp} />
            <button type="submit" aria-label="Enviar" disabled={w.sending}>
              →
            </button>
          </form>
          <p className={styles.note} aria-live="polite">
            {w.note}
          </p>
          <div className={styles.footRow}>
            <button type="button" className={styles.again} onClick={onRestart}>
              ↺ Volver a recorrer la galaxia
            </button>
            <button type="button" className={styles.again} onClick={onClose}>
              Soltar walkie ✕
            </button>
          </div>
        </section>
        <section className={cn(styles.sheet, styles.b)} aria-label="Datos de contacto">
          <p className={styles.whoSays}>Frecuencias directas</p>
          <span className={styles.provD}>datos por confirmar con Jorge</span>
          <ul className={styles.dl}>
            {frequencies.map((f, i) => (
              <li key={f.k}>
                <span className={styles.k}>{f.k}</span>
                <span className={styles.v}>{f.v}</span>
                <button
                  type="button"
                  className={styles.cp}
                  data-copy={f.copy}
                  onClick={(e) => w.copy(i, f.copy, e.currentTarget.previousElementSibling as HTMLElement | null)}
                >
                  {w.copied === i ? 'copiado' : 'copiar'}
                </button>
              </li>
            ))}
          </ul>
          <p className={styles.sig}>{'// señal estable desde la estación de Jorge'}</p>
        </section>
      </div>
      <div ref={hintRef} className={styles.hint}>
        Toca el walkie para hablar con Jorge
      </div>
    </>
  );
};

export default Walkie;
