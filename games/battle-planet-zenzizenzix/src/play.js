// =====================================================================
// PLAY — the frame (backdrop → print layers → overlay), comic hits,
// dialogue in play, soldiers' reactions, and who gets to attack.
// =====================================================================
let STORY2 = null, INK_STRONG = false, INKFX = [], inkCD = 0, accCD = 0, SPECIAL_T = 0, SEEDN = 1, DIM = .75, STORY = null, LASTBOSS = null, barkCD = 0, shakeLatch = false;
const SFXW = { fr: { weak: ['PAF !', 'VLAN !', 'TCHAC !', 'BING !', 'POC !', 'BAM !', 'PIF !', 'TAC !'], strong: ['BADABOUM !', 'KRAKOUM !', 'SCHLAK !', 'VLAAAN !', 'BRAOUM !'], hurt: ['AÏE !', 'OUF !', 'OUILLE !'] },
  en: { weak: ['POW!', 'WHAM!', 'SMACK!', 'BONK!', 'THWACK!', 'BIFF!', 'ZOK!'], strong: ['KABOOM!', 'KRAKOOM!', 'KA-BLAM!', 'WHAAAM!', 'SKRAKK!'], hurt: ['OW!', 'OOF!', 'OUCH!'] } };
const pickA = a => a[(Math.random() * a.length) | 0];
function toInk(x, z, y) { return [(x - camX) * 1.5, sy(z, y) * 1.5]; }
function inkHit(x, z, y, strong, kind) {
  const [sx, sy2] = toInk(x, z, y), W = SFXW[LANG];
  if (strong && accCD <= 0) { accCD = .25; WORLD.noir = .85; INKFX.push({ k: 'acc', x: sx, y: sy2, t: 0 }, { k: 'sfx', text: pickA(W.strong), x: sx, y: sy2 - 50, size: 36, t: 0, strong: true, rot: (Math.random() - .5) * .3 }); }
  else if (inkCD <= 0) { inkCD = .12; INKFX.push({ k: 'sfx', text: pickA(kind === 'hurt' ? W.hurt : W.weak), x: sx + (Math.random() - .5) * 24, y: sy2 - 36, size: kind === 'hurt' ? 17 : 22, t: 0, rot: (Math.random() - .5) * .4 }); }
}
function inkAccent(x, z, y) { const [sx, sy2] = toInk(x, z, y); WORLD.noir = .85; accCD = .25; INKFX.push({ k: 'acc', x: sx, y: sy2, t: 0, big: 1.4 }); }
function drawInk() { for (const f of INKFX) f.t += FRAME_DT;
  { let ns = 0, nw = 0; for (let i = INKFX.length - 1; i >= 0; i--) { const f = INKFX[i]; if (f.k !== 'sfx') continue; if (f.strong ? ++ns > 1 : ++nw > 2) f.t = Math.max(f.t, .62); } }   // one big word and two small ones at a time: the newest win, older ones bow out
  INKFX = INKFX.filter(f => f.t < .75);
  for (const f of INKFX) if (f.k === 'acc' && f.t < .3) { speedLines(out, f.x, f.y, 1 - f.t / .3); impact(out, f.x, f.y, f.t, f.big || 1); }
  for (const f of INKFX) if (f.k === 'sfx') sfx(out, f.strong ? 2 : 4, f.text, f.x, f.y, f.size, f.t, f.rot || -.1); }
function dustAt(x, z) { fx.push({ k: 'ring', x, z, max: 26, t: .35, col: '#e8d8b8' }); }

// ---- dialogue in play ------------------------------------------------------
const DLG = { q: [], cur: null, t: 0, blocking: false, onDone: null };
function playLines(lines, blocking, onDone) { DLG.q = lines.slice(); DLG.blocking = blocking; DLG.onDone = onDone || null; nextLine(); }
function nextLine() { DLG.cur = DLG.q.shift() || null; DLG.t = 0; if (!DLG.cur) { DLG.blocking = false; const f = DLG.onDone; DLG.onDone = null; f && f(); } }
function skipDialog() { DLG.q = []; nextLine(); }
function updateDialog(dt, inputs) { if (!DLG.cur) return; DLG.t += dt; let adv = false;
  if (DLG.blocking) for (const i of inputs) { if ((i.a || i.j) && DLG.t > .35) adv = true; i.a = false; i.s = false; }
  if (DLG.t > lineDur(DLG.cur) + (DLG.blocking ? 0 : .4) || adv) nextLine(); }
