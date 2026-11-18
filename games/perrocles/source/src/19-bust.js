// ═══ BUSTS: dialogue portraits, three-quarter view, 40×44 ═══
// Big shapes (skull, hair, clothes, headgear) are painted at 4× and run through the sprite pipeline;
// the face is then placed pixel by pixel, so the eyes and mouth stay small, clean and readable.
const BW = 40, BH = 44, BK = 4;
// how each expression sits on the face
const BEXPR = {
  neutral: { eye: 'open', mouth: 'line' },
  happy: { eye: 'smile', mouth: 'smile', brow: 1 },
  sad: { eye: 'half', mouth: 'frown', inner: -1, down: 1 },
  surprised: { eye: 'wide', mouth: 'o', brow: 2, shine: true },
  cross: { eye: 'narrow', mouth: 'tight', inner: 1 },
  think: { eye: 'open', mouth: 'purse', look: -1, up: 1, oneBrow: true },
  tender: { eye: 'half', mouth: 'smile', inner: -1, blush: 0.35, shine: true },
  sly: { eye: 'half', mouth: 'smirk', look: 1, oneBrow: true },
  grin: { eye: 'smile', mouth: 'grin', brow: 1 },
  shy: { eye: 'half', mouth: 'small', down: 1, blush: 0.6 },
};
function bustCols(id, god) {
  const c = CAST[id], C = palOf(id, god ? 'g' : 'm'), o = Object.assign({}, c.o, god ? c.god.o : {});
  if (god) { const wht = !!c.god.white; return { vase: true, o, skin: wht ? WHITE_V : BLACK_V, skinS: wht ? WHITE_V : BLACK_V, hair: BLACK_V, hairL: BLACK_V, cloth: BLACK_V, cloth2: BLACK_V, trim: RED_V, metal: BLACK_V, beard: BLACK_V, cloak: BLACK_V, line: wht ? BLACK_V : CLAY_V, ink: wht ? BLACK_V : CLAY_V, lip: wht ? RED_V : CLAY_V, bg: CLAY_V, wht }; }
  const skin = C.skin, skinS = mix(darken(skin, 0.2), '#8a3a2a', 0.18);
  return { o, old: CAST[id].pr === 'elder', skin, skinS, hair: o.bald ? (C.hair || '#cfc6b6') : C.hair, hairL: lighten(C.hair, 0.2), cloth: C.cloth, cloth2: (c.pal && c.pal.cloth2) || darken(C.cloth, 0.22), trim: c.pal && c.pal.trim, metal: C.metal, beard: o.beardCol || C.horn, cloak: o.cloak,
    ink: '#2a1610', lid: mix(skinS, '#3a1a10', 0.45), lip: mix(skin, '#9a3a30', 0.5), lipD: '#5a2018', bg: (c.portrait && c.portrait.bg) || '#8a6a4a', shine: '#f8ecd8', blush: '#e07a70' };
}
// the shape pass, in 40×44 units
function bustShapes(x, K) {
  const P = () => { x.beginPath(); return x; }, fill = (col) => { x.fillStyle = col; x.fill(); }, ell = (cx, cy, rx, ry, col, a = 0) => { P(); x.ellipse(cx, cy, rx, ry, a, 0, 7); fill(col); };
  const stroke = (col, w) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); };
  return { P, fill, ell, stroke };
}
function drawBustBody(x, B) {
  const { P, fill, ell, stroke } = bustShapes(x), o = B.o, V = B.vase;
  // long hair / veil falls behind the shoulders
  if (o.veil) { P(); x.moveTo(11, 14); x.bezierCurveTo(9, 26, 6, 36, 3, 44); x.lineTo(20, 44); x.bezierCurveTo(16, 36, 14, 28, 16, 20); x.closePath(); fill(B.cloth2); }
  else if (!o.bald && (o.hair === 'long' || (o.female && o.hair !== 'bun'))) { P(); x.moveTo(12, 13); x.bezierCurveTo(7, 20, 7, 32, 9, 39); x.quadraticCurveTo(13, 41, 17, 37); x.bezierCurveTo(15, 30, 15, 24, 17, 18); x.closePath(); fill(B.hair); }
  // shoulders: the near shoulder (left) is broader, the far one turns away
  P(); x.moveTo(1, 44); x.bezierCurveTo(2, 38, 7, 34.5, 14, 33.6); x.lineTo(27, 33.2); x.bezierCurveTo(33, 34, 37, 37.5, 38, 44); x.closePath(); fill(B.cloth);
  if (!V) { P(); x.moveTo(27, 33.2); x.bezierCurveTo(33, 34, 37, 37.5, 38, 44); x.lineTo(32, 44); x.bezierCurveTo(31, 39, 29, 36, 25, 34.5); x.closePath(); fill(B.cloth2); }
  // folds
  x.beginPath(); x.moveTo(9, 44); x.quadraticCurveTo(11, 39.5, 15, 37); x.moveTo(14, 44); x.quadraticCurveTo(15.5, 40.5, 18, 38.6); x.moveTo(27, 44); x.quadraticCurveTo(26.5, 40, 24.5, 38); stroke(V ? B.line : B.cloth2, V ? 0.5 : 0.9);
  // neckline
  P(); x.moveTo(15.5, 33.6); x.quadraticCurveTo(20, 38.6, 25.5, 33.3); x.closePath(); fill(B.skin);
  if (B.trim && !V) { x.beginPath(); x.moveTo(15.2, 33.5); x.quadraticCurveTo(20, 39.4, 25.8, 33.2); stroke(B.trim, 0.9); }
  if (V) { x.beginPath(); x.moveTo(15.2, 33.5); x.quadraticCurveTo(20, 39.2, 25.8, 33.2); stroke(B.line, 0.5); }
  // neck
  P(); x.moveTo(16.4, 25); x.lineTo(16, 35); x.quadraticCurveTo(20, 37.4, 24.4, 34.6); x.lineTo(24.2, 27); x.closePath(); fill(B.skinS);
  // cloak over the near shoulder, pinned at the front
  if (B.cloak) { P(); x.moveTo(0, 44); x.bezierCurveTo(1, 37, 6, 33.4, 13, 32.6); x.quadraticCurveTo(15.5, 35, 15, 38.6); x.quadraticCurveTo(10, 40, 9, 44); x.closePath(); fill(V ? BLACK_V : B.cloak);
    if (!V) { x.beginPath(); x.moveTo(4, 40); x.quadraticCurveTo(7, 36.5, 11, 35.5); stroke(darken(B.cloak, 0.2), 0.8); } ell(14.6, 37.6, 1.3, 1.3, V ? B.line : '#d8b04a'); }
  else if (o.female || o.robe === 'short') ell(13.6, 35.2, 1.05, 1.05, V ? B.line : '#d8b04a'); // fibula
  if (o.aegis) { P(); x.moveTo(6, 44); x.bezierCurveTo(7, 38, 12, 35, 20, 35.4); x.bezierCurveTo(28, 35, 33, 38, 34, 44); x.closePath(); fill(BLACK_V); for (let i = 0; i < 9; i++) { x.beginPath(); x.arc(8 + i * 3.2, 43 - Math.sin(i / 8 * Math.PI) * 4.5, 1.1, 0, 7); stroke(CLAY_V, 0.4); } ell(20, 39.6, 1.8, 1.8, CLAY_V); }
}
function drawBustHead(x, B) {
  const { P, fill, ell, stroke } = bustShapes(x), o = B.o, V = B.vase;
  // skull + face, nose on the right contour
  P(); x.moveTo(11.6, 18); x.bezierCurveTo(11, 7.2, 28.6, 6.2, 29.4, 15.6); x.quadraticCurveTo(29.6, 17.6, 29.2, 19); x.lineTo(30.7, 22.5); x.quadraticCurveTo(30.4, 23.5, 29.2, 23.5);
  x.quadraticCurveTo(29.7, 24.6, 29.1, 25.2); if (B.old) { x.quadraticCurveTo(28.3, 29.2, 23.6, 30); x.quadraticCurveTo(17, 30.3, 13.8, 25.6); } else { x.bezierCurveTo(28.8, 28.4, 26, 29.8, 22.6, 29.6); x.bezierCurveTo(18.4, 29.4, 15, 27.6, 13.8, 25.2); } x.quadraticCurveTo(11.8, 22.4, 11.6, 18); x.closePath(); fill(B.skin);
  if (!V && B.old) { // age: soft form shading on the back of the head and under the jaw
    P(); x.moveTo(11.6, 18); x.quadraticCurveTo(11.8, 22.4, 13.8, 25.6); x.quadraticCurveTo(17, 30.3, 23.6, 30); x.quadraticCurveTo(17.4, 28.4, 15.4, 24); x.quadraticCurveTo(14, 20.6, 14.6, 16.4); x.closePath(); fill(mix(B.skin, B.skinS, 0.45)); }
  else if (V) { x.beginPath(); x.moveTo(15.2, 26.8); x.quadraticCurveTo(19, 30.6, 24, 30.2); stroke(B.line, 0.45); }
  // ear
  if (o.pointyEars) { P(); x.moveTo(13.2, 18.6); x.lineTo(8.6, 12.4); x.lineTo(15.6, 20.6); x.closePath(); fill(B.skinS); }
  ell(14.6, 21.2, 1.7, 2.5, B.skinS); if (!V) ell(14.9, 21.4, 0.7, 1.3, mix(B.skinS, '#5a2a1a', 0.35)); else { x.beginPath(); x.ellipse(14.6, 21.2, 1.7, 2.5, 0, 0, 7); stroke(B.line, 0.45); }
  // beard under the face
  if (o.beard) { P(); x.moveTo(14.4, 22); x.quadraticCurveTo(15, 27, 17.6, 29.2); x.quadraticCurveTo(19.4, 36, 24.4, 36.4); x.quadraticCurveTo(29, 35, 29.4, 28.6); x.quadraticCurveTo(29.6, 25.6, 29, 24.4); x.quadraticCurveTo(27, 25, 25, 24.6);
    x.quadraticCurveTo(22.4, 24.8, 20.6, 26.8); x.quadraticCurveTo(18.4, 25.4, 17.4, 22.2); x.closePath(); fill(B.beard);
    if (!V) { x.beginPath(); for (const [a, b, c2, d] of [[19, 30, 20, 34], [22.4, 30.6, 23, 35], [25.8, 30, 26, 34], [27.8, 28, 28, 32]]) { x.moveTo(a, b); x.quadraticCurveTo(a + 0.6, (b + d) / 2, c2, d); } stroke(darken(B.beard, 0.16), 0.7); }
    else { x.beginPath(); x.moveTo(20, 30.2); x.quadraticCurveTo(21, 33.4, 23.4, 35); x.moveTo(25, 29.8); x.quadraticCurveTo(26, 32.6, 25.6, 35); stroke(B.line, 0.45); }
    // moustache
    P(); x.moveTo(22.6, 25.2); x.quadraticCurveTo(25.6, 23.6, 29.2, 24.6); x.quadraticCurveTo(28, 26.6, 26, 25.8); x.quadraticCurveTo(24.4, 26.4, 22.6, 25.2); x.closePath(); fill(V ? B.beard : darken(B.beard, 0.08)); }
  // hair
  if (o.bald) { P(); x.moveTo(11.8, 22); x.quadraticCurveTo(10.6, 15.4, 13.8, 13.8); x.quadraticCurveTo(15.8, 15.6, 15.6, 18.6); x.quadraticCurveTo(13.8, 18.6, 13.6, 22.8); x.closePath(); fill(B.hair);
    if (!V) { ell(22, 10.6, 3.4, 1.4, lighten(B.skin, 0.25), -0.2); x.beginPath(); x.moveTo(16, 13.4); x.quadraticCurveTo(19, 12, 22, 12.6); stroke(mix(B.skin, B.skinS, 0.5), 0.5); } }
  else if (!o.helmet && !o.veil && !o.pilos) {
    if (o.hair === 'curls' || (!o.female && o.hair !== 'long' && o.hair !== 'bun')) {
      // a mop of curls: a ring of lumps over the skull, a few falling on the brow
      P(); x.moveTo(12, 23.5); const pts = [[10.6, 20], [10.4, 15.4], [12.4, 11.2], [15.8, 8.4], [20, 7.2], [24.4, 7.6], [28, 9.8], [30, 13.2]]; let px0 = 12, py0 = 23.5;
      for (const [ax, ay] of pts) { const mx = (px0 + ax) / 2, my = (py0 + ay) / 2, dx = ax - px0, dy = ay - py0, l = Math.hypot(dx, dy) || 1; x.quadraticCurveTo(mx + dy / l * 2.4, my - dx / l * 2.4, ax, ay); px0 = ax; py0 = ay; }
      x.quadraticCurveTo(29.6, 15.6, 27.6, 15.2); x.quadraticCurveTo(26.6, 16.8, 25, 15.6); x.quadraticCurveTo(23.6, 16.8, 22, 15.4); x.quadraticCurveTo(20.6, 16.6, 19.2, 15.2); x.quadraticCurveTo(17.6, 15.6, 16.8, 17.6); x.quadraticCurveTo(15.6, 18.6, 15.4, 21); x.quadraticCurveTo(14, 21.4, 14, 24); x.closePath(); fill(B.hair);
      if (!V) { x.beginPath(); for (const [ax, ay, r0] of [[14.4, 12.6, 2.2], [19.2, 10, 2.3], [24.4, 10.4, 2], [12.6, 17.6, 1.8], [27.6, 13, 1.4], [21.4, 13.6, 1.3]]) { x.moveTo(ax + Math.cos(3.7) * r0, ay + Math.sin(3.7) * r0); x.arc(ax, ay, r0, 3.7, 5.5); } stroke(B.hairL, 0.9); }
      else { x.beginPath(); for (const [ax, ay, r0] of [[14.4, 12.6, 2.2], [19.2, 10, 2.3], [24.4, 10.4, 2], [12.6, 17.6, 1.8]]) { x.moveTo(ax + Math.cos(3.7) * r0, ay + Math.sin(3.7) * r0); x.arc(ax, ay, r0, 3.7, 5.5); } stroke(B.line, 0.45); } }
    else { // smooth hair parted and drawn back
      P(); x.moveTo(12, 24.5); x.bezierCurveTo(8.6, 14, 15, 6.4, 21.6, 6.6); x.bezierCurveTo(26.6, 6.8, 30.2, 10, 29.8, 15); x.quadraticCurveTo(26.4, 12.6, 22.4, 13.6); x.quadraticCurveTo(18.4, 14.4, 16.6, 17.6); x.quadraticCurveTo(15.6, 19.4, 15.8, 21.6); x.quadraticCurveTo(14, 21, 13.6, 24.6); x.closePath(); fill(B.hair);
      if (!V) { x.beginPath(); x.moveTo(14, 15); x.quadraticCurveTo(18, 9.4, 25, 9.6); x.moveTo(13.4, 19.6); x.quadraticCurveTo(14.6, 13.6, 19, 11.6); stroke(B.hairL, 0.8); }
      else { x.beginPath(); x.moveTo(14, 15); x.quadraticCurveTo(18, 9.4, 25, 9.6); stroke(B.line, 0.45); }
      if (o.hair === 'bun' || (o.female && o.hair !== 'long')) { ell(10.6, 11.4, 4.1, 3.8, B.hair); if (!V) { x.beginPath(); x.arc(10.6, 11.4, 2.4, 3.4, 5.6); stroke(B.hairL, 0.8); } x.beginPath(); x.moveTo(13.2, 8.6); x.quadraticCurveTo(14.6, 11.4, 13.4, 14.4); stroke(V ? B.line : (B.trim || '#c8a040'), V ? 0.5 : 1.1); }
      if (o.female) { x.beginPath(); x.moveTo(15.6, 20.6); x.quadraticCurveTo(14.8, 24, 16, 26.4); stroke(B.hair, 0.7); } } }
  // headgear
  if (o.veil) { P(); x.moveTo(10.8, 26); x.bezierCurveTo(8, 12, 13, 5.2, 21, 5.4); x.bezierCurveTo(28, 5.6, 31.4, 10, 30.6, 15.6); x.quadraticCurveTo(26.4, 12.4, 21.6, 13); x.quadraticCurveTo(17.6, 13.6, 16.4, 17.6); x.quadraticCurveTo(15.2, 22, 16.4, 27); x.closePath(); fill(B.cloth);
    if (!V) { x.beginPath(); x.moveTo(13, 24); x.quadraticCurveTo(12, 14, 18, 9.4); x.moveTo(16, 8.2); x.quadraticCurveTo(22, 6.6, 27, 9.4); stroke(B.cloth2, 0.8); } }
  if (o.pilos) { P(); x.moveTo(10.4, 16.8); x.quadraticCurveTo(12, 6, 18.6, 2.2); x.quadraticCurveTo(22.4, 1.2, 24.8, 3.6); x.quadraticCurveTo(29.6, 9, 30.4, 15.4); x.quadraticCurveTo(20, 13.2, 10.4, 16.8); x.closePath(); fill(V ? BLACK_V : o.pilos);
    x.beginPath(); x.moveTo(10.8, 15.4); x.quadraticCurveTo(20, 11.8, 30.2, 14); stroke(V ? B.line : darken(o.pilos, 0.25), 1); if (!V) { x.beginPath(); x.moveTo(15, 9); x.quadraticCurveTo(19, 4.8, 23, 4.8); stroke(lighten(o.pilos, 0.18), 0.8); }
    P(); x.moveTo(10.6, 16.6); x.quadraticCurveTo(10.2, 21, 12.4, 23.8); x.quadraticCurveTo(13.8, 20, 14.8, 17.2); x.closePath(); fill(B.hair); }
  if (o.petasos) { ell(20.4, 12.2, 12.6, 2.6, V ? BLACK_V : (B.o.cloak ? darken(B.o.cloak, 0.05) : '#8a6a3a'), -0.06); P(); x.moveTo(13.4, 12); x.quadraticCurveTo(14.6, 4.4, 21, 4.6); x.quadraticCurveTo(27.4, 5, 27.6, 11.4); x.closePath(); fill(V ? BLACK_V : '#9a7a4a'); }
  if (o.helmUp) { // Corinthian helmet pushed up on the crown, crest sweeping back
    P(); x.moveTo(11.2, 14); x.bezierCurveTo(11, 5, 28.4, 4, 29.8, 12.6); x.lineTo(30.4, 15); x.quadraticCurveTo(24, 11.8, 18, 12.2); x.quadraticCurveTo(14, 12.6, 11.2, 14); x.closePath(); fill(V ? BLACK_V : B.metal);
    x.beginPath(); x.moveTo(12.2, 13); x.quadraticCurveTo(20, 9.2, 29.6, 12.4); stroke(V ? CLAY_V : darken(B.metal || '#c8a050', 0.3), 0.5);
    P(); x.moveTo(14, 7.4); x.bezierCurveTo(14, 0, 26, -1.6, 30, 3.4); x.quadraticCurveTo(26, 2.4, 22, 3.6); x.bezierCurveTo(18, 4.6, 13, 9, 9, 15); x.quadraticCurveTo(9.6, 10, 14, 7.4); x.closePath(); fill(V ? (o.crest && !B.wht ? RED_V : RED_V) : (o.crest || '#c0392b'));
    if (V) { x.beginPath(); for (let i = 0; i < 9; i++) { const t = i / 8, ax = 10 + t * 19, ay = 13 - Math.sin(t * Math.PI) * 10; x.moveTo(ax, ay); x.lineTo(ax + 1.2, ay - 1.6); } stroke(BLACK_V, 0.45); } }
  if (o.horns) for (const [hx, hy, s] of [[15.6, 9.2, 1], [22.6, 7.6, 0.85]]) { P(); x.moveTo(hx - 1.6 * s, hy + 1); x.quadraticCurveTo(hx - 4 * s, hy - 4 * s, hx - 1 * s, hy - 7.4 * s); x.quadraticCurveTo(hx - 1.2 * s, hy - 3.6 * s, hx + 1.6 * s, hy + 0.6); x.closePath(); fill(V ? BLACK_V : '#d8cfb8'); if (V) { x.beginPath(); x.moveTo(hx - 2 * s, hy - 2); x.lineTo(hx - 0.4 * s, hy - 2.4); stroke(CLAY_V, 0.4); } }
  if (o.laurel) { const lc = V ? (B.wht ? BLACK_V : CLAY_V) : '#4f7a3a', lc2 = V ? lc : '#6f9a48'; for (let i = 0; i < 9; i++) { const t = i / 8, ax = 12.4 + t * 16.4, ay = 13.4 - Math.sin(t * Math.PI) * 3.2 + t * 1.2; ell(ax, ay, 1.4, 0.7, i % 2 ? lc : lc2, -0.7 + t * 1.4); } }
}
// the face, placed by hand on the low-res bust
function drawBustFace(x, B, ex, blink, talk) {
  const V = B.vase, px = (cx, cy, w, h, col) => { x.fillStyle = col; x.fillRect(cx, cy, w, h); }, E = BEXPR[ex] || BEXPR.neutral, lk = E.look || 0, up = E.up ? -1 : 0, dn = E.down || 0;
  const ink = V ? (B.wht ? BLACK_V : CLAY_V) : B.ink, lid = V ? ink : B.lid, eyes = [[19, 1], [26, 0]]; // near eye, far eye
  const ey = 20 + up + dn;
  for (const [ex0, near] of eyes) { const x0 = ex0 + lk;
    if (V && !B.wht) { // black-figure: the eye is an incised almond with a dot
      px(x0 - 1, ey + 1, 4, 1, CLAY_V); px(x0, ey, 2, 1, CLAY_V); px(x0, ey + 2, 2, 1, CLAY_V); if (!blink) px(x0 + (lk > 0 ? 1 : 0), ey + 1, 1, 1, BLACK_V); continue; }
    if (blink || E.eye === 'closed') { px(x0 - 1, ey + 1, 4, 1, ink); continue; }
    if (E.eye === 'smile') { px(x0 - 1, ey + 2, 1, 1, ink); px(x0, ey + 1, 2, 1, ink); px(x0 + 2, ey + 2, 1, 1, ink); continue; }
    if (E.eye === 'half') { px(x0 - 1, ey, 4, 1, lid); px(x0, ey + 1, 2, 2, ink); if (E.shine && near) px(x0 + 1, ey + 1, 1, 1, mix(B.shine, ink, 0.25)); continue; }
    if (E.eye === 'narrow') { px(x0 - 1, ey + 1, 4, 1, lid); px(x0, ey + 2, 2, 1, ink); continue; }
    // open / wide: a small dark oval, 2×3
    px(x0, ey, 2, 3, ink); if (E.eye === 'wide') { px(x0 - 1, ey + 1, 1, 1, lid); px(x0 + 2, ey + 1, 1, 1, lid); }
    if (E.shine) px(x0 + 1, ey, 1, 1, B.shine); else if (!B.old && !V) px(x0 + 1, ey, 1, 1, mix(B.shine, ink, 0.45));
    if (B.o.female && !V) px(x0 + 2, ey - 1, 1, 1, ink); // a lash flick
  }
  // brows
  const bc = V ? ink : (B.o.bald ? mix(B.hair, B.skinS, 0.3) : darken(B.hair || '#3a2010', 0.2)), by = 17 + up + dn - (E.brow || 0) * 0.5, inn = E.inner || 0;
  const brow = (x0, len, innerSide, raise) => { for (let i = 0; i < len; i++) { const t = innerSide > 0 ? i / (len - 1) : 1 - i / (len - 1); px(x0 + i, Math.round(by - raise + t * inn), 1, 1, bc); } };
  brow(18 + lk, 4, 1, 0); brow(25 + lk, 3, -1, E.oneBrow ? 1 : 0);
  if (!V) { // nose: a shadow on the near side and a nostril
    if (B.old) { px(27, 21, 1, 2, mix(B.skin, B.skinS, 0.6)); px(28, 23, 1, 1, mix(B.skinS, '#4a2016', 0.3)); } else px(28, 23, 1, 1, mix(B.skin, B.skinS, 0.55)); }
  else if (!B.wht) px(27, 21, 1, 2, CLAY_V);
  // cheeks
  if (!V && E.blush) { x.globalAlpha = E.blush; px(18, 24, 3, 1, B.blush); px(28, 24, 1, 1, B.blush); x.globalAlpha = 1; }
  else if (!V && B.o.female) { x.globalAlpha = 0.22; px(18, 24, 3, 1, B.blush); x.globalAlpha = 1; }
  // mouth
  const lip = V ? (B.wht ? RED_V : CLAY_V) : B.lip, dark = V ? (B.wht ? BLACK_V : CLAY_V) : B.lipD, my = 26 + Math.max(0, dn - 0); let m = E.mouth;
  if (talk) m = m === 'smile' || m === 'grin' ? 'talkSmile' : m === 'o' ? 'o' : 'talk';
  switch (m) {
    case 'smile': px(23, my - 1, 1, 1, lip); px(24, my, 3, 1, lip); px(27, my - 1, 1, 1, lip); break;
    case 'frown': px(23, my + 1, 1, 1, lip); px(24, my, 3, 1, lip); px(27, my + 1, 1, 1, lip); break;
    case 'tight': px(24, my, 3, 1, dark); break;
    case 'smirk': px(23, my, 3, 1, lip); px(26, my - 1, 1, 1, lip); px(27, my - 2, 1, 1, lip); break;
    case 'purse': px(23, my, 2, 1, lip); px(23, my + 1, 1, 1, mix(lip, B.skin || lip, 0.5)); break;
    case 'small': px(24, my, 2, 1, lip); break;
    case 'o': px(24, my - 1, 2, 1, lip); px(23, my, 1, 2, lip); px(26, my, 1, 2, lip); px(24, my, 2, 2, dark); px(24, my + 2, 2, 1, lip); break;
    case 'grin': px(23, my - 1, 1, 1, lip); px(24, my - 1, 4, 1, V ? lip : '#f0e2cc'); px(24, my, 4, 1, dark); px(28, my - 1, 1, 1, lip); break;
    case 'talk': px(24, my, 3, 1, lip); px(24, my + 1, 3, 1, dark); px(25, my + 2, 1, 1, lip); break;
    case 'talkSmile': px(23, my - 1, 1, 1, lip); px(24, my, 4, 1, dark); px(24, my - 1, 3, 1, V ? lip : '#f0e2cc'); px(27, my - 1, 1, 1, lip); px(25, my + 1, 2, 1, lip); break;
    default: px(24, my, 3, 1, lip);
  }
}
// skin keeps only a thin, light rim of the cel shading; clothes and hair keep the full bands
function bustShade(L, B) { const S = celShade(L), w = L.width, h = L.height, r = L.data, d = S.data, skins = new Set([B.skin, B.skinS, mix(B.skin, B.skinS, 0.45)].map((c) => parseInt(c.slice(1), 16)));
  const isSkin = (x, y) => { if (x < 0 || y < 0 || x >= w || y >= h) return false; const i = (y * w + x) * 4; return r[i + 3] > 0 && skins.has((r[i] << 16) | (r[i + 1] << 8) | r[i + 2]); };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (!isSkin(x, y)) continue; const i = (y * w + x) * 4, rim = !isSkin(x + 1, y) || !isSkin(x, y + 1), lit = !isSkin(x - 1, y) || !isSkin(x, y - 1);
    const k = rim ? 0.4 : lit ? 0.3 : 0; for (let c = 0; c < 3; c++) d[i + c] = Math.round(r[i + c] + (d[i + c] - r[i + c]) * k); }
  return S; }
const BUST_BASE = new Map();
function portrait(id, expr = 'neutral', blink = false, talk = 0, w = 'm') {
  const god = w === 'g' && !!CAST[id].god, k = id + '|' + expr + '|' + blink + '|' + (talk ? 1 : 0) + '|' + (god ? 'g' : 'm'); let p = PORTRAITS.get(k); if (p) return p;
  const B = bustCols(id, god), bk = id + (god ? 'g' : 'm'); let base = BUST_BASE.get(bk);
  if (!base) { const cv = mkC(BW * BK, BH * BK), x = cv.getContext('2d'); x.scale(BK, BK); drawBustBody(x, B); drawBustHead(x, B); let L = downFast(getPx(cv), BK); if (!god) L = softOutline(bustShade(L, B)); base = toCanvas(L); BUST_BASE.set(bk, base); }
  const out = mkC(BW, BH), x = out.getContext('2d'); x.drawImage(base, 0, 0); drawBustFace(x, B, expr, blink, talk); PORTRAITS.set(k, out); out.bg = B.bg; return out;
}
