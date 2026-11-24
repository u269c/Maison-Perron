// =====================================================================
// BOULDAIRE — level 3, the planet of fashion, in ligne claire (one even line, flat colours). Four screens:
// the Boulevard des Ciseaux with the great statue of Calve-Hair, the Galerie Lumière (a shopping arcade under a glass
// roof, its giant disco ball), the Quartier de la Mode at dusk (neon, catwalks, paparazzi), and the Salon Calve-Hair.
// =====================================================================
const LCI = '#1a1e2e';   // the one ink of the ligne claire
function lr(g, x, y, w, h, col, ink = LCI) { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); g.strokeStyle = ink; g.lineWidth = 1; g.strokeRect(Math.round(x) + .5, Math.round(y) + .5, Math.round(w) - 1, Math.round(h) - 1); }
function lpoly(g, pts, col, ink = LCI) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = ink; g.lineWidth = 1; g.stroke(); }
function lcloud(g, x, y, w) { g.fillStyle = '#ffffff'; g.strokeStyle = LCI; g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 5; k++) { const cx = x + k * w / 5, r = 7 + (k % 2) * 5; g.moveTo(cx + r, y); g.arc(cx, y, r, 0, 7); } g.fill(); g.stroke(); g.fillRect(x - 2, y, w * .85, 6); }
function floorBould(scr) {
  const [c, g] = mkC(scr.W, VH - FLOOR); const H = VH - FLOOR; seedR(scr.W + 11);
  if (scr.floor === 'boulevard' || scr.floor === 'dusk') { const dusk = scr.floor === 'dusk';
    P(g, 0, 0, scr.W, H, dusk ? '#8a7a98' : '#e8dcc8');
    for (let z = 0; z < DEPTH + 8; z += 14) for (let x = (z / 14 % 2) * 18; x < scr.W; x += 36) { g.fillStyle = dusk ? ((x + z) % 72 ? '#7a6a8a' : '#948aa4') : ((x + z) % 72 ? '#e0d2bc' : '#f0e6d4'); g.fillRect(x, z, 35, 13); g.fillStyle = 'rgba(26,30,46,.35)'; g.fillRect(x, z + 13, 36, 1); g.fillRect(x + 35, z, 1, 14); }
    for (let x = 60; x < scr.W; x += 220) { g.fillStyle = dusk ? '#5a4a6a' : '#c8b898'; g.beginPath(); g.ellipse(x, DEPTH * .25, 9, 4, 0, 0, 7); g.fill(); g.strokeStyle = LCI; g.stroke(); }   // tree grates
    P(g, 0, DEPTH + 8, scr.W, H, dusk ? '#3a2a4a' : '#a89878'); P(g, 0, DEPTH + 8, scr.W, 1, LCI);
  } else if (scr.floor === 'marble') {
    P(g, 0, 0, scr.W, H, '#f4ece0');
    for (let z = 0; z < DEPTH + 8; z += 16) for (let x = (z / 16 % 2) * 16; x < scr.W; x += 32) { g.fillStyle = '#e8c8c8'; g.fillRect(x, z, 16, 16); }
    g.strokeStyle = 'rgba(26,30,46,.25)'; g.lineWidth = 1; for (let x = 0; x < scr.W; x += 16) { g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, DEPTH + 8); g.stroke(); } for (let z = 0; z < DEPTH + 8; z += 16) { g.beginPath(); g.moveTo(0, z + .5); g.lineTo(scr.W, z + .5); g.stroke(); }
    for (let i = 0; i < scr.W / 40; i++) { g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(rr() * scr.W, rr() * DEPTH, 10 + rr() * 16, 1); }   // the shine
    P(g, 0, DEPTH + 8, scr.W, H, '#c8a8a8'); P(g, 0, DEPTH + 8, scr.W, 1, LCI);
  } else {   // the salon's black-and-white checkerboard
    P(g, 0, 0, scr.W, H, '#f4f0e8');
    for (let z = 0; z < DEPTH + 8; z += 14) for (let x = (z / 14 % 2) * 14; x < scr.W; x += 28) { g.fillStyle = '#1a1a22'; g.fillRect(x, z, 14, 14); }
    for (let i = 0; i < scr.W / 30; i++) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(rr() * scr.W, rr() * DEPTH, 12, 1); }
    for (let i = 0; i < scr.W / 90; i++) { g.strokeStyle = '#5a2a18'; g.lineWidth = .6; const x = rr() * scr.W, z = rr() * DEPTH; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(x + k * 2, z); g.quadraticCurveTo(x + k * 2 + 4, z - 2, x + k * 2 + 8, z + 1); g.stroke(); } }   // snipped locks of hair
    P(g, 0, DEPTH + 8, scr.W, H, '#2a1a22'); P(g, 0, DEPTH + 8, scr.W, 1, LCI);
  }
  scr.floorC = c; }
