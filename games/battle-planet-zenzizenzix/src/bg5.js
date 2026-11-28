// =====================================================================
// ÉPROUVETTE — world 5, printed as an 1870 engraving (shader style 6: sepia copperplate). Dr PaNIC's Mutant & Weapons
// Research Facility, one floor deeper every screen: the roof (no railing: gaps to fall through), then levels −1 to −5
// (giant ants, snakes, samurai mice, vampires, chemical explosives), then the secret lab at −6. The screens are short
// (two thirds of a usual one) and there are six of them before the boss room.
// =====================================================================
const EK = '#1a140e';   // the ink of this world
function er(g, x, y, w, h, col) { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function epoly(g, pts, col, ink) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = col; g.fill(); if (ink) { g.strokeStyle = ink; g.lineWidth = 1; g.stroke(); } }
function hatch(g, x, y, w, h, step, col, ang = 1) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = col; g.lineWidth = .7; for (let k = -h; k < w + h; k += step) { g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + k - h * ang, y + h); g.stroke(); } g.restore(); }
function hazard(g, x, y, w, h) { er(g, x, y, w, h, '#e8c040'); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = EK; for (let k = -h; k < w; k += 10) { g.beginPath(); g.moveTo(x + k, y + h); g.lineTo(x + k + 5, y + h); g.lineTo(x + k + 5 + h, y); g.lineTo(x + k + h, y); g.fill(); } g.restore(); }
function levelSign(g, x, y, n, label) { er(g, x - 2, y - 2, 70, 30, EK); er(g, x, y, 66, 26, '#e8e0c8'); g.fillStyle = EK; g.font = 'bold 13px serif'; g.textAlign = 'center'; g.fillText(n, x + 33, y + 13); g.font = 'bold 6px serif'; g.fillText(label, x + 33, y + 22); g.textAlign = 'left'; }
function floorLab(scr) {
  const [c, g] = mkC(scr.W, VH - FLOOR); const H = VH - FLOOR; seedR(scr.W + 53);
  if (scr.floor === 'roof') { P(g, 0, 0, scr.W, H, '#8a8478'); for (let i = 0; i < scr.W / 3; i++) { g.fillStyle = rr() < .5 ? '#7a746a' : '#9a948a'; g.fillRect(rr() * scr.W, rr() * DEPTH, 2, 1.5); }   // tar and gravel
    for (let x = 0; x < scr.W; x += 120) P(g, x, 0, 1, DEPTH, '#6a645a');
    for (let x = 60; x < scr.W; x += 340) { P(g, x, 8, 26, 14, '#5a5a56'); P(g, x, 8, 26, 2, '#9a9a94'); for (let k = 0; k < 4; k++) P(g, x + 3 + k * 6, 12, 3, 8, '#3a3a36'); }   // vents
    P(g, 0, DEPTH + 8, scr.W, H, '#3a362e'); P(g, 0, DEPTH + 8, scr.W, 1, EK);
  } else { const dark = scr.floor === 'vamp', boom = scr.floor === 'boom', boss = scr.floor === 'boss';
    const a = dark ? '#5a5458' : boss ? '#9a9a90' : '#b8b4a8', b = dark ? '#4a4448' : boss ? '#8a8a80' : '#a8a498'; P(g, 0, 0, scr.W, H, a);
    for (let z = 0; z < DEPTH + 8; z += 14) for (let x = (z / 14 % 2) * 14; x < scr.W; x += 28) { g.fillStyle = (x + z) % 56 ? a : b; g.fillRect(x, z, 27, 13); }   // lab tiles
    if (scr.floor === 'grate' || boss) for (let x = 140; x < scr.W; x += 300) { P(g, x, DEPTH * .4, 50, 22, '#4a4a46'); for (let k = 0; k < 8; k++) P(g, x + 2 + k * 6, DEPTH * .4 + 2, 3, 18, '#2a2a26'); }   // drain grates
    if (boom) for (let x = 0; x < scr.W; x += 240) hazard(g, x + 40, DEPTH * .5 - 3, 120, 6);
    if (scr.floor === 'mouse') for (let x = 60; x < scr.W; x += 200) { g.strokeStyle = '#8a8070'; g.lineWidth = 1.4; g.strokeRect(x, 20, 60, 50); g.beginPath(); g.moveTo(x + 30, 20); g.lineTo(x + 30, 50); g.lineTo(x + 50, 50); g.stroke(); }   // maze lines painted on the floor
    if (dark) for (let i = 0; i < scr.W / 50; i++) { g.fillStyle = 'rgba(120,20,30,.35)'; g.beginPath(); g.ellipse(rr() * scr.W, rr() * DEPTH, 4 + rr() * 6, 1.5 + rr() * 2, 0, 0, 7); g.fill(); }   // tomato-juice spills
    P(g, 0, DEPTH + 8, scr.W, H, '#2a2620'); P(g, 0, DEPTH + 8, scr.W, 1, EK); }
  scr.floorC = c; }
