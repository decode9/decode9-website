/* eslint-disable @next/next/no-img-element -- static export; plain <img> like the original */
import { EYES_SVG } from '@/data/terminal/eyes';
import { SCAN_TEXT as T } from '@/data/terminal/home';
import { withBase } from '@/utils/asset';
import { cn } from '@/utils/cn';
import Bi from '../../../../components/Bilingual';
import type { ScanProps } from './interface';
import styles from './styles.module.scss';
import useScan from './useScan';

/** Inicio · Escaneo OBJ-09: portrait with tracking eyes, reticle, labels, wave and Sputnik controls. */
const Scan = ({ synth, setMuted, reduceMotion, onInfo }: ScanProps) => {
  const { rootRef, waveRef, reticleRef, gazeRef, playing, toggleSound } = useScan({ synth, setMuted, reduceMotion });
  return (
    <div className={styles.scan} ref={rootRef}>
      <div className={styles.head}>
        <img src={withBase('/decode9/img/d9-cut.webp')} alt={T.alt} />
        <svg viewBox="0 0 1024 1024" aria-hidden="true" dangerouslySetInnerHTML={{ __html: EYES_SVG }} />
      </div>
      <span className={styles.tint} />
      <span className={styles.cross} />
      <span className={styles.cross2} />
      <span className={styles.ring} />
      <span className={styles.rtk} ref={reticleRef} data-l={T.target} />
      <span className={cn(styles.scanlbl, styles.a)}>
        <Bi t={T.subject} /> <b>09</b>
        <br />
        <Bi t={T.race} />{' '}
        <b>
          <Bi t={T.demonoid} />
        </b>
        <br />
        <Bi t={T.origin} /> <b>MONKARI</b>
      </span>
      <span className={cn(styles.scanlbl, styles.b)}>
        <Bi t={T.alignment} />
        <br />
        <b>
          <Bi t={T.researcher} />
        </b>
        <br />
        <Bi t={T.gaze} /> <b ref={gazeRef}>0.00 / 0.00</b>
      </span>
      <canvas className={styles.wave} ref={waveRef} />
      <div className={styles.snd}>
        <button
          type="button"
          className={styles.sndbtn}
          aria-pressed={playing}
          aria-label={playing ? T.muteLabel : T.listenLabel}
          onClick={toggleSound}
        >
          <span aria-hidden="true">{playing ? '▮▮' : '▶'}</span> <Bi t={playing ? T.mute : T.listen} />
        </button>
        <button type="button" className={styles.sndinfo} onClick={onInfo}>
          {T.info} <i>?</i>
        </button>
      </div>
    </div>
  );
};

export default Scan;
