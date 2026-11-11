import { cn } from '@/utils/cn';
import { PORTRAITS } from '@/data/transmitter/portraits';
import { formatMediaTime } from '@/utils/transmitter';
import shared from '../../shared.module.scss';
import ch from '../Channel/styles.module.scss';
import { useChannel } from '../Channel/context';
import useChannelActions from '../Channel/useChannelActions';
import MediaTrack from '../MediaTrack';
import Portrait from '../Portrait';
import Sheet from '../Sheet';
import styles from './styles.module.scss';

/** #as: audio sheet with the listening portrait, a tall track and ANT / ▶ / SIG. */
const AudioSheet = () => {
  const { sheet, audio, audioClock, currentAudio, loadAudio, deps, shareTarget } = useChannel();
  const { closeSheets, toggleAudio, share } = useChannelActions();
  const open = sheet === 'audio';
  const index = currentAudio ? deps.content.audios.indexOf(currentAudio) : 0;
  const kicker = currentAudio ? `${currentAudio.kicker || 'AUDIO'}${currentAudio.dur ? ` · ${currentAudio.dur}` : ''}` : '';
  return (
    <Sheet open={open} labelledBy="as-h" kicker={kicker} onClose={closeSheets} bodyClassName={styles.audio}>
      <Portrait image={PORTRAITS.listen} className={styles.au} />
      <h3 id="as-h">{currentAudio?.heading}</h3>
      <MediaTrack media={audio} active={open} big />
      <div className={cn(shared.lbl, styles.times)}>
        <span>{formatMediaTime(audioClock.time)}</span>
        <span className={shared.dim}>{formatMediaTime(audioClock.duration)}</span>
      </div>
      <div className={cn(styles.actl, shared.lbl)}>
        <button type="button" onClick={() => loadAudio(index - 1, true)}>
          ◀◀ ANT
        </button>
        <button type="button" className={cn(shared.send, styles.pp)} onClick={toggleAudio} aria-label="Reproducir">
          {audioClock.playing ? '❚❚' : '▶'}
        </button>
        <button type="button" onClick={() => loadAudio(index + 1, true)}>
          SIG ▶▶
        </button>
      </div>
      <div className={cn(ch.tools, styles.center)}>
        <button type="button" className={ch.chip} onClick={() => share(shareTarget)}>
          COMPARTIR
        </button>
      </div>
    </Sheet>
  );
};

export default AudioSheet;
