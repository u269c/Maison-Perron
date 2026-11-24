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
  p.st.push(s); if (p.st.length > 2) p.st.shift();
  pop(p.x, p.z, p.y + 76, T_ST[LANG][k], k === 'poison' ? '#9aff6a' : k === 'dizzy' ? '#ffe86a' : '#ff6a6a');
  beep(k === 'poison' ? 200 : k === 'dizzy' ? 900 : 300, .2, k === 'dizzy' ? 'sine' : 'sawtooth', .04, k === 'dizzy' ? -600 : -100);
}
const T_ST = { fr: { poison: 'EMPOISONNÉ !', dizzy: 'ÉTOURDI !', bleed: 'ÇA SAIGNE !' }, en: { poison: 'POISONED!', dizzy: 'DIZZY!', bleed: 'BLEEDING!' } };
const hasSt = (p, k) => p.st && p.st.some(s => s.k === k && s.t > 0);
const stOf = (p, k) => p.st && p.st.find(s => s.k === k);
function statusSpeed(p) { return hasSt(p, 'poison') ? .8 : 1; }
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
      if (s.k === 'poison' || s.k === 'bleed') while (s.tick >= 1) { s.tick -= 1; p.hp -= .5; pop(p.x, p.z, p.y + 60, '-¼', s.k === 'poison' ? '#9aff6a' : '#ff6a6a'); if (p.hp <= 0) { p.hp = 0; p.ko = 8; p.rev = 0; p.st = []; banner(T[LANG].ko, p.i); return true; } }
      if (s.k === 'poison' && Math.random() < dt * 8) fx.push({ k: 'fume', x: p.x + (Math.random() - .5) * 8, z: p.z, y: p.y + heroHeight(p.w.id, RIG_S) - 4, t: .9 });
      if (s.k === 'bleed' && Math.random() < dt * 5) fx.push({ k: 'drip', x: p.x + (Math.random() - .5) * 10, z: p.z, y: p.y + 30 + Math.random() * 20, vy: 0, t: 2, col: bloodOf(p.w.id) });
      if (s.t <= 0 && STATUS[s.k].after) { s.after = STATUS[s.k].after; if (s.k === 'bleed') beep(500, .25, 'triangle', .03, 600); if (s.k === 'dizzy') { WORLD.shake = Math.max(WORLD.shake, 2); noise(.08, .05); } }
    } else if (s.after > 0) { s.after -= dt; locked = true; if (s.k === 'dizzy' && s.after < .4 && !s.shook) { s.shook = 1; for (let k = 0; k < 5; k++) fx.push({ k: 'starfall', x: p.x + (k - 2) * 5, z: p.z, y: p.y + 24, vy: 40 + k * 10, vx: (k - 2) * 20, t: .8 }); } }
  }
  p.st = p.st.filter(s => s.t > 0 || s.after > 0);
  if (locked) { p.atk = 0; p.dash = 0; p.dodge = 0; }
  return locked;
}
function statusFx(f, dt) { // the little particles; returns true if handled
  if (f.k === 'fume') { f.y += 18 * dt; f.x += Math.sin(time * 6 + f.z) * 8 * dt; return true; }
  if (f.k === 'drip') { f.vy -= 300 * dt; f.y += f.vy * dt; if (f.y <= 0) { f.t = 0; DECALS.push({ x: f.x, z: f.z, col: f.col, t: 1.5, r: 1.5 + Math.random() * 1.5 }); } return true; }
  if (f.k === 'starfall') { f.vy -= 260 * dt; f.y = Math.max(0, f.y + f.vy * dt); f.x += f.vx * dt; return true; }
  return false;
}
function drawStatusFx(f) {
  const x = f.x - camX, y = sy(f.z, f.y || 0);
  if (f.k === 'fume') { g.fillStyle = `rgba(150,230,110,${Math.max(0, f.t) * .7})`; g.beginPath(); g.arc(x, y, 3 + (1 - f.t) * 4, 0, 7); g.fill(); return true; }
  if (f.k === 'drip') { g.fillStyle = f.col; g.beginPath(); g.ellipse(x, y, 1.4, 2.2, 0, 0, 7); g.fill(); return true; }
  if (f.k === 'starfall') { star5(g, x, y, 3, '#ffe86a'); return true; }
  return false;
}
function updateDecals(dt) { for (const d of DECALS) d.t -= dt; DECALS = DECALS.filter(d => d.t > 0); }
function drawDecals() { for (const d of DECALS) { const x = d.x - camX, y = sy(d.z, 0); if (x < -10 || x > VW + 10) continue; g.globalAlpha = Math.min(1, d.t / .6); g.fillStyle = d.col; g.beginPath(); g.ellipse(x, y, d.r * 1.6, d.r * .6, 0, 0, 7); g.fill(); } g.globalAlpha = 1; }
function star5(c, x, y, r, col) { c.fillStyle = col; c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = .6; c.stroke(); }
// how a fighter looks under each effect (called from drawWarriorRig)
function statusPose(p, pose) {
  if (!p.st) return pose;
  for (const s of p.st) {
    if (s.k === 'dizzy' && s.t <= 0 && s.after > 0) { const q = POSES.down(time, 2); if (s.after < .45) { const sh = Math.sin(time * 40) * .4; return PZ({ ry: 6, sp: .5, nk: sh, aF: [.4, .6], aB: [-.3, .5], lF: [1.2, -1.8], lB: [-.3, -1.6] }); } return q; }
    if (s.k === 'bleed' && s.t <= 0 && s.after > 0) { const q = POSES.idle(time, 1); q.aF = [2.4, .3]; q.aB = [2.2, .4]; return q; }
  }
  return pose;
}
function statusSpin(p) { const s = stOf(p, 'bleed'); return s && s.t <= 0 && s.after > 0 ? s.after : 0; }
function drawStatusAround(p, x, y) {
  if (!p.st) return; const h = heroHeight(p.w.id, RIG_S);
  for (const s of p.st) {
    if (s.k === 'dizzy' && s.t > 0) for (let k = 0; k < 4; k++) { const a = time * 3 + k * Math.PI / 2; star5(g, x + Math.cos(a) * 11, y - h - 4 + Math.sin(a) * 3, 2.6, k % 2 ? '#ffe86a' : '#fff8c0'); }
    if (s.k === 'bleed' && s.t <= 0 && s.after > 0) { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1; for (let k = 0; k < 6; k++) { const a = time * 22 + k; g.beginPath(); g.arc(x, y - h * .5, 16 + k * 2, a, a + .9); g.stroke(); }
      for (let k = 0; k < 3; k++) { const a = time * 18 + k * 2.1; g.fillStyle = '#f4f0e6'; g.save(); g.translate(x + Math.cos(a) * 14, y - h * .5 + Math.sin(a) * 6); g.rotate(a); g.fillRect(-6, -1.2, 12, 2.4); g.strokeStyle = '#c8b8a0'; g.lineWidth = .5; g.strokeRect(-6, -1.2, 12, 2.4); g.restore(); } }
  }
}
// draws a fighter tinted (poison green) through a small offscreen canvas
const TINT = document.createElement('canvas'); TINT.width = 480; TINT.height = 480; const TX = TINT.getContext('2d');
function drawTinted(drawFn, x, y, col, a) {
  TX.setTransform(1, 0, 0, 1, 0, 0); TX.clearRect(0, 0, 480, 480); TX.setTransform(HI, 0, 0, HI, -(x - 80) * HI, -(y - 130) * HI);
  const keep = g; g = TX; drawFn(TX); g = keep;
  TX.setTransform(1, 0, 0, 1, 0, 0); TX.globalCompositeOperation = 'source-atop'; TX.fillStyle = col; TX.globalAlpha = a; TX.fillRect(0, 0, 480, 480); TX.globalAlpha = 1; TX.globalCompositeOperation = 'source-over';
  g.drawImage(TINT, x - 80, y - 130, 160, 160);
}
