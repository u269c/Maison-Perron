// =====================================================================
// DE SOIF — level 2, the city port. A hot, dry planet where every street
// has a bar. Four screens: the container port, downtown, the street of
// bars, and Le Poisson Blanc, Oscar's bar, for the fight.
// =====================================================================
function floorSoif(scr) {
  const [c, g] = mkC(scr.W, VH - FLOOR); const H = VH - FLOOR; seedR(scr.W + 7);
  if (scr.floor === 'concrete') {
    P(g, 0, 0, scr.W, H, '#a89a86'); for (let x = 0; x < scr.W; x += 48) P(g, x, 0, 1, DEPTH + 8, 'rgba(60,50,40,.35)'); for (let z = 0; z < DEPTH; z += 30) P(g, 0, z, scr.W, 1, 'rgba(60,50,40,.25)');
    for (let i = 0; i < scr.W / 20; i++) P(g, rr() * scr.W, rr() * DEPTH, 1 + rr() * 3, 1, 'rgba(40,30,20,.35)');
    for (let x = 0; x < scr.W; x += 40) P(g, x, DEPTH * .55, 22, 2, '#e8c02a'); // painted lane
    P(g, 0, DEPTH * .2, scr.W, 2, '#5a5048'); P(g, 0, DEPTH * .2 + 6, scr.W, 2, '#5a5048'); for (let x = 0; x < scr.W; x += 9) P(g, x, DEPTH * .2 - 1, 4, 10, 'rgba(70,50,30,.6)'); // the crane rails
    for (let i = 0; i < scr.W / 160; i++) { const x = rr() * scr.W, z = rr() * DEPTH; g.fillStyle = 'rgba(40,30,30,.25)'; g.beginPath(); g.ellipse(x, z, 10 + rr() * 14, 3 + rr() * 3, 0, 0, 7); g.fill(); }
    P(g, 0, DEPTH + 8, scr.W, H, '#4a4038');
  } else if (scr.floor === 'asphalt') {
    P(g, 0, 0, scr.W, 20, '#b8a890'); for (let x = 0; x < scr.W; x += 16) P(g, x, 0, 1, 20, 'rgba(60,50,40,.4)'); P(g, 0, 20, scr.W, 3, '#8a7a68'); // the sidewalk and its curb
    P(g, 0, 23, scr.W, H - 23, '#4a4650'); for (let i = 0; i < scr.W / 6; i++) P(g, rr() * scr.W, 24 + rr() * (DEPTH - 20), 1, 1, rr() < .5 ? '#5a5660' : '#3a3640');
    for (let x = 0; x < scr.W; x += 70) P(g, x, 23 + (DEPTH - 23) * .55, 36, 2, '#e8e0c8'); // lane dashes
    for (let k = 0; k < 3; k++) { const cx = 500 + k * 820; for (let s = 0; s < 8; s++) P(g, cx + s * 9, 26, 5, DEPTH - 26, 'rgba(232,224,200,.75)'); } // crosswalks
    for (let i = 0; i < scr.W / 300; i++) { const x = rr() * scr.W; P(g, x, 40 + rr() * 50, 14, 8, '#3a3a40'); P(g, x + 2, 42 + rr() * 2, 10, 1, '#5a5a62'); } // manholes
    P(g, 0, DEPTH + 8, scr.W, H, '#2a2830');
  }
  scr.floorC = c;
}
const SOIF_SKY = ['#fff2b0', '#ffe08a', '#ffc860', '#ffaa4a', '#f08a3a'];
function container(g, x, y, w, h, col) { P(g, x, y, w, h, col); for (let k = 2; k < w - 1; k += 3) P(g, x + k, y + 1, 1, h - 2, 'rgba(0,0,0,.2)'); P(g, x, y, w, 1, 'rgba(255,255,255,.25)'); P(g, x, y + h - 1, w, 1, 'rgba(0,0,0,.35)'); }
function brickFacade(g, x, base, w, h, col, sign, sc, seed) { seedR(seed); P(g, x, base - h, w, h, col); for (let yy = base - h; yy < base; yy += 3) P(g, x, yy, w, 1, 'rgba(0,0,0,.08)');
  const rows = Math.floor((h - 18) / 12), cols = Math.max(2, Math.floor(w / 10)); for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) { const wx = x + 4 + k * ((w - 8) / cols), wy = base - h + 6 + r * 12; P(g, wx, wy, 5, 7, rr() < .3 ? '#ffd27a' : '#2a3040'); P(g, wx, wy + 7, 6, 1, 'rgba(255,255,255,.3)'); }
  P(g, x - 1, base - h - 3, w + 2, 3, shadeC(col, -.3)); if (sign) { P(g, x + 4, base - 22, w - 8, 9, '#1a1218'); g.fillStyle = sc; g.font = 'bold 7px sans-serif'; g.textAlign = 'center'; g.fillText(sign, x + w / 2, base - 15); }
  P(g, x + w / 2 - 4, base - 12, 8, 12, '#2a1a14'); }

