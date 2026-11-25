// =====================================================================
// DEBUG MODE — a secret code on the title screen, like the old Contra one:
//   ↑ ↑ ↓ ↓ ← → ← →  ✕ □ ✕ □      (keyboard: W W S S A D A D  Space F Space F, or the arrows with Right Shift and K)
// opens a menu to start any level at any screen, or straight at a boss (and the three parts of level 3½), with an
// optional invincibility. Pick a spot, then pick your two warriors as usual; the intro cutscenes are skipped.
// =====================================================================
const DEBUG = { buf: [], prev: [{}, {}], pick: null, god: false, col: 0, row: 0, flash: 0 };
const DBG_CODE = ['U', 'U', 'D', 'D', 'L', 'R', 'L', 'R', 'X', 'S', 'X', 'S'];
const DBG_BOSS = ['Lord Villen-Hüüs', 'Oscar GrosVerres', 'Calve-Hair', 'Madame Metal Face', 'Prêtre-o-Dame'];
// one token per fresh press: directions on their leading edge (stick, d-pad or keys), ✕ = jump, □ = attack
function dbgTokens(ins) {
  const out = [];
  ins.forEach((inp, i) => { const P = DEBUG.prev[i], u = inp.z < -.5, d = inp.z > .5, l = inp.x < -.5 || inp.tap < 0, r = inp.x > .5 || inp.tap > 0;
    if (u && !P.u) out.push('U'); if (d && !P.d) out.push('D'); if (l && !P.l) out.push('L'); if (r && !P.r) out.push('R'); if (inp.j) out.push('X'); if (inp.a) out.push('S');
    DEBUG.prev[i] = { u, d, l: inp.x < -.5, r: inp.x > .5 }; });
  return out;
}
// how much of the code the latest presses spell so far (the longest tail of the presses that starts the code)
function dbgProgress() { const b = DEBUG.buf; for (let n = Math.min(b.length, DBG_CODE.length); n > 0; n--) { let ok = true; for (let k = 0; k < n; k++) if (b[b.length - n + k] !== DBG_CODE[k]) { ok = false; break; } if (ok) return n; } return 0; }
// called from the title screen; returns true while the code is being typed past the arrows (so ✕ and □ don't start the game)
function dbgTitle(ins) {
  for (const t of dbgTokens(ins)) { DEBUG.buf.push(t); if (DEBUG.buf.length > 24) DEBUG.buf.shift(); const n = dbgProgress();
    if (n >= 9) beep(500 + n * 60, .05, 'square', .03);
    if (n === DBG_CODE.length) { DEBUG.buf = []; dbgOpen(); return true; } }
  return dbgProgress() >= 8;
}
function dbgOpen() { STATE = 'debug'; DEBUG.col = WSEL; DEBUG.row = 0; DEBUG.flash = 1; [523, 659, 784, 1047].forEach((f, k) => setTimeout(() => beep(f, .12, 'square', .05), k * 90)); }
function dbgItems(lv) { const L = LEVELS[lv], fr = LANG === 'fr';
  if (L.id === 'tour') return [{ lv, climb: true, label: fr ? 'La grimpette' : 'The climb' }, { lv, scr: 0, label: fr ? 'Les plateformes' : 'The platforms' }, { lv, scr: 0, boss: true, label: 'BOSS · ' + DBG_BOSS[3] }];
  const mini = L.id === 'zombimare' ? [{ lv, scr: 0, boss: true, zone: 2, label: 'MINI · ' + W4NAME.spider[fr ? 0 : 1] }, { lv, scr: 1, boss: true, zone: 1, label: 'MINI · ' + W4NAME.elephant[fr ? 0 : 1] }, { lv, scr: 1, boss: true, zone: 2, label: 'MINI · ' + W4NAME.giraffe[fr ? 0 : 1] }] : [];
  return [...L.screens.map((s, k) => ({ lv, scr: k, label: `${fr ? 'Écran' : 'Screen'} ${k + 1} · ${s.name[LANG]}` })), ...mini, { lv, scr: L.screens.length - 1, boss: true, label: 'BOSS · ' + DBG_BOSS[lv] }]; }
