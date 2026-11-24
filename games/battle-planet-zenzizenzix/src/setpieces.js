// =====================================================================
// SET PIECES — one or two huge scenic moments per level, drawn sharp on the actors' layer:
//   Havre, screen 1: LA GOURMANDE, a runaway freighter, rams the quay; containers rain down; goons jump off her deck.
//   Havre, the square: the flagship's barrage, searchlights, and a shell that brings the lighthouse down.
//   De Soif, the port: the gantry crane's cable snaps, the container bursts open with goons, then the crane itself falls.
//   De Soif, the bar: a beer tanker smashes through the back wall; foam everywhere; Oscar climbs out of the cab.
// A wave in a level can carry `set: 'name'`: the set piece runs instead of the plain spawn, holds the wave until
// its goons are on the floor, then the fight goes on. Wrecks stay on screen.
// =====================================================================
const SETP = { cur: null, hold: false, props: {}, scr: null };
const lerpP = (a, b, t) => a + (b - a) * t, sxW = wx => wx - camX, clamp1 = v => Math.max(0, Math.min(1, v));
function setScreen(id) { SETP.cur = null; SETP.hold = false; SETP.scr = id; SETP.props = {};
  if (id === 'phare') SETP.props.lighthouse = { wx: 1700, fall: -1, rubble: false };
  if (id === 'port') SETP.props.crane = { wx: 440, snap: -1, fall: -1, swing: 0 }; }
function startSet(kind, wave) { const D = SETDEF[kind]; if (D) { musicDuck(.35); setTimeout(() => musicDuck(1), (D.dur + .5) * 1000); } if (!D) { wave.forEach(([type, from], k) => spawn(type, from, k)); return; } SETP.cur = { k: kind, t: 0, wave, d: {}, fired: {}, D }; SETP.hold = true; D.start && D.start(SETP.cur); }
function setTick(dt) { const C = SETP.cur; for (const k in SETP.props) { const P = SETP.props[k]; P.tick && P.tick(dt); }
  if (!C) return; C.t += dt; (C.D.ev || []).forEach(([at, fn], i) => { if (C.t >= at && !C.fired[i]) { C.fired[i] = true; fn(C); } }); C.D.tick && C.D.tick(C, dt);
  if (C.t >= C.D.dur) { setKeep(C); SETP.cur = null; SETP.hold = false; } }
// the wave's goons, dropped from a point in the scene
function setDrop(C, pts) { C.wave.forEach(([type, from], k) => { if (type === 'boss' || type === 'oscar') { spawn(type, from, k); return; } spawn(type, 'drop', k); const e = enemies[enemies.length - 1]; const [x, z, y] = pts[k % pts.length]; e.x = x + (k >= pts.length ? (k - pts.length + 1) * 14 : 0); e.z = z; e.y = y; e.vy = 60; e.onScr = true; e.face = -1; }); }
function bigRumble(steps) { for (let i = 0; i < 2; i++) if (players[i] && players[i].ko <= 0) rum(i, steps, 8); }
function quake(s) { WORLD.shake = Math.max(WORLD.shake, s); }
function splinters(x, z, n, col, spd = 1) { for (let k = 0; k < n; k++) fx.push({ k: 'debris', x: x + (Math.random() - .5) * 30, z: z + (Math.random() - .5) * 10, y: 2 + Math.random() * 10, vx: (Math.random() - .5) * 420 * spd, vy: 120 + Math.random() * 260 * spd, rot: Math.random() * 6, vr: (Math.random() - .5) * 24, t: 1.6, col: k % 3 ? col : shadeC(col, -.35), w: 3 + Math.random() * 7 }); }
function spray(x, y, n, col, up = 1, spread = 1) { for (let k = 0; k < n; k++) fx.push({ k: 'drop2', x, z: -6, y, vx: (Math.random() - .5) * 260 * spread, vy: (160 + Math.random() * 260) * up, t: 1.1 + Math.random() * .5, col, r: 1.5 + Math.random() * 2.5 }); }
function areaHit(x, z, r, dz, dmg) { for (const q of players) if (q.ko <= 0 && Math.abs(q.x - x) < r && Math.abs(q.z - z) < dz) { hitPlayer(q, dmg, Math.sign(q.x - x) || 1, null); q.vx = (Math.sign(q.x - x) || 1) * 220; }
  for (const e of enemies) if (!e.dead && e.type !== 'boss' && e.type !== 'oscar' && Math.abs(e.x - x) < r && Math.abs(e.z - z) < dz) { hitEnemy(e, 2, Math.sign(e.x - x) || 1, null, 1.8); e.vy = 220; e.y = Math.max(1, e.y); } }
function crushAt(x, z, w, d, dmg, src) { for (const q of players) if (q.ko <= 0 && Math.abs(q.x - x) < w / 2 + 6 && Math.abs(q.z - z) < d / 2 + 6) { q.inv = 0; hitPlayer(q, dmg, Math.sign(q.x - x) || 1, null); q.vx = (Math.sign(q.x - x) || 1) * 260; }
  for (const e of enemies) if (!e.dead && e.type !== 'boss' && e.type !== 'oscar' && Math.abs(e.x - x) < w / 2 + 6 && Math.abs(e.z - z) < d / 2 + 6) { hitEnemy(e, 4, Math.sign(e.x - x) || 1, null, 2); e.vy = 200; e.y = Math.max(1, e.y); } }
// a big block that lands as a breakable (containers, rubble), with a shadow to warn you first
function dropBlock(kind, x0, y0, z0, x1, z1, T, col) { fx.push({ k: 'block', kind, x: x0, y: y0, z: z0, vx: (x1 - x0) / T, vz: (z1 - z0) / T, vy: (SPG * T * T / 2 - y0) / T, tx: x1, tz: z1, t: T + .1, T, rot: 0, vr: (Math.random() - .5) * 1.5, col }); }
function placeBlock(f) { const K = BK[f.kind], b = { k: f.kind, x: f.x, z: f.z, ...K, hp: K.hp, max: K.hp, y: 0, vx: 0, vy: 0, held: null, thrown: false, rot: 0, flash: 0, id: Math.random(), col: f.col || K.col };
  if (K.solid) { b.box = { x: b.x - b.w / 2, z: b.z - b.d / 2, w: b.w, d: b.d, h: b.h, bk: b }; scr.boxes.push(b.box); } BREAK.push(b);
  crushAt(f.x, f.z, K.w, K.d, 2); quake(9); camPunch(f.x, f.z, 10, .06); puff(f.x, f.z, 10, 0, 2); splinters(f.x, f.z, 10, '#5a4a3a', .6); fx.push({ k: 'ring', x: f.x, z: f.z, max: 70, t: .4, col: '#e8d8b8' }); SND.crash(1.6); SND.metal(.5); bigRumble([[0, .9, .7, 220], [260, .4, .3, 160]]); }
BK.container = { size: 'l', hp: 10, w: 58, d: 26, h: 30, col: '#c84a2a', solid: 1 };
BK.rubble = { size: 'l', hp: 6, w: 34, d: 22, h: 16, col: '#b8b0a0', solid: 1 };

