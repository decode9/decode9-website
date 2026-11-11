import { ORIGIN_TEXT } from '@/data/terminal/origin';
import createAutoPick from '../autoPick';
import type { ScreenContext } from '../interface';
import LogDetail from './components/LogDetail';
import LogIndex from './components/LogIndex';

/** Expediente de origen (original OPENERS.origen + ACT.log). */
const openOrigin = (ctx: ScreenContext): void => {
  const log = (i: number) => {
    const casc = ctx.cascade.next();
    ctx.wm.open({
      title: [`LOG·0${i + 1}`, `LOG·0${i + 1}`],
      group: 'log',
      x: 0.3 + (casc % 3) * 0.05,
      y: 0.02 + (casc % 2) * 0.12,
      w: 0.52,
      render: () => <LogDetail index={i} />,
    });
  };
  ctx.cascade.reset();
  const auto = createAutoPick(260);
  ctx.wm.open({ title: ORIGIN_TEXT.title, key: 'logs', base: true, x: 0, y: 0.04, w: 0.28, render: () => <LogIndex onPick={log} auto={auto()} /> });
};

export default openOrigin;
