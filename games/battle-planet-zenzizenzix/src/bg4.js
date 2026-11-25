// =====================================================================
// ZOMBIMARE — world 4, black-and-white screentones with one toxic green (the shader's manga style keeps saturated
// greens). Four screens: the Marais des Morts (giant trees, bog holes, poison patches, things hanging from the
// branches), the Cimetière (graves, the storm, the circus plot, the great mausoleum), the nave of the church, and the
// choir up the steps, where Prêtre-o-Dame waits at the altar.
// =====================================================================
const ZK = '#0e0e10';   // the ink of this world
function zr(g, x, y, w, h, col) { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function zpoly(g, pts, col, ink) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = col; g.fill(); if (ink) { g.strokeStyle = ink; g.lineWidth = 1; g.stroke(); } }
// a gnarled swamp tree: a twisted trunk, buttress roots, crooked branches, curtains of moss
function swampTree(g, x, base, h, col, moss, seed) { seedR(seed); const w = 14 + rr() * 10;
  zpoly(g, [[x - w * 1.6, base], [x - w * .5, base - 18], [x - w * .45, base - h * .6], [x - w * .8, base - h], [x + w * .9, base - h], [x + w * .5, base - h * .55], [x + w * .6, base - 16], [x + w * 1.7, base]], col);
  for (let k = 0; k < 5; k++) { const a = -2.4 + k * .9 + (rr() - .5) * .4, L = 30 + rr() * 40, bx = x + (rr() - .5) * w, by = base - h + 6 + rr() * 20; g.strokeStyle = col; g.lineWidth = 6 - k * .6; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + Math.cos(a) * L * .5, by + Math.sin(a) * L * .7 - 10, bx + Math.cos(a) * L, by + Math.sin(a) * L * .6); g.stroke();
    for (let j = 0; j < 4; j++) { const mx = bx + Math.cos(a) * L * (.3 + j * .2), my = by + Math.sin(a) * L * .4 * (.3 + j * .2); g.strokeStyle = moss; g.lineWidth = 1.2; g.beginPath(); g.moveTo(mx, my); g.quadraticCurveTo(mx + 2, my + 14, mx - 1, my + 22 + rr() * 22); g.stroke(); } }
  g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x - w * .3, base - h * .9, 2, h * .8); }
function tombstone(g, x, base, w, h, col, kind) { if (kind === 0) zpoly(g, [[x, base], [x + w, base], [x + w, base - h * .75], [x + w / 2, base - h], [x, base - h * .75]], col, ZK);
  else if (kind === 1) { zr(g, x + w / 2 - 2, base - h, 4, h, col); zr(g, x, base - h * .72, w, 4, col); g.strokeStyle = ZK; g.lineWidth = .6; g.strokeRect(x + w / 2 - 2, base - h, 4, h); }
  else { g.fillStyle = col; g.beginPath(); g.moveTo(x, base); g.lineTo(x, base - h * .7); g.arc(x + w / 2, base - h * .7, w / 2, Math.PI, 0); g.lineTo(x + w, base); g.closePath(); g.fill(); g.strokeStyle = ZK; g.lineWidth = .6; g.stroke(); } }
