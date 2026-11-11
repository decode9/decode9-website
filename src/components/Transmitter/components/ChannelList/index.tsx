/* eslint-disable @next/next/no-img-element -- static export; the poster thumb takes the #rojo SVG filter */
import { cn } from '@/utils/cn';
import { withBase } from '@/utils/asset';
import { PANE_INTROS } from '@/data/transmitter/stations';
import shared from '../../shared.module.scss';
import ch from '../Channel/styles.module.scss';
import { useChannel } from '../Channel/context';
import useChannelActions from '../Channel/useChannelActions';
import type { ChannelListProps } from './interface';

const withDur = (kicker: string, dur: string) => `${kicker}${dur ? ` · ${dur}` : ''}`;

const Empty = ({ text }: { text: string }) => <p className={cn(shared.lbl, shared.dim, ch.empty)}>{text}</p>;

/** Panes 1–3: VIDEOS, LECTURAS and AUDIOS rows (original render()). */
const ChannelList = ({ kind }: ChannelListProps) => {
  const { deps } = useChannel();
  const { openVideo, openAudio, openDoc } = useChannelActions();
  const { videos, audios, docs } = deps.content;
  const intro = PANE_INTROS[kind === 'video' ? 1 : kind === 'doc' ? 2 : 3];
  const arrow = <span className={shared.lbl}>▸</span>;

  const rows = () => {
    if (kind === 'video') {
      if (!videos.length) return <Empty text="SIN TRANSMISIONES TODAVÍA" />;
      return videos.map((x, i) => (
        <button key={x.id} type="button" className={ch.row} onClick={() => openVideo(i)}>
          <img className={ch.thumb} src={withBase(x.poster)} alt="" />
          <span className={ch.t}>
            <span className={shared.lbl}>{withDur(x.kicker || 'TX', x.dur)}</span>
            <b>{x.heading}</b>
          </span>
          {arrow}
        </button>
      ));
    }
    if (kind === 'audio') {
      if (!audios.length) return <Empty text="SIN AUDIOS TODAVÍA" />;
      return audios.map((x, i) => (
        <button key={x.id} type="button" className={ch.row} onClick={() => openAudio(i)}>
          <span className={ch.ic}>▶</span>
          <span className={ch.t}>
            <span className={shared.lbl}>{withDur(x.kicker || 'AUDIO', x.dur)}</span>
            <b>{x.heading}</b>
          </span>
          {arrow}
        </button>
      ));
    }
    if (!docs.length) return <Empty text="SIN BITÁCORAS TODAVÍA" />;
    return docs.map((x, i) => (
      <button key={x.id} type="button" className={ch.row} onClick={() => openDoc(i)}>
        <span className={ch.t}>
          <span className={cn(shared.lbl, i > 0 && shared.dim)}>{`${x.kicker || 'BITÁCORA'} · ${x.minutes} MIN`}</span>
          <b>{x.heading}</b>
        </span>
        {arrow}
      </button>
    ));
  };

  return (
    <>
      <p className={shared.line}>
        <b>DECODE9:</b> {intro}
      </p>
      <div>{rows()}</div>
    </>
  );
};

export default ChannelList;
