// ═══ ACT I: Lerna — the flooded marsh, the Hydra under the plane tree, and Hera's crab ═══
// ── generic pieces the later labours reuse ──
// hand-drawn actors (many necks, crabs, birds): a.draw(x, a, camx, world) replaces the baked sprite
const _drawActorL = drawActor; drawActor = function (x, a, camx, world) { if (a.draw) { if (!a.hidden) a.draw(x, a, camx, world); return; } _drawActorL(x, a, camx, world); };
// the torch: a lit branch over the hero's shoulder while he carries one
const _drawActorT = drawActor; drawActor = function (x, a, camx, world) { _drawActorT(x, a, camx, world);
  if (a === G.hero && a.torch && !a.hidden && a.state !== 'dead') { const hx = Math.round(a.x - camx - a.face * 5), hy = Math.round(a.y - 30), f = Math.sin(NOW.t * 23) * 0.8 + Math.sin(NOW.t * 9) * 0.6, big = a.burnT > 0 ? 1.6 : 1, god = world === 'g';
    line(x, hx - a.face, hy + 10, hx + a.face, hy - 4, god ? BLACK_V : '#3a2410', 2.4); line(x, hx - a.face * 0.5, hy + 9, hx + a.face * 1.2, hy - 3, god ? CLAY_V : '#7a5430', 1);
    ell(x, hx + a.face, hy - 7 - f * 0.5, 2.6 * big, 4 * big, god ? WHITE_V : '#f09030'); ell(x, hx + a.face, hy - 6, 1.6 * big, 2.4 * big, god ? GOLD_V : '#ffe080');
    if (Math.random() < 0.3) G.parts.push({ x: a.x - a.face * 4 + (Math.random() - 0.5) * 3, y: a.y - 40, vx: (Math.random() - 0.5) * 10, vy: -30 - Math.random() * 20, life: 0.5, max: 0.5, kind: 'ember' }); } };
// bosses with their own hit rules: a.hitBox(cx, cy, w, h, weapon, dir) is asked first, the lion keeps lionHit
const _meleeHitB = meleeHit; meleeHit = function (cx, cy, w, hh, dmg, dir) { const weapon = G.hero.weapon || 'club', custom = G.actors.filter((a) => a.alive && a.hitBox);
  for (const a of custom) a.hitBox(cx, cy, w, hh, weapon, dir); for (const a of custom) a.ghostNow = true; _meleeHitB(cx, cy, w, hh, dmg, dir); for (const a of custom) a.ghostNow = a.ghostKeep || false; };
// Athena's mercy for bosses with their own state: a.onRespawn() instead of resetting hp
const _heroDownL = heroDown; heroDown = function () { const b = G.actors.find((a) => a.boss && a.alive && a.onRespawn); _heroDownL(); if (b) later(1.3, () => { if (b.alive) b.onRespawn(); }); };
// constellations: several can rise; each has its own shape
const STARSETS = {
  cancer: { pts: [[-10, 4], [-4, -2], [0, -8], [6, -2], [12, 4], [0, 4]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 3]] },
  hydra: { pts: [[-46, -16], [-40, -10], [-30, -8], [-20, -2], [-10, 0], [0, 4], [10, 6], [22, 4], [32, 8], [42, 12]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]] } };
function riseStars(shape, x, y) { (G.starSets || (G.starSets = [])).push({ shape, x, y, t: 0 }); }
const _drawStarsL = drawStars; drawStars = function (x, camx) { _drawStarsL(x, camx); if (!G.starSets) return;
  for (const S of G.starSets) { const t = S.t, rise = ease(clamp01((t - 0.4) / 2.2)), cx = S.x - camx, cy = S.y - rise * 140, sc = 1 + rise, sh = STARSETS[S.shape];
    for (let i = 0; i < 18; i++) { const a = i * 2.39, r = 8 + (i % 4) * 5; if (t < 2.8) { x.globalAlpha = 0.7 * (1 - rise * 0.6); x.fillStyle = i % 2 ? '#ffe8a0' : '#fff8e0'; x.fillRect(Math.round(cx + Math.cos(a) * r * (1 - rise)), Math.round(S.y + Math.sin(a) * r * 0.5 * (1 - rise) - rise * 140 * (0.5 + (i % 3) * 0.25)), 1, 1); } }
    x.globalAlpha = clamp01((t - 1.4) / 1) * (t > 7 ? clamp01((9 - t) / 2) : 1); x.strokeStyle = 'rgba(255,236,170,0.55)'; x.lineWidth = 1; x.beginPath(); for (const [i, j] of sh.links) { x.moveTo(cx + sh.pts[i][0] * sc, cy + sh.pts[i][1] * sc); x.lineTo(cx + sh.pts[j][0] * sc, cy + sh.pts[j][1] * sc); } x.stroke();
    for (const [px, py] of sh.pts) { x.fillStyle = '#fff6d0'; x.fillRect(Math.round(cx + px * sc) - 1, Math.round(cy + py * sc), 3, 1); x.fillRect(Math.round(cx + px * sc), Math.round(cy + py * sc) - 1, 1, 3); } x.globalAlpha = 1; }
  G.starSets = G.starSets.filter((S) => S.t < 9); };

// ── the land: a flooded marsh at dawn, reeds, pools, the fishermen's fire, the plane tree over the spring ──
function paintPool(x, x0, x1, gy, P) { rect(x, x0, gy - 1, x1 - x0, 5, '#2e4a4a'); rect(x, x0 + 2, gy - 1, x1 - x0 - 4, 1, '#5a8480'); for (let k = x0 + 6; k < x1 - 6; k += 9 + ((k * 7) % 5)) rect(x, k, gy + 1 + ((k * 3) % 2), 4, 1, '#6a9a94'); rect(x, x0 - 2, gy - 2, 3, 2, '#5a6a3a'); rect(x, x1 - 1, gy - 2, 3, 2, '#5a6a3a'); }
function paintReeds(x, r, x0, x1, gy, P, tall = 1) { for (let k = x0; k < x1; k += 2 + r() * 3) { const h = (6 + r() * 10) * tall, lean = (r() - 0.5) * 3; line(x, k, gy, k + lean, gy - h, r() < 0.5 ? '#6a7a3a' : '#8a8a48', 1); if (r() < 0.25) rect(x, Math.round(k + lean) - 1, Math.round(gy - h) - 3, 2, 4, '#7a5a30'); } }
function paintHut(x, r, cx, gy, P) { rect(x, cx - 22, gy - 20, 44, 20, '#8a7450'); for (let k = 0; k < 44; k += 3) rect(x, cx - 22 + k, gy - 20, 1, 20, '#7a6444'); poly(x, [[cx - 28, gy - 18], [cx, gy - 36], [cx + 28, gy - 18]], '#a89060'); for (let k = -24; k < 24; k += 3) line(x, cx + k, gy - 18, cx + k * 0.3, gy - 32, '#8a7448', 1); rect(x, cx - 5, gy - 13, 10, 13, '#3a2a1a');
  for (let k = 0; k < 3; k++) { line(x, cx + 34 + k * 5, gy, cx + 34 + k * 5, gy - 14, '#6a5434', 1); } line(x, cx + 32, gy - 13, cx + 46, gy - 13, '#6a5434', 1); for (let k = 0; k < 6; k++) line(x, cx + 34 + k * 2, gy - 13, cx + 33 + k * 2, gy - 8, '#9a8a6a', 1); } // drying nets
LANDS.lerna = { w: 3100, title: { fr: 'Lerne', en: 'Lerna', el: 'Λέρνη' }, music: 'lerna',
  ground: [[0, 218], [300, 222], [600, 226], [900, 224], [1200, 228], [1500, 226], [1800, 222], [2100, 226], [2400, 228], [2700, 230], [3100, 230]],
  plats: [{ x: 840, w: 54, h: 14 }, { x: 1720, w: 60, h: 12, thin: true }],
  sky: (x, w, h, P) => { paintSky(x, w, h, ['#6c8494', '#86a0a8', '#a4b8b4', '#c4ccbc', '#dcd4b4', '#e8d0a0'], 172); paintSun(x, 120, 70, 12, '#fff0c8'); },
  far: (x, w, h, P, r) => paintRange(x, r, w, 184, [[90, 36, 170], [280, 50, 150], [500, 34, 160]], Object.assign({}, P, { far: '#8a9aa0', farL: '#a8b4b4', farD: '#6a7a84', snow: '#a8b4b4', snowD: '#8a9aa0' }), 76),
  mid: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 198, 14, '#7a8a5a', '#94a06a', '#5e6a46'); for (let k = 10; k < w; k += 14 + r() * 18) { const gy = yAt(pts, k); if (r() < 0.3) paintCypress(x, k, gy + 4, 12 + r() * 10, P); else paintReeds(x, r, k, k + 8, gy + 3, P, 0.5); }
    rect(x, 0, 200, w, 3, 'rgba(200,214,210,0.35)'); }, // morning mist on the water
  near: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 210, 8, '#6a7a48', '#84925a', '#52603a', 3); for (let k = 0; k < w; k += 12 + r() * 16) paintReeds(x, r, k, k + 10, yAt(pts, k) + 6, P, 0.8); },
  back: (x, w, h, P, r, L) => { const G = (px) => groundY(L, px); const MP = Object.assign({}, P, { grass: '#6a7a40', grassL: '#84944e', grassD: '#4e5a30', dirt: '#6a5a3a', dirtL: '#86744c' });
    for (let k = 40; k < 2500; k += 60 + r() * 70) { const q = r(); if (q < 0.35) paintReeds(x, r, k, k + 18, G(k), P, 1.6); else if (q < 0.5) paintDeadTree(x, r, k, G(k), 1.1 + r() * 0.4, P); else if (q < 0.62) paintCypress(x, k, G(k) + 2, 40 + r() * 20, P); else if (q < 0.75) paintRocks(x, r, k, G(k), 1.2, P); }
    paintHut(x, r, 2250, G(2250), P); paintPlane(x, r, 2860, G(2860), 1.7, P); paintRocks(x, r, 2960, G(2960), 2.2, P); paintSpring(x, r, 3000, G(3000), P);
    paintGround(x, r, L, MP, 0, w); for (const [a, b] of LANDS.lerna.pools) paintPool(x, a, b, G((a + b) / 2), P); },
  pools: [[470, 560], [1040, 1150], [1590, 1660], [2060, 2180], [2560, 3040]],
  fires: [[2296, 224, 1]], birds: true, butterflies: [], leaves: [], dust: false, smoke: [[2296, 210]], frogs: true };