function anchorOf(who) {
  if (who === 'A' || who === 'B') { const p = players[who === 'A' ? 0 : 1]; if (!p) return null; const [x, y] = toInk(p.x, p.z, p.y + heroHeight(p.w.id, RIG_S) + 2); return [x, y]; }
  if (who === 'OSC' || who === 'CAL') { const o = WORLD.oscar; if (!o) return [700, 160]; const [x, y] = toInk(o.x, o.z, o.y + (who === 'CAL' ? 140 : 116)); return [x, Math.max(70, y)]; }
  if (who === 'PRE') { const o = WORLD.pretre; if (!o) return [700, 160]; const [x, y] = toInk(o.x, o.z, o.y + 150); return [x, Math.max(70, y)]; }
  if (who === 'MMF') { const o = WORLD.mmf; if (!o || o.gone) return [700, 160]; const [x, y] = toInk(o.x, o.z, o.y + 92); return [x, Math.max(70, y)]; }
  if (who === 'VH') { const b = WORLD.boss || LASTBOSS; if (!b) return [700, 160]; const [x, y] = toInk(b.x, b.z, b.y + 104); return [x, Math.max(70, y)]; }
  return null;
}
const QUIPS = [];
// battle shouts: how often, how big, how see-through. Chatter (goons, the partner) is held back by gap and maxOn; bosses and
// set-piece lines always get through. gap: seconds between two chatter balloons; maxOn: chatter balloons on screen at once.
const QSTYLE = { gap: 0, maxOn: 9, scale: .7, alpha: .65, life: .75 };   // Nov 2026: smaller and see-through (option C of the mock-up)
let quipLast = -99;
const quipVIP = obj => !!(SETP.cur || (obj && (obj === WORLD.boss || ['boss', 'oscar', 'calve', 'mmf', 'pretre'].includes(obj.type))));
function quip(obj, text, dur = 2.4) { const old = QUIPS.findIndex(q => q.obj === obj), vip = quipVIP(obj);
  if (!vip && old < 0 && (time - quipLast < QSTYLE.gap || QUIPS.filter(q => !q.vip).length >= QSTYLE.maxOn)) return;
  if (old >= 0) QUIPS.splice(old, 1); if (!vip) quipLast = time; QUIPS.push({ obj, text, t: 0, dur: dur * (vip ? 1 : QSTYLE.life), vip }); }
function updateQuips(dt) { for (const q of QUIPS) q.t += dt; for (let i = QUIPS.length - 1; i >= 0; i--) if (QUIPS[i].t > QUIPS[i].dur || QUIPS[i].obj.dead && QUIPS[i].obj.dead < .2) QUIPS.splice(i, 1); barkCD -= dt; }
function drawDialogue() {
  for (const q of QUIPS) { const o = q.obj, isP = !!o.w, h = isP ? heroHeight(o.w.id, RIG_S) + 2 : (o.type === 'brute' ? 92 : 78); const [x, y] = toInk(o.x, o.z, o.y + h), sc = q.vip ? 1 : QSTYLE.scale; out.save(); out.translate(x, y); out.scale(sc, sc); out.translate(-x, -y); balloon(out, 4, q.text, x, y, x < 480 ? 1 : -1, /!!/.test(q.text), 140, Math.min(1, (q.dur - q.t) * 3) * (q.vip ? 1 : QSTYLE.alpha)); out.restore(); }
  const l = DLG.cur; if (!l) return;
  if (l.who === 'NAR') caption(out, 4, l[LANG], 14, 470); else { const a = anchorOf(l.who); if (a) balloon(out, 4, l[LANG], a[0], a[1], a[0] < 480 ? 1 : -1, /!!|[A-ZÉÈÀ]{6,}/.test(l[LANG]), 220); }
  if (DLG.blocking) { out.font = '600 12px Georgia, serif'; out.textAlign = 'right'; out.lineWidth = 3; out.strokeStyle = 'rgba(0,0,0,.7)'; out.fillStyle = '#fff'; const h = LANG === 'fr' ? 'Frapper ou sauter : suivant · Entrée / Start : passer' : 'Attack or jump: next · Enter / Start: skip'; out.strokeText(h, 948, 530); out.fillText(h, 948, 530); out.textAlign = 'left'; }
}

