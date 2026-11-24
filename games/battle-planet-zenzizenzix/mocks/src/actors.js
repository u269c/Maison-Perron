// =====================================================================
// ACTORS — a jointed skeleton for every fighter, blended poses, and the
// looks: heroes, and Villen-Hüüs's soldiers assembled from parts.
// Local space: feet on the ground at (0,0), facing right (+x), up is -y.
// Angles: 0 points down, +PI/2 points forward, PI points up.
// =====================================================================
const OUT = '#0c0810';
let INKW = 1; // ink width multiplier, set per art style
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = v => Math.max(0, Math.min(1, v));
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
function shadeC(hex, amt) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = n >> 8 & 255, b = n & 255; const t = amt < 0 ? 0 : 255, a = Math.abs(amt); r = Math.round(r + (t - r) * a); gg = Math.round(gg + (t - gg) * a); b = Math.round(b + (t - b) * a); return '#' + ((1 << 24) + (r << 16) + (gg << 8) + b).toString(16).slice(1); }
const rot = (a, L) => [L * Math.sin(a), L * Math.cos(a)];

// ---- poses -------------------------------------------------------------
const POSE0 = { rx: 0, ry: 0, sp: 0, nk: 0, aF: [.12, .25], aB: [-.08, .3], lF: [.1, -.08], lB: [-.1, -.08], rot: 0, air: 0, sq: 1, lie: 0 };
function PZ(o) { const p = { ...POSE0, ...o }; p.aF = o.aF || [...POSE0.aF]; p.aB = o.aB || [...POSE0.aB]; p.lF = o.lF || [...POSE0.lF]; p.lB = o.lB || [...POSE0.lB]; return p; }
function blendPose(a, b, t) { const o = {}; for (const k in b) { const A = a[k], B = b[k]; o[k] = Array.isArray(B) ? [lerp(A[0], B[0], t), lerp(A[1], B[1], t)] : typeof B === 'number' ? lerp(A ?? B, B, t) : B; } return o; }
// a small library of poses; t is local time, v a variant number, s a 0..1 progress
const POSES = {
  idle(t, v = 0) { const br = Math.sin(t * 2.2 + v) * .5 + .5, sh = Math.sin(t * .7 + v * 3) * .06; return PZ({ ry: br * .8, sp: .04 + sh * .3 + (v % 3 === 1 ? .1 : 0), nk: Math.sin(t * .9 + v) * .06, aF: [.18 + br * .05, .5], aB: [-.1 - br * .04, .4], lF: [.14 + sh, -.06], lB: [-.12 + sh, -.08] }); },
  guard(t, v = 0) { const br = Math.sin(t * 2.6 + v) * .5 + .5; return PZ({ ry: 2 + br * .8, sp: .16, nk: -.08, aF: [.9 + br * .05, 1.1], aB: [.5, 1.3], lF: [.32, -.4], lB: [-.3, -.35] }); },
  walk(t, sp = 1) { const ph = t * 9 * sp, s = Math.sin(ph), c = Math.cos(ph); return PZ({ ry: -Math.abs(c) * 1.4, sp: .08, nk: -.02, lF: [s * .55, -Math.max(0, -c) * .9 - .08], lB: [-s * .55, -Math.max(0, c) * .9 - .08], aF: [.15 - s * .45, .45], aB: [s * .45 - .05, .35] }); },
  run(t, sp = 1) { const ph = t * 12 * sp, s = Math.sin(ph), c = Math.cos(ph); return PZ({ ry: -Math.abs(c) * 2.4 + 1, sp: .26, nk: -.1, lF: [s * .85, -Math.max(0, -c) * 1.4 - .2], lB: [-s * .85, -Math.max(0, c) * 1.4 - .2], aF: [.3 - s * .7, 1.3], aB: [s * .7, 1.3] }); },
  strafe(t) { const ph = t * 8, s = Math.sin(ph); return PZ({ ry: -Math.abs(Math.cos(ph)) * .8 + 1.5, sp: .14, aF: [.8, 1.1], aB: [.4, 1.2], lF: [.25 + s * .2, -.4], lB: [-.25 + s * .2, -.4] }); },
  backstep(s) { return PZ({ sp: -.3, nk: .2, ry: 2, aF: [1.6, .6], aB: [1.2, .8], lF: [.5, -.2], lB: [-.6, -.7] }); },
  charge(t) { return PZ({ sp: .55, nk: -.25, ry: 3, aF: [.4, 1.6], aB: [-.6, 1.4], lF: [.9, -1.2], lB: [-.9, -.3] }); },
  jumpUp(t) { return PZ({ air: 1, sp: .1, nk: -.1, aF: [2.2, .6], aB: [1.9, .7], lF: [.9, -1.6], lB: [.2, -1.4] }); },
  jumpDown(t) { return PZ({ air: 1, sp: .05, aF: [1.4, .4], aB: [1.2, .5], lF: [.35, -.3], lB: [-.25, -.4] }); },
  crouch(s) { return PZ({ ry: 6 * s, sp: .3 * s, aF: [.4, .8], aB: [-.3, .7], lF: [.7 * s + .1, -1.3 * s], lB: [-.2, -1.2 * s] }); },
  land(s) { return PZ({ ry: 5 * (1 - s), sq: 1 - .12 * (1 - s), sp: .25 * (1 - s), aF: [.6, .8], aB: [-.3, .6], lF: [.6 * (1 - s) + .1, -1.1 * (1 - s)], lB: [-.2, -1 * (1 - s)] }); },
  // attacks: three in a combo, each with a wind-up and a follow-through (s 0..1)
  jab(s) { const k = s < .35 ? s / .35 : 1 - (s - .35) / .65 * .6; return PZ({ sp: .12 + k * .15, nk: -.06, ry: 1.5, aF: [.6 + k * 1.0, 1.4 - k * 1.3], aB: [.6, 1.4], lF: [.4, -.3], lB: [-.35, -.3] }); },
  cross(s) { const k = s < .35 ? s / .35 : 1 - (s - .35) / .65 * .6; return PZ({ sp: .1 + k * .3, nk: -.1, ry: 2, aB: [.4 + k * 1.3, 1.4 - k * 1.3], aF: [.8 - k * .6, 1.4], lF: [.55, -.4], lB: [-.45, -.15] }); },
  swing(s) { const k = s < .3 ? -(s / .3) : (s - .3) / .7; return PZ({ sp: .2 + k * .35, nk: -.12, ry: 3, aF: [k < 0 ? 2.6 + k * .4 : 2.6 - k * 2.2, .3], aB: [k < 0 ? 2.2 : 2.2 - k * 1.8, .4], lF: [.6, -.5], lB: [-.6, -.2] }); },
  kick(s) { const k = s < .3 ? s / .3 : 1 - (s - .3) / .7 * .7; return PZ({ sp: -.2 * k, nk: .05, ry: 0, aF: [1.2, .6], aB: [-.8, .5], lF: [.3 + k * 1.3, -1.2 + k * 1.1], lB: [-.15, -.05] }); },
  // being hit: five flavours
  hurt(s, v) { const k = 1 - s; switch (v % 5) {
    case 0: return PZ({ sp: -.45 * k, nk: .5 * k, ry: 1, aF: [.6 + k, .4], aB: [1.2 * k, .3], lF: [.25, -.2], lB: [-.4, -.3] }); // head snaps back
    case 1: return PZ({ sp: .7 * k, nk: .3 * k, ry: 4 * k, aF: [.4, 1.8], aB: [.5, 1.9], lF: [.4, -.7], lB: [-.2, -.6] }); // doubles over
    case 2: return PZ({ sp: -.2, rot: -.25 * k, nk: -.3 * k, aF: [2.4 * k, .2], aB: [-1.5 * k, .3], lF: [.1, -.1], lB: [-.6 * k, -.4] }); // spun, arms out
    case 3: return PZ({ sp: -.3 * k, nk: .2, ry: 2, aF: [1.8 * k, .5], aB: [1.4 * k, .5], lF: [.6 * k, -.2], lB: [-.8 * k, -.6] }); // stumbles back
    default: return PZ({ sp: .3 * k, nk: .6 * k, ry: 2, aF: [2.6 * k, 2], aB: [.2, .5], lF: [.2, -.3], lB: [-.2, -.3] }); } }, // hand to the head
  // knocked down (in the air): rotation handled by the caller; down: lying, with a twitch
  tumble(s, v) { return PZ({ air: 1, sp: -.2, nk: .3, aF: [2.4 + Math.sin(s * 20) * .5, .3], aB: [-1.8 + Math.cos(s * 18) * .5, .4], lF: [.6 + Math.sin(s * 16) * .4, -.6], lB: [-.4, -.8 + Math.cos(s * 14) * .3] }); },
  down(t, v) { const tw = Math.max(0, Math.sin(t * 7 + v)) > .96 ? .3 : 0; return PZ({ lie: 1, aF: [2.6 + tw, .3 + v % 2 * .6], aB: [1.6 - tw, .5], lF: [.25 + (v % 3) * .2, -.3 - tw], lB: [-.15, -.5], nk: (v % 2 ? .2 : -.2) + tw }); },
  getup(s, v) { const k = ease(s); return v % 3 === 2 ? PZ({ ry: 10 * (1 - k), sp: .9 * (1 - k), aF: [.4, .5 + (1 - k)], aB: [.2, .5], lF: [1.2 * (1 - k) + .1, -1.8 * (1 - k)], lB: [-.4, -1.6 * (1 - k)] }) : PZ({ ry: 14 * (1 - k), sp: 1.2 * (1 - k), aF: [1.4 * (1 - k), .4], aB: [1.1 * (1 - k), .4], lF: [1.4 * (1 - k) + .1, -2 * (1 - k)], lB: [.4 * (1 - k), -1.8 * (1 - k)] }); },
  // reactions and idle business
  look(t) { return PZ({ ry: .5, sp: -.05, nk: -.35 + Math.sin(t * 2) * .1, aF: [.15, .4], aB: [-.1, .4] }); },
  lookUp(t) { return PZ({ sp: -.18, nk: -.7, aF: [.3, .3], aB: [-.2, .4], lF: [.12, -.05], lB: [-.12, -.05] }); },
  point(t) { return PZ({ sp: .05, nk: -.2, aF: [1.7, .05], aB: [-.1, .4] }); },
  flinch(s) { const k = 1 - s; return PZ({ ry: 5 * k, sp: .5 * k, nk: .4 * k, aF: [2.6 * k + .2, 1.8 * k], aB: [2.3 * k, 1.9 * k], lF: [.4 * k + .1, -.8 * k], lB: [-.3, -.7 * k] }); },
  cower(t) { const sh = Math.sin(t * 30) * .03; return PZ({ ry: 9, sp: .8 + sh, nk: .5, aF: [2.7, 2.1], aB: [2.5, 2.2], lF: [1.1, -1.9], lB: [.2, -1.8] }); },
  cheer(t) { const b = Math.abs(Math.sin(t * 9)); return PZ({ air: 0, ry: -b * 3, sp: -.1, nk: -.25, aF: [2.9 - b * .3, .3], aB: [2.7 + b * .2, .3], lF: [.12, -.05], lB: [-.12, -.05] }); },
  laugh(t) { const sh = Math.sin(t * 22) * .08; return PZ({ sp: -.3 + sh, nk: -.4 + sh, ry: 1, aF: [.9, 1.9], aB: [.6 + sh, 1.8], lF: [.14, -.06], lB: [-.12, -.08] }); },
  salute(t) { return PZ({ sp: -.04, nk: -.05, aF: [2.3, 2.4], aB: [-.05, .1], lF: [.03, 0], lB: [-.03, 0] }); },
  stretch(t) { const k = Math.sin(t * 2) * .5 + .5; return PZ({ sp: -.2 * k, nk: -.3 * k, aF: [2.9 * k + .2, .2], aB: [2.8 * k + .1, .2] }); },
  scratch(t) { return PZ({ sp: .05, nk: .2, aF: [2.5, 2.3 + Math.sin(t * 18) * .25], aB: [-.1, .3] }); },
  tap(t) { return PZ({ ry: .5, lF: [.4 + Math.abs(Math.sin(t * 6)) * .25, -.5 - Math.abs(Math.sin(t * 6)) * .4], aF: [.2, .3], aB: [.4, 1.6], sp: -.05 }); },
  check(t) { return PZ({ sp: .25, nk: .5, aF: [1.1, 1.2], aB: [.9, 1.5] }); },
  flex(t) { const k = Math.sin(t * 6) * .1; return PZ({ sp: -.05, nk: -.1, ry: 1, aF: [1.6, 2.6 + k], aB: [1.4, 2.6 - k], lF: [.25, -.1], lB: [-.25, -.1] }); },
  yawn(t) { return PZ({ sp: -.15, nk: -.6, aF: [2.7, 1.9], aB: [-.2, .3] }); },
  chat(t) { const g = Math.sin(t * 5); return PZ({ sp: .04, nk: -.05 + g * .05, aF: [.9 + g * .4, 1 + g * .3], aB: [-.1, .4] }); },
  bang(t) { const b = Math.sin(t * 14); return PZ({ sp: .25 + b * .2, nk: .3 * b, ry: 1, aF: [.6, 1.6], aB: [.4, 1.7], lF: [.25, -.25], lB: [-.25, -.2] }); },
  flee(t) { const ph = t * 13, s = Math.sin(ph), c = Math.cos(ph); return PZ({ ry: -Math.abs(c) * 2, sp: .3, nk: -.5, lF: [s * .9, -Math.max(0, -c) * 1.4 - .2], lB: [-s * .9, -Math.max(0, c) * 1.4 - .2], aF: [2.8 + s * .3, .3], aB: [2.6 - s * .3, .3] }); },
  flail(t) { return PZ({ air: 1, sp: -.2, aF: [2.5 + Math.sin(t * 24) * .6, .2], aB: [2.2 + Math.cos(t * 22) * .6, .3], lF: [.5 + Math.sin(t * 20) * .5, -.4], lB: [-.4, -.6 + Math.cos(t * 19) * .4] }); },
  dropping(t) { return PZ({ air: 1, sp: .1, nk: -.2, aF: [2.6, .2], aB: [2.4, .3], lF: [.5, -1.1], lB: [-.1, -1.2] }); },
  kneel(t) { return PZ({ ry: 9, sp: .45, nk: .5, aF: [.5, .9], aB: [-.2, .6], lF: [1.4, -1.6], lB: [-.6, -2.3] }); },
  // enemy wind-ups and strikes, by weapon family
  windMelee(s) { return PZ({ sp: -.15, nk: -.1, ry: 1.5, aF: [2.7 - s * .2, .9], aB: [.3, 1.2], lF: [.45, -.35], lB: [-.35, -.3] }); },
  strikeMelee(s) { const k = ease(Math.min(1, s * 2)); return PZ({ sp: .1 + k * .4, nk: -.15, ry: 2.5, aF: [2.7 - k * 1.7, .9 - k * .7], aB: [.3, 1.2], lF: [.65, -.45], lB: [-.5, -.15] }); },
  windThrust(s) { return PZ({ sp: -.05, ry: 2, aF: [.3 - s * .4, 2.2], aB: [.6, 1.4], lF: [.4, -.4], lB: [-.4, -.3] }); },
  strikeThrust(s) { const k = Math.min(1, s * 3); return PZ({ sp: .35 * k, ry: 2.5, aF: [.3 + k * 1.4, 2.2 - k * 2.1], aB: [.6, 1.4], lF: [.7, -.5], lB: [-.6, -.1] }); },
  aim(s) { return PZ({ sp: .06, nk: -.04, ry: 2, aF: [1.5, .05], aB: [1.25, .6], lF: [.35, -.3], lB: [-.35, -.3] }); },
  recoil(s) { const k = 1 - s; return PZ({ sp: -.15 * k, nk: .1 * k, ry: 2, aF: [1.5 + k * .4, .05], aB: [1.25 + k * .3, .6], lF: [.35, -.3], lB: [-.45, -.4] }); },
  windHeavy(s) { return PZ({ sp: -.35, nk: -.2, ry: 2, aF: [3.0, .3], aB: [2.8, .4], lF: [.5, -.4], lB: [-.5, -.3] }); },
  strikeHeavy(s) { const k = ease(Math.min(1, s * 2)); return PZ({ sp: -.35 + k * 1.1, nk: -.1 + k * .3, ry: 2 + k * 5, aF: [3 - k * 2.4, .3], aB: [2.8 - k * 2.3, .4], lF: [.7, -.8 * k - .3], lB: [-.6, -.4] }); }
};

