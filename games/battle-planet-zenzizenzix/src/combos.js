// =====================================================================
// COMBOS — every warrior's three-hit chain. Hit 1, then hit 2 (a
// variation), then hit 3: a named finisher that hits much harder, freezes
// the frame for an instant and sends whoever it hits flying.
// Each pose runs anticipation → snap → follow-through over s = 0..1.
// =====================================================================
function ph(s, a = .3, b = .5) { // w: wind-up 0..1, e: extension 0..1
  if (s < a) return { w: ease(s / a), e: 0 };
  if (s < b) { const u = (s - a) / (b - a); return { w: 1 - u, e: 1 - Math.pow(1 - u, 3) }; }
  return { w: 0, e: 1 - ease((s - b) / (1 - b)) * .9 };
}
const mixP = (a, b, t) => blendPose(a, b, t);
const GUARD0 = () => PZ({ ry: 2, sp: .15, nk: -.06, aF: [.9, 1.2], aB: [.6, 1.4], lF: [.35, -.4], lB: [-.3, -.35] });
function poseFrom(w, e, W, E) { const g0 = GUARD0(); return mixP(mixP(g0, PZ(W), w), PZ(E), e); }
// Each move is keyframed on its whole body: guard → coil (weight back, torso turned away, the striking limb loaded,
// the other arm guarding) → contact (front foot steps in, hips drive forward, the other arm yanks back) → overshoot →
// settle → guard. rx shifts the hips (weight transfer), ry drops the body, sp is the torso lean, nk the head.
const G0 = { ry: 2, sp: .15, nk: -.06, aF: [.9, 1.2], aB: [.6, 1.4], lF: [.35, -.4], lB: [-.3, -.35] };
const mv = keys => s => KF(s, [[0, G0], ...keys, [1, G0]]);
const CP = {
  jab: mv([[.26, { rx: -1.5, sp: -.12, nk: .06, ry: 2.5, aF: [1.0, 1.9], aB: [.9, 1.8], lF: [.3, -.4], lB: [-.4, -.45] }], [.4, { rx: 3, sp: .32, nk: -.1, ry: 3, aF: [1.62, .05], aB: [.7, 2.0], lF: [.65, -.55], lB: [-.5, -.15] }],
    [.52, { rx: 3.5, sp: .36, nk: -.12, ry: 3, aF: [1.66, .1], aB: [.6, 2.05], lF: [.65, -.55], lB: [-.5, -.15] }], [.78, { rx: 1, sp: .2, aF: [1.2, 1.0], aB: [.6, 1.6], lF: [.5, -.5], lB: [-.4, -.3] }]]),
  hook: mv([[.28, { rx: -2, sp: -.25, nk: .1, ry: 3, aF: [.6, 2.4], aB: [1.2, 1.7], lF: [.25, -.35], lB: [-.45, -.45] }], [.42, { rx: 3, sp: .42, nk: -.12, ry: 3.5, aF: [1.6, .15], aB: [.3, 2.0], lF: [.75, -.6], lB: [-.6, -.05] }],
    [.56, { rx: 4, sp: .5, nk: -.16, ry: 3.5, aF: [1.78, .3], aB: [.2, 2.1], lF: [.75, -.6], lB: [-.6, -.05] }], [.8, { rx: 1.5, sp: .3, aF: [1.3, .8], aB: [.5, 1.6], lF: [.6, -.55], lB: [-.5, -.2] }]]),
  cross: mv([[.28, { rx: -2.5, sp: -.3, nk: .12, ry: 2.5, aB: [.3, 2.5], aF: [1.3, 1.3], lF: [.3, -.3], lB: [-.5, -.5] }], [.42, { rx: 4, sp: .55, nk: -.18, ry: 4.5, aB: [1.66, .05], aF: [.3, 2.1], lF: [.85, -.65], lB: [-.7, 0] }],
    [.56, { rx: 5, sp: .62, nk: -.2, ry: 4.5, aB: [1.72, .1], aF: [.25, 2.2], lF: [.85, -.65], lB: [-.7, 0] }], [.8, { rx: 1.5, sp: .32, aB: [1.1, 1.2], aF: [.6, 1.6], lF: [.6, -.55], lB: [-.5, -.2] }]]),
  uppercut: mv([[.3, { rx: -1, ry: 8, sp: .42, nk: .25, aF: [.2, 1.9], aB: [1.0, 1.7], lF: [.75, -1.2], lB: [-.3, -1.1] }], [.42, { rx: 2, ry: -3, sp: -.2, nk: -.35, aF: [2.75, .35], aB: [.3, 1.9], lF: [.3, -.1], lB: [-.45, -.05] }],
    [.56, { rx: 2.5, ry: -4, sp: -.28, nk: -.45, aF: [2.95, .3], aB: [.25, 2.0], lF: [.3, -.1], lB: [-.45, -.05] }], [.8, { ry: 1, sp: 0, nk: -.15, aF: [1.6, .9], aB: [.6, 1.6], lF: [.35, -.3], lB: [-.35, -.3] }]]),
  elbow: mv([[.28, { rx: -2, sp: -.3, nk: .1, ry: 2.5, aF: [1.2, 2.75], aB: [.8, 1.5], lF: [.3, -.3], lB: [-.45, -.45] }], [.42, { rx: 3.5, sp: .55, nk: -.12, ry: 4, aF: [1.95, 2.8], aB: [.2, 2.0], lF: [.75, -.65], lB: [-.65, -.05] }],
    [.56, { rx: 4, sp: .62, nk: -.15, ry: 4, aF: [2.1, 2.8], aB: [.15, 2.05], lF: [.75, -.65], lB: [-.65, -.05] }], [.8, { rx: 1.5, sp: .3, aF: [1.4, 1.9], aB: [.5, 1.6], lF: [.6, -.55], lB: [-.5, -.2] }]]),
  slash: mv([[.28, { rx: -2, sp: -.25, nk: .05, ry: 2, aF: [2.95, .6], aB: [.9, 1.3], lF: [.35, -.35], lB: [-.45, -.45] }], [.42, { rx: 3, sp: .45, nk: -.12, ry: 4, aF: [1.1, .1], aB: [-.3, 1.1], lF: [.75, -.6], lB: [-.6, -.05] }],
    [.56, { rx: 3.5, sp: .55, nk: -.08, ry: 4.5, aF: [.55, .15], aB: [-.4, 1.0], lF: [.75, -.6], lB: [-.6, -.05] }], [.8, { rx: 1.2, sp: .3, aF: [.8, .7], aB: [.3, 1.4], lF: [.6, -.55], lB: [-.5, -.2] }]]),
  backslash: mv([[.26, { rx: 1, sp: .38, ry: 4, nk: .05, aF: [.45, .3], aB: [-.2, 1.2], lF: [.6, -.6], lB: [-.5, -.2] }], [.42, { rx: -.5, sp: -.15, nk: -.2, ry: 1.5, aF: [2.3, .15], aB: [1.1, 1.3], lF: [.4, -.3], lB: [-.5, -.3] }],
    [.56, { rx: -1, sp: -.25, nk: -.25, ry: 1, aF: [2.8, .2], aB: [1.2, 1.3], lF: [.35, -.25], lB: [-.5, -.3] }], [.8, { sp: 0, nk: -.1, aF: [1.8, .7], aB: [.8, 1.4], lF: [.35, -.35], lB: [-.35, -.3] }]]),
  overhead: mv([[.3, { rx: -3, ry: -2, sp: -.45, nk: -.3, aF: [3.3, .35], aB: [3.15, .4], lF: [.25, -.2], lB: [-.4, -.25] }], [.48, { rx: 4, ry: 10, sp: .85, nk: .2, aF: [1.0, .12], aB: [.9, .2], lF: [.95, -1.1], lB: [-.65, -.5] }],
    [.62, { rx: 4.5, ry: 11, sp: .92, nk: .25, aF: [.8, .15], aB: [.7, .22], lF: [.95, -1.1], lB: [-.65, -.5] }], [.85, { rx: 1.5, ry: 6, sp: .5, aF: [1.0, .8], aB: [.8, 1.0], lF: [.7, -.8], lB: [-.5, -.4] }]]),
  thrust: mv([[.3, { rx: -3, ry: 5, sp: -.15, nk: .05, aF: [.9, 2.2], aB: [.75, 2.3], lF: [.45, -.9], lB: [-.45, -.85] }], [.48, { rx: 6, ry: 7, sp: .6, nk: -.15, aF: [1.6, 0], aB: [1.45, .2], lF: [1.05, -.8], lB: [-1.0, 0] }],
    [.62, { rx: 7, ry: 7.5, sp: .66, nk: -.18, aF: [1.64, .02], aB: [1.5, .2], lF: [1.05, -.8], lB: [-1.0, 0] }], [.85, { rx: 2, ry: 4, sp: .3, aF: [1.2, 1.0], aB: [.9, 1.3], lF: [.7, -.6], lB: [-.6, -.3] }]]),
  kick: mv([[.26, { ry: 1, sp: -.1, rx: -1, aF: [1.0, 1.3], aB: [-.5, .7], lF: [1.6, -2.4], lB: [-.1, -.1] }], [.42, { ry: 0, sp: -.45, nk: .12, rx: -1.5, aF: [-.3, .5], aB: [2.2, .6], lF: [1.82, -.05], lB: [-.15, -.05] }],
    [.56, { ry: 0, sp: -.5, nk: .15, rx: -1.5, aF: [-.35, .5], aB: [2.3, .6], lF: [1.9, -.1], lB: [-.15, -.05] }], [.76, { ry: 1, sp: -.1, aF: [.8, 1.1], aB: [.2, .9], lF: [1.2, -1.9], lB: [-.15, -.1] }]]),
  lariat: mv([[.3, { rx: -2, sp: -.35, nk: .1, ry: 3, aF: [.2, .3], aB: [1.4, 1.5], lF: [.25, -.35], lB: [-.45, -.45] }], [.5, { rx: 4, sp: .4, nk: -.25, ry: 4, aF: [1.62, 0], aB: [-.6, .6], lF: [.85, -.7], lB: [-.7, -.05] }],
    [.64, { rx: 5, sp: .3, nk: -.2, ry: 4, rot: .05, aF: [1.95, .05], aB: [-.7, .6], lF: [.85, -.7], lB: [-.7, -.05] }], [.86, { rx: 1.5, sp: .2, aF: [1.4, .7], aB: [.2, 1.2], lF: [.6, -.5], lB: [-.5, -.2] }]]),
  push: mv([[.3, { rx: -2.5, ry: 4, sp: -.25, nk: .05, aF: [.6, 2.4], aB: [.55, 2.45], lF: [.4, -.6], lB: [-.45, -.55] }], [.48, { rx: 5, ry: 5, sp: .5, nk: -.12, aF: [1.6, .03], aB: [1.5, .08], lF: [.85, -.7], lB: [-.75, -.05] }],
    [.62, { rx: 6, ry: 5, sp: .56, nk: -.14, aF: [1.64, .05], aB: [1.54, .1], lF: [.85, -.7], lB: [-.75, -.05] }], [.85, { rx: 2, ry: 3, sp: .3, aF: [1.2, 1.2], aB: [1.1, 1.3], lF: [.6, -.55], lB: [-.5, -.2] }]]),
  dive: s => KF(s, [[0, G0], [.25, { air: 1, sp: .3, ry: -6, aF: [2.6, .4], aB: [2.4, .4], lF: [1.4, -2], lB: [.6, -1.8] }], [.45, { air: 1, sp: -.4, nk: .1, aF: [-.4, .5], aB: [2.4, .4], lF: [1.2, -.05], lB: [-.2, -.9] }],
    [.8, { air: 1, sp: -.35, nk: .1, aF: [-.3, .5], aB: [2.3, .4], lF: [1.15, -.1], lB: [-.2, -.9] }], [1, G0]])
};
// a step: pose, duration, when it connects, reach, extra damage, knock-back, lunge, smear colour
const st1 = (pose, col, opt = {}) => ({ pose, col, dur: .24, hit: .42, reach: 1, dmg: 0, kb: 0, lunge: 40, ...opt });
const st2 = (pose, col, opt = {}) => ({ pose, col, dur: .27, hit: .42, reach: 1.08, dmg: 0, kb: 60, lunge: 50, ...opt });
const st3 = (pose, col, name, opt = {}) => ({ pose, col, name, dur: .44, hit: .48, reach: 1.4, dmg: 2, kb: 320, lift: 150, lunge: 130, stop: .085, big: 1, ...opt });
const COMBOS = {
  amiral: [st1(CP.slash, '#e0b45a'), st2(CP.backslash, '#e0b45a'), st3(CP.thrust, '#ffd27a', ['BORDÉE !', 'BROADSIDE!'], { lunge: 220, reach: 1.6, fx: 'rocket' })],
  marge: [st1(CP.hook, '#ff4f8a'), st2(CP.uppercut, '#ff4f8a', { lift: 90 }), st3(CP.overhead, '#ff7ab0', ['BIG BERTHA !', 'BIG BERTHA!'], { fx: 'shock', reach: 1.5 })],
  cyborg: [st1(CP.hook, '#ff7a2a'), st2(CP.elbow, '#ff7a2a', { reach: .95 }), st3(CP.hook, '#ffb04a', ['PISTON !', 'PISTON!'], { reach: 1.9, lunge: 90, kb: 380, fx: 'piston', dur: .5 })],
  papi: [st1(null, '#d8c890', { kind: 1 }), st2(null, '#d8c890', { kind: 2 }), st3(null, '#f0e0a0', ['COUP DE SABOT !', 'HOOF STOMP!'], { kind: 3, fx: 'shock', reach: 1.5, lunge: 60 })],
  ruby: [st1(CP.slash, '#9ad8ff'), st2(CP.backslash, '#9ad8ff'), st3(CP.overhead, '#c8f0ff', ['ACCORD DE PUISSANCE !', 'POWER CHORD!'], { fx: 'zap', reach: 1.5 })],
  spora: [st1(null, '#9ae86a', { kind: 1, reach: 1.15 }), st2(null, '#9ae86a', { kind: 2, reach: 1.2 }), st3(null, '#c8ff8a', ['SPORADE !', 'SPORE BURST!'], { kind: 3, fx: 'spore', reach: 1.5, lunge: 20 })],
  magneto: [st1(CP.jab, '#7ac8ff'), st2(CP.cross, '#7ac8ff'), st3(CP.lariat, '#a8e0ff', ['LARIAT MAGNÉTIQUE !', 'MAGNETIC LARIAT!'], { fx: 'magnet', reach: 1.6 })],
  doc: [st1(CP.hook, '#ffe86a'), st2(CP.kick, '#ffe86a'), st3(CP.push, '#fff4a0', ['DÉFIBRILLATEUR !', 'DEFIBRILLATOR!'], { fx: 'zap' })],
  demi: [st1(CP.jab, '#ff8a3a'), st2(CP.hook, '#8ad8ff'), st3(CP.push, '#ffffff', ['ÉQUINOXE !', 'EQUINOX!'], { fx: 'equinox', reach: 1.55 })],
  bernache: [st1(null, '#f4f0e6', { kind: 1 }), st2(null, '#f4f0e6', { kind: 2 }), st3(null, '#ffffff', ['HONK FURIEUX !', 'FURIOUS HONK!'], { kind: 3, lunge: 240, fx: 'honk' })],
  raccoon: [st1(CP.hook, '#d8962a'), st2(CP.kick, '#d8962a'), st3(CP.dive, '#ffd27a', ['PIQUÉ À RÉACTION !', 'ROCKET DIVE!'], { hop: 150, lunge: 200, fx: 'rocket' })],
  soldier: [st1(CP.jab, '#c8d870'), st2(CP.uppercut, '#c8d870'), st3(CP.thrust, '#f0f8a0', ['BAÏONNETTE !', 'BAYONET!'], { lunge: 200, reach: 1.7 })]
};
const comboStep = p => (COMBOS[p.w.id] || COMBOS.soldier)[Math.max(0, Math.min(2, (p.combo || 1) - 1))];
let HITSTOP = 0;
function comboStart(p) { const S = p.cs = comboStep(p); p.atkDur = S.dur; p.atk = S.dur; p.hitDone = false; p.comboT = S.dur + .38; p.vx += p.face * (S.lunge || 0); if (S.hop && p.y <= Math.max(0, ground(p.x, p.z)) + .5) p.vy = S.hop;
  SFX.swish(HKIND[p.w.id], S.big ? 1 : .35 + p.combo * .15, p.x); if (S.big) SFX.voice(p.w.id, 'big', p.x); else if (Math.random() < .3) SFX.voice(p.w.id, 'effort', p.x); if (S.big) fx.push({ k: 'charge', x: p.x, z: p.z, y: p.y + 30, t: .2, col: S.col, from: p });
  jolt(p, S.big ? 2.6 : 1.4, S.big ? -2.8 : -1.4, S.big ? 2 : 1); if (S.lunge > 60) puff(p.x - p.face * 6, p.z, S.big ? 3 : 1, -p.face); }