function inPool(px) { const P = G.land === 'lerna' && LANDS.lerna.pools; return P && P.some(([a, b]) => px > a && px < b); }
// splashes underfoot, frogs that plop, mist
function lernaTick(dt) { if (G.land !== 'lerna') return; const h = G.hero; if (!h) return;
  if (inPool(h.x) && Math.abs(h.vx) > 25 && Math.random() < dt * 9) for (let i = 0; i < 3; i++) G.parts.push({ x: h.x + (Math.random() - 0.5) * 8, y: h.y - 1, vx: (Math.random() - 0.5) * 40, vy: -50 - Math.random() * 40, life: 0.45, max: 0.45, kind: 'shard', col: '#a8d0cc', g: 320 });
  if (h.burnT > 0) h.burnT -= dt; }

// ── crabs: the marsh's own, and Hera's Karkinos ──
CAST.crab = { kind: 'snake', custom: true };
CAST.karkinos = { kind: 'snake', custom: true, god: { name: 'ΚΑΡΚΙΝΟΣ', sz: 1, o: {}, pal: {} } };
function drawCrab(x, a, camx, world) { const px = Math.round(a.x - camx), py = Math.round(a.y), s = a.big ? 2.2 : 1, god = world === 'g';
  const dead = !a.alive, al = dead ? clamp01(1 - (a.deadT || 0) / 1.5) : 1; if (al <= 0) return; x.save(); x.globalAlpha = al;
  if (god && !a.divine) { x.globalAlpha = 0.3 * al; ell(x, px, py - 4 * s, 7 * s, 3.5 * s, '#f2ead8'); x.restore(); return; } // ordinary crabs are mist to a god's eye
  const fl = a.flash > 0, body = god ? BLACK_V : fl ? '#fff4e8' : a.big ? '#9a2e24' : '#b8583a', dark = god ? CLAY_V : a.big ? '#5a1a14' : '#7a3424', light = god ? WHITE_V : a.big ? '#d8644a' : '#e8946a';
  if (dead) { x.translate(px, py - 3 * s); x.scale(1, -1); x.translate(-px, -(py - 3 * s)); }
  const ph = a.x / (2.5 * s), m = a.mem || {}, pinch = m.pinch ? clamp01((NOW.t - m.pinch) / 0.35) : 0;
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) { const lift = Math.max(0, Math.sin(ph + i * 2.1 + (side > 0 ? 1.6 : 0))) * 2 * s, lx = px + side * (2 + i * 2.2) * s; line(x, lx, py - 3 * s, lx + side * 3 * s, py - 4.5 * s - lift, dark, Math.max(1, s * 0.8)); line(x, lx + side * 3 * s, py - 4.5 * s - lift, lx + side * 4.5 * s, py - lift * 0.4, dark, Math.max(1, s * 0.8)); }
  ell(x, px, py - 5 * s, 7 * s, 3.4 * s, body); ell(x, px - 1 * s, py - 6.2 * s, 4.2 * s, 1.5 * s, light); if (god) for (let k = -4; k <= 4; k += 4) line(x, px + k * s, py - 7 * s, px + k * s * 0.8, py - 3 * s, CLAY_V, 1);
  for (const side of [-1, 1]) { rect(x, px + side * 2 * s - (side < 0 ? 1 : 0), py - 10 * s, 1, 3 * s, dark); rect(x, px + side * 2 * s - (side < 0 ? 1 : 0), py - 10.5 * s, Math.max(1, s), Math.max(1, s), god ? WHITE_V : '#1a1010'); }
  for (const side of [-1, 1]) { const front = side === a.face, up = (front ? pinch * 4 : 0) * s, cx = px + side * 9 * s, cy = py - 8 * s - up; line(x, px + side * 6 * s, py - 5 * s, cx - side * 1.5 * s, cy + 1.5 * s, body, Math.max(1, s * 1.2)); ell(x, cx, cy, 2.8 * s, 2.1 * s, body); ell(x, cx - 0.6 * s, cy - 0.8 * s, 1.4 * s, 0.8 * s, light);
    const open = front && m.pinch && NOW.t - m.pinch < 0.35 ? 2 * s : 0.5 * s; line(x, cx + side * 1.5 * s, cy - 1 * s, cx + side * 3.4 * s, cy - 1.6 * s - open, body, Math.max(1, s)); line(x, cx + side * 1.5 * s, cy + 0.6 * s, cx + side * 3.4 * s, cy + 0.6 * s + open * 0.4, body, Math.max(1, s)); }
  x.restore(); }
BRAINS.crab = (a, dt) => { const h = G.hero, m = a.mem; if (!a.alive) return; a.ghostNow = G.world === 'g' && !a.divine; if (a.kx) { a.x += a.kx * dt; a.kx *= 0.85; if (Math.abs(a.kx) < 5) a.kx = 0; } if (a.flash > 0) a.flash -= dt;
  if ((m.stun && NOW.t < m.stun) || G.script || G.dialog) return; const d = h.x - a.x, ad = Math.abs(d), reach = a.big ? 30 : 16, sp = (a.big ? 66 : 50) * (Save.d.heroic ? 1.15 : 1);
  if (a.ghostNow || h.state === 'dead') { a.x += Math.sin(NOW.t * 1.3 + a.x0) * 10 * dt; return; }
  if (m.pinch) { const k = NOW.t - m.pinch; if (k > (Save.d.heroic ? 0.28 : 0.38) && !m.hitDone) { m.hitDone = true; Audio.sfx('swing'); if (Math.abs(h.x - (a.x + a.face * reach * 0.5)) < reach && Math.abs(h.y - a.y) < 22) hurtHero(1, a.x); } if (k > 0.75) { m.pinch = 0; m.rest = NOW.t + (a.big ? 1.0 : 1.3) + Math.random() * 0.6; } return; }
  if (ad > (a.big ? 320 : 180)) { a.x += Math.sin(NOW.t * 0.9 + a.x0) * 8 * dt; return; }
  if (m.rest && NOW.t < m.rest) { a.x += Math.sin(NOW.t * 5 + a.x0) * 26 * dt; a.face = Math.sign(d) || a.face; return; } // the sideways shuffle
  a.face = Math.sign(d) || a.face; if (ad < reach) { m.pinch = NOW.t; m.hitDone = false; return; } a.x += Math.sign(d) * sp * dt; };
function addCrab(px, o = {}) { return addActor(o.big ? 'karkinos' : 'crab', px, Object.assign({ brain: 'crab', foe: true, hp: 2, maxHp: 2, w: 16, h: 12, z: 2, obols: 1, draw: drawCrab }, o)); }