// ---- soldiers: who attacks, who waits, and how they react ----------------
function assignTokens() {
  const melee = enemies.filter(e => !e.dead && !isRanged(e) && e.type !== 'boss' && e.type !== 'calve' && e.type !== 'oscar' && e.type !== 'mmf' && e.state !== 'drop');
  for (const e of melee) { e.engaged = false; e.slot = 0; }
  for (const p of players) { if (p.ko > 0) continue; melee.filter(e => targetOf(e) === p).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x)).forEach((e, k) => { e.engaged = k < 2; e.slot = Math.max(0, k - 2); }); }
  if (WORLD.shake > 7 && !shakeLatch) { shakeLatch = true; for (const e of enemies) if (!e.dead && !e.engaged && e.type !== 'boss' && e.state === 'walk') react(e, Math.random() < .5 ? 'flinch' : 'lookUp', .45); } else if (WORLD.shake < 3) shakeLatch = false;
}
function react(e, k, t) { if (e.state === 'wind' || e.state === 'strike' || e.dead) return; e.react = { k, t }; }
function bark(e, kind) { if (barkCD > 0 || !e || e.dead) return; barkCD = 2.2; const b = pickA(BARKS[kind]); let txt = b[LANG === 'en' ? 1 : 0]; if (/, $/.test(txt)) txt += pickA(NAMES) + ' !'; if (LANG === 'en') txt = txt.replace(/ !$/, '!'); quip(e, txt, 1.8); }
function crowdReact(kind, about) { const idle = enemies.filter(e => !e.dead && !e.engaged && e.type !== 'boss' && e.state === 'walk'); for (const e of idle) react(e, kind === 'cheer' ? 'cheer' : 'laugh', 1.1 + Math.random() * .4); if (idle.length) bark(pickA(idle), kind); }
function onEnemyDown(e) {
  const near = enemies.filter(o => o !== e && !o.dead && o.type !== 'boss' && Math.abs(o.x - e.x) < 170);
  for (const o of near) { const p = personaOf(o.look), r = Math.random(); if (r < .55) react(o, p === 'show' ? 'laugh' : p === 'jumpy' ? 'cower' : p === 'lazy' ? 'flinch' : 'bang', p === 'jumpy' ? .9 : .6); }
  if (near.length && Math.random() < .4) bark(pickA(near), 'down');
}
const ffCD = [0, 0];
function onFriendlyFire(src, t) { if (time - ffCD[t.i] > 3.5) { ffCD[t.i] = time; const l = ffLine(t.w.id); quip(t, l[LANG]); } crowdReact('laugh'); }
function onBossArrive(e) { musicPlay(LEVELS[LEVEL].id, true); for (const o of enemies) if (o !== e && !o.dead) react(o, 'salute', 1.4); if (STORY) playLines(STORY.boss, false); }
function onBossEscape(e) { LASTBOSS = e; WORLD.bossHasGear = true; if (STORY) playLines(STORY.escape, false); }