// =====================================================================
// SCREEN 1 — LE PORT (the container port), 3.5 screens wide
// event: a crane drops a container in the yard when the second wave hits
// =====================================================================
const D1 = {
  id: 'port', name: { fr: 'Le port de commerce', en: 'The container port' }, W: 2240, floor: 'concrete', floorBuild: floorSoif,
  boxes: [{ x: 1180, z: 4, w: 120, d: 30, h: 34 }],
  holes: [],
  items: [{ k: 'crate', x: 300, z: 30 }, { k: 'barrel', x: 340, z: 76 }, { k: 'crate', x: 520, z: 90 }, { k: 'forklift', x: 700, z: 40 }, { k: 'fishcrate', x: 860, z: 70 }, { k: 'barrel', x: 900, z: 24 }, { k: 'crate', x: 1000, z: 96 },
          { k: 'bin', x: 1420, z: 30 }, { k: 'crate', x: 1500, z: 86 }, { k: 'crate', x: 1525, z: 86 }, { k: 'barrel', x: 1640, z: 40 }, { k: 'forklift', x: 1820, z: 80 }, { k: 'fishcrate', x: 1960, z: 30 }, { k: 'barrel', x: 2060, z: 70 }],
  zones: [{ cam: 0, delay: 1.2, waves: [[['trooper', 'R'], ['trooper', 'R'], ['trooper', 'L']], [['gunner', 'R'], ['drunk', 'R'], ['trooper', 'L']]] },
          { cam: 1600, waves: [[['trooper', 'R'], ['drunk', 'R'], ['gunner', 'L'], ['trooper', 'R']], [['brute', 'R'], ['drunk', 'L'], ['trooper', 'R']]] }],
  build() {
    const L = {};
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 230); dithVfast(g, 0, 0, w, 230, SOIF_SKY); g.fillStyle = '#fff8d8'; g.beginPath(); g.arc(470, 70, 34, 0, 7); g.fill(); g.fillStyle = 'rgba(255,250,220,.4)'; g.beginPath(); g.arc(470, 70, 48, 0, 7); g.fill(); L.sky = { c, f: .04 }; }
    { const w = VW + (this.W - VW) * .15; const [c, g] = mkC(w, 230); seedR(3); dithVfast(g, 0, 176, w, 54, ['#4ab0c0', '#3a90a8', '#2a7090']); // the salt sea
      for (let i = 0; i < 4; i++) { const x = 80 + i * 300 + rr() * 80; P(g, x, 166, 80, 10, '#3a2a2a'); P(g, x + 50, 156, 20, 10, '#e8e0d0'); P(g, x + 56, 148, 4, 8, '#c83a2a'); }
      for (let i = 0; i < w; i += 2) P(g, i, 175, 1, 1, '#e8f8f8'); L.far = { c, f: .15 }; }
    { const w = VW + (this.W - VW) * .45; const [c, g] = mkC(w, 230); seedR(11);
      const cols = ['#c83a2a', '#2a6aa8', '#3a8a4a', '#e8b02a', '#e86a2a', '#6a4a8a', '#3aa8a8'];
      for (let x = 0; x < w; x += 46) { const st = 1 + (rr() * 4 | 0); for (let k = 0; k < st; k++) container(g, x + (k % 2) * 4, 190 - (k + 1) * 14, 42, 13, cols[(rr() * cols.length) | 0]); }
      for (let i = 0; i < 4; i++) { const x = 120 + i * (w / 4); P(g, x, 70, 5, 130, '#c83a2a'); P(g, x + 40, 70, 5, 130, '#c83a2a'); P(g, x - 30, 60, 120, 8, '#c83a2a'); for (let k = 0; k < 120; k += 8) P(g, x - 30 + k, 61, 4, 6, '#8a1a14'); P(g, x + 16, 52, 14, 8, '#e8e0d0'); }
      P(g, 0, 200, w, 30, '#6a5a4a'); L.mid = { c, f: .45 }; this.cranes = [0, 1, 2, 3].map(i => 120 + i * (w / 4)); }
    this.L = L; this.gulls = Array.from({ length: 7 }, (_, i) => ({ x: i * 260, y: 50 + (i * 31) % 60, v: 12 + (i % 3) * 5, ph: i }));
    this.drop = { t: -1, x: 0 }; this.box = { x: 0 };
  },
  update(dt, t) { for (const g of this.gulls) { g.x += g.v * dt; if (g.x > this.W * .6 + 300) g.x = -40; }
    if (WORLD.zoneWave > 0 && this.drop.t < 0) { this.drop.t = 0; } if (this.drop.t >= 0 && this.drop.t < 3) { this.drop.t += dt; if (this.drop.t > .9 && !this.drop.hit) { this.drop.hit = 1; WORLD.shake = 10; noise(.5, .12); for (let k = 0; k < 10; k++) smokePuff(this.cranes[1] + 20 + (rr() - .5) * 60, 196, .45, { r: 4, vx: (rr() - .5) * 20, vy: 6, life: 3, col: [200, 180, 150], a: .6, grow: 4 }); } } },
  drawBack(g, camX, t) {
    const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0);
    for (let i = 0; i < 4; i++) { const x = ((i * 220 + t * 4 - camX * .06) % (VW + 300) + VW + 300) % (VW + 300) - 150; cloud(g, x, 30 + i * 18, 60, 'rgba(255,250,230,.8)', 'rgba(230,170,110,.5)'); }
    g.drawImage(L.far.c, Math.round(-camX * L.far.f), 0);
    for (let i = 0; i < 40; i++) { const x = ((i * 61 + Math.sin(t + i) * 4) % VW + VW) % VW; if ((Math.floor(t * 3) + i) % 4) g.fillRect(Math.round(x), 180 + (i % 8) * 6, 3, 1); }
    g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    // the crane trolleys moving, one hauling a container that drops
    for (let i = 0; i < this.cranes.length; i++) { const cx = this.cranes[i] - camX * .45, tx = cx - 20 + ((Math.sin(t * .4 + i * 2) + 1) / 2) * 90; P(g, tx, 66, 12, 6, '#2a2a2a'); g.fillStyle = '#2a2a2a'; g.fillRect(Math.round(tx + 5), 72, 1, 40 + i * 6);
      if (i === 1) { const d = this.drop; let cy = 112 + i * 6; if (d.t > 0) cy += Math.min(1, d.t / .9) ** 2 * 70; if (!d.hit || d.t < 3) container(g, Math.round(tx - 15), Math.round(Math.min(cy, 178)), 42, 13, '#e8b02a'); } else container(g, Math.round(tx - 15), 112 + i * 6, 42, 13, ['#2a6aa8', '#c83a2a', '#3a8a4a', '#6a4a8a'][i]); }
    drawBGP(g, camX, .3, .6);
    for (const gl of this.gulls) gull(g, Math.round(gl.x - camX * .5), Math.round(gl.y + Math.sin(t + gl.ph) * 6), t + gl.ph);
  },
  drawFront(g, camX, t) { for (let i = 0; i < 10; i++) { const x = Math.round(i * 300 - camX * 1.25 + 120); if (x < -40 || x > VW + 40) continue; P(g, x, VH - 30, 22, 30, '#1a1410'); P(g, x - 3, VH - 34, 28, 5, '#2a2018'); P(g, x + 4, VH - 26, 3, 22, 'rgba(255,220,150,.2)'); } }
};

