'use strict';
// ═══ POSES: the gait (steps locked to distance), breathing, and the small habits that make people alive ═══
// Units are rig units (an adult is ~70 tall). On screen one unit is UPX pixels.
const UPX = 0.88;
const smooth = (t) => t * t * (3 - 2 * t), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), TAU = Math.PI * 2;
const ease = (t) => smooth(clamp(t, 0, 1));
const swingA = (t, keys) => { for (let i = 0; i < keys.length - 1; i++) if (t <= keys[i + 1][0]) return lerp(keys[i][1], keys[i + 1][1], ease((t - keys[i][0]) / (keys[i + 1][0] - keys[i][0]))); return keys[keys.length - 1][1]; };
// body proportions per build: the arm IK needs the shoulder height and the arm-bone length
function body(pr) { const hip = -pr.leg, sh = hip - pr.torso, L1 = pr.torso * 0.92 * 0.52, hr = pr.head * 0.62, hy = sh - pr.head * 1.05; return { hip, sh, L1, hr, hy, SF: [2.5, sh + 2.5], SB: [-1, sh + 2.5] }; }
// two-bone arm IK to a point in the body frame; side -1 bends the elbow down and back (natural), +1 up
function reach(B, S0, T, side = -1) { const dx = T[0] - S0[0], dy = T[1] - S0[1], d = clamp(Math.hypot(dx, dy), 1.2, 2 * B.L1 - 0.05), phi = Math.atan2(dx, dy), al = Math.acos(d / (2 * B.L1)); return side > 0 ? [phi + al, -2 * al] : [phi - al, 2 * al]; }

// ── the gait ──
// p: phase 0..1 over one full stride (two steps). L: how far the body travels in one stride, in units.
// While a foot is planted it slides back exactly L per stride relative to the hips, so on screen it stays put.
const GAITS = {
  walk: { L: 38, stance: 0.62, lift: 2.8, bob: 0.9, lean: 0.03, arm: 0.42, fore: 0.32, foreSw: 0.18 },
  run: { L: 78, stance: 0.36, lift: 6.0, bob: 1.8, lean: 0.15, arm: 0.85, fore: 1.35, foreSw: 0.25 },
  sneak: { L: 26, stance: 0.7, lift: 2.0, bob: 0.5, lean: 0.12, arm: 0.2, fore: 0.9, foreSw: 0.1 },
};
function footAt(pi, G) { const S = G.L * G.stance; if (pi < G.stance) return [S * (0.5 - pi / G.stance), 0]; const s = (pi - G.stance) / (1 - G.stance); return [-S / 2 + S * smooth(s), Math.sin(s * Math.PI) * G.lift]; }
function gait(p, kind = 'walk', scale = 1) { const G = GAITS[kind], Lk = Object.assign({}, G, { L: G.L * scale }), b = footAt((p + 0.5) % 1, Lk), f = footAt(p % 1, Lk), half = Lk.L * Lk.stance / 2;
  const mid = kind === 'run' ? 0.18 : 0.31, wave = Math.cos(4 * Math.PI * (p - mid)), drop = kind === 'run' ? G.bob * (1 + wave) / 2 : G.bob * (1 - wave) / 2;
  return { feet: [-2.5 + 0.6 + b[0], 2.6 + 0.6 + f[0]], lift: [b[1], f[1]], drop, lean: G.lean, arm: 0.12 - G.arm * f[0] / half, fore: G.fore + G.foreSw * Math.max(0, f[0] / half), arm2: 0.08 - G.arm * b[0] / half, fore2: G.fore + G.foreSw * Math.max(0, b[0] / half) }; }
// a stride in screen pixels, for picking the frame from the distance walked
const strideOf = (kind, sc = 1, sz = 1) => GAITS[kind].L * sc * UPX * sz;