// the moment it connects: the swing, the smear, and for the finisher the freeze and the launch
function comboStrike(p, list, R) {
  const S = p.cs; fx.push({ k: 'smear', x: p.x, z: p.z, y: p.y, face: p.face, t: S.big ? .22 : .14, T: S.big ? .22 : .14, r: R, big: !!S.big, col: S.col, combo: p.combo, id: p.w.id });
  if (list.length) { const o0 = list[0][0]; fx.push({ k: 'pring', x: o0.x - p.face * 4, z: o0.z, y: (o0.y || 0) + 40, t: .16, T: .16, big: !!S.big }); }
  if (!S.big && !S.kind) fx.push({ k: 'whip', x: p.x + p.face * R * .55, z: p.z, y: p.y + 42, face: p.face, t: .12, T: .12, col: S.col });
  if (!S.big) { if (list.length) HITSTOP = Math.max(HITSTOP, .035); for (const [o, isP] of list) if (!isP && o.type !== 'oscar') o.vx += p.face * S.kb; return; }
  jolt(p, S.big ? 3 : 1.8, S.big ? -1 : -.5, S.big ? 3 : 1.5);
  if (list.length) { buddyEvent('finisher', p); if (S.big) RUM.finisher(p.i); else RUM.connect(p.i); }
  if (list.length && S.big) { const o0 = list[0][0]; camPunch(o0.x, o0.z, 40, .1); }
  if (list.length) { HITSTOP = S.stop; WORLD.shake = Math.max(WORLD.shake, 7); const [sx, sy2] = toInk(p.x + p.face * R * .6, p.z, p.y + 40); INKFX.push({ k: 'sfx', text: S.name[LANG === 'en' ? 1 : 0], x: sx, y: sy2 - 70, size: 30, t: 0, strong: true, rot: (Math.random() - .5) * .2 }); }
  for (const [o, isP] of list) { if (o.type === 'oscar' || o.type === 'boss') { o.vx = p.face * 60; continue; } o.vx = p.face * S.kb; o.vy = S.lift; o.y = Math.max(1, o.y); if (!isP) o.launchBy = p; }
  if (S.fx === 'shock') fx.push({ k: 'ring', x: p.x + p.face * R * .7, z: p.z, max: 60, t: .35, col: S.col });
  if (S.fx === 'spore') { fx.push({ k: 'ring', x: p.x + p.face * 20, z: p.z, max: 70, t: .45, col: '#c8ff8a' }); for (let k = 0; k < 10; k++) fx.push({ k: 'fume', x: p.x + p.face * 20 + (Math.random() - .5) * 50, z: p.z, y: 10 + Math.random() * 40, t: .9 }); }
  if (S.fx === 'zap' || S.fx === 'equinox' || S.fx === 'magnet') fx.push({ k: 'ring', x: p.x + p.face * R * .6, z: p.z, max: 46, t: .3, col: S.fx === 'equinox' ? '#ff8a3a' : S.col });
}
function comboFx(f, dt) { if (f.k === 'smear' || f.k === 'charge') { if (f.k === 'charge' && f.from) { f.x = f.from.x; f.z = f.from.z; } return true; } return false; }
function drawComboFx(f) {
  if (f.k === 'charge') { const x = f.x - camX, y = sy(f.z, f.y); g.strokeStyle = f.col; g.globalAlpha = f.t / .2; g.lineWidth = 1.5; for (let k = 0; k < 8; k++) { const a = k * .785, r0 = 30 * (f.t / .2) + 6; g.beginPath(); g.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0 * .7); g.lineTo(x + Math.cos(a) * (r0 + 7), y + Math.sin(a) * (r0 + 7) * .7); g.stroke(); } g.globalAlpha = 1; return true; }
  if (f.k !== 'smear') return false;
  const u = 1 - f.t / f.T, x = f.x - camX, a = Math.max(0, f.t / f.T), R = f.r * (f.big ? 1.15 : 1), cy = sy(f.z, f.y + 30), fc = f.face;
  // a comic smear: a crescent swept in front of the fighter, plus speed ticks
  const up = f.combo === 2 ? -1 : 1, a0 = up > 0 ? -1.2 : 1.1, a1 = up > 0 ? .9 : -1.0;
  g.save(); g.translate(x, cy); g.scale(fc, 1); g.globalAlpha = a * .95;
  g.beginPath(); const n = 12; for (let k = 0; k <= n; k++) { const t = a0 + (a1 - a0) * k / n * Math.min(1, u * 2.2 + .3); g.lineTo(Math.cos(t) * R, Math.sin(t) * R * .55); } for (let k = n; k >= 0; k--) { const t = a0 + (a1 - a0) * k / n * Math.min(1, u * 2.2 + .3); g.lineTo(Math.cos(t) * R * (f.big ? .55 : .7), Math.sin(t) * R * .55 * (f.big ? .55 : .7)); }
  g.closePath(); g.fillStyle = f.col; g.fill(); g.strokeStyle = OUT; g.lineWidth = f.big ? 2 : 1.2; g.stroke();
  if (f.big) { for (let k = 0; k < 6; k++) { const yy = -24 + k * 9; g.fillStyle = OUT; g.fillRect(-R * .4 - 18 - k % 2 * 8, yy, 16 + (k % 3) * 6, 1.6); } }
  g.restore(); g.globalAlpha = 1; return true;
}
