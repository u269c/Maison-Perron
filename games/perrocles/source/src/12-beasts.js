// ═══ BEASTS: a posable four-legged rig (dog, wolf, goat, sheep, cat), fowl and serpents, with their gaits and habits ═══
const BEAST = {
  dog: { L: 24, H: 10.5, leg: 14, neck: 8.5, head: 1.0, muzzle: 1.0, ear: 'flop', tail: 'brush', fur: '#a8784a', fur2: '#76502e', light: '#efe2c4', nose: '#2a1d14', shag: true },
  wolf: { L: 29, H: 11.5, leg: 17, neck: 9.5, head: 1.05, muzzle: 1.15, ear: 'point', tail: 'brushDown', fur: '#8c8a82', fur2: '#5a5854', light: '#ddd8cc', nose: '#1d1612', shag: true, eye: '#e0a020' },
  goat: { L: 23, H: 11.5, leg: 14.5, neck: 9, head: 0.95, muzzle: 0.9, ear: 'side', tail: 'flick', fur: '#e6dccb', fur2: '#a8987e', light: '#f6f0e4', nose: '#5a4434', horns: true, beard: true, patch: '#8a6a4a' },
  sheep: { L: 25, H: 14, leg: 10.5, grazeK: 0.75, neck: 6, head: 0.9, muzzle: 0.85, ear: 'side', tail: 'stub', fur: '#ece4d4', fur2: '#c8bca6', light: '#f8f2e6', nose: '#2a2420', wool: true, face: '#3a302a' },
  lion: { L: 34, H: 15, leg: 15.5, legK: 1.34, legKF: 1.34, neck: 7.5, head: 1.25, muzzle: 0.9, ear: 'round', tail: 'tuft', fur: '#c8944c', fur2: '#9a6a32', light: '#ecd4a4', nose: '#5a3424', mane: '#7a4a22', eye: '#d0a030' },
  deer: { L: 28, H: 10.5, leg: 18.5, legK: 1.16, legKF: 1.12, grazeK: 0.62, neck: 11, head: 0.9, muzzle: 1.0, ear: 'side', tail: 'stub', fur: '#c08a52', fur2: '#8a5e34', light: '#f2e2c6', nose: '#2a1d14', antlers: '#e8c040', eye: '#1d130e', dapple: true },
  boar: { L: 30, H: 14, leg: 9.5, legK: 1.22, legKF: 1.16, hump: true, neck: 3.5, head: 1.15, muzzle: 1.1, ear: 'point', tail: 'flick', fur: '#5e4c3a', fur2: '#3a2e24', light: '#7e6c58', nose: '#4a3428', tusks: true, crest: '#2a201a', eye: '#d8a040' },
  cow: { L: 34, H: 15, leg: 13, legK: 1.3, legKF: 1.3, grazeK: 0.95, udder: true, shortHorns: true, neck: 6, head: 1.2, muzzle: 1.0, ear: 'side', tail: 'flick', fur: '#e8e0d0', fur2: '#a89880', light: '#f6f0e4', nose: '#c88a7a', horns: true, patch: '#6a4a34', eye: '#1d130e' },
  cat: { L: 16, H: 7, leg: 8.5, neck: 4.5, head: 0.75, muzzle: 0.45, ear: 'point', tail: 'long', fur: '#c48a4e', fur2: '#8a5a2e', light: '#f0dcc0', nose: '#d07a70', stripes: true, eye: '#8ab040' },
};
// ── four-legged gaits: phase offsets per leg [near hind, far hind, near front, far front] ──
const QGAITS = { walk: { L: 30, stance: 0.66, off: [0, 0.5, 0.25, 0.75], lift: 3, bob: 0.6 }, trot: { L: 44, stance: 0.5, off: [0, 0.5, 0.5, 0], lift: 3.6, bob: 1.0 }, run: { L: 72, stance: 0.36, off: [0, 0.08, 0.5, 0.58], lift: 5, bob: 1.6 } };
function qgait(p, kind, sz = 1) { const G = QGAITS[kind], S = G.L * sz * G.stance, feet = [], lift = []; for (let i = 0; i < 4; i++) { const pi = (p + G.off[i]) % 1; if (pi < G.stance) { feet.push(S * (0.5 - pi / G.stance)); lift.push(0); } else { const s = (pi - G.stance) / (1 - G.stance); feet.push(-S / 2 + S * smooth(s)); lift.push(Math.sin(s * Math.PI) * G.lift * sz); } }
  const pitch = kind === 'run' ? Math.sin(p * TAU) * 0.08 : 0; return { feet, lift, drop: G.bob * (1 - Math.cos(p * TAU * 2)) / 2, pitch, tailSw: Math.sin(p * TAU) * 0.15, headBob: Math.sin(p * TAU * 2) * 0.05 }; }

