import { CODEX, CODEX_TEXT } from '@/data/terminal/codex';
import createAutoPick from '../autoPick';
import type { ScreenContext } from '../interface';
import CodexDetail from './components/CodexDetail';
import CodexIndex from './components/CodexIndex';

/** Tab filter: 0 all, 1 races ('sp'), 2 places and events ('pl'). */
const entriesFor = (tab: number): number[] =>
  CODEX.map((c, i) => ({ c, i }))
    .filter(({ c }) => tab === 0 || (tab === 1 && c.k === 'sp') || (tab === 2 && c.k === 'pl'))
    .map(({ i }) => i);

/** Códice (original OPENERS.cx + ACT.cx). */
const openCodex = (ctx: ScreenContext, tab: number): void => {
  const entries = entriesFor(tab);
  const entry = (i: number) =>
    ctx.wm.open({
      title: CODEX[i].nm,
      group: 'cx',
      x: 0.46 + Math.random() * 0.04,
      y: 0.02 + Math.random() * 0.06,
      w: 0.42,
      render: () => <CodexDetail index={i} />,
    });
  const auto = createAutoPick(260);
  ctx.wm.open({
    title: CODEX_TEXT.indexTitle,
    key: 'cxlist',
    base: true,
    x: 0,
    y: 0.02,
    w: 0.42,
    render: () => <CodexIndex entries={entries} onPick={entry} auto={auto()} />,
  });
};

export default openCodex;
