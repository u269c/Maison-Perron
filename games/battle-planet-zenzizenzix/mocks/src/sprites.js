// =====================================================================
// SPRITES — warriors and Villen-Hüüs's troops, pixel rectangles
// (feet at the origin, facing right; scaled by SPR for the 640×360 screen)
// =====================================================================
let S = { ox: 0, oy: 0, s: 1, f: 1 };
function R(x, y, w, h, col) { const s = S.s; const X = S.f === 1 ? x * s : -(x + w) * s; g.fillStyle = col; g.fillRect(Math.round(S.ox + X), Math.round(S.oy + y * s), Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s))); }
function px(x, y, col) { R(x, y, 1, 1, col); }
function human(L, a) {
  const sw = Math.sin(a.walk) * 3, air = a.air;
  const leg = (dx, col, peg) => { if (peg) { R(dx + 1, -13, 2, 13, '#b8862e'); R(dx, -14, 4, 3, col); } else { R(dx, -14, 4, 12, col); R(dx - 1, -3, 6, 3, '#14100c'); } };
  if (L.type === 'cloak') { // Demi
    R(-8, -26, 8, 26, '#c84a1a'); R(0, -26, 8, 26, '#6a90c0'); R(-9, -4, 9, 4, '#a83a14'); R(0, -4, 10, 4, '#4a6a9a');
    for (let k = 0; k < 4; k++) { px(-9 - (k % 2), -22 + k * 5 - Math.floor(time * 8 + k) % 3, '#ffb040'); px(9, -20 + k * 5, '#e8f6ff'); }
    R(-6, -36, 12, 11, '#1a0e0e'); R(-6, -37, 6, 3, '#a83a14'); R(0, -37, 6, 3, '#6a90c0'); px(-2, -31, '#ffa040'); px(2, -31, '#a0e0ff');
    if (a.atk) { R(8, -24, 12, 3, a.fire ? '#ff8a3a' : '#9fd8ff'); } else { R(-11, -24, 3, 10, '#a83a14'); R(8, -24, 3, 10, '#5a7aaa'); }
    return; }
  leg(-4 - sw * (air ? 0 : 1), L.pants); leg(1 + sw * (air ? 0 : 1), L.peg ? L.pants : L.pants, L.peg);
  if (air) { R(-5, -12, 4, 4, L.pants); }
  R(-6, -30, 12, 17, L.top); // torso
  if (L.trim) { R(4, -30, 2, 17, L.trim); R(-6, -15, 12, 2, L.trim); }
  if (L.camo) { px(-4, -27, '#2a3418'); px(2, -24, '#6a7a40'); px(-2, -20, '#2a3418'); px(3, -17, '#3a2a18'); R(-6, -22, 12, 2, '#2a2010'); }
  if (L.seams) { R(-3, -28, 1, 10, L.seams); R(2, -26, 1, 9, L.seams); }
  if (L.bag) { R(-7, -18, 5, 5, '#6a4426'); R(3, -28, 4, 3, '#efe6d2'); px(5, -27, '#3a8a4a'); }
  if (L.id === 'magneto') { R(-6, -30, 12, 6, L.skin); R(-6, -18, 12, 3, '#c8963a'); }
  R(-8, -29, 3, 12, L.bareArms ? L.skin : L.top); // back arm
  // head
  R(-4, -40, 9, 10, L.skin); px(3, -37, '#120c08');
  if (L.beard) { R(-1, -33, 7, 5, L.beard); R(1, -28, 4, 3, L.beard); }
  if (L.hat === 'tricorn') { R(-6, -42, 13, 3, '#14100c'); R(-3, -45, 8, 3, '#14100c'); R(-6, -42, 13, 1, '#e0b45a'); px(1, -44, '#c83a2a'); }
  if (L.hat === 'mohawk') { for (let k = 0; k < 4; k++) R(-3 + k * 2, -45 + (k % 2), 2, 5, L.hair); }
  if (L.hat === 'cyborg') { R(0, -40, 5, 6, '#b8b8c4'); px(3, -37, '#ff3a1a'); px(4, -37, '#ff3a1a'); }
  if (L.hat === 'mask') { R(-4, -40, 9, 6, L.mask); px(3, -37, '#f6f0e0'); R(-4, -40, 9, 1, '#f0c860'); }
  if (L.hat === 'bun') { R(-4, -42, 8, 3, L.hair); R(-6, -41, 3, 3, L.hair); }
  if (L.hat === 'helmet') { R(-5, -43, 11, 5, L.helm); R(-6, -39, 13, 1, '#2a3418'); }
  // front arm: punch / weapon
  const arm = L.bareArms ? L.skin : L.top, armW = L.bigArm ? 5 : 3;
  if (a.atk) { R(3, -28, 11, armW, L.bigArm ? '#9a9aa4' : arm); R(14, -29, 3, armW + 1, L.bigArm ? '#c8c8d0' : L.skin);
    if (L.weapon === 'sabre') { R(16, -30, 14, 1, '#e8e4dc'); R(15, -31, 2, 3, '#e0b45a'); }
    if (L.weapon === 'guitar') { R(10, -34, 7, 6, '#c82a2a'); R(16, -32, 10, 2, '#2a1a10'); }
    if (L.glove) { R(14, -30, 5, 5, L.glove); } }
  else { R(4, -29, armW, 11, L.bigArm ? '#7a7a84' : arm); R(4, -18, armW, 3, L.bigArm ? '#b8b8c4' : L.skin); if (L.glove) R(3, -19, 5, 4, L.glove); if (L.weapon === 'guitar') { R(-9, -28, 6, 8, '#c82a2a'); R(-6, -40, 2, 12, '#2a1a10'); } if (L.weapon === 'sabre') R(-8, -16, 2, 10, '#d8d4cc'); }
}
function drawWarrior(p) {
  const L = p.w.look, x = p.x - camX, y = sy(p.z, p.y);
  if (p.inv > 0 && p.ko <= 0 && Math.floor(time * 20) % 2 && p.sp <= 0) return;
  shadow(p.x, p.z, p.y, (L.type === 'rider' ? 20 : 10 * (L.s || 1)) * SPR);
  if (p.dash > 0) { g.fillStyle = 'rgba(255,240,200,.7)'; for (let k = 0; k < 5; k++) g.fillRect(Math.round(x - p.face * (14 + k * 7)), Math.round(y - 12 - k * 9), 10, 1); }
  if (p.dodge > 0) g.globalAlpha = .55;
  if (p.ko > 0) { g.save(); g.translate(Math.round(x), Math.round(y - 4)); g.rotate(-Math.PI / 2 * p.face); S = { ox: 0, oy: 0, s: (L.s || 1) * SPR * (L.type === 'rider' ? .7 : 1), f: p.face }; const a0 = { walk: 0, atk: false, air: false };
    if (L.type === 'human' || L.type === 'cloak') human({ ...L, id: p.w.id }, a0); else { g.fillStyle = '#6a5a4a'; g.fillRect(-14, -10, 28, 12); }
    g.restore(); g.fillStyle = '#ffd23f'; for (let k = 0; k < 3; k++) { const a = time * 4 + k * 2.1; g.fillRect(Math.round(x + Math.cos(a) * 12), Math.round(y - 22 + Math.sin(a) * 4), 2, 2); } return; }
  S = { ox: Math.round(x), oy: Math.round(y), s: (L.s || 1) * SPR, f: p.face };
  const a = { walk: p.walk, atk: p.atk > 0, air: p.y > ground(p.x, p.z) + 2, fire: p.fire };
  if (p.rage > 0) { g.fillStyle = 'rgba(255,60,30,.35)'; g.beginPath(); g.ellipse(x, y - 28, 20, 36, 0, 0, 7); g.fill(); }
  if (p.frozen > 0) { g.fillStyle = 'rgba(190,230,255,.35)'; g.fillRect(Math.round(x - 14), Math.round(y - 62), 28, 62); }
  if (p.state === 'roll') { g.fillStyle = p.w.fx === 'lavaroll' ? '#4a4a54' : '#8a7a4a'; g.beginPath(); g.arc(x, y - 22, 22, 0, 7); g.fill(); g.strokeStyle = p.w.fx === 'lavaroll' ? '#ff7a2a' : '#e8d8a0'; g.lineWidth = 2; g.beginPath(); g.arc(x, y - 22, 22, time * 20, time * 20 + 3); g.stroke(); g.lineWidth = 1; return; }
  switch (L.type) {
    case 'human': human({ ...L, id: p.w.id }, a); g.globalAlpha = 1; break;
    case 'cloak': human(L, a); break;
    case 'rider': { // Papi on his tidewalker
      const sw = Math.sin(p.walk) * 4;
      [[-12, sw], [-6, -sw], [6, sw], [12, -sw]].forEach(([dx, o]) => { R(dx + o * .5, -34, 2, 34, dx < 0 ? '#5a4a30' : '#3a3020'); R(dx + o * .5 - 1, -2, 4, 2, '#2a2418'); });
      R(-16, -42, 30, 10, '#9a8a4a'); R(-14, -44, 26, 3, '#b8a868'); px(-8, -40, '#6a5a30'); px(2, -38, '#6a5a30');
      R(12, -50, 4, 10, '#9a8a4a'); R(14, -54, 10, 5, '#a89a5a'); px(21, -53, '#1a1208');
      R(-12, -48, 8, 4, '#d8d8d0'); if (p.state === 'roll' || a.atk) { R(-22, -47, 10, 2, '#ffd27a'); }
      R(-4, -58, 7, 12, '#9a3a2a'); R(-3, -64, 6, 6, '#e0b090'); R(-4, -66, 8, 2, '#4a4a3a'); R(2, -60, 4, 1, '#f4f0e8');
      if (a.atk) { R(3, -56, 18, 1, '#d8dcd8'); R(20, -58, 1, 5, '#d8dcd8'); } else R(3, -56, 6, 2, '#9a3a2a');
      break; }
    case 'blob': { // Spora floats
      const bob = Math.sin(time * 3) * 2; S.oy = Math.round(y - 18 + bob);
      for (let k = 0; k < 7; k++) R(-10 + k * 3, -6, 1, 8 + (k * 5) % 6 + Math.round(Math.sin(time * 4 + k) * 1.5), k % 2 ? '#c890b8' : '#4a8a3a');
      R(-12, -10, 24, 5, '#d8a0c8'); R(-12, -20, 24, 10, '#4a7a3a'); R(-9, -24, 18, 4, '#5a9a4a'); R(-5, -26, 10, 2, '#6aaa5a');
      for (let k = 0; k < 6; k++) px(-9 + k * 3, -18 + (k % 3) * 3, '#d8ff8a'); px(2, -16, '#fff0a0'); px(6, -16, '#fff0a0');
      if (a.atk) R(10, -14, 10, 2, '#9ad86a');
      break; }
    case 'goose': {
      const flap = a.atk || a.air ? -8 : 0;
      R(-12, -14, 20, 9, '#7a6a5a'); R(-2, -12, 10, 6, '#ece4d4'); R(-16, -13, 5, 4, '#2a2420');
      R(-10, -18 + flap, 14, 4, '#9a8a78'); if (flap) { R(-12, -26, 4, 10, '#8a7a68'); R(-6, -28, 4, 12, '#9a8a78'); }
      R(6, -26, 3, 14, '#141210'); R(6, -30, 7, 5, '#141210'); R(7, -27, 4, 2, '#f6f0e4'); px(10, -29, '#ffd040');
      R(13, -29, 4, 2, '#2a2420'); if (a.atk) { R(13, -27, 4, 1, '#a8302a'); R(13, -26, 4, 1, '#2a2420'); }
      const sw = Math.sin(p.walk) * 2; R(-4 + sw, -5, 2, 5, '#2a2420'); R(1 - sw, -5, 2, 5, '#2a2420');
      break; }
    case 'raccoon': {
      const sw = Math.sin(p.walk) * 2; S.s = .9 * SPR;
      for (let k = 0; k < 5; k++) R(-10 - k * 2, -16 + k, 3, 4, k % 2 ? '#2a2420' : '#8a7a6a');
      R(-4 + sw, -10, 3, 10, '#c8862a'); R(1 - sw, -10, 3, 10, '#e0a040'); R(-6, -24, 11, 14, '#d8962a'); R(-9, -24, 4, 10, '#5a5a66');
      if (p.state === 'fly') { R(-9, -14, 3, 6, '#9fdcff'); R(-8, -8, 2, 6 + Math.floor(time * 30) % 3, '#e8f8ff'); }
      R(-4, -34, 10, 10, '#a8a098'); R(-4, -31, 10, 3, '#141210'); px(0, -30, '#f6e8b0'); px(4, -30, '#f6e8b0'); R(4, -27, 4, 3, '#efe8de'); px(7, -27, '#141210');
      R(-4, -36, 3, 3, '#5a5450'); R(3, -36, 3, 3, '#7a726c');
      if (a.atk) { R(4, -21, 8, 3, '#d8962a'); R(12, -22, 6, 3, '#3a3a44'); px(18, -21, '#8affc8'); } else R(4, -22, 3, 8, '#d8962a');
      break; }
  }
  g.globalAlpha = 1;
}