// ── the Hydra ──
CAST.hydra = { kind: 'snake', custom: true, god: { name: 'ΥΔΡΑ', sz: 1, o: {}, pal: {} } };
const HYDRA = { heads: 3, cap: 6, headHp: 2, immHp: 5, regrow: 6.5, rearT: 0.85, strikeT: 0.22, holdT: 0.7, recoverT: 0.6, maxBusy: 1 };
function hydraConf() { const H = Object.assign({}, HYDRA); if (Save.d.heroic) { H.heads = 5; H.cap = 9; H.regrow = 4; H.rearT = 0.6; H.holdT = 0.45; H.recoverT = 0.5; H.maxBusy = 2; H.immHp = 7; } return H; }
function newHead(i, imm, ang) { return { anchor: i, imm, ang: ang ?? (-2.75 + Math.random() * 0.5), len: imm ? 40 : 30 + Math.random() * 12, st: 'idle', t: Math.random() * 1.5, wait: 1 + Math.random() * 1.8, hp: imm ? hydraConf().immHp : hydraConf().headHp, hx: 0, hy: 0, flash: 0 }; }
function setupHydra(a) { const C = hydraConf(); a.C = C; a.heads = [newHead(0, true, -1.75)]; for (let i = 0; i < C.heads; i++) a.heads.push(newHead(i + 1, false, -3.05 + i * (1.0 / Math.max(1, C.heads - 1)))); a.hp = a.maxHp = 12; }
function hydraAnchor(a, hd) { const k = hd.anchor % 6; return [a.x - 26 + k * 10, a.y - 16 - (k === 0 ? 6 : 0)]; }
function hydraMortals(a) { return a.heads.filter((h) => !h.imm && h.st !== 'sealed'); }
BRAINS.hydra = (a, dt) => { if (!a.alive || !a.heads) return; const h = G.hero, C = a.C, hero = [h.x, h.y - 18]; if (G.boss && !G.script) a.fightT = (a.fightT || 0) + dt; a.ghostKeep = false; a.face = -1;
  if (G.script || G.dialog) { for (const hd of a.heads) hydraPose(a, hd, dt, true); return; }
  const busy = a.heads.filter((hd) => hd.st === 'rear' || hd.st === 'strike' || hd.st === 'hold').length, mortals = hydraMortals(a), metal = mortals.length === 0;
  if (metal && !a.metal) { a.metal = true; Audio.sfx('roar'); rumbleFx('reveal'); G.shake = 0.5; Audio.playMusic('lionMetal'); G.toast = { plain: true, text: T('Il ne reste que la tête immortelle !', 'Only the immortal head is left!', 'Έμεινε μόνο το αθάνατο κεφάλι!'), t: 0 }; }
  for (const hd of a.heads) { hd.t += dt; if (hd.flash > 0) hd.flash -= dt;
    if (hd.st === 'idle' && hd.t > hd.wait && busy < C.maxBusy + (metal ? 1 : 0) && h.state !== 'dead' && Math.abs(h.x - a.x) < 190) { hd.st = 'rear'; hd.t = 0; Audio.sfx('hiss'); }
    else if (hd.st === 'rear' && hd.t > C.rearT * (metal ? 0.75 : 1)) { hd.st = 'strike'; hd.t = 0; hd.tx = clamp(hero[0], a.x - 150, a.x + 30); hd.ty = hero[1]; hd.sx = hd.hx; hd.sy = hd.hy; hd.hit = false; }
    else if (hd.st === 'strike' && hd.t > C.strikeT) { hd.st = 'hold'; hd.t = 0; rumble(70, 0.4, 0.2); hd.ty = Math.max(hd.ty, hero[1] + 10); dustPuff(hd.tx, hd.ty + 6, 3); }
    else if (hd.st === 'hold' && hd.t > C.holdT) { hd.st = 'recover'; hd.t = 0; }
    else if (hd.st === 'recover' && hd.t > C.recoverT) { hd.st = 'idle'; hd.t = 0; hd.wait = (Save.d.heroic ? 0.7 : 1.2) + Math.random() * 1.6; }
    else if (hd.st === 'stump' && NOW.t > hd.regrowAt) { // two where one was
      hd.st = 'dead'; const n = a.heads.filter((x) => x.st !== 'dead' && x.st !== 'sealed').length; const adds = Math.min(!Save.d.heroic && n >= 3 ? 1 : 2, C.cap - n); /* kid mode: once she has a crowd, one grows back, not two */ for (let k = 0; k < Math.max(1, adds); k++) { const nh = newHead(hd.anchor, false, hd.ang + (k ? 0.22 : -0.22)); nh.st = 'grow'; nh.t = 0; a.heads.push(nh); }
      Audio.sfx('hiss'); G.toast = { plain: true, text: T('Elle repousse ! Brûle les cous coupés.', 'It grows back! Burn the cut necks.', 'Ξαναφυτρώνει! Κάψε τους κομμένους λαιμούς.'), t: 0 }; }
    else if (hd.st === 'grow' && hd.t > 0.6) { hd.st = 'idle'; hd.t = 0; hd.wait = 0.8; }
    hydraPose(a, hd, dt, false);
    if ((hd.st === 'strike' || hd.st === 'hold') && !hd.hit && Math.hypot(hd.hx - hero[0], hd.hy - hero[1]) < 12 && hd.st === 'strike') { hd.hit = true; hurtHero(1, hd.hx); } }
  a.heads = a.heads.filter((hd) => hd.st !== 'dead');
  const imm = a.heads.find((x) => x.imm); a.hp = Math.max(0, hydraMortals(a).length * 2 + (imm ? imm.hp : 0)); a.maxHp = Math.max(a.maxHp, a.hp); };
function hydraPose(a, hd, dt, frozen) { const [bx, by] = hydraAnchor(a, hd), sway = Math.sin(NOW.t * 1.4 + hd.anchor * 1.9 + hd.ang) * 0.1;
  if (hd.st === 'stump' || hd.st === 'sealed') { hd.hx = bx + Math.cos(hd.ang) * 12; hd.hy = by + Math.sin(hd.ang) * 12; return; }
  let ang = hd.ang + sway, len = hd.len; if (hd.st === 'grow') len *= clamp01(hd.t / 0.6);
  if (hd.st === 'rear') { const k = ease(clamp01(hd.t / 0.3)); ang = hd.ang + 0.5 * k + Math.sin(NOW.t * 30) * 0.03; len = hd.len * (1 - 0.18 * k); }
  let x = bx + Math.cos(ang) * len, y = by + Math.sin(ang) * len;
  if (hd.st === 'strike') { const k = ease(clamp01(hd.t / 0.2)); x = lerp(hd.sx, hd.tx, k); y = lerp(hd.sy, hd.ty, k); }
  else if (hd.st === 'hold') { x = hd.tx + Math.sin(NOW.t * 24) * 0.8; y = hd.ty + 2; }
  else if (hd.st === 'recover') { const k = ease(clamp01(hd.t / 0.5)); x = lerp(hd.tx, x, k); y = lerp(hd.ty, y, k); }
  hd.hx = x; hd.hy = y; }
