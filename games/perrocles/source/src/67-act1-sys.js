// ═══ ACT I SYSTEMS: bandits, the lion, the boss bar, Leo in the sky, the sword, nectar ═══
// ── bandits: close in, wind up a club swing you can see coming, swing, back off ──
BRAINS.bandit = (a, dt) => { const h = G.hero, m = a.mem; if (!a.alive) { a.vx = 0; return; } a.ghostNow = G.world === 'g'; if (a.kx) { a.x += a.kx * dt; a.kx *= 0.85; if (Math.abs(a.kx) < 5) a.kx = 0; }
  if ((m.stun && NOW.t < m.stun) || G.script || G.dialog) return; const d = h.x - a.x, ad = Math.abs(d), sees = G.world === 'm' && ad < 180 && h.state !== 'dead' && !(a.introFlag && !flag(a.introFlag));
  if (m.swing) { const k = NOW.t - m.swing; a.face = m.face; const wu = Save.d.heroic ? 0.36 : 0.5; if (k > wu && !m.hitDone) { m.hitDone = true; if (Math.abs(h.x - (a.x + a.face * 16)) < 22 && Math.abs(h.y - a.y) < 30) hurtHero(1, a.x); } if (k > 0.85) { m.swing = 0; m.rest = NOW.t + (Save.d.heroic ? 0.6 : 1.1) + Math.random() * 0.5; setAnim(a, 'idle'); } return; }
  if (!sees) { if (a.habit) return; return BRAINS.wander(a, dt); }
  const pack = G.actors.filter((b) => b.brain === 'bandit' && b.alive && b !== a), turn = !pack.some((b) => b.mem.swing || Math.abs(h.x - b.x) < ad - 4);
  if ((m.rest && NOW.t < m.rest) || !turn) { if (walkTo(a, h.x - Math.sign(d) * (turn ? 64 : 80), 46, dt)) { a.face = Math.sign(d); standStill(a); } return; }
  if (ad < 34 && Math.abs(h.y - a.y) < 24) { m.swing = NOW.t; m.hitDone = false; m.face = Math.sign(d) || 1; a.face = m.face; setAnim(a, 'club'); Audio.sfx('swing'); return; }
  walkTo(a, h.x - Math.sign(d) * 26, 70, dt); };
