// ═══ BAKE: rig poses → pixel-art frames, per character, per animation, per world ═══
// An animation: n frames over dur seconds (or over one stride for walks), a pose function, and which hands it uses.
const HUSE = { scratch: 'f', stretch: 'b', akimbo: 'b', yawn: 'f', hair: 'k', cough: 'f', talk: 'f', talkOpen: 'b', point: 'f', laugh: 'f', shrug: 'b', club: 'b', sling: 'b', pick: 'b', charade: 'b', drink: 'f', slash: 'b', knock: 'f', whack: 'b', hurt: 'b', eye: 'b', knot: 'b', loom: 'b', pray: 'b', plant: 'b', pipes: 'b', give: 'f', reachUp: 'b', carryOut: 'b' };
// Athena's charade: a flourish, a monkey, an arabesque, and a hammer she is not allowed to swing
function charadePose(t, B) { const W = (a, b, c, d) => bump(t, a, b, c, d), P = [];
  const flo = W(0, 0.04, 0.1, 0.15), mon = W(0.11, 0.16, 0.44, 0.49), twl = W(0.45, 0.5, 0.66, 0.71), ham = W(0.67, 0.72, 1, 1.01), rest0 = Math.max(0, 1 - flo - mon - twl - ham);
  const hop = Math.abs(Math.sin(t * TAU * 7)), bob = Math.sin(t * TAU * 14);
  const [sA, sF] = reach(B, B.SF, [-3, B.hy - B.hr * 1.35], 1); // the near arm arches over the helmet to scratch
  const strike = t > 0.72 ? Math.pow(Math.abs(Math.sin((t - 0.72) / 0.28 * Math.PI * 2)), 0.7) : 0; // two hammer blows
  P.push([rest0, { arm: 0.12, fore: 0.3, arm2: 0.1, fore2: 0.3, feet: [-4, 3.6], lift: [0, 0], drop: 0, lean: 0, nod: 0 }]);
  P.push([flo, { arm: 3.05, fore: -0.15, arm2: -2.3, fore2: 0.1, feet: [-2.5, 2.6], lift: [2.4, 2.4], drop: -1.2, lean: -0.1, nod: -0.3 }]);
  P.push([mon, { arm: sA + 0.08 * bob, fore: sF + 0.25 * hop, arm2: 0.9, fore2: 1.9, feet: [-8.5, 8], lift: [2.6 * hop, 2.6 * (1 - hop)], drop: 8.5 + 2.4 * bob, lean: 0.2 + 0.05 * bob, nod: 0.2 + 0.15 * bob }]);
  P.push([twl, { arm: 2.2, fore: 0, arm2: -2.2, fore2: 0, feet: [-1.5, 1.5], lift: [3, 3], drop: -1.5, lean: -0.05, nod: -0.35 }]);
  P.push([ham, { arm: 3.1 - 2.25 * strike, fore: 0.5 - 0.35 * strike, arm2: 0.95, fore2: 0.75, feet: [-6, 5], lift: [0, 0], drop: 2.5 + 4 * strike, lean: 0.05 + 0.35 * strike, nod: 0.05 + 0.25 * strike }]);
  const o = { feet: [0, 0], lift: [0, 0] }; let tw = 0; for (const [w] of P) tw += w; for (const [w, q] of P) { const k = w / (tw || 1); for (const key in q) { if (Array.isArray(q[key])) { o[key][0] += q[key][0] * k; o[key][1] += q[key][1] * k; } else o[key] = (o[key] || 0) + q[key] * k; } }
  o.breath = 0.6; return o; }