// ── standing, breathing, habits ──
// Every idle animation starts and ends on the same rest pose, so they can follow each other in any order.
const REST = { feet: [-4.2, 3.8], arm: 0.12, fore: 0.28, arm2: 0.06, fore2: 0.24 };
const breathAt = (t, n = 1) => (1 - Math.cos(TAU * t * n)) / 2;
function rest(t, o = {}) { const b = breathAt(t); return Object.assign({}, REST, { breath: 1.2 * b, arm: REST.arm + 0.04 * b, arm2: REST.arm2 + 0.03 * b, drop: 0 }, o); }
const bump = (t, a, b, c, d) => ease((t - a) / (b - a)) * (1 - ease((t - c) / (d - c))); // rises a→b, holds, falls c→d
// each habit: (t 0..1, B body, sty style) → rig options. Styles tweak them per character (an elder leans on a staff, a woman tucks her hair).
const HABITS = {
  breathe: (t) => rest(t),
  shift: (t) => { const k = bump(t, 0.1, 0.3, 0.7, 0.92); return rest(t * 2, { feet: [-4.2 - 1.2 * k, 3.8 - 1.4 * k], drop: 0.5 * k, lean: -0.03 * k, arm2: 0.06 + 0.1 * k }); },
  scratch: (t, B) => { const k = bump(t, 0.08, 0.3, 0.72, 0.92), wig = Math.sin(t * TAU * 7) * 0.6 * bump(t, 0.3, 0.34, 0.68, 0.72), [a, f] = reach(B, B.SF, [B.hr * 0.05 + wig * 0.4, B.hy - B.hr * 0.55 + wig], -1); const o = rest(t);
    return Object.assign(o, { arm: lerp(o.arm, a, k), fore: lerp(o.fore, f, k), nod: 0.14 * k, lean: 0.02 * k }); },
  look: (t) => { const up = bump(t, 0.06, 0.24, 0.42, 0.56), dn = bump(t, 0.5, 0.64, 0.82, 0.96); return rest(t, { nod: -0.32 * up + 0.2 * dn, lean: -0.05 * up + 0.03 * dn, breath: 1.2 * breathAt(t) + 0.4 * up }); },
  stretch: (t, B) => { const k = bump(t, 0.06, 0.34, 0.62, 0.9), [a, f] = reach(B, B.SF, [5, B.hy - B.hr * 2.4], -1), [a2, f2] = reach(B, B.SB, [-4, B.hy - B.hr * 2.3], -1), o = rest(t);
    return Object.assign(o, { arm: lerp(o.arm, a, k), fore: lerp(o.fore, f, k), arm2: lerp(o.arm2, a2, k), fore2: lerp(o.fore2, f2, k), lean: -0.13 * k, nod: -0.22 * k, lift: [1.1 * k, 1.1 * k], breath: 1.2 * breathAt(t) + 1.2 * k }); },
  akimbo: (t, B) => { const k = bump(t, 0.08, 0.26, 0.76, 0.94), [a, f] = reach(B, B.SF, [5.6, B.hip - 2.5], 1), [a2, f2] = reach(B, B.SB, [-5.4, B.hip - 2.5], 1), o = rest(t * 2);
    return Object.assign(o, { arm: lerp(o.arm, a, k), fore: lerp(o.fore, f, k), arm2: lerp(o.arm2, a2, k), fore2: lerp(o.fore2, f2, k), lean: -0.04 * k, feet: [-4.2 - 0.8 * k, 3.8 + 0.6 * k] }); },
  yawn: (t, B) => { const k = bump(t, 0.06, 0.28, 0.6, 0.86), [a, f] = reach(B, B.SF, [B.hr * 1.15, B.hy + B.hr * 0.7], -1), o = rest(t);
    return Object.assign(o, { arm: lerp(o.arm, a, k * 0.95), fore: lerp(o.fore, f, k * 0.95), nod: -0.28 * k, lean: -0.06 * k, breath: 1.2 * breathAt(t) + 1.0 * k }); },
  hair: (t, B) => { const k = bump(t, 0.08, 0.28, 0.66, 0.9), sw = Math.sin(t * TAU * 2) * 0.8 * k, [a, f] = reach(B, B.SB, [-B.hr * 0.9 + sw, B.hy - B.hr * 0.2], -1), o = rest(t);
    return Object.assign(o, { arm2: lerp(o.arm2, a, k), fore2: lerp(o.fore2, f, k), nod: 0.1 * k }); },
  cough: (t) => { const k = bump(t, 0.1, 0.2, 0.62, 0.8), j = Math.max(0, Math.sin(t * TAU * 6)) * k; return rest(t, { lean: 0.1 * k + 0.08 * j, nod: 0.18 * k, drop: 0.6 * k, arm: 0.5 * k + 0.12, fore: 1.6 * k + 0.28 }); },
};
const HABIT_SETS = { young: ['shift', 'scratch', 'look', 'stretch', 'akimbo', 'yawn'], woman: ['shift', 'hair', 'look', 'akimbo', 'scratch'], elder: ['shift', 'look', 'cough', 'scratch', 'yawn'], kid: ['shift', 'scratch', 'look', 'stretch', 'yawn'] };

