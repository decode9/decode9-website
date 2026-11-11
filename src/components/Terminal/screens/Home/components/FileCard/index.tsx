/* eslint-disable @next/next/no-img-element -- static export; plain <img> like the original */
import { FILE_TEXT as T } from '@/data/terminal/home';
import { withBase } from '@/utils/asset';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import type { FileCardProps } from './interface';
import styles from './styles.module.scss';

/** Inicio · Expediente D9-09 (original key 'file'). */
const FileCard = ({ onOpen }: FileCardProps) => (
  <div className={content.pane}>
    <img className={styles.lockup} src={withBase('/decode9/img/d9-lockup.webp')} alt="decode9" />
    <span className={cn(content.lbl, styles.sub)} data-dec>
      <Bi t={T.subtitle} />
    </span>
    <dl className={content.fmeta}>
      <div>
        <dt>
          <Bi t={T.file} />
        </dt>
        <dd>D9-09</dd>
      </div>
      <div>
        <dt>
          <Bi t={T.clearance} />
        </dt>
        <dd className={content.g}>
          <Bi t={T.open} />
        </dd>
      </div>
      <div>
        <dt>
          <Bi t={T.contents} />
        </dt>
        <dd>
          <Bi t={T.sections} />
        </dd>
      </div>
      <div>
        <dt>
          <Bi t={T.status} />
        </dt>
        <dd className={content.a}>
          <Bi t={T.investigating} />
        </dd>
      </div>
    </dl>
    <button type="button" className={cn(content.btn, styles.cta)} onClick={onOpen}>
      ▶ <Bi t={T.cta} />
    </button>
  </div>
);

export default FileCard;
