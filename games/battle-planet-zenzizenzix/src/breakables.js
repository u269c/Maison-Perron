// =====================================================================
// BREAKABLES — small and medium things can be picked up (attack next to
// them) and thrown (attack again); large things break after a number of
// hits (a table takes 8, a motorcycle 12, a car 20). Everything breaks
// into debris, and sometimes there is food inside.
// =====================================================================
// size: s, m (carried) or l (hit to break); w/d/h in floor units; solid = you can stand on it
const BK = {
  crate: { size: 'm', hp: 4, w: 24, d: 20, h: 22, col: '#9a7040', food: .35 },
  fishcrate: { size: 's', hp: 2, w: 22, d: 16, h: 10, col: '#8a6a40', food: .5 },
  barrel: { size: 'm', hp: 4, w: 18, d: 16, h: 24, col: '#7a4a28', food: .3 },
  chair: { size: 's', hp: 2, w: 14, d: 12, h: 20, col: '#8a5a30' },
  stool: { size: 's', hp: 1, w: 12, d: 10, h: 16, col: '#7a5030' },
  bottles: { size: 's', hp: 1, w: 18, d: 12, h: 12, col: '#6a8a4a' },
  bin: { size: 'm', hp: 4, w: 18, d: 16, h: 22, col: '#5a6a6a', food: .25 },
  pot: { size: 's', hp: 2, w: 16, d: 14, h: 14, col: '#8a6a4a', food: .3 },   // lobster pot
  newsbox: { size: 'm', hp: 4, w: 16, d: 14, h: 24, col: '#2a5aa8' },
  table: { size: 'l', hp: 8, w: 40, d: 26, h: 18, col: '#7a4a28', solid: 1 },
  stall: { size: 'l', hp: 10, w: 40, d: 24, h: 22, col: '#6a4426', solid: 1, food: .8 },
  cart: { size: 'l', hp: 10, w: 44, d: 24, h: 20, col: '#7a5a3a', solid: 1, food: .5 },
  moto: { size: 'l', hp: 12, w: 40, d: 14, h: 22, col: '#a8302a' },
  car: { size: 'l', hp: 20, w: 92, d: 34, h: 30, col: '#3a6aa8', solid: 1 },
  forklift: { size: 'l', hp: 16, w: 46, d: 26, h: 34, col: '#e8b02a', solid: 1 },
  piano: { size: 'l', hp: 14, w: 50, d: 22, h: 30, col: '#2a1a14', solid: 1 },
  keg: { size: 'l', hp: 6, w: 26, d: 20, h: 26, col: '#8a5a2a' }          // Oscar's beer barrel
};
// real-world sizes: a warrior is about 72 px tall (1.8 m), so ~40 px per metre. Each kind is drawn at its design size
// and scaled up by `sc` (a car ends up ~1.5 m tall and ~4.3 m long, a table at hip height, a wheelie bin at the waist).
const BK_SC = { crate: 1.3, fishcrate: 1.3, barrel: 1.45, chair: 1.7, stool: 1.75, bottles: 1.3, bin: 1.8, pot: 1.4, newsbox: 1.8, table: 1.65, stall: 1.7, cart: 1.7, moto: 1.95, car: 1.9, forklift: 2.4, piano: 1.8, keg: 1.4, container: 2.6, rubble: 1.8 };
let BK_FIT = false;
function fitBK() { if (BK_FIT) return; BK_FIT = true; for (const k in BK) { const K = BK[k], s = BK_SC[k] || 1; K.sc = s; K.dw = K.w; K.dh = K.h; K.w = Math.round(K.w * s); K.h = Math.round(K.h * s); K.d = Math.round(K.d * Math.min(s, 1.4)); } }
let BREAK = [], FOOD = [];
const FOODS = { havre: ['fish', 'bread'], soif: ['pretzel', 'sausage', 'bread'] };
function initBreakables(scr) {
  fitBK(); BREAK = []; FOOD = []; scr.boxes = scr.boxes.filter(b => !b.bk);
  for (const it of scr.items || []) { const K = BK[it.k]; const b = { ...it, ...K, ...it, hp: K.hp, max: K.hp, y: 0, vx: 0, vy: 0, held: null, thrown: false, rot: 0, flash: 0, id: Math.random() };
    if (it.col) b.col = it.col; if (K.solid) { b.box = { x: b.x - b.w / 2, z: b.z - b.d / 2, w: b.w, d: b.d, h: b.h, bk: b }; scr.boxes.push(b.box); } BREAK.push(b); }
}
function removeBox(b) { if (b.box) { const i = scr.boxes.indexOf(b.box); if (i >= 0) scr.boxes.splice(i, 1); b.box = null; } }
function smash(b, dir = 0) {
  b.broken = true; removeBox(b); WORLD.shake = Math.max(WORLD.shake, b.size === 'l' ? 6 : 3); SFX.smash(b.k, b.size === 'l' ? 1 : b.size === 'm' ? .6 : .3, b.x);
  for (let k = 0; k < (b.size === 'l' ? 5 : 3); k++) fx.push({ k: 'plank', x: b.x + (Math.random() - .5) * b.w * .6, z: b.z + (Math.random() - .5) * 8, y: b.h * .5, vx: (Math.random() - .5) * 200 + dir * 80, vy: 120 + Math.random() * 120, rot: Math.random() * 6, vr: (Math.random() - .5) * 18, t: 6, w: 8 + Math.random() * (b.size === 'l' ? 12 : 6), col: b.col });
  puff(b.x, b.z, b.size === 'l' ? 8 : 4, dir, b.size === 'l' ? 1.6 : 1);
  const n = b.size === 'l' ? 14 : b.size === 'm' ? 9 : 6;
  for (let k = 0; k < n; k++) fx.push({ k: 'debris', x: b.x + (Math.random() - .5) * b.w, z: b.z + (Math.random() - .5) * 6, y: (b.y || 0) + Math.random() * b.h, vx: (Math.random() - .5) * 220 + dir * 60, vy: 80 + Math.random() * 200, rot: Math.random() * 6, vr: (Math.random() - .5) * 20, t: 1.4, col: k % 3 ? b.col : shadeC(b.col, -.3), w: 3 + Math.random() * (b.size === 'l' ? 8 : 5) });
  if (b.k === 'bottles') for (let k = 0; k < 6; k++) fx.push({ k: 'debris', x: b.x, z: b.z, y: 8, vx: (Math.random() - .5) * 200, vy: 100 + Math.random() * 120, rot: 0, vr: 9, t: 1, col: '#9adcb8', w: 2 });
  if (b.k === 'car' || b.k === 'moto' || b.k === 'forklift') { for (let k = 0; k < 6; k++) fx.push({ k: 'smoke', x: b.x + (Math.random() - .5) * b.w, z: b.z, y: 10, f: 1, t: 1.4 }); fx.push({ k: 'ring', x: b.x, z: b.z, max: b.w, t: .4, col: '#ffd060' }); }
  INKFX.push({ k: 'sfx', text: (LANG === 'fr' ? ['CRAC !', 'KRSSH !', 'PATATRAS !', 'SCRONCH !'] : ['CRACK!', 'KRSSH!', 'CRASH!', 'SKRONCH!'])[(Math.random() * 4) | 0], x: (b.x - camX) * 1.5, y: sy(b.z, b.h) * 1.5 - 20, size: b.size === 'l' ? 30 : 22, t: 0, rot: (Math.random() - .5) * .4 });
  const lv = LEVELS[LEVEL] ? LEVELS[LEVEL].id : 'havre';
  if (Math.random() < (b.food || .12)) FOOD.push({ k: pickA(FOODS[lv] || FOODS.havre), x: b.x, z: b.z, y: 10, vy: 140, t: 12 });
}
function damageBreakable(b, dmg, dir) { if (b.broken || b.held) return; b.hp -= dmg; b.flash = .12; b.wob = b.size === 'l' ? .04 : .14; if (dir) b.lastDir = dir; if (b.hp > 0 && b.size !== 'l') { for (let k = 0; k < 3; k++) fx.push({ k: 'debris', x: b.x + (Math.random() - .5) * b.w * .6, z: b.z, y: b.h * (.4 + Math.random() * .5), vx: (dir || 1) * (40 + Math.random() * 70), vy: 70 + Math.random() * 70, rot: 0, vr: 10, t: .7, col: k ? b.col : shadeC(b.col, -.35), w: 2 + Math.random() * 2 }); } b.vx += dir * (b.size === 'l' ? 0 : 30); SFX.knock(b.k, b.x); if (b.hp <= 0) smash(b, dir); else if (b.size === 'l') { WORLD.shake = Math.max(WORLD.shake, 1.5); for (let k = 0; k < 2; k++) fx.push({ k: 'debris', x: b.x + dir * -b.w / 2, z: b.z, y: b.h * .6, vx: dir * 80 + (Math.random() - .5) * 60, vy: 90, rot: 0, vr: 8, t: .8, col: b.col, w: 2.5 }); } }
// a player's swing also hits whatever breakable is in reach
function hitBreakables(p, R, D) { for (const b of BREAK) if (!b.broken && !b.held && !b.thrown && Math.abs(b.z - p.z) < 16 + b.d / 3 && (b.x - p.x) * p.face > -b.w / 2 - 4 && Math.abs(b.x - p.x) < R + b.w / 2) damageBreakable(b, D, p.face); }
// picking up and throwing: see carry.js
// a charge (double-tap forward) shoves breakables: small and medium ones are punted along the ground
// and bowl over whatever they meet; large ones slide by weight — a table skids, a car barely rocks
const PUSH = { table: 150, stall: 110, cart: 190, moto: 210, car: 28, forklift: 45, piano: 120, keg: 190 };
function pushBreakable(b, p) {
  if (b.broken || b.held || b.thrown) return false;
  const v = b.size === 's' ? 430 : b.size === 'm' ? 360 : PUSH[b.k] || 100, heavy = v < 60;
  b.vx = p.face * v; b.from = p; b.hitSet = new Set([p]); b.flash = .1; b.slideT = 0;
  WORLD.shake = Math.max(WORLD.shake, b.size === 'l' ? (heavy ? 5 : 3.5) : 2); noise(b.size === 'l' ? .14 : .08, .06);
  const W = LANG === 'fr' ? (b.size === 'l' ? (heavy ? ['HNNNG !', 'BOUM !'] : ['VRRRAC !', 'BOUM !']) : ['VLAN !', 'POF !', 'SHLAK !']) : (b.size === 'l' ? (heavy ? ['HNNNG!', 'THUD!'] : ['SKRRRT!', 'THUD!']) : ['WHAM!', 'POW!', 'SHLAK!']);
  INKFX.push({ k: 'sfx', text: pickA(W), x: (b.x - camX) * 1.5, y: sy(b.z, b.h) * 1.5 - 16, size: b.size === 'l' ? 26 : 20, t: 0, rot: (Math.random() - .5) * .4 });
  if (b.size === 'l') { damageBreakable(b, 1, p.face); p.dash = 0; p.vx = -p.face * (heavy ? 120 : 40); }   // shoulder-check: the charge stops on big things
  return true;
}
function blockedBut(x, z, y, b) { for (const o of scr.boxes) if (o !== b.box && x > o.x - 3 && x < o.x + o.w + 3 && z > o.z - 2 && z < o.z + o.d + 2 && y < o.h - 3) return true; return false; }
function slideBreakable(b, dt) {
  const dir = Math.sign(b.vx), fast = Math.abs(b.vx) > 110, front = b.x + dir * b.w / 2, nx = b.x + b.vx * dt;
  if (blockedBut(front + b.vx * dt, b.z, 4, b) || nx < camX + b.w / 2 || nx > camX + VW - b.w / 2) {    // wall or screen edge: thunk
    if (fast) { damageBreakable(b, 1, -dir); WORLD.shake = Math.max(WORLD.shake, 2); }
    b.vx = 0; return; }
  if (fast) {
    for (const e of enemies) if (!e.dead && !b.hitSet.has(e) && Math.abs(e.x - b.x) < b.w / 2 + 8 && Math.abs(e.z - b.z) < b.d / 2 + 8 && e.y < 12) {
      b.hitSet.add(e); const big = e.type === 'oscar' || e.type === 'calve' || e.type === 'boss';
      INK_STRONG = b.size !== 's'; hitEnemy(e, b.size === 's' ? 1 : 2, dir, b.from, big ? .3 : 1.8); INK_STRONG = false;
      if (big) { b.vx = 0; return; }
      if (b.size !== 'l') { b.vx *= .55; damageBreakable(b, 1, dir); if (b.broken) return; } else b.vx *= .8; }
    for (const q of players) if (q !== b.from && q.ko <= 0 && !b.hitSet.has(q) && Math.abs(q.x - b.x) < b.w / 2 + 6 && Math.abs(q.z - b.z) < b.d / 2 + 6 && q.y < 12) { b.hitSet.add(q); hitPlayer(q, 1, dir, b.from); b.vx = 0; return; }
    for (const o of BREAK) if (o !== b && !o.broken && !o.held && !o.thrown && Math.abs(o.x - b.x) < (o.w + b.w) / 2 + 2 && Math.abs(o.z - b.z) < (o.d + b.d) / 2 && (o.x - b.x) * dir > 0) {
      damageBreakable(o, 1, dir); damageBreakable(b, 1, -dir);
      if (!o.broken && o.size !== 'l') { o.vx = b.vx * .85; o.from = b.from; o.hitSet = new Set([b.from]); b.vx *= .15; } else b.vx = 0;   // billiards
      return; }
    b.slideT = (b.slideT || 0) + dt; if (b.slideT > .06) { b.slideT = 0; fx.push({ k: 'smoke', x: b.x - dir * b.w / 2, z: b.z, y: 2, f: -dir, t: .35 }); }
  }
  // nothing solid may slide over a player
  if (b.box && players.some(q => q.ko <= 0 && Math.abs(q.z - b.z) < b.d / 2 + 4 && (q.x - b.x) * dir > 0 && Math.abs(q.x - nx) < b.w / 2 + 6)) { b.vx = 0; return; }
  b.x = nx; if (b.box) b.box.x = b.x - b.w / 2;
  b.vx *= Math.pow(b.size === 'l' ? .05 : .15, dt); if (Math.abs(b.vx) < 6) b.vx = 0;
}
function updateBreakables(dt) {
  for (const p of players) carryTick(p, dt);
  for (const b of BREAK) { if (b.broken) continue; b.flash = Math.max(0, b.flash - dt);
    if (b.held) { const p = b.held; if (p.ko > 0 || p.fall > 0) { carryRelease(p, true); continue; } if (!p.anchor) { b.x = p.x; b.z = p.z; b.y = p.y + heroHeight(p.w.id, RIG_S) + 2; } continue; }
    if (b.thrown) { b.x += b.vx * dt; b.vy -= GRAV * (b.g ?? .8) * dt; b.y += b.vy * dt; b.rot += dt * (b.wave ? 3 : 10) * Math.sign(b.vx || 1); carryFlight(b, dt);
      const dmg = b.size === 's' ? 2 : 3;
      for (const e of enemies) if (!e.dead && !b.hitSet.has(e) && Math.abs(e.x - b.x) < 16 && Math.abs(e.z - b.z) < 14 && b.y < e.y + 60 && b.y > e.y - 4) { b.hitSet.add(e); INK_STRONG = true; HITKIND = 'throw'; hitEnemy(e, dmg, Math.sign(b.vx), b.from, 1.6); HITKIND = null; INK_STRONG = false; if (!e.dead && e.type !== 'oscar') { e.vy = 150; e.y = Math.max(1, e.y); } smash(b, Math.sign(b.vx)); break; }
      if (b.broken) continue;
      for (const q of players) if (q !== b.from && q.ko <= 0 && !b.hitSet.has(q) && Math.abs(q.x - b.x) < 14 && Math.abs(q.z - b.z) < 12 && b.y < q.y + 56) { b.hitSet.add(q); hitPlayer(q, 1, Math.sign(b.vx), b.from); smash(b, Math.sign(b.vx)); break; }
      if (b.broken) continue;
      for (const o of BREAK) if (o !== b && !o.broken && !o.held && Math.abs(o.x - b.x) < (o.w + b.w) / 2 && Math.abs(o.z - b.z) < (o.d + b.d) / 2 && b.y < o.h) { damageBreakable(o, dmg, Math.sign(b.vx)); smash(b, Math.sign(b.vx)); break; }
      if (b.broken) continue;
      if (b.y <= 0 || blocked(b.x, b.z, b.y) || b.x < camX - 40 || b.x > camX + VW + 40) smash(b, Math.sign(b.vx));
      continue; }
    if (b.vx) { if (b.hitSet) slideBreakable(b, dt); else { const nx = b.x + b.vx * dt; if (!blockedBut(nx, b.z, 4, b)) { b.x = nx; if (b.box) b.box.x = b.x - b.w / 2; } b.vx *= Math.pow(.02, dt); if (Math.abs(b.vx) < 2) b.vx = 0; } }
  }
  if (BREAK.some(b => b.broken && b.k === 'keg')) oscarKeg();
  BREAK = BREAK.filter(b => !b.broken);
  for (const f of FOOD) { f.t -= dt; if (f.y > 0 || f.vy > 0) { f.vy -= GRAV * dt; f.y = Math.max(0, f.y + f.vy * dt); if (f.y === 0) f.vy = 0; }
    for (const p of players) if (p.ko <= 0 && Math.abs(p.x - f.x) < 14 && Math.abs(p.z - f.z) < 10 && f.y < 6 && p.hp < hpMax(p.w)) { p.hp = Math.min(hpMax(p.w), p.hp + 2); f.t = 0; fx.push({ k: 'plus', x: p.x, z: p.z, t: 1 }); SFX.yum(p.x); pop(p.x, p.z, p.y + 70, LANG === 'fr' ? 'MIAM !' : 'YUM!', '#7dffc0'); break; } }
  FOOD = FOOD.filter(f => f.t > 0);
}
function breakFx(f, dt) { if (f.k !== 'debris') return false; f.vy -= GRAV * dt; f.y = Math.max(0, f.y + f.vy * dt); f.x += f.vx * dt; f.rot += f.vr * dt; if (f.y === 0) { f.vx *= .8; f.vr *= .6; f.vy = Math.abs(f.vy) > 60 ? -f.vy * .3 : 0; } return true; }
function drawBreakFx(f) { if (f.k !== 'debris') return false; const x = f.x - camX, y = sy(f.z, f.y); g.save(); g.globalAlpha = Math.min(1, f.t * 2); g.translate(x, y); g.rotate(f.rot); g.fillStyle = f.col; g.fillRect(-f.w / 2, -1, f.w, 2.2); g.restore(); return true; }
// ---- drawing ----------------------------------------------------------------
function drawBreakable(b) { if (b.hide) return;
  const x = b.x - camX, y = sy(b.z, b.y || 0); if (x < -100 || x > VW + 100) return;
  if (!b.held && !b.thrown) { g.fillStyle = 'rgba(20,10,10,.3)'; g.beginPath(); g.ellipse(x, sy(b.z, 0), b.w * .55, 3, 0, 0, 7); g.fill(); }
  g.save(); g.translate(x + (b.flash > 0 ? (Math.random() - .5) * 2 : 0), y); if (b.thrown || b.held) g.rotate(b.rot); else if (Math.abs(b.vx) > 40) g.rotate(Math.max(-.12, Math.min(.12, b.vx / 2400)));
  if (b.wob) { g.rotate(b.wob * Math.sin(time * 38)); b.wob *= Math.pow(.004, FRAME_DT); if (Math.abs(b.wob) < .005) b.wob = 0; }
  const hits = b.max - b.hp; if (!b.held && !b.thrown && b.size !== 'l' && hits > 0) g.rotate((b.lastDir || 1) * Math.min(.1, hits * .03));
  if (b.sc && b.sc !== 1) g.scale(b.sc, b.sc); const c = b.col, dk = shadeC(c, -.3), lt = shadeC(c, .2), W = b.dw || b.w, H = b.dh || b.h, cr = b.hp / b.max;
  if (BK3_DRAW[b.k]) BK3_DRAW[b.k](g, W, H, c, dk, lt, b); else switch (b.k) {
    case 'container': drawContainer(g, -W / 2, -H, W, H, c, b.open); break;
    case 'rubble': poly(g, [[-W / 2, 0], [-W / 2 + 4, -H * .8], [-W / 6, -H], [W / 4, -H * .9], [W / 2, -H * .4], [W / 2, 0]], c); g.strokeStyle = dk; g.lineWidth = 1; g.beginPath(); g.moveTo(-W / 4, -H * .7); g.lineTo(0, -H * .3); g.lineTo(W / 5, -H * .6); g.stroke(); g.fillStyle = '#b83a2a'; g.fillRect(-W / 3, -H * .45, W / 3, 3); break;
    case 'crate': case 'fishcrate': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.strokeStyle = dk; g.lineWidth = 1.2; g.strokeRect(-W / 2 + 2, -H + 2, W - 4, H - 4); g.beginPath(); g.moveTo(-W / 2 + 2, -2); g.lineTo(W / 2 - 2, -H + 2); g.stroke();
      if (b.k === 'fishcrate') for (let k = 0; k < 4; k++) poly(g, [[-W / 2 + 3 + k * 5, -H], [-W / 2 + 7 + k * 5, -H - 4], [-W / 2 + 9 + k * 5, -H]], k % 2 ? '#b8c8d8' : '#9ab0c4'); break;
    case 'barrel': case 'keg': poly(g, [[-W / 2 + 2, 0], [W / 2 - 2, 0], [W / 2, -H / 2], [W / 2 - 2, -H], [-W / 2 + 2, -H], [-W / 2, -H / 2]], c); g.fillStyle = '#3a3a3a'; g.fillRect(-W / 2, -H * .28, W, 2); g.fillRect(-W / 2, -H * .72, W, 2);
      if (b.k === 'keg') { g.fillStyle = '#c8963a'; g.fillRect(W / 2 - 3, -H * .45, 5, 3); g.fillStyle = '#f0d070'; g.fillRect(W / 2 + 2, -H * .42, 2, 4 + Math.sin(time * 6)); g.fillStyle = '#efe6d2'; g.font = 'bold 6px sans-serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'BIÈRE' : 'BEER', 0, -H * .5); } break;
    case 'chair': case 'stool': if (b.k === 'chair') { g.fillStyle = c; g.fillRect(-W / 2, -H, 3, H * .6); } poly(g, [[-W / 2, -H * .45], [W / 2, -H * .45], [W / 2, -H * .55], [-W / 2, -H * .55]], c); g.fillStyle = dk; g.fillRect(-W / 2, -H * .45, 2, H * .45); g.fillRect(W / 2 - 2, -H * .45, 2, H * .45); break;
    case 'bottles': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .6], [-W / 2, -H * .6]], '#8a6a40'); for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? '#5a8a4a' : '#8a5a2a'; g.fillRect(-W / 2 + 2 + k * 4, -H - 2, 3, H * .5); g.fillRect(-W / 2 + 3 + k * 4, -H - 5, 1, 3); } break;
    case 'bin': poly(g, [[-W / 2 + 1, 0], [W / 2 - 1, 0], [W / 2, -H], [-W / 2, -H]], c); poly(g, [[-W / 2 - 2, -H], [W / 2 + 2, -H], [W / 2, -H - 3], [-W / 2, -H - 3]], lt); g.fillStyle = dk; for (let k = 0; k < 3; k++) g.fillRect(-W / 2 + 3 + k * 5, -H + 3, 1.5, H - 6); break;
    case 'pot': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2 - 2, -H], [-W / 2 + 2, -H]], c); g.strokeStyle = dk; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-W / 2 + 2 + k * 4, 0); g.lineTo(-W / 2 + 4 + k * 4, -H); g.stroke(); } break;
    case 'newsbox': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.fillStyle = '#efe6d2'; g.fillRect(-W / 2 + 2, -H + 4, W - 4, 7); g.fillStyle = '#2a2a2a'; g.font = 'bold 4px sans-serif'; g.textAlign = 'center'; g.fillText(LEVELS[LEVEL] && LEVELS[LEVEL].id === 'bouldaire' ? (LANG === 'fr' ? 'LA MÈCHE' : 'THE LOCK') : LANG === 'fr' ? 'LE SOIF' : 'THE THIRST', 0, -H + 9); break;
    case 'table': poly(g, [[-W / 2, -H], [W / 2, -H], [W / 2 - 3, -H + 4], [-W / 2 + 3, -H + 4]], c); g.fillStyle = dk; g.fillRect(-2, -H + 4, 4, H - 4); poly(g, [[-8, 0], [8, 0], [6, -2], [-6, -2]], dk);
      g.fillStyle = 'rgba(255,230,180,.35)'; g.fillRect(-W / 2 + 4, -H, W - 8, 1); if (b.glasses !== false) { g.fillStyle = '#f0d070'; g.fillRect(-6, -H - 5, 3, 5); g.fillStyle = '#ffffff'; g.fillRect(-6, -H - 6, 3, 1.5); g.fillStyle = '#9adcb8'; g.fillRect(5, -H - 7, 2, 7); } break;
    case 'stall': case 'cart': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.fillStyle = lt; g.fillRect(-W / 2, -H, W, 3);
      if (b.k === 'stall') { g.fillStyle = dk; g.fillRect(-W / 2, -H - 22, 2, 22); g.fillRect(W / 2 - 2, -H - 22, 2, 22); for (let k = 0; k < W; k += 6) { g.fillStyle = (k / 6) % 2 ? '#e8e0d0' : '#c83a32'; g.fillRect(-W / 2 + k, -H - 26, 6, 6); } for (let k = 0; k < 6; k++) { g.fillStyle = ['#e8a040', '#c84a3a', '#e8d070'][k % 3]; g.beginPath(); g.arc(-W / 2 + 5 + k * 6, -H - 2, 2.6, 0, 7); g.fill(); } }
      else { g.fillStyle = '#2a2a2a'; g.beginPath(); g.arc(-W / 2 + 8, 0, 5, 0, 7); g.arc(W / 2 - 8, 0, 5, 0, 7); g.fill(); } break;
    case 'moto': g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(-W / 2 + 7, -6, 6.5, 0, 7); g.arc(W / 2 - 7, -6, 6.5, 0, 7); g.fill(); g.fillStyle = '#8a8a92'; g.beginPath(); g.arc(-W / 2 + 7, -6, 2.5, 0, 7); g.arc(W / 2 - 7, -6, 2.5, 0, 7); g.fill();
      poly(g, [[-W / 2 + 8, -10], [W / 2 - 10, -10], [W / 2 - 4, -18], [-2, -20], [-W / 2 + 4, -16]], c); g.fillStyle = '#2a2a2a'; g.fillRect(-8, -22, 14, 3); g.fillStyle = '#c8c8d0'; g.fillRect(W / 2 - 8, -24, 2, 10); break;
    case 'car': poly(g, [[-W / 2, -4], [W / 2, -4], [W / 2, -H * .55], [W / 2 - 14, -H * .6], [W / 4, -H], [-W / 4, -H], [-W / 2 + 14, -H * .6], [-W / 2, -H * .55]], c); g.fillStyle = '#b8d8f0'; poly(g, [[-W / 4 + 3, -H + 3], [-2, -H + 3], [-2, -H * .62], [-W / 2 + 18, -H * .62]], '#b8d8f0'); poly(g, [[2, -H + 3], [W / 4 - 3, -H + 3], [W / 2 - 18, -H * .62], [2, -H * .62]], '#b8d8f0');
      g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(-W / 2 + 18, -4, 8, 0, 7); g.arc(W / 2 - 18, -4, 8, 0, 7); g.fill(); g.fillStyle = '#9a9aa2'; g.beginPath(); g.arc(-W / 2 + 18, -4, 3, 0, 7); g.arc(W / 2 - 18, -4, 3, 0, 7); g.fill(); g.fillStyle = '#ffe890'; g.fillRect(W / 2 - 3, -H * .5, 3, 3); g.fillStyle = '#c83a2a'; g.fillRect(-W / 2, -H * .5, 3, 3); g.fillStyle = lt; g.fillRect(-W / 2 + 2, -H * .55, W - 4, 1.5); break;
    case 'forklift': poly(g, [[-W / 2, 0], [W / 4, 0], [W / 4, -H * .5], [-W / 2, -H * .5]], c); g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; g.strokeRect(-W / 2 + 2, -H, W * .55, H * .5); g.fillStyle = '#2a2a2a'; g.fillRect(W / 4, -H, 3, H); g.fillRect(W / 4, -4, W / 4, 3); g.beginPath(); g.arc(-W / 2 + 8, 0, 5, 0, 7); g.arc(W / 4 - 6, 0, 5, 0, 7); g.fill(); break;
    case 'piano': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.fillStyle = '#efe6d2'; g.fillRect(-W / 2 + 3, -H * .55, W - 6, 4); g.fillStyle = '#1a1a1a'; for (let k = 0; k < 10; k++) g.fillRect(-W / 2 + 5 + k * 4.4, -H * .55, 1.6, 2.4); g.fillStyle = '#c8963a'; g.fillRect(-W / 2, -H, W, 2); break;
  }
  if (b.size !== 'l' && hits > 0) drawDamage(b, hits, W, H, c, dk);
  if (b.size === 'l' && cr < 1) { g.strokeStyle = 'rgba(20,10,10,.7)'; g.lineWidth = 1; const n = Math.floor((1 - cr) * 6); for (let k = 0; k < n; k++) { g.beginPath(); g.moveTo(-W / 2 + (k * 13) % W, -H + 2); g.lineTo(-W / 2 + (k * 13) % W + 4, -H * .5); g.lineTo(-W / 2 + (k * 13) % W, -2); g.stroke(); } }
  g.restore();
}
function drawFood(f) { const x = f.x - camX, y = sy(f.z, f.y), bob = Math.sin(time * 4 + f.x) * 1.5; if (f.t < 3 && Math.floor(time * 8) % 2) return;
  g.fillStyle = 'rgba(20,10,10,.3)'; g.beginPath(); g.ellipse(x, sy(f.z, 0), 6, 2, 0, 0, 7); g.fill(); const Y = y - 4 + bob;
  if (f.k === 'kit') { poly(g, [[x - 6, Y - 4], [x + 6, Y - 4], [x + 6, Y + 4], [x - 6, Y + 4]], '#efe8dc'); g.fillStyle = '#d83a3a'; g.fillRect(x - 1, Y - 3, 2, 6); g.fillRect(x - 3, Y - 1, 6, 2); }
  else if (f.k === 'fish') { poly(g, [[x - 7, Y], [x + 4, Y - 3], [x + 7, Y], [x + 4, Y + 3]], '#9ab0c4'); poly(g, [[x - 7, Y], [x - 10, Y - 3], [x - 10, Y + 3]], '#7a90a0'); }
  else if (f.k === 'bread') { g.fillStyle = OUT; g.beginPath(); g.ellipse(x, Y, 9, 4, 0, 0, 7); g.fill(); g.fillStyle = '#d8a050'; g.beginPath(); g.ellipse(x, Y, 8, 3, 0, 0, 7); g.fill(); g.strokeStyle = '#a86a28'; g.beginPath(); g.moveTo(x - 4, Y - 2); g.lineTo(x - 2, Y + 1); g.moveTo(x, Y - 2); g.lineTo(x + 2, Y + 1); g.moveTo(x + 4, Y - 2); g.lineTo(x + 6, Y + 1); g.stroke(); }
  else if (drawFood3(f, x, Y)) {}
  else if (f.k === 'pretzel') { g.strokeStyle = OUT; g.lineWidth = 3.4; g.beginPath(); g.arc(x - 3, Y, 3.5, 0, 7); g.arc(x + 3, Y, 3.5, 0, 7); g.stroke(); g.strokeStyle = '#b8743a'; g.lineWidth = 2; g.beginPath(); g.arc(x - 3, Y, 3.5, 0, 7); g.stroke(); g.beginPath(); g.arc(x + 3, Y, 3.5, 0, 7); g.stroke(); g.lineWidth = 1; }
  else { limb(g, [[x - 7, Y], [x + 7, Y - 1]], 4, '#a8442a'); }
}

