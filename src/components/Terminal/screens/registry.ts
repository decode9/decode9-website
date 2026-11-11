import { CODEX_TABS, MANIFESTO_TABS } from '@/data/terminal/menu';
import type { TerminalScreenId } from '@/interfaces/terminal';
import openArchive from './Archive';
import openChannel from './Channel';
import openCodex from './Codex';
import openHome from './Home';
import type { ScreenDefinition } from './interface';
import openLab from './Lab';
import openLink from './Link';
import openManifesto from './Manifesto';
import openOrigin from './Origin';
import openTransmitterQr from './TransmitterQr';

/*
 * Screen registry (contract for phases 2b/2c).
 * - One entry per menu id. Title and number come from data/terminal/menu (MENU); do not repeat them here.
 * - `open(ctx, tab)` opens windows with ctx.wm.open({ key|group, title:[es,en], x, y, w, delay, cls, base, render }).
 *   `render` returns React content; window life-cycle (audio, timers) goes in that component's effects.
 * - Each content screen lives in screens/<Screen>/ (opener in index.tsx, window bodies in components/).
 */
export const SCREENS: Record<TerminalScreenId, ScreenDefinition> = {
  home: { id: 'home', open: openHome },
  manifiesto: { id: 'manifiesto', tabs: MANIFESTO_TABS, open: openManifesto },
  origen: { id: 'origen', open: openOrigin },
  lab: { id: 'lab', open: openLab },
  codice: { id: 'codice', tabs: CODEX_TABS, open: openCodex },
  archivo: { id: 'archivo', open: openArchive },
  canal: { id: 'canal', open: openChannel },
  enlace: { id: 'enlace', open: openLink },
  tx: { id: 'tx', open: openTransmitterQr },
};