// =====================================================================
// SCREEN 2 — LE CENTRE-VILLE (downtown), 4 screens wide
// event: a police chase tears across the back street, sirens and all
// =====================================================================
const D2 = {
  id: 'centre', name: { fr: 'Le centre-ville', en: 'Downtown' }, W: 2560, floor: 'asphalt', floorBuild: floorSoif,
  boxes: [], holes: [],
  items: [{ k: 'car', x: 420, z: 34 }, { k: 'newsbox', x: 600, z: 12 }, { k: 'bin', x: 640, z: 14 }, { k: 'moto', x: 820, z: 70 }, { k: 'moto', x: 860, z: 86 }, { k: 'stall', x: 1080, z: 20 }, { k: 'car', x: 1340, z: 80 },
          { k: 'bin', x: 1560, z: 12 }, { k: 'newsbox', x: 1600, z: 14 }, { k: 'crate', x: 1750, z: 60 }, { k: 'car', x: 1980, z: 30 }, { k: 'moto', x: 2200, z: 90 }, { k: 'bin', x: 2320, z: 12 }, { k: 'barrel', x: 2400, z: 70 }],
  zones: [{ cam: 380, waves: [[['trooper', 'R'], ['drunk', 'R'], ['trooper', 'L']], [['gunner', 'R'], ['gunner', 'L'], ['trooper', 'R']]] },
          { cam: 1200, waves: [[['drunk', 'R'], ['drunk', 'R'], ['trooper', 'L'], ['gunner', 'R']]] },
          { cam: 1920, waves: [[['trooper', 'R'], ['trooper', 'L'], ['brute', 'R']], [['drunk', 'R'], ['brute', 'L'], ['gunner', 'R']]] }],
  build() {
    const L = {};
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 230); dithVfast(g, 0, 0, w, 230, SOIF_SKY); g.fillStyle = '#fff8d8'; g.beginPath(); g.arc(150, 50, 26, 0, 7); g.fill(); L.sky = { c, f: .04 }; }
    { const w = VW + (this.W - VW) * .2; const [c, g] = mkC(w, 230); seedR(23); for (let x = 0; x < w; x += 18 + rr() * 20) { const h = 60 + rr() * 90, ww = 16 + rr() * 22; P(g, x, 200 - h, ww, h, mix('#c89a6a', '#e8c890', rr())); for (let k = 0; k < h / 8; k++) P(g, x + 3, 204 - h + k * 8, ww - 6, 2, 'rgba(255,240,200,.4)'); if (rr() < .3) { P(g, x + ww / 2 - 1, 200 - h - 14, 2, 14, '#6a5040'); P(g, x + ww / 2 - 4, 200 - h - 20, 8, 7, '#8a6a4a'); } } L.far = { c, f: .2 }; }
    { const w = VW + (this.W - VW) * .5; const [c, g] = mkC(w, 230); seedR(41);
      const signs = [['BAR', '#ff4f8a'], ['HÔTEL', '#ffd23f'], ['TABAC', '#6ad8ff'], ['CAFÉ', '#ff8a3a'], ['SOIF-COLA', '#ff3a3a'], ['BAR', '#7dffc0'], ['PHARMACIE', '#7dff7d'], ['BAR', '#ffd23f']];
      let x = 0, i = 0; while (x < w) { const ww = 60 + rr() * 50, h = 80 + rr() * 70; brickFacade(g, x, 202, ww, h, ['#a84a3a', '#c86a4a', '#8a5a4a', '#b87a5a', '#6a6a7a'][i % 5], signs[i % signs.length][0], signs[i % signs.length][1], 41 + i); x += ww + 2; i++; }
      P(g, 0, 202, w, 28, '#8a7a68'); // the far sidewalk
      L.mid = { c, f: .5 }; this.neons = []; for (let k = 0; k < 30; k++) this.neons.push([rr() * w, 60 + rr() * 110, rr() * 6]); }
    this.L = L; this.cars = Array.from({ length: 5 }, (_, i) => ({ x: i * 300, v: 40 + i * 12, col: ['#c83a2a', '#2a6aa8', '#e8b02a', '#3a8a4a', '#e8e0d0'][i] })); this.chase = { t: -1 };
  },
  update(dt, t) { for (const c of this.cars) { c.x += c.v * dt; if (c.x > VW + (this.W - VW) * .5 + 100) c.x = -80; } if (WORLD.zoneIdx >= 1 && this.chase.t < 0) this.chase.t = 0; if (this.chase.t >= 0) this.chase.t += dt; },
  drawBack(g, camX, t) {
    const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0); g.drawImage(L.far.c, Math.round(-camX * L.far.f), 0);
    // traffic on the far street
    for (const c of this.cars) { const x = Math.round(c.x - camX * .5); if (x < -40 || x > VW + 40) continue; P(g, x, 206, 26, 7, c.col); P(g, x + 5, 201, 14, 5, c.col); P(g, x + 7, 202, 10, 3, '#b8d8f0'); P(g, x + 3, 212, 5, 3, '#1a1a1a'); P(g, x + 18, 212, 5, 3, '#1a1a1a'); }
    if (this.chase.t >= 0 && this.chase.t < 8) { const x = Math.round(-60 + this.chase.t * 160 - camX * .5 + camX * .5); for (const [dx, col] of [[90, '#2a2a3a'], [0, '#e8e8f0'], [-60, '#e8e8f0']]) { P(g, x + dx, 207, 28, 7, col); P(g, x + dx + 6, 202, 14, 5, col); P(g, x + dx + 3, 213, 5, 3, '#1a1a1a'); P(g, x + dx + 20, 213, 5, 3, '#1a1a1a'); if (dx <= 0) { P(g, x + dx + 10, 200, 3, 2, Math.floor(t * 8) % 2 ? '#ff2a2a' : '#2a6aff'); P(g, x + dx + 14, 200, 3, 2, Math.floor(t * 8) % 2 ? '#2a6aff' : '#ff2a2a'); } } }
    g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    for (const [x, y, ph] of this.neons) if (Math.sin(t * 5 + ph * 7) > -.7) { g.fillStyle = ['rgba(255,80,140,.45)', 'rgba(255,210,60,.45)', 'rgba(110,220,255,.45)'][Math.floor(ph) % 3]; g.fillRect(Math.round(x - camX * .5), Math.round(y), 8, 2); }
    // a traffic light
    for (let k = 0; k < 4; k++) { const x = Math.round(400 + k * 700 - camX * .9); if (x < -20 || x > VW + 20) continue; P(g, x, 120, 3, 92, '#2a2a30'); P(g, x - 3, 112, 9, 22, '#1a1a20'); const ph = Math.floor(t / 3 + k) % 3; P(g, x - 1, 114, 5, 5, ph === 0 ? '#ff3a2a' : '#4a1a14'); P(g, x - 1, 120, 5, 5, ph === 1 ? '#ffc83a' : '#4a3a14'); P(g, x - 1, 126, 5, 5, ph === 2 ? '#3aff6a' : '#143a1a'); }
  },
  drawFront(g, camX, t) { for (let i = 0; i < 9; i++) { const x = Math.round(i * 320 - camX * 1.3 + 60); if (x < -30 || x > VW + 30) continue; P(g, x, VH - 80, 5, 80, '#14121a'); P(g, x - 10, VH - 84, 26, 5, '#1a1820'); g.fillStyle = 'rgba(255,230,160,.12)'; g.fillRect(x - 24, VH - 110, 52, 50); } }
};