function floorZombi(scr) {
  const [c, g] = mkC(scr.W, VH - FLOOR); const H = VH - FLOOR; seedR(scr.W + 41);
  if (scr.floor === 'marsh') { P(g, 0, 0, scr.W, H, '#4a4844');
    for (let i = 0; i < scr.W / 6; i++) { g.fillStyle = rr() < .5 ? '#3a3834' : '#5a5650'; g.fillRect(rr() * scr.W, rr() * DEPTH, 3 + rr() * 8, 1 + rr() * 2); }
    for (let i = 0; i < scr.W / 70; i++) { const x = rr() * scr.W, z = rr() * DEPTH; g.fillStyle = '#2a2a26'; g.beginPath(); g.ellipse(x, z, 10 + rr() * 16, 3 + rr() * 3, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(160,160,150,.4)'; g.fillRect(x - 4, z - 1, 6, 1); }   // puddles
    for (let i = 0; i < scr.W / 18; i++) { const x = rr() * scr.W, z = rr() * DEPTH; g.strokeStyle = rr() < .3 ? '#3a8a22' : '#2a2a26'; g.lineWidth = 1; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(x + k * 2, z); g.lineTo(x + k * 2 + (rr() - .5) * 4, z - 4 - rr() * 4); g.stroke(); } }   // reeds
    P(g, 0, DEPTH + 8, scr.W, H, '#1e1e1c'); P(g, 0, DEPTH + 8, scr.W, 1, ZK);
  } else if (scr.floor === 'grave') { P(g, 0, 0, scr.W, H, '#6a6a66');
    for (let i = 0; i < scr.W / 4; i++) { g.fillStyle = rr() < .5 ? '#5a5a56' : '#7a7a74'; g.fillRect(rr() * scr.W, rr() * DEPTH, 2, 2 + rr() * 3); }
    P(g, 0, DEPTH * .38, scr.W, DEPTH * .28, '#8a8882'); for (let i = 0; i < scr.W / 3; i++) { g.fillStyle = rr() < .5 ? '#9a9890' : '#7a7872'; g.fillRect(rr() * scr.W, DEPTH * .38 + rr() * DEPTH * .28, 2, 1.4); }   // the gravel path
    for (let x = 80; x < scr.W; x += 190) { g.fillStyle = '#4a4a46'; g.beginPath(); g.ellipse(x + rr() * 40, 10 + rr() * 8, 22, 5, 0, 0, 7); g.fill(); }   // old graves sunk in the grass
    P(g, 0, DEPTH + 8, scr.W, H, '#2a2a28'); P(g, 0, DEPTH + 8, scr.W, 1, ZK);
  } else { const choir = scr.floor === 'choir'; P(g, 0, 0, scr.W, H, choir ? '#aeaca6' : '#a8a49c');
    for (let z = 0; z < DEPTH + 8; z += 16) for (let x = (z / 16 % 2) * 20; x < scr.W; x += 40) { g.fillStyle = (x + z) % 80 ? (choir ? '#a4a29a' : '#9a968e') : (choir ? '#c2c0b8' : '#b8b4ac'); g.fillRect(x, z, 39, 15); }
    P(g, 0, DEPTH * .36, scr.W, DEPTH * .3, choir ? '#5a5a5a' : '#3a3a3a'); P(g, 0, DEPTH * .36, scr.W, 1.5, '#c8a040'); P(g, 0, DEPTH * .66, scr.W, 1.5, '#c8a040');   // the long carpet
    if (choir) for (let k = 0; k < 4; k++) { P(g, 80 + k * 26, 0, 24, DEPTH + 8, k % 2 ? '#c8c6be' : '#8a8882'); P(g, 80 + k * 26, 0, 1, DEPTH + 8, ZK); }   // the steps up to the choir
    P(g, 0, DEPTH + 8, scr.W, H, '#2a2826'); P(g, 0, DEPTH + 8, scr.W, 1, ZK); }
  scr.floorC = c; }
const BOG = { col: '#1e2a1a', hi: '#3a6a28' };   // the bog holes (play.js draws holes in scr.holeCol)

// =====================================================================
// SCREEN 1 — LE MARAIS DES MORTS
// =====================================================================
const Z1 = {
  id: 'marais', name: { fr: 'Le marais des Morts', en: 'The Marsh of the Dead' }, W: 2600, floor: 'marsh', floorBuild: floorZombi, holeCol: BOG,
  boxes: [], holes: [{ x0: 760, x1: 806 }, { x0: 1240, x1: 1284 }, { x0: 1720, x1: 1768 }],
  patches: [{ x: 420, z: 40, rx: 30, rz: 11 }, { x: 1000, z: 70, rx: 32, rz: 12 }, { x: 1450, z: 30, rx: 30, rz: 11 }, { x: 2000, z: 60, rx: 34, rz: 12 }, { x: 2330, z: 24, rx: 28, rz: 10 }],
  dangles: [{ x: 520, z: 30, kind: 'vine' }, { x: 900, z: 90, kind: 'cocoon' }, { x: 1120, z: 50, kind: 'vine' }, { x: 1600, z: 80, kind: 'cocoon', spawn: 'blob' }, { x: 1900, z: 30, kind: 'vine' }, { x: 2200, z: 100, kind: 'vine' }],
  items: [{ k: 'stump', x: 340, z: 20 }, { k: 'jar', x: 470, z: 84 }, { k: 'lantern', x: 640, z: 20 }, { k: 'jar', x: 980, z: 30 }, { k: 'stump', x: 1100, z: 96 }, { k: 'lantern', x: 1380, z: 70 }, { k: 'jar', x: 1500, z: 16 },
          { k: 'stump', x: 1880, z: 92 }, { k: 'lantern', x: 2100, z: 40 }, { k: 'jar', x: 2250, z: 80 }, { k: 'poison', x: 2160, z: 96 }],
  zones: [{ cam: 0, delay: 1.2, waves: [[['blob', 'R'], ['frog', 'R']], [['leech', 'R'], ['blob', 'L'], ['frog', 'R'], ['leech', 'R']]] },
          { cam: 1000, waves: [[['frog', 'R'], ['blob', 'R'], ['leech', 'L']], [['blob', 'R'], ['frog', 'L'], ['frog', 'R'], ['leech', 'R']]] },
          { cam: 1960, waves: [[['leech', 'R'], ['blob', 'R'], ['frog', 'L']], [['spider', 'drop']]] }],
  dropPoints() { return [camX + 160, camX + 340, camX + 500]; },
  build() { const L = {};
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 230); dithVfast(g, 0, 0, w, 230, ['#1a1a1c', '#2a2a2c', '#3a3a3a', '#5a5a58']); g.fillStyle = '#f4f4ee'; g.beginPath(); g.arc(470, 50, 24, 0, 7); g.fill(); g.fillStyle = '#d8d8d0'; g.beginPath(); g.arc(462, 46, 5, 0, 7); g.arc(478, 58, 4, 0, 7); g.fill(); L.sky = { c, f: .04 }; }
    { const w = VW + (this.W - VW) * .15; const [c, g] = mkC(w, 230); for (let x = -20; x < w; x += 70) swampTree(g, x + (x * 7) % 30, 200, 110 + (x * 13) % 60, '#2a2a2a', '#4a4a48', x + 3); P(g, 0, 170, w, 40, 'rgba(200,200,190,.18)'); L.far = { c, f: .15 }; }
    { const w = VW + (this.W - VW) * .5; const [c, g] = mkC(w, 230); seedR(77);
      for (let x = 0; x < w; x += 150 + rr() * 60) swampTree(g, x, 210, 170 + rr() * 50, '#141414', '#3a3a38', x + 11);
      for (let x = 30; x < w; x += 130) { g.fillStyle = '#1e2a1a'; g.beginPath(); g.ellipse(x, 206, 26, 4, 0, 0, 7); g.fill(); g.fillStyle = GRN; g.beginPath(); g.ellipse(x - 4, 205, 12, 1.6, 0, 0, 7); g.fill(); }   // glowing pools
      P(g, 0, 204, w, 26, '#2a2a28'); P(g, 0, 204, w, 1, ZK); L.mid = { c, f: .5 }; }
    this.L = L; this.wisps = Array.from({ length: 14 }, (_, i) => ({ x: i * 120, y: 120 + (i * 37) % 70, ph: i })); this.eyes = Array.from({ length: 8 }, (_, i) => ({ x: 80 + i * 210, y: 150 + (i * 23) % 40, ph: i * 1.3 })); },
  update(dt, t) { for (const w of this.wisps) { w.x += Math.sin(t * .7 + w.ph) * 12 * dt; w.y += Math.cos(t * 1.1 + w.ph) * 8 * dt; } },
  drawBack(g, camX, t) { const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0); g.drawImage(L.far.c, Math.round(-camX * L.far.f), 0);
    for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(210,210,200,.12)'; g.fillRect(((i * 300 + t * 8 - camX * .25) % (VW + 400) + VW + 400) % (VW + 400) - 300, 150 + i * 16, 320, 10); }   // drifting mist
    g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    for (const e of this.eyes) { const x = Math.round(e.x - camX * .5); if (x < -10 || x > VW + 10 || Math.sin(t * .8 + e.ph) > .8) continue; g.fillStyle = GRN; g.fillRect(x, e.y, 2, 1.5); g.fillRect(x + 5, e.y, 2, 1.5); }   // eyes in the dark
    for (const w of this.wisps) { const x = Math.round(w.x - camX * .7); if (x < -10 || x > VW + 10) continue; g.fillStyle = `rgba(150,255,110,${.5 + Math.sin(t * 3 + w.ph) * .3})`; g.beginPath(); g.arc(x, w.y, 1.6, 0, 7); g.fill(); }
    drawBGP(g, camX, .3, .6); },
  drawFront(g, camX, t) { for (let i = 0; i < 12; i++) { const x = Math.round(i * 240 - camX * 1.25 + 80); if (x < -40 || x > VW + 40) continue;
      for (let k = 0; k < 7; k++) { g.strokeStyle = '#0e0e10'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + k * 4, VH); g.quadraticCurveTo(x + k * 4 + Math.sin(t + k + i) * 3, VH - 20, x + k * 5 - 4, VH - 34 - (k % 3) * 8); g.stroke(); if (k % 3 === 0) { g.fillStyle = '#2a2a28'; g.fillRect(x + k * 5 - 6, VH - 44 - (k % 3) * 8, 4, 10); } } }   // cattails
    for (let i = 0; i < 10; i++) { const x = Math.round(i * 280 - camX * 1.15 + 20); if (x < -30 || x > VW + 30) continue; for (let k = 0; k < 6; k++) { g.strokeStyle = k % 2 ? '#1a1a1a' : '#2a2a28'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x + k * 5, 0); g.quadraticCurveTo(x + k * 5 + Math.sin(t * .8 + k) * 3, 14, x + k * 5 - 1, 20 + (k * 7) % 22); g.stroke(); } } }   // moss hanging over the camera
};