// a Haussmann facade: cream stone, wrought-iron balconies, a boutique at street level with its awning and sign
function facade(g, x, base, w, h, stone, shop, awn, sign, seed) { seedR(seed);
  lr(g, x, base - h, w, h, stone); const fl = Math.floor((h - 40) / 22);
  for (let f = 0; f < fl; f++) { const y = base - 40 - (f + 1) * 22; for (let k = 0; k < Math.max(2, Math.floor(w / 18)); k++) { const wx = x + 5 + k * ((w - 10) / Math.max(2, Math.floor(w / 18))); lr(g, wx, y + 4, 8, 13, rr() < .25 ? '#ffe8a0' : '#9ac0d8'); if (f % 2 === 0) { g.strokeStyle = LCI; g.beginPath(); g.moveTo(wx - 2, y + 17.5); g.lineTo(wx + 10, y + 17.5); g.stroke(); } } }
  lpoly(g, [[x - 2, base - h], [x + w + 2, base - h], [x + w - 4, base - h - 10], [x + 4, base - h - 10]], '#7a8aa8');   // the slate roof
  lr(g, x + 3, base - 36, w - 6, 34, shop); lr(g, x + 8, base - 30, w - 26, 26, '#cfe4f0'); lr(g, x + w - 16, base - 28, 10, 26, shadeC(shop, -.2));
  for (let k = 0; k < Math.floor((w - 4) / 8); k++) lpoly(g, [[x + 2 + k * 8, base - 40], [x + 10 + k * 8, base - 40], [x + 10 + k * 8, base - 34], [x + 6 + k * 8, base - 32], [x + 2 + k * 8, base - 34]], k % 2 ? awn : '#ffffff');
  lr(g, x + 6, base - 48, w - 12, 8, '#1a1e2e'); g.fillStyle = '#ffe88a'; g.font = 'bold 6px sans-serif'; g.textAlign = 'center'; g.fillText(sign, x + w / 2, base - 41.5); g.textAlign = 'left'; }
const BOUL_SKY = ['#5ab0f0', '#7ac4f4', '#9ad4f8', '#c0e4fa'];

