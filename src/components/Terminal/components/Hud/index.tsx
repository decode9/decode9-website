import { HUD_GLYPH, HUD_SIGNAL, MENU, SHELL_TEXT } from '@/data/terminal';
import type { PieceStyle } from '../../interface';
import Bi from '../Bilingual';
import type { HudProps } from './interface';
import useHud from './useHud';
import styles from './styles.module.scss';

/** Right-hand readouts (original aside.hudr): subject + section, signal, mini-map, status. */
const Hud = ({ screen, target, assembly, reduceMotion }: HudProps) => {
  const signal = useHud(reduceMotion);
  const item = MENU.find((m) => m.id === screen) ?? MENU[0];
  const piece = (i: number): PieceStyle | undefined =>
    assembly ? { '--d': `${assembly.hud[i]}ms`, '--px': '30px' } : undefined;

  return (
    <aside className={styles.hudr} aria-hidden="true">
      <div className={styles.box} data-piece style={piece(0)}>
        <Bi t={SHELL_TEXT.subject} />
        <span className={styles.big}>09</span>
        <b>
          <Bi t={item.t} />
        </b>
      </div>
      <div className={styles.box} data-piece style={piece(1)}>
        <Bi t={SHELL_TEXT.signal} />
        <span className={styles.sig}>
          {signal.map((o, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <i key={i} style={{ height: `${5 + i * 3}px`, opacity: o }} />
          ))}
        </span>
        <b>{HUD_SIGNAL.freq}</b>
      </div>
      <div className={styles.mini} data-piece style={piece(2)}>
        <i style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }} />
      </div>
      <div className={styles.box} data-piece style={piece(3)}>
        <span className={styles.glyph}>{HUD_GLYPH}</span>
        <b>{SHELL_TEXT.researching}</b>
      </div>
    </aside>
  );
};

export default Hud;