// ── talking ──
const TALKS = {
  talk: (t, B) => { const k = bump(t, 0.05, 0.25, 0.75, 0.95), w = Math.sin(t * TAU * 2) * 0.12 * k, [a, f] = reach(B, B.SF, [9.5, B.sh + 13], -1), o = rest(t); return Object.assign(o, { arm: lerp(o.arm, a, k) + w, fore: lerp(o.fore, f, k) - w, nod: -0.04 * k + Math.sin(t * TAU * 3) * 0.03 }); },
  talkOpen: (t, B) => { const k = bump(t, 0.05, 0.25, 0.75, 0.95), [a, f] = reach(B, B.SF, [10.5, B.sh + 10], -1), [a2, f2] = reach(B, B.SB, [-8, B.sh + 11], -1), o = rest(t); return Object.assign(o, { arm: lerp(o.arm, a, k), fore: lerp(o.fore, f, k), arm2: lerp(o.arm2, a2, k), fore2: lerp(o.fore2, f2, k), lean: -0.04 * k }); },
  point: (t, B) => { const k = bump(t, 0.05, 0.2, 0.8, 0.95), [a, f] = reach(B, B.SF, [15, B.sh + 3], -1), o = rest(t); return Object.assign(o, { arm: lerp(o.arm, a, k), fore: lerp(o.fore, f, k), lean: 0.04 * k }); },
  nodYes: (t) => rest(t, { nod: Math.sin(t * TAU * 2) * 0.16 * bump(t, 0.05, 0.15, 0.8, 0.95) }),
  laugh: (t) => { const k = bump(t, 0.05, 0.2, 0.8, 0.95), j = Math.abs(Math.sin(t * TAU * 4)) * k; return rest(t, { lean: -0.1 * k - 0.05 * j, nod: -0.22 * k - 0.08 * j, breath: 1 + 1.4 * j, arm: 0.3 * k + 0.12, fore: 0.9 * k + 0.28 }); },
  sad: (t) => rest(t, { nod: 0.24, lean: 0.06, arm: 0.06, arm2: 0.03, breath: 0.6 * breathAt(t) }),
  shrug: (t, B) => { const k = bump(t, 0.1, 0.3, 0.6, 0.85), [a, f] = reach(B, B.SF, [9, B.sh + 12], 1), [a2, f2] = reach(B, B.SB, [-7, B.sh + 12], 1), o = rest(t); return Object.assign(o, { arm: lerp(o.arm, a, k), fore: lerp(o.fore, f, k), arm2: lerp(o.arm2, a2, k), fore2: lerp(o.fore2, f2, k), breath: 1.2 + 1.2 * k, nod: 0.1 * k }); },
};