// =====================================================================
// SCREEN 1 — LE BOULEVARD DES CISEAUX, 3.5 screens wide. The great statue of Calve-Hair stands on its plaza.
// =====================================================================
const B1 = {
  id: 'boulevard', name: { fr: 'Le boulevard des Ciseaux', en: 'Scissors Boulevard' }, W: 2240, floor: 'boulevard', floorBuild: floorBould,
  boxes: [], holes: [],
  items: [{ k: 'planter', x: 260, z: 12 }, { k: 'trolley', x: 380, z: 70 }, { k: 'newsbox', x: 520, z: 14 }, { k: 'planter', x: 700, z: 90 }, { k: 'mannequin', x: 860, z: 20 }, { k: 'mannequin', x: 884, z: 24 }, { k: 'rack', x: 1040, z: 80 },
          { k: 'bin', x: 1240, z: 12 }, { k: 'planter', x: 1420, z: 90 }, { k: 'car', x: 1600, z: 30 }, { k: 'perfume', x: 1800, z: 84 }, { k: 'trolley', x: 1900, z: 60 }, { k: 'planter', x: 2080, z: 14 }],
  zones: [{ cam: 0, delay: 1.2, waves: [[['stylist', 'R'], ['stylist', 'R'], ['hare', 'L']], [['badger', 'R'], ['stylist', 'R'], ['hare', 'R'], ['blower', 'L']]] },
          { cam: 1600, waves: [[['stylist', 'R'], ['hare', 'R'], ['blower', 'L'], ['stylist', 'L']], [['badger', 'R'], ['sprayer', 'R'], ['hare', 'L']]] }],
  build() { const L = {};
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 230); dithVfast(g, 0, 0, w, 230, BOUL_SKY); g.fillStyle = '#fff6c8'; g.beginPath(); g.arc(560, 46, 22, 0, 7); g.fill(); g.strokeStyle = LCI; g.stroke(); L.sky = { c, f: .04 }; }
    { const w = VW + (this.W - VW) * .15; const [c, g] = mkC(w, 230); seedR(31);   // the far city: domes, a fashion tower, a tower shaped like a comb
      for (let x = 0; x < w; x += 30 + rr() * 30) { const h = 40 + rr() * 60; lr(g, x, 190 - h, 24 + rr() * 16, h, mix('#c8d4e8', '#e8eef8', rr()), '#5a6a8a'); }
      lpoly(g, [[300, 190], [300, 60], [312, 40], [324, 60], [324, 190]], '#e8b8d8', '#5a6a8a'); for (let k = 0; k < 9; k++) lr(g, 302 + (k % 3) * 7, 70 + k * 12, 5, 6, '#ffe8a0', '#5a6a8a');
      lpoly(g, [[620, 190], [620, 90], [700, 90], [700, 190]], '#d8e0f0', '#5a6a8a'); for (let k = 0; k < 10; k++) lr(g, 622 + k * 8, 70, 4, 22, '#d8e0f0', '#5a6a8a');   // the comb tower
      g.fillStyle = '#e8dcc8'; g.beginPath(); g.arc(470, 150, 30, Math.PI, 0); g.fill(); g.strokeStyle = '#5a6a8a'; g.stroke(); L.far = { c, f: .15 }; }
    { const w = VW + (this.W - VW) * .5; const [c, g] = mkC(w, 230);
      const shops = [['MODE', '#e86aa0'], ['PARFUMS', '#a87ad8'], ['GELATO', '#6ad8c0'], ['BIJOUX', '#ffd23f'], ['COIFFURE', '#e8402a'], ['CHAUSSURES', '#4a8ad8'], ['CAFÉ', '#e8a04a'], ['BOUTIQUE', '#e86aa0']];
      let x = 0, i = 0; while (x < w) { const ww = 70 + ((i * 37) % 40), h = 120 + ((i * 53) % 50); facade(g, x, 204, ww, h, ['#f4ead8', '#efe2cc', '#f8f0e0', '#ecdcc4'][i % 4], ['#2a3a5a', '#5a2a3a', '#2a5a4a', '#3a2a5a'][i % 4], shops[i % shops.length][1], shops[i % shops.length][0], 70 + i); x += ww + 3; i++; }
      P(g, 0, 204, w, 26, '#cfc2aa'); P(g, 0, 204, w, 1, LCI); L.mid = { c, f: .5 }; }
    this.L = L; this.walkers = Array.from({ length: 9 }, (_, i) => ({ x: i * 240, v: (i % 2 ? -1 : 1) * (14 + (i % 3) * 6), col: ['#e86aa0', '#1a1a22', '#ffd23f', '#6ad8c0', '#a87ad8', '#f4f0e8'][i % 6], hat: i % 3 })); this.pigeons = Array.from({ length: 6 }, (_, i) => ({ x: 200 + i * 320, ph: i }));
    this.scoot = { x: -100 }; },
  update(dt, t) { const W = VW + (this.W - VW) * .5; for (const p of this.walkers) { p.x += p.v * dt; if (p.x > W + 40) p.x = -40; if (p.x < -40) p.x = W + 40; } this.scoot.x += 110 * dt; if (this.scoot.x > W + 300) this.scoot.x = -200; },
  drawBack(g, camX, t) { const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0);
    for (let i = 0; i < 4; i++) { const x = ((i * 260 + t * 5 - camX * .06) % (VW + 300) + VW + 300) % (VW + 300) - 150; lcloud(g, x, 34 + (i % 2) * 22, 70); }
    g.drawImage(L.far.c, Math.round(-camX * L.far.f), 0); g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    for (const p of this.walkers) { const x = Math.round(p.x - camX * .5), sw = Math.sin(t * 6 + p.x) * 1.2; if (x < -20 || x > VW + 20) continue; lr(g, x, 190, 5, 12, p.col); lr(g, x, 184, 5, 6, '#e8c0a0'); if (p.hat === 1) lr(g, x - 2, 182, 9, 2, '#1a1a22'); g.fillStyle = LCI; g.fillRect(x + 1 + sw, 202, 1, 2); g.fillRect(x + 3 - sw, 202, 1, 2); if (p.hat === 2) lr(g, x + (p.v > 0 ? 5 : -4), 194, 4, 5, '#e86aa0'); }
    { const x = Math.round(this.scoot.x - camX * .5); if (x > -40 && x < VW + 40) { g.fillStyle = LCI; g.beginPath(); g.arc(x + 3, 210, 2.5, 0, 7); g.arc(x + 17, 210, 2.5, 0, 7); g.fill(); lpoly(g, [[x, 207], [x + 20, 207], [x + 16, 200], [x + 4, 202]], '#7ad8c0'); lr(g, x + 8, 192, 5, 9, '#ffd23f'); lr(g, x + 8, 187, 5, 5, '#e8c0a0'); } }
    for (const p of this.pigeons) { const x = Math.round(p.x - camX * .9), y = 206 + Math.abs(Math.sin(t * 3 + p.ph)) * -1; if (x < -10 || x > VW + 10) continue; lr(g, x, y, 5, 3, '#9a9aaa'); lr(g, x + 4, y - 2, 2, 2, '#9a9aaa'); }
    drawBGP(g, camX, .3, .6); },
  drawFront(g, camX, t) { for (let i = 0; i < 9; i++) { const x = Math.round(i * 300 - camX * 1.25 + 140); if (x < -40 || x > VW + 40) continue; lr(g, x, VH - 40, 4, 40, '#2a3a2a'); lr(g, x - 9, VH - 14, 22, 14, '#5a6a8a'); } }
};

