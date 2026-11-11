import { BLOG_TEXT, FILE_TEXT, SCAN_TEXT, SPUTNIK_TEXT } from '@/data/terminal/home';
import type { ScreenContext } from '../interface';
import Blog from './components/Blog';
import FileCard from './components/FileCard';
import Scan from './components/Scan';
import SputnikInfo from './components/SputnikInfo';

/** Last name announced in the log: the "session opened" line appears once per login (original login → runScreen). */
let announced: string | null = null;

/** Inicio (original OPENERS.home): scan, file D9-09 and the log. */
const openHome = (ctx: ScreenContext): void => {
  const announce = ctx.user && ctx.user !== announced ? ctx.user : null;
  announced = ctx.user;
  const info = () =>
    ctx.wm.open({ title: SPUTNIK_TEXT.title, key: 'sputnik', x: 0.5, y: 0.56, w: 0.4, cls: 'small', render: () => <SputnikInfo /> });
  ctx.wm.open({
    title: SCAN_TEXT.title,
    key: 'scan',
    base: true,
    x: 0,
    y: 0,
    w: 0.5,
    cls: 'scanw',
    render: () => <Scan synth={ctx.synth} setMuted={ctx.setMuted} reduceMotion={ctx.reduceMotion} onInfo={info} />,
  });
  ctx.wm.open({ title: FILE_TEXT.title, key: 'file', base: true, x: 0.47, y: 0.07, w: 0.47, delay: 180, render: () => <FileCard onOpen={() => ctx.go('manifiesto')} /> });
  ctx.wm.open({
    title: BLOG_TEXT.title,
    key: 'blog',
    base: true,
    x: 0.6,
    y: 0.64,
    w: 0.36,
    delay: 360,
    cls: 'small',
    render: () => <Blog announce={announce} reduceMotion={ctx.reduceMotion} />,
  });
};

export default openHome;
