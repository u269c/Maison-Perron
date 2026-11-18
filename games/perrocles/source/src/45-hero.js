// ═══ THE HEROS: run, jump, sling, club, the Owl's Eye ═══
const HEROS = { maxHp: 5 };
// weapons in hand: two rows. Melee (R1 / Q): club, xiphos, harpe, forge-blade. Throw (L1 / R): stones, bow, arc-sling.
const MELEE = ['club', 'xiphos', 'harpe', 'forge'], THROW = ['sling', 'bow', 'arc'];
const wName = (w) => ({ club: T('Le gourdin', 'The club', 'Το ρόπαλο'), xiphos: T('Le xiphos', 'The xiphos', 'Το ξίφος'), harpe: T('La harpè', 'The harpe', 'Η άρπη'), forge: T('La lame de la forge', 'The forge-blade', 'Η λεπίδα του καμινιού'), sling: T('La fronde', 'The sling', 'Η σφενδόνη'), bow: T('L’arc', 'The bow', 'Το τόξο'), arc: T('La fronde-éclair', 'The arc-sling', 'Η σφενδόνη-αστραπή') })[w];
function owns(h, w) { return w === 'club' ? !!h.hasClub : w === 'sling' ? !!h.hasSling : w === 'arc' ? flag('arcsling') : flag(w); }
function swapTick(h) { if (G.script || G.dialog || G.paused || h.state !== 'free') return; for (const [act, list, key] of [['swap', MELEE, 'weapon'], ['swap2', THROW, 'throwW']]) { if (!Input.hit(act)) continue;
    if (key === 'weapon' && h.bossClub) { bark(h, tr(T('Pas le moment : il faut le gourdin.', 'Not now: it has to be the club.', 'Όχι τώρα: θέλει ρόπαλο.'))); continue; }
    const own = list.filter((w) => owns(h, w)), cur = h[key] || list[0]; if (own.length < 2) { bark(h, tr(own.length ? T('C’est tout ce que j’ai.', 'That’s all I’ve got.', 'Μόνο αυτό έχω.') : T('Rien à prendre.', 'Nothing to take.', 'Τίποτα.'))); continue; }
    h[key] = own[(own.indexOf(cur) + 1) % own.length]; Save.d[key === 'weapon' ? 'hand' : 'hand2'] = h[key]; Save.save(); UI.handPop = 0.5; Audio.sfx('choose'); rumble(50, 0.2, 0.3); bark(h, tr(wName(h[key])) + '.'); } }
