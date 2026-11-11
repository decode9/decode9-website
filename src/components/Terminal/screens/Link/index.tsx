import { LINK_TEXT } from '@/data/terminal/channel';
import type { ScreenContext } from '../interface';
import LinkForm from './components/LinkForm';
import Radio from './components/Radio';
import { createTxBus } from './txBus';

/** Enlace: transmitter + contact form (original OPENERS.canal + initCanal; the owner inbox is dropped). */
const openLink = (ctx: ScreenContext): void => {
  const bus = createTxBus();
  ctx.wm.open({ title: LINK_TEXT.radioTitle, key: 'radio', base: true, x: 0.02, y: 0.04, w: 0.46, render: () => <Radio bus={bus} /> });
  ctx.wm.open({
    title: LINK_TEXT.formTitle,
    key: 'form',
    base: true,
    x: 0.46,
    y: 0.12,
    w: 0.48,
    delay: 220,
    render: () => <LinkForm bus={bus} gateway={ctx.services.signal} user={ctx.user} lang={ctx.lang} />,
  });
};

export default openLink;
