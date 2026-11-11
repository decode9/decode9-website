import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { CHAPTERS, CHAPTER_ORDER, nextChapter, plainText } from '@/data/profile/chapters';
import { ICONS } from '@/data/profile/icons';
import type { ChapterItem, RichText } from '@/interfaces/profile';
import { cn } from '@/utils/cn';
import type { ChapterPanelProps } from './interface';
import useChapterPanel from './useChapterPanel';
import styles from './styles.module.scss';

const rich = (text: RichText): ReactNode => text.map((s, i) => (typeof s === 'string' ? s : <em key={i}>{s.em}</em>));
const vars = (v: Record<string, string | number>) => v as CSSProperties;

const Item = ({ it, i }: { it: ChapterItem; i: number }) => (
  <article className={styles.it} style={vars({ '--i': i + 1 })}>
    <span className={styles.link} aria-hidden="true" />
    <span className={styles.node} aria-hidden="true" />
    <div className={styles.card}>
      {(it.icon || it.kicker) && (
        <div className={styles.row}>
          {it.icon && (
            <span className={styles.ico} aria-hidden="true">
              <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS[it.icon] }} />
            </span>
          )}
          <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
          {it.kicker && <span className={styles.kick}>{it.kicker}</span>}
        </div>
      )}
      {it.title && <h3>{it.title}</h3>}
      {it.subtitle && <p className={styles.sub}>{it.subtitle}</p>}
      {it.body && <p className={styles.txt}>{it.body}</p>}
      {it.caps?.length ? (
        <ul className={styles.caps}>
          {it.caps.map((c) => (
            <li key={c[0]}>
              {c[0]}
              {c[1] && <i>{c[1]}</i>}
            </li>
          ))}
        </ul>
      ) : null}
      {it.cta &&
        ('href' in it.cta ? (
          <a className={styles.cta} href={it.cta.href}>
            {it.cta.label}
          </a>
        ) : (
          <button type="button" className={styles.cta} data-act={it.cta.action}>
            {it.cta.label}
          </button>
        ))}
    </div>
  </article>
);

/** Chapter sheet: carbon glass cut on a 35° diagonal, items resting on the line, next chapter and walkie. */
const ChapterPanel = ({ chapter, open, onClose, onNext, onAction, onWalkie }: ChapterPanelProps) => {
  const { panelRef, scrollRef, trackRef, closeRef, fits } = useChapterPanel(open, chapter);
  const c = CHAPTERS[chapter];
  const nid = nextChapter(chapter);
  const nc = CHAPTERS[nid];
  const toStart = nid === CHAPTER_ORDER[0];
  const items = c.items.filter((it) => !it.hidden);
  const onTrackClick = (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
    if (b?.dataset.act) onAction(b.dataset.act);
  };

  return (
    <>
      <div className={styles.scrim} aria-hidden="true" onClick={onClose} />
      <button type="button" className={cn(styles.back, fits && styles.fits)} style={vars({ '--acc-now': c.acc })} onClick={onClose}>
        ← Volver al mundo
      </button>
      <aside
        ref={panelRef}
        className={cn(styles.panel, open && styles.open)}
        style={vars({ '--acc': c.acc })}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pTitle"
      >
        <div className={styles.glass} aria-hidden="true" />
        <div className={styles.rail} aria-hidden="true" />
        <div className={styles.ghostWord} aria-hidden="true">
          {c.ghost}
        </div>
        <header className={styles.head}>
          <span className={styles.tag}>
            {'// capítulo '}
            {c.n} · <b>{c.world}</b>
          </span>
          <div className={styles.right}>
            <button type="button" className={styles.nextq} onClick={() => onNext(nid)}>
              <span>Siguiente</span> <b>{toStart ? 'Volver al inicio' : nid}</b> →
            </button>
            <button ref={closeRef} type="button" className={styles.close} aria-label="Cerrar capítulo" onClick={onClose}>
              ×
            </button>
          </div>
        </header>
        <button type="button" className={styles.walkie} aria-label="Llamada entrante: hablar con Jorge" onClick={onWalkie}>
          <span className={styles.say}>Hablemos</span>
          <svg viewBox="0 0 60 100" aria-hidden="true">
            <rect x="15" y="4" width="6" height="6" fill="#e0552e" />
            <rect x="16" y="10" width="4" height="22" fill="#1d2133" />
            <polygon points="10,30 40,30 48,24 18,24" fill="#3a3f55" />
            <polygon points="40,30 48,24 48,86 40,92" fill="#1d2133" />
            <rect x="10" y="30" width="30" height="62" fill="#2a2e40" />
            <rect x="10" y="34" width="30" height="4" fill="#d9a441" />
            <polygon points="40,34 48,28 48,32 40,38" fill="#a87d2c" />
            <rect x="14" y="42" width="22" height="13" fill="#9fd8ff" />
            <rect x="14" y="42" width="22" height="3" fill="#c9ecff" />
            <rect x="15" y="60" width="20" height="2" fill="#4a4f66" />
            <rect x="15" y="65" width="20" height="2" fill="#4a4f66" />
            <rect x="15" y="70" width="20" height="2" fill="#4a4f66" />
            <rect x="10" y="78" width="30" height="10" fill="#d9a441" />
            <polygon points="40,78 48,72 48,82 40,88" fill="#a87d2c" />
            <rect x="44" y="44" width="5" height="12" fill="#d9a441" />
            <rect x="30" y="31" width="4" height="2" fill="#7fd28e" />
          </svg>
          <span className={styles.bang} aria-hidden="true">
            !
          </span>
        </button>
        <div ref={scrollRef} className={styles.scroll}>
          <div ref={trackRef} key={chapter} className={styles.track} onClick={onTrackClick}>
            <header className={styles.hero} data-hero="" style={vars({ '--i': 0 })}>
              <span className={styles.eyebrow}>{chapter}</span>
              <h2 id="pTitle">{rich(c.title)}</h2>
              {c.intro && <p>{c.intro}</p>}
              {c.prov && <span className={styles.prov}>{c.prov}</span>}
            </header>
            {items.map((it, i) => (
              <Item key={i} it={it} i={i} />
            ))}
            <article className={cn(styles.it, styles.pNext)} style={vars({ '--i': items.length + 1 })} data-act={`chapter:${nid}`}>
              <span className={styles.link} aria-hidden="true" />
              <span className={styles.node} aria-hidden="true" />
              <div className={styles.card}>
                <div className={styles.row}>
                  <span className={styles.num}>{nc.n}</span>
                  <span className={styles.kick}>{toStart ? 'Volver al inicio' : 'Siguiente capítulo'}</span>
                </div>
                <h3>{plainText(nc.title)}</h3>
                <p className={styles.sub}>
                  {nc.world} · {nid}
                </p>
                <button type="button" className={styles.cta} data-act={`chapter:${nid}`}>
                  Ver siguiente
                </button>
              </div>
            </article>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChapterPanel;
