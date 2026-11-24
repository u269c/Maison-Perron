// =====================================================================
// ANIM — the motion layer on top of the poses.
// Every fighter carries a little spring rig ("jig"): squash and stretch, lean into its speed, a head that snaps
// and settles. Events kick the springs (a jump, a landing, a punch thrown, a hit taken) and they wobble back.
// Plus: afterimages on fast moves, a white flash on impact, dust under feet, sparks and impact stars,
// a camera punch-in on finishers, slow motion on the last goon, and bodies that bowl other goons over.
// =====================================================================
const JIG_K = 300, JIG_D = 15;
function jig(o) { return o.jig || (o.jig = { sx: 1, vsx: 0, sy: 1, vsy: 0, ln: 0, vln: 0, nk: 0, vnk: 0, px: o.x, spd: 0, acc: 0, ghosts: [], gT: 0, wph: 0, skidT: 0 }); }
// kick: wide (+) / narrow (-), tall (+) / flat (-), head (+ forward / - back)
function jolt(o, wide, tall, head = 0) { if (!o) return; const J = jig(o); J.vsx += wide; J.vsy += tall; J.vnk += head; }
function stepJig(o, dt, face) {
  const J = jig(o); if (dt <= 0) return J;
  const sp = (o.x - J.px) / dt; J.px = o.x; const a = (sp - J.spd) / dt; J.spd += (sp - J.spd) * Math.min(1, dt * 10); J.acc += (a - J.acc) * Math.min(1, dt * 6);
  const spring = (x, v, rest) => { const f = -JIG_K * (x - rest) - JIG_D * v; v += f * dt; x += v * dt; return [x, v]; };
  [J.sx, J.vsx] = spring(J.sx, J.vsx, 1); [J.sy, J.vsy] = spring(J.sy, J.vsy, 1); [J.nk, J.vnk] = spring(J.nk, J.vnk, 0);
  const lnT = Math.max(-.22, Math.min(.22, J.spd * face * .0011 - Math.max(-600, Math.min(600, J.acc)) * face * .00012));
  J.vln += (-140 * (J.ln - lnT) - 14 * J.vln) * dt; J.ln += J.vln * dt;
  J.sx = Math.max(.7, Math.min(1.35, J.sx)); J.sy = Math.max(.7, Math.min(1.35, J.sy));
  return J;
}
// apply the jig to a pose and to the draw options
function applyJig(J, pose, o) { pose = { ...pose, rot: (pose.rot || 0) + (pose.lie ? 0 : J.ln), nk: (pose.nk || 0) + J.nk }; o.sqx = J.sx; o.sqy = J.sy; return pose; }

// ---- afterimages ----------------------------------------------------------
function ghostTick(o, on, dt, snap) { const J = jig(o); J.gT -= dt; if (on && J.gT <= 0) { J.gT = .035; J.ghosts.push({ ...snap, t: .2 }); if (J.ghosts.length > 6) J.ghosts.shift(); } for (const q of J.ghosts) q.t -= dt; J.ghosts = J.ghosts.filter(q => q.t > 0); }
function drawGhosts(o, drawFn) { for (const q of jig(o).ghosts) drawFn(q, Math.max(0, q.t / .2) * .32); }

// ---- dust, sparks, impact stars --------------------------------------------
function puff(x, z, n = 3, dir = 0, big = 1) { for (let k = 0; k < n; k++) fx.push({ k: 'puff', x: x + (Math.random() - .5) * 6, z: z + (Math.random() - .5) * 3, y: 1 + Math.random() * 3, vx: dir * (30 + Math.random() * 40) + (Math.random() - .5) * 30, vy: 10 + Math.random() * 18, r: (2 + Math.random() * 2) * big, t: .4 + Math.random() * .25, T: .6 }); }
function sparks(x, z, y, dir, strong, col) { const n = strong ? 9 : 5; for (let k = 0; k < n; k++) { const a = (Math.random() - .5) * 2.2 + (dir < 0 ? Math.PI : 0); fx.push({ k: 'spark', x, z, y, vx: Math.cos(a) * (140 + Math.random() * 160) * (strong ? 1.4 : 1), vy: -Math.sin(a) * 120 + 60, t: .18 + Math.random() * .12, col: col || (k % 3 ? '#fff4c0' : '#ffd23f') }); }
  if (strong) fx.push({ k: 'star', x, z, y, t: .14, T: .14, r: 26 + Math.random() * 8, rot: Math.random() * 6 }); }
