// =====================================================================
// LEVEL 3½, PART 1 — THE CLIMB. Up the mast of the Tour Calve-Hair's big crane after Madame Metal Face: six ladders
// side by side, the screen scrolls upward. Hop from ladder to ladder (twice quickly: a two-ladder leap), lunge up with
// jump, swat falling things with attack. Rivets, paint pots and clamps rain down; steel beams swing across the mast;
// welding torches spit sparks; hair-dryer goons on the ledges blow you sideways; and she kicks binders down at you.
// =====================================================================
const CLIMB = { P: [] };
const LANE_X = [210, 318, 426, 534, 642, 750], CL_H = 3000, CL_CK = [0, 700, 1400, 2100];
const CL_KIND = { rivet: { vh: -430, dmg: 1, r: 5 }, pot: { vh: -300, dmg: 1, r: 9 }, clamp: { vh: -260, dmg: 2, r: 10 }, binder: { vh: -330, dmg: 1, r: 9 }, stapler: { vh: -360, dmg: 1, r: 7 } };
const CLIMBP = ph => { const s = Math.sin(ph); return PZ({ sp: .1, nk: -.35, aF: [2.55 + s * .35, .45 - s * .3], aB: [2.55 - s * .35, .45 + s * .3], lF: [.75 + s * .45, -1.15 - s * .35], lB: [.75 - s * .45, -1.15 + s * .35] }); };
const clY = h => 500 - (h - CLIMB.camY);
function startClimb() {
  const [a, b] = PAIR; STATE = 'climb'; INKFX = []; WORLD.noir = 0; musicPlay('tour'); musicDuck(1); ambStart('tour');
  const C = CLIMB; C.t = 0; C.camY = 0; C.haz = []; C.spawnT = 2.2; C.ck = 0; C.done = 0; C.fade = 1; C.paused = false; C.out = 0; C.sfx = [];
  C.P = [a, b].map((id, i) => { const w = wById(id); return { i, w, id, lane: i ? 3 : 2, x: LANE_X[i ? 3 : 2], h: 10 + i * 14, hop: null, inv: 0, slide: 0, hp: hpMax(w), face: i ? -1 : 1, ph: i * 1.7, lcd: 0, lunge: 0, swat: 0, prevX: 0, fallT: 0, aiT: 0 }; });
  C.mmf = { lane: 3, h: 380, st: 'climb', t: 0, kick: 0, x: LANE_X[3] };
  C.beams = [{ h: 800, per: 3.4, ph: 0 }, { h: 1480, per: 3, ph: 1.2 }, { h: 2200, per: 2.7, ph: 2.1 }, { h: 2720, per: 2.4, ph: .4 }];
  C.welds = [{ lane: 1, h: 520 }, { lane: 4, h: 1000 }, { lane: 2, h: 1580 }, { lane: 5, h: 1740 }, { lane: 0, h: 2300 }, { lane: 3, h: 2460 }, { lane: 1, h: 2600 }, { lane: 4, h: 2860 }].map((w, k) => ({ ...w, ph: k * .9 }));
  C.gusts = [{ h: 1180, side: -1, t: 2, on: 0 }, { h: 1900, side: 1, t: 3, on: 0 }, { h: 2560, side: -1, t: 1, on: 0 }];
  C.lines = (STORY3 && STORY3.climb ? STORY3.climb : []).slice(); C.cur = null; C.lt = 0; C.hint = 7;
}
function climbMsgDraw() { const C = CLIMB; if (C.hint <= 0) return; const s = LANG === 'fr' ? '↑ grimpe  ·  ← → change d’échelle  ·  deux fois : grand bond  ·  saut : élan  ·  frappe : chasse les objets' : '↑ climb  ·  ← → switch ladders  ·  twice: big leap  ·  jump: lunge  ·  attack: swat things away';
  out.globalAlpha = Math.min(1, C.hint); out.font = 'bold 13px "Arial Narrow", sans-serif'; caption(out, 4, s, 480 - out.measureText(s).width / 2 - 10, 470); out.globalAlpha = 1; }
