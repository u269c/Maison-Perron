// =====================================================================
// LOOKS — the villains, the court, and how every fighter is drawn and
// animated in play: poses picked from state, smoothed, plus fidgets.
// =====================================================================
function villenLook() { // Lord Villen-Hüüs: tall, old, a long-winded tyrant with a gold monocle
  const L = { b: BONES(1.4, { wide: 1.15, tall: 1.18, head: 1.1, leg: 1.05 }), top: '#2a1a2e', arms: '#2a1a2e', legs: '#1a1020', legB: '#140c18', skin: '#dcc4ac', hand: '#c8963a', boots: '#0c080a', foot: bootFoot };
  L.behind = (c, S, p, t, o) => { const fl = o.flow || 0, w = Math.sin(t * 2.5) * 2; poly(c, [[S.chest[0] - 7, S.chest[1] - 1], [S.chest[0] + 3, S.chest[1] - 2], [S.hip[0] - 6 - fl * 8 + w, S.fB[1] - 2], [S.hip[0] - 22 - fl * 16 + w, S.fB[1] - 6]], '#7a1418'); c.strokeStyle = '#c8963a'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(S.hip[0] - 6 - fl * 8 + w, S.fB[1] - 2); c.lineTo(S.hip[0] - 22 - fl * 16 + w, S.fB[1] - 6); c.stroke(); };
  L.torso = (c, S, tor, p, t, o) => { c.strokeStyle = '#c8963a'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(tor[0][0], tor[0][1]); c.lineTo(tor[3][0], tor[3][1]); c.moveTo(tor[1][0], tor[1][1]); c.lineTo(tor[2][0], tor[2][1]); c.stroke();
    c.fillStyle = '#c8963a'; c.fillRect(S.hip[0] - 7, S.hip[1] - 5, 14, 3);
    // the clock-gear medallion: it glows when he has a piece
    const g0 = o.gear ? .6 + Math.sin(t * 6) * .4 : .25; c.fillStyle = `rgba(255,${200 + g0 * 50 | 0},80,${.5 + g0 * .5})`; c.beginPath(); for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2 + t * (o.gear ? 2 : .2), r = k % 2 ? 2.6 : 3.6; c.lineTo(S.chest[0] + 1 + Math.cos(a) * r, S.chest[1] + 7 + Math.sin(a) * r); } c.fill();
    // high collar spikes
    poly(c, [[S.chest[0] - 6, S.chest[1] + 1], [S.chest[0] - 8, S.chest[1] - 8], [S.chest[0] - 2, S.chest[1] - 1]], '#3a2440'); poly(c, [[S.chest[0] + 4, S.chest[1]], [S.chest[0] + 8, S.chest[1] - 8], [S.chest[0] + 7, S.chest[1] + 1]], '#3a2440'); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, r = L.b.hr; disc(c, x, y, r, L.skin, rim);
    c.fillStyle = '#e8e4dc'; c.beginPath(); c.arc(x - r * .7, y - r * .1, r * .45, 0, 7); c.fill(); // side hair, bald on top
    poly(c, [[x - r * .7, y - r * .75], [x - r * .45, y - r * 1.55], [x - r * .15, y - r * .95], [x + r * .2, y - r * 1.6], [x + r * .45, y - r * .95], [x + r * .75, y - r * 1.5], [x + r * .9, y - r * .7]], '#5a5a62'); // iron crown
    const sh = o.shout ? 1 : 0; c.fillStyle = '#3a1410'; if (sh) c.fillRect(x + r * .35, y + r * .45, r * .5, r * .35);
    // the handlebar moustache, curled at both ends
    c.strokeStyle = '#f4f0ea'; c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + r * .55, y + r * .35); c.quadraticCurveTo(x + r * 1.5, y + r * .5, x + r * 1.35, y - r * .1); c.moveTo(x + r * .55, y + r * .35); c.quadraticCurveTo(x - r * .2, y + r * .75, x - r * .05, y + r * .1); c.stroke();
    eye(c, x + r * .55, y - r * .2); c.strokeStyle = '#e8b84a'; c.lineWidth = 1; c.beginPath(); c.arc(x + r * .6, y - r * .15, r * .32, 0, 7); c.stroke(); c.beginPath(); c.moveTo(x + r * .6, y + r * .15); c.lineTo(x + r * .3, y + r * 1.2); c.stroke();
    c.fillStyle = '#9a8070'; c.fillRect(x + r * .3, y - r * .55, r * .6, 1.2); };
  L.weapon = (c, S, p, t, o) => { if (!o.gear && !o.cane) return; const [hx, hy] = S.aF[2];
    if (o.gear) { const g0 = .6 + Math.sin(t * 7) * .4; c.fillStyle = `rgba(255,220,120,${.35 * g0})`; c.beginPath(); c.arc(hx, hy - 4, 10, 0, 7); c.fill(); c.fillStyle = '#ffd86a'; c.beginPath(); for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2 + t, r = k % 2 ? 3.4 : 4.8; c.lineTo(hx + Math.cos(a) * r, hy - 4 + Math.sin(a) * r); } c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); c.fillStyle = '#8a5a1a'; c.beginPath(); c.arc(hx, hy - 4, 1.4, 0, 7); c.fill(); }
    if (o.cane) { const a = S.handAng; limb(c, [[hx, hy], [hx + Math.sin(a) * 18, hy + Math.cos(a) * 18]], 1.6, '#1a1014'); disc(c, hx, hy, 2.4, '#c8963a'); } };
  return L;
}
function madameLook() { // Madame Metal Face: tiny, black dress, short hair, glasses. Silent. Takes notes.
  const L = { b: BONES(.74, { wide: .8, head: 1.12, leg: .8, arm: .8 }), top: '#141014', arms: '#141014', legs: '#2a2428', legB: '#201a1e', skin: '#cfd2d8', hand: '#cfd2d8', boots: '#0a0808', foot: (c, f, k, col) => { c.fillStyle = OUT; c.fillRect(f[0] - 2, f[1] - 2.5, 6, 3); c.fillStyle = col; c.fillRect(f[0] - 1, f[1] - 2, 4, 2); } };
  L.legFront = (c, S) => { const by = Math.min(S.kF[1], S.kB[1]) + 2; poly(c, [[S.hip[0] - 5, S.hip[1] - 3], [S.hip[0] + 5, S.hip[1] - 3], [S.hip[0] + 8, by], [S.hip[0] - 8, by]], '#141014'); };
  L.torso = (c, S) => { c.fillStyle = '#d8dce4'; c.fillRect(S.chest[0] + .5, S.chest[1] + .5, 2, 2); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, r = L.b.hr; disc(c, x, y, r, L.skin, rim);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(x + r * .2, y + r * .2, r * .5, 1); // the metallic sheen on her cheek
    poly(c, [[x - r * 1.1, y + r * .55], [x - r * 1.1, y - r * .5], [x - r * .3, y - r * 1.15], [x + r * .7, y - r * 1.05], [x + r * 1.05, y - r * .4], [x + r * .2, y - r * .55], [x - r * .3, y + r * .55]], '#0c0a0c', rim); // the black bob
    c.strokeStyle = '#b8c0cc'; c.lineWidth = 1; c.beginPath(); c.arc(x + r * .55, y - r * .05, r * .3, 0, 7); c.stroke(); c.fillStyle = 'rgba(200,220,255,.5)'; c.beginPath(); c.arc(x + r * .55, y - r * .05, r * .26, 0, 7); c.fill();
    eye(c, x + r * .55, y - r * .1); if (o.smile) { c.strokeStyle = '#5a2a30'; c.lineWidth = .8; c.beginPath(); c.arc(x + r * .5, y + r * .35, r * .25, .3, 2.6); c.stroke(); } };
  L.weapon = (c, S, p, t) => { const [hx, hy] = S.aF[2]; poly(c, [[hx - 1, hy - 7], [hx + 6, hy - 7], [hx + 6, hy + 2], [hx - 1, hy + 2]], '#a8784a'); c.fillStyle = '#f4f0e8'; c.fillRect(hx, hy - 6, 5, 7); c.fillStyle = '#3a3a3a'; for (let k = 0; k < 3; k++) c.fillRect(hx + .8, hy - 4.5 + k * 2, 3 - (k === 2 ? 1 : 0), .6); };
  return L;
}
function emperorLook() { // Emperor D'Justeece: white and gold, a laurel, and the scales of justice
  const L = { b: BONES(1.3, { wide: 1.3, head: 1.05 }), top: '#efe8da', arms: '#efe8da', legs: '#efe8da', legB: '#d8d0c0', skin: '#c89a78', hand: '#c89a78', boots: '#c8963a', foot: bootFoot };
  L.legFront = (c, S) => { const by = Math.max(S.fF[1], S.fB[1]) - 1; poly(c, [[S.hip[0] - 7, S.hip[1] - 4], [S.hip[0] + 7, S.hip[1] - 4], [S.hip[0] + 11, by], [S.hip[0] - 11, by]], '#efe8da'); c.fillStyle = '#c8963a'; c.fillRect(S.hip[0] - 11, by - 2, 22, 2); };
  L.torso = (c, S, tor) => { c.strokeStyle = '#6a2a7a'; c.lineWidth = 3; c.beginPath(); c.moveTo(tor[0][0] + 1, tor[0][1] + 1); c.lineTo(tor[2][0] - 1, tor[2][1] - 2); c.stroke(); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, r = L.b.hr; disc(c, x, y, r, L.skin, rim); poly(c, [[x - r * .3, y + r * .2], [x + r * 1.05, y + r * .3], [x + r * .8, y + r * 1.9], [x, y + r * 2.3], [x - r * .6, y + r * 1.2]], '#f6f2ea'); eye(c, x + r * .5, y - r * .15); if (o.shout) { c.fillStyle = '#3a1410'; c.fillRect(x + r * .4, y + r * .45, r * .4, r * .3); }
    for (let k = 0; k < 7; k++) { const a = Math.PI + k * .45 - .2; c.fillStyle = k % 2 ? '#7aa04a' : '#5a8a3a'; c.beginPath(); c.ellipse(x + Math.cos(a) * r * .95, y + Math.sin(a) * r * .95, 2.4, 1.2, a + 1.2, 0, 7); c.fill(); } };
  L.weapon = (c, S, p, t) => { const [hx, hy] = S.aF[2]; limb(c, [[hx, hy + 6], [hx, hy - 18]], 1.4, '#c8963a'); c.strokeStyle = '#c8963a'; c.lineWidth = 1.2; const tilt = Math.sin(t * 1.3) * 2; c.beginPath(); c.moveTo(hx - 9, hy - 16 + tilt); c.lineTo(hx + 9, hy - 16 - tilt); c.stroke(); for (const sd of [-1, 1]) { const px = hx + sd * 9, py = hy - 16 - sd * tilt; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 3, py + 7); c.moveTo(px, py); c.lineTo(px + 3, py + 7); c.stroke(); c.fillStyle = '#e8c060'; c.beginPath(); c.ellipse(px, py + 7, 4, 1.4, 0, 0, 7); c.fill(); } };
  return L;
}
function commanderLook() { // Commandant Bourrasque: grey wool, red beret, a moustache like a hedge
  const L = { b: BONES(1.1, { wide: 1.2 }), top: '#5a6068', arms: '#5a6068', legs: '#3a3e44', legB: '#30343a', skin: '#d0987a', boots: '#14100c', foot: bootFoot };
  L.torso = (c, S) => { c.fillStyle = '#c8963a'; for (let k = 0; k < 3; k++) c.fillRect(S.chest[0] + 2, S.chest[1] + 3 + k * 3, 1.6, 1.6); c.fillStyle = '#a8302a'; c.fillRect(S.chest[0] - 4, S.chest[1] + 2, 3, 2); c.fillStyle = '#3a6a9a'; c.fillRect(S.chest[0] - 4, S.chest[1] + 4.5, 3, 2); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, r = L.b.hr; disc(c, x, y, r, L.skin, rim); poly(c, [[x - r * 1.1, y - r * .4], [x - r * .8, y - r * 1.2], [x + r * .6, y - r * 1.25], [x + r * 1.2, y - r * .7], [x + r * .2, y - r * .55]], '#b8282a', rim); eye(c, x + r * .5, y - r * .15); c.fillStyle = '#8a8a8a'; c.fillRect(x + r * .2, y + r * .3, r * .95, r * .35); if (o.shout) { c.fillStyle = '#3a1410'; c.fillRect(x + r * .4, y + r * .62, r * .4, r * .25); } };
  return L;
}
const VILLEN = villenLook(), MADAME = madameLook(), EMPEROR = emperorLook(), COMMANDER = commanderLook();
VILLEN.seed = 3; VILLEN.wpn = 'staff'; VILLEN.name = 'Villen-Hüüs';
const HERO_LOOK = {}; const hlook = id => HERO_LOOK[id] || (HERO_LOOK[id] = heroLook(id));
const NONRIG = { papi: 1, spora: 1, bernache: 1 };
// draws any hero: humans on the skeleton, Papi, Spora and Bernache with their own drawers
function drawHero(c, id, x, y, face, s, pose, t, o = {}) {
  if (NONRIG[id]) {
    const k = s * .8, lie = pose.lie || 0, st = { walk: o.walk ?? t * 6, speed: o.speed ?? 0, atk: o.atk, air: pose.air, idle: o.idle || (o.speed ? null : 'peck'), rocket: o.rocket };
    c.save(); if (lie) { c.translate(x, y - 6); c.rotate(-Math.PI / 2 * face * lie); c.translate(-x, -y); } if (o.alpha !== undefined) c.globalAlpha = o.alpha;
    if (id === 'papi') drawTidewalker(c, x, y, face, k * .82, t, st); else if (id === 'spora') drawSpora(c, x, y - (pose.air ? 10 : 0), face, k, t, st); else drawGoose(c, x, y, face, k * 1.05, t, st);
    c.restore(); return null; }
  return drawRig(c, x, y, face, s, hlook(id), pose, t, o);
}
function heroHeight(id, s) { return (id === 'papi' ? 72 : id === 'spora' ? 40 : id === 'bernache' ? 34 : 50 * (hlook(id).b.th / 11)) * s * (NONRIG[id] ? .8 : 1); }