// ── the Nemean lion ──
const LION = { hp: 20, dazeHits: 3, dazeWindow: 4.5, dazeT: 2.4, wrestleNeed: 5, wrestleT: 2.2, wrestleDmg: 5, metalAt: 0.18 };
BRAINS.lion = (a, dt) => { const h = G.hero, m = a.mem; if (!a.alive) return; if (a.kx) { a.x += a.kx * dt; a.kx *= 0.86; if (Math.abs(a.kx) < 5) a.kx = 0; } if (G.script || G.dialog) return;
  const metal = a.hp <= Math.ceil(a.maxHp * LION.metalAt), sp = metal ? 1.45 : 1, mv = sp * (Save.d.heroic ? 1.15 : 1), tell = Save.d.heroic ? 0.8 : 1, d = h.x - a.x, ad = Math.abs(d); a.metal = metal; a.x = clamp(a.x, (G.bounds || [0])[0] + 20, (G.bounds || [0, 1e9])[1] - 10);
  if (metal && !m.metalOnce) { m.metalOnce = true; m.state = 'roar'; m.t = 0; setAnim(a, 'roar'); Audio.sfx('roar'); rumbleFx('reveal'); G.shake = 0.6; a.invuln = 1.0; Audio.playMusic('lionMetal'); G.toast = { plain: true, text: T('Le lion entre en fureur !', 'The lion flies into a fury!', 'Το λιοντάρι λυσσάει!'), t: 0 }; }
  if (a.invuln > 0) a.invuln -= dt; m.t = (m.t || 0) + dt;
  switch (m.state || 'prowl') {
    case 'prowl': { const want = ad > 150 ? 1 : ad < 70 ? -0.6 : 0; if (want) walkTo(a, a.x + Math.sign(d) * want * 40, 50 * mv, dt, 'walk'); else { a.face = Math.sign(d) || a.face; standStill(a); }
      if (m.t > (m.wait || 1.2) / sp) { m.t = 0; m.wait = 0.9 + Math.random() * 1.1; a.face = Math.sign(d) || a.face; if (ad < 52) { m.state = 'swipe'; setAnim(a, 'swipe'); } else { m.state = 'crouch'; setAnim(a, 'crouch'); Audio.sfx('growl'); } } break; }
    case 'crouch': a.face = Math.sign(d) || a.face; if (m.t > 0.75 * tell / sp) { m.state = 'pounce'; m.t = 0; setAnim(a, 'pounce'); a.vy = -250; a.vx = clamp(d * 1.02, -260, 260) * mv; a.airborne = true; Audio.sfx('roar'); } break;
    case 'pounce': { a.vy += 760 * dt; a.x += a.vx * dt; a.y += a.vy * dt; const fl = groundY(G.L, a.x); if (Math.abs(h.x - a.x) < 30 && h.y > a.y - 40 && h.y < a.y + 16 && a.vy > -160) hurtHero(1, a.x);
      if (a.y >= fl && a.vy > 0) { a.y = fl; a.airborne = false; a.vy = 0; dustPuff(a.x, a.y, 6); rumble(120, 0.5, 0.2); G.shake = 0.2; m.state = 'recover'; m.t = 0; setAnim(a, 'crouch'); m.landT = NOW.t; } break; }
    case 'recover': if (m.landT && NOW.t - m.landT > 0.3) { m.landT = 0; setAnim(a, 'idle'); } if (m.t > 0.9 / sp) { m.state = 'prowl'; m.t = 0; } break;
    case 'swipe': if (m.t > 0.2 && m.t < 0.32 && !m.hitDone && Math.abs(h.x - (a.x + a.face * 30)) < 26 && Math.abs(h.y - a.y) < 30) { m.hitDone = true; hurtHero(1, a.x); } if (m.t > 0.55 / sp) { m.hitDone = false; m.state = 'recover'; m.t = 0; setAnim(a, 'idle'); } break;
    case 'roar': if (m.t > 1.0) { m.state = 'prowl'; m.t = 0; } if (ad < 70 && h.state !== 'dead') { h.vx = Math.sign(-d || 1) * -0 + Math.sign(h.x - a.x) * 120; } break;
    case 'dazed': if (m.t > LION.dazeT * (metal ? 0.7 : 1)) { m.state = 'prowl'; m.t = 0; m.hits = []; setAnim(a, 'idle'); } break;
    case 'wrestled': break; } };
// how the lion takes a blow: blades bounce, the club rattles him, and a dazed lion can be grabbed
function lionHit(a, weapon, dir) { const m = a.mem; if (a.invuln > 0) { spark(a.x, a.y - 24, 4); return; }
  if (weapon === 'xiphos') { Audio.sfx('clang'); spark(a.x - dir * 6, a.y - 24, 8); G.hero.weapon = 'club'; G.hero.bossClub = true; bark(G.hero, tr(T('Ça rebondit ! Le gourdin, alors.', 'It bounces off! The club, then.', 'Γλιστράει! Το ρόπαλο, λοιπόν.'))); return; }
  { const st = m.state || 'prowl', front = Math.sign(G.hero.x - a.x) === a.face, open = st === 'recover' || st === 'roar' || (st === 'swipe' && m.t > 0.34) || !front;
    if (st === 'pounce') { Audio.sfx('clang'); spark(a.x, a.y - 22, 3); return; }
    if (!open && st !== 'dazed') { // he bats the club aside and answers
      Audio.sfx('clang'); spark(a.x + a.face * 18, a.y - 22, 5); G.hitStop = 0.04; rumble(60, 0.2, 0.3); m.parried = (m.parried || 0) + 1;
      if (st === 'prowl' && !(m.counterT > NOW.t)) { m.state = 'swipe'; m.t = 0.08; m.hitDone = false; setAnim(a, 'swipe'); m.counterT = NOW.t + (Save.d.heroic ? 0.6 : 1.1); }
      if (!m.parryTold && m.parried >= 2) { m.parryTold = true; G.toast = { plain: true, text: T('Il pare ! Frappe quand il retombe, ou par-derrière.', 'He parries! Strike when he lands, or from behind.', 'Αποκρούει! Χτύπα όταν προσγειώνεται, ή από πίσω.'), t: 0 }; } return; } }
  if (m.state === 'dazed') { // the grab
    m.state = 'wrestled'; m.t = 0; G.wrestle = { a, n: 0, t: 0 }; setAnim(a, 'dazed'); setAnim(G.hero, 'pick'); G.hero.state = 'wrestle'; rumbleFx('heartbeat'); Audio.sfx('roar'); return; }
  const dmg = 1; a.hp = Math.max(a.metal ? 1 : 0, a.hp - dmg); a.flash = 0.2; a.kx = dir * 60; Audio.sfx('hit'); spark(a.x, a.y - 22, 6); rumble(80, 0.3, 0.5); G.hitStop = 0.05;
  m.hits = (m.hits || []).filter((t) => NOW.t - t < LION.dazeWindow); m.hits.push(NOW.t);
  if (a.metal && a.hp <= 1 && m.state !== 'dazed') { m.hits = [NOW.t, NOW.t, NOW.t]; }
  if (m.hits.length >= LION.dazeHits && m.state !== 'pounce') { m.state = 'dazed'; m.t = 0; a.airborne = false; setAnim(a, 'dazed'); Audio.sfx('growl'); G.toast = { plain: true, text: T('Il titube : empoigne-le !', 'He’s staggering: grab him!', 'Παραπατά: άρπαξέ τον!'), t: 0 }; } }
