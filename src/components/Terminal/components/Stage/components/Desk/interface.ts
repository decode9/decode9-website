import type { RefObject } from 'react';
import type { TerminalLang } from '@/interfaces/terminal';
import type { WindowManagerApi } from '../../../../useWindowManager';

export interface DeskProps {
  deskRef: RefObject<HTMLDivElement>;
  wm: WindowManagerApi;
  lang: TerminalLang;
  reduceMotion: boolean;
}
