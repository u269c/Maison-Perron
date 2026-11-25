(() => {
// ===== a playtest harness: bots drive the real game loop through readInput; renders are stubbed =====
const BOT = window.BOT = { kind: 'naive', solo: false, m: [{}, {}], fc: 0 };
let S = 1; const R = () => (S = (Math.imul(S, 1664525) + 1013904223) >>> 0) / 4294967296;
const blank = () => ({ tap: 0, x: 0, z: 0, j: false, a: false, s: false, c: false, start: false, cmd: 0 });
render = () => {}; renderCut = () => {}; climbRender = () => {}; endOverlay = () => {}; window.requestAnimationFrame = () => 0;
try { musicTick = () => {}; musicPlay = () => {}; ambStart = () => {}; ambTick = () => {}; } catch (e) {}
let ST = null;
const sgn = v => v > 0 ? 1 : v < 0 ? -1 : 0;
// ---- instrumentation
const bossOn = () => WORLD.boss && !WORLD.boss.dead && STATE === 'play' ? WORLD.boss.type : null;   // includes the Zombimare minibosses
const bump = (o, k, v = 1) => { o[k] = (o[k] || 0) + v; };
const _hp = hitPlayer; hitPlayer = function (t, dmg, dir, src) { const b = t.hp, r = _hp.apply(this, arguments); if (r && ST) { const d = Math.max(0, b - Math.max(0, t.hp)), bk = bossOn(); ST.hits++; ST.dmg += d; if (t.hp <= 0 && b > 0) ST.kos++; if (bk) { bump(ST.bossDmg, bk, d); if (t.hp <= 0 && b > 0) bump(ST.bossKo, bk); } } return r; };
const _he = hitEnemy; hitEnemy = function (e, dmg, dir, src) { const b = e.hp, r = _he.apply(this, arguments); if (r && ST && src && src.w) { const k = src === players[0] ? 'p1' : 'p2'; ST.dmgBy[k] = (ST.dmgBy[k] || 0) + Math.max(0, b - Math.max(0, e.hp)); } return r; };
const _ng = newGame; newGame = function () { if (ST) ST.fresh = true; return _ng.apply(this, arguments); };
const _ls = loadScreen; loadScreen = function (i, keep) { if (ST) { if (!ST.fresh && !keep && STATE === 'play' && i === scrIdx) { const bk = bossOn(); if (bk) bump(ST.bossRestart, bk); ST.restarts++; ST.restartAt.push([LEVEL, i, Math.round(ST.t)]); } ST.fresh = false; } return _ls.apply(this, arguments); };
const _od = onEnemyDown; onEnemyDown = function (e) { if (ST) ST.kills++; return _od.apply(this, arguments); };
const _ch = climbHurt; climbHurt = function (c, d, w) { const b = c.fallT, r = _ch.apply(this, arguments); if (r && ST) { ST.climbHits++; if (c.fallT > 0 && !(b > 0)) ST.climbDrops++; } return r; };
// ---- bots
function nearest(list, p) { let b = null, bd = 1e9; for (const o of list) { const d = Math.abs(o.x - p.x) + Math.abs(o.z - p.z) * 1.5; if (d < bd) { bd = d; b = o; } } return b; }
function freeItems(p, r) { return BREAK.filter(b => !b.broken && !b.held && !b.thrown && b.size !== 'l' && Math.abs(b.x - p.x) < r && Math.abs((b.y || 0) - p.y) < 20 && !(scr.sky && ground(b.x, b.z) < -900)); }
function goTo(inp, p, x, z, tol = 6) { const dx = x - p.x, dz = z - p.z; if (Math.abs(dx) > tol) inp.x = sgn(dx); if (Math.abs(dz) > 5) inp.z = sgn(dz); return Math.abs(dx) <= tol && Math.abs(dz) <= 8; }
const tapTap = (d, then = []) => [{ tap: d }, {}, {}, { tap: d }, ...then];
function dumbPlay(p, M) { const inp = blank();
  if (BOT.fc >= (M.until || 0)) { M.until = BOT.fc + 6 + R() * 50; M.x = R() < .55 ? 1 : R() < .5 ? -1 : 0; M.z = R() < .4 ? 0 : R() < .5 ? 1 : -1; M.aR = R() * .5; M.jR = R() * .1; M.tR = R() * .04; M.idle = R() < .1; }
  if (M.idle) return inp; inp.x = M.x; inp.z = M.z; inp.a = R() < M.aR * .4; inp.j = R() < M.jR; inp.s = p.meter >= 100 && R() < .02; if (R() < M.tR) inp.tap = R() < .5 ? 1 : -1; return inp; }
function playBot(i) {
  const p = players[i], inp = blank(), M = BOT.m[i]; if (!p) return inp;
  if (BOT.kind === 'dumb') return dumbPlay(p, M);
  if (BOT.kind === 'idle') return inp;
  if (M.macro && M.macro.length) return Object.assign(inp, M.macro.shift());
  if (p.ko > 0 || p.fall > 0) return inp;
  const good = BOT.kind === 'good';
  // stuck walking: jump, then try another lane
  if (Math.abs(p.x - (M.lx ?? p.x)) < .4 && M.wantX) M.blk = (M.blk || 0) + 1; else M.blk = 0; M.lx = p.x; M.wantX = 0;
  // Zombimare: a bone pile is picked up and thrown before it gets back up
  if (p.hold && p.hold.k === 'bones') { if (!p.lift && !p.throwing) inp.a = BOT.fc % 2 === 0; return inp; }
  { const pile = !p.hold && BREAK.find(b => b.k === 'bones' && b.foe && !b.held && !b.thrown && Math.abs(b.x - p.x) < 220 && Math.abs(b.z - p.z) < 60); if (pile) { if (goTo(inp, p, pile.x - 8 * sgn(pile.x - p.x || 1), pile.z, 9) && BOT.fc % 3 === 0) inp.a = true; M.wantX = inp.x ? 1 : 0; return inp; } }
  const foes = enemies.filter(e => !e.dead && e.state !== 'pile' && e.state !== 'drop' && !e.under && e.x > camX - 10 && e.x < camX + VW + 10 && !(e.type === 'mmf' && ['intro', 'leave'].includes(e.state)) && e.state !== 'kneel' && e.state !== 'escape' && !(e.flee > 50));
  if (foes.length) {
    const e = nearest(foes, p), dx = e.x - p.x, dz = e.z - p.z, adx = Math.abs(dx), s = sgn(dx) || p.face;
    const boss = ['boss', 'oscar', 'calve', 'mmf'].includes(e.type) || !!W4BIG[e.type];
    if (good && e.state === 'wind' && adx < 70 && Math.abs(dz) < 18 && !p.hold && R() < .3) { p.face === s; M.macro = tapTap(-s); return inp; }   // back-dodge
    const wantItem = e.type === 'mmf' ? (good || R() < .6) : (good && e.type === 'calve' && e.state === 'tornado');
    if (p.hold) { if (Math.abs(dz) > 7) inp.z = sgn(dz); if (adx < 50) { inp.x = -s; M.wantX = 1; } else if (adx > 230) { inp.x = s; M.wantX = 1; } else { if (p.face !== s) inp.x = s * .2; else if (Math.abs(dz) <= 10 && !p.lift && !p.throwing) inp.a = true; } return inp; }
    if (wantItem && !M.noItemT) { const it = nearest(freeItems(p, 260), p); if (it) { if (goTo(inp, p, it.x - 8 * sgn(it.x - p.x || 1), it.z, 10) && BOT.fc % 3 === 0) inp.a = true; M.wantX = inp.x ? 1 : 0; return inp; } }
    if ((e.type === 'mmf' && e.open > 0 && (good || R() < .5)) || (good && e.type === 'calve' && e.state === 'tornado')) { if (adx < 120 && adx > 20 && Math.abs(dz) < 12) { M.macro = p.face === s ? tapTap(s) : [{ x: s * .2 }, ...tapTap(s)]; return inp; } }
    const reach = reachOf(p);
    if (adx > reach - 2) { inp.x = s; M.wantX = 1; } else if (adx < 8) { inp.x = -s; M.wantX = 1; } else if (p.face !== s) inp.x = s * .2;
    if (Math.abs(dz) > 6) inp.z = sgn(dz);
    if (adx <= reach + 4 && Math.abs(dz) < 12 && p.face === s) inp.a = BOT.fc % (good ? 5 : 7) === 0;
    if (p.meter >= 100 && R() < .04 && foes.filter(o => Math.abs(o.x - p.x) < 130).length >= (boss ? 1 : 2)) inp.s = true;
    if (inp.z && Math.abs(p.z - (M.lz ?? p.z)) < .3) M.zb = (M.zb || 0) + 1; else M.zb = 0; M.lz = p.z;
    if (M.zb > 12) { const b = scr.boxes.find(b => !b.deck && p.x > b.x - 4 && p.x < b.x + b.w + 4 && p.z + inp.z * 4 > b.z - 3 && p.z + inp.z * 4 < b.z + b.d + 3); if (b) { const tx = p.x - b.x < b.x + b.w - p.x ? b.x - 18 : b.x + b.w + 18; M.macro = Array(Math.min(90, Math.ceil(Math.abs(tx - p.x) / 2))).fill({ x: sgn(tx - p.x) }); M.zb = 0; return inp; } }
    if (M.blk > 18) { inp.j = true; if (M.blk > 50) inp.z = (M.blk >> 4) % 2 ? 1 : -1; }
    if (!scr.sky && inp.x && p.y <= 0 && ground(p.x + inp.x * 20, p.z) < -900) inp.j = true;   // a hole in the way
    return inp;
  }
  if (scr.sky) return skyNav(p, M, inp, good);
  // nobody to fight: walk on (hop the holes), wander back to the middle of the street
  const other = players[1 - i]; if (other && other.ko > 0 && good) { goTo(inp, p, other.x, other.z, 10); return inp; }   // revive the partner
  inp.x = 1; M.wantX = 1; if (Math.abs(p.z - 60) > 20 && R() < .3) inp.z = sgn(60 - p.z);
  if (p.y <= 0 && ground(p.x + 22, p.z) < -900) inp.j = true;
  if (M.blk > 15) { inp.j = true; inp.z = (M.blk >> 5) % 2 ? 1 : -1; }
  return inp;
}
function skyNav(p, M, inp, good) {
  const d = deckUnder(p.x, p.y); if (!d) { inp.x = M.airX ?? 1; return inp; }
  const right = d.x + d.w; let next = null; for (const b of scr.boxes) if (b.deck && b !== d && b.x >= right - 2 && (!next || b.x < next.x)) next = b;
  if (!next) { inp.x = 1; return inp; }
  const gap = next.x - right, tilted = next.seg !== undefined && SKY.tilt > .05, ok = !tilted && next.h - d.h <= 38 && gap < 136;
  if (ok) {
    if (gap < 3) { inp.x = 1; M.wantX = 1; if (M.blk > 10) inp.j = true; return inp; }
    const edge = right - p.x; M.airX = 1;
    if (edge > 30) { inp.x = 1; M.wantX = 1; if (Math.abs(p.z - 60) > 25) inp.z = sgn(60 - p.z); return inp; }
    const dash = gap > 70 && (good || (M.fallsAt && M.fallsAt[next.id] >= 1) || R() < .3);
    if (dash) { if (edge > 22 && edge < 30 + 1) { M.macro = [{ tap: 1 }, {}, {}, { tap: 1 }, { x: 1, j: true }, ...Array(30).fill({ x: 1 })]; M.gapAt = next.id; return inp; } inp.x = edge > 26 ? 1 : -1; M.wantX = 1; return inp; }
    inp.x = 1; M.wantX = 1; if (edge < 12) { inp.j = true; M.gapAt = next.id; M.macro = Array(26).fill({ x: 1 }); } return inp;
  }
  // the way is shut: a puzzle. fetch something, stand, throw
  const P = SKY.P.find(q => !q.done); if (!P) { inp.x = 1; return inp; }
  if (!p.hold) { const it = nearest(freeItems(p, 400).filter(b => b.x > d.x && b.x < right), p); if (it) { const tx = Math.max(d.x + 6, Math.min(right - 6, it.x - 8)); if (goTo(inp, p, tx, it.z, 9) && BOT.fc % 3 === 0) inp.a = true; } else goTo(inp, p, d.x + d.w * .6, 60, 20); return inp; }
  if (p.lift) return inp;
  M.pt = M.pt || {}; const tries = M.pt[SKY.P.indexOf(P)] || 0, OFF = [95, 45, 140, 25, 180, 70];
  const tx = P.k === 'pig' ? right - 30 : P.k === 'bill' ? right - 45 - (tries % 3) * 30 : (P.cx ?? P.x) - (good ? OFF[tries % OFF.length] : 40 + R() * 120);
  const sx = Math.max(d.x + 12, Math.min(right - 10, tx));
  if (!goTo(inp, p, sx, 60, good ? 6 : 16)) return inp;
  if (p.face !== 1) { inp.x = .2; return inp; }
  if (P.k === 'cw' && P.swing && good && Math.abs((P.cx) - (P.x + Math.sin((SKY.t + .35) * 2.4) * 46) * 0 - p.x - 110) > 30) { const fut = P.x + Math.sin((SKY.t + .3) * 2.4) * 46; if (Math.abs(fut - P.x) > 20) return inp; }
  if (P.k === 'bill' && P.cut[0]) { M.macro = [{ j: true }, {}, {}, {}, {}, { a: true }, ...Array(10).fill({})]; return inp; }
  inp.a = true; M.macro = Array(8).fill({}); M.pt[SKY.P.indexOf(P)] = tries + 1; return inp;
}
function climbBot(i) { const c = CLIMB.P[i], inp = blank(), M = BOT.m[i]; if (!c) return inp;
  if (BOT.kind === 'dumb') { if (BOT.fc >= (M.cu || 0)) { M.cu = BOT.fc + 10 + R() * 60; M.cz = R() < .65 ? -1 : R() < .5 ? 1 : 0; } inp.z = M.cz; if (R() < .03) inp.tap = R() < .5 ? 1 : -1; inp.j = R() < .02; inp.a = R() < .05; return inp; }
  inp.z = -1;
  const C = CLIMB, danger = lane => { const x = LANE_X[lane]; for (const o of C.haz) if (!o.dead && Math.abs(o.x - x) < 40 && o.h > c.h && o.h < c.h + 360) return true; for (const w of C.welds) if ((w.on || w.glow) && w.lane === lane && w.h > c.h - 40 && w.h < c.h + 200) return true; for (const b of C.beams) if (b.h > c.h + 40 && b.h < c.h + 200 && Math.abs(b.x - x) < 170) return true; return false; };
  if (BOT.kind === 'naive') { if (danger(c.lane) && R() < .08 && !c.hop) inp.tap = c.lane === 0 ? 1 : c.lane === 5 ? -1 : (R() < .5 ? 1 : -1); else if (R() < .01) inp.tap = R() < .5 ? 1 : -1; inp.a = R() < .04; return inp; }
  if (danger(c.lane)) { inp.z = 0; const o = [c.lane - 1, c.lane + 1].filter(l => l >= 0 && l < 6 && !danger(l)); if (o.length && !c.hop && BOT.fc % 6 === 0) inp.tap = sgn(o[0] - c.lane); if (BOT.fc % 4 === 0) inp.a = true; }
  return inp; }
function menuBot(i) { const inp = blank(); if (i === 0 && BOT.fc % 12 === 0) inp.a = true; return inp; }
readInput = function (i) { if (STATE === 'prologue' || STATE === 'end') return menuBot(i); if (STATE === 'climb') return climbBot(i); if (STATE === 'play') return (BOT.solo && i === 1) ? blank() : playBot(i); return blank(); };
// ---- the run
const sigOf = () => [STATE, LEVEL, typeof scrIdx !== 'undefined' ? scrIdx : -1, WORLD.zoneIdx, WORLD.zoneWave, Math.floor(camX / 48), ST.kills, WORLD.boss ? Math.ceil(WORLD.boss.hp) : -1, scr && scr.sky ? SKY.P.filter(q => q.done).length : 0, STATE === 'climb' ? Math.floor(Math.max(...CLIMB.P.map(c => c.h)) / 60) : 0, STATE === 'prologue' ? CUT.i * 100 + CUT.li : 0, ST.restarts].join('|');
function snap() { return { t: Math.round(ST.t), STATE, LEVEL, scr: typeof scrIdx !== 'undefined' ? scrIdx : -1, camX: Math.round(camX), lockCam, zoneState, zone: WORLD.zoneIdx, wave: typeof waveIdx !== 'undefined' ? waveIdx : -1, waveDelay: typeof waveDelay !== 'undefined' ? +waveDelay.toFixed(2) : -1, setHold: SETP.hold, fadeTo, dlg: DLG.blocking, cut: STATE === 'prologue' ? [CUT.i, CUT.li] : null,
  players: players.map(p => ({ id: p.w.id, x: Math.round(p.x), z: Math.round(p.z), y: Math.round(p.y), vy: Math.round(p.vy || 0), gnd: ground(p.x, p.z), hp: p.hp, ko: +p.ko.toFixed(1), fall: +p.fall.toFixed(1), st: p.state, sp: +(p.sp || 0).toFixed(2), frozen: +(p.frozen || 0).toFixed(1), stat: (p.st || []).map(s => s.k + ':' + (s.t || 0).toFixed(1)).join(','), hold: !!p.hold, lift: !!p.lift, thr: !!p.throwing, dash: +(p.dash || 0).toFixed(2), anchor: !!p.anchor, hop: p.hopT || 0 })),
  enemies: enemies.filter(e => !e.dead).map(e => ({ t: e.type, s: e.state, x: Math.round(e.x), z: Math.round(e.z), y: Math.round(e.y), hp: Math.round(e.hp), on: !!e.onScr })),
  boxes: scr.boxes.filter(b => !b.deck && players.some(p => p.x > b.x - 120 && p.x < b.x + b.w + 120)).map(b => [b.x | 0, b.z | 0, b.w | 0, b.d | 0, b.h | 0, b.bk ? b.bk.k : b.wreck ? 'wreck' : '']), sky: scr && scr.sky ? SKY.P.map(q => q.k + (q.done ? '+' : '-')).join(' ') : null, climb: STATE === 'climb' ? CLIMB.P.map(c => Math.round(c.h)) : null }; }
BOT.start = function (level, kind, solo, pair, seed) {
  S = seed >>> 0 || 1; Math.random = R; BOT.kind = kind; BOT.solo = solo; BOT.m = [{}, {}]; BOT.fc = 0; BOT.level = level;
  ST = BOT.ST = { dmgBy: {}, t: 0, hits: 0, dmg: 0, kos: 0, falls: 0, restarts: 0, restartAt: [], kills: 0, climbHits: 0, climbDrops: 0, stuck: [], maxIdle: 0, idleT: 0, sig: '', screens: {}, scrKey: '', scrT0: 0, fresh: false, done: false, levels: {}, errors: 0, mmfT: 0, bossT: {}, bossDmg: {}, bossKo: {}, bossRestart: {}, refalls: 0, refallAt: [] };
  WSEL = level; LEVEL = level; SEL = { cpu: solo }; beginStory(pair[0], pair[1]); };
BOT.step = function (n, campaign) {
  const dt = 1 / 30;
  for (let k = 0; k < n && !ST.done; k++) {
    for (const p of players) p._f = p.fall > 0;
    if (STATE === 'play') for (const e of enemies) e._prev = { type: e.type, state: e.state, act: e.act, x: e.x, z: e.z, y: e.y, vx: e.vx, vy: e.vy, hop: e.hop, pull: e.pull && { ...e.pull }, zdet: e.zdet && { ...e.zdet }, flee: e.flee, held: !!e.heldBy, bowled: e.bowled, frozen: e.frozen, stun: e.stun, ribbon: !!e.launchBy };
    const _pp = players.map(p => ({ x: p.x, state: p.state, spec: p.spec && p.spec.id, sp: p.sp, w: p.w.id, dash: p.dash, pull: p.pull && { ...p.pull } }));
    frame(last + 1000 / 30); ST.t += dt; BOT.fc++;
    if (STATE === 'play' && !ST.nan) { const bad = [...enemies, ...players].find(o => !Number.isFinite(o.x) || !Number.isFinite(o.z) || !Number.isFinite(o.y)); if (bad) ST.nan = { lvl: LEVEL, scr: scrIdx, who: bad.type || bad.w.id, prev: bad._prev, players: _pp, now: { x: bad.x, z: bad.z, y: bad.y, vx: bad.vx, state: bad.state }, fx: fx.map(f => f.k).join(','), set: SETP.cur && SETP.cur.k }; }
    for (let i = 0; i < players.length; i++) { const p = players[i]; if (STATE === 'play' && p.fall <= 0 && p._f) p._back = ST.t;
      if (STATE === 'play' && p.fall > 0 && !p._f) { ST.falls++; if (p._back && ST.t - p._back < 3) { ST.refalls++; if (ST.refallAt.length < 6) ST.refallAt.push([LEVEL, scrIdx, Math.round(p.x), Math.round(camX)]); } const M = BOT.m[i]; if (M.gapAt) { M.fallsAt = M.fallsAt || {}; M.fallsAt[M.gapAt] = (M.fallsAt[M.gapAt] || 0) + 1; } } }
    const key = STATE === 'play' ? `${LEVEL}:${scrIdx}` : STATE === 'climb' ? `${LEVEL}:climb` : STATE === 'prologue' ? `${LEVEL}:cut` : `${LEVEL}:${STATE}`;
    if (key !== ST.scrKey) { if (ST.scrKey) ST.screens[ST.scrKey] = (ST.screens[ST.scrKey] || 0) + (ST.t - ST.scrT0); ST.scrKey = key; ST.scrT0 = ST.t; }
    if (WORLD.boss && !WORLD.boss.dead && STATE === 'play') { const bk = WORLD.boss.type; ST.bossT[bk] = (ST.bossT[bk] || 0) + dt; }
    const sg = sigOf(); if (sg !== ST.sig) { ST.sig = sg; ST.idleT = 0; } else { ST.idleT += dt; ST.maxIdle = Math.max(ST.maxIdle, ST.idleT); if (ST.idleT > 45 && !ST.stuckNow) { ST.stuckNow = true; ST.stuck.push(snap()); } }
    if (ST.idleT < 1) ST.stuckNow = false;
    if (BOT.fc % 15 === 0 && STATE === 'play') for (const b of BREAK) { if (b.broken || b.held || b.thrown) { b._ft = 0; continue; } const gy = ground(b.x, b.z); if (b.y > Math.max(0, gy) + 3) { b._ft = (b._ft || 0) + .5; if (b._ft > 3 && !b._rep) { b._rep = 1; ST.floats = ST.floats || []; if (ST.floats.length < 5) ST.floats.push({ lvl: LEVEL, scr: scrIdx, k: b.k, x: b.x | 0, y: b.y | 0, z: b.z | 0, gy, fallV: b.fallV, vx: b.vx, vy: b.vy, from: b.from ? b.from.w.id : null, keys: Object.keys(b).join(',') }); } } else b._ft = 0; }
    if (!ST.levels[LEVEL]) ST.levels[LEVEL] = { t0: ST.t };
    if (campaign) { if (STATE === 'end' && LEVEL === LEVELS.length - 1 || STATE === 'title') ST.done = true; }
    else if (LEVEL !== BOT.level || STATE === 'end' || STATE === 'title') ST.done = true;
  }
  if (ST.scrKey) { ST.screens[ST.scrKey] = (ST.screens[ST.scrKey] || 0) + (ST.t - ST.scrT0); ST.scrT0 = ST.t; }
  return { done: ST.done, t: ST.t };
};
BOT.result = function () { const o = { ...ST }; delete o.sig; o.final = snap(); o.levelTimes = Object.fromEntries(Object.entries(ST.levels).map(([k, v]) => [k, v.t0])); return o; };
})();
