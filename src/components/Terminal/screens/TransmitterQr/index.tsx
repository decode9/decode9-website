import { QR_TEXT } from '@/data/terminal/channel';
import { TERMINAL_URLS } from '@/data/terminal/config';
import type { ScreenContext } from '../interface';
import QrCard from './components/QrCard';
import { transmitterUrl } from './transmitterUrl';

/** Iniciar transmisor (original OPENERS.qr): the QR carries the login name to the mobile transmitter. */
const openTransmitterQr = (ctx: ScreenContext): void => {
  const url = transmitterUrl(ctx.user, TERMINAL_URLS.mobileUrl, window.location.href);
  ctx.wm.open({
    title: QR_TEXT.title,
    key: 'qr',
    base: true,
    x: 0.3,
    y: 0.02,
    w: 0.36,
    cls: 'qrw',
    render: () => <QrCard url={url} user={ctx.user} drawQr={ctx.services.drawQr} />,
  });
};

export default openTransmitterQr;
