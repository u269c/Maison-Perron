// =====================================================================
// Battle Planet ZenzizenziX — MOCK, level 1 (Havre). Core: screens, waves,
// fighters, friendly fire, enemies, HUD and the loop.
// =====================================================================
const VW = 640, VH = 360, FLOOR = 212, DEPTH = 122, GRAV = 760, SPR = 1.3;
const WORLD = { zoneIdx: 0, zoneWave: 0, flash: 0, shake: 0, boss: null, levelDone: false };
let LANG = (() => { try { return localStorage.getItem('bp-lang') || 'fr'; } catch (e) { return 'fr'; } })();
const T = {
  fr: { level: 'HAVRE', screen: 'Écran', p1: 'J1', p2: 'J2', ready: 'PRÊT', special: 'SPÉCIAL', paused: 'PAUSE', fell: 'PLOUF !', ff: 'TIR AMI !', dodge: 'ESQUIVE !', counter: 'CONTRÉ !', ffc: 'Tirs amis', ko: 'K.O. !', up: 'RELÈVE-TOI !', go: 'GO', left: 'ennemis', wipe: 'K.O. TOUS LES DEUX — ON RECOMMENCE L\'ÉCRAN', done: 'NIVEAU 1 TERMINÉ', flee: 'Je reviendrai !', time: 'Temps', again: 'R pour rejouer', reroll: 'Deux nouveaux guerriers', lang: 'English', boss: 'Lord Villen-Hüüs',
    help: '<b>J1</b> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> bouger · <kbd>Espace</kbd> sauter · <kbd>F</kbd> frapper · <kbd>G</kbd> spécial · <kbd>Q</kbd> changer · <b>double avant</b> charge · <b>double arrière</b> esquive', help2: '<b>J2</b> <kbd>←</kbd><kbd>↑</kbd><kbd>→</kbd><kbd>↓</kbd> · <kbd>Maj droite</kbd> sauter · <kbd>K</kbd> frapper · <kbd>L</kbd> spécial · <kbd>P</kbd> changer', help3: 'Manettes : appuie sur un bouton (1re manette = J1, 2e = J2) · ✕ sauter · □ frapper · ○ spécial · Select changer · <kbd>Échap</kbd> pause · <kbd>N</kbd> écran suivant (test)' },
  en: { level: 'HAVRE', screen: 'Screen', p1: 'P1', p2: 'P2', ready: 'READY', special: 'SPECIAL', paused: 'PAUSED', fell: 'SPLASH!', ff: 'FRIENDLY FIRE!', dodge: 'DODGED!', counter: 'COUNTERED!', ffc: 'Friendly fire', ko: 'K.O.!', up: 'GET UP!', go: 'GO', left: 'enemies', wipe: 'BOTH DOWN — RESTARTING THE SCREEN', done: 'LEVEL 1 COMPLETE', flee: 'I\'ll be back!', time: 'Time', again: 'R to play again', reroll: 'Two new warriors', lang: 'Français', boss: 'Lord Villen-Hüüs',
    help: '<b>P1</b> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move · <kbd>Space</kbd> jump · <kbd>F</kbd> attack · <kbd>G</kbd> special · <kbd>Q</kbd> switch · <b>double-tap forward</b> charge · <b>double-tap back</b> dodge', help2: '<b>P2</b> <kbd>←</kbd><kbd>↑</kbd><kbd>→</kbd><kbd>↓</kbd> · <kbd>Right Shift</kbd> jump · <kbd>K</kbd> attack · <kbd>L</kbd> special · <kbd>P</kbd> switch', help3: 'Gamepads: press any button (first = P1, second = P2) · ✕ jump · □ attack · ○ special · Select switch · <kbd>Esc</kbd> pause · <kbd>N</kbd> next screen (testing)' }
};
/*WARRIORS*/

// ---- canvas: low-res game buffer scaled up crisp, HUD text at screen resolution
const cv = document.getElementById('c'), out = cv.getContext('2d');
const buf = document.createElement('canvas'); buf.width = VW; buf.height = VH; const g = buf.getContext('2d');
function resize() { const r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1; cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); }
addEventListener('resize', resize);

// ---- sounds
let AC = null; const ac = () => (AC = AC || new (window.AudioContext || window.webkitAudioContext)());
function beep(f, d = .08, type = 'square', v = .05, slide = 0) { try { const a = ac(), o = a.createOscillator(), gn = a.createGain(); o.type = type; o.frequency.value = f; if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), a.currentTime + d); gn.gain.value = v; gn.gain.exponentialRampToValueAtTime(.0001, a.currentTime + d); o.connect(gn).connect(a.destination); o.start(); o.stop(a.currentTime + d); } catch (e) {} }
function noise(d = .2, v = .08) { try { const a = ac(), n = a.sampleRate * d, b = a.createBuffer(1, n, a.sampleRate), ch = b.getChannelData(0); for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = a.createBufferSource(), gn = a.createGain(); s.buffer = b; gn.gain.value = v; s.connect(gn).connect(a.destination); s.start(); } catch (e) {} }
function rumble(i, s = .5, ms = 120) { try { const pad = typeof padOf === 'function' ? padOf(i) : null; pad && pad.vibrationActuator && pad.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: s, weakMagnitude: s * .7 }); } catch (e) {} }

// ---- world state
let scrIdx = 0, scr = null, camX = 0, lockCam = null, players = [], enemies = [], fx = [], banners = [], pops = [], time = 0, paused = false, fade = 0, fadeTo = null, wipeT = 0, goT = 0, runT = 0;
let zoneState = 'idle', waveIdx = 0, waveDelay = 0;
const sy = (z, y) => FLOOR + z - y;
function ground(x, z) { for (const h of scr.holes) if (x > h.x0 + 5 && x < h.x1 - 5) return -999; let gnd = 0; for (const b of scr.boxes) if (x > b.x && x < b.x + b.w && z > b.z && z < b.z + b.d) gnd = Math.max(gnd, b.h); return gnd; }
function blocked(x, z, y) { for (const b of scr.boxes) if (x > b.x - 3 && x < b.x + b.w + 3 && z > b.z - 2 && z < b.z + b.d + 2 && y < b.h - 3) return true; return false; }

function hpMax(w) { return 4 + w.st[0] * 2; }
function makePlayer(i, w) { return { i, w, x: 70 + i * 40, z: 50 + i * 30, y: 0, vy: 0, vx: 0, face: 1, hp: hpMax(w), meter: 50, atk: 0, combo: 0, comboT: 0, hitDone: false, walk: 0, inv: 0, safe: [70, 50], fall: 0, sp: 0, state: '', ko: 0, rev: 0, ff: 0, ffTaken: 0, dash: 0, dodge: 0, frozen: 0, rage: 0, tapDir: 0, tapT: -9, tapFace: 1, prevX: 0, dashHit: null }; }
function pick2() { const a = WARRIORS.slice().sort(() => Math.random() - .5); return [a[0], a[1]]; }
function banner(text, who, big, col) { banners.push({ text, who, t: big ? 1.6 : 1.2, big, col }); }
function pop(x, z, y, text, col) { pops.push({ x, z, y, text, col, t: 1 }); }

function loadScreen(i, keepPlayers) {
  scrIdx = i; scr = SCREENS[i]; BGP = []; if (!scr.L) { scr.build(); buildFloor(scr); } else { scr.build(); }
  camX = 0; lockCam = null; enemies = []; fx = []; WORLD.zoneIdx = 0; WORLD.zoneWave = 0; WORLD.boss = null; zoneState = 'idle'; waveIdx = 0;
  for (const p of players) { p.x = 70 + p.i * 40; p.z = 50 + p.i * 30; p.y = 0; p.vy = 0; p.vx = 0; p.fall = 0; p.ko = 0; p.sp = 0; p.state = ''; p.inv = 1; if (!keepPlayers) p.hp = hpMax(p.w); p.safe = [p.x, p.z]; }
  banner(`${T[LANG].screen} ${i + 1}/${SCREENS.length} · ${scr.name[LANG]}`, -1, true, '#ffe6a8');
}
function newGame(ws) { const [a, b] = ws || pick2(); players = [makePlayer(0, a), makePlayer(1, b)]; WORLD.levelDone = false; runT = 0; loadScreen(0); }
function cycle(p) { const i = WARRIORS.indexOf(p.w); let n = (i + 1) % WARRIORS.length; if (WARRIORS[n] === players[1 - p.i].w) n = (n + 1) % WARRIORS.length; p.w = WARRIORS[n]; p.hp = hpMax(p.w); p.meter = 100; beep(660, .06); banner(p.w.name, p.i); }