// =====================================================================
// SCREEN 2 — LE CIMETIÈRE (the storm, the circus plot, the great mausoleum)
// =====================================================================
const Z2 = {
  id: 'cimetiere', name: { fr: 'Le cimetière', en: 'The Cemetery' }, W: 2600, floor: 'grave', floorBuild: floorZombi, storm: true,
  boxes: [], holes: [],
  items: [{ k: 'tomb', x: 300, z: 14 }, { k: 'urn', x: 380, z: 90 }, { k: 'lantern', x: 520, z: 20 }, { k: 'tomb', x: 640, z: 96 }, { k: 'coffin', x: 820, z: 60 }, { k: 'urn', x: 1000, z: 16 }, { k: 'tomb', x: 1180, z: 30 },
          { k: 'lantern', x: 1320, z: 92 }, { k: 'coffin', x: 1500, z: 24 }, { k: 'tomb', x: 1700, z: 90 }, { k: 'urn', x: 1880, z: 40 }, { k: 'tomb', x: 2080, z: 14 }, { k: 'coffin', x: 2260, z: 80 }, { k: 'lantern', x: 2400, z: 30 }],
  zones: [{ cam: 0, delay: 1.2, waves: [[['skel', 'R'], ['skel', 'R'], ['boner', 'L']], [['knight', 'R'], ['skel', 'R'], ['boner', 'R'], ['skel', 'L']]] },
          { cam: 960, waves: [[['skel', 'R'], ['boner', 'R'], ['skel', 'L'], ['skel', 'R']], [['elephant', 'R'], ['skel', 'L']]] },
          { cam: 1960, waves: [[['skel', 'R'], ['knight', 'L'], ['boner', 'R']], [['giraffe', 'R'], ['boner', 'L'], ['skel', 'L']]] }],
  dropPoints() { return [camX + 160, camX + 340, camX + 500]; },
  build() { const L = {};
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 230); dithVfast(g, 0, 0, w, 230, ['#2a2a2c', '#4a4a4c', '#6a6a6a', '#8a8a88']); seedR(12);
      for (let i = 0; i < 14; i++) { const x = rr() * w, y = 20 + rr() * 80; g.fillStyle = rr() < .5 ? '#3a3a3c' : '#5a5a5c'; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(x + k * 18, y + (k % 2) * 6, 22, 12, 0, 0, 7); g.fill(); } } L.sky = { c, f: .04 }; }
    { const w = VW + (this.W - VW) * .15; const [c, g] = mkC(w, 230); seedR(5);
      zpoly(g, [[0, 200], [0, 160], [120, 140], [260, 150], [400, 130], [560, 150], [700, 140], [w, 160], [w, 200]], '#3a3a3a');
      const cx = 360; zr(g, cx, 70, 26, 80, '#2a2a2a'); zpoly(g, [[cx - 4, 70], [cx + 13, 30], [cx + 30, 70]], '#2a2a2a'); zr(g, cx + 12, 18, 2, 14, '#2a2a2a'); zr(g, cx + 8, 22, 10, 2, '#2a2a2a'); zr(g, cx + 26, 110, 60, 40, '#2a2a2a'); zpoly(g, [[cx + 26, 110], [cx + 56, 90], [cx + 86, 110]], '#2a2a2a');   // the church on the hill
      g.fillStyle = '#e8e8c0'; g.fillRect(cx + 10, 90, 5, 9); g.fillRect(cx + 40, 120, 4, 8); g.fillRect(cx + 60, 120, 4, 8);
      for (let x = 30; x < w; x += 110) { g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 160); g.lineTo(x + 2, 120); g.stroke(); for (let k = 0; k < 4; k++) { g.lineWidth = 1; g.beginPath(); g.moveTo(x + 2, 130 + k * 6); g.lineTo(x + (k % 2 ? 16 : -14), 118 + k * 5); g.stroke(); } }   // bare trees
      L.far = { c, f: .15 }; }
    { const w = VW + (this.W - VW) * .5; const [c, g] = mkC(w, 230); seedR(23);
      for (let x = 0; x < w; x += 22 + rr() * 26) tombstone(g, x, 204, 10 + rr() * 8, 16 + rr() * 22, mix('#8a8a86', '#b8b8b2', rr()), (rr() * 3) | 0);
      // the circus plot: a striped tent-shaped tomb, an elephant on a pedestal, a sign
      const px = 520; zpoly(g, [[px, 204], [px + 90, 204], [px + 90, 160], [px + 45, 120], [px, 160]], '#c8c8c0', ZK); for (let k = 0; k < 4; k++) zpoly(g, [[px + k * 22.5, 160], [px + k * 22.5 + 11, 160], [px + 45, 120]], '#6a6a66');
      zr(g, px + 18, 100, 54, 12, '#2a2a2a'); g.fillStyle = '#e8e8e0'; g.font = 'bold 8px serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'CIRQUE' : 'CIRCUS', px + 45, 109); g.textAlign = 'left';
      zr(g, px + 110, 180, 40, 24, '#9a9a96'); zpoly(g, [[px + 112, 180], [px + 148, 180], [px + 146, 160], [px + 140, 152], [px + 118, 152], [px + 112, 160]], '#b8b8b2', ZK); zr(g, px + 140, 156, 14, 3, '#b8b8b2');
      for (let x = 0; x < w; x += 9) { zr(g, x, 186, 1.6, 18, '#2a2a2a'); zpoly(g, [[x - 1, 186], [x + .8, 182], [x + 2.6, 186]], '#2a2a2a'); } zr(g, 0, 190, w, 1.4, '#2a2a2a');   // the iron fence
      P(g, 0, 204, w, 26, '#4a4a46'); P(g, 0, 204, w, 1, ZK); L.mid = { c, f: .5 }; }
    this.L = L; this.bolt = 0; this.nextBolt = 4; this.crowsB = Array.from({ length: 6 }, (_, i) => ({ x: i * 200, y: 40 + i * 9, ph: i })); },
  update(dt, t) { this.bolt = Math.max(0, this.bolt - dt); this.nextBolt -= dt;
    if (this.nextBolt <= 0) { this.nextBolt = 6 + Math.random() * 6; this.bolt = .35; this.boltX = Math.random() * VW; WORLD.flash = Math.max(WORLD.flash, .18); try { const T0 = SND.now(); nz(T0 + .3, 2.2, .3, 400, 60, 'lowpass', .8); tone(T0 + .3, 60, 30, 1.6, .25, 'sine'); } catch (e) {} }
    for (const c of this.crowsB) c.x += (16 + c.ph * 2) * dt; },
  drawBack(g, camX, t) { const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0);
    if (this.bolt > 0) { g.fillStyle = `rgba(255,255,255,${this.bolt * 1.6})`; g.fillRect(0, 0, VW, 200); g.strokeStyle = '#ffffff'; g.lineWidth = 2; g.beginPath(); let x = this.boltX, y = 0; g.moveTo(x, y); while (y < 150) { x += (Math.random() - .5) * 30; y += 12 + Math.random() * 12; g.lineTo(x, y); } g.stroke(); }
    for (const c of this.crowsB) { const x = Math.round(((c.x - camX * .1) % (VW + 100) + VW + 100) % (VW + 100) - 50), fl = Math.sin(t * 9 + c.ph) * 3; g.strokeStyle = '#141414'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x - 6, c.y - fl); g.lineTo(x, c.y); g.lineTo(x + 6, c.y - fl); g.stroke(); }
    g.drawImage(L.far.c, Math.round(-camX * L.far.f), 0); g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(220,220,215,.14)'; g.fillRect(((i * 340 + t * 6 - camX * .3) % (VW + 400) + VW + 400) % (VW + 400) - 300, 186 + i * 7, 360, 8); }   // ground fog
    drawBGP(g, camX, .3, .6); },
  drawFront(g, camX, t) { for (let i = 0; i < 9; i++) { const x = Math.round(i * 300 - camX * 1.25 + 100); if (x < -60 || x > VW + 60) continue;
      g.strokeStyle = '#0e0e10'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, VH); g.lineTo(x + 6, VH - 70); g.stroke(); g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(x + 4, VH - 40 - k * 12); g.lineTo(x + (k % 2 ? 30 : -24), VH - 60 - k * 10); g.stroke(); } } }   // dead branches up close
};

