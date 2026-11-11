import styles from './styles.module.scss';
import type { BilingualProps } from './interface';

/** Renders both languages; CSS shows the one selected on the terminal root (original B()). */
const Bi = ({ t }: BilingualProps) => {
  if (typeof t === 'string') return <>{t}</>;
  return (
    <>
      <span className={styles.es}>{t[0]}</span>
      <span className={styles.en}>{t[1]}</span>
    </>
  );
};

export default Bi;