function drawHydra(x, a, camx, world) { if (!a.heads) return; const god = world === 'g', px = a.x - camx, al = a.alive ? 1 : clamp01(1 - (a.deadT || 0) / 2.5); x.save(); x.globalAlpha = al;
  // after the Caeretan hydria: a coiled water-snake whose body loops on itself, a fan of thin necks, gaping snake heads, necks painted alternately black and added red
  const P = god ? { body: BLACK_V, body2: RED_V, belly: CLAY_V, out: BLACK_V, inc: CLAY_V, eye: WHITE_V, pupil: BLACK_V, mouth: RED_V, tooth: WHITE_V, water: CLAY_V }
    : { body: '#2c5a40', body2: '#5a6a2e', belly: '#b8c890', out: '#0f2418', inc: '#173826', eye: '#f2c838', pupil: '#14100a', mouth: '#9a2a24', tooth: '#f4ecd8', water: '#6a9a94', hi: '#4e8a5e' };
  const by0 = a.y, t0 = NOW.t;
  // no great body: one snake. Its trunk rises from the spring to a single root where all the necks grow; below, it loops into a coil and the tail curls away
  const RX = px - 6, RY = by0 - 15;
  const trunk = () => { x.beginPath(); x.moveTo(px - 26, by0 + 1); x.quadraticCurveTo(px - 22, by0 - 12, RX, RY); };
  const coil = () => { x.beginPath(); x.moveTo(RX, RY); x.quadraticCurveTo(px + 2, by0 - 2, px + 14, by0 - 2); x.arc(px + 14, by0 - 13, 11, Math.PI / 2, Math.PI / 2 - TAU + 0.0001, true); x.quadraticCurveTo(px + 32, by0 - 1, px + 40, by0 - 5); };
  const tail = () => { const w = Math.sin(t0 * 2) * 2; x.beginPath(); x.moveTo(px + 38, by0 - 5); x.quadraticCurveTo(px + 48, by0 - 7 + w, px + 52, by0 - 16 + w); };
  x.lineCap = 'round'; x.lineJoin = 'round';
  for (const [f, w] of [[trunk, 7.5], [coil, 7], [tail, 4]]) { f(); x.strokeStyle = P.out; x.lineWidth = w + 2; x.stroke(); }
  for (const [f, w, c] of [[coil, 7, P.body], [tail, 4, P.body], [trunk, 7.5, P.body]]) { f(); x.strokeStyle = c; x.lineWidth = w; x.stroke(); }
  // incised scale line along the snake on the vase, a pale belly in life
  if (god) { x.strokeStyle = P.inc; x.lineWidth = 0.6; x.beginPath(); x.arc(px + 14, by0 - 13, 5, 0, TAU); x.stroke(); } // the coil's eye, as painted
  for (const f of [trunk, coil, tail]) { f(); x.strokeStyle = god ? P.inc : P.belly; x.lineWidth = god ? 0.6 : 1.2; x.setLineDash(god ? [] : [2.5, 1.5]); x.stroke(); } x.setLineDash([]);
  // the water line, with ripples
  rect(x, px - 48, by0 - 1, 108, 3, god ? BLACK_V : '#2e4a4a'); rect(x, px - 44, by0 - 1, 100, 1, P.water); for (let k = 0; k < 4; k++) { const rx = px - 46 + ((t0 * 9 + k * 23) % 100); rect(x, rx, by0 - 2, 5, 1, P.water); }
  // necks and heads, the immortal one last (in front)
  const order = a.heads.slice().sort((p, q) => (p.imm ? 1 : 0) - (q.imm ? 1 : 0));
  order.forEach((hd, idx) => { const [bx0, by] = hydraAnchor(a, hd), bx = bx0 - camx, hx = hd.hx - camx, hy = hd.hy, fl = hd.flash > 0, sc = hd.imm ? 1.6 : 1.35, cut = hd.st === 'stump' || hd.st === 'sealed';
    const red = !hd.imm && hd.anchor % 2 === 1, skin = fl ? '#e8f8e0' : red ? P.body2 : P.body;
    // the neck: long and thin, rising like a stem and bending only near the top
    const sx0 = RX + (bx - RX) * 0.15, sy0 = RY, cx = cut ? bx : bx + (hx - bx) * 0.25, cy = cut ? by - 4 : Math.min(by, hy) - 26, N = cut ? 8 : 20, mid = [];
    for (let i = 0; i <= N; i++) { const t = i / N, qx = (1 - t) * (1 - t) * sx0 + 2 * (1 - t) * t * cx + t * t * hx, qy = (1 - t) * (1 - t) * sy0 + 2 * (1 - t) * t * cy + t * t * hy,
        dx = 2 * (1 - t) * (cx - sx0) + 2 * t * (hx - cx), dy = 2 * (1 - t) * (cy - sy0) + 2 * t * (hy - cy), dl = Math.hypot(dx, dy) || 1; mid.push([qx, qy, -dy / dl, dx / dl, lerp(3.8, cut ? 2.8 : 2.1, t) * (hd.imm ? 1.15 : 1)]); }
    const band = (grow, col) => { x.fillStyle = col; x.beginPath(); mid.forEach(([X, Y, nx, ny, r], i) => (i ? x.lineTo(X + nx * (r + grow), Y + ny * (r + grow)) : x.moveTo(X + nx * (r + grow), Y + ny * (r + grow)))); for (let i = mid.length - 1; i >= 0; i--) { const [X, Y, nx, ny, r] = mid[i]; x.lineTo(X - nx * (r + grow), Y - ny * (r + grow)); } x.closePath(); x.fill(); };
    band(0.9, P.out); band(0, skin);
    const down = mid[Math.floor(N / 2)][3] > 0 ? 1 : -1;
    if (!fl && !red) { x.strokeStyle = god ? P.inc : P.belly; x.lineWidth = god ? 0.5 : 1; x.beginPath(); mid.forEach(([X, Y, nx, ny, r], i) => { if (i < 1) return; const ox = X + nx * r * 0.5 * down, oy = Y + ny * r * 0.5 * down; i === 1 ? x.moveTo(ox, oy) : x.lineTo(ox, oy); }); x.stroke(); }
    if (cut) { const [ex, ey, nx, ny, r] = mid[N], rot = Math.atan2(ny, nx);
      if (hd.st === 'stump') { ell(x, ex, ey, r + 0.6, r * 0.75 + 0.4, P.out, rot); ell(x, ex, ey, r, r * 0.7, god ? WHITE_V : '#b8322a', rot); const k = clamp01((hd.regrowAt - NOW.t) / a.C.regrow); if (Math.sin(NOW.t * (8 + (1 - k) * 18)) > 0) ell(x, ex, ey, r * 0.5, r * 0.35, god ? CLAY_V : '#ff8a6a', rot); if (Math.random() < 0.15) G.parts.push({ x: hd.hx, y: ey, vx: (Math.random() - 0.5) * 20, vy: -20, life: 0.4, max: 0.4, kind: 'shard', col: '#8a2a1a', g: 200 }); }
      else { ell(x, ex, ey, r + 0.6, r * 0.75 + 0.4, P.out, rot); ell(x, ex, ey, r, r * 0.7, god ? CLAY_V : '#2a2018', rot); if (Math.sin(NOW.t * 5 + hd.anchor) > 0.3) ell(x, ex + 1, ey - 0.5, 0.9, 0.9, god ? WHITE_V : '#ff9a3a'); if (Math.random() < 0.05) G.parts.push({ x: hd.hx, y: ey - 2, vx: 2, vy: -14, life: 1.2, max: 1.2, kind: 'smoke', g: -2 }); }
      return; }
    // the head: a snake's, always gaping as on the vase, wider when it strikes; drawn in its own frame, kept upright
    const [lx, ly] = mid[N - 1], ang = Math.atan2(hy - ly, hx - lx), open = hd.st === 'strike' || hd.st === 'hold' ? 0.75 : hd.st === 'rear' ? 0.55 : hd.st === 'grow' ? 0.15 : 0.32 + Math.sin(NOW.t * 2 + hd.anchor * 2) * 0.06;
    x.save(); x.translate(hx, hy); x.rotate(ang); if (Math.cos(ang) < 0) x.scale(1, -1); x.scale(sc, sc);
    // lower jaw, hinged at the back of the mouth
    x.save(); x.translate(-2.5, 0.6); x.rotate(open); x.fillStyle = P.out; x.beginPath(); x.moveTo(-1, -0.6); x.quadraticCurveTo(5, -0.4, 9, 0.2); x.lineTo(8.6, 1.6); x.quadraticCurveTo(4, 2.2, -0.6, 2); x.closePath(); x.fill(); x.fillStyle = skin; x.beginPath(); x.moveTo(-0.3, 0); x.quadraticCurveTo(5, 0.1, 8.2, 0.5); x.lineTo(7.9, 1.1); x.quadraticCurveTo(4, 1.5, 0, 1.4); x.closePath(); x.fill();
    if (open > 0.4) { x.fillStyle = P.tooth; for (const k of [2.5, 5, 7.2]) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + 0.5, -1.2); x.lineTo(k + 1, 0); x.closePath(); x.fill(); } } x.restore();
    // mouth inside, and the tongue when it strikes
    x.fillStyle = P.mouth; x.beginPath(); x.moveTo(-2.2, 0.4); x.lineTo(8.5, 0.2); x.lineTo(-2.5 + 9 * Math.cos(open), 0.8 + 9 * Math.sin(open)); x.closePath(); x.fill();
    if (hd.st === 'strike' || hd.st === 'hold' || hd.st === 'rear') { const tl = 4 + Math.sin(NOW.t * 40) * 1.2, ta = open * 0.5; x.strokeStyle = god ? WHITE_V : '#d0384a'; x.lineWidth = 0.7; const ex = 6 + tl, ey = 1 + Math.sin(ta) * 6; x.beginPath(); x.moveTo(2, 1); x.lineTo(ex, ey); x.lineTo(ex + 2, ey - 1.3); x.moveTo(ex, ey); x.lineTo(ex + 2, ey + 1.3); x.stroke(); }
    // the upper head: a blunt snake's skull and snout
    x.fillStyle = P.out; x.beginPath(); x.moveTo(-5, 1.2); x.quadraticCurveTo(-5.2, -3.2, -1, -3.4); x.quadraticCurveTo(5, -3.2, 9.2, -0.8); x.quadraticCurveTo(10, 0.2, 9.4, 0.8); x.lineTo(-2.4, 1.4); x.closePath(); x.fill();
    x.fillStyle = skin; x.beginPath(); x.moveTo(-4.2, 0.7); x.quadraticCurveTo(-4.4, -2.5, -0.9, -2.6); x.quadraticCurveTo(4.8, -2.4, 8.5, -0.5); x.quadraticCurveTo(9, 0.1, 8.6, 0.4); x.lineTo(-2.4, 0.8); x.closePath(); x.fill();
    if (!god && !fl) { x.fillStyle = P.hi; x.beginPath(); x.moveTo(-3, -1.9); x.quadraticCurveTo(2, -2.8, 6.5, -1); x.quadraticCurveTo(2, -1.8, -3, -1.9); x.fill(); }
    if (open > 0.4) { x.fillStyle = P.tooth; for (const k of [3, 5.5, 7.6]) { x.beginPath(); x.moveTo(k, 0.5); x.lineTo(k + 0.5, 1.8); x.lineTo(k + 1, 0.5); x.closePath(); x.fill(); } }
    // the eye: an incised ring on the vase, a slit eye in life
    if (god) { x.fillStyle = P.eye; x.beginPath(); x.arc(0.6, -1.3, 1.1, 0, TAU); x.fill(); x.fillStyle = P.pupil; x.fillRect(0.3, -1.6, 0.7, 0.7); x.strokeStyle = P.inc; x.lineWidth = 0.4; x.beginPath(); x.arc(0.6, -1.3, 1.8, 0, TAU); x.stroke(); x.beginPath(); x.moveTo(-3.6, -0.4); x.quadraticCurveTo(-1, 0.6, 2.4, 0.2); x.stroke(); }
    else { ell(x, 0.6, -1.3, 1.6, 1.2, P.out); ell(x, 0.6, -1.3, 1.1, 0.8, hd.imm ? '#ffd860' : P.eye); x.fillStyle = P.pupil; x.fillRect(0.4, -2, 0.5, 1.4); x.fillStyle = P.inc; x.fillRect(7.6, -0.9, 0.7, 0.5); }
    // the immortal head: a little crown of added white on the vase, of gold in life
    if (hd.imm) { x.fillStyle = god ? WHITE_V : '#e8c040'; for (let k = 0; k < 3; k++) { const b2 = -3.4 + k * 2; x.beginPath(); x.moveTo(b2 - 0.8, -2.9); x.lineTo(b2 - 0.2, -5.4 + Math.abs(k - 1) * 0.6); x.lineTo(b2 + 0.8, -3); x.closePath(); x.fill(); } }
    x.restore(); });
  x.restore(); }
