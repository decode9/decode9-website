import type { CSSProperties } from 'react';
import { cn } from '@/utils/cn';
import Bi from '../../../Bilingual';
import type { WindowProps } from './interface';
import useWindow from './useWindow';
import styles from './styles.module.scss';

/** Extra classes a screen may pass in spec.cls; known ones are styled here, all are also emitted as globals for 2b/2c. */
const KNOWN: Record<string, string | undefined> = { small: styles.small, scanw: styles.scanw };

/** One draggable window of the desk (original .win: .wbar with W-NN, title, ▾ and ✕; .wbody). */
const Window = (props: WindowProps) => {
  const { win, top, lang, onClose, onMin } = props;
  const w = useWindow({ ...props, flkClass: styles.flk });
  const extra = (win.spec.cls ?? '').split(/\s+/).filter(Boolean);
  const style = {
    zIndex: win.z,
    left: win.left,
    top: win.top,
    width: win.width,
    maxHeight: win.maxHeight,
    '--fx': `${win.fx}px`,
    '--fy': `${win.fy}px`,
    animationDelay: win.arriving ? `${win.spec.delay ?? 0}ms` : undefined,
  } as CSSProperties;

  return (
    <div
      ref={w.rootRef}
      className={cn(
        styles.win,
        ...extra.map((c) => cn(c, KNOWN[c])),
        top && styles.wtop,
        win.min && styles.min,
        win.arriving && styles.arrive,
        win.leaving && styles.leave,
        w.dragging && styles.dragging,
      )}
      role="region"
      aria-label={win.spec.title[lang === 'en' ? 1 : 0]}
      data-terminal-win
      data-uid={win.uid}
      style={style}
      onPointerDown={w.onPointerDown}
      onKeyDown={w.onKeyDown}
    >
      <div
        className={styles.wbar}
        data-wbar
        onPointerMove={w.onBarPointerMove}
        onPointerUp={w.onBarPointerUp}
        onPointerCancel={w.onBarPointerUp}
        onClick={w.onBarClick}
      >
        <span className={styles.wid}>⊐ W-{`0${win.n}`.slice(-2)}</span>
        <span ref={w.titleRef} className={styles.wt}>
          <Bi t={win.spec.title} />
        </span>
        <span className={styles.wbtns}>
          <button
            type="button"
            className={styles.wmin}
            aria-label="Minimizar / Minimize"
            aria-expanded={!win.min}
            onClick={() => onMin(win.uid, !win.min)}
          >
            {win.min ? '▸' : '▾'}
          </button>
          <button type="button" className={styles.wx} aria-label="Cerrar ventana / Close window" onClick={() => onClose(win.uid)}>
            ✕
          </button>
        </span>
      </div>
      <div ref={w.bodyRef} className={styles.wbody} key={win.version}>
        {win.spec.render()}
      </div>
    </div>
  );
};

export default Window;