// ---- input
const keys = new Set(), pressed = new Set();
addEventListener('keydown', e => { if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); if (!keys.has(e.code)) pressed.add(e.code); keys.add(e.code); });
addEventListener('keyup', e => keys.delete(e.code));
const KB = [{ l: 'KeyA', r: 'KeyD', u: 'KeyW', d: 'KeyS', j: 'Space', a: 'KeyF', s: 'KeyG', c: 'KeyQ' }, { l: 'ArrowLeft', r: 'ArrowRight', u: 'ArrowUp', d: 'ArrowDown', j: 'ShiftRight', a: 'KeyK', s: 'KeyL', c: 'KeyP' }];
// ---- gamepads: the first controller to press a button plays P1, the second P2.
// Slots are sticky: unplugging one controller never moves the other to a new player.
const SLOTS = [null, null], padPrev = [{}, {}];
const allPads = () => (navigator.getGamepads ? [...navigator.getGamepads()] : []).filter(Boolean);
function padName(pad) { const id = pad.id.toLowerCase(); if (/054c|dualsense|dualshock|playstation|wireless controller/.test(id)) return 'PlayStation'; if (/045e|xbox|xinput/.test(id)) return 'Xbox'; if (/057e|switch|pro controller|joy-con/.test(id)) return 'Switch'; if (/8bitdo/.test(id)) return '8BitDo'; return LANG === 'fr' ? 'manette' : 'controller'; }
function assignPads() {
  const pads = allPads();
  for (let i = 0; i < 2; i++) if (SLOTS[i] !== null && !pads.some(p => p.index === SLOTS[i])) { SLOTS[i] = null; banner(LANG === 'fr' ? `Manette J${i + 1} débranchée` : `P${i + 1} controller unplugged`, i); }
  for (const pad of pads) { if (SLOTS.includes(pad.index)) continue; const active = pad.buttons.some(b => b.pressed); const free = SLOTS.indexOf(null); if (free < 0 || !active) continue;
    SLOTS[free] = pad.index; padPrev[free] = Object.fromEntries(pad.buttons.map((x, n) => [n, x.pressed])); banner(LANG === 'fr' ? `J${free + 1} : ${padName(pad)} connectée` : `P${free + 1}: ${padName(pad)} connected`, free); rumble(free, .4, 150); beep(880, .08, 'triangle', .04); }
}
addEventListener('gamepadconnected', () => { /* picked up on its first button press */ });
addEventListener('gamepaddisconnected', () => assignPads());
const padOf = i => SLOTS[i] === null ? null : allPads().find(p => p.index === SLOTS[i]) || null;
// button layout: standard mapping, with a fallback for PlayStation pads that report a raw layout
function layout(pad) { const raw = pad.mapping !== 'standard', sony = /054c|dualsense|dualshock|playstation|wireless controller/i.test(pad.id);
  return raw && sony ? { jump: 1, attack: 0, special: 2, select: 8, start: 9 } : { jump: 0, attack: 2, special: 1, select: 8, start: 9 }; }
function readInput(i) {
  const k = KB[i]; const inp = { tap: pressed.has(k.r) ? 1 : pressed.has(k.l) ? -1 : 0, x: (keys.has(k.r) ? 1 : 0) - (keys.has(k.l) ? 1 : 0), z: (keys.has(k.d) ? 1 : 0) - (keys.has(k.u) ? 1 : 0), j: pressed.has(k.j), a: pressed.has(k.a), s: pressed.has(k.s), c: pressed.has(k.c), start: false };
  const pad = padOf(i);
  if (pad) { const L = layout(pad), b = n => !!(pad.buttons[n] && pad.buttons[n].pressed), was = padPrev[i], edge = n => b(n) && !was[n];
    const dead = v => Math.abs(v) > .3 ? v : 0; let ax = dead(pad.axes[0] || 0), az = dead(pad.axes[1] || 0);
    let dx = (b(15) ? 1 : 0) - (b(14) ? 1 : 0), dz = (b(13) ? 1 : 0) - (b(12) ? 1 : 0);
    if (pad.mapping !== 'standard' && pad.axes.length > 9) { const h = pad.axes[9]; // D-pad reported as a "hat" axis: -1 up … 1 up-left, ~1.29 when released
      if (h >= -1.01 && h <= 1.01) { const d = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]][Math.round((h + 1) / 2 * 7)]; dx = dx || d[0]; dz = dz || d[1]; } }
    inp.x = inp.x || ax || dx; inp.z = inp.z || az || dz;
    inp.j = inp.j || edge(L.jump); inp.a = inp.a || edge(L.attack); inp.s = inp.s || edge(L.special); inp.c = inp.c || edge(L.select); inp.start = edge(L.start);
    padPrev[i] = Object.fromEntries(pad.buttons.map((x, n) => [n, x.pressed])); }
  return inp;
}

