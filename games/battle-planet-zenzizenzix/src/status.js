// =====================================================================
// STATUS EFFECTS — poison, dizziness, bleeding. Rules for every level:
// the same effect never stacks (it restarts its timer); at most two at
// once, the two most recent, each with its own timer. Health is in half
// hearts, so 1/4 heart = .5.
// =====================================================================
const STATUS = {
  poison: { dur: 4 },                // greenish, fumes, 20 % slower, -1/4 heart a second
  dizzy: { dur: 3, after: 1 },       // stars, shuffled controls, then 1 s on the floor shaking it off
  bleed: { dur: 3, after: 1 }        // drips that leave traces, -1/4 heart a second, then 1 s patching up (the bandage spin)
};
const BLOOD = { cyborg: '#1a1a1e', spora: '#5ab84a', ruby: '#3a7ae8', demi: '#3a7ae8' };
const bloodOf = id => BLOOD[id] || '#c8202a';
let DECALS = [];
function addStatus(p, k) {
  if (!p || p.ko > 0 || p.fall > 0) return;
  p.st = p.st || [];
  const had = p.st.find(s => s.k === k);
  if (had) { had.t = STATUS[k].dur; had.after = 0; had.tick = 0; p.st.splice(p.st.indexOf(had), 1); p.st.push(had); return; }
  const s = { k, t: STATUS[k].dur, after: 0, tick: 0 };
  if (k === 'dizzy') { const perm = [0, 1, 2, 3, 4, 5]; for (let i = perm.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [perm[i], perm[j]] = [perm[j], perm[i]]; } if (perm.every((v, i) => v === i)) perm.reverse(); s.perm = perm; }
  p.st.push(s); if (p.st.length > 2) p.st.shift(); if (p.i != null) RUM[k] && RUM[k](p.i);
  pop(p.x, p.z, p.y + 76, T_ST[LANG][k], k === 'poison' ? '#9aff6a' : k === 'dizzy' ? '#ffe86a' : '#ff6a6a');
  SFX.status(k, p.x);
}
const T_ST = { fr: { poison: 'EMPOISONNÉ !', dizzy: 'ÉTOURDI !', bleed: 'ÇA SAIGNE !', lather: 'MOUSSÉ !' }, en: { poison: 'POISONED!', dizzy: 'DIZZY!', bleed: 'BLEEDING!', lather: 'LATHERED!' } };
const hasSt = (p, k) => p.st && p.st.some(s => s.k === k && s.t > 0);
const stOf = (p, k) => p.st && p.st.find(s => s.k === k);
function statusSpeed(p) { return (hasSt(p, 'poison') ? .8 : 1) * (hasSt(p, 'lather') ? .65 : 1); }
// dizzy: the six controls (left, right, up, down, attack, jump) shuffled for the duration
function statusInput(p, inp) {
  const s = stOf(p, 'dizzy'); if (!s || s.t <= 0) return inp;
  const v = [inp.x < -.3, inp.x > .3, inp.z < -.3, inp.z > .3, !!inp.a, !!inp.j], o = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 6; i++) if (v[i]) o[s.perm[i]] = 1;
  const r = { ...inp, x: (o[1] ? 1 : 0) - (o[0] ? 1 : 0), z: (o[3] ? 1 : 0) - (o[2] ? 1 : 0), a: !!o[4], j: !!o[5], tap: 0 };
  return r;
}
// returns true while the fighter can't act (on the floor after dizziness, spinning a bandage on)
function statusTick(p, dt) {
  if (!p.st || !p.st.length) return false;
  let locked = false;
  for (const s of p.st) {
    if (s.t > 0) { s.t -= dt; s.tick += dt;
      if (s.k === 'poison' || s.k === 'bleed') while (s.tick >= 1) { s.tick -= 1; p.hp -= .5; p.stPulse = { k: s.k, t: .22 }; RUM[s.k + 'Tick'](p.i); if (s.k === 'bleed') for (let k = 0; k < 5; k++) fx.push({ k: 'drip', x: p.x + p.face * 2, z: p.z, y: p.y + 40, vy: 60 + Math.random() * 60, vx: -p.face * (30 + Math.random() * 60), t: 2, col: bloodOf(p.w.id) }); else for (let k = 0; k < 6; k++) fx.push({ k: 'pbub', x: p.x + (Math.random() - .5) * 18, z: p.z, y: p.y + 20 + Math.random() * 30, vy: 30 + Math.random() * 20, r: 2 + Math.random() * 2, ph: k, t: .7 }); pop(p.x, p.z, p.y + 60, '-¼', s.k === 'poison' ? '#9aff6a' : '#ff6a6a'); if (p.hp <= 0) { p.hp = 0; p.ko = 8; p.rev = 0; p.st = []; RUM.ko(p.i); banner(T[LANG].ko, p.i); return true; } }
      if (s.k === 'poison') { const h = heroHeight(p.w.id, RIG_S);
        if (Math.random() < dt * 9) fx.push({ k: 'pbub', x: p.x + (Math.random() - .5) * 14, z: p.z, y: p.y + h * (.3 + Math.random() * .6), vy: 12 + Math.random() * 14, r: 1.4 + Math.random() * 1.8, ph: Math.random() * 6, t: 1.1 + Math.random() * .7 });
        if (Math.random() < dt * 3) fx.push({ k: 'pwisp', x: p.x + (Math.random() - .5) * 10, z: p.z, y: p.y + h * (.5 + Math.random() * .4), side: Math.random() < .5 ? -1 : 1, t: 1.5, T: 1.5 });
        if (Math.random() < dt * 1.6) fx.push({ k: 'drip', x: p.x + p.face * 4, z: p.z, y: p.y + h - 8, vy: 0, vx: 0, t: 2, col: '#7ad84a', tox: 1 }); }
      if (s.k === 'lather' && Math.random() < dt * 6) fx.push({ k: 'pbub', x: p.x + (Math.random() - .5) * 16, z: p.z, y: p.y + 20 + Math.random() * 40, vy: 8 + Math.random() * 10, r: 1.2 + Math.random() * 1.6, ph: Math.random() * 6, t: .9, foam: 1 });
      if (s.k === 'bleed' && Math.random() < dt * 5) fx.push({ k: 'drip', x: p.x + (Math.random() - .5) * 10, z: p.z, y: p.y + 30 + Math.random() * 20, vy: 0, vx: 0, t: 2, col: bloodOf(p.w.id) });
      if (s.t <= 0 && STATUS[s.k].after) { s.after = STATUS[s.k].after; if (s.k === 'bleed') beep(500, .25, 'triangle', .03, 600); if (s.k === 'dizzy') { WORLD.shake = Math.max(WORLD.shake, 2); noise(.08, .05); RUM.dizzyThump(p.i); } }
    } else if (s.after > 0) { s.after -= dt; locked = true; if (s.k === 'dizzy' && s.after < .4 && !s.shook) { s.shook = 1; for (let k = 0; k < 5; k++) fx.push({ k: 'starfall', x: p.x + (k - 2) * 5, z: p.z, y: p.y + 24, vy: 40 + k * 10, vx: (k - 2) * 20, t: .8 }); } }
  }
  p.st = p.st.filter(s => s.t > 0 || s.after > 0);
  if (locked) { p.atk = 0; p.dash = 0; p.dodge = 0; }
  return locked;
}
function statusFx(f, dt) { // the little particles; returns true if handled
  if (f.k === 'pbub') { f.y += f.vy * dt; f.x += Math.sin(time * 5 + f.ph) * 6 * dt; if (f.t < .1 && !f.popped) { f.popped = 1; fx.push({ k: 'ppop', x: f.x, z: f.z, y: f.y, r: f.r, t: .16, T: .16 }); } return true; }
  if (f.k === 'ppop' || f.k === 'pwisp' || f.k === 'splash') { if (f.k === 'splash') { f.x += f.vx * dt; f.vy -= 400 * dt; f.y = Math.max(0, f.y + f.vy * dt); } return true; }
  if (f.k === 'drip') { f.vy -= 300 * dt; f.y += f.vy * dt; f.x += (f.vx || 0) * dt; if (f.y <= 0) { f.t = 0; DECALS.push({ x: f.x, z: f.z, col: f.col, t: f.tox ? 2.2 : 2, T: f.tox ? 2.2 : 2, r: 1.5 + Math.random() * 1.6, kind: f.tox ? 'tox' : 'blood', grow: 0 }); for (let k = 0; k < 3; k++) fx.push({ k: 'splash', x: f.x, z: f.z, y: 0, vx: (Math.random() - .5) * 50, vy: 40 + Math.random() * 40, t: .25, col: f.col }); } return true; }
  if (f.k === 'starfall') { f.vy -= 260 * dt; f.y = Math.max(0, f.y + f.vy * dt); f.x += f.vx * dt; return true; }
  if (f.k === 'fume') { f.y += 18 * dt; return true; }
  return false;
}
function drawStatusFx(f) {
  const x = f.x - camX, y = sy(f.z, f.y || 0);
  if (f.k === 'pbub') { const a = Math.min(1, f.t * 2), r = f.r * (1 + Math.sin(time * 9 + f.ph) * .08); g.globalAlpha = a; if (f.foam) { g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = 'rgba(150,190,230,.8)'; g.lineWidth = .5; g.stroke(); g.globalAlpha = 1; return true; } g.fillStyle = 'rgba(150,240,90,.55)'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = '#2e6a1e'; g.lineWidth = .6; g.stroke(); g.fillStyle = 'rgba(255,255,230,.9)'; g.fillRect(x - r * .5, y - r * .55, r * .45, r * .4); g.globalAlpha = 1; return true; }
  if (f.k === 'ppop') { const u = 1 - f.t / f.T; g.strokeStyle = `rgba(190,255,140,${1 - u})`; g.lineWidth = .7; for (let k = 0; k < 6; k++) { const a = k * 1.05; g.beginPath(); g.moveTo(x + Math.cos(a) * f.r * (1 + u), y + Math.sin(a) * f.r * (1 + u)); g.lineTo(x + Math.cos(a) * f.r * (1.6 + u * 2), y + Math.sin(a) * f.r * (1.6 + u * 2)); g.stroke(); } return true; }
  if (f.k === 'pwisp') { const u = 1 - f.t / f.T, yy = y - u * 26, a = Math.sin(u * Math.PI) * .55; const gr = g.createLinearGradient(x, yy + 8, x, yy - 10); gr.addColorStop(0, `rgba(120,230,80,${a})`); gr.addColorStop(1, `rgba(170,90,210,${a * .8})`);
    g.strokeStyle = gr; g.lineWidth = 2.2 - u * 1.2; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, yy + 8); g.bezierCurveTo(x + f.side * 8, yy + 2, x - f.side * 6, yy - 4, x + f.side * (4 + u * 4), yy - 10); g.stroke();
    g.beginPath(); g.arc(x + f.side * (4 + u * 4) - f.side * 2, yy - 11, 2 + u * 1.5, f.side > 0 ? 3.6 : -.5, f.side > 0 ? 7.6 : 3.4); g.stroke(); return true; }
  if (f.k === 'drip') { const c = f.col; g.fillStyle = c; g.beginPath(); g.moveTo(x, y - 3); g.quadraticCurveTo(x + 1.8, y, x, y + 1.6); g.quadraticCurveTo(x - 1.8, y, x, y - 3); g.fill(); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x - .6, y - 1, .6, .8); return true; }
  if (f.k === 'splash') { g.fillStyle = f.col; g.fillRect(x - .7, y - .7, 1.4, 1.4); return true; }
  if (f.k === 'starfall') { star5(g, x, y, 3, '#ffe86a'); return true; }
  if (f.k === 'fume') { g.fillStyle = `rgba(150,230,110,${Math.max(0, f.t) * .5})`; g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); return true; }
  return false;
}
function updateDecals(dt) { for (const d of DECALS) d.t -= dt; DECALS = DECALS.filter(d => d.t > 0); }
function drawDecals() { for (const d of DECALS) { const x = d.x - camX, y = sy(d.z, 0); if (x < -10 || x > VW + 10) continue; g.globalAlpha = Math.min(1, d.t / .6);
    const gr = d.kind ? Math.min(1, (d.grow = (d.grow || 0) + FRAME_DT * 4)) : 1, r = d.r * (.4 + .6 * gr);
    if (d.kind === 'blood') { g.fillStyle = shadeC(d.col, -.35); g.beginPath(); g.ellipse(x, y, r * 1.7, r * .65, 0, 0, 7); g.fill(); g.fillStyle = d.col; g.beginPath(); g.ellipse(x - .3, y - .1, r * 1.4, r * .5, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x - r * .6, y - r * .25, r * .5, .6); }
    else if (d.kind === 'beer') { g.fillStyle = 'rgba(200,140,40,.75)'; g.beginPath(); g.ellipse(x, y, r * 1.8, r * .7, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,248,224,.85)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + Math.sin(d.x + k * 2) * r, y - .3 + Math.cos(d.x + k) * r * .2, r * .32, 0, 7); g.fill(); } }
    else if (d.kind === 'tox') { g.fillStyle = 'rgba(40,90,20,.7)'; g.beginPath(); g.ellipse(x, y, r * 1.8, r * .7, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(140,230,80,.75)'; g.beginPath(); g.ellipse(x, y - .2, r * 1.45, r * .5, 0, 0, 7); g.fill(); const b = (time * 2 + d.x) % 1; if (b < .5) { g.strokeStyle = 'rgba(210,255,170,.8)'; g.lineWidth = .5; g.beginPath(); g.arc(x + Math.sin(d.x) * r, y - .5 - b * 2, .6 + b * 1.4, 0, 7); g.stroke(); } }
    else { g.fillStyle = d.col; g.beginPath(); g.ellipse(x, y, d.r * 1.6, d.r * .6, 0, 0, 7); g.fill(); } } g.globalAlpha = 1; }
