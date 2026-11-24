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
const CP = {
  hook: s => { const { w, e } = ph(s); return poseFrom(w, e, { sp: -.18, nk: .05, ry: 2, aF: [.5, 2.3], aB: [1.1, 1.6], lF: [.3, -.4], lB: [-.35, -.3] }, { sp: .38, nk: -.12, ry: 3.5, aF: [1.62, .08], aB: [.5, 1.9], lF: [.65, -.55], lB: [-.55, -.1] }); },
  cross: s => { const { w, e } = ph(s); return poseFrom(w, e, { sp: -.25, nk: .1, ry: 2, aB: [.25, 2.4], aF: [1.2, 1.4], lF: [.3, -.3], lB: [-.4, -.35] }, { sp: .48, nk: -.15, ry: 4, aB: [1.66, .05], aF: [.35, 2], lF: [.75, -.6], lB: [-.65, -.05] }); },
  uppercut: s => { const { w, e } = ph(s); return poseFrom(w, e, { sp: .35, nk: .2, ry: 7, aF: [.25, 1.9], aB: [.9, 1.6], lF: [.7, -1.1], lB: [-.3, -1] }, { sp: -.15, nk: -.35, ry: -3, aF: [2.7, .35], aB: [.3, 1.8], lF: [.3, -.1], lB: [-.4, -.05] }); },
  elbow: s => { const { w, e } = ph(s); return poseFrom(w, e, { sp: -.2, ry: 2, aF: [1.3, 2.7], aB: [.7, 1.6], lF: [.3, -.3], lB: [-.4, -.3] }, { sp: .5, nk: -.1, ry: 4, aF: [1.9, 2.75], aB: [.3, 1.9], lF: [.7, -.6], lB: [-.6, -.1] }); },
  slash: s => { const { w, e } = ph(s); return poseFrom(w, e, { sp: -.2, nk: .05, ry: 2, aF: [2.75, .7], aB: [.8, 1.4], lF: [.35, -.35], lB: [-.4, -.3] }, { sp: .42, nk: -.1, ry: 4, aF: [.95, .1], aB: [-.2, 1.2], lF: [.7, -.6], lB: [-.6, -.08] }); },
  backslash: s => { const { w, e } = ph(s); return poseFrom(w, e, { sp: .3, ry: 4, aF: [.7, .3], aB: [-.2, 1.2], lF: [.6, -.6], lB: [-.5, -.2] }, { sp: -.2, nk: -.2, ry: 1, aF: [2.55, .2], aB: [1.2, 1.3], lF: [.35, -.25], lB: [-.45, -.3] }); },
  overhead: s => { const { w, e } = ph(s, .34, .52); return poseFrom(w, e, { sp: -.4, nk: -.25, ry: -1, aF: [3.25, .35], aB: [3.1, .4], lF: [.3, -.25], lB: [-.35, -.25] }, { sp: .75, nk: .15, ry: 9, aF: [1.0, .15], aB: [.9, .2], lF: [.85, -1.0], lB: [-.6, -.5] }); },
  thrust: s => { const { w, e } = ph(s, .34, .5); return poseFrom(w, e, { sp: -.12, nk: .05, ry: 5, aF: [.95, 2.1], aB: [.8, 2.2], lF: [.5, -.9], lB: [-.4, -.8] }, { sp: .55, nk: -.15, ry: 8, aF: [1.6, 0], aB: [1.45, .25], lF: [1.0, -.75], lB: [-.95, 0] }); },
  kick: s => { const { w, e } = ph(s); return poseFrom(w, e, { sp: -.15, ry: 1, aF: [1.0, 1.2], aB: [-.6, .6], lF: [1.5, -2.3], lB: [-.1, -.1] }, { sp: -.45, nk: .1, ry: 0, aF: [-.3, .5], aB: [2.2, .6], lF: [1.78, -.05], lB: [-.15, -.05] }); },
  lariat: s => { const { w, e } = ph(s, .32, .52); return poseFrom(w, e, { sp: -.3, nk: .1, ry: 3, aF: [.25, .3], aB: [1.4, 1.5], lF: [.25, -.35], lB: [-.4, -.4] }, { sp: .35, nk: -.25, ry: 4, aF: [1.62, 0], aB: [-.5, .6], lF: [.8, -.7], lB: [-.7, -.1] }); },
  push: s => { const { w, e } = ph(s, .32, .5); return poseFrom(w, e, { sp: -.22, nk: .05, ry: 4, aF: [.6, 2.4], aB: [.55, 2.45], lF: [.4, -.6], lB: [-.4, -.5] }, { sp: .45, nk: -.12, ry: 5, aF: [1.6, .03], aB: [1.5, .08], lF: [.8, -.7], lB: [-.7, -.05] }); },
  dive: s => { const { w, e } = ph(s, .25, .45); return poseFrom(w, e, { air: 1, sp: .3, ry: -6, aF: [2.6, .4], aB: [2.4, .4], lF: [1.4, -2], lB: [.6, -1.8] }, { air: 1, sp: -.35, nk: .1, aF: [-.4, .5], aB: [2.4, .4], lF: [1.15, -.05], lB: [-.2, -.9] }); }
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
  magneto: [st1(CP.hook, '#7ac8ff'), st2(CP.cross, '#7ac8ff'), st3(CP.lariat, '#a8e0ff', ['LARIAT MAGNÉTIQUE !', 'MAGNETIC LARIAT!'], { fx: 'magnet', reach: 1.6 })],
  doc: [st1(CP.hook, '#ffe86a'), st2(CP.kick, '#ffe86a'), st3(CP.push, '#fff4a0', ['DÉFIBRILLATEUR !', 'DEFIBRILLATOR!'], { fx: 'zap' })],
  demi: [st1(CP.hook, '#ff8a3a'), st2(CP.cross, '#8ad8ff'), st3(CP.push, '#ffffff', ['ÉQUINOXE !', 'EQUINOX!'], { fx: 'equinox', reach: 1.55 })],
  bernache: [st1(null, '#f4f0e6', { kind: 1 }), st2(null, '#f4f0e6', { kind: 2 }), st3(null, '#ffffff', ['HONK FURIEUX !', 'FURIOUS HONK!'], { kind: 3, lunge: 240, fx: 'honk' })],
  raccoon: [st1(CP.hook, '#d8962a'), st2(CP.kick, '#d8962a'), st3(CP.dive, '#ffd27a', ['PIQUÉ À RÉACTION !', 'ROCKET DIVE!'], { hop: 150, lunge: 200, fx: 'rocket' })],
  soldier: [st1(CP.hook, '#c8d870'), st2(CP.uppercut, '#c8d870'), st3(CP.thrust, '#f0f8a0', ['BAÏONNETTE !', 'BAYONET!'], { lunge: 200, reach: 1.7 })]
};
const comboStep = p => (COMBOS[p.w.id] || COMBOS.soldier)[Math.max(0, Math.min(2, (p.combo || 1) - 1))];
let HITSTOP = 0;
function comboStart(p) { const S = p.cs = comboStep(p); p.atkDur = S.dur; p.atk = S.dur; p.hitDone = false; p.comboT = S.dur + .38; p.vx += p.face * (S.lunge || 0); if (S.hop && p.y <= Math.max(0, ground(p.x, p.z)) + .5) p.vy = S.hop;
  beep(S.big ? 180 : 300 + p.combo * 70, S.big ? .12 : .05, S.big ? 'sawtooth' : 'square', .04, S.big ? 260 : 0); if (S.big) fx.push({ k: 'charge', x: p.x, z: p.z, y: p.y + 30, t: .2, col: S.col, from: p }); }
// the moment it connects: the swing, the smear, and for the finisher the freeze and the launch
function comboStrike(p, list, R) {
  const S = p.cs; fx.push({ k: 'smear', x: p.x, z: p.z, y: p.y, face: p.face, t: S.big ? .22 : .14, T: S.big ? .22 : .14, r: R, big: !!S.big, col: S.col, combo: p.combo, id: p.w.id });
  if (!S.big) { for (const [o, isP] of list) if (!isP && o.type !== 'oscar') o.vx += p.face * S.kb; return; }
  if (list.length) { HITSTOP = S.stop; WORLD.shake = Math.max(WORLD.shake, 7); const [sx, sy2] = toInk(p.x + p.face * R * .6, p.z, p.y + 40); INKFX.push({ k: 'sfx', text: S.name[LANG === 'en' ? 1 : 0], x: sx, y: sy2 - 70, size: 30, t: 0, strong: true, rot: (Math.random() - .5) * .2 }); }
  for (const [o, isP] of list) { if (o.type === 'oscar' || o.type === 'boss') { o.vx = p.face * 60; continue; } o.vx = p.face * S.kb; o.vy = S.lift; o.y = Math.max(1, o.y); }
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