const SHAFT = { col: '#0e0c0a', hi: '#3a342a' };   // the gaps in the roof: a long way down
// the common lab wall: panels, pipes, a level sign; then each floor adds its own things
function labWall(w, seed, wall, sign) { const [c, g] = mkC(w, 230); seedR(seed); P(g, 0, 0, w, 230, wall); hatch(g, 0, 0, w, 204, 7, 'rgba(26,20,14,.12)');
  for (let x = 0; x < w; x += 96) { P(g, x, 0, 1.4, 204, 'rgba(26,20,14,.4)'); for (const y of [40, 150]) { P(g, x + 6, y, 3, 3, '#6a6458'); P(g, x + 87, y, 3, 3, '#6a6458'); } }
  P(g, 0, 14, w, 6, '#7a7468'); P(g, 0, 14, w, 1, EK); P(g, 0, 24, w, 4, '#8a8478'); for (let x = 30; x < w; x += 180) { P(g, x, 10, 8, 18, '#5a5448'); }   // pipes along the ceiling
  for (let x = 120; x < w; x += 460) levelSign(g, x, 50, sign[0], sign[1]);
  P(g, 0, 190, w, 14, '#4a443a'); P(g, 0, 190, w, 1, EK); return [c, g]; }
function tankGlass(g, x, y, w, h, liquid, draw) { er(g, x - 3, y - 6, w + 6, 8, '#4a4a46'); er(g, x - 3, y + h, w + 6, 10, '#4a4a46'); er(g, x, y, w, h, liquid); draw && draw(g, x, y, w, h); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 4, y + 4, 3, h - 8); g.strokeStyle = EK; g.lineWidth = 1; g.strokeRect(x, y, w, h); }
const E5BACK = function (g, camX, t) { g.drawImage(this.L.mid.c, Math.round(-camX * this.L.mid.f), 0); this.extra && this.extra(g, camX, t); drawBGP(g, camX, .3, .8); };
const E5FRONT = function (g, camX, t) { for (let i = 0; i < 5; i++) { const x = Math.round(i * 560 - camX * 1.2 + 260); if (x < -40 || x > VW + 40) continue; er(g, x, VH - 70, 8, 70, '#2a2620'); er(g, x - 3, VH - 14, 14, 14, '#1a1610'); er(g, x - 10, VH - 74, 28, 5, '#3a3428'); } };
const EDROP = function () { return [camX + 160, camX + 340, camX + 500]; };

