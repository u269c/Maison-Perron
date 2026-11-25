// =====================================================================
// SURPRISE THROWABLES (Nov 2026 playtest: "more things to throw, and variations")
// Five small things that do something when they break, however they break: thrown, punched, kicked into a wall,
// or caught in another one's blast. Friendly fire applies as everywhere else.
//   poison  · Tord-boyaux: a green bottle with a skull, bursts into a poison mist
//   fizz    · a soda siphon: a cloud of fizz that makes everyone in it dizzy
//   petard  · a box of firecrackers: a small blast that sets off its neighbours
//   gas     · a gas bottle (medium): a bigger blast that sets enemies on fire
//   oil     · an oil can: a slick puddle; enemies slip and fall, warriors skid
// Every screen also gets about 50 % more throwables (at least two), half surprises, half the screen's own kinds.
// =====================================================================
Object.assign(BK, {
  poison: { size: 's', hp: 1, w: 9, d: 9, h: 16, col: '#3a8a3a', food: .001, surprise: 1 },
  fizz: { size: 's', hp: 1, w: 9, d: 9, h: 17, col: '#4a9ad8', food: .001, surprise: 1 },
  petard: { size: 's', hp: 1, w: 16, d: 12, h: 10, col: '#c8302a', food: .001, surprise: 1 },
  gas: { size: 'm', hp: 3, w: 12, d: 12, h: 22, col: '#e87a2a', food: .001, surprise: 1 },
  oil: { size: 's', hp: 1, w: 13, d: 10, h: 12, col: '#3a3a42', food: .001, surprise: 1 }
});
Object.assign(BK_SC, { poison: 1.6, fizz: 1.6, petard: 1.5, gas: 1.55, oil: 1.5 });
const SURPRISE_W = [['poison', 3], ['petard', 3], ['fizz', 2], ['oil', 2], ['gas', 1]];
const BOOMW = { fr: { boom: ['BADABOUM !', 'KA-BOUM !', 'PAF-PAF-PAF !'], big: ['KA-BLAM !', 'BRAOUM !'], mist: 'PSCHHHT !', fizz: 'PCHIIIT !', oil: 'SPLOTCH !', slip: ['OUPS !', 'AÏE AÏE !', 'WOUPS !'], skid: 'GLISSE !' },
  en: { boom: ['BADA-BOOM!', 'KA-BOOM!', 'POP-POP-POP!'], big: ['KA-BLAM!', 'BRAOOM!'], mist: 'PSSSHT!', fizz: 'FSSSHHT!', oil: 'SPLOTCH!', slip: ['WHOOPS!', 'OOF!', 'WHOA!'], skid: 'SKID!' } };
const pickW = (list, rng = Math.random) => { let n = 0; for (const [, w] of list) n += w; let r = rng() * n; for (const [k, w] of list) { r -= w; if (r <= 0) return k; } return list[0][0]; };
const bigFoe = e => ['boss', 'oscar', 'calve', 'mmf'].includes(e.type) || !!W4BIG[e.type];
function boomWord(b, txt, size = 24) { INKFX.push({ k: 'sfx', text: txt, x: (b.x - camX) * 1.5, y: sy(b.z, 20) * 1.5 - 24, size, t: 0, rot: (Math.random() - .5) * .4 }); }

