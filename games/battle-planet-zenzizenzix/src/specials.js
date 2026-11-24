// =====================================================================
// SPECIALS — each warrior's special as a short animated move, grounded in the world:
// a wind-up you can read, a real action (thrown, fired, slammed, shouted), physics for whatever flies,
// and a recovery. The warrior is locked in (super armour) for its length. Reach stays local (≤150 px).
// Each one: dur (s), keyframed pose by progress s 0..1, timed events, an optional per-frame tick and prop.
// =====================================================================
function KF(s, keys) {
  if (s <= keys[0][0]) return PZ(keys[0][1]);
  for (let i = 1; i < keys.length; i++) if (s <= keys[i][0]) { const [s0, a] = keys[i - 1], [s1, b] = keys[i]; return blendPose(PZ(a), PZ(b), ease((s - s0) / (s1 - s0))); }
  return PZ(keys[keys.length - 1][1]);
}
const SPG = 600;   // gravity for things in flight
const front = (p, r, dz = 40, back = 10) => o => (o.x - p.x) * p.face > -back && Math.abs(o.x - p.x) < r && Math.abs(o.z - p.z) < dz;
const around = (x, z, r, dz) => o => Math.abs(o.x - x) < r && Math.abs(o.z - z) < (dz || r * .6);
function launchAway(cx, power = 1) { return (o, isP) => { const d = Math.sign(o.x - cx) || 1; if (isP) return; if (o.type === 'oscar' || o.type === 'boss') { o.vx = d * 60; return; } o.vx = d * 230 * power; o.vy = 190 * power; o.y = Math.max(1, o.y); }; }
function boom(x, z, r, col) { SND.boom(Math.min(1.5, r / 40)); fx.push({ k: 'boom', x, z, y: 0, t: .5, T: .5, r, col: col || '#ffb040' }); for (let k = 0; k < 10; k++) fx.push({ k: 'debris', x: x + (Math.random() - .5) * 12, z, y: 4, vx: (Math.random() - .5) * 260, vy: 120 + Math.random() * 200, rot: 0, vr: 12, t: 1, col: k % 2 ? '#4a3a2a' : '#8a7a5a', w: 2 + Math.random() * 3 }); puff(x, z, 6, 0, 1.6); DECALS.push({ x, z, col: 'rgba(20,14,10,.55)', t: 6, r: r * .35 }); }
const targetsAhead = (p, r, n, dz = 50) => enemies.filter(e => !e.dead && e.state !== 'drop' && front(p, r, dz, 0)(e)).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x)).slice(0, n);

