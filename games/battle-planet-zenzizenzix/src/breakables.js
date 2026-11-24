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
let BREAK = [], FOOD = [];
const FOODS = { havre: ['fish', 'bread'], soif: ['pretzel', 'sausage', 'bread'] };
function initBreakables(scr) {
  BREAK = []; FOOD = []; scr.boxes = scr.boxes.filter(b => !b.bk);
  for (const it of scr.items || []) { const K = BK[it.k]; const b = { ...it, ...K, ...it, hp: K.hp, max: K.hp, y: 0, vx: 0, vy: 0, held: null, thrown: false, rot: 0, flash: 0, id: Math.random() };
    if (it.col) b.col = it.col; if (K.solid) { b.box = { x: b.x - b.w / 2, z: b.z - b.d / 2, w: b.w, d: b.d, h: b.h, bk: b }; scr.boxes.push(b.box); } BREAK.push(b); }
}
function removeBox(b) { if (b.box) { const i = scr.boxes.indexOf(b.box); if (i >= 0) scr.boxes.splice(i, 1); b.box = null; } }
function smash(b, dir = 0) {
  b.broken = true; removeBox(b); WORLD.shake = Math.max(WORLD.shake, b.size === 'l' ? 6 : 3); noise(b.size === 'l' ? .3 : .15, .07);
  const n = b.size === 'l' ? 14 : b.size === 'm' ? 9 : 6;
  for (let k = 0; k < n; k++) fx.push({ k: 'debris', x: b.x + (Math.random() - .5) * b.w, z: b.z + (Math.random() - .5) * 6, y: (b.y || 0) + Math.random() * b.h, vx: (Math.random() - .5) * 220 + dir * 60, vy: 80 + Math.random() * 200, rot: Math.random() * 6, vr: (Math.random() - .5) * 20, t: 1.4, col: k % 3 ? b.col : shadeC(b.col, -.3), w: 3 + Math.random() * (b.size === 'l' ? 8 : 5) });
  if (b.k === 'bottles') for (let k = 0; k < 6; k++) fx.push({ k: 'debris', x: b.x, z: b.z, y: 8, vx: (Math.random() - .5) * 200, vy: 100 + Math.random() * 120, rot: 0, vr: 9, t: 1, col: '#9adcb8', w: 2 });
  if (b.k === 'car' || b.k === 'moto' || b.k === 'forklift') { for (let k = 0; k < 6; k++) fx.push({ k: 'smoke', x: b.x + (Math.random() - .5) * b.w, z: b.z, y: 10, f: 1, t: 1.4 }); fx.push({ k: 'ring', x: b.x, z: b.z, max: b.w, t: .4, col: '#ffd060' }); }
  INKFX.push({ k: 'sfx', text: (LANG === 'fr' ? ['CRAC !', 'KRSSH !', 'PATATRAS !', 'SCRONCH !'] : ['CRACK!', 'KRSSH!', 'CRASH!', 'SKRONCH!'])[(Math.random() * 4) | 0], x: (b.x - camX) * 1.5, y: sy(b.z, b.h) * 1.5 - 20, size: b.size === 'l' ? 30 : 22, t: 0, rot: (Math.random() - .5) * .4 });
  const lv = LEVELS[LEVEL] ? LEVELS[LEVEL].id : 'havre';
  if (Math.random() < (b.food || .12)) FOOD.push({ k: pickA(FOODS[lv] || FOODS.havre), x: b.x, z: b.z, y: 10, vy: 140, t: 12 });
}
function damageBreakable(b, dmg, dir) { if (b.broken || b.held) return; b.hp -= dmg; b.flash = .12; b.vx += dir * (b.size === 'l' ? 0 : 30); beep(260 - b.hp * 5, .05, 'square', .04, -40); if (b.hp <= 0) smash(b, dir); else if (b.size === 'l') { WORLD.shake = Math.max(WORLD.shake, 1.5); for (let k = 0; k < 2; k++) fx.push({ k: 'debris', x: b.x + dir * -b.w / 2, z: b.z, y: b.h * .6, vx: dir * 80 + (Math.random() - .5) * 60, vy: 90, rot: 0, vr: 8, t: .8, col: b.col, w: 2.5 }); } }
// a player's swing also hits whatever breakable is in reach
function hitBreakables(p, R, D) { for (const b of BREAK) if (!b.broken && !b.held && !b.thrown && Math.abs(b.z - p.z) < 16 + b.d / 3 && (b.x - p.x) * p.face > -b.w / 2 - 4 && Math.abs(b.x - p.x) < R + b.w / 2) damageBreakable(b, D, p.face); }
// attack next to a small/medium breakable picks it up; attack while carrying throws it
function carryAction(p) {
  if (p.hold) { carryThrow(p); return true; }
  const foe = enemies.some(e => !e.dead && Math.abs(e.x - p.x) < reachOf(p) + 6 && Math.abs(e.z - p.z) < 14);
  if (foe) return false;
  const b = BREAK.find(b => !b.broken && !b.held && !b.thrown && b.size !== 'l' && Math.abs(b.x - p.x) < 20 + b.w / 2 && Math.abs(b.z - p.z) < 14 && p.y < 4);
  if (!b) return false;
  b.held = p; p.hold = b; p.liftT = .2; beep(330, .08, 'triangle', .04, 200); return true;
}
function carryThrow(p, drop) {
  const b = p.hold; if (!b) return; p.hold = null; b.held = null; b.thrown = !drop; b.from = p; b.x = p.x + p.face * 10; b.z = p.z; b.y = p.y + heroHeight(p.w.id, RIG_S) + 4;
  b.vx = drop ? 0 : p.face * (b.size === 's' ? 360 : 300); b.vy = drop ? 0 : 90; b.hitSet = new Set([p]); p.atk = .2; p.throwT = .25; beep(200, .1, 'sawtooth', .05, 300);
}
function updateBreakables(dt) {
  for (const b of BREAK) { if (b.broken) continue; b.flash = Math.max(0, b.flash - dt);
    if (b.held) { const p = b.held; if (p.ko > 0 || p.fall > 0) { carryThrow(p, true); continue; } b.x = p.x; b.z = p.z; b.y = p.y + heroHeight(p.w.id, RIG_S) + 2; continue; }
    if (b.thrown) { b.x += b.vx * dt; b.vy -= GRAV * .8 * dt; b.y += b.vy * dt; b.rot += dt * 10 * Math.sign(b.vx || 1);
      const dmg = b.size === 's' ? 2 : 3;
      for (const e of enemies) if (!e.dead && !b.hitSet.has(e) && Math.abs(e.x - b.x) < 16 && Math.abs(e.z - b.z) < 14 && b.y < e.y + 60 && b.y > e.y - 4) { b.hitSet.add(e); INK_STRONG = true; hitEnemy(e, dmg, Math.sign(b.vx), b.from, 1.6); INK_STRONG = false; if (!e.dead && e.type !== 'oscar') { e.vy = 150; e.y = Math.max(1, e.y); } smash(b, Math.sign(b.vx)); break; }
      if (b.broken) continue;
      for (const q of players) if (q !== b.from && q.ko <= 0 && !b.hitSet.has(q) && Math.abs(q.x - b.x) < 14 && Math.abs(q.z - b.z) < 12 && b.y < q.y + 56) { b.hitSet.add(q); hitPlayer(q, 1, Math.sign(b.vx), b.from); smash(b, Math.sign(b.vx)); break; }
      if (b.broken) continue;
      for (const o of BREAK) if (o !== b && !o.broken && !o.held && Math.abs(o.x - b.x) < (o.w + b.w) / 2 && Math.abs(o.z - b.z) < (o.d + b.d) / 2 && b.y < o.h) { damageBreakable(o, dmg, Math.sign(b.vx)); smash(b, Math.sign(b.vx)); break; }
      if (b.broken) continue;
      if (b.y <= 0 || blocked(b.x, b.z, b.y) || b.x < camX - 40 || b.x > camX + VW + 40) smash(b, Math.sign(b.vx));
      continue; }
    if (b.vx) { const nx = b.x + b.vx * dt; if (!blocked(nx, b.z, 4)) b.x = nx; b.vx *= Math.pow(.02, dt); if (Math.abs(b.vx) < 2) b.vx = 0; }
  }
  if (BREAK.some(b => b.broken && b.k === 'keg')) oscarKeg();
  BREAK = BREAK.filter(b => !b.broken);
  for (const f of FOOD) { f.t -= dt; if (f.y > 0 || f.vy > 0) { f.vy -= GRAV * dt; f.y = Math.max(0, f.y + f.vy * dt); if (f.y === 0) f.vy = 0; }
    for (const p of players) if (p.ko <= 0 && Math.abs(p.x - f.x) < 14 && Math.abs(p.z - f.z) < 10 && f.y < 6 && p.hp < hpMax(p.w)) { p.hp = Math.min(hpMax(p.w), p.hp + 2); f.t = 0; fx.push({ k: 'plus', x: p.x, z: p.z, t: 1 }); beep(880, .12, 'triangle', .05, 400); pop(p.x, p.z, p.y + 70, LANG === 'fr' ? 'MIAM !' : 'YUM!', '#7dffc0'); break; } }
  FOOD = FOOD.filter(f => f.t > 0);
}
function breakFx(f, dt) { if (f.k !== 'debris') return false; f.vy -= GRAV * dt; f.y = Math.max(0, f.y + f.vy * dt); f.x += f.vx * dt; f.rot += f.vr * dt; if (f.y === 0) { f.vx *= .8; f.vr *= .6; f.vy = Math.abs(f.vy) > 60 ? -f.vy * .3 : 0; } return true; }
function drawBreakFx(f) { if (f.k !== 'debris') return false; const x = f.x - camX, y = sy(f.z, f.y); g.save(); g.globalAlpha = Math.min(1, f.t * 2); g.translate(x, y); g.rotate(f.rot); g.fillStyle = f.col; g.fillRect(-f.w / 2, -1, f.w, 2.2); g.restore(); return true; }
// ---- drawing ----------------------------------------------------------------
function drawBreakable(b) {
  const x = b.x - camX, y = sy(b.z, b.y || 0); if (x < -100 || x > VW + 100) return;
  if (!b.held && !b.thrown) { g.fillStyle = 'rgba(20,10,10,.3)'; g.beginPath(); g.ellipse(x, sy(b.z, 0), b.w * .55, 3, 0, 0, 7); g.fill(); }
  g.save(); g.translate(x + (b.flash > 0 ? (Math.random() - .5) * 2 : 0), y); if (b.thrown || b.held) g.rotate(b.rot);
  const c = b.col, dk = shadeC(c, -.3), lt = shadeC(c, .2), W = b.w, H = b.h, cr = b.hp / b.max;
  switch (b.k) {
    case 'crate': case 'fishcrate': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.strokeStyle = dk; g.lineWidth = 1.2; g.strokeRect(-W / 2 + 2, -H + 2, W - 4, H - 4); g.beginPath(); g.moveTo(-W / 2 + 2, -2); g.lineTo(W / 2 - 2, -H + 2); g.stroke();
      if (b.k === 'fishcrate') for (let k = 0; k < 4; k++) poly(g, [[-W / 2 + 3 + k * 5, -H], [-W / 2 + 7 + k * 5, -H - 4], [-W / 2 + 9 + k * 5, -H]], k % 2 ? '#b8c8d8' : '#9ab0c4'); break;
    case 'barrel': case 'keg': poly(g, [[-W / 2 + 2, 0], [W / 2 - 2, 0], [W / 2, -H / 2], [W / 2 - 2, -H], [-W / 2 + 2, -H], [-W / 2, -H / 2]], c); g.fillStyle = '#3a3a3a'; g.fillRect(-W / 2, -H * .28, W, 2); g.fillRect(-W / 2, -H * .72, W, 2);
      if (b.k === 'keg') { g.fillStyle = '#c8963a'; g.fillRect(W / 2 - 3, -H * .45, 5, 3); g.fillStyle = '#f0d070'; g.fillRect(W / 2 + 2, -H * .42, 2, 4 + Math.sin(time * 6)); g.fillStyle = '#efe6d2'; g.font = 'bold 6px sans-serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'BIÈRE' : 'BEER', 0, -H * .5); } break;
    case 'chair': case 'stool': if (b.k === 'chair') { g.fillStyle = c; g.fillRect(-W / 2, -H, 3, H * .6); } poly(g, [[-W / 2, -H * .45], [W / 2, -H * .45], [W / 2, -H * .55], [-W / 2, -H * .55]], c); g.fillStyle = dk; g.fillRect(-W / 2, -H * .45, 2, H * .45); g.fillRect(W / 2 - 2, -H * .45, 2, H * .45); break;
    case 'bottles': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .6], [-W / 2, -H * .6]], '#8a6a40'); for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? '#5a8a4a' : '#8a5a2a'; g.fillRect(-W / 2 + 2 + k * 4, -H - 2, 3, H * .5); g.fillRect(-W / 2 + 3 + k * 4, -H - 5, 1, 3); } break;
    case 'bin': poly(g, [[-W / 2 + 1, 0], [W / 2 - 1, 0], [W / 2, -H], [-W / 2, -H]], c); poly(g, [[-W / 2 - 2, -H], [W / 2 + 2, -H], [W / 2, -H - 3], [-W / 2, -H - 3]], lt); g.fillStyle = dk; for (let k = 0; k < 3; k++) g.fillRect(-W / 2 + 3 + k * 5, -H + 3, 1.5, H - 6); break;
    case 'pot': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2 - 2, -H], [-W / 2 + 2, -H]], c); g.strokeStyle = dk; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-W / 2 + 2 + k * 4, 0); g.lineTo(-W / 2 + 4 + k * 4, -H); g.stroke(); } break;
    case 'newsbox': poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.fillStyle = '#efe6d2'; g.fillRect(-W / 2 + 2, -H + 4, W - 4, 7); g.fillStyle = '#2a2a2a'; g.font = 'bold 4px sans-serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'LE SOIF' : 'THE THIRST', 0, -H + 9); break;
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
  if (b.size === 'l' && cr < 1) { g.strokeStyle = 'rgba(20,10,10,.7)'; g.lineWidth = 1; const n = Math.floor((1 - cr) * 6); for (let k = 0; k < n; k++) { g.beginPath(); g.moveTo(-W / 2 + (k * 13) % W, -H + 2); g.lineTo(-W / 2 + (k * 13) % W + 4, -H * .5); g.lineTo(-W / 2 + (k * 13) % W, -2); g.stroke(); } }
  g.restore();
}
function drawFood(f) { const x = f.x - camX, y = sy(f.z, f.y), bob = Math.sin(time * 4 + f.x) * 1.5; if (f.t < 3 && Math.floor(time * 8) % 2) return;
  g.fillStyle = 'rgba(20,10,10,.3)'; g.beginPath(); g.ellipse(x, sy(f.z, 0), 6, 2, 0, 0, 7); g.fill(); const Y = y - 4 + bob;
  if (f.k === 'fish') { poly(g, [[x - 7, Y], [x + 4, Y - 3], [x + 7, Y], [x + 4, Y + 3]], '#9ab0c4'); poly(g, [[x - 7, Y], [x - 10, Y - 3], [x - 10, Y + 3]], '#7a90a0'); }
  else if (f.k === 'bread') { g.fillStyle = OUT; g.beginPath(); g.ellipse(x, Y, 9, 4, 0, 0, 7); g.fill(); g.fillStyle = '#d8a050'; g.beginPath(); g.ellipse(x, Y, 8, 3, 0, 0, 7); g.fill(); g.strokeStyle = '#a86a28'; g.beginPath(); g.moveTo(x - 4, Y - 2); g.lineTo(x - 2, Y + 1); g.moveTo(x, Y - 2); g.lineTo(x + 2, Y + 1); g.moveTo(x + 4, Y - 2); g.lineTo(x + 6, Y + 1); g.stroke(); }
  else if (f.k === 'pretzel') { g.strokeStyle = OUT; g.lineWidth = 3.4; g.beginPath(); g.arc(x - 3, Y, 3.5, 0, 7); g.arc(x + 3, Y, 3.5, 0, 7); g.stroke(); g.strokeStyle = '#b8743a'; g.lineWidth = 2; g.beginPath(); g.arc(x - 3, Y, 3.5, 0, 7); g.stroke(); g.beginPath(); g.arc(x + 3, Y, 3.5, 0, 7); g.stroke(); g.lineWidth = 1; }
  else { limb(g, [[x - 7, Y], [x + 7, Y - 1]], 4, '#a8442a'); }
}