const SETDEF = {
  // =================== HAVRE 1 — LA GOURMANDE ===================
  freighter: { dur: 6.2,
    start: C => { C.d.x = camX + 760; C.d.crashX = camX + 250; SND.horn(3.2, 52); SND.alarm(5); bigRumble([[0, .15, .3, 900], [900, .3, .45, 900], [1800, .5, .6, 800]]); const g0 = enemies.find(e => !e.dead); },
    tick: (C, dt) => { const d = C.d; if (C.t < 2.3) { d.x = lerpP(camX + 760, d.crashX, Math.pow(clamp1(C.t / 2.3), 1.6)); d.s = lerpP(.78, 1, clamp1(C.t / 2.3)); if (Math.random() < dt * 30) spray(sxW(d.x) - 4 + camX, 6, 1, '#e8f4ff', .5, .6); quake(1 + C.t * 1.2); }
      if (C.t > 2.3) { d.tilt = Math.min(.05, (C.t - 2.3) * .2); if (Math.random() < dt * 8) fx.push({ k: 'smoke2', x: d.crashX + 40 + Math.random() * 40, z: -8, y: 30 + Math.random() * 20, vx: -10, vy: 20, t: 2.5, T: 2.5, r: 6 }); }
      if (Math.random() < dt * 5) fx.push({ k: 'smoke2', x: d.x + 330 * (d.s || 1), z: -10, y: 150 * (d.s || 1), vx: 30, vy: 30, t: 3, T: 3, r: 7, dark: 1 }); },
    ev: [[.4, C => { const e = enemies.find(o => !o.dead); quip(players[0], LANG === 'fr' ? 'C’est quoi, ce bateau ?!' : 'What is that ship doing?!', 2); }],
      [2.3, C => { const x = C.d.crashX; quake(16); camPunch(x, 2, 30, .14); slowMo(.5); WORLD.flash = .25; WORLD.noir = .6; C.d.crumple = 1; for (let k = 0; k < 5; k++) fx.push({ k: 'geyser', x: x + k * 90 - 30, t: 1.4 + k * .15, T: 1.4 + k * .15, h: 190 - k * 25, w: 40 - k * 4 }); WORLD.noir = .9; SND.boom(1.6); SND.crash(2.2); SND.metal(1.6); SND.wood(1); SND.splash(2);
        bigRumble([[0, 1, 1, 650], [700, .8, .7, 450], [1200, .55, .45, 350], [1650, .3, .25, 400]]); INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'KRRRAAACCK !!' : 'KRRRAAACCK!!', x: sxW(x) * 1.5, y: 220, size: 54, t: 0, strong: true, rot: -.08 });
        splinters(x, 6, 46, '#8a6a42', 1.2); for (let k = 0; k < 3; k++) spray(x - 30 + k * 40, 10, 26, k % 2 ? '#cfe8f8' : '#ffffff', 1.3, 1.4); for (const p of players) if (p.ko <= 0) { p.vx -= 160; jolt(p, -2, 2); } for (const e of enemies) if (!e.dead) react(e, 'cower', 1.2); }],
      [2.6, C => { const x = C.d.crashX; C.d.lost = 1; dropBlock('container', x + 160, 240, -4, x - 60, 30, 1.05, '#c84a2a'); dropBlock('container', x + 300, 250, -4, x + 150, 84, 1.15, '#2a6aa8'); fx.push({ k: 'cfall', x: x + 420, y: 250, vx: 60, vy: 40, rot: 0, t: 1.4, col: '#3a8a4a' }); SND.metal(1.2); }],
      [3.6, C => { const x = C.d.crashX; quip(players[1] && players[1].ko <= 0 ? players[1] : players[0], LANG === 'fr' ? 'Ils sautent du pont !' : 'They’re jumping off the deck!', 1.8); setDrop(C, [[x + 60, 8, 200], [x + 110, 14, 206], [x + 160, 6, 210], [x + 90, 20, 204]]); }],
      [4.6, C => { SETP.hold = false; }]],
    drawBack: C => drawFreighter(C.d) },

  // =================== HAVRE 4 — THE FLAGSHIP'S BARRAGE ===================
  assault: { dur: 7.6,
    start: C => { SND.alarm(8); bigRumble([[0, .2, .3, 2000]]); C.d.shells = []; for (let k = 0; k < 7; k++) { const p = players[k % 2].ko <= 0 ? players[k % 2] : players[0]; C.d.shells.push({ at: 1 + k * .38, x: (k % 3 === 2 ? camX + 120 + Math.random() * 400 : p.x + (Math.random() - .5) * 70), z: Math.max(8, Math.min(DEPTH - 8, p.z + (Math.random() - .5) * 40)), done: false }); } },
    tick: (C, dt) => { for (const s of C.d.shells) { if (!s.mark && C.t > s.at - .8) { s.mark = 1; fx.push({ k: 'target', x: s.x, z: s.z, t: .8, T: .8 }); }
        if (!s.done && C.t > s.at) { s.done = 1; fx.push({ k: 'muzzle', x: camX + 80 + Math.random() * 480, t: .15, T: .15 }); SND.boom(.4); fx.push({ k: 'mshell', x: s.x - 60, z: s.z, y: 300, tx: s.x, t: .18, T: .18 }); } }
      if (C.t > 1 && C.t < 4.5) quake(1.5); },
    ev: [[.3, C => quip(players[0], LANG === 'fr' ? 'Le vaisseau amiral ! À COUVERT !' : 'The flagship! TAKE COVER!', 2)],
      [4.6, C => { const L = SETP.props.lighthouse; fx.push({ k: 'mshell', x: L.wx - 40, z: -30, y: 300, tx: L.wx, t: .2, T: .2, hl: 1 }); }],
      [4.8, C => { const L = SETP.props.lighthouse; L.fall = 0; SND.boom(1.8); SND.glass(); quake(12); WORLD.flash = .15; bigRumble([[0, 1, .9, 400], [500, .5, .4, 300]]); for (let k = 0; k < 30; k++) fx.push({ k: 'debris', x: L.wx, z: -10, y: 150 + Math.random() * 20, vx: (Math.random() - .5) * 300, vy: 50 + Math.random() * 200, rot: 0, vr: 15, t: 2, col: k % 2 ? '#e8e0d0' : '#b83a2a', w: 3 + Math.random() * 5 }); }],
      [5.75, C => { const L = SETP.props.lighthouse; quake(18); camPunch(L.wx - 90, 6, 20, .13); slowMo(.5); WORLD.noir = .6; SND.crash(2.2); SND.boom(1.4); SND.glass(); bigRumble([[0, 1, 1, 700], [750, .7, .6, 400], [1200, .4, .3, 400]]);
        INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'BRRROUMMM !!' : 'KA-BOOOM!!', x: sxW(L.wx - 90) * 1.5, y: 230, size: 54, t: 0, strong: true, rot: .06 }); splinters(L.wx - 90, 8, 40, '#d8d0c0', 1.1); puff(L.wx - 120, 10, 24, 0, 3); crushAt(L.wx - 110, 14, 120, 24, 2); L.rubble = true;
        placeBlock({ kind: 'rubble', x: L.wx - 150, z: 18 }); placeBlock({ kind: 'rubble', x: L.wx - 60, z: 30 }); }],
      [6.8, C => { C.wave.forEach(([type, from], k) => spawn(type, from, k)); }]],
    drawBack: C => { if (C.t < 4.6) drawSearchlights(C.t); } },

  // =================== DE SOIF 1 — THE GANTRY CRANE ===================
  crane: { dur: 6,
    start: C => { const K = SETP.props.crane; K.swingAmp = 1; SND.alarm(4); SND.metal(1.6); bigRumble([[0, .1, .35, 1200]]); },
    tick: (C, dt) => { const K = SETP.props.crane; if (C.t < 1.6) K.swingAmp = 1 + C.t * 2; if (C.t > 1 && C.t < 1.6 && Math.random() < dt * 20) fx.push({ k: 'spark2', x: K.wx + 10, y: 150, z: -2, vx: (Math.random() - .5) * 200, vy: -Math.random() * 100, t: .5 }); },
    ev: [[.2, C => quip(players[0], LANG === 'fr' ? 'La grue… elle penche, non ?' : 'That crane… is it leaning?', 2)],
      [.9, C => { const K = SETP.props.crane; fx.push({ k: 'target', x: K.wx + 6, z: 58, t: .9, T: .9, big: 1 }); }],
      [1.6, C => { const K = SETP.props.crane; K.snap = 0; SND.metal(.4); beep(1900, .15, 'square', .06, -1500); fx.push({ k: 'cfallv', x: K.wx + 6, y: 120, z: 58, vy: 0, t: 1, col: '#e8b02a', open: 0 }); }],
      [2.3, C => { const K = SETP.props.crane; setDrop(C, [[K.wx - 10, 52, 30], [K.wx + 20, 64, 30], [K.wx + 4, 58, 40]]); }],
      [2.9, C => { const K = SETP.props.crane; K.fall = 0; SND.metal(1.4); bigRumble([[0, .3, .6, 500]]); }],
      [3.75, C => { const K = SETP.props.crane; quake(17); camPunch(K.wx, 4, 20, .13); slowMo(.45); WORLD.noir = .55; WORLD.flash = .2; SND.crash(2.2); SND.boom(1.3); SND.metal(1.5); bigRumble([[0, 1, 1, 650], [700, .7, .6, 400], [1150, .4, .3, 350]]);
        INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'BADABOUMMM !!' : 'KRA-KA-BOOM!!', x: sxW(K.wx) * 1.5, y: 240, size: 54, t: 0, strong: true, rot: -.05 }); for (let k = 0; k < 40; k++) fx.push({ k: 'spark2', x: K.wx - 150 + Math.random() * 300, y: 10 + Math.random() * 20, z: 4, vx: (Math.random() - .5) * 300, vy: -100 - Math.random() * 200, t: .8 }); puff(K.wx, 6, 26, 0, 3); crushAt(K.wx, 6, 260, 14, 2); }],
      [4.6, C => { SETP.hold = false; }]] },

  // =================== DE SOIF 4 — THE BEER TANKER ===================
  truck: { dur: 6.4,
    start: C => { C.d.wx = camX + 320; C.d.z = 0; C.d.s = 0; bigRumble([[0, .1, .3, 600], [600, .3, .5, 600], [1200, .6, .7, 300]]); try { const a = ac(), t = a.currentTime, o = a.createOscillator(), gn = a.createGain(), lp = a.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(40, t); o.frequency.exponentialRampToValueAtTime(120, t + 1.4); lp.type = 'lowpass'; lp.frequency.value = 500; gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(.25, t + 1.3); gn.gain.exponentialRampToValueAtTime(.0001, t + 1.6); o.connect(lp).connect(gn).connect(buses().sfx); o.start(t); o.stop(t + 1.7); } catch (e) {}
      for (const b of BREAK) b.wob = .12; },
    tick: (C, dt) => { const d = C.d; if (C.t < 1.4) { quake(.5 + C.t * 2); for (const b of BREAK) if (Math.random() < dt * 4) b.wob = .1; } else if (C.t < 1.9) d.s = clamp1((C.t - 1.4) / .25); else d.s = 1;
      if (C.t > 1.4 && C.t < 2.1) d.slide = clamp1((C.t - 1.4) / .7); if (C.t > 2.4 && C.t < 5.5 && Math.random() < dt * 40) spray(d.wx + 30, 70, 1, Math.random() < .6 ? '#fff6dc' : '#f0c040', 1.1, .8); },
    ev: [[.3, C => quip(players[0], LANG === 'fr' ? 'Vous entendez ce moteur ?' : 'Do you hear that engine?', 1.6)],
      [1.4, C => { const d = C.d; quake(18); camPunch(d.wx, 0, 40, .15); slowMo(.5); WORLD.flash = .3; WORLD.noir = .6; for (let k = 0; k < 18; k++) fx.push({ k: 'smoke2', x: d.wx + (Math.random() - .5) * 200, z: 4 + Math.random() * 20, y: 10 + Math.random() * 80, vx: (Math.random() - .5) * 80, vy: 10 + Math.random() * 30, t: 2.2, T: 2.2, r: 10 + Math.random() * 10 }); SND.crash(2.2); SND.boom(1.2); SND.glass(); SND.wood(1); bigRumble([[0, 1, 1, 700], [750, .8, .7, 400], [1200, .5, .4, 400]]);
        INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'VRRRAAAMMM !!' : 'VRRRAAAMMM!!', x: sxW(d.wx) * 1.5, y: 220, size: 56, t: 0, strong: true, rot: .07 });
        for (let k = 0; k < 40; k++) fx.push({ k: 'brick', x: d.wx + (Math.random() - .5) * 120, z: -4, y: 40 + Math.random() * 90, vx: (Math.random() - .5) * 360, vz: 40 + Math.random() * 90, vy: 60 + Math.random() * 220, rot: 0, vr: (Math.random() - .5) * 20, t: 2.2 });
        puff(d.wx, 4, 30, 0, 3); for (const e of enemies) if (!e.dead) react(e, 'cower', 1.4); for (const b of BREAK) if (b.size !== 'l' && Math.abs(b.x - d.wx) < 140) damageBreakable(b, 99, Math.sign(b.x - d.wx) || 1); }],
      [2.1, C => { SND.horn(.8, 110); for (let k = 0; k < 6; k++) fx.push({ k: 'smoke2', x: C.d.wx + (Math.random() - .5) * 60, z: 2, y: 20, vx: (Math.random() - .5) * 30, vy: 30, t: 2, T: 2, r: 8 }); }],
      [2.4, C => { SND.splash(2); try { const t = SND.now(); nz(t, 3, .18, 2400, 900, 'bandpass', .8); } catch (e) {} bigRumble([[0, .4, .6, 600]]); for (let k = 0; k < 8; k++) DECALS.push({ x: C.d.wx + (Math.random() - .5) * 160, z: 6 + Math.random() * 60, col: '#e8b040', t: 14, r: 6 + Math.random() * 8, kind: 'beer' }); }],
      [3.0, C => { const d = C.d; [[-70, 40, -120], [80, 60, 140], [10, 90, 30]].forEach(([dx, z, vx]) => { const b = { k: 'barrel', x: d.wx + dx, z, ...BK.barrel, hp: BK.barrel.hp, max: BK.barrel.hp, y: 0, vx, vy: 0, held: null, thrown: false, rot: 0, flash: 0, id: Math.random(), hitSet: new Set(), from: null }; BREAK.push(b); }); SND.wood(.6); }],
      [3.6, C => { const d = C.d; C.wave.forEach(([type, from], k) => { if (type === 'oscar') { spawn('oscar', 'bar', 0); const e = enemies[enemies.length - 1]; e.x = d.wx - 50; e.z = 14; } else { spawn(type, 'drop', k); const e = enemies[enemies.length - 1]; e.x = d.wx + 40 + k * 20; e.y = 60; e.z = 10 + k * 12; e.onScr = true; } }); }]],
    drawBack: C => drawTruck(C.d, C.t) }
};
// wrecks that stay after the moment: the freighter in the quay, the truck in the bar
function setKeep(C) { if (C.k === 'freighter') SETP.props.ship = { d: C.d, tick: null }; if (C.k === 'truck') SETP.props.truck = { d: C.d, t: 9 }; if (C.k === 'fighter') SETP.props.jet = { d: C.d }; if (C.k === 'train') SETP.props.train = { d: C.d }; }
function setItems(items) { const C = SETP.cur; if (C && C.D.items) items.push(...C.D.items(C)); const J = SETP.props.jet; if (J) items.push({ key: J.d.z + 6, draw: () => drawFighter(J.d, time) }); const T = SETP.props.train; if (T && T.d.landed && !(T.d.wreck && T.d.wreck.broken)) items.push({ key: TRZ + 11, draw: () => drawTramCar(T.d, true) }); }

