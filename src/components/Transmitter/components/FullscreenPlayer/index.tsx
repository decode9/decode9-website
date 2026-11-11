import { cn } from '@/utils/cn';
import shared from '../../shared.module.scss';
import MediaTrack from '../MediaTrack';
import useFullscreenPlayer from './useFullscreenPlayer';
import styles from './styles.module.scss';

/** #fs: fullscreen video player outside the device frame. */
const FullscreenPlayer = () => {
  const f = useFullscreenPlayer();
  return (
    <div
      ref={f.rootRef}
      className={cn(styles.fs, f.open && styles.on, f.hidden && styles.hide)}
      role="dialog"
      aria-modal="true"
      aria-label="Reproductor"
      aria-hidden={!f.open}
      onPointerMove={f.onPointerMove}
    >
      <div className={styles.fhd}>
        <span>{f.title}</span>
        <span>{f.time}</span>
      </div>
      <div ref={f.hostRef} className={styles.vw} onClick={f.onViewClick} />
      <div className={styles.fc}>
        <MediaTrack media={f.video} active={f.open} className={styles.track} />
        <div className={styles.btns}>
          <button type="button" className={shared.cut} onClick={f.close}>
            ✕ SALIR
          </button>
          <button type="button" className={shared.cut} onClick={f.prev}>
            ◀◀ ANT
          </button>
          <button type="button" className={styles.pp} onClick={f.toggle} aria-label="Reproducir">
            {f.playing ? '❚❚' : '▶'}
          </button>
          <button type="button" className={shared.cut} onClick={f.next}>
            SIG ▶▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullscreenPlayer;