const ANIMS_H = {
  idle: { n: 16, dur: 4.2, loop: true, f: (t, B) => HABITS.breathe(t, B) },
  walk: { n: 16, stride: 'walk', f: (t) => Object.assign({ breath: 0.4 }, gait(t, 'walk')) },
  run: { n: 12, stride: 'run', f: (t) => gait(t, 'run') },
  sneak: { n: 16, stride: 'sneak', f: (t) => Object.assign(gait(t, 'sneak'), { drop: 3 + gait(t, 'sneak').drop }) },
  jumpUp: { n: 1, f: () => ({ feet: [-5, 4.5], lift: [3, 6], arm: 0.9, fore: 0.6, arm2: -0.4, fore2: 0.7, lean: 0.06 }) },
  jumpTop: { n: 1, f: () => ({ feet: [-4.5, 3], lift: [5, 4], arm: 1.4, fore: 0.8, arm2: 0.6, fore2: 0.8, lean: 0.04 }) },
  jumpDown: { n: 1, f: () => ({ feet: [-4, 4.4], lift: [2.6, 1.4], arm: 1.8, fore: 0.4, arm2: 1.2, fore2: 0.3, lean: -0.02 }) },
  land: { n: 4, dur: 0.22, f: (t) => { const k = Math.sin(t * Math.PI); return { feet: [-5, 4.8], drop: 4 * k, lean: 0.12 * k, arm: 0.5 * k + 0.12, fore: 0.6, arm2: 0.4 * k, fore2: 0.5 }; } },
  sit: { n: 16, dur: 4.6, loop: true, f: (t) => ({ drop: 13.5, feet: [9, 11.5], breath: 1.1 * breathAt(t), lean: -0.04, arm: 0.55, fore: 0.75, arm2: 0.5, fore2: 0.8 }) },
  sitTalk: { n: 16, dur: 2.0, loop: true, f: (t) => ({ drop: 13.5, feet: [9, 11.5], breath: 1.1, lean: -0.04 + Math.sin(t * TAU) * 0.02, arm: 0.9 + Math.sin(t * TAU * 2) * 0.15, fore: 0.9, arm2: 0.5, fore2: 0.8, nod: Math.sin(t * TAU * 3) * 0.04 }) },
  kneel: { n: 12, dur: 0.7, f: (t) => { const k = ease(t * 1.4); return { drop: 9.5 * k, lean: 0.2 * k, feet: [-4.2 - 6 * k, 3.8 + 2 * k], arm: 0.12 + 0.9 * k, fore: 0.3 + 0.5 * k, arm2: 0.1 + 0.6 * k, fore2: 0.6 }; } },
  kneelIdle: { n: 16, dur: 4, loop: true, f: (t) => ({ drop: 9.5, lean: 0.2, feet: [-10.2, 5.8], arm: 1.02, fore: 0.8, arm2: 0.7, fore2: 0.6, breath: breathAt(t) }) },
  hurt: { n: 6, dur: 0.35, f: (t) => { const k = Math.sin(Math.min(1, t * 1.6) * Math.PI); return { lean: -0.2 * k, nod: -0.25 * k, drop: 1.5 * k, feet: [-5.5, 3.2], arm: -0.4 * k + 0.12, fore: 0.9, arm2: 0.9 * k, fore2: 0.6 }; } },
  knock: { n: 18, dur: 1.0, f: (t, B) => { const k = bump(t, 0, 0.15, 0.85, 1), rap = Math.max(0, Math.sin(clamp01((t - 0.15) / 0.7) * Math.PI * 3)), [a, f] = reach(B, B.SF, [9 - rap * 2.6, B.sh + 7], -1); return { arm: lerp(0.12, a, k), fore: lerp(0.3, f, k), wrist: -0.6, lean: 0.04 * k, nod: 0.06 * k }; } },
  whack: { n: 20, dur: 0.9, f: (t, B) => whackPose(t, B) },
  drink: { n: 14, dur: 0.65, f: (t, B) => { const k = bump(t, 0, 0.3, 0.8, 1), g = Math.abs(Math.sin(t * TAU * 3)) * k, [a, f] = reach(B, B.SF, [5.5, B.hy + B.hr * 0.6], -1); return { arm: lerp(0.12, a, k), fore: lerp(0.3, f, k), nod: -0.45 * k + 0.08 * g, lean: -0.06 * k, breath: 0.6, hold: HELD.bottle }; } },
  slash: { n: 12, dur: 0.46, f: (t, B) => Object.assign(clubPose(t, B), { hold: HELD.xiphos }) },
  charade: { n: 40, dur: 3.0, f: (t, B) => charadePose(t, B) },
  pick: { n: 14, dur: 0.75, f: (t, B) => { const k = bump(t, 0, 0.42, 0.62, 1), d = 13 * k, L = 0.78 * k, br = 0.4, py = B.hip + d, Tx = 12, Ty = -1.5 - py, c = Math.cos(-L), s = Math.sin(-L), lx = Tx * c - Ty * s, ly = Tx * s + Ty * c + B.hip + br, [a, f] = reach(B, B.SF, [lx, ly], -1); return { drop: d, lean: L, nod: 0.25 * k, feet: [-6 - 7 * k, 4.2 + 3 * k], lift: [0, 0], arm: lerp(0.12, a, k), fore: lerp(0.3, f, k), arm2: 0.1 + 0.5 * k, fore2: 0.4 + 0.6 * k, breath: br }; } }, // a crouch: knees bend, back fairly straight, the hand reaches the ground in front of the feet
  reachUp: { n: 16, dur: 1.1, f: (t, B) => { const k = bump(t, 0.05, 0.4, 0.75, 1), [a, f] = reach(B, B.SF, [9, B.hy - B.hr * 3.2], -1), [a2, f2] = reach(B, B.SB, [3, B.hy - B.hr * 2.9], -1); return { arm: lerp(0.12, a, k), fore: lerp(0.3, f, k), arm2: lerp(0.08, a2, k), fore2: lerp(0.25, f2, k), lift: [1.3 * k, 1.3 * k], lean: -0.08 * k, nod: -0.3 * k, breath: 1 + k }; } },
  club: { n: 12, dur: 0.46, f: (t, B) => clubPose(t, B) },
  sling: { n: 14, dur: 0.56, f: (t, B) => slingPose(t, B) },
  eye: { n: 18, dur: 1.2, f: (t, B) => eyePose(t, B) },
  give: { n: 16, dur: 1.0, f: (t, B) => { const k = bump(t, 0.05, 0.4, 0.75, 1), [a, f] = reach(B, B.SF, [13, B.sh + 12], -1), o = rest(t); return Object.assign(o, { arm: lerp(o.arm, a, k), fore: lerp(o.fore, f, k), lean: 0.06 * k }); } },
  knot: { n: 20, dur: 2.2, f: (t, B) => { const k = bump(t, 0.06, 0.3, 0.8, 0.98), w = Math.sin(t * TAU * 4) * 0.8 * bump(t, 0.3, 0.35, 0.7, 0.78), [a, f] = reach(B, B.SF, [12 + w, B.sh + 13], -1), [a2, f2] = reach(B, B.SB, [11 - w, B.sh + 14], -1); return Object.assign(rest(t), { arm: lerp(0.12, a, k), fore: lerp(0.3, f, k), arm2: lerp(0.06, a2, k), fore2: lerp(0.24, f2, k), nod: 0.25 * k, lean: 0.08 * k }); } },
  loom: { n: 16, dur: 1.8, loop: true, f: (t, B) => { const s = Math.sin(t * TAU), [a, f] = reach(B, B.SF, [10 + s * 3, B.sh + 9 + Math.abs(s) * 1], -1), [a2, f2] = reach(B, B.SB, [8 - s * 2.5, B.sh + 6], -1); return Object.assign(rest(t), { arm: a, fore: f, arm2: a2, fore2: f2, nod: 0.12, lean: 0.04 + s * 0.015, holdFront: PROPS.shuttle }); } },
  loomStop: { n: 16, dur: 3, loop: true, f: (t, B) => { const [a, f] = reach(B, B.SF, [10, B.sh + 11], -1), [a2, f2] = reach(B, B.SB, [8, B.sh + 7], -1); return Object.assign(rest(t), { arm: a, fore: f, arm2: a2, fore2: f2, nod: 0.18, lean: 0.03, holdFront: PROPS.shuttle }); } },
  pray: { n: 16, dur: 2.6, loop: true, f: (t, B) => { const [a, f] = reach(B, B.SF, [11, B.sh + 1], -1), [a2, f2] = reach(B, B.SB, [8, B.sh + 2], -1); return Object.assign(rest(t), { arm: a, fore: f, arm2: a2, fore2: f2, nod: -0.22, lean: -0.05 }); } },
  trance: { n: 16, dur: 3.2, loop: true, f: (t) => ({ drop: 12.5, feet: [7, 9.5], breath: 1.2 * breathAt(t), lean: Math.sin(t * TAU) * 0.08, nod: -0.15 + Math.sin(t * TAU * 2) * 0.08, arm: 0.6, fore: 0.6, arm2: 0.5, fore2: 0.7 }) },
  plant: { n: 18, dur: 1.4, f: (t, B) => { const lift = bump(t, 0, 0.3, 0.35, 0.4), dn = ease((t - 0.35) / 0.25), [a, f] = reach(B, B.SF, [lerp(5, 11, dn), lerp(B.sh + 1, B.sh + 11, dn)], -1); return Object.assign(rest(t), { arm: a, fore: f, upright: true, wrist: lerp(-0.6, 0, dn), hold: t < 0.92 ? PROPS.oar : null, lean: 0.12 * dn - 0.04 * lift, drop: 1.4 * dn, arm2: 0.1 + 0.3 * dn, fore2: 0.4 }); } },
  pipes: { n: 16, dur: 1.6, loop: true, f: (t, B) => { const m = [B.hr * 1.2, B.hy + B.hr * 0.6], [a, f] = reach(B, B.SF, [m[0] + 1, m[1] + 1.5], -1), [a2, f2] = reach(B, B.SB, [m[0] - 0.4, m[1] + 2], -1); return Object.assign(rest(t), { arm: a, fore: f, arm2: a2, fore2: f2, upright: true, wrist: 0, holdFront: PROPS.syrinx, nod: -0.06 + Math.sin(t * TAU * 2) * 0.03 }); } },
};
for (const k in HABITS) if (!ANIMS_H[k] && k !== 'breathe') ANIMS_H[k] = { n: k === 'stretch' ? 24 : 20, dur: k === 'stretch' ? 3.2 : 2.6, f: HABITS[k] };
for (const k in TALKS) ANIMS_H[k] = { n: 16, dur: k === 'laugh' ? 1.6 : 2.0, loop: k === 'sad', f: TALKS[k] };
// the hero's actions, with his back in them
// a two-handed staff blow: wind up high behind the head, swing through to level, the staff rings off the bronze and bounces back, then lowered
function whackPose(t, B) { const wu = bump(t, 0, 0.4, 0.4, 0.5), go = ease((t - 0.4) / 0.1), rec = Math.max(0, Math.sin(clamp01((t - 0.5) / 0.18) * Math.PI)), hit = go * (1 - ease((t - 0.78) / 0.22)), dx = -2.5 * wu + 3 * hit;
  const arm = swingA(t, [[0, 0.6], [0.4, 3.05], [0.47, 2.3], [0.5, 1.5], [0.56, 1.72], [0.64, 1.56], [0.8, 1.5], [1, 0.6]]), fore = swingA(t, [[0, 0.5], [0.4, 1.2], [0.47, 0.7], [0.5, 0.05], [0.56, 0.18], [0.64, 0.06], [0.8, 0.08], [1, 0.5]]), wrist = swingA(t, [[0, 0.1], [0.4, -0.8], [0.5, 0.0], [0.56, -0.12], [0.64, 0], [1, 0.1]]);
  const H = [B.SF[0] + (Math.sin(arm) + Math.sin(arm + fore)) * B.L1, B.SF[1] + (Math.cos(arm) + Math.cos(arm + fore)) * B.L1], b = arm + fore, [a2, f2] = reach(B, B.SB, [H[0] - Math.sin(b) * 2.6 - 0.6, H[1] - Math.cos(b) * 2.6 + 0.4], 1);
  return { arm, fore, wrist, arm2: a2, fore2: f2, hold: PROPS.staff, dx, lean: -0.24 * wu + 0.3 * hit - 0.08 * rec, drop: 0.8 * wu + 2.6 * hit, nod: 0.12 * hit - 0.1 * wu, feet: [-4.5 - dx, 3.6 + 6 * hit - dx], lift: [0, t < 0.55 ? Math.sin(go * Math.PI) * 2 : 0] }; }