function animFx(f, dt) {
  if (specFx(f, dt) || moveFx(f, dt)) return true;
  if (f.k === 'puff') { f.x += f.vx * dt; f.y += f.vy * dt; f.vx *= Math.pow(.05, dt); f.r += dt * 9; return true; }
  if (f.k === 'spark') { f.x += f.vx * dt; f.y = Math.max(0, f.y + f.vy * dt); f.vy -= 500 * dt; return true; }
  if (f.k === 'star' || f.k === 'pring' || f.k === 'whip') return true;
  return false;
}
function drawAnimFx(f) {
  if (drawSpecFx(f) || drawMoveFx(f)) return true;
  const x = f.x - camX, y = sy(f.z, f.y || 0);
  if (f.k === 'puff') { const a = Math.max(0, Math.min(1, f.t / .35)) * .38, r = f.r; g.fillStyle = `rgba(214,200,176,${a})`; g.beginPath(); g.arc(x - r * .5, y - r * .5, r * .7, 0, 7); g.arc(x + r * .45, y - r * .55, r * .6, 0, 7); g.arc(x, y - r * .95, r * .65, 0, 7); g.fill(); return true; }
  if (f.k === 'spark') { g.strokeStyle = f.col; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x - f.vx * .03, y + (f.vy) * .03); g.stroke(); return true; }
  if (f.k === 'pring') { const u = 1 - f.t / f.T, r = (f.big ? 10 : 6) + u * (f.big ? 22 : 14); g.strokeStyle = `rgba(255,255,255,${1 - u})`; g.lineWidth = 2 * (1 - u) + .5; g.beginPath(); g.ellipse(x, y, r, r * .8, 0, 0, 7); g.stroke(); return true; }
  if (f.k === 'whip') { const u = 1 - f.t / f.T; g.strokeStyle = f.col; g.globalAlpha = 1 - u; g.lineWidth = 1.2; for (let k = 0; k < 3; k++) { const yy = y - 4 + k * 4, x0 = x - f.face * (8 + u * 6), x1 = x - f.face * (22 + k * 4 + u * 10); g.beginPath(); g.moveTo(x0, yy); g.lineTo(x1, yy); g.stroke(); } g.globalAlpha = 1; return true; }
  if (f.k === 'star') { const u = 1 - f.t / f.T, r = f.r * (.6 + u * .6), n = 10; g.save(); g.translate(x, y); g.rotate(f.rot); g.beginPath(); for (let k = 0; k < n * 2; k++) { const rr = k % 2 ? r * .45 : r * (k % 4 ? .85 : 1.15), a = k / (n * 2) * Math.PI * 2; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * .8); } g.closePath();
    g.globalAlpha = Math.min(1, f.t / f.T * 2); g.fillStyle = '#fffbe8'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke(); g.restore(); g.globalAlpha = 1; return true; }
  return false;
}
// footsteps: a puff each time a foot plants (walk phase = the pose's cycle angle)
function stepDust(o, ph, moving, x, z, big = 1) { const J = jig(o); const c = Math.cos(ph); if (moving && J.wph !== 0 && Math.sign(c) !== Math.sign(J.wph) && Math.random() < .8) puff(x - (o.face || 1) * 3, z, 1, -(o.face || 1) * .6, big * .8); J.wph = c || .001; }
// a sharp turn at speed: skid dust
function skidDust(o, x, z) { const J = jig(o); J.skidT -= FRAME_DT; if (Math.abs(J.spd) > 60 && Math.abs(J.acc) > 1400 && Math.sign(J.acc) !== Math.sign(J.spd) && J.skidT <= 0) { J.skidT = .12; puff(x, z, 2, Math.sign(J.spd), 1.1); jolt(o, 1.2, -1.2); } }

// ---- camera: punch-in on big hits, slow motion on the last goon -------------
const CAM = { z: 1, vz: 0, cx: 320, cy: 200, slow: 0 };
function camPunch(x, z, y, amt = .09) { CAM.vz += amt * 14; CAM.cx = x - camX; CAM.cy = sy(z, y || 30); }
function camTick(dt) { CAM.vz += (-180 * (CAM.z - 1) - 16 * CAM.vz) * dt; CAM.z = Math.max(1, Math.min(1.25, CAM.z + CAM.vz * dt)); }
function slowMo(t = .5) { CAM.slow = Math.max(CAM.slow, t); }

// ---- bodies as bowling balls: a launched goon knocks over the goons and smashes the crates it hits ----
function bowl(e) {
  if (!e.launchBy || e.dead && e.y <= 0) return; if (Math.abs(e.vx) < 140) { e.launchBy = null; return; }
  for (const o of enemies) if (o !== e && !o.dead && !(o.bowled > 0) && o.type !== 'oscar' && o.type !== 'boss' && Math.abs(o.x - e.x) < 18 && Math.abs(o.z - e.z) < 14 && Math.abs(o.y - e.y) < 40) {
    o.bowled = .6; const d = Math.sign(e.vx); hitEnemy(o, 1, d, e.launchBy, 1.6); o.vy = 160; o.y = Math.max(1, o.y); o.vx = d * 200; o.launchBy = e.launchBy; e.vx *= .6;
    sparks(o.x, o.z, 40, d, true); jolt(o, -3, 2); inkHit(o.x, o.z, o.y + 40, true); if (Math.random() < .5) bark(o, 'hurt'); }
  // the goons it flies past flinch and duck
  for (const o of enemies) if (o !== e && !o.dead && !o.engaged && Math.abs(o.x - e.x) < 50 && Math.abs(o.z - e.z) < 30 && !(o.react && o.react.t > 0) && Math.random() < .15) react(o, Math.random() < .5 ? 'cower' : 'flinch', .5);
  for (const b of BREAK) if (!b.broken && !b.held && !b.thrown && Math.abs(b.x - e.x) < b.w / 2 + 8 && Math.abs(b.z - e.z) < b.d / 2 + 8 && e.y < b.h + 6 && !(b.bowledBy === e)) { b.bowledBy = e; damageBreakable(b, b.size === 'l' ? 2 : 3, Math.sign(e.vx)); if (b.size !== 'l') e.vx *= .7; else e.vx = -e.vx * .3; }
}
function animTick(dt) { camTick(FRAME_DT); winTick(dt); for (const e of enemies) { if (e.bowled > 0) e.bowled -= dt; bowl(e); }
  // things on the floor jitter when the screen shakes hard
  if (WORLD.shake > 5) for (const b of BREAK) if (!b.held && !b.thrown && b.size !== 'l' && Math.random() < .3) b.wob = (b.wob || 0) + (Math.random() - .5) * .2; }