// ---- skeleton: forward kinematics, feet planted on the ground ----------
function solve(b, p) {
  const H = [0, 0];
  const leg = (a) => { const k = [H[0] + rot(a[0], b.th)[0], H[1] + rot(a[0], b.th)[1]]; const f = [k[0] + rot(a[0] + a[1], b.sh)[0], k[1] + rot(a[0] + a[1], b.sh)[1]]; return [k, f]; };
  const [kF, fF] = leg(p.lF), [kB, fB] = leg(p.lB);
  const low = Math.max(fF[1], fB[1]); const dy = p.air ? -(b.th + b.sh) * .92 : -low; // plant the lowest foot
  const sh = v => [v[0] + p.rx, v[1] + dy + p.ry];
  const hip = sh(H), chest = sh(rot(Math.PI - p.sp, b.tor));
  const ha = Math.PI - p.sp - p.nk, neck = [chest[0] + rot(ha, b.neck)[0], chest[1] + rot(ha, b.neck)[1]];
  const head = [neck[0] + rot(ha, b.hr)[0], neck[1] + rot(ha, b.hr)[1]];
  const arm = (a, off) => { const s0 = [chest[0] + off, chest[1] + 1.5]; const e = [s0[0] + rot(a[0], b.ua)[0], s0[1] + rot(a[0], b.ua)[1]]; const h = [e[0] + rot(a[0] + a[1], b.fa)[0], e[1] + rot(a[0] + a[1], b.fa)[1]]; return [s0, e, h]; };
  return { hip, chest, neck, head, kF: sh(kF), fF: sh(fF), kB: sh(kB), fB: sh(fB), aF: arm(p.aF, 1), aB: arm(p.aB, -1.5), handAng: p.aF[0] + p.aF[1] };
}
// a limb as an outlined, shaded capsule chain
function limb(c, pts, w, col, rim, w2) { w2 = w2 ?? w;
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); };
  c.lineCap = 'round'; c.lineJoin = 'round';
  path(); c.strokeStyle = OUT; c.lineWidth = Math.max(w, w2) + 2 * INKW; c.stroke();
  if (w2 !== w) { for (let i = 0; i < pts.length - 1; i++) { c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i + 1][0], pts[i + 1][1]); c.strokeStyle = col; c.lineWidth = i === 0 ? w : w2; c.stroke(); } }
  else { path(); c.strokeStyle = col; c.lineWidth = w; c.stroke(); }
  if (col[0] === '#' && w > 2.5) { c.save(); c.translate(w * .2, w * .17); path(); c.strokeStyle = shadeC(col, -.22); c.lineWidth = w * .34; c.stroke(); c.restore(); }   // cel shade on the side away from the light
  if (rim) { c.save(); c.translate(-w * .22, -w * .18); path(); c.strokeStyle = rim; c.lineWidth = Math.max(1, w * .3); c.stroke(); c.restore(); }
}
function poly(c, pts, col, rim) { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.lineJoin = 'round'; c.strokeStyle = OUT; c.lineWidth = 2 * INKW; c.stroke(); c.fillStyle = col; c.fill(); if (rim) { c.save(); c.clip(); c.strokeStyle = rim; c.lineWidth = 2; c.translate(-1.2, -1); c.stroke(); c.restore(); } }
function disc(c, x, y, r, col, rim) { c.beginPath(); c.arc(x, y, r + INKW, 0, 7); c.fillStyle = OUT; c.fill(); c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = col; c.fill();
  if (r > 2.5 && col[0] === '#') { c.save(); c.beginPath(); c.arc(x, y, r, 0, 7); c.clip(); c.fillStyle = shadeC(col, -.2); c.fillRect(x - r, y - r, r * 2, r * 2); c.beginPath(); c.arc(x - r * .22, y - r * .2, r * .98, 0, 7); c.fillStyle = col; c.fill(); c.restore(); } if (rim) { c.beginPath(); c.arc(x - r * .25, y - r * .25, r * .55, 3.3, 4.8); c.strokeStyle = rim; c.lineWidth = Math.max(1, r * .3); c.stroke(); } }

