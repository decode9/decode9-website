import { LOGIN_RING_TEXT, LOGIN_TEXT, LOGO_PATHS, LOGO_VIEWBOX } from '@/data/terminal';
import { cn } from '@/utils/cn';
import Bi from '../Bilingual';
import type { LoginProps } from './interface';
import useLogin from './useLogin';
import styles from './styles.module.scss';

const Orbit = () => (
  <svg viewBox="0 0 400 400">
    <defs>
      <path id="lgc" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0" />
    </defs>
    <g className={styles.o1}>
      <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,60,40,.35)" strokeWidth=".8" strokeDasharray="1 7" />
      <path d="M200 14 a186 186 0 0 1 161 93" fill="none" stroke="rgba(255,90,60,.9)" strokeWidth="2" />
      <path d="M39 293 a186 186 0 0 1 -20 -50" fill="none" stroke="rgba(255,178,28,.8)" strokeWidth="2" />
    </g>
    <g className={styles.o2}>
      <text fontFamily="var(--font-share), monospace" fontSize="11" fill="rgba(255,90,60,.6)" letterSpacing="3">
        <textPath href="#lgc">{LOGIN_RING_TEXT}</textPath>
      </text>
    </g>
    <g className={styles.o3}>
      <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,60,40,.25)" strokeWidth="1" />
      <path d="M200 50 l6 -10 l-12 0z M350 200 l10 6 l0 -12z M200 350 l-6 10 l12 0z M50 200 l-10 -6 l0 12z" fill="rgba(255,60,40,.8)" />
    </g>
  </svg>
);

/** Access gate: orbit, forming emblem, name form and the split gates (original #login). */
const Login = (props: LoginProps) => {
  const { flags, scatter, value, setValue, busy, msg, bar, greeted, hidden, submit, inputRef, askRef, hiRef, embRef } = useLogin(props);
  return (
    <section
      className={cn(styles.login, ...Array.from(flags, (f) => styles[f]))}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lg-title"
      hidden={hidden}
    >
      <div className={cn(styles.gate, styles.l)} aria-hidden="true">
        <span className={styles.gl} />
      </div>
      <div className={cn(styles.gate, styles.r)} aria-hidden="true">
        <span className={styles.gl} />
      </div>
      <div className={styles['lg-orbit']} aria-hidden="true">
        <Orbit />
        <div ref={embRef} className={styles['lg-emb']}>
          <svg aria-hidden="true" viewBox={LOGO_VIEWBOX}>
            {LOGO_PATHS.map((p, i) => (
              <path key={p.d} d={p.d} fill={p.fill} style={scatter[i]} />
            ))}
          </svg>
        </div>
      </div>
      <div className={styles['lg-core']}>
        <p className={styles['lg-sys']} id="lg-title">
          <Bi t={LOGIN_TEXT.system} />
        </p>
        {!greeted && (
          <form className={styles['lg-form']} autoComplete="off" noValidate onSubmit={submit}>
            <label ref={askRef} className={styles['lg-ask']} htmlFor="lg-user">
              <Bi t={LOGIN_TEXT.ask} />
            </label>
            <div className={styles['lg-line']}>
              <input
                ref={inputRef}
                id="lg-user"
                type="text"
                maxLength={24}
                spellCheck={false}
                autoCapitalize="words"
                enterKeyHint="go"
                aria-describedby="lg-msg"
                readOnly={busy}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className={styles['lg-load']} aria-hidden="true">
              <i style={{ width: `${bar}%` }} />
            </div>
            <button type="submit" className={styles['lg-go']}>
              <Bi t={LOGIN_TEXT.enter} /> <i>⏎</i>
            </button>
            <p className={cn(styles['lg-msg'], msg.err && styles.err)} id="lg-msg" role="status" aria-live="polite">
              <Bi t={msg.t} />
            </p>
          </form>
        )}
        {greeted && (
          <div ref={hiRef} className={styles['lg-hi']}>
            <span className={styles['lg-ok']}>
              <Bi t={LOGIN_TEXT.granted} />
            </span>
            <b>{greeted}</b>
          </div>
        )}
        <div className={styles['lg-back']} hidden />
      </div>
    </section>
  );
};

export default Login;
