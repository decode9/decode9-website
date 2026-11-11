import { cn } from '@/utils/cn';
import shared from '../../shared.module.scss';
import ch from '../Channel/styles.module.scss';
import MediaTrack from '../MediaTrack';
import Sheet from '../Sheet';
import useVideoSheet from './useVideoSheet';
import styles from './styles.module.scss';

/** #vs: video sheet with play/pause, seek track, ANT/SIG, fullscreen and share. */
const VideoSheet = () => {
  const s = useVideoSheet();
  const kicker = s.item ? `${s.item.kicker || 'TX'}${s.item.dur ? ` · ${s.item.dur}` : ''}` : '';
  const pp = s.playing ? '❚❚' : '▶';
  return (
    <Sheet open={s.open} labelledBy="vs-h" kicker={kicker} onClose={s.close}>
      <div ref={s.hostRef} className={cn(styles.vbox, s.playing && styles.playing)}>
        <button type="button" className={styles.vbig} onClick={s.toggle} aria-label="Reproducir">
          ▶
        </button>
      </div>
      <div className={styles.ctrl}>
        <button type="button" className={styles.pp} onClick={s.toggle} aria-label="Reproducir">
          {pp}
        </button>
        <MediaTrack media={s.video} active={s.open} className={styles.track} />
        <span className={shared.lbl}>{s.time}</span>
      </div>
      <div className={ch.tools}>
        <button type="button" className={ch.chip} onClick={s.prev}>
          ◀◀ ANT
        </button>
        <button type="button" className={ch.chip} onClick={s.next}>
          SIG ▶▶
        </button>
        <button type="button" className={cn(ch.chip, ch.chipOn)} onClick={s.openFullscreen}>
          ⤢ PANTALLA COMPLETA
        </button>
        <button type="button" className={ch.chip} onClick={s.share}>
          COMPARTIR
        </button>
      </div>
      <h3 id="vs-h">{s.item?.heading}</h3>
      <p>{s.item?.description}</p>
    </Sheet>
  );
};

export default VideoSheet;
