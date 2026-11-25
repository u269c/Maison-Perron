// =====================================================================
// CARRY — picking things up and throwing them, each warrior with their own body.
// A lift is a real motion (reach down, grab, rise), the carried thing follows the actual hands, and a throw has a
// wind-up, a release frame and a follow-through. Styles:
//   Amiral: hoists it onto his shoulder, overhand heave · Marge: one hand, high overhead, a big slam
//   Cyborg: on the chrome fist held straight out, a piston punch sends it flat and fast
//   Papi: the tidewalker picks it up in its teeth, a neck snap flings it · Ruby: both hands overhead, a guitar-smash throw
//   Spora: telekinesis — it floats on wavy green strands and flies on a wobbling path
//   Magneto: magnetism — it hangs in front of his palm on blue arcs, a palm push fires it straight
//   La Doc: hugged against the belly, a two-handed underhand lob · Demi: balanced on a burning palm, a sidearm fling with a fire trail
//   Bernache: scoops it onto her back, a honk that flings it off · Raccoon: too big for him — wobbling overhead, a little hop to throw
//   Soldier: tucked under an arm, a grenade lob
// =====================================================================
const CSTYLE = {
  amiral: { hold: 'shoulder', lift: .42, spd: .85, thr: 'overhand', T: .34, rel: .48, vx: 360, vy: 80 },
  marge: { hold: 'onehand', lift: .34, spd: .95, thr: 'slam', T: .42, rel: .55, vx: 400, vy: 150, shake: 4 },
  cyborg: { hold: 'piston', lift: .4, spd: .85, thr: 'piston', T: .3, rel: .42, vx: 560, vy: 12, g: .3, shock: 1 },
  papi: { hold: 'mouth', lift: .45, spd: .85, thr: 'neck', T: .36, rel: .5, vx: 340, vy: 130 },
  ruby: { hold: 'overhead', lift: .4, spd: .82, thr: 'smash', T: .38, rel: .5, vx: 340, vy: 110 },
  spora: { hold: 'wave', lift: .6, spd: .85, thr: 'wave', T: .42, rel: .5, vx: 290, vy: 40, g: .25, wave: 1, trail: '#9ae86a' },
  magneto: { hold: 'magnet', lift: .32, spd: .85, thr: 'push', T: .3, rel: .45, vx: 480, vy: 20, g: .2, trail: '#8ad8ff' },
  doc: { hold: 'hug', lift: .6, spd: .7, thr: 'underhand', T: .42, rel: .55, vx: 230, vy: 230 },
  demi: { hold: 'palm', lift: .38, spd: .85, thr: 'sidearm', T: .32, rel: .5, vx: 400, vy: 60, trail: '#ff8a2a', fire: 1 },
  bernache: { hold: 'beak', lift: .4, spd: .9, thr: 'whip', T: .46, rel: .42, vx: 380, vy: 140 },
  raccoon: { hold: 'wobble', lift: .7, spd: .62, thr: 'hop', T: .42, rel: .55, vx: 300, vy: 130 },
  soldier: { hold: 'tuck', lift: .36, spd: .9, thr: 'lob', T: .4, rel: .55, vx: 250, vy: 290 }
};
const cst = p => CSTYLE[p.w.id] || CSTYLE.ruby;
const TELE = { wave: 1, magnet: 1 };
// ---- poses ----------------------------------------------------------------------------------------------------
// how the arms (and a little of the body) sit while carrying; base is the walking/idle pose underneath
function holdPose(p, base, t, moving) { const H = cst(p).hold, q = { ...base, aF: [...base.aF], aB: [...base.aB] }, sw = Math.sin(t * 3);
  switch (H) {
    case 'shoulder': q.aF = [2.25, 2.0]; q.aB = [.15 + (moving ? Math.sin(t * 9) * .3 : sw * .05), .35]; q.sp = (q.sp || 0) + .05; break;
    case 'onehand': q.aF = [3.05, .08]; q.aB = [.7, 1.3]; break;
    case 'piston': q.aF = [1.57, 0]; q.aB = [.25, .8]; q.sp = (q.sp || 0) - .04; break;
    case 'overhead': q.aF = [2.85, .25]; q.aB = [2.75, .3]; q.sp = (q.sp || 0) - .08; break;
    case 'hug': q.aF = [.95, .95]; q.aB = [.85, 1.05]; q.sp = (q.sp || 0) - .14; q.nk = (q.nk || 0) + .1; break;
    case 'palm': q.aF = [1.95, .45]; q.aB = [.4, .6]; break;
    case 'tuck': q.aF = [.55, .5]; q.aB = [.2 + (moving ? Math.sin(t * 9) * .3 : 0), .4]; break;
    case 'wobble': q.aF = [2.95, .15]; q.aB = [2.85, .2]; q.sp = Math.sin(t * 5) * .12 - .05; q.rx = (q.rx || 0) + Math.sin(t * 5) * 1.2; break;
    case 'magnet': q.aF = [1.65, .05]; q.aB = [.6, .9]; break;
  } return q; }