function clubPose(t, B) { const wu = bump(t, 0, 0.42, 0.42, 0.55), go = ease((t - 0.42) / 0.16), hit = go * (1 - ease((t - 0.75) / 0.25)), dx = -2 * wu + 3.5 * hit;
  const arm = swingA(t, [[0, 0.7], [0.42, 2.95], [0.5, 2.2], [0.58, 1.1], [0.8, 1.1], [1, 0.7]]), fore = swingA(t, [[0, 0.5], [0.42, 1.25], [0.5, 1.05], [0.58, 0.08], [0.8, 0.14], [1, 0.5]]), wrist = swingA(t, [[0, 0.1], [0.42, -0.75], [0.58, 0.12], [1, 0.1]]);
  const H = [B.SF[0] + (Math.sin(arm) + Math.sin(arm + fore)) * B.L1, B.SF[1] + (Math.cos(arm) + Math.cos(arm + fore)) * B.L1], b = arm + fore, [a2, f2] = reach(B, B.SB, [H[0] - Math.sin(b) * 1.6 - 0.4, H[1] - Math.cos(b) * 1.6 + 0.5], 1);
  return { arm, fore, wrist, arm2: a2, fore2: f2, hold: HELD.club, dx, lean: -0.2 * wu + 0.36 * hit, drop: 0.8 * wu + 3.4 * hit, feet: [-4.5 - dx, 3.6 + 7 * hit - dx], lift: [0, t < 0.62 ? Math.sin(go * Math.PI) * 2.2 : 0] }; }