function debugFrame(dt) {
  const ins = menuInputs(), tk = dbgTokens(ins), D = DEBUG; D.flash = Math.max(0, D.flash - dt);
  for (const t of tk) {
    if (t === 'L' || t === 'R') { D.col = (D.col + (t === 'R' ? 1 : -1) + LEVELS.length) % LEVELS.length; D.row = Math.min(D.row, dbgItems(D.col).length - 1); beep(520, .04, 'square', .03); }
    if (t === 'U' || t === 'D') { const n = dbgItems(D.col).length; D.row = (D.row + (t === 'D' ? 1 : -1) + n) % n; beep(620, .04, 'square', .03); }
    if (t === 'X' || t === 'S') { D.pick = dbgItems(D.col)[D.row]; LEVEL = WSEL = D.col; STATE = 'select'; musicPlay(LEVELS[LEVEL].id); musicDuck(.7); SEL = { cur: [0, 1], lock: [false, false], solo: false }; beep(880, .1, 'triangle', .05, 200); pressed.clear(); return; } }
  if (ins.some(i => i.s || i.c)) { D.god = !D.god; beep(D.god ? 990 : 330, .1, 'triangle', .05); }
  if (pressed.has('Escape') || ins.some(i => i.start)) { STATE = 'title'; pressed.clear(); return; }
  menuFrame(LEVELS[D.col].style, () => {});
  out.textAlign = 'left'; out.textBaseline = 'alphabetic'; out.fillStyle = 'rgba(8,6,14,.82)'; out.fillRect(0, 0, 960, 540);
  bigText(LANG === 'fr' ? 'MODE DEBUG' : 'DEBUG MODE', 480, 62, 40, D.flash > 0 && Math.floor(time * 12) % 2 ? '#fff' : '#ffd23f');
  out.textAlign = 'left';   // bigText leaves it centred
  const short = ['HAVRE', 'DE SOIF', 'BOULDAIRE', LANG === 'fr' ? 'LA TOUR 3½' : 'THE TOWER 3½'];
  LEVELS.forEach((L, c) => { const cw = 924 / LEVELS.length, x = 18 + c * cw, on = c === D.col; out.fillStyle = on ? 'rgba(255,210,63,.14)' : 'rgba(255,255,255,.04)'; out.fillRect(x, 96, cw - 10, 360);
    out.font = '800 ' + (cw < 200 ? 14 : 17) + 'px system-ui,sans-serif'; out.fillStyle = on ? '#ffd23f' : '#a8a0b8'; out.fillText(short[c] || L.id.toUpperCase(), x + 12, 122);
    dbgItems(c).forEach((it, r) => { const y = 156 + r * 34, sel = on && r === D.row; if (sel) { out.fillStyle = '#ffd23f'; out.fillRect(x + 6, y - 20, cw - 22, 28); }
      out.font = (it.boss ? '800 ' : '600 ') + (cw < 200 ? 11 : 13) + 'px system-ui,sans-serif'; out.fillStyle = sel ? '#1a1020' : it.boss ? '#ff8a6a' : '#e8e0d0';
      let s = it.label; while (out.measureText(s).width > cw - 36 && s.length > 4) s = s.slice(0, -2) + '…'; out.fillText(s, x + 14, y); }); });
  out.font = '700 14px system-ui,sans-serif'; out.textAlign = 'center';
  out.fillStyle = D.god ? '#7aff9a' : '#a8a0b8'; out.fillText((LANG === 'fr' ? 'Invincible : ' : 'Invincible: ') + (D.god ? (LANG === 'fr' ? 'OUI' : 'ON') : (LANG === 'fr' ? 'NON' : 'OFF')) + (LANG === 'fr' ? '   (○ / G pour changer)' : '   (○ / G to toggle)'), 480, 482);
  out.fillStyle = '#e8e0d0'; out.fillText(LANG === 'fr' ? '← → monde · ↑ ↓ point de départ · ✕ / □ choisir · Start / Échap : retour' : '← → world · ↑ ↓ starting point · ✕ / □ choose · Start / Esc: back', 480, 510); out.textAlign = 'left';
  out.strokeStyle = OUT; out.lineWidth = 5; out.strokeRect(2.5, 2.5, 955, 535); out.setTransform(1, 0, 0, 1, 0, 0); pressed.clear();
}
// start where the debug menu said, once the two warriors are picked (stories are already built by beginStory)
function debugStart(a, b, pk) {
  LEVEL = pk.lv; INKFX = []; WORLD.noir = 0;
  if (pk.climb) { startClimb(); return; }
  startPlay(a, b); DLG.q = []; DLG.cur = null; DLG.blocking = false;
  if (pk.scr) loadScreen(pk.scr, true);
  if (pk.boss) {
    if (scr.sky) { for (const P of SKY.P) { P.done = true; if (P.k === 'cw') { P.fy = -999; P.fv = 0; } if (P.k === 'btn') P.t = 9; if (P.k === 'bill') P.ft = 1; } SKY.tilt = SKY.tiltTo = 0; applyTilt(); SKY.D.E.x = 1240; for (const k of ['C', 'F', 'I']) SKY.D[k].h = 0; if (!scr.boxes.some(o => o.board)) scr.boxes.push(skyDeck('BB', 2580, 300, 0, { board: 1 })); }
    const bi = pk.zone ?? scr.zones.findIndex(z => z.boss), Z = scr.zones[bi];
    if (Z) { WORLD.zoneIdx = bi; camX = Z.cam; players.forEach((p, k) => { p.x = Z.cam + 300 + k * 40; p.z = 50 + k * 30; p.y = Math.max(0, ground(p.x, p.z)); p.safe = [p.x, p.z]; });
      const wi = Math.max(0, Z.waves.findIndex(w => Array.isArray(w) && w.some(([t]) => ['boss', 'oscar', 'calve', 'mmf'].includes(t) || W4BIG[t])));   // skip the goons that open the boss zone
      zoneState = 'fight'; lockCam = Z.cam; waveIdx = wi; waveDelay = .8; WORLD.zoneWave = wi; scr.onZone && scr.onZone(bi); }
  }
  banner((LANG === 'fr' ? 'DEBUG · ' : 'DEBUG · ') + pk.label + (DEBUG.god ? ' · INVINCIBLE' : ''), -1, true, '#7aff9a');
}