const CROUCH = { ry: 7, sp: .6, nk: .1, aF: [.6, .35], aB: [.5, .4], lF: [.6, -1.1], lB: [-.3, -.9] };
function liftCrouch(p) { const H = cst(p).hold;
  if (H === 'onehand') return PZ({ ry: 4, sp: .45, aF: [.5, .2], aB: [.9, 1.2], lF: [.55, -.8], lB: [-.35, -.6] });
  if (H === 'hug') return PZ({ ry: 10, sp: .18, nk: .05, aF: [.7, .5], aB: [.6, .55], lF: [.75, -1.6], lB: [-.4, -1.5] });   // a proper squat, back straight
  if (H === 'wobble') return PZ({ ...CROUCH, ry: 8, sp: .7 });
  if (H === 'magnet') return PZ({ ry: 2, sp: .1, aF: [1.0, 0], aB: [.5, .7], lF: [.4, -.4], lB: [-.4, -.3] });
  return PZ(CROUCH); }
// wind-up and follow-through poses per throw
const THR = {
  overhand: [{ sp: -.25, aF: [3.5, .5], aB: [1.2, .6], lF: [.5, -.3], lB: [-.5, -.2] }, { sp: .45, ry: 3, aF: [1.3, .1], aB: [.3, .6], lF: [.8, -.6], lB: [-.6, -.05] }],
  slam: [{ sp: -.35, ry: -1, aF: [3.4, .3], aB: [2.9, .5], lF: [.4, -.2], lB: [-.4, -.2] }, { sp: .8, ry: 6, nk: .2, aF: [1.0, .1], aB: [.9, .15], lF: [.9, -.9], lB: [-.7, -.05] }],
  piston: [{ sp: -.1, aF: [1.57, 1.7], aB: [.4, .9], lF: [.4, -.3], lB: [-.4, -.3] }, { sp: .25, ry: 2, aF: [1.57, 0], aB: [.1, .9], lF: [.8, -.6], lB: [-.6, -.1] }],
  smash: [{ sp: -.4, aF: [3.6, .4], aB: [3.5, .45], lF: [.4, -.2], lB: [-.4, -.3] }, { sp: .7, ry: 5, aF: [1.1, .2], aB: [1.0, .25], lF: [.85, -.8], lB: [-.6, -.05] }],
  underhand: [{ sp: .35, ry: 4, aF: [-.6, .2], aB: [-.5, .25], lF: [.5, -.6], lB: [-.4, -.5] }, { sp: -.15, aF: [2.1, .1], aB: [2.0, .15], lF: [.4, -.2], lB: [-.4, -.2] }],
  sidearm: [{ sp: -.1, rx: -1, aF: [-.3, .4], aB: [1.2, .8], lF: [.5, -.3], lB: [-.5, -.2] }, { sp: .3, rx: 2, aF: [1.6, .1], aB: [.2, .8], lF: [.8, -.6], lB: [-.6, -.05] }],
  hop: [{ air: 1, sp: -.2, aF: [3.3, .4], aB: [3.2, .45], lF: [.6, -1.2], lB: [.1, -1.1] }, { air: 1, sp: .35, aF: [1.6, .2], aB: [1.5, .25], lF: [.5, -.6], lB: [-.2, -.8] }],
  lob: [{ sp: -.2, aF: [3.3, 1.2], aB: [1.6, .2], lF: [.5, -.3], lB: [-.5, -.2] }, { sp: .4, ry: 2, aF: [1.5, .2], aB: [.4, .7], lF: [.8, -.6], lB: [-.6, -.05] }],
  push: [{ sp: -.1, aF: [1.57, 1.5], aB: [.6, .9], lF: [.4, -.3], lB: [-.4, -.3] }, { sp: .25, ry: 1.5, aF: [1.6, 0], aB: [.5, .9], lF: [.75, -.5], lB: [-.6, -.1] }]
};
function carryPose(p, base, t, moving) {
  const S = cst(p);
  if (p.lift && p.hold) { const s = Math.min(1, p.lift.t / p.lift.T), hold = holdPose(p, POSES.idle(t, p.i), t, false);
    if (TELE[S.hold] && S.hold === 'wave') return blendPose(base, hold, ease(s));
    const cr = liftCrouch(p); if (S.hold === 'wobble' && s > .4 && s < .85) { cr.rx = Math.sin(t * 40) * .8; }
    return s < .45 ? blendPose(base, cr, ease(s / .45)) : blendPose(cr, hold, ease((s - .45) / .55)); }
  if (p.throwing) { const th = p.throwing, s = Math.min(1, th.t / th.T), K = THR[S.thr]; if (!K) return base;
    const W = PZ({ ...base, ...K[0] }), F = PZ({ ...base, ...K[1] }), from = p.hold ? holdPose(p, base, t, moving) : base;
    if (s < th.rel) return blendPose(from, W, ease(s / th.rel));
    const u = (s - th.rel) / Math.min(.14, 1 - th.rel); if (u < 1) return blendPose(W, F, ease(u)); return blendPose(F, base, ease((s - th.rel - .14) / Math.max(.01, 1 - th.rel - .14))); }
  if (p.hold) return holdPose(p, base, t, moving);
  return base; }