function wrestleTick(dt) { const W = G.wrestle; if (!W) return; const h = G.hero, a = W.a; W.t += dt; h.x = a.x - a.face * 26; h.face = a.face; a.flash = 0;
  if (Input.hit('atk') || Input.hit('jump') || Input.hit('use')) { W.n++; rumble(60, 0.4, 0.7); Audio.sfx('hit'); spark(a.x, a.y - 26, 3); G.shake = 0.12; }
  if (W.n >= LION.wrestleNeed + (Save.d.heroic ? 2 : 0)) { a.hp = Math.max(0, a.hp - (a.metal ? 1 : LION.wrestleDmg)); a.kx = a.face * -140; rumbleFx('kill'); G.shake = 0.5; end(true); }
  else if (W.t > LION.wrestleT) { end(false); }
  function end(won) { G.wrestle = null; h.state = 'free'; setAnim(h, 'idle'); h.flash = 0.6; a.mem.state = 'recover'; a.mem.t = 0; a.mem.hits = []; if (!won) { setAnim(a, 'swipe'); a.mem.state = 'swipe'; a.mem.t = 0; }
    if (a.hp <= 0) { a.alive = false; setAnim(a, 'down'); a.busy = true; a.deadT = -99; runScene('lionDown', sceneLionDown); } } }
// the hero's swing reaches the lion through its own rules; everything else as before
const _meleeHit = meleeHit; meleeHit = function (cx, cy, w, hh, dmg, dir) { const weapon = G.hero.weapon || 'club';
  const bosses = G.actors.filter((a) => a.boss && a.alive && !a.hitBox); for (const a of bosses) if (Math.abs(a.x - cx) < w / 2 + a.w / 2 && a.y - a.h < cy + hh / 2 && a.y > cy - hh / 2 - 10) lionHit(a, weapon, dir);
  for (const a of bosses) a.ghostNow = true; _meleeHit(cx, cy, w, hh, weapon === 'xiphos' ? 2 : dmg, dir); for (const a of bosses) a.ghostNow = false; };
