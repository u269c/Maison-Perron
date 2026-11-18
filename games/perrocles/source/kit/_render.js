// ── frame renderer: vector scene → 32-bit pixel grid (240×160, shown at 2×), per world ──
const LWp = AW / APX, LHp = AH / APX, ZOOM = 1.2;
const framesOf = (e) => e.frames || 16;
// majority-colour downsample: crisp pixel edges, no blending
function downFast(img, f) { const W = img.width, w = W / f | 0, h = img.height / f | 0, o = new ImageData(w, h), s = img.data, d = o.data, need = f * f * 0.45, ks = new Int32Array(f * f), cs = new Uint8Array(f * f);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let n = 0, op = 0; const p0 = (y * f * W + x * f) * 4; if (s[p0 + 3] < 128 && s[p0 + ((f - 1) * W + f - 1) * 4 + 3] < 128 && s[p0 + (((f >> 1) * W) + (f >> 1)) * 4 + 3] < 128) continue;
    for (let j = 0; j < f; j++) for (let i = 0; i < f; i++) { const p = p0 + (j * W + i) * 4; if (s[p + 3] < 128) continue; op++; const k = (s[p] << 16) | (s[p + 1] << 8) | s[p + 2]; let q = 0; for (; q < n; q++) if (ks[q] === k) { cs[q]++; break; } if (q === n) { ks[n] = k; cs[n] = 1; n++; } }
    if (op < need) continue; let b = 0; for (let q = 1; q < n; q++) if (cs[q] > cs[b]) b = q; const k = ks[b], t = (y * w + x) * 4; d[t] = k >> 16; d[t + 1] = k >> 8 & 255; d[t + 2] = k & 255; d[t + 3] = 255; }
  return o; }
// cel shading: every flat colour area gets a lit band toward the top left and a cooler shadow band toward the bottom right
function celShade(img) { const w = img.width, h = img.height, s = img.data, d = new Uint8ClampedArray(s), groups = new Map();
  for (let i = 0; i < w * h; i++) { if (s[i * 4 + 3] < 128) continue; const k = (s[i * 4] << 16) | (s[i * 4 + 1] << 8) | s[i * 4 + 2]; let g = groups.get(k); if (!g) { g = { idx: [], x0: w, y0: h, x1: 0, y1: 0 }; groups.set(k, g); } g.idx.push(i); const x = i % w, y = (i / w) | 0; if (x < g.x0) g.x0 = x; if (x > g.x1) g.x1 = x; if (y < g.y0) g.y0 = y; if (y > g.y1) g.y1 = y; }
  for (const [k, g] of groups) { if (g.idx.length < 14) continue; const r = g.idx.length > 220 ? 3 : 2, pad = r + 1, bx = g.x0 - pad, by = g.y0 - pad, bw = g.x1 - g.x0 + 1 + pad * 2, bh = g.y1 - g.y0 + 1 + pad * 2, m = new Float32Array(bw * bh), t1 = new Float32Array(bw * bh), b = new Float32Array(bw * bh);
    for (const i of g.idx) m[((i / w | 0) - by) * bw + (i % w) - bx] = 1; const n = 2 * r + 1;
    for (let y = 0; y < bh; y++) { let acc = 0; for (let x = 0; x < bw + r; x++) { if (x < bw) acc += m[y * bw + x]; if (x - n >= 0) acc -= m[y * bw + x - n]; if (x - r >= 0 && x - r < bw) t1[y * bw + x - r] = acc / n; } }
    for (let x = 0; x < bw; x++) { let acc = 0; for (let y = 0; y < bh + r; y++) { if (y < bh) acc += t1[y * bw + x]; if (y - n >= 0) acc -= t1[(y - n) * bw + x]; if (y - r >= 0 && y - r < bh) b[(y - r) * bw + x] = acc / n; } }
    const cr = k >> 16, cg = k >> 8 & 255, cb = k & 255, lum = (cr * 3 + cg * 4 + cb) / 8, dark = lum < 46;
    for (const i of g.idx) { const lx = (i % w) - bx, ly = (i / w | 0) - by, q = ly * bw + lx; if (b[q] < 0.5) continue; const lit = (b[q + 1] - b[q - 1]) * 0.62 + (b[q + bw] - b[q - bw]) * 0.78, p = i * 4;
      if (lit > 0.1) { const a = dark ? 0.12 : 0.24; d[p] = cr + (255 - cr) * a; d[p + 1] = cg + (244 - cg) * a; d[p + 2] = cb + (214 - cb) * a * 0.8; }
      else if (lit < -0.1) { const a = 0.3; d[p] = cr * 0.74 + (38 - cr * 0.74) * a * 0.5; d[p + 1] = cg * 0.7 + (30 - cg * 0.7) * a * 0.5; d[p + 2] = cb * 0.78 + (72 - cb * 0.78) * a * 0.5; } } }
  return new ImageData(d, w, h); }
// one-pixel outline in a darker shade of the colour it touches: never black
function softOutline(img) { const w = img.width, h = img.height, s = img.data, d = new Uint8ClampedArray(s);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const p = (y * w + x) * 4; if (s[p + 3]) continue; let q = -1; if (x + 1 < w && s[p + 7]) q = p + 4; else if (x > 0 && s[p - 1]) q = p - 4; else if (y + 1 < h && s[p + w * 4 + 3]) q = p + w * 4; else if (y > 0 && s[p - w * 4 + 3]) q = p - w * 4; if (q < 0) continue;
    d[p] = s[q] * 0.5 + 12; d[p + 1] = s[q + 1] * 0.44 + 8; d[p + 2] = s[q + 2] * 0.5 + 18; d[p + 3] = 255; }
  return new ImageData(d, w, h); }