function slingPose(t, B) { const ang = t * 34, whirl = t < 0.5, o = { lean: swingA(t, [[0, -0.04], [0.45, -0.22], [0.6, 0.38], [0.8, 0.3], [1, -0.04]]), drop: swingA(t, [[0, 0], [0.45, 0.8], [0.6, 3.2], [0.85, 1.6], [1, 0]]), dx: swingA(t, [[0, 0], [0.45, -2], [0.6, 3.6], [0.85, 2.4], [1, 0]]),
    arm: swingA(t, [[0, 2.85], [0.45, 2.85], [0.6, 1.3], [0.72, 0.62], [1, 0.4]]), fore: swingA(t, [[0, 0.7], [0.45, 0.5], [0.6, 0.02], [0.72, 0.2], [1, 0.4]]), arm2: swingA(t, [[0, 0.5], [0.45, 1.0], [0.6, -0.8], [0.8, -0.9], [1, 0.1]]), fore2: 0.6 };
  if (whirl) { o.arm += Math.sin(ang) * 0.16; o.fore = 0.5 + Math.cos(ang) * 0.25; } o.feet = [-4.5 - o.dx, 3.6 + swingA(t, [[0, 0], [0.45, 0], [0.6, 8], [1, 0]]) - o.dx]; o.lift = [Math.sin(ease((t - 0.6) / 0.25) * Math.PI) * 2.2, 0]; o.hold = PROPS.sling; return o; }