// =====================================================================
// COMBAT — friendly fire is ON: every attack and special hits your partner
// =====================================================================
function hitPlayer(t, dmg, dir, src) {
  if (t.dodge > 0) { if (!t.dodged) { t.dodged = true; pop(t.x, t.z, t.y + 70, T[LANG].dodge, '#7dffc0'); beep(990, .08, 'triangle', .05, 300); t.meter = Math.min(100, t.meter + 10); } return false; }
  if (t.ko > 0 || t.inv > 0 || t.fall > 0) return false; const friendly = src && src.w && src !== t;
  t.hp -= dmg; t.inv = .5; t.vx = dir * 150; rumble(t.i, friendly ? .8 : .5);
  if (friendly) { src.ff++; t.ffTaken++; pop(t.x, t.z, t.y + 70, T[LANG].ff, '#ffd23f'); beep(180, .12, 'square', .07, -80); } else beep(140, .12, 'sawtooth', .06, -60);
  if (t.hp <= 0) { t.hp = 0; t.ko = 8; t.rev = 0; t.state = ''; t.sp = 0; banner(T[LANG].ko + (friendly ? ' (' + T[LANG].ff.replace(/ ?!$/, '') + ')' : ''), t.i, false, friendly ? '#ffd23f' : null); noise(.25, .08); }
  return true;
}
function hitEnemy(e, dmg, dir, src, kb = 1) {
  if (e.dead || e.inv > 0) return false; e.hp -= dmg; e.flash = .14; WORLD.shake = Math.max(WORLD.shake, 2);
  // a soldier winding up an attack keeps going through ordinary hits: only a well-timed charge stops it
  if (e.state === 'wind' || e.state === 'strike' || e.type === 'boss' && e.dashT > 0) e.vx = dir * 40 * kb; else { e.vx = dir * 150 * kb; e.stun = e.type === 'brute' || e.type === 'boss' ? .12 : .28; e.state = 'hurt'; }
  if (src && src.meter !== undefined) src.meter = Math.min(100, src.meter + 5);
  if (e.type === 'boss' && e.hp < e.max * .4 && e.state !== 'escape') { e.state = 'escape'; e.inv = 99; banner(T[LANG].flee, -1, true, '#ff8a6a'); beep(110, .8, 'sawtooth', .07, 200); return true; }
  if (e.hp <= 0) { e.dead = 1.2; e.vy = 180; e.y = Math.max(1, e.y); e.vx = dir * 200; noise(.15, .06); if (src) rumble(src.i, .3, 80); } else beep(220 + Math.random() * 60, .05, 'square', .05, -80);
  return true;
}
// everyone a player's hit can reach: enemies and the partner
function victims(p, test) { const out = []; for (const e of enemies) if (!e.dead && test(e)) out.push([e, false]); const q = players[1 - p.i]; if (q.ko <= 0 && test(q)) out.push([q, true]); return out; }
function applyHit(p, list, dmg, kbFn) { for (const [o, isP] of list) { const dir = Math.sign(o.x - p.x) || p.face; if (isP) hitPlayer(o, dmg, dir, p); else hitEnemy(o, dmg, dir, p); if (kbFn) kbFn(o, isP); } }
const reachOf = p => (14 + p.w.st[3] * 5) * SPR, dmgOf = p => 1 + Math.floor(p.w.st[2] / 2);
function strike(p) {
  const R = reachOf(p), third = p.combo >= 3, D = dmgOf(p) + (third ? 1 : 0);
  const list = victims(p, o => Math.abs(o.z - p.z) < 14 && Math.abs(o.y - p.y) < 40 && (o.x - p.x) * p.face > -4 && Math.abs(o.x - p.x) < R);
  applyHit(p, list, D, third ? (o) => { o.vy = 170; o.y = Math.max(1, o.y); o.vx = p.face * 230; } : null);
  if (third) p.combo = 0;
}
const near = (p, r, dz = 60) => o => Math.abs(o.x - p.x) < r && Math.abs(o.z - p.z) < dz;
function special(p) {
  if (p.meter < 100) { beep(110, .05); return; } p.meter = 0; banner(p.w.sp, p.i, true); const f = p.face;
  switch (p.w.fx) {
    case 'broadside': for (let k = 0; k < 3; k++) fx.push({ k: 'ball', x: p.x + f * 12, z: p.z - 12 + k * 12, y: 22, vx: f * 380, t: 1.8, from: p, delay: k * .12, hit: new Set() }); fx.push({ k: 'smoke', x: p.x + f * 16, z: p.z, y: 22, t: .9, f }); noise(.4, .1); WORLD.shake = 6; break;
    case 'ampdive': p.vy = 300; p.state = 'dive'; p.sp = 2; break;
    case 'lavaroll': p.state = 'roll'; p.sp = .75; p.inv = .85; break;
    case 'stomp': p.state = 'roll'; p.sp = .55; p.inv = .65; p.after = 'shock'; break;
    case 'thunder': { const list = victims(p, near(p, 300, 120)).slice(0, 6); for (const [o, isP] of list) { fx.push({ k: 'bolt', x: o.x, z: o.z, t: .35 }); if (!isP) o.frozen = 1.4; } applyHit(p, list, 3); fx.push({ k: 'ring', x: p.x, z: p.z, max: 110, t: .5, col: '#9fd8ff' }); noise(.3, .1); WORLD.shake = 5; break; }
    case 'spores': { fx.push({ k: 'cloud', x: p.x + f * 50, z: p.z, t: 4.5, r: 90, from: p }); const q = players[1 - p.i]; if (q.ko <= 0 && near(p, 170, 70)(q)) q.hp = Math.min(hpMax(q.w), q.hp + 2); for (const e of enemies) if (!e.dead && near(p, 140, 70)(e)) e.frozen = 3; beep(440, .3, 'sine', .05, 200); break; }
    case 'magnet': for (const [o] of victims(p, near(p, 320, 120))) o.pull = { x: p.x + f * 26, z: p.z, t: .7 }; p.sp = .8; p.after = 'slam'; fx.push({ k: 'field', x: p.x, z: p.z, t: .8 }); beep(90, .6, 'sawtooth', .05, 300); break;
    case 'patch': { const q = players[1 - p.i]; fx.push({ k: 'kit', x: p.x, z: p.z, y: 24, t: .7, T: .7, to: q }); beep(660, .1, 'triangle'); break; }
    case 'flip': { p.fire = !p.fire; const list = victims(p, o => (o.x - p.x) * f > 0 && Math.abs(o.x - p.x) < 170 && Math.abs(o.z - p.z) < 30); for (const [o, isP] of list) { if (p.fire) { if (isP) hitPlayer(o, 2, f, p); else { o.burn = 3; hitEnemy(o, 2, f, p); } } else { o.frozen = 3; if (isP) { o.inv = 0; hitPlayer(o, 1, f, p); } } } fx.push({ k: 'stream', x: p.x, z: p.z, f, t: .5, fire: p.fire }); noise(.3, .07); break; }
    case 'honk': applyHit(p, victims(p, near(p, 200, 80)), 2, (o, isP) => { if (!isP) o.flee = 3; o.vx = Math.sign(o.x - p.x) * 260; }); fx.push({ k: 'ring', x: p.x + f * 10, z: p.z, max: 190, t: .6, col: '#fff4d8' }); beep(330, .35, 'sawtooth', .09, -120); WORLD.shake = 5; break;
    case 'rocket': p.state = 'fly'; p.sp = 2.2; p.inv = 2.4; p.vy = 0; p.shots = 0; beep(200, .5, 'sawtooth', .04, 400); break;
    case 'rage': p.inv = 3; p.rage = 3; applyHit(p, victims(p, near(p, 190, 70)), 2, o => { o.vx = Math.sign(o.x - p.x) * 360; }); fx.push({ k: 'ring', x: p.x, z: p.z, max: 200, t: .5, col: '#ff4a2a' }); noise(.5, .1); WORLD.shake = 8; break;
  }
}