// ---- drawing a skeleton with a look ----------------------------------------
// look: { b (bones), skin, top, top2, legs, boots, arms, trim, head(c,S,look,pose,t), back(c,S..), front(c,S..), weapon(c,S..), tail }
function drawRig(c, x, y, face, scale, look, pose, t, o = {}) {
  const b = look.b, S = solve(b, pose), rim = o.rim || null;
  c.save(); c.translate(x, y); c.scale(face * scale * (o.sqx || 1), scale * (pose.sq || 1) * (o.sqy || 1));
  const LIE = pose.lie || 0; if (LIE) { c.translate(0, -b.sw * LIE); c.rotate(-Math.PI / 2 * (o.lieDir || 1) * LIE); }
  if (pose.rot) { const hy = S.hip[1]; c.translate(S.hip[0], hy); c.rotate(pose.rot); c.translate(-S.hip[0], -hy); }
  if (o.alpha !== undefined) c.globalAlpha = o.alpha;
  const dk = v => shadeC(v, -.28);
  look.behind && look.behind(c, S, pose, t, o);
  limb(c, S.aB, b.aw, dk(look.arms || look.top), null, b.aw * .85); if (look.handB !== false) disc(c, S.aB[2][0], S.aB[2][1], b.aw * .55, dk(look.hand || look.skin));
  limb(c, [S.hip, S.kB, S.fB], b.lw, dk(look.legB || look.legs), null, b.lw * .85); look.foot && look.foot(c, S.fB, S.kB, dk(look.boots), true, pose);
  look.back && look.back(c, S, pose, t, o);
  // torso
  const sw = b.sw, hw = b.hw, a = pose.sp, ca = Math.cos(a), sa = Math.sin(a);
  const tor = [[S.chest[0] - sw * ca, S.chest[1] - sw * sa * .2], [S.chest[0] + sw * ca, S.chest[1] + sw * sa * .2], [S.hip[0] + hw * ca, S.hip[1] + 1], [S.hip[0] - hw * ca, S.hip[1] + 1]];
  poly(c, tor, look.top, rim);
  if (look.top[0] === '#') { c.save(); c.beginPath(); tor.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.closePath(); c.clip(); c.translate(sw * 1.3, sw * .25); c.beginPath(); tor.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.closePath(); c.fillStyle = shadeC(look.top, -.18); c.fill(); c.restore(); }   // the torso's shaded side
  look.torso && look.torso(c, S, tor, pose, t, o);
  limb(c, [S.hip, S.kF, S.fF], b.lw, look.legs, rim, b.lw * .85); look.foot && look.foot(c, S.fF, S.kF, look.boots, false, pose);
  look.legFront && look.legFront(c, S, pose, t, o);
  look.head(c, S, pose, t, o, rim);
  look.weapon && look.weapon(c, S, pose, t, o);
  limb(c, S.aF, b.aw, look.arms || look.top, rim, b.aw * .85); if (look.handF !== false) disc(c, S.aF[2][0], S.aF[2][1], b.aw * .55, look.hand || look.skin, null);
  look.front && look.front(c, S, pose, t, o);
  c.restore(); return S;
}
const BONES = (s = 1, o = {}) => ({ th: 11 * s, sh: 11 * s, tor: 15 * s * (o.tall || 1), neck: 2.5 * s, hr: 5.5 * s * (o.head || 1), ua: 9 * s, fa: 9 * s, aw: 4 * s * (o.arm || 1), lw: 5 * s * (o.leg || 1), sw: 6.5 * s * (o.wide || 1), hw: 5 * s * (o.wide || 1) });
function bootFoot(c, f, k, col, back) { c.fillStyle = OUT; c.fillRect(f[0] - 3, f[1] - 3, 9, 5); c.fillStyle = col; c.fillRect(f[0] - 2, f[1] - 2, 7, 3); }

// ---- head drawers --------------------------------------------------------
function headBase(c, S, look, rim, r) { const [x, y] = S.head; disc(c, x, y, r, look.skin, rim); return [x, y]; }
function eye(c, x, y, col = '#140c08') { c.fillStyle = col; c.fillRect(x, y, 1.6, 1.6); }

