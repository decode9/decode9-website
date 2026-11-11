import { ARCHIVE_SIGNALS, ARCHIVE_TEXT, WOW_SIGNAL } from '@/data/terminal/archive';
import createAutoPick from '../autoPick';
import type { ScreenContext } from '../interface';
import SignalDetail from './components/SignalDetail';
import SignalIndex from './components/SignalIndex';
import WowDetail from './components/WowDetail';

/** Archivo (original OPENERS.archivo + ACT.arc + ACT.wow). */
const openArchive = (ctx: ScreenContext): void => {
  const signal = (i: number) => {
    const casc = ctx.cascade.next();
    const t = `CH·0${i + 1} · ${ARCHIVE_SIGNALS[i].n}`;
    ctx.wm.open({
      title: [t, t],
      group: 'arc',
      x: 0.4 + (casc % 3) * 0.05,
      y: 0.06 + (casc % 2) * 0.18,
      w: 0.46,
      render: () => <SignalDetail index={i} />,
    });
  };
  const wow = () =>
    ctx.wm.open({ title: [WOW_SIGNAL.title, WOW_SIGNAL.title], key: 'wow', x: 0.3, y: 0.12, w: 0.56, cls: 'wowin', render: () => <WowDetail /> });
  ctx.cascade.reset();
  const auto = createAutoPick(260);
  ctx.wm.open({
    title: ARCHIVE_TEXT.listTitle,
    key: 'arclist',
    base: true,
    x: 0.02,
    y: 0.04,
    w: 0.36,
    render: () => <SignalIndex onPick={signal} onWow={wow} auto={auto()} />,
  });
};

export default openArchive;
