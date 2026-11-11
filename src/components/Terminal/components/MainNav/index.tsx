import { MENU, NAV_GLYPH, NAV_SLIDERS } from '@/data/terminal';
import { cn } from '@/utils/cn';
import type { PieceStyle } from '../../interface';
import Bi from '../Bilingual';
import type { MainNavProps } from './interface';
import useMainNav from './useMainNav';
import styles from './styles.module.scss';

const pieceStyle = (ms: number | undefined, px: number): PieceStyle | undefined =>
  ms === undefined ? undefined : { '--d': `${ms}ms`, '--px': `${px}px` };

/** Side menu of the terminal (original nav.nav > ul.mm + .navfoot). */
const MainNav = ({ navRef, current, go, assembly, reduceMotion }: MainNavProps) => {
  const { listRef, onListKeyDown } = useMainNav(navRef, reduceMotion);
  return (
    <nav ref={navRef} className={styles.nav} data-terminal-nav aria-label="Menú principal / Main menu">
      <ul ref={listRef} className={styles.mm} onKeyDown={onListKeyDown}>
        {MENU.map((m, i) => (
          <li key={m.id}>
            <button
              type="button"
              className={cn(styles.mi, m.id === current && styles.sel)}
              aria-current={m.id === current ? 'page' : undefined}
              data-piece
              style={pieceStyle(assembly?.menu[i], -30)}
              onClick={() => go(m.id)}
            >
              <span>
                <Bi t={m.t} />
              </span>
              <span className={styles.n}>{m.n}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.navfoot} aria-hidden="true" data-piece style={pieceStyle(assembly?.navfoot, -20)}>
        <div className={styles.sliders}>
          {NAV_SLIDERS.map((s) => (
            <span key={s.label} className={cn(styles.sl, s.accent && styles.a)}>
              <i style={{ '--h': `${s.level}%` } as PieceStyle} />
              <span>{s.label}</span>
            </span>
          ))}
        </div>
        <span className={styles.glyph}>{NAV_GLYPH}</span>
      </div>
    </nav>
  );
};

export default MainNav;
