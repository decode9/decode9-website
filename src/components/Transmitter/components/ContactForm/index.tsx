import { cn } from '@/utils/cn';
import { CONTACT_TEXT } from '@/data/transmitter/channel';
import shared from '../../shared.module.scss';
import useContactForm from './useContactForm';
import styles from './styles.module.scss';

/** Pane 0 · CONTACTO: alias + return channel (email or WhatsApp) + message → SOS receipt. */
const ContactForm = () => {
  const { fields, errors, sending, receipt, onChange, onSubmit, reset } = useContactForm();

  if (receipt) {
    return (
      <div>
        <div className={styles.okHead}>
          <span className={shared.lbl}>CÓDIGO</span>
          <span className={cn(shared.lbl, shared.dim)}>{receipt.meta}</span>
        </div>
        <div className={cn(shared.big, styles.code)}>{receipt.code}</div>
        <p className={shared.line}>
          <b>DECODE9:</b> Te tengo, {receipt.alias}. Tu señal ya está en la mesa del investigador. Jorge te escribe por la
          frecuencia que dejaste.
        </p>
        <p className={shared.line}>
          <b>DECODE9:</b> Mientras tanto no te quedes quieto: gira el dial. Observa, pregunta y pon a prueba lo que encuentres.{' '}
          <b>Cambio.</b>
        </p>
        <button type="button" className={cn(shared.send, shared.ghost, styles.again)} onClick={reset}>
          <span>OTRA</span>
          <big>NUEVA SEÑAL</big>
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className={shared.line}>
        <b>DECODE9:</b> Investigador en campo, dime cómo te llamo y por dónde te encuentro. Una línea basta: el resto lo hablamos en
        persona.
      </p>
      <form noValidate onSubmit={onSubmit}>
        <label className={cn(styles.field, errors.alias && styles.err)}>
          <span>ALIAS</span>
          <input name="alias" autoComplete="nickname" maxLength={24} placeholder="¿cómo te llamo?" value={fields.alias} onChange={onChange} />
        </label>
        <label className={cn(styles.field, errors.regreso && styles.err)}>
          <span>REGRESO</span>
          <input name="regreso" autoComplete="email" maxLength={80} placeholder="correo o WhatsApp" value={fields.regreso} onChange={onChange} />
        </label>
        <label className={styles.field}>
          <span>MENSAJE</span>
          <input name="msg" maxLength={280} placeholder="¿de qué quieres hablar?" value={fields.msg} onChange={onChange} />
        </label>
        <input className={styles.hp} name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" value={fields.web} onChange={onChange} />
        <div className={styles.gap} />
        <button className={shared.send} type="submit" disabled={sending}>
          {sending ? (
            <>
              <span>TRANSMITIENDO</span>
              <big>{CONTACT_TEXT.sendingMorse}</big>
            </>
          ) : (
            <>
              <span>
                UN TOQUE
                <br />Y SALE
              </span>
              <big>ENVIAR SEÑAL</big>
            </>
          )}
        </button>
        <div className={cn(shared.lbl, shared.dim, styles.morse, sending && shared.blink)}>{CONTACT_TEXT.morse}</div>
      </form>
    </div>
  );
};

export default ContactForm;