// ---- 50 % more throwables per screen, placed where there is free floor (same spots every time for a given screen)
function addExtras(scr) {
  if (scr.sky || scr.noExtras) return;
  const items = scr.items || [], nThrow = items.filter(it => BK[it.k] && BK[it.k].size !== 'l').length;
  const own = items.map(it => it.k).filter(k => BK[k] && BK[k].size !== 'l' && !BK[k].surprise && k !== 'keg');
  const want = Math.max(2, Math.round(nThrow * .5));
  let s = (LEVEL * 7919 + (typeof scrIdx === 'number' ? scrIdx : 0) * 104729 + scr.W * 31) >>> 0 || 1;
  const rnd = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const free = (x, z) => [-30, 0, 30].every(d => ground(x + d, z) === 0) && ![-22, 0, 22].some(d => blocked(x + d, z, 0) || blocked(x + d, z - 10, 0) || blocked(x + d, z + 10, 0))
    && BREAK.every(o => Math.abs(o.x - x) > o.w / 2 + 22 || Math.abs(o.z - z) > o.d / 2 + 14);
  const x0 = 180, x1 = Math.max(x0 + 100, (scr.W || 1000) - 160);
  let placed = 0;
  for (let tries = 0; tries < want * 40 && placed < want; tries++) {
    const x = x0 + rnd() * (x1 - x0), z = 14 + rnd() * (DEPTH - 28); if (!free(x, z)) continue;
    const k = own.length && rnd() < .45 ? own[(rnd() * own.length) | 0] : pickW(SURPRISE_W, rnd);
    const K = BK[k]; BREAK.push({ k, x, z, ...K, hp: K.hp, max: K.hp, y: 0, vx: 0, vy: 0, held: null, thrown: false, rot: 0, flash: 0, id: rnd(), extra: true }); placed++;
  }
}