// =====================================================================
// SCREEN 3 — LA RUE DES BARS (the street of bars), 4 screens wide, evening
// event: someone gets thrown out through a bar window
// =====================================================================
const D3 = {
  id: 'bars', name: { fr: 'La rue des bars', en: 'The street of bars' }, W: 2560, floor: 'cobble',
  boxes: [], holes: [],
  items: [{ k: 'table', x: 360, z: 20 }, { k: 'chair', x: 330, z: 26 }, { k: 'chair', x: 392, z: 26 }, { k: 'barrel', x: 520, z: 80 }, { k: 'bottles', x: 560, z: 84 }, { k: 'table', x: 760, z: 70 }, { k: 'stool', x: 730, z: 74 }, { k: 'stool', x: 792, z: 74 },
          { k: 'barrel', x: 1000, z: 16 }, { k: 'barrel', x: 1020, z: 30 }, { k: 'cart', x: 1240, z: 60 }, { k: 'table', x: 1500, z: 24 }, { k: 'chair', x: 1470, z: 30 }, { k: 'chair', x: 1532, z: 30 }, { k: 'bottles', x: 1700, z: 90 },
          { k: 'moto', x: 1880, z: 14 }, { k: 'table', x: 2100, z: 76 }, { k: 'chair', x: 2070, z: 82 }, { k: 'bin', x: 2300, z: 12 }, { k: 'barrel', x: 2420, z: 50 }],
  zones: [{ cam: 420, waves: [[['drunk', 'R'], ['drunk', 'R'], ['drunk', 'L']], [['trooper', 'R'], ['gunner', 'L'], ['drunk', 'R']]] },
          { cam: 1240, waves: [[['drunk', 'R'], ['trooper', 'R'], ['drunk', 'L'], ['drunk', 'L']]] },
          { cam: 1920, waves: [[['brute', 'R'], ['drunk', 'R'], ['drunk', 'L']], [['gunner', 'R'], ['gunner', 'L'], ['brute', 'R']]] }],
  build() {
    const L = {};
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 230); dithVfast(g, 0, 0, w, 230, ['#2a1a4a', '#5a2a6a', '#a8406a', '#f0705a', '#ffb060']); paintStars(g, w, 80, 60, 7); L.sky = { c, f: .04 }; }
    { const w = VW + (this.W - VW) * .5; const [c, g] = mkC(w, 230); seedR(55);
      const names = ['LE VERRE VIDE', 'CHEZ GINETTE', 'LE GOULOT', 'LA SOIF', 'LE PICHET', 'BAR', 'LE TONNEAU', 'LE ZINC', 'LA DERNIÈRE'];
      let x = 0, i = 0; while (x < w - 160) { const ww = 70 + rr() * 40, h = 90 + rr() * 50; brickFacade(g, x, 202, ww, h, ['#5a3a4a', '#4a3a5a', '#6a4a3a', '#3a4a5a'][i % 4], names[i % names.length], ['#ff4f8a', '#ffd23f', '#6ad8ff', '#7dffc0'][i % 4], 55 + i); P(g, x + 6, 168, ww - 12, 20, '#ffd27a'); P(g, x + 6, 168, ww - 12, 1, '#fff2c0'); for (let k = 0; k < 3; k++) P(g, x + 10 + k * (ww - 20) / 3, 172, 6, 16, 'rgba(60,30,30,.6)'); x += ww + 3; i++; }
      // Le Poisson Blanc at the end of the street, its fish sign glowing
      const bx = w - 150; P(g, bx, 70, 150, 132, '#e8e0d0'); for (let k = 0; k < 132; k += 4) P(g, bx, 70 + k, 150, 1, 'rgba(0,0,0,.06)'); P(g, bx + 55, 150, 40, 52, '#2a1a14'); P(g, bx + 60, 154, 30, 44, '#ffd27a');
      P(g, bx + 10, 80, 130, 22, '#1a1218'); this.sign = [bx + 75, 91]; P(g, 0, 202, w, 28, '#5a4a48'); L.mid = { c, f: .5 }; }
    this.L = L; this.bulbs = Array.from({ length: 80 }, (_, i) => i); this.toss = { t: -1 }; this.drunks = Array.from({ length: 6 }, (_, i) => ({ x: 100 + i * 210, ph: i * 1.7 }));
  },
  update(dt, t) { if (WORLD.zoneIdx >= 1 && this.toss.t < 0) this.toss.t = 0; if (this.toss.t >= 0) this.toss.t += dt; for (const d of this.drunks) d.x += Math.sin(t * .7 + d.ph) * 8 * dt; },
  drawBack(g, camX, t) {
    const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0); g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    const [sx, sy0] = this.sign; const X = Math.round(sx - camX * .5), on = Math.sin(t * 7) > -.85; g.fillStyle = on ? '#9adcff' : '#2a4a5a'; g.font = 'bold 9px sans-serif'; g.textAlign = 'center'; g.fillText('LE POISSON BLANC', X, sy0 + 3);
    if (on) { g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(X, sy0 - 18, 14, 6, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(X + 12, sy0 - 18); g.lineTo(X + 22, sy0 - 24); g.lineTo(X + 22, sy0 - 12); g.fill(); g.fillStyle = '#1a1218'; g.fillRect(X - 9, sy0 - 20, 2, 2); }
    // string lights swaying across the street
    for (let k = 0; k < 14; k++) { const x0 = k * 160 - camX * .7; if (x0 < -200 || x0 > VW + 40) continue; for (let j = 0; j < 9; j++) { const u = j / 8, x = x0 + u * 160, y = 70 + Math.sin(u * Math.PI) * 26 + Math.sin(t * 1.5 + k) * 2; g.fillStyle = (j + Math.floor(t * 2)) % 3 ? '#ffd27a' : '#ff8a5a'; g.fillRect(Math.round(x), Math.round(y), 2, 2); } }
    // drunks swaying under the lights
    for (const d of this.drunks) { const x = Math.round(d.x - camX * .5), sw = Math.sin(t * 2 + d.ph) * 2; if (x < -20 || x > VW + 20) continue; P(g, x + sw, 186, 4, 14, '#2a2030'); P(g, x - 1 + sw * 1.4, 181, 6, 6, '#c89a7a'); P(g, x + 4 + sw, 189, 4, 2, '#5a8a4a'); }
    if (this.toss.t >= 0 && this.toss.t < 2) { const u = this.toss.t, x = Math.round(300 - camX * .5 + u * 120), y = Math.round(172 - Math.sin(Math.min(1, u) * Math.PI) * 30 + Math.max(0, u - 1) * 40); P(g, x, y, 6, 10, '#3a3044'); P(g, x, y - 5, 6, 5, '#c89a7a'); if (u < .3) for (let k = 0; k < 8; k++) P(g, 300 - camX * .5 + k * 4, 170 + (k * 7) % 12, 2, 2, '#c8f0ff'); }
  },
  drawFront(g, camX, t) { for (let i = 0; i < 10; i++) { const x = Math.round(i * 290 - camX * 1.25 + 40); if (x < -30 || x > VW + 30) continue; P(g, x, VH - 70, 4, 70, '#120c10'); P(g, x - 6, VH - 78, 16, 10, '#1a1418'); g.fillStyle = `rgba(255,200,120,${.7 + Math.sin(t * 6 + i) * .1})`; g.fillRect(x - 3, VH - 76, 10, 6); g.fillStyle = 'rgba(255,190,110,.1)'; g.fillRect(x - 30, VH - 100, 64, 60); } }
};

