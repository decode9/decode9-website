import { QR_TEXT } from '@/data/terminal/channel';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import type { QrCardProps } from './interface';
import styles from './styles.module.scss';
import useQrCard from './useQrCard';

/** Iniciar transmisor: styled QR towards the mobile transmitter (original OPENERS.qr). */
const QrCard = (props: QrCardProps) => {
  const { url, user } = props;
  const { canvasRef, failed, copied, copy } = useQrCard(props);
  return (
    <div className={content.pane}>
      <div className={styles.qrbox}>
        <p className={content.lbl}>
          <Bi t={QR_TEXT.field} />
        </p>
        <div className={styles.qrplate}>
          <canvas className={styles.qrc} ref={canvasRef} width={560} height={560} aria-label={QR_TEXT.canvasLabel} />
          <span className={styles.qrscan} aria-hidden="true" />
        </div>
        <p className={styles.qrname}>
          <span className={content.lbl}>
            <Bi t={QR_TEXT.linked} />
          </span>
          <b>{user || '—'}</b>
        </p>
        <p className={cn(content.body, styles.qrtxt)}>{failed ? url : <Bi t={QR_TEXT.scan} />}</p>
        <div className={styles.qrurl}>
          <code>{url}</code>
          <button type="button" className={styles.pdel} onClick={copy}>
            {copied ? '✓' : <Bi t={QR_TEXT.copy} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCard;
