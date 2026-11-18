// ═══ PAINT: the backdrop painters. They draw at double resolution; the result is reduced to crisp pixels. ═══
// Light comes from the upper left, as on the characters. Coordinates are in screen pixels.
const PAL = {
  day: { sky: ['#4f78bc', '#6a92cc', '#8eb0da', '#b8cce0', '#e2d8c0', '#f2dcb0'], sun: '#fff4d0', far: '#8c9ac0', farL: '#b6c2dc', farD: '#6c7aa6', snow: '#f6f6fb', snowD: '#c4cce4', hill: '#7f9c68', hillL: '#a2b87c', hillD: '#5e7a52', hill2: '#6d8c5a',
    olive: '#87986a', oliveL: '#b2bd8e', oliveD: '#5c6b4c', trunk: '#6e5c48', trunkD: '#4a3c30', cyp: '#3a5a3c', cypL: '#567a4c', pine: '#4a6a44', pineL: '#6e8c56',
    wall: '#eadfc8', wallD: '#c8b898', wallL: '#f6eedc', stone: '#a8988a', stoneD: '#867868', stoneL: '#c4b6a6', roof: '#b9623c', roofL: '#d67e4c', roofD: '#8a4428', wood: '#6e4e32', woodD: '#4a3220', woodL: '#8e6a46', door: '#5a3a24', shutter: '#3c6c8c',
    dirt: '#c9aa7c', dirtL: '#dcc296', dirtD: '#a88a62', dirtDD: '#8a6e4c', grass: '#7f9e4c', grassL: '#a2bc5c', grassD: '#5c7a3c', flower: ['#d8483c', '#f0d050', '#f4f0e8', '#9a6ad0'] },
};
// ── small helpers ──
function poly(x, pts, col) { x.fillStyle = col; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.fill(); }
function ell(x, cx, cy, rx, ry, col, rot = 0) { x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, TAU); x.fill(); }
function rect(x, a, b, w, h, col) { x.fillStyle = col; x.fillRect(a, b, w, h); }
function line(x, a, b, c, d, col, w = 1) { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); }
// a noisy 1-D ridge: midpoint displacement between control points
function ridgePts(r, x0, x1, y0, y1, rough, depth = 7) { let pts = [[x0, y0], [x1, y1]]; for (let d = 0; d < depth; d++) { const np = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], dx = b[0] - a[0]; np.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + (r() - 0.5) * dx * rough], b); } pts = np; rough *= 0.62; } return pts; }
// ── sky: banded gradient with an ordered dither between bands ──
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function paintSky(x, w, h, cols0, horizon) { const cols = []; for (let i = 0; i < cols0.length - 1; i++) { cols.push(cols0[i], mix(cols0[i], cols0[i + 1], 0.5)); } cols.push(cols0[cols0.length - 1]); const n = cols.length - 1, bh = horizon / n;
  for (let i = 0; i < n; i++) { const y0 = i * bh; rect(x, 0, y0, w, bh + 1, cols[i]); x.fillStyle = cols[i + 1]; const zh = Math.min(6, Math.floor(bh * 0.6)); for (let yy = 0; yy < zh; yy++) { const dens = (yy + 1) / (zh + 1); for (let xx = 0; xx < w; xx++) if (BAYER[(Math.floor(y0 + bh - zh + yy) & 3) * 4 + (xx & 3)] < dens * 16) x.fillRect(xx, Math.floor(y0 + bh - zh + yy), 1, 1); } }
  rect(x, 0, horizon, w, h - horizon, cols[n]); }