// ---- drawing ----------------------------------------------------------------------------------------
function drawSetBack() {
  const L = SETP.props.lighthouse; if (L) drawLighthouse(L);
  const K = SETP.props.crane; if (K) drawCrane(K);
  if (SETP.props.ship) drawFreighter(SETP.props.ship.d); if (SETP.props.truck) drawTruck(SETP.props.truck.d, 9);
  if (SETP.scr === 'centre') { const C2 = SETP.cur && SETP.cur.k === 'train' ? SETP.cur : SETP.props.train ? { d: SETP.props.train.d } : null; drawViaduct(C2); }
  const C = SETP.cur; if (C && C.D.drawBack) C.D.drawBack(C);
}
function drawFreighter(d) { if (d.x == null) return; const s = (d.s || 1) * 2.2, x0 = sxW(d.x), yw = FLOOR - 4, L = 380 * s, H = 92 * s; if (x0 > VW + 20) return;
  g.save(); g.translate(x0, yw); g.rotate(-(d.tilt || 0));
  // wake and the bow wave
  g.fillStyle = 'rgba(230,245,255,.75)'; for (let k = 0; k < 7; k++) { const wx = 20 + k * 50 * s + Math.sin(time * 6 + k) * 3; g.beginPath(); g.ellipse(wx, 4, 18 * s, 3, 0, 0, 7); g.fill(); }
  if (!d.tilt) { g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.moveTo(-6, 6); g.quadraticCurveTo(-26, -8 - Math.sin(time * 9) * 3, -4, -22); g.quadraticCurveTo(10, -6, 18, 8); g.fill(); }
  // the hull: shaded steel, plates, rust, portholes
  const hull = [[0, -H * .78], [L * .06, -H], [L, -H * .9], [L * 1.01, 10], [L * .1, 12], [4, -H * .2]];
  poly(g, hull, '#2c2e3a'); g.save(); g.beginPath(); hull.forEach(([a, b], i) => i ? g.lineTo(a, b) : g.moveTo(a, b)); g.closePath(); g.clip();
  const gr = g.createLinearGradient(0, -H, 0, 10); gr.addColorStop(0, '#4a5064'); gr.addColorStop(.5, '#2c2e3a'); gr.addColorStop(1, '#1a1c24'); g.fillStyle = gr; g.fillRect(0, -H - 2, L * 1.02, H + 14);
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1; for (let k = 1; k < 16; k++) { g.beginPath(); g.moveTo(k * L / 16, -H); g.lineTo(k * L / 16, 12); g.stroke(); } g.beginPath(); g.moveTo(0, -H * .62); g.lineTo(L, -H * .55); g.stroke();
  g.fillStyle = 'rgba(150,70,40,.45)'; for (let k = 0; k < 12; k++) g.fillRect(L * .2 + k * L * .055, -H * .52, 2, 10 + (k * 7) % 14);
  g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, -H + 3, L, 3);
  g.restore();
  poly(g, [[3, -H * .26], [L * 1.005, -12], [L * 1.01, 10], [L * .1, 12]], '#a8302a'); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(L * .1, -H * .22, L * .9, 1.5);
  for (let k = 0; k < 9; k++) { disc(g, L * .22 + k * L * .07, -H * .58, 2.4 * s, (k + Math.floor(time * .7)) % 3 ? '#ffd890' : '#e8e4d8'); }
  g.fillStyle = '#efe6d2'; g.font = `bold ${Math.round(10 * s)}px Georgia, serif`; g.textAlign = 'left'; g.fillText('LA GOURMANDE', L * .1, -H * .72); g.font = `${Math.round(6 * s)}px Georgia, serif`; g.fillText('HAVRE', L * .13, -H * .64);
  g.strokeStyle = '#1a1a20'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(L * .05, -H * .5); for (let k = 1; k <= 6; k++) g.lineTo(L * .05 - Math.sin(k) * 2, -H * .5 + k * 5); g.stroke(); poly(g, [[L * .02, -H * .2], [L * .06, -H * .2], [L * .04, -H * .1]], '#5a5a62');
  // the crumpled bow after the impact
  if (d.crumple) { g.strokeStyle = '#0c0a0e'; g.lineWidth = 2; g.beginPath(); g.moveTo(2, -H * .7); g.lineTo(14, -H * .55); g.lineTo(6, -H * .42); g.lineTo(18, -H * .3); g.lineTo(8, -H * .2); g.stroke();
    poly(g, [[0, -H * .75], [10, -H * .62], [-4, -H * .5]], '#5a5e70'); poly(g, [[2, -H * .4], [14, -H * .34], [0, -H * .26]], '#4a4e60');
    if (Math.random() < .4) fx.push({ k: 'spark2', x: d.x + 6, y: H * .5, z: -8, vx: -60 - Math.random() * 120, vy: -Math.random() * 80, t: .4 }); }
  // railing and crew on deck
  g.strokeStyle = '#d8d0c0'; g.lineWidth = .8; g.beginPath(); g.moveTo(L * .06, -H - 6); g.lineTo(L * .78, -H * .99 - 6); g.stroke(); for (let k = 0; k < 24; k++) { g.beginPath(); g.moveTo(L * .07 + k * L * .03, -H - 6); g.lineTo(L * .07 + k * L * .03, -H); g.stroke(); }
  // containers on deck
  const cols = ['#c84a2a', '#2a6aa8', '#3a8a4a', '#e8b02a', '#7a3a8a', '#d8d0c0'];
  for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) { if (r === 2 && (k + r) % 3 === 0) continue; if (d.lost && r === 2 && k < 3) continue; const cx = L * .16 + k * 36 * s, cy = -H - (r + 1) * 15 * s, c = cols[(k * 3 + r * 5) % cols.length]; drawContainer(g, cx, cy, 34 * s, 14 * s, c); }
  // superstructure and the funnel
  const bx = L * .76; poly(g, [[bx, -H], [L * .97, -H], [L * .97, -H - 62 * s], [bx + 6, -H - 62 * s]], '#e8e4d8'); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(L * .9, -H - 62 * s, L * .07, 62 * s);
  poly(g, [[bx - 4, -H - 62 * s], [L * .99, -H - 62 * s], [L * .99, -H - 70 * s], [bx - 4, -H - 70 * s]], '#d0ccc0');
  g.fillStyle = '#1e2a34'; g.fillRect(bx + 4, -H - 58 * s, L * .19 - 8, 8 * s); for (let q = 0; q < 3; q++) for (let k = 0; k < 5; k++) { g.fillStyle = (k + q + Math.floor(time)) % 4 ? '#ffd27a' : '#3a4048'; g.fillRect(bx + 8 + k * 14 * s, -H - 40 * s + q * 12 * s, 6 * s, 5 * s); }
  poly(g, [[L * .84, -H - 70 * s], [L * .92, -H - 70 * s], [L * .91, -H - 100 * s], [L * .85, -H - 100 * s]], '#a8302a'); poly(g, [[L * .85, -H - 100 * s], [L * .91, -H - 100 * s], [L * .91, -H - 106 * s], [L * .85, -H - 106 * s]], '#1a1a1e'); g.fillStyle = '#efe6d2'; g.fillRect(L * .855, -H - 88 * s, L * .05, 4 * s);
  g.strokeStyle = '#2a2a2a'; g.lineWidth = 1; g.beginPath(); g.moveTo(L * .8, -H - 70 * s); g.lineTo(L * .8, -H - 96 * s); g.stroke();
  if (Math.floor(time * 2) % 2) { g.fillStyle = '#ff3a2a'; g.beginPath(); g.arc(L * .8, -H - 97 * s, 2, 0, 7); g.fill(); }
  g.restore();
  // the crushed quay edge after the impact
  if (d.tilt) { const cx = sxW(d.crashX); g.fillStyle = '#1a120c'; g.beginPath(); g.moveTo(cx - 30, FLOOR); for (let k = 0; k <= 8; k++) g.lineTo(cx - 30 + k * 12, FLOOR + 4 + Math.sin(k * 2.7) * 4 + (k % 2) * 5); g.lineTo(cx + 66, FLOOR); g.fill();
    g.strokeStyle = '#8a6a42'; g.lineWidth = 2.5; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(cx - 24 + k * 15, FLOOR + 2); g.lineTo(cx - 30 + k * 15 + (k % 2 ? 10 : -8), FLOOR - 8 - (k % 3) * 4); g.stroke(); } }
}
function drawSearchlights(t) { g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 2; k++) { const fx0 = 200 + k * 260 + Math.sin(t * .9 + k * 2) * 40, tx = 320 + Math.sin(t * 1.3 + k * 1.7) * 280, ty = sy(40 + Math.sin(t * 1.1 + k) * 40, 0);
    const gr = g.createLinearGradient(fx0, 0, tx, ty); gr.addColorStop(0, 'rgba(255,250,220,.0)'); gr.addColorStop(1, 'rgba(255,250,220,.28)'); g.fillStyle = gr; g.beginPath(); g.moveTo(fx0 - 6, -10); g.lineTo(tx - 40, ty); g.lineTo(tx + 40, ty); g.lineTo(fx0 + 6, -10); g.fill();
    g.fillStyle = 'rgba(255,250,220,.22)'; g.beginPath(); g.ellipse(tx, ty, 40, 9, 0, 0, 7); g.fill(); } g.restore(); }