function hydraHit(a, cx, cy, w, hh, weapon, dir) { const h = G.hero, reachX = w / 2 + 8, reachY = hh / 2 + 8;
  if (h.torch) for (const hd of a.heads) if (hd.st === 'stump' && Math.abs(hd.hx - cx) < reachX + 6 && Math.abs(hd.hy - cy) < reachY + 6) { // sealed
    hd.st = 'sealed'; h.burnT = 0.5; Audio.sfx('splash'); Audio.sfx('ichor'); rumble(200, 0.6, 0.5); G.shake = 0.15; for (let i = 0; i < 12; i++) G.parts.push({ x: hd.hx, y: hd.hy, vx: (Math.random() - 0.5) * 60, vy: -30 - Math.random() * 60, life: 0.6, max: 0.6, kind: 'ember' });
    a.sealedN = (a.sealedN || 0) + 1; if (a.sealedN === 1 && !a.crab) { a.crab = true; later(0.6, () => { if (a.alive) { addCrab(a.x - 70, { big: true, divine: true, hp: 4, maxHp: 4, name: 'karkinos', obols: 3, onDown: (c) => { riseStars('cancer', c.x, c.y - 10); bark(G.hero, tr(T('Même le crabe a droit à ses étoiles ?!', 'Even the crab gets stars?!', 'Ακόμα κι ο κάβουρας παίρνει αστέρια;!'))); later(2.8, () => { const mm = byName('mentor'); if (mm && !G.script) bark(mm, tr(T('Pour avoir essayé. La toute première médaille de participation.', 'For trying. The very first participation medal.', 'Επειδή προσπάθησε. Το πρώτο μετάλλιο συμμετοχής.')), 3.2); }); } }); bark(byName('mentor') || h, tr(T('Un crabe ! Héra en avait déjà envoyé un pincer Héraclès. Il a marché dessus.', 'A crab! Hera sent one to pinch Heracles too. He stepped on it.', 'Κάβουρας! Η Ήρα είχε στείλει έναν να τσιμπήσει και τον Ηρακλή. Τον πάτησε.'))); } }); } return; }
  for (const hd of a.heads) { if (hd.st === 'stump' || hd.st === 'sealed' || hd.st === 'grow') continue; if (Math.abs(hd.hx - cx) > reachX || Math.abs(hd.hy - cy) > reachY) continue;
    if (hd.imm && hydraMortals(a).length) { Audio.sfx('clang'); spark(hd.hx, hd.hy, 5); if (!a.immTold) { a.immTold = true; G.toast = { plain: true, text: T('La tête du milieu est immortelle : les autres d’abord.', 'The middle head is immortal: the others first.', 'Το μεσαίο κεφάλι είναι αθάνατο: πρώτα τ’ άλλα.'), t: 0 }; } continue; }
    hd.hp -= weapon === 'xiphos' ? 2 : 1; hd.flash = 0.2; Audio.sfx('hit'); spark(hd.hx, hd.hy, 6); G.hitStop = 0.05; rumble(90, 0.4, 0.5); if (hd.st === 'rear') { hd.st = 'recover'; hd.t = 0; hd.tx = hd.hx; hd.ty = hd.hy; }
    if (hd.hp <= 0) { if (hd.imm) { a.alive = false; a.busy = true; G.boss = null; runScene('hydraDown', sceneHydraDown); return; }
      hd.st = 'stump'; hd.t = 0; hd.regrowAt = NOW.t + a.C.regrow * (!Save.d.heroic && (a.fightT || 0) > 45 ? 1.6 : 1); Audio.sfx('smash'); rumbleFx('kill'); for (let i = 0; i < 6; i++) G.parts.push({ x: hd.hx, y: hd.hy, vx: dir * 40 + (Math.random() - 0.5) * 50, vy: -60 - Math.random() * 40, life: 0.6, max: 0.6, kind: 'shard', col: '#3e7450', g: 300 });
      if (!h.torch && !a.torchTold) { a.torchTold = true; bark(byName('mentor') || h, tr(T('Elle va repousser ! Il faut du feu.', 'It’ll grow back! We need fire.', 'Θα ξαναφυτρώσει! Θέλει φωτιά.'))); } } return; } }
function hydraRespawn(a) { { const extra = a.heads.filter((q) => !q.imm && q.st !== 'sealed' && q.st !== 'dead'); let n = extra.length - a.C.heads; for (const q of extra.slice().reverse()) { if (n <= 0) break; q.st = 'dead'; n--; } a.heads = a.heads.filter((q) => q.st !== 'dead'); }
  for (const hd of a.heads) { if (hd.st === 'stump') { hd.st = 'idle'; hd.hp = a.C.headHp; hd.t = 0; } else if (hd.st !== 'sealed') { hd.st = 'idle'; hd.t = 0; hd.wait = 1.5; } if (hd.imm) hd.hp = Math.min(a.C.immHp, hd.hp + 2); } }

// ── scenes ──
function* sceneTorch() { const h = G.hero, m = byName('mentor'); G.letterbox = 1; yield* walkTo$(h, 2286, 40); face(h, { x: 2300 });
  yield SAY(m, 'think', T('Les pêcheurs sont partis en courant. Ils ont laissé leur feu. C’est gentil de leur part.', 'The fishermen left at a run. They left their fire. That was kind of them.', 'Οι ψαράδες έφυγαν τρέχοντας. Άφησαν τη φωτιά τους. Ευγενικό εκ μέρους τους.'));
  yield SAY('hero', 'neutral', T('Pourquoi on a besoin de feu ? Il fait jour.', 'Why do we need fire? It’s daytime.', 'Γιατί θέλουμε φωτιά; Είναι μέρα.'));
  yield SAY(m, 'sly', T('Quand on coupe une tête à l’hydre, il en repousse deux. Le feu, lui, ne repousse pas. Coupe, puis brûle le cou avant qu’il ne guérisse.', 'When you cut off one of the hydra’s heads, two grow back. Fire doesn’t grow back. Cut, then burn the neck before it heals.', 'Όταν κόβεις ένα κεφάλι της Ύδρας, φυτρώνουν δύο. Η φωτιά δεν ξαναφυτρώνει. Κόψε, και μετά κάψε τον λαιμό πριν κλείσει.'));
  yield* anim$(h, 'pick'); h.torch = true; flag('torch', true); Audio.sfx('ichor'); rumbleFx('pickup'); G.toast = { text: T('Une torche', 'A torch', 'Ένας δαυλός'), t: 0 };
  yield SAY(m, 'happy', T('Iolaos, le neveu d’Héraclès, tenait la torche pour lui. Toi, tu tiendras les deux. Tu as deux mains, non ?', 'Iolaus, Heracles’ nephew, held the torch for him. You’ll hold both. You have two hands, don’t you?', 'Ο Ιόλαος, ο ανιψιός του Ηρακλή, του κρατούσε τον δαυλό. Εσύ θα κρατάς και τα δύο. Έχεις δύο χέρια, έτσι;'));
  G.letterbox = 0; G.hint = { text: T('{atk} sur un cou coupé : la torche le brûle', '{atk} on a cut neck: the torch burns it shut', '{atk} σε κομμένο λαιμό: ο δαυλός τον καίει'), t: 0, dur: 8 }; }
function* sceneHydraIn() { const h = G.hero, m = byName('mentor'), Y = byName('hydra'); m.stay = 2440; G.letterbox = 1; yield* walkTo$(h, 2600, 46); face(h, { x: 2900 });
  yield SAY('hero', 'think', T('L’eau bouge toute seule.', 'The water is moving on its own.', 'Το νερό κουνιέται μόνο του.'));
  Y.hidden = false; Y.rise = 0; Audio.sfx('splash'); G.shake = 0.4; rumble(600, 0.7, 0.4); for (let k = 0; k <= 20; k++) { Y.rise = k / 20; yield WAIT(0.05); } Audio.sfx('hiss'); Audio.sfx('roar'); yield WAIT(0.5);
  yield SAY(m, 'surprised', T('Cinq têtes ! Le récit en disait neuf. Elle a dû en perdre en route. Ne compte pas là-dessus pour longtemps.', 'Five heads! The tale said nine. She must have lost some on the way. Don’t count on that for long.', 'Πέντε κεφάλια! Ο μύθος έλεγε εννιά. Θα έχασε κάποια στον δρόμο. Μην το υπολογίζεις για πολύ.'));
  G.letterbox = 0; G.bounds = [2470, 3040]; G.check = { x: 2500 }; G.boss = { a: Y, name: T('L’Hydre de Lerne', 'The Lernaean Hydra', 'Η Λερναία Ύδρα'), t: 0 }; Audio.playMusic('hydra');
  G.hint = { text: T('{atk} coupe une tête · {atk} sur le cou coupé : la torche · la tête du milieu en dernier', '{atk} cuts a head · {atk} on the stump: the torch · the middle head last', '{atk} κόβει κεφάλι · {atk} στο κομμένο: ο δαυλός · το μεσαίο τελευταίο'), t: 0, dur: 9 }; }