// =====================================================================
// SCREEN 2 — LA GALERIE LUMIÈRE, 4 screens wide: a shopping arcade under an iron-and-glass roof, two floors of shops,
// escalators, a fountain, and in the atrium a giant disco ball.
// =====================================================================
const B2 = {
  id: 'galerie', name: { fr: 'La galerie Lumière', en: 'The Lumière Arcade' }, W: 2560, floor: 'marble', floorBuild: floorBould,
  boxes: [], holes: [],
  items: [{ k: 'mannequin', x: 300, z: 14 }, { k: 'rack', x: 420, z: 80 }, { k: 'perfume', x: 600, z: 20 }, { k: 'trolley', x: 760, z: 70 }, { k: 'planter', x: 940, z: 12 }, { k: 'mirror', x: 1080, z: 86 }, { k: 'perfume', x: 1160, z: 90 },
          { k: 'planter', x: 1500, z: 12 }, { k: 'rack', x: 1720, z: 30 }, { k: 'mannequin', x: 1860, z: 88 }, { k: 'mannequin', x: 1884, z: 92 }, { k: 'trolley', x: 2040, z: 50 }, { k: 'perfume', x: 2240, z: 20 }, { k: 'planter', x: 2420, z: 86 }],
  zones: [{ cam: 380, waves: [[['stylist', 'R'], ['sprayer', 'R'], ['stylist', 'L']], [['hare', 'R'], ['hare', 'L'], ['blower', 'R']]] },
          { cam: 1200, waves: [[['hare', 'R'], ['stylist', 'drop'], ['stylist', 'drop'], ['badger', 'R']], [['sprayer', 'R'], ['blower', 'L'], ['stylist', 'R']]] },
          { cam: 1920, waves: [[['badger', 'R'], ['stylist', 'L'], ['hare', 'R']], [['badger', 'L'], ['sprayer', 'R'], ['hare', 'R'], ['stylist', 'L']]] }],
  dropPoints() { return [camX + 140, camX + 320, camX + 500]; },
  build() { const L = {}; const w = VW + (this.W - VW) * .7; const [c, g] = mkC(w, 230); seedR(91);
    P(g, 0, 0, w, 230, '#f8eee4');
    for (let x = 0; x < w; x += 80) { lpoly(g, [[x, 40], [x + 40, 4], [x + 80, 40]], '#cfe8f4'); g.strokeStyle = LCI; g.beginPath(); g.moveTo(x + 40, 4); g.lineTo(x + 40, 40); g.moveTo(x + 20, 22); g.lineTo(x + 60, 22); g.stroke(); }   // the glass roof
    P(g, 0, 40, w, 4, '#5a6a8a');
    const signs = ['CHIC', 'L’ÉLÉGANT', 'PARFUMERIE', 'LA SOIE', 'GLAMOUR', 'BIJOUTERIE', 'VOGUE', 'SOLDES'], cols = ['#e86aa0', '#a87ad8', '#6ad8c0', '#ffd23f', '#e8402a', '#4a8ad8'];
    for (let fl = 0; fl < 2; fl++) { const top = fl ? 116 : 50, h = 60; for (let x = 0, i = fl * 3; x < w; x += 92, i++) { lr(g, x + 2, top, 88, h, '#f4ead8'); lr(g, x + 8, top + 18, 76, h - 22, '#d8ecf4'); for (let k = 0; k < 4; k++) lr(g, x + 14 + k * 18, top + 34, 10, h - 40, cols[(i + k) % cols.length]);   // dresses in the window
        lr(g, x + 10, top + 4, 72, 11, LCI); g.fillStyle = cols[i % cols.length]; g.font = 'bold 7px sans-serif'; g.textAlign = 'center'; g.fillText(signs[i % signs.length], x + 46, top + 12.5); g.textAlign = 'left'; }
      P(g, 0, top + h, w, 5, '#c8a8a8'); for (let x = 0; x < w; x += 8) P(g, x, top + h - 12, 1, 12, '#5a6a8a'); P(g, 0, top + h - 13, w, 2, '#c8963a'); }
    for (let k = 0; k < 4; k++) { const ex = 260 + k * (w / 4); lpoly(g, [[ex, 176], [ex + 70, 112], [ex + 84, 112], [ex + 14, 176]], '#c8ccd2'); for (let s = 0; s < 8; s++) { g.strokeStyle = LCI; g.beginPath(); g.moveTo(ex + 4 + s * 9, 172 - s * 8); g.lineTo(ex + 14 + s * 9, 172 - s * 8); g.stroke(); } }   // escalators
    P(g, 0, 182, w, 48, '#ecd8d0'); P(g, 0, 182, w, 1, LCI);
    for (let k = 0; k < 6; k++) { const bx = 120 + k * (w / 6); lr(g, bx, 46, 3, 30, '#c8963a'); lpoly(g, [[bx - 10, 76], [bx + 13, 76], [bx + 13, 100], [bx + 1, 94], [bx - 10, 100]], k % 2 ? '#e86aa0' : '#6ad8c0'); }   // banners
    L.mid = { c, f: .7 }; this.L = L; this.atrium = 1300 * .7; this.spots = Array.from({ length: 5 }, (_, i) => i); this.shoppers = Array.from({ length: 12 }, (_, i) => ({ x: i * 160, fl: i % 2, v: (i % 3 - 1) * 12 + 6 }));
    this.foun = 640; },
  update(dt, t) { for (const s of this.shoppers) { s.x += s.v * dt; const W = VW + (this.W - VW) * .7; if (s.x > W) s.x = 0; if (s.x < 0) s.x = W; } },
  drawBack(g, camX, t) { const L = this.L; g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    for (const s of this.shoppers) { const x = Math.round(s.x - camX * .7), y = s.fl ? 160 : 94; if (x < -10 || x > VW + 10) continue; lr(g, x, y + 4, 4, 10, ['#e86aa0', '#1a1a22', '#ffd23f', '#6ad8c0'][Math.abs(Math.round(s.x)) % 4]); lr(g, x, y, 4, 4, '#e8c0a0'); }
    { const fx0 = Math.round(this.foun - camX * .7); if (fx0 > -60 && fx0 < VW + 60) { lpoly(g, [[fx0 - 40, 214], [fx0 + 40, 214], [fx0 + 32, 200], [fx0 - 32, 200]], '#e8e0d8'); for (let k = 0; k < 14; k++) { const u = ((t * 1.2 + k / 14) % 1), a = -Math.PI / 2 + (k - 6.5) * .12; g.fillStyle = 'rgba(120,200,240,.8)'; g.fillRect(fx0 + Math.cos(a) * u * 50, 198 + Math.sin(a) * u * 60 + u * u * 70, 2, 2); } } }
    if (!(SETP.props.ball && SETP.props.ball.gone)) { const bx = Math.round(this.atrium - camX * .7); if (bx > -80 && bx < VW + 80 && !(SETP.cur && SETP.cur.k === 'discoball')) drawDiscoBall(g, bx, 40, 70, 28, t); }   // hung from the roof, slowly turning
  },
  drawFront(g, camX, t) { for (let i = 0; i < 8; i++) { const x = Math.round(i * 340 - camX * 1.2 + 100); if (x < -40 || x > VW + 40) continue; lr(g, x, 0, 12, VH, '#c8ccd2'); lr(g, x - 3, VH - 20, 18, 20, '#5a6a8a'); } }
};
function drawDiscoBall(g, x, ytop, chain, r, t) { g.strokeStyle = LCI; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, ytop); g.lineTo(x, ytop + chain); g.stroke();
  const cy = ytop + chain + r; g.fillStyle = '#b8c0cc'; g.beginPath(); g.arc(x, cy, r, 0, 7); g.fill(); g.save(); g.beginPath(); g.arc(x, cy, r, 0, 7); g.clip();
  for (let j = -r; j < r; j += 5) for (let i = -r; i < r; i += 5) { const sh = Math.sin(t * 4 + i * .3 + j * .5 + Math.floor((i + t * 20) / 5)); g.fillStyle = sh > .7 ? '#ffffff' : sh > .2 ? '#d8e0ea' : sh > -.4 ? '#9aa4b4' : '#6a7484'; g.fillRect(x + i, cy + j, 4, 4); }
  g.restore(); g.strokeStyle = LCI; g.beginPath(); g.arc(x, cy, r, 0, 7); g.stroke();
  for (let k = 0; k < 7; k++) { const a = t * 1.4 + k * .9; g.fillStyle = `rgba(255,${200 + (k % 3) * 20},${240 - (k % 2) * 60},.5)`; g.fillRect(x + Math.cos(a) * (r + 30 + k * 18), cy + Math.sin(a * 1.3) * 60 + 40, 3, 3); } }