// =====================================================================
// ENEMIES — Villen-Hüüs's troops: troopers (melee), gunners (ranged),
// brutes (heavy), and the Lord himself on the last screen
// =====================================================================
const ETYPES = { trooper: { hp: 9, spd: 46, reach: 22, dmg: 1, wind: .38, cd: 1.1 }, gunner: { hp: 7, spd: 40, reach: 0, dmg: 1, wind: .55, cd: 2.2 }, brute: { hp: 26, spd: 26, reach: 32, dmg: 2, wind: .6, cd: 1.6 }, boss: { hp: 90, spd: 54, reach: 34, dmg: 2, wind: .45, cd: 1.0 } };
function spawn(type, from, k) {
  const T0 = ETYPES[type]; let x, z = 10 + Math.random() * (DEPTH - 20), y = 0, state = 'walk';
  if (from === 'R') x = camX + VW + 24 + k * 30; else if (from === 'L') x = camX - 24 - k * 30;
  else if (from === 'drop') { const pts = scr.dropPoints ? scr.dropPoints() : [camX + VW / 2]; x = pts[k % pts.length] + (Math.random() - .5) * 60; y = 220; state = 'drop'; }
  else { x = camX + VW * .7; y = 260; state = 'arrive'; }
  const e = { type, x, z, y, vy: 0, vx: 0, hp: T0.hp, max: T0.hp, face: -1, walk: Math.random() * 6, state, t: 0, cd: 1 + Math.random(), flash: 0, frozen: 0, burn: 0, flee: 0, stun: 0, dead: 0, inv: 0, phase: 0 };
  if (type === 'boss') { WORLD.boss = e; e.inv = 3; } enemies.push(e);
}
function targetOf(e) { const alive = players.filter(p => p.ko <= 0 && p.fall <= 0); if (!alive.length) return null; return alive.reduce((a, p) => Math.hypot(p.x - e.x, (p.z - e.z) * 2) < Math.hypot(a.x - e.x, (a.z - e.z) * 2) ? p : a); }
function updateEnemy(e, dt) {
  e.flash = Math.max(0, e.flash - dt); e.t += dt; e.inv = Math.max(0, e.inv - dt); const T0 = ETYPES[e.type];
  if (e.dead) { e.dead -= dt; e.vy -= GRAV * dt; e.y = Math.max(0, e.y + e.vy * dt); e.x += e.vx * dt; e.vx *= Math.pow(.05, dt); return; }
  if (e.state === 'drop') { e.vy -= GRAV * .5 * dt; e.y += e.vy * dt; if (e.y <= 0) { e.y = 0; e.vy = 0; e.state = 'walk'; WORLD.shake = Math.max(WORLD.shake, 2); } return; }
  if (e.state === 'arrive') { e.y = Math.max(0, e.y - 80 * dt); if (e.y <= 0) { e.state = 'walk'; banner(T[LANG].boss, -1, true, '#ff8a6a'); } return; }
  if (e.state === 'escape') { e.y += 70 * dt; if (e.y > 300) { e.dead = .01; WORLD.boss = null; } return; }
  if (e.burn > 0) { e.burn -= dt; if (Math.random() < dt * 2) hitEnemy(e, 1, 0, null); }
  if (e.pull) { e.x += (e.pull.x - e.x) * dt * 6; e.z += (e.pull.z - e.z) * dt * 6; e.pull.t -= dt; if (e.pull.t <= 0) e.pull = null; }
  if (e.y > 0 || e.vy > 0) { e.vy -= GRAV * dt; e.y = Math.max(0, e.y + e.vy * dt); if (e.y === 0) e.vy = 0; }
  e.x += e.vx * dt; e.vx *= Math.pow(.03, dt); e.z = Math.max(0, Math.min(DEPTH, e.z));
  if (e.frozen > 0) { e.frozen -= dt; return; }
  if (e.stun > 0) { e.stun -= dt; if (e.stun <= 0 && e.state === 'hurt') e.state = 'walk'; return; }
  const p = targetOf(e); if (!p) return; e.cd -= dt;
  if (e.flee > 0) { e.flee -= dt; const d = Math.sign(e.x - p.x) || 1; e.x += d * 70 * dt; e.face = d; e.walk += dt * 14; return; }
  if (e.state === 'wind') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'strike'; e.t2 = .18;
      if (e.type === 'gunner' || e.type === 'boss' && e.shoot) { for (let k = 0; k < (e.type === 'boss' ? 3 : 1); k++) fx.push({ k: 'laser', x: e.x + e.face * 14, z: e.z + (k - (e.type === 'boss' ? 1 : 0)) * 10, y: 26 * SPR, vx: e.face * 230, t: 3, dmg: 1 }); beep(700, .1, 'square', .04, -500); e.shoot = false; }
      else if (e.type === 'boss' && e.dash) { e.vx = e.face * 520; e.dashT = .45; e.dash = false; }
      else { for (const q of players) if (q.ko <= 0 && Math.abs(q.z - e.z) < 14 && (q.x - e.x) * e.face > -6 && Math.abs(q.x - e.x) < T0.reach * SPR && Math.abs(q.y - e.y) < 40) hitPlayer(q, T0.dmg, e.face, e); }
      e.cd = T0.cd * (.8 + Math.random() * .5); } return; }
  if (e.state === 'strike') { e.t2 -= dt; if (e.dashT > 0) { e.dashT -= dt; for (const q of players) if (q.ko <= 0 && Math.abs(q.z - e.z) < 16 && Math.abs(q.x - e.x) < 26) hitPlayer(q, 2, e.face, e); } if (e.t2 <= 0 && !(e.dashT > 0)) e.state = 'walk'; return; }
  // walking toward a fighting position
  const dx = p.x - e.x, dz = p.z - e.z; e.face = Math.sign(dx) || e.face;
  let tx, spd = T0.spd;
  if (e.type === 'gunner') tx = p.x - Math.sign(dx || 1) * 150; else tx = p.x - Math.sign(dx || 1) * (T0.reach * SPR * .7);
  const mx = Math.abs(tx - e.x) > 4 ? Math.sign(tx - e.x) : 0, mz = Math.abs(dz) > 4 ? Math.sign(dz) : 0;
  const nx = e.x + mx * spd * dt, nz = e.z + mz * spd * .6 * dt; if (!blocked(nx, e.z, e.y)) e.x = nx; if (!blocked(e.x, nz, e.y)) e.z = nz;
  for (const h of scr.holes) if (e.x > h.x0 - 10 && e.x < h.x1 + 10) e.x = e.x < (h.x0 + h.x1) / 2 ? h.x0 - 10 : h.x1 + 10;
  if (mx || mz) e.walk += dt * 9;
  for (const o of enemies) if (o !== e && !o.dead && Math.abs(o.x - e.x) < 14 && Math.abs(o.z - e.z) < 8) { e.x += Math.sign(e.x - o.x || 1) * 20 * dt; e.z += Math.sign(e.z - o.z || 1) * 10 * dt; }
  const inRange = e.type === 'gunner' ? Math.abs(dz) < 6 && Math.abs(dx) < 260 : Math.abs(dz) < 10 && Math.abs(dx) < T0.reach * SPR + 4;
  if (e.type === 'boss' && e.cd <= 0) { const r = Math.random(); if (r < .3 && Math.abs(dz) < 10) { e.dash = true; e.state = 'wind'; e.t2 = .5; return; } if (r < .55) { e.shoot = true; e.state = 'wind'; e.t2 = .45; return; } }
  if (inRange && e.cd <= 0) { e.state = 'wind'; e.t2 = T0.wind; }
}