function drawLighthouse(L) { const x = sxW(L.wx), base = FLOOR - 6; if (x < -120 || x > VW + 120) return; const H = 186;
  // the tower (what stays standing)
  const keep = L.fall >= 0 ? H * .62 : H;
  poly(g, [[x - 16, base], [x + 16, base], [x + 11, base - keep], [x - 11, base - keep]], '#ece4d4', '#ffffff');
  for (let k = 0; k < 4; k++) { const y0 = base - 20 - k * 38; if (y0 - 12 < base - keep) break; poly(g, [[x - 15 + k * 1.3, y0], [x + 15 - k * 1.3, y0], [x + 14 - k * 1.3, y0 - 12], [x - 14 + k * 1.3, y0 - 12]], '#b83a2a'); }
  g.fillStyle = '#2a2a30'; g.fillRect(x - 3, base - 26, 6, 12);
  if (L.fall >= 0) { g.fillStyle = '#5a5048'; g.beginPath(); g.moveTo(x - 11, base - keep); for (let k = 0; k <= 6; k++) g.lineTo(x - 11 + k * 3.7, base - keep - (k % 2 ? 6 : 1)); g.lineTo(x + 11, base - keep); g.fill(); if (Math.random() < .3) fx.push({ k: 'smoke2', x: L.wx, z: -10, y: keep + 4, vx: -6, vy: 22, t: 2.4, T: 2.4, r: 6, dark: 1 }); }
  // the top: standing, falling, or lying in the square
  const top = (c) => { poly(c, [[-11, 0], [11, 0], [9, -H * .38], [-9, -H * .38]], '#ece4d4'); poly(c, [[-12, -H * .2], [12, -H * .2], [12, -H * .2 - 9], [-12, -H * .2 - 9]], '#b83a2a');
    poly(c, [[-15, -H * .38], [15, -H * .38], [15, -H * .38 - 4], [-15, -H * .38 - 4]], '#2a2a30'); poly(c, [[-9, -H * .38 - 4], [9, -H * .38 - 4], [9, -H * .38 - 20], [-9, -H * .38 - 20]], L.fall >= 0 ? '#3a4048' : '#ffe8a0'); poly(c, [[-11, -H * .38 - 20], [11, -H * .38 - 20], [0, -H * .38 - 32]], '#2a2a30'); };
  if (L.fall < 0) { g.save(); g.translate(x, base - keep); top(g); g.restore();
    g.save(); g.globalCompositeOperation = 'lighter'; const a = time * 1.6, ly = base - keep - H * .38 - 12; g.fillStyle = 'rgba(255,240,180,.16)'; g.beginPath(); g.moveTo(x, ly); g.lineTo(x + Math.cos(a) * 260, ly - 30 + Math.sin(a) * 20); g.lineTo(x + Math.cos(a) * 260, ly + 30 + Math.sin(a) * 20); g.fill(); g.restore(); }
  else { L.fall = Math.min(1, L.fall + FRAME_DT / .95); const f = L.fall;   // it tips over the break, then drops into the square and lands on its side
    const tip = Math.min(1, f / .4), drop = Math.max(0, (f - .4) / .6), r = -.55 * ease(tip) - 1.02 * Math.pow(drop, 1.4), px = x - 4 - 120 * Math.pow(drop, 1.2), py = (base - H * .62) + (H * .62 - 14) * Math.pow(drop, 2);
    g.save(); g.translate(px, py); g.rotate(r); top(g); g.restore(); }
}
function drawCrane(K) { const x = sxW(K.wx), base = FLOOR - 4; if (x < -500 || x > VW + 400) return; g.save(); g.translate(x, base); g.scale(1.3, 1.3); g.translate(-x, -base); drawCrane0(K, x, base); g.restore(); }
function drawCrane0(K, x, base) { const H = 140, sw = K.snap < 0 ? Math.sin(time * 1.6) * .1 * (K.swingAmp || .3) : 0;
  const yellow = '#e8b02a', dk = '#8a6014';
  // collapse: the legs buckle outward at the knee and the top girder comes down onto the quay, tilting
  if (K.fall >= 0) K.fall = Math.min(1, K.fall + FRAME_DT / .85); const u = K.fall >= 0 ? Math.pow(K.fall, 2.2) : 0, top = base - H * (1 - .86 * u), tilt = -.14 * u, kneeOut = 34 * Math.sin(Math.min(1, u * 1.2) * Math.PI * .9);
  const leg = (lx, dir) => { const ty = top + (lx - x) * Math.sin(tilt), kn = [lx + dir * kneeOut, (base + ty) / 2 + u * 8];
    for (const [a, b] of [[[lx, base], kn], [kn, [lx + dir * u * 6, ty]]]) { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * 6, ny = dx / L * 6;
      poly(g, [[a[0] - nx, a[1] - ny], [a[0] + nx, a[1] + ny], [b[0] + nx * .7, b[1] + ny * .7], [b[0] - nx * .7, b[1] - ny * .7]], yellow); g.strokeStyle = dk; g.lineWidth = 1.1; const n = Math.max(2, L / 18 | 0);
      for (let k = 0; k < n; k++) { const p0 = [a[0] + dx * k / n, a[1] + dy * k / n], p1 = [a[0] + dx * (k + 1) / n, a[1] + dy * (k + 1) / n]; g.beginPath(); g.moveTo(p0[0] - nx * .8, p0[1] - ny * .8); g.lineTo(p1[0] + nx * .8, p1[1] + ny * .8); g.moveTo(p0[0] + nx * .8, p0[1] + ny * .8); g.lineTo(p1[0] - nx * .8, p1[1] - ny * .8); g.stroke(); } } };
  leg(x - 70, -1); leg(x + 70, 1);
  g.save(); g.translate(x, top); g.rotate(tilt);
  poly(g, [[-150, -4], [110, -4], [110, -18], [-150, -18]], yellow); g.strokeStyle = dk; g.lineWidth = 1; for (let k = 0; k < 26; k++) { g.beginPath(); g.moveTo(-150 + k * 10, -4); g.lineTo(-140 + k * 10, -18); g.stroke(); }
  poly(g, [[70, -18], [104, -18], [104, -40], [76, -40]], '#d8d0c0'); g.fillStyle = '#2a3a48'; g.fillRect(80, -36, 18, 8); if (K.fall >= 0 && u < 1) { g.fillStyle = '#ffd27a'; g.fillRect(84, -35, 4, 4); }
  const tx = 6; g.fillStyle = '#4a4a50'; g.fillRect(tx - 10, -2, 20, 8);
  if (K.snap < 0) { g.save(); g.translate(tx, 6); g.rotate(sw); g.strokeStyle = '#2a2a2a'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-5, 0); g.lineTo(-14, 54); g.moveTo(5, 0); g.lineTo(14, 54); g.stroke(); drawContainer(g, -BK.container.w / 2.6, 54, BK.container.w / 1.3, BK.container.h / 1.3, '#e8b02a'); g.restore(); }
  else { g.strokeStyle = '#2a2a2a'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(tx - 5, 6); g.lineTo(tx - 9 + Math.sin(time * 20) * 3, 30); g.moveTo(tx + 5, 6); g.lineTo(tx + 12 + Math.sin(time * 17) * 3, 24); g.stroke(); }
  g.restore();
  if (K.fall >= 1 && Math.random() < .25) fx.push({ k: 'smoke2', x: K.wx - 60 + Math.random() * 160, z: -4, y: 6 + Math.random() * 14, vx: -8, vy: 14, t: 2, T: 2, r: 5, dark: 1 }); }
