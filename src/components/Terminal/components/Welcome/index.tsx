import type { CSSProperties } from 'react';
import { WELCOME_TEXT } from '@/data/terminal';
import { cn } from '@/utils/cn';
import Bi from '../Bilingual';
import type { WelcomeProps } from './interface';
import useWelcome, { SEALS } from './useWelcome';
import styles from './styles.module.scss';

/** System message after login with the seal decoder (original #welcome). */
const Welcome = (props: WelcomeProps) => {
  const { ready, leaving, start, sealState, titleRef, goRef } = useWelcome(props);
  return (
    <div
      className={cn(styles.welcome, leaving && styles.out)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wl-t"
      onClick={(e) => {
        if (!(e.target as Element).closest(`.${styles['wl-win']}`)) start();
      }}
    >
      <div className={styles['wl-win']}>
        <div className={styles.wbar}>
          <span className={styles.wid}>⊐ W-00</span>
          <span className={styles.wt}>
            <Bi t={WELCOME_TEXT.bar} />
          </span>
        </div>
        <div className={styles['wl-body']}>
          <p className={styles.lbl}>
            <Bi t={WELCOME_TEXT.authorized} />
          </p>
          <h2 ref={titleRef} className={styles['wl-t']} id="wl-t">
            <b>{props.name}</b>
          </h2>
          <p className={styles['wl-sub']}>
            <Bi t={WELCOME_TEXT.entering} />
          </p>
          <p className={styles.lbl} style={{ marginTop: 6 }}>
            <Bi t={WELCOME_TEXT.premise} />
          </p>
          <p className={styles['wl-method']}>
            <Bi t={WELCOME_TEXT.method} />
          </p>
          <p className={styles['wl-q']}>
            <Bi t={WELCOME_TEXT.quote} />
          </p>
          <div className={styles['wl-act']}>
            <button ref={goRef} type="button" className={styles['wl-go']} disabled={!ready} onClick={start}>
              ▶ <Bi t={WELCOME_TEXT.go} /> <i>⏎</i>
            </button>
          </div>
        </div>
      </div>
      <div className={styles['wl-load']} aria-hidden="true">
        <div className={cn(styles.glyphs, ready && styles.ready)}>
          {SEALS.map((g, k) => {
            const s = sealState(k);
            return (
              <span key={k} className={s ? styles[s] : undefined} style={{ '--k': k } as CSSProperties}>
                {g}
              </span>
            );
          })}
        </div>
        <p className={cn(styles['wl-stat'], ready && styles.ok)}>
          <Bi t={ready ? WELCOME_TEXT.deciphered : WELCOME_TEXT.deciphering} />
        </p>
      </div>
    </div>
  );
};

export default Welcome;