// =====================================================================
// SCREEN 3 — LE QUARTIER DE LA MODE, 4 screens wide, at dusk: boutiques in neon, billboards of Calve-Hair, a catwalk
// where a fashion show goes on regardless, searchlights, paparazzi flashes.
// =====================================================================
const B3 = {
  id: 'mode', name: { fr: 'Le quartier de la Mode', en: 'The Fashion Quarter' }, W: 2560, floor: 'dusk', floorBuild: floorBould,
  boxes: [], holes: [],
  items: [{ k: 'rack', x: 360, z: 20 }, { k: 'mannequin', x: 520, z: 84 }, { k: 'perfume', x: 600, z: 90 }, { k: 'car', x: 800, z: 30 }, { k: 'planter', x: 1040, z: 90 }, { k: 'mirror', x: 1200, z: 16 }, { k: 'trolley', x: 1380, z: 70 },
          { k: 'rack', x: 1600, z: 84 }, { k: 'mannequin', x: 1760, z: 16 }, { k: 'mannequin', x: 1784, z: 20 }, { k: 'car', x: 2000, z: 70 }, { k: 'perfume', x: 2200, z: 20 }, { k: 'planter', x: 2400, z: 88 }],
  zones: [{ cam: 420, waves: [[['hare', 'R'], ['hare', 'R'], ['stylist', 'L']], [['blower', 'R'], ['blower', 'L'], ['badger', 'R']]] },
          { cam: 1240, waves: [[['stylist', 'R'], ['sprayer', 'R'], ['hare', 'L'], ['stylist', 'L']]] },
          { cam: 1920, waves: [[['badger', 'R'], ['badger', 'L'], ['hare', 'R']], [['sprayer', 'R'], ['blower', 'L'], ['hare', 'R'], ['stylist', 'R']]] }],
  build() { const L = {};
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 230); dithVfast(g, 0, 0, w, 230, ['#2a2a5a', '#5a3a7a', '#a84a8a', '#f07a7a', '#ffb07a']); paintStars(g, w, 80, 40, 9); L.sky = { c, f: .04 }; }
    { const w = VW + (this.W - VW) * .5; const [c, g] = mkC(w, 230); seedR(77);
      const names = ['MAISON ROSE', 'VELOURS', 'L’ATELIER', 'COUTURE', 'DIVA', 'SATIN', 'CALVE-HAIR', 'PAILLETTES'], neon = ['#ff4f8a', '#4fd8ff', '#ffd23f', '#a87aff', '#7dffc0'];
      let x = 0, i = 0; while (x < w) { const ww = 80 + ((i * 41) % 40), h = 110 + ((i * 29) % 60); lr(g, x, 204 - h, ww, h, ['#3a2a5a', '#4a2a4a', '#2a3a5a', '#3a3a4a'][i % 4]); for (let f = 0; f < (h - 50) / 20; f++) for (let k = 0; k < 3; k++) lr(g, x + 8 + k * (ww - 16) / 3, 204 - h + 10 + f * 20, 10, 12, rr() < .5 ? '#ffd88a' : '#4a4a6a');
        lr(g, x + 6, 160, ww - 12, 40, '#ffe8c0'); lr(g, x + 4, 146, ww - 8, 12, LCI); g.fillStyle = neon[i % neon.length]; g.font = 'bold 8px sans-serif'; g.textAlign = 'center'; g.fillText(names[i % names.length], x + ww / 2, 155); g.textAlign = 'left'; x += ww + 4; i++; }
      for (let k = 0; k < 3; k++) { const bx = 300 + k * (w / 3); lr(g, bx, 40, 110, 64, '#f4ead8'); lr(g, bx + 4, 44, 102, 56, '#ff8ab8'); g.fillStyle = '#3a1a10'; g.beginPath(); g.ellipse(bx + 40, 70, 16, 22, 0, 0, 7); g.fill(); g.fillStyle = '#d8a070'; g.beginPath(); g.ellipse(bx + 44, 70, 9, 13, 0, 0, 7); g.fill(); g.fillStyle = '#1a1e2e'; g.font = 'bold 9px Georgia'; g.fillText('CALVE-HAIR', bx + 58, 66); g.font = 'italic 7px Georgia'; g.fillText(LANG === 'fr' ? 'le style, c’est moi' : 'style is me', bx + 60, 78); lr(g, bx + 50, 104, 4, 50, '#5a5a6a'); }   // billboards
      P(g, 0, 204, w, 26, '#5a4a6a'); P(g, 0, 204, w, 1, LCI); L.mid = { c, f: .5 }; }
    this.L = L; this.cat = { x: 1240 * .5 }; this.flashes = []; this.models = [0, 1, 2]; },
  update(dt, t) { if (Math.random() < dt * 4) this.flashes.push({ x: Math.random() * (VW + (this.W - VW) * .5), y: 180 + Math.random() * 20, t: .12 }); for (const f of this.flashes) f.t -= dt; this.flashes = this.flashes.filter(f => f.t > 0); },
  drawBack(g, camX, t) { const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0);
    for (let k = 0; k < 3; k++) { const a = Math.sin(t * .6 + k * 2) * .5, x0 = Math.round(200 + k * 260 - camX * .1); g.fillStyle = 'rgba(255,250,220,.12)'; g.beginPath(); g.moveTo(x0, 200); g.lineTo(x0 + Math.sin(a) * 300 - 20, -10); g.lineTo(x0 + Math.sin(a) * 300 + 20, -10); g.fill(); }   // searchlights
    g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    { const cx = Math.round(this.cat.x - camX * .5); if (cx > -200 && cx < VW + 200) { lr(g, cx - 90, 186, 180, 10, '#f4ead8'); lr(g, cx - 92, 196, 184, 8, '#1a1e2e'); for (let k = 0; k < 3; k++) { const u = ((t * .12 + k / 3) % 1), mx = cx - 80 + u * 160, sw = Math.sin(t * 6 + k) * 1.5; lr(g, mx, 166, 5, 16, ['#e86aa0', '#ffd23f', '#f4f0e8'][k]); lr(g, mx, 160, 5, 6, '#e8c0a0'); lr(g, mx - 1, 156 - k * 2, 7, 5 + k * 2, ['#3a1a10', '#ffd23f', '#1a1a22'][k]); g.fillStyle = LCI; g.fillRect(mx + 1 + sw, 182, 1, 4); g.fillRect(mx + 3 - sw, 182, 1, 4); } } }
    for (const f of this.flashes) { const x = Math.round(f.x - camX * .5); g.fillStyle = `rgba(255,255,255,${f.t / .12})`; g.beginPath(); g.arc(x, f.y, 5, 0, 7); g.fill(); g.fillRect(x - 10, f.y, 20, 1); g.fillRect(x, f.y - 10, 1, 20); }
  },
  drawFront(g, camX, t) { for (let i = 0; i < 10; i++) { const x = Math.round(i * 290 - camX * 1.25 + 60); if (x < -30 || x > VW + 30) continue; lr(g, x, VH - 84, 4, 84, '#1a1a2a'); lr(g, x - 8, VH - 92, 20, 10, '#2a2a3a'); g.fillStyle = `rgba(255,${180 + (i % 3) * 25},${200},${.7 + Math.sin(t * 5 + i) * .15})`; g.fillRect(x - 5, VH - 90, 14, 6); } }
};