// ---- SCREEN 1 — LE TOIT (the roof; birds, man-birds, gaps, no railing) ---------------------------------------------
const E1 = {
  id: 'toit', name: { fr: 'Le toit', en: 'The Roof' }, W: 1740, floor: 'roof', floorBuild: floorLab, holeCol: SHAFT,
  boxes: [], holes: [{ x0: 640, x1: 690 }, { x0: 1180, x1: 1230 }],
  items: [{ k: 'vent', x: 320, z: 90 }, { k: 'crate', x: 450, z: 20 }, { k: 'tank', x: 540, z: 70 }, { k: 'barrel', x: 820, z: 30 }, { k: 'crate', x: 960, z: 96 }, { k: 'vent', x: 1050, z: 20 }, { k: 'tank', x: 1380, z: 40 }, { k: 'barrel', x: 1500, z: 90 }],
  zones: [{ cam: 0, delay: 1.4, waves: [[['bird', 'R'], ['bird', 'R'], ['manbird', 'drop']], [['manbird', 'drop'], ['bird', 'L'], ['bird', 'R'], ['manbird', 'drop']]] },
          { cam: 1100, waves: [[['bird', 'R'], ['manbird', 'drop'], ['bird', 'L']], [['manbird', 'drop'], ['manbird', 'drop'], ['bird', 'R'], ['bird', 'R']]] }],
  dropPoints: EDROP,
  build() { const L = {};
    { const w = VW + (this.W - VW) * .04; const [c, g] = mkC(w, 230); dithVfast(g, 0, 0, w, 230, ['#c8c0a8', '#d8d0b8', '#e8e0c8', '#f0e8d4']); seedR(9);
      for (let i = 0; i < 9; i++) { const x = rr() * w, y = 20 + rr() * 70; g.fillStyle = '#f8f4e8'; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(x + k * 16, y + (k % 2) * 4, 18, 9, 0, 0, 7); g.fill(); } hatch(g, x - 18, y + 4, 80, 8, 4, 'rgba(26,20,14,.15)'); } L.sky = { c, f: .04 }; }
    { const w = VW + (this.W - VW) * .2; const [c, g] = mkC(w, 230); seedR(17);   // the city far below, a forest of chimneys and towers
      for (let x = 0; x < w; x += 18 + rr() * 30) { const h = 30 + rr() * 70; er(g, x, 200 - h, 16 + rr() * 20, h, mix('#8a8270', '#a8a090', rr())); hatch(g, x, 200 - h, 30, h, 5, 'rgba(26,20,14,.2)'); if (rr() < .3) er(g, x + 4, 200 - h - 14, 4, 14, '#7a7262'); }
      P(g, 0, 196, w, 34, '#7a7262'); L.far = { c, f: .2 }; }
    { const w = VW + (this.W - VW) * .55; const [c, g] = mkC(w, 230); seedR(29);   // the rooftop clutter: water tanks, antennae, the stair hut with its door down
      for (let x = 60; x < w; x += 260 + rr() * 80) { er(g, x, 150, 34, 40, '#6a6252'); epoly(g, [[x - 4, 150], [x + 17, 132], [x + 38, 150]], '#5a5242', EK); for (let k = 0; k < 4; k++) er(g, x + 2 + k * 9, 190, 2, 14, EK); hatch(g, x, 150, 34, 40, 4, 'rgba(26,20,14,.25)'); }
      for (let x = 200; x < w; x += 320) { g.strokeStyle = EK; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, 204); g.lineTo(x, 110); g.stroke(); for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 10 + k * 2, 120 + k * 12); g.lineTo(x + 10 - k * 2, 120 + k * 12); g.stroke(); } }
      { const x = w * .6; er(g, x, 130, 80, 74, '#8a8272'); er(g, x + 26, 150, 28, 54, EK); g.fillStyle = '#e8e0c8'; g.font = 'bold 7px serif'; g.fillText(LANG === 'fr' ? 'ESCALIER ↓' : 'STAIRS ↓', x + 18, 144); }
      g.fillStyle = EK; g.font = 'bold 18px serif'; g.fillText('PaNIC LABS', 40, 120); er(g, 36, 124, 120, 2, EK);
      P(g, 0, 198, w, 32, '#5a5446'); P(g, 0, 198, w, 1, EK); L.mid = { c, f: .55 }; }
    this.L = L; this.birds = Array.from({ length: 7 }, (_, i) => ({ x: i * 160, y: 40 + (i * 23) % 60, ph: i })); },
  update(dt, t) { for (const b of this.birds) b.x += (20 + b.ph * 3) * dt; },
  drawBack(g, camX, t) { const L = this.L; g.drawImage(L.sky.c, Math.round(-camX * L.sky.f), 0);
    for (const b of this.birds) { const x = Math.round(((b.x - camX * .08) % (VW + 100) + VW + 100) % (VW + 100) - 50), fl = Math.sin(t * 8 + b.ph) * 3; g.strokeStyle = EK; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 6, b.y - fl); g.lineTo(x, b.y); g.lineTo(x + 6, b.y - fl); g.stroke(); }
    g.drawImage(L.far.c, Math.round(-camX * L.far.f), 0); g.drawImage(L.mid.c, Math.round(-camX * L.mid.f), 0); drawBGP(g, camX, .3, .7); },
  drawFront(g, camX, t) { for (let i = 0; i < 6; i++) { const x = Math.round(i * 380 - camX * 1.25 + 60); if (x < -60 || x > VW + 60) continue; g.strokeStyle = EK; g.lineWidth = 2; g.beginPath(); g.moveTo(x, VH); g.lineTo(x + 4, VH - 50); g.stroke(); g.fillStyle = '#3a3428'; g.fillRect(x - 10, VH - 54, 28, 6); } }
};
// ---- SCREEN 2 — NIVEAU −1 · LES FOURMIS GÉANTES ----------------------------------------------------------------------
const E2 = {
  id: 'fourmis', name: { fr: 'Niveau −1 · Fourmis géantes', en: 'Level −1 · Giant Ants' }, W: 1740, floor: 'lab', floorBuild: floorLab,
  boxes: [], holes: [],
  items: [{ k: 'bench', x: 300, z: 14 }, { k: 'crate', x: 420, z: 90 }, { k: 'tank', x: 560, z: 30 }, { k: 'bench', x: 760, z: 96 }, { k: 'beaker', x: 880, z: 40 }, { k: 'crate', x: 1000, z: 20 }, { k: 'tank', x: 1160, z: 80 }, { k: 'bench', x: 1320, z: 14 }, { k: 'barrel', x: 1480, z: 70 }],
  zones: [{ cam: 0, delay: 1.2, waves: [[['ant', 'R'], ['ant', 'R'], ['ant', 'L']], [['ant', 'R'], ['ant', 'R'], ['ant', 'L'], ['ant', 'L'], ['ant', 'R']]] },
          { cam: 1100, waves: [[['ant', 'R'], ['ant', 'R'], ['ant', 'L'], ['ant', 'R']], [['ant', 'R'], ['ant', 'L'], ['ant', 'R'], ['ant', 'L'], ['ant', 'R'], ['ant', 'R']]] }],
  dropPoints: EDROP,
  build() { const w = VW + (this.W - VW) * .6; const [c, g] = labWall(w, 41, '#a8a090', ['−1', LANG === 'fr' ? 'FOURMIS' : 'ANTS']);
    for (let x = 260; x < w; x += 300) { er(g, x - 3, 60, 186, 124, EK); er(g, x, 63, 180, 118, '#c8b890');   // the ant farm, cut open: tunnels and chambers in the sand
      seedR(x); g.strokeStyle = '#6a5a3a'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 10, 70); for (let k = 0; k < 6; k++) g.lineTo(x + 20 + rr() * 150, 75 + k * 18); g.stroke(); g.lineCap = 'butt';
      for (let k = 0; k < 3; k++) { g.fillStyle = '#6a5a3a'; g.beginPath(); g.ellipse(x + 30 + k * 55, 120 + (k % 2) * 30, 14, 7, 0, 0, 7); g.fill(); g.fillStyle = '#2a1a14'; g.beginPath(); g.ellipse(x + 30 + k * 55, 120 + (k % 2) * 30, 4, 2, 0, 0, 7); g.fill(); }
      g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(x + 6, 66, 4, 110); }
    this.L = { mid: { c, f: .6 } }; this.ants = Array.from({ length: 10 }, (_, i) => ({ x: i * 90, ph: i })); },
  update(dt, t) { for (const a of this.ants) a.x += 14 * dt; },
  extra(g, camX, t) { for (const a of this.ants) { const x = Math.round(((a.x - camX * .6) % (VW + 60) + VW + 60) % (VW + 60) - 30); g.fillStyle = EK; g.fillRect(x, 186, 4, 2); g.fillRect(x + 5, 186, 3, 2); g.fillRect(x - 3, 186, 2, 2); } },
  drawBack: E5BACK, drawFront: E5FRONT
};
// ---- SCREEN 3 — NIVEAU −2 · LES SERPENTS (they puff up; the three-headed snake) ------------------------------------
const E3 = {
  id: 'serpents', name: { fr: 'Niveau −2 · Serpents', en: 'Level −2 · Snakes' }, W: 1740, floor: 'grate', floorBuild: floorLab,
  boxes: [], holes: [],
  items: [{ k: 'tank', x: 300, z: 20 }, { k: 'bench', x: 440, z: 96 }, { k: 'crate', x: 600, z: 40 }, { k: 'beaker', x: 700, z: 90 }, { k: 'tank', x: 880, z: 16 }, { k: 'vent', x: 1040, z: 96 }, { k: 'crate', x: 1200, z: 30 }, { k: 'chemset', x: 1380, z: 80 }],
  zones: [{ cam: 0, delay: 1.2, waves: [[['snake', 'R'], ['snake', 'R'], ['snake', 'L']], [['snake', 'R'], ['snake', 'L'], ['snake', 'R'], ['snake', 'R']]] },
          { cam: 1100, waves: [[['snake', 'R'], ['snake', 'L'], ['snake', 'R']], [['hydra', 'R']]] }],
  dropPoints: EDROP,
  build() { const w = VW + (this.W - VW) * .6; const [c, g] = labWall(w, 43, '#9a9888', ['−2', LANG === 'fr' ? 'REPTILES' : 'REPTILES']);
    for (let x = 220; x < w; x += 210) tankGlass(g, x, 80, 110, 90, '#8a9a6a', (g, x0, y0, w0, h0) => { er(g, x0, y0 + h0 - 14, w0, 14, '#6a5a3a'); g.strokeStyle = '#3a4a1a'; g.lineWidth = 4; g.beginPath(); g.moveTo(x0 + 10, y0 + h0 - 20); g.bezierCurveTo(x0 + 40, y0 + 20, x0 + 70, y0 + h0, x0 + 95, y0 + 30); g.stroke(); g.fillStyle = '#e8d040'; g.fillRect(x0 + 93, y0 + 28, 2, 2); });
    g.fillStyle = EK; g.font = 'bold 8px serif'; for (let x = 250; x < w; x += 420) { g.fillText(LANG === 'fr' ? 'NE PAS NOURRIR APRÈS MINUIT' : 'DO NOT FEED AFTER MIDNIGHT', x, 186); }
    this.L = { mid: { c, f: .6 } }; },
  update() {}, drawBack: E5BACK, drawFront: E5FRONT
};
// ---- SCREEN 4 — NIVEAU −3 · LES SOURIS SAMOURAÏ (cheese stuns them) -------------------------------------------------
const E4 = {
  id: 'souris', name: { fr: 'Niveau −3 · Souris samouraï', en: 'Level −3 · Samurai Mice' }, W: 1740, floor: 'mouse', floorBuild: floorLab,
  boxes: [], holes: [],
  items: [{ k: 'cheese', x: 260, z: 30 }, { k: 'cheese', x: 330, z: 90 }, { k: 'bench', x: 460, z: 14 }, { k: 'cheese', x: 600, z: 60 }, { k: 'crate', x: 720, z: 96 }, { k: 'cheese', x: 840, z: 24 }, { k: 'cheese', x: 960, z: 80 }, { k: 'bench', x: 1100, z: 96 }, { k: 'cheese', x: 1240, z: 40 }, { k: 'cheese', x: 1360, z: 90 }, { k: 'cheese', x: 1500, z: 20 }],
  zones: [{ cam: 0, delay: 1.2, waves: [[['mouse', 'R'], ['mouse', 'R'], ['mouse', 'L']], [['mouse', 'R'], ['mouse', 'L'], ['mouse', 'R'], ['mouse', 'R']]] },
          { cam: 1100, waves: [[['mouse', 'R'], ['mouse', 'L'], ['mouse', 'R'], ['mouse', 'L']], [['mouse', 'R'], ['mouse', 'R'], ['mouse', 'L'], ['mouse', 'L'], ['mouse', 'R']]] }],
  dropPoints: EDROP,
  build() { const w = VW + (this.W - VW) * .6; const [c, g] = labWall(w, 47, '#b0a890', ['−3', LANG === 'fr' ? 'RONGEURS' : 'RODENTS']);
    for (let x = 200; x < w; x += 360) { er(g, x - 2, 56, 164, 124, EK); er(g, x, 58, 160, 120, '#d8d0b8'); seedR(x + 3);   // the giant maze on the wall, a dojo banner, paper lanterns
      g.strokeStyle = EK; g.lineWidth = 2; for (let k = 0; k < 12; k++) { const a = rr() < .5, px = x + 10 + ((rr() * 14) | 0) * 10, py = 66 + ((rr() * 10) | 0) * 10; g.beginPath(); g.moveTo(px, py); g.lineTo(px + (a ? 30 : 0), py + (a ? 0 : 30)); g.stroke(); }
      disc(g, x + 140, 160, 5, '#e8c040'); }
    for (let x = 380; x < w; x += 360) { er(g, x, 40, 3, 140, EK); er(g, x + 3, 46, 30, 90, '#e8e0c8'); g.fillStyle = '#8a2a2a'; g.beginPath(); g.arc(x + 18, 76, 9, 0, 7); g.fill(); g.fillStyle = EK; g.font = 'bold 8px serif'; g.fillText(LANG === 'fr' ? 'FROMAGE' : 'CHEESE', x + 4, 110); g.fillText('道', x + 13, 125); }
    this.L = { mid: { c, f: .6 } }; this.lan = Array.from({ length: 6 }, (_, i) => ({ x: 120 + i * 280 })); },
  update() {},
  extra(g, camX, t) { for (const l of this.lan) { const x = Math.round(l.x - camX * .8), sw = Math.sin(t * 1.5 + l.x) * 3; if (x < -30 || x > VW + 30) continue; g.strokeStyle = EK; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + sw, 30); g.stroke(); g.fillStyle = '#c8402a'; g.beginPath(); g.ellipse(x + sw, 40, 9, 12, 0, 0, 7); g.fill(); er(g, x + sw - 6, 27, 12, 3, EK); er(g, x + sw - 6, 51, 12, 3, EK); } },
  drawBack: E5BACK, drawFront: E5FRONT
};
// ---- SCREEN 5 — NIVEAU −4 · LE LABO DES VAMPIRES (dim; they bite and turn into bats) --------------------------------
const E5S = {
  id: 'vampires', name: { fr: 'Niveau −4 · Labo des vampires', en: 'Level −4 · Vampire Lab' }, W: 1740, floor: 'vamp', floorBuild: floorLab, dim: .7,
  boxes: [], holes: [],
  items: [{ k: 'bench', x: 300, z: 96 }, { k: 'tank', x: 440, z: 20 }, { k: 'crate', x: 600, z: 70 }, { k: 'beaker', x: 760, z: 30 }, { k: 'bench', x: 900, z: 14 }, { k: 'tank', x: 1060, z: 90 }, { k: 'crate', x: 1240, z: 40 }, { k: 'barrel', x: 1420, z: 96 }],
  zones: [{ cam: 0, delay: 1.4, waves: [[['vampire', 'R'], ['vampire', 'L']], [['vampire', 'R'], ['vampire', 'L']]] },
          { cam: 1100, waves: [[['vampire', 'R'], ['vampire', 'L']], [['vampire', 'R'], ['vampire', 'L'], ['vampire', 'R']]] }],
  dropPoints: EDROP,
  build() { const w = VW + (this.W - VW) * .6; const [c, g] = labWall(w, 53, '#6a6264', ['−4', LANG === 'fr' ? 'VAMPIRES' : 'VAMPIRES']);
    for (let x = 220; x < w; x += 260) { tankGlass(g, x, 70, 50, 110, '#8a8a90', (g, x0, y0, w0, h0) => { epoly(g, [[x0 + 8, y0 + h0], [x0 + 6, y0 + 20], [x0 + 25, y0 + 6], [x0 + 44, y0 + 20], [x0 + 42, y0 + h0]], '#2a1a14', EK); er(g, x0 + 22, y0 + 26, 6, 40, '#c8a040'); er(g, x0 + 15, y0 + 36, 20, 5, '#c8a040'); }); }   // coffins in glass cases
    for (let x = 360; x < w; x += 260) { er(g, x, 50, 2, 40, EK); for (let k = 0; k < 3; k++) { er(g, x - 14 + k * 12, 90, 9, 16, '#a82a3a'); g.fillStyle = '#e8e0c8'; g.font = 'bold 3px sans-serif'; g.fillText(LANG === 'fr' ? 'TOMATE' : 'TOMATO', x - 14 + k * 12, 100); } }   // the "tomato juice" bags
    this.L = { mid: { c, f: .6 } }; this.bats = Array.from({ length: 6 }, (_, i) => ({ x: i * 200, y: 40 + (i * 29) % 50, ph: i })); },
  update(dt) { for (const b of this.bats) b.x += (40 + b.ph * 6) * dt; },
  extra(g, camX, t) { for (const b of this.bats) { const x = Math.round(((b.x - camX * .4) % (VW + 80) + VW + 80) % (VW + 80) - 40), y = b.y + Math.sin(t * 3 + b.ph) * 6, fl = Math.sin(t * 20 + b.ph) * 4; g.fillStyle = EK; g.beginPath(); g.moveTo(x - 8, y - fl); g.lineTo(x, y); g.lineTo(x + 8, y - fl); g.lineTo(x, y + 3); g.closePath(); g.fill(); } },
  drawBack: E5BACK, drawFront: E5FRONT
};
// ---- SCREEN 6 — NIVEAU −5 · LES EXPLOSIFS CHIMIQUES (five times the breakables, nearly all of them go boom) --------
const E6 = {
  id: 'explosifs', name: { fr: 'Niveau −5 · Explosifs chimiques', en: 'Level −5 · Chemical Explosives' }, W: 1740, floor: 'boom', floorBuild: floorLab,
  extraMul: 4, surprise: .9, surpriseW: [['petard', 3], ['beaker', 3], ['chemset', 3], ['poison', 2], ['fizz', 1], ['gas', 1]],
  boxes: [], holes: [],
  items: [{ k: 'bench', x: 280, z: 14 }, { k: 'beaker', x: 360, z: 70 }, { k: 'chemset', x: 420, z: 30 }, { k: 'beaker', x: 520, z: 96 }, { k: 'bench', x: 620, z: 96 }, { k: 'chemset', x: 700, z: 50 }, { k: 'petard', x: 800, z: 20 }, { k: 'beaker', x: 880, z: 80 },
          { k: 'bench', x: 980, z: 14 }, { k: 'chemset', x: 1060, z: 60 }, { k: 'beaker', x: 1140, z: 96 }, { k: 'petard', x: 1240, z: 40 }, { k: 'bench', x: 1340, z: 96 }, { k: 'chemset', x: 1420, z: 30 }, { k: 'beaker', x: 1500, z: 70 }, { k: 'crate', x: 1580, z: 20 }],
  zones: [{ cam: 0, delay: 1.2, waves: [[['scientist', 'R'], ['scientist', 'R'], ['scientist', 'L']], [['scientist', 'R'], ['scientist', 'L'], ['scientist', 'R'], ['scientist', 'R'], ['scientist', 'L']]] },
          { cam: 1100, waves: [[['scientist', 'R'], ['scientist', 'L'], ['scientist', 'R'], ['scientist', 'L']], [['scientist', 'R'], ['scientist', 'R'], ['scientist', 'L'], ['scientist', 'L'], ['scientist', 'R'], ['scientist', 'R']]] }],
  dropPoints: EDROP,
  build() { const w = VW + (this.W - VW) * .6; const [c, g] = labWall(w, 59, '#b8b0a0', ['−5', LANG === 'fr' ? 'EXPLOSIFS' : 'EXPLOSIVES']); seedR(61);
    for (let x = 200; x < w; x += 230) { for (const y of [70, 110, 150]) { er(g, x, y, 150, 4, '#5a5448'); for (let k = 0; k < 9; k++) { const fx0 = x + 6 + k * 16, h = 10 + rr() * 14, col = ['#c84a3a', '#5ab85a', '#4a7ac8', '#e8c040', '#b84ac8'][(rr() * 5) | 0];   // shelves of flasks
          epoly(g, [[fx0, y], [fx0 + 9, y], [fx0 + 6, y - h * .6], [fx0 + 6, y - h], [fx0 + 3, y - h], [fx0 + 3, y - h * .6]], 'rgba(220,230,230,.7)', EK); er(g, fx0 + 1, y - h * .35, 7, h * .35, col); } } }
    for (let x = 140; x < w; x += 460) { hazard(g, x, 168, 90, 8); g.fillStyle = EK; g.font = 'bold 12px serif'; g.fillText('DANGER !', x + 8, 162); epoly(g, [[x + 120, 140], [x + 140, 176], [x + 100, 176]], '#e8c040', EK); g.font = 'bold 18px serif'; g.fillText('!', x + 116, 172); }
    this.L = { mid: { c, f: .6 } }; },
  update() {}, drawBack: E5BACK, drawFront: E5FRONT
};
// ---- SCREEN 7 — NIVEAU −6 · LE LABO SECRET (everything from above, then Dr PaNIC) ----------------------------------
const E7 = {
  id: 'labo', name: { fr: 'Niveau −6 · Le labo secret', en: 'Level −6 · The Secret Lab' }, W: 1400, floor: 'boss', floorBuild: floorLab, barX: 1180,
  boxes: [], holes: [],
  items: [{ k: 'bench', x: 280, z: 14 }, { k: 'cheese', x: 360, z: 90 }, { k: 'beaker', x: 460, z: 40 }, { k: 'tank', x: 560, z: 96 }, { k: 'chemset', x: 680, z: 20 }, { k: 'crate', x: 800, z: 70 }, { k: 'beaker', x: 900, z: 96 }, { k: 'cheese', x: 960, z: 30 }, { k: 'bench', x: 1080, z: 96 }],
  zones: [{ cam: 0, delay: 1, waves: [[['ant', 'R'], ['mouse', 'R'], ['manbird', 'drop']], [['snake', 'R'], ['vampire', 'L'], ['bird', 'R'], ['scientist', 'R']]] },
          { cam: 760, boss: true, waves: [[['manbird', 'drop'], ['snake', 'L'], ['scientist', 'R']], [['panic', 'bar'], ['scientist', 'R']]] }],
  dropPoints: EDROP,
  build() { const w = VW + (this.W - VW) * .7; const [c, g] = mkC(w, 230); seedR(67); P(g, 0, 0, w, 230, '#7a7468'); hatch(g, 0, 0, w, 204, 6, 'rgba(26,20,14,.18)');
    { const x0 = 90, cw = 13; const EL = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ra', 'Ac', 'Th', 'Pa', 'U'];   // the periodic table, Pa · Ni · C lit up
      for (let k = 0; k < 18; k++) { const x = x0 + (k % 9) * (cw + 2), y = 40 + ((k / 9) | 0) * (cw + 2), on = ['Pa', 'Ni', 'C'].includes(EL[k]); er(g, x, y, cw, cw, on ? '#d8ff9a' : '#c8c0a8'); g.strokeStyle = EK; g.lineWidth = .6; g.strokeRect(x, y, cw, cw); g.fillStyle = EK; g.font = 'bold 6px serif'; g.fillText(EL[k], x + 2, y + 9); }
      g.font = 'bold 10px serif'; g.fillText('Pa · Ni · C', x0 + 30, 88); }
    for (const x of [320, w - 260]) { er(g, x, 120, 12, 84, '#4a443a'); for (let k = 0; k < 7; k++) { g.fillStyle = '#c8a040'; g.beginPath(); g.ellipse(x + 6, 120 + k * 10, 12, 3, 0, 0, 7); g.fill(); } disc(g, x + 6, 112, 10, '#9a9a90'); }   // tesla coils
    { const x = w * .55; er(g, x - 50, 150, 100, 54, '#3a342a'); g.fillStyle = '#9aff3a'; g.beginPath(); g.ellipse(x, 150, 46, 8, 0, 0, 7); g.fill(); er(g, x - 56, 146, 112, 6, '#2a241a'); }   // the vat of glowing green
    levelSign(g, 30, 110, '−6', LANG === 'fr' ? 'SECRET !' : 'SECRET!');
    P(g, 0, 190, w, 14, '#4a443a'); P(g, 0, 204, w, 26, '#3a342a'); P(g, 0, 204, w, 1, EK); this.L = { mid: { c, f: .7 } }; this.bub = Array.from({ length: 8 }, (_, i) => ({ ph: i * .8 })); },
  update() {},
  extra(g, camX, t) { const x = Math.round((VW + (this.W - VW) * .7) * .55 - camX * .7); for (const b of this.bub) { const u = (t * .6 + b.ph) % 1; g.fillStyle = `rgba(190,255,120,${1 - u})`; g.beginPath(); g.arc(x - 30 + b.ph * 8, 148 - u * 40, 2 + u * 2, 0, 7); g.fill(); }
    for (const cx of [326, (VW + (this.W - VW) * .7) - 254]) { if (Math.sin(t * 7 + cx) < .6) continue; const sx = Math.round(cx - camX * .7); g.strokeStyle = '#f8f4e0'; g.lineWidth = 1.2; g.beginPath(); let y = 110, xx = sx; g.moveTo(xx, y); for (let k = 0; k < 6; k++) { xx += (Math.random() - .5) * 18; y -= 10; g.lineTo(xx, y); } g.stroke(); } },
  drawBack: E5BACK, drawFront: E5FRONT
};
LEVELS.push({ id: 'eprouvette', screens: [E1, E2, E3, E4, E5S, E6, E7], style: 6, name: { fr: 'MONDE 5 · ÉPROUVETTE', en: 'WORLD 5 · ÉPROUVETTE' }, minis: [{ scr: 2, zone: 1, type: 'hydra' }] });