function eyePose(t, B) { const up = ease(t / 0.4), hold = up * (1 - ease((t - 0.5) / 0.06)), ta = ease((t - 0.5) / 0.08), open = ta * (1 - ease((t - 0.82) / 0.18)), down = ease((t - 0.82) / 0.18), eye = [B.hr * 1.3, B.hy + 0.6];
  const Tf = t < 0.5 ? [lerp(7.2, eye[0], up), lerp(B.sh + 8, eye[1], up)] : [lerp(lerp(eye[0], 17.5, ta), 10.3, down), lerp(lerp(eye[1], B.sh - 10, ta), B.sh + 19.7, down)], Tb = t < 0.5 ? [lerp(3.7, eye[0] - 2.6, up), lerp(B.sh + 21, eye[1] + 1.6, up)] : [lerp(lerp(eye[0] - 2.6, -17, ta), 3.7, down), lerp(lerp(eye[1] + 1.6, B.sh - 8, ta), B.sh + 21, down)];
  const [arm, fore] = reach(B, B.SF, Tf, -1), [a2, f2] = reach(B, B.SB, Tb, t < 0.5 ? -1 : 1); return { arm, fore, arm2: a2, fore2: f2, nod: 0.16 * hold - 0.2 * open, lean: 0.1 * hold - 0.13 * open, drop: 1.6 * hold - 1.1 * open, lift: [0.9 * open, 0.9 * open], feet: [-4.6 - open * 1.6, 3.8 + open * 1.6], holdFront: t < 0.5 && t > 0.03 ? HELD.owl : null }; }
// beasts, fowl, serpents
const ANIMS_B = { idle: { n: 16, dur: 3.2, loop: true, f: (t) => BHABITS.rest(t) }, walk: { n: 16, qstride: 'walk', f: (t, D) => qgait(t, 'walk') }, trot: { n: 12, qstride: 'trot', f: (t) => qgait(t, 'trot') }, run: { n: 10, qstride: 'run', f: (t) => qgait(t, 'run') },
  lunge: { n: 10, dur: 0.5, f: (t) => { const k = bump(t, 0, 0.35, 0.6, 1); return Object.assign(qgait(0.3, 'run'), { pitch: -0.15 * k, jaw: k, neckDown: 0.1, dx: 10 * k, tail: 0.4 }); } },
  hurt: { n: 6, dur: 0.35, f: (t) => ({ pitch: 0.12 * Math.sin(t * Math.PI), headPitch: -0.4 * Math.sin(t * Math.PI), jaw: 0.6, tail: -0.3 }) },
  down: { n: 8, dur: 0.7, f: (t) => ({ lie: ease(t * 1.3), eyesShut: t > 0.5, neckDown: 0.4 * ease(t), tail: 0.4 }) },
  // the lion's fight: a wiggling crouch before the pounce, the leap, a paw swipe, a roar, and a daze after the club rattles it
  crouch: { n: 12, dur: 0.7, loop: true, f: (t) => ({ drop: 4.5, pitch: 0.05, neckDown: 0.25, headPitch: -0.25, feet: [-2.6, 0.4, 2.8, 0.2], tail: 0.3 + Math.sin(t * TAU * 3) * 0.35, tailCurl: Math.sin(t * TAU * 2), dx: Math.sin(t * TAU * 2) * 0.8 }) },
  pounce: { n: 8, dur: 0.6, loop: true, f: (t) => ({ feet: [-14, -12, 13, 11], lift: [5, 5, 8, 8], pitch: -0.14 + 0.2 * t, jaw: 0.8, headPitch: -0.15, tail: 0.6 }) },
  swipe: { n: 10, dur: 0.55, f: (t) => { const k = bump(t, 0, 0.35, 0.55, 1); return { feet: [-1.2, 1.6, 1.2 + 11 * k, -1.4], lift: [0, 0, 14 * k, 0], pitch: -0.12 * k, jaw: 0.9 * k, headPitch: -0.2 * k, tail: 0.3 }; } },
  roar: { n: 12, dur: 1.0, f: (t) => { const k = bump(t, 0, 0.2, 0.75, 1); return { jaw: k, headPitch: -0.55 * k, neckDown: -0.3 * k, roarMane: 1 + 0.18 * k, pitch: -0.08 * k, tail: 0.8 * k }; } },
  dazed: { n: 16, dur: 1.4, loop: true, f: (t) => ({ drop: 2, neckDown: 0.35, headPitch: 0.2 + Math.sin(t * TAU) * 0.15, eyesShut: true, pitch: Math.sin(t * TAU) * 0.04, tail: -0.2, dx: Math.sin(t * TAU) * 1 }) } };