function rigBeast(pen, o, C) { const x = pen.x, F = pen.fill, Ln = pen.line, D = BEAST[o.kind], vase = pen.mode === 'vase';
  const fur = o.fur || D.fur, f2 = o.fur2 || D.fur2, lt = o.light || D.light, L = D.L, H = D.H, leg = D.leg;
  const sit = o.sit || 0, lie = o.lie || 0, drop = (o.drop || 0) + lie * (leg - 2.5);
  const hipX = -L / 2 + 4, shX = L / 2 - 4, by0 = -leg - H * 0.5;
  // the body pivots about the front shoulder when sitting (hind end goes down), and lowers when lying
  const pitch = (o.pitch || 0) - sit * 0.5, hipLow = sit * (leg * 0.85);
  const P = (px, py) => { const dx = px - shX, dy = py - by0, c = Math.cos(pitch), s = Math.sin(pitch); return [shX + dx * c - dy * s, by0 + dx * s + dy * c + drop]; };
  const feet = o.feet || [-1.2, 1.6, 1.2, -1.4], lift = o.lift || [0, 0, 0, 0], FAR = [0, 1.4, 0, 1.4];
  // a leg: two bones from the hip/shoulder to the foot; hind legs fold with the hock back, front legs bend at the wrist when lifted
  const legDraw = (i, near) => { const hind = i < 2, base = hind ? P(hipX + FAR[i], by0 - H * 0.05) : P(shX + FAR[i], by0 - H * 0.05), w = (o.kind === 'cat' ? 0.62 : o.kind === 'sheep' ? 0.8 : o.kind === 'wolf' ? 1.0 : o.kind === 'lion' ? 1.55 : 0.92) * (hind ? 1.05 : 1);
    let Tx = (hind ? hipX : shX) + feet[i] + (hind ? 0.5 : 0.8) + FAR[i], Ty = -1.2 - lift[i];
    if (hind && sit > 0) { Tx = lerp(Tx, hipX + 6, sit); Ty = -1.2; }
    if (lie > 0) { Tx = lerp(Tx, (hind ? hipX + 6 : shX + 9), lie); Ty = lerp(Ty, -1.2, lie); }
    if (hind && near && o.scratch) { const k = o.scratch, wig = Math.sin(o.scratchPh || 0) * 1.6; Tx = lerp(Tx, shX + 2 + wig, k); Ty = lerp(Ty, by0 - H * 0.3 + wig * 0.5, k); }
    const lk = (hind ? D.legK : D.legKF || D.legK) || 1, l1 = leg * (hind ? 0.58 : 0.55) * lk, l2 = leg * (hind ? 0.62 : 0.55) * lk; let dx = Tx - base[0], dy = Ty - base[1], dd = Math.hypot(dx, dy); const mx = l1 + l2 - 0.05; if (dd > mx) { dx *= mx / dd; dy *= mx / dd; dd = mx; }
    const bA = Math.atan2(dy, dx), aa = Math.acos(clamp((l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd), -1, 1)), sgn = hind ? 1 : (lift[i] > 0.6 ? -1 : 1), Kx = base[0] + Math.cos(bA + sgn * aa) * l1, Ky = base[1] + Math.sin(bA + sgn * aa) * l1, Ax = base[0] + dx, Ay = base[1] + dy;
    const c = near ? f2 : darken(f2, 0.16);
    F(Path().limb(base[0], base[1], Kx, Ky, w * (hind ? 2.4 : 1.6), w * (hind ? 1.1 : 1.0)), c); F(Path().limb(Kx, Ky, Ax, Ay, w, w * 0.85), c);
    F(Path().E(Ax + 0.7, Ay + 0.3, w * 1.5, w * 0.9), o.kind === 'goat' || o.kind === 'sheep' ? '#3a2a20' : darken(f2, 0.25), { lw: 0.3 }); };
  legDraw(1, false); legDraw(3, false);
  // tail
  const tw = (o.tail || 0) + (o.wag ? Math.sin(o.wag) * 0.5 : 0), tb = P(-L / 2 + 1, by0 - H * 0.2);
  x.save(); x.translate(tb[0], tb[1]); x.rotate(pitch + tw);
  if (D.tail === 'brush') F(Path().M(0.8, -2.4).Q(-3.6, -4.4, -6.6, -10.6).Q(-2.6, -11, -1.2, -6.4).Q(-0.2, -2.4, 1.2, 2).Z(), fur);
  else if (D.tail === 'brushDown') F(Path().M(0.5, -2).Q(-6, -2.4, -8.6, 7).Q(-5.6, 7.4, -3.6, 3).Q(-1.4, 1.6, 0.8, 1.6).Z(), fur);
  else if (D.tail === 'flick') F(Path().M(0, -1.4).L(-3.4, -5).L(-1.2, 0.6).Z(), f2);
  else if (D.tail === 'stub') F(Path().E(-1.2, 0, 2.4, 2), fur);
  else if (D.tail === 'tuft') { const P2 = Path().M(0, -1); for (let j = 1; j <= 7; j++) { const k = j / 7; P2.L(-k * 15, -Math.sin(k * 2.2 + (o.tailCurl || 0)) * 7 + k * 4); } Ln(P2, fur, 2.2); F(Path().E(-15, -Math.sin(2.2 + (o.tailCurl || 0)) * 7 + 4, 2.6, 2.2), D.mane, { lw: 0.3 }); }
  else if (D.tail === 'long') { const P2 = Path().M(0, -1); const n = 7; for (let j = 1; j <= n; j++) { const k = j / n; P2.L(-k * 13, -Math.sin(k * 2.6 + (o.tailCurl || 0)) * 6 - k * 3); } Ln(P2, fur, 2.4); }
  x.restore();
  // body
  const tuck = o.kind === 'goat' || o.kind === 'sheep' ? 0.42 : 0.18; const bp = [[-L / 2 - 1, -0.2], [-L / 2 + 1.5, -H * 0.46], [-L * 0.05, -H * 0.5], [L / 2 - 5, -H * 0.64], [L / 2 + 1.2, -H * 0.2], [L / 2 + 0.5, H * 0.3], [L / 2 - 4, H * 0.58], [-L * 0.08, H * tuck], [-L / 2 + 4, H * 0.38]].map(([px, py]) => P(px, by0 + py));
  if (D.wool) { const pts = []; for (let j = 0; j < 22; j++) { const a = j / 22 * TAU, r = (j % 2 ? 1 : 1.12); pts.push(P(Math.cos(a) * L * 0.55 * r, by0 + Math.sin(a) * H * 0.62 * r)); } F(Path().blob(pts), fur); if (!vase) for (let j = 0; j < 9; j++) { const a = j / 9 * TAU, c2 = P(Math.cos(a) * L * 0.3, by0 + Math.sin(a) * H * 0.3 - 1); F(Path().E(c2[0], c2[1], 2.4, 1.8), lighten(fur, 0.35), { flat: true, noline: true, alpha: 0.7 }); } }
  else F(Path().blob(bp), fur);
  if (!vase && !D.wool) { const c2 = P(L * 0.12, by0 + H * 0.42); x.save(); Path().blob(bp).trace(x); x.clip(); F(Path().E(c2[0], c2[1], L * 0.28, H * 0.22, pitch), lt, { flat: true, noline: true }); x.restore();
    if (D.stripes) for (let j = 0; j < 4; j++) { const s1 = P(-L * 0.3 + j * 4.5, by0 - H * 0.42), s2 = P(-L * 0.34 + j * 4.5, by0 + H * 0.05); Ln(Path().M(s1[0], s1[1]).L(s2[0], s2[1]), f2, 0.9); }
    if (D.patch) { const c3 = P(-L * 0.18, by0 - H * 0.05); F(Path().E(c3[0], c3[1], 4.5, 3.2, 0.3), D.patch, { flat: true, noline: true }); }
    if (D.dapple) for (let j = 0; j < 7; j++) { const c3 = P(-L * 0.32 + (j % 4) * 5.2, by0 - H * 0.28 + (j > 3 ? 3.2 : 0)); F(Path().E(c3[0], c3[1], 0.9, 0.7), lighten(fur, 0.35), { flat: true, noline: true }); }
    if (D.hump) { const c3 = P(L * 0.22, by0 - H * 0.55); F(Path().E(c3[0], c3[1], L * 0.2, H * 0.28, pitch), darken(fur, 0.08), { flat: true, noline: true }); }
    if (D.udder) { const c3 = P(-L * 0.12, by0 + H * 0.55); F(Path().E(c3[0], c3[1], 3, 2.2), '#e8b0a0', { lw: 0.3 }); }
    if (D.crest) for (let j = 0; j < 11; j++) { const c3 = P(-L * 0.4 + j * 3.2, by0 - H * 0.48 - Math.sin(j / 10 * Math.PI) * 2.2); F(Path().poly([[c3[0] - 1.2, c3[1] + 1.4], [c3[0] + 0.4, c3[1] - 2.4 - (j % 2) * 1.2], [c3[0] + 1.6, c3[1] + 1.4]]), D.crest, { flat: true, noline: true }); }
  }
  legDraw(0, true); legDraw(2, true);
  // neck and head: neck angle 0 = carried, 1 = down to the ground (grazing, sniffing)
  const nd = o.neckDown || 0, ny0 = P(L / 2 - 2, by0 - H * 0.35), na = lerp(-1.05, 0.8, nd) + (o.headBob || 0), nL = D.neck + nd * (leg * (D.grazeK || 0.45)), hx = ny0[0] + Math.cos(na) * nL, hy = ny0[1] + Math.sin(na) * nL;
  if (o.kind !== 'cat') F(Path().limb(ny0[0] - 1.5, ny0[1] + 1.5, hx - 1, hy + 0.5, H * 0.42, H * 0.26), fur);
  const s = D.head * (o.kind === 'cat' ? 1 : 1), m = D.muzzle, hp = (o.headPitch || 0) + nd * 0.55, jaw = o.jaw || 0;
  x.save(); x.translate(hx, hy); x.rotate(hp);
  const face = D.face || fur;
  if (D.mane) { const mp = []; for (let j = 0; j < 18; j++) { const a = j / 18 * TAU, rr = (j % 2 ? 7.6 : 9.4) * s * (o.roarMane || 1); mp.push([-1.6 * s + Math.cos(a) * rr, 0.6 * s + Math.sin(a) * rr * 1.08]); } F(Path().blob(mp), D.mane); if (!vase) for (let j = 0; j < 7; j++) { const a = -2.2 + j * 0.62; Ln(Path().M(-1.6 * s + Math.cos(a) * 4.5 * s, 0.6 * s + Math.sin(a) * 4.5 * s).L(-1.6 * s + Math.cos(a) * 8.4 * s, 0.6 * s + Math.sin(a) * 8.6 * s), darken(D.mane, 0.18), 0.7); } }
  // ears behind
  if (D.ear === 'side') F(Path().M(-1.5 * s, -2 * s).Q(-6 * s, -1.5 * s, -7 * s, 0.5 * s).Q(-4 * s, 0.6 * s, -1 * s, -0.4 * s).Z(), darken(face, 0.12), { lw: 0.35 });
  if (D.antlers) { const A = D.antlers; for (const sd of [0, 1]) { const ox = sd ? 0.8 : -0.6; Ln(Path().M(ox * s, -3 * s).Q((ox - 1.2) * s, -8 * s, (ox - 3.4) * s, -11 * s), A, 0.9); Ln(Path().M((ox - 0.8) * s, -6.4 * s).L((ox + 1.4) * s, -8.8 * s), A, 0.7); Ln(Path().M((ox - 2) * s, -9 * s).L((ox - 0.6) * s, -11.6 * s), A, 0.7); Ln(Path().M((ox - 1.4) * s, -7.6 * s).L((ox - 4) * s, -8.6 * s), A, 0.6); } }
  if (D.horns && D.shortHorns) { F(Path().M(-0.6 * s, -3.2 * s).Q(-1.4 * s, -5.8 * s, -3.6 * s, -6.2 * s).Q(-1.8 * s, -4.6 * s, -1.6 * s, -2.8 * s).Z(), '#e8dcc0', { lw: 0.35 }); F(Path().M(0.8 * s, -3.4 * s).Q(1.2 * s, -6 * s, 3.2 * s, -6.6 * s).Q(1.8 * s, -4.8 * s, 1.8 * s, -3 * s).Z(), '#d8ccb0', { lw: 0.35 }); }
  else if (D.horns) F(Path().M(-0.4 * s, -3.2 * s).Q(-2.4 * s, -8.6 * s, -7.4 * s, -8 * s).Q(-3.6 * s, -7 * s, -2.2 * s, -2.6 * s).Z(), '#9a8a70', { lw: 0.4 });
  // head
  const HEADS = { dog: [[-3.4, -2.2], [-1.6, -3.9], [1.4, -3.6], [3.2, -2.2], [7.8, -1.4], [8.9, -0.4], [8.6, 1.2], [4.6, 2.2], [1, 3.2], [-2.6, 2.4]], wolf: [[-3.4, -2], [-1.4, -3.6], [1.6, -3.3], [3.6, -1.8], [9.4, -0.8], [10.2, 0.2], [9.6, 1.4], [4.4, 2.4], [0.6, 3.2], [-2.8, 2.4]],
    goat: [[-3, -2.4], [-1, -3.4], [1.6, -2.8], [6.8, -0.4], [7.6, 1], [6.8, 2.2], [3, 2.4], [0, 2.8], [-2.8, 1.6]], cow: [[-3.2, -2.6], [-1, -3.4], [2, -3], [6.6, -1], [7.6, 0.8], [7.2, 2.6], [3.4, 3], [0, 3.2], [-3, 2]], deer: [[-2.8, -2.2], [-0.8, -3.2], [1.8, -2.6], [7.6, -0.2], [8.4, 0.9], [7.6, 1.9], [3, 2.1], [0, 2.5], [-2.6, 1.4]], boar: [[-3.8, -3.2], [-1, -4.2], [2.2, -3.6], [7.4, -1.2], [9.4, -0.6], [9.6, 2.4], [4.2, 3.6], [0, 3.8], [-3.4, 2.6]], sheep: [[-3, -2.6], [-0.6, -3.4], [2, -2.4], [5.8, 0], [6.2, 1.6], [4.6, 2.8], [1, 3], [-2.6, 1.8]], lion: [[-3.6, -2.6], [-1.4, -3.8], [1.8, -3.6], [3.8, -2.2], [6.6, -1.2], [7.4, 0.4], [7, 2.2], [4.2, 3.4], [0.6, 3.6], [-2.8, 2.4]], cat: [[-3.4, -2.2], [-1.4, -3.4], [1.6, -3.2], [3.4, -1.8], [4.6, 0.2], [4, 1.8], [1.6, 3], [-1.6, 3], [-3.6, 1.2]] };
  F(Path().blob(HEADS[o.kind].map(([a, b]) => [a * s, b * s])), face);
  if (!vase && !D.face) { if (o.kind === 'cat') F(Path().E(2.8 * s, 1.4 * s, 1.8 * s, 1.3 * s), lt, { flat: true, noline: true }); else F(Path().blob([[3.4 * s, 0.2 * s], [(o.kind === 'wolf' ? 9.4 : 7.8) * s, 0.6 * s], [(o.kind === 'wolf' ? 9 : 7.6) * s, 1.5 * s], [3.6 * s, 2.2 * s]]), lt, { flat: true, noline: true }); }
  if (jaw > 0.1 && o.kind !== 'cat') F(Path().M(1 * s, 2.4 * s).L((o.kind === 'wolf' ? 9 : 7.6) * s, 1.8 * s + jaw * 3).L(1 * s, 3.4 * s + jaw * 0.8).Z(), darken(face, 0.15), { lw: 0.3 });
  const NOSE = { cow: [7.2, 1.4], deer: [8.1, 0.5], boar: [8.6, 0.9], lion: [7.1, -0.5], dog: [8.8, -0.4], wolf: [10.1, 0.1], goat: [7.4, 0.8], sheep: [6, 1.2], cat: [4.4, 0.4] }[o.kind]; F(Path().E(NOSE[0] * s, NOSE[1] * s, 0.9 * s, 0.75 * s), D.nose, { flat: true, noline: true });
  // ears in front
  const perk = o.perk || 0;
  if (D.ear === 'flop') F(Path().M(-1.4 * s, -3.6 * s).Q(-3.6 * s, -3.4 * s - perk, -3.4 * s, 1.6 * s - perk * 2.4).Q(-2.2 * s, 2 * s - perk * 2, -0.2 * s, -2.6 * s).Z(), darken(f2, 0.1), { lw: 0.35 });
  if (D.ear === 'round') F(Path().E(-1.4 * s, -3.6 * s, 1.6 * s, 1.5 * s), darken(fur, 0.15), { lw: 0.4 });
  if (D.ear === 'point') F(Path().poly([[-2.4 * s, -2.8 * s], [-1.6 * s - perk * 0.4, (o.kind === 'cat' ? -6.6 : -7.6) * s], [0.4 * s, -3.4 * s]]), darken(fur, 0.12), { lw: 0.4 });
  if (D.tusks) { F(Path().M(6.4 * s, 1.6 * s).Q(8.4 * s, 1.4 * s, 8.6 * s, -1.4 * s).Q(7.6 * s, 0.6 * s, 6.2 * s, 2.4 * s).Z(), '#f0e6d0', { lw: 0.3 }); F(Path().E(9.4 * s, 0.9 * s, 1.2 * s, 1.9 * s), '#6a4a3a', { lw: 0.3 }); F(Path().E(9.6 * s, 0.4 * s, 0.35 * s, 0.4 * s), '#2a1a12', { flat: true, noline: true }); F(Path().E(9.6 * s, 1.5 * s, 0.35 * s, 0.4 * s), '#2a1a12', { flat: true, noline: true }); }
  if (D.beard) F(Path().M(4 * s, 2.2 * s).L(3.4 * s, 6.2 * s).L(5.6 * s, 2.4 * s).Z(), lighten(fur, 0.1), { lw: 0.3 });
  // eye: a dark bead (closed when blinking or content)
  if (o.eyesShut) Ln(Path().M(0.6 * s, -0.8 * s).Q(1.6 * s, -0.2 * s, 2.6 * s, -0.8 * s), '#1d130e', 0.5);
  else pen.eye((o.kind === 'cat' ? 1.4 : 2) * s, -1.4 * s, 0.75 * s, D.eye || '#1d130e');
  x.restore();
  return { head: [hx, hy] }; }
