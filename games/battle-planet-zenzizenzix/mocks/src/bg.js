// =====================================================================
// HAVRE — the four screens of level 1: backgrounds, live elements, events
// Static layers are drawn once per screen into wide canvases (parallax);
// live elements (water, smoke, ships, birds, fire, beams) are drawn every frame.
// =====================================================================
const mkC = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d')]; };
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
function hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; }
function mix(a, b, t) { const A = hex(a), B = hex(b); return `rgb(${A[0] + (B[0] - A[0]) * t | 0},${A[1] + (B[1] - A[1]) * t | 0},${A[2] + (B[2] - A[2]) * t | 0})`; }
// vertical gradient in hard bands with an ordered dither between them (retro sky)
function dithV(c, x, y, w, h, cols) {
  const n = cols.length - 1;
  for (let yy = 0; yy < h; yy++) { const t = yy / h * n, i = Math.min(n - 1, Math.floor(t)), f = t - i;
    for (let xx = 0; xx < w; xx += 1) { const use = (f * 16 > BAYER[yy & 3][xx & 3]) ? cols[i + 1] : cols[i]; if (xx === 0 || use !== c._last) { c.fillStyle = use; c._last = use; } c.fillRect(x + xx, y + yy, 1, 1); } }
}
function dithVfast(c, x, y, w, h, cols) { // banded rows, dither only at band edges (cheaper for wide layers)
  const n = cols.length - 1;
  for (let yy = 0; yy < h; yy++) { const t = yy / h * n, i = Math.min(n - 1, Math.floor(t)), f = t - i;
    c.fillStyle = cols[i]; c.fillRect(x, y + yy, w, 1);
    if (f > .25) { c.fillStyle = cols[i + 1]; const step = f > .75 ? 2 : 4; for (let xx = (yy % 2) * (step / 2); xx < w; xx += step) c.fillRect(x + xx, y + yy, 1, 1); } }
}
let RS = 1; const rr = () => (RS = (RS * 16807) % 2147483647) / 2147483647; const seedR = s => { RS = s; };
const P = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };

