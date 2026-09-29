import type { SceneState } from './scene';

export type ChapterId = 'handshake' | 'origin' | 'capabilities' | 'lab' | 'work' | 'stack' | 'process' | 'handoff';

export type QuickReplyId =
  | 'startTour'
  | 'showWork'
  | 'showLab'
  | 'showStack'
  | 'showProcess'
  | 'showCapabilities'
  | 'contact'
  | 'askWho'
  | 'askSolvo'
  | 'askAvailability'
  | 'askStack'
  | 'askMvp'
  | 'askDesaparecidos';

export type QuickReplyIntent = { type: 'navigate'; to: ChapterId } | { type: 'ask' } | { type: 'contact' };

export interface QuickReply {
  id: QuickReplyId;
  intent: QuickReplyIntent;
}

export interface Chapter {
  id: ChapterId;
  /** Two-digit HUD code, e.g. "02". */
  code: string;
  scene: SceneState;
  replies: QuickReplyId[];
}