// the non-humans move by flags, not poses (Bernache's throw is her honk)
function carryNR(p, o) { const S = cst(p);
  if (p.throwing && S.hold === 'beak') { o.spec = { k: 'honk', s: Math.min(1, p.throwing.t / p.throwing.T) }; return; }
  if (p.lift && (S.hold === 'mouth' || S.hold === 'beak')) { const s = p.lift.t / p.lift.T; o.atk = true; o.kind = S.hold === 'mouth' ? 2 : 1; o.ks = Math.min(.95, s * .6); }
  if (p.throwing && (S.hold === 'mouth' || S.hold === 'beak')) { o.atk = true; o.kind = S.hold === 'mouth' ? 2 : 1; o.ks = Math.min(1, p.throwing.t / p.throwing.T); } }
// where the carried thing sits: from the real hands for the jointed warriors, fixed points for the others
function carryAnchor(p, SK, t) { const S = cst(p), f = p.face, R = RIG_S;
  let lx = 0, ly = 0, grip = 'top', rot = 0;
  if (SK && !NONRIG[p.w.id]) { const hF = SK.aF[2], hB = SK.aB[2], mid = [(hF[0] + hB[0]) / 2, (hF[1] + hB[1]) / 2];
    switch (S.hold) {
      case 'shoulder': [lx, ly] = [hF[0] - 7, hF[1] + 2.5]; grip = 'mid'; rot = .18 + (p.lift ? 0 : Math.sin(t * 9) * .03); break;
      case 'onehand': [lx, ly] = hF; if (!p.lift && !p.throwing) { ly -= Math.max(0, Math.sin(t * 4.2)) * 5; rot = Math.sin(t * 4.2) * .15; } break;
      case 'piston': [lx, ly] = [hF[0] + 5, hF[1]]; grip = 'mid'; break;
      case 'overhead': case 'wobble': [lx, ly] = [mid[0], Math.min(hF[1], hB[1]) - 1]; if (S.hold === 'wobble') rot = Math.sin(t * 4.5) * .28 + (p.lift ? Math.sin(t * 40) * .06 : 0); break;
      case 'hug': [lx, ly] = [mid[0] + 2, mid[1] - 1]; grip = 'mid'; break;
      case 'palm': [lx, ly] = [hF[0] + 1, hF[1] - 1]; rot = Math.sin(t * 6) * .06; break;
      case 'tuck': [lx, ly] = [hF[0] - 4, hF[1] - 4]; grip = 'mid'; rot = -.2; break;
      case 'magnet': [lx, ly] = [hF[0] + 15, hF[1] - 3 + Math.sin(t * 3) * 1.5]; grip = 'mid'; rot = Math.sin(t * 2) * .12; break;
    } }
  else { switch (S.hold) {
      case 'mouth': { const k = p.throwing ? Math.sin(Math.min(1, p.throwing.t / p.throwing.T) * Math.PI) : 0; [lx, ly] = [24 + k * 8, -50 + k * 6]; grip = 'hang'; rot = Math.sin(t * 3) * .1; break; }
      case 'beak': { const k = p.throwing ? Math.sin(Math.min(1, p.throwing.t / p.throwing.T * 1.6) * Math.PI) : 0; [lx, ly] = [-2 + k * 10, -19 - k * 10]; rot = Math.sin(t * 5) * .1 - k * .5; break; }   // riding on her back; the honk flings it off
      case 'wave': [lx, ly] = [18 + Math.sin(t * 1.7) * 3, -52 + Math.sin(t * 2.3) * 4]; grip = 'mid'; rot = Math.sin(t * 1.9) * .35; break;
      default: [lx, ly] = [0, -50]; } }
  return { x: p.x + lx * R * f, y: p.y - ly * R, grip, rot: rot * f }; }
