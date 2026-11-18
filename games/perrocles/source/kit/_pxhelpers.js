const mkC = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const getPx = (c) => c.getContext('2d').getImageData(0, 0, c.width, c.height);
function down(img, f) { const w = img.width / f | 0, h = img.height / f | 0, o = new ImageData(w, h), s = img.data, d = o.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { // pick the most covered colour in the f×f block
    const cnt = new Map(); let best = 0, bk = -1; for (let j = 0; j < f; j++) for (let i = 0; i < f; i++) { const p = ((y * f + j) * img.width + x * f + i) * 4; if (s[p + 3] < 128) continue; const k = (s[p] << 16) | (s[p + 1] << 8) | s[p + 2]; const v = (cnt.get(k) || 0) + 1; cnt.set(k, v); if (v > best) { best = v; bk = k; } }
    const q = (y * w + x) * 4; if (best * 2 >= f * f * 0.5 && bk >= 0) { d[q] = bk >> 16; d[q + 1] = bk >> 8 & 255; d[q + 2] = bk & 255; d[q + 3] = 255; } }
  return o; }
const at = (img, x, y) => x < 0 || y < 0 || x >= img.width || y >= img.height ? -1 : (y * img.width + x) * 4;
const opaque = (img, x, y) => { const p = at(img, x, y); return p >= 0 && img.data[p + 3] > 0; };
function tone(d, p, k) { if (k > 0) { d[p] += (255 - d[p]) * k; d[p + 1] += (255 - d[p + 1]) * k; d[p + 2] += (255 - d[p + 2]) * k; } else { d[p] *= 1 + k; d[p + 1] *= 1 + k; d[p + 2] *= 1 + k; } }
function shade(img, hi, lo) { const o = new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), d = o.data;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) { if (!opaque(img, x, y)) continue; const p = at(img, x, y);
    const up = !opaque(img, x, y - 1) || !opaque(img, x - 1, y), dn = !opaque(img, x, y + 1) || !opaque(img, x + 1, y);
    // also shade colour seams: a darker pixel below a lighter one reads as a fold
    if (up && !dn) tone(d, p, hi); else if (dn && !up) tone(d, p, lo); else if (y > 1 && opaque(img, x, y - 2) && !opaque(img, x, y - 1)) tone(d, p, hi * 0.5); }
  return o; }
function outline(img, col, mode) { const o = new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), d = o.data, [r, g, b] = hex(col);
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) { if (opaque(img, x, y)) continue; let n = null;
    for (const [dx, dy] of mode === 8 ? [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]] : [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (opaque(img, x + dx, y + dy)) { n = at(img, x + dx, y + dy); break; }
    if (n != null) { const p = at(img, x, y); if (col === 'auto') { d[p] = img.data[n] * 0.25; d[p + 1] = img.data[n + 1] * 0.22; d[p + 2] = img.data[n + 2] * 0.28 + 8; } else { d[p] = r; d[p + 1] = g; d[p + 2] = b; } d[p + 3] = 255; } }
  return o; }
function scale2x(img) { const w = img.width, h = img.height, o = new ImageData(w * 2, h * 2), s = new Uint32Array(img.data.buffer.slice(0)), d = new Uint32Array(o.data.buffer);
  const P = (x, y) => s[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const E = P(x, y), B = P(x, y - 1), D = P(x - 1, y), F = P(x + 1, y), Hh = P(x, y + 1);
    let e0 = E, e1 = E, e2 = E, e3 = E; if (B !== Hh && D !== F) { e0 = D === B ? D : E; e1 = B === F ? F : E; e2 = D === Hh ? D : E; e3 = Hh === F ? F : E; }
    const q = y * 2 * w * 2 + x * 2; d[q] = e0; d[q + 1] = e1; d[q + w * 2] = e2; d[q + w * 2 + 1] = e3; }
  return o; }