function heroTick(h, dt) { swapTick(h); const L = G.L, inp = !G.dialog && !G.script?.lock && !G.paused && h.ctl !== false; h.at += dt; if (h.flash > 0) h.flash -= dt; if (h.cool > 0) h.cool -= dt;
  let ax = 0; if (inp && h.state === 'free') { if (Input.down('left')) ax -= 1; if (Input.down('right')) ax += 1; if (ax && Input.axisX && !Input.kb.left && !Input.kb.right && !Input.bot.left && !Input.bot.right) ax = Math.sign(Input.axisX) * clamp((Math.abs(Input.axisX) - 0.2) / 0.6, 0.3, 1); } // stick: tilt a little to walk, fully to run
  if (h.state === 'hurt') { if (h.at > 0.35) h.state = 'free'; }
  if (ax && h.ground && Input.down('down')) ax *= 0.32; // hold ↓ to creep
  const target = ax * RUN, acc = h.ground ? 900 : 520; if (h.state === 'free' || h.state === 'hurt') h.vx += clamp(target - h.vx, -acc * dt, acc * dt); else h.vx *= 0.8;
  if (ax) h.face = ax;
  // jump: buffered, with a little grace after leaving a ledge, cut short when released
  if (inp && Input.hit('jump')) h.jbuf = 0.12; else h.jbuf = Math.max(0, (h.jbuf || 0) - dt); if (h.ground) h.coyote = 0.1; else h.coyote = Math.max(0, (h.coyote || 0) - dt);
  if (h.jbuf > 0 && h.coyote > 0 && h.state === 'free') { h.vy = -JUMP_V; h.ground = false; h.jbuf = 0; h.coyote = 0; Audio.sfx('jump'); dustPuff(h.x, h.y, 3); }
  if (!Input.down('jump') && h.vy < -90) h.vy += GRAV * 1.4 * dt;
  h.vy += GRAV * dt; h.vy = Math.min(h.vy, 420);
  // move with walls
  const nx = clamp(h.x + h.vx * dt, 8, L.w - 8); let blocked = false; for (const p of L.plats) if (p.wall) { const top = groundY(L, p.x) - p.h; if (h.y > top + 2 && nx + 5 > p.x && nx - 5 < p.x + p.w) { const mid = p.x + p.w / 2, away = Math.sign(nx - h.x) === Math.sign(h.x - mid); if (!away) blocked = true; } } if (G.bounds && ((nx < G.bounds[0] && nx < h.x) || (nx > G.bounds[1] && nx > h.x))) blocked = true;
  if (!blocked) { const dx = nx - h.x; h.x = nx; if (h.ground) h.dist += Math.abs(dx); } else h.vx = 0;
  const prevY = h.y; h.y += h.vy * dt; const fl = floorAt(L, h.x, h.y, prevY, !(inp && Input.down('down') && Input.hit('jump')));
  if (L.gap && h.x > L.gap[0] + 4 && h.x < L.gap[1] - 4 && fl >= groundY(L, h.x)) { /* the stream: only the bridge holds you */ }
  const wasAir = !h.ground; if (h.y >= fl && h.vy >= 0) { h.y = fl; if (wasAir && h.vy > 150) { Audio.sfx('land'); dustPuff(h.x, h.y, 4); h.landT = 0.18; if (h.vy > 330) rumbleFx('land'); } h.vy = 0; h.ground = true; } else if (h.y < fl - 1) h.ground = false;
  if (h.landT > 0) h.landT -= dt;
  // steps: a soft footfall at each planted foot
  if (h.ground && Math.abs(h.vx) > 20) { const s = strideOf('run') / 2, k = Math.floor(h.dist / s); if (k !== h.stepK) { h.stepK = k; Audio.sfx('step', 0.7); if (Math.random() < 0.3) dustPuff(h.x - h.face * 4, h.y, 1); } }
  // actions
  if (inp && h.state === 'free' && h.hasClub && Input.hit('atk') && !(G.nearTalk && Input.device === 'pad') && !(h.cool > 0)) { h.state = 'club'; setAnim(h, h.weapon === 'xiphos' ? 'slash' : 'club'); h.hitDone = false; h.cool = 0.5; Audio.sfx('swing'); rumbleFx('swing'); }
  if (h.state === 'club') { const t = h.at / 0.46; if (t > 0.38 && !h.hitDone) { h.hitDone = true; meleeHit(h.x + h.face * 19, h.y - 19, 40, 42, 1, h.face); } if (h.at >= 0.46) { h.state = 'free'; h.habit = null; h.habitAt = NOW.t + 3; if (h.ground) setAnim(h, h.restAnim || 'idle'); } }
  if (inp && h.state === 'free' && h.hasSling && Input.hit('shoot') && !(h.cool > 0)) { h.state = 'sling'; setAnim(h, 'sling'); h.charge = 0; h.thrown = false; }
  if (h.state === 'sling') { // one press, one throw: a single whirl and release, however long the button is held
    if (h.at > 0.12 && h.at - dt <= 0.12) Audio.sfx('whirl'); if (h.at > 0.33 && !h.thrown) { h.thrown = true; throwStone(h, 0.5); } if (h.at >= 0.56) { h.state = 'free'; h.cool = 0.25; h.habit = null; h.habitAt = NOW.t + 3; if (h.ground) setAnim(h, h.restAnim || 'idle'); } }
  // animation
  if (h.state === 'free') { if (!h.ground) setAnim(h, h.vy < -60 ? 'jumpUp' : h.vy < 80 ? 'jumpTop' : 'jumpDown', true); else if (h.landT > 0) setAnim(h, 'land'); else if (Math.abs(h.vx) > 62) setAnim(h, 'run', true); else if (Math.abs(h.vx) > 4) setAnim(h, 'walk', true); else if (!h.habit) { if (['run', 'walk', 'jumpUp', 'jumpTop', 'jumpDown', 'land', 'club', 'slash', 'sling', 'hurt', 'eye', 'drink', 'pick'].includes(h.anim)) setAnim(h, h.restAnim || 'idle'); if (!G.script && !G.dialog) lifeTick(h, dt); } }
  if (h.state !== 'free' || G.script) { if (h.habit) { h.habit = null; if (G.script) setAnim(h, h.restAnim || 'idle'); } }
  // the Owl's Eye
  if (inp && h.hasEye && Input.hit('eye') && G.eyeT <= 0) toggleWorld();
  if (h.hasEye) { if (G.world === 'g') { G.ichor -= dt * (G.ichorDrain ?? 1); if (G.ichor <= 0) { G.ichor = 0; toggleWorld(); } } else G.ichor = Math.min(G.ichorMax, G.ichor + dt * 0.5); }
  if (!G.dialog) checkTouch(h); }