// ---- the frame ---------------------------------------------------------
function render() {
  const STY = LEVELS[LEVEL].style; INKW = STYLE_INK[STY] || 1;
  const sh = WORLD.shake, jx = sh > 0 ? Math.round((Math.random() - .5) * sh) : 0, jy = sh > 0 ? Math.round((Math.random() - .5) * sh) : 0;
  // 1. the backdrop and the floor, low-res, then up to the print size
  g = gBuf; g.setTransform(1, 0, 0, 1, jx, jy);
  scr.drawBack(g, camX, time);
  g.drawImage(scr.floorC, Math.round(-camX), FLOOR);
  for (const h of scr.holes) { const x0 = Math.round(h.x0 - camX), x1 = Math.round(h.x1 - camX); if (x1 < 0 || x0 > VW) continue; g.fillStyle = scr.holeCol ? scr.holeCol.col : '#1e3a48'; g.fillRect(x0, FLOOR, x1 - x0, VH - FLOOR); g.fillStyle = scr.holeCol ? scr.holeCol.hi : '#2e5868'; for (let k = 0; k < 16; k++) g.fillRect(x0 + 4 + (k * 17 + Math.floor(time * 10)) % (x1 - x0 - 8), FLOOR + 6 + k * 9, 8, 1); g.fillStyle = scr.floor === 'sand' ? '#8a7a68' : '#3a2414'; g.fillRect(x0 - 3, FLOOR, 3, VH - FLOOR); g.fillRect(x1, FLOOR, 3, VH - FLOOR); }
  if (scr.floor === 'sand' && scr.L && scr.L.sky) { g.save(); g.beginPath(); g.rect(0, FLOOR, VW, VH - FLOOR); g.clip(); g.globalAlpha = .28; g.translate(0, FLOOR * 2 - 18); g.scale(1, -1); g.drawImage(scr.L.sky.c, Math.round(-camX * scr.L.sky.f), 0); g.restore(); g.globalAlpha = 1; }
  g.setTransform(1, 0, 0, 1, 0, 0);
  const Z = CAM.z, zx = CAM.cx * (1 - Z), zy = CAM.cy * (1 - Z);   // camera punch-in: everything scales about the impact
  bgX.setTransform(1, 0, 0, 1, 0, 0); bgX.imageSmoothingEnabled = true; if (Z > 1.001) bgX.drawImage(buf, -zx / Z, -zy / Z, VW / Z, VH / Z, 0, 0, RW, RH); else bgX.drawImage(buf, 0, 0, RW, RH);
  // 2. fighters, props and effects, sharp, on the actors' layer
  fgX.setTransform(1, 0, 0, 1, 0, 0); fgX.clearRect(0, 0, RW, RH); fgX.setTransform(HI * Z, 0, 0, HI * Z, (jx + zx) * HI, (jy + zy) * HI); fgX.imageSmoothingEnabled = false; g = fgX;
  drawDecals(); drawW4Back(); drawSetBack(); skyBack();
  const items = [];
  for (const b of BREAK) if (!b.held) items.push({ key: b.z + (b.size === 'l' ? b.d / 2 : 0), draw: () => drawBreakable(b) });
  for (const f of FOOD) items.push({ key: f.z, draw: () => drawFood(f) });
  for (const b of scr.boxes) if (!b.bk && !b.wreck && !b.deck) items.push({ key: b.z + b.d, draw: () => drawBox(b) });
  const keyOf = o => { let k = o.z; for (const b of scr.boxes) if (!b.deck && o.x > b.x && o.x < b.x + b.w && o.z > b.z && o.z < b.z + b.d && o.y >= b.h - 1) k = Math.max(k, b.z + b.d + .01); return k; };
  for (const e of enemies) items.push({ key: keyOf(e), draw: () => drawEnemyRig(e) });
  for (const p of players) items.push({ key: keyOf(p) + (p.fall > 0 ? -60 : 0), draw: () => drawWarriorRig(p) });
  for (const f of fx) items.push({ key: f.z + .5, draw: () => drawFx(f) }); setItems(items); w4Items(items);
  items.sort((a, b) => a.key - b.key).forEach(i => i.draw());
  scr.drawFront(g, camX, time);
  if (WORLD.flash > 0) { g.fillStyle = `rgba(255,240,210,${Math.min(.8, WORLD.flash * 1.6)})`; g.fillRect(-10, -10, VW + 20, VH + 20); }
  g = gBuf;
  // 3. print it
  if (GL) GL.draw(bgH, fgH, STY, time, 2, DIM, WORLD.noir || 0, (FLOOR * Z + zy) * HI); else { const c = cv.getContext('2d'); c.drawImage(bgH, 0, 0); c.drawImage(fgH, 0, 0); }
  // 4. the overlay: HUD, lettering, balloons
  out.setTransform(1, 0, 0, 1, 0, 0); out.clearRect(0, 0, RW, RH); hud(0, 0, HI);
  out.setTransform(2, 0, 0, 2, 0, 0); drawInk(); drawDialogue(); if (WORLD.blind > 0) { drawBlind(); out.setTransform(1, 0, 0, 1, 0, 0); hud(0, 0, HI); out.setTransform(2, 0, 0, 2, 0, 0); }   /* Prêtre-o-Dame's crucifix (zombi.js): the white covers the lettering and balloons too; only the HUD stays readable */ out.strokeStyle = OUT; out.lineWidth = 5; out.strokeRect(2.5, 2.5, 955, 535); out.setTransform(1, 0, 0, 1, 0, 0);
  if (fade > 0) { out.fillStyle = `rgba(0,0,0,${Math.min(1, fade)})`; out.fillRect(0, 0, RW, RH); }
}