// =====================================================================
// UPDATE
// =====================================================================
function updateZones(dt) {
  const zones = scr.zones, Z = zones[WORLD.zoneIdx];
  if (zoneState === 'idle' && Z && camX >= Z.cam - 2) { zoneState = 'fight'; lockCam = Z.cam; waveIdx = 0; waveDelay = Z.delay || .3; WORLD.zoneWave = 0; scr.onZone && scr.onZone(WORLD.zoneIdx); }
  if (zoneState === 'fight') { const alive = enemies.filter(e => !e.dead).length;
    if (waveDelay > 0) { waveDelay -= dt; if (waveDelay <= 0) { const wave = Z.waves[waveIdx]; wave.forEach(([type, from], k) => spawn(type, from, k)); WORLD.zoneWave = waveIdx; scr.onWave && scr.onWave(WORLD.zoneIdx, waveIdx); } return; }
    if (alive === 0) { waveIdx++; if (waveIdx < Z.waves.length) waveDelay = 1; else { zoneState = 'idle'; lockCam = null; WORLD.zoneIdx++; WORLD.zoneWave = 0; goT = 3; if (Z.boss) { WORLD.levelDone = true; banner(T[LANG].done, -1, true, '#ffe6a8'); } } } }
}
function update(dt) {
  time += dt;
  if (pressed.has('Escape')) paused = !paused; if (pressed.has('KeyR') && WORLD.levelDone) newGame();
  assignPads(); const inputs = [readInput(0), readInput(1)]; if (inputs.some(x => x.start)) paused = !paused;
  if (paused) { pressed.clear(); return; }
  if (pressed.has('KeyN')) { enemies = []; WORLD.zoneIdx = scr.zones.length; zoneState = 'idle'; lockCam = null; if (scrIdx < SCREENS.length - 1) { fadeTo = scrIdx + 1; } }
  if (!WORLD.levelDone) runT += dt;
  WORLD.flash = Math.max(0, WORLD.flash - dt * 1.5); goT = Math.max(0, goT - dt);
  scr.update(dt, time, camX); updBGP(dt);
  if (fadeTo !== null) { fade += dt * 2.2; if (fade >= 1) { loadScreen(fadeTo, true); fadeTo = null; } pressed.clear(); return; } else fade = Math.max(0, fade - dt * 2);
  // both down: restart the screen
  if (players.every(p => p.ko > 0 || p.fall > 0)) { wipeT += dt; if (wipeT > .2 && wipeT - dt <= .2) banner(T[LANG].wipe, -1, true, '#ff8a6a'); if (wipeT > 2.5) { wipeT = 0; loadScreen(scrIdx); } } else wipeT = 0;
  for (const p of players) {
    const inp = inputs[p.i]; if (inp.c) cycle(p);
    p.inv = Math.max(0, p.inv - dt); p.rage = Math.max(0, (p.rage || 0) - dt); p.comboT = Math.max(0, p.comboT - dt); if (p.comboT <= 0) p.combo = 0;
    if (p.ko > 0) { p.ko -= dt; const q = players[1 - p.i]; if (q.ko <= 0 && Math.abs(q.x - p.x) < 30 && Math.abs(q.z - p.z) < 18) p.rev += dt; else p.rev = Math.max(0, p.rev - dt * .5);
      if (p.rev > 1.5 || p.ko <= 0) { p.ko = 0; p.rev = 0; p.hp = Math.ceil(hpMax(p.w) / 2); p.inv = 2; banner(T[LANG].up, p.i); beep(660, .2, 'triangle', .05, 300); } continue; }
    p.meter = Math.min(100, p.meter + dt * 7);
    if (p.fall > 0) { p.fall -= dt; p.y -= 60 * dt; if (p.fall <= 0) { p.x = p.safe[0]; p.z = p.safe[1]; p.y = 0; p.vy = 0; p.hp = Math.max(0, p.hp - 2); p.inv = 1.5; if (p.hp <= 0) { p.ko = 8; banner(T[LANG].ko, p.i); } } continue; }
    const airborne = p.y > Math.max(0, ground(p.x, p.z)) + 1; const spd = Math.max(airborne ? 125 : 0, (50 + p.w.st[1] * 15) * (p.rage > 0 ? 1.3 : 1));
    if (p.pull) { p.x += (p.pull.x - p.x) * dt * 6; p.z += (p.pull.z - p.z) * dt * 6; p.pull.t -= dt; if (p.pull.t <= 0) p.pull = null; }
    if (p.frozen > 0) { p.frozen -= dt; }
    if (p.sp > 0) { p.sp -= dt;
      if (p.state === 'roll') { const nx = p.x + p.face * 320 * dt; if (!blocked(nx, p.z, p.y)) p.x = nx; applyHit(p, victims(p, o => !o.rollHit && Math.abs(o.x - p.x) < 24 && Math.abs(o.z - p.z) < 18), 2, o => { o.vy = 170; o.y = Math.max(1, o.y); o.rollHit = .3; });
        if (p.w.fx === 'lavaroll' && Math.random() < .7) fx.push({ k: 'lava', x: p.x - p.face * 10, z: p.z, t: 3, from: p });
        if (p.sp <= 0 && p.after === 'shock') { p.after = null; fx.push({ k: 'ring', x: p.x, z: p.z, max: 130, t: .5, col: '#e8f4ff' }); applyHit(p, victims(p, near(p, 130, 60)), 2, o => { o.vy = 220; o.y = Math.max(1, o.y); }); WORLD.shake = 7; noise(.3, .1); } }
      if (p.state === 'fly') { p.y += (70 - p.y) * dt * 4; if (p.shots < 3 && p.sp < 1.8 - p.shots * .4) { p.shots++; fx.push({ k: 'zap', x: p.x + p.face * 10, z: p.z, y: p.y + 24, vx: p.face * 270, vy: -160, t: 1, from: p }); beep(880, .08, 'square', .04, -400); } }
      if (p.sp <= 0) { if (p.after === 'slam') { p.after = null; fx.push({ k: 'ring', x: p.x + p.face * 26, z: p.z, max: 100, t: .4, col: '#9fd0ff' }); applyHit(p, victims(p, near(p, 80, 46)), 4, o => { o.vy = 240; o.y = Math.max(1, o.y); }); WORLD.shake = 9; noise(.35, .12); } p.state = ''; }
    }
    for (const o of [...enemies, ...players]) if (o.rollHit) o.rollHit = Math.max(0, o.rollHit - dt / 2);
    // double-tap: forward = charge, back = dodge (you keep facing the enemy)
    const sx = Math.abs(inp.x) > .5 ? Math.sign(inp.x) : 0, edgeX = inp.tap || (sx && !p.prevX ? sx : 0);
    if (edgeX && p.frozen <= 0 && p.state !== 'roll' && p.state !== 'fly') {
      const dx0 = edgeX; if (dx0 === p.tapDir && time - p.tapT < .28) { if (dx0 === p.tapFace) { p.dash = .24; p.face = dx0; p.dashHit = new Set(); beep(260, .1, 'sawtooth', .05, 300); } else { p.dodge = .28; p.dodged = false; p.face = p.tapFace; beep(700, .06, 'triangle', .04, -200); } p.tapDir = 0; }
      else { p.tapDir = dx0; p.tapT = time; p.tapFace = p.face; } }
    p.prevX = sx;
    if (p.dodge > 0) { p.dodge -= dt; const nx2 = p.x - p.face * 300 * dt; if (!blocked(nx2, p.z, p.y)) p.x = nx2; p.x = Math.max(camX + 12, Math.min(camX + VW - 12, p.x)); }
    if (p.dash > 0) { p.dash -= dt; const nx2 = p.x + p.face * 430 * dt; if (!blocked(nx2, p.z, p.y)) p.x = nx2; p.x = Math.max(camX + 12, Math.min(camX + VW - 12, p.x));
      for (const [o, isP] of victims(p, o => !p.dashHit.has(o) && Math.abs(o.x - p.x) < 22 && Math.abs(o.z - p.z) < 16 && Math.abs(o.y - p.y) < 40)) { p.dashHit.add(o);
        if (isP) { hitPlayer(o, 1, p.face, p); o.vx = p.face * 260; continue; }
        const melee = o.state === 'wind' && o.type !== 'gunner' && !(o.type === 'boss' && o.shoot);
        if (melee) { o.state = 'hurt'; o.stun = .7; o.dash = false; o.cd = Math.max(o.cd, 1); pop(o.x, o.z, 70, T[LANG].counter, '#ffd23f'); p.meter = Math.min(100, p.meter + 15); WORLD.shake = 4; beep(520, .1, 'square', .06, 400); }
        hitEnemy(o, 1, p.face, p, o.type === 'boss' ? 0 : 1.5); if (o.type === 'boss') o.vx = 0; } }
    let mx = p.frozen > 0 || p.dash > 0 || p.dodge > 0 ? 0 : inp.x, mz = p.frozen > 0 || p.dash > 0 || p.dodge > 0 ? 0 : inp.z; if (p.state === 'roll') mx = 0;
    if (Math.abs(mx) > .1) p.face = Math.sign(mx);
    const nx = p.x + mx * spd * dt + p.vx * dt, nz = p.z + mz * spd * .62 * dt; p.vx *= Math.pow(.02, dt);
    if (!blocked(nx, p.z, p.y)) p.x = nx; if (!blocked(p.x, nz, p.y)) p.z = nz;
    p.z = Math.max(0, Math.min(DEPTH, p.z)); p.x = Math.max(camX + 12, Math.min(camX + VW - 12, Math.max(12, Math.min(scr.W - 12, p.x))));
    p.walk += (Math.abs(mx) + Math.abs(mz) > .1 ? dt * 12 : 0);
    const gnd = ground(p.x, p.z);
    if (inp.j && p.y <= Math.max(0, gnd) + .5 && p.state !== 'fly' && p.frozen <= 0) { p.vy = 270; beep(520, .07, 'square', .04, 200); }
    if (p.state !== 'fly') { p.vy -= GRAV * dt; p.y += p.vy * dt; }
    if (gnd > -900 && p.y <= gnd) {
      if (p.state === 'dive' && p.vy < 0) { p.state = ''; fx.push({ k: 'amp', x: p.x, z: p.z, t: 5 }); fx.push({ k: 'ring', x: p.x, z: p.z, max: 240, t: .7, col: '#ffd0a0' }); applyHit(p, victims(p, o => Math.abs(o.x - p.x) < 240 && o.y < 6), 3, o => { o.vy = 180; o.y = Math.max(1, o.y); }); WORLD.shake = 12; noise(.5, .14); }
      p.y = gnd; p.vy = 0; if (gnd === 0) p.safe = [p.x, p.z]; }
    if (gnd <= -900 && p.y <= 0 && p.state !== 'fly') { p.fall = .7; pop(p.x, p.z, 20, T[LANG].fell, '#9fd8ff'); noise(.4, .08); }
    if (p.atk > 0) { p.atk -= dt; if (!p.hitDone && p.atk < .17) { p.hitDone = true; strike(p); } }
    if (inp.a && p.atk <= 0 && p.state !== 'roll' && p.frozen <= 0) { p.atk = .25; p.hitDone = false; p.combo = p.comboT > 0 ? p.combo + 1 : 1; p.comboT = .55; beep(300 + p.combo * 60, .04, 'square', .03); }
    if (inp.s && p.sp <= 0 && p.frozen <= 0) special(p);
  }
  for (const e of enemies) updateEnemy(e, dt); enemies = enemies.filter(e => !(e.dead && e.dead <= 0));
  // effects
  for (const f of fx) { f.t -= dt;
    if (f.k === 'ball') { if (f.delay > 0) { f.delay -= dt; f.t += dt; continue; } f.x += f.vx * dt; applyHit(f.from, victims(f.from, o => !f.hit.has(o) && Math.abs(o.x - f.x) < 14 && Math.abs(o.z - f.z) < 16 && o.y < 50).map(v => (f.hit.add(v[0]), v)), 3); }
    if (f.k === 'zap') { f.x += f.vx * dt; f.y += f.vy * dt; if (f.y <= 0) { f.t = 0; fx.push({ k: 'ring', x: f.x, z: f.z, max: 50, t: .3, col: '#8affc8' }); applyHit(f.from, victims(f.from, near(f, 34, 34)), 3); } }
    if (f.k === 'lava' && Math.random() < dt * 3) applyHit(f.from, victims(f.from, o => Math.abs(o.x - f.x) < 9 && Math.abs(o.z - f.z) < 9 && o.y < 4), 1);
    if (f.k === 'kit') { const u = 1 - f.t / f.T; f.x += (f.to.x - f.x) * Math.min(1, dt * 8); f.z += (f.to.z - f.z) * Math.min(1, dt * 8); f.y = 24 + Math.sin(u * Math.PI) * 60; if (f.t <= 0) { if (f.to.ko > 0) { f.to.rev = 9; } else f.to.hp = Math.min(hpMax(f.to.w), f.to.hp + 2); fx.push({ k: 'plus', x: f.to.x, z: f.to.z, t: 1 }); beep(880, .15, 'triangle', .05, 300); } }
    if (f.k === 'laser') { f.x += f.vx * dt; for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < 10 && Math.abs(q.z - f.z) < 10 && q.y < 50) { if (hitPlayer(q, f.dmg, Math.sign(f.vx), null)) f.t = 0; } if (blocked(f.x, f.z, 10)) f.t = 0; }
    if (f.k === 'ring') { f.T = f.T || f.t + dt; f.r = Math.max(0, f.max * (1 - Math.max(0, f.t) / f.T)); }
  }
  fx = fx.filter(f => f.t > 0); banners = banners.filter(b => (b.t -= dt) > 0); pops = pops.filter(p => (p.t -= dt) > 0);
  updateZones(dt);
  // camera follows both fighters, held at the wave lock until the zone is cleared
  const alive = players.filter(p => p.ko <= 0); const mid = alive.length ? alive.reduce((a, p) => a + p.x, 0) / alive.length : camX + VW / 2;
  let tc = Math.max(0, Math.min(scr.W - VW, mid - VW / 2)); if (lockCam !== null) tc = Math.min(tc, lockCam); const Z = scr.zones[WORLD.zoneIdx]; if (zoneState === 'idle' && Z) tc = Math.min(tc, Z.cam);
  camX += (tc - camX) * Math.min(1, dt * 5); if (zoneState === 'idle' && Z && Math.abs(camX - Z.cam) < 2 && tc >= Z.cam) camX = Z.cam;
  // leaving the screen on the right once every zone is clear
  if (WORLD.zoneIdx >= scr.zones.length && !WORLD.levelDone && fadeTo === null && players.some(p => p.ko <= 0 && p.x > scr.W - 26)) { fadeTo = scrIdx + 1 < SCREENS.length ? scrIdx + 1 : null; }
  WORLD.shake = Math.max(0, WORLD.shake - dt * 20); pressed.clear();
}