// HD: soft volume from a blurred alpha map, light from the top left, rim light in the style colour
function volume(img, rim) { const w = img.width, h = img.height, a = new Float32Array(w * h), b = new Float32Array(w * h), d = new Uint8ClampedArray(img.data), [rr, rg, rb] = hex(rim);
  for (let i = 0; i < w * h; i++) a[i] = img.data[i * 4 + 3] > 0 ? 1 : 0;
  const blur = (src, dst, r) => { for (let y = 0; y < h; y++) { let acc = 0; for (let x = -r; x < w + r; x++) { if (x + r < w && x + r >= 0) acc += src[y * w + x + r]; if (x - r - 1 >= 0 && x - r - 1 < w) acc -= src[y * w + x - r - 1]; if (x >= 0 && x < w) dst[y * w + x] = acc / (2 * r + 1); } }
    for (let x = 0; x < w; x++) { let acc = 0; const col = new Float32Array(h); for (let y = 0; y < h; y++) col[y] = dst[y * w + x]; for (let y = -r; y < h + r; y++) { if (y + r < h && y + r >= 0) acc += col[y + r]; if (y - r - 1 >= 0 && y - r - 1 < h) acc -= col[y - r - 1]; if (y >= 0 && y < h) dst[y * w + x] = acc / (2 * r + 1); } } };
  blur(a, b, 5);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; if (!a[i]) continue; const nx = b[i + 1] - b[i - 1], ny = b[i + w] - b[i - w], len = Math.hypot(nx, ny) + 1e-4, lit = (nx * 0.7 + ny * 0.7) / len, edge = 1 - Math.min(1, b[i] * 1.25), p = i * 4;
    const k = lit * edge * 0.55 + (0.5 - y / h) * 0.12; tone(d, p, Math.max(-0.45, Math.min(0.35, k)));
    if (edge > 0.25 && lit < -0.35) { const m = Math.min(0.75, (edge - 0.25) * 1.6); d[p] += (rr - d[p]) * m; d[p + 1] += (rg - d[p + 1]) * m; d[p + 2] += (rb - d[p + 2]) * m; } }
  return new ImageData(d, w, h); }
// 8-bit: few colours, chunky pixels
function quantize(img, n) { const cols = new Map(), d = img.data; for (let i = 0; i < d.length; i += 4) if (d[i + 3]) { const k = (d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | d[i + 2] >> 4; cols.set(k, (cols.get(k) || 0) + 1); }
  let cents = [...cols.entries()].sort((a, b) => b[1] - a[1]).slice(0, 24).map(([k]) => [(k >> 8) * 17, (k >> 4 & 15) * 17, (k & 15) * 17]);
  // greedy merge down to n representative colours
  while (cents.length > n) { let bi = 0, bj = 1, bd = 1e9; for (let i = 0; i < cents.length; i++) for (let j = i + 1; j < cents.length; j++) { const e = (cents[i][0] - cents[j][0]) ** 2 + (cents[i][1] - cents[j][1]) ** 2 + (cents[i][2] - cents[j][2]) ** 2; if (e < bd) { bd = e; bi = i; bj = j; } } cents[bi] = cents[bi].map((v, k) => (v + cents[bj][k]) / 2); cents.splice(bj, 1); }
  const o = new ImageData(new Uint8ClampedArray(d), img.width, img.height), od = o.data;
  for (let i = 0; i < od.length; i += 4) if (od[i + 3]) { let best = cents[0], bd = 1e9; for (const c of cents) { const e = (c[0] - od[i]) ** 2 + (c[1] - od[i + 1]) ** 2 + (c[2] - od[i + 2]) ** 2; if (e < bd) { bd = e; best = c; } } od[i] = best[0]; od[i + 1] = best[1]; od[i + 2] = best[2]; }
  return o; }
// vase painting: black-figure (heroes) or red-figure on black glaze (foes); seams become incised lines
function vase(img, figure, line, female, skin) { const o = new ImageData(img.width, img.height), d = o.data, s = img.data, [fr, fg, fb] = hex(figure), [lr, lg, lb] = hex(line), sk = skin ? hex(skin) : null;
  const key = (p) => (s[p] << 16) | (s[p + 1] << 8) | s[p + 2];
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) { if (!opaque(img, x, y)) continue; const p = at(img, x, y); let c = [fr, fg, fb];
    if (female && sk && Math.abs(s[p] - sk[0]) + Math.abs(s[p + 1] - sk[1]) + Math.abs(s[p + 2] - sk[2]) < 40) c = [244, 236, 220]; // women painted white, as on black-figure vases
    const r = opaque(img, x + 1, y) ? at(img, x + 1, y) : -1, b = opaque(img, x, y + 1) ? at(img, x, y + 1) : -1;
    if ((r >= 0 && key(r) !== key(p)) || (b >= 0 && key(b) !== key(p))) { const lum = (s[p] * 3 + s[p + 1] * 4 + s[p + 2]) / 8; if (lum > 40 || true) c = [lr, lg, lb]; }
    d[p] = c[0]; d[p + 1] = c[1]; d[p + 2] = c[2]; d[p + 3] = 255; }
  return o; }
const toCanvas = (img) => { const c = mkC(img.width, img.height); c.getContext('2d').putImageData(img, 0, 0); return c; };
// breathing frame: the top 60% of the figure drops one logical pixel
function breathe(img) { const o = new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), d = o.data, s = img.data; let top = img.height, bot = 0;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (s[at(img, x, y) + 3]) { top = Math.min(top, y); bot = Math.max(bot, y); }
  const cut = Math.round(top + (bot - top) * 0.6); for (let y = cut; y > top - 1; y--) for (let x = 0; x < img.width; x++) { const p = at(img, x, y), q = at(img, x, y - 1); for (let k = 0; k < 4; k++) d[p + k] = q >= 0 && y - 1 >= top ? s[q + k] : 0; }
  return o; }