const _damageB = damage; damage = function (a, dmg, dir) { if (a.boss) { Audio.sfx('clang'); spark(a.x, a.y - 22, 3); return; } return _damageB(a, dmg, dir); };
// a boss doesn't reset to full on the hero's mercy respawn: it keeps most of the damage done (Athena's mercy)
const _heroDown = heroDown; heroDown = function () { const b = G.actors.find((a) => a.boss && a.alive); if (b) b.keepHp = Math.min(b.maxHp, b.hp + 3); _heroDown(); later(1.3, () => { if (b && b.alive) { b.hp = b.keepHp; b.x = b.x0; b.mem = {}; b.airborne = false; b.y = groundY(G.L, b.x); } G.wrestle = null; }); };
// ── the boss bar: a painted cartouche along the bottom ──
function drawBossLow(x) { const B = G.boss; if (!B || !B.a) return; const a = B.a, k = Math.min(1, B.t / 0.6), w = 200, x0 = (LW - w) / 2, y0 = LH - 16 + (1 - k) * 20, mm = a.mem || {}, CC = a.C || {}, part = CC.hits && mm.hits ? mm.hits / CC.hits : CC.tie && mm.ties ? mm.ties / CC.tie : 0, f = clamp((a.hp - part) / a.maxHp, 0, 1); /* blows that count toward the next punish show on the bar too */ B.shown = B.shown == null ? f : B.shown + (f - B.shown) * Math.min(1, NOW.dt * 4);
  x.fillStyle = 'rgba(20,12,8,0.82)'; x.fillRect(x0 - 3, y0 - 3, w + 6, 9); x.fillStyle = '#3a1810'; x.fillRect(x0, y0, w, 3); x.fillStyle = '#e8c070'; x.fillRect(x0, y0, Math.round(w * B.shown), 3); x.fillStyle = a.metal ? '#ff3a2a' : '#c0392b'; x.fillRect(x0, y0, Math.round(w * f), 3);
  if (a.metal && Math.floor(NOW.t * 6) % 2) { x.fillStyle = 'rgba(255,80,60,0.35)'; x.fillRect(x0 - 3, y0 - 3, w + 6, 9); } x.fillStyle = '#c2603a'; for (let i = 0; i <= 10; i++) x.fillRect(x0 + Math.round(i * w / 10), y0 + 3, 1, 2); }
function drawBossHi(c) { const B = G.boss; if (!B || !B.a || B.t < 0.3) return; hiTextO(c, tr(B.name), LW / 2, LH - 22, 6, B.a.metal ? '#ffb0a0' : '#f4e6c8', '#2a1610', 'center', TXT.head); }
// the wrestle prompt
function drawWrestleHi(c) { const W = G.wrestle; if (!W) return; const k = W.n / (LION.wrestleNeed + (Save.d.heroic ? 2 : 0)), s = DISP.s; c.save(); richText(c, tr(T('{atk} {atk} {atk} — tiens bon !', '{atk} {atk} {atk} — hold on!', '{atk} {atk} {atk} — κράτα γερά!')), LW / 2, 70, 8, '#fff2d8');
  c.fillStyle = 'rgba(20,12,8,0.8)'; c.fillRect(DISP.x + (LW / 2 - 50) * s, DISP.y + 80 * s, 100 * s, 5 * s); c.fillStyle = '#e8c070'; c.fillRect(DISP.x + (LW / 2 - 50) * s, DISP.y + 80 * s, 100 * k * s, 5 * s);
  c.fillStyle = '#c0392b'; c.fillRect(DISP.x + (LW / 2 - 50) * s, DISP.y + 86 * s, 100 * (1 - W.t / LION.wrestleT) * s, 2 * s); c.restore(); }
// ── Leo: the beaten lion becomes stars ──
const LEO = [[-30, 6], [-18, -2], [-6, -6], [6, -10], [14, -18], [24, -14], [28, -4], [20, 2], [8, 6], [-4, 10]], LEO_LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 1], [3, 7]];
function drawStars(x, camx) { const S = G.stars; if (!S) return; const t = S.t, rise = ease(clamp01((t - 0.6) / 2.4)), cx = S.x - camx, cy = S.y - rise * 150, sc = 1 + rise * 1.4;
  for (let i = 0; i < 26; i++) { const a = i * 2.39, r = 10 + (i % 5) * 6, px = S.x - camx + Math.cos(a) * r * (1 - rise), py = S.y + Math.sin(a) * r * 0.5 * (1 - rise) - rise * 150 * (0.5 + (i % 3) * 0.25); if (t < 3.2) { x.globalAlpha = 0.7 * (1 - rise * 0.6); x.fillStyle = i % 2 ? '#ffe8a0' : '#fff8e0'; x.fillRect(Math.round(px), Math.round(py), 1, 1); } }
  x.globalAlpha = clamp01((t - 1.6) / 1) * (t > 7 ? clamp01((9 - t) / 2) : 1); x.strokeStyle = 'rgba(255,236,170,0.55)'; x.lineWidth = 1; x.beginPath(); for (const [i, j] of LEO_LINKS) { x.moveTo(cx + LEO[i][0] * sc, cy + LEO[i][1] * sc); x.lineTo(cx + LEO[j][0] * sc, cy + LEO[j][1] * sc); } x.stroke();
  for (const [sx2, sy2] of LEO) { const tw = 0.6 + 0.4 * Math.sin(t * 6 + sx2); x.fillStyle = '#fff6d0'; x.fillRect(Math.round(cx + sx2 * sc) - 1, Math.round(cy + sy2 * sc), 3, 1); x.fillRect(Math.round(cx + sx2 * sc), Math.round(cy + sy2 * sc) - 1, 1, 3); x.globalAlpha *= tw; }
  x.globalAlpha = 1; if (t > 9) G.stars = null; }
