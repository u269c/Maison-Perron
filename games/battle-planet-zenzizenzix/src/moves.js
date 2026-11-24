// =====================================================================
// ENEMY MOVES — Villen-Hüüs's soldiers attack with their whole bodies too, two ways per weapon family,
// so a fight doesn't look like the same swing over and over. Wind-up (readable: weight back, weapon raised,
// a glint), strike (a step in, hips through), then a recovery where they're open for a moment.
// =====================================================================
const EG = { ry: 2, sp: .16, nk: -.08, aF: [.9, 1.1], aB: [.5, 1.3], lF: [.32, -.4], lB: [-.3, -.35] };
const EMOVES = {
  melee: [
    { // overhead chop
      wind: s => KF(s, [[0, EG], [.7, { rx: -2.5, ry: 1, sp: -.28, nk: -.18, aF: [3.05, .9], aB: [.5, 1.3], lF: [.35, -.3], lB: [-.5, -.45] }], [1, { rx: -3, ry: 1, sp: -.32, nk: -.2, aF: [3.15, .95], aB: [.5, 1.3], lF: [.35, -.3], lB: [-.5, -.45] }]]),
      strike: s => KF(s, [[0, { rx: -3, ry: 1, sp: -.32, nk: -.2, aF: [3.15, .95], aB: [.5, 1.3], lF: [.35, -.3], lB: [-.5, -.45] }], [.35, { rx: 4, ry: 4, sp: .58, nk: -.1, aF: [1.0, .2], aB: [-.2, 1.2], lF: [.85, -.6], lB: [-.6, -.05] }], [1, { rx: 4.5, ry: 4.5, sp: .62, nk: -.05, aF: [.7, .25], aB: [-.3, 1.1], lF: [.85, -.6], lB: [-.6, -.05] }]]), lunge: 70 },
    { // flat swing from behind the hip
      wind: s => KF(s, [[0, EG], [1, { rx: -2.5, ry: 2, sp: -.12, nk: .05, aF: [-.7, .7], aB: [1.2, 1.5], lF: [.3, -.35], lB: [-.5, -.45] }]]),
      strike: s => KF(s, [[0, { rx: -2.5, ry: 2, sp: -.12, nk: .05, aF: [-.7, .7], aB: [1.2, 1.5], lF: [.3, -.35], lB: [-.5, -.45] }], [.35, { rx: 3.5, ry: 3, sp: .42, nk: -.15, aF: [1.6, .1], aB: [-.3, 1.0], lF: [.75, -.55], lB: [-.6, -.08] }], [1, { rx: 4, ry: 3, sp: .32, nk: -.15, aF: [2.15, .2], aB: [-.4, 1.0], lF: [.75, -.55], lB: [-.6, -.08] }]]), lunge: 60 }],
  thrust: [
    { // stepping stab
      wind: s => KF(s, [[0, EG], [1, { rx: -3, ry: 3, sp: -.1, aF: [.3, 2.3], aB: [.6, 1.4], lF: [.4, -.5], lB: [-.5, -.5] }]]),
      strike: s => KF(s, [[0, { rx: -3, ry: 3, sp: -.1, aF: [.3, 2.3], aB: [.6, 1.4], lF: [.4, -.5], lB: [-.5, -.5] }], [.3, { rx: 6, ry: 4, sp: .48, nk: -.15, aF: [1.66, 0], aB: [.3, 1.6], lF: [.95, -.65], lB: [-.85, 0] }], [1, { rx: 6.5, ry: 4, sp: .52, nk: -.15, aF: [1.68, .05], aB: [.25, 1.6], lF: [.95, -.65], lB: [-.85, 0] }]]), lunge: 110 },
    { // low gut stab from a crouch
      wind: s => KF(s, [[0, EG], [1, { rx: -2, ry: 7, sp: .3, nk: .1, aF: [.2, 2.1], aB: [.9, 1.5], lF: [.7, -1.1], lB: [-.35, -1.0] }]]),
      strike: s => KF(s, [[0, { rx: -2, ry: 7, sp: .3, nk: .1, aF: [.2, 2.1], aB: [.9, 1.5], lF: [.7, -1.1], lB: [-.35, -1.0] }], [.3, { rx: 5, ry: 6, sp: .6, nk: -.05, aF: [1.4, 0], aB: [.2, 1.6], lF: [1.0, -.9], lB: [-.8, -.2] }], [1, { rx: 5, ry: 6, sp: .62, aF: [1.42, .05], aB: [.2, 1.6], lF: [1.0, -.9], lB: [-.8, -.2] }]]), lunge: 90 }],
  heavy: [
    { // two-handed slam into the floor
      wind: s => KF(s, [[0, EG], [1, { rx: -3, ry: -1, sp: -.48, nk: -.25, aF: [3.1, .3], aB: [2.9, .4], lF: [.4, -.3], lB: [-.5, -.35] }]]),
      strike: s => KF(s, [[0, { rx: -3, ry: -1, sp: -.48, nk: -.25, aF: [3.1, .3], aB: [2.9, .4], lF: [.4, -.3], lB: [-.5, -.35] }], [.3, { rx: 5, ry: 9, sp: .92, nk: .2, aF: [.9, .2], aB: [.8, .25], lF: [.9, -1.0], lB: [-.6, -.5] }], [1, { rx: 5, ry: 10, sp: .95, nk: .25, aF: [.8, .2], aB: [.7, .25], lF: [.9, -1.0], lB: [-.6, -.5] }]]), lunge: 40, slam: 1 },
    { // wide sweep
      wind: s => KF(s, [[0, EG], [1, { rx: -2.5, ry: 3, sp: -.2, nk: 0, aF: [-.55, .5], aB: [-.45, .6], lF: [.35, -.4], lB: [-.55, -.45] }]]),
      strike: s => KF(s, [[0, { rx: -2.5, ry: 3, sp: -.2, aF: [-.55, .5], aB: [-.45, .6], lF: [.35, -.4], lB: [-.55, -.45] }], [.35, { rx: 3, ry: 4, sp: .38, nk: -.1, aF: [1.7, .15], aB: [1.6, .25], lF: [.75, -.55], lB: [-.6, -.1] }], [1, { rx: 3, ry: 4, sp: .28, nk: -.1, aF: [2.3, .2], aB: [2.2, .3], lF: [.75, -.55], lB: [-.6, -.1] }]]), lunge: 50 }],
  gun: [
    { // shoulder the rifle, steady, fire: recoil kicks the shoulders back
      wind: s => KF(s, [[0, EG], [.6, { sp: .1, nk: -.05, ry: 2.5, aF: [1.5, .05], aB: [1.25, .6], lF: [.38, -.32], lB: [-.38, -.32] }], [1, { sp: .14, nk: .02, ry: 3, aF: [1.5, .05], aB: [1.25, .6], lF: [.4, -.35], lB: [-.4, -.35] }]]),
      strike: s => KF(s, [[0, { sp: .14, nk: .02, ry: 3, aF: [1.5, .05], aB: [1.25, .6], lF: [.4, -.35], lB: [-.4, -.35] }], [.2, { rx: -2.5, sp: -.22, nk: .15, ry: 2, aF: [1.95, .3], aB: [1.6, .8], lF: [.4, -.3], lB: [-.5, -.4] }], [1, { rx: -1, sp: .05, nk: .05, ry: 2.5, aF: [1.6, .1], aB: [1.3, .6], lF: [.4, -.35], lB: [-.45, -.35] }]]), lunge: 0, gun: 1 }]
};
function emove(e, fam) { const L = EMOVES[fam]; return L[(e.atkV || 0) % L.length]; }
// recovery: a beat after the strike, the soldier is still overextended
function enemyRecover(e, guard) { if (!(e.recT > 0) || !e.recPose) return null; return blendPose(e.recPose, guard, ease(1 - e.recT / .3)); }
// at the moment of a strike: a step in, and for a slam, the floor answers; for a rifle, a shell and smoke
function enemyStrikeFx(e, fam) { const m = emove(e, fam), q = targetOf(e), gap = q ? Math.abs(q.x - e.x) : 99, lg = Math.min(m.lunge || 0, Math.max(0, (gap - 26) * 5));   // step in, but never through the target
  if (m.lunge) puff(e.x - e.face * 6, e.z, 2, -e.face);   // the step itself happens in the strike (game.js)
  jolt(e, 2.2, -1.2, 2);
  if (m.slam) { const ax = e.x + e.face * 26; WORLD.shake = Math.max(WORLD.shake, 3); fx.push({ k: 'ring', x: ax, z: e.z, max: 34, t: .3, col: '#e8d8b8' }); puff(ax, e.z, 4, 0, 1.3); for (let k = 0; k < 4; k++) fx.push({ k: 'debris', x: ax, z: e.z, y: 2, vx: (Math.random() - .5) * 140, vy: 80 + Math.random() * 90, rot: 0, vr: 9, t: .7, col: '#6a5a4a', w: 2 }); }
  if (m.gun) { fx.push({ k: 'shell', x: e.x + e.face * 6, z: e.z, y: 34, vx: -e.face * (40 + Math.random() * 30), vy: 90, t: 1.2, rot: 0 }); fx.push({ k: 'puff', x: e.x + e.face * 26, z: e.z, y: 34, vx: e.face * 30, vy: 12, r: 2.5, t: .4, T: .6 }); } }
function moveFx(f, dt) { if (f.k !== 'shell') return false; f.x += f.vx * dt; f.vy -= 500 * dt; f.y += f.vy * dt; f.rot += dt * 20; if (f.y <= 0) { f.y = 0; f.vy = Math.abs(f.vy) > 40 ? -f.vy * .4 : 0; f.vx *= .5; } return true; }
function drawMoveFx(f) { if (f.k !== 'shell') return false; const x = f.x - camX, y = sy(f.z, f.y); g.save(); g.translate(x, y); g.rotate(f.rot); g.fillStyle = '#e8c060'; g.fillRect(-1.5, -.6, 3, 1.2); g.restore(); return true; }
