import { cn } from '@/utils/cn';
import NewsTicker from './components/NewsTicker';
import type { FooterProps } from './interface';
import useFooter from './useFooter';
import styles from './styles.module.scss';

/** Bottom bar: terraform progress, home, replay, ambient sound and the "Actualidad" ticker. */
const Footer = ({ progress, replayDisabled, homeHref, onReplay, sound, news, tick }: FooterProps) => {
  const { soundLabel } = useFooter(sound.wanted);
  return (
    <footer className={styles.foot}>
      <i className={styles.prog} style={{ width: `${progress}%` }} />
      <div className={styles.ctrls}>
        <a className={styles.home} href={homeHref} title="Volver a la entrada" aria-label="Volver a la entrada">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.5 11.5L12 4l8.5 7.5" />
            <path d="M6 10v9.5h4.5v-5.5h3v5.5H18V10" />
          </svg>
        </a>
        <button type="button" title="Terraformar de nuevo" aria-label="Terraformar este mundo de nuevo" disabled={replayDisabled} onClick={onReplay}>
          ↻
        </button>
        <button
          ref={sound.buttonRef}
          type="button"
          className={cn(styles.snd, sound.playing && styles.playing)}
          aria-pressed={sound.wanted}
          title="Sonido ambiente"
          aria-label={soundLabel}
          onClick={sound.toggle}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9h4l5-4v14l-5-4H4z" />
            <path className={styles.w} d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" />
            <path className={styles.x} d="M17 9l5 6M22 9l-5 6" />
          </svg>
          <span className={styles.eq} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>
      <div className={styles.news}>
        <span className={styles.nlabel}>
          <i aria-hidden="true" />
          Actualidad
        </span>
        <NewsTicker news={news} tick={tick} />
      </div>
    </footer>
  );
};

export default Footer;