function paintSun(x, cx, cy, r, col) { for (let k = 3; k >= 1; k--) { x.globalAlpha = 0.12 * (4 - k); ell(x, cx, cy, r + k * 7, r + k * 7, col); } x.globalAlpha = 1; ell(x, cx, cy, r, r, col); ell(x, cx - r * 0.25, cy - r * 0.25, r * 0.55, r * 0.55, '#ffffff'); }
// ── mountains, lit on their left faces, with snow ──
function paintRange(x, r, w, base, peaks, P, snowLine) { const ridges = peaks.map(([px, py, sp]) => [...ridgePts(r, px - sp, px, base - (base - py) * 0.1, py, 0.3, 6), ...ridgePts(r, px, px + sp, py, base - (base - py) * 0.1, 0.3, 6).slice(1)]);
  const top = []; for (let px = -10; px <= w + 10; px += 1) { let y = base; for (const R of ridges) if (px >= R[0][0] && px <= R[R.length - 1][0]) y = Math.min(y, yAt(R, px)); top.push([px, y]); }
  const body = () => { x.beginPath(); top.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.lineTo(w + 10, base + 80); x.lineTo(-10, base + 80); x.closePath(); };
  body(); x.fillStyle = P.far; x.fill(); x.save(); body(); x.clip();
  // local summits: a shadowed face falls to the right of each, a lit face to the left
  const peaksAt = []; for (const [px, py, sp] of peaks) { let best = -1, by = 1e9; for (let i = 0; i < top.length; i++) if (Math.abs(top[i][0] - px) < sp * 0.25 && top[i][1] < by) { by = top[i][1]; best = i; } if (best > 0) peaksAt.push(best); }
  for (const i of peaksAt) { const p = top[i], hgt = base - p[1]; let j = i; while (j < top.length - 1 && (top[j + 1][1] >= top[j][1] - 0.6 || top[j + 1][0] - p[0] < 16)) j++; const v = top[j]; poly(x, [p, ...top.slice(i + 1, j + 1), [v[0] + hgt * 0.15, base + 2], [p[0] + hgt * 0.38, base + 2]], P.farD);
    let k = i; while (k > 0 && (top[k - 1][1] >= top[k][1] - 0.6 || p[0] - top[k - 1][0] < 16)) k--; const u = top[k]; x.globalAlpha = 0.55; poly(x, [p, [p[0] + hgt * 0.1, p[1] + hgt * 0.5], [u[0] + (p[0] - u[0]) * 0.35, base], ...top.slice(k, i + 1)], P.farL); x.globalAlpha = 1; }
  // gullies running down from the saddles
  for (let i = 3; i < top.length - 3; i += 1) if (top[i][1] > top[i - 3][1] + 1 && top[i][1] > top[i + 3][1] + 1 && r() < 0.5) { const p = top[i], len = (base - p[1]) * (0.4 + r() * 0.4); x.strokeStyle = P.farD; x.lineWidth = 1; x.beginPath(); x.moveTo(p[0], p[1]); x.quadraticCurveTo(p[0] + len * 0.15, p[1] + len * 0.5, p[0] + len * 0.05, p[1] + len); x.stroke(); }
  if (snowLine) { const sl = (px) => snowLine + Math.sin(px * 0.21) * 3 + Math.sin(px * 0.067) * 7 + Math.sin(px * 0.9) * 1.5; x.beginPath(); top.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); for (let px = w + 10; px >= -10; px -= 2) x.lineTo(px, sl(px)); x.closePath(); x.fillStyle = P.snow; x.fill();
    for (const i of peaksAt) { const p = top[i]; if (p[1] > snowLine) continue; let j = i; while (j < top.length - 1 && (top[j + 1][1] >= top[j][1] - 0.6 || top[j + 1][0] - p[0] < 16)) j++; const v = top[j], hgt = base - p[1]; x.save(); x.beginPath(); top.forEach((q, n) => n ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1])); for (let px = w + 10; px >= -10; px -= 2) x.lineTo(px, sl(px)); x.closePath(); x.clip(); poly(x, [p, ...top.slice(i + 1, j + 1), [v[0] + hgt * 0.15, base], [p[0] + hgt * 0.38, base]], P.snowD); x.restore(); }
    for (let px = -10; px < w + 10; px += 2) { const yy = sl(px); if (r() < 0.3) rect(x, px, yy + r() * 3, 1, 1, P.snow); } }
  x.restore();
  // haze at the foot
  for (let k = 0; k < 5; k++) { x.globalAlpha = 0.09; rect(x, 0, base - 34 + k * 7, w, 80, P.sky[P.sky.length - 2]); } x.globalAlpha = 1; return top; }
