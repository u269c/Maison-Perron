// headless balance simulator: seeded randomness, fast-forwarded loop, a bot with a player profile
(function () {
  const ARGS = window.SIMARGS, K = ARGS.k || 20, DT = 1 / 60;
  // seeded randomness so a run can be replayed
  let s = ARGS.seed >>> 0 || 1; Math.random = function () { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const R = Math.random, rr = (a, b) => a + R() * (b - a);
  // real-time timers run K times faster too
  const _st = window.setTimeout; window.setTimeout = (fn, ms, ...a) => _st(fn, (ms || 0) / K, ...a);
  const PROF = {
    kid: { react: [0.3, 0.6], rate: 3.5, reach: 58, wrongFace: 0.12, dodge: 0.2, respect: 0.1, wander: 0.05, wrestle: [3.5, 6], jumpy: 0.08, backoffLow: 0 },
    hard: { react: [0.12, 0.2], rate: 7, reach: 36, wrongFace: 0, dodge: 0.88, respect: 0.92, wander: 0, wrestle: [8, 11], jumpy: 0, backoffLow: 1, reads: 0.85 },
    mash: { react: [0.2, 0.3], rate: 9, reach: 46, wrongFace: 0, dodge: 0, respect: 0, wander: 0, wrestle: [9, 11], jumpy: 0, backoffLow: 0 } };
  const P = PROF[ARGS.prof];
  const M = window.SIM = { done: false, prof: ARGS.prof, seed: ARGS.seed, deaths: {}, landT: {}, lion: {}, stuck: [], fights: [], t: 0, err: [], hpLow: 99 };
  const _hd = heroDown; heroDown = function () { (M.dx = M.dx || []).push([G.land, Math.round(G.hero.x)]); M.deaths[G.land] = (M.deaths[G.land] || 0) + 1; if (G.boss || G.actors.some((a) => a.boss && a.alive)) M.lion.deaths = (M.lion.deaths || 0) + 1; return _hd.apply(this, arguments); };
  const _rs = runScene; runScene = function (n, f) { if (n === 'lionIn') M.lion.in = NOW.t; if (n === 'lionDown') { M.lion.down = NOW.t; M.lion.hpEnd = G.hero.hp; } return _rs.apply(this, arguments); };
  const _rs2 = runScene; runScene = function (n, f) { if (n === 'hydraIn') M.lion.in = NOW.t; if (n === 'hydraDown') { M.lion.down = NOW.t; M.lion.hpEnd = G.hero.hp; } return _rs2.apply(this, arguments); };
  const _wt = wrestleTick; let wasW = false; wrestleTick = function (dt) { const w = !!G.wrestle; if (w && !wasW) M.lion.grabs = (M.lion.grabs || 0) + 1; const hpB = G.wrestle && G.wrestle.a.hp; _wt(dt); if (w && !G.wrestle && G.actors.find((a) => a.boss) && G.actors.find((a) => a.boss).hp < hpB) M.lion.wins = (M.lion.wins || 0) + 1; wasW = !!G.wrestle; };
  const _rs3 = runScene; runScene = function (n, f) { if (n === 'caveIn') M.lion.in = NOW.t + 14; if (n === 'circeIn') M.lion.in = NOW.t + 10; if (n === 'circeDown') { M.lion.down = NOW.t; M.lion.hpEnd = G.hero.hp; } if (n === 'aeolusIn') M.windIn = NOW.t; if (n === 'sirIn') M.sirIn = NOW.t; if (n === 'talosIn') M.lion.in = NOW.t + 8; if (n === 'ladonIn') M.lion.in = NOW.t + 6; if (n === 'prom') M.lion.in = NOW.t + 12; if (n === 'eagleDown') { M.lion.down = NOW.t; M.lion.hpEnd = G.hero.hp; } if (n === 'cerIn') M.cerIn = NOW.t; if (n === 'cerDone') M.cerT = NOW.t - M.cerIn; if (n === 'ladonDown') { M.lion.down = NOW.t; M.lion.hpEnd = G.hero.hp; } if (n === 'leIn') M.leIn = NOW.t; if (n === 'hephIn') M.triT = NOW.t - M.leIn; if (n === 'talosDown') { M.lion.down = NOW.t; M.lion.hpEnd = G.hero.hp; } if (n === 'labIn') M.labIn = NOW.t; if (n === 'asterion') M.labT = NOW.t - M.labIn; if (n === 'sirensDone') M.sirT = NOW.t - M.sirIn; if (n === 'strIn') M.strIn = NOW.t; if (n === 'straitDone') M.strT = NOW.t - M.strIn; if (n === 'windsIn') M.windT = NOW.t - M.windIn; if (n === 'cycDown') { M.lion.down = NOW.t; M.lion.hpEnd = G.hero.hp; } return _rs3.apply(this, arguments); };
  const _hh = hurtHero; hurtHero = function (d, f) { const hp = G.hero.hp; _hh.apply(this, arguments); if (G.hero.hp < hp) { const b = G.boss && G.boss.a; const k = (b && b.mem && b.mem.st) || 'other'; (M.hurt = M.hurt || {})[k] = (M.hurt[k] || 0) + 1; } };

  M.bt = {}; M.bd = {}; let curB = null; const _hd4 = heroDown; heroDown = function () { if (G.boss && G.boss.a) { const id = G.boss.a.id; M.bd[id] = (M.bd[id] || 0) + 1; } return _hd4.apply(this, arguments); };
  const _rs4 = runScene; runScene = function (n, f) { M.calls = (M.calls || 0) + 1; M.callN = M.callN || {}; M.callN[n] = (M.callN[n] || 0) + 1; const map = { typhonDown: 'typhon', argusDown: 'argus', heraHeld: 'heraQ' }; if (map[n] && M.bt[map[n]]) M.bt[map[n]].e = Math.round(NOW.t - M.bt[map[n]].s); const ok = _rs4.apply(this, arguments); if (G.script && G.script.name === n) { M.scenes = (M.scenes || 0) + 1; (M.sceneLog = M.sceneLog || []).push(n); if (M.sceneLog.length > 400) M.sceneLog.shift(); } return ok; };
  const B4 = { gseen: 0 };
  // the bot: decides at reaction-time intervals, presses buttons at its own rate
  const B = { next: 0, hold: null, nextAtk: 0, nextW: 0, best: {}, bestT: 0, lastLand: '', wanderT: 0 };
  function release() { for (const k of ['left', 'right']) GAME.hold(k, false); }
  const reachB = () => P.reach + 8;
  function decide() { const h = G.hero, foes = G.actors.filter((a) => a.foe && a.alive && !a.hidden && (!a.ghostNow || a.brain === 'circe') && Math.abs(a.x - h.x) < 220);
    release(); B.hold = null; B.mode = 'walk';
    if (B.wanderT > NOW.t) { B.hold = 'left'; return; } if (R() < P.wander * (B.dt || 0.4)) { B.wanderT = NOW.t + rr(0.4, 1.4); B.hold = 'left'; return; }
    if (G.sky && G.land === 'hesperides') { if (G.sky.lean > 0.15 || G.sky.v > 0.3) B.hold = R() < 0.85 ? 'left' : null; else if (G.sky.lean < -0.15 || G.sky.v < -0.3) B.hold = R() < 0.85 ? 'right' : null; return; }
    if (G.land === 'lemnos' && !flag('tripods')) { const tr = G.actors.filter((a) => a.brain === 'tripod' && a.mem.st !== 'caught'); if (tr.length) { const t = tr.reduce((a, b) => Math.abs(a.x - h.x) < Math.abs(b.x - h.x) ? a : b), d = t.x - h.x; if (Math.abs(d) > P.reach * 0.6) { B.hold = d > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(d) || 1; return; } }
    if (G.land === 'hesperides' && G.boss) { const L = G.actors.find((a) => a.brain === 'ladon' && a.alive); if (L) { const m = L.mem, side = Math.sign(h.x - 1700) || -1;
      if (m.st === 'lunge' && m.low && h.ground && R() < P.dodge + 0.45) { Input.press('jump'); return; } if (m.st === 'tail' && m.tailX != null && Math.abs(m.tailX - h.x) < 40 && h.ground && R() < P.dodge + 0.4) { Input.press('jump'); return; }
      if (m.st === 'rest') { const d = m.hx - h.x; if (Math.abs(d) > P.reach * 0.5) { B.hold = d > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(d) || 1; return; }
      const tgt = 1700 + side * (P.reads ? 140 : 80), d = tgt - h.x; if (Math.abs(d) > 12) B.hold = d > 0 ? 'right' : 'left'; return; } }
    if (G.land === 'caucasus' && G.boss) { const E = G.actors.find((a) => a.brain === 'eagle' && a.alive); if (E) { const m = E.mem;
      if ((m.st === 'diveTell' || m.st === 'dive') && Math.abs(h.x - m.tx) < 34 && R() < P.dodge + 0.4) { B.hold = h.x < m.tx ? 'left' : 'right'; B.mode = 'dodge'; return; }
      const fe = G.objs.find((o) => o.kind === 'efeather' && Math.abs(o.x - h.x) < 12); if (fe && R() < P.dodge + 0.3) { B.hold = h.x < fe.x ? 'left' : 'right'; return; }
      if (m.st === 'ground') { const d = E.x - h.x; if (Math.abs(d) > P.reach * 0.5) { B.hold = d > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(d) || 1; return; } if (P.reads && m.st === 'circle') { const d = E.x - h.x; if (Math.abs(d) > 70) B.hold = d > 0 ? 'right' : 'left'; } return; } }
    if (G.land === 'underworld' && G.cer && !flag('cerberus') && G.cerTold) { const cb = G.actors.find((a) => a.id === 'cerberus'); if (cb) { const H = cb.heads, idx = [0, 1, 2].filter((i) => H[i].st === 'calm'), grow = [0, 1, 2].find((i) => (H[i].st === 'growl' || H[i].st === 'snap') && Math.abs(h.x - (1100 + [-30, 0, 30][i])) < 26);
      if (grow != null && R() < P.dodge + 0.4) { B.hold = h.x < 1100 + [-30, 0, 30][grow] ? 'left' : 'right'; return; } if (idx.length) { const i = idx.reduce((a, b) => Math.abs(1100 + [-30, 0, 30][a] - h.x) < Math.abs(1100 + [-30, 0, 30][b] - h.x) ? a : b), d = 1100 + [-30, 0, 30][i] - h.x; if (Math.abs(d) > 8) { B.hold = d > 0 ? 'right' : 'left'; return; } if (R() < 0.6) Input.press('use'); return; } if (h.x > 1040) B.hold = 'left'; return; } }
    if (G.land === 'labyrinth' && G.lab && !foes.length) { const L = G.lab, tr = L.tried[L.room] || [], i = [0, 1, 2].find((k) => !tr.includes(k)), d = [90, 240, 390][i] - h.x; if (Math.abs(d) > 10) { B.hold = d > 0 ? 'right' : 'left'; return; } if (R() < 0.6) Input.press('up'); return; }
    if (G.land === 'sirens' && !flag('sirens')) { const dz = G.actors.filter((a) => a.id === 'sailor' && a.dazed); if (!(G.wax > 0)) { if (h.x > 78) B.hold = 'left'; return; } if (dz.length) { const t = dz.reduce((a, b) => Math.abs(a.x - h.x) < Math.abs(b.x - h.x) ? a : b), d = t.x - h.x; if (Math.abs(d) > 18) { B.hold = d > 0 ? 'right' : 'left'; return; } if (R() < 0.7) Input.press('use'); return; } }
    if (G.land === 'strait' && G.straitOn && G.strait) { const hs = G.strait.heads.filter((q) => !q.gone), aim = hs.find((q) => q.st === 'aim' && Math.abs(q.tx - h.x) < 28), stk = hs.find((q) => q.st === 'stuck');
      if (aim && R() < P.dodge + 0.45) { B.hold = h.x < aim.tx ? 'left' : 'right'; B.mode = 'dodge'; return; } if (stk) { const d = stk.tx - h.x; if (Math.abs(d) > P.reach * 0.5) { B.hold = d > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(d) || 1; return; } if (Math.abs(360 - h.x) > 80) B.hold = 360 > h.x ? 'right' : 'left'; return; }

    if (G.land === 'etna' && G.boss) { const T0 = G.actors.find((a) => a.brain === 'typhon' && a.alive); if (T0) { const m = T0.mem;
      if (m.st === 'breathTell' && !B4.br) { B4.br = 1; B4.brOk = R() < P.dodge + 0.45; } if (m.st !== 'breathTell' && m.st !== 'breath') B4.br = 0;
      if (m.st === 'breath' || (m.st === 'breathTell' && T0.mem.t > T0.C.breathTell - 0.25)) { const wantJump = B4.brOk ? m.low : R() < 0.5; if (wantJump && h.ground) Input.press('jump'); return; }
      const lv = G.objs.find((o) => o.kind === 'lava' && Math.abs(o.x - h.x) < 16); if (lv && R() < P.dodge + 0.35) { B.hold = h.x < lv.x ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (m.st === 'lavaTell' && m.spots && m.spots.some((q) => Math.abs(q - h.x) < 14) && R() < P.dodge + 0.3) { const q = m.spots.find((q) => Math.abs(q - h.x) < 14); B.hold = h.x < q ? 'left' : 'right'; return; }
      if ((m.st === 'slamTell' || m.st === 'slam') && Math.abs(h.x - m.tx) < 40 && R() < P.dodge + 0.35) { B.hold = h.x < m.tx ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (m.st === 'stuck' && T0.chained) { const gd = m.tx + 10 - h.x; if (Math.abs(gd) > P.reach * 0.5) { B.hold = gd > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(gd) || 1; return; }
      if (P.reads && m.st === 'idle') { const gd = 1150 - h.x; if (Math.abs(gd) > 40) B.hold = gd > 0 ? 'right' : 'left'; } return; } }
    if (G.land === 'heraion' && G.boss) { const A = G.actors.find((a) => a.brain === 'argus' && a.alive); if (A) { const m = A.mem, d = A.x - h.x;
      if ((m.st === 'fan' || m.st === 'gaze') && m.cols) { const bad = m.cols.find((c, i) => Math.abs(c - h.x) < 12 && (m.st === 'fan' || i >= m.fired)); if (bad != null && R() < P.dodge + 0.4) { const L = h.x - 1, Rr = h.x + 1; let best = null; for (let k = 4; k < 80; k += 4) { if (m.cols.every((c) => Math.abs(c - (h.x - k)) > 14)) { best = -1; break; } if (m.cols.every((c) => Math.abs(c - (h.x + k)) > 14)) { best = 1; break; } } B.hold = best > 0 ? 'right' : 'left'; B.mode = 'dodge'; } return; }
      if (m.st === 'daze') { if (Math.abs(d) > P.reach * 0.5) { B.hold = d > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(d) || 1; return; }
      if (m.st === 'peckTell' && Math.abs(d) < 50 && R() < P.dodge + 0.25) { B.hold = d > 0 ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (Math.abs(d) < 60) B.hold = d > 0 ? 'left' : 'right'; else if (Math.abs(d) > 110) B.hold = d > 0 ? 'right' : 'left'; return; } }
    if (G.land === 'olympus' && G.boss && G.heraFight) { const P4 = G.heraFight, Hq = G.actors.find((a) => a.id === 'heraQ' && !a.decoy && a.alive), m = Hq ? Hq.mem : {}; if (Hq) {
      const hit = (tx) => { const gd = tx - h.x; if (Math.abs(gd) > P.reach * 0.45) { B.hold = gd > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(gd) || 1; };
      const eye = G.objs.find((o) => o.kind === 'peye' && o.vy > -40 && Math.abs(o.x + o.vx * 0.35 - h.x) < 14); if (eye && R() < P.dodge + 0.3) { B.hold = (eye.x + eye.vx * 0.35) > h.x ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (P4.phase === 'queen') { if (P4.guest && !P4.struck) { hit(Hq.x); return; }
        if (m.st === 'charge' && Math.abs(Hq.x - h.x) < 46 && Math.sign(h.x - Hq.x) === m.dir && h.ground && R() < P.dodge + 0.45) { Input.press('jump'); return; }
        if (m.st === 'volleyTell' && m.tx != null && Math.abs(h.x - m.tx) < 30 && R() < P.dodge + 0.3) { B.hold = h.x < m.tx ? 'left' : 'right'; return; }
        if (m.st === 'rest') { hit(Hq.x); return; } const gd = Hq.x - h.x; if (Math.abs(gd) < 70) B.hold = gd > 0 ? 'left' : 'right'; else if (Math.abs(gd) > 150) B.hold = gd > 0 ? 'right' : 'left'; return; }
      if (P4.phase === 'mad1' || P4.phase === 'mad2') { const want = P4.phase === 'mad1' ? 'g' : 'm'; if (G.world !== want && R() < (P.reads ? 0.9 : 0.35)) { toggleWorld(); return; }
        if (G.world === want) { hit(Hq.x); return; } if (!B4.pick || B4.pick.hidden || !B4.pick.alive) { const all = G.actors.filter((a) => a.id === 'heraQ' && a.alive && !a.hidden); B4.pick = all[Math.floor(R() * all.length)]; } if (B4.pick) hit(B4.pick.x); return; }
      if (P4.phase === 'crack') { const b = P4.bonds.find((q) => !q.done); if (!b) return; if (G.world === 'g') B4.gseen += B.dt || 0.4; if (B4.gseen < 0.8) { if (G.world !== 'g' && R() < 0.6) toggleWorld(); return; } if (G.world !== 'm') { if (R() < (P.reads ? 0.9 : 0.5)) toggleWorld(); return; } hit(b.x); return; } } }
    { const near = foes.filter((a) => Math.abs(a.x - h.x) < 160); if (!near.length) { const nv = NAV(); B.navOn = !!nv; if (nv) { const gd = nv.x - h.x; B.hold = Math.abs(gd) > 6 ? (gd > 0 ? 'right' : 'left') : null; if (nv.jump && h.ground && R() < 0.7) { Input.press('jump'); B.jumpT = NOW.t; if (nv.after) B.navX = nv.after; } if (nv.up && Math.abs(gd) < 12 && R() < 0.6) Input.press('up'); if (nv.world && G.world !== nv.world && Math.abs(gd) < (nv.wd || 60) && h.ground && R() < 0.6) toggleWorld(); return; } } }
    if (!foes.length) { B.hold = 'right'; return; }
    const t = foes.reduce((a, b) => Math.abs(a.x - h.x) < Math.abs(b.x - h.x) ? a : b), d = t.x - h.x, ad = Math.abs(d), m = t.mem || {}, dir = Math.sign(d) || 1; B.t = t;
    // threats the player may or may not read
    if (t.brain === 'boar') { const st = m.st; if (st === 'stuck') { if (ad > reachB()) { B.hold = dir > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = dir; return; } if (P.reads && (st === 'paw' || st === 'charge')) { const dr = G.objs.filter((o) => o.kind === 'drift').sort((p, q) => Math.abs(p.x - h.x) - Math.abs(q.x - h.x))[0]; if (dr && Math.abs(dr.x - h.x) > 30 && st === 'paw') { B.hold = dr.x > h.x ? 'right' : 'left'; return; } } return; }
    if (t.brain === 'wind') { const st = m.st; if (st === 'tired') { if (ad > P.reach * 0.6) { B.hold = dir > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = dir; return; } if (P.reads && R() < P.reads) { if (ad < 90) { B.hold = dir > 0 ? 'left' : 'right'; return; } B.hold = null; return; } if (ad > P.reach) { B.hold = dir > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = dir; return; }
    if (t.brain === 'circe') { const st = m.st, pot = G.objs.find((o) => o.kind === 'cauldron'), fl = G.objs.find((o) => o.kind === 'flask');
      if (fl && R() < P.dodge + 0.35) { const land = fl.x + fl.vx * 0.4; if (Math.abs(land - h.x) < 36) { B.hold = h.x < land ? 'left' : 'right'; B.mode = 'dodge'; return; } }
      if (st === 'zapTell' && ad < 50 && R() < P.dodge + 0.2) { B.hold = dir > 0 ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (st === 'stir' && pot) { const sd = h.x > pot.x + 4 ? 1 : -1, gd = pot.x + sd * 14 - h.x; if (Math.abs(gd) > P.reach * 0.4) { B.hold = gd > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = -sd; return; }
      if (P.reads && R() < P.reads) { const gd = (t.x - 90) - h.x; if (Math.abs(gd) > 20) B.hold = gd > 0 ? 'right' : 'left'; return; } }
    if (t.brain === 'talos') { const st = m.st, wv = G.objs.find((o) => o.kind === 'wave' && Math.abs(o.x - h.x) < 30 && Math.sign(h.x - o.x) === o.dir); if (wv && h.ground && R() < P.dodge + 0.4) { Input.press('jump'); return; }
      if (st === 'stuck' && t.nailX != null) { const gd = t.nailX - h.x; if (Math.abs(gd) > P.reach * 0.5) { B.hold = gd > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(gd) || 1; return; }
      if ((st === 'slamTell' || st === 'slam') && Math.abs(h.x - m.tx) < 45 && R() < P.dodge + 0.35) { B.hold = h.x < m.tx ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (st === 'throwTell' && Math.abs(h.x - m.tx) < 30 && R() < P.dodge + 0.25) { B.hold = h.x < m.tx ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (st === 'stompTell' && ad < 70 && R() < P.dodge + 0.2) { B.hold = dir > 0 ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (P.reads && R() < P.reads) { if (ad < 80) { B.hold = dir > 0 ? 'left' : 'right'; return; } if (ad > 120) { B.hold = dir > 0 ? 'right' : 'left'; return; } B.hold = null; return; } }
    if (t.brain === 'cyclops') { const st = m.st, away = (tx, k) => { B.hold = h.x < tx ? 'left' : 'right'; B.mode = 'dodge'; };
      if (st === 'stuck' && t.handX != null) { const gd = t.handX - h.x; if (Math.abs(gd) > P.reach * 0.5) { B.hold = gd > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(gd) || 1; return; }
      if ((st === 'slamTell' || st === 'slam') && Math.abs(h.x - m.tx) < 45 && R() < P.dodge + 0.35) { away(m.tx); return; }
      if (st === 'throwTell' && Math.abs(h.x - m.tx) < 30 && R() < P.dodge + 0.25) { away(m.tx); return; }
      if ((st === 'sweepTell' || st === 'sweep') && ad < 80 && R() < P.dodge + 0.2) { away(t.x); return; }
      if (P.reads && R() < P.reads) { if (ad < 80) { B.hold = dir > 0 ? 'left' : 'right'; return; } if (ad > 120) { B.hold = dir > 0 ? 'right' : 'left'; return; } B.hold = null; return; } }
    if (t.boss && !t.heads && t.brain === 'lion') { const st = m.state;
      const bd = G.bounds || [0, 1e9], cornered = dir > 0 ? h.x - bd[0] < 70 : bd[1] - h.x < 70;
      if ((st === 'crouch' || st === 'pounce') && ad < 170 && cornered && R() < P.dodge) { B.hold = dir > 0 ? 'right' : 'left'; B.mode = 'dodge'; return; }
      if ((st === 'crouch' || st === 'pounce') && ad < 170 && R() < P.dodge) { if (st === 'crouch' && ad < 110 && R() < 0.6) Input.press('jump'); B.hold = dir > 0 ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (st === 'swipe' && ad < 70 && R() < P.dodge) { B.hold = dir > 0 ? 'left' : 'right'; B.mode = 'dodge'; return; }
      if (st === 'roar' && R() < P.respect) { B.hold = dir > 0 ? 'left' : 'right'; return; }
      if (P.backoffLow && h.hp <= 2 && st === 'prowl' && ad < 90) { B.hold = dir > 0 ? 'left' : 'right'; return; }
      if (P.reads && (st === 'prowl' || st === 'crouch' || !st) && R() < P.reads) { if (ad < 60) B.hold = dir > 0 ? 'left' : 'right'; else if (ad > 95) B.hold = dir > 0 ? 'right' : 'left'; return; } }
    if (t.heads && P.reads) { // a reader steps out of a bite's line, then punishes the planted head or burns a stump
      const rear = t.heads.find((hd) => hd.st === 'rear' && Math.abs(hd.hx - h.x) < 90); if (rear && R() < P.reads) { B.hold = h.x > t.x - 60 ? 'left' : (R() < 0.5 ? 'left' : 'right'); B.mode = 'dodge'; return; }
      const goal = t.heads.find((hd) => hd.st === 'stump' && h.torch) || t.heads.find((hd) => hd.st === 'hold' || hd.st === 'recover') || t.heads.find((hd) => hd.st === 'idle' && !hd.imm) || t.heads.find((hd) => hd.st === 'idle');
      if (goal) { const gd = goal.hx - h.x; if (Math.abs(gd) > 24) { B.hold = gd > 0 ? 'right' : 'left'; return; } B.mode = 'fight'; B.face = Math.sign(gd) || 1; return; } }
    if (m.swing && NOW.t - m.swing < 0.55 && ad < 50 && R() < P.respect) { B.hold = dir > 0 ? 'left' : 'right'; B.mode = 'dodge'; return; }
    if (t.brain === 'wolf' && m.lunge && ad < 60 && R() < P.respect * 0.6) { B.hold = dir > 0 ? 'left' : 'right'; B.mode = 'dodge'; return; }
    const reach = t.boss ? P.reach + 10 : P.reach;
    if (ad > reach) { B.hold = dir > 0 ? 'right' : 'left'; return; }
    B.mode = 'fight'; B.face = R() < P.wrongFace ? -dir : dir; }


  // invariants: things that must never happen, whatever the player does
  M.inv = []; const IV = { sc: null, scT: 0, dlT: 0, deadT: 0, lbT: 0 };
  function bad(kind, extra) { if (M.inv.length < 30) M.inv.push([kind, G.land, Math.round(NOW.t - M.t0), extra || '']); if (ARGS.stopOn && ARGS.stopOn.includes(kind)) finish(kind); }
  function INV() { const h = G.hero;
    const sn = G.script ? (G.script.name || '?') : null; if (sn !== IV.sc) { IV.sc = sn; IV.scA = 0; } else if (sn && !G.paused && G.scene === 'play') IV.scA = (IV.scA || 0) + DT; if (sn && IV.scA > 150) { bad('scriptHang', sn); finish('scriptHang'); return; }
    if (G.dialog) { IV.dlT += DT; if (IV.dlT > 60) { bad('dialogHang', G.dialog.who || ''); finish('dialogHang'); return; } } else IV.dlT = 0;
    if (h.state === 'dead') { IV.deadT += DT; if (IV.deadT > 25) { bad('deadHang', ''); finish('deadHang'); return; } } else IV.deadT = 0;
    if (G.letterbox && !G.script && !G.dialog) { IV.lbT += DT; if (IV.lbT > 8) { bad('letterboxStuck', ''); G.letterbox = 0; IV.lbT = 0; } } else IV.lbT = 0;
    if (!isFinite(h.x) || !isFinite(h.y) || !isFinite(G.cam.x)) { bad('nan', 'hero/cam'); finish('nan'); return; }
    for (const a of G.actors) if (!isFinite(a.x) || !isFinite(a.y)) { bad('nanActor', a.id); a.x = h.x; a.y = h.y; }
    if (G.L && G.L.ground && h.state !== 'dead' && !G.script) { const gy = groundY(G.L, h.x); if (h.y > gy + 40 && !G.L.gap) { bad('belowFloor', Math.round(h.x) + ',' + Math.round(h.y - gy)); } if (h.x < -40 || h.x > G.L.w + 40) bad('outOfLand', Math.round(h.x)); }
    if (h.hp > HEROS.maxHp + 0.01) bad('hpOverMax', h.hp + '/' + HEROS.maxHp);
    if (M.callN && !IV.cn && Object.values(M.callN).some((v) => v > 2000)) { IV.cn = 1; bad('sceneSpam', Object.entries(M.callN).filter((e) => e[1] > 2000).map((e) => e[0]).join(',')); }
    if ((G.black || (G.fade && G.fade.dir === 'out' && G.fade.t > G.fade.dur + 1)) && !G.script && !G.endCard && !G.paused && G.scene === 'play') { IV.bk = (IV.bk || 0) + DT; if (IV.bk > 3) { bad('blackScreen', (G.script && G.script.name) || ''); IV.bk = -60; } } else if (IV.bk > 0) IV.bk = 0;
    { const sx = h.x - G.cam.x; if ((sx < -8 || sx > LW + 8) && !G.black && !G.fade && !G.script) { IV.off = (IV.off || 0) + DT; if (IV.off > 2) { bad('heroOffscreen', Math.round(sx)); IV.off = -30; } } else if (IV.off > 0) IV.off = 0; }
    if (!G.script && !G.dialog) { const fol = G.actors.filter((a) => a !== h && !a.foe && !a.hidden && (a.brain === 'follow' || a.brain === 'companion') && Math.abs(a.x - h.x) < 3 && Math.abs(a.vx || 0) < 1 && Math.abs(h.vx) < 1); if (fol.length) { IV.ov = (IV.ov || 0) + DT; if (IV.ov > 4) { bad('companionInHero', fol[0].id); IV.ov = -60; } } else if (IV.ov > 0) IV.ov = 0; }
    if (G.actors.length > 400) { bad('actorFlood', G.actors.length); finish('actorFlood'); }
    if (G.objs && G.objs.length > 600) { bad('objFlood', G.objs.length); finish('objFlood'); } }

  // the monkey: a child (or a cat) on the keyboard. ARGS.chaos: 0 off, 1 light, 2 heavy
  const MK = { mode: null, until: 0, hold: null, holdT: 0, n: {} }; M.mk = MK.n;
  const mkCount = (k) => { MK.n[k] = (MK.n[k] || 0) + 1; };
  function esc(on) { if (on) { Input.press('pause'); Input.press('back'); } Input.setBot('back', !!on); }
  function MONKEY() { const c = ARGS.chaos || 0; if (!c || M.done) return false; const h = G.hero;
    // finish whatever the monkey started
    if (MK.mode) { if (NOW.t < MK.until) { if (MK.mode === 'skip') Input.setBot('back', true); return MK.mode !== 'hold'; }
      const md = MK.mode; MK.mode = null;
      if (md === 'skip') Input.setBot('back', false);
      else if (md === 'pause') { if (G.paused) { const items = menuItems(); const pick = R(); // poke a random harmless item, then resume
          const id = pick < 0.25 ? 'heroic' : pick < 0.45 ? 'lang' : pick < 0.6 ? 'library' : pick < 0.7 ? 'music' : 'resume'; const i = items.findIndex((q) => q[0] === id); if (i >= 0) { UI.sel = i; Input.press('ok'); mkCount('menu:' + id); if (id === 'heroic' && !ARGS.keepHeroic) { if (MK.heroOrig == null) MK.heroOrig = !!Save.d.heroic; laterQ.push([NOW.t + rr(3, 15), () => { Save.d.heroic = MK.heroOrig; }]); } }
          if (id === 'library') { MK.mode = 'lib'; MK.until = NOW.t + rr(1, 4); } else if (id !== 'resume') { MK.mode = 'pause2'; MK.until = NOW.t + rr(0.3, 1.5); } } return true; }
      else if (md === 'pause2') { if (G.paused) { esc(true); later0(() => esc(false)); } return true; }
      else if (md === 'lib' || md === 'book') { if (G.scene === 'library') { Input.press('back'); Input.press('pause'); mkCount('libClose'); MK.mode = 'libWait'; MK.until = NOW.t + 0.5; } return true; }
      else if (md === 'libWait') { if (G.scene === 'library') { MK.mode = 'lib'; MK.until = NOW.t + 0.3; mkCount('libStuck'); if ((MK.n.libStuck || 0) > 20) { bad('libraryStuck', ''); finish('libraryStuck'); } } else if (G.paused) { esc(true); later0(() => esc(false)); } return true; }
      else if (md === 'hold') { MK.hold = null; } return false; }
    if (G.scene === 'library' && R() < 0.05) { Input.press('back'); mkCount('libRescue'); return true; } if (G.paused && G.scene === 'play' && R() < 0.05) { esc(true); later0(() => esc(false)); mkCount('pauseRescue'); return true; } if (G.scene !== 'play' || G.paused) return true;
    const rate = c >= 2 ? 2.2 : 0.6; if (R() > rate * DT) return false;
    const roll = R();
    if (roll < 0.28) { const k = ['left', 'right', 'jump', 'atk', 'shoot', 'use', 'up', 'down', 'eye'][Math.floor(R() * 9)]; Input.press(k); mkCount('tap'); return false; }
    if (roll < 0.46) { MK.hold = R() < 0.5 ? 'left' : 'right'; MK.mode = 'hold'; MK.until = NOW.t + rr(0.2, c >= 2 ? 2.5 : 1.2); mkCount('hold'); return false; }
    if (roll < 0.56) { Input.press('eye'); mkCount('eye'); return false; }
    if (roll < 0.66) { if (!G.paused && G.scene === 'play') { if (G.script && G.script.skippable) { Input.press('pause'); } else esc(true); later0(() => esc(false)); MK.mode = 'pause'; MK.until = NOW.t + rr(0.4, 3); mkCount('pause'); } return true; }
    if (roll < 0.70) { Input.press('lang'); mkCount('lang'); return false; }
    if (roll < 0.82) { if (G.script && G.script.skippable && !G.script.skip) { MK.mode = 'skip'; MK.until = NOW.t + 0.75; Input.setBot('back', true); mkCount('skip'); return true; } return false; }
    if (roll < 0.88) { if (!G.dialog && !G.script && !G.paused) { Input.press('book'); MK.mode = 'book'; MK.until = NOW.t + rr(0.5, 3); mkCount('book'); return true; } return false; }
    if (roll < 0.95) { Input.press('use'); Input.press('down'); mkCount('talk'); return false; }
    if (h && h.ground) { for (let i = 0; i < 6; i++) Input.press(['jump', 'atk'][i % 2]); mkCount('mash'); } return false; }
  const laterQ = []; function later0(fn) { laterQ.push([NOW.t + 0.05, fn]); }
  function laterRun() { for (let i = laterQ.length - 1; i >= 0; i--) if (NOW.t >= laterQ[i][0]) { const f = laterQ[i][1]; laterQ.splice(i, 1); f(); } }
  // the director: where the main path goes when "walk right" is not it. Returns a target x (and maybe a jump), or null.
  function NAV() { const h = G.hero, L = G.land, f = flag;
    if (L === 'oloosson') {
      if (G.serpentWatch && !h.hasClub) return { x: 345 };
      if (f('quest') && !f('oar')) return { x: 1600 };
      if (f('oar') && !f('goat')) { const rel = groundY(G.L, h.x) - h.y; if (!h.ground || NOW.t - (B.jumpT || -9) < 0.2) return { x: B.navX || 1900, tol: 2 };
        let o; if (rel < 10) o = h.x < 1794 || h.x > 1806 ? { x: 1800 } : { x: 1800, jump: true, after: 1820 }; else if (rel < 26) o = Math.abs(h.x - 1833) > 3 ? { x: 1833 } : { x: 1833, jump: true, after: 1846 }; else o = Math.abs(h.x - 1846) > 3 ? { x: 1846 } : { x: 1846, jump: true, after: 1850 };
        B.navX = o.x; return o; }
      if (f('goat') && !f('dusk')) return { x: 200 };
      return null; }
    if (L === 'arcadia' && !f('hind')) { const hd = G.actors.find((a) => a.brain === 'hind' && !a.caught); if (hd && Math.abs(hd.x - h.x) > 250) return { x: hd.x }; }
    if (L === 'delphi') { const sh = byName('shepherd'), m = byName('mentor');
      if (f('eyeGiven') && !f('pan') && sh) return { x: sh.x - 40, world: 'g', wd: 100 };
      if (f('pan') && !f('athena') && m) return { x: m.x - 40, world: 'g', wd: 110 };
      if (f('athena') && G.world === 'g') return { x: h.x + 200, world: 'm', wd: 1e9 }; }
    return null; }
  // the labour chores every player has to do: creep up on the hind, break the dams, sling the birds, jump the boar
  function special() { const h = G.hero, near = G.actors.some((a) => a.foe && a.alive && !a.hidden && !a.ghostNow && Math.abs(a.x - h.x) < 110 && a.brain !== 'sbird');
    const hind = G.actors.find((a) => a.brain === 'hind' && !a.caught); GAME.hold('down', false);
    if (hind && !near && Math.abs(hind.x - h.x) < 280) { release(); const d = hind.x - h.x; B.mode = 'walk'; B.hold = null; if (Math.abs(d) < 30) { if (R() < 0.6) Input.press('use'); } else if (hind.mem.st !== 'alert' && hind.mem.st !== 'flee') { B.hold = d > 0 ? 'right' : 'left'; GAME.hold('down', R() < (P.reads ? 0.98 : 0.8)); } return; }
    if (G.land === 'elis' && flag('augeas') && !near) { const dm = G.objs.filter((o) => o.kind === 'dam' && !o.broken).sort((p, q) => Math.abs(p.x - h.x) - Math.abs(q.x - h.x))[0]; if (dm) { release(); const d = dm.x - h.x; if (Math.abs(d) > 26) { B.hold = d > 0 ? 'right' : 'left'; B.mode = 'walk'; } else { B.hold = null; B.mode = 'fight'; B.face = Math.sign(d) || 1; B.t = null; } return; } }
    if (G.birdsUp) { const birds = G.actors.filter((a) => a.brain === 'sbird' && a.alive); const diver = birds.find((a) => a.mem.dive && Math.abs(a.x - h.x) < 70); if (diver) { if (R() < P.dodge + 0.2) { release(); B.hold = diver.x > h.x ? 'left' : 'right'; } else { B.mode = 'fight'; B.face = Math.sign(diver.x - h.x) || 1; } return; }
      const b = birds.sort((p, q) => Math.abs(p.x - h.x) - Math.abs(q.x - h.x))[0]; if (b) { release(); const d = b.x - h.x; B.mode = 'walk'; if (Math.abs(d) > 200) B.hold = d > 0 ? 'right' : 'left'; else { B.hold = null; if (h.state === 'free' && !(h.cool > 0) && R() < 0.7) { h.face = Math.sign(d) || 1; Input.press('shoot'); } } return; } }
    const boar = G.actors.find((a) => a.brain === 'boar' && a.alive && !a.hidden); if (boar && boar.mem.st === 'charge' && Math.abs(boar.x - h.x) < 50 && Math.sign(h.x - boar.x) === boar.mem.dir && R() < P.dodge + (P.reads ? 0 : 0.35)) Input.press('jump'); }
  function tick() { const h = G.hero; laterRun(); if (!h || M.done) return;
    if (ARGS.forceG && G.world === 'm' && G.ichor > 2 && !G.script && !G.dialog && R() < 0.05) toggleWorld();
    if (MONKEY()) { release(); INV(); return; }
    if (G.scene !== 'play' || G.paused) { release(); return; }
    if (G.land !== B.lastLand) { B.lastLand = G.land; M.scenes = (M.scenes || 0) + 1; B.best = h.x; B.bestT = NOW.t; M.landT[G.land] = NOW.t; }
    if (G.wrestle) { if (NOW.t >= B.nextW) { Input.press('atk'); B.nextW = NOW.t + 1 / rr(P.wrestle[0], P.wrestle[1]); } return; }
    INV(); { const d = G.dialog; if (d && !d.done && d.t > (ARGS.read || 0.04)) { if (d.choices) d.sel = B.pickFor ? B.pickFor(d) : (GAME.pick || 0); GAME.skipDialog(); } }
    if (G.script || G.dialog || h.state === 'dead') { release(); B.next = NOW.t + rr(P.react[0], P.react[1]); B.bestT = NOW.t; return; }
    if (NOW.t >= B.next) { B.dt = rr(P.react[0], P.react[1]); B.next = NOW.t + B.dt; decide(); special(); }
    if (B.navOn && B.mode !== 'fight') { const nv = NAV(); if (nv) { const gd = nv.x - h.x; release(); B.hold = Math.abs(gd) > (nv.tol || 4) ? (gd > 0 ? 'right' : 'left') : null; } else B.navOn = false; }
    if (MK.hold) { release(); GAME.hold(MK.hold, true); } else if (B.hold) GAME.hold(B.hold, true);
    if (B.mode === 'fight' && NOW.t >= B.nextAtk && h.state === 'free' && !(h.cool > 0)) { h.face = B.face; Input.press('atk'); B.nextAtk = NOW.t + 1 / rr(P.rate * 0.7, P.rate * 1.3); }
    if (P.jumpy && R() < P.jumpy * DT) Input.press('jump');
    if (h.hp < M.hpLow) M.hpLow = h.hp; { const id = G.boss && G.boss.a && G.boss.a.id; if (id && id !== curB && !M.bt[id]) M.bt[id] = { s: NOW.t }; curB = id || null; } if (G.heraFight && G.heraFight.phase !== B4.ph) { B4.ph = G.heraFight.phase; (M.ph = M.ph || []).push([B4.ph, Math.round(NOW.t)]); }
    // stuck: no forward progress for a minute of play outside scenes
    { const fc = Object.keys(Save.d.flags || {}).length + (M.scenes || 0); if (fc !== B.fc) { B.fc = fc; B.progT = NOW.t; B.act = 0; B.bact = 0; } if (B.progT == null) B.progT = NOW.t; if (h.hp !== B.lastHp) { B.lastHp = h.hp; B.act = (B.act || 0) + 1; } { const nf = G.actors.find((a) => a.foe && a.alive && !a.hidden && Math.abs(a.x - h.x) < 260 && a.mem && a.mem.st); const sig = nf ? nf.id + nf.mem.st : ''; if (sig && sig !== B.lastFs) { B.lastFs = sig; B.fs = (B.fs || 0) + 1; if (B.fs % 8 === 0) B.act = (B.act || 0) + 1; } } const bb = G.boss && G.boss.a; if (bb && bb.hp !== B.lastBhp) { B.lastBhp = bb.hp; B.bact = (B.bact || 0) + 1; }
      if (NOW.t - B.progT > (ARGS.stuckT || 240)) { M.stuck.push([G.land, Math.round(h.x), B.act || 0, B.bact || 0]); finish((B.act || 0) > 6 ? 'grind' : 'stuck'); } } }
  function finish(why) { if (M.done) return; const L = G.actors.find((a) => a.id === 'lion'); if (L) { M.lion.parried = L.mem.parried || 0; } M.lion.hitLog = (window.LHL || []).slice(0, 40); M.done = true; M.why = why; M.t = NOW.t - M.t0; M.end = { land: G.land, x: Math.round(G.hero.x), hp: G.hero.hp, maxHp: HEROS.maxHp }; release(); }
  window.LHL = []; const _lh = lionHit; lionHit = function (a, w, d) { LHL.push([(a.mem.state || 'prowl')[0] + (Math.sign(G.hero.x - a.x) === a.face ? 'F' : 'B'), Math.round(NOW.t - (M.lion.in || 0))]); return _lh(a, w, d); };
  M.t0 = NOW.t; GAME.auto = true; GAME.pick = ARGS.seed % 3;
  frame = function (now) { if (M.done) { requestAnimationFrame(frame); return; }
    for (let i = 0; i < K; i++) { try { tick(); update(DT); } catch (e) { if (M.err.length < 5) M.err.push(String(e && e.stack || e).slice(0, 300)); Input.end(); if (G.script) { G.script = null; G.dialog = null; G.letterbox = 0; } }
      if (G.endCard || (ARGS.until && flag(ARGS.until))) { finish('end'); break; } if (NOW.t - M.t0 > 1200) { finish('timeout'); break; } }
    NOW.dt = DT * K; try { render(); } catch (e) { } NOW.dt = DT; requestAnimationFrame(frame); };
  if (ARGS.budget) { // fast mode: updates for ~30 ms per slice, a render every ~150 ms, scheduled with MessageChannel (not throttled like rAF)
    frame = function () {}; const ch = new MessageChannel(); let lastR = 0;
    ch.port1.onmessage = () => { if (M.done) return; const t0 = performance.now();
      while (performance.now() - t0 < 30) { try { tick(); update(DT); } catch (e) { if (M.err.length < 5) M.err.push(String(e && e.stack || e).slice(0, 300)); Input.end(); if (G.script) { G.script = null; G.dialog = null; G.letterbox = 0; } }
        if (G.endCard || (ARGS.until && flag(ARGS.until))) { finish('end'); return; } if (NOW.t - M.t0 > (ARGS.tmax || 1200)) { finish('timeout'); return; } }
      if (t0 - lastR > (ARGS.renderMs || 400)) { lastR = t0; NOW.dt = Math.min(NOW.t - (M.lastRT || 0), 3); M.lastRT = NOW.t; try { render(); } catch (e) { if (M.err.length < 5) M.err.push('render: ' + String(e && e.stack || e).slice(0, 280)); } NOW.dt = DT; }
      setTimeout(() => ch.port2.postMessage(0), 0); };
    ch.port2.postMessage(0); }
})();