// ---- the actions ----------------------------------------------------------------------------------------------
function carryAction(p) {
  if (p.hold) { carryThrow(p); return true; }
  const foe = enemies.some(e => !e.dead && e.state !== 'pile' && Math.abs(e.x - p.x) < reachOf(p) + 6 && Math.abs(e.z - p.z) < 14);
  if (foe) return false;
  const b = BREAK.find(b => !b.broken && !b.held && !b.thrown && b.size !== 'l' && Math.abs(b.x - p.x) < 20 + b.w / 2 && Math.abs(b.z - p.z) < 14 && p.y - Math.max(0, ground(p.x, p.z)) < 4 && Math.abs((b.y || 0) - p.y) < 24);
  if (!b) return false;
  const S = cst(p); b.held = p; p.hold = b; b.rot = 0; p.lift = { t: 0, T: S.lift, x0: b.x, y0: b.y || 0, z0: b.z }; p.face = Math.sign(b.x - p.x) || p.face; p.anchor = null;
  RUM.lift(p.i); if (!TELE[S.hold]) SFX.voice(p.w.id, 'lift', p.x); beep(S.hold === 'magnet' ? 520 : S.hold === 'wave' ? 260 : 330, .08, S.hold === 'wave' ? 'sine' : 'triangle', .04, 200); return true;
}
function carryThrow(p, drop) {
  const b = p.hold; if (!b) return;
  if (!drop) { if (p.throwing || p.lift) return; const S = cst(p); p.throwing = { t: 0, T: S.T, rel: S.rel, done: false }; p.atk = S.T; if (S.thr === 'hop' && p.y < 2) p.vy = 120; return; }
  carryRelease(p, true);
}
function carryRelease(p, drop) { const b = p.hold; if (!b) return; const S = cst(p), A = p.anchor;
  p.hold = null; b.held = null; b.thrown = !drop; b.from = p; b.z = p.z;
  if (A) { b.x = A.x; b.y = A.grip === 'top' ? A.y : A.grip === 'mid' ? A.y - b.h / 2 : A.y - b.h; } else { b.x = p.x + p.face * 10; b.y = p.y + heroHeight(p.w.id, RIG_S) + 4; }
  b.y = drop ? Math.max(0, ground(b.x, b.z)) : Math.max(6, b.y); /* a dropped thing lands on the floor */ b.vx = drop ? 0 : p.face * S.vx; b.vy = drop ? 0 : S.vy; b.g = drop ? .8 : (S.g ?? .8); b.wave = drop ? 0 : S.wave || 0; b.wph = 0; b.trail = drop ? null : S.trail || null; b.fire = !drop && S.fire;
  b.hitSet = new Set([p]); p.throwT = .25; p.lift = null;
  if (!drop) { RUM.throwIt(p.i); SFX.voice(p.w.id, 'throw', p.x); SFX.swish(HKIND[p.w.id] === 'blade' ? 'heavy' : HKIND[p.w.id], .9, p.x); beep(S.thr === 'piston' ? 120 : S.thr === 'push' ? 700 : 200, .1, 'sawtooth', .05, S.thr === 'push' ? -300 : 300); if (S.shake) WORLD.shake = Math.max(WORLD.shake, S.shake);
    if (S.shock) { puff(b.x, b.z, 6, p.face, 1.4); jolt(p, -3, 0); } if (S.thr === 'whip' && typeof SND !== 'undefined') try { tone(SND.now(), 330, 260, .18, .08, 'sawtooth'); } catch (e) {} } }