// rolling hills
function paintHills(x, r, w, base, amp, col, colL, colD, n = 5) { const pts = []; for (let px = -10; px <= w + 10; px += 4) { let y = base; for (let k = 1; k <= n; k++) y -= Math.sin(px / (60 * k + r() * 0.01) + k * 1.7) * amp / k; pts.push([px, y]); }
  poly(x, [...pts, [w + 10, LH + 10], [-10, LH + 10]], col); for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; if (b[1] < a[1] - 0.4) poly(x, [a, b, [b[0], b[1] + 5], [a[0], a[1] + 5]], colL); else if (b[1] > a[1] + 0.4) poly(x, [a, b, [b[0], b[1] + 4], [a[0], a[1] + 4]], colD); } return pts; }
const yAt = (pts, px) => { for (let i = 0; i < pts.length - 1; i++) if (pts[i + 1][0] >= px) { const a = pts[i], b = pts[i + 1], k = (px - a[0]) / (b[0] - a[0] || 1); return a[1] + (b[1] - a[1]) * k; } return pts[pts.length - 1][1]; };
// ── trees ──
function clump(x, cx, cy, rr, P, r, cL = P.oliveL, c = P.olive, cD = P.oliveD) { ell(x, cx + rr * 0.15, cy + rr * 0.15, rr, rr * 0.86, cD); ell(x, cx, cy, rr * 0.92, rr * 0.8, c); ell(x, cx - rr * 0.3, cy - rr * 0.28, rr * 0.5, rr * 0.4, cL);
  for (let k = 0; k < rr * 0.9; k++) { const a = r() * TAU, d = r() * rr * 0.8; x.fillStyle = r() < 0.5 ? cL : cD; x.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, 1, 1); } }
function paintOlive(x, r, cx, gy, s, P) { // a gnarled, silver-leaved olive
  const tw = 3.2 * s, th = 16 * s; x.fillStyle = P.trunk; x.beginPath(); x.moveTo(cx - tw * 1.3, gy); x.bezierCurveTo(cx - tw * 0.6, gy - th * 0.4, cx - tw * 1.6, gy - th * 0.7, cx - tw * 0.4, gy - th); x.lineTo(cx + tw * 0.5, gy - th); x.bezierCurveTo(cx + tw * 1.2, gy - th * 0.6, cx + tw * 0.2, gy - th * 0.3, cx + tw * 1.4, gy); x.closePath(); x.fill();
  x.fillStyle = P.trunkD; x.beginPath(); x.moveTo(cx + tw * 0.2, gy); x.bezierCurveTo(cx + tw * 0.8, gy - th * 0.4, cx - tw * 0.1, gy - th * 0.7, cx + tw * 0.5, gy - th); x.lineTo(cx + tw * 0.5, gy - th); x.bezierCurveTo(cx + tw * 1.2, gy - th * 0.6, cx + tw * 0.2, gy - th * 0.3, cx + tw * 1.4, gy); x.closePath(); x.fill();
  for (const [bx, by, ex, ey] of [[-0.2, -0.9, -1.6, -1.35], [0.2, -0.95, 1.5, -1.4], [0, -1, 0.2, -1.6]]) { x.strokeStyle = P.trunk; x.lineWidth = 2 * s; x.beginPath(); x.moveTo(cx + bx * tw, gy + by * th); x.quadraticCurveTo(cx + (bx + ex) * tw * 0.5, gy + (by + ey) * th * 0.45, cx + ex * tw * 3, gy + ey * th); x.stroke(); }
  const cl = [[-9, -25, 8], [8, -27, 8.5], [0, -33, 9], [-15, -18, 6], [15, -19, 6.5], [-5, -20, 7], [6, -19, 6]]; for (const [dx, dy, rr] of cl.sort((a, b) => a[1] - b[1]).reverse()) clump(x, cx + dx * s, gy + dy * s, rr * s, P, r); }