// =====================================================================
// SCREEN 4 — LE POISSON BLANC (Oscar's bar), 2.5 screens wide
// a western saloon: the long bar at the back, a balcony goons jump from,
// round tables, a piano, a swinging chandelier
// =====================================================================
const D4 = {
  id: 'poisson', name: { fr: 'Le Poisson Blanc', en: 'Le Poisson Blanc' }, W: 1600, floor: 'planks',
  boxes: [], holes: [], barX: 1380,
  items: [{ k: 'table', x: 260, z: 30 }, { k: 'chair', x: 230, z: 36 }, { k: 'chair', x: 292, z: 36 }, { k: 'table', x: 420, z: 84 }, { k: 'stool', x: 390, z: 90 }, { k: 'chair', x: 452, z: 90 }, { k: 'piano', x: 130, z: 6 },
          { k: 'table', x: 640, z: 40 }, { k: 'chair', x: 610, z: 46 }, { k: 'chair', x: 672, z: 46 }, { k: 'bottles', x: 760, z: 96 }, { k: 'table', x: 880, z: 88 }, { k: 'stool', x: 850, z: 94 }, { k: 'stool', x: 912, z: 94 },
          { k: 'table', x: 1080, z: 34 }, { k: 'chair', x: 1050, z: 40 }, { k: 'chair', x: 1112, z: 40 }, { k: 'barrel', x: 1200, z: 92 }, { k: 'keg', x: 1500, z: 14 }, { k: 'table', x: 1300, z: 80 }, { k: 'stool', x: 1270, z: 86 }],
  zones: [{ cam: 0, delay: 1, waves: [[['drunk', 'drop'], ['drunk', 'drop'], ['drunk', 'R']], [['drunk', 'drop'], ['trooper', 'R'], ['drunk', 'drop'], ['drunk', 'L']]] },
          { cam: 960, boss: true, waves: [[['drunk', 'drop'], ['drunk', 'drop']], [['oscar', 'bar'], ['drunk', 'drop'], ['drunk', 'drop']]] }],
  build() {
    const L = {}; const w = VW + (this.W - VW) * .7;
    const [c, g] = mkC(w, 230); seedR(77);
    for (let x = 0; x < w; x += 7) P(g, x, 0, 7, 230, x % 14 ? '#6a3a22' : '#5e321c'); for (let x = 0; x < w; x += 7) P(g, x, 0, 1, 230, 'rgba(0,0,0,.25)');
    P(g, 0, 0, w, 14, '#3a1e10'); for (let x = 20; x < w; x += 110) { P(g, x, 14, 4, 50, '#3a1e10'); } // beams
    // the balcony with its railing
    P(g, 0, 58, w, 8, '#4a2a16'); P(g, 0, 66, w, 3, '#2a160a'); for (let x = 0; x < w; x += 10) P(g, x + 2, 40, 2, 18, '#5a3220'); P(g, 0, 38, w, 3, '#7a4a2a');
    for (let x = 30; x < w; x += 140) { P(g, x, 18, 26, 20, '#2a1a10'); P(g, x + 3, 21, 20, 14, '#ffd27a'); } // doors upstairs
    // the long bar at the back, shelves of bottles, the mirror
    const bx = w - 360; P(g, bx, 90, 340, 60, '#2a1a14'); P(g, bx + 10, 94, 320, 50, '#8ab0c0'); P(g, bx + 10, 94, 320, 2, '#d8e8f0'); for (let k = 0; k < 3; k++) { P(g, bx, 150 + k * 16, 360, 3, '#4a2a16'); for (let j = 0; j < 40; j++) { const col = ['#5a8a4a', '#8a3a2a', '#c8a04a', '#3a5a8a', '#e8e0d0'][(j + k) % 5]; P(g, bx + 6 + j * 9, 140 + k * 16, 4, 10, col); P(g, bx + 7 + j * 9, 137 + k * 16, 2, 3, col); } }
    P(g, bx - 20, 186, 380, 6, '#c8963a'); P(g, bx - 20, 192, 380, 30, '#5a2e18'); for (let k = 0; k < 380; k += 30) P(g, bx - 20 + k, 194, 2, 26, '#3a1e10'); g.fillStyle = '#efe6d2'; g.font = 'bold 10px Georgia'; g.textAlign = 'center'; g.fillText('LE POISSON BLANC', bx + 160, 128);
    for (let x = 40; x < bx - 60; x += 160) { P(g, x, 100, 50, 36, '#c8963a'); P(g, x + 3, 103, 44, 30, '#3a4a5a'); P(g, x + 8, 112, 30, 10, '#e8e0d0'); } // framed pictures
    L.mid = { c, f: .7 }; this.L = L; this.bx = bx;
    this.watchers = Array.from({ length: 10 }, (_, i) => ({ x: 60 + i * (w / 10), ph: i * 1.3 })); this.chand = { a: 0, v: 0 };
  },
  dropPoints() { return [camX + 120, camX + 300, camX + 480]; },
  update(dt, t) { const c = this.chand; c.v += -c.a * 6 * dt - c.v * .3 * dt; c.a += c.v * dt; if (WORLD.shake > 6) c.v += (Math.random() - .5) * 2; },
  drawBack(g, camX, t) {
    const L = this.L; g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    // goons watching from the balcony, cheering, swaying, waving bottles
    for (const wt of this.watchers) { const x = Math.round(wt.x - camX * .7), jump = Math.max(0, Math.sin(t * 4 + wt.ph)) * (WORLD.boss ? 3 : 1); if (x < -20 || x > VW + 20) continue; P(g, x, 26 - jump, 8, 14, '#3a3044'); P(g, x + 1, 19 - jump, 6, 7, '#c89a7a'); P(g, x + 1, 17 - jump, 6, 3, '#5a5a62'); if (Math.sin(t * 3 + wt.ph) > .3) P(g, x + 8, 14 - jump, 2, 8, '#5a8a4a'); }
    // the chandelier
    const cx = Math.round(800 - camX * .8), a = this.chand.a + Math.sin(t * .8) * .05; const ex = cx + Math.sin(a) * 40, ey = 14 + Math.cos(a) * 40; g.strokeStyle = '#2a1a10'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx, 14); g.lineTo(ex, ey); g.stroke(); P(g, ex - 18, ey, 36, 4, '#c8963a'); for (let k = 0; k < 5; k++) { P(g, ex - 16 + k * 8, ey - 6, 2, 6, '#efe6d2'); g.fillStyle = `rgba(255,${200 + Math.sin(t * 9 + k) * 30 | 0},120,.9)`; g.fillRect(Math.round(ex - 16 + k * 8), Math.round(ey - 9), 2, 3); } g.fillStyle = 'rgba(255,210,140,.08)'; g.beginPath(); g.arc(ex, ey, 70, 0, 7); g.fill();
  },
  drawFront(g, camX, t) { for (let i = 0; i < 6; i++) { const x = Math.round(i * 330 - camX * 1.2 + 200); if (x < -40 || x > VW + 40) continue; P(g, x, VH - 110, 14, 110, '#1a0e08'); P(g, x - 4, VH - 114, 22, 6, '#2a160a'); } }
};