function drawContainer(c, x, y, w, h, col, open) { poly(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], col); c.strokeStyle = shadeC(col, -.3); c.lineWidth = .9; for (let q = 1; q < 10; q++) { c.beginPath(); c.moveTo(x + q * w / 10, y + 2); c.lineTo(x + q * w / 10, y + h - 2); c.stroke(); } c.fillStyle = shadeC(col, -.4); c.fillRect(x, y, w, 2); c.fillRect(x, y + h - 2, w, 2); if (open) { c.fillStyle = '#140e0a'; c.fillRect(x + w * .3, y + 3, w * .4, h - 5); } }
function drawTruck(d, t) { if (!d.s) { return; } const x = sxW(d.wx), base = sy(d.slide ? 8 * d.slide : 0, 0) - 2, s = (.5 + .5 * d.s) * 1.95;
  // the hole in the wall behind
  g.fillStyle = '#120c0a'; g.beginPath(); for (let k = 0; k <= 16; k++) { const a = Math.PI + k / 16 * Math.PI, r = 150 + Math.sin(k * 3.1) * 16; g.lineTo(x + Math.cos(a) * r * 1.05, FLOOR - 4 + Math.sin(a) * r * 1.05); } g.closePath(); g.fill();
  for (let k = 0; k < 16; k++) { const a = Math.PI + k / 15 * Math.PI, r = 157 + Math.sin(k * 3.1) * 16; g.fillStyle = k % 2 ? '#8a3a2a' : '#a8503a'; g.fillRect(x + Math.cos(a) * r * 1.05 - 5, FLOOR - 4 + Math.sin(a) * r * 1.05 - 2.5, 10, 5); }
  g.save(); g.translate(x, base); g.scale(s, s);
  // the tank: a big cylinder behind the cab, wider than it
  poly(g, [[-78, -100], [78, -100], [84, -86], [84, -44], [78, -36], [-78, -36], [-84, -44], [-84, -86]], '#d8d0c0', '#ffffff'); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(-84, -56, 168, 18);
  g.fillStyle = '#c8963a'; g.fillRect(-80, -96, 160, 10); g.fillStyle = '#5a3a1a'; g.font = 'bold 12px Impact, sans-serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'BIÈRE DE SOIF' : 'DE SOIF BEER', 0, -88);
  g.fillStyle = '#9a9aa2'; for (const ex of [-70, 70]) g.fillRect(ex - 2, -100, 4, 64);
  // the cab, front on: windscreen with a scared driver, grille, headlights, bumper, wheels
  poly(g, [[-46, -84], [46, -84], [52, -40], [52, -6], [-52, -6], [-52, -40]], '#b8302a', '#e85a4a'); poly(g, [[-38, -78], [38, -78], [42, -50], [-42, -50]], '#9ad0e8');
  disc(g, -14, -60, 6, '#e0b090'); g.fillStyle = '#1a1a1e'; g.fillRect(-18, -63, 2, 2); g.fillRect(-12, -63, 2, 2); g.beginPath(); g.arc(-14, -57, 2, 0, 7); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(18, -76); g.lineTo(10, -54); g.stroke();
  if (t > 1.4) { g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = .8; g.beginPath(); g.moveTo(24, -70); g.lineTo(32, -62); g.lineTo(28, -56); g.moveTo(32, -62); g.lineTo(38, -64); g.stroke(); }
  poly(g, [[-30, -44], [30, -44], [30, -14], [-30, -14]], '#c8c8d0'); g.strokeStyle = '#5a5a62'; g.lineWidth = 1.5; for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(-26 + k * 8.6, -42); g.lineTo(-26 + k * 8.6, -16); g.stroke(); }
  for (const hx of [-42, 42]) disc(g, hx, -26, 7, '#fff6c0', '#ffffff');
  poly(g, [[-56, -10], [56, -10], [56, 0], [-56, 0]], '#8a8a92'); for (const wx of [-44, 44]) { g.fillStyle = OUT; g.fillRect(wx - 9, -2, 18, 10); g.fillStyle = '#2a2a30'; g.fillRect(wx - 8, -1, 16, 8); }
  g.restore();
  if (t > 1.4 && t < 3.8) { g.save(); g.globalCompositeOperation = 'lighter'; for (const hx of [-42, 42]) { const cx = x + hx * s, cy = base - 26 * s, gr = g.createRadialGradient(cx, cy, 2, cx, cy, 80); gr.addColorStop(0, `rgba(255,250,210,${.45 * Math.max(0, 1 - (t - 1.4) / 2.4)})`); gr.addColorStop(1, 'rgba(255,250,210,0)'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, 80, 0, 7); g.fill(); } g.restore(); }
  // the foam fountain from the ruptured tank
  if (t > 2.4 && t < 6) { const h = 40 + Math.sin(t * 9) * 6, fx0 = x + 30 * s, fy = base - 100 * s; g.fillStyle = 'rgba(255,248,224,.92)'; g.beginPath(); g.moveTo(fx0 - 4, fy); g.quadraticCurveTo(fx0 - 10, fy - h * .7, fx0, fy - h); g.quadraticCurveTo(fx0 + 10, fy - h * .7, fx0 + 4, fy); g.fill(); for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(fx0 + Math.sin(t * 7 + k) * 8, fy - h - 2 + Math.cos(t * 6 + k) * 3, 4 + (k % 2) * 2, 0, 7); g.fill(); } }
}
// ---- the moving parts ----
function setFx(f, dt) {
  switch (f.k) {
    case 'block': f.x += f.vx * dt; f.z += f.vz * dt; f.y += f.vy * dt; f.vy -= SPG * dt; f.rot += f.vr * dt; if (f.y <= 0) { f.t = 0; f.x = f.tx; f.z = f.tz; placeBlock(f); } return true;
    case 'cfall': f.x += f.vx * dt; f.y += f.vy * dt; f.vy -= SPG * dt; f.rot += dt * 1.4; if (f.y < -60) { f.t = 0; spray(f.x, -10, 30, '#ffffff', 1.4, 1.2); SND.splash(1.4); } return true;
    case 'cfallv': f.vy -= SPG * 1.2 * dt; f.y = Math.max(0, f.y + f.vy * dt); if (f.y <= 0 && !f.landed) { f.landed = 1; f.t = .01; placeBlock({ kind: 'container', x: f.x, z: f.z, col: f.col }); const b = BREAK[BREAK.length - 1]; b.open = 1; for (let k = 0; k < 2; k++) fx.push({ k: 'debris', x: f.x + (k ? 26 : -26), z: f.z, y: 14, vx: (k ? 1 : -1) * 220, vy: 260, rot: 0, vr: 14, t: 1.4, col: '#c8901a', w: 12 }); } return true;
    case 'drop2': f.x += f.vx * dt; f.y += f.vy * dt; f.vy -= 520 * dt; f.vx *= Math.pow(.6, dt); return true;
    case 'smoke2': f.x += f.vx * dt; f.y += f.vy * dt; f.r += dt * 8; return true;
    case 'spark2': f.x += f.vx * dt; f.y -= f.vy * dt; f.vy -= 300 * dt; return true;
    case 'brick': f.x += f.vx * dt; f.z = Math.min(DEPTH, f.z + f.vz * dt); f.y += f.vy * dt; f.vy -= 600 * dt; f.rot += f.vr * dt; if (f.y <= 0) { f.y = 0; if (Math.abs(f.vy) > 80) { f.vy = -f.vy * .3; f.vx *= .5; f.vz *= .4; f.vr *= .5; if (Math.random() < .3) SND.wood(.15); } else { f.vy = 0; f.vx *= .8; f.vz *= .8; f.vr *= .8; } } return true;
    case 'geyser': case 'muzzle': case 'lane': case 'flak': return true;
    case 'target': case 'mshell': if (f.k === 'mshell' && f.t <= dt + .001 && !f.boomed) { f.boomed = 1; if (!f.hl) { boom(f.tx, f.z, 44); quake(9); bigRumble([[0, .8, .7, 260], [300, .3, .2, 200]]); areaHit(f.tx, f.z, 30, 20, 1); } } return true;
  }
  return false;
}
function drawSetFx(f) { const x = f.x - camX, y = sy(f.z, f.y || 0);
  switch (f.k) {
    case 'lane': { const u = 1 - f.t / f.T, a = (Math.floor(time * 8) % 2 ? .45 : .25) * Math.min(1, f.t * 2); const y0 = sy(f.z - (f.hw || 16), 0), y1 = sy(f.z + (f.hw || 16), 0); g.fillStyle = `rgba(255,50,30,${a})`; g.fillRect(f.x0 - camX, y0, f.x1 - f.x0, y1 - y0); g.strokeStyle = `rgba(255,80,50,${a * 1.6})`; g.lineWidth = 1.5; g.setLineDash([6, 4]); g.strokeRect(f.x0 - camX, y0, f.x1 - f.x0, y1 - y0); g.setLineDash([]); for (let k = 0; k < 5; k++) { const ax = f.x1 - camX - 40 - k * 100 - (time * 120) % 100; g.fillStyle = `rgba(255,240,220,${a * 1.5})`; g.beginPath(); g.moveTo(ax, (y0 + y1) / 2); g.lineTo(ax + 14, y0 + 3); g.lineTo(ax + 14, y1 - 3); g.fill(); } return true; }
    case 'flak': { const u = 1 - f.t / f.T; g.fillStyle = `rgba(50,40,40,${.8 * (1 - u)})`; g.beginPath(); g.arc(f.x - camX, FLOOR - f.y, 4 + u * 10, 0, 7); g.fill(); if (u < .3) { g.fillStyle = '#ffd060'; g.beginPath(); g.arc(f.x - camX, FLOOR - f.y, 5, 0, 7); g.fill(); } return true; }
    case 'muzzle': { const u = 1 - f.t / f.T; g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,220,140,${1 - u})`; g.beginPath(); g.arc(x, 34, 10 + u * 14, 0, 7); g.fill(); g.restore(); return true; }
    case 'geyser': { const u = 1 - f.t / f.T, h = f.h * Math.sin(Math.min(1, u * 1.3) * Math.PI * .5) * (u > .6 ? 1 - (u - .6) / .4 * .6 : 1), w = f.w * (1 + u * .6), yb = FLOOR - 2, a = u > .7 ? 1 - (u - .7) / .3 : 1;
      g.globalAlpha = a * .9; g.fillStyle = '#e8f4fc'; g.beginPath(); g.moveTo(x - w, yb); g.quadraticCurveTo(x - w * .6, yb - h * .7, x - w * .3, yb - h); g.quadraticCurveTo(x, yb - h * 1.15, x + w * .3, yb - h); g.quadraticCurveTo(x + w * .6, yb - h * .7, x + w, yb); g.fill();
      g.fillStyle = '#ffffff'; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(x + Math.sin(k * 2.3 + u * 4) * w * .6, yb - h * (.7 + (k % 3) * .12), w * .3, 0, 7); g.fill(); } g.globalAlpha = 1; return true; }
    case 'block': { const y0 = sy(f.tz, 0), x1 = f.tx - camX, u = 1 - f.t / (f.T + .1); g.fillStyle = `rgba(0,0,0,${.15 + u * .35})`; g.beginPath(); g.ellipse(x1, y0, BK[f.kind].w * .6 * (.5 + u * .5), 9 * (.5 + u * .5), 0, 0, 7); g.fill(); g.save(); g.translate(x, y); g.rotate(f.rot); const K = BK[f.kind]; drawContainer(g, -K.w / 2, -K.h, K.w, K.h, f.col || K.col); g.restore(); return true; }
    case 'cfall': { g.save(); g.translate(x, FLOOR - 20 - f.y * .6); g.rotate(f.rot); drawContainer(g, -BK.container.w / 2, -BK.container.h / 2, BK.container.w, BK.container.h, f.col); g.restore(); return true; }
    case 'cfallv': { if (f.landed) return true; const y0 = sy(f.z, 0); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x, y0, BK.container.w * .6, 9, 0, 0, 7); g.fill(); drawContainer(g, x - BK.container.w / 2, sy(f.z, f.y) - BK.container.h, BK.container.w, BK.container.h, f.col); return true; }
    case 'drop2': { const yy = sy(-6, Math.max(-30, f.y)); g.fillStyle = f.col; g.globalAlpha = Math.min(1, f.t * 1.5); g.beginPath(); g.arc(x, yy, f.r, 0, 7); g.fill(); g.globalAlpha = 1; return true; }
    case 'smoke2': { const u = 1 - f.t / f.T; g.fillStyle = f.dark ? `rgba(40,36,40,${.55 * (1 - u)})` : `rgba(220,212,200,${.55 * (1 - u)})`; g.beginPath(); g.arc(x, y, f.r, 0, 7); g.fill(); return true; }
    case 'spark2': { g.fillStyle = Math.random() < .5 ? '#fff4b0' : '#ffb040'; g.fillRect(x, f.scr ? f.y : sy(f.z, f.y), 2, 2); return true; }
    case 'brick': { g.save(); g.translate(x, y); g.rotate(f.rot); const s2 = f.conc ? 1.6 : 1; g.fillStyle = OUT; g.fillRect(-4.6 * s2, -2.6 * s2, 9.2 * s2, 5.2 * s2); g.fillStyle = f.conc ? '#b8b0a4' : '#9a4a32'; g.fillRect(-4 * s2, -2 * s2, 8 * s2, 4 * s2); g.restore(); return true; }
    case 'target': { const u = 1 - f.t / f.T, r = (f.big ? 36 : 26) * (1.4 - u * .5); g.strokeStyle = `rgba(255,60,40,${.5 + u * .5})`; g.lineWidth = 1.6; g.beginPath(); g.ellipse(x, sy(f.z, 0), r, r * .3, 0, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x - r * .4, sy(f.z, 0)); g.lineTo(x + r * .4, sy(f.z, 0)); g.moveTo(x, sy(f.z, 0) - r * .15); g.lineTo(x, sy(f.z, 0) + r * .15); g.stroke(); return true; }
    case 'mshell': { const u = 1 - f.t / f.T, sx2 = lerpP(f.x, f.tx, u) - camX, yy = lerpP(-40, sy(f.z, 0), u); g.strokeStyle = '#fff4c0'; g.lineWidth = 3; g.beginPath(); g.moveTo(sx2 - 30, yy - 120); g.lineTo(sx2, yy); g.stroke(); g.fillStyle = '#2a2628'; g.beginPath(); g.arc(sx2, yy, 4, 0, 7); g.fill(); return true; }
  }
  return false;
}

// =================== HAVRE 2 — THE FIGHTER GOES DOWN IN THE STREET ===================
// The town's flak hits one of Villen-Hüüs's fighters; it dives in burning, belly-lands at the far end of the fish market
// and skids the whole length of the street toward you, ploughing through stalls; a red lane warns where. Then it blows up,
// and the pilot's escort crawls out of the wreck.
SETDEF.fighter = { dur: 7.4,
  start: C => { const d = C.d; d.z = 54; d.x = camX + 640; d.y = 200; d.vx = -150; d.vy = -60; d.phase = 'dive'; d.rot = .3; d.hit = new Set(); SND.alarm(3);
    try { const a = ac(), t = a.currentTime, o = a.createOscillator(), gn = a.createGain(), lp = a.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(140, t + 1.9); lp.type = 'lowpass'; lp.frequency.value = 1800; gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(.2, t + 1.2); gn.gain.exponentialRampToValueAtTime(.0001, t + 2); o.connect(lp).connect(gn).connect(buses().sfx); o.start(t); o.stop(t + 2.1); } catch (e) {}
    for (let k = 0; k < 6; k++) setTimeout(() => { fx.push({ k: 'flak', x: camX + 300 + Math.random() * 340, y: 150 + Math.random() * 60, t: .45, T: .45 }); SND.boom(.25); }, k * 140);
    bigRumble([[0, .1, .4, 800], [800, .3, .55, 800]]); },
  tick: (C, dt) => { const d = C.d;
    if (d.phase === 'dive') { d.x += d.vx * dt; d.y += d.vy * dt; d.vy -= 110 * dt; d.rot = .3 + Math.sin(C.t * 9) * .05; quake(1 + (190 - d.y) / 40); if (Math.random() < dt * 40) fx.push({ k: 'smoke2', x: d.x + 40, z: d.z - 30, y: d.y + 6, vx: 30, vy: 10, t: 1.6, T: 1.6, r: 7, dark: 1 });
      if (d.y <= 0) { d.y = 0; d.phase = 'skid'; d.vx = -330; d.rot = .06; land(C); } }
    else if (d.phase === 'skid') { d.x += d.vx * dt; d.vx *= Math.pow(.32, dt); d.rot = .06 + Math.sin(C.t * 40) * .02; quake(5 + Math.abs(d.vx) / 60);
      for (let k = 0; k < 4; k++) fx.push({ k: 'spark2', x: d.x + 30 + Math.random() * 30, y: 2, z: d.z, vx: 120 + Math.random() * 200, vy: -60 - Math.random() * 120, t: .5 });
      if (Math.random() < dt * 30) DECALS.push({ x: d.x + 40, z: d.z + (Math.random() - .5) * 8, col: 'rgba(20,14,10,.6)', t: 30, r: 5 });
      if (Math.random() < dt * 14) fx.push({ k: 'smoke2', x: d.x + 50, z: d.z - 4, y: 14, vx: 60, vy: 20, t: 1.6, T: 1.6, r: 8, dark: 1 });
      for (const b of BREAK) if (!b.broken && !b.held && Math.abs(b.x - d.x) < 140 && Math.abs(b.z - d.z) < 30) damageBreakable(b, 99, -1);
      for (const q of players) if (q.ko <= 0 && !d.hit.has(q) && Math.abs(q.x - d.x - 10) < 145 && Math.abs(q.z - d.z) < 18 && q.y < 60) { d.hit.add(q); q.inv = 0; hitPlayer(q, 2, -1, null); q.vx = -320; q.vy = 220; q.y = 1; }
      for (const e of enemies) if (!e.dead && !d.hit.has(e) && Math.abs(e.x - d.x - 10) < 145 && Math.abs(e.z - d.z) < 18) { d.hit.add(e); hitEnemy(e, 5, -1, null, 2); e.vy = 260; e.y = Math.max(1, e.y); e.vx = -360; }
      if (Math.abs(d.vx) < 25 || d.x < camX + 120) { d.phase = 'stop'; d.vx = 0; d.stopT = C.t; SND.metal(1.2); solidWreck(d.x + 10, d.z, 270, 22, 50); } }
    else if (Math.random() < dt * 10) fx.push({ k: 'smoke2', x: d.x + (Math.random() - .3) * 70, z: d.z - 6, y: 16 + Math.random() * 10, vx: -8, vy: 26, t: 2.2, T: 2.2, r: 9, dark: 1 }); },
  ev: [[.2, C => quip(players[0], LANG === 'fr' ? 'Au-dessus ! Il tombe sur nous !' : 'Above us! It’s coming down on us!', 2)],
    [.6, C => { fx.push({ k: 'lane', z: C.d.z, x0: camX + 60, x1: camX + VW - 20, t: 1.6, T: 1.6, hw: 22 }); }],
    [5.3, C => { const d = C.d; d.phase = 'wreck'; boom(d.x, d.z, 120); boom(d.x + 90, d.z, 90); boom(d.x - 70, d.z, 70); quake(18); camPunch(d.x, d.z, 20, .12); slowMo(.4); WORLD.noir = .6; WORLD.flash = .25; SND.boom(2); SND.crash(1.6);
      bigRumble([[0, 1, 1, 600], [650, .7, .6, 400], [1100, .4, .3, 400]]); INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'KA-BLAMMM !!' : 'KA-BLAMMM!!', x: sxW(d.x) * 1.5, y: 250, size: 54, t: 0, strong: true, rot: .05 });
      areaHit(d.x, d.z, 80, 34, 2); splinters(d.x, d.z, 30, '#3a3a44', 1.2); for (let k = 0; k < 16; k++) fx.push({ k: 'smoke2', x: d.x + (Math.random() - .5) * 90, z: d.z - 4, y: 10 + Math.random() * 40, vx: (Math.random() - .5) * 60, vy: 30 + Math.random() * 30, t: 2.6, T: 2.6, r: 12 + Math.random() * 8, dark: 1 }); }],
    [6.1, C => { const d = C.d; setDrop(C, [[d.x - 10, d.z + 18, 30], [d.x + 30, d.z + 20, 36], [d.x + 60, d.z - 16, 30], [d.x + 10, d.z - 18, 40]]); }]],
  items: C => [{ key: C.d.z + 6, draw: () => drawFighter(C.d, C.t) }] };
function land(C) { const d = C.d; quake(17); camPunch(d.x, d.z, 10, .14); slowMo(.45); WORLD.noir = .6; WORLD.flash = .2; SND.crash(2.2); SND.metal(1.8); SND.boom(1);
  bigRumble([[0, 1, 1, 500], [550, .8, .8, 700], [1300, .6, .6, 700], [2050, .35, .3, 500]]);
  INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'SKRRRAAAAAM !!' : 'SKRRRAAAAAM!!', x: sxW(d.x) * 1.5, y: 240, size: 54, t: 0, strong: true, rot: -.06 });
  puff(d.x, d.z, 20, 1, 2.6); splinters(d.x, d.z, 24, '#6a5a4a', 1.2); for (const e of enemies) if (!e.dead) react(e, 'cower', 1.4);
  try { const t = SND.now(); nz(t, 3, .3, 2400, 900, 'bandpass', 2.5); nz(t, 3, .2, 6000, 4000, 'highpass', 1); } catch (e) {} }
function drawFighter(d, t) { if (d.x == null) return; const x = sxW(d.x), y = sy(d.z, d.y), y0 = sy(d.z, 0), on = d.phase === 'wreck';
  if (d.y > 0) { const k = Math.max(.2, 1 - d.y / 220); g.fillStyle = `rgba(0,0,0,${.35 * k})`; g.beginPath(); g.ellipse(x, y0, 160 * k, 14 * k, 0, 0, 7); g.fill(); }
  g.save(); g.translate(x, y); g.rotate(d.rot || 0); g.scale(2.7, 2.7);
  // fuselage, cockpit, wings, tail, insignia; flames from the engine
  const hull = on ? '#2a2628' : '#4a4e5a';
  if (!on) { const fl = 12 + Math.sin(t * 50) * 4; for (const [c, w] of [['#ff6a2a', 1], ['#ffd060', .55]]) { g.fillStyle = c; g.beginPath(); g.moveTo(48, -16); g.lineTo(48 + fl * 2.2 * w + 10, -12 + Math.sin(t * 30) * 2); g.lineTo(48, -6); g.fill(); } }
  poly(g, [[-58, -10], [-40, -20], [40, -22], [52, -16], [52, -6], [-50, -2]], hull, on ? null : '#7a808e');
  poly(g, [[-10, -8], [26, -8], [44, 6], [6, 6]], shadeC(hull, -.2)); poly(g, [[30, -20], [44, -38], [52, -38], [50, -18]], hull);
  poly(g, [[-40, -20], [-24, -28], [-6, -28], [-2, -20]], on ? '#1a1a1e' : '#9ad0e8'); if (!on) { g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(-30, -26, 10, 2); }
  g.fillStyle = '#c83a2a'; g.beginPath(); g.arc(10, -14, 5, 0, 7); g.fill(); g.fillStyle = '#efe6d2'; g.font = 'bold 6px sans-serif'; g.textAlign = 'center'; g.fillText('V', 10, -12);
  g.strokeStyle = '#1a1a1e'; g.lineWidth = 1; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(-40 + k * 15, -20); g.lineTo(-42 + k * 15, -3); g.stroke(); }
  if (d.phase !== 'dive') { g.strokeStyle = '#1a1a1e'; g.lineWidth = 2; g.beginPath(); g.moveTo(-20, -8); g.lineTo(-14, 2); g.lineTo(-28, 4); g.moveTo(12, -6); g.lineTo(22, 4); g.stroke(); }
  g.restore();
  if (on || d.phase === 'stop') { drawFlames(x - 60, y0, 70, t, 1); drawFlames(x + 10, y0, 80, t, 2); drawFlames(x + 80, y0, 60, t, 3); drawFlames(x + 130, y0, 50, t, 4); }
}

// =================== DE SOIF 2 — THE ELEVATED TRAIN DERAILS ===================
// A three-car train races along the viaduct over downtown, brakes screaming; the first car jumps the rails, smashes through
// the parapet and drops onto the boulevard; the second hangs off the broken edge, swinging; concrete rains down; goons
// pour out of the fallen car's doors.
SETDEF.train = { dur: 7.6,
  start: C => { const d = C.d; d.x = camX + VW + 60; d.vx = -360; d.phase = 'run'; SND.horn(1.4, 220); bigRumble([[0, .15, .35, 900], [900, .35, .6, 600]]);
    try { const t = SND.now(); nz(t, 2.4, .12, 3200, 5200, 'bandpass', 14); nz(t + .6, 1.8, .14, 4200, 2600, 'bandpass', 16); } catch (e) {} },
  tick: (C, dt) => { const d = C.d, VY = viaY();
    if (d.phase === 'run') { d.x += d.vx * dt; d.vx *= Math.pow(.7, dt); quake(1.5); for (let k = 0; k < 2; k++) fx.push({ k: 'spark2', x: d.x + 20 + Math.random() * 200, y: FLOOR - VY + 2, z: -40, vx: 100 + Math.random() * 120, vy: -Math.random() * 60, t: .4, scr: 1 });
      if (d.x < camX + 300) { d.phase = 'derail'; d.t0 = C.t; d.fx = d.x; d.fy = 0; d.fvx = d.vx * .7; d.fvy = 120; d.frot = 0; d.carsX = d.x; derail(C); } }
    else { d.fx += d.fvx * dt; d.fvy -= 520 * dt; d.fy += d.fvy * dt; d.frot -= 1.6 * dt; const groundY = (FLOOR - VY) - sy(TRZ, 0);   // the car falls from the viaduct to the street in front
      if (d.fy <= groundY && !d.landed) { d.landed = true; d.fvx = 0; trainLand(C); } if (d.landed) { d.fy = groundY; d.frot += (-.05 - d.frot) * Math.min(1, dt * 6); }
      d.swing = Math.sin((C.t - d.t0) * 3) * .25 * Math.max(0, 1 - (C.t - d.t0) / 6); if (Math.random() < dt * 20) fx.push({ k: 'spark2', x: d.carsX - 10, y: FLOOR - VY + 4, z: -40, vx: (Math.random() - .5) * 120, vy: -40 - Math.random() * 80, t: .6, scr: 1 }); } },
  ev: [[.2, C => quip(players[0], LANG === 'fr' ? 'Le métro… il va beaucoup trop vite !' : 'The train… it’s going way too fast!', 2)],
    [5.4, C => { const d = C.d; setDrop(C, [[d.fx - 90, 40, 40], [d.fx - 20, 44, 50], [d.fx + 60, 40, 40], [d.fx + 120, 50, 46]]); }]],
  items: C => C.d.phase === 'derail' && C.d.landed ? [{ key: TRZ + 11, draw: () => drawTramCar(C.d, true) }] : [] };
const viaY = () => 118, TRZ = 12;   // the fallen car lands at the back of the street   // height of the viaduct deck above the street line
function derail(C) { const d = C.d; quake(14); camPunch(d.x, 0, 120, .1); WORLD.noir = .5; SND.crash(1.8); SND.metal(2); bigRumble([[0, .9, .9, 500], [550, .6, .5, 400]]);
  INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'KRRRIIIIIK !!' : 'SKREEEEEK!!', x: sxW(d.x) * 1.5, y: 120, size: 48, t: 0, strong: true, rot: -.08 });
  for (let k = 0; k < 26; k++) fx.push({ k: 'brick', x: d.x + (Math.random() - .5) * 60, z: 6 + Math.random() * 30, y: viaY() + Math.random() * 10, vx: (Math.random() - .5) * 220, vz: Math.random() * 40, vy: Math.random() * 120, rot: 0, vr: (Math.random() - .5) * 16, t: 3, conc: 1 }); }
function trainLand(C) { const d = C.d; quake(20); camPunch(d.fx, 30, 20, .15); slowMo(.5); WORLD.noir = .6; WORLD.flash = .25; SND.crash(2.4); SND.boom(1.5); SND.metal(2); SND.glass();
  bigRumble([[0, 1, 1, 700], [750, .8, .8, 500], [1300, .5, .45, 500], [1850, .25, .2, 500]]);
  INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'BRAAAOUMMM !!' : 'KRA-THOOOOM!!', x: sxW(d.fx) * 1.5, y: 250, size: 58, t: 0, strong: true, rot: .06 });
  crushAt(d.fx, TRZ, 380, 34, 3); puff(d.fx, 30, 30, 0, 3.2); splinters(d.fx, 30, 30, '#c8c0b0', 1.3); for (let k = 0; k < 10; k++) fx.push({ k: 'smoke2', x: d.fx + (Math.random() - .5) * 140, z: 30, y: 10 + Math.random() * 20, vx: (Math.random() - .5) * 80, vy: 20, t: 2.4, T: 2.4, r: 12 });
  for (const b of BREAK) if (!b.broken && !b.held && Math.abs(b.x - d.fx) < 90 && b.z < 60) damageBreakable(b, 99, Math.sign(b.x - d.fx) || 1);
  const K = { size: 'l', hp: 18, w: 380, d: 22, h: 100, col: '#e8b02a', solid: 1 }; const b = { k: 'tramwreck', x: d.fx, z: TRZ, ...K, hp: K.hp, max: K.hp, y: 0, vx: 0, vy: 0, held: null, thrown: false, rot: 0, flash: 0, id: Math.random(), hide: 1 };
  b.box = { x: b.x - b.w / 2, z: b.z - b.d / 2, w: b.w, d: b.d, h: b.h, bk: b }; scr.boxes.push(b.box); BREAK.push(b); d.wreck = b;
  for (const o of [...players, ...enemies]) if (!o.dead && Math.abs(o.x - b.x) < b.w / 2 + 3 && Math.abs(o.z - b.z) < b.d / 2 + 3) o.z = o.z < b.z ? Math.max(1, b.z - b.d / 2 - 4) : Math.min(DEPTH - 1, b.z + b.d / 2 + 4); }
function drawViaduct(C) { const VY = viaY(), yd = FLOOR - VY, d = C ? C.d : SETP.props.via || {}; g.save();
  // pillars and the deck, sliding with the camera like the facades
  for (let k = -1; k < 6; k++) { const px = Math.round(k * 160 - (camX * .9) % 160 + 40); poly(g, [[px - 7, FLOOR - 6], [px + 7, FLOOR - 6], [px + 6, yd + 12], [px - 6, yd + 12]], '#9a948a'); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(px + 2, yd + 12, 4, VY - 18); }
  const brk = d.phase === 'derail' ? sxW(d.carsX) - 40 : null;
  const deck = (x0, x1) => { poly(g, [[x0, yd], [x1, yd], [x1, yd + 12], [x0, yd + 12]], '#b8b0a4'); g.fillStyle = '#6a645a'; g.fillRect(x0, yd - 3, x1 - x0, 3); g.strokeStyle = '#4a463e'; g.lineWidth = 1; for (let x = x0; x < x1; x += 8) { g.beginPath(); g.moveTo(x, yd - 3); g.lineTo(x, yd - 7); g.stroke(); } g.beginPath(); g.moveTo(x0, yd - 7); g.lineTo(x1, yd - 7); g.stroke(); };
  if (brk == null) deck(-20, VW + 20); else { deck(-20, brk - 30); deck(brk + 30, VW + 20); g.fillStyle = '#6a645a'; poly(g, [[brk - 30, yd], [brk - 18, yd + 4], [brk - 26, yd + 12], [brk - 30, yd + 12]], '#a8a094'); poly(g, [[brk + 30, yd], [brk + 20, yd + 6], [brk + 26, yd + 12], [brk + 30, yd + 12]], '#a8a094');
    g.strokeStyle = '#3a3a3a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(brk - 30, yd - 3); g.quadraticCurveTo(brk - 10, yd + 10, brk - 4, yd + 26); g.moveTo(brk + 30, yd - 3); g.quadraticCurveTo(brk + 14, yd + 14, brk + 8, yd + 30); g.stroke(); }
  // the train
  if (d.phase === 'run') for (let k = 0; k < 3; k++) drawTramCar({ x: d.x + k * 152, y: yd, rot: 0 }, false);
  else if (d.phase === 'derail') { g.save(); g.translate(sxW(d.carsX) + 40, yd); g.rotate(-.5 + (d.swing || 0)); drawTramCar({ x: camX - 75, y: 0, rot: 0, lit: 0 }, false); g.restore(); drawTramCar({ x: d.carsX + 152, y: yd, rot: 0 }, false);
    if (!d.landed) { g.save(); g.translate(sxW(d.fx), yd - d.fy); g.rotate(d.frot); const fk = 1.65 + (4.2 - 1.65) * Math.min(1, Math.max(0, -d.fy / Math.max(1, -((FLOOR - viaY()) - sy(TRZ, 0))))); drawTramCar({ x: camX, y: 0, rot: 0, k: fk }, false); g.restore(); } }
  g.restore(); }
function drawTramCar(c, onStreet) { const k = c.k || 1.65, w = onStreet ? 380 : 90 * k, h = onStreet ? 112 : 28 * k, x = onStreet ? sxW(c.fx) - w / 2 : sxW(c.x) - w / 2, y = onStreet ? sy(TRZ, 0) : c.y;
  g.save(); if (onStreet) { g.translate(x + w / 2, y); g.rotate(c.frot || 0); g.translate(-(x + w / 2), -y); }
  poly(g, [[x, y - h], [x + w, y - h], [x + w + 4, y - h * .5], [x + w, y], [x, y], [x - 4, y - h * .5]], '#e8b02a', '#ffd870'); g.fillStyle = '#c83a2a'; g.fillRect(x, y - h * .3, w, h * .12);
  for (let k = 0; k < 6; k++) { g.fillStyle = onStreet ? '#1a1a20' : (k % 2 ? '#9ad0e8' : '#b8e0f0'); g.fillRect(x + 6 + k * (w - 12) / 6, y - h * .82, (w - 12) / 6 - 3, h * .32); }
  g.fillStyle = '#2a2a30'; g.fillRect(x + w * .44, y - h * .85, w * .1, h * .8); if (onStreet) { g.strokeStyle = '#1a1a1e'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + 10, y - h); g.lineTo(x + 24, y - h * .6); g.lineTo(x + 18, y - h * .3); g.moveTo(x + w - 20, y - h); g.lineTo(x + w - 30, y - h * .5); g.stroke(); }
  g.fillStyle = '#3a3a3e'; g.fillRect(x + 8, y, 14, 4); g.fillRect(x + w - 22, y, 14, 4); g.restore();
  if (onStreet) { drawFlames(x + 40, sy(TRZ, 0), 60, time, 3); drawFlames(x + w - 70, sy(TRZ, 0), 50, time, 5); if (Math.random() < .3) fx.push({ k: 'smoke2', x: c.fx + (Math.random() - .5) * 100, z: 26, y: 30, vx: -6, vy: 22, t: 2, T: 2, r: 8, dark: 1 }); } }

// a wreck you can't walk through; anyone standing where it settles is pushed out to the nearer side
function solidWreck(x, z, w, d, h) { const box = { x: x - w / 2, z: z - d / 2, w, d, h, wreck: 1 }; scr.boxes.push(box);
  const front = box.z + d + 5, back = box.z - 5;   // push anyone underneath out to whichever side has room
  for (const o of [...players, ...enemies]) if (!o.dead && o.x > box.x - 3 && o.x < box.x + w + 3 && o.z > box.z - 3 && o.z < box.z + d + 3) { const okB = back >= 1, okF = front <= DEPTH - 1; o.z = okB && (!okF || o.z < z) ? back : okF ? front : o.z; o.y = Math.max(o.y, 0); }
  return box; }
