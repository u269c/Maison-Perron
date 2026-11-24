// =====================================================================
// DE SOIF — the drunk goons and Oscar GrosVerres, barman of Le Poisson
// Blanc. Oscar throws empty glasses (bleeding, no hit damage), shakes and
// throws his shaker (a burst of bubbles: dizziness), hurls drunk goons
// (1/2 heart and poison), and drinks from his keg to heal (15 %, at most
// every 20 s, stopped by any hit or charge; break the keg to end it).
// =====================================================================
ETYPES.drunk = { hp: 8, spd: 34, reach: 20, dmg: 1, wind: .5, cd: 1.5 };
ETYPES.oscar = { hp: 120, spd: 44, reach: 30, dmg: 2, wind: .5, cd: 1.1 };
// a drunk is a soldier off duty: helmet askew, red nose, a bottle
function drunkLook(seed) { const L = makeGoonLook('trooper', seed); L.wpn = 'bottle'; L.drunk = true; const head = L.head; L.head = (c, S, p, t, o, rim) => { head(c, S, p, t, o, rim); const [x, y] = S.head, r = L.b.hr; c.fillStyle = '#e83a3a'; c.beginPath(); c.arc(x + r * .95, y + r * .15, r * .28, 0, 7); c.fill(); }; const wp = L.weapon; L.weapon = (c, S, p, t, o) => { const [hx, hy] = S.aF[2], a = S.handAng, dx = Math.sin(a), dy = Math.cos(a); limb(c, [[hx - dx * 1, hy - dy * 1], [hx + dx * 8, hy + dy * 8]], 3, '#3a7a3a'); limb(c, [[hx + dx * 8, hy + dy * 8], [hx + dx * 11, hy + dy * 11]], 1.4, '#3a7a3a'); }; return L; }
function oscarLook() {
  const L = { b: BONES(1.42, { wide: 1.55, arm: 1.55, leg: 1.3, head: 1.05, tall: 1.05 }), top: '#1a1a1e', arms: '#d8a07a', legs: '#2a4a8a', legB: '#223e74', skin: '#d8a07a', hand: '#d8a07a', boots: '#2a1a10', foot: bootFoot };
  L.torso = (c, S, tor) => { // the white apron over the black t-shirt
    poly(c, [[lerp(tor[0][0], tor[3][0], .35), lerp(tor[0][1], tor[3][1], .35)], [lerp(tor[1][0], tor[2][0], .35), lerp(tor[1][1], tor[2][1], .35)], [tor[2][0] + 2, tor[2][1] + 14], [tor[3][0] - 2, tor[3][1] + 14]], '#f4f0e8');
    c.strokeStyle = '#f4f0e8'; c.lineWidth = 1; c.beginPath(); c.moveTo(tor[0][0] + 2, tor[0][1]); c.lineTo(S.hip[0] - 3, S.hip[1] - 9); c.moveTo(tor[1][0] - 2, tor[1][1]); c.lineTo(S.hip[0] + 3, S.hip[1] - 9); c.stroke();
    c.fillStyle = '#1a1a1e'; c.fillRect(S.chest[0] - 6, S.chest[1], 12, 3); };
  L.back = (c, S) => { limb(c, [[S.chest[0] - 7, S.chest[1] + 1], [S.chest[0] + 7, S.chest[1] + 1]], 4.5, '#1a1a1e'); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, r = L.b.hr; // square head, bald, thick glasses
    poly(c, [[x - r * .95, y + r * .9], [x - r * 1.0, y - r * .85], [x + r * 1.0, y - r * .95], [x + r * 1.05, y + r * .95]], L.skin, rim);
    c.fillStyle = 'rgba(255,240,220,.6)'; c.fillRect(x - r * .5, y - r * .85, r * .8, 1.2);
    c.strokeStyle = OUT; c.lineWidth = 1.6; c.strokeRect(x + r * .05, y - r * .35, r * .55, r * .45); c.strokeRect(x + r * .65, y - r * .35, r * .5, r * .45); c.fillStyle = 'rgba(210,235,255,.85)'; c.fillRect(x + r * .05, y - r * .35, r * .55, r * .45); c.fillRect(x + r * .65, y - r * .35, r * .5, r * .45);
    eye(c, x + r * .3, y - r * .2); eye(c, x + r * .85, y - r * .2);
    c.fillStyle = '#3a1410'; if (o.shout) c.fillRect(x + r * .3, y + r * .45, r * .55, r * .35); else c.fillRect(x + r * .35, y + r * .55, r * .5, 1.2); };
  L.weapon = (c, S, p, t, o) => { const [hx, hy] = S.aF[2];
    if (o.holdGlass) { poly(c, [[hx - 3, hy - 9], [hx + 3, hy - 9], [hx + 2.4, hy], [hx - 2.4, hy]], 'rgba(220,240,255,.9)'); }
    if (o.holdShaker) { poly(c, [[hx - 3.4, hy - 12], [hx + 3.4, hy - 12], [hx + 2.6, hy + 2], [hx - 2.6, hy + 2]], '#c8c8d0'); c.fillStyle = '#9a9aa2'; c.fillRect(hx - 3, hy - 15, 6, 3); }
    if (o.holdBeer) { poly(c, [[hx - 3.5, hy - 10], [hx + 3.5, hy - 10], [hx + 3, hy + 1], [hx - 3, hy + 1]], '#f0c040'); c.fillStyle = '#ffffff'; c.fillRect(hx - 3.6, hy - 12, 7.2, 3); } };
  L.seed = 9; L.name = 'Oscar'; L.wpn = 'fists';
  return L;
}
const OSCAR = oscarLook();
const OSCAR_SAY = {
  intro: [['Bienvenue au Poisson Blanc ! La première tournée est offerte. La deuxième, c’est des coups.', 'Messieurs-dames, on ferme ! … Pour vous, en tout cas.'], ['Welcome to Le Poisson Blanc! First round’s on the house. The second round is punches.', 'Ladies and gents, we’re closing! … For you, anyway.']],
  glass: [['Il est vide, celui-là !', 'Un verre ? Tenez !', 'Attrapez !'], ['This one’s empty!', 'Fancy a glass? Here!', 'Catch!']],
  shaker: [['Cocktail maison !', 'Bien secoué, pas remué !', 'Spécialité du chef !'], ['House cocktail!', 'Shaken, not stirred!', 'Chef’s special!']],
  goon: [['Gaston, au service !', 'Livraison !', 'Un client pour vous !', 'Celui-là a trop bu !'], ['Gaston, on duty!', 'Delivery!', 'A customer for you!', 'This one’s had too much!']],
  drink: [['À la vôtre !', 'Santé !', 'Une petite mousse…'], ['Cheers!', 'Bottoms up!', 'Just a little froth…']],
  stopped: [['Hé ! On ne dérange pas un barman qui boit !', 'Ma bière !', 'Pas pendant ma pause !'], ['Hey! Never bother a barman while he drinks!', 'My beer!', 'Not on my break!']],
  keg: [['MON TONNEAU ! Vous êtes des monstres !', 'Il était plein !'], ['MY KEG! You monsters!', 'It was full!']]
};
const oSay = (k) => { const v = OSCAR_SAY[k], i = (Math.random() * v[0].length) | 0; return LANG === 'en' ? v[1][i] : v[0][i]; };
// soldiers spawned on De Soif: drunks get their own look; Oscar comes out from behind the bar
function soifSpawn(e, from) {
  if (e.type === 'drunk') { e.look = drunkLook(SEEDN++); e.sway = Math.random() * 6; }
  if (e.type === 'oscar') { e.look = OSCAR; e.x = scr.barX || camX + VW * .8; e.z = 20; e.y = 0; e.state = 'intro'; e.inv = 99; e.healCD = 8; e.ot = 0; WORLD.boss = e; WORLD.oscar = e; }
}
function updateOscar(e, dt) {
  const p = targetOf(e); e.ot += dt; e.healCD -= dt; e.cd -= dt;
  if (e.state === 'kneel') return;
  if (e.state === 'intro') { e.face = -1; if (e.ot > 2.6) { e.state = 'walk'; e.inv = 0; e.cd = 1.2; } return; }
  if (!p) return; const dx = p.x - e.x, dz = p.z - e.z;
  // drinking: 2 s at the keg, interrupted by any hit
  if (e.state === 'drink') { e.t2 -= dt; e.face = 1; if (e.t2 <= 0) { e.hp = Math.min(e.max, e.hp + e.max * .15); fx.push({ k: 'plus', x: e.x, z: e.z, t: 1 }); pop(e.x, e.z, 110, '+15 %', '#7dffc0'); e.state = 'walk'; e.healCD = 20; e.cd = .8; beep(500, .3, 'triangle', .05, 300); } return; }
  if (e.state === 'goTo') { e.goal.x = Math.max(camX + 36, Math.min(camX + VW - 36, e.goal.x)); const tx = e.goal.x, tz = e.goal.z, mx = Math.abs(tx - e.x) > 6 ? Math.sign(tx - e.x) : 0, mz = Math.abs(tz - e.z) > 4 ? Math.sign(tz - e.z) : 0; e.x += mx * 70 * dt; e.z += mz * 40 * dt; if (mx || mz) { e.walk += dt * 9; e.mv = 1; e.face = mx || e.face; }
    if (!mx && !mz) { if (e.goal.kind === 'keg') { const keg = BREAK.find(b => b.k === 'keg'); if (keg) { e.state = 'drink'; e.t2 = 2; quip(e, oSay('drink'), 2); } else e.state = 'walk'; }
      else if (e.goal.kind === 'goon') { const gn = e.goal.goon; if (gn && !gn.dead && Math.abs(gn.x - e.x) < 30) { e.state = 'wind'; e.act = 'goon'; e.t2 = .45; e.held = gn; gn.heldBy = e; } else e.state = 'walk'; } }
    e.goalT = (e.goalT || 0) + dt; if (e.goalT > 3) { e.state = 'walk'; e.goalT = 0; } return; }
  if (e.state === 'wind') { e.t2 -= dt; e.face = Math.sign(dx) || e.face; if (e.held) { e.held.x = e.x + e.face * 4; e.held.z = e.z; e.held.y = 60; }
    if (e.t2 <= 0) { oscarThrow(e, p); e.state = 'strike'; e.t2 = .3; } return; }
  if (e.state === 'strike') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'walk'; e.cd = .9 + Math.random() * .8; } return; }
  // walking: keep a throwing distance, punch when someone gets in close
  e.face = Math.sign(dx) || e.face; const want = Math.abs(dx) < 50 ? -1 : Math.abs(dx) > 190 ? 1 : 0; const mx = want * Math.sign(dx), mz = Math.abs(dz) > 6 ? Math.sign(dz) : 0;
  if (!inView(e, 34)) { const tw = Math.sign(camX + VW / 2 - e.x); e.x += tw * ETYPES.oscar.spd * 1.6 * dt; e.face = tw; e.walk += dt * 9; e.mv = 1; e.cd = Math.max(e.cd, .5); return; }   // off screen: come back in before anything else
  const nx = e.x + mx * ETYPES.oscar.spd * dt; if (nx > camX + 30 && nx < camX + VW - 30) e.x = nx; e.z = Math.max(0, Math.min(DEPTH, e.z + mz * 26 * dt)); if (mx || mz) { e.walk += dt * 8; e.mv = 1; }
  if (e.cd > 0) return;
  const keg = BREAK.find(b => b.k === 'keg');
  if (keg && e.healCD <= 0 && e.hp < e.max * .75) { e.state = 'goTo'; e.goal = { kind: 'keg', x: keg.x - 26, z: keg.z }; e.goalT = 0; return; }
  if (Math.abs(dx) < 46 && Math.abs(dz) < 12) { e.state = 'wind'; e.act = 'punch'; e.t2 = .45; return; }
  const r = Math.random(), goons = enemies.filter(o => o.type === 'drunk' && !o.dead && o.state !== 'drop' && !o.heldBy && Math.abs(o.x - e.x) < 220);
  if (r < .28 && goons.length) { const gn = goons[(Math.random() * goons.length) | 0]; e.state = 'goTo'; e.goal = { kind: 'goon', goon: gn, x: gn.x - Math.sign(gn.x - e.x || 1) * 20, z: gn.z }; e.goalT = 0; return; }
  if (r < .5) { e.state = 'wind'; e.act = 'shaker'; e.t2 = .8; quip(e, oSay('shaker'), 1.6); return; }
  e.state = 'wind'; e.act = 'glass'; e.t2 = .4; if (Math.random() < .35) quip(e, oSay('glass'), 1.4);
}
function oscarThrow(e, p) { if (e.act !== 'punch' && !inView(e, 20)) { if (e.held) { e.held.heldBy = null; e.held.y = 0; e.held = null; } return; }
  const dx = p.x - e.x, T = Math.max(.35, Math.min(.9, Math.abs(dx) / 260));
  if (e.act === 'punch') { for (const q of players) if (q.ko <= 0 && Math.abs(q.z - e.z) < 14 && (q.x - e.x) * e.face > -6 && Math.abs(q.x - e.x) < 54 && Math.abs(q.y - e.y) < 40) hitPlayer(q, 2, e.face, e); WORLD.shake = 4; return; }
  if (e.act === 'glass') { fx.push({ k: 'glass', x: e.x + e.face * 14, z: e.z, y: 60, vx: e.face * 300, vz: (p.z - e.z) * .9, t: 2, from: e, rot: 0 }); beep(900, .06, 'triangle', .03, -200); return; }
  if (e.act === 'shaker') { fx.push({ k: 'shaker', x: e.x + e.face * 12, z: e.z, y: 64, vx: dx / T, vz: (p.z - e.z) / T, vy: 220, t: 3, from: e, rot: 0 }); beep(600, .08, 'square', .03, 300); return; }
  if (e.act === 'goon' && e.held) { const gn = e.held; gn.heldBy = null; e.held = null; const idx = enemies.indexOf(gn); if (idx >= 0) enemies.splice(idx, 1); fx.push({ k: 'goonball', x: e.x + e.face * 10, z: e.z, y: 64, vx: dx / T, vz: (p.z - e.z) / T, vy: 200, t: 3, from: e, goon: gn, rot: 0 }); quip(e, oSay('goon'), 1.6); beep(160, .2, 'sawtooth', .05, 200); }
}
function oscarHit(e, src) { // any hit or charge stops the drinking
  if (e.state === 'drink') { e.state = 'walk'; e.healCD = 20; e.cd = .6; quip(e, oSay('stopped'), 1.8); pop(e.x, e.z, 110, LANG === 'fr' ? 'INTERROMPU !' : 'INTERRUPTED!', '#ffd23f'); }
  if (e.state === 'goTo' && e.goal && e.goal.kind === 'keg' && Math.random() < .3) e.state = 'walk';
}
function oscarKeg() { if (WORLD.oscar && !WORLD.oscar.dead && WORLD.oscar.state !== 'kneel') quip(WORLD.oscar, oSay('keg'), 2); }
// projectiles; dodge them with the back-dodge; they hit whoever they meet
function soifFx(f, dt) {
  if (f.k === 'glass') { f.x += f.vx * dt; f.z = Math.max(0, Math.min(DEPTH, f.z + f.vz * dt)); f.rot += dt * 14;
    for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < 10 && Math.abs(q.z - f.z) < 10 && q.y < 60) { if (q.dodge > 0) { hitPlayer(q, 0, 0, null); continue; } if (q.inv <= 0) { addStatus(q, 'bleed'); q.inv = .3; shardBurst(f); f.t = 0; } }
    if (blocked(f.x, f.z, f.y)) { shardBurst(f); f.t = 0; } return true; }
  if (f.k === 'shaker' || f.k === 'goonball') { f.x += f.vx * dt; f.z = Math.max(0, Math.min(DEPTH, f.z + f.vz * dt)); f.vy -= GRAV * dt; f.y += f.vy * dt; f.rot += dt * (f.k === 'shaker' ? 16 : 7);
    let hitQ = null; for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < (f.k === 'goonball' ? 16 : 10) && Math.abs(q.z - f.z) < 12 && f.y < q.y + 56 && f.y > q.y - 4) hitQ = q;
    if (hitQ && hitQ.dodge > 0) { hitPlayer(hitQ, 0, 0, null); hitQ = null; }
    if (hitQ || f.y <= 0) { f.t = 0;
      if (f.k === 'shaker') { fx.push({ k: 'bubbles', x: f.x, z: f.z, t: .8, r: 0 }); for (const q of players) if (q.ko <= 0 && q.dodge <= 0 && Math.abs(q.x - f.x) < 36 && Math.abs(q.z - f.z) < 22) addStatus(q, 'dizzy'); beep(1200, .2, 'sine', .04, -900); INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'PLOUF-PSCHHH !' : 'FIZZ-POP!', x: (f.x - camX) * 1.5, y: sy(f.z, 30) * 1.5, size: 22, t: 0, rot: -.1 }); }
      else { if (hitQ) { hitPlayer(hitQ, 1, Math.sign(f.vx), null); addStatus(hitQ, 'poison'); } const gn = f.goon; gn.x = f.x + Math.sign(f.vx) * 12; gn.z = f.z; gn.y = 0; gn.vy = 0; gn.state = 'walk'; gn.getup = .8; gn.react = { k: 'flail', t: .6 }; enemies.push(gn); dustAt(f.x, f.z); WORLD.shake = 5; inkHit(f.x, f.z, 30, true); } }
    return true; }
  if (f.k === 'bubbles') { f.r = (1 - f.t / .8) * 40; return true; }
  return false;
}
function shardBurst(f) { for (let k = 0; k < 6; k++) fx.push({ k: 'debris', x: f.x, z: f.z, y: Math.max(4, f.y), vx: (Math.random() - .5) * 160, vy: 60 + Math.random() * 100, rot: 0, vr: 12, t: .8, col: '#d8f0ff', w: 2 }); beep(1800, .05, 'square', .03, -800); }
function drawSoifFx(f) {
  const x = f.x - camX, y = sy(f.z, f.y || 0);
  if (f.k === 'glass') { g.save(); g.translate(x, y); g.rotate(f.rot); poly(g, [[-3, -5], [3, -5], [2.4, 4], [-2.4, 4]], 'rgba(220,240,255,.95)'); g.restore(); g.fillStyle = 'rgba(20,10,10,.25)'; g.fillRect(x - 3, sy(f.z, 0), 6, 1.5); return true; }
  if (f.k === 'shaker') { g.save(); g.translate(x, y); g.rotate(f.rot); poly(g, [[-3.6, -7], [3.6, -7], [2.6, 7], [-2.6, 7]], '#c8c8d0'); g.fillStyle = '#9a9aa2'; g.fillRect(-3, -10, 6, 3); g.restore(); g.fillStyle = 'rgba(20,10,10,.25)'; g.fillRect(x - 4, sy(f.z, 0), 8, 1.5); return true; }
  if (f.k === 'goonball') { const gn = f.goon; g.save(); g.translate(x, y); g.rotate(f.rot); drawRig(g, 0, 20, Math.sign(f.vx) || 1, RIG_S, gn.look, POSES.flail(time), time, {}); g.restore(); g.fillStyle = 'rgba(20,10,10,.3)'; g.beginPath(); g.ellipse(x, sy(f.z, 0), 12, 3, 0, 0, 7); g.fill(); return true; }
  if (f.k === 'bubbles') { for (let k = 0; k < 14; k++) { const a = k * 2.4, rr2 = f.r * (.4 + (k % 4) * .2); g.strokeStyle = `rgba(200,240,255,${f.t})`; g.fillStyle = `rgba(230,250,255,${f.t * .4})`; g.beginPath(); g.arc(x + Math.cos(a) * rr2, sy(f.z, 14 + (k % 5) * 6 + (1 - f.t) * 30), 2 + (k % 3), 0, 7); g.fill(); g.stroke(); } return true; }
  return false;
}
// how Oscar and the drunks move
function soifPose(e) {
  const t = time;
  if (e.type === 'oscar') {
    if (e.state === 'kneel') return POSES.kneel(t);
    if (e.state === 'intro') return e.ot < 1.6 ? POSES.chat(t) : POSES.flex(t);
    if (e.state === 'drink') { const q = POSES.idle(t, 2); q.aF = [2.7, 2.4]; q.sp = -.2; q.nk = -.5; return q; }
    if (e.state === 'wind') { const s = 1 - Math.max(0, e.t2) / (e.act === 'shaker' ? .8 : .45); if (e.act === 'shaker') { const q = POSES.idle(t, 1); q.aF = [2.4 + Math.sin(t * 30) * .5, .6]; q.aB = [2.2 + Math.cos(t * 30) * .5, .6]; return q; } if (e.act === 'goon') return POSES.windHeavy(s); if (e.act === 'punch') return POSES.windMelee(s); return POSES.windMelee(s * .7); }
    if (e.state === 'strike') return e.act === 'punch' ? POSES.strikeMelee(1 - e.t2 / .3) : POSES.strikeHeavy(1 - e.t2 / .3);
    if (e.mv) return POSES.walk(e.walk / 9, .8);
    return Math.sin(t * .9) > .7 ? POSES.flex(t) : POSES.guard(t, 2);
  }
  return null;
}
function drunkSway(e, pose) { if (e.type !== 'drunk' || e.dead) return pose; pose.rot = (pose.rot || 0) + Math.sin(time * 2.2 + e.sway) * .12; pose.nk = (pose.nk || 0) + Math.sin(time * 1.7 + e.sway) * .2; if (Math.sin(time * .9 + e.sway * 3) > .985) { e.react = { k: 'flinch', t: .4 }; if (Math.random() < .3) quip(e, LANG === 'fr' ? '*hic*' : '*hic*', 1); } return pose; }