// beast habits: each returns pose params; all start/end at rest
const BHABITS = {
  rest: (t) => ({ drop: 0.4 * breathAt(t), tail: 0.05 * Math.sin(t * TAU) }),
  wag: (t) => ({ wag: t * TAU * 6, tail: -0.2, perk: 1, drop: 0.3 * breathAt(t) }),
  sniff: (t) => { const k = bump(t, 0.1, 0.3, 0.7, 0.9); return { neckDown: 0.85 * k, headBob: Math.sin(t * TAU * 8) * 0.06 * k, tail: 0.1 * k }; },
  graze: (t) => { const k = bump(t, 0.08, 0.24, 0.78, 0.94); return { neckDown: k, jaw: k * Math.max(0, Math.sin(t * TAU * 6)) * 0.8, tail: 0.04 * Math.sin(t * TAU * 3) }; },
  look: (t) => { const k = bump(t, 0.1, 0.25, 0.65, 0.85); return { headPitch: -0.3 * k, perk: k, neckDown: -0.15 * k }; },
  sit: (t) => { const k = bump(t, 0.06, 0.24, 0.8, 0.95); return { sit: k, wag: k > 0.9 ? t * TAU * 3 : 0, tail: 0.1, headPitch: -0.1 * k }; },
  lie: (t) => { const k = bump(t, 0.06, 0.26, 0.82, 0.96); return { lie: k, neckDown: 0.25 * k, eyesShut: k > 0.85 && t > 0.4 && t < 0.75, tail: 0.25 * k }; },
  scratch: (t) => { const k = bump(t, 0.08, 0.22, 0.72, 0.88); return { sit: k * 0.85, scratch: k, scratchPh: t * TAU * 10, headPitch: 0.25 * k, eyesShut: k > 0.9 }; },
  shake: (t) => { const k = bump(t, 0.1, 0.2, 0.5, 0.6); return { pitch: Math.sin(t * TAU * 10) * 0.05 * k, headPitch: Math.sin(t * TAU * 10) * 0.2 * k, wag: t * TAU * 10 }; },
  yawn: (t) => { const k = bump(t, 0.1, 0.3, 0.55, 0.75); return { jaw: k, headPitch: -0.35 * k, eyesShut: k > 0.5 }; },
  bleat: (t) => { const k = bump(t, 0.1, 0.25, 0.45, 0.6); return { headPitch: -0.4 * k, jaw: k * 0.8 }; },
  groom: (t) => { const k = bump(t, 0.06, 0.2, 0.8, 0.94); return { sit: k, neckDown: 0.55 * k, headPitch: 0.7 * k, headBob: Math.sin(t * TAU * 6) * 0.1 * k, tail: 0.2, tailCurl: t * 6 }; },
  howl: (t) => { const k = bump(t, 0.06, 0.24, 0.76, 0.94); return { sit: k, headPitch: -1.1 * k, neckDown: -0.4 * k, jaw: 0.7 * k, tail: 0.1 }; },
  growl: (t) => ({ neckDown: 0.25, jaw: 0.3 + Math.abs(Math.sin(t * TAU * 6)) * 0.15, tail: 0.5, drop: 1.4, perk: 1 }),
};
const BHABIT_SETS = { deer: ['graze', 'look', 'graze', 'shake'], cow: ['graze', 'graze', 'look', 'shake'], boar: ['sniff', 'look', 'shake', 'graze'], dog: ['wag', 'sniff', 'sit', 'lie', 'scratch', 'shake', 'yawn', 'look'], wolf: ['sniff', 'look', 'howl', 'yawn', 'shake'], goat: ['graze', 'look', 'bleat', 'shake'], sheep: ['graze', 'look', 'bleat'], cat: ['groom', 'sit', 'lie', 'yawn', 'look'], lion: ['yawn', 'look', 'shake', 'lie'] };

