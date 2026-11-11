import { LAB_TEXT, RESEARCH_BRANCHES } from '@/data/terminal/lab';
import createAutoPick from '../autoPick';
import type { ScreenContext } from '../interface';
import BranchDetail from './components/BranchDetail';
import Branches from './components/Branches';
import Sheet from './components/Sheet';

/** Laboratorio (original OPENERS.lab + ACT.sk). */
const openLab = (ctx: ScreenContext): void => {
  const branch = (i: number) =>
    ctx.wm.open({
      title: RESEARCH_BRANCHES[i].n,
      group: 'sk',
      x: 0.31 + Math.random() * 0.04,
      y: 0.08 + Math.random() * 0.06,
      w: 0.46,
      cls: 'wide',
      render: () => <BranchDetail index={i} />,
    });
  const auto = createAutoPick(300);
  ctx.wm.open({ title: LAB_TEXT.branchesTitle, key: 'ramas', base: true, x: 0, y: 0, w: 0.3, render: () => <Branches onPick={branch} auto={auto()} /> });
  ctx.wm.open({ title: LAB_TEXT.sheetTitle, key: 'ficha', base: true, x: 0.72, y: 0, w: 0.28, delay: 200, cls: 'small', render: () => <Sheet /> });
};

export default openLab;