// =====================================================================
// SOLDIERS — assembled from parts. Every spawn is a new combination.
// =====================================================================
const G_PAL = [['#3a3044', '#241c2a', '#7a6a8a'], ['#5a2e26', '#2a1814', '#b8744a'], ['#2a4448', '#16262a', '#6a9a9a'], ['#4a4a2e', '#26261a', '#9a9a6a'], ['#1e1a22', '#0e0c12', '#c8963a'], ['#5a5a62', '#2e2e34', '#aaaab4'], ['#7a6a4a', '#3a3020', '#d0b890'], ['#8a8478', '#3a3632', '#e0d8c8'], ['#3a2a3a', '#1a1018', '#c85a6a'], ['#2e3a2a', '#141a12', '#7aa070']];
const G_HELM = ['dome', 'crest', 'spike', 'slit', 'gasmask', 'horned', 'cracked', 'cap', 'hood', 'bucket', 'visorup'];
const G_VISOR = ['#ff6a3a', '#ffd23f', '#ff3a5a', '#ff8a2a', '#6ad8ff', '#ff5a8a'];
const G_WEAP = { trooper: ['baton', 'rifleButt', 'knife', 'wrench', 'prod', 'axe', 'chain', 'harpoon', 'shovel', 'fish'], gunner: ['rifle', 'carbine', 'pistol', 'blunder', 'longrifle', 'twinpistol'], brute: ['mace', 'hammer', 'anchor', 'club', 'fists', 'shield', 'pipe'], boss: ['staff'] };
const G_ACC = ['scarf', 'antenna', 'backpack', 'pouches', 'bandolier', 'cape', 'bandage', 'cigar', 'feather', 'medal', 'goggles', 'patch'];
const NAMES = ['Gaston', 'Bertrand', 'Fernand', 'Lucien', 'Albert', 'Raoul', 'Hector', 'Émile', 'Gustave', 'Marcel', 'Octave', 'Léon', 'Firmin', 'Jules', 'Ernest', 'Achille', 'Norbert', 'Ulysse', 'Clovis', 'Anatole'];
function makeGoonLook(type, seed) {
  let s = seed * 9301 + 49297; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; const pick = a => a[(r() * a.length) | 0];
  const big = type === 'brute', boss = type === 'boss';
  const scale = boss ? 1.45 : big ? 1.32 + r() * .14 : .9 + r() * .2;
  const b = BONES(scale, { wide: big ? 1.35 + r() * .2 : .85 + r() * .35, tall: .9 + r() * .2, leg: big ? 1.3 : .9 + r() * .3, arm: big ? 1.4 : .9 + r() * .3, head: big ? .9 : .9 + r() * .2 });
  const pal = boss ? ['#1a141e', '#0c0a10', '#c8963a'] : type === 'gunner' ? pick([G_PAL[2], G_PAL[3], G_PAL[9], G_PAL[5], G_PAL[0]]) : pick(G_PAL);
  const L = { type, b, seed, name: pick(NAMES), armour: pal[0], under: pal[1], trim: pal[2], skin: pick(['#c88a62', '#a86a4a', '#e0b090', '#7a4a32', '#d8a07a']),
    helm: boss ? 'crown' : pick(G_HELM), visor: type === 'gunner' ? pick(['#7aff8a', '#aaff5a', '#5affc8']) : boss ? '#ffd23f' : pick(G_VISOR),
    shoulder: big ? 'both' : pick(['none', 'none', 'left', 'right', 'both', 'big']), wpn: pick(G_WEAP[type]), acc: [], dent: r() < .4,
    persona: { brave: r(), lazy: r(), jumpy: r(), show: r() }, voice: 120 + r() * 160, stripe: r() < .3 };
  const nAcc = boss ? 0 : (r() * 3) | 0; for (let i = 0; i < nAcc; i++) { const a = pick(G_ACC); if (!L.acc.includes(a)) L.acc.push(a); }
  if (boss) L.acc = ['cape'];
  L.top = L.armour; L.legs = L.under; L.boots = '#14100c'; L.arms = L.under; L.hand = shadeC(L.under, -.2); L.legB = L.under;
  L.foot = bootFoot;
  L.torso = (c, S, tor, pose, t, o) => { const a = pose.sp;
    c.fillStyle = shadeC(L.armour, -.25); c.beginPath(); c.moveTo(tor[3][0], tor[3][1] - 1); c.lineTo(tor[2][0], tor[2][1] - 1); c.lineTo(lerp(tor[2][0], tor[1][0], .25), lerp(tor[2][1], tor[1][1], .25)); c.lineTo(lerp(tor[3][0], tor[0][0], .25), lerp(tor[3][1], tor[0][1], .25)); c.fill(); // belt shadow
    c.fillStyle = L.trim; c.fillRect(S.hip[0] - 3, S.hip[1] - 3, 6, 2);
    if (L.stripe) { c.strokeStyle = L.trim; c.lineWidth = 1; c.beginPath(); c.moveTo(lerp(tor[0][0], tor[3][0], .3), lerp(tor[0][1], tor[3][1], .3)); c.lineTo(lerp(tor[1][0], tor[2][0], .3), lerp(tor[1][1], tor[2][1], .3)); c.stroke(); }
    if (L.dent) { c.fillStyle = shadeC(L.armour, .2); c.fillRect(S.chest[0] + 1, S.chest[1] + 4, 2, 1); c.fillRect(S.chest[0] - 2, S.chest[1] + 7, 1, 2); }
    if (L.acc.includes('bandolier')) { c.strokeStyle = '#5a3a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(tor[0][0], tor[0][1] + 1); c.lineTo(tor[2][0], tor[2][1] - 2); c.stroke(); c.fillStyle = '#c8963a'; for (let k = 1; k < 5; k++) c.fillRect(lerp(tor[0][0], tor[2][0], k / 5) - .5, lerp(tor[0][1], tor[2][1], k / 5) - 1, 1, 2); }
    if (L.acc.includes('pouches')) { c.fillStyle = '#4a3a22'; c.fillRect(S.hip[0] + 1, S.hip[1] - 4, 3, 3); c.fillRect(S.hip[0] - 4, S.hip[1] - 4, 3, 3); }
    if (L.acc.includes('medal')) { c.fillStyle = '#e8c060'; c.fillRect(S.chest[0] + 2, S.chest[1] + 3, 2, 2); c.fillStyle = '#c83a3a'; c.fillRect(S.chest[0] + 2, S.chest[1] + 1, 2, 2); }
    if (L.shoulder !== 'none') { const pads = L.shoulder === 'both' || L.shoulder === 'big' ? [-1, 1] : L.shoulder === 'left' ? [-1] : [1]; const r0 = L.shoulder === 'big' || big ? 4.5 : 3.2; for (const sd of pads) disc(c, S.chest[0] + sd * (b.sw - 1), S.chest[1] + 1, r0, shadeC(L.armour, .12), o.rim); } };
  L.back = (c, S, pose, t, o) => { if (L.acc.includes('backpack')) poly(c, [[S.chest[0] - b.sw - 3, S.chest[1] + 1], [S.chest[0] - b.sw + 1, S.chest[1] + 1], [S.hip[0] - b.hw + 1, S.hip[1] - 3], [S.hip[0] - b.hw - 3, S.hip[1] - 3]], '#3a3020');
    if (L.acc.includes('cape') || boss) { const fl = o.flow || 0, w = Math.sin(t * 3) * 1.5; poly(c, [[S.chest[0] - b.sw + 1, S.chest[1]], [S.chest[0] + 1, S.chest[1]], [S.hip[0] - 6 - fl * 8 + w, S.hip[1] + (boss ? 18 : 8)], [S.hip[0] - 14 - fl * 14 + w, S.hip[1] + (boss ? 14 : 4)]], boss ? '#8a1a1e' : shadeC(L.trim, -.3)); }
    if (L.acc.includes('scarf')) { const fl = o.flow || 0; limb(c, [[S.neck[0], S.neck[1] + 1], [S.neck[0] - 5 - fl * 6, S.neck[1] + 2 + Math.sin(t * 8) * 1.5], [S.neck[0] - 9 - fl * 10, S.neck[1] + 1 + Math.sin(t * 8 + 1) * 2]], 2.2, '#b83a2a'); } };
  L.head = (c, S, pose, t, o, rim) => { const [x, y] = S.head, R = b.hr; const blink = (Math.sin(t * 1.3 + seed) > .985);
    const vis = (cx, cy, w) => { c.fillStyle = L.visor; c.fillRect(cx, cy, w, 2); if (o.glow !== false) { c.fillStyle = L.visor + '55'; c.fillRect(cx - 1, cy - 1, w + 2, 4); } };
    switch (L.helm) {
      case 'cracked': disc(c, x, y, R, L.skin, rim); poly(c, [[x - R - .5, y], [x - R, y - R * .6], [x - R * .2, y - R - 1], [x + R * .6, y - R * .8], [x + R * .2, y - R * .2], [x - R * .2, y + R * .1]], L.armour, rim); if (!blink) eye(c, x + R * .45, y - R * .1); c.strokeStyle = OUT; c.lineWidth = .8; c.beginPath(); c.moveTo(x + R * .4, y - R * .8); c.lineTo(x + R * .1, y - R * .35); c.stroke(); break;
      case 'cap': disc(c, x, y, R, L.skin, rim); poly(c, [[x - R, y - R * .2], [x - R * .8, y - R], [x + R * .6, y - R], [x + R * 1.6, y - R * .45], [x + R * .9, y - R * .35]], L.armour, rim); if (!blink) eye(c, x + R * .5, y - R * .05); c.fillStyle = OUT; c.fillRect(x + R * .3, y + R * .45, R * .5, .8); break;
      case 'hood': disc(c, x, y, R + .5, L.under, rim); c.fillStyle = '#0a080c'; c.beginPath(); c.arc(x + R * .35, y, R * .7, -1.2, 1.4); c.fill(); vis(x + R * .2, y - 1, R * .7); break;
      case 'visorup': disc(c, x, y, R + .3, L.armour, rim); c.fillStyle = L.skin; c.fillRect(x, y - R * .3, R * .9, R * .9); if (!blink) eye(c, x + R * .55, y - R * .05); c.fillStyle = shadeC(L.armour, .2); c.fillRect(x - R * .2, y - R * 1.05, R * 1.2, 2); break;
      default: { disc(c, x, y, R + .4, L.armour, rim);
        if (L.helm === 'crest') limb(c, [[x - R * .6, y - R - 1], [x + R * .2, y - R - 3], [x + R * .8, y - R * .9]], 2, L.trim);
        if (L.helm === 'spike') poly(c, [[x - 1.5, y - R], [x, y - R - 6], [x + 1.5, y - R]], L.trim);
        if (L.helm === 'horned') { limb(c, [[x - R * .6, y - R * .6], [x - R * 1.3, y - R * 1.4], [x - R * .9, y - R * 2.1]], 1.8, '#d8ccb0'); limb(c, [[x + R * .4, y - R * .7], [x + R * .9, y - R * 1.6], [x + R * .5, y - R * 2.2]], 1.8, '#e8dcc0'); }
        if (L.helm === 'gasmask') { disc(c, x + R * .7, y + R * .4, R * .45, shadeC(L.armour, -.3)); c.fillStyle = '#2a2a2a'; c.fillRect(x + R * .5, y + R * .6, R * .6, R * .5); }
        if (L.helm === 'bucket') { c.fillStyle = shadeC(L.armour, -.15); c.fillRect(x - R - 1, y - R * .2, R * 2 + 2, R * 1.2); }
        if (L.helm === 'crown') { for (let k = 0; k < 3; k++) poly(c, [[x - R * .7 + k * R * .6, y - R * .7], [x - R * .55 + k * R * .6, y - R * 1.6], [x - R * .4 + k * R * .6, y - R * .7]], '#c8963a'); }
        vis(x - R * .1, y - R * .25, R * 1.05); if (L.helm === 'slit') { c.fillStyle = OUT; c.fillRect(x - R * .1, y - R * .25 + 2, R * 1.05, 1); } } }
    if (L.acc.includes('antenna')) { const sw = Math.sin(t * 5 + seed) * 1.5 + (o.flow || 0) * -3; limb(c, [[x - R * .5, y - R], [x - R * .6 + sw * .5, y - R - 5], [x - R * .7 + sw, y - R - 9]], 1, '#4a4a4a'); c.fillStyle = Math.sin(t * 6 + seed) > 0 ? '#ff3a2a' : '#5a1a10'; c.fillRect(x - R * .7 + sw - 1, y - R - 10, 2, 2); }
    if (L.acc.includes('feather')) limb(c, [[x - R * .4, y - R], [x - R * 1.4 + Math.sin(t * 4) * .8, y - R * 2], [x - R * 2.2, y - R * 2.4]], 1.6, '#e8e0d0');
    if (L.acc.includes('goggles')) { c.fillStyle = '#c8963a'; c.fillRect(x - R * .4, y - R * .9, R * 1.3, 2); c.fillStyle = '#9adcff'; c.fillRect(x + R * .3, y - R * .95, 2, 2); }
    if (L.acc.includes('patch')) { c.fillStyle = '#e8e0d0'; c.fillRect(x - R * .6, y - R * .7, 3, 3); c.fillStyle = '#c83a3a'; c.fillRect(x - R * .6 + 1, y - R * .7, 1, 3); c.fillRect(x - R * .6, y - R * .7 + 1, 3, 1); }
    if (L.acc.includes('cigar')) { c.fillStyle = '#e8e0d0'; c.fillRect(x + R * .9, y + R * .45, 3, 1); c.fillStyle = Math.sin(t * 3) > 0 ? '#ff7a2a' : '#c83a1a'; c.fillRect(x + R * .9 + 3, y + R * .45, 1, 1); } };
  // weapon in the front hand, along the forearm
  L.weapon = (c, S, pose, t, o) => { const [hx, hy] = S.aF[2], a = S.handAng, dx = Math.sin(a), dy = Math.cos(a), w = L.wpn;
    const along = (l0, l1) => [[hx + dx * l0, hy + dy * l0], [hx + dx * l1, hy + dy * l1]];
    const perp = (len) => [hx + dy * len, hy - dx * len];
    switch (w) {
      case 'baton': limb(c, along(-2, 12), 2, '#2a2a30'); break;
      case 'prod': limb(c, along(-2, 14), 1.6, '#3a3a40'); c.fillStyle = Math.sin(t * 30) > 0 ? '#9adcff' : '#ffffff'; c.fillRect(hx + dx * 14 - 1, hy + dy * 14 - 1, 3, 3); break;
      case 'knife': limb(c, along(0, 7), 1.6, '#d8d8e0'); break;
      case 'wrench': limb(c, along(-1, 11), 2, '#8a8a92'); disc(c, hx + dx * 12, hy + dy * 12, 2.4, '#8a8a92'); break;
      case 'axe': limb(c, along(-3, 13), 1.8, '#6a4426'); poly(c, [[hx + dx * 10, hy + dy * 10], [hx + dx * 14 + dy * 4, hy + dy * 14 - dx * 4], [hx + dx * 8 + dy * 4, hy + dy * 8 - dx * 4]], '#b8b8c0'); break;
      case 'chain': { const pts = []; for (let k = 0; k < 6; k++) pts.push([hx + dx * k * 2.5 + Math.sin(t * 8 + k) * 1.5, hy + dy * k * 2.5 + k * .6]); limb(c, pts, 1.4, '#8a8a92'); disc(c, pts[5][0], pts[5][1], 2.2, '#5a5a62'); break; }
      case 'harpoon': limb(c, along(-6, 16), 1.4, '#6a4426'); poly(c, [[hx + dx * 16, hy + dy * 16], [hx + dx * 20, hy + dy * 20], [hx + dx * 16 + dy * 2, hy + dy * 16 - dx * 2]], '#c8c8d0'); break;
      case 'shovel': limb(c, along(-5, 12), 1.6, '#6a4426'); disc(c, hx + dx * 14, hy + dy * 14, 3, '#7a7a82'); break;
      case 'fish': limb(c, along(0, 10), 3.2, '#9ab0c0'); poly(c, [[hx + dx * 10, hy + dy * 10], [hx + dx * 13 + dy * 2.5, hy + dy * 13 - dx * 2.5], [hx + dx * 13 - dy * 2.5, hy + dy * 13 + dx * 2.5]], '#7a90a0'); break;
      case 'rifleButt': case 'rifle': case 'carbine': case 'longrifle': case 'blunder': { const len = w === 'longrifle' ? 22 : w === 'carbine' ? 13 : w === 'blunder' ? 14 : 17; limb(c, along(-6, len), 2.4, '#2a2620'); c.fillStyle = '#5a3a1a'; c.fillRect(hx - dx * 6 - 1.5, hy - dy * 6 - 1.5, 4, 3); if (w === 'blunder') disc(c, hx + dx * len, hy + dy * len, 2.4, '#4a3a2a'); if (o.muzzle) { c.fillStyle = '#ffd060'; c.beginPath(); c.arc(hx + dx * (len + 3), hy + dy * (len + 3), 3 + Math.random() * 2, 0, 7); c.fill(); } break; }
      case 'pistol': case 'twinpistol': limb(c, along(0, 6), 2.2, '#2a2620'); if (o.muzzle) { c.fillStyle = '#ffd060'; c.fillRect(hx + dx * 8 - 2, hy + dy * 8 - 2, 4, 4); } break;
      case 'mace': limb(c, along(-2, 13), 2.2, '#5a3a22'); disc(c, hx + dx * 15, hy + dy * 15, 4.2, '#6a6a72'); for (let k = 0; k < 5; k++) { const a2 = k * 1.25; c.fillStyle = '#9a9aa2'; c.fillRect(hx + dx * 15 + Math.cos(a2) * 5 - .5, hy + dy * 15 + Math.sin(a2) * 5 - .5, 1.5, 1.5); } break;
      case 'hammer': limb(c, along(-2, 14), 2.2, '#5a3a22'); poly(c, [[hx + dx * 12 + dy * 5, hy + dy * 12 - dx * 5], [hx + dx * 18 + dy * 5, hy + dy * 18 - dx * 5], [hx + dx * 18 - dy * 5, hy + dy * 18 + dx * 5], [hx + dx * 12 - dy * 5, hy + dy * 12 + dx * 5]], '#7a7a82'); break;
      case 'anchor': limb(c, along(-2, 16), 2.4, '#4a4a52'); limb(c, [[hx + dx * 16 + dy * 6, hy + dy * 16 - dx * 6], [hx + dx * 19, hy + dy * 19], [hx + dx * 16 - dy * 6, hy + dy * 16 + dx * 6]], 2.4, '#4a4a52'); break;
      case 'club': limb(c, along(-2, 14), 3, '#6a4426', null, 4.5); break;
      case 'pipe': limb(c, along(-3, 16), 2.6, '#7a7a82'); break;
      case 'shield': poly(c, [[S.aB[2][0] - 2, S.aB[2][1] - 9], [S.aB[2][0] + 6, S.aB[2][1] - 9], [S.aB[2][0] + 6, S.aB[2][1] + 7], [S.aB[2][0] + 2, S.aB[2][1] + 10], [S.aB[2][0] - 2, S.aB[2][1] + 7]], shadeC(L.armour, .15), o.rim); limb(c, along(-2, 12), 2.6, '#5a3a22'); break;
      case 'staff': limb(c, along(-14, 18), 2, '#d8d0c0'); disc(c, hx + dx * 19, hy + dy * 19, 2.5, '#ffd23f'); break;
    } };
  L.behind = null; return L;
}

// =====================================================================
// HERO LOOKS on the same skeleton
// =====================================================================
function heroLook(id) {
  const L = { b: BONES(1), skin: '#e0b090', foot: bootFoot, boots: '#14100c' }; const R = () => L.b.hr;
  const face = (c, S, rim, o2 = {}) => { const [x, y] = S.head, r = L.b.hr; disc(c, x, y, r, o2.skin || L.skin, rim); if (!o2.noEye) eye(c, x + r * .45, y - r * .15); if (o2.mouth) { c.fillStyle = '#3a1410'; c.fillRect(x + r * .4, y + r * .45, r * .5, r * .3); } return [x, y, r]; };
  switch (id) {
    case 'amiral': Object.assign(L, { b: BONES(1.05, { wide: 1.05 }), top: '#2a3a7a', arms: '#2a3a7a', legs: '#16161e', legB: '#16161e', skin: '#d8a07a', trim: '#e0b45a' });
      L.behind = (c, S, p, t, o) => { const fl = o.flow || 0, w = Math.sin(t * 4) * 1; poly(c, [[S.hip[0] - 4, S.hip[1] - 4], [S.hip[0] + 2, S.hip[1] - 2], [S.hip[0] - 4 - fl * 6 + w, S.hip[1] + 13], [S.hip[0] - 11 - fl * 10 + w, S.hip[1] + 10]], '#1c2858'); c.fillStyle = '#8a2a3a'; c.fillRect(S.hip[0] - 9 - fl * 8 + w, S.hip[1] + 9, 4, 2); };
      L.torso = (c, S, tor) => { c.strokeStyle = '#e0b45a'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(tor[1][0], tor[1][1]); c.lineTo(tor[2][0], tor[2][1]); c.stroke(); c.fillStyle = '#efe6d2'; c.fillRect(S.chest[0] + 1, S.chest[1] + 2, 3, 9); c.fillStyle = '#e0b45a'; for (let k = 0; k < 3; k++) c.fillRect(S.chest[0] + 4, S.chest[1] + 3 + k * 3, 1.5, 1.5); c.fillStyle = '#a8302a'; c.fillRect(S.hip[0] - 5, S.hip[1] - 4, 10, 2); disc(c, S.chest[0] - 4, S.chest[1] + 1, 2.6, '#e0b45a'); disc(c, S.chest[0] + 5, S.chest[1] + 1, 2.6, '#e0b45a'); };
      L.legFront = (c, S) => { limb(c, [S.kF, S.fF], 2.2, '#b8862e'); c.fillStyle = '#f2d58a'; c.fillRect(S.fF[0] - 1, S.fF[1] - 2, 3, 2); };
      L.foot = (c, f, k, col, back) => { if (back) bootFoot(c, f, k, col); };
      L.head = (c, S, p, t, o, rim) => { const [x, y, r] = face(c, S, rim, { mouth: o.shout }); poly(c, [[x - r * .3, y + r * .3], [x + r * 1, y + r * .45], [x + r * .7, y + r * 1.8], [x + r * .1, y + r * 2.2], [x - r * .4, y + r * 1.2]], '#efe8dc'); poly(c, [[x - r * 1.5, y - r * .4], [x + r * 1.6, y - r * .6], [x + r * .9, y - r * 1.5], [x - r * .2, y - r * 1.9], [x - r * 1.1, y - r * 1.4]], '#14100c', rim); c.fillStyle = '#e0b45a'; c.fillRect(x - r * 1.5, y - r * .55, r * 3.1, 1); c.fillStyle = '#c83a2a'; c.fillRect(x - r * .2, y - r * 1.4, 2, 2); };
      L.weapon = (c, S, p) => { const [hx, hy] = S.aF[2], a = S.handAng; limb(c, [[hx, hy], [hx + Math.sin(a) * 16, hy + Math.cos(a) * 16]], 1.4, '#e8e4dc'); c.fillStyle = '#e0b45a'; c.fillRect(hx - 1.5, hy - 1.5, 3, 3); }; break;
    case 'marge': Object.assign(L, { b: BONES(1.18, { wide: 1.35, arm: 1.25, leg: 1.2 }), top: '#1c1616', arms: '#1c1616', legs: '#4a2a4a', legB: '#3a1e3a', skin: '#e8b088' });
      L.torso = (c, S, tor) => { c.fillStyle = '#e8c77a'; for (let k = 0; k < 6; k++) c.fillRect(lerp(tor[0][0], tor[3][0], k / 6) + 1, lerp(tor[0][1], tor[3][1], k / 6), 1, 1); c.fillStyle = '#4a2a2a'; c.fillRect(S.chest[0] + 2, S.chest[1] + 2, 3, 8); };
      L.legFront = (c, S) => { c.strokeStyle = 'rgba(240,200,210,.45)'; c.lineWidth = .6; for (let k = 1; k < 5; k++) { const p0 = [lerp(S.hip[0], S.fF[0], k / 5), lerp(S.hip[1], S.fF[1], k / 5)]; c.beginPath(); c.moveTo(p0[0] - 2, p0[1] - 1); c.lineTo(p0[0] + 2, p0[1] + 1); c.stroke(); } };
      L.head = (c, S, p, t, o, rim) => { const [x, y, r] = face(c, S, rim, { mouth: o.shout || p.nk > .2 }); for (let k = 0; k < 5; k++) poly(c, [[x - r * .7 + k * r * .35, y - r * .7], [x - r * .55 + k * r * .35 + Math.sin(t * 6 + k) * .4, y - r * 1.9 - (k % 2)], [x - r * .4 + k * r * .35, y - r * .75]], '#ff4f8a'); c.fillStyle = '#e8c77a'; c.fillRect(x - r * .1, y + r * .1, 1, 2); }; break;
    case 'cyborg': Object.assign(L, { b: BONES(1.3, { wide: 1.45, arm: 1.3, leg: 1.35, head: 1.05 }), top: '#4a4a54', arms: '#5a5a64', legs: '#34343c', legB: '#2a2a32', skin: '#8a6a5a', hand: '#b8b8c4' });
      L.torso = (c, S, tor, p, t) => { const g = .6 + Math.sin(t * 3) * .4; c.strokeStyle = `rgba(255,${120 + g * 60 | 0},40,${.7 + g * .3})`; c.lineWidth = 1.2; c.beginPath(); c.moveTo(S.chest[0] - 3, S.chest[1] + 2); c.lineTo(S.chest[0] - 1, S.chest[1] + 8); c.lineTo(S.hip[0] - 2, S.hip[1] - 2); c.moveTo(S.chest[0] + 4, S.chest[1] + 3); c.lineTo(S.chest[0] + 2, S.chest[1] + 10); c.stroke(); };
      L.head = (c, S, p, t, o, rim) => { const [x, y, r] = face(c, S, rim, { noEye: true }); poly(c, [[x - r * .1, y - r], [x + r * 1.05, y - r * .7], [x + r * 1.05, y + r * .5], [x + r * .1, y + r * .9]], '#9a9aa4', rim); c.fillStyle = '#ff3a1a'; c.fillRect(x + r * .45, y - r * .3, 2.5, 2); c.fillStyle = 'rgba(255,60,30,.35)'; c.fillRect(x + r * .3, y - r * .5, 4, 4); eye(c, x - r * .3, y - r * .2); };
      L.weapon = (c, S) => { const [hx, hy] = S.aF[2]; disc(c, hx, hy, 4.5, '#c8c8d0'); }; L.handF = false;
      L.front = (c, S) => { limb(c, S.aF, 6.5, '#7a7a84', '#d8d8e0', 6); disc(c, S.aF[2][0], S.aF[2][1], 4.8, '#c8c8d0', '#ffffff'); }; break;
    case 'ruby': Object.assign(L, { b: BONES(1, { wide: .95 }), top: '#141010', arms: '#141010', legs: '#2a3a5a', legB: '#1e2a44', skin: '#f0c8a0' });
      L.back = (c, S, p, t, o) => { if (o.swing) return; limb(c, [[S.chest[0] - 6, S.chest[1] - 2], [S.hip[0] + 4, S.hip[1] + 2]], 2, '#2a1a10'); disc(c, S.hip[0] - 1, S.hip[1] - 2, 4.5, '#c82a2a'); };
      L.torso = (c, S) => { c.fillStyle = '#d8dce0'; for (let k = 0; k < 4; k++) c.fillRect(S.chest[0] + 3, S.chest[1] + 2 + k * 3, 1, 1); };
      L.head = (c, S, p, t, o, rim) => { const [x, y, r] = face(c, S, rim, { mouth: o.shout }); for (let k = 0; k < 6; k++) poly(c, [[x - r * .8 + k * r * .3, y - r * .7], [x - r * .65 + k * r * .3, y - r * 2.2 - (k % 2)], [x - r * .5 + k * r * .3, y - r * .75]], '#e0302a'); };
      L.weapon = (c, S, p, t, o) => { if (!o.swing) return; const [hx, hy] = S.aF[2], a = S.handAng, dx = Math.sin(a), dy = Math.cos(a); limb(c, [[hx - dx * 2, hy - dy * 2], [hx + dx * 14, hy + dy * 14]], 2, '#2a1a10'); disc(c, hx + dx * 16, hy + dy * 16, 5, '#c82a2a', '#ff7a6a'); }; break;
    case 'magneto': Object.assign(L, { b: BONES(1.28, { wide: 1.4, arm: 1.45, leg: 1.25 }), top: '#c8885a', arms: '#c8885a', legs: '#2a3a7a', legB: '#1e2a5a', skin: '#c8885a' });
      L.torso = (c, S, tor) => { poly(c, [[lerp(tor[0][0], tor[3][0], .3), lerp(tor[0][1], tor[3][1], .3)], [lerp(tor[1][0], tor[2][0], .3), lerp(tor[1][1], tor[2][1], .3)], tor[2], tor[3]], '#2a3a7a'); c.fillStyle = '#c8963a'; c.fillRect(S.hip[0] - 6, S.hip[1] - 4, 12, 3); c.fillStyle = '#f2cc6a'; c.fillRect(S.hip[0] - 2, S.hip[1] - 5, 4, 4); };
      L.head = (c, S, p, t, o, rim) => { const [x, y, r] = face(c, S, rim, { mouth: o.shout }); poly(c, [[x - r * .9, y - r * .9], [x + r * 1.05, y - r * .9], [x + r * 1.05, y + r * .25], [x - r * .2, y + r * .4]], '#c82a2a', rim); c.fillStyle = '#f0c860'; c.fillRect(x - r * .9, y - r * .9, r * 1.95, 1); c.fillStyle = '#f6f0e0'; c.fillRect(x + r * .4, y - r * .35, 2.5, 1.5); };
      L.handF = false; L.front = (c, S, p, t) => { const g = .5 + Math.sin(t * 5) * .5; disc(c, S.aF[2][0], S.aF[2][1], 4.2, '#6a7a9a', '#c8d8ff'); c.fillStyle = `rgba(120,200,255,${.4 + g * .4})`; c.beginPath(); c.arc(S.aF[2][0], S.aF[2][1], 6 + g * 2, 0, 7); c.fill(); }; break;
    case 'doc': Object.assign(L, { b: BONES(.95, { wide: 1 }), top: '#5a5a3a', arms: '#5a5a3a', legs: '#44442e', legB: '#36362a', skin: '#e0b090' });
      L.back = (c, S) => { poly(c, [[S.hip[0] - 7, S.hip[1] - 6], [S.hip[0] - 1, S.hip[1] - 6], [S.hip[0] - 1, S.hip[1] + 1], [S.hip[0] - 7, S.hip[1] + 1]], '#6a4426'); };
      L.torso = (c, S) => { c.fillStyle = '#efe6d2'; c.fillRect(S.chest[0] + 3, S.chest[1] + 2, 4, 4); c.fillStyle = '#3a8a4a'; c.fillRect(S.chest[0] + 4.5, S.chest[1] + 2.5, 1, 3); c.fillRect(S.chest[0] + 3.5, S.chest[1] + 3.5, 3, 1); };
      L.head = (c, S, p, t, o, rim) => { const [x, y, r] = face(c, S, rim, { mouth: o.shout }); poly(c, [[x - r * 1.05, y + r * .2], [x - r * 1.05, y - r * .6], [x - r * .2, y - r * 1.15], [x + r * .9, y - r * .7], [x + r * .3, y - r * .55], [x - r * .5, y - r * .2]], '#bfb8ac', rim); disc(c, x - r * 1, y - r * .9, r * .5, '#b8b0a4'); }; break;
    case 'soldier': Object.assign(L, { b: BONES(1.05, { wide: 1.1 }), top: '#4a5a2e', arms: '#46562c', legs: '#46562c', legB: '#3a4a24', skin: '#d86a4a' });
      L.back = (c, S) => { limb(c, [[S.chest[0] - 7, S.chest[1] - 3], [S.hip[0] + 3, S.hip[1] + 3]], 2.4, '#2a2620'); };
      L.torso = (c, S, tor) => { const sp = [[.2, .2, '#2a3418'], [.6, .4, '#6a7a40'], [.3, .7, '#3a2a18'], [.75, .75, '#2a3418'], [.5, .15, '#6a7a40']]; for (const [u, v, col] of sp) { c.fillStyle = col; c.fillRect(lerp(lerp(tor[0][0], tor[1][0], u), lerp(tor[3][0], tor[2][0], u), v) - 1.5, lerp(lerp(tor[0][1], tor[1][1], u), lerp(tor[3][1], tor[2][1], u), v) - 1, 3, 2); } c.fillStyle = '#2a2010'; c.fillRect(S.hip[0] - 6, S.hip[1] - 4, 12, 2); };
      L.head = (c, S, p, t, o, rim) => { const [x, y, r] = face(c, S, rim, { mouth: o.shout || p.nk < -.3 }); poly(c, [[x - r * 1.25, y - r * .1], [x - r * 1.1, y - r * 1.1], [x, y - r * 1.4], [x + r * 1.1, y - r * 1.1], [x + r * 1.3, y - r * .05]], '#3a4a24', rim); c.fillStyle = '#2a3418'; c.fillRect(x - r * 1.3, y - r * .15, r * 2.6, 1.2); }; break;
    case 'raccoon': Object.assign(L, { b: BONES(.82, { head: 1.25, wide: 1.05 }), top: '#d8962a', arms: '#d8962a', legs: '#c8862a', legB: '#a8701e', skin: '#a8a098', hand: '#5a5450' });
      L.behind = (c, S, p, t, o) => { const fl = o.flow || 0, w = Math.sin(t * 3) * 2; const pts = [[S.hip[0] - 2, S.hip[1]], [S.hip[0] - 8 - fl * 4, S.hip[1] + 2 + w * .5], [S.hip[0] - 14 - fl * 8, S.hip[1] - 2 + w]]; limb(c, pts, 5, '#8a7a6a'); for (let k = 1; k < 3; k++) { c.fillStyle = '#2a2420'; c.beginPath(); c.arc(lerp(pts[0][0], pts[2][0], k / 3), lerp(pts[0][1], pts[2][1], k / 3), 2.2, 0, 7); c.fill(); } };
      L.back = (c, S, p, t, o) => { poly(c, [[S.chest[0] - 9, S.chest[1]], [S.chest[0] - 4, S.chest[1]], [S.hip[0] - 4, S.hip[1] - 2], [S.hip[0] - 9, S.hip[1] - 2]], '#5a5a66'); if (o.fly) { c.fillStyle = '#9fdcff'; c.fillRect(S.hip[0] - 8, S.hip[1], 3, 5 + Math.random() * 4); c.fillStyle = '#ffffff'; c.fillRect(S.hip[0] - 7, S.hip[1], 1, 4); } };
      L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, r = L.b.hr, tw = Math.sin(t * 9) > .95 ? 1 : 0; disc(c, x - r * .55, y - r * .95 - tw, r * .45, '#5a5450'); disc(c, x + r * .35, y - r * 1.0, r * .45, '#7a726c'); disc(c, x, y, r, '#a8a098', rim); c.fillStyle = '#141210'; c.fillRect(x - r * .5, y - r * .35, r * 1.5, r * .55); c.fillStyle = '#f2ece4'; c.fillRect(x - r * .4, y - r * .6, r * 1.3, 1); c.fillStyle = '#f6e8b0'; c.fillRect(x + r * .45, y - r * .2, 1.5, 1.5); disc(c, x + r * .9, y + r * .35, r * .4, '#efe8de'); c.fillStyle = '#141210'; c.fillRect(x + r * 1.15, y + r * .2, 1.6, 1.4); }; break;
    case 'demi': Object.assign(L, { b: BONES(1, {}), top: '#2a1a2a', arms: '#a83a14', legs: '#1a0e0e', legB: '#1a0e0e', skin: '#1a0e0e', hand: '#e0a070' });
      L.legFront = (c, S, p, t) => { // the cloak, half flame, half frost, over the legs
        const top = S.chest, l = Math.min(S.fF[0], S.fB[0]) - 5, r2 = Math.max(S.fF[0], S.fB[0]) + 5, by = Math.max(S.fF[1], S.fB[1]);
        poly(c, [[top[0] - 6, top[1]], [top[0], top[1] - 1], [S.hip[0] + .5, by], [l, by]], '#c84a1a'); poly(c, [[top[0], top[1] - 1], [top[0] + 6, top[1]], [r2, by], [S.hip[0] + .5, by]], '#6a90c0');
        for (let k = 0; k < 5; k++) { const yy = top[1] + 4 + k * 5, fl = Math.sin(t * 12 + k) * 1.5; c.fillStyle = k % 2 ? '#ffb040' : '#ff7a2a'; c.beginPath(); c.moveTo(l + k * .8, yy); c.lineTo(l - 4 + fl, yy - 3); c.lineTo(l + k * .8 + 1, yy - 4); c.fill(); c.fillStyle = '#e8f6ff'; c.fillRect(r2 - k * .6, yy + Math.sin(t * 4 + k), 1.5, 2.5); } };
      L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, r = L.b.hr; poly(c, [[x - r * 1.3, y + r * 1.2], [x - r * 1.2, y - r * .8], [x, y - r * 1.5], [x + r * 1.2, y - r * .7], [x + r * 1.3, y + r * 1.2]], '#5a3a5a', rim); c.fillStyle = '#a83a14'; c.beginPath(); c.moveTo(x - r * 1.3, y + r * 1.2); c.lineTo(x - r * 1.2, y - r * .8); c.lineTo(x, y - r * 1.5); c.lineTo(x, y + r * 1.2); c.fill(); c.fillStyle = '#100808'; c.beginPath(); c.arc(x + r * .3, y + r * .1, r * .8, 0, 7); c.fill(); c.fillStyle = '#ffa040'; c.fillRect(x, y, 1.6, 1.6); c.fillStyle = '#a0e0ff'; c.fillRect(x + r * .7, y, 1.6, 1.6); }; break;
  }
  return L;
}

