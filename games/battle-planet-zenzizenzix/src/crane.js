// =====================================================================
// LEVEL 3½ — LA TOUR CALVE-HAIR. Madame Metal Face runs off with gear no. 3 and we chase her up the cranes of the
// half-built Tour Calve-Hair: the climb up the mast (climb.js, its own little mode), then the sky platforms hung from
// crane cables (jump, dash-jump across the long gaps, and throw things to open the way), then three strikes against
// her on the top crane. Punches don't work on her: only a thrown object, or a charge right after one of her attacks.
// =====================================================================

// ---- things to throw up there ---------------------------------------------------------------------------------------
Object.assign(BK, { toolbox: { size: 's', hp: 2, w: 20, d: 12, h: 12, col: '#c8302a' }, paintcan: { size: 's', hp: 1, w: 12, d: 12, h: 14, col: '#f4f0e8' } });
Object.assign(BK_SC, { toolbox: 1.35, paintcan: 1.4 });
Object.assign(BK3_DRAW, {
  toolbox: (g, W, H, c, dk, lt) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .8], [-W / 2, -H * .8]], c); g.fillStyle = dk; g.fillRect(-W / 2, -H * .55, W, 1.2); g.strokeStyle = OUT; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-W / 4, -H * .8); g.lineTo(-W / 4, -H); g.lineTo(W / 4, -H); g.lineTo(W / 4, -H * .8); g.stroke(); g.fillStyle = '#e8c040'; g.fillRect(-1.5, -H * .62, 3, 2); },
  paintcan: (g, W, H, c, dk, lt) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.fillStyle = '#e8402a'; g.fillRect(-W / 2, -H * .7, W, H * .3); g.fillStyle = '#e8402a'; g.fillRect(-W / 2 + 2, -H, 2, H * .45); g.fillRect(W / 2 - 4, -H, 2, H * .25); g.fillStyle = '#8a8a92'; g.fillRect(-W / 2, -H - 1, W, 1.5); }
});

// ---- the sky screen ------------------------------------------------------------------------------------------------
// decks hang from cables; between them is the void (a fall costs half a heart and puts you back on the last deck).
const SKY = { P: [], D: {}, segs: [], tilt: 1, tiltTo: 1, t: 0, hooks: [], birds: [], ship: null, lastBK: 0 };
const PIVOT = 1878;
const skyDeck = (id, x, w, h, o = {}) => ({ id, x, z: -2, w, d: DEPTH + 4, h, deck: true, px: x, ph: h, ...o });
function applyTilt() { for (const s of SKY.segs) s.h = Math.round(SKY.tilt * (PIVOT - (s.x + 25)) * 1.2); }
const beamH = x => SKY.tilt * (PIVOT - x) * 1.2;
function nearestDeck(x) { let best = null, bd = 1e9; for (const b of scr.boxes) { if (!b.deck || Math.abs(b.h) > 4) continue; const d = x < b.x ? b.x - x : x > b.x + b.w ? x - b.x - b.w : 0; if (d < bd) { bd = d; best = b; } } return best; }
const deckUnder = (x, y) => scr.boxes.find(b => b.deck && x > b.x && x < b.x + b.w && Math.abs((y || 0) - b.h) < 3);

const K1 = {
  id: 'tour', name: { fr: 'Les grues de la Tour', en: 'The Tower cranes' }, W: 3800, sky: true, floor: 'sky', floorBuild: s => { s.floorC = mkC(4, 4)[0]; },
  boxes: [], holes: [], barX: 3600,
  items: [{ k: 'toolbox', x: 250, z: 40 }, { k: 'crate', x: 320, z: 90 }, { k: 'toolbox', x: 520, z: 60 }, { k: 'paintcan', x: 580, z: 30 }, { k: 'toolbox', x: 1060, z: 70 }, { k: 'paintcan', x: 1130, z: 40 },
    { k: 'toolbox', x: 1560, z: 60 }, { k: 'toolbox', x: 2210, z: 50 }, { k: 'paintcan', x: 2280, z: 84 },
    { k: 'toolbox', x: 2450, z: 50 }, { k: 'paintcan', x: 2520, z: 84 }, { k: 'crate', x: 2930, z: 60 }, { k: 'toolbox', x: 3300, z: 30 }, { k: 'paintcan', x: 3380, z: 92 }, { k: 'toolbox', x: 3700, z: 100 }, { k: 'crate', x: 3740, z: 40 }],
  zones: [{ cam: 3160, boss: true, delay: .8, waves: [[['mmf', 'drop']]] }],
  dropPoints() { return [3560]; },
  build() {
    if (!this.art) this.art = skyArt(this.W); this.L = this.art;
    const D = skyDeck, d = { A: D('A', 0, 380, 0), B: D('B', 444, 180, 0), C: D('C', 688, 180, 150), Dk: D('D', 996, 180, 0), E: D('E', 1700, 180, 0), F: D('F', 1484, 180, 160), H: D('H', 2156, 180, 0), I: D('I', 2400, 180, 155), J: D('J', 2880, 180, 0), K: D('K', 3188, 612, 0) };
    SKY.segs = []; for (let k = 0; k < 6; k++) SKY.segs.push(D('G' + k, 1728 + k * 50, 50, 0, { seg: k }));
    this.boxes = [...Object.values(d), ...SKY.segs]; SKY.D = d; SKY.tilt = SKY.tiltTo = 1; applyTilt(); SKY.t = 0; SKY.hooks = []; SKY.ship = null; SKY.birds = [];
    SKY.P = [{ k: 'cw', x: 656, y0: 14, y1: 150, deck: d.C },
      { k: 'btn', x: 1208, y0: 40, y1: 130, deck: d.E, from: 1700, to: 1240, t: 0 },
      { k: 'bkt', x: 1452, fill: 0, need: 3, deck: d.F },
      { k: 'pig' },
      { k: 'cw', x: 2368, swing: 1, y0: 14, y1: 150, deck: d.I },
      { k: 'bill', x: 2580, cut: [0, 0], ft: -1 }];
    for (let k = 0; k < 6; k++) SKY.birds.push({ x: 1966 + k * 11, ph: k * 1.3, fly: 0, vx: 0, vy: 0, y: 0 });
    SKY.supply = [{ d: d.B, off: 90, P: 0 }, { d: d.Dk, off: 100, P: 1 }, { d: d.E, off: 90, P: 2, min: 2 }, { d: d.F, off: 100, P: 3 }, { d: d.H, off: 100, P: 4 }, { d: d.I, off: 90, P: 5 }, { d: d.K, off: 300, boss: 1 }];
    SKY.supT = SKY.supply.map(() => 0);
  },
  update(dt) { skyTick(dt); },
  drawBack(g, camX, t) { skyDrawBack(g, camX, t); },
  drawFront(g, camX, t) { skyDrawFront(g, camX, t); }
};

LEVELS.push({ id: 'tour', screens: [K1], style: 1, name: { fr: 'MONDE 3½ · LA TOUR CALVE-HAIR', en: 'WORLD 3½ · THE CALVE-HAIR TOWER' } });