const SPECIALS = {
  // ---- Amiral Remords: raises the sabre, signals his ship, and three cannonballs arc in from off screen ----
  amiral: { dur: 1.5,
    pose: s => KF(s, [[0, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3], lF: [.3, -.4], lB: [-.3, -.35] }], [.15, { ry: 4, sp: .3, nk: .1, aF: [-.7, .4], aB: [.4, 1.6], lF: [.45, -.6], lB: [-.35, -.5] }],
      [.36, { ry: 0, sp: -.18, nk: -.35, aF: [3.05, .05], aB: [.7, 2.3], lF: [.2, -.1], lB: [-.25, -.1] }], [.5, { ry: 3, sp: .3, nk: -.1, aF: [1.55, .02], aB: [.6, 2.2], lF: [.7, -.6], lB: [-.6, -.15] }],
      [.88, { ry: 3, sp: .25, nk: -.05, aF: [1.5, .02], aB: [.6, 2.2], lF: [.7, -.6], lB: [-.6, -.15] }], [1, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3], lF: [.3, -.4], lB: [-.3, -.35] }]]),
    ev: [[.36, p => { quip(p, LANG === 'fr' ? 'Canonniers… FEU !' : 'Gunners… FIRE!', 1.4); beep(1400, .25, 'triangle', .04, -900); }],
      [.5, (p, sp) => { const tg = targetsAhead(p, 170, 3), pts = [0, 1, 2].map(k => tg[k] ? [tg[k].x + tg[k].face * 0, tg[k].z] : [p.x + p.face * (60 + k * 45), Math.max(8, Math.min(DEPTH - 8, p.z + (k - 1) * 22))]);
        pts.forEach(([tx, tz], k) => { const T = .75, x0 = p.face > 0 ? camX - 30 : camX + VW + 30, y0 = 170; fx.push({ k: 'cball', x: x0, z: tz, y: y0, vx: (tx - x0) / T, vy: (SPG * T * T / 2 - y0) / T, delay: .12 + k * .22, t: 3, from: p }); }); }]] },

  // ---- Marge: hoists her amp overhead, hops and slams it down; it squeals feedback twice ----
  marge: { dur: 1.3,
    pose: s => KF(s, [[0, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }], [.2, { ry: 8, sp: .65, nk: .2, aF: [-.2, .8], aB: [-.3, .8], lF: [.8, -1.4], lB: [-.3, -1.2] }],
      [.4, { ry: 0, sp: -.25, nk: -.3, aF: [2.95, .35], aB: [2.85, .45], lF: [.15, -.1], lB: [-.2, -.1] }], [.6, { air: 1, sp: -.1, nk: -.2, aF: [2.9, .4], aB: [2.8, .5], lF: [.9, -1.5], lB: [.3, -1.3] }],
      [.72, { ry: 9, sp: .75, nk: .1, aF: [1.25, .2], aB: [1.15, .3], lF: [.9, -1.5], lB: [-.4, -1.3] }], [.9, { ry: 8, sp: .7, aF: [1.2, .2], aB: [1.1, .3], lF: [.9, -1.5], lB: [-.4, -1.3] }], [1, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }]]),
    prop: (c, S, pose, t, o) => { const s = o.ss; if (s < .3 || s > .72) return; const [hx, hy] = S.aF[2], [bx, by] = S.aB[2], mx = (hx + bx) / 2, my = Math.min(hy, by); poly(c, [[mx - 9, my - 15], [mx + 9, my - 15], [mx + 9, my + 1], [mx - 9, my + 1]], '#1a1418'); c.fillStyle = '#3a3438'; c.beginPath(); c.arc(mx, my - 7, 5, 0, 7); c.fill(); c.fillStyle = '#e8c77a'; c.fillRect(mx - 8, my - 14, 16, 2); },
    ev: [[.42, p => { p.vy = 165; p.vx += p.face * 110; }],
      [.72, p => { const ax = p.x + p.face * 22; WORLD.shake = 10; noise(.45, .14); camPunch(ax, p.z, 10, .08); fx.push({ k: 'ring', x: ax, z: p.z, max: 115, t: .45, col: '#ffd0a0' }); boom(ax, p.z, 40, '#e8c77a');
        INK_STRONG = true; applyHit(p, victims(p, around(ax, p.z, 110, 40)), 3, launchAway(ax)); INK_STRONG = false; fx.push({ k: 'amp2', x: ax, z: p.z, t: 4, from: p, pulses: [1, 2] }); }]] },

  // ---- the big cyborg: raises the chrome arm, punches the ground; a lava fissure tears forward ----
  cyborg: { dur: 1.35,
    pose: s => KF(s, [[0, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }], [.3, { ry: -1, sp: -.3, nk: -.25, aF: [3.1, .15], aB: [1.1, .6], lF: [.3, -.2], lB: [-.3, -.2] }],
      [.44, { ry: 12, sp: .95, nk: .2, aF: [.65, .05], aB: [-.6, .9], lF: [1.15, -1.8], lB: [-.5, -1.7] }], [.85, { ry: 12, sp: .9, nk: .1, aF: [.65, .05], aB: [-.6, .9], lF: [1.15, -1.8], lB: [-.5, -1.7] }], [1, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }]]),
    ev: [[.44, (p, sp) => { WORLD.shake = 8; noise(.4, .12); const fx0 = p.x + p.face * 24; fx.push({ k: 'ring', x: fx0, z: p.z, max: 40, t: .3, col: '#ff8a3a' }); puff(fx0, p.z, 6, 0, 1.4); sp.d.crack = { x: fx0, n: 0, hit: new Set() }; }]],
    tick: (p, s, dt, sp) => { const c = sp.d.crack; if (!c || c.n >= 11) return; c.acc = (c.acc || 0) + dt; while (c.acc > .045 && c.n < 11) { c.acc -= .045; const x = c.x + p.face * c.n * 13, z = p.z + Math.sin(c.n * 1.7) * 3; c.n++;
      fx.push({ k: 'crack', x, z, t: 3.5, T: 3.5, w: 14, face: p.face, seed: c.n }); fx.push({ k: 'spout', x, z, t: .55, T: .55, h: 26 + Math.random() * 14 }); for (let k = 0; k < 3; k++) fx.push({ k: 'debris', x, z, y: 4, vx: (Math.random() - .5) * 120, vy: 140 + Math.random() * 120, rot: 0, vr: 10, t: .8, col: k ? '#ff7a2a' : '#3a2a20', w: 2.5 });
      const list = victims(p, o => !c.hit.has(o) && Math.abs(o.x - x) < 12 && Math.abs(o.z - z) < 16 && o.y < 20); list.forEach(([o]) => c.hit.add(o)); INK_STRONG = true; applyHit(p, list, 2, (o, isP) => { if (!isP) { o.burn = 2.5; o.vy = 230; o.y = Math.max(1, o.y); } }); INK_STRONG = false; WORLD.shake = Math.max(WORLD.shake, 3); } } },

  // ---- Papi: the tidewalker rears up, rocket roaring, and crashes its front hooves down ----
  papi: { dur: 1.25, nonrig: 'rear',
    ev: [[.6, p => { const ax = p.x + p.face * 30; WORLD.shake = 11; noise(.5, .14); camPunch(ax, p.z, 10, .09); fx.push({ k: 'ring', x: ax, z: p.z, max: 120, t: .5, col: '#e8d8b0' }); boom(ax, p.z, 46, '#d8c890');
      for (let k = 0; k < 5; k++) fx.push({ k: 'crack', x: ax + Math.cos(k * 1.26) * 18, z: p.z + Math.sin(k * 1.26) * 8, t: 3, T: 3, w: 20, face: Math.cos(k * 1.26) > 0 ? 1 : -1, seed: k + 20, ang: k * 1.26 });
      INK_STRONG = true; applyHit(p, victims(p, around(ax, p.z, 115, 40)), 3, launchAway(ax, 1.1)); INK_STRONG = false; }],
      [.3, p => { beep(90, .5, 'sawtooth', .05, 300); }]],
    tick: (p, s) => { if (s > .25 && s < .6) for (let k = 0; k < 2; k++) fx.push({ k: 'exh', x: p.x - p.face * 18, z: p.z, y: 34 + s * 20, vx: -p.face * (80 + Math.random() * 60), vy: -20 + Math.random() * 40, t: .35, T: .35, fire: Math.random() < .6 }); } },

  // ---- Ruby: leans back, windmills the strings twice, and the chord calls lightning down on them ----
  ruby: { dur: 1.45, swing: 1,
    pose: s => { const base = { ry: 2, sp: -.35, nk: -.45, aB: [1.3, 1.2], lF: [.55, -.4], lB: [-.5, -.2] };
      if (s < .15) return KF(s, [[0, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }], [.15, { ...base, aF: [2.6, .2] }]]);
      if (s < .58) { const a = 2.6 + ((s - .15) / .43) * Math.PI * 4; return PZ({ ...base, aF: [a, .15], ry: 2 + Math.sin(s * 40) * .6 }); }
      return KF(s, [[.58, { ...base, aF: [2.6, .2] }], [.64, { ry: 6, sp: .2, nk: -.2, aF: [.9, .4], aB: [1.2, 1.1], lF: [1.0, -1.6], lB: [-.6, -1.2] }], [.9, { ry: 6, sp: .2, nk: -.25, aF: [.9, .4], aB: [1.2, 1.1], lF: [1.0, -1.6], lB: [-.6, -1.2] }], [1, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }]]); },
    ev: [[.3, p => { fx.push({ k: 'arc', x: p.x + p.face * 10, z: p.z, y: 36, face: p.face, t: .4, T: .4, r: 70 }); beep(330, .3, 'sawtooth', .05, 0); }], [.48, p => { fx.push({ k: 'arc', x: p.x + p.face * 10, z: p.z, y: 36, face: p.face, t: .4, T: .4, r: 80 }); beep(440, .3, 'sawtooth', .05, 0); }],
      [.64, p => { const tg = targetsAhead(p, 150, 4); const pts = tg.length ? tg.map(e => [e.x, e.z, e]) : [0, 1, 2].map(k => [p.x + p.face * (50 + k * 40), p.z + (k - 1) * 18, null]); WORLD.flash = .35; WORLD.shake = 7; noise(.4, .1); beep(110, .5, 'square', .06, -60);
        pts.forEach(([x, z, e], k) => { fx.push({ k: 'bolt2', x, z, t: .3, T: .3, seed: Math.random() * 99, delay: k * .05 }); DECALS.push({ x, z, col: 'rgba(30,30,40,.5)', t: 5, r: 7 }); });
        INK_STRONG = true; applyHit(p, victims(p, o => pts.some(([x, z]) => Math.abs(o.x - x) < 14 && Math.abs(o.z - z) < 14)), 3, (o, isP) => { if (!isP) { o.frozen = 1.2; o.zap = 1.2; } }); INK_STRONG = false; }]] },

  // ---- Spora: swells, holds, and bursts into a drifting spore cloud (freezes goons, heals the partner) ----
  spora: { dur: 1.15, nonrig: 'puff',
    sq: s => s < .45 ? [1 + .6 * ease(s / .45), 1 + .5 * ease(s / .45)] : s < .55 ? [1.6 - 7 * (s - .45), 1.5 - 5.5 * (s - .45)] : [.9 + .1 * Math.min(1, (s - .55) / .3), .95 + .05 * Math.min(1, (s - .55) / .3)],
    ev: [[.5, p => { const cx = p.x + p.face * 40; for (let k = 0; k < 46; k++) { const a = Math.random() * Math.PI * 2, v = 40 + Math.random() * 110; fx.push({ k: 'spore', x: p.x + p.face * 8, z: p.z, y: 24, vx: Math.cos(a) * v + p.face * 40, vz: Math.sin(a) * v * .3, vy: Math.sin(a) * v * .5 + 20, t: 2.5 + Math.random() * 2, T: 4.5 }); }
      fx.push({ k: 'cloud', x: cx, z: p.z, t: 4.5, r: 80, from: p }); beep(260, .4, 'sine', .05, 300); noise(.3, .05);
      for (const e of enemies) if (!e.dead && around(cx, p.z, 120, 50)(e)) { e.frozen = 3; e.spored = 3; } const q = players[1 - p.i]; if (q.ko <= 0 && around(cx, p.z, 150, 60)(q)) { q.hp = Math.min(hpMax(q.w), q.hp + 2); fx.push({ k: 'plus', x: q.x, z: q.z, t: 1 }); } }]] },

  // ---- Magnéto: braces and pulls every goon in front across the floor, then claps them together ----
  magneto: { dur: 1.6,
    pose: s => { const tr = s > .18 && s < .76 ? Math.sin(s * 120) * .04 : 0;
      return KF(s, [[0, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }], [.18, { ry: 4, sp: -.32 + tr, nk: -.2, aF: [1.55 + tr, .05], aB: [1.45 - tr, .12], lF: [.55, -.35], lB: [-.7, -.45] }],
        [.76, { ry: 5, sp: -.4 + tr, nk: -.25, aF: [1.6 + tr, .1], aB: [1.5 - tr, .15], lF: [.6, -.4], lB: [-.75, -.5] }], [.82, { ry: 2, sp: .35, nk: .1, aF: [2.2, 1.6], aB: [2.1, 1.7], lF: [.5, -.4], lB: [-.5, -.3] }],
        [.88, { ry: 4, sp: .45, nk: .05, aF: [1.5, .9], aB: [1.45, .95], lF: [.6, -.5], lB: [-.6, -.3] }], [1, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }]]); },
    tick: (p, s, dt, sp) => { if (s < .18 || s > .78) return; const px = p.x + p.face * 26; if (Math.random() < dt * 14) fx.push({ k: 'mline', x: p.x + p.face * 12, z: p.z, t: .3, T: .3, face: p.face, r: 60 + Math.random() * 80, dz: (Math.random() - .5) * 40 });
      for (const e of enemies) if (!e.dead && e.type !== 'oscar' && front(p, 150, 50, -4)(e)) { const d = px - e.x; e.x += Math.sign(d) * Math.min(Math.abs(d), 120 * dt); e.z += (p.z - e.z) * Math.min(1, dt * 3); e.state = 'hurt'; e.stun = .2; e.face = -p.face; (sp.d.pulled || (sp.d.pulled = new Set())).add(e); if (Math.random() < dt * 10) puff(e.x - Math.sign(d) * 4, e.z, 1, -Math.sign(d)); } },
    ev: [[.84, (p, sp) => { const px = p.x + p.face * 26; WORLD.shake = 9; noise(.4, .12); camPunch(px, p.z, 40, .08); fx.push({ k: 'ring', x: px, z: p.z, max: 60, t: .35, col: '#9fd0ff' }); sparks(px, p.z, 40, p.face, true, '#cfe8ff');
      INK_STRONG = true; applyHit(p, victims(p, around(px, p.z, 60, 30)), 3, launchAway(p.x, .9)); INK_STRONG = false; beep(1600, .08, 'square', .05, -800); }]] },

  // ---- Doc Suture: digs in the bag and lobs a med kit to the partner (it lands as a pickup if missed) ----
  doc: { dur: .95,
    start: p => { const q = players[1 - p.i]; p.face = Math.sign(q.x - p.x) || p.face; },
    pose: s => KF(s, [[0, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }], [.25, { ry: 3, sp: .45, nk: .3, aF: [-.5, 1.9], aB: [.6, 1.4], lF: [.3, -.3], lB: [-.3, -.3] }],
      [.45, { ry: 4, sp: .25, nk: 0, aF: [-.9, .3], aB: [.8, 1.2], lF: [.5, -.5], lB: [-.4, -.3] }], [.6, { ry: 1, sp: -.1, nk: -.2, aF: [2.2, .15], aB: [.6, 1.3], lF: [.6, -.4], lB: [-.5, -.2] }], [1, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }]]),
    prop: (c, S, pose, t, o) => { if (o.ss < .25 || o.ss > .6) return; const [hx, hy] = S.aF[2]; poly(c, [[hx - 5, hy - 4], [hx + 5, hy - 4], [hx + 5, hy + 4], [hx - 5, hy + 4]], '#efe8dc'); c.fillStyle = '#d83a3a'; c.fillRect(hx - 1, hy - 3, 2, 6); c.fillRect(hx - 3, hy - 1, 6, 2); },
    ev: [[.6, p => { const q = players[1 - p.i], T = Math.max(.4, Math.min(.8, Math.abs(q.x - p.x) / 220)); const tx = q.x + (q.vx || 0) * .2, tz = q.z; fx.push({ k: 'medkit', x: p.x + p.face * 10, z: p.z, y: 34, vx: (tx - p.x) / T, vz: (tz - p.z) / T, vy: (SPG * T * T / 2 - 34 + 30) / T, t: 3, to: q, from: p, rot: 0 }); beep(660, .1, 'triangle'); }]] },

  // ---- Demi: palms back to the hip, then a two-handed stream: flames or frost (alternates every use) ----
  demi: { dur: 1.05,
    start: p => { p.fire = !p.fire; },
    pose: s => { const sh = s > .35 && s < .85 ? Math.sin(s * 90) * .03 : 0;
      return KF(s, [[0, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }], [.25, { ry: 5, sp: .2, nk: .1, aF: [-.5, 1.9], aB: [-.6, 1.8], lF: [.6, -.6], lB: [-.6, -.4] }],
        [.36, { ry: 5, sp: .4 + sh, nk: -.05, aF: [1.55, .04], aB: [1.5, .1], lF: [.7, -.6], lB: [-.6, -.3] }], [.85, { ry: 5, sp: .35 + sh, nk: -.05, aF: [1.55, .04], aB: [1.5, .1], lF: [.7, -.6], lB: [-.6, -.3] }], [1, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }]]); },
    tick: (p, s, dt, sp) => { if (s < .36 || s > .85) return; const hx = p.x + p.face * 22;
      for (let k = 0; k < 3; k++) fx.push({ k: p.fire ? 'flame' : 'shard', x: hx, z: p.z + (Math.random() - .5) * 4, y: 38 + (Math.random() - .5) * 4, vx: p.face * (200 + Math.random() * 120), vz: (Math.random() - .5) * 40, vy: p.fire ? 10 + Math.random() * 40 : -20 + Math.random() * 30, t: .5 + Math.random() * .2, T: .7 });
      sp.d.tick = (sp.d.tick || 0) - dt; if (sp.d.tick > 0) return; sp.d.tick = .16; sp.d.hits = sp.d.hits || new Map();
      const list = victims(p, o => front(p, 140, 24, 0)(o) && (sp.d.hits.get(o) || 0) < (p.fire ? 3 : 1)); list.forEach(([o]) => sp.d.hits.set(o, (sp.d.hits.get(o) || 0) + 1));
      applyHit(p, list, 1, (o, isP) => { if (isP) return; if (p.fire) o.burn = 3; else o.frozen = 3; }); } },

  // ---- Bernache: draws the neck back, puffs up, and honks a cone of sound; goons cover their ears and flee ----
  bernache: { dur: 1.15, nonrig: 'honk',
    ev: [[.36, p => { beep(330, .45, 'sawtooth', .1, -140); WORLD.shake = 6; for (let k = 0; k < 3; k++) fx.push({ k: 'arc', x: p.x + p.face * 18, z: p.z, y: 24, face: p.face, t: .45, T: .45, r: 150, delay: k * .1 });
      for (let k = 0; k < 8; k++) fx.push({ k: 'feather', x: p.x, z: p.z, y: 18 + Math.random() * 10, vx: (Math.random() - .5) * 80, vy: 40 + Math.random() * 60, t: 2, rot: Math.random() * 6 });
      const L1 = victims(p, front(p, 140, 45, 0)); L1.filter(v => v[1]).forEach(([q]) => { q.vx = p.face * 200; jolt(q, -2, 2); });   // a shout pushes the partner but doesn't hurt
      applyHit(p, L1.filter(v => !v[1]), 2, o => { o.flee = 3; react(o, 'cower', .4); o.vx = p.face * 260; }); }]] },

  // ---- the space raccoon: ignites the pack, rises, fires three aimed plasma shots, and comes down ----
  raccoon: { dur: 2.1, fly: 1,
    pose: s => { const sw = Math.sin(s * 30) * .1; return s < .12 ? KF(s, [[0, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }], [.12, { ry: 7, sp: .5, aF: [-.3, .9], aB: [-.4, .9], lF: [.9, -1.5], lB: [-.3, -1.3] }]])
      : s < .88 ? PZ({ air: 1, sp: .15, nk: .2, aF: [1.05, .05], aB: [1.0, .4], lF: [.25 + sw, -.5], lB: [-.1 - sw, -.7] }) : KF(s, [[.88, { air: 1, sp: .1, aF: [1.4, .4], aB: [1.2, .5], lF: [.35, -.3], lB: [-.25, -.4] }], [1, { ry: 6, sq: .9, sp: .3, aF: [.6, .8], aB: [-.3, .6], lF: [.7, -1.2], lB: [-.2, -1.1] }]]); },
    tick: (p, s, dt, sp) => { const H = s < .12 ? 0 : s < .3 ? 62 * ease((s - .12) / .18) : s < .86 ? 62 + Math.sin(s * 14) * 3 : 62 * Math.max(0, 1 - (s - .86) / .12); const gnd = Math.max(0, ground(p.x, p.z)); p.y = gnd + H; p.vy = 0;
      if (s > .1 && s < .97) for (let k = 0; k < 2; k++) fx.push({ k: 'exh', x: p.x - p.face * 6, z: p.z, y: p.y + 16, vx: (Math.random() - .5) * 30, vy: -160 - Math.random() * 80, t: .3, T: .3, fire: Math.random() < .55 }); },
    ev: [[.4, p => specShot(p)], [.56, p => specShot(p)], [.72, p => specShot(p)], [.98, p => { puff(p.x, p.z, 5, 0, 1.2); jolt(p, 2.6, -3); }]] },

  // ---- Jean-Louis Carnage: clenches, shakes, and roars; nearby goons stagger back; then four seconds of rage ----
  soldier: { dur: 1.2,
    pose: s => { const tr = s > .1 && s < .82 ? Math.sin(s * 140) * .05 : 0;
      return KF(s, [[0, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }], [.28, { ry: 6, sp: .5 + tr, nk: .35, aF: [.9 + tr, 2.5], aB: [.8 - tr, 2.5], lF: [.55, -.7], lB: [-.5, -.6] }],
        [.44, { ry: 2, sp: -.4 + tr, nk: -.7, aF: [.75 + tr, -.2], aB: [.65 - tr, -.25], lF: [.6, -.4], lB: [-.6, -.3] }], [.82, { ry: 2, sp: -.35 + tr, nk: -.6, aF: [.75 + tr, -.2], aB: [.65 - tr, -.25], lF: [.6, -.4], lB: [-.6, -.3] }], [1, { ry: 2, sp: .15, aF: [.9, 1.1], aB: [.5, 1.3] }]]); },
    tick: (p, s) => { if (s > .44 && s < .82 && Math.random() < .5) fx.push({ k: 'puff', x: p.x + (Math.random() - .5) * 8, z: p.z, y: 56 + Math.random() * 6, vx: (Math.random() - .5) * 40, vy: 40, r: 2.5, t: .5, T: .6 }); },
    ev: [[.44, p => { WORLD.shake = 8; noise(.5, .1); beep(80, .6, 'sawtooth', .07, 60); fx.push({ k: 'ring', x: p.x, z: p.z, max: 125, t: .5, col: '#ff4a2a' }); camPunch(p.x, p.z, 50, .06);
      const L1 = victims(p, around(p.x, p.z, 120, 45)); L1.filter(v => v[1]).forEach(([q]) => { q.vx = Math.sign(q.x - p.x) * 200; jolt(q, -2, 2); });
      applyHit(p, L1.filter(v => !v[1]), 1, o => { o.vx = Math.sign(o.x - p.x) * 260; react(o, 'cower', .5); }); }], [.99, p => { p.rage = 4; p.inv = Math.max(p.inv, .3); }]] }
};
function specShot(p) { const tg = targetsAhead(p, 220, 1, 60)[0], tx = tg ? tg.x : p.x + p.face * 90, tz = tg ? tg.z : p.z, T = .32; fx.push({ k: 'plasma', x: p.x + p.face * 12, z: p.z, y: p.y + 26, vx: (tx - p.x) / T, vz: (tz - p.z) / T, vy: -(p.y + 26) / T, t: .6, from: p }); p.vx -= p.face * 30; jolt(p, -1.2, 1.2); beep(880, .08, 'square', .04, -400); }