function star5(c, x, y, r, col) { c.fillStyle = col; c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = .6; c.stroke(); }
// how a fighter looks under each effect (called from drawWarriorRig)
function statusPose(p, pose) {
  if (!p.st) return pose;
  if (p.atk <= 0 && p.state !== 'special') { if (hasSt(p, 'poison')) pose = { ...pose, sp: (pose.sp || 0) + .18 + Math.sin(time * 2.4) * .05, nk: (pose.nk || 0) + .25 + Math.sin(time * 3.1) * .1, ry: (pose.ry || 0) + 1 };
    if (hasSt(p, 'dizzy')) pose = { ...pose, rot: (pose.rot || 0) + Math.sin(time * 3.2) * .14, nk: (pose.nk || 0) + Math.sin(time * 4.5) * .3, sp: (pose.sp || 0) + Math.sin(time * 2.1) * .12 }; }
  for (const s of p.st) {
    if (s.k === 'dizzy' && s.t <= 0 && s.after > 0) { const q = POSES.down(time, 2); if (s.after < .45) { const sh = Math.sin(time * 40) * .4; return PZ({ ry: 6, sp: .5, nk: sh, aF: [.4, .6], aB: [-.3, .5], lF: [1.2, -1.8], lB: [-.3, -1.6] }); } return q; }
    if (s.k === 'bleed' && s.t <= 0 && s.after > 0) { const q = POSES.idle(time, 1); q.aF = [2.4, .3]; q.aB = [2.2, .4]; return q; }
  }
  return pose;
}
function statusSpin(p) { const s = stOf(p, 'bleed'); return s && s.t <= 0 && s.after > 0 ? s.after : 0; }
function drawSkull(x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = OUT; g.lineWidth = 1.2;
  g.fillStyle = '#f4f0e0'; for (const a of [-.7, .7]) { g.save(); g.rotate(a); g.beginPath(); g.roundRect(-6, -1, 12, 2, 1); g.fill(); g.stroke(); g.beginPath(); g.arc(-6, -1, 1.3, 0, 7); g.arc(-6, 1, 1.3, 0, 7); g.arc(6, -1, 1.3, 0, 7); g.arc(6, 1, 1.3, 0, 7); g.fill(); g.restore(); }
  g.fillStyle = col; g.beginPath(); g.arc(0, -2, 4, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.roundRect(-2.5, 0, 5, 3.4, 1); g.fill(); g.stroke();
  g.fillStyle = OUT; g.beginPath(); g.arc(-1.5, -2.2, 1.1, 0, 7); g.arc(1.5, -2.2, 1.1, 0, 7); g.fill(); g.fillRect(-.3, -.6, .6, 1); g.fillRect(-1.4, 1.6, .5, 1.6); g.fillRect(.9, 1.6, .5, 1.6); g.restore(); }
function drawBird(x, y, s, t, col) { const w = Math.sin(t * 22) * 2.2; g.strokeStyle = OUT; g.lineWidth = .8; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, 2.4 * s, 1.6 * s, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - 1, y); g.lineTo(x - 3.5 * s, y - 1.5 - w); g.moveTo(x + 1, y); g.lineTo(x + 3.5 * s, y - 1.5 - w); g.stroke(); g.fillStyle = '#ff9a2a'; g.fillRect(x + 2 * s, y - .4, 1.4 * s, .8); }
function drawStatusAround(p, x, y) {
  if (!p.st) return; const h = heroHeight(p.w.id, RIG_S), back = [], fore = [];
  for (const s of p.st) {
    if (s.k === 'poison' && s.t > 0) { const b = Math.sin(time * 3) * 1.5, pu = p.stPulse && p.stPulse.k === 'poison' ? 1 + p.stPulse.t * 2 : 1; drawSkull(x, y - h - 14 + b, 1.05 * pu, '#b8ff8a');
      g.fillStyle = `rgba(120,230,80,${.18 + Math.sin(time * 4) * .06})`; g.beginPath(); g.ellipse(x, y, 16, 4, 0, 0, 7); g.fill(); }
    if (s.k === 'lather' && s.t > 0) fore.push({ d: 0, draw: () => { g.fillStyle = 'rgba(255,255,255,.92)'; for (let k = 0; k < 9; k++) { const a = k * .7 + time * .5, rr2 = 5 + (k % 3) * 2; g.beginPath(); g.arc(x + Math.cos(a) * rr2 * 1.3, y - h * .78 + Math.sin(a) * rr2 * .6 - (k % 2) * 4, 3 + (k % 3), 0, 7); g.fill(); } g.fillStyle = 'rgba(190,220,255,.7)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x - 6 + k * 4, y - h * .9 - Math.abs(Math.sin(time * 3 + k)) * 3, 1, 0, 7); g.fill(); } } });
    if (s.k === 'dizzy' && s.t > 0) { const cy = y - h - 4;
      for (let k = 0; k < 4; k++) { const a = time * 3.4 + k * Math.PI / 2, d = Math.sin(a), item = { d, draw: () => star5(g, x + Math.cos(a) * 15, cy + d * 4, 2.8 + d * 1.1, k % 2 ? '#ffe86a' : '#fff8c0') }; (d < 0 ? back : fore).push(item); }
      for (let k = 0; k < 2; k++) { const a = -time * 2.6 + k * Math.PI, d = Math.sin(a), item = { d, draw: () => drawBird(x + Math.cos(a) * 19, cy - 6 + d * 3.5, 1.05 + d * .25, time + k, k ? '#8ad8ff' : '#ffd23f') }; (d < 0 ? back : fore).push(item); }
      g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = .8; g.beginPath(); for (let k = 0; k < 24; k++) { const a = -time * 6 + k * .45, r = k * .32; g.lineTo(x + Math.cos(a) * r, cy - 12 + Math.sin(a) * r * .5); } g.stroke(); }
    if (s.k === 'dizzy' && s.t <= 0 && s.after > 0) for (let k = 0; k < 3; k++) { const a = time * 5 + k * 2.1; star5(g, x + Math.cos(a) * 9, y - 30 + Math.sin(a) * 2, 1.8, '#fff8c0'); }
    if (s.k === 'bleed' && s.t > 0 && p.stPulse && p.stPulse.k === 'bleed') { g.strokeStyle = `rgba(255,60,60,${p.stPulse.t * 3})`; g.lineWidth = 1.5; g.beginPath(); g.ellipse(x, y - h * .5, 14 + (1 - p.stPulse.t * 4) * 6, h * .6, 0, 0, 7); g.stroke(); }
    if (s.k === 'bleed' && s.t <= 0 && s.after > 0) {   // the bandage winds round, bottom to top
      const u = 1 - s.after / STATUS.bleed.after, n = 44, top = Math.floor(n * Math.min(1, u * 1.3));
      for (const pass of [0, 1]) for (let k = 1; k < top; k++) { const a = k * .55 + time * 14, fr = Math.cos(a) > 0; if (fr !== !!pass) continue; const a0 = (k - 1) * .55 + time * 14;
        const P = kk => [x + Math.sin(kk * .55 + time * 14) * 13, y - 6 - kk / n * h * .85]; const [x0, y0] = P(k - 1), [x1, y1] = P(k);
        g.strokeStyle = pass ? '#f6f2e8' : '#b8ac98'; g.lineWidth = 2.6; g.lineCap = 'butt'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); if (pass && k % 6 === 0) { g.strokeStyle = '#d8ccb8'; g.lineWidth = .5; g.beginPath(); g.moveTo(x1, y1 - 1.2); g.lineTo(x1, y1 + 1.2); g.stroke(); } }
      if (u > .8) { g.fillStyle = '#7dffc0'; g.font = 'bold 10px sans-serif'; g.textAlign = 'center'; g.fillText('+', x + 12, y - h - 2 - (u - .8) * 30); } }
  }
  if (p.stPulse) { p.stPulse.t -= FRAME_DT; if (p.stPulse.t <= 0) p.stPulse = null; }
  p._stBack = back; fore.sort((a, b) => a.d - b.d).forEach(i => i.draw());
}
function drawStatusBehind(p) { if (p._stBack) p._stBack.sort((a, b) => a.d - b.d).forEach(i => i.draw()); p._stBack = null; }
// the tint on the fighter itself: hit flash, a red throb when bleeding hurts, a sickly sheen while poisoned
function statusTint(p) {
  if (p.hurtT > .27) return ['#ffffff', .85];
  if (p.stPulse && p.stPulse.k === 'bleed') return ['#ff2a2a', .35 + p.stPulse.t];
  if (hasSt(p, 'poison')) return [c => { const gr = c.createLinearGradient(0, 120, 0, 420); const sh = (time * .6) % 1; gr.addColorStop(0, 'rgba(170,255,110,.55)'); gr.addColorStop(Math.max(.01, Math.min(.98, sh)), 'rgba(230,255,200,.75)'); gr.addColorStop(Math.min(.99, sh + .08), 'rgba(140,230,80,.4)'); gr.addColorStop(1, 'rgba(120,50,170,.45)'); return gr; }, .42 + Math.sin(time * 5) * .08 + (p.stPulse ? p.stPulse.t : 0)];
  return null;
}
// ice: a faceted crystal block with highlights, frost at the feet
function drawIce(x, y, w, h, t) { g.save(); const pts = [[x - w * .55, y + 1], [x - w * .62, y - h * .55], [x - w * .4, y - h], [x + w * .25, y - h - 3], [x + w * .6, y - h * .7], [x + w * .55, y + 1]];
  g.beginPath(); pts.forEach(([a, b], i) => i ? g.lineTo(a, b) : g.moveTo(a, b)); g.closePath(); g.fillStyle = 'rgba(190,230,255,.38)'; g.fill(); g.strokeStyle = 'rgba(240,250,255,.9)'; g.lineWidth = 1.2; g.stroke();
  g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.moveTo(x - w * .62, y - h * .55); g.lineTo(x - w * .4, y - h); g.lineTo(x - w * .1, y - h * .4); g.lineTo(x - w * .3, y - h * .1); g.closePath(); g.fill();
  g.fillStyle = 'rgba(120,180,230,.22)'; g.beginPath(); g.moveTo(x + w * .25, y - h - 3); g.lineTo(x + w * .6, y - h * .7); g.lineTo(x + w * .55, y + 1); g.lineTo(x + w * .15, y - h * .3); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = .6; g.beginPath(); g.moveTo(x - w * .1, y - h * .4); g.lineTo(x + w * .15, y - h * .3); g.lineTo(x + w * .25, y - h - 3); g.stroke();
  for (let k = 0; k < 3; k++) { const ph = (t * 1.3 + k * .37) % 1; if (ph < .25) { const sx = x + Math.sin(k * 7) * w * .4, sy2 = y - h * (.2 + (k * .29) % .7); g.strokeStyle = `rgba(255,255,255,${1 - ph * 4})`; g.lineWidth = .7; g.beginPath(); g.moveTo(sx - 2.5, sy2); g.lineTo(sx + 2.5, sy2); g.moveTo(sx, sy2 - 2.5); g.lineTo(sx, sy2 + 2.5); g.stroke(); } }
  g.fillStyle = 'rgba(230,245,255,.7)'; g.beginPath(); g.ellipse(x, y + 1, w * .75, 3, 0, 0, 7); g.fill(); g.restore(); }
// fire: flame tongues licking up the body, embers and a little smoke
function drawFlames(x, y, h, t, seed) { g.save(); for (let k = 0; k < 5; k++) { const ph = (t * 2.2 + k * .23 + seed) % 1, fx0 = x + (k - 2) * 4 + Math.sin(t * 9 + k) * 1.5, by = y - h * (.15 + (k % 3) * .2), fh = 10 + Math.sin(t * 14 + k * 2) * 3;
    for (const [col, sc] of [['rgba(255,90,30,.85)', 1], ['rgba(255,170,40,.95)', .7], ['rgba(255,245,170,.95)', .38]]) { const w = 4 * sc, hh = fh * sc; g.fillStyle = col; g.beginPath(); g.moveTo(fx0 - w, by); g.quadraticCurveTo(fx0 - w * .8, by - hh * .6, fx0 + Math.sin(t * 12 + k) * 2, by - hh); g.quadraticCurveTo(fx0 + w * .8, by - hh * .6, fx0 + w, by); g.closePath(); g.fill(); }
    if (ph < .5) { g.fillStyle = `rgba(255,200,80,${1 - ph * 2})`; g.fillRect(fx0 + Math.sin(k * 3 + t) * 4, by - 12 - ph * 30, 1.4, 1.4); } }
  g.fillStyle = 'rgba(70,60,60,.35)'; g.beginPath(); g.arc(x + Math.sin(t * 2) * 3, y - h - 6 - (t * 20 % 10), 4, 0, 7); g.fill(); g.restore(); }
// draws a fighter tinted (poison green) through a small offscreen canvas
const TINT = document.createElement('canvas'); TINT.width = 480; TINT.height = 480; const TX = TINT.getContext('2d');
function drawTinted(drawFn, x, y, col, a) {
  TX.setTransform(1, 0, 0, 1, 0, 0); TX.clearRect(0, 0, 480, 480); TX.setTransform(HI, 0, 0, HI, -(x - 80) * HI, -(y - 130) * HI);
  const keep = g; g = TX; drawFn(TX); g = keep;
  TX.setTransform(1, 0, 0, 1, 0, 0); TX.globalCompositeOperation = 'source-atop'; TX.fillStyle = typeof col === 'function' ? col(TX) : col; TX.globalAlpha = a; TX.fillRect(0, 0, 480, 480); TX.globalAlpha = 1; TX.globalCompositeOperation = 'source-over';
  g.drawImage(TINT, x - 80, y - 130, 160, 160);
}
