import { SHELL_TEXT } from '@/data/terminal';
import type { TickerProps } from './interface';
import styles from './styles.module.scss';

/** Bottom strip with the motto ticker (original footer.bot #tk). */
const Ticker = ({ style }: TickerProps) => (
  <footer className={styles.bot} aria-hidden="true" data-piece style={style}>
    <span className={styles.tk}>{SHELL_TEXT.ticker}</span>
  </footer>
);

export default Ticker;