// ---- the backdrop: high above Bouldaire, among the cranes --------------------------------------------------------------
function skyArt(W) {
  const A = {}; seedR(3511);
  { const w = VW + (W - VW) * .06, [c, g] = mkC(w, 230); A.far = { c, f: .06 };   // the far skyline and the tower itself
    for (let x = 0; x < w; x += 6 + rr() * 10) { const h = 14 + rr() * 34; P(g, x, 190 - h, 8 + rr() * 8, h + 40, rr() < .5 ? '#b8c8dc' : '#c4d0e0'); }
    const tx = 150; P(g, tx, 40, 70, 190, '#9aaac0'); for (let y = 44; y < 220; y += 10) P(g, tx, y, 70, 1, '#7a8aa4'); for (let x = tx; x <= tx + 70; x += 14) P(g, x, 40, 1, 190, '#7a8aa4');   // the Tour Calve-Hair, a steel skeleton
    P(g, tx + 6, 24, 58, 14, '#e8b8cc'); g.fillStyle = '#8a3a5a'; g.font = 'bold 6px Georgia'; g.fillText('CALVE-HAIR', tx + 9, 34);
    P(g, 0, 196, w, 34, '#dce6ee'); }
  { const w = VW + (W - VW) * .3, [c, g] = mkC(w, 170); A.below = { c, f: .3 };   // the city far below: zinc roofs, chimneys, the boulevards
    P(g, 0, 0, w, 170, '#c8ccd0');
    for (let by = 6; by < 170; by += 26) for (let bx = (by * 7) % 30; bx < w; bx += 34 + rr() * 16) { const bw = 22 + rr() * 14, bh = 14 + rr() * 6, col = ['#9aa8b8', '#8a98aa', '#a8b4c0', '#b8a898'][(rr() * 4) | 0];
      P(g, bx, by, bw, bh, col); P(g, bx, by + bh - 2, bw, 2, '#6a7888'); for (let k = 0; k < 3; k++) P(g, bx + 3 + rr() * (bw - 6), by + rr() * 6, 2, 3, '#c8705a'); }
    for (let x = 40; x < w; x += 190 + rr() * 80) { P(g, x, 0, 9, 170, '#e8e0d0'); for (let y = 6; y < 170; y += 14) P(g, x + 3, y, 2, 3, rr() < .5 ? '#e84a3a' : '#3a6ab8'); }   // a boulevard, its little cars
    for (let i = 0; i < w / 14; i++) { g.fillStyle = '#7aa070'; g.beginPath(); g.arc(rr() * w, rr() * 170, 2 + rr() * 2, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(206,222,238,.22)'; g.fillRect(0, 0, w, 170); }
  { const w = VW + (W - VW) * .45, [c, g] = mkC(w, VH); A.cranes = { c, f: .45 };   // the other cranes of the site, a little hazy
    for (let k = 0; k < Math.ceil(w / 260); k++) { const x = 60 + k * 260 + rr() * 80, top = 30 + rr() * 30, col = '#d8c27a', ink = '#8a8a8a';
      for (let y = top; y < VH; y += 12) { P(g, x, y, 1, 12, ink); P(g, x + 10, y, 1, 12, ink); g.strokeStyle = ink; g.lineWidth = .6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10, y + 12); g.stroke(); }
      P(g, x - 70, top - 6, 150, 3, col); P(g, x - 70, top - 6, 150, .6, ink); for (let j = x - 70; j < x + 80; j += 8) { g.beginPath(); g.moveTo(j, top - 3); g.lineTo(j + 4, top - 6); g.stroke(); }
      P(g, x - 60, top - 3, 12, 8, '#a8a8a8'); P(g, x - 3, top - 2, 16, 10, col); P(g, x + 60, top - 3, 1, 40 + rr() * 60, ink); }
  }
  return A;
}
function skyDrawBack(g, camX, t) { const A = K1.art;
  const gr = g.createLinearGradient(0, 0, 0, VH); gr.addColorStop(0, '#4a94dc'); gr.addColorStop(.5, '#9acbee'); gr.addColorStop(1, '#e4eef2'); g.fillStyle = gr; g.fillRect(0, 0, VW, VH);
  g.drawImage(A.far.c, Math.round(-camX * A.far.f), 0);
  for (let k = 0; k < 6; k++) { const x = ((k * 197 - camX * .12 + t * 4) % (VW + 160) + VW + 160) % (VW + 160) - 80; lcloud(g, x, 40 + (k * 53) % 90, 40 + (k % 3) * 18); }
  g.drawImage(A.below.c, Math.round(-camX * A.below.f), 196);
  g.drawImage(A.cranes.c, Math.round(-camX * A.cranes.f), 0);
  const hz = g.createLinearGradient(0, 196, 0, VH); hz.addColorStop(0, 'rgba(232,240,246,.85)'); hz.addColorStop(.25, 'rgba(200,220,240,.25)'); hz.addColorStop(1, 'rgba(30,50,90,.32)'); g.fillStyle = hz; g.fillRect(0, 196, VW, VH - 196);
  g.fillStyle = 'rgba(30,40,60,.18)'; for (let x = (-camX * .3) % 23; x < VW; x += 23) g.fillRect(Math.round(x), 214, 1, VH - 214); }   // the long way down

// ---- every frame on the sky screen ------------------------------------------------------------------------------------
function skyTick(dt) {
  SKY.t += dt; const d = SKY.D;
  for (const b of scr.boxes) if (b.deck) { b.px = b.x; b.ph = b.h; }
  for (const P of SKY.P) puzzleTick(P, dt);
  if (SKY.tilt > SKY.tiltTo) { SKY.tilt = Math.max(SKY.tiltTo, SKY.tilt - dt * .8); applyTilt(); if (SKY.tilt === 0) { WORLD.shake = 4; clank(.8); } }
  // whatever stands on a moving deck goes with it
  for (const b of scr.boxes) if (b.deck && (b.x !== b.px || b.h !== b.ph)) { const dx = b.x - b.px, dh = b.h - b.ph, on = o => o.x > b.px - 2 && o.x < b.px + b.w + 2 && Math.abs((o.y || 0) - b.ph) < 3;
    for (const p of players) if (p.fall <= 0 && on(p)) { p.x += dx; p.y += dh; p.vy = Math.min(p.vy, 0); }
    for (const o of BREAK) if (!o.held && !o.thrown && on(o)) { o.x += dx; o.y += dh; }
    for (const e of enemies) if (on(e)) { e.x += dx; e.y += dh; } }
  // loose things over the void fall
  for (const o of BREAK) if (!o.held && !o.thrown && !o.broken) { const gy = ground(o.x, o.z); if (gy < -900 || o.y > gy + .5) { o.fallV = (o.fallV || 0) - GRAV * dt; o.y += o.fallV * dt; if (gy > -900 && o.y <= gy) { o.y = gy; o.fallV = 0; } if (o.y < -320) o.broken = true; } }
  // the safe spots stay on solid decks; the computer partner keeps up across the gaps
  for (const p of players) if (p.safe && ground(p.safe[0], p.safe[1]) < -900) { const n = nearestDeck(p.safe[0]); if (n) p.safe = [Math.max(n.x + 16, Math.min(n.x + n.w - 16, p.safe[0])), p.safe[1]]; }
  supplyTick(dt);
  for (const h of SKY.hooks) { if (h.d) h.x = h.d.x + h.off; h.t += dt; if (h.t > 8) h.done = true; h.y -= 150 * dt; const gy = Math.max(-999, ground(h.x, h.z)); if (h.y <= gy + .5 && gy > -900) { h.done = true; const K = BK[h.k]; BREAK.push({ k: h.k, x: h.x, z: h.z, ...K, hp: K.hp, max: K.hp, y: gy, vx: 0, vy: 0, held: null, thrown: false, rot: 0, flash: 0, id: Math.random() }); clank(.3); } }
  SKY.hooks = SKY.hooks.filter(h => !h.done);
  for (const b of SKY.birds) if (b.fly) { b.fly += dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 20 * dt; }
  if (SKY.ship) { SKY.ship.x += SKY.ship.vx * dt; }
}
function supplyTick(dt) {
  SKY.supply.forEach((s, i) => {
    if (s.boss ? !(WORLD.mmf && !WORLD.mmf.gone && WORLD.mmf.state !== 'leave') : SKY.P[s.P].done) return;
    const b = s.d, n = BREAK.filter(o => !o.broken && !o.thrown && (o.held || (o.x > b.x && o.x < b.x + b.w && Math.abs(o.y - b.h) < 3))).length + SKY.hooks.filter(h => h.x > b.x && h.x < b.x + b.w).length;
    if (n >= (s.min || (s.boss ? 2 : 1))) { SKY.supT[i] = 0; return; }
    if (Math.abs(b.h) > 3 || b.x !== b.px || b.h !== b.ph || b.x + b.w < camX - 20 || b.x > camX + VW + 20) return;
    SKY.supT[i] += dt; if (SKY.supT[i] > (s.boss ? 2.5 : 1.6)) { SKY.supT[i] = 0; const off = Math.min(b.w - 20, s.off + (Math.random() - .5) * 60); SKY.hooks.push({ d: b, off, x: b.x + off, z: 30 + Math.random() * 60, y: 260, t: 0, k: Math.random() < .6 ? 'toolbox' : 'paintcan' }); }
  });
}
const sstep = u => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);
function puzzleTick(P, dt) {
  if (P.k === 'cw') { P.cx = P.swing && !P.done ? P.x + Math.sin(SKY.t * 2.4) * 46 : P.cx ?? P.x;
    if (P.done) { P.fv -= GRAV * dt; P.fy += P.fv * dt; const D = P.deck; if (D.h > 0) { D.h = Math.max(0, D.h - 110 * dt); if (D.h === 0) { WORLD.shake = 4; clank(.9); puff(D.x + D.w / 2, 60, 6, 0, 1.4); } } } }
  else if (P.k === 'btn' && P.done) { const u0 = P.t; P.t += dt; const D = P.deck; D.x = P.from + (P.to - P.from) * sstep(P.t / 2); if (u0 < 2 && P.t >= 2) { WORLD.shake = 4; clank(.9); } }
  else if (P.k === 'bkt') { const D = P.deck, want = 160 * (1 - P.fill / P.need); if (D.h > want) { D.h = Math.max(want, D.h - 70 * dt); if (D.h === 0 && want === 0) { WORLD.shake = 3; clank(.8); } } }
  else if (P.k === 'bill' && P.done) { if (P.ft < 1) { P.ft = Math.min(1, P.ft + dt * 1.2); if (P.ft >= 1) { scr.boxes.push(skyDeck('BB', 2580, 300, 0, { board: 1 })); WORLD.shake = 10; noise(.5, .14); clank(1); puff(2730, 60, 10, 0, 1.6); } } }
}
// a thrown thing over the sky screen: puzzle targets first, then a deck, then the long way down
const inWin = (b, x0, x1, y0, y1) => b.x > x0 && b.x < x1 && b.y > y0 && b.y < y1;
function skyThrown(b) {
  for (const P of SKY.P) if (!P.done && puzzleHit(P, b)) return;
  const gy = ground(b.x, b.z);
  const onBeam = () => { const P = SKY.P[3]; if (!P.done && b.x > 1720 && b.x < 2036) scarePigeons(P, b); };   // anything that hits the beam shakes it: the pigeons fly off
  if (gy > -900 && b.y <= gy && b.y > gy - 24) { b.y = gy; onBeam(); smash(b, Math.sign(b.vx)); return; }
  if (scr.boxes.some(o => b.x > o.x - 3 && b.x < o.x + o.w + 3 && b.z > o.z - 2 && b.z < o.z + o.d + 2 && b.y < o.h - 3 && (o.seg === undefined || b.y > o.h - 14))) { onBeam(); smash(b, Math.sign(b.vx)); return; }   // the raised beam is a thin plank: things fly under it
  if (b.y < -260 || b.x < camX - 80 || b.x > camX + VW + 80) { b.broken = true; if (b.y < -260) beep(90, .12, 'triangle', .02, -40); }
}
function puzzleHit(P, b) {
  const say = (fr, en) => pop(b.x, b.z, b.y + 10, LANG === 'fr' ? fr : en, '#ffd23f');
  switch (P.k) {
    case 'cw': { const cx = P.cx ?? P.x; if (!inWin(b, cx - 20, cx + 20, P.y0, P.y1)) return false; P.done = true; P.fv = 40; P.fy = 0; smash(b, Math.sign(b.vx)); say('CLONK !', 'CLONK!'); clank(1); WORLD.shake = 3; return true; }
    case 'btn': if (!inWin(b, P.x - 18, P.x + 18, P.y0, P.y1)) return false; P.done = true; smash(b, Math.sign(b.vx)); say('DING !', 'DING!'); beep(1320, .25, 'triangle', .05, 0); beep(990, .3, 'triangle', .04, 0); return true;
    case 'bkt': { const by = -P.fill * 14; if (!inWin(b, P.x - 32, P.x + 32, by - 34, by + 165)) return false; P.fill++; b.broken = true; say(P.fill >= P.need ? (LANG === 'fr' ? 'PLEIN !' : 'FULL!') : `${P.fill}/${P.need}`, ''); if (P.fill >= P.need) P.done = true; clank(.5); puff(P.x, 40, 4, 0, .8); return true; }
    case 'pig': { const far = beamH(1990); if (!inWin(b, 1880, 2032, -999, far + 260)) return false; scarePigeons(P, b); return false; }
    case 'bill': for (let k = 0; k < 2; k++) if (!P.cut[k] && inWin(b, P.x - 34, P.x + 24, k ? (P.cut[0] ? 50 : 100) : 36, k ? 230 : 100)) { P.cut[k] = 1; smash(b, Math.sign(b.vx)); say('CLAC !', 'SNAP!'); beep(220, .1, 'sawtooth', .04, -120); if (P.cut[0] && P.cut[1]) { P.done = true; P.ft = 0; } return true; } return false;
  }
  return false;
}
function scarePigeons(P, b) { P.done = true; SKY.tiltTo = 0; for (const q of SKY.birds) { q.fly = .01; q.vx = (Math.random() - .3) * 120; q.vy = 60 + Math.random() * 60; } pop(b.x, b.z, b.y + 10, LANG === 'fr' ? 'ROUCOU !' : 'COO!', '#ffd23f'); for (let k = 0; k < 4; k++) beep(700 + k * 90, .08, 'square', .02, 300); }
function clank(v = 1) { try { const t = SND.now(); tone(t, 520, 380, .25, .05 * v, 'square'); tone(t, 1240, 900, .3, .025 * v, 'triangle'); nz(t, .12, .05 * v, 900, 0, 'bandpass', 2); } catch (e) { beep(300, .1, 'square', .04 * v, -80); } }

// the computer partner hops the gaps with you (a computer that falls into the void every ten seconds is no fun)
function skyPost(dt) {
  if (!CPU || !players[1]) return; const p = players[0], q = players[1];
  if (q.hopT > 0) { q.hopT -= dt; const u = 1 - Math.max(0, q.hopT) / .55; q.x = q.hx0 + (q.hx1 - q.hx0) * u; q.z = q.hz0 + (q.hz1 - q.hz0) * u; q.y = q.hy0 + (q.hy1 - q.hy0) * u + Math.sin(u * Math.PI) * 58; q.vy = 0; if (q.hopT <= 0) q.y = q.hy1; return; }
  if (p.ko > 0 || q.ko > 0 || p.fall > 0 || q.hold) return;
  const dp = deckUnder(p.x, p.y), dq = deckUnder(q.x, q.y);
  if (dp && Math.abs(dp.h) < 3 && dp !== dq && (dq || q.fall > 0) && !(dp.seg !== undefined && SKY.tilt > 0)) { if (q.fall > 0) return;
    q.hopT = .55; q.hx0 = q.x; q.hz0 = q.z; q.hy0 = q.y; q.hx1 = Math.max(dp.x + 16, Math.min(dp.x + dp.w - 16, p.x - p.face * 30)); q.hz1 = Math.max(6, Math.min(DEPTH - 6, p.z + 22)); q.hy1 = dp.h; q.face = Math.sign(q.hx1 - q.x) || q.face; SFX.jump(q.w.id, q.x); }
  if (q.fall > 0 && dp) q.safe = [Math.max(dp.x + 16, Math.min(dp.x + dp.w - 16, p.x - p.face * 26)), p.z];
}

// ---- drawing the sky screen -----------------------------------------------------------------------------------------
function skyBack() { if (!scr.sky) return;
  const P = SKY.P;
  craneTower(P[1]);
  for (const b of scr.boxes) if (b.deck && b.seg === undefined && !b.board) drawDeck(b);
  drawBeam(); drawBillboard(P[5]);
  for (const b of scr.boxes) if (b.board) drawDeck(b, true);
  drawCW(P[0]); drawCW(P[4]); drawBucket(P[2]);
}
function cable(x0, y0, x1, y1, w = .6) { g.strokeStyle = '#2a2e3a'; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
function drawDeck(b, board) { const x = Math.round(b.x - camX); if (x > VW + 60 || x + b.w < -60) return;
  const top = sy(0, b.h), fr = sy(DEPTH, b.h), th = 7;
  if (!board) { const hx = x + b.w / 2, hy = top - 120; for (const [cx, cy] of [[x + 3, top], [x + b.w - 3, top], [x + 3, fr], [x + b.w - 3, fr]]) cable(cx, cy, hx, hy); cable(hx, hy, hx, -20, .9); lr(g, hx - 5, hy - 9, 10, 10, '#e8b830'); g.fillStyle = LCI; g.fillRect(hx - 1, hy + 1, 2, 3); }
  if (!board) { for (let k = 4; k < b.w; k += 26) { g.fillStyle = '#e8b830'; g.fillRect(x + k, top - 16, 2, 16); } g.fillStyle = '#e8b830'; g.fillRect(x, top - 17, b.w, 2.5); g.strokeStyle = LCI; g.lineWidth = .5; g.strokeRect(x + .5, top - 17, b.w - 1, 2.5); }   // the far rail
  g.fillStyle = board ? '#f4e8d8' : '#aab4bc'; g.fillRect(x, top, b.w, fr - top);
  g.fillStyle = 'rgba(26,30,46,.16)'; if (!board) { for (let k = 6; k < b.w; k += 8) g.fillRect(x + k, top, .6, fr - top); for (let z = 6; z < DEPTH; z += 12) g.fillRect(x, sy(z, b.h), b.w, .6); }
  else { g.fillStyle = '#e8a0c0'; g.fillRect(x + 10, top + 20, b.w - 20, 40); g.fillStyle = '#8a2a4a'; g.font = 'bold 18px Georgia'; g.fillText('CALVE-HAIR', x + 70, top + 48); }
  g.fillStyle = board ? '#c8963a' : '#e8b830'; g.fillRect(x, fr, b.w, th); if (!board) { g.fillStyle = LCI; for (let k = 0; k < b.w - 6; k += 12) { g.beginPath(); g.moveTo(x + k, fr + th); g.lineTo(x + k + 5, fr); g.lineTo(x + k + 9, fr); g.lineTo(x + k + 4, fr + th); g.fill(); } }
  g.strokeStyle = LCI; g.lineWidth = .8; g.strokeRect(x + .5, top + .5, b.w - 1, fr - top + th - 1); g.beginPath(); g.moveTo(x, fr); g.lineTo(x + b.w, fr); g.stroke();
  if (!board) { g.lineWidth = .7; g.beginPath(); for (let k = 0; k + 20 <= b.w; k += 20) { g.moveTo(x + k, fr + th); g.lineTo(x + k + 10, fr + th + 9); g.lineTo(x + k + 20, fr + th); } g.moveTo(x, fr + th + 9); g.lineTo(x + b.w, fr + th + 9); g.stroke(); }
}
function drawBeam() { const x0 = 1728 - camX, x1 = 2028 - camX; if (x1 < -40 || x0 > VW + 40) return;
  const f0 = beamH(1728), f1 = beamH(2028), th = 7, px = PIVOT - camX, py = sy(0, beamH(PIVOT)) - 110;
  cable(px, sy(0, 0), px, py); cable(px, sy(DEPTH, 0), px, py); cable(px, py, px, -20, .9); lr(g, px - 5, py - 9, 10, 10, '#e8b830');
  g.fillStyle = '#aab4bc'; g.beginPath(); g.moveTo(x0, sy(0, f0)); g.lineTo(x1, sy(0, f1)); g.lineTo(x1, sy(DEPTH, f1)); g.lineTo(x0, sy(DEPTH, f0)); g.closePath(); g.fill(); g.strokeStyle = LCI; g.lineWidth = .8; g.stroke();
  g.fillStyle = '#e8b830'; g.beginPath(); g.moveTo(x0, sy(DEPTH, f0)); g.lineTo(x1, sy(DEPTH, f1)); g.lineTo(x1, sy(DEPTH, f1) + th); g.lineTo(x0, sy(DEPTH, f0) + th); g.closePath(); g.fill(); g.stroke();
  lpoly(g, [[px - 8, sy(DEPTH, 0) + th + 12], [px + 8, sy(DEPTH, 0) + th + 12], [px, sy(DEPTH, beamH(PIVOT)) + th]], '#8a8a92');
  for (const b of SKY.birds) { const bx = b.x - camX, by = b.fly ? sy(60, beamH(b.x) * 0) - 60 - b.y : sy(50, beamH(b.x)); pigeon(bx, by - (b.fly ? 0 : Math.abs(Math.sin(time * 3 + b.ph)) * 1.5), b.fly ? Math.sign(b.vx) || 1 : (b.ph % 2 > 1 ? 1 : -1), b.fly); }
}
function pigeon(x, y, f, fly) { g.fillStyle = '#8a8e9a'; g.strokeStyle = LCI; g.lineWidth = .6; g.beginPath(); g.ellipse(x, y - 4, 5, 3.5, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(x + f * 4, y - 8, 2.4, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#5aa07a'; g.fillRect(x + f * 2.5, y - 6.5, 2, 1.5); g.fillStyle = '#e8a040'; g.fillRect(x + f * 6, y - 8.5, 2 * f, 1);
  if (fly) { const w = Math.sin(time * 30) * 6; g.beginPath(); g.moveTo(x - 2, y - 5); g.lineTo(x - 8, y - 5 - w); g.lineTo(x + 2, y - 4); g.fill(); g.stroke(); } }
function craneTower(P) { const tx = P.x - camX; if (tx < -200 || tx > VW + 200) return;
  const cabY = sy(0, 96), base = VH + 10, ink = LCI;
  for (let y = cabY + 20; y < base; y += 14) { g.fillStyle = '#e8b830'; g.fillRect(tx - 8, y, 2, 14); g.fillRect(tx + 6, y, 2, 14); cable(tx - 7, y, tx + 7, y + 14, .7); cable(tx + 7, y, tx - 7, y + 14, .7); }
  const D = P.deck, jx = D.x + D.w / 2 - camX;
  g.fillStyle = '#e8b830'; g.fillRect(Math.min(tx, jx) - 4, cabY - 22, Math.abs(jx - tx) + 8, 4); g.strokeStyle = ink; g.lineWidth = .6; g.strokeRect(Math.min(tx, jx) - 4, cabY - 22, Math.abs(jx - tx) + 8, 4);
  lr(g, tx - 16, cabY - 18, 32, 38, '#e8b830'); lr(g, tx - 11, cabY - 13, 22, 12, '#bfe0f0');
  const on = !P.done && Math.floor(time * 3) % 2; g.fillStyle = OUT; g.beginPath(); g.arc(tx, cabY + 9, 7.5, 0, 7); g.fill(); g.fillStyle = P.done ? '#5ac85a' : on ? '#ff5a3a' : '#c8302a'; g.beginPath(); g.arc(tx, cabY + 9, 6.5, 0, 7); g.fill();
  if (!P.done) { g.fillStyle = '#ffffff'; g.fillRect(tx - 1, cabY + 4, 2, 6); g.fillRect(tx - 1, cabY + 11, 2, 2); } }
function drawCW(P) { const cx = (P.cx ?? P.x) - camX; if (cx < -60 || cx > VW + 60) return;
  const top = sy(50, P.y1), bot = sy(50, P.y0) + (P.done ? -P.fy : 0);
  if (!P.done) cable(P.swing ? P.x - camX : cx, -20, cx, top - 4, .9); else cable(cx, -20, cx, top - 30 - Math.min(40, P.fy * .1), .9);
  if (P.done && P.fy < -260) return;
  const y0 = P.done ? top - P.fy : top; lr(g, cx - 17, y0, 34, bot - top, '#9a9ca2'); g.fillStyle = LCI; g.font = 'bold 9px sans-serif'; g.textAlign = 'center'; g.fillText('5 T', cx, y0 + (bot - top) / 2 + 3); g.textAlign = 'left';
  g.strokeStyle = LCI; g.lineWidth = 1.2; g.beginPath(); g.arc(cx, y0 - 3, 3, 0, 7); g.stroke(); }
function drawBucket(P) { const x = P.x - camX; if (x < -60 || x > VW + 60) return;
  const by = sy(50, -P.fill * 14 + 2); cable(x, -20, x, by - 34, .9); cable(x, by - 34, x - 15, by - 22); cable(x, by - 34, x + 15, by - 22);
  lpoly(g, [[x - 17, by - 24], [x + 17, by - 24], [x + 12, by], [x - 12, by]], '#8a9098'); g.fillStyle = '#c8a870'; g.fillRect(x - 15, by - 24, 30, Math.min(20, P.fill * 6)); g.fillStyle = LCI; for (let k = 0; k < P.need; k++) { g.globalAlpha = k < P.fill ? 1 : .3; g.fillRect(x - 9 + k * 7, by - 10, 5, 5); } g.globalAlpha = 1; }
function drawBillboard(P) { const bx = P.x - camX; if (bx < -340 || bx > VW + 60 || P.ft >= 1) return;
  const a = P.ft < 0 ? 0 : P.ft * P.ft * Math.PI / 2, base = sy(60, 0), L = 300;
  if (!P.done) for (let k = 0; k < 2; k++) { const ky = sy(50, k ? 150 : 72), ax = bx - 46 - k * 34;   // two guy ropes, each with a red knot to hit
    if (!P.cut[k]) { cable(bx - 14, ky, ax, -20, .9); g.fillStyle = '#c8302a'; g.beginPath(); g.arc(bx - 14, ky, 6, 0, 7); g.fill(); g.strokeStyle = LCI; g.lineWidth = .9; g.stroke(); if (Math.floor(time * 3 + k) % 2) { g.strokeStyle = '#ffd23f'; g.lineWidth = 1; g.beginPath(); g.arc(bx - 14, ky, 10, 0, 7); g.stroke(); } }
    else cable(ax, -20, ax + 6 + Math.sin(time * 3 + k) * 4, 46, .9); }
  g.save(); g.translate(bx, base); g.rotate(a);
  lr(g, -16, -L, 32, L, '#f4e8d8'); lr(g, -12, -L + 24, 24, L - 48, '#e8a0c0'); lr(g, -20, -10, 7, 10, '#c8963a'); lr(g, 13, -10, 7, 10, '#c8963a');
  g.save(); g.translate(0, -L / 2); g.rotate(-Math.PI / 2); g.fillStyle = '#8a2a4a'; g.font = 'bold 15px Georgia'; g.textAlign = 'center'; g.fillText('CALVE-HAIR', 0, 5); g.font = 'italic 8px Georgia'; g.fillText(LANG === 'fr' ? 'la Tour · bientôt' : 'the Tower · soon', 0, 15); g.restore();
  g.restore(); }
function skyDrawFront(g0, camX, t) {
  for (const h of SKY.hooks) { const x = h.x - camX, y = sy(h.z, h.y); cable(x, -20, x, y - 20, .9); g.strokeStyle = LCI; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y - 17, 3, 0, Math.PI); g.stroke(); g.save(); g.translate(x, y); const K = BK[h.k]; BK3_DRAW[h.k](g, K.dw || K.w, K.dh || K.h, K.col, shadeC(K.col, -.3), shadeC(K.col, .2), h); g.restore(); }
  for (const b of SKY.birds) if (b.fly && b.y < 260) pigeon(b.x - camX, sy(60, 0) - 60 - b.y, Math.sign(b.vx) || 1, true);
  if (SKY.ship) drawShip(SKY.ship.x - camX, SKY.ship.y);
}
function drawShip(x, y) { // Villen-Hüüs's ship, passing low to pick her up
  g.save(); g.translate(x, y); lpoly(g, [[-70, 0], [60, -6], [84, 4], [60, 14], [-60, 16]], '#3a2a4a'); lpoly(g, [[-10, -6], [30, -18], [50, -6]], '#6a5a8a'); g.fillStyle = '#ffd23f'; for (let k = 0; k < 4; k++) g.fillRect(-40 + k * 22, 4, 6, 4);
  g.fillStyle = `rgba(255,${150 + Math.random() * 80 | 0},60,.9)`; g.beginPath(); g.moveTo(-70, 2); g.lineTo(-92 - Math.random() * 10, 7); g.lineTo(-70, 12); g.fill(); g.restore(); }

// ---- Madame Metal Face: three strikes ----------------------------------------------------------------------------------
ETYPES.mmf = { hp: 3, spd: 120, reach: 26, dmg: 1, wind: .3, cd: 1 };
const MMF_SAY = { block: [['Non.', 'No.'], ['Refusé.', 'Denied.'], ['Mm-mm.', 'Mm-mm.']], noted: [['Noté.', 'Noted.'], ['Noté. Encore.', 'Noted. Again.']], dodge: [['Prévisible.', 'Predictable.'], ['Trop tôt.', 'Too early.']],
  strike: [['Hm.', 'Hm.'], ['Fâcheux.', 'Unfortunate.'], ['Bon. J’ai un rendez-vous.', 'Right. I have an appointment.']] };
function mSay(k, i) { const a = MMF_SAY[k], ln = a[i ?? ((Math.random() * a.length) | 0)]; return LANG === 'fr' ? ln[0] : ln[1]; }
function mmfSpawn(e) { if (e.type !== 'mmf') return; e.look = MADAME; e.hp = 3; e.max = 3; e.strikes = 0; e.state = 'drop'; e.x = 3560; e.z = 60; e.y = 280; e.vy = -30; e.face = -1; e.open = 0; e.cd = 1.4; e.spinA = 0; WORLD.boss = e; WORLD.mmf = e; musicPlay(LEVELS[LEVEL].id, true); }
function mmfTarget(e) { let best = null, bd = 1e9; for (const p of players) if (p.ko <= 0 && p.fall <= 0) { const d = Math.abs(p.x - e.x) + Math.abs(p.z - e.z) * .5; if (d < bd) { bd = d; best = p; } } return best || players[0]; }
function mmfBounds() { const K = SKY.D.K; return K ? [K.x + 16, K.x + K.w - 16] : [camX + 16, camX + VW - 16]; }
function mmfHop(e, p) { const [lo, hi] = mmfBounds(); let tx = e.x + (e.x < p.x ? -1 : 1) * (110 + Math.random() * 80); if (tx < lo || tx > hi) tx = p.x + (e.x < p.x ? 1 : -1) * (80 + Math.random() * 40);   // cornered: over your head
  tx = Math.max(lo, Math.min(hi, tx)); e.vx = (tx - e.x) / .72; e.vy = 360; e.y = Math.max(e.y, .5); e.state = 'hop'; e.inv = .45; e.face = Math.sign(p.x - tx) || e.face; e.spinA = 0; SFX.jump('spora', e.x); }
function updateMMF(e, dt) {
  e.open = Math.max(0, e.open - dt); e.t2 = (e.t2 || 0) - dt; e.heldBy = null; e.frozen = 0; e.burn = 0; e.flee = 0;
  const [lo, hi] = mmfBounds(), clamp = () => { e.x = Math.max(lo, Math.min(hi, e.x)); e.z = Math.max(6, Math.min(DEPTH - 6, e.z)); }, p = mmfTarget(e);
  if (e.state === 'drop') { e.vy -= GRAV * .45 * dt; e.y += e.vy * dt; if (e.y <= 0) { e.y = 0; e.vy = 0; e.state = 'intro'; e.t2 = 3.2; WORLD.shake = 3; puff(e.x, e.z, 5, 0, 1.2); if (STORY3 && STORY3.mmfIntro) playLines(STORY3.mmfIntro, false); } return; }
  if (e.state === 'intro') { e.face = Math.sign(p.x - e.x) || -1; if (e.t2 <= 0) { e.state = 'idle'; e.cd = .6; } return; }
  if (e.state === 'leave') { mmfLeave(e, dt); return; }
  if (e.state === 'hurt') { e.x += e.vx * dt; e.vx *= Math.pow(.02, dt); clamp(); if (e.t2 <= 0) mmfHop(e, p); return; }
  if (e.state === 'block') { e.face = Math.sign(p.x - e.x) || e.face; if (e.t2 <= 0) { e.state = 'idle'; e.cd = Math.min(e.cd, .5); } return; }
  if (e.state === 'counter') { e.spinA += dt * 28 * e.face; const q = e.ctr; if (!e.hitDone && e.t2 < .22) { e.hitDone = 1; if (q && q.ko <= 0 && Math.abs(q.x - e.x) < 46 && Math.abs(q.z - e.z) < 20) { if (hitPlayer(q, 1, e.face, e)) { q.vx = e.face * 320; WORLD.shake = 4; } } }
    if (e.t2 <= 0) { e.state = 'idle'; e.spinA = 0; e.cd = .7; } return; }
  if (e.state === 'hop') { e.x += e.vx * dt; e.vy -= GRAV * dt; e.y += e.vy * dt; e.spinA += dt * 13 * e.face; clamp(); if (e.y <= 0) { e.y = 0; e.vy = 0; e.state = 'idle'; e.spinA = 0; jolt(e, 2, -2); puff(e.x, e.z, 2, 0, .8); } return; }
  if (e.state === 'wind') { e.face = Math.sign(p.x - e.x) || e.face; if (e.t2 <= 0) mmfAttack(e, p); return; }
  if (e.state === 'spin') { e.x += e.vx * dt; e.spinA += dt * 26 * Math.sign(e.vx); clamp();
    for (const q of players) if (q.ko <= 0 && !e.hitSet.has(q) && Math.abs(q.x - e.x) < 30 && Math.abs(q.z - e.z) < 16 && q.y < 40) { e.hitSet.add(q); if (hitPlayer(q, 1, Math.sign(e.vx), e)) { q.vx = Math.sign(e.vx) * 330; WORLD.shake = 4; } }
    if (e.t2 <= 0 || e.x <= lo || e.x >= hi) { e.state = 'open'; e.open = 1; e.t2 = 1; e.vx = 0; e.spinA = 0; e.tired = 'spin'; } return; }
  if (e.state === 'dive') { if (!e.diving) { e.vy -= GRAV * dt; e.y += e.vy * dt; e.x += e.vx * dt; e.spinA += dt * 12 * e.face; if (e.vy <= 0) { e.diving = true; const tx = Math.max(lo, Math.min(hi, p.x)); e.dvx = (tx - e.x) / .3; e.dvz = (p.z - e.z) / .3; e.dvy = -e.y / .3; e.face = Math.sign(tx - e.x) || e.face; e.spinA = 0; SFX.swish('heavy', 1, e.x); } }
    else { e.x += e.dvx * dt; e.z += e.dvz * dt; e.y += e.dvy * dt; if (e.y <= 0) { e.y = 0; e.diving = false; e.state = 'open'; e.open = 1.2; e.t2 = 1.2; e.tired = 'dive'; WORLD.shake = 6; fx.push({ k: 'ring', x: e.x, z: e.z, max: 60, t: .4, col: '#e8f0ff' }); puff(e.x, e.z, 6, 0, 1.4);
      for (const q of players) if (q.ko <= 0 && Math.abs(q.x - e.x) < 38 && Math.abs(q.z - e.z) < 22 && q.y < 30) { if (hitPlayer(q, 1, Math.sign(q.x - e.x) || 1, e)) { q.vy = 160; q.y = Math.max(q.y, 1); } } } }
    clamp(); return; }
  if (e.state === 'memo' || e.state === 'open') { if (e.t2 <= 0) { if (e.state === 'memo') { e.state = 'open'; e.open = .7; e.t2 = .7; e.tired = 'memo'; } else { e.state = 'idle'; e.cd = .5 + Math.random() * .6; } } return; }
  // idle: she keeps her distance and skips about, faster than anyone
  const dx = p.x - e.x, ad = Math.abs(dx); e.face = Math.sign(dx) || e.face; e.cd -= dt;
  const want = ad < 74 ? -Math.sign(dx || 1) : ad > 170 ? Math.sign(dx) : 0; e.x += want * ETYPES.mmf.spd * dt; e.z += Math.sign(p.z - e.z) * Math.min(Math.abs(p.z - e.z), 50 * dt); e.walk = (e.walk || 0) + Math.abs(want) * dt * 14; e.mv = Math.abs(want); clamp();
  if (ad < 36 && Math.random() < dt * 2.5) { mmfHop(e, p); return; }
  if (e.cd <= 0) { const r = Math.random(); e.act = ad > 120 && r < .45 ? 'memo' : ad < 160 && r < .78 ? 'spin' : 'dive'; e.state = 'wind'; e.t2 = e.act === 'memo' ? .5 : e.act === 'spin' ? .4 : .32; jolt(e, 1.4, -1.6, -1); }
}
function mmfAttack(e, p) {
  if (e.act === 'memo') { const tg = players.filter(q => q.ko <= 0); for (let k = 0; k < 3; k++) fx.push({ k: 'memo', x: e.x + e.face * 10, z: e.z + (k - 1) * 14, y: 58, vx: e.face * 140, vy: 30 + k * 26, vz: (k - 1) * 30, t: 3.6, tgt: tg[k % tg.length] || p, from: e, rot: 0 }); e.state = 'memo'; e.t2 = .35; SFX.swish('punch', .8, e.x); beep(1600, .06, 'triangle', .03, -600); }
  else if (e.act === 'spin') { e.state = 'spin'; e.vx = e.face * 410; e.t2 = .44; e.hitSet = new Set(); SFX.swish('heavy', 1, e.x); }
  else { e.state = 'dive'; e.vy = 440; e.vx = Math.sign(p.x - e.x) * 70; e.diving = false; e.y = Math.max(e.y, .5); SFX.jump('spora', e.x); }
}
function mmfHit(e, dmg, dir, src) {
  if (e.state === 'drop' || e.state === 'intro' || e.state === 'leave' || e.inv > 0) return false;
  const thrown = HITKIND === 'throw', dashed = src && src.w && src.dash > 0;
  if (thrown || (dashed && e.open > 0)) { mmfStrike(e, dir, src); return true; }
  if (!src || !src.w) return false;
  if (dashed) { const p = src; e.vx = (p.x + p.face * 70 - e.x) / .6; e.vy = 330; e.y = Math.max(e.y, .5); e.state = 'hop'; e.inv = .5; e.spinA = 0; if (Math.random() < .6) quip(e, mSay('dodge')); return false; }   // a charge she saw coming: she vaults right over it
  const busy = ['wind', 'spin', 'dive', 'memo', 'open', 'hop', 'hurt', 'counter'].includes(e.state);   // mid-move she just takes punches on the clipboard
  if (busy) { pop(e.x, e.z, e.y + 64, LANG === 'fr' ? 'TOC' : 'TOK', '#e8e0d0'); SFX.impact('punch', .25, e.x); return false; }
  if (src.cs && src.cs.big || src.combo >= 3) { e.state = 'counter'; e.t2 = .42; e.hitDone = 0; e.ctr = src; e.face = Math.sign(src.x - e.x) || e.face; quip(e, mSay('noted')); pop(e.x, e.z, e.y + 80, LANG === 'fr' ? 'NOTÉ.' : 'NOTED.', '#e8e0d0'); return false; }
  e.state = 'block'; e.t2 = .24; e.x += dir * 3; pop(e.x, e.z, e.y + 64, LANG === 'fr' ? 'TOC' : 'TOK', '#e8e0d0'); if (Math.random() < .25) quip(e, mSay('block'), 1.4); SFX.impact('punch', .3, e.x); return false;
}
function mmfStrike(e, dir, src) {
  e.strikes++; e.hp = Math.max(0, 3 - e.strikes); e.flash = .2; e.inv = 1.3; e.state = 'hurt'; e.t2 = .55; e.vx = dir * 240; e.open = 0; e.vy = 0; e.y = 0; e.diving = false;
  WORLD.shake = 7; camPunch(e.x, e.z, 50, .08); HITSTOP = Math.max(HITSTOP, .08); INK_STRONG = true; inkHit(e.x, e.z, e.y + 60, true); INK_STRONG = false;
  pop(e.x, e.z, e.y + 90, 'CLANG !', '#dfe8f4'); sparks(e.x, e.z, e.y + 62, dir, true);
  try { const t = SND.now(); tone(t, 2200, 1900, .6, .06, 'triangle'); tone(t, 3300, 3000, .45, .03, 'sine'); tone(t, 880, 820, .5, .04, 'square'); } catch (err) {}
  for (let k = 0; k < (e.strikes >= 3 ? 5 : 1); k++) fx.push({ k: 'sheet', x: e.x, z: e.z, y: e.y + 46, vx: dir * 30 + (Math.random() - .5) * 60, vy: 50 + Math.random() * 40, t: 3.2, ph: Math.random() * 6 });
  quip(e, mSay('strike', Math.min(2, e.strikes - 1)), e.strikes >= 3 ? 3 : 1.6); if (src && src.meter !== undefined) src.meter = Math.min(100, src.meter + 15);
  if (e.strikes >= 3) { e.state = 'leave'; e.lt = 0; e.inv = 99; fx = fx.filter(f => f.k !== 'memo'); for (const p of players) p.st = []; banner(LANG === 'fr' ? 'TROIS COUPS !' : 'THREE STRIKES!', -1, true, '#ffd23f'); }
}
function mmfLeave(e, dt) { e.lt += dt; e.face = -1;
  if (e.lt > 1.2 && !SKY.ship) SKY.ship = { x: camX + VW + 140, y: 34, vx: -150 };
  if (SKY.ship && !e.tape && SKY.ship.x < e.x + 30) { e.tape = 1; e.tapeT = 0; beep(1800, .3, 'square', .03, -1400); }
  if (e.tape) { e.tapeT += dt; if (e.tapeT > .35) { e.y += 330 * dt; e.x = SKY.ship.x + 10; e.spinA = 0; } if (e.y > 340 && !e.gone) { e.gone = true; e.dead = -1; WORLD.boss = null; WORLD.oscarDownT = time; banner(LANG === 'fr' ? 'ELLE S’ENVOLE AVEC LE ROUAGE !' : 'SHE FLIES OFF WITH THE GEAR!', -1, true, '#ff8a6a'); } } }
// her paper planes home in on you; a papercut makes you bleed
function craneFx(f, dt) {
  if (f.k === 'memo') { const q = f.tgt; if (q && q.ko <= 0) { const tx = q.x - f.x, tz = q.z - f.z, ty = q.y + 40 - f.y, d = Math.hypot(tx, tz, ty) || 1, sp = 150, k = Math.min(1, dt * 2.2); f.vx += (tx / d * sp - f.vx) * k; f.vz += (tz / d * sp - f.vz) * k; f.vy += (ty / d * sp - f.vy) * k; }
    f.x += f.vx * dt; f.z += f.vz * dt; f.y += f.vy * dt; f.rot = Math.atan2(-f.vy, Math.abs(f.vx) + 1);
    for (const p of players) if (p.ko <= 0 && Math.abs(p.x - f.x) < 11 && Math.abs(p.z - f.z) < 10 && Math.abs(p.y + 40 - f.y) < 24) { if (hitPlayer(p, 0, Math.sign(f.vx) || 1, f.from)) addStatus(p, 'bleed'); f.t = 0; break; }
    return true; }
  if (f.k === 'sheet') { f.x += f.vx * dt + Math.sin(f.t * 5 + f.ph) * 20 * dt; f.vy = Math.max(-30, f.vy - 120 * dt); f.y += f.vy * dt; return true; }
  return false;
}
function drawCraneFx(f) {
  if (f.k === 'memo') { const x = f.x - camX, y = sy(f.z, f.y), s = Math.sign(f.vx) || 1; g.save(); g.translate(x, y); g.scale(s, 1); g.rotate(f.rot); lpoly(g, [[7, 0], [-6, -4], [-3, 0], [-6, 3]], '#ffffff'); g.strokeStyle = LCI; g.lineWidth = .5; g.beginPath(); g.moveTo(7, 0); g.lineTo(-3, 0); g.stroke(); g.restore(); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x - 3, sy(f.z, 0), 6, 1.5); return true; }
  if (f.k === 'sheet') { const x = f.x - camX, y = sy(f.z, f.y); g.save(); g.translate(x, y); g.rotate(Math.sin(f.t * 4 + f.ph) * .6); g.globalAlpha = Math.min(1, f.t); lr(g, -4, -5, 8, 10, '#f4f0e8'); g.fillStyle = '#6a6a72'; for (let k = 0; k < 3; k++) g.fillRect(-2.5, -3 + k * 2.4, 5 - (k === 2 ? 2 : 0), .6); g.restore(); return true; }
  return false;
}
function mmfDraw(e) { if (e.type !== 'mmf') return false; if (e.gone) return true;
  const x = e.x - camX, y = sy(e.z, e.y), t = time, L = MADAME; let pose;
  switch (e.state) {
    case 'drop': pose = POSES.dropping(t); break;
    case 'intro': pose = POSES.check(t); break;
    case 'leave': pose = e.tape ? POSES.dropping(t) : POSES.check(t); break;
    case 'wind': pose = e.act === 'memo' ? PZ({ sp: -.1, aF: [2.3, .5], aB: [.5, 1.2], lF: [.3, -.2], lB: [-.3, -.15] }) : e.act === 'spin' ? POSES.crouch(.7) : POSES.crouch(1); break;
    case 'memo': pose = PZ({ sp: .2, aF: [.6, .2], aB: [.4, 1.2], lF: [.4, -.2], lB: [-.3, -.15] }); break;
    case 'spin': case 'counter': pose = POSES.kick(.32); pose.rot = e.spinA; break;
    case 'dive': pose = e.diving ? POSES.kick(.3) : POSES.tumble(t * 2 % 1, 1); if (e.diving) pose.rot = .7 * e.face; else pose.rot = e.spinA; break;
    case 'hop': pose = POSES.tumble(t * 2 % 1, 2); pose.rot = e.spinA; break;
    case 'open': pose = e.tired === 'dive' ? POSES.crouch(.6) : POSES.check(t); break;
    case 'hurt': pose = POSES.hurt(Math.min(1, (.55 - e.t2) / .55), 1); break;
    case 'block': pose = POSES.guard(t, 1); break;
    default: pose = e.mv > .2 ? POSES.run(e.walk / 12, 1.2) : POSES.guard(t, 3);
  }
  const fast = ['spin', 'dive', 'hop', 'counter'].includes(e.state);
  shadow(e.x, e.z, e.y, 10);
  ghostTick(e, fast, FRAME_DT, { wx: e.x, y, face: e.face, pose }); drawGhosts(e, (q, a) => drawRig(g, q.wx - camX, q.y, q.face, RIG_S * 1.15, L, q.pose, time, { alpha: a * 1.4 }));
  const o = { smile: e.state === 'leave' && !e.tape };
  let SK; if (e.flash > .07) drawTinted(c => { SK = drawRig(c, x, y, e.face, RIG_S * 1.15, L, pose, t, o); }, x, y, '#ffffff', .85); else SK = drawRig(g, x, y, e.face, RIG_S * 1.15, L, pose, t, o);
  if (SK && SK.head && e.strikes) { const r = L.b.hr * RIG_S * 1.15, hx = x + e.face * RIG_S * 1.15 * SK.head[0], hy = y + RIG_S * 1.15 * SK.head[1], gx = hx + e.face * r * .55, gy = hy - r * .05;
    if (e.strikes >= 2) { g.fillStyle = '#eef2f8'; g.beginPath(); g.ellipse(hx - e.face * r * .1, hy + r * .25, r * .45, r * .35, 0, 0, 7); g.fill(); g.fillStyle = '#7a8090'; g.fillRect(hx - e.face * r * .4, hy + r * .2, 1, 1); g.fillRect(hx + e.face * r * .15, hy + r * .45, 1, 1); }   // the metal under the skin
    g.strokeStyle = '#ffffff'; g.lineWidth = .6; g.beginPath(); for (let k = 0; k < e.strikes * 2; k++) { const a = k * 1.9 + .4; g.moveTo(gx, gy); g.lineTo(gx + Math.cos(a) * r * .32, gy + Math.sin(a) * r * .32); } g.stroke(); }
  if (e.open > 0 && e.state !== 'hurt' && Math.floor(time * 10) % 2) { g.strokeStyle = '#ffd23f'; g.lineWidth = 1.2; const bx = x, by = y - 36, w = 18, h = 40; for (const [sx, sy0] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(bx + sx * w, by + sy0 * (h - 7)); g.lineTo(bx + sx * w, by + sy0 * h); g.lineTo(bx + sx * (w - 7), by + sy0 * h); g.stroke(); } }
  if (e.tape && SKY.ship && SK) { const hx = x + e.face * RIG_S * 1.15 * SK.aF[2][0], hy = y + RIG_S * 1.15 * SK.aF[2][1]; g.strokeStyle = '#e8c040'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(hx, hy); g.lineTo(SKY.ship.x - camX + 10, SKY.ship.y + 14); g.stroke(); }
  if (e.state === 'wind') { g.fillStyle = '#ff3a2a'; g.font = 'bold 14px sans-serif'; g.textAlign = 'center'; g.fillText('!', x, y - 72); g.textAlign = 'left'; }
  return true;
}
