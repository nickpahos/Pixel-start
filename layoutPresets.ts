import type { Layout, Layouts } from 'react-grid-layout';

// Widgets in use: search, datetime, stats, weather, links, donut, snake, life, maze
// links is always the largest widget in every layout

const e = (i: string, x: number, y: number, w: number, h: number): Layout =>
  ({ i, x, y, w, h, minW: 1, minH: 2 });

const SG: Layout = { i: 'settings-guard', x: 11, y: 0, w: 1, h: 1, static: true };

const MD: Layout[] = [
  { i: 'settings-guard', x: 11, y: 0, w: 1, h: 1, static: true },
  e('search', 0, 0, 11, 2),
  e('datetime', 0, 2, 6, 3), e('stats', 6, 2, 6, 3),
  e('weather', 0, 5, 6, 5),  e('links', 6, 5, 6, 10),
  e('donut', 0, 10, 3, 5),   e('snake', 3, 10, 3, 5),
  e('life', 0, 15, 6, 5),    e('maze', 6, 15, 6, 6),
];

const SM: Layout[] = [
  { i: 'settings-guard', x: 5, y: 0, w: 1, h: 1, static: true },
  e('search', 0, 0, 5, 2),
  e('datetime', 0, 2, 6, 3), e('stats', 0, 5, 6, 3),
  e('weather', 0, 8, 6, 4),  e('links', 0, 12, 6, 10),
  e('donut', 0, 22, 3, 5),   e('snake', 3, 22, 3, 5),
  e('life', 0, 27, 3, 5),    e('maze', 3, 27, 3, 5),
];

const lg = (items: Layout[]): Layouts => ({ lg: [SG, ...items], md: MD, sm: SM });

export const LAYOUT_NAMES = [
  'dashboard',    'sidebar.left', 'sidebar.right', 'narrow',
  'wide',         'links.top',    'links.bottom',  'bento',
  'three.col',    'stacked',      'asymmetric',    'compact',
  'zen',          'feature',      'top.bar',       'two.row',
  'equal',        'quad',         'magazine',      'inverted',
];

