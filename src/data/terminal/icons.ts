import type { TerminalIcon } from '@/interfaces/terminal';

/** Line icons of the terminal (inner SVG markup, viewBox 0 0 24 24). Used by the content screens (phase 2b). */
export const ICONS = {
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  ask: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0012 3z"/>',
  flask: '<path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 001.3 2h11.4a1.5 1.5 0 001.3-2l-5-10V3"/><path d="M7.5 15h9"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  cycle: '<path d="M20 12a8 8 0 01-14.9 4M4 12A8 8 0 0118.9 8"/><path d="M19 3v5h-5M5 21v-5h5"/>',
  shield: '<path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  flame: '<path d="M12 2c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2.5 1.5-4 2.5-5 .3 2 1.3 3 2.5 3 0-3-1-5 0-8z"/>',
  agent: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M12 7.5v4M12 11.5l-5.5 4.5M12 11.5l5.5 4.5"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  lock: '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><rect x="9" y="11" width="6" height="5"/><path d="M10 11V9a2 2 0 014 0v2"/>',
  auto: '<path d="M20 12a8 8 0 11-2.3-5.6"/><path d="M20 4v4h-4"/><path d="M9 12l2 2 4-4"/>',
  lens: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M8 10.5h5M10.5 8v5"/>',
  cube: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M3 7l9 5 9-5"/>',
  id: '<rect x="3" y="5" width="18" height="14"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 17c.8-2 2-3 3.5-3s2.7 1 3.5 3M14 10h5M14 13h4"/>',
  radio: '<path d="M4 9l16-5M3 9h18v12H3z"/><circle cx="8" cy="15" r="3"/><path d="M14 13h4M14 16h4"/>',
  // Canal post types (original PI).
  doc: '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5M9 12h8M9 15h8M9 18h5"/>',
  video: '<rect x="2" y="5" width="15" height="14"/><path d="M17 10l5-3v10l-5-3z"/><path d="M8 9.5v5l4-2.5z"/>',
  audio: '<path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="2" y="14" width="5" height="7"/><rect x="17" y="14" width="5" height="7"/>',
} as const satisfies Record<TerminalIcon, string>;

export type IconName = keyof typeof ICONS;