// ---- what each one does when it breaks (called from smash)
function surpriseBreak(b) {
  const K = BK[b.k]; if (!K || !K.surprise) return;
  const from = b.from || null, L = BOOMW[LANG];
  if (b.k === 'poison') { fx.push({ k: 'mist', x: b.x, z: b.z, r: 54, t: 4.5, T: 4.5, kind: 'poison', from, hit: new Set() }); SFX.smash('bottles', .4, b.x); boomWord(b, L.mist, 22); }
  if (b.k === 'fizz') { fx.push({ k: 'mist', x: b.x, z: b.z, r: 48, t: 3.5, T: 3.5, kind: 'dizzy', from, hit: new Set() }); SFX.smash('bottles', .4, b.x); boomWord(b, L.fizz, 22); }
  if (b.k === 'petard') { boomAt(b.x, b.z, 56, 2, from, 'petard'); boomWord(b, pickA(L.boom), 26); for (let k = 0; k < 4; k++) fx.push({ k: 'crackle', x: b.x + (Math.random() - .5) * 60, z: b.z + (Math.random() - .5) * 20, delay: .1 + k * .12, t: .3 + .1 + k * .12 }); }
  if (b.k === 'gas') { boomAt(b.x, b.z, 80, 3, from, 'gas'); boomWord(b, pickA(L.big), 32); }
  if (b.k === 'oil') { fx.push({ k: 'oil', x: b.x, z: b.z, r: 40, t: 8, T: 8, from, hit: new Set() }); SND.splash(.8); boomWord(b, L.oil, 20); }
}
function boomAt(x, z, r, dmg, from, kind) {
  const inR = o => { const dx = (o.x - x) / r, dz = (o.z - z) / (r * .55); return dx * dx + dz * dz < 1 && (o.y || 0) < 70; };
  fx.push({ k: 'blast', x, z, r, t: .45, T: .45, gas: kind === 'gas' });
  for (let k = 0; k < (kind === 'gas' ? 9 : 5); k++) fx.push({ k: 'smoke', x: x + (Math.random() - .5) * r, z, y: 6 + Math.random() * 20, f: Math.random() - .5, t: 1.2 + Math.random() * .6 });
  WORLD.shake = Math.max(WORLD.shake, kind === 'gas' ? 9 : 5); SND.boom(kind === 'gas' ? 1.1 : .6); if (kind === 'gas') WORLD.flash = Math.max(WORLD.flash, .12);
  HITKIND = 'boom'; INK_STRONG = true;
  for (const e of [...enemies]) if (!e.dead && !e.heldBy && e.type !== 'mmf' && inR(e)) {   // Metal Face only counts real throws
    const d = Math.sign(e.x - x) || 1, big = bigFoe(e); hitEnemy(e, dmg, d, from, big ? .4 : 2); if (!big && !e.dead) { e.vy = 210; e.y = Math.max(1, e.y); } if (kind === 'gas' && e.type !== 'mmf') e.burn = Math.max(e.burn || 0, big ? 1.5 : 2.5); }
  HITKIND = null; INK_STRONG = false;
  for (const q of players) if (q.ko <= 0 && q.fall <= 0 && inR(q)) { const d = Math.sign(q.x - x) || 1; if (hitPlayer(q, kind === 'gas' ? 2 : 1, d, from)) { q.vy = 160; q.vx = d * 220; } }
  for (const o of BREAK) if (!o.broken && !o.held && inR(o)) { if (BK[o.k] && BK[o.k].surprise && !o.from) o.from = from; damageBreakable(o, 2, Math.sign(o.x - x) || 1); }   // chain reactions
}
// enemies have no status list: poison and dizziness are two timers on them
function foeStatus(e, kind, from) {
  if (e.dead || e.type === 'mmf') return; const big = bigFoe(e);
  if (kind === 'poison') { e.pois = big ? 2.5 : 4; e.poisFrom = from; e.poisT = 0; }
  if (kind === 'dizzy') { if (big && (e.dazeCD || 0) > 0) return; e.daze = big ? 1.2 : 2.6; if (big) e.dazeCD = 7; fx.push({ k: 'estars', e, t: e.daze }); }
  pop(e.x, e.z, 90, T_ST[LANG][kind], kind === 'poison' ? '#9aff6a' : '#ffe86a');
}
// called from updateEnemy after knock-back physics; true = skip the AI this frame
function foeStatusTick(e, dt) {
  e.dazeCD = Math.max(0, (e.dazeCD || 0) - dt);
  if (e.pois > 0) { e.pois -= dt; e.poisT += dt; if (Math.random() < dt * 3) fx.push({ k: 'pwisp', x: e.x + (Math.random() - .5) * 12, z: e.z, y: 40 + Math.random() * 30, t: .9, T: .9, side: Math.random() < .5 ? -1 : 1 });
    if (e.poisT >= 1) { e.poisT -= 1; hitEnemy(e, 1, 0, e.poisFrom, 0); if (e.dead) return true; } }
  if (e.daze > 0) { e.daze -= dt; if (e.state === 'wind' || e.state === 'strike') e.state = 'walk'; e.x += Math.sin(e.t * 3.3) * 22 * dt; e.z = Math.max(0, Math.min(DEPTH, e.z + Math.cos(e.t * 2.1) * 10 * dt)); e.walk += dt * 5; e.mv = 1; e.face = Math.sin(e.t * 1.7) > 0 ? 1 : -1; return true; }
  return false;
}
function boomFx(f, dt) {
  if (f.k === 'mist') { f.r2 = f.r * Math.min(1, .45 + (1 - f.t / f.T) * 4);
    const inR = o => { const dx = (o.x - f.x) / f.r2, dz = (o.z - f.z) / (f.r2 * .55); return dx * dx + dz * dz < 1 && (o.y || 0) < 60; };
    for (const e of enemies) if (!e.dead && !f.hit.has(e) && inR(e)) { f.hit.add(e); foeStatus(e, f.kind, f.from); }
    for (const q of players) if (q.ko <= 0 && !f.hit.has(q) && q.dodge <= 0 && inR(q)) { f.hit.add(q); addStatus(q, f.kind); }
    if (Math.random() < dt * 10) fx.push({ k: f.kind === 'poison' ? 'pwisp' : 'starfall', x: f.x + (Math.random() - .5) * f.r2 * 1.4, z: f.z + (Math.random() - .5) * f.r2 * .6, y: f.kind === 'poison' ? 6 : 40, vy: 40, vx: (Math.random() - .5) * 40, t: .9, T: .9, side: Math.random() < .5 ? -1 : 1 });
    return true; }
  if (f.k === 'oil') { const inR = o => { const dx = (o.x - f.x) / f.r, dz = (o.z - f.z) / (f.r * .45); return dx * dx + dz * dz < 1 && (o.y || 0) < 3; };
    for (const e of enemies) if (!e.dead && !e.heldBy && e.type !== 'mmf' && !f.hit.has(e) && inR(e) && (e.mv || Math.abs(e.vx) > 30)) { f.hit.add(e); e.state = 'hurt'; e.stun = bigFoe(e) ? .7 : 1.4; e.vy = 150; e.y = Math.max(1, e.y); e.vx = (e.face || 1) * 90; pop(e.x, e.z, 80, pickA(BOOMW[LANG].slip), '#d8d8e8'); SFX.bodyfall(e.x, 1); }
    f.pos = f.pos || new Map();
    for (const q of players) { const ox = f.pos.get(q) ?? q.x; if (q.ko <= 0 && !f.hit.has(q) && inR(q) && Math.abs(q.x - ox) > .5) { f.hit.add(q); q.vx = (Math.sign(q.x - ox) || q.face) * 230; pop(q.x, q.z, q.y + 70, BOOMW[LANG].skid, '#d8d8e8'); } f.pos.set(q, q.x); }
    return true; }
  if (f.k === 'blast') return true;
  if (f.k === 'estars') return f.e.dead ? (f.t = 0, true) : true;
  if (f.k === 'crackle') { if (f.delay > 0) { f.delay -= dt; return true; } if (!f.done) { f.done = 1; beep(900 + Math.random() * 900, .05, 'square', .05, -600); noise(.06, .05); for (let k = 0; k < 6; k++) fx.push({ k: 'debris', x: f.x, z: f.z, y: 12, vx: (Math.random() - .5) * 160, vy: 60 + Math.random() * 120, rot: 0, vr: 9, t: .5, col: k % 2 ? '#ffe070' : '#ff8a3a', w: 2 }); } return true; }
  return false;
}
function drawBoomFx(f) {
  const x = f.x - camX, y = sy(f.z, 0);
  if (f.k === 'mist') { const u = 1 - f.t / f.T, a = Math.min(1, f.t / .8) * .8, r = f.r2 || f.r, poi = f.kind === 'poison';
    g.fillStyle = poi ? `rgba(110,200,60,${a * .35})` : `rgba(170,215,255,${a * .35})`; g.beginPath(); g.ellipse(x, y, r, r * .5, 0, 0, 7); g.fill();   // the cloud's footprint on the floor = where it gets you
    for (let k = 0; k < 7; k++) { const ang = k * .9 + time * (k % 2 ? .4 : -.3), rx = r * (.35 + .3 * ((k * 37) % 10) / 10), cx = x + Math.cos(ang) * rx * .9, cy = y - 12 - Math.sin(ang) * rx * .3 - u * 8, rr = r * .55;
      const gr = g.createRadialGradient(cx, cy, 1, cx, cy, rr); gr.addColorStop(0, poi ? `rgba(130,225,70,${a})` : `rgba(215,240,255,${a})`); gr.addColorStop(.6, poi ? `rgba(110,170,60,${a * .6})` : `rgba(160,205,250,${a * .6})`); gr.addColorStop(1, poi ? 'rgba(120,60,170,0)' : 'rgba(120,180,240,0)');
      g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, rr, rr * .7, 0, 0, 7); g.fill(); }
    if (!poi) { g.fillStyle = `rgba(255,255,255,${a * 1.2})`; for (let k = 0; k < 10; k++) { const bx = x + Math.sin(k * 2.3 + time * 2) * r * .8, by = y - 10 - ((time * 30 + k * 13) % 40); g.beginPath(); g.arc(bx, by, 1.4, 0, 7); g.fill(); } }
    return true; }
  if (f.k === 'oil') { const a = Math.min(1, f.t / 1.5), sp = Math.min(1, (1 - f.t / f.T) * 8);
    g.fillStyle = `rgba(20,18,26,${.75 * a})`; g.beginPath(); g.ellipse(x, y, f.r * sp, f.r * .42 * sp, 0, 0, 7); g.fill();
    g.fillStyle = `rgba(120,90,200,${.3 * a})`; g.beginPath(); g.ellipse(x - f.r * .2, y - 2, f.r * .45 * sp, f.r * .12 * sp, -.1, 0, 7); g.fill();
    g.fillStyle = `rgba(90,200,190,${.25 * a})`; g.beginPath(); g.ellipse(x + f.r * .25, y + 2, f.r * .3 * sp, f.r * .08 * sp, .1, 0, 7); g.fill(); return true; }
  if (f.k === 'blast') { const u = 1 - f.t / f.T, R = f.r * (.3 + u * .8), yy = y - 14;
    g.globalAlpha = 1 - u; const gr = g.createRadialGradient(x, yy, 2, x, yy, R); gr.addColorStop(0, '#fffbe0'); gr.addColorStop(.35, f.gas ? '#ffb030' : '#ffd060'); gr.addColorStop(.75, f.gas ? 'rgba(220,60,20,.8)' : 'rgba(230,90,30,.7)'); gr.addColorStop(1, 'rgba(60,20,10,0)');
    g.fillStyle = gr; g.beginPath(); g.ellipse(x, yy, R, R * .75, 0, 0, 7); g.fill();
    g.strokeStyle = `rgba(255,240,200,${1 - u})`; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, R * 1.15, R * .4, 0, 0, 7); g.stroke();
    g.fillStyle = '#fff6c0'; for (let k = 0; k < 10; k++) { const a = k * .63 + f.r, d = R * (.6 + u * .7); g.fillRect(x + Math.cos(a) * d - 1, yy + Math.sin(a) * d * .7 - 1, 2.2, 2.2); }
    g.globalAlpha = 1; return true; }
  if (f.k === 'estars') { const e = f.e; if (!e || e.dead) return true; const ex = e.x - camX, ey = sy(e.z, e.y) - (bigFoe(e) ? 96 : 76);
    for (let k = 0; k < 3; k++) { const a = time * 5 + k * 2.1; star5(g, ex + Math.cos(a) * 11, ey + Math.sin(a) * 3.5, 3, k % 2 ? '#ffe86a' : '#ffffff'); } return true; }
  if (f.k === 'crackle') { if (f.delay > 0) return true; g.fillStyle = `rgba(255,230,140,${Math.max(0, f.t) * 3})`; g.beginPath(); g.arc(x, y - 10, 6, 0, 7); g.fill(); return true; }
  return false;
}
// ---- drawings (design size, scaled by BK_SC; origin at the base, centre)
Object.assign(BK3_DRAW, {
  poison: (g, W, H, c, dk, lt) => {
    poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .58], [W * .18, -H * .72], [W * .18, -H * .9], [-W * .18, -H * .9], [-W * .18, -H * .72], [-W / 2, -H * .58]], c);
    g.fillStyle = '#c8a070'; g.fillRect(-W * .2, -H, W * .4, H * .12);   // cork
    g.fillStyle = 'rgba(200,255,150,.35)'; g.fillRect(-W / 2 + 1, -H * .55, 1.4, H * .5);
    g.fillStyle = '#efe6d2'; g.fillRect(-W / 2 + 1.2, -H * .46, W - 2.4, H * .3);   // label with a skull
    g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(0, -H * .34, W * .16, 0, 7); g.fill(); g.fillRect(-W * .1, -H * .27, W * .2, H * .05);
    g.fillStyle = '#efe6d2'; g.fillRect(-W * .09, -H * .37, W * .07, W * .07); g.fillRect(W * .03, -H * .37, W * .07, W * .07);
    g.fillStyle = `rgba(160,255,110,${.5 + Math.sin(time * 4) * .3})`; g.beginPath(); g.arc(W * .1, -H - 1.5 - (time * 6 % 4), 1, 0, 7); g.fill();   // a fume
  },
  fizz: (g, W, H, c, dk, lt) => {
    poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .7], [-W / 2, -H * .7]], c);
    g.fillStyle = 'rgba(220,240,255,.5)'; g.fillRect(-W / 2 + 1, -H * .68, 1.4, H * .64);
    poly(g, [[-W * .35, -H * .7], [W * .35, -H * .7], [W * .3, -H * .9], [-W * .3, -H * .9]], '#c8ccd4');   // chrome siphon head
    poly(g, [[W * .2, -H * .88], [W * .75, -H * .86], [W * .75, -H * .8], [W * .2, -H * .8]], '#aab0ba');
    g.fillStyle = '#8a9098'; g.fillRect(-W * .12, -H, W * .24, H * .1);
    g.fillStyle = 'rgba(255,255,255,.8)'; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(-W * .2 + k * W * .2, -H * (.2 + ((time * .8 + k * .3) % .45)), .9, 0, 7); g.fill(); }
  },
  petard: (g, W, H, c, dk, lt) => {
    poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.fillStyle = '#f0c040'; g.fillRect(-W / 2, -H * .62, W, H * .26);
    g.fillStyle = '#1a1a1a'; g.font = 'bold 3.4px sans-serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'PÉTARDS' : 'BANGERS', 0, -H * .41);
    for (let k = 0; k < 4; k++) { const fx0 = -W * .36 + k * W * .24; g.fillStyle = k % 2 ? '#e8e0d0' : '#f04a3a'; g.fillRect(fx0 - 1, -H - 3.5, 2.2, 3.5); g.strokeStyle = '#3a2a1a'; g.lineWidth = .6; g.beginPath(); g.moveTo(fx0, -H - 3.5); g.quadraticCurveTo(fx0 + 1.5, -H - 5.5, fx0 + (k % 2 ? 1 : -1), -H - 6.5); g.stroke(); }
  },
  gas: (g, W, H, c, dk, lt) => {
    poly(g, [[-W / 2, -2], [-W / 2 + 2, 0], [W / 2 - 2, 0], [W / 2, -2], [W / 2, -H * .78], [W * .3, -H * .86], [-W * .3, -H * .86], [-W / 2, -H * .78]], c);
    g.fillStyle = '#efe6d2'; g.fillRect(-W / 2, -H * .55, W, H * .12); g.fillStyle = '#c8202a'; g.font = 'bold 3px sans-serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'GAZ' : 'GAS', 0, -H * .46);
    g.fillStyle = lt; g.fillRect(-W / 2 + 1.5, -H * .75, 1.6, H * .7);
    g.fillStyle = '#9a9aa2'; g.fillRect(-W * .14, -H, W * .28, H * .15); g.fillRect(-W * .3, -H * .97, W * .6, H * .04);   // valve
    g.fillStyle = '#c8202a'; g.beginPath(); g.moveTo(-3, 3); g.lineTo(0, -2); g.lineTo(3, 3); g.closePath(); g.save(); g.translate(0, -H * .25); g.fill(); g.restore();   // warning triangle
  },
  oil: (g, W, H, c, dk, lt) => {
    poly(g, [[-W / 2, 0], [W * .25, 0], [W * .25, -H * .75], [-W / 2, -H * .75]], c);
    poly(g, [[W * .2, -H * .7], [W * .62, -H * 1.05], [W * .66, -H * .98], [W * .25, -H * .55]], '#5a5a62');   // spout
    g.strokeStyle = '#6a6a72'; g.lineWidth = 1.2; g.beginPath(); g.arc(-W * .12, -H * .75, W * .22, Math.PI, 0); g.stroke();   // handle
    g.fillStyle = '#e8c040'; g.fillRect(-W / 2 + 1, -H * .5, W * .7, H * .22); g.fillStyle = '#1a1a1a'; g.font = 'bold 2.6px sans-serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'HUILE' : 'OIL', -W * .12, -H * .35);
    g.fillStyle = '#1a1a22'; g.beginPath(); g.arc(W * .64, -H * .98 + (time * 10 % 6), .9, 0, 7); g.fill();   // a drip
  }
});