function climbFrame(dt) {
  const C = CLIMB, ins = menuInputs();
  if (pressed.has('Escape') || ins.some(i => i.start)) C.paused = !C.paused;
  if (pressed.has('KeyL')) toggleLang();
  if (!C.paused) climbTick(dt, ins);
  climbRender();
}
function climbHurt(c, dmg, why) {
  if (DEBUG.god) return false;
  if (c.inv > 0 || c.fallT > 0) return false;
  c.hp -= dmg; c.inv = 1.3; c.slide = .42; c.hop = null; c.x = LANE_X[c.lane];
  SFX.voice(c.id, c.hp <= 0 ? 'ko' : 'hurt', 300); SFX.impact(why === 'beam' ? 'heavy' : 'punch', Math.min(1, dmg / 2 + .3), 300); RUM.hit(c.i, dmg, false);
  climbInk(c.x, clY(c.h + 80), why === 'pot' ? (LANG === 'fr' ? 'SPLOTCH !' : 'SPLOT!') : why === 'spark' ? (LANG === 'fr' ? 'TSSSK !' : 'TSSSK!') : pickA(SFXW[LANG].hurt), dmg >= 2);
  if (why === 'pot') c.paint = 3;
  if (c.hp <= 0) { const o = CLIMB.P[1 - c.i]; c.fallT = 1; c.fallTo = Math.max(CLIMB.ck, o && o.fallT <= 0 ? o.h - 240 : 0); c.hp = hpMax(c.w); c.slide = 0; }
  return true;
}
function climbInk(x, y, text, strong) { INKFX.push({ k: 'sfx', text, x: x + (Math.random() - .5) * 20, y: y - 20, size: strong ? 30 : 20, t: 0, strong: !!strong, rot: (Math.random() - .5) * .4 }); }
function climbTick(dt, ins) {
  const C = CLIMB; C.t += dt; C.hint = Math.max(0, C.hint - dt); time += 0;
  if (CPU) ins[1] = climbAI(C.P[1], C.P[0], dt);
  for (const c of C.P) climberTick(c, ins[c.i], dt);
  // the camera follows both, and never lets anyone drop off the bottom
  const act = C.P.filter(c => c.fallT <= 0), hs = (act.length ? act : C.P).map(c => c.h), lo = Math.min(...hs);
  let tc = hs.reduce((a, b) => a + b, 0) / hs.length - 220; tc = Math.min(tc, lo - 30); tc = Math.max(0, Math.min(CL_H - 380, tc));
  for (const c of C.P) if (c.fallT > 0) tc = Math.min(tc, Math.max(0, c.h - 30));
  C.camY += (tc - C.camY) * Math.min(1, dt * 4);
  for (const c of C.P) { if (c.fallT <= 0) { const cap = C.camY + 410; if (c.h > cap) c.h = cap; } if (c.fallT <= 0) { const n = CL_CK.filter(k => k <= c.h).pop(); if (n > C.ck) { C.ck = n; climbBanner(LANG === 'fr' ? 'PALIER !' : 'LANDING!'); beep(880, .12, 'triangle', .05, 200); } } }
  // falling things
  C.spawnT -= dt; const prog = C.camY / CL_H;
  if (C.spawnT <= 0 && C.camY < CL_H - 420) { C.spawnT = 1.2 - prog * .55 + Math.random() * .4; const tgt = C.P[(Math.random() * 2) | 0]; const lane = Math.random() < .55 ? tgt.lane : (Math.random() * 6) | 0, r = Math.random(), k = r < .55 ? 'rivet' : r < .82 ? 'pot' : 'clamp';
    C.haz.push({ k, lane, x: LANE_X[lane], h: C.camY + 640, vh: CL_KIND[k].vh, vx: 0, warn: .8, rot: 0, dead: 0 }); }
  for (const o of C.haz) { if (o.warn > 0) { o.warn -= dt; continue; } o.h += o.vh * dt; o.x += o.vx * dt; o.rot += dt * (o.dead ? 14 : 6);
    if (o.dead) { o.vh -= 400 * dt; continue; }
    for (const c of C.P) if (c.fallT <= 0 && Math.abs(o.x - c.x) < 26 && o.h > c.h + 8 && o.h < c.h + 112) { if (climbHurt(c, CL_KIND[o.k].dmg, o.k)) { o.dead = 1; o.vx = (Math.random() - .5) * 260; o.vh = 120; } } }
  C.haz = C.haz.filter(o => o.h > C.camY - 160);
  // the swinging beams, the torches, the dryer goons
  for (const b of C.beams) { b.x = 480 + Math.sin(C.t * Math.PI * 2 / b.per + b.ph) * 300;
    for (const c of C.P) if (c.fallT <= 0 && c.h + 6 < b.h + 14 && c.h + 106 > b.h - 8 && Math.abs(c.x - b.x) < 118) climbHurt(c, 2, 'beam'); }
  for (const w of C.welds) { const u = (C.t + w.ph) % 2.8; w.glow = u > 1 && u < 1.4; w.on = u >= 1.4 && u < 2.6;
    if (w.on) for (const c of C.P) if (c.fallT <= 0 && Math.abs(c.x - LANE_X[w.lane]) < 30 && c.h + 6 < w.h + 40 && c.h + 106 > w.h - 46) climbHurt(c, 1, 'spark'); }
  for (const gu of C.gusts) { gu.t -= dt; if (gu.on > 0) { gu.on -= dt; for (const c of C.P) if (c.fallT <= 0 && !c.gusted && c.h + 6 < gu.h + 60 && c.h + 106 > gu.h - 70) { const dir = -gu.side, to = c.lane + dir; c.gusted = true; if (to >= 0 && to < 6 && !c.hop) { c.hop = { from: c.x, to, t: 0, T: .22, dir }; climbInk(c.x, clY(c.h + 90), 'PFFOUU !', false); } } }
    else if (gu.t <= 0) { gu.on = .65; gu.t = 3.2; for (const c of C.P) c.gusted = false; if (Math.abs(gu.h - C.camY - 250) < 400) { try { nz(SND.now(), .6, .06, 700, 300, 'bandpass', 1.2); } catch (e) {} } } }
  // Madame Metal Face, always ahead, kicking binders down
  const M = C.mmf; M.t += dt;
  if (M.st === 'climb') { M.h += 290 * dt; M.x += (LANE_X[M.lane] - M.x) * Math.min(1, dt * 6); if (M.h > C.camY + 720) { M.st = 'away'; M.t = 0; M.wait = 3.5 + Math.random() * 1.5; } }
  else if (M.st === 'away') { if (C.camY > CL_H - 760) { M.st = 'top'; M.h = CL_H + 40; M.t = 0; } else if (M.t > M.wait) { M.st = 'perch'; M.t = 0; M.kick = 0; const lead = C.P.reduce((a, c) => c.h > a.h ? c : a); M.lane = Math.max(0, Math.min(5, lead.lane + (Math.random() < .5 ? -1 : 1))); M.x = LANE_X[M.lane]; M.h = C.camY + 470; } }
  else if (M.st === 'perch') { M.h = Math.max(M.h, C.camY + 470);
    if ((M.kick === 0 && M.t > .8) || (M.kick === 1 && M.t > 1.7)) { M.kick++; M.kT = .3; const tg = C.P[(Math.random() * 2) | 0], tl = tg.lane; C.haz.push({ k: M.kick === 1 ? 'binder' : 'stapler', lane: tl, x: M.x, h: M.h + 40, vh: -330, vx: (LANE_X[tl] - M.x) / .9, warn: 0, rot: 0, dead: 0 }); SFX.swish('punch', .8, 300); }
    if (M.t > 2.6) { M.st = 'climb'; M.lane = (M.lane + 2) % 6; } }
  M.kT = Math.max(0, (M.kT || 0) - dt);
  // the lines
  if (!C.cur && C.lines.length && C.t > 1) { C.cur = C.lines.shift(); C.lt = 0; } if (C.cur) { C.lt += dt; if (C.lt > lineDur(C.cur) + .3) C.cur = null; }
  // the top
  if (!C.done && C.P.some(c => c.h >= CL_H - 30)) { C.done = .001; climbBanner(LANG === 'fr' ? 'EN HAUT !' : 'TOP!'); beep(660, .15, 'triangle', .05, 300); beep(990, .3, 'triangle', .05, 200); }
  if (C.done) { C.done += dt; for (const c of C.P) if (c.h < CL_H - 30) c.h += 260 * dt; if (C.done > 1.6) { C.out += dt * 1.6; if (C.out >= 1) { C.out = 1; STATE = 'play'; startPlay(PAIR[0], PAIR[1]); } } }
  C.fade = Math.max(0, C.fade - dt * 1.5);
  C.sfx = C.sfx.filter(b => (b.t -= dt) > 0);
}
function climbBanner(text) { CLIMB.sfx.push({ text, t: 1.6 }); }
function climberTick(c, inp, dt) {
  const C = CLIMB; c.inv = Math.max(0, c.inv - dt); c.lcd = Math.max(0, c.lcd - dt); c.swat = Math.max(0, c.swat - dt); c.paint = Math.max(0, (c.paint || 0) - dt);
  if (c.fallT > 0) { c.fallT -= dt; c.h = Math.max(c.fallTo, c.h - 900 * dt); if (c.h <= c.fallTo + .5) { c.fallT = 0; c.inv = 2; c.lane = c.lane; climbInk(c.x, clY(c.h + 60), LANG === 'fr' ? 'OUF !' : 'PHEW!', false); } return; }
  if (C.done) return;
  if (c.slide > 0) { c.slide -= dt; c.h = Math.max(0, c.h - 250 * dt); return; }
  const spd = (.88 + c.w.st[1] * .05) * (c.paint > 0 ? .7 : 1);
  if (c.lunge > 0) { c.lunge -= dt; c.h += 320 * dt; }
  if (!c.hop) { if (inp.z < -.3) { c.h += 150 * spd * dt; c.ph += dt * 9; } else if (inp.z > .3) { c.h = Math.max(0, c.h - 190 * dt); c.ph -= dt * 11; } }
  if (inp.j && c.lcd <= 0 && !c.hop) { c.lunge = .28; c.lcd = .9; SFX.jump(c.id, 300); }
  const sx = Math.abs(inp.x) > .5 ? Math.sign(inp.x) : 0, edge = inp.tap || (sx && !c.prevX ? sx : 0); c.prevX = sx;
  if (edge) { if (c.hop && !c.hop.dash && c.hop.dir === edge && c.hop.t < .16) { const to = c.hop.to + edge; if (to >= 0 && to < 6) { c.hop.to = to; c.hop.dash = true; c.hop.T = .27; c.inv = Math.max(c.inv, .32); SFX.dash(c.id, 300); } }
    else if (!c.hop) { const to = c.lane + edge; c.face = edge; if (to >= 0 && to < 6) c.hop = { from: c.x, to, t: 0, T: .17, dir: edge }; } }
  if (c.hop) { const H = c.hop; H.t += dt; const u = sstep(H.t / H.T); c.x = H.from + (LANE_X[H.to] - H.from) * u; if (H.t >= H.T) { c.lane = H.to; c.x = LANE_X[H.to]; c.hop = null; beep(700, .03, 'square', .02, 0); } }
  if (inp.a && c.swat <= 0) { c.swat = .26; SFX.swish(HKIND[c.id] || 'punch', .7, 300);
    for (const o of C.haz) if (!o.dead && o.warn <= 0 && Math.abs(o.x - c.x) < 46 && o.h > c.h + 40 && o.h < c.h + 175) { o.dead = 1; o.vx = (o.x < c.x ? -1 : 1) * (180 + Math.random() * 120); o.vh = 160; climbInk(o.x, clY(o.h), pickA(SFXW[LANG].weak), false); SFX.impact('punch', .6, 300); } }
  c.h = Math.max(0, Math.min(CL_H, c.h));
}
// the computer partner climbs too: it looks up, sees what's coming, and changes ladders
function climbAI(c, lead, dt) {
  const C = CLIMB, inp = { x: 0, z: -1, tap: 0, j: false, a: false, s: false, c: false, start: false }; c.aiT -= dt;
  if (c.h > lead.h + 140) inp.z = 0;
  const danger = lane => { const x = LANE_X[lane];
    for (const o of C.haz) if (!o.dead && Math.abs(o.x - x) < 40 && o.h > c.h && o.h < c.h + 380) return true;
    for (const w of C.welds) if ((w.on || w.glow) && w.lane === lane && w.h > c.h - 40 && w.h < c.h + 200) return true;
    for (const b of C.beams) if (b.h > c.h + 40 && b.h < c.h + 200 && Math.abs(b.x - x) < 170) return true;
    return false; };
  if (danger(c.lane)) { inp.z = 0; const opts = [c.lane - 1, c.lane + 1].filter(l => l >= 0 && l < 6 && !danger(l)); if (opts.length && c.aiT <= 0 && !c.hop) { inp.tap = Math.sign(opts[(Math.random() * opts.length) | 0] - c.lane); c.aiT = .35; }
    for (const o of C.haz) if (!o.dead && o.warn <= 0 && Math.abs(o.x - c.x) < 40 && o.h > c.h + 50 && o.h < c.h + 150 && Math.random() < .5) inp.a = true; }
  return inp;
}