function paintCypress(x, cx, gy, h, P) { const w = h * 0.16; x.fillStyle = P.cyp; x.beginPath(); x.moveTo(cx, gy - h); x.bezierCurveTo(cx + w * 1.2, gy - h * 0.7, cx + w * 1.1, gy - h * 0.15, cx + w * 0.4, gy); x.lineTo(cx - w * 0.4, gy); x.bezierCurveTo(cx - w * 1.1, gy - h * 0.15, cx - w * 1.2, gy - h * 0.7, cx, gy - h); x.fill();
  x.fillStyle = P.cypL; x.beginPath(); x.moveTo(cx - w * 0.15, gy - h * 0.94); x.bezierCurveTo(cx - w * 0.9, gy - h * 0.65, cx - w * 0.9, gy - h * 0.25, cx - w * 0.35, gy - h * 0.05); x.lineTo(cx - w * 0.15, gy - h * 0.1); x.bezierCurveTo(cx - w * 0.55, gy - h * 0.4, cx - w * 0.45, gy - h * 0.7, cx - w * 0.15, gy - h * 0.94); x.fill();
  for (let k = 0; k < h / 5; k++) { const yy = gy - h * 0.9 + k * 5, ww = w * Math.sin((k * 5 / h) * Math.PI * 0.95 + 0.2); rect(x, cx - ww * 0.6, yy, ww * 0.5, 1, darken(P.cyp, 0.2)); } }
function paintPine(x, r, cx, gy, h, P) { line(x, cx, gy, cx + 2, gy - h * 0.75, P.trunkD, 2.4); line(x, cx + 1, gy - h * 0.5, cx - h * 0.25, gy - h * 0.78, P.trunkD, 1.4); line(x, cx + 1.6, gy - h * 0.62, cx + h * 0.3, gy - h * 0.84, P.trunkD, 1.4);
  for (const [dx, dy, rx] of [[-0.25, -0.8, 0.22], [0.3, -0.86, 0.24], [0.02, -0.92, 0.3]]) { ell(x, cx + dx * h + 1, gy + dy * h + 1.5, rx * h, rx * h * 0.38, darken(P.pine, 0.25)); ell(x, cx + dx * h, gy + dy * h, rx * h, rx * h * 0.36, P.pine); ell(x, cx + dx * h - rx * h * 0.25, gy + dy * h - 1.5, rx * h * 0.55, rx * h * 0.18, P.pineL); } }
function paintFir(x, r, cx, gy, h, P) { rect(x, cx - 1, gy - h * 0.2, 2, h * 0.2, P.trunkD); const tiers = Math.max(3, Math.round(h / 9)); for (let k = 0; k < tiers; k++) { const t0 = k / tiers, yb = gy - h * 0.12 - t0 * h * 0.82, ww = h * 0.3 * (1 - t0 * 0.85), hh = h * 0.26;
    poly(x, [[cx - ww, yb], [cx, yb - hh], [cx + ww, yb]], '#2c4632'); poly(x, [[cx - ww, yb], [cx, yb - hh], [cx - ww * 0.15, yb]], '#46663e'); for (let q = -ww; q < ww; q += 2) if (r() < 0.6) rect(x, cx + q, yb - 1, 1, 2, q < 0 ? '#3a5a38' : '#22382a'); } }