for (const k in BHABITS) if (!ANIMS_B[k] && k !== 'rest') ANIMS_B[k] = { n: k === 'growl' ? 12 : 24, dur: k === 'growl' ? 0.8 : 3.0, loop: k === 'growl', f: BHABITS[k] };
const ANIMS_F = { idle: { n: 10, dur: 2, loop: true, f: (t) => FHABITS.rest(t) }, walk: { n: 8, fstride: 9, f: (t) => { const s = Math.sin(t * TAU); return { feet: [-1 + s * 2.4, 1.5 - s * 2.4], lift: [Math.max(0, Math.cos(t * TAU)) * 1.6, Math.max(0, -Math.cos(t * TAU)) * 1.6], peck: (t * 2 % 1) < 0.25 ? 0.15 : 0 }; } } };
for (const k in FHABITS) if (k !== 'rest') ANIMS_F[k] = { n: 16, dur: 1.6, f: FHABITS[k] };
const ANIMS_S = { slither: { n: 16, sstride: 30, f: (t) => ({ ph: t * TAU }) }, idle: { n: 16, dur: 2.4, loop: true, f: (t) => ({ ph: t * TAU * 0.5, rise: 0.25, tongue: (t * 3 % 1) < 0.3 }) },
  rear: { n: 12, dur: 0.8, f: (t) => ({ ph: t * 2, rise: ease(t * 1.4) * 0.9, jaw: ease(t) * 0.7, tongue: t > 0.6 }) }, strike: { n: 10, dur: 0.45, f: (t) => { const k = bump(t, 0, 0.35, 0.5, 1); return { ph: 1, rise: 0.9 - 0.6 * k, jaw: 1, dx: 14 * k }; } },
  hurt: { n: 6, dur: 0.35, f: (t) => ({ ph: t * 9, rise: 0.4, jaw: 0.8 }) }, down: { n: 10, dur: 0.8, f: (t) => ({ ph: 2, rise: 0.4 * (1 - ease(t * 1.5)), jaw: 0.3 }) } };
const animsFor = (kind) => kind === 'human' ? ANIMS_H : kind === 'beast' ? ANIMS_B : kind === 'fowl' ? ANIMS_F : ANIMS_S;
// what each character carries when its hand is free
const CARRY = { mentor: { hand: 'f', prop: 'staff', at: [12.5, -25], wrist: 0 }, shepherd: { hand: 'f', prop: 'crook', at: [9.5, -26], wrist: 0 }, odysseus: { hand: 'f', prop: 'oar', at: [6.5, -43], wrist: -1.12 }, waterwoman: { hand: 'k', at: [-1.5, -77], jar: true }, pilgrim: { hand: 'f', prop: 'staff', at: [9, -26], wrist: 0.05 }, oldwoman: { hand: 'f', prop: 'staff', at: [8.5, -22], wrist: 0.1 }, guard: { hand: 'f', prop: 'spear', at: [8.5, -30], wrist: 0 }, bandit: { hand: 'f', prop: 'club', at: [8, -22], wrist: 0.6 }, bandit2: { hand: 'f', prop: 'club', at: [8, -22], wrist: 0.6 }, polyphemus: { hand: 'f', prop: 'club', at: [8, -22], wrist: 0.6 } };
const CARRY_G = { oldwoman: { hand: 'f', prop: 'staff', at: [9, -30], wrist: 0 }, mentor: { hand: 'f', prop: 'spear', at: [9.5, -32], wrist: 0 }, shepherd: { hand: 'f', prop: 'syrinx', at: [8, -36], wrist: 0, front: true } };