// ── fowl (chickens) ──
function rigFowl(pen, o, C) { const F = pen.fill, Ln = pen.line, x = pen.x, fe = o.fe || '#b8582a', f2 = o.f2 || '#7a3418', drop = o.drop || 0;
  const feet = o.feet || [-1, 1.5], lift = o.lift || [0, 0];
  for (const [i, c] of [[0, '#a87a30'], [1, '#d8a040']]) { const fx = feet[i] + (o.scratchLeg && i === 1 ? -3 * o.scratchLeg : 0), fy = -0.6 - lift[i]; Ln(Path().M(i ? 1 : -0.6, -6 - drop).L(fx, fy), c, 0.7); Ln(Path().M(fx - 1.6, fy + 0.4).L(fx + 1.8, fy + 0.4), c, 0.5); }
  x.save(); x.translate(0, -drop);
  F(Path().M(-6, -9).Q(-11, -16, -8, -19).Q(-6, -14, -3, -12).Z(), f2); // tail
  F(Path().blob([[-6.5, -9], [-3, -13.5], [3, -12.5], [5, -9], [2, -5], [-4, -5]]), fe);
  if (o.flap) { F(Path().M(-3, -10).Q(-6, -16 - o.flap * 3, 2, -15 - o.flap * 4).Q(1, -11, -3, -10).Z(), f2); } else F(Path().blob([[-4, -10], [0, -11.5], [2.5, -9.5], [-1, -7.5]]), f2, { lw: 0.3 });
  const pk = o.peck || 0, hx = 4 + pk * 2.5, hy = -14 + pk * 9;
  F(Path().limb(3, -11, hx, hy, 2.2, 1.8), fe); F(Path().E(hx, hy, 2.4, 2.2), fe); F(Path().poly([[hx + 2, hy - 0.6], [hx + 4.2, hy + 0.4], [hx + 2, hy + 1]]), '#e8b030', { lw: 0.3 });
  F(Path().M(hx - 1.6, hy - 1.8).Q(hx - 1, hy - 4.2, hx + 0.2, hy - 2.4).Q(hx + 1, hy - 4.4, hx + 1.6, hy - 1.8).Z(), '#d8302a', { lw: 0.3 }); F(Path().E(hx + 1.8, hy + 2, 0.7, 1.1), '#d8302a', { lw: 0.3 });
  pen.eye(hx + 0.6, hy - 0.4, 0.5, '#1d130e'); x.restore(); }
