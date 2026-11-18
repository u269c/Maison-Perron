// ═══ LANDS: ground, ledges, painted layers, ambient life, and where everyone stands ═══
// layers: sky (fixed), far, mid, near (parallax), back (the play plane behind the actors). The foreground is drawn live.
const PARA = { far: 0.1, mid: 0.32, near: 0.62, back: 1 };
function groundY(L, px) { const g = L.ground; if (px <= g[0][0]) return g[0][1]; for (let i = 0; i < g.length - 1; i++) if (g[i + 1][0] >= px) { const a = g[i], b = g[i + 1], k = (px - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * smooth(k); } return g[g.length - 1][1]; }
// the ground band: grass lip, dirt with pebbles, darker depths; a paved way where asked
// a stream that cuts the road: earth banks, water down in the cut, and a plank bridge laid at the level of the road on both banks
function paintStreamCut(x, L, P, a, b, wy) { const ya = groundY(L, a), yb = groundY(L, b), top = Math.min(ya, yb);
  // the far side of the cut: earth in shadow, with roots and a few stones, from the road down to the water
  rect(x, a, top, b - a, LH - top, '#4e3a28'); rect(x, a, top, b - a, 2, '#3e5a2e'); for (let k = a; k < b; k += 2) { const h = (k * 7919) % 11; if (h < 3) rect(x, k, top + 2, 1, 2 + h, '#2e4422'); if (h === 5) ell(x, k, top + 6 + (k % 6), 1.6, 1, '#6a5640'); if (h === 7) rect(x, k, top + 4, 1, 1, '#3a2a1c'); }
  rect(x, a, wy - 1, b - a, LH - wy + 1, '#3e6a8e'); rect(x, a, wy - 1, b - a, 2, '#5a8ab0'); for (let k = a; k < b; k += 3) rect(x, k, wy + 2 + (k % 7), 2, 1, '#8ab8d8'); for (let k = a + 2; k < b; k += 9) rect(x, k, wy + 9 + (k % 5), 4, 1, '#335a7a');
  for (const [ex, ey, s] of [[a, ya, 1], [b, yb, -1]]) { // the bank faces, sloping down to the water
    for (let y = ey; y < LH; y++) { const into = y < wy ? Math.round((y - ey) * 0.25) : Math.round((wy - ey) * 0.25), px = s > 0 ? ex : ex - into - 3; rect(x, px, y, into + 3, 1, y < ey + 2 ? P.dirtL : y < wy ? (y % 3 ? P.dirt : P.dirtD) : '#2e4a5e'); }
    rect(x, s > 0 ? ex - 1 : ex - 2, ey, 3, 2, P.grass); rect(x, s > 0 ? ex - 1 : ex - 2, ey + 2, 3, 1, P.grassD); }
  // posts down into the stream, then the deck: two planks flush with the road
  for (const k of [a + 3, b - 5]) { rect(x, k, Math.min(ya, yb) + 2, 3, wy + 6 - Math.min(ya, yb), P.woodD); rect(x, k, Math.min(ya, yb) + 2, 1, wy + 6 - Math.min(ya, yb), P.woodL); }
  for (let k = a - 6; k < b + 6; k += 1) { const t = (k - a) / (b - a), y = Math.round(ya + (yb - ya) * Math.max(0, Math.min(1, t))) - 1; rect(x, k, y, 1, 3, (k % 9 === 0) ? P.woodD : P.wood || P.woodL); rect(x, k, y, 1, 1, P.woodL); }
  rect(x, a - 6, Math.round(ya) + 2, b - a + 12, 1, P.woodD); }
function paintGround(x, r, L, P, x0, x1) { const top = []; for (let px = x0 - 2; px <= x1 + 2; px += 2) top.push([px, groundY(L, px)]);
  poly(x, [...top, [x1 + 2, LH + 4], [x0 - 2, LH + 4]], P.dirt);
  const inCut = (px) => L.cut && px >= L.cut[0] && px < L.cut[1];
  for (const [px, py] of top) { if (inCut(px)) continue; rect(x, px, py + 1, 2, 2, P.dirtL); rect(x, px, py + 10, 2, 2, P.dirtD); rect(x, px, py + 12, 2, 4, P.grassD); rect(x, px, py + 13, 2, 2, P.grass); rect(x, px, py + 16, 2, LH, '#7a5e40'); rect(x, px, py + 26, 2, LH, '#64492f');
    if (r() < 0.35) rect(x, px, py + 11 - r() * 2, 1, 2, P.grassL); if (r() < 0.12) rect(x, px, py + 3 + r() * 6, 2, 1, P.dirtD); if (r() < 0.06) rect(x, px, py + 2 + r() * 7, 1, 1, '#f0e0c0'); }
  for (let k = x0; k < x1; k += 3 + r() * 8) { if (inCut(k)) continue; const py = groundY(L, k), d = 18 + r() * 30; ell(x, k, py + d, 1.8 + r() * 2.6, 1 + r() * 1.2, r() < 0.5 ? '#8a7258' : '#9a8468'); ell(x, k - 0.6, py + d - 0.6, 0.9, 0.5, '#b8a080'); }
  for (let k = x0; k < x1; k += 90 + r() * 120) { if (inCut(k)) continue; const py = groundY(L, k) + 19; x.strokeStyle = '#4a3624'; x.lineWidth = 1; x.beginPath(); x.moveTo(k, py); x.quadraticCurveTo(k + 6, py + 6, k + 3 + r() * 6, py + 12 + r() * 6); x.stroke(); }
  for (let k = x0; k < x1; k += 14 + r() * 20) { if (inCut(k) || inCut(k + 12)) continue; const py = groundY(L, k); for (let q = 0; q < 3; q++) rect(x, k + q * 5 + r() * 2, py + 4 + r() * 3, 3, 1, P.dirtD); }
  if (L.paved) for (const [a, b] of L.paved) for (let k = a; k < b; k += 10) { const py = groundY(L, k), sw = 9 + (k % 3); rect(x, k, py - 0.5, sw - 1, 6, P.stoneL); rect(x, k, py + 4.5, sw, 1.5, P.stoneD); rect(x, k + sw - 1, py - 0.5, 1, 6, P.stoneD); rect(x, k + 1, py, 3, 1, '#ece2d0'); }
  for (const [px, py] of top) { rect(x, px, py - 1, 2, 2, P.grass); if (r() < 0.55) rect(x, px, py - 2 - r() * 2.5, 1, 2.5, r() < 0.5 ? P.grassL : P.grassD); rect(x, px, py + 1, 2, 1, P.grassD); }
  for (let k = x0; k < x1; k += 6 + r() * 16) { const py = groundY(L, k); if (r() < 0.5) { for (let q = 0; q < 4; q++) rect(x, k + q - 1, py - 2 - Math.abs(1.5 - q) * -1 - r() * 3, 1, 3, q % 2 ? P.grassL : P.grass); } else if (r() < 0.4) ell(x, k, py - 2, 1.2, 1.2, choose(r, P.flower)); } }
const LANDS = {
  oloosson: { w: 2600, title: { fr: 'Oloosson, en Perrhébie', en: 'Oloosson, in Perrhaebia', el: 'Ολοοσσών, Περραιβία' }, music: 'village',
    ground: [[0, 226], [320, 226], [520, 223], [720, 225], [940, 222], [1120, 220], [1320, 222], [1520, 224], [1700, 219], [1900, 215], [2120, 219], [2320, 223], [2600, 226]],
    plats: [{ x: 1806, w: 30, h: 20 }, { x: 1838, w: 16, h: 32 }, { x: 1858, w: 52, h: 50, thin: true }, { x: 182, w: 8, h: 26, wall: true }],
    sky: (x, w, h, P) => { paintSky(x, w, h, P.sky, 190); paintSun(x, 395, 64, 11, P.sun); },
    far: (x, w, h, P, r) => paintRange(x, r, w, 196, [[150, 70, 150], [330, 52, 170], [470, 78, 130], [640, 94, 140], [760, 104, 110]], P, 102),
    mid: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 200, 18, P.hill, P.hillL, P.hillD); for (let k = 20; k < w; k += 9 + r() * 14) { const gy = yAt(pts, k); if (r() < 0.75) paintOlive(x, r, k, gy + 4, 0.32 + r() * 0.12, P); else paintCypress(x, k, gy + 4, 12 + r() * 10, P); }
      for (const [hx, hw] of [[380, 26], [412, 30], [450, 22], [480, 28]]) { const gy = yAt(pts, hx) + 6; paintHouse(x, r, hx, gy, hw, 14, P, { door: false, win: false, side: 4 }); } },
    near: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 214, 7, P.hill2, P.hillL, P.hillD, 3); for (let k = 0; k < w; k += 30 + r() * 40) { const gy = yAt(pts, k) + 6; const q = r(); if (q < 0.55) paintOlive(x, r, k, gy, 0.6 + r() * 0.2, P); else if (q < 0.85) paintCypress(x, k, gy, 30 + r() * 20, P); else paintStoneWall(x, r, k - 20, k + 26, gy, 7, P); } },
    back: (x, w, h, P, r, L) => { const G = (px) => groundY(L, px);
      paintOlive(x, r, 18, G(18) + 2, 1.15, P); paintHouse(x, r, 40, G(110), 140, 60, P, { doorAt: 42, winAt: 100, pot: true, side: 12 }); paintStoneWall(x, r, 182, 190, G(186), 26, P); paintPortico(x, r, 194, G(256), 130, 56, P); paintLoom(x, 256, G(256), P); paintShrine(x, 306, G(306), P);
      paintHives(x, 372, G(380), P); paintLaundryPosts(x, 430, 500, G(465), P); paintBushes(x, r, 510, 560, G(535), P); paintAmphorae(x, 520, G(530), 3, P);
      paintCypress(x, 600, G(600), 64, P); paintWell(x, 652, G(652), P); paintCypress(x, 740, G(740), 52, P);
      paintPortico(x, r, 808, G(910), 212, 52, P); paintPress(x, r, 900, G(900), P); paintAmphorae(x, 980, G(990), 4, P);
      paintPlane(x, r, 1208, G(1208), 1.0, P); paintBench(x, 1170, G(1170), P); paintStoneWall(x, r, 1240, 1320, G(1280), 12, P); paintShrine(x, 1300, G(1300) - 12, P);
      paintHouse(x, r, 1350, G(1400), 112, 54, P, { pot: true, doorAt: 70, winAt: 20 }); paintHouse(x, r, 1494, G(1550), 124, 64, P, { vine: true, doorAt: 30 }); paintStoneWall(x, r, 1630, 1676, G(1650), 14, P);
      paintFence(x, 1680, 1800, G(1740), P); paintStoneWall(x, r, 1806, 1836, G(1820), 20, P); paintRocks(x, r, 1846, G(1846), 1.4, P); paintOlive(x, r, 1888, G(1888) + 2, 1.9, P);
      paintCypress(x, 2040, G(2040), 70, P); paintCypress(x, 2070, G(2070), 56, P); paintRocks(x, r, 2200, G(2200), 1, P); paintOlive(x, r, 2280, G(2280) + 2, 1.1, P); paintHerm(x, 2400, G(2400), P); paintCypress(x, 2500, G(2500), 60, P);
      paintGround(x, r, L, P, 0, w); },
    lights: [[82, 196], [1420, 186], [1524, 190], [306, 204]], smoke: [[110, 140], [1540, 120], [306, 202]], laundry: [432, 498, 34], hives: [385, 214], chimney: [],
    birds: true, butterflies: [[480, 200], [1700, 190], [2250, 196]], leaves: [[1208, 150], [1888, 150]], dust: true,
  },
  road: { w: 2300, title: { fr: 'La route du Parnasse', en: 'The road to Parnassus', el: 'Ο δρόμος του Παρνασσού' }, music: 'road',
    ground: [[0, 228], [300, 224], [520, 212], [700, 208], [850, 218], [880, 220], [990, 220], [1040, 224], [1160, 212], [1400, 200], [1640, 204], [1860, 192], [2080, 196], [2300, 200]],
    plats: [{ x: 878, w: 114, h: 1, thin: true, bridge: true }, { x: 1290, w: 40, h: 22 }, { x: 1750, w: 50, h: 18 }], gap: [886, 984], cut: [884, 986],
    sky: (x, w, h, P) => { paintSky(x, w, h, ['#5a82c6', '#78a0d4', '#9cbce0', '#c4d4e4', '#e8dcc4', '#f4e0b8'], 180); paintSun(x, 120, 54, 10, P.sun); },
    far: (x, w, h, P, r) => paintRange(x, r, w, 192, [[120, 60, 140], [300, 40, 160], [500, 56, 150], [690, 70, 120]], P, 92),
    mid: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 196, 30, '#7a8a62', P.hillL, P.hillD); for (let k = 10; k < w; k += 7 + r() * 9) { const gy = yAt(pts, k); if (r() < 0.75) paintFir(x, r, k, gy + 4, 14 + r() * 10, P); else paintCypress(x, k, gy + 4, 10 + r() * 8, P); } },
    near: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 206, 16, '#6c7c56', P.hillL, P.hillD, 3); for (let k = 0; k < w; k += 24 + r() * 30) { const gy = yAt(pts, k) + 6; if (r() < 0.7) paintFir(x, r, k, gy, 34 + r() * 20, P); else paintRocks(x, r, k, gy, 1.2 + r() * 0.6, P); } },
    back: (x, w, h, P, r, L) => { const G = (px) => groundY(L, px); for (let k = 40; k < w; k += 80 + r() * 90) { if (k > 860 && k < 1000) continue; const q = r(); if (q < 0.45) paintFir(x, r, k, G(k) + 1, 60 + r() * 30, P); else if (q < 0.7) paintRocks(x, r, k, G(k), 1.6 + r(), P); else paintOlive(x, r, k, G(k) + 2, 1 + r() * 0.4, P); }
      paintRocks(x, r, 1300, G(1300), 2.2, P); paintRocks(x, r, 1770, G(1770), 2, P); paintShrine(x, 2140, G(2140), P); paintHerm(x, 2000, G(2000), P); paintGround(x, r, L, P, 0, w);
      // the stream under the log bridge
      paintStreamCut(x, L, P, 884, 986, 236); },
    water: [886, 984, 236], birds: true, eagles: true, butterflies: [[600, 200], [1500, 180]], leaves: [], dust: true, smoke: [[2140, 180]],
  },
  delphi: { w: 2500, title: { fr: 'Delphes', en: 'Delphi', el: 'Δελφοί' }, music: 'delphi',
    ground: [[0, 228], [420, 226], [700, 216], [900, 214], [1100, 204], [1300, 200], [1460, 194], [1760, 194], [1980, 190], [2200, 192], [2500, 194]],
    plats: [{ x: 1480, w: 280, h: 10, temple: true }], paved: [[420, 2500]],
    sky: (x, w, h, P) => { paintSky(x, w, h, ['#4c74b8', '#6a90cc', '#90b0d8', '#bccce0', '#e4d6bc', '#f0dab0'], 180); paintSun(x, 80, 48, 10, P.sun); },
    far: (x, w, h, P, r) => paintRange(x, r, w, 200, [[200, 100, 160], [420, 90, 180], [650, 110, 150]], Object.assign({}, P, { far: '#8e9ab6', farL: '#b0bcd4', farD: '#6e7a9c' }), 0),
    mid: (x, w, h, P, r) => { paintCliffs(x, r, w, 214, P); const pts = paintHills(x, r, w, 214, 6, '#7e9662', P.hillL, P.hillD, 3); for (let k = 10; k < w; k += 10 + r() * 16) { const gy = yAt(pts, k); if (r() < 0.6) paintOlive(x, r, k, gy + 4, 0.3 + r() * 0.1, P); else paintCypress(x, k, gy + 4, 12 + r() * 8, P); } },
    near: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 210, 10, '#738c5a', P.hillL, P.hillD, 3); for (let k = 30; k < w; k += 70 + r() * 70) { const gy = yAt(pts, k) + 6; const q = r(); if (q < 0.25) paintTemple(x, r, k, gy, 34, P, 0.42); else if (q < 0.7) paintCypress(x, k, gy, 34 + r() * 16, P); else for (let j = 0; j < 4; j++) paintColumn(x, k + j * 12, gy, 22 + r() * 10, P, r() < 0.4); } },
    back: (x, w, h, P, r, L) => { const G = (px) => groundY(L, px); paintSpring(x, r, 220, G(220), P); paintLaurel(x, r, 120, G(120), 1.4, P); paintLaurel(x, r, 340, G(340), 1.2, P);
      for (const k of [520, 640, 1020, 1160, 2120]) paintStatue(x, k, G(k), P); for (const k of [560, 1080, 1240, 2240]) paintTripod(x, k, G(k), P); paintCypress(x, 760, G(760), 60, P); paintLaurel(x, r, 860, G(860), 1.5, P);
      paintHouse(x, r, 1300, G(1340), 70, 40, P, { door: false, win: false, side: 6 }); for (let j = 0; j < 4; j++) paintColumn(x, 1305 + j * 18, G(1340) - 40 + 40, 0, P);
      paintTemple(x, r, 1500, G(1620), 240, P); ell(x, 1700, G(1700) - 14, 8, 6, '#d8ccb0'); for (let k = 0; k < 8; k++) ell(x, 1696 + Math.cos(k) * 5, G(1700) - 16 + Math.sin(k) * 3, 1.2, 1.2, '#b8a888');
      paintLaurel(x, r, 2000, G(2000), 1.4, P); paintCypress(x, 2320, G(2320), 70, P); paintColumn(x, 2400, G(2400), 40, P, true); paintColumn(x, 2430, G(2430), 30, P, true); paintGround(x, r, L, P, 0, w); },
    smoke: [[1080, 200], [1240, 188], [1620, 104]], birds: true, eagles: true, butterflies: [[300, 200], [900, 190]], leaves: [], dust: true, laurelLeaves: [[120, 180], [860, 170]], water: [196, 244, 220],
  },
};
// ── baking the painted layers (double resolution → crisp pixels), with a night version on demand ──
const LAYERS = {};
function bakeLayer(w, painter, P, r, L) { const c = mkC(w * 2, LH * 2), x = c.getContext('2d'); x.scale(2, 2); painter(x, w, LH, P, r, L); return toCanvas(downFast(getPx(c), 2)); }
function layerW(L, k) { return k === 'sky' ? LW : Math.ceil((L.w - LW) * PARA[k]) + LW; }
function bakeLand(id, onStep) { const L = LANDS[id]; if (LAYERS[id]) return LAYERS[id]; const P = PAL.day, out = {}; for (const k of ['sky', 'far', 'mid', 'near', 'back']) { out[k] = bakeLayer(layerW(L, k), L[k], P, rng(id.length * 97 + k.length * 13), L); if (onStep) onStep(k); } return (LAYERS[id] = out); }
// night: the day painting under a blue multiply, keeping its shape; lit windows added by the renderer
function tinted(c, col, a = 1) { const o = mkC(c.width, c.height), x = o.getContext('2d'); x.drawImage(c, 0, 0); x.globalCompositeOperation = 'multiply'; x.globalAlpha = a; x.fillStyle = col; x.fillRect(0, 0, o.width, o.height); x.globalAlpha = 1; x.globalCompositeOperation = 'destination-in'; x.drawImage(c, 0, 0); return o; }
const TINTS = { night: '#3c4878', dusk: '#e8a07a', dawn: '#c8a8c8' };
function landLayers(id, tod) { const base = bakeLand(id); if (!tod || tod === 'day') return base; const k = id + ':' + tod; if (LAYERS[k]) return LAYERS[k]; const out = {}; for (const n in base) out[n] = tinted(base[n], TINTS[tod]);
  if (tod === 'night') { const s = mkC(LW, LH), x = s.getContext('2d'); paintSky(x, LW, LH, ['#0c1028', '#141a3a', '#1e2650', '#2a3260', '#3a3e68', '#46446a'], 200); const r = rng(5); for (let i = 0; i < 160; i++) { x.fillStyle = r() < 0.2 ? '#fff8e0' : '#c8d0f0'; x.fillRect(r() * LW, r() * 170, 1, 1); } x.globalAlpha = 0.05; for (let i = 0; i < 90; i++) ell(x, 40 + i * 4.4 + r() * 6, 14 + i * 1.2 + Math.sin(i * 0.7) * 6 + r() * 6, 6 + r() * 8, 3 + r() * 3, '#c8d0ff', -0.25); x.globalAlpha = 1; for (let i = 0; i < 60; i++) { x.fillStyle = '#e8ecff'; x.fillRect(40 + i * 6.5 + r() * 10, 12 + i * 1.8 + r() * 14, 1, 1); } ell(x, 380, 52, 9, 9, '#f4f0dc'); ell(x, 383, 50, 8, 8, '#141a3a'); out.sky = s; }
  if (tod === 'dusk') { const s = mkC(LW, LH), x = s.getContext('2d'); paintSky(x, LW, LH, ['#3a4a8a', '#6a5a9a', '#b06a8a', '#e08a6a', '#f4b070', '#f8d090'], 200); paintSun(x, 420, 150, 14, '#ffe0a0'); out.sky = s; }
  return (LAYERS[k] = out); }
// the God's view backdrop: clay, a lighter centre, meander bands top and bottom
let GODBG = null;
function godBackdrop() { if (GODBG) return GODBG; const c = mkC(LW, LH), x = c.getContext('2d'); rect(x, 0, 0, LW, LH, CLAY_V); for (let k = 6; k >= 1; k--) { x.globalAlpha = 0.07; ell(x, LW / 2, LH * 0.48, 60 + k * 36, 40 + k * 22, '#d8784a'); } x.globalAlpha = 1;
  const band = (yy) => { rect(x, 0, yy, LW, 2, BLACK_V); rect(x, 0, yy + 14, LW, 2, BLACK_V); for (let q = 0; q < LW; q += 14) { rect(x, q, yy + 4, 10, 2, BLACK_V); rect(x, q + 8, yy + 4, 2, 8, BLACK_V); rect(x, q + 2, yy + 10, 8, 2, BLACK_V); rect(x, q + 2, yy + 6, 2, 6, BLACK_V); rect(x, q + 4, yy + 6, 2, 2, BLACK_V); } };
  band(4); return (GODBG = c); }