function hurtHero(dmg, from) { const h = G.hero; if (h.flash > 0 || G.dialog || h.state === 'dead') return; h.hp -= dmg; h.flash = Save.d.heroic ? 0.75 : 1.1; h.state = 'hurt'; setAnim(h, 'hurt'); h.vx = -Math.sign(from - h.x || 1) * 150; h.vy = -150; h.ground = false; Audio.sfx('hurt'); rumble(160, 0.6, 0.4); G.shake = 0.25;
  if (h.hp <= 0) heroDown(); }
function heroDown() { const h = G.hero; h.state = 'dead'; rumbleFx('mercy'); G.fade = { t: 0, dur: 1.2, then: () => { h.hp = HEROS.maxHp; h.state = 'free'; h.flash = 1.5; h.x = G.check ? G.check.x : 60; h.y = groundY(G.L, h.x); h.vx = h.vy = 0; for (const a of G.actors) if (a.foe && a.alive) { a.x = a.x0; a.hp = a.maxHp || 3; a.mem = {}; }
    let k = 0; for (const a of G.actors) if (!a.foe && a !== h && (a.brain === 'follow' || a.name === 'mentor' || a.name === 'argos')) { a.x = h.x - h.face * (22 + 16 * k++); a.y = floorAt(G.L, a.x, a.y - 40, a.y + 60); a.goal = null; a.scripted = false; a.habit = null; a.face = h.face; if (a.stay) a.stay = Math.max(a.stay, a.x); standStill(a); } // companions start beside him again
    bark(h, tr(LINES.mercy)); } }; }
// ── projectiles and hits ──
function throwStone(h, ch) { rumbleFx('slingLoose'); const sp = 250 + ch * 150, x0 = h.x + h.face * 12, y0 = h.y - 40, g = G.world === 'g' ? 60 : 380; let vy = -70 - ch * 30;
  // a gentle aim assist: the nearest pot or foe ahead (within reach) gets an arc that lands on it
  const cands = [...G.objs.filter((o) => o.breakable && !o.broken).map((o) => ({ x: o.x, y: o.y - o.h * 0.5 })), ...G.actors.filter((a) => a.foe && a.alive && !a.ghostNow).map((a) => ({ x: a.x, y: a.y - a.h * 0.5 }))].filter((q) => (q.x - x0) * h.face > 14 && (q.x - x0) * h.face < 260 && Math.abs(q.y - y0) < 80).sort((p, q) => Math.abs(p.x - x0) - Math.abs(q.x - x0));
  if (cands.length) { const q = cands[0], t = Math.abs(q.x - x0) / sp; vy = clamp((q.y - y0 - 0.5 * g * t * t) / t, -220, 60); }
  G.proj.push({ x: x0, y: y0, vx: h.face * sp, vy, life: 1.4, dmg: ch > 0.7 ? 2 : 1, god: G.world === 'g' }); Audio.sfx('shoot'); }
function projTick(dt) { for (const p of G.proj) { p.vy += (p.god ? 60 : 380) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; if (p.y > groundY(G.L, p.x)) { p.life = 0; dustPuff(p.x, groundY(G.L, p.x), 2); Audio.sfx('step'); const o = G.objs.find((q) => q.breakable && !q.broken && Math.abs(q.x - p.x) < 12); if (o) breakObj(o); }
    for (const a of G.actors) if (a.foe && a.alive && !a.ghostNow && Math.abs(a.x - p.x) < a.w && p.y > a.y - a.h && p.y < a.y + 2) { p.life = 0; damage(a, p.dmg, Math.sign(p.vx)); break; }
    for (const o of G.objs) if (o.breakable && !o.broken && Math.abs(o.x - p.x) < 11 && p.y > o.y - o.h - 5 && p.y < o.y + 3) { p.life = 0; breakObj(o); break; } }
  G.proj = G.proj.filter((p) => p.life > 0); }