const FHABITS = { rest: (t) => ({ drop: 0.2 * breathAt(t) }), peck: (t) => ({ peck: Math.max(0, Math.sin(t * TAU * 3)) ** 3 }), scratch: (t) => ({ scratchLeg: Math.max(0, Math.sin(t * TAU * 3)), peck: 0.2 }), flap: (t) => ({ flap: bump(t, 0.1, 0.2, 0.7, 0.9) * (0.5 + 0.5 * Math.sin(t * TAU * 8)), lift: [0, 0] }) };

// ── serpents ──
// o.len: body length, o.ph: slither phase, o.rise: how much of the front is raised (0..1), o.jaw, o.tongue
function rigSnake(pen, o, C) { const F = pen.fill, Ln = pen.line, x = pen.x, n = 26, len = o.len || 60, sc = o.sc || '#3a6a3a', bl = o.bl || '#c8c070', ph = o.ph || 0, rise = o.rise || 0, pts = [];
  for (let i = 0; i <= n; i++) { const k = i / n, xx = -len / 2 + k * len, amp = 3.2 * (0.4 + 0.6 * Math.sin(k * Math.PI)), up = rise * Math.max(0, (k - 0.62) / 0.38); let yy = -2.2 + Math.sin(k * 9 - ph) * amp * (1 - up) * 0.5; const ry = -up * up * 22;
    pts.push([xx - up * up * 8, yy + ry]); }
  const th = (k) => 0.6 + 2.6 * Math.sin(Math.min(1, k * 1.15) * Math.PI * 0.9 + 0.12);
  const P1 = Path(); for (let i = 0; i <= n; i++) { const [a, b] = pts[Math.max(0, i - 1)], [c, d] = pts[Math.min(n, i + 1)], an = Math.atan2(d - b, c - a) - Math.PI / 2, w = th(i / n); const q = pts[i]; i ? P1.L(q[0] + Math.cos(an) * w, q[1] + Math.sin(an) * w) : P1.M(q[0] + Math.cos(an) * w, q[1] + Math.sin(an) * w); }
  for (let i = n; i >= 0; i--) { const [a, b] = pts[Math.max(0, i - 1)], [c, d] = pts[Math.min(n, i + 1)], an = Math.atan2(d - b, c - a) + Math.PI / 2, w = th(i / n), q = pts[i]; P1.L(q[0] + Math.cos(an) * w, q[1] + Math.sin(an) * w); } P1.Z(); F(P1, sc);
  if (pen.mode !== 'vase') for (let i = 2; i < n - 1; i += 2) { const q = pts[i], q2 = pts[i + 1]; Ln(Path().M(q[0], q[1] + th(i / n) * 0.55).L(q2[0], q2[1] + th((i + 1) / n) * 0.55), bl, 0.7); if (i % 4 === 0) F(Path().E(q[0], q[1] - th(i / n) * 0.3, 0.9, 0.7), darken(sc, 0.35), { flat: true, noline: true }); }
  const h = pts[n], h2 = pts[n - 1], an = Math.atan2(h[1] - h2[1], h[0] - h2[0]); x.save(); x.translate(h[0], h[1]); x.rotate(an);
  F(Path().blob([[-2, -2.6], [2.5, -2.8], [5.5, -1], [5.6, 0.8], [2.4, 2.4], [-2, 2.2]]), sc); if (o.jaw) F(Path().M(0, 1).L(5.4, 1.2 + o.jaw * 3).L(1, 2.6).Z(), darken(sc, 0.2), { lw: 0.3 });
  if (o.tongue) { Ln(Path().M(5.6, 0.6).L(8.6, 0.6).L(9.8, -0.4).M(8.6, 0.6).L(9.8, 1.6), '#d02838', 0.45); }
  pen.eye(2.6, -1, 0.75, '#e8c020'); x.restore(); }