export const LAYOUT_PRESETS: Layouts[] = [

  // 1. dashboard — 8 cols, x:2, classic 2-col below search
  lg([
    e('search',   2, 0,  7, 2),
    e('datetime', 2, 2,  3, 3), e('stats',   5, 2,  4, 3),
    e('weather',  2, 5,  3, 5), e('links',   5, 5,  4, 9),
    e('donut',    2, 10, 3, 4), e('snake',   2, 14, 3, 4),
    e('life',     5, 14, 4, 4), e('maze',    2, 18, 7, 5),
  ]),

  // 2. sidebar.left — links on far left, 8 cols, x:0
  lg([
    e('search',   0, 0,  7, 2),
    e('links',    0, 2,  4, 10),
    e('datetime', 4, 2,  4, 3), e('stats',   4, 5,  2, 3),
    e('weather',  6, 5,  2, 5), e('donut',   4, 8,  2, 4),
    e('snake',    6, 10, 2, 4), e('life',    4, 12, 2, 4),
    e('maze',     0, 12, 4, 5),
  ]),

  // 3. sidebar.right — links on far right, 8 cols, x:1
  lg([
    e('search',   1, 0,  7, 2),
    e('links',    5, 2,  4, 10),
    e('datetime', 1, 2,  4, 3), e('stats',   1, 5,  2, 3),
    e('weather',  3, 5,  2, 5), e('donut',   1, 8,  2, 4),
    e('snake',    3, 10, 2, 4), e('life',    1, 12, 2, 4),
    e('maze',     5, 12, 4, 5),
  ]),

  // 4. narrow — 6 cols, centered x:3
  lg([
    e('search',   3, 0,  5, 2),
    e('datetime', 3, 2,  3, 3), e('stats',   6, 2,  2, 3),
    e('links',    3, 5,  5, 9),
    e('weather',  3, 14, 3, 5), e('donut',   6, 14, 2, 3),
    e('snake',    3, 19, 3, 4), e('life',    6, 17, 2, 4),
    e('maze',     3, 23, 5, 5),
  ]),

  // 5. wide — 10 cols, x:1
  lg([
    e('search',   1, 0,  9, 2),
    e('datetime', 1, 2,  3, 3), e('stats',   4, 2,  3, 3), e('weather', 7, 2, 3, 3),
    e('links',    1, 5,  7, 8),
    e('donut',    8, 5,  2, 4), e('snake',   8, 9,  2, 4),
    e('life',     1, 13, 5, 5), e('maze',    6, 13, 4, 5),
  ]),

  // 6. links.top — links dominates top, 8 cols, x:2
  lg([
    e('search',   2, 0,  7, 2),
    e('links',    2, 2,  7, 8),
    e('datetime', 2, 10, 3, 3), e('stats',   5, 10, 4, 2),
    e('weather',  2, 13, 4, 5), e('donut',   6, 12, 3, 3),
    e('snake',    2, 18, 4, 4), e('life',    6, 15, 3, 4),
    e('maze',     2, 22, 7, 5),
  ]),

  // 7. links.bottom — links anchors bottom, 8 cols, x:2
  lg([
    e('search',   2, 0,  7, 2),
    e('datetime', 2, 2,  4, 3), e('weather', 6, 2,  3, 4),
    e('stats',    2, 5,  2, 2), e('donut',   4, 5,  2, 4),
    e('snake',    6, 6,  3, 4), e('life',    2, 7,  2, 4),
    e('maze',     4, 9,  5, 4),
    e('links',    2, 13, 7, 9),
  ]),

  // 8. bento — bento box arrangement, 9 cols, x:1
  lg([
    e('search',   1, 0,  8, 2),
    e('links',    1, 2,  5, 8),
    e('datetime', 6, 2,  3, 4), e('stats',   6, 6,  3, 2),
    e('weather',  6, 8,  3, 4), e('donut',   1, 10, 2, 4),
    e('snake',    3, 10, 3, 4), e('life',    6, 12, 3, 4),
    e('maze',     1, 14, 8, 5),
  ]),

  // 9. three.col — 3 even columns, 9 cols, x:1
  lg([
    e('search',   1, 0,  8, 2),
    e('datetime', 1, 2,  3, 3), e('stats',   4, 2,  3, 3), e('weather', 7, 2, 2, 3),
    e('links',    1, 5,  3, 10),
    e('snake',    4, 5,  3, 5), e('donut',   7, 5,  2, 5),
    e('life',     4, 10, 3, 5), e('maze',    7, 10, 2, 7),
  ]),

  // 10. stacked — single column, 6 cols, x:3
  lg([
    e('search',   3, 0,  5, 2),
    e('datetime', 3, 2,  5, 3),
    e('stats',    3, 5,  5, 2),
    e('weather',  3, 7,  5, 4),
    e('links',    3, 11, 5, 10),
    e('donut',    3, 21, 2, 4), e('snake',  5, 21, 3, 4),
    e('life',     3, 25, 2, 4), e('maze',   5, 25, 3, 4),
  ]),

  // 11. asymmetric — uneven columns, 9 cols, x:0
  lg([
    e('search',   0, 0,  8, 2),
    e('links',    0, 2,  5, 9),
    e('datetime', 5, 2,  4, 4), e('stats',   5, 6,  2, 3),
    e('weather',  7, 6,  2, 6), e('donut',   5, 9,  2, 4),
    e('snake',    0, 11, 5, 5), e('life',    5, 12, 2, 5),
    e('maze',     0, 16, 9, 5),
  ]),

  // 12. compact — dense 7 cols, x:2
  lg([
    e('search',   2, 0,  6, 2),
    e('datetime', 2, 2,  4, 3), e('stats',   6, 2,  2, 2),
    e('weather',  6, 4,  2, 5),
    e('links',    2, 5,  4, 7),
    e('donut',    6, 9,  2, 3), e('snake',   6, 12, 2, 3),
    e('life',     2, 12, 4, 3),
    e('maze',     2, 15, 6, 5),
  ]),

  // 13. zen — minimal 6 cols, x:3, breathing room
  lg([
    e('search',   3, 0,  5, 2),
    e('datetime', 3, 2,  3, 4), e('stats',   6, 2,  2, 2),
    e('weather',  6, 4,  2, 4),
    e('links',    3, 6,  5, 9),
    e('donut',    3, 15, 2, 4), e('snake',  5, 15, 3, 4),
    e('life',     3, 19, 3, 4), e('maze',   6, 19, 2, 5),
  ]),

  // 14. feature — links as massive focal point, 8 cols, x:2
  lg([
    e('search',   2, 0,  7, 2),
    e('links',    2, 2,  7, 12),
    e('datetime', 2, 14, 2, 3), e('stats',  4, 14, 2, 2),
    e('weather',  6, 14, 3, 4), e('donut',  2, 17, 2, 3),
    e('snake',    4, 16, 2, 4), e('life',   2, 20, 3, 4),
    e('maze',     5, 20, 4, 4),
  ]),

  // 15. top.bar — thin info bar across top, links below, 9 cols, x:1
  lg([
    e('search',   1, 0,  8, 2),
    e('datetime', 1, 2,  2, 2), e('stats',  3, 2,  2, 2), e('weather', 5, 2, 2, 2), e('donut', 7, 2, 2, 2),
    e('links',    1, 4,  8, 9),
    e('snake',    1, 13, 4, 5), e('life',   5, 13, 4, 5),
    e('maze',     1, 18, 8, 5),
  ]),

  // 16. two.row — info row + links row + games row, 8 cols, x:2
  lg([
    e('search',   2, 0,  7, 2),
    e('datetime', 2, 2,  3, 4), e('weather', 5, 2, 2, 4), e('stats',  7, 2, 2, 2),
    e('links',    2, 6,  7, 8),
    e('donut',    2, 14, 2, 4), e('snake',  4, 14, 3, 4), e('life',   7, 14, 2, 4),
    e('maze',     2, 18, 7, 5),
  ]),

  // 17. equal — links bigger but others more balanced, 9 cols, x:1
  lg([
    e('search',   1, 0,  8, 2),
    e('datetime', 1, 2,  4, 4), e('weather', 5, 2, 4, 4),
    e('links',    1, 6,  8, 8),
    e('stats',    1, 14, 2, 3), e('donut',  3, 14, 2, 3), e('snake',  5, 14, 2, 3), e('life', 7, 14, 2, 3),
    e('maze',     1, 17, 8, 5),
  ]),

  // 18. quad — four-quadrant style, links takes Q1, 8 cols, x:2
  lg([
    e('search',   2, 0,  7, 2),
    e('links',    2, 2,  4, 8),  e('weather', 6, 2,  3, 4),
    e('datetime', 6, 6,  3, 4), e('stats',   2, 10, 2, 3),
    e('donut',    4, 10, 2, 3),  e('snake',   6, 10, 3, 3),
    e('life',     2, 13, 3, 4),  e('maze',    5, 13, 4, 5),
  ]),

  // 19. magazine — editorial layout, weather hero + links feature, 9 cols, x:0
  lg([
    e('search',   0, 0,  8, 2),
    e('weather',  0, 2,  3, 6), e('links',   3, 2,  6, 8),
    e('datetime', 0, 8,  3, 3), e('stats',   3, 10, 3, 2),
    e('donut',    6, 10, 3, 3), e('snake',   0, 11, 3, 4),
    e('life',     3, 12, 3, 4), e('maze',    6, 13, 3, 5),
  ]),

  // 20. inverted — games/fun at top, links anchors bottom, 8 cols, x:2
  lg([
    e('search',   2, 0,  7, 2),
    e('donut',    2, 2,  2, 4), e('snake',   4, 2,  3, 4), e('life',   7, 2,  2, 4),
    e('maze',     2, 6,  7, 5),
    e('datetime', 2, 11, 3, 3), e('stats',   5, 11, 2, 2), e('weather', 7, 11, 2, 4),
    e('links',    2, 14, 7, 9),
  ]),
];