function meleeHit(cx, cy, w, h, dmg, dir) { for (const a of G.actors) if (a.foe && a.alive && !a.ghostNow && Math.abs(a.x - cx) < w / 2 + a.w / 2 && a.y - a.h < cy + h / 2 && a.y > cy - h / 2) damage(a, dmg, dir); for (const o of G.objs) if (o.breakable && !o.broken && Math.abs(o.x - cx) < w / 2 + 6 && o.y - o.h < cy + h / 2) breakObj(o); }
function damage(a, dmg, dir) { a.hp -= dmg; a.flash = 0.25; a.kx = dir * 120; Audio.sfx('hit'); spark(a.x, a.y - a.h * 0.6, 6); rumble(80, 0.3, 0.5); G.hitStop = 0.05; if (a.hp <= 0) { a.alive = false; setAnim(a, 'down'); rumbleFx('kill'); a.busy = true; if (a.onDown) a.onDown(a); } else { setAnim(a, 'hurt'); a.mem.stun = NOW.t + 0.6; a.mem.lunge = 0; a.mem.strike = 0; a.mem.rest = NOW.t + 0.9; } }
function breakObj(o) { o.broken = true; Audio.sfx('smash'); rumbleFx('smash'); for (let i = 0; i < 10; i++) G.parts.push({ x: o.x, y: o.y - o.h / 2, vx: (Math.random() - 0.5) * 140, vy: -60 - Math.random() * 120, life: 0.9, max: 0.9, kind: 'shard', col: o.col || '#b8643a', g: 500 }); if (o.onBreak) o.onBreak(o); }
// ── foes: wolves and serpents ──
BRAINS.wolf = (a, dt) => { const h = G.hero, m = a.mem; if (!a.alive) { a.vx = 0; return; } a.ghostNow = G.world === 'g'; if (a.flash > 0) a.flash -= dt; if (a.kx) { a.x += a.kx * dt; a.kx *= 0.85; if (Math.abs(a.kx) < 5) a.kx = 0; }
  if (m.stun && NOW.t < m.stun) return; const d = h.x - a.x, sees = G.world === 'm' && Math.abs(d) < 170 && h.state !== 'dead' && !G.dialog && !G.script;
  if (m.lunge) { const k = (NOW.t - m.lunge) / 0.5; if (k < 1) { a.x += a.face * 150 * dt * (k < 0.6 ? 1 : 0.3); a.dist += 150 * dt; if (k > 0.25 && k < 0.6 && Math.abs(h.x - a.x) < 18 && Math.abs(h.y - a.y) < 30) hurtHero(1, a.x); return; } m.lunge = 0; m.rest = NOW.t + 1.25; }
  if (!sees) { if (m.alert) { m.alert = false; } if (a.habit) return; return BRAINS.wander(a, dt); }
  if (!m.alert) { m.alert = true; a.habit = null; setAnim(a, 'growl'); m.growlUntil = NOW.t + 0.7; Audio.sfx('growl'); } if (NOW.t < m.growlUntil) { a.face = Math.sign(d); return; }
  const pack = G.actors.filter((w) => w.brain === 'wolf' && w.alive && w !== a), turn = !pack.some((w) => w.mem.lunge || Math.abs(h.x - w.x) < Math.abs(d) - 4);
  if ((m.rest && NOW.t < m.rest) || !turn) { if (walkTo(a, h.x - Math.sign(d) * (turn ? 70 : 84), 40, dt)) { a.face = Math.sign(d); if (!a.habit && a.anim !== 'growl' && Math.random() < dt * 0.6) { setAnim(a, 'growl'); } } return; } if (Math.abs(d) < 46 && Math.abs(h.y - a.y) < 24) { m.lunge = NOW.t; a.face = Math.sign(d); setAnim(a, 'lunge'); Audio.sfx('growl'); return; } walkTo(a, h.x - Math.sign(d) * 30, 96, dt); };
BRAINS.serpent = (a, dt) => { const h = G.hero, m = a.mem; if (!a.alive) return; if (a.flash > 0) a.flash -= dt; if (a.kx) { a.x += a.kx * dt; a.kx *= 0.85; if (Math.abs(a.kx) < 5) a.kx = 0; } if ((m.stun && NOW.t < m.stun) || G.script || G.dialog) return; const d = h.x - a.x;
  if (m.strike) { const k = (NOW.t - m.strike) / 0.45; if (k < 1) { if (k > 0.25 && k < 0.5 && Math.abs(h.x - (a.x + a.face * 16)) < 20 && h.y > a.y - 30) hurtHero(1, a.x); return; } m.strike = 0; m.rest = NOW.t + 0.9 + Math.random() * 0.6; setAnim(a, 'idle'); }
  if (m.rest && NOW.t < m.rest) { a.face = Math.sign(d); setAnim(a, 'idle', true); return; } if (Math.abs(d) < 31) { if (a.anim !== 'rear') { setAnim(a, 'rear'); a.face = Math.sign(d); Audio.sfx('hiss'); } else if (animDone(a)) { m.strike = NOW.t; setAnim(a, 'strike'); } return; }
  walkTo(a, h.x - Math.sign(d) * 24, 46, dt, 'slither'); };