function carryTick(p, dt) {
  if (p.lift) { if (!p.hold || p.ko > 0 || p.hurtT > 0) { if (p.hold) carryRelease(p, true); p.lift = null; } else { p.lift.t += dt; const S = cst(p), grab = TELE[S.hold] ? .05 : .42;
      if (!p.lift.got && p.lift.t >= p.lift.T * grab) { p.lift.got = true; const b = p.hold;   // the moment of the grab: a heave, a little dust, a sound with some weight
        if (S.hold === 'wave') { for (let k = 0; k < 8; k++) fx.push({ k: 'ctrail', x: b.x + (Math.random() - .5) * b.w, z: b.z, y: 2, col: '#b8ff8a', r: 2 + Math.random() * 2, t: .5, T: .5, up: 40, ring: k % 2 === 0 }); try { tone(SND.now(), 180, 520, .4, .05, 'sine'); } catch (e) {} }
        else if (S.hold === 'magnet') { for (let k = 0; k < 6; k++) fx.push({ k: 'spark2', x: b.x + (Math.random() - .5) * b.w, z: b.z, y: 4, vx: (Math.random() - .5) * 80, vy: -40 - Math.random() * 60, t: .35 }); }
        else { puff(b.x, b.z, S.hold === 'hug' || S.hold === 'wobble' ? 4 : 2, 0, .8); jolt(p, 0, 2); try { tone(SND.now(), S.hold === 'onehand' ? 160 : 120, 90, .12, .06, 'triangle'); } catch (e) {} } }
      if (p.lift.t >= p.lift.T) p.lift = null; } }
  if (p.throwing) { const th = p.throwing; th.t += dt; if (!th.done && th.t >= th.T * th.rel) { th.done = true; carryRelease(p, false); } if (th.t >= th.T) p.throwing = null; } }
// movement while lifting, carrying, throwing
function carrySpeed(p) { if (p.lift) return 0; if (p.throwing) return .25; return p.hold ? cst(p).spd : 1; }
// called while drawing: places the carried thing on the hands (eased in during the lift)
function carryPlace(p, SK, t) { const b = p.hold; if (!b) return; const A = carryAnchor(p, SK, t); p.anchor = A;
  let x = A.x, y = A.grip === 'top' ? A.y : A.grip === 'mid' ? A.y - b.h / 2 : A.y - b.h, rot = A.rot;
  if (p.lift) { const S = cst(p), s = p.lift.t / p.lift.T, grab = TELE[S.hold] ? 0 : S.hold === 'mouth' || S.hold === 'beak' ? .35 : .42, u = s < grab ? 0 : ease(Math.min(1, (s - grab) / (1 - grab) * 1.6));
    const gx = p.lift.x0, gy = p.lift.y0; if (S.hold === 'wave') { const w = Math.sin(s * Math.PI * 3) * 4 * (1 - s); x = gx + (x - gx) * u + w; } else x = gx + (x - gx) * u;
    y = gy + (y - gy) * u; rot = rot * u; if (S.hold === 'onehand' && u > 0 && u < 1) rot = u * Math.PI * 2 * p.face; if (S.hold === 'wobble' && s > .4) x += Math.sin(t * 40) * 1.2 * (1 - u); b.z = p.lift.z0 + (p.z - p.lift.z0) * u; }
  else b.z = p.z;
  b.x = x; b.y = y; b.rot = rot; }
