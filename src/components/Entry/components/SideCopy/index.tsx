import type { SideCopyProps } from './interface';
import styles from './styles.module.scss';

const DRIPS = [
  { left: '18%', height: 34 },
  { left: '47%', height: 58 },
  { left: '81%', height: 26 },
];

/** Texts and call to action of one side: red «My Hacker Mode» or blue «My Professional Mode». */
const SideCopy = ({ side, href, elRef, onGo, onFocusCta }: SideCopyProps) => {
  if (side === 'red') {
    return (
      <div ref={elRef} className={`${styles.copy} ${styles.cRed}`}>
        <span className={styles.mode}>
          My Hacker Mode <i className={styles.cur} />
        </span>
        <div className={styles.tag}>
          decode9
          {DRIPS.map((d) => (
            <i key={d.left} className={styles.drip} style={{ left: d.left, height: d.height }} />
          ))}
        </div>
        <p className={styles.sub}>Mi versión investigadora: código, experimentos y lo que nadie te mostró.</p>
        <a
          className={styles.spray}
          href={href}
          data-cta=""
          aria-label="Entra a decode9, mi versión investigadora"
          onClick={(e) => onGo('red', e)}
          onFocus={() => onFocusCta('red')}
        >
          <svg className={styles.paint} viewBox="0 0 260 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M8 14 L30 6 L64 11 L96 4 L132 9 L170 3 L206 10 L238 6 L254 18 L250 44 L256 70 L248 94 L222 99 L186 95 L150 101 L112 96 L78 100 L42 95 L14 99 L6 76 L11 50 L4 30 Z" />
            <path className={styles.dr} d="M46 96 h7 v14 a3.5 3.5 0 0 1 -7 0 Z" />
            <path className={styles.dr} d="M128 98 h6 v20 a3 3 0 0 1 -6 0 Z" />
            <path className={styles.dr} d="M210 96 h5 v10 a2.5 2.5 0 0 1 -5 0 Z" />
          </svg>
          <span className={styles.word}>Entra</span>
          <svg className={styles.arrow} viewBox="0 0 70 44" aria-hidden="true">
            <path d="M4 26 C18 20 34 24 58 20 M44 6 C50 12 56 16 62 20 C56 26 50 32 46 39" />
          </svg>
          <span className={styles.cmd}>&gt; ./decode9 --sin-filtro</span>
        </a>
      </div>
    );
  }

  return (
    <div ref={elRef} className={`${styles.copy} ${styles.cBlue}`}>
      <span className={styles.mode}>
        <span className={styles.mt}>
          <span>My Professional</span> <span>Mode</span>
        </span>
      </span>
      <h1 className={styles.name}>
        <span className={styles.n1}>Jorge</span>
        <span className={styles.n2}>Bastidas</span>
      </h1>
      <span className={styles.role}>
        <i className={styles.sw} />
        El ingeniero
      </span>
      <p className={styles.sub}>Mi trayectoria, mis proyectos y cómo construyo: mi perfil profesional completo.</p>
      <a
        className={styles.dash}
        href={href}
        data-cta=""
        aria-label="Conóceme: perfil profesional de Jorge Bastidas"
        onClick={(e) => onGo('blue', e)}
        onFocus={() => onFocusCta('blue')}
      >
        <span className={styles.streak} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.plate}>
          <span className={styles.label}>
            <b>Conóceme</b>
            <small>Un profesional completo</small>
          </span>
          <span className={styles.go} aria-hidden="true">
            ›››
          </span>
        </span>
      </a>
    </div>
  );
};

export default SideCopy;