// ── Eurystheus peeking out of his jar, the lion fading in and to stars ──
const _drawActor = drawActor; drawActor = function (x, a, camx, world) {
  if (a.godOnly && world !== 'g') return;
  if (a.peek != null && !a.hidden) { const rim = groundY(G.L, 1520) - 45; x.save(); x.beginPath(); x.rect(0, 0, LW, rim); x.clip(); const dy = (1 - a.peek) * 64; const y0 = a.y; a.y = y0 + dy; _drawActor(x, a, camx, world); a.y = y0; x.restore(); return; }
  if (a.alpha != null && a.alpha < 1) { x.save(); x.globalAlpha = a.alpha; _drawActor(x, a, camx, world); x.restore(); return; }
  if (a.fadeToStars && G.stars) { x.save(); x.globalAlpha = clamp01(1 - G.stars.t / 2.2); _drawActor(x, a, camx, world); x.restore(); return; }
  _drawActor(x, a, camx, world); };
// ── nectar: drunk on its own, with gulps, when the hero is down to his last heart ──
function nectarTick() { const h = G.hero; if (!h || h.state === 'dead' || G.script || !(Save.d.nectar > 0) || h.hp > 1 || h.drinking) return; h.drinking = true; Save.d.nectar--; Save.save(); setAnim(h, 'drink'); Audio.sfx('ichor'); later(0.65, () => { h.hp = HEROS.maxHp; h.drinking = false; G.toast = { plain: true, text: T('Une gorgée de nectar', 'A gulp of nectar', 'Μια γουλιά νέκταρ'), t: 0 }; rumbleFx('pickup'); }, { anyLand: true }); }
// ── new sounds ──
const _sfx = Audio.sfx; Audio.sfx = function (name, k = 1) { if (!this.ctx || !Save.d.sfx) return; const t = this.ctx.currentTime, S = this.sfxGain, n = (q) => this.noteToFreq(q);
  if (name === 'splash') { this._noiseHit(t, 1400, 0.25, 0.25, S, true); this._noiseHit(t + 0.08, 700, 0.15, 0.2, S, true); return; }
  if (name === 'clang') { this.blip(n('E6'), 0.25, 'square', 0.06, t); this.blip(n('B6'), 0.2, 'triangle', 0.08, t + 0.005); this._noiseHit(t, 3200, 0.2, 0.04, S); return; }
  if (name === 'roar') { this._noiseHit(t, 260, 0.6, 0.9, S, true); this.blip(n('A1'), 0.8, 'sawtooth', 0.12, t); this.blip(n('E2'), 0.6, 'sawtooth', 0.06, t + 0.1); return; }
  return _sfx.call(this, name, k); };
