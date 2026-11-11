import type { CSSProperties } from 'react';
import { LOGO_PATHS, LOGO_VIEWBOX, SHELL_TEXT } from '@/data/terminal';
import { cn } from '@/utils/cn';
import Bi from '../Bilingual';
import type { TopBarProps } from './interface';
import useTopBar from './useTopBar';
import styles from './styles.module.scss';

/** Top bar of the terminal: logo, glyphs, SYNC bar, user, clock, Exit, CRT switch and ES/EN (original header.top). */
const TopBar = ({ user, lang, onLang, crtOn, onToggleCrt, onExit, logoRef, logoHidden, reduceMotion, style }: TopBarProps) => {
  const { clock, glyph, sync } = useTopBar(reduceMotion);
  return (
    <header className={styles.top} data-piece style={style}>
      <span ref={logoRef} className={styles.logo} title="decode9" style={logoHidden ? { visibility: 'hidden' } : undefined}>
        <svg aria-hidden="true" viewBox={LOGO_VIEWBOX}>
          {LOGO_PATHS.map((p) => (
            <path key={p.d} d={p.d} fill={p.fill} />
          ))}
        </svg>
      </span>
      <span className={cn(styles.glyph, styles.g1)} aria-hidden="true">
        {glyph}
      </span>
      <span className={cn(styles.toptitle, 'glow')}>
        DECODE<b>9</b>
      </span>
      <div className={styles.loadbar} aria-hidden="true">
        <i style={{ '--lb': `${sync}%` } as CSSProperties} />
        <span>SYNC {Math.round(sync)}%</span>
      </div>
      {user && <span className={styles.usr}>USR · {user}</span>}
      <span className={styles.clock}>{clock}</span>
      <button type="button" className={styles.exitbtn} data-hide-pre onClick={onExit}>
        ⏻ <Bi t={SHELL_TEXT.exit} />
      </button>
      <button
        type="button"
        className={styles.crtbtn}
        aria-pressed={crtOn}
        title="Scanlines CRT"
        aria-label={crtOn ? 'Quitar efecto CRT / Turn CRT off' : 'Activar efecto CRT / Turn CRT on'}
        onClick={onToggleCrt}
      >
        <span className={styles.sw}>
          <i />
        </span>
        CRT
      </button>
      <div className={styles.lang} role="group" aria-label="Idioma / Language">
        {(['es', 'en'] as const).map((l) => (
          <button key={l} type="button" aria-pressed={lang === l} onClick={() => onLang(l)}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
};

export default TopBar;
