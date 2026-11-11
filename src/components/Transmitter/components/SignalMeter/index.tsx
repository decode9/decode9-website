import styles from './styles.module.scss';

/** SEÑAL meter: 5 bars; the frame loop marks the dead ones with `data-off`. */
const SignalMeter = () => (
  <span className={styles.sig} data-sig="">
    <i />
    <i />
    <i />
    <i />
    <i />
  </span>
);

export default SignalMeter;