// effects: soft-edged, with one translucent level, like 32-bit sprite effects
function downFx(c) { const t = mkC(LWp, LHp), x = t.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(c, 0, 0, LWp, LHp); const im = x.getImageData(0, 0, LWp, LHp), d = im.data; for (let i = 3; i < d.length; i += 4) d[i] = d[i] < 56 ? 0 : d[i] < 170 ? 140 : 255; x.putImageData(im, 0, 0); return t; }
const BGP = {};
function panelBg(world) { if (BGP[world]) return BGP[world]; const c = mkC(AW, AH), x = c.getContext('2d');
  if (world === 'm') { const bands = ['#44548f', '#55599a', '#6b5f9f', '#84669f', '#a06e98', '#bd7a8c', '#d68a80', '#e69c7a', '#f0b282', '#f6c890']; for (let i = 0; i < bands.length; i++) { x.fillStyle = bands[i]; x.fillRect(0, i * 34, AW, 36); }
    x.fillStyle = '#ffe9bc'; x.beginPath(); x.arc(560, 150, 30, 0, 7); x.fill(); x.fillStyle = '#fff4d8'; x.beginPath(); x.arc(560, 150, 22, 0, 7); x.fill();
    const ridge = (y0, amp, wl, ph, col, col2) => { x.fillStyle = col; x.beginPath(); x.moveTo(0, AGY); for (let q = 0; q <= AW; q += 6) x.lineTo(q, y0 - Math.abs(Math.sin(q / wl + ph)) * amp - Math.sin(q / 23) * 3); x.lineTo(AW, AGY); x.fill(); if (col2) { x.fillStyle = col2; x.beginPath(); x.moveTo(0, AGY); for (let q = 0; q <= AW; q += 6) x.lineTo(q, y0 + 14 - Math.abs(Math.sin(q / wl + ph)) * amp * 0.8 - Math.sin(q / 23) * 3 + Math.abs(Math.sin(q / 31)) * 10); x.lineTo(AW, AGY); x.fill(); } };
    ridge(300, 96, 92, 0.2, '#8a76a6', '#786a9c'); ridge(350, 44, 61, 1.3, '#5f7f62', '#4f6e54'); ridge(385, 16, 37, 2.1, '#476448');
    x.fillStyle = '#d2b684'; x.fillRect(0, AGY, AW, AH - AGY); x.fillStyle = '#c4a674'; x.fillRect(0, AGY, AW, 6); x.fillStyle = '#b89862'; for (let q = 0; q < AW; q += 46) x.fillRect(q + (q * 7 % 13), AGY + 18 + (q % 3) * 12, 24, 5);
    x.fillStyle = '#6e8a5a'; for (let q = 8; q < AW; q += 31) { x.fillRect(q, AGY - 5, 3, 6); x.fillRect(q + 4, AGY - 8, 3, 9); x.fillRect(q + 8, AGY - 4, 3, 5); } }
  else { x.fillStyle = '#c2603a'; x.fillRect(0, 0, AW, AH); x.fillStyle = '#cc6a42'; x.beginPath(); x.ellipse(AW / 2, AH / 2, 400, 250, 0, 0, 7); x.fill(); x.fillStyle = '#1b1210';
    for (const yy of [12, AH - 45]) { x.fillRect(0, yy, AW, 3); x.fillRect(0, yy + 30, AW, 3); for (let q = 0; q < AW; q += 30) { x.fillRect(q, yy + 6, 18, 3); x.fillRect(q + 15, yy + 6, 3, 18); x.fillRect(q, yy + 21, 12, 3); x.fillRect(q, yy + 12, 3, 12); x.fillRect(q + 6, yy + 12, 6, 3); } }
    x.fillRect(0, AGY, AW, 6); }
  return (BGP[world] = toCanvas(downFast(getPx(c), APX))); }
const FRAMES = new Map();
function renderFrame(e, world, f) { const N = framesOf(e), fig = mkC(AW, AH), fx = mkC(AW, AH), fc = fig.getContext('2d'), xc = fx.getContext('2d');
  for (const c of [fc, xc]) c.setTransform(ZOOM, 0, 0, ZOOM, -AW * (ZOOM - 1) / 2 - 48, AGY - ZOOM * AGY);
  const S = makeScene(fc, xc, world, f / N); try { e.anim(S, f / N); } catch (err) { console.error(e.id, world, err); }
  let L = downFast(getPx(fig), APX); if (world === 'm') L = softOutline(celShade(L));
  const out = mkC(LWp, LHp), ox = out.getContext('2d'); ox.drawImage(panelBg(world), 0, 0); ox.drawImage(toCanvas(L), 0, 0); ox.drawImage(downFx(fx), 0, 0); return out; }
function framesFor(e, world, onePer) { const k = e.id + world; let st = FRAMES.get(k); if (!st) { st = { list: [] }; FRAMES.set(k, st); } const N = framesOf(e);
  while (st.list.length < N) { st.list.push(renderFrame(e, world, st.list.length)); if (onePer) break; }
  return st.list; }