// ---- shared painters -------------------------------------------------
function paintGiant(c, x, y, r, phase = 0) {
  c.save(); c.beginPath(); c.arc(x, y, r, 0, 7); c.clip();
  dithV(c, x - r, y - r, r * 2, r * 2, ['#f6e2b0', '#ecc888', '#d8a460', '#b8783a', '#8a4e26', '#5a3018']);
  const bands = [['#a8642a', .08, 5], ['#e8c48a', .16, 3], ['#c8933a', .24, 6], ['#7a4422', .34, 4], ['#f0d098', .43, 7], ['#8a4a22', .53, 5], ['#e0b066', .62, 4], ['#6a3a1e', .71, 6], ['#b07a3a', .8, 5], ['#5a3018', .9, 4]];
  for (const [col, f, h] of bands) { const yy = y - r + f * r * 2; c.fillStyle = col; c.globalAlpha = .55; for (let xx = -r; xx < r; xx++) { const wob = Math.sin((xx + phase) * .05 + f * 20) * 1.5; c.fillRect(x + xx, yy + wob, 1, h); } }
  c.globalAlpha = 1;
  c.fillStyle = 'rgba(30,20,40,.0)';
  // terminator shadow, dithered
  for (let yy = -r; yy < r; yy++) for (let xx = -r; xx < r; xx++) { const d = (xx * .8 + yy * .5) / r; if (d > .35) { const lvl = Math.min(15, (d - .35) * 30); if (lvl > BAYER[(yy + 999) & 3][(xx + 999) & 3]) { c.fillStyle = 'rgba(14,20,44,.82)'; c.fillRect(x + xx, y + yy, 1, 1); } } }
  c.restore();
  c.fillStyle = 'rgba(255,230,180,.25)'; c.beginPath(); c.arc(x, y, r + 1, 3.3, 4.6); c.lineWidth = 2; c.strokeStyle = 'rgba(255,236,190,.55)'; c.stroke();
}
function paintStars(c, w, h, n, seed) { seedR(seed); for (let i = 0; i < n; i++) { const b = rr(); c.fillStyle = b > .9 ? '#fff8e8' : b > .6 ? 'rgba(255,248,232,.75)' : 'rgba(255,248,232,.4)'; c.fillRect(rr() * w | 0, rr() * h | 0, 1, 1); if (b > .97) { c.fillStyle = 'rgba(255,248,232,.35)'; const x = rr() * w | 0, y = rr() * h | 0; c.fillRect(x - 1, y, 3, 1); c.fillRect(x, y - 1, 1, 3); } } }
function house(c, x, base, w, h, o) { // o: wall, roof, trim, windows lit probability
  const y = base - h; P(c, x, y, w, h, o.wall); P(c, x, y, 1, h, o.shade || 'rgba(0,0,0,.18)'); P(c, x + w - 2, y, 2, h, 'rgba(0,0,0,.22)');
  // roof
  if (o.flat) { P(c, x - 1, y - 2, w + 2, 2, o.roof); }
  else { const rh = Math.max(4, w * .35 | 0); for (let k = 0; k < rh; k++) P(c, x - 2 + k, y - k - 1, w + 4 - k * 2, 1, k % 3 === 0 ? o.roofD || o.roof : o.roof); }
  if (o.chimney) { P(c, x + w * .7, y - (w * .35 | 0) - 4, 3, 6, o.roofD || '#3a2018'); }
  // windows
  const rows = Math.max(1, Math.floor((h - 6) / 8)), cols = Math.max(1, Math.floor((w - 4) / 6));
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) { const wx = x + 3 + k * ((w - 6) / cols), wy = y + 4 + r * 8; const lit = rr() < (o.lit || .35);
    P(c, wx, wy, 2, 3, lit ? (rr() < .5 ? '#ffd27a' : '#ffb85a') : (o.win || '#24323a')); if (o.shutter) { P(c, wx - 1, wy, 1, 3, o.shutter); P(c, wx + 2, wy, 1, 3, o.shutter); } }
  if (o.door) P(c, x + w / 2 - 1, base - 5, 3, 5, o.door);
}
// ---- bg particles (smoke, embers, sparks) in parallax space -----------
let BGP = [];
function smokePuff(x, y, f, opt = {}) { BGP.push({ k: 'smoke', x, y, f, r: opt.r || 3 + rr() * 3, life: opt.life || 4 + rr() * 3, t: 0, vx: (opt.vx ?? 4) + rr() * 3, vy: -(opt.vy ?? 8) - rr() * 6, col: opt.col || [70, 64, 60], a: opt.a || .55, grow: opt.grow || 4 }); }
function ember(x, y, f) { BGP.push({ k: 'ember', x, y, f, life: 1.5 + rr() * 2, t: 0, vx: (rr() - .5) * 10, vy: -20 - rr() * 30 }); }
function updBGP(dt) { for (const p of BGP) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.k === 'smoke') p.r += p.grow * dt; } BGP = BGP.filter(p => p.t < p.life); if (BGP.length > 900) BGP.splice(0, BGP.length - 900); }
function drawBGP(g, camX, fmin, fmax) { for (const p of BGP) { if (p.f < fmin || p.f >= fmax) continue; const x = p.x - camX * p.f, a = 1 - p.t / p.life;
    if (p.k === 'smoke') { g.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.a * a})`; const r = p.r | 0; g.fillRect(Math.round(x - r), Math.round(p.y - r * .8), r * 2, Math.round(r * 1.6)); g.fillRect(Math.round(x - r * .7), Math.round(p.y - r), Math.round(r * 1.4), r * 2); }
    else { g.fillStyle = `rgba(255,${150 + (p.t * 40 | 0) % 80},60,${a})`; g.fillRect(Math.round(x), Math.round(p.y), 1, 1); } } }
// puffy pixel clouds, lit from below by the dusk
function cloud(g, x, y, w, lit, dark) { x = Math.round(x); const n = Math.max(3, w / 14 | 0); for (let k = 0; k < n; k++) { const cx = x + k * w / n, r = 5 + ((k * 7) % 5) + (k === n >> 1 ? 4 : 0); g.fillStyle = dark; g.fillRect(Math.round(cx - r), y - r + 2, r * 2, r); g.fillStyle = lit; g.fillRect(Math.round(cx - r + 1), y + 1, r * 2 - 2, 2); } g.fillStyle = dark; g.fillRect(x - 4, y, w + 8, 3); g.fillStyle = lit; g.fillRect(x - 2, y + 2, w + 4, 1); }
// gulls: little V shapes flapping
function gull(g, x, y, t, col = '#f4efe6') { const f = Math.sin(t * 9) > 0; g.fillStyle = col; if (f) { g.fillRect(x - 3, y - 1, 2, 1); g.fillRect(x - 1, y, 3, 1); g.fillRect(x + 2, y - 1, 2, 1); } else { g.fillRect(x - 3, y + 1, 2, 1); g.fillRect(x - 1, y, 3, 1); g.fillRect(x + 2, y + 1, 2, 1); } }
// Villen-Hüüs's dropship (side view), dir 1 = facing right
function dropship(g, x, y, s, dir, t, lights = true) {
  g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(dir * s, s);
  g.fillStyle = '#1e1820'; g.beginPath(); g.moveTo(-40, 0); g.lineTo(30, -8); g.lineTo(44, 0); g.lineTo(30, 10); g.lineTo(-36, 12); g.closePath(); g.fill();
  g.fillStyle = '#2e2632'; g.fillRect(-30, -4, 50, 4); g.fillStyle = '#3a3040'; g.fillRect(-34, 10, 60, 3);
  g.fillStyle = '#141016'; g.fillRect(-20, 12, 6, 8); g.fillRect(10, 12, 6, 8); g.fillRect(-46, -6, 8, 10);
  if (lights) { g.fillStyle = Math.floor(t * 3) % 2 ? '#ff4a2a' : '#7a1a10'; g.fillRect(40, -1, 2, 2); g.fillRect(-46, -6, 2, 2); for (let k = 0; k < 5; k++) { g.fillStyle = '#ffb060'; g.fillRect(-24 + k * 10, 4, 2, 2); } }
  // thrusters
  const fl = 6 + Math.sin(t * 40) * 2; g.fillStyle = 'rgba(120,190,255,.85)'; g.fillRect(-19, 20, 4, fl); g.fillRect(11, 20, 4, fl); g.fillStyle = 'rgba(230,245,255,.9)'; g.fillRect(-18, 20, 2, fl * .6); g.fillRect(12, 20, 2, fl * .6);
  g.restore();
}

// =====================================================================
// SCREEN 1 — LE QUAI (the harbour docks), 3 screens wide
// event: dropships fly in and drop the first troops
// =====================================================================
const S1 = {
  id: 'quai', name: { fr: 'Le quai', en: 'The docks' }, W: 1920, floor: 'planks',
  boxes: [{ x: 420, z: 22, w: 28, d: 24, h: 24 }, { x: 448, z: 22, w: 28, d: 24, h: 24 }, { x: 434, z: 22, w: 28, d: 24, h: 48 }, { x: 900, z: 80, w: 30, d: 26, h: 26 }, { x: 1180, z: 4, w: 240, d: 40, h: 26, pier: 1 }, { x: 1620, z: 76, w: 28, d: 26, h: 24 }, { x: 1648, z: 76, w: 28, d: 26, h: 24 }],
  holes: [{ x0: 700, x1: 772 }],
  zones: [{ cam: 0, delay: 2.4, waves: [[['trooper', 'drop'], ['trooper', 'drop'], ['trooper', 'drop']], [['trooper', 'R'], ['trooper', 'R'], ['gunner', 'R']]] },
          { cam: 1280, waves: [[['trooper', 'R'], ['trooper', 'L'], ['gunner', 'R'], ['trooper', 'R']], [['brute', 'R'], ['trooper', 'R'], ['trooper', 'L']]] }],
  build() {
    const L = {};
    // sky: dusk, the giant, stars
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 230); dithVfast(g, 0, 0, w, 230, ['#0e1834', '#18284a', '#24405e', '#3a5a70', '#6a7a80', '#a88a7a', '#d89a70', '#f0b47a', '#f8cc90']); paintStars(g, w, 120, 160, 11);
      paintGiant(g, 420, 118, 112, 0); L.sky = { c, f: .04 }; }
    // far: sea horizon, headland with the lighthouse, islands
    { const w = VW + (this.W - VW) * .15; const [c, g] = mkC(w, 230); seedR(5);
      for (let i = 0; i < 6; i++) { const x = rr() * w, ww = 30 + rr() * 80; g.fillStyle = '#4a6068'; g.beginPath(); g.moveTo(x, 192); g.quadraticCurveTo(x + ww / 2, 178 - rr() * 10, x + ww, 192); g.fill(); }
      g.fillStyle = '#3a4c54'; g.beginPath(); g.moveTo(w - 260, 192); g.lineTo(w - 220, 170); g.lineTo(w - 150, 160); g.lineTo(w - 60, 172); g.lineTo(w, 180); g.lineTo(w, 192); g.fill();
      P(g, w - 152, 132, 8, 30, '#e8e0d0'); for (let k = 0; k < 4; k++) P(g, w - 152, 138 + k * 7, 8, 3, '#b83a2a'); P(g, w - 154, 128, 12, 4, '#2a2a2a'); P(g, w - 151, 124, 6, 4, '#ffe8a0');
      dithVfast(g, 0, 190, w, 40, ['#7a9098', '#5a7880', '#46646e', '#3a5660']); L.far = { c, f: .15, sx: w - 148, sy: 126 }; }
    // mid: the harbour town on its hill
    { const w = VW + (this.W - VW) * .4; const [c, g] = mkC(w, 230); seedR(17);
      g.fillStyle = '#2e4440'; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= w; x += 6) g.lineTo(x, 128 + Math.sin(x * .006) * 22 + Math.sin(x * .021) * 6 + (x > w * .6 ? (x - w * .6) * .12 : 0)); g.lineTo(w, 200); g.fill();
      for (let x = 0; x < w; x += 3) { const top = 128 + Math.sin(x * .006) * 22 + Math.sin(x * .021) * 6 + (x > w * .6 ? (x - w * .6) * .12 : 0); if (rr() < .5) P(g, x, top + rr() * 6, 2, 2, rr() < .5 ? '#3a5a44' : '#4a6a4a'); }
      const pal = [['#e8dcc4', '#a8442a'], ['#d8c8a0', '#8a3a24'], ['#c8b890', '#6a3a2a'], ['#e0d0b8', '#4a5a6a'], ['#b8c8c0', '#a8442a'], ['#e8c890', '#7a3020']];
      for (let row = 0; row < 4; row++) for (let i = 0; i < w / 22; i++) { const x = i * 22 + row * 9 + rr() * 6; const top = 128 + Math.sin(x * .006) * 22 + Math.sin(x * .021) * 6 + (x > w * .6 ? (x - w * .6) * .12 : 0); const base = top + 18 + row * 16; if (base > 202) continue; if (rr() < .25) continue;
        const [wall, roof] = pal[(rr() * pal.length) | 0]; house(g, x, base, 12 + rr() * 10, 10 + rr() * 10, { wall: mix(wall, '#2a3a44', .25 + row * .05), roof, roofD: mix(roof, '#000000', .3), lit: .3, chimney: rr() < .5, shutter: rr() < .4 ? '#3a6a6a' : null }); }
      // church on the hill
      const cx = w * .32, ct = 128 + Math.sin(cx * .006) * 22 + Math.sin(cx * .021) * 6 + 6; P(g, cx, ct - 30, 22, 30, '#d8ccb4'); P(g, cx + 7, ct - 62, 8, 32, '#d0c4ac'); for (let k = 0; k < 10; k++) P(g, cx + 11 - k * .4, ct - 72 + k, k * .8 + 1, 1, '#4a5a6a'); P(g, cx + 10, ct - 52, 2, 4, '#ffd27a'); P(g, cx + 4, ct - 22, 3, 6, '#ffd27a'); P(g, cx + 15, ct - 22, 3, 6, '#ffd27a');
      // quay wall and the water of the inner harbour
      P(g, 0, 196, w, 6, '#3a3430'); for (let x = 0; x < w; x += 9) P(g, x, 196, 1, 6, '#2a2420');
      dithVfast(g, 0, 202, w, 28, ['#3a5660', '#2e4a54', '#244048']);
      L.mid = { c, f: .4 }; this.chimneys = []; seedR(91); for (let i = 0; i < 26; i++) this.chimneys.push([rr() * w, 140 + rr() * 50]);
      this.windows = []; for (let i = 0; i < 90; i++) this.windows.push([rr() * w, 140 + rr() * 58, rr() * 9]); }
    this.L = L; this.boats = [0, 1, 2, 3, 4, 5].map(i => ({ x: 120 + i * 300 + (i % 2) * 60, s: .8 + (i % 3) * .15, ph: i * 1.7, col: ['#a83a2a', '#2a5a7a', '#e8dcc4', '#3a6a4a'][i % 4] }));
    this.gulls = Array.from({ length: 9 }, (_, i) => ({ x: i * 220, y: 70 + (i * 37) % 60, v: 14 + (i % 3) * 5, ph: i }));
    this.ships = [{ x: 900, y: -60, tx: 360, ty: 70, s: 1.1, dir: -1, state: 'in', t: 0 }, { x: 1100, y: -90, tx: 520, ty: 52, s: 1, dir: -1, state: 'in', t: .6 }];
    this.walker = { x: -60 };
  },
  dropPoints() { return this.ships.map(s => s.tx); },
  update(dt, t, camX) {
    for (const g of this.gulls) { g.x += g.v * dt; if (g.x > this.W * .6 + 400) g.x = -40; }
    this.walker.x += 6 * dt; if (this.walker.x > VW + (this.W - VW) * .15 + 60) this.walker.x = -60;
    for (const s of this.ships) { s.t += dt; if (s.state === 'in') { s.x += (s.tx - s.x) * Math.min(1, dt * 1.8); s.y += (s.ty - s.y) * Math.min(1, dt * 1.8); if (Math.abs(s.x - s.tx) < 4) s.state = 'hover'; }
      else if (s.state === 'hover') { s.y = s.ty + Math.sin(t * 2 + s.t) * 2; if (WORLD.zoneWave > 0 || WORLD.zoneIdx > 0) { s.state = 'out'; } } else if (s.state === 'out') { s.x -= 140 * dt; s.y -= 30 * dt; } }
    if (rr() < dt * 10) { const [x, y] = this.chimneys[(rr() * this.chimneys.length) | 0]; smokePuff(x, y, .4, { r: 1.5, vx: 3, vy: 4, life: 5, col: [200, 196, 190], a: .35, grow: 1.5 }); }
  },
  drawBack(g, camX, t) {
    const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0);
    // drifting clouds lit by the dusk
    for (let i = 0; i < 7; i++) { const x = ((i * 190 + t * (3 + i % 3) - camX * .06) % (VW + 300) + VW + 300) % (VW + 300) - 150, y = 40 + (i * 23) % 70; cloud(g, x, y, 50 + i * 10, 'rgba(250,200,160,.7)', 'rgba(90,90,120,.55)'); }
    // far ships of the Empire crossing high up
    for (let i = 0; i < 2; i++) { const x = ((t * 12 + i * 400) % (VW + 200)) - 100; g.fillStyle = '#1a1420'; g.fillRect(Math.round(x), 30 + i * 14, 10, 2); g.fillStyle = Math.floor(t * 2 + i) % 2 ? '#ff4a2a' : '#5a1a10'; g.fillRect(Math.round(x + 9), 30 + i * 14, 1, 1); }
    g.drawImage(L.far.c, Math.round(-camX * L.far.f), 0);
    // lighthouse beam sweeping
    { const bx = L.far.sx - camX * L.far.f, by = L.far.sy, a = t * .9; const len = 260, sp = .08; const dx = Math.cos(a), vis = Math.abs(dx);
      g.fillStyle = `rgba(255,240,190,${.08 + .12 * vis})`; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + dx * len, by - 10 - Math.sin(a) * 20 - len * sp); g.lineTo(bx + dx * len, by - 10 - Math.sin(a) * 20 + len * sp); g.fill(); g.fillStyle = '#fff6c0'; g.fillRect(Math.round(bx) - 1, by - 1, 3, 3); }
    // sea glitter and a tidewalker wading far out
    for (let i = 0; i < 60; i++) { const x = ((i * 53.3 + Math.sin(t * 1.3 + i) * 3) % VW + VW) % VW, y = 192 + (i % 9) * 4; if ((Math.floor(t * 4) + i) % 5 === 0) continue; g.fillStyle = i % 3 ? 'rgba(255,220,170,.55)' : 'rgba(255,250,230,.8)'; g.fillRect(Math.round(x), y, 2 + i % 4, 1); }
    { const wx = this.walker.x - camX * .15 * 0, wy = 186; const ph = t * 2; g.fillStyle = '#2a3a3e'; for (let k = 0; k < 4; k++) g.fillRect(Math.round(wx + k * 4 + Math.sin(ph + k) * 2), wy - 14, 1, 16); g.fillRect(Math.round(wx - 2), wy - 18, 18, 5); g.fillRect(Math.round(wx + 14), wy - 24, 2, 7); g.fillRect(Math.round(wx + 14), wy - 25, 6, 3); }
    g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    // windows flickering on and off in the town
    for (const [x, y, ph] of this.windows) { if (Math.sin(t * .3 + ph * 3) > .6) { g.fillStyle = '#ffdc8a'; g.fillRect(Math.round(x - camX * .4), Math.round(y), 2, 3); } }
    drawBGP(g, camX, .3, .5);
    // gulls over the harbour
    for (const gl of this.gulls) gull(g, Math.round(gl.x - camX * .5), Math.round(gl.y + Math.sin(t + gl.ph) * 6), t + gl.ph);
    // the moored boats, bobbing in the inner harbour
    for (const b of this.boats) { const x = Math.round(b.x - camX * .7), y = Math.round(206 + Math.sin(t * 1.4 + b.ph) * 1.5), s = b.s; if (x < -80 || x > VW + 80) continue;
      g.fillStyle = b.col; g.beginPath(); g.moveTo(x - 30 * s, y - 6 * s); g.lineTo(x + 32 * s, y - 6 * s); g.lineTo(x + 24 * s, y + 3 * s); g.lineTo(x - 24 * s, y + 3 * s); g.fill(); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x - 26 * s, y - 1, 52 * s, 3 * s);
      g.fillStyle = '#e8dcc4'; g.fillRect(x - 6 * s, y - 14 * s, 14 * s, 8 * s); g.fillStyle = '#ffd27a'; g.fillRect(x - 3 * s, y - 12 * s, 2, 2); g.fillStyle = '#2a2018'; g.fillRect(x + 12 * s, y - 40 * s, 1.5, 34 * s); g.fillRect(x + 2 * s, y - 34 * s, 22 * s, 1);
      g.strokeStyle = 'rgba(40,30,20,.6)'; g.beginPath(); g.moveTo(x + 12 * s, y - 40 * s); g.lineTo(x + 30 * s, y - 6 * s); g.moveTo(x + 12 * s, y - 40 * s); g.lineTo(x - 28 * s, y - 6 * s); g.stroke();
      g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(x - 24 * s, y + 4 * s, 48 * s, 1); }
    // the dropships
    for (const s of this.ships) { if (s.y < -40 || s.x < -400) continue; const x = s.x - camX, y = s.y; dropship(g, x, y, s.s, s.dir, t);
      if (s.state === 'hover') { g.fillStyle = 'rgba(255,240,200,.08)'; g.beginPath(); g.moveTo(x - 4, y + 10); g.lineTo(x - 50 + Math.sin(t) * 30, FLOOR + 90); g.lineTo(x + 50 + Math.sin(t) * 30, FLOOR + 90); g.fill(); } }
  },
  drawFront(g, camX, t) { // mooring posts and ropes in the foreground
    for (let i = 0; i < 12; i++) { const x = Math.round(i * 260 - camX * 1.25 + 80); if (x < -30 || x > VW + 30) continue; P(g, x, VH - 34, 14, 34, '#1a100a'); P(g, x - 2, VH - 38, 18, 5, '#2a1a10'); P(g, x + 2, VH - 30, 2, 26, 'rgba(255,210,150,.15)'); g.strokeStyle = '#140c06'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 14, VH - 30); g.quadraticCurveTo(x + 130, VH - 8, x + 260, VH - 30); g.stroke(); g.lineWidth = 1; }
  }
};

// =====================================================================
// SCREEN 2 — LE MARCHÉ AUX POISSONS (fish market street), 4 screens wide
// event: an enemy fighter is shot down by the town's flak and crashes into
// the hill; the wreck burns for the rest of the level
// =====================================================================
const S2 = {
  id: 'marche', name: { fr: 'Le marché aux poissons', en: 'The fish market' }, W: 2560, floor: 'cobble',
  boxes: [{ x: 380, z: 10, w: 34, d: 22, h: 20, stall: 1 }, { x: 760, z: 84, w: 28, d: 24, h: 24 }, { x: 1150, z: 14, w: 30, d: 24, h: 22 }, { x: 1180, z: 14, w: 30, d: 24, h: 22 }, { x: 1700, z: 70, w: 34, d: 22, h: 20, stall: 1 }, { x: 2100, z: 30, w: 28, d: 26, h: 24 }],
  holes: [],
  zones: [{ cam: 420, waves: [[['trooper', 'R'], ['trooper', 'R'], ['trooper', 'L']], [['gunner', 'R'], ['gunner', 'R'], ['trooper', 'L']]] },
          { cam: 1180, waves: [[['brute', 'R'], ['trooper', 'R'], ['trooper', 'L']], [['trooper', 'R'], ['gunner', 'R'], ['trooper', 'R']]] },
          { cam: 1920, waves: [[['trooper', 'R'], ['trooper', 'R'], ['gunner', 'R'], ['gunner', 'L']], [['brute', 'R'], ['brute', 'L']]] }],
  build() {
    const L = {};
    { const w = VW + (this.W - VW) * .05; const [c, g] = mkC(w, 200); dithVfast(g, 0, 0, w, 200, ['#121c3a', '#1e2c4e', '#34405e', '#5a5466', '#8a6a6a', '#c88a6a', '#e8a874']); paintStars(g, w, 90, 120, 23); paintGiant(g, 160, 70, 64, 40); L.sky = { c, f: .05 }; }
    // the hill behind the street, where the fighter will crash
    { const w = VW + (this.W - VW) * .25; const [c, g] = mkC(w, 200); seedR(33);
      g.fillStyle = '#2a3c3a'; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= w; x += 6) g.lineTo(x, 66 + Math.sin(x * .004) * 20 + Math.sin(x * .017) * 8); g.lineTo(w, 200); g.fill();
      for (let i = 0; i < 260; i++) { const x = rr() * w, top = 66 + Math.sin(x * .004) * 20 + Math.sin(x * .017) * 8; P(g, x, top + 2 + rr() * 60, 3, 3, rr() < .5 ? '#34503e' : '#3e5a44'); }
      for (let i = 0; i < 40; i++) { const x = rr() * w, top = 66 + Math.sin(x * .004) * 20 + Math.sin(x * .017) * 8 + 8 + rr() * 30; house(g, x, top + 12, 10 + rr() * 6, 8 + rr() * 6, { wall: '#9a9488', roof: '#6a3424', lit: .4 }); }
      L.hill = { c, f: .25 }; this.crashX = w * .5; this.crashY = 66 + Math.sin(this.crashX * .004) * 20 + Math.sin(this.crashX * .017) * 8 + 6; }
    // the street facades, right behind the floor
    { const w = VW + (this.W - VW) * .9; const [c, g] = mkC(w, 216); seedR(7);
      const signs = ['POISSONNERIE', 'CAFÉ DU PORT', 'BOULANGERIE', 'QUINCAILLERIE', 'LA CRIÉE', 'CHEZ MARCEL', 'BAR LE PHARE', 'ÉPICERIE', 'FILETS & CORDES'];
      let x = -10, i = 0; this.facades = [];
      while (x < w) { const fw = 70 + rr() * 50 | 0, fh = 84 + rr() * 40 | 0, top = 214 - fh; const wall = ['#d8c8a8', '#c8a888', '#a8b8b0', '#e0d0b0', '#b89878', '#d0b890'][i % 6], shut = ['#2a5a6a', '#6a3a2a', '#3a5a3a', '#2a3a6a'][i % 4];
        P(g, x, top, fw, fh, wall); for (let k = 0; k < fh; k += 5) P(g, x, top + k, fw, 1, 'rgba(0,0,0,.04)'); P(g, x, top, 2, fh, 'rgba(0,0,0,.2)');
        P(g, x - 2, top - 6, fw + 4, 6, '#5a2a1e'); P(g, x - 2, top - 7, fw + 4, 1, '#7a3a28'); if (rr() < .6) { P(g, x + fw * .2, top - 16, 6, 10, '#4a2a1e'); }
        const floors = Math.floor((fh - 50) / 30);
        for (let f = 0; f < floors; f++) for (let k = 0; k < 3; k++) { const wx = x + 10 + k * (fw - 20) / 3, wy = top + 12 + f * 30, lit = rr() < .4; P(g, wx, wy, 10, 14, lit ? '#ffcf7a' : '#2a3038'); P(g, wx, wy + 6, 10, 1, wall); P(g, wx + 4, wy, 1, 14, wall); P(g, wx - 4, wy, 4, 14, shut); P(g, wx + 10, wy, 4, 14, shut); P(g, wx - 1, wy + 14, 12, 2, '#3a2a20');
          if (rr() < .3) { P(g, wx - 2, wy + 16, 14, 4, '#5a3a20'); for (let q = 0; q < 4; q++) P(g, wx - 1 + q * 3, wy + 14, 2, 2, ['#e04a4a', '#f0c040', '#e8e8f0'][q % 3]); } this.facades.push([x + 10 + k * (fw - 20) / 3, wy, lit]); }
        // shop front
        const sy0 = 214 - 46; P(g, x + 4, sy0, fw - 8, 46, '#2a1e18'); P(g, x + 8, sy0 + 10, fw - 30, 28, rr() < .7 ? '#e8b060' : '#3a3a40'); P(g, x + fw - 18, sy0 + 12, 10, 34, '#4a2a1a');
        // striped awning
        const aw = ['#b83a2a', '#2a5a8a', '#3a7a4a', '#c8963a'][i % 4]; for (let k = 0; k < fw; k += 6) P(g, x + k, sy0 - 10, 3, 10, aw), P(g, x + k + 3, sy0 - 10, 3, 10, '#efe6d2'); for (let k = 0; k < fw; k += 6) P(g, x + k, sy0, 4, 2, aw);
        // the sign
        P(g, x + 6, sy0 - 22, fw - 12, 10, '#1e1810'); g.fillStyle = '#e8c77a'; g.font = '7px monospace'; g.textBaseline = 'top'; const sgn = signs[i % signs.length]; g.fillText(sgn.slice(0, Math.floor((fw - 14) / 4.3)), x + 9, sy0 - 21);
        // crates of fish outside
        if (rr() < .7) { P(g, x + 6, 214 - 10, 16, 10, '#8a5a2a'); for (let q = 0; q < 5; q++) P(g, x + 8 + q * 3, 214 - 12, 2, 3, '#a8b8c8'); }
        x += fw + 2; i++; }
      L.fac = { c, f: .9 }; }
    this.L = L; this.fighter = { state: 'wait', x: 0, y: 0, t: 0 }; this.crashed = false; this.lanterns = []; for (let i = 0; i < 26; i++) this.lanterns.push(60 + i * 100); this.fire = [900, 1500].map(x => ({ x }));
    this.folk = Array.from({ length: 6 }, (_, i) => ({ x: 300 + i * 360, v: -30 - i * 4, col: ['#8a3a2a', '#2a4a6a', '#6a6a3a'][i % 3] }));
  },
  onZone(zi) { if (zi === 1 && this.fighter.state === 'wait') { this.fighter = { state: 'fly', x: VW + 60, y: 40, t: 0, hit: false }; } },
  update(dt, t, camX) {
    const F = this.fighter;
    if (F.state === 'fly') { F.t += dt; F.x -= 170 * dt; F.y = 40 + Math.sin(F.t * 2) * 6; if (F.t > .9 && !F.hit) { F.hit = true; WORLD.flash = .15; beep(90, .3, 'sawtooth', .08, -40); } if (F.hit) { F.state = 'fall'; F.vx = -110; F.vy = 20; } }
    if (F.state === 'fall') { F.t += dt; F.x += F.vx * dt; F.vy += 60 * dt; F.y += F.vy * dt; if (rr() < .8) smokePuff(F.x + camX * .25, F.y, .25, { r: 2, vx: 0, vy: 2, life: 3, col: [40, 34, 30], a: .7, grow: 3 }); const cx = this.crashX - camX * .25; if (F.y >= this.crashY - 6 || F.x < cx) { F.state = 'done'; this.crashed = true; WORLD.flash = .5; WORLD.shake = 12; noise(1.2, .18); for (let i = 0; i < 30; i++) ember(this.crashX + (rr() - .5) * 30, this.crashY - 8, .25); } }
    if (this.crashed && rr() < dt * 22) smokePuff(this.crashX + (rr() - .5) * 12, this.crashY - 6, .25, { r: 3, vx: 5, vy: 10, life: 8, col: [36, 30, 28], a: .6, grow: 4 });
    if (this.crashed && rr() < dt * 8) ember(this.crashX + (rr() - .5) * 20, this.crashY - 6, .25);
    for (const f of this.fire) { if (rr() < dt * 12) smokePuff(f.x + (rr() - .5) * 20, 80, .9, { r: 4, vx: 6, vy: 14, life: 5, col: [50, 42, 38], a: .5, grow: 5 }); }
    for (const p of this.folk) { p.x += p.v * dt; if (p.x < -40) p.x = this.W; }
  },
  drawBack(g, camX, t) {
    const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0);
    if (this.crashed) { g.fillStyle = 'rgba(200,80,30,.12)'; g.fillRect(0, 0, VW, 200); }
    // flak tracers rising from the rooftops when the fighter comes
    if (this.fighter.state === 'fly' || this.fighter.state === 'fall' && this.fighter.t < 1.6) for (let i = 0; i < 6; i++) { const x = (i * 113 + t * 300) % VW, h = (t * 400 + i * 60) % 200; g.fillStyle = '#ffd060'; g.fillRect(Math.round(x), Math.round(200 - h), 1, 4); }
    g.drawImage(L.hill.c, Math.round(-camX * L.hill.f), 0);
    // the wreck on the hill (after the crash): burning
    if (this.crashed) { const x = Math.round(this.crashX - camX * .25), y = Math.round(this.crashY); g.fillStyle = '#1a1414'; g.beginPath(); g.moveTo(x - 18, y); g.lineTo(x - 4, y - 8); g.lineTo(x + 14, y - 4); g.lineTo(x + 20, y + 2); g.fill(); g.fillRect(x + 4, y - 14, 3, 10);
      for (let k = 0; k < 7; k++) { const fh = 4 + ((t * 20 + k * 7) % 8); g.fillStyle = k % 2 ? '#ff8a3a' : '#ffd060'; g.fillRect(x - 12 + k * 4, y - fh, 2, fh); }
      g.fillStyle = 'rgba(255,120,40,.18)'; g.fillRect(x - 40, y - 30, 80, 40); }
    drawBGP(g, camX, .2, .5);
    // the fighter
    const F = this.fighter; if (F.state === 'fly' || F.state === 'fall') { g.save(); g.translate(Math.round(F.x), Math.round(F.y)); g.rotate(F.state === 'fall' ? -.5 : 0); g.fillStyle = '#1e1820'; g.beginPath(); g.moveTo(-14, 0); g.lineTo(12, -3); g.lineTo(16, 0); g.lineTo(12, 3); g.closePath(); g.fill(); g.fillRect(-4, -7, 6, 14); g.fillStyle = '#ff5a2a'; g.fillRect(14, -1, 2, 2); if (F.state === 'fall') { g.fillStyle = '#ff9a3a'; g.fillRect(-18, -2, 6, 4); } g.restore(); }
    g.drawImage(L.fac.c, Math.round(-camX * L.fac.f), 0);
    // live windows: lights that flicker, a face that looks out, fires inside two buildings
    for (const [x, y, lit] of this.facades) { const sx = Math.round(x - camX * .9); if (sx < -20 || sx > VW + 20) continue; if (!lit && Math.sin(t * .5 + x) > .97) { g.fillStyle = '#ffcf7a'; g.fillRect(sx, y, 10, 14); g.fillStyle = '#c8906a'; g.fillRect(sx + 3, y + 5, 4, 5); } }
    for (const f of this.fire) { const sx = Math.round(f.x - camX * .9); if (sx < -60 || sx > VW + 60) continue; for (let k = 0; k < 12; k++) { const fh = 6 + ((t * 30 + k * 13) % 14); g.fillStyle = k % 3 ? '#ff7a2a' : '#ffd060'; g.fillRect(sx - 20 + k * 4, 100 - fh + (k % 2) * 4, 3, fh); } g.fillStyle = 'rgba(255,120,40,.2)'; g.fillRect(sx - 40, 60, 80, 60); }
    drawBGP(g, camX, .85, .95);
    // townsfolk running away in the street, far side
    for (const p of this.folk) { const sx = Math.round(p.x - camX * .95), ph = Math.sin(t * 14 + p.x); if (sx < -10 || sx > VW + 10) continue; g.fillStyle = p.col; g.fillRect(sx, 200, 5, 9); g.fillStyle = '#d8a07a'; g.fillRect(sx + 1, 196, 3, 4); g.fillStyle = '#2a2018'; g.fillRect(sx + (ph > 0 ? 0 : 3), 209, 2, 4); g.fillRect(sx + (ph > 0 ? 3 : 0), 209, 2, 3); }
    // lanterns swinging under the awnings
    for (const lx of this.lanterns) { const sx = Math.round(lx - camX * .9), a = Math.sin(t * 2 + lx) * 2; if (sx < -10 || sx > VW + 10) continue; g.fillStyle = '#2a1e14'; g.fillRect(sx, 150, 1, 6); g.fillStyle = '#ffd27a'; g.fillRect(sx - 2 + Math.round(a), 156, 5, 6); g.fillStyle = 'rgba(255,200,110,.18)'; g.fillRect(sx - 10 + Math.round(a), 150, 21, 20); }
  },
  drawFront(g, camX, t) { // hanging laundry and wires crossing the street in the foreground
    for (let i = 0; i < 8; i++) { const x = Math.round(i * 420 - camX * 1.3 + 100); if (x < -200 || x > VW + 200) continue; g.strokeStyle = '#140c08'; g.beginPath(); g.moveTo(x - 160, 26); g.quadraticCurveTo(x, 56, x + 160, 26); g.stroke(); for (let k = 0; k < 5; k++) { const px = x - 90 + k * 40, py = 40 + Math.round(Math.sin(t * 2 + k) * 1.5); g.fillStyle = ['#e8e0d0', '#b83a2a', '#2a5a8a', '#e8c77a', '#3a7a4a'][k]; g.fillRect(px, py, 7, 9); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(px + 5, py, 2, 9); } }
  }
};

// =====================================================================
// SCREEN 3 — LES ESTRANS (the tidal flats), 4 screens wide
// event: a tidewalker stampede crosses behind the fight
// =====================================================================
const S3 = {
  id: 'estrans', name: { fr: 'Les estrans', en: 'The tidal flats' }, W: 2560, floor: 'sand',
  boxes: [{ x: 560, z: 30, w: 40, d: 26, h: 18, rock: 1 }, { x: 1300, z: 80, w: 36, d: 24, h: 16, rock: 1 }, { x: 1980, z: 10, w: 44, d: 28, h: 20, rock: 1 }],
  holes: [{ x0: 880, x1: 950 }, { x0: 1620, x1: 1700 }],
  zones: [{ cam: 560, waves: [[['trooper', 'R'], ['trooper', 'R'], ['trooper', 'L'], ['trooper', 'L']]] },
          { cam: 1300, waves: [[['gunner', 'R'], ['gunner', 'R'], ['trooper', 'L'], ['trooper', 'R']], [['brute', 'R'], ['gunner', 'L']]] },
          { cam: 1920, waves: [[['trooper', 'R'], ['trooper', 'R'], ['trooper', 'L'], ['gunner', 'R'], ['gunner', 'L']]] }],
  build() {
    const L = {};
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 200); dithVfast(g, 0, 0, w, 200, ['#162a48', '#24425e', '#3e6070', '#7a8a84', '#c8a078', '#f0b878', '#ffd498']); paintStars(g, w, 70, 80, 31); paintGiant(g, 360, 150, 150, 80); L.sky = { c, f: .04 }; }
    { const w = VW + (this.W - VW) * .12; const [c, g] = mkC(w, 210); seedR(41);
      // the distant town far to the left, on its headland
      g.fillStyle = '#3e5254'; g.beginPath(); g.moveTo(0, 196); g.lineTo(0, 150); g.lineTo(80, 146); g.lineTo(160, 160); g.lineTo(240, 186); g.lineTo(300, 196); g.fill(); for (let i = 0; i < 20; i++) house(g, 10 + i * 11, 160 + (i > 12 ? (i - 12) * 3 : 0), 8, 6, { wall: '#8a9088', roof: '#6a3424', lit: .5 });
      dithVfast(g, 0, 192, w, 18, ['#c8a07a', '#a88a74', '#7a7a74']); L.far = { c, f: .12 }; this.smokeX = 180; }
    this.L = L; this.herd = Array.from({ length: 7 }, (_, i) => ({ x: 200 + i * 340, s: .8 + (i % 3) * .2, ph: i * 1.3, v: 8 + (i % 3) * 3 }));
    this.stampede = null; this.flock = Array.from({ length: 22 }, (_, i) => ({ dx: (i % 6) * 10 + (i % 2) * 5, dy: Math.floor(i / 6) * 7 })); this.flockX = -100; this.walker = { x: 900 };
  },
  onWave(zi, wi) { if (zi === 1 && wi === 0 && !this.stampede) { this.stampede = { x: -200, t: 0 }; WORLD.shake = 6; } },
  update(dt, t, camX) {
    for (const h of this.herd) { h.x += h.v * dt * (this.stampede && this.stampede.t < 6 ? 6 : 1); if (h.x > this.W * .55 + 300) h.x = -100; }
    if (this.stampede) { this.stampede.t += dt; if (this.stampede.t < 6) { WORLD.shake = Math.max(WORLD.shake, 1.5); if (rr() < dt * 30) smokePuff(camX * .55 + rr() * VW, 196, .55, { r: 3, vx: 30, vy: 4, life: 2, col: [220, 200, 170], a: .4, grow: 6 }); } }
    this.flockX += 22 * dt; if (this.flockX > VW + 200) this.flockX = -150;
    this.walker.x += 3 * dt;
    if (rr() < dt * 10) smokePuff(this.smokeX + (rr() - .5) * 6, 150, .12, { r: 2, vx: 3, vy: 6, life: 9, col: [40, 34, 32], a: .55, grow: 2.5 });
  },
  drawBack(g, camX, t) {
    const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0);
    for (let i = 0; i < 6; i++) { const x = ((i * 230 + t * 4 - camX * .05) % (VW + 300) + VW + 300) % (VW + 300) - 150, y = 30 + (i * 31) % 60; cloud(g, x, y, 60 + i * 8, 'rgba(255,210,170,.65)', 'rgba(80,100,130,.5)'); }
    // the siege walker of the Empire on the horizon, searchlight sweeping
    { const x = Math.round(this.walker.x - camX * .1), y = 190, ph = t * 1.2; if (x > -60 && x < VW + 60) { g.fillStyle = '#26262e'; for (let k = 0; k < 4; k++) { const lx = x - 12 + k * 8 + Math.sin(ph + k * 1.6) * 3; g.fillRect(Math.round(lx), y - 20, 2, 20); } g.fillRect(x - 16, y - 30, 32, 10); g.fillRect(x + 14, y - 28, 8, 6); g.fillStyle = '#ff4a2a'; g.fillRect(x + 20, y - 26, 2, 2); g.fillStyle = 'rgba(255,240,200,.07)'; g.beginPath(); g.moveTo(x + 20, y - 25); g.lineTo(x + 140 * Math.cos(t * .6), y + 30); g.lineTo(x + 140 * Math.cos(t * .6) + 40, y + 30); g.fill(); } }
    g.drawImage(L.far.c, Math.round(-camX * L.far.f), 0);
    drawBGP(g, camX, .1, .2);
    // a flock of birds wheeling over the flats
    for (const b of this.flock) gull(g, Math.round(this.flockX + b.dx + Math.sin(t + b.dy) * 4), Math.round(60 + b.dy + Math.sin(t * .7 + b.dx * .1) * 8), t + b.dx, '#2a2a30');
    // tidewalkers wading (or stampeding) across the shallows
    for (const h of this.herd) { const x = Math.round(h.x - camX * .55), s = h.s, run = this.stampede && this.stampede.t < 6, ph = t * (run ? 9 : 2) + h.ph; if (x < -60 || x > VW + 60) continue; const y = 198;
      g.fillStyle = '#4a4430'; for (let k = 0; k < 4; k++) { const lx = x - 10 * s + k * 7 * s + Math.sin(ph + k * 1.5) * 4 * s; g.fillRect(Math.round(lx), Math.round(y - 30 * s), 1.5, 30 * s); }
      g.fillStyle = '#8a7a4a'; g.fillRect(Math.round(x - 14 * s), Math.round(y - 36 * s), 30 * s, 8 * s); g.fillStyle = '#a89a5a'; g.fillRect(Math.round(x - 12 * s), Math.round(y - 38 * s), 26 * s, 3 * s);
      g.fillRect(Math.round(x + 14 * s), Math.round(y - 46 * s), 3 * s, 10 * s); g.fillRect(Math.round(x + 14 * s), Math.round(y - 48 * s), 8 * s, 4 * s);
      g.fillStyle = 'rgba(255,230,190,.35)'; g.fillRect(Math.round(x - 12 * s), y + 1, 26 * s, 1); if (run) { g.fillStyle = 'rgba(240,248,255,.6)'; for (let k = 0; k < 3; k++) g.fillRect(Math.round(x - 10 + k * 8), y - 2 - (k * 3 + Math.floor(t * 20)) % 6, 2, 2); } }
    drawBGP(g, camX, .5, .6);
  },
  drawFront(g, camX, t) { for (let i = 0; i < 10; i++) { const x = Math.round(i * 300 - camX * 1.3 + 40); if (x < -40 || x > VW + 40) continue; g.fillStyle = '#1a1a14'; for (let k = 0; k < 7; k++) g.fillRect(x + k * 4, VH - 18 - (k * 7) % 14, 2, 18 + (k * 7) % 14); } }
};

// =====================================================================
// SCREEN 4 — LA PLACE DU PHARE (the lighthouse square), 3 screens wide
// event: Villen-Hüüs's flagship over the square; he comes down in a tractor
// beam, fights, and flees the same way; the flagship leaves at dawn
// =====================================================================
const S4 = {
  id: 'phare', name: { fr: 'La place du phare', en: 'The lighthouse square' }, W: 1920, floor: 'cobble',
  boxes: [{ x: 360, z: 14, w: 30, d: 24, h: 22 }, { x: 860, z: 40, w: 50, d: 36, h: 14, fountain: 1 }, { x: 1500, z: 84, w: 30, d: 24, h: 22 }],
  holes: [],
  zones: [{ cam: 380, waves: [[['trooper', 'R'], ['trooper', 'L'], ['gunner', 'R']], [['brute', 'R'], ['gunner', 'L'], ['trooper', 'R']]] },
          { cam: 1280, boss: true, waves: [[['trooper', 'R'], ['trooper', 'L']], [['boss', 'beam']]] }],
  build() {
    const L = {};
    { const w = VW + (this.W - VW) * .03; const [c, g] = mkC(w, 210); dithVfast(g, 0, 0, w, 210, ['#0a0e22', '#141c38', '#24284a', '#3a3456', '#5a4460', '#8a5a62', '#b87064']); paintStars(g, w, 120, 200, 51); L.sky = { c, f: .03 }; }
    { const w = VW + (this.W - VW) * .5; const [c, g] = mkC(w, 216); seedR(61);
      // houses around the square
      for (let i = 0; i < w / 34; i++) { const x = i * 34 + rr() * 8; house(g, x, 212, 24 + rr() * 12, 26 + rr() * 34, { wall: ['#c8b898', '#a8a090', '#b8a080', '#d0c0a0'][i % 4], roof: '#4a2a22', roofD: '#3a1e18', lit: .35, chimney: rr() < .5, shutter: ['#2a5a6a', '#6a3a2a'][i % 2], door: '#3a2414' }); }
      // the lighthouse
      const lx = w * .3; for (let y = 30; y < 212; y++) { const ww = 26 - (212 - y) * .06 | 0; P(g, lx - ww / 2, y, ww, 1, (Math.floor((y - 30) / 22) % 2) ? '#e8e0d0' : '#b83a2a'); P(g, lx + ww / 2 - 4, y, 4, 1, 'rgba(0,0,0,.2)'); }
      P(g, lx - 18, 22, 36, 8, '#2a2a2a'); P(g, lx - 12, 6, 24, 16, '#3a3a3a'); P(g, lx - 9, 8, 18, 12, '#fff2c0'); P(g, lx - 14, 2, 28, 4, '#1a1a1a'); P(g, lx - 2, -6, 4, 8, '#1a1a1a');
      for (let k = 0; k < 6; k++) P(g, lx - 3, 50 + k * 26, 6, 8, '#ffd27a');
      L.near = { c, f: .5, lx }; }
    this.L = L; this.flag = { x: 470, y: 66, s: 1, leave: 0 }; this.beam = 0; this.dawn = 0;
  },
  update(dt, t, camX) {
    const B = WORLD.boss; if (B && (B.state === 'arrive' || B.state === 'escape')) this.beam = Math.min(1, this.beam + dt * 3); else this.beam = Math.max(0, this.beam - dt * 2);
    if (WORLD.levelDone) { this.flag.leave += dt; this.dawn = Math.min(1, this.dawn + dt * .25); }
    if (rr() < dt * 6) smokePuff(this.flag.x - 120 + rr() * 240, this.flag.y + 30, .08, { r: 2, vx: -4, vy: -2, life: 3, col: [120, 160, 220], a: .35, grow: 2 });
  },
  drawBack(g, camX, t) {
    const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0);
    if (this.dawn > 0) { const gr = g.createLinearGradient(0, 0, 0, 210); gr.addColorStop(0, `rgba(120,150,190,${this.dawn * .6})`); gr.addColorStop(1, `rgba(255,200,140,${this.dawn * .8})`); g.fillStyle = gr; g.fillRect(0, 0, VW, 210); }
    // the flagship L'Insatiable, hanging over the square
    { const f = this.flag, s = 1 / (1 + f.leave * .6), x = Math.round(f.x - camX * .08 + f.leave * 40), y = Math.round(f.y - f.leave * 18);
      if (s > .08) { g.save(); g.translate(x, y); g.scale(s, s);
        g.fillStyle = '#120c10'; g.beginPath(); g.moveTo(-260, 0); g.lineTo(200, -26); g.lineTo(250, 0); g.lineTo(200, 22); g.lineTo(-240, 30); g.closePath(); g.fill();
        g.fillStyle = '#1e1418'; g.fillRect(-200, -14, 360, 10); g.fillRect(-160, 22, 320, 8); g.fillStyle = '#2a1e22'; g.fillRect(40, -40, 80, 16); g.fillRect(60, -52, 30, 14);
        for (let k = 0; k < 24; k++) { g.fillStyle = (Math.floor(t * 2) + k) % 6 === 0 ? '#ff6a3a' : '#7a1a14'; g.fillRect(-220 + k * 18, 4 + (k % 3) * 4, 3, 2); }
        for (let k = 0; k < 4; k++) { g.fillStyle = `rgba(120,180,255,${.6 + Math.sin(t * 20 + k) * .2})`; g.fillRect(-276, -12 + k * 10, 16, 6); }
        g.restore(); }
      if (this.beam > 0) { const B = WORLD.boss; const bx = (B ? B.x : 1600) - camX; g.fillStyle = `rgba(180,220,255,${.22 * this.beam})`; g.beginPath(); g.moveTo(x - 8, y + 26); g.lineTo(x + 8, y + 26); g.lineTo(bx + 30, FLOOR + 80); g.lineTo(bx - 30, FLOOR + 80); g.fill(); for (let k = 0; k < 10; k++) { const yy = ((t * 120 + k * 30) % 260); g.fillStyle = `rgba(230,245,255,${.5 * this.beam})`; g.fillRect(Math.round(x + (bx - x) * yy / 260 - 6 + (k % 3) * 5), Math.round(y + 26 + yy * (FLOOR + 50 - y) / 260), 2, 2); } } }
    drawBGP(g, camX, 0, .2);
    g.drawImage(L.near.c, Math.round(-camX * L.near.f), 0);
    // the lighthouse beam turning over the square
    { const lx = L.near.lx - camX * .5, ly = 14, a = t * .8, dx = Math.cos(a); g.fillStyle = `rgba(255,244,200,${.1 + .15 * Math.abs(dx)})`; g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx + dx * 520, ly - 40); g.lineTo(lx + dx * 520, ly + 60); g.fill(); g.fillStyle = 'rgba(255,250,220,.35)'; g.fillRect(Math.round(lx) - 10, ly - 6, 20, 12); }
  },
  drawFront(g, camX, t) { for (let i = 0; i < 9; i++) { const x = Math.round(i * 280 - camX * 1.25 + 60); if (x < -30 || x > VW + 30) continue; P(g, x, VH - 70, 4, 70, '#120c08'); P(g, x - 6, VH - 78, 16, 10, '#1a1410'); g.fillStyle = `rgba(255,210,120,${.7 + Math.sin(t * 6 + i) * .1})`; g.fillRect(x - 3, VH - 76, 10, 6); g.fillStyle = 'rgba(255,200,110,.1)'; g.fillRect(x - 30, VH - 100, 64, 60); } }
};
const SCREENS = [S1, S2, S3, S4];

// ---- floors, drawn per screen into a wide static canvas ---------------
function buildFloor(scr) {
  const [c, g] = mkC(scr.W, VH - FLOOR); const H = VH - FLOOR; seedR(scr.W + 3);
  if (scr.floor === 'planks') {
    P(g, 0, 0, scr.W, H, '#6a4a2e');
    for (let z = 0; z < H; z += 7) { P(g, 0, z, scr.W, 6, z % 14 ? '#5e4228' : '#74522f'); P(g, 0, z + 6, scr.W, 1, 'rgba(30,18,8,.6)'); for (let x = (z * 13) % 64; x < scr.W; x += 64) { P(g, x, z, 1, 6, 'rgba(30,18,8,.55)'); P(g, x + 3, z + 2, 1, 1, '#3a2a1a'); P(g, x - 4, z + 2, 1, 1, '#3a2a1a'); } for (let k = 0; k < scr.W / 20; k++) P(g, rr() * scr.W, z + 1 + rr() * 4, 6 + rr() * 10, 1, 'rgba(255,220,170,.06)'); }
    for (let i = 0; i < scr.W / 160; i++) { const x = rr() * scr.W, z = rr() * (DEPTH - 10); g.strokeStyle = '#3a2a18'; g.beginPath(); g.ellipse(x, z + 6, 8, 3, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(x, z + 6, 5, 2, 0, 0, 7); g.stroke(); }
    for (let i = 0; i < scr.W / 300; i++) { const x = rr() * scr.W, z = rr() * (DEPTH - 20); g.strokeStyle = 'rgba(160,150,120,.35)'; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(x + k * 4, z); g.lineTo(x + k * 4 + 10, z + 14); g.stroke(); g.beginPath(); g.moveTo(x + 22 - k * 4, z); g.lineTo(x + 12 - k * 4, z + 14); g.stroke(); } }
    P(g, 0, DEPTH + 8, scr.W, H, '#2e1c10'); for (let x = 0; x < scr.W; x += 40) P(g, x, DEPTH + 6, 6, 30, '#4a2e1a');
  } else if (scr.floor === 'cobble') {
    P(g, 0, 0, scr.W, H, '#5a5450');
    for (let z = 0; z < DEPTH + 10; z += 6) { const off = (z / 6 % 2) * 5; for (let x = -10 + off; x < scr.W; x += 10) { const l = 70 + rr() * 30 | 0; g.fillStyle = `rgb(${l + 14},${l + 8},${l})`; g.fillRect(x + 1, z + 1, 8, 4); g.fillStyle = 'rgba(255,240,220,.12)'; g.fillRect(x + 1, z + 1, 8, 1); } }
    for (let i = 0; i < scr.W / 50; i++) P(g, rr() * scr.W, rr() * DEPTH, 10 + rr() * 20, 2, 'rgba(40,60,80,.25)');
    P(g, 0, DEPTH + 10, scr.W, H, '#2a2622');
  } else { // wet sand mirroring the sky
    for (let z = 0; z < H; z++) { const t = z / H; g.fillStyle = mix('#c8a080', '#5a5048', t); g.fillRect(0, z, scr.W, 1); }
    for (let i = 0; i < scr.W / 12; i++) { const x = rr() * scr.W, z = rr() * DEPTH; P(g, x, z, 8 + rr() * 30, 1, rr() < .5 ? 'rgba(255,220,180,.25)' : 'rgba(60,50,40,.25)'); }
    for (let i = 0; i < scr.W / 120; i++) { const x = rr() * scr.W, z = 10 + rr() * (DEPTH - 20); g.fillStyle = 'rgba(150,180,190,.5)'; g.beginPath(); g.ellipse(x, z, 18 + rr() * 30, 4 + rr() * 4, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,230,190,.35)'; g.fillRect(x - 10, z - 1, 14, 1); }
    for (let i = 0; i < scr.W / 70; i++) { const x = rr() * scr.W, z = rr() * DEPTH; P(g, x, z, 2, 1, '#e8dcc8'); P(g, x + 3, z + 1, 1, 1, '#a89a8a'); }
  }
  scr.floorC = c;
}