function* sceneHydraDown() { const h = G.hero, m = byName('mentor'), Y = byName('hydra'), imm = Y.heads.find((x) => x.imm); G.letterbox = 1; Audio.playMusic('lerna'); G.bounds = null; m.stay = null; Y.heads.forEach((hd) => { if (!hd.imm && hd.st !== 'sealed') hd.st = 'sealed'; }); imm.st = 'stump'; imm.regrowAt = 1e9; yield WAIT(0.8);
  yield SAY('hero', 'surprised', T('Elle siffle encore ! La tête… elle parle toute seule.', 'It’s still hissing! The head… it’s talking to itself.', 'Ακόμα σφυρίζει! Το κεφάλι… μιλάει μόνο του.'));
  yield SAY(m, 'neutral', T('Immortelle veut dire immortelle. Héraclès l’a enterrée sous un rocher, au bord de la route. Elle y est peut-être encore. Aide-moi.', 'Immortal means immortal. Heracles buried it under a rock by the roadside. It might still be there. Help me.', 'Αθάνατο σημαίνει αθάνατο. Ο Ηρακλής το έθαψε κάτω από έναν βράχο στην άκρη του δρόμου. Ίσως να είναι ακόμα εκεί. Βοήθα με.'));
  yield* walkTo$(h, Y.x - 40, 40); face(h, Y); yield* anim$(h, 'club'); G.rock = { x: Y.x - 6, y: Y.y - 40, vy: 0 }; for (let k = 0; k < 20; k++) { G.rock.vy += 30; G.rock.y = Math.min(Y.y - 10, G.rock.y + G.rock.vy * 0.05); yield WAIT(0.05); } Audio.sfx('smash'); G.shake = 0.6; rumbleFx('kill'); Y.heads = []; Y.deadT = 0;
  yield WAIT(0.6); yield* walkTo$(m, h.x - 26, 70); face(m, Y); Y.heads = []; G.rock.y = Y.y - 10;
  yield* constellation$('hydra', Y.x, Y.y - 30);
  yield SAY(m, 'tender', T('Un serpent d’étoiles, le plus long du ciel. Retourné à sa place. Héra va être furieuse.', 'A serpent of stars, the longest in the sky. Back where it belongs. Hera will be furious.', 'Ένα φίδι από αστέρια, το πιο μακρύ στον ουρανό. Γύρισε στη θέση του. Η Ήρα θα γίνει έξαλλη.'));
  yield* constellationEnd$();
  // a delivery, already paid for
  const hm = addActor('hermes', h.x - 160, { name: 'hermesL', brain: 'idle' }); yield* walkTo$(hm, h.x - 34, 70); face(hm, h); face(h, hm);
  yield SAY(hm, 'happy', T('Livraison ! Une fronde. Enfin, une fronde spéciale. Elle ne marche que quand tu regardes comme les dieux.', 'Delivery! A sling. Well, a special sling. It only works when you look the way the gods do.', 'Παράδοση! Μια σφενδόνη. Δηλαδή, μια ειδική σφενδόνη. Δουλεύει μόνο όταν κοιτάς όπως οι θεοί.'));
  yield SAY('hero', 'think', T('Et laisse-moi deviner. Déjà payée.', 'And let me guess. Already paid for.', 'Κι άσε με να μαντέψω. Ήδη πληρωμένη.'));
  yield SAY(hm, 'sly', T('Tu apprends vite. Ton… client a de grandes mains et peu de patience pour les formulaires. Signe ici. Ah non, pas besoin. Au revoir !', 'You learn fast. Your… client has big hands and little patience for paperwork. Sign here. Oh no, no need. Bye!', 'Μαθαίνεις γρήγορα. Ο… πελάτης σου έχει μεγάλα χέρια και λίγη υπομονή για χαρτιά. Υπόγραψε εδώ. Α όχι, δεν χρειάζεται. Γεια!'));
  yield* anim$(hm, 'give'); flag('arcsling', true); h.throwW = 'arc'; Audio.sfx('eyeOpen'); rumbleFx('pickup'); G.toast = { text: T('La fronde-éclair · seulement dans le regard des dieux', 'The arc-sling · only in the God’s view', 'Η σφενδόνη-αστραπή · μόνο στο βλέμμα των θεών'), t: 0 };
  yield* walkTo$(hm, h.x - 200, 90); hm.hidden = true;
  yield SAY(m, 'think', T('Et ne touche pas le sang de l’hydre. Héraclès y trempait ses flèches. Toi, tu y tremperas tes pierres. Avec un bâton.', 'And don’t touch the hydra’s blood. Heracles dipped his arrows in it. You’ll dip your stones. With a stick.', 'Και μην αγγίξεις το αίμα της Ύδρας. Ο Ηρακλής βουτούσε εκεί τα βέλη του. Εσύ θα βουτήξεις τις πέτρες σου. Με ένα ξύλο.'));
  flag('venom', true); G.toast = { text: T('Pierres trempées de venin · deux fois plus fortes', 'Venom-dipped stones · twice as strong', 'Πέτρες βουτηγμένες σε δηλητήριο · διπλή δύναμη'), t: 0 };
  G.letterbox = 0; flag('lerna', true); paintScene('act1', 'hydra'); h.torch = false; yield WAIT(1); labourDone('lerna'); }
function* lernaInScene() { yield* fade$('in', 1); yield* card$(LANDS.lerna.title, T('Travail : l’Hydre', 'Labour: the Hydra', 'Άθλος: η Ύδρα'), 3); flag('lernaSeen', true); }
function* mentorLernaTalk() { const m = byName('mentor'); yield SAY(m, 'think', [T('Lerne était un lac sacré. Puis l’hydre a emménagé. Les voisins ont déménagé.', 'Lerna was a sacred lake. Then the hydra moved in. The neighbours moved out.', 'Η Λέρνη ήταν ιερή λίμνη. Μετά μετακόμισε η Ύδρα. Οι γείτονες μετακόμισαν.'), T('Les crabes pincent les chevilles. Saute, ou frappe d’abord.', 'The crabs go for the ankles. Jump, or hit first.', 'Οι κάβουρες τσιμπάνε τους αστραγάλους. Πήδα, ή χτύπα πρώτος.')][(G.mtN = (G.mtN || 0) + 1) % 2]); }
function setupLerna() { const m = addActor('mentor', 20, { name: 'mentor', brain: 'follow', talk: mentorLernaTalk });
  for (const [cx, i] of [[380, 0], [700, 1], [760, 2], [1240, 3], [1310, 4], [1880, 5], [1960, 6]]) addCrab(cx, { name: 'crab' + i });
  if (BRAINS.serpent) for (const [sx, i] of [[1460, 0], [2040, 1]]) addActor('serpent', sx, { name: 'lsnake' + i, brain: 'serpent', foe: true, hp: 3, maxHp: 3, w: 18, h: 16, z: 3, obols: 1 });
  potsAt([300, 980, 1500, 2120], 1);
  G.zones.push({ x0: 1700, x1: 1740, run: () => { if (!G.check || G.check.x < 1700) { G.check = { x: 1720 }; G.hero.hp = HEROS.maxHp; Audio.sfx('ichor'); G.toast = { plain: true, text: T('Un îlot sec · tes cœurs reviennent', 'A dry islet · your hearts come back', 'Ένα στεγνό νησάκι · οι καρδιές σου γυρίζουν'), t: 0 }; } } });
  if (!flag('torch')) G.zones.push({ x0: 2230, x1: 2270, run: () => runScene('torch', sceneTorch) }); else G.hero.torch = !flag('lerna');
  if (!flag('lerna')) { const Y = addActor('hydra', 2860, { name: 'hydra', brain: 'hydra', foe: true, boss: true, w: 60, h: 40, z: 1, draw: drawHydra, hidden: true }); Y.onRespawn = () => hydraRespawn(Y); Y.hitBox = (cx, cy, w, hh, weapon, dir) => hydraHit(Y, cx, cy, w, hh, weapon, dir); setupHydra(Y);
    G.zones.push({ x0: 2520, x1: 2560, when: () => !flag('lerna') && flag('torch'), run: () => runScene('hydraIn', sceneHydraIn) });
    G.zones.push({ x0: 2420, x1: 2460, when: () => !flag('torch'), repeat: true, run: () => { G.hero.x = 2400; bark(byName('mentor'), tr(T('Pas sans feu. Les pêcheurs, là-bas.', 'Not without fire. The fishermen, back there.', 'Όχι χωρίς φωτιά. Οι ψαράδες, εκεί πίσω.'))); } }); }
  G.check = { x: 40 }; if (!flag('lernaSeen')) runSceneNext('lernaIn', lernaInScene); }
// the Hydra rising out of the spring
const _drawHydraRise = drawHydra; drawHydra = function (x, a, camx, world) { if (a.rise != null && a.rise < 1) { x.save(); x.beginPath(); x.rect(0, 0, LW, a.y); x.clip(); const y0 = a.y; a.y = y0 + (1 - a.rise) * 50; for (const hd of a.heads || []) hydraPose(a, hd, 0, true); _drawHydraRise(x, a, camx, world); a.y = y0; x.restore(); return; } _drawHydraRise(x, a, camx, world); };
// the boulder over the immortal head
const _drawWorldsR = drawWorlds; drawWorlds = function (x) { _drawWorldsR(x); if (G.rock && G.land === 'lerna') { const px = G.rock.x - G.cam.x, py = G.rock.y; ell(x, px, py, 14, 10, G.world === 'g' ? BLACK_V : '#6a6458'); ell(x, px - 3, py - 4, 8, 4, G.world === 'g' ? CLAY_V : '#8a8476'); } };

// ── the arc-sling (God's view only) and venom-dipped stones ──
const _throwStone = throwStone; throwStone = function (h, ch) { const n0 = G.proj.length; _throwStone(h, ch); const p = G.proj[G.proj.length - 1]; if (G.proj.length === n0 || !p) return;
  if (flag('venom')) p.dmg = (p.dmg || 1) * 2;
  if (flag('artemis')) { // Artemis's favour: the stone flies true to the nearest foe ahead, even one on the wing
    const tg = G.actors.filter((a) => a.foe && a.alive && !a.ghostNow && !a.hidden).map((a) => ({ x: a.x, y: a.y - (a.alt || 0) - (a.alt ? 2 : a.h * 0.5) })).filter((q) => (q.x - p.x) * h.face > 10 && (q.x - p.x) * h.face < 280).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
    if (tg) { const g = p.god ? 60 : 380, t = Math.abs(tg.x - p.x) / Math.abs(p.vx); p.vy = (tg.y - p.y - 0.5 * g * t * t) / t; p.life = Math.max(p.life, t + 0.3); } }
  if (h.throwW === 'arc' && G.world === 'g' && flag('arcsling')) { p.arc = true; p.vy = 0; p.vx = h.face * 420; p.g = 0; p.dmg = Math.max(p.dmg || 1, 3); p.pierce = 3; Audio.sfx('clang'); rumble(90, 0.5, 0.6); } };

