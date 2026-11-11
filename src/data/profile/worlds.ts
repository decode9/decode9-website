import type { BodyConfig, PropKind, WorldConfig, WorldItemSpec } from '@/interfaces';

/** Compact item spec, same order as the original tuple: [count, pStart, pSpan, tmin, tmax, node]. */
const item = (
  prop: PropKind,
  [count, pStart, pSpan, thetaMin, thetaMax, node]: [number, number, number, number, number, 0 | 1],
  extra: Partial<Pick<WorldItemSpec, 'windowColor' | 'reverse' | 'hub'>> = {},
): WorldItemSpec => ({ prop, count, pStart, pSpan, thetaMin, thetaMax, node: node === 1, ...extra });

/** The five worlds Jorge terraforms, in travel order (perfil/index.html L1498–1514). */
export const WORLDS: WorldConfig[] = [
  {
    name: 'Origen',
    pos: [0, 0, 0],
    R: 2,
    off: [1.3, 0.7, 2.1, 0, 0],
    atmo: 0x8ec8ff,
    phases: ['Suelo', 'Vida', 'Infraestructura', 'Red'],
    barren: [0x6e5244, 0x7d5e4b, 0x8c6d55],
    deep: 0x2f6a9a,
    water: 0x3f84b8,
    edge: 0xd8b779,
    main: [0x4b9358, 0x5aa864, 0x6dbb70],
    items: [
      item('tree', [46, 0.12, 0.42, 0.42, 2.95, 0]),
      item('rack', [9, 0.5, 0.24, 0.5, 2.6, 1]),
      item('building', [11, 0.5, 0.26, 0.5, 2.7, 1]),
      item('antenna', [4, 0.56, 0.2, 0.6, 2.4, 1]),
    ],
  },
  {
    name: 'Arena',
    pos: [15, 5, -12],
    R: 1.8,
    off: [0.4, 2.2, 1.1, 1.7, 0.9],
    atmo: 0xffb38a,
    phases: ['Polvo', 'Energía solar', 'Hábitat', 'Red'],
    barren: [0x7e3422, 0x93412a, 0xa94f31],
    deep: 0x2f8f86,
    water: 0x45b0a0,
    edge: 0x6aa85a,
    main: [0xc98a4f, 0xd99a5b, 0xe6b06e],
    items: [
      item('solar', [34, 0.12, 0.42, 0.42, 2.95, 0]),
      item('dome', [7, 0.5, 0.24, 0.5, 2.6, 1]),
      item('extractor', [7, 0.5, 0.24, 0.5, 2.6, 1]),
      item('antenna', [3, 0.56, 0.2, 0.6, 2.4, 1]),
    ],
  },
  {
    name: 'Hielo',
    pos: [-4, 11, -28],
    R: 2.1,
    off: [2.4, 0.3, 1.6, 0.8, 2.2],
    atmo: 0x9ff5d8,
    phases: ['Deshielo', 'Viento', 'Datos', 'Red'],
    barren: [0x4e5870, 0x5a6680, 0x67748f],
    deep: 0x2f86a8,
    water: 0x4fb3c8,
    edge: 0xa8c8e8,
    main: [0xd9e5f3, 0xe9f1fb, 0xf6faff],
    aurora: true,
    items: [
      item('pine', [30, 0.12, 0.42, 0.42, 2.95, 0]),
      item('turbine', [10, 0.2, 0.34, 0.45, 2.7, 0]),
      item('datacenter', [9, 0.5, 0.24, 0.5, 2.6, 1]),
      item('rack', [5, 0.52, 0.22, 0.5, 2.6, 1]),
      item('antenna', [3, 0.56, 0.2, 0.6, 2.4, 1]),
    ],
  },
  {
    name: 'Núcleo',
    pos: [13, 17, -44],
    R: 1.9,
    off: [1.9, 1.4, 0.2, 2.5, 1.3],
    atmo: 0xff8c5a,
    phases: ['Enfriar', 'Geotermia', 'Forja', 'Red'],
    lava: 0xff6a2b,
    barren: [0x2a2228, 0x352a30, 0x41323a],
    deep: 0xff6a2b,
    water: 0xe8552a,
    edge: 0x6b5a4a,
    main: [0x3d5a3e, 0x4c6b46, 0x5d7a50],
    items: [
      item('crystal', [24, 0.12, 0.42, 0.42, 2.95, 0]),
      item('geoplant', [8, 0.22, 0.32, 0.45, 2.7, 1]),
      item('building', [9, 0.5, 0.24, 0.5, 2.6, 1], { windowColor: 0xff9a4a }),
      item('antenna', [3, 0.56, 0.2, 0.6, 2.4, 1]),
    ],
  },
  {
    name: 'Colonia',
    pos: [-3, 22, -60],
    R: 2.0,
    off: [0.7, 1.9, 2.6, 1.1, 0.4],
    atmo: 0xffd59a,
    phases: ['Escuchar', 'Organizar', 'Construir juntos', 'Red'],
    crew: 14,
    barren: [0x5d566b, 0x6a6278, 0x786f86],
    deep: 0x2f7fab,
    water: 0x4aa3c9,
    edge: 0xe3cf8f,
    main: [0x7fae5a, 0x8fbf63, 0xa3cc6e],
    items: [
      item('crate', [16, 0.24, 0.2, 0.5, 2.7, 0], { reverse: true }),
      item('table', [4, 0.2, 0.06, 1.05, 1.75, 1], { hub: true }),
      item('tree', [16, 0.12, 0.42, 0.42, 2.95, 0]),
      item('building', [6, 0.5, 0.24, 0.6, 2.5, 1], { windowColor: 0x9fd8ff }),
      item('dome', [4, 0.52, 0.22, 0.6, 2.5, 1]),
      item('antenna', [2, 0.56, 0.2, 0.6, 2.4, 1]),
    ],
  },
];

/** World 05: the question mark (contact). */
export const MYSTERY: BodyConfig = { pos: [13, 28, -76], R: 1.7 };

/** The averno: decode9's fire planet, last stop. */
export const AVERNO: BodyConfig = { pos: [-9, 35, -94], R: 1.8 };

/** The Empire's sun, centre of the background galaxy (Jorge never goes there). */
export const SUN: BodyConfig = { pos: [-37, -13, -247], R: 6 };

/** Logo layer that orbits over the sun (extracted from the inline data URI of the original). */
export const SUN_LOGO_URL = '/perfil/img/sol-empire.png';