// progressive breakage: every hit on a small or medium breakable shows — cracks, then missing planks, dents, a lid knocked off
function drawDamage(b, hits, W, H, c, dk) {
  const st = Math.min(3, Math.ceil(hits / b.max * 3.0001)) + (b.max <= 2 ? 1 : 0), K = 'rgba(16,8,8,.85)', hole = '#1a1010';
  const crack = (x0, y0, len, a) => { g.strokeStyle = K; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); let x = x0, y = y0; for (let k = 0; k < 3; k++) { x += Math.cos(a + (k % 2 ? .6 : -.5)) * len / 3; y += Math.sin(a + (k % 2 ? .6 : -.5)) * len / 3; g.lineTo(x, y); } g.stroke(); };
  const jag = (x0, y0, x1, y1, col) => { const pts = [[x0, y0], [x1, y0]]; for (let k = 0; k <= 4; k++) pts.push([x1 - (x1 - x0) * k / 4, y1 + (k % 2 ? -2 : 1.5)]); poly(g, pts, col); };
  switch (b.k) {
    case 'crate': case 'fishcrate':
      crack(-W / 2 + 4, -H + 2, H * .6, 1.3); poly(g, [[W / 2, -H], [W / 2 - 4, -H], [W / 2, -H + 4]], hole);
      if (st >= 2) { jag(-W / 2 + 2, -H * .62, W / 2 - 2, -H * .4, hole); g.fillStyle = b.k === 'fishcrate' ? '#b8c8d8' : '#d8c070'; g.fillRect(-W / 4, -H * .52, W / 2, 2); g.fillStyle = '#c8c8c8'; g.fillRect(-W / 2 + 2, -H * .6, 1, 1); g.fillRect(W / 2 - 3, -H * .6, 1, 1); }
      if (st >= 3) { jag(-W / 2 + 2, -H * .3, W * .1, -H * .1, hole); poly(g, [[-W / 2, -H], [-W / 2 + 8, -H], [-W / 2, -H + 9]], hole); g.strokeStyle = c; g.lineWidth = 2; g.beginPath(); g.moveTo(W * .1, -H * .2); g.lineTo(W * .3, -H * .05); g.stroke(); } break;
    case 'barrel':
      crack(-W * .1, -H + 2, H * .7, 1.5);
      if (st >= 2) { g.fillStyle = '#3a3a3a'; g.save(); g.rotate(.12); g.fillRect(-W / 2, -H * .62, W, 2); g.restore(); poly(g, [[W * .15, -H + 1], [W * .25, -H + 1], [W * .22, -H * .3], [W * .17, -H * .35]], hole); }
      if (st >= 3) { poly(g, [[-W * .35, -H * .8], [-W * .1, -H * .85], [-W * .12, -H * .15], [-W * .32, -H * .2]], hole); g.fillStyle = 'rgba(200,170,90,.8)'; g.fillRect(-W * .3, -H * .2, 3, 6); } break;
    case 'bin':
      g.strokeStyle = K; g.lineWidth = 1; g.beginPath(); g.arc(W * .1, -H * .45, 4, .4, 2.6); g.stroke();
      if (st >= 2) { g.save(); g.translate(W * .25, -H - 4); g.rotate(.5); poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2 - 2, -3], [-W / 2 + 2, -3]], shadeC(c, .2)); g.restore(); g.fillStyle = '#e8d070'; g.fillRect(-W / 2 + 3, -H - 3, 5, 3); g.fillStyle = '#9a8a6a'; g.fillRect(-2, -H - 2, 6, 2); }
      if (st >= 3) { g.beginPath(); g.arc(-W * .2, -H * .7, 5, -.6, 1.6); g.stroke(); poly(g, [[-W / 2 + 1, -H * .35], [-W / 2 + 6, -H * .45], [-W / 2 + 4, -H * .15]], hole); } break;
    case 'newsbox':
      g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = .8; for (let k = 0; k < 5; k++) { const a = k * 1.3; g.beginPath(); g.moveTo(2, -H + 7.5); g.lineTo(2 + Math.cos(a) * 5, -H + 7.5 + Math.sin(a) * 3); g.stroke(); }
      if (st >= 2) { poly(g, [[-W / 2 + 2, -H * .55], [W / 2 - 2, -H * .55], [W / 2 - 4, -H * .2], [-W / 2 + 2, -H * .25]], hole); g.fillStyle = '#efe6d2'; g.save(); g.translate(W / 2 - 2, -H * .45); g.rotate(.4); g.fillRect(0, 0, 6, 4); g.restore(); }
      if (st >= 3) { g.strokeStyle = K; g.beginPath(); g.arc(-W * .15, -H * .8, 4, 0, 3); g.stroke(); g.fillStyle = shadeC(c, .2); g.save(); g.translate(-W / 2 - 3, -H * .3); g.rotate(-.6); g.fillRect(0, 0, 3, H * .3); g.restore(); } break;
    case 'chair': case 'stool': g.fillStyle = hole; g.fillRect(W / 2 - 2, -H * .2, 2, H * .2); crack(-W / 2 + 1, -H * .5, W * .6, .1); break;
    case 'bottles': g.fillStyle = hole; g.fillRect(-W / 2 + 6, -H - 6, 3, 6); poly(g, [[-W / 2 + 6, -H + 1], [-W / 2 + 7, -H - 2], [-W / 2 + 8, -H], [-W / 2 + 9, -H - 3], [-W / 2 + 9, -H + 1]], '#5a8a4a'); g.fillStyle = 'rgba(240,210,110,.7)'; g.fillRect(-W / 2 + 4, -1, 8, 1.5); break;
    case 'pot': poly(g, [[-W * .2, -H * .8], [W * .15, -H * .7], [W * .05, -H * .3], [-W * .2, -H * .35]], hole); break;
  }
}
