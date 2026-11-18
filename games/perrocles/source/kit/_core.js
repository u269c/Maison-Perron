// ── core helpers (from Mine-Moule) ──
const R = (x, X, Y, w, h, c) => { x.fillStyle = c; x.fillRect(Math.round(X), Math.round(Y), Math.round(w), Math.round(h)); };
const disc = (x, cx, cy, r, c) => { x.fillStyle = c; cx = Math.round(cx); cy = Math.round(cy); r = Math.max(1, Math.round(r)); for (let j = -r; j <= r; j++) { const hw = Math.round(Math.sqrt(r * r - j * j)); x.fillRect(cx - hw, cy + j, hw * 2 + 1, 1); } };
function rng(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hex = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const SZ = 220, GY = 186;

// ── the four directions: palettes for semantic slots ──
const STY = ['classic', 'goth', 'metal', 'cyber'];
const MAP = {
  goth: { skin: '#e9e0ea', skin2: '#c9bccb', hair: '#1a1420', cloth: '#241a2e', cloth2: '#4a2c66', trim: '#c9c3d6', metal: '#9a98a8', metal2: '#6a687a', eye: '#d0202a', fur: '#2e2836', fur2: '#544a62', scale: '#3a2a4e', belly: '#7a6a90', wood: '#2a1e24', glow: '#b080ff', horn: '#d8d0e0', feather: '#2b2236', bronze: '#7a7488', red: '#7a1030' },
  metal: { skin: '#e6e2dc', skin2: '#bdb6ae', hair: '#0c0c0c', cloth: '#141414', cloth2: '#3a1010', trim: '#b8bcc2', metal: '#8d9096', metal2: '#55585e', eye: '#ff2a10', fur: '#1a1212', fur2: '#3a1a14', scale: '#3e1210', belly: '#7a2a1a', wood: '#1c1410', glow: '#ff5a10', horn: '#e8e0d0', feather: '#1a1414', bronze: '#5a4a40', red: '#b01010' },
  cyber: { skin: '#c8a890', skin2: '#9a7c66', hair: '#ff2fa0', cloth: '#1a2236', cloth2: '#2c3a58', trim: '#22f0ff', metal: '#c8d4e4', metal2: '#7a8aa0', eye: '#22f0ff', fur: '#5a6a80', fur2: '#8898b0', scale: '#3a4a66', belly: '#7a8aa8', wood: '#3a4458', glow: '#ff2fd0', horn: '#e0f0ff', feather: '#4a5a78', bronze: '#9aa8bc', red: '#ff2fd0' },
};
const BASE = { skin: '#e2a97c', skin2: '#b77d55', hair: '#3b2314', cloth: '#c0392b', cloth2: '#8e2a20', trim: '#e0a92e', metal: '#d8c9a0', metal2: '#9c8a60', eye: '#151010', fur: '#c89a50', fur2: '#8a6230', scale: '#2f6b3a', belly: '#9bc46a', wood: '#7a5a3a', glow: '#ffd27a', horn: '#efe6d0', feather: '#6a4a30', bronze: '#c98a3a', red: '#c0392b', ink: '#151010' };

// ── backgrounds ──
function bg(x, st) {
  if (st === 'classic') { const cs = ['#3a3a78', '#7a4f82', '#d9786a', '#f4b072', '#f8d090']; for (let y = 0; y < GY; y += 4) { const t = y / GY * (cs.length - 1), i = Math.floor(t); R(x, 0, y, SZ, 4, mix(cs[i], cs[Math.min(i + 1, cs.length - 1)], t - i)); } disc(x, 160, 120, 14, '#ffe2b0'); for (let px = 0; px < SZ; px++) { const h = 30 + 18 * Math.sin(px / 23) + 10 * Math.sin(px / 9); R(x, px, GY - h, 1, h, '#7d86a8'); if (h > 46) R(x, px, GY - h, 1, 4, '#f4f0ff'); } R(x, 0, GY, SZ, SZ - GY, '#b99a68'); R(x, 0, GY, SZ, 3, '#8a9a4a'); for (let q = 0; q < SZ; q += 20) { R(x, q + 2, SZ - 12, 16, 3, '#7a3b22'); R(x, q + 14, SZ - 12, 3, 8, '#7a3b22'); } }
  else if (st === 'goth') { for (let y = 0; y < GY; y += 4) R(x, 0, y, SZ, 4, mix('#0d0a18', '#3a2650', y / GY)); disc(x, 168, 54, 22, '#e8e2f2'); disc(x, 176, 48, 20, mix('#0d0a18', '#3a2650', 0.3)); const r = rng(5); for (let i = 0; i < 30; i++) R(x, r() * SZ, r() * 90, 1, 1, '#d8d0ff'); // gothic arch window
    R(x, 14, 40, 44, GY - 40, '#120c1c'); for (let j = 0; j < 22; j++) R(x, 14 + j, 40 - Math.round(Math.sqrt(22 * 22 - (22 - j) * (22 - j)) * 0.9), 44 - j * 2, 2, '#120c1c'); R(x, 22, 56, 28, 50, '#2a1e3e'); R(x, 35, 56, 2, 50, '#120c1c'); R(x, 0, GY, SZ, SZ - GY, '#120c18'); R(x, 0, GY - 10, SZ, 10, 'rgba(180,160,220,0.12)'); }
  else if (st === 'metal') { for (let y = 0; y < GY; y += 4) R(x, 0, y, SZ, 4, mix('#050303', '#5a0a06', y / GY)); for (let px = 0; px < SZ; px++) { const h = 40 + Math.abs(((px * 7) % 46) - 23) * 1.6 + 8 * Math.sin(px / 5); R(x, px, GY - h, 1, h, '#140606'); } const r = rng(9); for (let i = 0; i < 26; i++) R(x, r() * SZ, r() * GY, 2, 2, r() < 0.5 ? '#ff7a20' : '#ffcc40'); R(x, 0, GY, SZ, SZ - GY, '#0a0505'); for (let q = 0; q < SZ; q += 9) { const h = 8 + (q * 13 % 11); R(x, q, GY + 4 - h, 6, h, '#ff4a10'); R(x, q + 2, GY + 4 - h + 3, 2, h - 3, '#ffc030'); } }
  else { for (let y = 0; y < GY; y += 4) R(x, 0, y, SZ, 4, mix('#05060f', '#24123e', y / GY)); for (let k = 0; k < 6; k++) R(x, 70, 60 + k * 9, 80, 5 - k * 0.6, mix('#ff2fd0', '#ffb020', k / 6)); R(x, 0, GY, SZ, SZ - GY, '#06070f'); for (let k = 0; k < 6; k++) R(x, 0, GY + k * k * 1.2, SZ, 1, '#22f0ff'); for (let q = -SZ; q < SZ * 2; q += 24) { x.strokeStyle = 'rgba(34,240,255,0.7)'; x.beginPath(); x.moveTo(SZ / 2 + (q - SZ / 2) * 0.2, GY); x.lineTo(q, SZ); x.stroke(); } x.fillStyle = 'rgba(0,0,0,0.12)'; for (let y = 0; y < SZ; y += 3) x.fillRect(0, y, SZ, 1); }
}

// ── style decorations, placed on anchors each rig returns ──
function deco(x, st, a, C, u) {
  const P = (ax, ay, w, h, c) => R(x, ax, ay, w, h, c);
  if (st === 'goth') { if (a.head) { const [hx, hy] = a.head; for (let k = -2; k <= 2; k++) { P(hx + k * u * 1.2 - 1, hy - u * 0.6 - (k % 2 ? u : 0), 2, u, '#2a1838'); } if (a.eye) P(a.eye[0], a.eye[1] + 2, 1, u * 1.6, '#3a2a50'); }
    if (a.base) { const [bx, by] = a.base; for (const s of [-1, 1]) { const cx = bx + s * (a.w / 2 + 14); P(cx - 3, by - 18, 6, 18, '#e8e0d0'); P(cx - 4, by - 2, 8, 2, '#8a8090'); P(cx - 1, by - 24, 2, 5, '#ffcc66'); disc(x, cx, by - 24, 4, 'rgba(255,200,100,0.35)'); } } }
  else if (st === 'metal') { if (a.eye) { P(a.eye[0] - u, a.eye[1] - u, u * 2.4, u * 2.2, '#000'); P(a.eye[0], a.eye[1], u * 0.8, u * 0.8, C.eye); }
    if (a.head && !a.noHorns) { const [hx, hy] = a.head; for (const s of [-1, 1]) for (let j = 0; j < 6; j++) P(hx + s * (u * 2 + j * 1.6) - 1, hy - u * 0.5 - j * 2.2, 3, 3, '#e8e0d0'); }
    for (const sp of (a.spikes || [])) { for (let j = 0; j < 5; j++) P(sp[0] - (5 - j), sp[1] - j * 2, (5 - j) * 2, 2, j > 2 ? '#d8dce2' : '#8d9096'); } }
  else if (st === 'cyber') { if (a.eye) { P(a.eye[0] - u * 2.2, a.eye[1] - 1, u * 4.4, u * 0.9 + 1, '#22f0ff'); disc(x, a.eye[0], a.eye[1], u * 2.2, 'rgba(34,240,255,0.18)'); }
    if (a.head) { const [hx, hy] = a.head; P(hx + u, hy - u * 3, 1, u * 2, '#c8d4e4'); P(hx + u - 1, hy - u * 3 - 2, 3, 3, '#ff2fd0'); }
    for (const ln of (a.circuits || [])) { P(ln[0], ln[1], ln[2], 1, '#ff2fd0'); P(ln[0] + ln[2] - 1, ln[1], 1, ln[3] || 4, '#ff2fd0'); P(ln[0] + ln[2] - 2, ln[1] + (ln[3] || 4) - 1, 3, 3, '#22f0ff'); } }
}

// ── rigs ──
// humanoid: o = { robe:'short'|'long', beard, bald, female, helmet, petasos, crown, veil, hood, staff, owl, bow, spear, shield, sling, distaff, scepter, wings, horse, bullHead, nymph, peacock, eyes(many), scale }
function human(x, cx, gy, o, C, st) {
  const u = o.u || 5, P = (ax, ay, w, h, c) => R(x, cx + ax * u, gy + ay * u, w * u, h * u, c), A = { w: 12 * u, spikes: [], circuits: [] };
  const top = o.horse ? -27 : -22; let by = 0;
  if (o.peacock) { for (let k = 0; k < 9; k++) { const ang = Math.PI * (0.1 + k * 0.1), rr = 15; const ex = Math.cos(ang) * rr, ey = -Math.sin(ang) * rr - 12; for (let j = 0; j < rr; j += 1.5) P(Math.cos(ang) * j - 0.5, -Math.sin(ang) * j - 12, 1.5, 1.5, C.feather); P(ex - 1.2, ey - 1.2, 2.4, 2.4, st === 'classic' ? '#1f7a6a' : C.cloth2); P(ex - 0.5, ey - 0.5, 1, 1, st === 'classic' ? '#2a4aa8' : C.eye); } }
  if (o.wings) { for (const s of [-1, 1]) for (let j = 0; j < 8; j++) P(s > 0 ? 3 + j : -4 - j - 1, top + 6 + j * 0.6, 1.2, 9 - j, C.feather); }
  if (o.horse) { P(-10, -14, 17, 7, C.fur); P(-10, -14, 17, 2, C.fur2); for (const lx of [-9, -6, 3, 6]) { P(lx, -7, 2, 7, C.fur2); P(lx, -1, 2, 1, C.ink || '#151010'); } P(-12, -13, 2, 6, C.hair); A.w = 18 * u; A.spikes.push([cx - 6 * u, gy - 14 * u], [cx + 2 * u, gy - 14 * u]); A.circuits.push([cx - 9 * u, gy - 10 * u, 12 * u, 6]); by = -14; }
  else if (o.robe === 'long') { P(-4, -14, 8, 14, C.cloth); P(-4, -14, 2, 14, C.cloth2); P(-4, -9, 8, 1, C.trim); P(-4, -1, 8, 1, C.trim); }
  else { P(-3, -5, 2, 5, C.skin); P(1, -5, 2, 5, C.skin2); P(-3, -1, 3, 1, C.wood); P(1, -1, 3, 1, C.wood); if (o.winged) { P(-5, -2, 2, 1, C.horn); P(3, -2, 2, 1, C.horn); } }
  const ty = by; // torso base
  if (!(o.robe === 'long' && !o.horse)) { P(-4, ty - 12 + (o.horse ? 5 : 0), 8, o.horse ? 7 : 7, C.cloth); P(-4, ty - 6 + (o.horse ? 5 : 0) - (o.horse ? 1 : 0), 8, 1, C.trim); P(-4, ty - 12 + (o.horse ? 5 : 0), 2, 7, C.cloth2); }
  const sy = o.horse ? -21 : -14; // shoulder line
  P(-6, sy + 1, 2, 6, C.skin); P(4, sy + 1, 2, 6, C.skin); A.spikes.push([cx - 5 * u, gy + sy * u], [cx + 5 * u, gy + sy * u]); A.circuits.push([cx - 3 * u, gy + (sy + 4) * u, 5 * u, 8]);
  if (o.eyes) { const r = rng(3); for (let k = 0; k < 16; k++) { const ex = -4 + r() * 8, ey = sy + r() * 12; P(ex, ey, 1, 1, '#fff'); P(ex + 0.3, ey + 0.3, 0.5, 0.5, C.eye === '#151010' ? '#2a4aa8' : C.eye); } }
  // head
  const hy = sy - 7;
  if (o.bullHead) { P(-4, hy, 8, 7, C.fur); P(-3, hy + 4, 6, 3, C.fur2); P(-2, hy + 5, 1, 1, '#151010'); P(1, hy + 5, 1, 1, '#151010'); for (const s of [-1, 1]) { P(s > 0 ? 4 : -6, hy + 1, 2, 1, C.horn); P(s > 0 ? 5 : -6, hy - 1, 1, 2, C.horn); } P(1, hy + 2, 1, 1, C.eye === '#151010' ? '#151010' : C.eye); A.eye = [cx + 1.5 * u, gy + (hy + 2.5) * u]; A.noHorns = true; }
  else { P(-3, hy, 6, 6, C.skin); if (!o.bald) { P(-3, hy - 1, 7, 2, C.hair); P(-4, hy, 2, o.female ? 7 : 4, C.hair); } else { P(-3, hy - 1, 6, 1, C.horn); P(-4, hy + 1, 2, 3, C.horn); }
    if (o.beard) { P(-2, hy + 4, 6, 4, C.horn); P(-1, hy + 7, 4, 2, C.horn); } P(2, hy + 2, 1, 1, C.eye); A.eye = [cx + 2.5 * u, gy + (hy + 2.5) * u]; }
  A.head = [cx, gy + hy * u];
  if (o.helmet) { P(-4, hy - 2, 8, 3, C.metal); P(-4, hy - 2, 2, 6, C.metal); P(-1, hy - 5, 2, 3, o.crest || C.red); P(-6, hy - 5, 7, 1, o.crest || C.red); }
  if (o.petasos) { P(-6, hy - 1, 12, 1, C.trim); P(-3, hy - 3, 6, 2, C.trim); P(-4, hy - 4, 2, 2, C.horn); P(2, hy - 4, 2, 2, C.horn); }
  if (o.crown) { P(-3, hy - 3, 6, 2, C.trim); P(-3, hy - 4, 1, 1, C.trim); P(0, hy - 5, 1, 2, C.trim); P(2, hy - 4, 1, 1, C.trim); }
  if (o.veil) { P(-5, hy - 1, 2, 12, C.cloth2); }
  if (o.nymph) { for (let k = 0; k < 6; k++) P(-4 + k * 1.5, hy - 2 - (k % 2), 1.5, 1.5, st === 'classic' ? '#6aa04a' : C.glow); disc(x, cx, gy + (hy + 6) * u, 9 * u, st === 'classic' ? 'rgba(200,255,200,0.12)' : 'rgba(200,160,255,0.12)'); }
  // held items
  if (o.staff) { P(6, sy - 10, 1, 24 + (o.horse ? 0 : 0), C.wood); }
  if (o.owl) { P(5, sy - 14, 3, 4, C.feather); P(5, sy - 13, 1, 1, C.trim); P(7, sy - 13, 1, 1, C.trim); }
  if (o.spear) { P(-7, sy - 10, 1, 22, C.wood); P(-7.5, sy - 13, 2, 3, C.metal); }
  if (o.bow) { for (let j = 0; j < 14; j++) P(7 + Math.sin(j / 13 * Math.PI) * 2, sy - 4 + j, 1, 1, C.wood); P(7, sy - 4, 0.4, 14, C.horn); }
  if (o.shield) { disc(x, cx - 7 * u, gy + (sy + 5) * u, 4 * u, C.metal2); disc(x, cx - 7 * u, gy + (sy + 5) * u, 3 * u, C.metal); disc(x, cx - 7 * u, gy + (sy + 5) * u, 1 * u, C.red); }
  if (o.sling) { P(5, sy + 6, 1, 4, C.wood); P(4.5, sy + 10, 2, 1, C.horn); }
  if (o.distaff) { P(6, sy - 2, 1, 12, C.wood); P(5, sy - 3, 3, 3, C.horn); }
  if (o.scepter) { P(6, sy - 8, 1, 20, C.trim); disc(x, cx + 6.5 * u, gy + (sy - 9) * u, u * 1.2, C.trim); }
  if (o.caduceus) { P(6, sy - 6, 1, 16, C.trim); P(5, sy - 7, 3, 1, C.horn); for (let j = 0; j < 6; j++) P(5.5 + (j % 2), sy - 5 + j * 2, 1, 1, C.scale); }
  A.base = [cx, gy]; return A;
}
// quadruped: lion, boar, bull, dog (heads), hind
function quad(x, cx, gy, o, C, st) {
  const u = o.u || 4, P = (ax, ay, w, h, c) => R(x, cx + ax * u, gy + ay * u, w * u, h * u, c), A = { w: 34 * u, spikes: [], circuits: [] };
  const L = o.long || 26, H = o.tall || 12, bx = -L / 2;
  for (const lx of [bx + 2, bx + 6, bx + L - 7, bx + L - 3]) { P(lx, -H + 2, 3, H - 2, C.fur2); P(lx, -1, 3, 1, '#151010'); }
  P(bx, -H - 9, L, 11, C.fur); P(bx, -H - 9, L, 2, mix(C.fur, '#ffffff', 0.15)); P(bx, -H + 0, L, 2, C.fur2);
  if (o.stripes) for (let k = 0; k < L; k += 4) P(bx + k, -H - 9, 1, 11, C.fur2);
  P(bx - 4, -H - 8, 4, 2, C.fur2); P(bx - 6, -H - 10, 2, 3, C.fur2); // tail
  const heads = o.heads || 1;
  for (let k = 0; k < heads; k++) { const hx = bx + L - 2 + (heads > 1 ? k * 4 - 6 : 0), hy = -H - 15 + (heads > 1 ? (k - 1) * 5 - 2 : 0);
    if (o.mane) { disc(x, cx + (hx + 3) * u, gy + (hy + 5) * u, 7 * u, C.fur2); }
    P(hx, hy, 9, 8, C.fur); P(hx + 6, hy + 3, 4, 4, mix(C.fur, '#ffffff', 0.2)); P(hx + 9, hy + 4, 1, 1, '#151010');
    if (o.ears !== false) P(hx + 1, hy - 2, 2, 2, C.fur2);
    if (o.horns) { P(hx + 1, hy - 3, 1, 3, C.horn); P(hx + 4, hy - 3, 1, 3, C.horn); P(hx - 1, hy - 4, 2, 1, C.horn); P(hx + 5, hy - 4, 2, 1, C.horn); }
    if (o.antlers) { P(hx + 2, hy - 7, 1, 7, o.gold ? C.trim : C.horn); P(hx, hy - 6, 2, 1, o.gold ? C.trim : C.horn); P(hx + 3, hy - 9, 3, 1, o.gold ? C.trim : C.horn); P(hx + 5, hy - 11, 1, 3, o.gold ? C.trim : C.horn); }
    if (o.tusks) { P(hx + 8, hy + 6, 1, 2, C.horn); P(hx + 9, hy + 5, 1, 1, C.horn); }
    P(hx + 6, hy + 2, 1, 1, C.eye); if (k === heads - 1) { A.eye = [cx + (hx + 6.5) * u, gy + (hy + 2.5) * u]; A.head = [cx + (hx + 4) * u, gy + hy * u]; } }
  if (o.bristle) for (let k = 0; k < L; k += 3) P(bx + k, -H - 11, 1, 2, C.fur2);
  A.spikes.push([cx + (bx + 6) * u, gy + (-H - 9) * u], [cx + (bx + 14) * u, gy + (-H - 9) * u], [cx + (bx + 22) * u, gy + (-H - 9) * u]); A.circuits.push([cx + (bx + 3) * u, gy + (-H - 5) * u, 14 * u, 10]);
  A.base = [cx, gy]; return A;
}
// serpents: hera's serpent, hydra (many heads), ladon (coiled at a tree)
function serpents(x, cx, gy, o, C, st) {
  const u = o.u || 3, A = { w: 40 * u, spikes: [], circuits: [] }, heads = o.heads || 1;
  if (o.tree) { R(x, cx + 22, gy - 120, 10, 120, C.wood); disc(x, cx + 27, gy - 130, 26, st === 'classic' ? '#4a7a3a' : C.cloth2); for (let k = 0; k < 6; k++) disc(x, cx + 10 + (k * 13) % 36, gy - 138 + (k * 7) % 22, 4, st === 'classic' ? '#f0c030' : C.glow); }
  for (let i = 30; i >= 0; i--) { const px = cx - 50 + i * 3, py = gy - 8 - Math.sin(i * 0.5) * 4; disc(x, px, py, 7, '#151010'); disc(x, px, py, 6, i % 3 ? C.scale : mix(C.scale, '#000000', 0.2)); if (i % 2) R(x, px - 1, py + 3, 3, 2, C.belly); }
  for (let h = 0; h < heads; h++) { const ang = Math.PI * (0.18 + (heads > 1 ? h / (heads - 1) * 0.64 : 0.32)), len = (o.neck || 34) + (heads > 1 ? (h % 2) * 8 : 0); let hx = cx + 30, hy = gy - 10;
    for (let j = 0; j < len; j += 2) { hx = cx + 30 - Math.cos(ang) * j * 1.9 + Math.sin(j / 6 + h) * 2; hy = gy - 12 - Math.sin(ang) * j * 1.6; disc(x, hx, hy, 4, '#151010'); disc(x, hx, hy, 3, C.scale); }
    R(x, hx - 6, hy - 5, 12, 9, '#151010'); R(x, hx - 5, hy - 4, 10, 7, C.scale); R(x, hx + 2, hy - 2, 2, 2, C.eye === '#151010' ? '#ff3b2f' : C.eye); R(x, hx + 5, hy + 2, 5, 1, '#d8303c');
    if (h === heads - 1 || heads === 1) { A.eye = [hx + 3, hy - 1]; A.head = [hx, hy - 6]; } A.spikes.push([hx - 2, hy - 5]); }
  A.circuits.push([cx - 40, gy - 14, 40, 6]); A.base = [cx - 10, gy]; A.noHorns = heads > 3; return A;
}
function bird(x, cx, gy, o, C, st) {
  const u = o.u || 5, P = (ax, ay, w, h, c) => R(x, cx + ax * u, gy + ay * u, w * u, h * u, c), A = { w: 24 * u, spikes: [], circuits: [] };
  const y0 = o.perch ? -6 : -22; if (o.perch) { P(-8, -2, 16, 2, C.wood); }
  for (const s of [-1, 1]) for (let j = 0; j < 9; j++) P(s > 0 ? 2 + j : -3 - j, y0 - 6 + j * 0.5 - (j > 4 ? (j - 4) : 0), 1, 7 - j * 0.4, j % 2 ? C.feather : (o.bronze ? C.bronze : mix(C.feather, '#ffffff', 0.15)));
  P(-3, y0 - 6, 6, 8, o.bronze ? C.bronze : C.feather); P(-2, y0 + 2, 1, 4, C.horn); P(1, y0 + 2, 1, 4, C.horn);
  if (o.human) { P(-2.5, y0 - 12, 5, 5, C.skin); P(-3, y0 - 13, 6, 2, C.hair); P(-3, y0 - 12, 1, 6, C.hair); P(1, y0 - 10, 1, 1, C.eye); A.eye = [cx + 1.5 * u, gy + (y0 - 9.5) * u]; A.head = [cx, gy + (y0 - 13) * u]; if (o.lyre) { P(3, y0 - 4, 1, 5, C.trim); P(5, y0 - 4, 1, 5, C.trim); P(3, y0 - 5, 3, 1, C.trim); } }
  else { P(-2, y0 - 11, 5, 5, o.bronze ? C.bronze : C.feather); P(3, y0 - 9, 3, 1, o.bronze ? C.metal : C.trim); P(1, y0 - 10, 1, 1, C.eye); A.eye = [cx + 1.5 * u, gy + (y0 - 9.5) * u]; A.head = [cx, gy + (y0 - 11) * u]; A.noHorns = true; }
  A.spikes.push([cx - 6 * u, gy + (y0 - 4) * u], [cx + 6 * u, gy + (y0 - 4) * u]); A.circuits.push([cx - 2 * u, gy + (y0 - 4) * u, 4 * u, 6]); A.base = [cx, gy]; return A;
}
function crab(x, cx, gy, o, C, st) { const u = 4, P = (ax, ay, w, h, c) => R(x, cx + ax * u, gy + ay * u, w * u, h * u, c), A = { w: 30 * u, spikes: [], circuits: [] };
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { P(s * (6 + k * 2) - (s < 0 ? 1 : 0), -6 + k, 1, 6 - k, C.cloth2); }
  P(-8, -12, 16, 7, C.cloth); P(-8, -12, 16, 2, mix(C.cloth, '#ffffff', 0.2)); for (const s of [-1, 1]) { P(s * 9 - (s < 0 ? 3 : 0), -18, 3, 6, C.cloth); P(s * 11 - (s < 0 ? 4 : 0), -22, 4, 4, C.cloth); P(s * 11 - (s < 0 ? 4 : 0) + (s > 0 ? 2 : 0), -24, 2, 3, C.cloth2); }
  P(-3, -15, 1, 3, C.cloth2); P(2, -15, 1, 3, C.cloth2); P(-3, -16, 1, 1, C.eye); P(2, -16, 1, 1, C.eye); A.eye = [cx + 2 * u, gy - 16 * u]; A.head = [cx, gy - 16 * u]; A.noHorns = true; A.spikes.push([cx - 5 * u, gy - 12 * u], [cx, gy - 12 * u], [cx + 5 * u, gy - 12 * u]); A.circuits.push([cx - 6 * u, gy - 9 * u, 12 * u, 4]); A.base = [cx, gy]; return A; }
function giant(x, cx, gy, o, C, st) { // polyphemus, talos, argus, laestrygonian
  const u = 6, P = (ax, ay, w, h, c) => R(x, cx + ax * u, gy + ay * u, w * u, h * u, c), A = { w: 16 * u, spikes: [], circuits: [] }, body = o.bronze ? C.bronze : C.cloth;
  P(-4, -7, 3, 7, o.bronze ? C.bronze : C.skin2); P(1, -7, 3, 7, o.bronze ? C.bronze : C.skin2); P(-5, -18, 10, 11, body); P(-5, -18, 3, 11, mix(body, '#000000', 0.2)); if (!o.bronze) P(-5, -10, 10, 1, C.trim);
  P(-7, -17, 2, 8, o.bronze ? C.bronze : C.skin); P(5, -17, 2, 8, o.bronze ? C.bronze : C.skin); P(-4, -25, 8, 7, o.bronze ? C.bronze : C.skin); P(-4, -26, 8, 2, o.bronze ? C.metal2 : C.hair);
  if (o.cyclops) { P(-1, -23, 2, 2, '#ffffff'); P(-0.4, -22.6, 1, 1, C.eye === '#151010' ? '#151010' : C.eye); A.eye = [cx, gy - 22.5 * u]; P(-3, -20, 6, 2, C.hair); P(6, -26, 1, 18, C.wood); }
  else { P(1, -23, 1, 1, C.eye); A.eye = [cx + 1.5 * u, gy - 22.5 * u]; }
  if (o.bronze) { P(-1, -16, 2, 6, C.metal2); P(2, -3, 1, 1, st === 'classic' ? '#ffd040' : C.glow); P(-5, -14, 10, 1, C.metal2); }
  A.head = [cx, gy - 26 * u]; A.spikes.push([cx - 5 * u, gy - 18 * u], [cx + 5 * u, gy - 18 * u]); A.circuits.push([cx - 4 * u, gy - 15 * u, 7 * u, 12], [cx - 3 * u, gy - 11 * u, 5 * u, 8]); A.base = [cx, gy]; return A; }
function typhon(x, cx, gy, o, C, st) { const u = 4, P = (ax, ay, w, h, c) => R(x, cx + ax * u, gy + ay * u, w * u, h * u, c), A = { w: 30 * u, spikes: [], circuits: [] };
  for (const s of [-1, 1]) for (let j = 0; j < 10; j++) P(s > 0 ? 4 + j : -5 - j, -30 + j * 0.5, 1.2, 12 - j, C.feather);
  for (const s of [-1, 1]) for (let i = 0; i < 14; i++) { const px = s * (2 + i * 1.1), py = -2 - Math.abs(Math.sin(i * 0.6)) * 3; disc(x, cx + px * u, gy + py * u, 2.4 * u, C.scale); }
  P(-5, -20, 10, 12, C.skin2); P(-5, -20, 10, 2, C.skin); P(-7, -19, 2, 8, C.skin); P(5, -19, 2, 8, C.skin);
  for (let k = 0; k < 5; k++) { const hx = -6 + k * 3, hy = -27 - (k % 2) * 2; P(hx, hy, 2, 4, C.scale); P(hx - 0.5, hy - 1, 3, 2, C.scale); P(hx + 1, hy - 1, 1, 1, C.eye === '#151010' ? '#ff3b2f' : C.eye); }
  P(-3, -26, 6, 6, C.skin); P(-3, -27, 6, 2, C.hair); P(1, -24, 1, 1, C.eye === '#151010' ? '#ff3b2f' : C.eye); A.eye = [cx + 1.5 * u, gy - 23.5 * u]; A.head = [cx, gy - 27 * u];
  disc(x, cx - 10 * u, gy - 34 * u, 3 * u, st === 'cyber' ? 'rgba(34,240,255,0.3)' : 'rgba(255,220,120,0.25)'); R(x, cx - 10 * u, gy - 34 * u, 2, 30, st === 'cyber' ? '#22f0ff' : '#ffe080');
  A.spikes.push([cx - 5 * u, gy - 20 * u], [cx + 5 * u, gy - 20 * u]); A.circuits.push([cx - 4 * u, gy - 16 * u, 7 * u, 10]); A.base = [cx, gy]; return A; }
function scylla(x, cx, gy, o, C, st) { const u = 4, P = (ax, ay, w, h, c) => R(x, cx + ax * u, gy + ay * u, w * u, h * u, c), A = { w: 34 * u, spikes: [], circuits: [] };
  R(x, 0, gy - 10, SZ, 10, st === 'classic' ? '#3a7ab0' : (st === 'cyber' ? '#103050' : '#1a1020'));
  P(-3, -22, 6, 12, C.skin); P(-3, -22, 6, 2, C.cloth2); P(-3, -28, 6, 6, C.skin); P(-4, -29, 8, 3, C.hair); P(-4, -27, 2, 9, C.hair); P(1, -26, 1, 1, C.eye); A.eye = [cx + 1.5 * u, gy - 25.5 * u]; A.head = [cx, gy - 29 * u];
  for (let k = 0; k < 6; k++) { const s = k < 3 ? -1 : 1, i = k % 3, ex = s * (8 + i * 4), ey = -14 - i * 5; for (let j = 0; j < 8; j++) disc(x, cx + (s * 2 + (ex - s * 2) * j / 8) * u, gy + (-12 + (ey + 12) * j / 8) * u, 1.6 * u, C.scale);
    P(ex - (s < 0 ? 4 : 0), ey - 2, 4, 3, C.fur); P(ex + (s > 0 ? 3 : -4), ey - 1, 1, 1, C.eye === '#151010' ? '#ff3b2f' : C.eye); P(ex - (s < 0 ? 5 : -3), ey + 1, 2, 1, '#ffffff'); A.spikes.push([cx + ex * u, gy + (ey - 2) * u]); }
  A.circuits.push([cx - 2 * u, gy - 19 * u, 4 * u, 6]); A.base = [cx, gy]; return A; }
// weapons (held up large on a stand)
function weapon(x, cx, gy, o, C, st) { const u = 4, P = (ax, ay, w, h, c) => R(x, cx + ax * u, gy + ay * u, w * u, h * u, c), A = { w: 14 * u, spikes: [], circuits: [], noHorns: true }; const k = o.kind;
  P(-6, -2, 12, 2, st === 'classic' ? '#d8ccb6' : C.metal2); P(-4, -4, 8, 2, st === 'classic' ? '#efe8da' : C.metal);
  if (k === 'club') { for (let j = 0; j < 34; j++) { const w = 2 + j * 0.12; P(-w / 2, -6 - j, w, 1, j % 5 ? C.wood : mix(C.wood, '#000000', 0.25)); } for (let n = 0; n < 6; n++) P((n % 2 ? 1 : -2.5), -16 - n * 4, 1.5, 1.5, mix(C.wood, '#000000', 0.35)); A.top = [cx, gy - 40 * u]; }
  if (k === 'xiphos') { P(-0.5, -12, 1.5, 6, C.wood); P(-3, -13, 7, 1.5, C.trim); for (let j = 0; j < 22; j++) { const w = 2.4 - Math.abs(j - 12) * 0.03 - (j > 18 ? (j - 18) * 0.5 : 0); P(-w / 2 + 0.25, -14 - j, w, 1, j % 2 ? C.metal : mix(C.metal, '#ffffff', 0.2)); } P(0, -35, 0.5, 21, mix(C.metal, '#000000', 0.25)); A.top = [cx, gy - 36 * u]; }
  if (k === 'spear') { P(-0.5, -31, 1, 25, C.wood); for (let j = 0; j < 8; j++) { const w = 2.6 - Math.abs(j - 3) * 0.5; P(-w / 2, -38 + j, w, 1, C.metal); } P(-1, -31, 2, 1, C.trim); A.top = [cx, gy - 38 * u]; }
  if (k === 'bow') { for (let j = 0; j < 34; j++) P(-3 + Math.sin(j / 33 * Math.PI) * 5, -6 - j, 1.2, 1, C.wood); P(-3, -40, 0.4, 34, C.horn); P(-6, -24, 12, 0.6, C.wood); P(5, -25, 2, 2, st === 'classic' ? '#5ab040' : C.glow); P(-7, -24.5, 2, 1.6, C.trim); A.top = [cx, gy - 40 * u]; }
  if (k === 'harpe') { P(-0.5, -16, 1.5, 10, C.wood); P(-0.5, -24, 1.5, 8, C.metal); for (let j = 0; j < 14; j++) { const a = j / 13 * Math.PI * 0.9; P(-0.5 + Math.cos(a) * 5 - 5, -26 - Math.sin(a) * 7, 1.6, 1.6, mix(C.metal, '#ffffff', j % 2 ? 0.25 : 0)); } P(0, -24, 1.4, 6, C.metal); A.top = [cx, gy - 34 * u]; }
  if (k === 'aegis') { disc(x, cx, gy - 22 * u, 13 * u, C.metal2); disc(x, cx, gy - 22 * u, 11.5 * u, C.metal); for (let n = 0; n < 12; n++) { const a = n / 12 * Math.PI * 2; disc(x, cx + Math.cos(a) * 11.8 * u, gy - 22 * u + Math.sin(a) * 11.8 * u, 1.2 * u, C.scale); }
    disc(x, cx, gy - 22 * u, 5 * u, C.skin); P(-2, -24, 1, 1, C.eye); P(1, -24, 1, 1, C.eye); P(-1.5, -20.5, 3, 1, C.red); for (let n = 0; n < 8; n++) { const a = n / 8 * Math.PI * 2; P(Math.cos(a) * 5.6 - 0.5, -22 + Math.sin(a) * 5.6 - 0.5, 1, 1, C.scale); } A.top = [cx, gy - 35 * u]; A.eye = null; }
  if (k === 'trident') { P(-0.5, -34, 1, 28, C.wood); P(-4, -35, 8, 1.4, C.metal); for (const tx of [-4, -0.5, 3]) { P(tx, -42, 1, 7, C.metal); P(tx - 0.5, -43, 2, 1.2, C.metal); } A.top = [cx, gy - 43 * u]; }
  if (k === 'bolt') { const pts = [[0, -44], [-4, -30], [1, -30], [-3, -10], [5, -28], [0, -28], [4, -44]]; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(cx + p[0] * u, gy + p[1] * u) : x.moveTo(cx + p[0] * u, gy + p[1] * u)); x.closePath(); x.fillStyle = st === 'classic' ? '#ffd040' : C.glow; x.fill(); x.lineWidth = 3; x.strokeStyle = '#151010'; x.stroke(); disc(x, cx, gy - 28 * u, 15 * u, 'rgba(255,240,180,0.12)'); A.top = [cx, gy - 44 * u]; }
  // style touches on the weapon itself
  const t = A.top; if (st === 'goth' && t) { for (let j = 0; j < 7; j++) { R(x, t[0] - 10 + j * 3, t[1] + 40 + Math.sin(j) * 6, 2, 2, '#4a2c66'); } R(x, t[0] - 1, t[1] + 30, 2, 26, 'rgba(160,120,220,0.5)'); }
  if (st === 'metal' && t) { for (let j = 0; j < 4; j++) A.spikes.push([t[0] + (j % 2 ? 9 : -9), t[1] + 30 + j * 18]); for (let j = 0; j < 6; j++) R(x, t[0] - 2 + Math.sin(j) * 8, gy - 20 - j * 6, 3, 6, j % 2 ? '#ff4a10' : '#ffc030'); }
  if (st === 'cyber' && t) { R(x, t[0] + 6, t[1] + 8, 2, 90, '#22f0ff'); R(x, t[0] - 8, t[1] + 20, 2, 60, '#ff2fd0'); disc(x, t[0], t[1] + 4, 10, 'rgba(34,240,255,0.18)'); }
  A.base = [cx, gy]; return A; }

const STNAME = { classic: 'Classic', goth: 'Goth', metal: 'Death metal', cyber: 'Cyberpunk' };
function palette(s, st) { const C = Object.assign({}, BASE, s.pal); if (st === 'classic') return C; const M = MAP[st], out = Object.assign({}, C, M);
  // keep each subject recognisable: body colours keep a third of their own hue
  for (const k of ['fur', 'fur2', 'scale', 'belly', 'feather', 'cloth', 'cloth2', 'bronze']) out[k] = mix(M[k], C[k], 0.38); return out; }
const RIM = { classic: '#2a1b12', goth: '#c8a8ff', metal: '#ff6a1a', cyber: '#22f0ff' };