// ---- running a special -----------------------------------------------------------------------------
function startSpecial(p) { const S = SPECIALS[p.w.id]; if (!S) return false; RUM.special(p.i); SFX.special(p.w.id, p.x); p.state = 'special'; p.spec = { id: p.w.id, t: 0, T: S.dur, fired: {}, d: {} }; p.sp = S.dur; p.inv = Math.max(p.inv, S.dur + .1); p.atk = 0; p.hold && carryThrow(p, true); S.start && S.start(p); return true; }
function specialTick(p, dt) { const sp = p.spec, S = sp && SPECIALS[sp.id]; if (!S) { p.state = ''; return; } sp.t += dt; const s = Math.min(1, sp.t / sp.T);
  (S.ev || []).forEach(([at, fn], i) => { if (s >= at && !sp.fired[i]) { sp.fired[i] = true; fn(p, sp); } }); S.tick && S.tick(p, s, dt, sp);
  if (sp.t >= sp.T) { p.state = ''; p.spec = null; p.sp = 0; } }
function specS(p) { return p.spec ? Math.min(1, p.spec.t / p.spec.T) : 0; }

// ---- what flies, falls and glows ----------------------------------------------------------------------
function specFx(f, dt) {
  if (f.delay > 0) { f.delay -= dt; f.t += dt; return true; }
  switch (f.k) {
    case 'cball': f.x += f.vx * dt; f.y += f.vy * dt; f.vy -= SPG * dt; if (f.y <= 0) { f.t = 0; boom(f.x, f.z, 34); WORLD.shake = Math.max(WORLD.shake, 6); noise(.35, .1); INK_STRONG = true; applyHit(f.from, victims(f.from, around(f.x, f.z, 32, 20)), 3, launchAway(f.x, .8)); INK_STRONG = false; } return true;
    case 'amp2': f.age = (f.age || 0) + dt; for (const k of [0, 1]) if (f.pulses[k] && f.age > .7 + k * .7) { f.pulses[k] = 0; fx.push({ k: 'ring', x: f.x, z: f.z, max: 70, t: .35, col: '#ffe8a0' }); beep(1800 - k * 300, .2, 'square', .04, -200); applyHit(f.from, victims(f.from, around(f.x, f.z, 66, 30)), 1, launchAway(f.x, .5)); } return true;
    case 'medkit': f.x += f.vx * dt; f.z += f.vz * dt; f.y += f.vy * dt; f.vy -= SPG * dt; f.rot += dt * 9; const q = f.to;
      if (q.ko <= 0 ? Math.abs(q.x - f.x) < 16 && Math.abs(q.z - f.z) < 14 && f.y < 70 : Math.abs(q.x - f.x) < 20 && Math.abs(q.z - f.z) < 16 && f.y < 20) { f.t = 0; if (q.ko > 0) q.rev = 9; else q.hp = Math.min(hpMax(q.w), q.hp + 2); q.catchT = .4; fx.push({ k: 'plus', x: q.x, z: q.z, t: 1 }); beep(880, .15, 'triangle', .05, 300); }
      else if (f.y <= 0) { f.t = 0; FOOD.push({ k: 'kit', x: f.x, z: f.z, y: 1, vy: 60, t: 10 }); } return true;
    case 'plasma': f.x += f.vx * dt; f.z += f.vz * dt; f.y += f.vy * dt; if (f.y <= 4 || f.t < .05) { f.t = 0; fx.push({ k: 'ring', x: f.x, z: f.z, max: 34, t: .3, col: '#8affc8' }); puff(f.x, f.z, 3); DECALS.push({ x: f.x, z: f.z, col: 'rgba(20,40,30,.45)', t: 4, r: 5 }); applyHit(f.from, victims(f.from, around(f.x, f.z, 22, 16)), 2, launchAway(f.x, .5)); } return true;
    case 'exh': f.x += f.vx * dt; f.y += f.vy * dt; f.vy *= Math.pow(.1, dt); f.vx *= Math.pow(.2, dt); return true;
    case 'flame': case 'shard': f.x += f.vx * dt; f.z += f.vz * dt; f.y = Math.max(0, f.y + f.vy * dt); f.vx *= Math.pow(.15, dt); f.vy += (f.k === 'flame' ? 60 : -140) * dt; return true;
    case 'spore': f.x += f.vx * dt; f.z = Math.max(0, Math.min(DEPTH, f.z + f.vz * dt)); f.y = Math.max(0, f.y + f.vy * dt); f.vx *= Math.pow(.25, dt); f.vz *= Math.pow(.25, dt); f.vy = f.vy * Math.pow(.25, dt) - 6 * dt; f.x += Math.sin(time * 2 + f.z) * 6 * dt; return true;
    case 'feather': f.x += f.vx * dt + Math.sin(time * 5 + f.rot) * 12 * dt; f.y = Math.max(0, f.y + f.vy * dt); f.vy = Math.max(-18, f.vy - 160 * dt); f.vx *= Math.pow(.3, dt); f.rot += dt * 3; return true;
    case 'boom': case 'crack': case 'spout': case 'bolt2': case 'arc': case 'mline': return true;
  }
  return false;
}
function drawSpecFx(f) {
  if (f.delay > 0) return ['cball', 'bolt2', 'arc'].includes(f.k);
  const x = f.x - camX, y = sy(f.z, f.y || 0), y0 = sy(f.z, 0);
  switch (f.k) {
    case 'cball': { const sh = Math.max(.3, 1 - f.y / 200); g.fillStyle = `rgba(0,0,0,${.35 * sh})`; g.beginPath(); g.ellipse(x, y0, 7 * sh, 2.4 * sh, 0, 0, 7); g.fill(); disc(g, x, y, 5.5, '#2a2628', '#8a8488'); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x - f.vx * .04, y - (-f.vy) * .04 * -1); g.stroke(); return true; }
    case 'boom': { const u = 1 - f.t / f.T, r = f.r * (.3 + u * .9); g.globalAlpha = Math.max(0, 1 - u); g.fillStyle = '#fff4c8'; g.beginPath(); g.arc(x, y0 - r * .5, r * (1 - u) * .7, 0, 7); g.fill(); g.fillStyle = f.col; for (let k = 0; k < 7; k++) { const a = k * .9 + u; g.beginPath(); g.arc(x + Math.cos(a) * r * .5, y0 - r * .45 + Math.sin(a) * r * .3 - u * 10, r * .38 * (1 - u * .5), 0, 7); g.fill(); }
      g.fillStyle = 'rgba(60,50,46,.7)'; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + (k - 2) * r * .3, y0 - r * .6 - u * 24 - k % 2 * 6, r * .3 * u + 2, 0, 7); g.fill(); } g.globalAlpha = 1; return true; }
    case 'amp2': { const ax = Math.round(x - 13), ay = Math.round(y0); poly(g, [[ax, ay], [ax + 26, ay], [ax + 26, ay - 26], [ax, ay - 26]], '#141010'); g.fillStyle = '#2a2020'; g.beginPath(); g.arc(ax + 13, ay - 13, 8, 0, 7); g.fill(); g.fillStyle = '#e8c77a'; g.fillRect(ax + 2, ay - 25, 22, 2); if ((f.age || 0) % .7 < .12) { g.fillStyle = 'rgba(255,240,180,.6)'; g.beginPath(); g.arc(ax + 13, ay - 13, 10, 0, 7); g.fill(); } return true; }
    case 'crack': { const a = Math.min(1, f.t / .8); g.strokeStyle = `rgba(16,10,8,${.8 * a})`; g.lineWidth = 1.6; g.beginPath(); const ang = f.ang ?? (f.face > 0 ? 0 : Math.PI); let px = x, py = y0; g.moveTo(px, py); for (let k = 1; k <= 3; k++) { px = x + Math.cos(ang) * f.w * k / 3 + Math.sin(f.seed * 3 + k * 2) * 3; py = y0 + Math.sin(ang) * f.w * .35 * k / 3 + Math.cos(f.seed + k * 1.7) * 1.5; g.lineTo(px, py); } g.stroke();
      if (f.T - f.t < 1.2 && f.k === 'crack' && f.T > 3.2) { g.strokeStyle = `rgba(255,120,40,${.6 * a})`; g.lineWidth = .8; g.stroke(); } return true; }
    case 'spout': { const u = 1 - f.t / f.T, h = f.h * Math.sin(Math.min(1, u * 1.6) * Math.PI); g.fillStyle = '#ff7a2a'; g.beginPath(); g.moveTo(x - 4, y0); g.quadraticCurveTo(x - 2, y0 - h, x, y0 - h - 3); g.quadraticCurveTo(x + 2, y0 - h, x + 4, y0); g.fill(); g.fillStyle = '#ffd060'; g.fillRect(x - 1, y0 - h, 2, h); g.fillStyle = 'rgba(60,40,36,.5)'; g.beginPath(); g.arc(x + Math.sin(u * 6) * 3, y0 - h - 6 - u * 10, 3 + u * 4, 0, 7); g.fill(); return true; }
    case 'bolt2': { const u = 1 - f.t / f.T; g.save(); g.globalAlpha = 1 - u * .8; g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.shadowColor = '#9fd8ff'; g.shadowBlur = 8; g.beginPath(); let bx = x, by = 0; g.moveTo(bx, by); for (let k = 1; k <= 8; k++) { by = y0 * k / 8; bx = x + (k < 8 ? Math.sin(f.seed + k * 2.3) * 9 : 0); g.lineTo(bx, by); } g.stroke(); g.strokeStyle = '#9fd8ff'; g.lineWidth = 1.2; g.stroke(); g.restore();
      g.fillStyle = `rgba(220,240,255,${.7 * (1 - u)})`; g.beginPath(); g.ellipse(x, y0, 12, 4, 0, 0, 7); g.fill(); return true; }
    case 'arc': { const u = 1 - f.t / f.T, r = 10 + u * f.r; g.strokeStyle = `rgba(255,250,230,${.8 * (1 - u)})`; g.lineWidth = 2.2 - u; g.beginPath(); g.ellipse(x, y, r, r * .55, 0, f.face > 0 ? -.8 : Math.PI - .8, f.face > 0 ? .8 : Math.PI + .8); g.stroke(); return true; }
    case 'mline': { const u = 1 - f.t / f.T, r = f.r * (1 - u * .8); g.strokeStyle = `rgba(160,210,255,${.7 * (1 - u)})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - 36); g.quadraticCurveTo(x + f.face * r * .5, y - 36 + f.dz - 14, x + f.face * r, y - 30 + f.dz); g.stroke(); return true; }
    case 'medkit': { g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(x, y0, 5, 2, 0, 0, 7); g.fill(); g.save(); g.translate(x, y); g.rotate(f.rot); poly(g, [[-5, -4], [5, -4], [5, 4], [-5, 4]], '#efe8dc'); g.fillStyle = '#d83a3a'; g.fillRect(-1, -3, 2, 6); g.fillRect(-3, -1, 6, 2); g.restore(); return true; }
    case 'plasma': { g.fillStyle = '#c8ffe0'; g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); g.strokeStyle = 'rgba(138,255,200,.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x - f.vx * .03, y + f.vy * .03); g.stroke(); return true; }
    case 'exh': { const u = 1 - f.t / f.T; if (f.fire && u < .5) { g.fillStyle = u < .2 ? '#fff0b0' : '#ff9a3a'; g.beginPath(); g.arc(x, y, 3 * (1 - u), 0, 7); g.fill(); } else { g.fillStyle = `rgba(180,170,160,${.5 * (1 - u)})`; g.beginPath(); g.arc(x, y, 2 + u * 5, 0, 7); g.fill(); } return true; }
    case 'flame': { const u = 1 - f.t / f.T, r = 2 + u * 5; g.fillStyle = u < .3 ? '#fff2a0' : u < .6 ? '#ff9a2a' : `rgba(200,60,30,${1 - u})`; g.beginPath(); g.moveTo(x - r, y); g.quadraticCurveTo(x, y - r * 2.4, x + r, y); g.closePath(); g.fill(); return true; }
    case 'shard': { const u = 1 - f.t / f.T; g.fillStyle = u < .5 ? '#e8f8ff' : `rgba(160,210,255,${1 - u})`; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x, y - 2); g.lineTo(x + 4, y); g.lineTo(x, y + 2); g.closePath(); g.fill(); if (u > .4) { g.fillStyle = `rgba(220,240,255,${.25 * (1 - u)})`; g.beginPath(); g.arc(x, y, 4 + u * 6, 0, 7); g.fill(); } return true; }
    case 'spore': { const a = Math.min(1, f.t / 1); g.fillStyle = `rgba(230,255,160,${a})`; g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.fill(); g.fillStyle = `rgba(120,180,60,${a * .5})`; g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); return true; }
    case 'feather': { g.save(); g.translate(x, y); g.rotate(Math.sin(f.rot) * .8); g.fillStyle = '#e8e0d0'; g.beginPath(); g.ellipse(0, 0, 4, 1.4, 0, 0, 7); g.fill(); g.strokeStyle = '#8a7a68'; g.lineWidth = .5; g.beginPath(); g.moveTo(-4, 0); g.lineTo(4, 0); g.stroke(); g.restore(); return true; }
  }
  return false;
}