// ── the baker ──
const EXT = { human: [-44, 56, -124, 7], beast: [-38, 44, -50, 6], fowl: [-15, 13, -26, 3], snake: [-44, 44, -40, 6] };
const BAKED = new Map(), BAKE_Q = [], PORTRAITS = new Map();
const keyOf = (id, anim, w) => id + '|' + anim + '|' + w;
function sizeOf(id, w) { const c = CAST[id]; return (w === 'g' && c.god ? c.god.sz : 1) * (c.sz || 1); }
// the rig options for character `id` playing `anim` at phase t, in world w ('m' mortal, 'g' God's view)
function poseOf(id, anim, t, w) { const c = CAST[id], A = animsFor(c.kind)[anim]; if (!A) return null; const god = w === 'g' && c.god;
  if (c.kind !== 'human') return Object.assign({ kind: c.beast }, c.o || {}, A.f(t, c));
  const pr = PR[c.pr], B = body(pr), base = Object.assign({}, c.o, god ? c.god.o : {}), o = Object.assign(base, A.f(t, B)), use = HUSE[anim] || '', cr = (god ? CARRY_G[id] : null) || CARRY[id];
  if (cr && !(use === 'b' || use === cr.hand) && anim !== 'plant') { if (cr.hand === 'f') { const gk = A.stride && GAITS[A.stride] ? A.stride : null, sw = gk ? clamp((0.12 - o.arm) / GAITS[gk].arm, -1.2, 1.2) : 0, amp = gk === 'run' ? 4.2 : gk === 'sneak' ? 1.4 : 2.6; // the carrying hand swings with the stride too
    const [a, f] = reach(B, B.SF, [cr.at[0] - sw * amp, cr.at[1] + (o.drop || 0) * 0.3 - (o.breath || 0) * 0.5 + Math.abs(sw) * (gk === 'run' ? 1.2 : 0.6)], -1); o.arm = a; o.fore = f; o.upright = true; o.wrist = (cr.wrist || 0) - (o.lean || 0); if (cr.front) o.holdFront = PROPS[cr.prop]; else o.hold = PROPS[cr.prop]; }
    else { const [a, f] = reach(B, B.SB, [cr.at[0], cr.at[1] - (o.breath || 0)], -1); o.arm2 = a; o.fore2 = f; } }
  if (cr && cr.jar && !god) o.onHead = JAR;
  if (w === 'g') delete o.breath; // painted figures don't breathe
  o.__pr = pr; return o; }
function rigDraw(pen, id, o, C) { const c = CAST[id]; for (const k of ['hold', 'holdFront', 'hold2']) if (o[k]) { const f = o[k]; o[k] = (pp) => f(pp, C); } if (c.kind === 'human') return rigHuman(pen, o, C, o.__pr); if (c.kind === 'beast') return rigBeast(pen, o, C); if (c.kind === 'fowl') return rigFowl(pen, o, C); return rigSnake(pen, Object.assign({}, c.o, o), C); }
function palOf(id, w) { const c = CAST[id]; return palette({ pal: Object.assign({}, c.pal || {}, w === 'g' && c.god ? c.god.pal : {}) }, 'classic'); }
// cel shading, but young faces and limbs keep only a thin, light rim (elders keep the full bands)
function skinShade(L, C, old) { const S = celShade(L); if (old || !C.skin) return S; const w = L.width, h = L.height, r = L.data, d = S.data, skins = new Set([C.skin, darken(C.skin, 0.12)].map((q) => parseInt(q.slice(1), 16)));
  const isSkin = (x, y) => { if (x < 0 || y < 0 || x >= w || y >= h) return false; const i = (y * w + x) * 4; return r[i + 3] > 0 && skins.has((r[i] << 16) | (r[i + 1] << 8) | r[i + 2]); };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (!isSkin(x, y)) continue; const i = (y * w + x) * 4, k = !isSkin(x + 1, y) || !isSkin(x, y + 1) ? 0.4 : !isSkin(x - 1, y) || !isSkin(x, y - 1) ? 0.3 : 0; for (let ch = 0; ch < 3; ch++) d[i + ch] = Math.round(r[i + ch] + (d[i + ch] - r[i + ch]) * k); }
  return S; }
