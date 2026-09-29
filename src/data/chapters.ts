import type { CameraPose, CameraPoseId, Chapter, ChapterId, QuickReply, QuickReplyId } from '@/interfaces';

export const BRAND_RED = '#E5121B';

/**
 * The guided tour, in order. Each chapter declares the scene the stage should
 * resolve into and the quick replies the guide offers there. Adding a chapter
 * is a data change: the section registers itself with the same id.
 */
export const chapters: Chapter[] = [
  {
    id: 'handshake',
    code: '00',
    scene: { shape: 'isotype', camera: 'hero', accent: BRAND_RED, solid: 1, intensity: 1 },
    replies: ['startTour', 'showWork', 'askWho'],
  },
  {
    id: 'origin',
    code: '01',
    scene: { shape: 'helix', camera: 'side', accent: BRAND_RED, solid: 0, intensity: 0.8 },
    replies: ['showCapabilities', 'askAvailability', 'showWork'],
  },
  {
    id: 'capabilities',
    code: '02',
    scene: { shape: 'constellation', camera: 'orbit', accent: BRAND_RED, solid: 0, intensity: 0.75 },
    replies: ['showLab', 'askMvp', 'contact'],
  },
  {
    id: 'lab',
    code: '03',
    scene: { shape: 'grid', camera: 'low', accent: BRAND_RED, solid: 0, intensity: 0.45 },
    replies: ['showWork', 'askSolvo', 'showStack'],
  },
  {
    id: 'work',
    code: '04',
    scene: { shape: 'monolith', camera: 'close', accent: BRAND_RED, solid: 0, intensity: 0.55 },
    replies: ['askSolvo', 'askDesaparecidos', 'showStack'],
  },
  {
    id: 'stack',
    code: '05',
    scene: { shape: 'sphere', camera: 'wide', accent: BRAND_RED, solid: 0, intensity: 0.7 },
    replies: ['askStack', 'showProcess', 'contact'],
  },
  {
    id: 'process',
    code: '06',
    scene: { shape: 'path', camera: 'travel', accent: BRAND_RED, solid: 0, intensity: 0.4 },
    replies: ['contact', 'askAvailability', 'showWork'],
  },
  {
    id: 'handoff',
    code: '07',
    scene: { shape: 'portal', camera: 'finale', accent: BRAND_RED, solid: 0.85, intensity: 1 },
    replies: ['contact', 'askAvailability', 'startTour'],
  },
];

export const chapterIds: ChapterId[] = chapters.map((chapter) => chapter.id);

export const chapterById = (id: ChapterId): Chapter => chapters.find((chapter) => chapter.id === id) ?? chapters[0]!;

export const quickReplies: Record<QuickReplyId, QuickReply> = {
  startTour: { id: 'startTour', intent: { type: 'navigate', to: 'origin' } },
  showWork: { id: 'showWork', intent: { type: 'navigate', to: 'work' } },
  showLab: { id: 'showLab', intent: { type: 'navigate', to: 'lab' } },
  showStack: { id: 'showStack', intent: { type: 'navigate', to: 'stack' } },
  showProcess: { id: 'showProcess', intent: { type: 'navigate', to: 'process' } },
  showCapabilities: { id: 'showCapabilities', intent: { type: 'navigate', to: 'capabilities' } },
  contact: { id: 'contact', intent: { type: 'contact' } },
  askWho: { id: 'askWho', intent: { type: 'ask' } },
  askSolvo: { id: 'askSolvo', intent: { type: 'ask' } },
  askAvailability: { id: 'askAvailability', intent: { type: 'ask' } },
  askStack: { id: 'askStack', intent: { type: 'ask' } },
  askMvp: { id: 'askMvp', intent: { type: 'ask' } },
  askDesaparecidos: { id: 'askDesaparecidos', intent: { type: 'ask' } },
};

/** Camera poses per scene. `shiftX` moves the subject aside on wide screens so copy stays readable. */
export const cameraPoses: Record<CameraPoseId, CameraPose> = {
  loader: { position: [0, -0.75, 11], target: [0, -0.75, 0], shiftX: 0 },
  hero: { position: [0, 0.2, 9.5], target: [0, 0, 0], shiftX: 2.6 },
  side: { position: [3.5, 1.2, 8.5], target: [0, 0, 0], shiftX: 2.8 },
  orbit: { position: [0, 3.2, 9.5], target: [0, 0, 0], shiftX: 3.1 },
  low: { position: [0, -1.4, 8], target: [0, 0.6, 0], shiftX: 0 },
  close: { position: [0, 0, 8.5], target: [0, 0, 0], shiftX: 0 },
  wide: { position: [0, 0.6, 11], target: [0, 0, 0], shiftX: 2.4 },
  travel: { position: [-2, 2.6, 13], target: [0, 1.2, 0], shiftX: 0 },
  finale: { position: [0, 0, 10], target: [0, 0, 0], shiftX: 3.2 },
};