// ── the labour road: Tiryns sends you down the three roads in the order your stance set ──
const LABOUR_ORDER = { force: ['nemea', 'lerna', 'arcadia'], cunning: ['lerna', 'arcadia', 'nemea'], heart: ['arcadia', 'nemea', 'lerna'] };
const LABOUR_DONE_FLAG = { nemea: 'lion', lerna: 'lerna', arcadia: 'arcadia' };
function labourOrder() { return LABOUR_ORDER[G.flags.stance] || LABOUR_ORDER.force; }
function nextLabour() { for (const id of labourOrder()) if (LANDS[id] && !flag(LABOUR_DONE_FLAG[id])) return id; return LANDS.elis && !flag('elis') ? 'elis' : null; }
function labourDone(id) { G.reportOf = id; Save.d.report = id; Save.d.at = { land: 'tiryns', x: 1360 }; Save.save(); /* quitting now still brings him back to the king's report */ runSceneNext('back', function* () { yield* fade$('out', 1.2); enterLand('tiryns', 1360); }); }
ACT1_SETUP.lerna = setupLerna;
// what Eurystheus says when he sends you, and what the gate hint says
function assignLine(id) { return ({
  nemea: T('Némée est à l’est. Rapporte-moi la peau du lion. Mais pas de trop près, hein. Tu la poses devant la jarre, et tu frappes deux fois.', 'Nemea is to the east. Bring me the lion’s skin. Not too close, mind. Leave it by the jar and knock twice.', 'Η Νεμέα είναι ανατολικά. Φέρε μου το τομάρι του λιονταριού. Όχι πολύ κοντά, ε. Το αφήνεις δίπλα στο πιθάρι και χτυπάς δυο φορές.'),
  lerna: T('Lerne, au sud, dans le marais. L’hydre. Prends une torche, ou n’importe quoi qui brûle. Et ne la regarde pas dans les yeux. Les dix-huit.', 'Lerna, to the south, in the marsh. The hydra. Take a torch, or anything that burns. And don’t look it in the eyes. All eighteen.', 'Η Λέρνη, νότια, στον βάλτο. Η Ύδρα. Πάρε δαυλό, ή ό,τι καίγεται. Και μην την κοιτάξεις στα μάτια. Και στα δεκαοχτώ.'),
  arcadia: T('L’Arcadie, à l’ouest. Une biche, un sanglier, des oiseaux de bronze. Ça fait trois. Ça compte pour un. Ne discute pas, c’est moi qui compte.', 'Arcadia, to the west. A hind, a boar, bronze birds. That’s three. It counts as one. Don’t argue, I do the counting.', 'Η Αρκαδία, δυτικά. Μια ελαφίνα, ένας κάπρος, χάλκινα πουλιά. Τρία. Μετράνε για ένα. Μη διαφωνείς, εγώ μετράω.'),
  elis: T('Les écuries du roi Augias, en Élide. Trente ans de fumier. Nettoie-les en un jour. Non, ce n’est pas une bête. Oui, c’est pire.', 'King Augeas’s stables, in Elis. Thirty years of dung. Clean them in one day. No, it’s not a beast. Yes, it’s worse.', 'Οι στάβλοι του βασιλιά Αυγεία, στην Ήλιδα. Τριάντα χρόνια κοπριά. Καθάρισέ τους σε μια μέρα. Όχι, δεν είναι θηρίο. Ναι, είναι χειρότερο.') })[id] || T('Va. Va donc.', 'Go. Off you go.', 'Πήγαινε. Άντε.'); }
function gateHint(id) { const where = { nemea: T('Némée', 'Nemea', 'Νεμέα'), lerna: T('Lerne', 'Lerna', 'Λέρνη'), arcadia: T('l’Arcadie', 'Arcadia', 'Αρκαδία'), elis: T('l’Élide', 'Elis', 'Ήλιδα') }[id]; if (!where) return T('Tirynthe', 'Tiryns', 'Τίρυνθα'); return { fr: 'La porte de l’est mène à ' + where.fr, en: 'The east gate leads to ' + where.en, el: 'Η ανατολική πύλη οδηγεί: ' + where.el }; }
// coming back to Tiryns with a labour done
function* sceneReport() { const id = G.reportOf; G.reportOf = null; const h = G.hero, m = byName('mentor'), e = byName('eurystheus'); yield* fade$('in', 1); m.x = h.x - 30; yield* walkTo$(h, 1495, 50); face(h, e); G.letterbox = 1;
  { const rap = () => { Audio.sfx('step'); rumble(40, 0.2, 0.2); }; setTimeout(rap, 300); setTimeout(rap, 530); setTimeout(rap, 760); } yield* anim$(h, 'knock'); yield WAIT(0.3); e.hidden = false; e.peek = 0; G.peekE = e; for (let k = 0; k <= 10; k++) { e.peek = k / 10 * 0.5; yield WAIT(0.04); }
  if (id === 'nemea') { yield SAY(e, 'surprised', T('AAAH ! Un lion ! … Ah. C’est une peau. Une peau vide. Avec toi dedans.', 'AAAH! A lion! …Oh. It’s a skin. An empty skin. With you inside it.', 'ΑΑΑ! Λιοντάρι! … Α. Τομάρι είναι. Άδειο τομάρι. Με σένα μέσα.'));
    for (let k = 10; k >= 0; k--) { e.peek = k / 10 * 0.5; yield WAIT(0.02); } yield WAIT(0.8); for (let k = 0; k <= 10; k++) { e.peek = k / 10 * 0.5; yield WAIT(0.04); }
    yield SAY(e, 'neutral', T('Je ne me suis pas évanoui. Je vérifiais le fond de la jarre. Il est très bien, merci.', 'I did not faint. I was checking the bottom of the jar. It’s very nice, thank you.', 'Δεν λιποθύμησα. Έλεγχα τον πάτο του πιθαριού. Είναι μια χαρά, ευχαριστώ.')); }
  else if (id === 'lerna') { yield SAY(e, 'cross', T('Tu sens le marais. Et le brûlé. Et… le serpent. Héraclès, lui, au moins, se lavait avant de venir.', 'You smell of marsh. And burning. And… snake. Heracles at least washed before he came.', 'Μυρίζεις βάλτο. Και καμένο. Και… φίδι. Ο Ηρακλής τουλάχιστον πλενόταν πριν έρθει.'));
    yield SAY(e, 'sly', T('Et son neveu tenait la torche, donc ça ne comptait qu’à moitié. Toi, tu avais… le vieux. Ça compte à moitié aussi.', 'And his nephew held the torch, so it only half counted. You had… the old man. That half counts too.', 'Κι ο ανιψιός του κρατούσε τον δαυλό, οπότε μετρούσε μισό. Εσύ είχες… τον γέρο. Μετράει κι αυτό μισό.'));
    yield SAY(m, 'cross', T('Je suis vexé.', 'I’m offended.', 'Θίχτηκα.')); }
  else if (id === 'elis') { yield SAY(e, 'cross', T('Ça ne compte pas ! On m’a dit que tu avais demandé à être payé !', 'That doesn’t count! I heard you asked to be paid!', 'Δεν μετράει! Μου είπαν πως ζήτησες πληρωμή!'));
    yield SAY('hero', 'cross', T('C’est lui qui l’a proposé ! Et il n’a pas payé !', 'He offered! And he didn’t pay!', 'Εκείνος το πρότεινε! Και δεν πλήρωσε!'));
    yield SAY(e, 'think', T('… Ah. Alors ça compte. À moitié. Comme l’hydre. Ça fait un. Bravo.', '…Ah. Then it counts. Half. Like the hydra. That makes one. Well done.', '…Α. Τότε μετράει. Μισό. Όπως η Ύδρα. Κάνει ένα. Μπράβο.')); }
  else if (id === 'arcadia') { yield SAY(e, 'surprised', T('Une biche aux cornes d’or, vivante, devant ma porte ?! Ramène-la ! Non ! Garde-la ! Non ! Artémis va… Qu’est-ce qu’on fait d’une biche sacrée ?', 'A golden-horned hind, alive, at my door?! Take it back! No! Keep it! No! Artemis will… What does one do with a sacred hind?', 'Μια ελαφίνα με χρυσά κέρατα, ζωντανή, στην πόρτα μου;! Πάρ’ τη πίσω! Όχι! Κράτα τη! Όχι! Η Άρτεμη θα… Τι κάνει κανείς με μια ιερή ελαφίνα;'));
    yield SAY('hero', 'tender', T('On la laisse partir. Elle a dit oui pour venir, pas pour rester.', 'You let it go. It agreed to come, not to stay.', 'Την αφήνεις να φύγει. Δέχτηκε να έρθει, όχι να μείνει.')); }
  const next = nextLabour();
  if (next) { yield SAY(e, 'neutral', assignLine(next)); for (let k = 10; k >= 0; k--) { e.peek = k / 10 * 0.5; yield WAIT(0.03); } e.hidden = true; Audio.sfx('clang'); G.letterbox = 0; G.hint = { text: gateHint(next), t: 0, dur: 6 }; }
  else { yield SAY(e, 'happy', T('C’est tout. C’est fini. Je peux sortir de ma jarre ! … Non. Je reste. On ne sait jamais.', 'That’s all. It’s over. I can come out of my jar! …No. I’ll stay. You never know.', 'Αυτό ήταν. Τελείωσε. Μπορώ να βγω απ’ το πιθάρι! … Όχι. Μένω. Ποτέ δεν ξέρεις.')); e.hidden = true; G.letterbox = 0; yield WAIT(0.8); G.endCard = { t: 0, v: BUILD }; } }