// =====================================================================
// SCREEN 3 — LA NEF (the nave of the church)
// =====================================================================
function gothicWindow(g, x, y, w, h, seed) { seedR(seed); g.fillStyle = ZK; g.beginPath(); g.moveTo(x - 2, y + h + 2); g.lineTo(x - 2, y + w / 2); g.arc(x + w / 2, y + w / 2, w / 2 + 2, Math.PI, 0); g.lineTo(x + w + 2, y + h + 2); g.closePath(); g.fill();
  for (let r = 0; r < h / 8; r++) for (let c = 0; c < w / 6; c++) { const px = x + c * 6, py = y + r * 8; if (py < y + w / 2 && Math.hypot(px + 3 - x - w / 2, py + 4 - y - w / 2) > w / 2) continue; g.fillStyle = rr() < .18 ? GRN : ['#e8e8e0', '#b8b8b0', '#8a8a86', '#d0d0c8'][(rr() * 4) | 0]; g.fillRect(px + .5, py + .5, 5, 7); } }
const Z3 = {
  id: 'nef', name: { fr: 'La nef', en: 'The Nave' }, W: 2000, floor: 'nave', floorBuild: floorZombi,
  boxes: [], holes: [],
  items: [{ k: 'pew', x: 320, z: 14 }, { k: 'pew', x: 320, z: 96 }, { k: 'candle', x: 440, z: 50 }, { k: 'pew', x: 560, z: 14 }, { k: 'pew', x: 560, z: 96 }, { k: 'alms', x: 700, z: 20 }, { k: 'holy', x: 760, z: 60 }, { k: 'pew', x: 880, z: 14 }, { k: 'pew', x: 880, z: 96 },
          { k: 'candle', x: 1020, z: 40 }, { k: 'urn', x: 1100, z: 90 }, { k: 'pew', x: 1240, z: 14 }, { k: 'pew', x: 1240, z: 96 }, { k: 'candle', x: 1400, z: 56 }, { k: 'pew', x: 1560, z: 14 }, { k: 'pew', x: 1560, z: 96 }, { k: 'holy', x: 1700, z: 40 }, { k: 'alms', x: 1820, z: 90 }],
  zones: [{ cam: 0, delay: 1.2, waves: [[['skel', 'R'], ['frog', 'R'], ['blob', 'L']], [['knight', 'R'], ['boner', 'R'], ['frog', 'L'], ['skel', 'R']]] },
          { cam: 1360, waves: [[['skel', 'R'], ['boner', 'R'], ['blob', 'L'], ['frog', 'R']], [['knight', 'R'], ['skel', 'L'], ['leech', 'R'], ['boner', 'R']]] }],
  dropPoints() { return [camX + 160, camX + 340, camX + 500]; },
  build() { const L = {}; const w = VW + (this.W - VW) * .6; const [c, g] = mkC(w, 230); seedR(31);
    P(g, 0, 0, w, 230, '#6a6864'); for (let y = 0; y < 204; y += 12) for (let x = (y / 12 % 2) * 14; x < w; x += 28) { g.fillStyle = (x + y) % 56 ? '#74726e' : '#5e5c58'; g.fillRect(x, y, 27, 11); }   // stone courses
    for (let x = 40; x < w; x += 150) { gothicWindow(g, x + 30, 40, 36, 110, x); zr(g, x, 0, 18, 204, '#4a4844'); zr(g, x - 3, 190, 24, 14, '#3a3834'); zr(g, x - 3, 0, 24, 10, '#3a3834'); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x + 3, 10, 2, 180); }   // windows between columns
    for (let x = 100; x < w; x += 300) { g.strokeStyle = '#2a2a2a'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 26); g.stroke(); zpoly(g, [[x - 18, 26], [x + 18, 26], [x + 12, 34], [x - 12, 34]], '#3a3a3a'); for (let k = 0; k < 6; k++) { g.fillStyle = '#f4f0d0'; g.fillRect(x - 15 + k * 6, 20, 2, 6); } }   // chandeliers
    P(g, 0, 204, w, 26, '#3a3834'); P(g, 0, 204, w, 1, ZK); L.mid = { c, f: .6 }; this.L = L; },
  update(dt, t) {},
  drawBack(g, camX, t) { g.drawImage(this.L.mid.c, Math.round(-camX * this.L.mid.f), 0);
    for (let i = 0; i < 6; i++) { const x = Math.round(70 + i * 150 - camX * .6 + 18); if (x < -60 || x > VW + 60) continue; g.fillStyle = 'rgba(255,255,240,.07)'; g.beginPath(); g.moveTo(x, 150); g.lineTo(x + 36, 150); g.lineTo(x + 90, 230); g.lineTo(x + 20, 230); g.closePath(); g.fill(); }   // shafts of light
    drawBGP(g, camX, .3, .7); },
  drawFront(g, camX, t) { for (let i = 0; i < 8; i++) { const x = Math.round(i * 330 - camX * 1.2 + 160); if (x < -40 || x > VW + 40) continue; zr(g, x, 0, 22, VH, '#2a2826'); zr(g, x - 5, VH - 26, 32, 26, '#1a1816'); g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(x + 4, 0, 2, VH - 26); } }   // the great columns up close
};