// =====================================================================
// SCREEN 4 — LE SALON CALVE-HAIR, 2.5 screens wide: pink walls, a wall of mirrors ringed with bulbs, barber chairs,
// hood dryers, shampoo basins, a mezzanine for his apprentices, his portrait, and the velvet curtain he steps out of.
// =====================================================================
const B4 = {
  id: 'salon', name: { fr: 'Le salon Calve-Hair', en: 'Salon Calve-Hair' }, W: 1600, floor: 'checker', floorBuild: floorBould,
  boxes: [], holes: [], barX: 1400,
  items: [{ k: 'barber', x: 260, z: 14 }, { k: 'dryer', x: 360, z: 10 }, { k: 'barber', x: 470, z: 14 }, { k: 'mirror', x: 560, z: 90 }, { k: 'perfume', x: 640, z: 92 }, { k: 'dryer', x: 760, z: 10 }, { k: 'barber', x: 880, z: 14 },
          { k: 'planter', x: 980, z: 90 }, { k: 'dryer', x: 1080, z: 10 }, { k: 'mannequin', x: 1200, z: 86 }, { k: 'perfume', x: 1280, z: 18 }, { k: 'barber', x: 1320, z: 90 }],
  zones: [{ cam: 0, delay: 1, waves: [[['stylist', 'drop'], ['stylist', 'drop'], ['hare', 'R']], [['stylist', 'drop'], ['badger', 'R'], ['stylist', 'drop'], ['sprayer', 'L']]] },
          { cam: 960, boss: true, waves: [[['stylist', 'drop'], ['hare', 'drop']], [['calve', 'bar'], ['stylist', 'drop'], ['hare', 'R']]] }],
  dropPoints() { return [camX + 140, camX + 330, camX + 520]; },
  build() { const L = {}; const w = VW + (this.W - VW) * .7; const [c, g] = mkC(w, 230); seedR(99);
    P(g, 0, 0, w, 230, '#f4c8d8'); for (let x = 0; x < w; x += 24) P(g, x, 0, 2, 230, '#ecb8cc');
    P(g, 0, 0, w, 10, '#c8963a'); P(g, 0, 10, w, 1, LCI);
    lr(g, 0, 40, w, 8, '#f4ead8'); for (let x = 0; x < w; x += 10) lr(g, x + 3, 22, 2, 18, '#c8963a'); lr(g, 0, 20, w, 3, '#c8963a');   // the mezzanine railing
    for (let x = 30; x < w - 200; x += 90) { lr(g, x, 68, 60, 76, '#c8963a'); lr(g, x + 4, 72, 52, 68, '#d8ecf4'); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.moveTo(x + 8, 76); g.lineTo(x + 18, 76); g.lineTo(x + 8, 96); g.fill();
      for (let k = 0; k < 7; k++) { g.fillStyle = '#fff6c8'; g.strokeStyle = LCI; g.beginPath(); g.arc(x + 4 + k * 8.5, 66, 2.2, 0, 7); g.fill(); g.stroke(); } lr(g, x - 4, 144, 68, 6, '#f4ead8'); }   // mirrors with bulbs, the shelf
    const px = w - 330; lr(g, px, 54, 100, 120, '#c8963a'); lr(g, px + 6, 60, 88, 108, '#3a2a4a'); g.fillStyle = '#3a1a10'; g.beginPath(); g.ellipse(px + 50, 110, 26, 46, 0, 0, 7); g.fill(); g.fillStyle = '#d8a070'; g.beginPath(); g.ellipse(px + 54, 100, 14, 20, 0, 0, 7); g.fill(); g.fillStyle = '#c8205a'; g.fillRect(px + 34, 128, 40, 40);   // his portrait
    const cx = w - 190; lr(g, cx, 30, 170, 170, '#8a1a3a'); for (let k = 0; k < 9; k++) P(g, cx + 6 + k * 19, 30, 2, 170, '#6a1028'); lr(g, cx - 6, 24, 182, 10, '#c8963a'); g.fillStyle = '#ffd23f'; g.font = 'bold 10px Georgia'; g.textAlign = 'center'; g.fillText('CALVE-HAIR', cx + 85, 52); g.textAlign = 'left';   // the velvet curtain
    P(g, 0, 196, w, 34, '#e8b8c8'); P(g, 0, 196, w, 1, LCI);
    L.mid = { c, f: .7 }; this.L = L; this.watchers = Array.from({ length: 9 }, (_, i) => ({ x: 40 + i * (w / 9), ph: i * 1.7 })); this.curtain = w - 190 + 85; },
  update(dt, t) {},
  drawBack(g, camX, t) { const L = this.L; g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0);
    for (const wt of this.watchers) { const x = Math.round(wt.x - camX * .7), j = Math.max(0, Math.sin(t * 4 + wt.ph)) * (WORLD.boss ? 3 : 1); if (x < -20 || x > VW + 20) continue; lr(g, x, 26 - j, 7, 12, SMOCKS[Math.floor(wt.ph * 3) % SMOCKS.length]); lr(g, x, 19 - j, 7, 7, '#e8c0a0'); lr(g, x - 1, 15 - j, 9, 5, DYES[Math.floor(wt.ph * 5) % DYES.length]); if (Math.sin(t * 2 + wt.ph) > .6) { g.strokeStyle = LCI; g.beginPath(); g.moveTo(x + 7, 28 - j); g.lineTo(x + 11, 18 - j); g.stroke(); } }
    for (let k = 0; k < 3; k++) { const x = Math.round(300 + k * 360 - camX * .8); g.strokeStyle = LCI; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 14); g.stroke(); g.fillStyle = '#fff6c8'; g.beginPath(); g.arc(x, 18, 5, 0, 7); g.fill(); g.stroke(); g.fillStyle = 'rgba(255,240,200,.15)'; g.beginPath(); g.moveTo(x - 4, 20); g.lineTo(x - 40, 200); g.lineTo(x + 40, 200); g.lineTo(x + 4, 20); g.fill(); }   // pendant lamps
  },
  drawFront(g, camX, t) { for (let i = 0; i < 6; i++) { const x = Math.round(i * 330 - camX * 1.2 + 200); if (x < -40 || x > VW + 40) continue; lr(g, x, VH - 44, 12, 44, '#c8963a'); lr(g, x - 4, VH - 48, 20, 6, '#f4ead8'); } }
};