// ---- the look of it: telekinesis strands, magnetic arcs, flames ----------------------------------------------
function carryFx(p, SK, x, y, t) { const b = p.hold; if (!b) return; const S = cst(p), bx = b.x - camX, by = sy(b.z, b.y + b.h / 2);
  if (S.hold === 'wave') { const ox = x + p.face * 4, oy = y - 30; g.save(); g.lineCap = 'round';
    for (let k = 0; k < 4; k++) { g.beginPath(); for (let i = 0; i <= 16; i++) { const u = i / 16, px = ox + (bx - ox) * u, py = oy + (by - oy) * u, n = Math.sin(u * Math.PI);
        const w = Math.sin(t * 7 + u * 9 + k * 1.6) * 5 * n + Math.sin(t * 3.1 + k) * 2 * n; i ? g.lineTo(px + w * .4, py + w) : g.moveTo(px, py); }
      g.strokeStyle = k % 2 ? 'rgba(160,240,110,.28)' : 'rgba(200,255,150,.5)'; g.lineWidth = k % 2 ? 3.4 : 1.2; g.stroke(); }
    for (let k = 0; k < 6; k++) { const a = t * 2.4 + k * 1.05, r = b.w * .55 + 4 + Math.sin(t * 5 + k) * 2; g.fillStyle = `rgba(200,255,150,${.5 + Math.sin(t * 6 + k) * .3})`; g.beginPath(); g.arc(bx + Math.cos(a) * r, by + Math.sin(a) * r * .45, 1.3, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(180,255,130,.35)'; g.lineWidth = 1; g.beginPath(); g.ellipse(bx, by + b.h * .6, b.w * .5 + Math.sin(t * 4) * 2, 3, 0, 0, 7); g.stroke(); g.restore(); }
  if (S.hold === 'magnet' && SK) { const hx = x + SK.aF[2][0] * RIG_S * p.face, hy = y + SK.aF[2][1] * RIG_S; g.save(); g.lineCap = 'round';
    for (let k = 0; k < 2; k++) { g.beginPath(); g.moveTo(hx, hy); for (let i = 1; i < 6; i++) { const u = i / 6; g.lineTo(hx + (bx - hx) * u + (Math.random() - .5) * 5, hy + (by - hy) * u + (Math.random() - .5) * 6); } g.lineTo(bx, by);
      g.strokeStyle = 'rgba(120,200,255,.45)'; g.lineWidth = 2.6; g.stroke(); g.strokeStyle = '#eaf6ff'; g.lineWidth = .8; g.stroke(); }
    g.strokeStyle = 'rgba(140,210,255,.4)'; g.lineWidth = 1; for (let k = 0; k < 2; k++) { g.beginPath(); g.ellipse(bx, by, b.w * .5 + 3 + k * 3, b.h * .5 + 2 + k * 2, t * 2 + k, 0, 7); g.stroke(); } g.restore(); }
  if (S.fire) { g.save(); for (let k = 0; k < 5; k++) { const fx0 = bx + (k - 2) * b.w * .18, top = sy(b.z, b.y + b.h), hgt = 5 + Math.abs(Math.sin(t * 12 + k * 1.7)) * 6;
      g.fillStyle = k % 2 ? 'rgba(255,170,60,.85)' : 'rgba(255,90,30,.8)'; g.beginPath(); g.moveTo(fx0 - 2.5, top); g.quadraticCurveTo(fx0 + Math.sin(t * 9 + k) * 2, top - hgt * .6, fx0, top - hgt); g.quadraticCurveTo(fx0 + 1, top - hgt * .5, fx0 + 2.5, top); g.fill(); } g.restore(); } }
// the flight: wavy for Spora, trails for the others
function carryFlight(b, dt) { if (b.wave) { b.wph += dt * 13; const w = Math.cos(b.wph); b.y += w * 22 * dt * 3.2; b.z += Math.sin(b.wph * .7) * 18 * dt; b.rot += Math.sin(b.wph) * dt * 4; }
  if (b.trail && Math.random() < dt * 60) fx.push({ k: 'ctrail', x: b.x, z: b.z, y: b.y + b.h / 2, col: b.trail, r: b.wave ? 3 + Math.random() * 2 : 2 + Math.random() * 1.5, t: .35, T: .35, ring: !!b.wave });
  if (b.fire && Math.random() < dt * 50) fx.push({ k: 'ctrail', x: b.x - Math.sign(b.vx) * 4, z: b.z, y: b.y + b.h * .6, col: Math.random() < .5 ? '#ffb040' : '#ff5a1a', r: 2.5 + Math.random() * 2, t: .3, T: .3, up: 30 }); }
function carryFxTick(f, dt) { if (f.k !== 'ctrail') return false; if (f.up) f.y += f.up * dt; return true; }
function drawCarryFx(f) { if (f.k !== 'ctrail') return false; const x = f.x - camX, y = sy(f.z, f.y), a = Math.max(0, f.t / f.T); g.save(); g.globalAlpha = a * .8;
  if (f.ring) { g.strokeStyle = f.col; g.lineWidth = 1.2; g.beginPath(); g.ellipse(x, y, f.r * (2 - a), f.r * (2 - a) * .6, 0, 0, 7); g.stroke(); } else { g.fillStyle = f.col; g.beginPath(); g.arc(x, y, f.r * a + .5, 0, 7); g.fill(); }
  g.restore(); return true; }