// ---- drawing the climb ---------------------------------------------------------------------------------------------
function climbRender() {
  const C = CLIMB, t = time; INKW = STYLE_INK[1] || 1;
  bgX.setTransform(1, 0, 0, 1, 0, 0); bgX.clearRect(0, 0, RW, RH); fgX.setTransform(1, 0, 0, 1, 0, 0); fgX.clearRect(0, 0, RW, RH);
  bgX.setTransform(2, 0, 0, 2, 0, 0); fgX.setTransform(2, 0, 0, 2, 0, 0); const B = bgX, F = fgX, Y = clY;
  // the sky gets deeper as we go up; the city sinks away below
  const alt = C.camY / CL_H, gr = B.createLinearGradient(0, 0, 0, 540); gr.addColorStop(0, alt > .6 ? '#3a78c8' : '#4a8ed8'); gr.addColorStop(.6, '#a2d0f0'); gr.addColorStop(1, '#e8f0f2'); B.fillStyle = gr; B.fillRect(0, 0, 960, 540);
  { const hy = 420 + C.camY * .05; B.fillStyle = '#c4d0e0'; for (let x = 0; x < 960; x += 26) B.fillRect(x, hy - 20 - ((x * 7) % 30), 22, 200); B.fillStyle = 'rgba(232,240,246,.6)'; B.fillRect(0, hy - 60, 960, 300); }
  for (let k = 0; k < 9; k++) { const h = 260 + k * 330, y = 500 - (h - C.camY * .45), x = (k * 271 + t * 6) % 1100 - 70; if (y > -40 && y < 580) lcloud(B, x, y, 70 + (k % 3) * 30); }
  if (Y(0) < 640) { const gy = Y(0); B.fillStyle = '#f4c8d8'; B.fillRect(0, gy - 10, 960, 200); lr(B, 0, gy - 16, 960, 8, '#c8963a'); B.fillStyle = '#e8dcc8'; B.fillRect(0, gy + 30, 960, 200);
    for (let x = 20; x < 960; x += 160) { lr(B, x, gy - 60, 70, 46, '#c8963a'); lr(B, x + 4, gy - 56, 62, 38, '#d8ecf4'); } }   // the salon's roof and the boulevard, far below
  // the mast: two columns, the bracing, six ladders, the landings
  const ink = LCI, yel = '#e8b830';
  for (const cx of [150, 810]) { B.fillStyle = yel; B.fillRect(cx - 10, 0, 20, 540); B.strokeStyle = ink; B.lineWidth = 1.5; B.strokeRect(cx - 10, -2, 20, 544); }
  B.strokeStyle = 'rgba(120,96,30,.55)'; B.lineWidth = 3; const k0 = Math.floor((C.camY - 60) / 108), k1 = Math.ceil((C.camY + 600) / 108);
  for (let k = k0; k <= k1; k++) { const y = Y(k * 108), y2 = Y(k * 108 + 108); B.beginPath(); B.moveTo(160, y); B.lineTo(800, y); B.stroke(); B.beginPath(); if (k % 2) { B.moveTo(160, y); B.lineTo(800, y2); } else { B.moveTo(800, y); B.lineTo(160, y2); } B.stroke(); }
  for (const x of LANE_X) { B.fillStyle = '#c8ccd2'; B.fillRect(x - 15, 0, 4, 540); B.fillRect(x + 11, 0, 4, 540); B.fillStyle = '#9aa0a8'; for (let h = Math.floor((C.camY - 40) / 22) * 22; h < C.camY + 560; h += 22) B.fillRect(x - 13, Y(h) - 1.5, 26, 3); B.strokeStyle = ink; B.lineWidth = .8; B.strokeRect(x - 15, -2, 4, 544); B.strokeRect(x + 11, -2, 4, 544); }
  for (const h of [...CL_CK.slice(1), CL_H]) { const y = Y(h); if (y < -30 || y > 570) continue; lr(B, 140, y, 680, 10, '#aab4bc'); for (let x = 150; x < 810; x += 40) lr(B, x, y - 28, 3, 28, yel); lr(B, 140, y - 30, 680, 4, yel); if (h === CL_H) { B.fillStyle = '#8a2a4a'; B.font = 'bold 18px Georgia'; B.textAlign = 'center'; B.fillText(LANG === 'fr' ? 'SOMMET · LES GRUES' : 'SUMMIT · THE CRANES', 480, y - 40); B.textAlign = 'left'; } }
  // the torches, the dryer goons
  for (const w of C.welds) { const y = Y(w.h), x = LANE_X[w.lane], side = w.lane < 3 ? -1 : 1, bx = x + side * 40; if (y < -60 || y > 600) continue;
    lr(F, bx - 8, y - 8, 16, 16, '#6a6e78'); lr(F, bx - side * 14 - 3, y - 2, 14, 4, '#9aa0a8');
    if (w.glow) { F.fillStyle = 'rgba(255,200,80,.6)'; F.beginPath(); F.arc(bx - side * 18, y, 6 + Math.random() * 2, 0, 7); F.fill(); }
    if (w.on) { F.fillStyle = 'rgba(180,220,255,.85)'; F.beginPath(); F.moveTo(bx - side * 16, y - 2); F.lineTo(x - side * 30, y - 6); F.lineTo(x - side * 30, y + 6); F.lineTo(bx - side * 16, y + 2); F.fill();
      for (let k = 0; k < 14; k++) { F.fillStyle = Math.random() < .5 ? '#fff6c8' : '#ffb040'; F.fillRect(x + (Math.random() - .5) * 60, y + (Math.random() - .3) * 90, 2.5, 2.5); } } }
  for (const gu of C.gusts) { const y = Y(gu.h), x = gu.side < 0 ? 100 : 860, f = -gu.side; if (y < -80 || y > 620) continue;
    lr(F, x - 34, y + 6, 68, 8, '#aab4bc'); const L = stylistLook(77 + (gu.side > 0 ? 1 : 0), 'blower'); drawRig(F, x, y + 6, f, CS * .8, L, gu.t < .5 || gu.on > 0 ? POSES.aim(t) : POSES.idle(t, 3), t, {});
    if (gu.on > 0) { F.strokeStyle = 'rgba(255,255,255,.85)'; F.lineWidth = 2; for (let k = 0; k < 8; k++) { const yy = y - 90 + k * 18 + Math.sin(t * 20 + k) * 4, x0 = x + f * (30 + ((t * 600 + k * 70) % 500)); F.beginPath(); F.moveTo(x0, yy); F.lineTo(x0 + f * 60, yy); F.stroke(); } } }
  for (const b of C.beams) { const y = Y(b.h); if (y < -40 || y > 580) continue; F.strokeStyle = ink; F.lineWidth = 1.2; F.beginPath(); F.moveTo(b.x - 60, y - 6); F.lineTo(b.x, -20); F.lineTo(b.x + 60, y - 6); F.stroke();
    lr(F, b.x - 110, y - 6, 220, 16, '#c8402a'); F.fillStyle = '#8a2a1a'; F.fillRect(b.x - 110, y + 1, 220, 2); lr(F, b.x - 8, y - 16, 16, 10, yel); }
  // Madame Metal Face
  const M = C.mmf, my = Y(M.h); if (my > -40 && my < 600) { const pose = M.st === 'perch' ? (M.kT > 0 ? POSES.kick(.3) : POSES.check(t)) : M.st === 'top' ? POSES.check(t) : CLIMBP(t * 14); if (M.st === 'perch') lr(F, M.x - 40, my, 80, 6, '#aab4bc'); drawRig(F, M.x, my, M.st === 'perch' ? (M.x > 480 ? -1 : 1) : 1, CS * .85, MADAME, pose, t, { smile: M.st === 'perch' }); }
  // falling things
  for (const o of C.haz) { if (o.warn > 0) continue; const y = Y(o.h); if (y < -30 || y > 580) continue; F.save(); F.translate(o.x, y); F.rotate(o.rot);
    if (o.k === 'rivet') { lr(F, -3, -7, 6, 14, '#8a8e98'); lr(F, -6, -9, 12, 4, '#8a8e98'); }
    else if (o.k === 'pot') { lr(F, -9, -10, 18, 20, '#f4f0e8'); F.fillStyle = '#e84a8a'; F.fillRect(-8, -4, 16, 6); F.fillRect(-6, -10, 3, 8); }
    else if (o.k === 'clamp') { F.strokeStyle = ink; F.lineWidth = 5; F.beginPath(); F.arc(0, 0, 9, .4, 5.9); F.stroke(); F.strokeStyle = '#4a6ab8'; F.lineWidth = 3; F.stroke(); }
    else if (o.k === 'binder') { lr(F, -10, -12, 20, 24, '#2a2a3a'); F.fillStyle = '#f4f0e8'; F.fillRect(-7, -8, 14, 6); }
    else { lr(F, -9, -4, 18, 8, '#3a3a44'); lr(F, -9, -8, 16, 4, '#c8c8d0'); }
    F.restore(); }
  // the climbers
  for (const c of C.P) { const y = Y(c.h); let pose = c.fallT > 0 || c.slide > 0 ? POSES.flail(t) : c.hop ? POSES.jumpUp(t) : c.swat > 0 ? PZ({ sp: .1, nk: -.4, aF: [2.9, .1], aB: [2.2, .6], lF: [.7, -1.1], lB: [.6, -1.0] }) : CLIMBP(c.ph);
    const o = { walk: c.ph, speed: 0, alpha: c.inv > 0 && Math.floor(t * 18) % 2 ? .45 : 1 };
    drawHero(F, c.id, c.x, y, c.face, CS * .82, pose, t + c.i, o);
    if (c.paint > 0) { F.fillStyle = '#e84a8a'; for (let k = 0; k < 4; k++) F.fillRect(c.x - 10 + k * 6, y - 70 + ((t * 40 + k * 13) % 50), 3, 5); }
    if (c.hop && c.hop.dash) { F.fillStyle = 'rgba(255,240,200,.75)'; for (let k = 0; k < 5; k++) F.fillRect(c.x - c.hop.dir * (20 + k * 12), y - 30 - k * 14, 16, 2); } }
  if (GL) GL.draw(bgH, fgH, 1, t, 2, Math.max(.92, DIM), WORLD.noir || 0, 4000); else { const cc = cv.getContext('2d'); cc.drawImage(bgH, 0, 0); cc.drawImage(fgH, 0, 0); }
  // the overlay: warnings at the top edge, hearts, the height gauge, lines, banners
  out.setTransform(1, 0, 0, 1, 0, 0); out.clearRect(0, 0, RW, RH); out.setTransform(2, 0, 0, 2, 0, 0);
  for (const o of C.haz) if (o.warn > 0 && Math.floor(t * 8) % 2) { out.fillStyle = '#ff3a2a'; out.beginPath(); out.moveTo(o.x - 9, 16); out.lineTo(o.x + 9, 16); out.lineTo(o.x, 32); out.closePath(); out.fill(); out.strokeStyle = OUT; out.lineWidth = 2; out.stroke(); }
  drawInk();
  C.P.forEach(c => { const right = c.i === 1, n = hpMax(c.w) / 2, bx = right ? 940 : 20; out.font = '800 13px system-ui,sans-serif'; out.textAlign = right ? 'right' : 'left'; out.lineWidth = 3; out.strokeStyle = '#0a0710'; const nm = (right ? (CPU ? T[LANG].cpu || 'CPU' : T[LANG].p2) : T[LANG].p1) + ' · ' + c.w.name; out.strokeText(nm, bx, 22); out.fillStyle = right ? '#8ad8ff' : '#ffb0d0'; out.fillText(nm, bx, 22);
    for (let k = 0; k < n; k++) heart(right ? bx - (k + 1) * 15 : bx + k * 15, 30, 1.8, Math.max(0, Math.min(2, c.hp - k * 2))); });
  out.textAlign = 'left';
  { const gx = 916, gy0 = 470, gy1 = 90; out.fillStyle = 'rgba(10,7,16,.5)'; out.fillRect(gx - 4, gy1 - 6, 14, gy0 - gy1 + 12); for (const h of CL_CK) { const y = gy0 - (gy0 - gy1) * h / CL_H; out.fillStyle = '#e8b830'; out.fillRect(gx - 6, y, 18, 2); }
    const my2 = gy0 - (gy0 - gy1) * Math.min(1, M.h / CL_H); out.fillStyle = '#cfd2d8'; out.fillRect(gx - 2, my2 - 4, 10, 8);
    C.P.forEach(c => { const y = gy0 - (gy0 - gy1) * c.h / CL_H; out.fillStyle = c.i ? '#8ad8ff' : '#ffb0d0'; out.beginPath(); out.arc(gx + 3, y, 5, 0, 7); out.fill(); out.strokeStyle = OUT; out.lineWidth = 1.5; out.stroke(); }); }
  if (C.cur) { const l = C.cur, txt0 = l[LANG]; if (l.who === 'NAR') caption(out, 4, txt0, 14, 60); else { let ax, ay; if (l.who === 'A' || l.who === 'B') { const c = C.P[l.who === 'A' ? 0 : 1]; ax = c.x; ay = clY(c.h) - heroHeight(c.id, CS * .82) - 8; } else { ax = M.x; ay = Math.max(70, clY(M.h) - 130); } balloon(out, 4, txt0, ax, Math.max(60, ay), ax < 480 ? 1 : -1, /!!|[A-ZÉÈÀ]{6,}/.test(txt0), 230); } }
  C.sfx.forEach((b, i) => { out.globalAlpha = Math.min(1, b.t * 3); bigText(b.text, 480, 200 + i * 40, 40, '#ffd23f'); out.globalAlpha = 1; });
  climbMsgDraw();
  if (C.paused) { out.fillStyle = 'rgba(10,7,16,.6)'; out.fillRect(0, 0, 960, 540); bigText(T[LANG].paused, 480, 270, 48, '#fff'); }
  out.strokeStyle = OUT; out.lineWidth = 5; out.strokeRect(2.5, 2.5, 955, 535);
  const fd = Math.max(C.fade, C.out); if (fd > 0) { out.fillStyle = `rgba(0,0,0,${fd})`; out.fillRect(0, 0, 960, 540); }
  out.setTransform(1, 0, 0, 1, 0, 0);
}