// one frame
function bakeFrame(id, anim, i, w) { const c = CAST[id], A = animsFor(c.kind)[anim], n = A.n, t = A.loop ? i / n : (n === 1 ? 0 : i / n), o = poseOf(id, anim, t, w), sz = sizeOf(id, w), S = UPX * sz * 3, [x0, x1, y0, y1] = EXT[c.kind];
  const W = Math.ceil((x1 - x0) * S / 3) * 3, H = Math.ceil((y1 - y0) * S / 3) * 3, cv = mkC(W, H), x = cv.getContext('2d'), C = palOf(id, w); x.translate(-x0 * S, -y0 * S); x.scale(S, S); if (o.dx) x.translate(o.dx, 0);
  const god = (w === 'g' && (c.god || c.hero)) || w === 'v', pen = Pen(x, god ? 'vase' : 'px', C, { vaseFig: BLACK_V, vaseLine: CLAY_V, white: (w === 'g' && c.god && c.god.white) || (w === 'v' && c.o && c.o.female), pxMin: 1.0, pxK: 1.5, vlw: 0.62, thinSkip: 2.6, grid: 3 }); C.__vf = BLACK_V;
  rigDraw(pen, id, o, C); let L = downFast(getPx(cv), 3); if (!god) L = softOutline(skinShade(L, C, c.pr === 'elder'));
  return { c: toCanvas(L), ox: Math.round(-x0 * UPX * sz), oy: Math.round(-y0 * UPX * sz) }; }
// frames are baked on first need (or ahead of time from the queue); until then the caller gets null and falls back
function frames(id, anim, w) { const k = keyOf(id, anim, w); let s = BAKED.get(k); if (!s) { const A = animsFor(CAST[id].kind)[anim]; if (!A) return null; s = { list: new Array(A.n), done: 0, A }; BAKED.set(k, s); BAKE_Q.push([id, anim, w]); } return s; }
function frameAt(id, anim, w, i, now) { const s = frames(id, anim, w); if (!s) return null; const j = ((i % s.A.n) + s.A.n) % s.A.n; if (!s.list[j]) { if (now) { s.list[j] = bakeFrame(id, anim, j, w); s.done++; } else return null; } return s.list[j]; }
function bakeAll(id, anim, w) { const s = frames(id, anim, w); if (!s) return; for (let j = 0; j < s.A.n; j++) if (!s.list[j]) { s.list[j] = bakeFrame(id, anim, j, w); s.done++; } }
function bakeTick(budget = 3) { const t0 = performance.now(); while (BAKE_Q.length && performance.now() - t0 < budget) { const [id, anim, w] = BAKE_Q[0], s = BAKED.get(keyOf(id, anim, w)); if (!s) { BAKE_Q.shift(); continue; } const j = s.list.findIndex((f) => !f); if (j < 0) { BAKE_Q.shift(); continue; } s.list[j] = bakeFrame(id, anim, j, w); s.done++; } }
// the mist a mortal becomes in the God's view: its silhouette, blurred and pale
const MIST = new WeakMap();
function rebake(id) { for (const k of [...BAKED.keys()]) if (k.startsWith(id + '|')) BAKED.delete(k); for (const k of [...PORTRAITS.keys()]) if (k.startsWith(id)) PORTRAITS.delete(k); }
function mistOf(f) { let m = MIST.get(f); if (m) return m; const w = f.c.width, h = f.c.height, c = mkC(w + 6, h + 6), x = c.getContext('2d'); x.filter = 'blur(1.6px)'; x.drawImage(f.c, 3, 3); x.filter = 'none'; x.globalCompositeOperation = 'source-in'; x.fillStyle = '#f4ead6'; x.fillRect(0, 0, w + 6, h + 6);
  const im = x.getImageData(0, 0, w + 6, h + 6), d = im.data; for (let i = 0, p = 0; i < d.length; i += 4, p++) { const a = d[i + 3], px = p % (w + 6), py = (p / (w + 6)) | 0; d[i + 3] = a < 40 ? 0 : a < 150 ? ((px + py) % 2 ? 90 : 0) : 120; } x.putImageData(im, 0, 0); m = { c, ox: f.ox + 3, oy: f.oy + 3 }; MIST.set(f, m); return m; }
// portraits: a head-and-shoulders bust with an expression, in the dialogue
const EXPR = { neutral: {}, happy: { smile: 0.9, brow: 0.2, shine: true }, sad: { smile: -0.7, brow: -0.9, down: 1 }, surprised: { mouth: 0.7, brow: 0.9, wide: true, shine: true }, cross: { smile: -0.4, brow: -1.2 }, think: { smile: -0.1, brow: 0.5, look: -1 }, tender: { smile: 0.5, brow: -0.4, down: 0.6, shine: true }, sly: { smile: 0.6, brow: -0.5, look: 1 }, grin: { smile: 1, mouth: 0.4, brow: 0.4, shine: true }, shy: { smile: 0.3, down: 1, blush: true } };
// portrait(): see 19-bust.js