// =====================================================================
// SCREEN 4 — LE CHŒUR (up the steps: the altar, the organ, Prêtre-o-Dame)
// =====================================================================
const Z4 = {
  id: 'choeur', name: { fr: 'Le chœur', en: 'The Choir' }, W: 1400, floor: 'choir', floorBuild: floorZombi, barX: 1180,
  boxes: [], holes: [],
  items: [{ k: 'candle', x: 300, z: 16 }, { k: 'candle', x: 300, z: 96 }, { k: 'alms', x: 420, z: 90 }, { k: 'pew', x: 540, z: 14 }, { k: 'holy', x: 640, z: 70 }, { k: 'candle', x: 760, z: 30 }, { k: 'urn', x: 860, z: 96 }, { k: 'holy', x: 980, z: 20 }, { k: 'candle', x: 1080, z: 92 }, { k: 'candle', x: 1280, z: 16 }],
  zones: [{ cam: 0, delay: 1, waves: [[['skel', 'drop'], ['boner', 'R'], ['frog', 'R']], [['knight', 'R'], ['skel', 'drop'], ['blob', 'L']]] },
          { cam: 760, boss: true, waves: [[['skel', 'R'], ['frog', 'L']], [['pretre', 'bar'], ['skel', 'R']]] }],
  dropPoints() { return [camX + 140, camX + 330, camX + 520]; },
  build() { const L = {}; const w = VW + (this.W - VW) * .7; const [c, g] = mkC(w, 230); seedR(61);
    P(g, 0, 0, w, 230, '#8a8884'); for (let y = 0; y < 204; y += 12) for (let x = (y / 12 % 2) * 14; x < w; x += 28) { g.fillStyle = (x + y) % 56 ? '#94928e' : '#7e7c78'; g.fillRect(x, y, 27, 11); }
    const ox = 120; for (let k = 0; k < 16; k++) { const h = 60 + Math.abs(8 - k) * 7; zr(g, ox + k * 9, 150 - h, 7, h, k % 2 ? '#c8c8c0' : '#a8a8a0'); g.fillStyle = ZK; g.fillRect(ox + k * 9 + 2, 150 - h + 6, 3, 2); } zr(g, ox - 6, 150, 156, 54, '#3a2a1e'); g.fillStyle = '#c8a040'; g.fillRect(ox - 6, 150, 156, 2);   // the organ
    const rx = w - 220; g.fillStyle = ZK; g.beginPath(); g.arc(rx, 70, 46, 0, 7); g.fill(); for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; g.fillStyle = k % 3 ? '#e8e8e0' : GRN; g.beginPath(); g.moveTo(rx, 70); g.arc(rx, 70, 42, a, a + Math.PI / 6 - .05); g.closePath(); g.fill(); } g.fillStyle = '#c8c8c0'; g.beginPath(); g.arc(rx, 70, 12, 0, 7); g.fill();   // the rose window
    zr(g, rx - 70, 140, 140, 64, '#e8e6e0'); zr(g, rx - 76, 136, 152, 8, '#c8c6c0'); g.fillStyle = '#c8a040'; g.fillRect(rx - 3, 112, 6, 26); g.fillRect(rx - 12, 118, 24, 5); for (const dx of [-50, 50]) { zr(g, rx + dx - 2, 120, 4, 18, '#c8a040'); g.fillStyle = '#fff6c0'; g.fillRect(rx + dx - 1, 114, 2, 5); }   // the altar
    for (const x of [60, w - 380, w - 60]) { zr(g, x, 0, 20, 204, '#5a5854'); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x + 3, 0, 2, 204); }
    P(g, 0, 204, w, 26, '#5a5854'); P(g, 0, 204, w, 1, ZK); L.mid = { c, f: .7 }; this.L = L; },
  update(dt, t) {},
  drawBack(g, camX, t) { g.drawImage(this.L.mid.c, Math.round(-camX * this.L.mid.f), 0); drawBGP(g, camX, .3, .8); },
  drawFront(g, camX, t) { for (let i = 0; i < 6; i++) { const x = Math.round(i * 330 - camX * 1.2 + 200); if (x < -40 || x > VW + 40) continue; limb(g, [[x, VH], [x, VH - 60]], 3, '#c8a040'); g.fillStyle = '#f4f0e8'; g.fillRect(x - 3, VH - 76, 6, 16); g.fillStyle = `rgba(255,240,170,${.8 + Math.sin(t * 13 + i) * .2})`; g.beginPath(); g.ellipse(x, VH - 81, 2.4, 4.4, 0, 0, 7); g.fill(); } }   // tall candles in front
};
Z2.zones[0].waves[1].set = 'storm'; Z2.zones[1].waves[0].set = 'mausolee'; Z2.zones[2].waves[0].set = 'crows'; Z3.zones[1].waves[0].set = 'bells';
LEVELS.push({ id: 'zombimare', screens: [Z1, Z2, Z3, Z4], style: 3, name: { fr: 'MONDE 4 · ZOMBIMARE', en: 'WORLD 4 · ZOMBIMARE' } });