// =====================================================================
// RENDER
// =====================================================================
function render() {
  g.save(); const sh = WORLD.shake; if (sh > 0) g.translate(Math.round((Math.random() - .5) * sh), Math.round((Math.random() - .5) * sh));
  scr.drawBack(g, camX, time);
  g.drawImage(scr.floorC, Math.round(-camX), FLOOR);
  for (const h of scr.holes) { const x0 = Math.round(h.x0 - camX), x1 = Math.round(h.x1 - camX); if (x1 < 0 || x0 > VW) continue; g.fillStyle = '#1e3a48'; g.fillRect(x0, FLOOR, x1 - x0, VH - FLOOR); g.fillStyle = '#2e5868'; for (let k = 0; k < 16; k++) g.fillRect(x0 + 4 + (k * 17 + Math.floor(time * 10)) % (x1 - x0 - 8), FLOOR + 6 + k * 9, 8, 1); g.fillStyle = 'rgba(255,230,190,.25)'; for (let k = 0; k < 6; k++) g.fillRect(x0 + 6 + (k * 23 + Math.floor(time * 6)) % (x1 - x0 - 12), FLOOR + 10 + k * 20, 4, 1); g.fillStyle = scr.floor === 'sand' ? '#8a7a68' : '#3a2414'; g.fillRect(x0 - 3, FLOOR, 3, VH - FLOOR); g.fillRect(x1, FLOOR, 3, VH - FLOOR); }
  // wet sand mirrors the sky (the giant planet shows in the flats)
  if (scr.floor === 'sand' && scr.L && scr.L.sky) { g.save(); g.beginPath(); g.rect(0, FLOOR, VW, VH - FLOOR); g.clip(); g.globalAlpha = .28; g.translate(0, FLOOR * 2 - 18); g.scale(1, -1); g.drawImage(scr.L.sky.c, Math.round(-camX * scr.L.sky.f), 0); g.restore(); g.globalAlpha = 1; }
  // floor sheen on wet sand
  if (scr.floor === 'sand') { for (let i = 0; i < 30; i++) { const x = ((i * 97 - camX) % VW + VW) % VW, z = (i * 37) % DEPTH; if ((Math.floor(time * 3) + i) % 4) { g.fillStyle = 'rgba(255,236,200,.35)'; g.fillRect(Math.round(x), FLOOR + z, 6 + i % 5, 1); } } }
  const items = [];
  for (const b of scr.boxes) items.push({ key: b.z + b.d, draw: () => drawBox(b) });
  const keyOf = o => { let k = o.z; for (const b of scr.boxes) if (o.x > b.x && o.x < b.x + b.w && o.z > b.z && o.z < b.z + b.d && o.y >= b.h - 1) k = Math.max(k, b.z + b.d + .01); return k; };
  for (const e of enemies) items.push({ key: keyOf(e), draw: () => drawEnemy(e) });
  for (const p of players) items.push({ key: keyOf(p) + (p.fall > 0 ? -60 : 0), draw: () => drawWarrior(p) });
  for (const f of fx) items.push({ key: f.z + .5, draw: () => drawFx(f) });
  items.sort((a, b) => a.key - b.key).forEach(i => i.draw());
  scr.drawFront(g, camX, time);
  if (WORLD.flash > 0) { g.fillStyle = `rgba(255,240,210,${Math.min(.8, WORLD.flash * 1.6)})`; g.fillRect(-10, -10, VW + 20, VH + 20); }
  g.restore();
  out.imageSmoothingEnabled = false; out.fillStyle = '#000'; out.fillRect(0, 0, cv.width, cv.height);
  const sc = Math.min(cv.width / VW, cv.height / VH), w = VW * sc, h = VH * sc, ox = (cv.width - w) / 2, oy = (cv.height - h) / 2;
  out.drawImage(buf, ox, oy, w, h); hud(ox, oy, sc);
  if (fade > 0) { out.fillStyle = `rgba(0,0,0,${Math.min(1, fade)})`; out.fillRect(ox, oy, w, h); }
}
function drawBox(b) { const x = Math.round(b.x - camX), top = sy(b.z, b.h), front = sy(b.z + b.d, b.h); if (x > VW + 20 || x + b.w < -20) return;
  if (b.pier) { g.fillStyle = '#8a6438'; g.fillRect(x, top, b.w, b.d); for (let k = 0; k < b.d; k += 6) { g.fillStyle = 'rgba(40,24,10,.5)'; g.fillRect(x, top + k, b.w, 1); } g.fillStyle = '#4a2e18'; g.fillRect(x, front, b.w, b.h); for (let k = 0; k < b.w; k += 22) { g.fillStyle = '#3a2210'; g.fillRect(x + k, front, 4, b.h); } g.fillStyle = 'rgba(255,220,160,.35)'; g.fillRect(x, top, b.w, 1); return; }
  if (b.rock) { g.fillStyle = '#5a5248'; g.beginPath(); g.ellipse(x + b.w / 2, front + 2, b.w / 2 + 2, b.d / 2 + b.h / 2, 0, Math.PI, 0); g.fill(); g.fillStyle = '#7a7064'; g.fillRect(x + 6, top + 2, b.w - 14, 3); g.fillStyle = '#3a6a4a'; for (let k = 0; k < 6; k++) g.fillRect(x + 4 + k * 6, front - 2 - (k % 3), 3, 2); return; }
  if (b.fountain) { g.fillStyle = '#8a8478'; g.fillRect(x, top, b.w, b.d); g.fillStyle = '#4a6a7a'; g.fillRect(x + 4, top + 3, b.w - 8, b.d - 6); g.fillStyle = 'rgba(200,230,255,.6)'; for (let k = 0; k < 6; k++) g.fillRect(x + 8 + (k * 7 + Math.floor(time * 8)) % (b.w - 16), top + 6 + (k % 3) * 8, 3, 1); g.fillStyle = '#6a6458'; g.fillRect(x, front, b.w, b.h); g.fillStyle = '#9a9488'; g.fillRect(x + b.w / 2 - 3, top - 18, 6, 22); g.fillStyle = 'rgba(200,230,255,.7)'; g.fillRect(x + b.w / 2 - 1, top - 26 + (Math.floor(time * 10) % 3), 2, 8); return; }
  if (b.stall) { g.fillStyle = '#6a4426'; g.fillRect(x, front, b.w, b.h); g.fillStyle = '#8a5a30'; g.fillRect(x, top, b.w, b.d); for (let k = 0; k < 8; k++) { g.fillStyle = ['#a8b8c8', '#c8d0d8', '#e08a5a'][k % 3]; g.fillRect(x + 3 + k * 4, top + 4 + (k % 3) * 5, 3, 2); } g.fillStyle = '#4a2a18'; g.fillRect(x, top - 24, 2, 24); g.fillRect(x + b.w - 2, top - 24, 2, 24); for (let k = 0; k < b.w; k += 6) { g.fillStyle = '#2a5a8a'; g.fillRect(x + k, top - 30, 3, 6); g.fillStyle = '#efe6d2'; g.fillRect(x + k + 3, top - 30, 3, 6); } return; }
  g.fillStyle = '#b8864a'; g.fillRect(x, top, b.w, b.d); g.fillStyle = '#8a5a2a'; g.fillRect(x, front, b.w, b.h); g.fillStyle = '#5a3a1a'; g.fillRect(x, front, b.w, 2); g.fillRect(x, front + b.h - 2, b.w, 2); g.fillRect(x, front, 2, b.h); g.fillRect(x + b.w - 2, front, 2, b.h);
  g.strokeStyle = '#5a3a1a'; g.beginPath(); g.moveTo(x + 2, front + 2); g.lineTo(x + b.w - 2, front + b.h - 2); g.stroke(); g.fillStyle = 'rgba(255,230,180,.4)'; g.fillRect(x, top, b.w, 1); }