// ── buildings ──
// a house seen from the long side: plastered wall over a stone base, a tiled roof, door, window, beams
function paintHouse(x, r, x0, gy, w, h, P, o = {}) { const rh = h * 0.42, side = o.side || 10;
  rect(x, x0 + w, gy - h, side, h, P.wallD); poly(x, [[x0 + w, gy - h], [x0 + w + side, gy - h - side * 0.35], [x0 + w + side, gy], [x0 + w, gy]], P.wallD);
  rect(x, x0, gy - h, w, h, P.wall); rect(x, x0, gy - h, 3, h, P.wallL);
  for (let k = 0; k < w * h / 40; k++) { x.fillStyle = r() < 0.5 ? P.wallD : P.wallL; x.globalAlpha = 0.5; x.fillRect(x0 + r() * w, gy - h + r() * h, 1 + (r() < 0.3), 1); } x.globalAlpha = 1;
  const sb = 7; rect(x, x0, gy - sb, w, sb, P.stone); for (let k = 0; k < w; k += 5 + r() * 4) { rect(x, x0 + k, gy - sb, 1, sb, P.stoneD); rect(x, x0 + k + 1, gy - sb, 3, 1, P.stoneL); } rect(x, x0, gy - sb, w, 1, P.stoneD);
  // roof
  poly(x, [[x0 - 5, gy - h + 1], [x0 + w * 0.15, gy - h - rh], [x0 + w + side + 3, gy - h - rh - side * 0.35], [x0 + w + side + 6, gy - h - side * 0.35 + 1]], P.roofD);
  poly(x, [[x0 - 5, gy - h + 1], [x0 + w * 0.15, gy - h - rh], [x0 + w + 4, gy - h - rh], [x0 + w + 6, gy - h + 1]], P.roof);
  for (let row = 0; row < rh; row += 3) { const yy = gy - h - rh + row, xa = x0 + w * 0.15 - (row / rh) * (w * 0.15 + 5); for (let tx = xa; tx < x0 + w + 4; tx += 4) { rect(x, tx, yy, 3, 1, P.roofL); rect(x, tx + 3, yy, 1, 3, P.roofD); } }
  rect(x, x0 - 5, gy - h + 1, w + 11, 2, P.roofD); rect(x, x0 + w * 0.15, gy - h - rh - 1, w * 0.85 + 4, 2, P.roofL);
  for (let tx = x0 - 4; tx < x0 + w + 4; tx += 6) ell(x, tx, gy - h + 2.5, 1.4, 1.6, P.roofL);
  // beams under the eave
  for (let k = x0 + 4; k < x0 + w - 2; k += 9) { rect(x, k, gy - h + 3, 3, 2, P.woodD); }
  // door and window
  if (o.door !== false) { const dx = x0 + (o.doorAt ?? w * 0.3), dw = 12, dh = 22; rect(x, dx - 2, gy - dh - 2, dw + 4, dh + 2, P.stoneL); rect(x, dx, gy - dh, dw, dh, P.door); rect(x, dx + 1, gy - dh + 1, dw - 2, dh - 1, darken(P.door, 0.2)); for (let k = 1; k < dw; k += 3) rect(x, dx + k, gy - dh + 1, 1, dh - 1, P.door); rect(x, dx + dw - 3, gy - dh * 0.5, 1, 2, '#c8a050'); }
  if (o.win !== false) { const wx = x0 + (o.winAt ?? w * 0.68), wy = gy - h * 0.66; rect(x, wx - 1, wy - 1, 12, 10, P.stoneL); rect(x, wx, wy, 10, 8, '#2a2018'); rect(x, wx - 5, wy, 5, 8, P.shutter); rect(x, wx + 10, wy, 5, 8, P.shutter); rect(x, wx - 5, wy, 1, 8, darken(P.shutter, 0.3)); rect(x, wx + 14, wy, 1, 8, darken(P.shutter, 0.3)); if (o.pot) { rect(x, wx, wy + 8, 10, 3, P.roofD); for (let k = 0; k < 5; k++) ell(x, wx + 1 + k * 2, wy + 7, 1.2, 1.2, PAL.day.flower[k % 3]); } }
  if (o.vine) { for (let k = 0; k < 40; k++) { const vx = x0 + w - 6 + Math.sin(k * 0.7) * 4, vy = gy - k * h / 40; ell(x, vx, vy, 2, 1.6, k % 3 ? P.grassD : P.grass); } }
  return { door: x0 + (o.doorAt ?? w * 0.3) + 6 }; }
function paintStoneWall(x, r, x0, x1, gy, h, P) { rect(x, x0, gy - h, x1 - x0, h, P.stone); for (let yy = gy - h; yy < gy; yy += 4) { let k = x0 + (((yy / 4) | 0) % 2) * 3; while (k < x1) { const sw = 4 + r() * 5; rect(x, k, yy, sw - 1, 3, r() < 0.5 ? P.stone : P.stoneL); rect(x, k, yy + 3, sw, 1, P.stoneD); rect(x, k + sw - 1, yy, 1, 3, P.stoneD); k += sw; } } rect(x, x0, gy - h - 1, x1 - x0, 2, P.stoneL); }
function paintFence(x, x0, x1, gy, P) { for (let k = x0; k < x1; k += 7) { rect(x, k, gy - 14, 2, 14, P.wood); rect(x, k, gy - 14, 1, 14, P.woodL); } rect(x, x0, gy - 11, x1 - x0, 2, P.woodL); rect(x, x0, gy - 6, x1 - x0, 2, P.wood); }