// ── constellation cinematic: the scene holds, the view tilts up into a darkening sky, and the beast rises into its stars ──
const CONSTEL = {
  leo: { pts: [[-46, 10], [-30, 2], [-14, -4], [0, -10], [10, -24], [26, -20], [32, -6], [20, 4], [6, 10], [-12, 16]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 1], [3, 7]], name: 'ΛΕΩΝ', label: T('Le Lion', 'Leo, the Lion', 'Ο Λέων') },
  hydra: { pts: [[-70, -14], [-58, -6], [-44, -8], [-30, 0], [-16, 2], [-2, 8], [12, 10], [28, 6], [44, 12], [60, 18], [72, 14]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10]], name: 'ΥΔΡΑ', label: T('L’Hydre', 'Hydra', 'Η Ύδρα') },
  cancer: { pts: [[-14, 8], [-6, -2], [0, -12], [8, -2], [16, 8], [0, 6]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 3]], name: 'ΚΑΡΚΙΝΟΣ', label: T('Le Cancer', 'Cancer, the Crab', 'Ο Καρκίνος') } };
function* constellation$(shape, wx, wy) { const C = { shape, wx, wy, t: 0 }; G.constel = C; Audio.sfx('eyeOpen'); rumbleFx('reveal');
  for (let k = 0; k <= 40; k++) { G.tilt = ease(k / 40) * 84; G.skyDark = k / 40; yield WAIT(0.04); }
  const D = CONSTEL[shape]; yield UNTIL(() => C.t > 1.8 + D.pts.length * 0.2 + D.links.length * 0.16 + 1.2 || (G.script && G.script.skip)); }
function* constellationEnd$() { for (let k = 40; k >= 0; k--) { G.tilt = ease(k / 40) * 84; G.skyDark = k / 40; yield WAIT(0.035); } G.constel = null; G.tilt = 0; G.skyDark = 0; }
const CST = { buf: null };
const _drawWorldsC = drawWorlds; drawWorlds = function (x) { const tilt = G.tilt || 0; if (!tilt && !G.constel) return _drawWorldsC(x);
  const b = CST.buf || (CST.buf = mkC(LW, LH)), bx = b.getContext('2d'); bx.setTransform(1, 0, 0, 1, 0, 0); bx.clearRect(0, 0, LW, LH); _drawWorldsC(bx);
  const top = G.world === 'g' ? '#7a3a22' : '#1a2440', px1 = bx.getImageData(LW >> 1, 1, 1, 1).data, g = x.createLinearGradient(0, 0, 0, tilt + 1); g.addColorStop(0, top); g.addColorStop(1, `rgb(${px1[0]},${px1[1]},${px1[2]})`); x.fillStyle = g; x.fillRect(0, 0, LW, tilt + 2);
  x.drawImage(b, 0, Math.round(tilt)); const dk = G.skyDark || 0; if (dk > 0) { x.fillStyle = G.world === 'g' ? `rgba(40,16,8,${0.5 * dk})` : `rgba(10,14,40,${0.62 * dk})`; x.fillRect(0, 0, LW, LH); }
  // a field of faint stars in the darkened sky
  if (dk > 0.2) { x.globalAlpha = (dk - 0.2) / 0.8; for (let i = 0; i < 60; i++) { const sx = (i * 137) % LW, sy = (i * 71) % 120, tw = 0.5 + 0.5 * Math.sin(NOW.t * 2 + i); x.fillStyle = `rgba(255,248,224,${0.35 + 0.5 * tw})`; x.fillRect(sx, sy, 1, 1); } x.globalAlpha = 1; }
  const C = G.constel; if (!C) return; const D = CONSTEL[C.shape], S = 2.3, ox = LW / 2 + 10, oy = 34 - Math.min(...D.pts.map((q) => q[1])) * S, sx0 = C.wx - G.cam.x, sy0 = C.wy + tilt, n = D.pts.length, tl = 1.8 + n * 0.2;
  D.pts.forEach(([px, py], i) => { const tx = ox + px * S, ty = oy + py * S, p = clamp01((C.t - 0.4 - i * 0.2) / 1.3);
    if (p > 0 && p < 1) { const e = ease(p), cxp = (sx0 + tx) / 2 + (i % 2 ? 30 : -30), cyp = Math.min(sy0, ty) - 40, qx = (1 - e) * (1 - e) * sx0 + 2 * (1 - e) * e * cxp + e * e * tx, qy = (1 - e) * (1 - e) * sy0 + 2 * (1 - e) * e * cyp + e * e * ty;
      for (let k = 0; k < 5; k++) { const e2 = Math.max(0, e - k * 0.03), q2x = (1 - e2) * (1 - e2) * sx0 + 2 * (1 - e2) * e2 * cxp + e2 * e2 * tx, q2y = (1 - e2) * (1 - e2) * sy0 + 2 * (1 - e2) * e2 * cyp + e2 * e2 * ty; x.globalAlpha = 1 - k * 0.18; x.fillStyle = k ? '#ffd890' : '#fff8e0'; x.fillRect(Math.round(q2x), Math.round(q2y), k ? 1 : 2, k ? 1 : 2); } x.globalAlpha = 1; }
    if (p >= 1) { const tw = 0.75 + 0.25 * Math.sin(NOW.t * 5 + i * 1.7), pop = clamp01((C.t - 1.7 - i * 0.2) / 0.3), r = 3 + (1 - pop) * 4; const gl = x.createRadialGradient(tx, ty, 0, tx, ty, 9 * tw); gl.addColorStop(0, 'rgba(255,244,200,0.75)'); gl.addColorStop(1, 'rgba(255,220,140,0)'); x.fillStyle = gl; x.fillRect(tx - 10, ty - 10, 20, 20);
      x.fillStyle = '#fffaf0'; x.fillRect(Math.round(tx) - 1, Math.round(ty) - 1, 3, 3); x.fillRect(Math.round(tx - r), Math.round(ty), Math.round(r * 2) + 1, 1); x.fillRect(Math.round(tx), Math.round(ty - r), 1, Math.round(r * 2) + 1); } });
  D.links.forEach(([i, j], k) => { const p = clamp01((C.t - tl - k * 0.16) / 0.3); if (p <= 0) return; const [ax, ay] = D.pts[i], [bx2, by2] = D.pts[j], x1 = ox + ax * S, y1 = oy + ay * S, x2 = ox + bx2 * S, y2 = oy + by2 * S; x.strokeStyle = 'rgba(255,236,170,0.7)'; x.lineWidth = 1; x.beginPath(); x.moveTo(x1, y1); x.lineTo(lerp(x1, x2, p), lerp(y1, y2, p)); x.stroke(); }); };
// the constellation's name, in the sky, crisp
function drawConstelHi(c) { const C = G.constel; if (!C) return; const D = CONSTEL[C.shape], tl = 1.8 + D.pts.length * 0.2 + D.links.length * 0.16, a = clamp01((C.t - tl) / 0.8); if (a <= 0) return; c.save(); c.globalAlpha = a; hiText(c, D.name, LW / 2 + 10, 34 + (Math.max(...D.pts.map((q) => q[1])) - Math.min(...D.pts.map((q) => q[1]))) * 2.3 + 16, 13, '#fff2c8', 'center', TXT.head, '600 '); hiText(c, tr(D.label), LW / 2 + 10, 34 + (Math.max(...D.pts.map((q) => q[1])) - Math.min(...D.pts.map((q) => q[1]))) * 2.3 + 30, 7, '#e8d8b8', 'center', TXT.font, 'italic '); c.restore(); }
const _drawBossHiC = drawBossHi; drawBossHi = function (c) { _drawBossHiC(c); drawConstelHi(c); };
// a fading beast during the rise
const _drawActorF = drawActor; drawActor = function (x, a, camx, world) { if (a.fadeToStars && G.constel) { x.save(); x.globalAlpha = clamp01(1 - G.constel.t / 1.6); _drawActorF(x, a, camx, world); x.restore(); return; } _drawActorF(x, a, camx, world); };

// ── the old man keeps out of boss fights: he waits outside the arena, and comes back there after a mercy respawn ──
const _followB = BRAINS.follow; BRAINS.follow = (a, dt) => { if (G.boss && G.bounds && a.name === 'mentor') { const spot = G.bounds[0] - 46; if (Math.abs(a.x - spot) > 3) walkTo(a, spot, 90, dt); else { standStill(a); a.face = 1; } return; } return _followB(a, dt); };
const _heroDownM = heroDown; heroDown = function () { _heroDownM(); if (G.boss && G.bounds) later(1.25, () => { const m = byName('mentor'); if (m && G.bounds) m.x = G.bounds[0] - 46; }); };
const VERSION = '1.3', BUILD = VERSION; // VERSION is read by the launcher's stamp script