// ---- after the last goon of a wave: each warrior's signature pose, and a high-five if they're close ----
const WIN_POSE = {
  amiral: t => PZ({ sp: -.08, nk: -.15, aF: [2.3, 2.4], aB: [-.1, .2], lF: [.05, 0], lB: [-.05, 0] }),                                  // salute
  marge: t => { const b = Math.abs(Math.sin(t * 8)); return PZ({ ry: -b * 4, sp: -.2, nk: -.4, aF: [3.0, .2], aB: [2.6, .4], lF: [.3, -.4], lB: [-.2, -.2] }); },   // fist pumps
  cyborg: t => PZ({ sp: -.05, nk: -.1, ry: 1, aF: [1.6, 2.7], aB: [1.4, 2.6], lF: [.3, -.1], lB: [-.3, -.1] }),                        // double flex
  ruby: t => { const s = Math.sin(t * 14); return PZ({ sp: -.35, nk: -.5, ry: 2, aF: [1.2 + s * .3, 1.5], aB: [.9, 1.2], lF: [.5, -.5], lB: [-.4, -.2] }); },          // air guitar, leaning back
  magneto: t => PZ({ sp: .05, nk: -.25, aF: [2.0, .05], aB: [2.3, 1.6], lF: [.2, -.1], lB: [-.2, -.1] }),                               // points to the sky
  doc: t => PZ({ sp: .3, nk: .4, aF: [1.0, 1.4], aB: [.8, 1.6], lF: [.1, -.05], lB: [-.1, -.05] }),                                     // bows
  demi: t => { const s = Math.sin(t * 3); return PZ({ sp: -.1, nk: -.2, aF: [2.6 + s * .2, .2], aB: [2.6 - s * .2, .2], lF: [.1, 0], lB: [-.1, 0] }); },            // arms raised, swaying
  raccoon: t => { const b = Math.abs(Math.sin(t * 10)); return PZ({ air: b > .5 ? 1 : 0, ry: -b * 6, sp: -.1, nk: -.3, aF: [2.8, .3], aB: [-.6, .4], lF: [.6, -.9], lB: [-.3, -.6] }); }, // hops, one fist up
  soldier: t => PZ({ sp: -.04, nk: -.05, aF: [2.3, 2.4], aB: [-.05, .1], lF: [.03, 0], lB: [-.03, 0] })
};
const HIFIVE = t => PZ({ sp: -.1, nk: -.2, ry: 0, aF: [2.55, .05], aB: [-.2, .4], lF: [.25, -.1], lB: [-.25, -.1] });
function winTick(dt) { if (!WORLD.winT) return; WORLD.winT -= dt; const [a, b] = players;
  if (!WORLD.hfDone && a.ko <= 0 && b.ko <= 0 && Math.abs(a.x - b.x) < 56 && Math.abs(a.z - b.z) < 18 && WORLD.winT < 1.2) { WORLD.hfDone = true; WORLD.hf = .7; a.face = Math.sign(b.x - a.x) || 1; b.face = -a.face;
    const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2; setTimeout(() => { fx.push({ k: 'star', x: mx, z: mz, y: 62, t: .16, T: .16, r: 16, rot: 0 }); INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'TCHAK !' : 'SMACK!', x: (mx - camX) * 1.5, y: sy(mz, 70) * 1.5 - 20, size: 22, t: 0, rot: -.1 }); beep(1200, .06, 'square', .05, -300); }, 180); }
  if (WORLD.hf > 0) WORLD.hf -= dt; if (WORLD.winT <= 0) { WORLD.winT = 0; WORLD.hfDone = false; } }
function winPose(p, moving) { if (!(WORLD.winT > 0) || moving || p.atk > 0 || p.ko > 0 || p.hurtT > 0) return null; if (WORLD.hf > 0) return HIFIVE(time); const f = WIN_POSE[p.w.id]; return f && WORLD.winT < 1.5 ? f(time + p.i) : null; }