// ── music: the Argolid (pastoral D dorian), Tiryns (stately), Nemea (dry, tense), the lion (goth) and its metal phase ──
Object.assign(MUSIC, {
  argolid: { bpm: 100, echo: 0.45, layers: [
    { w: 'm', voice: 'lyre', gain: 0.15, notes: g8('D5 . E5 F5 G5 . A5 . | G5 F5 E5 . D5 . . . | C5 D5 E5 . F5 E5 D5 C5 | D5 - - . . . . . | A4 . C5 D5 E5 . F5 . | G5 . A5 . G5 F5 E5 . | F5 E5 D5 . C5 . E5 . | D5 - - - . . . .') },
    { w: 'm', voice: 'pluckBass', gain: 0.19, notes: g8('D3 . A3 . D3 . A3 . | C3 . G3 . C3 . G3 . | Bb2 . F3 . C3 . G3 . | D3 . A3 . D3 . A3 . | F2 . C3 . F2 . C3 . | G2 . D3 . G2 . D3 . | Bb2 . F3 . A2 . E3 . | D3 . A3 . D3 . . .') },
    { w: 'm', drum: true, notes: rep(g8('D . d . D d d . | D . d d . J d .'), 4) },
    { w: 'm', voice: 'aulos', gain: 0.04, pan: -0.3, notes: [['R', 16], ...g8('A5 - - - G5 - F5 - | E5 - - - D5 - - - | F5 - G5 - A5 - C6 - | A5 - - - - - - -')] },
    { w: 'g', voice: 'bell', gain: 0.09, notes: g8('D6 . E6 F6 G6 . A6 . | G6 F6 E6 . D6 . . . | C6 D6 E6 . F6 E6 D6 C6 | D6 - - . . . . . | A5 . C6 D6 E6 . F6 . | G6 . A6 . G6 F6 E6 . | F6 E6 D6 . C6 . E6 . | D6 - - - . . . .') },
    { w: 'g', voice: 'choir', gain: 0.06, notes: g4('D4+A4 - - - | C4+G4 - - - | Bb3+F4 - C4+G4 - | D4+A4 - - - | F3+C4 - - - | G3+D4 - - - | Bb3+F4 - A3+E4 - | D4+A4 - - -') },
    { w: 'g', voice: 'drone', gain: 0.05, notes: [['D2', 32]] } ] },
  tiryns: { bpm: 84, echo: 0.6, layers: [
    { w: 'm', voice: 'aulos', gain: 0.07, notes: g8('E5 - F5 - G5 - A5 - | B5 - A5 G5 F5 - E5 - | D5 - E5 F5 G5 - F5 E5 | E5 - - - - - . . | C5 - D5 - E5 - F5 - | G5 - A5 - G5 F5 E5 D5 | C5 - B4 - C5 D5 E5 - | E5 - - - - - . .') },
    { w: 'm', voice: 'pluckBass', gain: 0.2, notes: g4('E2 E3 E2 E3 | A2 A3 A2 A3 | D2 D3 G2 G3 | E2 E3 E2 E3 | A2 A3 A2 A3 | C3 C4 C3 C4 | D3 D4 B2 B3 | E2 E3 E2 E3') },
    { w: 'm', drum: true, notes: rep(g8('D . . . d . D . | D . . d d . D .'), 4) },
    { w: 'm', voice: 'lyre', gain: 0.08, pan: 0.3, notes: g8('B4 . . . E5 . . . | C5 . . . A4 . . . | B4 . . . D5 . . . | B4 . . . G#4 . . . | C5 . . . E5 . . . | E5 . . . C5 . . . | A4 . . . F5 . . . | E5 . . . B4 . . .') },
    { w: 'g', voice: 'choir', gain: 0.07, notes: g4('E3+B3 - - - | A3+E4 - - - | D3+A3 - G3+D4 - | E3+B3 - - - | A3+E4 - - - | C4+G4 - - - | D4+A4 - B3+F#4 - | E3+B3 - - -') },
    { w: 'g', voice: 'bell', gain: 0.07, notes: g8('E6 - F6 - G6 - A6 - | B6 - A6 G6 F6 - E6 - | D6 - E6 F6 G6 - F6 E6 | E6 - - - - - . . | C6 - D6 - E6 - F6 - | G6 - A6 - G6 F6 E6 D6 | C6 - B5 - C6 D6 E6 - | E6 - - - - - . .') },
    { w: 'g', voice: 'drone', gain: 0.05, notes: [['E2', 32]] } ] },
  nemea: { bpm: 76, echo: 0.7, layers: [
    { w: 'm', voice: 'drone', gain: 0.07, notes: [['D2', 32]] },
    { w: 'm', voice: 'aulos', gain: 0.055, notes: g8('D5 - Eb5 - D5 - . . | C5 - Bb4 - A4 - . . | D5 - Eb5 - F5 - Eb5 - | D5 - - - . . . . | G5 - F5 - Eb5 - D5 - | C5 - D5 - Eb5 - . . | Bb4 - A4 - G4 - A4 - | D5 - - - - - . .') },
    { w: 'm', drum: true, notes: rep(g8('D . . . . . d . | D . . . d . . .'), 4) },
    { w: 'm', voice: 'pluckBass', gain: 0.16, notes: g4('D2 . A2 . | D2 . G2 . | D2 . A2 . | D2 . . . | Eb2 . Bb2 . | C2 . G2 . | Bb1 . F2 . | D2 . A2 .') },
    { w: 'g', voice: 'choir', gain: 0.06, notes: g4('D3+A3 - - - | C3+G3 - - - | D3+A3 - - - | D3+A3 - - - | Eb3+Bb3 - - - | C3+G3 - - - | Bb2+F3 - - - | D3+A3 - - -') },
    { w: 'g', voice: 'bell', gain: 0.06, notes: g8('D6 - Eb6 - D6 - . . | C6 - Bb5 - A5 - . . | D6 - Eb6 - F6 - Eb6 - | D6 - - - . . . . | G6 - F6 - Eb6 - D6 - | C6 - D6 - Eb6 - . . | Bb5 - A5 - G5 - A5 - | D6 - - - - - . .') } ] },
  lion: { bpm: 126, echo: 0.35, layers: [
    { w: 'm', voice: 'pluckBass', gain: 0.24, notes: rep(g8('D2 D2 D3 D2 F2 D2 Eb2 D2 | D2 D2 D3 D2 C3 Bb2 A2 G2'), 4) },
    { w: 'm', drum: true, notes: rep(g8('D . d D . d D d | D . d D d d J d'), 4) },
    { w: 'm', voice: 'aulos', gain: 0.07, notes: g8('D5 - - Eb5 D5 - C5 - | Bb4 - A4 - G4 - A4 - | D5 - - Eb5 F5 - Eb5 D5 | C5 - - - D5 - - - | F5 - Eb5 - D5 - C5 - | Bb4 - C5 - D5 - Eb5 - | F5 - G5 - F5 Eb5 D5 C5 | D5 - - - - - - -') },
    { w: 'm', voice: 'lyre', gain: 0.07, pan: 0.3, notes: rep(g16('D4 A4 D5 A4 Eb4 Bb4 Eb5 Bb4 D4 A4 D5 A4 C4 G4 C5 G4'), 8) },
    { w: 'g', voice: 'choir', gain: 0.08, notes: g4('D3+A3 - Eb3+Bb3 - | D3+A3 - C3+G3 - | D3+A3 - Eb3+Bb3 - | C3+G3 - D3+A3 - | F3+C4 - Eb3+Bb3 - | D3+A3 - C3+G3 - | Bb2+F3 - C3+G3 - | D3+A3 - - -') },
    { w: 'g', voice: 'drone', gain: 0.06, notes: [['D2', 32]] } ] },
  lionMetal: { bpm: 150, echo: 0.25, layers: [
    { w: 'm', voice: 'pluckBass', gain: 0.3, notes: rep(g16('D2 D2 D3 D2 D2 D2 D3 D2 Eb2 Eb2 Eb3 Eb2 D2 D2 C3 Bb2'), 8) },
    { w: 'm', drum: true, notes: rep(g16('D d D d D d D d D d D d D J D d'), 8) },
    { w: 'm', voice: 'aulos', gain: 0.09, notes: g8('D6 - C6 Bb5 A5 - G5 - | A5 - Bb5 - A5 - D5 - | D6 - Eb6 D6 C6 - Bb5 - | A5 - - - D5 - - - | F6 - Eb6 D6 C6 - Bb5 - | C6 - D6 - Eb6 - F6 - | G6 - F6 Eb6 D6 C6 Bb5 A5 | D6 - - - - - - -') },
    { w: 'g', voice: 'choir', gain: 0.1, notes: g4('D3+A3 Eb3+Bb3 D3+A3 C3+G3 | D3+A3 Eb3+Bb3 F3+C4 Eb3+Bb3 | D3+A3 Eb3+Bb3 D3+A3 C3+G3 | Bb2+F3 C3+G3 D3+A3 - | D3+A3 Eb3+Bb3 D3+A3 C3+G3 | D3+A3 Eb3+Bb3 F3+C4 Eb3+Bb3 | D3+A3 Eb3+Bb3 D3+A3 C3+G3 | Bb2+F3 C3+G3 D3+A3 -') } ] } });