function shadow(x, z, y, w) { const gnd = Math.max(0, ground(x, z)); g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(Math.round(x - camX), Math.round(sy(z, gnd)), Math.max(1, w * Math.max(.4, 1 - (y - gnd) / 140)), 3, 0, 0, 7); g.fill(); }
function drawFx(f) {
  const x = f.x - camX, y = sy(f.z, f.y || 0);
  switch (f.k) {
    case 'ring': g.strokeStyle = f.col; g.globalAlpha = Math.max(0, Math.min(1, f.t / (f.T || .6))); g.lineWidth = 2; g.beginPath(); g.ellipse(x, sy(f.z, 0), Math.max(.1, f.r || 0), Math.max(.1, (f.r || 0) * .35), 0, 0, 7); g.stroke(); g.globalAlpha = 1; g.lineWidth = 1; break;
    case 'ball': if (f.delay > 0) break; g.fillStyle = '#1a1614'; g.fillRect(Math.round(x - 3), Math.round(y - 3), 7, 7); g.fillStyle = 'rgba(255,230,180,.6)'; g.fillRect(Math.round(x - f.vx / 30 - 10), Math.round(y - 1), 10, 2); break;
    case 'smoke': g.fillStyle = `rgba(230,220,200,${Math.max(0, f.t)})`; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + k * 7 * f.f, y - k * 3, 7 + k, 0, 7); g.fill(); } break;
    case 'bolt': g.strokeStyle = '#e8f4ff'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 0); for (let k = 1; k <= 7; k++) g.lineTo(x + (Math.random() - .5) * 16, sy(f.z, 40) * k / 7); g.stroke(); g.lineWidth = 1; g.fillStyle = 'rgba(200,230,255,.25)'; g.fillRect(0, 0, VW, VH); break;
    case 'cloud': for (let k = 0; k < 24; k++) { const a = k * 2.4 + time, r = (k * 7) % f.r; g.fillStyle = `rgba(220,240,140,${.4 * Math.min(1, f.t)})`; g.fillRect(Math.round(x + Math.cos(a) * r), Math.round(sy(f.z, 0) - 10 - ((k * 13 + time * 20) % 60)), 2, 2); } g.fillStyle = `rgba(160,255,190,${.08 * Math.min(1, f.t)})`; g.beginPath(); g.ellipse(x, sy(f.z, 0), f.r, f.r * .35, 0, 0, 7); g.fill(); break;
    case 'field': g.strokeStyle = 'rgba(140,200,255,.8)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x, y - 26, 20 + k * 34 + (time * 80) % 34, -1, 1); g.stroke(); g.beginPath(); g.arc(x, y - 26, 20 + k * 34 + (time * 80) % 34, 2.1, 4.2); g.stroke(); } break;
    case 'kit': g.fillStyle = '#efe6d2'; g.fillRect(Math.round(x - 4), Math.round(y - 3), 8, 7); g.fillStyle = '#3a8a4a'; g.fillRect(Math.round(x - 1), Math.round(y - 2), 2, 5); g.fillRect(Math.round(x - 3), Math.round(y), 6, 1); break;
    case 'plus': g.fillStyle = `rgba(140,255,170,${f.t})`; for (let k = 0; k < 3; k++) { const yy = y - 40 - (1 - f.t) * 20 - k * 8, xx = x - 8 + k * 8; g.fillRect(xx, yy - 3, 2, 7); g.fillRect(xx - 2, yy - 1, 6, 2); } break;
    case 'stream': g.fillStyle = f.fire ? 'rgba(255,140,50,.85)' : 'rgba(170,220,255,.85)'; for (let k = 0; k < 24; k++) g.fillRect(Math.round(x + f.f * (12 + k * 7)), Math.round(y - 30 + Math.sin(k + time * 30) * 3), 5, 3); break;
    case 'lava': g.fillStyle = `rgba(255,${100 + Math.random() * 80 | 0},30,${Math.min(1, f.t)})`; g.fillRect(Math.round(x - 5), Math.round(sy(f.z, 0) - 2), 10, 3); break;
    case 'amp': { const ax = Math.round(x - 13), ay = Math.round(sy(f.z, 0)); g.fillStyle = '#141010'; g.fillRect(ax, ay - 24, 26, 24); g.fillStyle = '#2a2020'; g.beginPath(); g.arc(ax + 13, ay - 12, 8, 0, 7); g.fill(); g.fillStyle = 'rgba(255,220,160,.4)'; g.fillRect(ax, ay - 24, 26, 1); break; }
    case 'zap': g.fillStyle = '#8affc8'; g.fillRect(Math.round(x - 2), Math.round(y - 1), 6, 2); break;
    case 'laser': g.fillStyle = '#ff5a3a'; g.fillRect(Math.round(x - 6), Math.round(y - 1), 12, 2); g.fillStyle = 'rgba(255,120,80,.4)'; g.fillRect(Math.round(x - 10), Math.round(y - 2), 20, 4); break;
  }
}
function heart(x, y, s, amt) { const P2 = [[1, 0], [2, 0], [4, 0], [5, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [2, 4], [3, 4], [4, 4], [3, 5]]; for (const [a, b] of P2) { out.fillStyle = a < 3.5 ? (amt >= 1 ? '#ff4f6a' : '#3a1a2a') : (amt >= 2 ? '#ff4f6a' : '#3a1a2a'); out.fillRect(x + a * s, y + b * s, s, s); } }
function txt(t, x, y, size, col, al = 'left', stroke = true) { out.font = `800 ${Math.round(size)}px system-ui,sans-serif`; out.textAlign = al; out.textBaseline = 'top'; if (stroke) { out.lineWidth = Math.max(2, size / 5); out.strokeStyle = '#0a0710'; out.strokeText(t, x, y); } out.fillStyle = col; out.fillText(t, x, y); }
function hud(ox, oy, sc) {
  const L = T[LANG], u = sc;
  for (const p of players) { const right = p.i === 1, bx = right ? ox + (VW - 10) * u : ox + 10 * u, by = oy + 8 * u, al = right ? 'right' : 'left', col = right ? '#8ad8ff' : '#ffb0d0';
    txt(`${right ? L.p2 : L.p1} · ${p.w.name}`, bx, by, 7 * u, col, al);
    const n = hpMax(p.w) / 2, hs = Math.max(1, u * 1.1); for (let k = 0; k < n; k++) heart(right ? bx - (k + 1) * 9 * hs : bx + k * 9 * hs, by + 10 * u, hs, Math.max(0, Math.min(2, p.hp - k * 2)));
    const mw = 70 * u, mx = right ? bx - mw : bx, my = by + 19 * u; out.fillStyle = '#1a1228'; out.fillRect(mx, my, mw, 4 * u); out.fillStyle = p.meter >= 100 ? (Math.floor(time * 6) % 2 ? '#ffd23f' : '#fff4b0') : '#b08c00'; out.fillRect(right ? mx + mw * (1 - p.meter / 100) : mx, my, mw * p.meter / 100, 4 * u);
    txt(p.meter >= 100 ? `${L.special} ${L.ready} · ${p.w.sp}` : `${L.special} · ${p.w.sp}`, bx, my + 5 * u, 5 * u, p.meter >= 100 ? '#ffd23f' : '#b8acd0', al);
    txt(`${L.ffc} : ${p.ff}`, bx, my + 12 * u, 5 * u, p.ff ? '#ffd23f' : '#8a7ea8', al);
    const pd = padOf(p.i); txt(pd ? '🎮 ' + padName(pd) : (LANG === 'fr' ? '⌨ clavier · appuie sur un bouton de manette' : '⌨ keyboard · press a controller button'), bx, my + 19 * u, 4.5 * u, pd ? '#7dffc0' : '#6a5e88', al); }
  // level and screen
  txt(`${L.level} · ${L.screen} ${scrIdx + 1}/${SCREENS.length} · ${scr.name[LANG]}`, ox + VW * u / 2, oy + 8 * u, 6 * u, 'rgba(255,240,220,.85)', 'center');
  for (let k = 0; k < SCREENS.length; k++) { out.fillStyle = k < scrIdx ? '#ffd23f' : k === scrIdx ? '#fff' : 'rgba(255,255,255,.25)'; out.fillRect(ox + (VW / 2 - 18 + k * 12) * u, oy + 17 * u, 8 * u, 2 * u); }
  const alive = enemies.filter(e => !e.dead && e.type !== 'boss').length; if (zoneState === 'fight') txt(`${alive + (WORLD.boss ? 1 : 0)} ${L.left}`, ox + VW * u / 2, oy + 22 * u, 5 * u, '#ff9a8a', 'center');
  // boss health
  const B = WORLD.boss; if (B && !B.dead) { const bw = 200 * u, bx = ox + (VW / 2 - 100) * u, byy = oy + (VH - 22) * u; txt(L.boss, ox + VW * u / 2, byy - 9 * u, 6 * u, '#ff8a6a', 'center'); out.fillStyle = '#2a1018'; out.fillRect(bx, byy, bw, 5 * u); out.fillStyle = '#e04a3a'; out.fillRect(bx, byy, bw * Math.max(0, B.hp) / B.max, 5 * u); out.fillStyle = 'rgba(255,255,255,.4)'; out.fillRect(bx + bw * .4, byy, 1 * u, 5 * u); }
  // GO arrow
  const Z = scr.zones[WORLD.zoneIdx]; const canGo = zoneState === 'idle' && !WORLD.levelDone && (Z ? camX >= Z.cam - 4 || true : true);
  if (canGo && (goT > 0 || WORLD.zoneIdx >= scr.zones.length) && Math.floor(time * 3) % 2) txt(`${L.go} →`, ox + (VW - 14) * u, oy + 120 * u, 16 * u, '#ffd23f', 'right');
  // KO and revive rings
  for (const p of players) if (p.ko > 0) { const x = ox + (p.x - camX) * u, y = oy + (sy(p.z, 0) - 50) * u; txt(T[LANG].up, x, y - 8 * u, 5 * u, '#fff', 'center'); out.strokeStyle = '#2a2a3a'; out.lineWidth = 3 * u; out.beginPath(); out.arc(x, y + 6 * u, 6 * u, 0, 7); out.stroke(); out.strokeStyle = '#7dffc0'; out.beginPath(); out.arc(x, y + 6 * u, 6 * u, -1.57, -1.57 + 6.28 * Math.max(p.rev / 1.5, 1 - p.ko / 8)); out.stroke(); }
  // popups (friendly fire!) and banners
  for (const q of pops) { const x = ox + (q.x - camX) * u, y = oy + (sy(q.z, q.y) - (1 - q.t) * 18) * u; out.globalAlpha = Math.min(1, q.t * 2); txt(q.text, x, y, 8 * u, q.col, 'center'); out.globalAlpha = 1; }
  banners.forEach((b, i) => { out.globalAlpha = Math.min(1, b.t * 3); const x = ox + (b.who === 0 ? VW * .28 : b.who === 1 ? VW * .72 : VW / 2) * u, y = oy + (b.who < 0 ? 70 : 92 + i * 6) * u; txt(b.text, x, y, (b.big ? (b.who < 0 ? 15 : 16) : 10) * u, b.col || (b.who === 0 ? '#ffb0d0' : b.who === 1 ? '#8ad8ff' : '#fff'), 'center'); out.globalAlpha = 1; });
  if (WORLD.levelDone) { const cx = ox + VW * u / 2, cy = oy + 120 * u; out.fillStyle = 'rgba(10,7,16,.55)'; out.fillRect(cx - 170 * u, cy - 10 * u, 340 * u, 104 * u); txt(L.done, cx, cy, 16 * u, '#ffe6a8', 'center');
    txt(`${L.time} ${Math.floor(runT / 60)}:${String(Math.floor(runT % 60)).padStart(2, '0')}`, cx, cy + 26 * u, 7 * u, '#fff', 'center');
    players.forEach((p, k) => txt(`${k ? L.p2 : L.p1} ${p.w.name} · ${L.ffc} : ${p.ff}`, cx, cy + (40 + k * 12) * u, 6 * u, k ? '#8ad8ff' : '#ffb0d0', 'center'));
    const worst = players[0].ff === players[1].ff ? null : players[0].ff > players[1].ff ? players[0] : players[1]; if (worst && worst.ff > 0) txt((LANG === 'fr' ? 'Pire coéquipier : ' : 'Worst teammate: ') + worst.w.name, cx, cy + 66 * u, 6 * u, '#ffd23f', 'center');
    txt(L.again, cx, cy + 82 * u, 6 * u, '#b8acd0', 'center'); }
  if (paused) { out.fillStyle = 'rgba(10,7,16,.6)'; out.fillRect(ox, oy, VW * u, VH * u); txt(L.paused, ox + VW * u / 2, oy + VH * u / 2 - 12 * u, 20 * u, '#fff', 'center'); }
}
function helpBar() { const L = T[LANG]; document.documentElement.lang = LANG;
  document.getElementById('help').innerHTML = `<span>${L.help}</span><span>${L.help2}</span><span>${L.help3}</span><span class="sp"></span><button id="b-reroll" type="button">${L.reroll}</button><button id="b-lang" type="button">${L.lang}</button>`;
  document.getElementById('b-reroll').onclick = () => { newGame(); }; document.getElementById('b-lang').onclick = () => { LANG = LANG === 'fr' ? 'en' : 'fr'; try { localStorage.setItem('bp-lang', LANG); } catch (e) {} helpBar(); }; }

newGame(); resize(); helpBar();
let last = performance.now();
function frame(now) { const dt = Math.min(.05, (now - last) / 1000); last = now; update(dt); render(); requestAnimationFrame(frame); }
requestAnimationFrame(frame);