// ---- personal fidgets while waiting ----------------------------------------
const FIDGETS = {
  amiral: ['check', 'salute', 'look'], marge: ['flex', 'tap', 'stretch'], cyborg: ['look', 'check'], ruby: ['tap', 'stretch', 'chat'], magneto: ['flex', 'stretch', 'bang'],
  doc: ['check', 'yawn', 'look'], demi: ['stretch', 'look'], raccoon: ['scratch', 'look', 'tap'], soldier: ['salute', 'look', 'check']
};
const GOON_FID = { lazy: ['yawn', 'scratch', 'stretch'], show: ['flex', 'bang', 'laugh'], jumpy: ['look', 'tap', 'look'], brave: ['bang', 'check', 'tap'] };
function personaOf(L) { const p = L.persona; if (!p) return 'brave'; const k = Object.entries(p).sort((a, b) => b[1] - a[1])[0][0]; return k === 'show' ? 'show' : k; }

// ---- the gameplay drawing (640×360 logic, fg context scaled by 3) -----------
const RIG_S = 1.45;
let FRAME_DT = 1 / 60;
function smoothPose(o, target, rate = 22) { o.cur = o.cur ? blendPose(o.cur, target, 1 - Math.exp(-FRAME_DT * rate)) : target; return o.cur; }
function drawWarriorRig(p) {
  const id = p.w.id, x = p.x - camX, y = sy(p.z, p.y), t = time, air = p.y > Math.max(0, ground(p.x, p.z)) + 2;
  if (p.inv > 0 && p.ko <= 0 && !p.hurtT && Math.floor(t * 20) % 2 && p.sp <= 0) g.globalAlpha = .45;
  shadow(p.x, p.z, p.y, NONRIG[id] ? 16 : 12);
  if (p.dash > 0) { g.fillStyle = 'rgba(255,240,200,.75)'; for (let k = 0; k < 5; k++) g.fillRect(x - p.face * (16 + k * 8), y - 14 - k * 9, 12, 1.5); }
  if (p.rage > 0) { g.fillStyle = 'rgba(255,60,30,.3)'; g.beginPath(); g.ellipse(x, y - 34, 24, 42, 0, 0, 7); g.fill(); }
  let pose, o = { flow: -(p.vx || 0) / 200 }, moving = (p.walkPrev !== undefined && Math.abs(p.walk - p.walkPrev) > 0);
  p.walkPrev = p.walk; p.hurtT = Math.max(0, (p.hurtT || 0) - FRAME_DT); p.landT = Math.max(0, (p.landT || 0) - FRAME_DT);
  if (p.wasAir && !air) p.landT = .16; p.wasAir = air;
  if (moving || air || p.atk > 0) p.idleT = 0; else p.idleT = (p.idleT || 0) + FRAME_DT;
  if (p.ko > 0) pose = POSES.down(t, p.i * 3 + 1);
  else if (p.fall > 0) pose = POSES.flail(t);
  else if (p.state === 'roll') { pose = POSES.tumble(t * 2 % 1, 0); pose.rot = -t * 18 * p.face; pose.air = 0; }
  else if (p.state === 'fly') { pose = POSES.jumpDown(t); o.fly = 1; }
  else if (p.dash > 0) pose = POSES.charge(t);
  else if (p.dodge > 0) pose = POSES.backstep();
  else if (p.hurtT > 0) pose = POSES.hurt(1 - p.hurtT / .35, p.hv || 0);
  else if (p.atk > 0) { const s = 1 - p.atk / .25, c = p.combo || 1; pose = c === 1 ? POSES.jab(s) : c === 2 ? POSES.cross(s) : (p.i + id.length) % 2 ? POSES.kick(s) : POSES.swing(s); if (id === 'ruby') o.swing = 1; }
  else if (p.state === 'dive' || (air && p.vy > 0)) pose = POSES.jumpUp(t);
  else if (air) pose = POSES.jumpDown(t);
  else if (p.landT > 0) pose = POSES.land(1 - p.landT / .16);
  else if (moving) pose = POSES.walk(p.walk / 9, 1);
  else { const fight = enemies.some(e => !e.dead && Math.abs(e.x - p.x) < 140); const fl = FIDGETS[id];
    if (!fight && fl && p.idleT > 2.5) { const k = Math.floor((p.idleT - 2.5) / 2.2 + p.i) % (fl.length + 1); pose = k === fl.length ? POSES.idle(t, p.i) : POSES[fl[k]](t); }
    else pose = fight ? POSES.guard(t, p.i) : POSES.idle(t, p.i * 2); }
  pose = smoothPose(p, pose, p.atk > 0 || p.hurtT > 0 ? 40 : 22);
  if (p.dodge > 0) g.globalAlpha = .55;
  if (p.frozen > 0) o.alpha = .85;
  const st = { walk: p.walk, speed: moving ? 1 : 0, atk: p.atk > 0 || p.sp > 0, rocket: p.state === 'roll' };
  if (id === 'demi') o.fire = p.fire;
  drawHero(g, id, x, y, p.face, RIG_S, pose, t, { ...o, ...st, idle: NONRIG[id] ? (p.idleT > 3 ? (Math.floor(p.idleT / 3) % 2 ? 'preen' : 'peck') : null) : undefined });
  if (p.frozen > 0) { g.fillStyle = 'rgba(190,230,255,.35)'; g.fillRect(x - 16, y - 76, 32, 76); }
  if (p.ko > 0) { g.fillStyle = '#ffd23f'; for (let k = 0; k < 3; k++) { const a = t * 4 + k * 2.1; g.fillRect(x + Math.cos(a) * 14 - 1, y - 24 + Math.sin(a) * 4, 2.5, 2.5); } }
  g.globalAlpha = 1;
}
function enemyPose(e) {
  const L = e.look, w = L.wpn, t = time, fam = e.type === 'gunner' ? 'gun' : e.type === 'brute' ? 'heavy' : ['knife', 'prod', 'harpoon'].includes(w) ? 'thrust' : 'melee';
  const moving = e.mv > .2;
  if (e.dead) { if (e.y > 1) { const p0 = POSES.tumble(t % 1, e.hv); p0.rot = -(1.2 - e.dead) * 6; return p0; } return POSES.down(t, e.hv); }
  if (e.state === 'drop') return POSES.dropping(t);
  if (e.state === 'arrive') return POSES.cheer(t * .5);
  if (e.state === 'escape') return POSES.flail(t);
  if (e.frozen > 0) return e.cur || POSES.guard(t);
  if (e.y > 1 && e.vy !== 0) return POSES.tumble(t * 1.5 % 1, e.hv);
  if (e.getup > 0) return POSES.getup(1 - e.getup / .6, e.hv);
  if (e.state === 'hurt') return POSES.hurt(1 - Math.max(0, e.stun) / .3, e.hv);
  if (e.state === 'wind') { const s = 1 - Math.max(0, e.t2) / ETYPES[e.type].wind; return fam === 'gun' || e.shoot ? POSES.aim(s) : fam === 'heavy' ? POSES.windHeavy(s) : fam === 'thrust' ? POSES.windThrust(s) : POSES.windMelee(s); }
  if (e.state === 'strike') { const s = 1 - Math.max(0, e.t2) / .18; return fam === 'gun' || e.type === 'boss' && e.wasShoot ? POSES.recoil(s) : fam === 'heavy' ? POSES.strikeHeavy(s) : fam === 'thrust' ? POSES.strikeThrust(s) : POSES.strikeMelee(s); }
  if (e.flee > 0) return POSES.flee(t);
  if (e.react && e.react.t > 0) return POSES[e.react.k](t);
  if (moving) return POSES.walk(e.walk / 9, e.type === 'brute' ? .7 : 1);
  if (fam === 'gun') return POSES.aim(0);
  if (e.type === 'boss') return Math.sin(t * .8) > .6 ? POSES.point(t) : Math.sin(t * .8) < -.7 ? POSES.bang(t) : POSES.guard(t, 3);
  if (!e.engaged) { const fl = GOON_FID[personaOf(L)] || GOON_FID.brave; e.idleT = (e.idleT || 0) + FRAME_DT; const k = Math.floor(e.idleT / 1.8 + L.seed) % (fl.length + 2); return k >= fl.length ? POSES.guard(t, L.seed) : POSES[fl[k]](t + L.seed); }
  return POSES.guard(t, L.seed);
}
function drawEnemyRig(e) {
  const x = e.x - camX, y = sy(e.z, e.y); if (x < -80 || x > VW + 80) return;
  const L = e.look, boss = e.type === 'boss';
  shadow(e.x, e.z, e.y, boss ? 18 : e.type === 'brute' ? 16 : 11);
  let pose = enemyPose(e); pose = smoothPose(e, pose, e.state === 'strike' || e.state === 'hurt' ? 40 : 20);
  const o = { flow: -(e.vx || 0) / 200, muzzle: e.state === 'strike' && (e.type === 'gunner' || e.wasShoot) && e.t2 > .1, lieDir: e.hv % 2 ? -1 : 1, shout: e.react && e.react.k === 'laugh' };
  if (e.dead && e.dead < .5) o.alpha = e.dead / .5;
  if (boss) { o.cane = true; o.gear = WORLD.bossHasGear; }
  const jx = e.flash > 0 ? (Math.random() - .5) * 2 : 0;
  drawRig(g, x + jx, y, e.face, RIG_S, L, pose, time, o);
  if (e.frozen > 0) { g.fillStyle = 'rgba(190,230,255,.4)'; g.fillRect(x - 15, y - 80, 30, 80); }
  if (e.burn > 0) for (let k = 0; k < 3; k++) { g.fillStyle = k % 2 ? '#ffb040' : '#ff6a2a'; g.beginPath(); g.arc(x - 6 + k * 6, y - 20 - ((time * 40 + k * 13) % 30), 3, 0, 7); g.fill(); }
  if (e.state === 'wind' && !e.dead) { g.fillStyle = '#ff3a2a'; g.font = 'bold 14px sans-serif'; g.textAlign = 'center'; g.fillText('!', x, y - (boss ? 104 : e.type === 'brute' ? 96 : 80)); }
  if (!e.dead && e.hp < e.max && !boss) { g.fillStyle = '#2a1018'; g.fillRect(x - 10, y - (e.type === 'brute' ? 90 : 76), 20, 2.5); g.fillStyle = '#e04a3a'; g.fillRect(x - 10, y - (e.type === 'brute' ? 90 : 76), 20 * e.hp / e.max, 2.5); }
}
// soldiers' barks: short lines over their heads, never too many at once
const BARKS = {
  wait: [['Attends ton tour, ', 'Wait your turn, '], ['C’est à moi, là !', 'My turn now!'], ['Vas-y, toi, vas-y !', 'You go, go on!'], ['Je te couvre ! De loin !', 'I’ve got your back! From over here!']],
  laugh: [['Ha ! Ils se tapent dessus !', 'Ha! They’re hitting each other!'], ['Continuez, continuez !', 'Keep going, keep going!'], ['Oh, celle-là, je la raconte à ma mère.', 'Oh, I’m telling my mum about that one.']],
  down: [['Pas Gaston !', 'Not Gaston!'], ['Maman…', 'Mummy…'], ['Bon, moi, je rentre.', 'Right, I’m going home.'], ['C’était mon cousin ! Enfin, un collègue.', 'That was my cousin! Well, a colleague.']],
  cheer: [['On en a eu un !', 'We got one!'], ['Pour Villen-Hüüs !', 'For Villen-Hüüs!']],
  boss: [['Monseigneur !', 'My Lord!'], ['Vive Villen-Hüüs ! … Il est là ? Vive lui !', 'Long live Villen-Hüüs! … Is he here? Long live him!']],
  hurt: [['Aïe !', 'Ow!'], ['Pas la figure !', 'Not the face!'], ['Ma mutuelle ne couvre pas ça !', 'My insurance doesn’t cover this!'], ['Ouille, ouille…', 'Ouch, ouch…']]
};
