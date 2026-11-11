import { MYTHS, QUOTES, MANIFESTO_TEXT as T } from '@/data/terminal/manifesto';
import createAutoPick from '../autoPick';
import type { ScreenContext } from '../interface';
import BiasLog from './components/BiasLog';
import Conclusion from './components/Conclusion';
import Diagnosis from './components/Diagnosis';
import HornData from './components/HornData';
import HornSource from './components/HornSource';
import MethodSteps from './components/MethodSteps';
import MythDetail from './components/MythDetail';
import MythSlots from './components/MythSlots';
import QuoteDetail from './components/QuoteDetail';
import QuoteIndex from './components/QuoteIndex';
import StepDetail from './components/StepDetail';

/* Original OPENERS.man + ACT.step / ACT.myth / ACT.q: positions, sizes and delays as fractions of the desk. */

const openBias = (ctx: ScreenContext) => {
  ctx.wm.open({ title: T.diagTitle, key: 'diag', base: true, x: 0.02, y: 0.03, w: 0.56, render: () => <Diagnosis /> });
  ctx.wm.open({ title: T.dataTitle, key: 'dato', base: true, x: 0.66, y: 0, w: 0.3, delay: 200, cls: 'small', render: () => <HornData /> });
  ctx.wm.open({ title: T.sourceTitle, key: 'fuente', base: true, x: 0.02, y: 0.66, w: 0.3, delay: 540, cls: 'small', render: () => <HornSource /> });
  ctx.wm.open({ title: T.logTitle, key: 'reg', base: true, x: 0.36, y: 0.44, w: 0.5, delay: 380, render: () => <BiasLog onNext={() => ctx.selectTab(1)} /> });
};

const openMethod = (ctx: ScreenContext) => {
  const step = (i: number) =>
    ctx.wm.open({
      title: [`Paso 0${i + 1}`, `Step 0${i + 1}`],
      group: 'step',
      x: 0.36 + Math.random() * 0.08,
      y: 0.4 + Math.random() * 0.08,
      w: 0.5,
      render: () => <StepDetail index={i} />,
    });
  const auto = createAutoPick(260);
  ctx.wm.open({ title: T.stepsTitle, key: 'steps', base: true, x: 0.02, y: 0.02, w: 0.66, render: () => <MethodSteps onPick={step} auto={auto()} /> });
};

const openMyths = (ctx: ScreenContext) => {
  const myth = (i: number) =>
    ctx.wm.open({
      title: MYTHS[i].t,
      group: 'myth',
      x: 0.42 + Math.random() * 0.06,
      y: 0.3 + Math.random() * 0.1,
      w: 0.46,
      render: () => <MythDetail index={i} />,
    });
  const auto = createAutoPick(260);
  ctx.wm.open({ title: T.mythsTitle, key: 'myths', base: true, x: 0.03, y: 0.06, w: 0.48, render: () => <MythSlots onPick={myth} auto={auto()} /> });
};

const openKnowledge = (ctx: ScreenContext) => {
  const quote = (i: number) => {
    const casc = ctx.cascade.next();
    ctx.wm.open({
      title: [QUOTES[i].author, QUOTES[i].author],
      group: 'q',
      x: 0.38 + (casc % 3) * 0.05,
      y: 0.04 + (casc % 3) * 0.16,
      w: 0.5,
      render: () => <QuoteDetail index={i} />,
    });
  };
  ctx.cascade.reset();
  const auto = createAutoPick(280);
  ctx.wm.open({ title: T.quotesTitle, key: 'qlist', base: true, x: 0, y: 0, w: 0.36, render: () => <QuoteIndex onPick={quote} auto={auto()} /> });
  ctx.wm.open({ title: T.conclusionTitle, key: 'concl', base: true, x: 0.5, y: 0.74, w: 0.46, delay: 500, cls: 'small', render: () => <Conclusion /> });
};

const TABS = [openBias, openMethod, openMyths, openKnowledge];

const openManifesto = (ctx: ScreenContext, tab: number): void => TABS[tab]?.(ctx);

export default openManifesto;
