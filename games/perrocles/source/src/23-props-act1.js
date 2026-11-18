// ═══ ACT I PROPS: the Argolid, Tiryns and Nemea ═══
// Hermes' stall: a striped awning, a table of oddments, winged sandals, a sword on show, and a herm keeping watch
function paintStall(x, cx, gy, P) {
  const W = 52, H = 40, x0 = cx - W / 2;
  line(x, x0 + 2, gy, x0 + 2, gy - H, P.woodD, 2.4); line(x, x0 + W - 2, gy, x0 + W - 2, gy - H, P.woodD, 2.4);
  // the awning: purple and cream stripes, scalloped edge
  for (let k = 0; k < 8; k++) { poly(x, [[x0 - 4 + k * 7.5, gy - H - 6], [x0 + 3.5 + k * 7.5, gy - H - 6], [x0 + 3 + k * 7.5, gy - H + 4], [x0 - 4.5 + k * 7.5, gy - H + 4]], k % 2 ? '#efe2c4' : '#7a4a8a'); ell(x, x0 - 0.5 + k * 7.5, gy - H + 4, 3.8, 2.4, k % 2 ? '#efe2c4' : '#7a4a8a'); }
  rect(x, x0 - 5, gy - H - 8, W + 10, 2.5, P.woodD); rect(x, x0 - 5, gy - H - 8, W + 10, 1, P.woodL);
  // table and wares
  rect(x, x0, gy - 15, W, 3, P.woodL); rect(x, x0, gy - 12, W, 1.2, P.woodD); rect(x, x0 + 3, gy - 12, 2, 12, P.wood); rect(x, x0 + W - 5, gy - 12, 2, 12, P.wood);
  for (const [dx, h, c] of [[6, 9, '#b8643a'], [12, 7, '#d8a860'], [17, 10, '#8a4a2a']]) { ell(x, x0 + dx, gy - 15 - h * 0.45, 2.6, h * 0.5, c); rect(x, x0 + dx - 1, gy - 15 - h - 1.5, 2, 2, darken(c, 0.2)); }
  // a xiphos laid on a cloth
  rect(x, x0 + 22, gy - 17, 16, 2, '#7a2a2a'); line(x, x0 + 24, gy - 18.5, x0 + 36, gy - 18.5, '#d8d4c8', 1.4); rect(x, x0 + 22, gy - 19.5, 1.5, 3, '#c8a040'); rect(x, x0 + 20, gy - 19, 2.5, 2, P.woodD);
  // winged sandals
  for (const dx of [41, 46]) { rect(x, x0 + dx, gy - 16.5, 4, 1.5, '#8a5a30'); poly(x, [[x0 + dx + 1, gy - 17], [x0 + dx - 1.5, gy - 20.5], [x0 + dx + 2.5, gy - 18]], '#f4f0e8'); }
  // a hanging string of figs and a little bell
  line(x, x0 + 6, gy - H + 4, x0 + 6, gy - H + 12, '#8a7a5a', 0.6); for (let k = 0; k < 3; k++) ell(x, x0 + 6, gy - H + 7 + k * 2.4, 1.2, 1.1, '#6a3a5a');
  line(x, x0 + W - 8, gy - H + 4, x0 + W - 8, gy - H + 9, '#8a7a5a', 0.6); ell(x, x0 + W - 8, gy - H + 10.5, 1.6, 1.8, '#c8a040');
  paintHerm(x, x0 + W + 12, gy, P);
}
// Cyclopean masonry: blocks so big the Greeks said the Cyclopes laid them
function paintCyclopean(x, r, x0, x1, gy, h, P, o = {}) {
  const top = gy - h; rect(x, x0, top, x1 - x0, h, P.stoneD);
  let y = gy; while (y > top + 2) { const rowH = 10 + r() * 9; let xx = x0 - r() * 12;
    while (xx < x1) { const bw = 14 + r() * 22, j = r() * 2.5, yt = Math.max(top, y - rowH); const c = r() < 0.3 ? P.stoneL : r() < 0.6 ? P.stone : mix(P.stone, '#b8a080', 0.3);
      poly(x, [[xx + j, y - 0.6], [xx + bw - j, y - 0.6 - r()], [xx + bw - 1 + r(), yt + 1.2], [xx + 1 + r() * 2, yt + 0.6 + r()]], c);
      line(x, xx + 1, yt + 1, xx + bw - 2, yt + 1, lighten(c, 0.12), 0.8); if (r() < 0.35) line(x, xx + bw * 0.3, yt + 3, xx + bw * 0.5, y - 3, darken(c, 0.12), 0.6);
      xx += bw; }
    y -= rowH; }
  // weathering: grass tufts on the top course, a stain or two
  for (let k = x0; k < x1; k += 5 + r() * 9) { rect(x, k, top - 2, 1, 2.4, P.grassD); rect(x, k + 1.5, top - 1.6, 1, 1.8, P.grass); }
  if (o.crenel) for (let k = x0; k < x1; k += 16) rect(x, k, top - 6, 9, 6, P.stone);
}
// the Lion Gate: two jambs, a lintel, and the relief of two lions at a column
function paintLionGate(x, cx, gy, P) {
  const W = 46, H = 62, x0 = cx - W / 2, op = 20;
  rect(x, x0, gy - H, 13, H, P.stone); rect(x, x0 + W - 13, gy - H, 13, H, P.stone);
  for (let k = 0; k < 4; k++) { line(x, x0, gy - 15 - k * 13, x0 + 13, gy - 15 - k * 13, P.stoneD, 0.8); line(x, x0 + W - 13, gy - 12 - k * 13, x0 + W, gy - 12 - k * 13, P.stoneD, 0.8); }
  rect(x, cx - op / 2, gy - H + 14, op, H - 14, '#1c1612'); rect(x, cx - op / 2, gy - 8, op, 8, '#2a2016');
  rect(x, x0 - 2, gy - H + 8, W + 4, 7, P.stoneL); rect(x, x0 - 2, gy - H + 14, W + 4, 1.2, P.stoneD);
  // the relieving triangle with the lions
  poly(x, [[cx - 18, gy - H + 8], [cx, gy - H - 18], [cx + 18, gy - H + 8]], mix(P.stoneL, '#c8b090', 0.4));
  rect(x, cx - 1.6, gy - H - 6, 3.2, 14, P.stoneD); rect(x, cx - 3, gy - H - 8, 6, 2, P.stoneD);
  for (const s of [-1, 1]) { const lx = cx + s * 9; poly(x, [[lx - s * 6, gy - H + 7], [lx - s * 6, gy - H - 2], [lx - s * 2, gy - H - 6], [lx + s * 2, gy - H - 9], [lx + s * 2.6, gy - H - 4], [lx + s * 1.4, gy - H + 7]], darken(P.stoneL, 0.18)); ell(x, lx + s * 2.4, gy - H - 10, 2, 2, darken(P.stoneL, 0.22)); }
  // flanking walls
  paintCyclopean(x, rng(cx), x0 - 70, x0, gy, 50, P); paintCyclopean(x, rng(cx + 3), x0 + W, x0 + W + 70, gy, 50, P);
}
// Hestia's hearth: a round stone ring, ash, a pot, and (in the world layer) a live fire
function paintHearth(x, cx, gy, P) {
  ell(x, cx, gy - 1, 15, 4, P.stoneD); for (let k = 0; k < 10; k++) { const a = Math.PI + k / 9 * Math.PI; ell(x, cx + Math.cos(a) * 13, gy - 3 + Math.sin(a) * 3, 3, 2.4, k % 2 ? P.stone : P.stoneL); }
  ell(x, cx, gy - 3, 10, 2.4, '#3a2c24'); ell(x, cx, gy - 3.4, 7, 1.6, '#6a5a50');
  line(x, cx - 10, gy - 3, cx - 9, gy - 24, P.woodD, 1.4); line(x, cx + 10, gy - 3, cx + 9, gy - 24, P.woodD, 1.4); line(x, cx - 10, gy - 24, cx + 10, gy - 24, P.woodD, 1.6);
  line(x, cx, gy - 24, cx, gy - 17, '#5a5048', 0.7); ell(x, cx, gy - 14, 4.4, 3.6, '#5a4a40'); rect(x, cx - 3.6, gy - 17.6, 7.2, 1.4, '#3a3028');
}
// a pithos: a storage jar taller than a man; bronze for a king who hides in it
function paintPithos(x, cx, gy, s, P, bronze) {
  const c = bronze ? '#b0783a' : '#b8643a', cd = darken(c, 0.25), cl = lighten(c, 0.22);
  x.fillStyle = c; x.beginPath(); x.moveTo(cx - 5 * s, gy); x.bezierCurveTo(cx - 17 * s, gy - 10 * s, cx - 17 * s, gy - 34 * s, cx - 9 * s, gy - 40 * s); x.lineTo(cx + 9 * s, gy - 40 * s); x.bezierCurveTo(cx + 17 * s, gy - 34 * s, cx + 17 * s, gy - 10 * s, cx + 5 * s, gy); x.closePath(); x.fill();
  x.fillStyle = cd; x.beginPath(); x.moveTo(cx + 5 * s, gy); x.bezierCurveTo(cx + 17 * s, gy - 10 * s, cx + 17 * s, gy - 34 * s, cx + 9 * s, gy - 40 * s); x.lineTo(cx + 5 * s, gy - 40 * s); x.bezierCurveTo(cx + 11 * s, gy - 32 * s, cx + 11 * s, gy - 12 * s, cx + 2 * s, gy); x.closePath(); x.fill();
  ell(x, cx - 6 * s, gy - 24 * s, 2.4 * s, 9 * s, cl); rect(x, cx - 10 * s, gy - 43 * s, 20 * s, 3.5 * s, cd); ell(x, cx, gy - 43 * s, 10 * s, 2 * s, '#1a1410');
  for (const yy of [14, 26]) { x.strokeStyle = cd; x.lineWidth = 1.2 * s; x.beginPath(); x.ellipse(cx, gy - yy * s, 15.6 * s, 2 * s, 0, 0, Math.PI); x.stroke(); }
  if (bronze) for (let k = 0; k < 7; k++) ell(x, cx - 12 * s + k * 4 * s, gy - 20 * s + Math.sin(k) * 0.6, 0.8 * s, 0.8 * s, '#e8c070');
}
// the Nemean cave: a rocky hill with a dark mouth (two, in the myth; the far one shows as a lighter notch)
function paintCave(x, r, cx, gy, P) {
  const pts = [[cx - 110, gy], [cx - 96, gy - 30], [cx - 70, gy - 58], [cx - 30, gy - 78], [cx + 10, gy - 84], [cx + 50, gy - 70], [cx + 84, gy - 50], [cx + 110, gy - 22], [cx + 120, gy]];
  poly(x, pts, '#8a7a62'); poly(x, [[cx + 10, gy - 84], [cx + 50, gy - 70], [cx + 84, gy - 50], [cx + 110, gy - 22], [cx + 120, gy], [cx + 40, gy]], '#6e6050');
  for (let k = 0; k < 14; k++) { const a = r() * 200 - 100, b = gy - 6 - r() * 60; poly(x, [[cx + a, b], [cx + a + 6 + r() * 6, b - 2], [cx + a + 9, b + 4], [cx + a + 2, b + 5]], r() < 0.5 ? '#9a8a70' : '#76684e'); }
  x.fillStyle = '#120c08'; x.beginPath(); x.moveTo(cx - 26, gy); x.quadraticCurveTo(cx - 28, gy - 36, cx, gy - 42); x.quadraticCurveTo(cx + 28, gy - 36, cx + 26, gy); x.closePath(); x.fill();
  x.fillStyle = '#241812'; x.beginPath(); x.moveTo(cx - 18, gy); x.quadraticCurveTo(cx - 19, gy - 26, cx, gy - 30); x.quadraticCurveTo(cx + 19, gy - 26, cx + 18, gy); x.closePath(); x.fill();
  for (let k = 0; k < 5; k++) { const bx = cx - 30 + r() * 60; line(x, bx, gy - 1, bx + 3, gy - 2, '#d8d0c0', 1); } // bones at the mouth
  // a rockfall half-blocks the mouth: nobody's going in there now
  for (const [dx, dy, rx, ry] of [[-17, -8, 12, 9], [3, -10, 13, 11], [20, -7, 10, 8], [-6, -21, 9, 7], [11, -24, 8, 6], [-24, -3, 6, 4], [28, -3, 6, 4], [1, -31, 6, 5]]) { ell(x, cx + dx, gy + dy, rx, ry, '#7a6c56'); ell(x, cx + dx - rx * 0.25, gy + dy - ry * 0.35, rx * 0.6, ry * 0.45, '#9a8a6e'); ell(x, cx + dx + rx * 0.3, gy + dy + ry * 0.4, rx * 0.5, ry * 0.3, '#5e5242'); }
  for (let k = 0; k < 9; k++) { const sx = cx - 30 + r() * 60; ell(x, sx, gy - 1, 1.5 + r() * 1.5, 1, '#8a7c64'); } // pebbles
  ell(x, cx + 70, gy - 34, 7, 9, '#4a3c30'); // the far mouth, half hidden
  for (let k = cx - 100; k < cx + 110; k += 12 + r() * 14) { const gy2 = gy - 2; rect(x, k, gy2 - 3, 1, 3, P.grassD); }
}
function paintDeadTree(x, r, cx, gy, s, P) {
  const c = '#7a6a58', cd = '#5a4c40'; x.strokeStyle = c; x.lineCap = 'round';
  const br = (x0, y0, a, len, w, d) => { const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len; x.lineWidth = w; x.strokeStyle = d % 2 ? cd : c; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); if (d < 4) { br(x1, y1, a - 0.4 - r() * 0.3, len * 0.66, w * 0.62, d + 1); if (r() < 0.8) br(x1, y1, a + 0.35 + r() * 0.3, len * 0.6, w * 0.6, d + 1); } };
  br(cx, gy, -Math.PI / 2 + (r() - 0.5) * 0.2, 22 * s, 4 * s, 0);
}
function paintThorns(x, r, cx, gy, P) { for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.32, l = 6 + r() * 6; line(x, cx, gy, cx + Math.cos(a) * l, gy + Math.sin(a) * l, '#7a6a4a', 0.9); ell(x, cx + Math.cos(a) * l, gy + Math.sin(a) * l, 1.4, 1, '#8a8a52'); } ell(x, cx, gy - 2, 6, 3, '#7a7a4c'); }