// =====================================================================
// THE NON-HUMANS: Papi on his tidewalker, Spora, Bernache
// =====================================================================
function drawTidewalker(c, x, y, face, s, t, st) { // st: { walk, speed, atk, air, hurt, idle }
  c.save(); c.translate(x, y); c.scale(face * s, s);
  const K = st.kind || 0, KS = st.ks || 0, KE = K && typeof ph === 'function' ? ph(KS).e : 0;
  if (K === 3) { const r = KS < .45 ? ease(KS / .45) : Math.max(0, 1 - (KS - .45) / .1); c.translate(-14, 0); c.rotate(-.55 * r); c.translate(14, 0); }
  const phw = st.walk * 1.2, bodyY = -38 + Math.sin(phw * 2) * 1.2 - (st.air ? 6 : 0), neckSw = Math.sin(t * 1.6) * 2 + (st.atk && K !== 2 ? 6 : 0) + (K === 2 ? KE * 18 : 0);
  // four stilt legs with knees, two pairs in counter phase
  const legs = [[-12, 0], [-4, Math.PI], [6, Math.PI * .5], [13, Math.PI * 1.5]];
  legs.forEach(([lx, off], i) => { const a = Math.sin(phw + off) * (st.speed > .1 ? .5 : .05), lift = Math.max(0, Math.cos(phw + off)) * (st.speed > .1 ? 6 : 0);
    const hip = [lx, bodyY + 3], knee = [lx + 6 + Math.sin(a) * 10, bodyY + 18 - lift * .5], foot = [lx + Math.sin(a) * 14, -lift];
    limb(c, [hip, knee, foot], 2.2, i % 2 ? '#3a3020' : '#5a4a30', null, 1.6); c.fillStyle = '#2a2418'; c.fillRect(foot[0] - 2, foot[1] - 1, 5, 2); });
  // body, saddle, the rocket
  poly(c, [[-18, bodyY], [16, bodyY - 2], [19, bodyY + 6], [-16, bodyY + 8]], '#9a8a4a', '#d8c890');
  for (let k = 0; k < 5; k++) { c.fillStyle = 'rgba(70,58,30,.5)'; c.fillRect(-12 + k * 6, bodyY + 2 + (k % 2) * 2, 2, 2); }
  poly(c, [[-14, bodyY - 6], [-4, bodyY - 7], [-3, bodyY - 1], [-14, bodyY - 1]], '#d8d8d0', '#ffffff'); c.fillStyle = '#a83a2a'; c.fillRect(-12, bodyY - 6, 1, 5);
  if (st.rocket) { c.fillStyle = '#ffd27a'; c.beginPath(); c.moveTo(-14, bodyY - 5); c.lineTo(-30 - Math.random() * 8, bodyY - 3.5); c.lineTo(-14, bodyY - 2); c.fill(); }
  // neck and head
  limb(c, [[14, bodyY], [20 + neckSw * .3, bodyY - 10], [24 + neckSw, bodyY - 16]], 4, '#9a8a4a', '#d8c890', 3);
  poly(c, [[22 + neckSw, bodyY - 20], [32 + neckSw, bodyY - 18], [33 + neckSw, bodyY - 15], [22 + neckSw, bodyY - 13]], '#a89a5a', '#d8c890'); eye(c, 29 + neckSw, bodyY - 18); if (Math.sin(t * 2) > .95) { c.fillStyle = '#a89a5a'; c.fillRect(28 + neckSw, bodyY - 18.5, 3, 1.5); }
  limb(c, [[33 + neckSw, bodyY - 16], [38 + neckSw, bodyY - 14 + Math.sin(t * 5)]], .6, '#5a4a2a'); limb(c, [[33 + neckSw, bodyY - 15], [37 + neckSw, bodyY - 11 + Math.cos(t * 5)]], .6, '#5a4a2a');
  // Papi on the saddle
  const pb = bodyY - 8 + Math.abs(Math.sin(phw * 2)) * -1.5;
  limb(c, [[-6, pb], [-2, pb + 6], [-4, pb + 11]], 3, '#3a3a44');
  poly(c, [[-10, pb - 13], [-1, pb - 14], [0, pb], [-10, pb]], '#9a3a2a', '#d86a4a');
  const reach = K === 1 ? 4 + KE * 10 : 0, arm = st.atk ? [[-2, pb - 11], [6 + reach * .5, pb - 10], [14 + reach, pb - 11]] : [[-2, pb - 11], [2, pb - 6], [6, pb - 7]]; limb(c, arm, 2.6, '#8a3020');
  if (st.atk) { c.save(); c.translate(reach, 0); c.strokeStyle = '#d8dcd8'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(12, pb - 13); c.lineTo(24, pb - 15); c.moveTo(12, pb - 9); c.lineTo(24, pb - 11); c.moveTo(24, pb - 15); c.lineTo(24, pb - 11); c.stroke(); c.restore(); }
  disc(c, -5, pb - 19, 4.2, '#e0b090', '#fff0d8'); c.fillStyle = '#4a4a3a'; c.fillRect(-9.5, pb - 23.5, 9, 3); c.fillRect(-1, pb - 22, 4, 1.5); c.fillStyle = '#f4f0e8'; c.fillRect(-3, pb - 17.5, 5, 1.5 + (st.idle && Math.sin(t * 3) > 0 ? .8 : 0)); eye(c, -2.5, pb - 20);
  c.restore();
}
function drawSpora(c, x, y, face, s, t, st) {
  c.save(); c.translate(x, y - 22 + Math.sin(t * 2.4) * 2.5); c.scale(face * s, s);
  const pulse = .5 + Math.sin(t * 3) * .5;
  for (let k = 0; k < 9; k++) { const x0 = -11 + k * 2.8, pts = [[x0, -2]]; for (let j = 1; j <= 4; j++) pts.push([x0 + Math.sin(t * 2.5 + k + j * .7) * (1.5 + j) - (st.speed || 0) * j * 1.5, -2 + j * 4]); limb(c, pts, 1.4, k % 3 ? '#c890b8' : '#4a8a3a', null, .8); if (k % 2) { c.fillStyle = `rgba(255,220,240,${.5 + pulse * .5})`; c.fillRect(pts[4][0] - .5, pts[4][1], 1.5, 1.5); } }
  c.beginPath(); c.ellipse(0, -3, 14, 5, 0, 0, 7); c.fillStyle = OUT; c.fill(); c.beginPath(); c.ellipse(0, -3, 13, 4, 0, 0, 7); c.fillStyle = `rgba(216,150,200,${.85})`; c.fill();
  c.beginPath(); c.ellipse(0, -8, 15 + pulse, 10 + pulse * .5, 0, Math.PI, 0); c.fillStyle = OUT; c.fill(); c.beginPath(); c.ellipse(0, -8, 14 + pulse, 9 + pulse * .5, 0, Math.PI, 0); c.fillStyle = '#4a7a3a'; c.fill();
  for (let k = 0; k < 16; k++) { const a = Math.PI + (k * 2.3 % Math.PI), r = (k * 5.3) % 12; c.fillStyle = k % 3 ? '#6aa04a' : '#3a6a2a'; c.fillRect(Math.cos(a) * r - 1, -8 + Math.sin(a) * r * .7 - 1, 3, 2); }
  for (let k = 0; k < 6; k++) { const a = Math.PI + (k * 1.1 + t * .3) % Math.PI; c.fillStyle = `rgba(230,255,150,${.4 + pulse * .6})`; c.fillRect(Math.cos(a) * 10, -8 + Math.sin(a) * 7, 1.5, 1.5); }
  const blink = Math.sin(t * 1.7) > .97; c.fillStyle = '#fff0a0'; if (!blink) { c.fillRect(2, -11, 2.5, 2); c.fillRect(7, -11, 2.5, 2); } else { c.fillRect(2, -10, 2.5, .8); c.fillRect(7, -10, 2.5, .8); }
  const SK = st.kind || 0, SE = SK && typeof ph === 'function' ? ph(st.ks || 0).e : 0;
  if (SK === 1 || SK === 2) { limb(c, [[8, -4], [8 + SE * 18, -10 - SE * 4], [8 + SE * 38, -6 + Math.sin(t * 30) * 2]], 1.8, '#4a8a3a', null, 1); if (SK === 2) limb(c, [[6, -2], [6 + SE * 18, 4], [6 + SE * 36, 2]], 1.8, '#c890b8', null, 1); }
  else if (SK === 3) { c.fillStyle = `rgba(200,255,140,${.7 * (1 - SE * .5)})`; c.beginPath(); c.arc(10, -6, 8 + SE * 34, 0, 7); c.fill(); for (let k = 0; k < 10; k++) { const a = k * .63; c.fillStyle = '#efffc0'; c.fillRect(10 + Math.cos(a) * (10 + SE * 36), -6 + Math.sin(a) * (10 + SE * 30), 2, 2); } }
  else if (st.atk) { c.fillStyle = '#9ad86a'; c.fillRect(12, -6, 8, 2); }
  c.restore();
}
function drawGoose(c, x, y, face, s, t, st) {
  c.save(); c.translate(x, y); c.scale(face * s, s);
  const GK = st.kind || 0, GE = GK && typeof ph === 'function' ? ph(st.ks || 0).e : 0;
  const wad = Math.sin(st.walk * 1.4) * (st.speed > .1 ? 2.5 : 0), bob = Math.sin(st.walk * 2.8) * (st.speed > .1 ? 1 : 0), flap = GK === 1 ? 0 : GK === 2 ? (GE * 2 - 1) : GK === 3 ? 1 : st.atk || st.air ? Math.sin(t * 30) : 0, honk = GK ? GK !== 2 || GE > .5 : st.atk;
  if (GK === 3) c.rotate(.18 * GE);
  c.translate(0, bob); c.rotate(wad * .04);
  const legs = [[-3, Math.sin(st.walk * 1.4) * 3], [3, -Math.sin(st.walk * 1.4) * 3]]; legs.forEach(([lx, o]) => { limb(c, [[lx, -7], [lx + o, -1]], 1.4, '#2a2420'); c.fillStyle = '#2a2420'; c.fillRect(lx + o - 2, -1, 5, 1.5); });
  poly(c, [[-15, -13], [-8, -18], [6, -18], [11, -12], [6, -6], [-8, -6]], '#7a6a5a', '#b8a898'); poly(c, [[1, -15], [9, -14], [7, -7], [0, -7]], '#ece4d4'); poly(c, [[-19, -14], [-14, -16], [-13, -11], [-18, -11]], '#2a2420');
  // wings: folded, or raised and beating when she honks or flies
  if (flap || st.idle === 'preen') { const up = st.idle === 'preen' ? .4 : .5 + flap * .5; poly(c, [[-8, -16], [-2, -16], [-6 - 14 * up, -16 - 22 * up], [-14 - 10 * up, -16 - 16 * up]], '#9a8a78', '#d8ccb8'); poly(c, [[-4, -16], [2, -16], [-1 - 12 * up, -18 - 26 * up], [-8 - 10 * up, -17 - 20 * up]], '#8a7a68', '#c8bca8'); }
  else poly(c, [[-12, -16], [4, -16], [2, -11], [-12, -12]], '#9a8a78', '#c8bca8');
  const nk = GK === 1 ? GE * 12 : st.idle === 'peck' && !GK ? Math.max(0, Math.sin(t * 6)) * 8 : st.idle === 'preen' && !GK ? -6 : 0, hx = 10 + (honk ? 6 : 0) + (st.idle === 'peck' && !GK ? 4 : 0) + (GK === 1 ? GE * 12 : GK === 3 ? 6 : 0), hy = -30 + nk + (honk ? 6 : 0);
  limb(c, [[6, -15], [8 + (hx - 10) * .5, (hy - 15) / 2 - 8], [hx, hy]], 3.2, '#141210', '#3a3632', 2.8);
  poly(c, [[hx - 3, hy - 3], [hx + 3, hy - 3], [hx + 4, hy + 1], [hx - 3, hy + 2]], '#141210'); poly(c, [[hx - 2, hy], [hx + 1, hy - 1], [hx + 1, hy + 3], [hx - 2, hy + 3]], '#f6f0e4');
  c.fillStyle = '#2a2420'; if (honk) { poly(c, [[hx + 3, hy - 2], [hx + 10, hy - 4], [hx + 4, hy]], '#2a2420'); poly(c, [[hx + 3, hy + 1], [hx + 9, hy + 3], [hx + 4, hy + 1.5]], '#2a2420'); c.fillStyle = '#a8302a'; c.fillRect(hx + 4, hy - 1, 4, 1.5); } else poly(c, [[hx + 3, hy - 2], [hx + 9, hy - 1], [hx + 3, hy + 1]], '#2a2420');
  c.fillStyle = '#ffd040'; c.fillRect(hx, hy - 2, 1.5, 1.5);
  c.restore();
}
