import type { IconName } from '@/interfaces/profile';

/** Inner SVG markup (viewBox 0 0 24 24, stroke icons) of the chapter cards. Static, trusted strings. */
export const ICONS: Record<IconName, string> = {
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
  rocket:
    '<path d="M12 3c3 2 5 5.5 5 9.5L15 15H9l-2-2.5C7 8.5 9 5 12 3z"/><circle cx="12" cy="10" r="1.6"/><path d="M9 15l-2 4 3-1M15 15l2 4-3-1"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16M8 7h7"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5"/>',
  signal: '<path d="M12 13v8M8.5 9.5a5 5 0 017 0M5.5 6.5a9 9 0 0113 0"/><circle cx="12" cy="13" r="1.4"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  users:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.4 0 4.2 1.4 4.6 4"/>',
  ear: '<path d="M7 10a5 5 0 0110 0c0 3-3 4-3 7a3 3 0 01-5.6 1.5"/><path d="M10 10a2 2 0 014 0"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7"/><rect x="13.5" y="3.5" width="7" height="7"/><rect x="3.5" y="13.5" width="7" height="7"/><rect x="13.5" y="13.5" width="7" height="7"/>',
  planet: '<circle cx="12" cy="12" r="6"/><path d="M3 15.5c3 1.5 15 -2 18-7"/>',
};
