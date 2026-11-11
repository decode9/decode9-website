import type { LogoPolygons } from '@/interfaces/terminal';

/** decode9 emblem as polygons (wire logo and SVG emblem share them). viewBox 0 0 1024 1137. */
export const LOGO_POLYGONS: LogoPolygons = {
  r: [
    [[513, 106], [205, 283], [205, 491], [534, 681], [535, 574], [299, 438], [297, 338], [511, 213], [726, 338], [726, 767], [496, 900], [496, 1008], [818, 822], [818, 283]],
    [[837, 6], [932, 253], [822, 319], [855, 375], [1019, 279]],
    [[186, 6], [4, 279], [168, 375], [201, 319], [91, 253]],
  ],
  g: [
    [[959, 595], [866, 649], [866, 833], [530, 1027], [529, 1135], [959, 887]],
    [[64, 595], [64, 887], [494, 1135], [493, 1027], [157, 833], [157, 649]],
    [[205, 530], [205, 637], [456, 782], [456, 675]],
    [[959, 355], [866, 409], [866, 614], [959, 561]],
    [[64, 355], [64, 561], [157, 614], [157, 409]],
  ],
};

export const LOGO_VIEWBOX = '0 0 1024 1137';
export const LOGO_COLORS = { r: '#E5131C', g: '#B1B4BE' } as const;
/** Extrusion depth of the 3D wire logo. */
export const LOGO_DEPTH = 110;

/** SVG `d` attribute for a polygon ("M x,y L x,y … Z"). */
export const polygonPath = (poly: LogoPolygons['r'][number]): string =>
  `M${poly.map(([x, y]) => `${x},${y}`).join(' L')}Z`;

/** Paths in the original paint order: the three red pieces, then the five grey ones. */
export const LOGO_PATHS: ReadonlyArray<{ d: string; fill: string }> = [
  ...LOGO_POLYGONS.r.map((p) => ({ d: polygonPath(p), fill: LOGO_COLORS.r })),
  ...LOGO_POLYGONS.g.map((p) => ({ d: polygonPath(p), fill: LOGO_COLORS.g })),
];

/** Standalone SVG markup of the emblem (original LOGO_SVG), e.g. for an <img> or a canvas. */
export const LOGO_SVG_MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}">${LOGO_PATHS.map(
  (p) => `<path d="${p.d}" fill="${p.fill}"/>`,
).join('')}</svg>`;