// ---- Villen-Hüüs's troops
function drawEnemy(e) {
  const x = e.x - camX, y = sy(e.z, e.y); if (x < -60 || x > VW + 60) return;
  const big = e.type === 'brute' ? 1.45 : e.type === 'boss' ? 1.6 : 1;
  shadow(e.x, e.z, e.y, 10 * big * SPR);
  if (e.dead && Math.floor(time * 16) % 2) return;
  S = { ox: Math.round(x), oy: Math.round(y), s: big * SPR, f: e.face };
  const W = e.flash > 0 ? '#ffffff' : null, ice = e.frozen > 0;
  const body = W || (ice ? '#9fc8e8' : e.type === 'boss' ? '#141018' : '#2a2230'), armour = W || (ice ? '#b8d8f0' : e.type === 'boss' ? '#241c28' : e.type === 'brute' ? '#4a3a40' : '#3a3044');
  const visor = e.type === 'gunner' ? '#7aff8a' : e.type === 'boss' ? '#ffd23f' : '#ff6a3a';
  const sw = Math.sin(e.walk) * 2;
  if (e.dead) { R(-14, -6, 26, 6, body); R(10, -8, 7, 7, body); R(13, -6, 3, 2, visor); return; }
  if (e.type === 'boss') { // Lord Villen-Hüüs: tall, crowned, a red cape
    const cw = Math.sin(time * 3) * 2; R(-10 - cw, -34, 8, 32, W || '#8a1a1e'); R(-12 - cw, -6, 8, 4, W || '#6a1014');
    R(-4 - sw, -14, 3, 14, body); R(1 + sw, -14, 3, 14, body); R(-6, -32, 12, 19, armour); R(-6, -18, 12, 2, W || '#c8963a'); R(-1, -30, 2, 12, W || '#c8963a');
    R(-7, -32, 4, 4, W || '#c8963a'); R(4, -32, 4, 4, W || '#c8963a');
    R(-4, -42, 9, 10, body); R(-1, -39, 6, 2, visor); R(-5, -45, 2, 4, W || '#c8963a'); R(-1, -47, 2, 5, W || '#c8963a'); R(3, -45, 2, 4, W || '#c8963a');
    if (e.state === 'wind' || e.state === 'strike') { R(4, -30, 12, 3, armour); R(14, -40, 2, 24, W || '#d8d0c0'); } else { R(5, -30, 3, 12, armour); R(6, -34, 2, 30, W || '#d8d0c0'); }
  } else {
    R(-4 - sw, -13, 3, 13, body); R(1 + sw, -13, 3, 13, body); R(-5, -2, 4, 2, '#14100c'); R(1, -2, 4, 2, '#14100c');
    R(-6, -30, 12, 17, armour); R(-6, -20, 12, 2, W || '#1a141e');
    if (e.type === 'brute') { R(-8, -32, 6, 5, W || '#5a4a50'); R(3, -32, 6, 5, W || '#5a4a50'); }
    if (e.type === 'gunner') R(-9, -28, 4, 10, W || '#2a3a2a');
    R(-5, -40, 10, 10, body); R(-1, -37, 6, 2, visor);
    if (e.state === 'wind') { if (e.type === 'gunner') { R(4, -28, 16, 2, W || '#151015'); px(20, -28, '#ff8a6a'); } else if (e.type === 'brute') R(-2, -44, 4, 16, W || '#5a4030'); else R(-4, -30, 6, 3, body); }
    else if (e.state === 'strike' && e.type !== 'gunner') { R(4, -28, 12, 3, body); if (e.type === 'brute') R(14, -32, 8, 10, W || '#5a4030'); else R(15, -30, 6, 2, '#151015'); }
    else { R(4, -28, 8, 3, body); R(11, -30, e.type === 'gunner' ? 12 : 6, 2, '#151015'); }
  }
  if (e.state === 'wind' && !e.frozen) { g.fillStyle = Math.floor(time * 12) % 2 ? '#ffd23f' : '#ff5a3a'; const hy = Math.round(y - 62 * big * SPR / 1.3); g.fillRect(Math.round(x) - 1, hy, 3, 7); g.fillRect(Math.round(x) - 1, hy + 9, 3, 2); }
  if (e.burn > 0) for (let k = 0; k < 4; k++) { g.fillStyle = '#ffb040'; g.fillRect(Math.round(x - 6 + k * 4), Math.round(y - 44 - (time * 40 + k * 7) % 14), 2, 3); }
  if (ice) { g.fillStyle = 'rgba(200,235,255,.25)'; g.fillRect(Math.round(x - 12 * big), Math.round(y - 58 * big), 24 * big, 58 * big); }
  if (e.type !== 'boss' && e.hp < e.max && !e.dead) { g.fillStyle = '#1a0e14'; g.fillRect(Math.round(x - 10), Math.round(y - 60 * big), 20, 2); g.fillStyle = '#e04a3a'; g.fillRect(Math.round(x - 10), Math.round(y - 60 * big), Math.round(20 * e.hp / e.max), 2); }
}
