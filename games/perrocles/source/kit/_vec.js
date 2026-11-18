// ═══ Perroclès vector sprite kit: parametric rigs drawn with canvas paths ═══
// Units: ground at y=0, up is negative; a grown human is ~78 units tall. One figure canvas is 440×440.
const FS = 440, FG = 376;
const lighten = (c, k) => mix(c, '#ffffff', k), darken = (c, k) => mix(c, '#000000', k);
// path builder that knows its bounding box (for per-shape light gradients)
function Path() { const cmd = [], bb = [1e9, 1e9, -1e9, -1e9], pt = (x, y) => { if (x < bb[0]) bb[0] = x; if (y < bb[1]) bb[1] = y; if (x > bb[2]) bb[2] = x; if (y > bb[3]) bb[3] = y; };
  const p = { cmd, bb,
    M(x, y) { cmd.push(['M', x, y]); pt(x, y); return p; }, L(x, y) { cmd.push(['L', x, y]); pt(x, y); return p; },
    Q(a, b, x, y) { cmd.push(['Q', a, b, x, y]); pt(a, b); pt(x, y); return p; }, C(a, b, c, d, x, y) { cmd.push(['C', a, b, c, d, x, y]); pt(a, b); pt(c, d); pt(x, y); return p; },
    Z() { cmd.push(['Z']); return p; },
    E(cx, cy, rx, ry, rot = 0) { cmd.push(['E', cx, cy, rx, ry, rot]); pt(cx - rx, cy - ry); pt(cx + rx, cy + ry); return p; },
    poly(pts) { pts.forEach((q, i) => i ? p.L(q[0], q[1]) : p.M(q[0], q[1])); return p.Z(); },
    // smooth closed blob through points
    blob(pts) { const n = pts.length; const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; let m = mid(pts[n - 1], pts[0]); p.M(m[0], m[1]); for (let i = 0; i < n; i++) { const q = pts[i], m2 = mid(q, pts[(i + 1) % n]); p.Q(q[0], q[1], m2[0], m2[1]); } return p.Z(); },
    // limb: a tapered capsule from (x1,y1) r1 to (x2,y2) r2
    limb(x1, y1, x2, y2, r1, r2) { const a = Math.atan2(y2 - y1, x2 - x1), nx = Math.cos(a + Math.PI / 2), ny = Math.sin(a + Math.PI / 2);
      p.M(x1 + nx * r1, y1 + ny * r1).L(x2 + nx * r2, y2 + ny * r2); const k = 1.33; p.C(x2 + nx * r2 + Math.cos(a) * r2 * k, y2 + ny * r2 + Math.sin(a) * r2 * k, x2 - nx * r2 + Math.cos(a) * r2 * k, y2 - ny * r2 + Math.sin(a) * r2 * k, x2 - nx * r2, y2 - ny * r2);
      p.L(x1 - nx * r1, y1 - ny * r1); p.C(x1 - nx * r1 - Math.cos(a) * r1 * k, y1 - ny * r1 - Math.sin(a) * r1 * k, x1 + nx * r1 - Math.cos(a) * r1 * k, y1 + ny * r1 - Math.sin(a) * r1 * k, x1 + nx * r1, y1 + ny * r1); return p.Z(); },
    trace(x) { x.beginPath(); for (const c of cmd) { if (c[0] === 'M') x.moveTo(c[1], c[2]); else if (c[0] === 'L') x.lineTo(c[1], c[2]); else if (c[0] === 'Q') x.quadraticCurveTo(c[1], c[2], c[3], c[4]); else if (c[0] === 'C') x.bezierCurveTo(c[1], c[2], c[3], c[4], c[5], c[6]); else if (c[0] === 'Z') x.closePath(); else if (c[0] === 'E') { x.moveTo(c[1] + c[3] * Math.cos(c[5]), c[2] + c[3] * Math.sin(c[5])); x.ellipse(c[1], c[2], c[3], c[4], c[5], 0, Math.PI * 2); } } } };
  return p; }
// the pen: one drawing call per shape, rendered per mode
// mode: 'paint' (A), 'story' (B), 'vase' (C). vaseFig/vaseLine are the vase colours; skinKeys turn white on black-figure women
function Pen(x, mode, C, opt = {}) { const ink = mode === 'story' ? '#2a1a14' : '#1d130e', lw = mode === 'story' ? 1.25 : 0.75;
  const pen = { x, mode, C, lw,
    fill(p, col, o = {}) { if (col == null) return; p.trace(x); if (mode === 'vase') { x.fillStyle = (opt.white && o.skin) ? '#f2ead8' : (o.glow ? opt.vaseLine : opt.vaseFig); x.fill(); if (!o.noline && !o.glow && (!opt.thinSkip || Math.min(p.bb[2] - p.bb[0], p.bb[3] - p.bb[1]) > opt.thinSkip)) { x.lineWidth = opt.vlw || 0.42; x.lineJoin = 'round'; x.strokeStyle = opt.vaseLine; x.stroke(); } return; }
      if (mode === 'px') { if (o.glow && o.alpha) return; x.fillStyle = col; if (o.alpha) x.globalAlpha = o.alpha; x.fill(); x.globalAlpha = 1; return; }
      if (o.flat || o.glow) x.fillStyle = col; else { const [a, b, c, d] = p.bb, g = x.createLinearGradient(a, b, a + (c - a) * 0.55, d); const k = mode === 'story' ? 0.1 : 0.2; g.addColorStop(0, lighten(col, k)); g.addColorStop(0.55, col); g.addColorStop(1, darken(col, k * 1.2)); x.fillStyle = g; }
      if (o.alpha) x.globalAlpha = o.alpha; x.fill(); x.globalAlpha = 1;
      if (!o.noline && !o.glow) { x.lineWidth = o.lw || lw; x.lineJoin = 'round'; x.strokeStyle = o.inkCol || ink; x.stroke(); } },
    line(p, col, w = 0.5) { p.trace(x); x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = mode === 'vase' ? Math.max(opt.vlw || 0.55, w) : mode === 'px' ? Math.max(opt.pxMin || 1.1, w * (opt.pxK || 2.2)) : w; x.strokeStyle = mode === 'vase' ? opt.vaseLine : col; x.stroke(); },
    glow(cx, cy, r, col, a = 0.35) { if (mode === 'vase' || mode === 'px') return; const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.globalAlpha = a; x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill(); x.globalAlpha = 1; },
    eye(cx, cy, r, iris, human) { if (human && mode === 'px') { if (opt.grid) { const m = x.getTransform(), px = m.a * cx + m.c * cy + m.e, py = m.b * cx + m.d * cy + m.f, g = opt.grid; x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = iris || '#3a2418'; x.fillRect(Math.floor(px / g) * g, Math.floor((py - g * 0.6) / g) * g, g, g * 2); x.restore(); return; } x.fillStyle = iris || '#3a2418'; x.beginPath(); x.ellipse(cx, cy, human * 0.095, human * 0.15, 0, 0, 7); x.fill(); return; } // opt.grid: snap the eye to the downsample grid so it never vanishes
      if (human && mode === 'vase') { pen.fill(Path().M(cx - human * 0.2, cy).Q(cx, cy - human * 0.17, cx + human * 0.2, cy).Q(cx, cy + human * 0.12, cx - human * 0.2, cy).Z(), '#fff', { glow: true }); return; }
      const P1 = Path().E(cx, cy, r * 1.1, r * 0.8); if (mode === 'vase') { pen.fill(P1, '#fff', { glow: true }); x.fillStyle = opt.vaseFig; x.beginPath(); x.arc(cx + r * 0.25, cy, r * 0.45, 0, 7); x.fill(); return; }
      if (mode === 'px') { r *= 1.25; P1.cmd.length = 0; P1.E(cx, cy, r * 1.1, r * 0.8); } pen.fill(P1, '#fbf6ec', { flat: true, lw: 0.4 }); x.fillStyle = iris || C.eye; x.beginPath(); x.arc(cx + r * 0.3, cy, r * 0.55, 0, 7); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(cx + r * 0.45, cy - r * 0.25, r * 0.18, 0, 7); x.fill(); } };
  return pen; }
const deg = Math.PI / 180;

// ── humanoid ── o: robe short|long, female, beard, bald, hair long|bun|curls, helmet, petasos, crown, veil, bullHead, horse, staff, spear, bow, sling, distaff, scepter, caduceus, shield, owl, eyes, nymph, peacock, winged, laurel
function rigHuman(pen, o, C, pr) { const x = pen.x, F = pen.fill, Ln = pen.line;
  const head = pr.head, leg = pr.leg, tor = pr.torso, bulk = o.bulk || 1; // proportions in units
  const hip = o.horse ? -30 : -leg, sh = hip - tor, hy = sh - head * 1.05; // hip line, shoulder line, head centre
  const skin = C.skin, sk2 = darken(C.skin, 0.12);
  // pose: o.drop lowers the hips, o.lean tips the upper body forward about the hips, o.feet = [back, front] foot x, o.lift = [back, front] foot lift
  const drop = o.drop || 0, lean = o.lean || 0, br = o.breath || 0, up = () => { x.save(); x.translate(0, hip + drop); x.rotate(lean); x.translate(0, -hip - br); };
  up();
  if (o.peltWorn) { const tw0 = 6.2 * bulk; F(Path().M(-1, sh - 1).Q(-tw0 - 6, sh + 2, -tw0 - 4.5, hip - 4).Q(-tw0 - 4, hip + 6, -tw0 - 1, hip + 11).L(-tw0 + 2.5, hip + 8).Q(-2, hip - 2, 0, sh + 4).Z(), '#b8883e'); Ln(Path().M(-tw0 - 2, hip + 9).Q(-tw0 - 5, hip + 14, -tw0 - 3.4, hip + 19), '#a87a38', 0.9); F(Path().E(-tw0 - 3.2, hip + 20, 1.3, 1.9), '#8a5a20', { lw: 0.3 }); }
  // behind everything: peacock fan, wings, veil, long hair
  if (o.peacock) for (let k = 0; k < 13; k++) { const a = (-160 + k * 11.5) * deg, r = 44; const P1 = Path().M(0, sh + 4).Q(Math.cos(a) * r * 0.5 - 4, sh + Math.sin(a) * r * 0.5, Math.cos(a) * r, sh + Math.sin(a) * r).Q(Math.cos(a + 0.12) * r * 0.6, sh + Math.sin(a + 0.12) * r * 0.6, 0, sh + 4); F(P1, C.feather, { lw: 0.4 }); if (pen.mode !== 'vase') { F(Path().E(Math.cos(a) * r * 0.88, sh + Math.sin(a) * r * 0.88, 2.6, 2, a), '#1a4a8a', { flat: true, lw: 0.3 }); F(Path().E(Math.cos(a) * r * 0.88, sh + Math.sin(a) * r * 0.88, 1.2, 1, a), '#e0b040', { glow: true }); } }
  if (o.wings) for (const s of [-1, 0.7]) { const P1 = Path().M(-2, sh + 3); for (let k = 0; k <= 5; k++) { const a = (-150 + k * 22) * deg; P1.Q(-6 + Math.cos(a) * 18 * s, sh - 6 + Math.sin(a) * 22, -4 + Math.cos(a + 0.2) * 26 * s, sh - 2 + Math.sin(a + 0.2) * 30); } P1.Q(-6, sh + 10, -2, sh + 3); F(P1, C.feather); }
  if (o.nymph && pen.mode !== 'vase') pen.glow(0, hy + 10, 40, pen.C.glow || '#c8ffb0', 0.25);
  // centaur body
  if (o.horse) { const by = -30, hc = C.fur, h2 = C.fur2; x.save(); x.translate(-16, 0); // the rider rises from the chest, over the front legs
    for (const [lx, back] of [[-20, 1], [14, 1]]) { F(Path().limb(lx, by + 4, lx - 2, -12, 3.6, 2.4), darken(h2, 0.15)); F(Path().limb(lx - 2, -12, lx - 1, -1.5, 2.4, 2), darken(h2, 0.15)); F(Path().E(lx - 1, -1, 2.8, 1.6), '#2a1d14'); }
    F(Path().M(-25, by - 2).C(-34, by - 6, -38, by + 8, -33, by + 18).C(-31, by + 12, -28, by + 4, -25, by + 2).Z(), C.hair); // tail
    F(Path().blob([[-27, by - 5], [-6, by - 9], [16, by - 8], [22, by + 1], [16, by + 10], [-8, by + 11], [-26, by + 8]]), hc);
    if (pen.mode !== 'vase') Ln(Path().M(-20, by + 7).Q(-4, by + 10, 12, by + 7), darken(hc, 0.25), 0.5);
    for (const [lx] of [[-16], [18]]) { F(Path().limb(lx, by + 4, lx + 1, -12, 3.8, 2.5), h2); F(Path().limb(lx + 1, -12, lx + 2, -1.5, 2.5, 2.1), h2); F(Path().E(lx + 2, -1, 3, 1.7), '#2a1d14'); } x.restore(); }
  // back arm
  const armL = tor * 0.92, swing = o.horse ? 6 : 4;
  if (o.arm2 !== undefined) { const S2 = [-1, sh + 2.5], L2 = armL * 0.52, b2 = o.arm2 + (o.fore2 || 0), E2 = [S2[0] + Math.sin(o.arm2) * L2, S2[1] + Math.cos(o.arm2) * L2], H2 = [E2[0] + Math.sin(b2) * L2, E2[1] + Math.cos(b2) * L2];
    if (o.hold2) { x.save(); x.translate(H2[0], H2[1]); x.rotate(o.upright2 ? (o.wrist2 || 0) : Math.PI - b2 + (o.wrist2 || 0)); o.hold2(pen); x.restore(); }
    F(Path().limb(S2[0], S2[1], E2[0], E2[1], 2.4 * bulk, 2 * bulk), sk2); F(Path().limb(E2[0], E2[1], H2[0], H2[1], 2, 1.8), sk2); F(Path().E(H2[0], H2[1], 1.8, 1.6), sk2, { lw: 0.4 }); }
  else { F(Path().limb(-1, sh + 2.5, -3 - swing * 0.4, sh + armL * 0.55, 2.4 * bulk, 2 * bulk), sk2); F(Path().limb(-3 - swing * 0.4, sh + armL * 0.55, -1, sh + armL, 2, 1.8), sk2); }
  x.restore();
  // legs: two-bone IK from the hips to planted feet, knees forward
  if (!o.horse) { const ft = 0, lw2 = 2.9 * bulk;
    if (o.goatLegs) { const feet = o.feet || [-4, 3.6], lift = o.lift || [0, 0], fur2 = o.legFur || '#6a4a2a';
      [[-2.5, darken(fur2, 0.14), 0], [2.6, fur2, 1]].forEach(([lx, c, fi]) => { const Hx = lx, Hy = hip + drop, Tx = feet[fi], Ty = -2 - lift[fi], Kx0 = Tx - 2.6, Ky0 = Ty - 6.5, l1 = leg * 0.46, l2 = leg * 0.33; let dx = Kx0 - Hx, dy = Ky0 - Hy, dd = Math.hypot(dx, dy); const mx = l1 + l2 - 0.05; if (dd > mx) { dx *= mx / dd; dy *= mx / dd; dd = mx; }
        const base = Math.atan2(dy, dx), aa = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd)))), Kx = Hx + Math.cos(base - aa) * l1, Ky = Hy + Math.sin(base - aa) * l1, Ax = Hx + dx, Ay = Hy + dy;
        const P1 = Path().M(Hx - 3.6, Hy - 1); for (let j = 0; j <= 6; j++) { const k2 = j / 6, px = Hx + (Kx - Hx) * k2, py = Hy + (Ky - Hy) * k2; P1.L(px - 3.6 + k2 * 1.2 + (j % 2 ? -1.1 : 0), py + (j % 2 ? 0.8 : 0)); } P1.L(Kx + 2.2, Ky).L(Hx + 3.4, Hy).Z(); F(P1, c);
        F(Path().limb(Kx, Ky, Ax, Ay, 2.1, 1.3), c); F(Path().limb(Ax, Ay, Tx, Ty, 1.3, 1.1), c); F(Path().M(Tx - 1.6, Ty + 2).L(Tx - 1.4, Ty - 0.4).L(Tx + 2.4, Ty - 0.2).L(Tx + 2.8, Ty + 2).Z(), '#2a1d14'); }); }
    else if (o.robe !== 'long') { const feet = o.feet || [-4, 3.6], lift = o.lift || [0, 0], l1 = leg * 0.5, l2 = leg * 0.5 - 2;
      [[-2.5, sk2, 0], [2.6, skin, 1]].forEach(([lx, c, fi]) => { const Hx = lx, Hy = hip + drop, Tx = feet[fi], Ty = ft - 2 - lift[fi]; let dx = Tx - Hx, dy = Ty - Hy, dd = Math.hypot(dx, dy); const mx = l1 + l2 - 0.05; if (dd > mx) { dx *= mx / dd; dy *= mx / dd; dd = mx; }
        const base = Math.atan2(dy, dx), aa = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd)))), Kx = Hx + Math.cos(base - aa) * l1, Ky = Hy + Math.sin(base - aa) * l1, Ax = Hx + dx, Ay = Hy + dy;
        F(Path().limb(Hx, Hy, Kx, Ky, lw2, lw2 * 0.8), c); F(Path().limb(Kx, Ky, Ax, Ay, lw2 * 0.8, lw2 * 0.6), c);
        if (o.greaves) F(Path().limb(Kx + (Ax - Kx) * 0.12, Ky + (Ay - Ky) * 0.12, Ax, Ay - 0.6, lw2 * 0.95, lw2 * 0.75), C.metal || '#d8c9a0', { lw: 0.4 });
        const sx = Ax, fy = Ay + 2; F(Path().M(sx - 2.5, fy).L(sx - 2.2, fy - 2.6).Q(sx + 1, fy - 3.2, sx + 4.4, fy - 1).L(sx + 4.6, fy).Z(), C.wood); if (pen.mode !== 'vase' && !o.greaves) for (let k = 1; k < 4; k++) Ln(Path().M(sx - 1.6 + (Kx - Ax) * k * 0.09, fy - 2 - k * 2.2).L(sx + 1.6 + (Kx - Ax) * k * 0.09, fy - 3 - k * 2.2), darken(C.wood, 0.2), 0.45); }); }
    else { F(Path().E(-2, -1, 3.4, 1.4), C.wood); F(Path().E(3, -1, 3.6, 1.5), C.wood); } }
  up();
  // body garment
  const tw = 6.2 * bulk, cl = C.cloth, c2 = C.cloth2;
  if (o.robe === 'long' && !o.horse && drop > 1.5) { // crouching, kneeling, sitting: the bodice follows the torso, the skirt drapes from the waist over the knees to the ground
    F(Path().M(-tw * 0.8, sh + 1).L(-tw * 0.98, hip + 2.5).L(tw * 0.98, hip + 2.5).L(tw * 0.8, sh + 1).Z(), cl);
    { // the skirt drapes over real knees: solve them like bare legs, then run the cloth waist → knee → shin → hem → heels
    x.save(); x.translate(0, hip + br); x.rotate(-lean); x.translate(0, -hip - drop);
    const feet = o.feet || [-4, 3.6], fx = Math.max(feet[0], feet[1]), bx = Math.min(feet[0], feet[1]), Hy = hip + drop, l1 = leg * 0.5, l2 = leg * 0.5 - 2;
    const knee = (Hx, Tx) => { let dx = Tx - Hx, dy = -2 - Hy, dd = Math.hypot(dx, dy); const mx = l1 + l2 - 0.05; if (dd > mx) { dx *= mx / dd; dy *= mx / dd; dd = mx; } const base = Math.atan2(dy, dx), aa = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd)))); return [Hx + Math.cos(base - aa) * l1, Hy + Math.sin(base - aa) * l1]; };
    const [Kx, Ky] = knee(2.6, fx), [K2x, K2y] = knee(-2.5, bx), kx = Math.max(Kx, K2x) + 2.4, ky = Math.min(Ky, K2y), wy = Hy + 1, hemF = Math.max(fx + 4.2, kx - 1), hemB = bx - 4.4;
    F(Path().M(-tw * 0.98, wy).Q(hemB - 1.2, wy * 0.45, hemB, -1.5).L(hemF, -1.5).Q(kx + 0.8, (ky - 1.5) * 0.45, kx, ky).Q(kx - 1, ky - (wy - ky) * 0.15 - 1.2, tw * 0.98, wy).Z(), cl);
    for (let k = 0; k < 3; k++) Ln(Path().M(kx - 1.5 - k * 2, ky + 1).Q(kx - 2 - k * 3, (ky - 1.5) * 0.5, hemF - 3 - k * 3.4, -2), darken(cl, 0.22), 0.45);
    Ln(Path().M(-tw * 0.6, wy + 1).Q(hemB + 2, wy * 0.5, hemB + 1.5, -2), darken(cl, 0.2), 0.45);
    F(Path().M(hemB, -1.5).L(hemF, -1.5).L(hemF - 0.3, -3.6).L(hemB + 0.3, -3.6).Z(), C.trim, { lw: 0.4 }); x.restore(); }
    if (o.female) F(Path().M(-tw * 0.85, sh + 2).Q(tw * 0.3, sh + 8, tw * 0.9, hip + 3).L(tw * 0.95, hip + 6).Q(0, sh + 12, -tw * 0.9, sh + 5).Z(), c2, { lw: 0.4 }); }
  else if (o.robe === 'long' && !o.horse) { const P1 = Path().M(-tw * 0.8, sh + 1).Q(-tw - 1, hip, -tw * 1.5, -1.5).Q(0, 0.5, tw * 1.5, -1.5).Q(tw + 1, hip, tw * 0.8, sh + 1).Z(); F(P1, cl);
    for (let k = -2; k <= 2; k++) Ln(Path().M(k * 1.8, hip + 2).Q(k * 2.4, hip + leg * 0.5, k * 3.4, -2), darken(cl, 0.22), 0.45);
    F(Path().M(-tw * 1.5, -1.5).Q(0, 0.5, tw * 1.5, -1.5).L(tw * 1.46, -4).Q(0, -2.2, -tw * 1.46, -4).Z(), C.trim, { lw: 0.4 });
    if (o.female) F(Path().M(-tw * 0.85, sh + 2).Q(tw * 0.3, sh + 8, tw * 0.9, hip + 3).L(tw * 0.95, hip + 6).Q(0, sh + 12, -tw * 0.9, sh + 5).Z(), c2, { lw: 0.4 }); }
  else { const by = o.horse ? -36 : hip; const P1 = Path().M(-tw * 0.8, sh + 1).L(-tw * 0.95, by - 1).Q(-tw * 1.25, by + 4.5, -tw * 1.1, by + 6.5).L(tw * 1.1, by + 6.5).Q(tw * 1.25, by + 4.5, tw * 0.95, by - 1).L(tw * 0.8, sh + 1).Z(); F(P1, cl);
    for (let k = -1; k <= 1; k++) Ln(Path().M(k * 2.6, by).L(k * 3.2, by + 6), darken(cl, 0.25), 0.45);
    F(Path().M(-tw * 1.1, by + 5).L(tw * 1.1, by + 5).L(tw * 1.1, by + 6.5).L(-tw * 1.1, by + 6.5).Z(), C.trim, { lw: 0.35 });
    F(Path().M(-tw * 0.95, by - 2.5).L(tw * 0.95, by - 2.5).L(tw * 0.95, by - 0.6).L(-tw * 0.95, by - 0.6).Z(), c2, { lw: 0.35 }); // belt
    F(Path().M(-tw * 0.8, sh + 1).Q(-1, sh + 5, tw * 0.75, sh + 1).L(tw * 0.5, sh - 0.5).Q(-1, sh + 3, -tw * 0.5, sh - 0.5).Z(), c2, { lw: 0.35 }); }
  if (o.cloak) { const cc = o.cloak, cd = darken(cc, 0.2); F(Path().M(-tw * 1.0, sh).Q(-tw * 0.1, sh - 1.6, tw * 0.9, sh + 0.6).Q(tw * 0.3, sh + 6, tw * 1.05, hip + 5).L(tw * 1.12, hip + 9).Q(-tw * 0.2, hip + 10, -tw * 1.2, hip + 8).Q(-tw * 1.4, hip - 4, -tw * 1.0, sh).Z(), cc, { lw: 0.45 });
    if (pen.mode !== 'vase') for (let k = 0; k < 3; k++) Ln(Path().M(-tw * 0.6 + k * tw * 0.5, sh + 3 + k).Q(-tw * 0.4 + k * tw * 0.55, hip, -tw * 0.7 + k * tw * 0.6, hip + 8.5), cd, 0.5); }
  if (o.aegis) { const ac = '#c8b060'; F(Path().M(-tw * 1.15, sh - 0.4).Q(0, sh - 2.4, tw * 1.2, sh - 0.2).Q(tw * 1.4, sh + 5, tw * 0.6, sh + 9.5).Q(0, sh + 11, -tw * 0.7, sh + 9.5).Q(-tw * 1.4, sh + 5, -tw * 1.15, sh - 0.4).Z(), ac, { lw: 0.45 });
    for (let j = 0; j < 7; j++) { const px = -tw * 0.7 + j * tw * 0.23, py = sh + 9.6 + Math.sin(j * 1.7) * 0.6; Ln(Path().M(px, py).Q(px + 0.8, py + 1.6, px - 0.2, py + 2.6), '#3a6a3a', 0.6); }
    if (pen.mode !== 'vase') for (let r2 = 0; r2 < 3; r2++) for (let j = 0; j < 5; j++) F(Path().E(-tw * 0.6 + j * tw * 0.3 + (r2 % 2) * tw * 0.15, sh + 1.6 + r2 * 2.4, 0.8, 0.6), darken(ac, 0.18), { flat: true, noline: true });
    F(Path().E(tw * 0.15, sh + 5, 2.1, 2.3), '#e8c8a0', { skin: true, lw: 0.35 }); }
  if (o.eyes) { const r = rng(7); for (let k = 0; k < 18; k++) pen.eye(-tw * 0.8 + r() * tw * 1.6, sh + 3 + r() * (hip - sh + 4), 0.9, '#2a5aa8'); }
  // neck + head (o.nod tips the head: negative looks up)
  x.save(); x.translate(0.7, sh + 0.5); x.rotate(o.nod || 0); x.translate(-0.7, -(sh + 0.5));
  F(Path().limb(0.6, sh + 1, 0.8, hy + head * 0.6, 1.9 * bulk, 1.7 * bulk), sk2, { lw: 0.5 });
  const hr = head * 0.62;
  if (o.veil) F(Path().M(-hr * 0.4, hy - hr * 1.05).Q(-hr * 2.2, hy - hr * 0.6, -hr * 2.1, sh + 10).Q(-hr * 1.2, sh + 12, -hr * 0.2, sh + 2).Z(), C.cloth2);
  if (!o.bullHead && !o.bald && (o.female || o.hair === 'long')) F(Path().M(-hr * 0.9, hy - hr * 0.5).Q(-hr * 1.9, hy + hr, -hr * 1.3, sh + 6).Q(-hr * 0.5, sh + 7, -hr * 0.1, hy + hr * 0.8).Z(), C.hair);
  if (o.bullHead) { const hb = hr * 1.05; F(Path().blob([[-hb, hy - hb * 0.8], [hb * 0.5, hy - hb], [hb * 1.6, hy - hb * 0.1], [hb * 1.9, hy + hb * 0.7], [hb * 0.6, hy + hb * 1.1], [-hb, hy + hb * 0.6]]), C.fur);
    F(Path().E(hb * 1.45, hy + hb * 0.55, hb * 0.65, hb * 0.5), lighten(C.fur, 0.25), { lw: 0.4 }); x.fillStyle = '#1d130e'; x.beginPath(); x.arc(hb * 1.7, hy + hb * 0.5, 0.6, 0, 7); x.fill();
    for (const s of [-1, 1]) F(Path().M(-hb * 0.2 + s * 1.2, hy - hb * 0.6).Q(-hb * 0.4 + s * hb * 1.2, hy - hb * 1.6, s * hb * 1.4 - 1, hy - hb * 2.1).Q(-hb * 0.1 + s * hb * 0.6, hy - hb * 1.2, hb * 0.4 + s * 1.2, hy - hb * 0.9).Z(), C.horn, { lw: 0.45 });
    F(Path().E(-hb * 0.7, hy - hb * 0.3, 1.6, 1), C.fur2); pen.eye(hb * 0.75, hy - hb * 0.2, 1.05); }
  else { // face in profile-ish three-quarter
    F(Path().M(-hr, hy).C(-hr, hy - hr * 1.3, hr * 1.1, hy - hr * 1.35, hr * 1.04, hy - hr * 0.12).Q(hr * 1.1, hy + hr * 0.12, hr * 1.22, hy + hr * 0.28).Q(hr * 1.14, hy + hr * 0.4, hr * 1.02, hy + hr * 0.44).Q(hr * 1.04, hy + hr * 0.86, hr * 0.62, hy + hr * 1.02).Q(-hr * 0.2, hy + hr * 1.16, -hr * 0.75, hy + hr * 0.6).Q(-hr * 1.05, hy + hr * 0.3, -hr, hy).Z(), skin, { skin: true });
    F(Path().E(-hr * 0.25, hy + hr * 0.15, hr * 0.22, hr * 0.3), sk2, { skin: true, lw: 0.4 }); // ear
    const ex = o.expr;
    if (ex && pen.mode === 'px') { const ink = o.iris || '#3a2418', lc = mix(skin, '#7a2a24', 0.55);
      if (ex.blink) { x.strokeStyle = ink; x.lineWidth = hr * 0.07; x.lineCap = 'round'; x.beginPath(); x.moveTo(hr * 0.46, hy + hr * 0.02); x.quadraticCurveTo(hr * 0.6, hy + hr * 0.1, hr * 0.74, hy + hr * 0.02); x.stroke(); }
      else { x.fillStyle = ink; x.beginPath(); x.ellipse(hr * 0.6 + (ex.look || 0) * hr * 0.05, hy + (ex.down || 0) * hr * 0.04, hr * 0.095, hr * 0.15 * (ex.wide ? 1.2 : 1), 0, 0, 7); x.fill(); if (ex.shine) { x.fillStyle = '#fff6e8'; x.beginPath(); x.arc(hr * 0.63, hy - hr * 0.06, hr * 0.035, 0, 7); x.fill(); } }
      const bw = ex.brow || 0; x.strokeStyle = darken(C.hair, 0.15); x.lineWidth = hr * 0.08; x.lineCap = 'round'; x.beginPath(); x.moveTo(hr * 0.42, hy - hr * 0.3 + bw * hr * 0.06); x.lineTo(hr * 0.8, hy - hr * 0.33 - bw * hr * 0.07); x.stroke();
      const mo = ex.mouth || 0, sm = ex.smile || 0, mx0 = hr * 0.66, my0 = hy + hr * 0.6; if (mo > 0.15) { x.fillStyle = '#5a1e1a'; x.beginPath(); x.ellipse(mx0 + hr * 0.14, my0 + hr * 0.02, hr * (0.13 + sm * 0.03), hr * 0.06 + mo * hr * 0.12, 0, 0, 7); x.fill(); }
      else { x.strokeStyle = lc; x.lineWidth = hr * 0.08; x.lineCap = 'round'; x.beginPath(); x.moveTo(mx0, my0 - sm * hr * 0.06); x.quadraticCurveTo(mx0 + hr * 0.16, my0 + sm * hr * 0.1, mx0 + hr * 0.33, my0 - sm * hr * 0.08); x.stroke(); }
      if (ex.blush) F(Path().E(hr * 0.72, hy + hr * 0.36, hr * 0.17, hr * 0.09), '#e88a80', { glow: true, alpha: 0.45 }); }
    else if (o.cyclops) { // one great eye mid-forehead, under a single heavy brow
      if (o.blind) { F(Path().E(hr * 0.58, hy - hr * 0.1, hr * 0.34, hr * 0.13), '#8a2a1a'); Ln(Path().M(hr * 0.26, hy - hr * 0.1).L(hr * 0.9, hy - hr * 0.08), '#3a1410', 0.6); }
      else { F(Path().E(hr * 0.6, hy - hr * 0.1, hr * 0.36, hr * 0.3), '#f6f0e2', { lw: 0.35 }); pen.eye(hr * 0.74, hy - hr * 0.1, hr * 0.2 + 0.3, '#3a2410', hr); }
      F(Path().M(hr * 0.16, hy - hr * 0.48).Q(hr * 0.6, hy - hr * 0.7, hr * 1.04, hy - hr * 0.5).L(hr * 1.0, hy - hr * 0.4).Q(hr * 0.6, hy - hr * 0.56, hr * 0.2, hy - hr * 0.38).Z(), C.hair || '#3a2a1a'); }
    else { pen.eye(hr * 0.6, hy + hr * 0.0, hr * 0.2 + 0.25, o.iris, hr);
    if (pen.mode === 'px') { x.strokeStyle = mix(skin, '#8a3a30', 0.32); x.lineWidth = hr * 0.08; x.lineCap = 'butt'; x.beginPath(); x.moveTo(hr * 0.62, hy + hr * 0.6); x.quadraticCurveTo(hr * 0.8, hy + hr * 0.64, hr * 0.98, hy + hr * 0.56); x.stroke(); } }
    if (o.pointyEars) F(Path().poly([[-hr * 0.4, hy - hr * 0.05], [-hr * 0.85, hy - hr * 0.75], [-hr * 0.05, hy + hr * 0.05]]), sk2, { skin: true, lw: 0.35 });
    else if (pen.mode !== 'vase' && !o.cyclops) { Ln(Path().M(hr * 0.3, hy - hr * 0.42).L(hr * 0.85, hy - hr * 0.38), darken(C.hair, 0.1), 0.6); }
    if (o.female && pen.mode !== 'vase') F(Path().E(hr * 0.75, hy + hr * 0.35, hr * 0.2, hr * 0.12), '#e88a80', { glow: true, alpha: 0.5 });
    // hair
    if (o.bald) F(Path().M(-hr * 1.02, hy + hr * 0.1).Q(-hr * 1.1, hy - hr * 0.5, -hr * 0.5, hy - hr * 0.55).Q(-hr * 0.7, hy - hr * 0.1, -hr * 0.55, hy + hr * 0.45).Z(), C.horn, { lw: 0.4 });
    else if (!o.helmet) { const hc = C.hair; const P1 = Path().M(-hr * 1.08, hy + hr * 0.35); const bumps = o.hair === 'curls' || (!o.female && o.hair !== 'long') ? 6 : 0;
      if (bumps) { for (let k = 0; k <= bumps; k++) { const a = (192 + k * (146 / bumps)) * deg; P1.Q(Math.cos(a - 0.2) * hr * 1.5, hy - hr * 0.1 + Math.sin(a - 0.2) * hr * 1.5, Math.cos(a) * hr * 1.1, hy - hr * 0.1 + Math.sin(a) * hr * 1.1); }
        P1.Q(hr * 1.12, hy - hr * 0.42, hr * 0.78, hy - hr * 0.5).Q(hr * 0.62, hy - hr * 0.3, hr * 0.42, hy - hr * 0.52).Q(hr * 0.12, hy - hr * 0.5, hr * 0.02, hy - hr * 0.12).Q(-hr * 0.3, hy - hr * 0.02, -hr * 0.42, hy + hr * 0.42).Q(-hr * 0.7, hy + hr * 0.75, -hr * 1.0, hy + hr * 0.62).Z(); }
      else { P1.C(-hr * 1.3, hy - hr * 1.6, hr * 1.3, hy - hr * 1.5, hr * 1.12, hy - hr * 0.35).Q(hr * 0.5, hy - hr * 0.75, -hr * 0.1, hy - hr * 0.5).Q(-hr * 0.4, hy, -hr * 0.5, hy + hr * 0.5).Z(); }
      F(P1, hc); if (bumps && pen.mode === 'px') { x.strokeStyle = lighten(hc, 0.22); x.lineWidth = hr * 0.12; x.lineCap = 'round'; for (const [ax, ay, r0] of [[-0.35, -0.75, 0.3], [0.3, -0.92, 0.28], [-0.72, -0.2, 0.26], [0.72, -0.72, 0.22]]) { x.beginPath(); x.arc(ax * hr, hy + ay * hr, r0 * hr, 3.6, 5.6); x.stroke(); } }
      if (o.hair === 'bun' || (o.female && !o.veil)) F(Path().E(-hr * 0.95, hy - hr * 0.75, hr * 0.42, hr * 0.38), hc); }
    if (o.beard) F(Path().M(-hr * 0.3, hy + hr * 0.25).Q(hr * 0.1, hy + hr * 0.6, hr * 0.5, hy + hr * 0.5).Q(hr * 1.05, hy + hr * 0.45, hr * 1.05, hy + hr * 0.8).Q(hr * 0.9, hy + hr * 1.9, hr * 0.15, hy + hr * 2).Q(-hr * 0.6, hy + hr * 1.4, -hr * 0.3, hy + hr * 0.25).Z(), o.beardCol || C.horn); }
  // headgear
  if (o.helmet) { F(Path().M(-hr * 1.15, hy + hr * 0.6).C(-hr * 1.3, hy - hr * 1.4, hr * 1.2, hy - hr * 1.5, hr * 1.2, hy - hr * 0.1).L(hr * 0.9, hy + hr * 0.2).L(hr * 0.35, hy + hr * 0.1).L(hr * 0.3, hy + hr * 0.95).L(-hr * 0.4, hy + hr * 1.05).Z(), C.metal);
    F(Path().M(-hr * 1.2, hy - hr * 1.0).Q(0, hy - hr * 2.6, hr * 1.1, hy - hr * 1.3).Q(0, hy - hr * 1.7, -hr * 1.2, hy - hr * 1.0).Z(), o.crest || C.red, { lw: 0.45 });
    F(Path().M(hr * 0.05, hy - hr * 0.35).L(hr * 1.15, hy - hr * 0.4).L(hr * 1.1, hy + hr * 0.12).L(hr * 0.15, hy + hr * 0.08).Z(), '#1d130e', { flat: true, noline: true }); pen.eye(hr * 0.62, hy - hr * 0.12, hr * 0.18 + 0.2, pen.mode === 'px' ? '#f0d8b0' : o.iris, hr); }
  if (o.petasos) { F(Path().E(0, hy - hr * 0.85, hr * 1.9, hr * 0.38), C.trim); F(Path().M(-hr * 0.9, hy - hr * 0.9).Q(-hr * 0.8, hy - hr * 1.9, 0, hy - hr * 1.9).Q(hr * 0.8, hy - hr * 1.9, hr * 0.9, hy - hr * 0.9).Z(), C.trim);
    for (const s of [-1, 1]) F(Path().M(s * hr * 0.6, hy - hr * 1.3).Q(s * hr * 1.6, hy - hr * 2.4, s * hr * 2.0, hy - hr * 2.0).Q(s * hr * 1.5, hy - hr * 1.6, s * hr * 0.8, hy - hr * 1.1).Z(), C.horn, { lw: 0.4 }); }
  if (o.crown) { const P1 = Path().M(-hr * 0.85, hy - hr * 0.75); for (let k = 0; k <= 4; k++) P1.L(-hr * 0.85 + k * hr * 0.42, hy - hr * (k % 2 ? 1.3 : 1.65)); P1.L(hr * 0.85, hy - hr * 0.75).Z(); F(P1, C.trim, { lw: 0.45 }); }
  if (o.horns) for (const [sd, dk] of [[-1, 0.15], [1, 0]]) F(Path().M(-hr * 0.15 + sd * hr * 0.25, hy - hr * 0.85).Q(-hr * 0.9 + sd * hr * 0.2, hy - hr * 2.1, -hr * 1.75 + sd * hr * 0.15, hy - hr * 1.2).Q(-hr * 1.4 + sd * hr * 0.1, hy - hr * 1.15, -hr * 0.85 + sd * hr * 0.2, hy - hr * 1.55).Q(-hr * 0.55 + sd * hr * 0.2, hy - hr * 1.1, hr * 0.2 + sd * hr * 0.25, hy - hr * 0.9).Z(), darken(C.horn, dk), { lw: 0.4 });
  if (o.pilos) { F(Path().M(-hr * 1.05, hy - hr * 0.55).Q(-hr * 0.7, hy - hr * 2.0, hr * 0.15, hy - hr * 2.1).Q(hr * 0.95, hy - hr * 1.6, hr * 1.05, hy - hr * 0.6).Q(0, hy - hr * 0.85, -hr * 1.05, hy - hr * 0.55).Z(), o.pilos === true ? '#8a6a44' : o.pilos, { lw: 0.4 }); if (pen.mode !== 'vase') Ln(Path().M(-hr * 0.95, hy - hr * 0.75).Q(0, hy - hr * 1.0, hr * 0.98, hy - hr * 0.8), darken(o.pilos === true ? '#8a6a44' : o.pilos, 0.25), 0.5); }
  if (o.helmUp) { const mc = C.metal; F(Path().M(-hr * 1.1, hy - hr * 0.55).C(-hr * 1.2, hy - hr * 2.0, hr * 1.1, hy - hr * 2.1, hr * 1.25, hy - hr * 0.95).L(hr * 1.9, hy - hr * 0.8).L(hr * 1.85, hy - hr * 0.45).L(hr * 0.9, hy - hr * 0.62).Q(0, hy - hr * 0.75, -hr * 1.1, hy - hr * 0.55).Z(), mc, { lw: 0.45 });
    F(Path().M(-hr * 1.35, hy - hr * 1.0).Q(-hr * 0.2, hy - hr * 3.3, hr * 1.0, hy - hr * 1.85).Q(-hr * 0.1, hy - hr * 2.25, -hr * 1.35, hy - hr * 1.0).Z(), o.crest || '#2a6a8a', { lw: 0.45 }); if (pen.mode !== 'vase') Ln(Path().M(-hr * 1.0, hy - hr * 0.7).Q(0, hy - hr * 0.95, hr * 1.2, hy - hr * 0.85), darken(mc, 0.3), 0.5); }
  if (o.laurel) for (let k = 0; k < 7; k++) { const a = (200 + k * 22) * deg; F(Path().E(Math.cos(a) * hr * 1.08, hy - hr * 0.1 + Math.sin(a) * hr * 1.08, 1.4, 0.7, a + 1.2), '#5a9a3a', { lw: 0.3 }); }
  if (o.nymph) for (let k = 0; k < 6; k++) { const a = (205 + k * 26) * deg; F(Path().E(Math.cos(a) * hr * 1.1, hy - hr * 0.1 + Math.sin(a) * hr * 1.1, 1.3, 1.3), k % 2 ? '#f0e080' : '#e890b0', { lw: 0.3 }); }
  x.restore();
  // front arm + held items
  const hx = 5.5, hand = [hx + 2.6, sh + armL * 0.92];
  const holdTop = sh - 18, held = o.staff || o.spear || o.scepter || o.caduceus || o.distaff;
  if (held) { const px = hand[0] + 1.2, top = o.spear ? sh - 26 : o.distaff ? hand[1] - 12 : sh - 16, bot = o.distaff ? hand[1] + 6 : -0.5;
    F(Path().M(px - 0.7, top).L(px + 0.7, top).L(px + 0.7, bot).L(px - 0.7, bot).Z(), o.scepter || o.caduceus ? C.trim : C.wood, { lw: 0.4 });
    if (o.spear) F(Path().M(px, top - 7).Q(px + 2.2, top - 3, px + 1, top).L(px - 1, top).Q(px - 2.2, top - 3, px, top - 7).Z(), C.metal, { lw: 0.4 });
    if (o.scepter) { F(Path().E(px, top - 1.6, 2, 2), C.trim, { lw: 0.4 }); F(Path().E(px, top - 1.6, 0.9, 0.9), '#2a6ab0', { glow: true }); }
    if (o.caduceus) { for (const s of [-1, 1]) Ln(Path().M(px, bot - 4).C(px + s * 3, bot - 8, px - s * 3, top + 10, px + s * 2, top + 3), C.scale, 0.8); F(Path().M(px, top + 1).Q(px - 5, top - 3, px - 6, top + 1).Q(px - 3, top + 0.5, px, top + 2).Z(), C.horn, { lw: 0.3 }); F(Path().M(px, top + 1).Q(px + 5, top - 3, px + 6, top + 1).Q(px + 3, top + 0.5, px, top + 2).Z(), C.horn, { lw: 0.3 }); }
    if (o.distaff) F(Path().E(px, top - 1, 2.2, 3), C.horn, { lw: 0.4 }); }
  if (o.owl) { const ox = o.staff ? hand[0] + 1.2 : -tw, oy = o.staff ? sh - 18 : sh - 1; F(Path().E(ox, oy - 2.6, 2.2, 3), C.feather, { lw: 0.4 }); pen.eye(ox + 0.8, oy - 3.6, 0.6, '#e0b040'); pen.eye(ox - 0.7, oy - 3.6, 0.6, '#e0b040'); F(Path().poly([[ox - 0.3, oy - 2.8], [ox + 0.4, oy - 2.8], [ox, oy - 2]]), '#e0b040', { glow: true }); }
  if (o.bow) { const bx = hand[0] + 3; Ln(Path().M(bx - 2, sh - 12).Q(bx + 6, sh + 6, bx - 2, sh + 24), C.wood, 1.2); Ln(Path().M(bx - 2, sh - 12).L(bx - 2, sh + 24), C.horn, 0.3); }
  if (o.sling) { Ln(Path().M(hand[0], hand[1]).Q(hand[0] + 1, hand[1] + 5, hand[0] + 2.5, hand[1] + 7), C.wood, 0.5); F(Path().E(hand[0] + 2.6, hand[1] + 7.5, 1.3, 0.9), '#8a6a4a', { lw: 0.3 }); }
  if (o.arm !== undefined) { // posed front arm: o.arm = upper-arm angle from straight down (+ = forward), o.fore = elbow bend, o.hold(pen, theta) draws what the hand holds
    const S0 = [2.5, sh + 2.5], L1 = armL * 0.52, b = o.arm + (o.fore || 0), E0 = [S0[0] + Math.sin(o.arm) * L1, S0[1] + Math.cos(o.arm) * L1], Hd = [E0[0] + Math.sin(b) * L1, E0[1] + Math.cos(b) * L1];
    const hrot = o.upright ? (o.wrist || 0) : Math.PI - b + (o.wrist || 0); if (o.hold) { x.save(); x.translate(Hd[0], Hd[1]); x.rotate(hrot); o.hold(pen); x.restore(); }
    F(Path().limb(S0[0], S0[1], E0[0], E0[1], 2.5 * bulk, 2.1 * bulk), skin, { skin: true }); F(Path().limb(E0[0], E0[1], Hd[0], Hd[1], 2.1 * bulk, 1.9 * bulk), skin, { skin: true });
    F(Path().E(Hd[0], Hd[1], 1.9, 1.7), skin, { skin: true, lw: 0.45 }); if (o.thread) { const tx = E0[0] + (Hd[0] - E0[0]) * 0.82, ty = E0[1] + (Hd[1] - E0[1]) * 0.82; x.fillStyle = '#c8402e'; x.beginPath(); x.ellipse(tx, ty, 1.5, 1.5, 0, 0, 7); x.fill(); } if (o.holdFront) { x.save(); x.translate(Hd[0], Hd[1]); x.rotate(hrot); o.holdFront(pen); x.restore(); } }
  else { F(Path().limb(2.5, sh + 2.5, hx, sh + armL * 0.55, 2.5 * bulk, 2.1 * bulk), skin, { skin: true }); F(Path().limb(hx, sh + armL * 0.55, hand[0], hand[1], 2.1 * bulk, 1.9 * bulk), skin, { skin: true });
  F(Path().E(hand[0] + 0.3, hand[1] + 0.6, 1.9, 1.7), skin, { skin: true, lw: 0.45 }); }
  // worn armour
  if (o.thorax) { F(Path().M(-tw * 0.85, sh + 1.5).L(tw * 0.85, sh + 1.5).L(tw * 0.95, hip - 1).L(-tw * 0.95, hip - 1).Z(), '#ece2c8', { lw: 0.45 }); for (let k = 0; k < 5; k++) F(Path().M(-tw * 0.95 + k * tw * 0.4, hip - 1).L(-tw * 0.95 + k * tw * 0.4 + tw * 0.36, hip - 1).L(-tw * 0.95 + k * tw * 0.4 + tw * 0.36, hip + 3).L(-tw * 0.95 + k * tw * 0.4, hip + 3).Z(), '#d8ccb0', { lw: 0.3 }); }
  if (o.peltWorn) { const pc = '#c89a50', pd = '#8a5a20', pl2 = '#e0b870';
    // mantle over both shoulders, paws knotted on the chest
    F(Path().M(-tw * 1.15, sh + 0.5).Q(-tw * 0.2, sh - 2.2, tw * 1.25, sh + 0.2).Q(tw * 1.5, sh + 4, tw * 1.05, sh + 7.5).Q(tw * 0.5, sh + 6, 1.2, sh + 9).Q(-tw * 0.5, sh + 6, -tw * 1.05, sh + 7.5).Q(-tw * 1.4, sh + 4, -tw * 1.15, sh + 0.5).Z(), pc, { lw: 0.45 });
    if (pen.mode !== 'vase') Ln(Path().M(-tw * 0.8, sh + 1.6).Q(0, sh - 0.4, tw * 0.95, sh + 1.4), pl2, 0.6);
    for (const sd of [-1, 1]) { F(Path().limb(1.2 + sd * 0.6, sh + 9, 1.2 + sd * 2.4, sh + 14.5, 1.5, 1.2), pc, { lw: 0.4 }); for (let j = -1; j <= 1; j++) Ln(Path().M(1.2 + sd * 2.4 + j * 0.7, sh + 15).L(1.2 + sd * 2.4 + j * 0.8, sh + 16.3), '#f4eee0', 0.4); }
    F(Path().E(1.2, sh + 9, 1.5, 1.2), pd, { lw: 0.35 });
    // lion-scalp hood, worn low on the brow, with a short mane down the nape
    const pts = []; for (let j = 0; j <= 7; j++) { const a2 = (150 + j * 22) * deg, r = (j % 2 ? 1.5 : 1.25) * hr; pts.push([-hr * 0.15 + Math.cos(a2) * r, hy + hr * 0.1 + Math.sin(a2) * r]); }
    F(Path().M(-hr * 0.9, sh + 1.5).L(pts[0][0], pts[0][1]).L(pts[1][0], pts[1][1]).L(pts[2][0], pts[2][1]).L(pts[3][0], pts[3][1]).L(pts[4][0], pts[4][1]).L(-hr * 0.1, hy - hr * 0.6).Q(-hr * 0.7, hy, -hr * 0.2, sh + 1).Z(), pd, { lw: 0.4 });
    F(Path().M(-hr * 1.0, hy + hr * 0.5).C(-hr * 1.3, hy - hr * 1.5, hr * 1.0, hy - hr * 1.55, hr * 1.5, hy - hr * 0.5).L(hr * 1.42, hy - hr * 0.25).Q(hr * 0.6, hy - hr * 0.62, hr * 0.05, hy - hr * 0.42).Q(-hr * 0.5, hy - hr * 0.1, -hr * 0.55, hy + hr * 0.75).Z(), pc, { lw: 0.45 });
    F(Path().E(-hr * 0.35, hy - hr * 1.2, hr * 0.3, hr * 0.3), pc, { lw: 0.35 }); F(Path().E(hr * 1.38, hy - hr * 0.5, hr * 0.2, hr * 0.16), '#1d130e', { flat: true, noline: true });
    if (pen.mode !== 'vase') { Ln(Path().M(hr * 0.5, hy - hr * 0.95).L(hr * 0.85, hy - hr * 0.86), '#1d130e', 0.5); F(Path().E(hr * 0.9, hy - hr * 0.42, hr * 0.45, hr * 0.12), pl2, { flat: true, noline: true }); }
    for (const fx2 of [0.72, 1.12]) F(Path().poly([[hr * fx2, hy - hr * 0.42], [hr * fx2 + hr * 0.2, hy - hr * 0.42], [hr * fx2 + hr * 0.1, hy - hr * 0.1]]), '#f4eee0', { glow: true }); }
  if (o.onHead) { x.save(); x.translate(0, hy - hr * 1.05); x.rotate(o.nod || 0); o.onHead(pen, hr); x.restore(); }
  x.restore();
  return { head: [0, hy - hr * 1.3], eye: [hr * 0.55, hy - hr * 0.08], hr, sh, hip, w: tw * 2 }; }
// ── quadrupeds ── o: kind lion|boar|wolf|bull|hind|cerberus
function rigQuad(pen, o, C, pr) { const x = pen.x, F = pen.fill, Ln = pen.line, k = o.kind, cute = pr.cute;
  const L = { lion: 44, boar: 40, wolf: 36, bull: 48, hind: 38, cerberus: 44 }[k], Hl = { lion: 18, boar: 11, wolf: 16, bull: 18, hind: 17, cerberus: 17 }[k] * (cute ? 0.75 : 1), bh = { lion: 17, boar: 20, wolf: 13, bull: 22, hind: 13, cerberus: 17 }[k];
  const fur = C.fur, f2 = C.fur2, by = -Hl - bh * 0.5, bx0 = -L / 2, bx1 = L / 2;
  const legs = (front) => { for (const [lx, dark] of front ? [[bx1 - 9, 0], [bx0 + 7, 0]] : [[bx1 - 4, 1], [bx0 + 11, 1]]) { const c = dark ? darken(f2, 0.12) : f2, w = k === 'hind' ? 1.7 : k === 'boar' ? 2.8 : 2.6;
    F(Path().limb(lx, by - 1, lx - 1.5, -Hl * 0.45, w * 1.5, w), c); F(Path().limb(lx - 1.5, -Hl * 0.45, lx, -1.4, w, w * 0.85), c); F(Path().E(lx + 0.6, -1, w * 1.25, 1.4), k === 'hind' || k === 'boar' || k === 'bull' ? '#2a1d14' : darken(f2, 0.3), { lw: 0.4 }); } };
  legs(false); legs(true);
  // tail
  if (k === 'lion') { Ln(Path().M(bx0 + 1, by - 2).Q(bx0 - 10, by + 2, bx0 - 9, by - 10), fur, 1.4); F(Path().E(bx0 - 9, by - 11, 2, 2.6), f2); }
  else if (k === 'wolf') F(Path().M(bx0 + 2, by - 3).Q(bx0 - 9, by - 2, bx0 - 13, by + 8).Q(bx0 - 6, by + 4, bx0 + 2, by + 2).Z(), fur);
  else if (k === 'cerberus') { const P1 = Path().M(bx0 + 1, by - 2); for (let j = 1; j <= 6; j++) P1.L(bx0 - j * 2.4, by - 2 + Math.sin(j) * 4); Ln(P1, C.scale, 1.6); F(Path().E(bx0 - 15, by - 2 + Math.sin(6) * 4 - 1, 2.4, 1.6), C.scale); }
  else if (k === 'boar' || k === 'bull') Ln(Path().M(bx0 + 1, by - 3).Q(bx0 - 4, by, bx0 - 3, by + 6), f2, 0.8);
  else F(Path().E(bx0 - 0.5, by - 4, 2, 1.6), lighten(fur, 0.4));
  // body
  const bodyPts = k === 'boar' ? [[bx0, by + 2], [bx0 + 4, by - bh * 0.55], [bx0 + L * 0.45, by - bh * 0.75], [bx1 - 4, by - bh * 0.45], [bx1, by + 2], [bx1 - 6, by + bh * 0.45], [bx0 + 6, by + bh * 0.45]]
    : [[bx0, by], [bx0 + 6, by - bh * 0.5], [bx1 - 8, by - bh * 0.5], [bx1, by - 1], [bx1 - 4, by + bh * 0.45], [bx0 + L * 0.45, by + bh * 0.35 + (k === 'wolf' || k === 'hind' ? -2 : 0)], [bx0 + 3, by + bh * 0.45]];
  F(Path().blob(bodyPts), fur);
  if (pen.mode !== 'vase') { x.save(); Path().blob(bodyPts).trace(x); x.clip(); F(Path().E(bx0 + L * 0.5, by + bh * 0.55, L * 0.42, bh * 0.28), lighten(fur, 0.25), { flat: true, noline: true, alpha: 0.6 }); x.restore(); }
  if (k === 'boar') for (let j = 0; j < 12; j++) { const t = j / 11, px = bx0 + 6 + t * (L - 12), py = by - bh * 0.62 - Math.sin(t * Math.PI) * 2.5; Ln(Path().M(px, py + 1.5).L(px - 1.3, py - 3), f2, 0.7); }
  if (k === 'lion' && pen.mode !== 'vase') Ln(Path().M(bx0 + 8, by + 1).Q(bx0 + 18, by + 4, bx1 - 10, by + 1), darken(fur, 0.2), 0.5);
  // heads
  const nh = k === 'cerberus' ? 3 : 1; let eyeAt = null, headAt = null;
  for (let h = 0; h < nh; h++) { const off = nh > 1 ? (h - 1) : 0, hs = (cute ? 1.3 : 1) * ({ lion: 1.2, boar: 1.05, wolf: 0.9, bull: 1.35, hind: 0.8, cerberus: 0.85 }[k]);
    const hx = bx1 + (k === 'hind' ? 2 : 0) + off * 5, hy = by - bh * 0.55 - (k === 'hind' ? 14 : k === 'boar' ? -2 : 5) + off * 6 * (h === 1 ? -0.3 : 1) - (nh > 1 && h === 1 ? 6 : 0);
    if (k === 'hind' || k === 'wolf' || k === 'cerberus') F(Path().limb(bx1 - 6, by - 2, hx - 2, hy + 3, 4.5, 3.4 * hs), fur);
    if (k === 'lion') { const pts = []; for (let j = 0; j < 18; j++) { const a = (j / 18) * Math.PI * 2, r = (j % 2 ? 10.5 : 13.5) * hs; pts.push([hx - 2 + Math.cos(a) * r, hy + 3 + Math.sin(a) * r * 1.08]); } F(Path().blob(pts), f2); if (pen.mode !== 'vase') for (let j = 0; j < 9; j++) { const a = (j / 9) * Math.PI * 2; Ln(Path().M(hx - 2 + Math.cos(a) * 9 * hs, hy + 3 + Math.sin(a) * 9 * hs).Q(hx - 2 + Math.cos(a + 0.2) * 11.5 * hs, hy + 3 + Math.sin(a + 0.2) * 11.5 * hs, hx - 2 + Math.cos(a + 0.1) * 12.5 * hs, hy + 3 + Math.sin(a + 0.1) * 12.5 * hs), darken(f2, 0.3), 0.5); } F(Path().E(hx - 1, hy + 2, 8.5 * hs, 9 * hs), darken(f2, 0.15), { lw: 0.4 }); }
    const s = hs; let P1;
    if (k === 'boar') P1 = Path().blob([[hx - 5 * s, hy - 4 * s], [hx + 3 * s, hy - 3 * s], [hx + 9 * s, hy + 1 * s], [hx + 10 * s, hy + 4 * s], [hx + 2 * s, hy + 6 * s], [hx - 6 * s, hy + 4 * s]]);
    else if (k === 'bull') P1 = Path().blob([[hx - 4 * s, hy - 4 * s], [hx + 4 * s, hy - 4 * s], [hx + 8 * s, hy + 3 * s], [hx + 7 * s, hy + 7 * s], [hx, hy + 6 * s], [hx - 5 * s, hy + 3 * s]]);
    else if (k === 'lion') P1 = Path().blob([[hx - 5 * s, hy - 3 * s], [hx + 3 * s, hy - 4 * s], [hx + 7.5 * s, hy + 1 * s], [hx + 7 * s, hy + 5 * s], [hx + 1 * s, hy + 7 * s], [hx - 5 * s, hy + 4 * s]]);
    else P1 = Path().blob([[hx - 4 * s, hy - 3 * s], [hx + 2 * s, hy - 3.5 * s], [hx + 9 * s, hy + 1.5 * s], [hx + 8.5 * s, hy + 3.5 * s], [hx + 1 * s, hy + 4.5 * s], [hx - 4.5 * s, hy + 2.5 * s]]);
    F(P1, fur); if (k === 'lion' || k === 'wolf' || k === 'cerberus') F(Path().E(hx + 5.8 * s, hy + 2.8 * s, 3.2 * s, 2.2 * s), lighten(fur, 0.32), { lw: 0.35 });
    // ears, horns, antlers
    if (k === 'wolf' || k === 'cerberus') F(Path().poly([[hx - 3 * s, hy - 2 * s], [hx - 1.5 * s, hy - 8 * s], [hx + 0.8 * s, hy - 2.6 * s]]), f2, { lw: 0.45 });
    if (k === 'lion') F(Path().E(hx - 2 * s, hy - 3.5 * s, 1.6 * s, 1.6 * s), f2, { lw: 0.4 });
    if (k === 'boar') { F(Path().poly([[hx - 4 * s, hy - 3 * s], [hx - 6 * s, hy - 8 * s], [hx - 1 * s, hy - 3.5 * s]]), f2, { lw: 0.45 }); F(Path().M(hx + 6 * s, hy + 4 * s).Q(hx + 9 * s, hy + 1 * s, hx + 8 * s, hy - 2.5 * s).Q(hx + 8 * s, hy + 1.5 * s, hx + 5 * s, hy + 5 * s).Z(), C.horn, { lw: 0.4 }); F(Path().E(hx + 9.6 * s, hy + 2.6 * s, 0.8 * s, 1.2 * s), darken(fur, 0.4), { flat: true, lw: 0.3 }); }
    if (k === 'bull') for (const [ox, dk] of [[-2.2, 0.2], [0.8, 0]]) F(Path().M(hx + ox * s - 1.8 * s, hy - 2.6 * s).Q(hx + ox * s - 3 * s, hy - 7.5 * s, hx + ox * s + 4.5 * s, hy - 8 * s).Q(hx + ox * s - 0.2 * s, hy - 6 * s, hx + ox * s + 1.2 * s, hy - 3.2 * s).Z(), darken(C.horn, dk), { lw: 0.45 });
    if (k === 'hind') { F(Path().poly([[hx - 2.6 * s, hy - 2 * s], [hx - 5 * s, hy - 6 * s], [hx - 0.5 * s, hy - 2.8 * s]]), f2, { lw: 0.4 }); const ac = o.gold ? '#e8c050' : C.horn; const P2 = Path(); P2.M(hx - 1, hy - 3).Q(hx - 3, hy - 10, hx - 1, hy - 17); P2.M(hx - 2, hy - 8).L(hx - 7, hy - 12); P2.M(hx - 1.6, hy - 12).L(hx + 3, hy - 16); P2.M(hx - 1.2, hy - 15).L(hx - 5, hy - 19); Ln(P2, ac, 1.1); if (o.gold) pen.glow(hx - 1, hy - 12, 9, '#ffe080', 0.35); }
    if (k !== 'boar') F(Path().E(hx + (k === 'bull' ? 7 : 8.2) * s, hy + 2 * s, 1.1 * s, 0.8 * s), '#1d130e', { flat: true, noline: true });
    if (k === 'lion' || k === 'wolf' || k === 'cerberus') Ln(Path().M(hx + 3 * s, hy + 4.5 * s).Q(hx + 6 * s, hy + 5.4 * s, hx + 8 * s, hy + 4 * s), '#1d130e', 0.5);
    pen.eye(hx + 2.6 * s, hy - 0.6 * s, 0.95 * s * (cute ? 1.4 : 1), k === 'lion' ? '#c8901a' : k === 'wolf' || k === 'cerberus' ? '#e0a020' : C.eye);
    if (h === nh - 1 || nh === 1) { eyeAt = [hx + 2.6 * s, hy - 0.6 * s]; headAt = [hx, hy - 4 * s]; } }
  return { head: headAt, eye: eyeAt, hr: 4, w: L }; }
// ── serpents and the Hydra ── o.heads, o.tree
function rigSerpent(pen, o, C, pr) { const x = pen.x, F = pen.fill, Ln = pen.line, n = o.heads || 1, cute = pr.cute, sc = C.scale, bl = C.belly;
  if (o.tree) { F(Path().M(17, 0).Q(19, -20, 17, -38).Q(12, -46, 6, -48).L(8, -50).Q(16, -46, 20, -42).Q(24, -50, 32, -52).L(33, -50).Q(25, -46, 24, -38).Q(23, -20, 26, 0).Z(), C.wood);
    const leaf = pen.mode === 'vase' ? null : '#3a6a2a'; for (const [cx, cy, r] of [[8, -54, 9], [20, -62, 11], [33, -55, 9], [26, -48, 8], [12, -46, 7]]) { const pts = []; for (let j = 0; j < 12; j++) { const a = j / 12 * Math.PI * 2, rr = r * (j % 2 ? 0.86 : 1); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } F(Path().blob(pts), leaf); }
    for (const [ax, ay] of [[6, -52], [16, -58], [24, -64], [31, -52], [20, -48], [12, -45]]) { F(Path().E(ax, ay, 1.7, 1.7), '#e8b030', { lw: 0.35 }); } }
  // coiled body mound
  const coils = n > 1 ? 3 : 2; for (let c = coils - 1; c >= 0; c--) { const w = 30 - c * 6, yy = -4 - c * 6; F(Path().E(-4 + c * 2, yy, w * 0.75, 5.5), c % 2 ? darken(sc, 0.08) : sc); if (pen.mode !== 'vase') { for (let j = -3; j <= 3; j++) Ln(Path().M(-4 + c * 2 + j * w * 0.18, yy - 4).Q(-4 + c * 2 + j * w * 0.2 + 2, yy, -4 + c * 2 + j * w * 0.18, yy + 4), darken(sc, 0.25), 0.4); F(Path().E(-4 + c * 2, yy + 3.4, w * 0.6, 1.6), bl, { flat: true, noline: true, alpha: 0.8 }); } }
  let eyeAt, headAt; const spread = n > 1 ? 150 : 0;
  for (let h = 0; h < n; h++) { const a = (-90 - spread / 2 + (n > 1 ? h * spread / (n - 1) : 0) + (n === 1 ? 35 : 0)) * deg, len = (n > 1 ? 30 + (h % 2) * 7 : 30) * (cute ? 0.8 : 1), mid = n > 1 && h === (n >> 1);
    const sx = -2 + Math.cos(a) * 4, sy = -16, ex = sx + Math.cos(a) * len + (n === 1 ? 6 : 0), ey = sy + Math.sin(a) * len * 1.05; const cx1 = sx + Math.cos(a + 0.6) * len * 0.5, cy1 = sy + Math.sin(a + 0.6) * len * 0.5;
    const neck = Path(); neck.M(sx, sy).Q(cx1, cy1, ex, ey); x.lineCap = 'round'; neck.trace(x); x.lineWidth = 7 + (pen.mode === 'story' ? 2.5 : 1.5); x.strokeStyle = pen.mode === 'vase' ? pen.C.__vf : (pen.mode === 'story' ? '#2a1a14' : '#1d130e'); x.stroke(); x.lineWidth = 7; x.strokeStyle = pen.mode === 'vase' ? pen.C.__vf : (mid ? lighten(sc, 0.15) : sc); x.stroke();
    if (pen.mode !== 'vase') { x.lineWidth = 2.2; x.strokeStyle = bl; x.globalAlpha = 0.55; x.stroke(); x.globalAlpha = 1; }
    const s = (cute ? 1.35 : 1) * (mid ? 1.15 : 1), dir = Math.cos(a) < -0.2 ? -1 : 1; x.save(); x.translate(ex, ey); x.scale(dir, 1);
    F(Path().blob([[-4 * s, -3 * s], [3 * s, -3.6 * s], [8.5 * s, -0.8 * s], [8.5 * s, 1.6 * s], [2 * s, 3 * s], [-4 * s, 2.5 * s]]), mid ? lighten(sc, 0.15) : sc);
    F(Path().M(1 * s, 1.6 * s).L(8.5 * s, 1.4 * s).L(7 * s, 3.4 * s).Q(2 * s, 4 * s, 0, 2.6 * s).Z(), '#c03040', { lw: 0.35 });
    for (const fx of [3.2, 6]) F(Path().poly([[fx * s, 1.5 * s], [fx * s + 0.8, 1.5 * s], [fx * s + 0.4, 2.8 * s]]), '#f4eee0', { glow: true });
    Ln(Path().M(8.4 * s, 2 * s).L(11 * s, 2.6 * s).M(11 * s, 2.6 * s).L(12 * s, 1.6 * s).M(11 * s, 2.6 * s).L(12 * s, 3.4 * s), '#e04050', 0.45);
    pen.eye(2.6 * s, -1.2 * s, 0.95 * s * (cute ? 1.3 : 1), mid ? '#f0c030' : '#f04030'); if (mid) F(Path().poly([[-2, -3.4 * s], [0, -6 * s], [2, -3.6 * s], [3.5, -5.5 * s], [4, -3.4 * s]]), '#e8c050', { lw: 0.35 });
    x.restore(); if (h === n - 1) { eyeAt = [ex + 2.6 * s * dir, ey - 1.2 * s]; headAt = [ex, ey - 4]; } }
  return { head: headAt, eye: eyeAt, hr: 4, w: 50, noHorns: n > 3 }; }
// ── birds, harpies, sirens ──
function rigBird(pen, o, C, pr) { const x = pen.x, F = pen.fill, Ln = pen.line, cute = pr.cute, fe = o.bronze ? C.bronze : C.feather, y0 = o.perch ? -12 : -34;
  if (o.perch) F(Path().blob([[-18, -2], [-6, -8], [10, -9], [20, -3], [12, 0], [-14, 0]]), '#7a7468');
  for (const sd of [-1, 1]) { const P1 = Path().M(0, y0 - 2); const span = (cute ? 18 : 24) * sd; for (let j = 0; j <= 5; j++) { const t = j / 5; P1.L(span * (0.3 + t * 0.7), y0 - 14 + t * 12 + (j % 2) * 3); } P1.L(span * 0.25, y0 + 6).Z(); F(P1, sd > 0 ? fe : darken(fe, 0.12));
    if (pen.mode !== 'vase') for (let j = 1; j < 5; j++) Ln(Path().M(span * 0.25, y0).L(span * (0.3 + j / 5 * 0.7), y0 - 14 + j / 5 * 12 + 2), o.bronze ? lighten(fe, 0.4) : darken(fe, 0.25), 0.4); }
  F(Path().blob([[-4, y0 - 6], [4, y0 - 7], [6, y0 + 2], [2, y0 + 9], [-3, y0 + 8], [-6, y0 + 1]]), fe);
  F(Path().poly([[-2, y0 + 8], [-5, y0 + 15], [1, y0 + 9]]), darken(fe, 0.1)); for (const lx of [-1.5, 1.5]) Ln(Path().M(lx, y0 + 8).L(lx, y0 + 14).M(lx, y0 + 14).L(lx + 2, y0 + 15).M(lx, y0 + 14).L(lx - 1.5, y0 + 15), '#c8a040', 0.6);
  if (o.human) { const hr = cute ? 4.6 : 3.6, hy = y0 - 9; F(Path().E(0, hy, hr, hr * 1.1), C.skin, { skin: true }); F(Path().M(-hr * 1.05, hy + hr * 0.2).C(-hr * 1.4, hy - hr * 1.8, hr * 1.4, hy - hr * 1.7, hr * 1.05, hy - hr * 0.2).Q(hr * 0.3, hy - hr * 0.8, -hr * 0.3, hy - hr * 0.3).Q(-hr * 1.2, hy + hr * 1.3, -hr * 1.6, hy + hr * 2.6).Z(), C.hair); pen.eye(hr * 0.45, hy - hr * 0.1, hr * 0.26, C.eye);
    if (o.lyre) { Ln(Path().M(6, y0 - 4).Q(12, y0 - 10, 10, y0 - 16).M(6, y0 - 4).Q(4, y0 - 12, 7, y0 - 17), C.trim, 0.8); Ln(Path().M(7.5, y0 - 13).L(9, y0 - 6).M(8.5, y0 - 14).L(9.6, y0 - 7), C.horn, 0.25); }
    return { head: [0, hy - hr], eye: [hr * 0.45, hy - hr * 0.1], hr }; }
  const hy = y0 - 9, s = cute ? 1.3 : 1; F(Path().E(1, hy, 4 * s, 3.6 * s), fe); F(Path().poly([[4 * s, hy - 1], [10 * s, hy + 0.5], [4 * s, hy + 1.6]]), o.bronze ? C.metal : '#d8a030', { lw: 0.4 }); pen.eye(2 * s, hy - 0.8, 0.9 * s, '#f04020');
  if (o.bronze && pen.mode !== 'vase') pen.glow(0, y0 - 2, 22, '#ffd080', 0.18);
  return { head: [1, hy - 4], eye: [2, hy - 0.8], hr: 3 }; }
function rigCrab(pen, o, C, pr) { const F = pen.fill, Ln = pen.line, s = pr.cute ? 1.15 : 1, sh = C.cloth;
  for (const sd of [-1, 1]) for (let j = 0; j < 4; j++) { const lx = sd * (6 + j * 3); Ln(Path().M(lx * 0.6, -8).Q(lx * 1.3, -12, lx * 1.5, -1), darken(sh, 0.2), 1.3); }
  for (const sd of [-1, 1]) { F(Path().limb(sd * 9, -11, sd * 15, -20, 2, 2), sh); F(Path().M(sd * 14, -18).Q(sd * 22, -26, sd * 18, -32).Q(sd * 16, -26, sd * 15, -24).Q(sd * 12, -30, sd * 9, -28).Q(sd * 12, -22, sd * 14, -18).Z(), sh); }
  F(Path().blob([[-14 * s, -8], [-8 * s, -17 * s], [8 * s, -17 * s], [14 * s, -8], [6 * s, -4], [-6 * s, -4]]), sh); if (pen.mode !== 'vase') for (let j = -2; j <= 2; j++) Ln(Path().M(j * 3.5, -15 * s).Q(j * 4, -11, j * 3.6, -6), darken(sh, 0.2), 0.4);
  for (const sd of [-1, 1]) { Ln(Path().M(sd * 3, -16 * s).L(sd * 3.6, -21 * s), darken(sh, 0.3), 0.7); pen.eye(sd * 3.6, -21.5 * s, 1.2 * s, C.eye === '#151010' ? '#f0e020' : C.eye); }
  return { head: [0, -22 * s], eye: [3.6, -21.5 * s], hr: 3, noHorns: true }; }
// Typhon: giant torso, serpent coils for legs, wings, snake heads at the shoulders
function rigTyphon(pen, o, C, pr) { const F = pen.fill, Ln = pen.line, x = pen.x;
  for (const sd of [-1, 1]) { const P1 = Path().M(sd * 6, -52); for (let j = 0; j <= 5; j++) { const a = (-120 + j * 14) * deg; P1.L(sd * (10 + Math.cos(a + 0.5) * 6 + j * 6), -60 - (5 - j) * 5 + (j % 2) * 4); } P1.L(sd * 8, -36).Z(); F(P1, darken(C.feather, sd > 0 ? 0 : 0.15)); }
  for (const sd of [-1, 1]) { const P1 = Path(); P1.M(sd * 4, -26).C(sd * 14, -20, sd * 22, -2, sd * 30, -8); x.lineCap = 'round'; P1.trace(x); x.lineWidth = 9; x.strokeStyle = pen.mode === 'vase' ? pen.C.__vf : '#1d130e'; x.stroke(); x.lineWidth = 7.4; x.strokeStyle = pen.mode === 'vase' ? pen.C.__vf : C.scale; x.stroke(); F(Path().E(sd * 31, -9, 4, 3), C.scale); pen.eye(sd * 32.5, -10, 0.8, '#f04030'); }
  const h = rigHuman(pen, { robe: 'short', beard: true, hair: 'long', bulk: 1.5 }, Object.assign({}, C, { cloth: C.scale, cloth2: darken(C.scale, 0.2), trim: C.skin2 }), { head: 12, leg: 22, torso: 24 });
  for (const sd of [-1, 1]) for (let j = 0; j < 2; j++) { const bx = sd * (8 + j * 4), by = h.sh - 2 - j * 3; Ln(Path().M(sd * 5, h.sh + 2).Q(bx + sd * 4, by - 4, bx + sd * 6, by - 10), C.scale, 2.2); F(Path().E(bx + sd * 7, by - 11, 2.4, 1.6), C.scale); pen.eye(bx + sd * 7.8, by - 11.6, 0.55, '#f04030'); }
  return h; }
// Scylla: a woman above the waves, six dog heads on long necks
function rigScylla(pen, o, C, pr) { const F = pen.fill, Ln = pen.line, x = pen.x;
  for (let k = 0; k < 6; k++) { const sd = k < 3 ? -1 : 1, i = k % 3, ex = sd * (14 + i * 7), ey = -26 - i * 9 + (i === 2 ? 4 : 0); const P1 = Path().M(sd * 4, -10).Q(sd * 6, ey + 10, ex, ey); x.lineCap = 'round'; P1.trace(x); x.lineWidth = 5; x.strokeStyle = pen.mode === 'vase' ? pen.C.__vf : '#1d130e'; x.stroke(); x.lineWidth = 3.8; x.strokeStyle = pen.mode === 'vase' ? pen.C.__vf : C.scale; x.stroke();
    x.save(); x.translate(ex, ey); x.scale(sd, 1); F(Path().blob([[-3, -2.6], [2, -3], [6.5, 0], [6, 2.4], [0, 3], [-3.4, 1.6]]), C.fur); F(Path().poly([[-2, -2], [-1, -5.5], [0.6, -2.4]]), darken(C.fur, 0.2), { lw: 0.35 }); Ln(Path().M(2, 2).L(6, 1.6), '#f4eee0', 0.5); pen.eye(2, -0.8, 0.7, '#f04030'); x.restore(); }
  const h = rigHuman(pen, { robe: 'short', female: true, hair: 'long' }, C, { head: 10, leg: 0, torso: 18 });
  F(Path().M(-40, -6).Q(-30, -12, -20, -6).Q(-10, 0, 0, -6).Q(10, -12, 20, -6).Q(30, 0, 40, -6).L(40, 2).L(-40, 2).Z(), pen.mode === 'vase' ? null : '#3a7ab0', { lw: 0.5 });
  if (pen.mode !== 'vase') for (let j = -3; j <= 3; j++) Ln(Path().M(j * 11 - 4, -5).Q(j * 11, -8, j * 11 + 4, -5), '#d8f0ff', 0.6);
  return h; }

// ── weapons ── drawn upright on a small stand, at a large scale
function stand(pen, C) { pen.fill(Path().M(-12, 0).L(-10, -3).L(10, -3).L(12, 0).Z(), '#cbbfa8'); pen.fill(Path().M(-8, -3).L(-7, -5).L(7, -5).L(8, -3).Z(), '#e4dccb'); }
function rigWeapon(pen, o, C, pr) { const F = pen.fill, Ln = pen.line, x = pen.x, k = o.kind, cute = pr.cute, S = cute ? 0.82 : 1, T = cute ? 1.4 : 1; if (!o.noStand) stand(pen, C);
  if (k === 'club') { const P1 = Path().M(-1.6 * T, -6).Q(-2 * T, -30, -4.6 * T, -52 * S).Q(-5.5 * T, -64 * S, 0, -66 * S).Q(5.5 * T, -64 * S, 4.8 * T, -52 * S).Q(2.2 * T, -30, 1.6 * T, -6).Z(); F(P1, C.wood);
    for (const [kx, ky] of [[-3.6, -44], [3.4, -50], [-2.6, -58], [2.2, -34], [-2, -24]]) { F(Path().E(kx * T, ky * S, 1.8 * T, 1.3 * T), darken(C.wood, 0.15), { lw: 0.4 }); }
    if (pen.mode !== 'vase') { Ln(Path().M(-0.6, -10).Q(-1.6, -36, -2.6 * T, -60 * S), lighten(C.wood, 0.25), 0.6); for (let j = 0; j < 5; j++) Ln(Path().M(-1.8 * T, -9 - j * 1.4).L(1.8 * T, -9.6 - j * 1.4), '#6a4a30', 0.6); } return { top: [0, -66 * S] }; }
  if (k === 'xiphos' || k === 'forge') { const cy = k === 'forge', bl = cy ? C.metal : C.metal, len = 46 * S;
    F(Path().E(0, -8, 2.6 * T, 2), cy ? C.metal2 : C.trim); F(Path().M(-1.3 * T, -9).L(1.3 * T, -9).L(1.2 * T, -19).L(-1.2 * T, -19).Z(), cy ? '#2a3448' : C.wood);
    if (pen.mode !== 'vase') for (let j = 0; j < 5; j++) Ln(Path().M(-1.3 * T, -10.5 - j * 1.8).L(1.3 * T, -11.5 - j * 1.8), cy ? '#22f0ff' : darken(C.wood, 0.3), 0.5);
    F(Path().M(-7 * T, -19).Q(0, -21.5, 7 * T, -19).L(6 * T, -21.5).Q(0, -23, -6 * T, -21.5).Z(), cy ? C.metal2 : C.trim);
    const P1 = cy ? Path().M(-3 * T, -22).L(-3.2 * T, -22 - len * 0.82).L(0, -22 - len).L(3.2 * T, -22 - len * 0.82).L(3 * T, -22).Z()
      : Path().M(-2 * T, -22).Q(-4.2 * T, -22 - len * 0.55, -1.5 * T, -22 - len * 0.9).L(0, -22 - len).L(1.5 * T, -22 - len * 0.9).Q(4.2 * T, -22 - len * 0.55, 2 * T, -22).Z();
    F(P1, bl); Ln(Path().M(0, -23).L(0, -21 - len * 0.95), cy ? '#22f0ff' : darken(bl, 0.25), cy ? 0.9 : 0.5);
    if (cy) { Ln(Path().M(-3 * T, -24).L(-3.2 * T, -22 - len * 0.8), '#ff2fd0', 0.6); for (let j = 0; j < 4; j++) Ln(Path().M(1, -28 - j * 8).L(2.2 * T, -28 - j * 8).L(2.2 * T, -31 - j * 8), '#22f0ff', 0.4); pen.glow(0, -22 - len * 0.5, 22, '#22f0ff', 0.28); }
    else if (pen.mode !== 'vase') Ln(Path().M(-1.2 * T, -26).Q(-2.6 * T, -22 - len * 0.5, -1 * T, -22 - len * 0.85), lighten(bl, 0.5), 0.6);
    return { top: [0, -22 - len] }; }
  if (k === 'sling' || k === 'arc') { const cy = k === 'arc';
    if (cy) { F(Path().M(-1.4 * T, -6).L(1.4 * T, -6).L(1.4 * T, -28).L(-1.4 * T, -28).Z(), C.metal2); for (const sd of [-1, 1]) F(Path().M(sd * 1, -26).Q(sd * 10 * T, -34, sd * 9 * T, -50 * S).L(sd * 6.5 * T, -50 * S).Q(sd * 7 * T, -36, -sd * 0.5, -28).Z(), C.metal);
      const P1 = Path().M(-8 * T, -49 * S).Q(0, -36, 8 * T, -49 * S); Ln(P1, '#ff2fd0', 1.4); Ln(P1, '#ffd8f4', 0.5); F(Path().E(0, -39.5, 2.6, 2.2), '#22f0ff', { glow: true }); pen.glow(0, -40, 16, '#ff2fd0', 0.35); for (let j = 0; j < 4; j++) Ln(Path().M(-1, -10 - j * 4).L(1, -10 - j * 4), '#22f0ff', 0.5); return { top: [0, -50] }; }
    Ln(Path().M(-3, -8).C(-10, -26, -6, -44, -2, -60 * S), '#a8845a', 0.9); Ln(Path().M(3, -8).C(10, -26, 6, -44, 2, -60 * S), '#a8845a', 0.9); F(Path().E(0, -62 * S, 4 * T, 3 * T), '#8a6040'); F(Path().E(0, -62 * S, 2.2 * T, 2 * T), '#a0a0a0');
    F(Path().E(-3, -7, 2, 1.4), '#8a6040'); F(Path().E(3, -7, 2, 1.4), '#8a6040'); return { top: [0, -66] }; }
  if (k === 'spear') { F(Path().M(-0.8 * T, -6).L(0.8 * T, -6).L(0.8 * T, -64 * S).L(-0.8 * T, -64 * S).Z(), C.wood); F(Path().M(0, -80 * S).Q(3.4 * T, -72 * S, 1 * T, -64 * S).L(-1 * T, -64 * S).Q(-3.4 * T, -72 * S, 0, -80 * S).Z(), C.metal); Ln(Path().M(0, -65 * S).L(0, -78 * S), darken(C.metal, 0.25), 0.4);
    F(Path().M(-1.2, -63 * S).L(1.2, -63 * S).L(1.2, -61 * S).L(-1.2, -61 * S).Z(), C.trim); return { top: [0, -80 * S] }; }
  if (k === 'bow') { const P1 = Path().M(-4, -8).Q(14 * T, -30, -4, -70 * S); x.lineCap = 'round'; P1.trace(x); x.lineWidth = 3.4 * T; x.strokeStyle = pen.mode === 'vase' ? pen.C.__vf : '#1d130e'; x.stroke(); x.lineWidth = 2.4 * T; x.strokeStyle = pen.mode === 'vase' ? pen.C.__vf : C.wood; x.stroke();
    Ln(Path().M(-4, -8).L(-4, -70 * S), C.horn, 0.35); for (let j = 0; j < 2; j++) { const ay = -36 - j * 4; Ln(Path().M(-12, ay).L(14, ay - 1), C.wood, 0.6); F(Path().poly([[14, ay - 2.4], [19, ay - 1], [14, ay + 0.4]]), '#5aa040', { lw: 0.3 }); F(Path().poly([[-12, ay], [-15, ay - 2], [-10, ay]]), '#c0392b', { lw: 0.25 }); }
    pen.glow(17, -37, 6, '#80ff60', 0.35); return { top: [-4, -70] }; }
  if (k === 'harpe') { F(Path().M(-1.2 * T, -6).L(1.2 * T, -6).L(1.2 * T, -36).L(-1.2 * T, -36).Z(), C.wood); F(Path().M(-1.2, -36).L(-1.2, -50 * S).Q(-1, -64 * S, 10 * T, -66 * S).Q(16 * T, -62 * S, 12 * T, -54 * S).Q(10 * T, -60 * S, 4, -58 * S).Q(2, -52 * S, 3, -46 * S).L(1.6, -36).Z(), C.metal);
    F(Path().M(1.2, -46 * S).L(6 * T, -44 * S).L(1.4, -42 * S).Z(), C.metal); if (pen.mode !== 'vase') Ln(Path().M(0, -48 * S).Q(0, -62 * S, 10 * T, -64 * S), lighten(C.metal, 0.5), 0.6); return { top: [6, -66] }; }
  if (k === 'aegis') { const r = 24 * (cute ? 0.95 : 1), cy0 = -32; F(Path().E(0, cy0, r, r), C.metal2); F(Path().E(0, cy0, r * 0.88, r * 0.88), C.metal);
    for (let j = 0; j < 14; j++) { const a = j / 14 * Math.PI * 2; Ln(Path().M(Math.cos(a) * r * 0.42, cy0 + Math.sin(a) * r * 0.42).Q(Math.cos(a + 0.3) * r * 0.62, cy0 + Math.sin(a + 0.3) * r * 0.62, Math.cos(a) * r * 0.74, cy0 + Math.sin(a) * r * 0.74), C.scale, 1.1); }
    F(Path().E(0, cy0, r * 0.4, r * 0.42), C.skin, { skin: true }); pen.eye(-3, cy0 - 2, 1.3, '#2a6a3a'); pen.eye(3.6, cy0 - 2, 1.3, '#2a6a3a'); F(Path().M(-4, cy0 + 4).Q(0, cy0 + 8, 4, cy0 + 4).Q(0, cy0 + 5.6, -4, cy0 + 4).Z(), '#a02030', { lw: 0.35 });
    for (const sd of [-1, 1]) F(Path().poly([[sd * 2, cy0 + 4.6], [sd * 2.6, cy0 + 7], [sd * 3.2, cy0 + 4.6]]), '#f4eee0', { glow: true });
    if (pen.mode !== 'vase') Ln(Path().M(-r * 0.7, cy0 - r * 0.45).Q(-r * 0.3, cy0 - r * 0.85, r * 0.2, cy0 - r * 0.86), lighten(C.metal, 0.55), 1); return { top: [0, cy0 - r] }; }
  if (k === 'trident') { F(Path().M(-0.8 * T, -6).L(0.8 * T, -6).L(0.8 * T, -60 * S).L(-0.8 * T, -60 * S).Z(), C.wood); F(Path().M(-9 * T, -60 * S).Q(0, -56 * S, 9 * T, -60 * S).L(9 * T, -62.4 * S).Q(0, -58.6 * S, -9 * T, -62.4 * S).Z(), C.metal);
    for (const tx of [-8, 0, 8]) F(Path().M(tx * T - 1.1, -61 * S).L(tx * T - 1.1, -74 * S - (tx ? 0 : 4)).L(tx * T - 2.4, -74 * S - (tx ? 0 : 4)).L(tx * T, -80 * S - (tx ? 0 : 4)).L(tx * T + 2.4, -74 * S - (tx ? 0 : 4)).L(tx * T + 1.1, -74 * S - (tx ? 0 : 4)).L(tx * T + 1.1, -61 * S).Z(), C.metal);
    pen.glow(0, -66 * S, 18, '#80d0ff', 0.25); return { top: [0, -84 * S] }; }
  if (k === 'bolt') { pen.glow(0, -38, 30, '#fff0a0', 0.5); F(Path().poly([[2, -76 * S], [-9 * T, -42], [-1, -42], [-6 * T, -8], [9 * T, -46], [1, -46], [8 * T, -76 * S]]), '#ffe060'); F(Path().poly([[2.5, -70 * S], [-5 * T, -44], [1, -44], [-2 * T, -20], [5 * T, -44.5]]), '#fffbe0', { glow: true }); return { top: [0, -76] }; }
  return { top: [0, -60] }; }
// ── items, on a plinth ──
function rigItem(pen, o, C, pr) { const F = pen.fill, Ln = pen.line, x = pen.x, k = o.kind, cute = pr.cute, Y = k === 'pelt' ? -14 : -21, s = cute ? 1.12 : 1; if (!o.noStand) stand(pen, C);
  x.save(); x.translate(0, Y); x.scale(s, s);
  if (k === 'obol' || k === 'gold') { const g = k === 'gold', f = g ? '#f0c040' : '#c8ccd2', d = g ? '#a87810' : '#7a8088'; if (g) pen.glow(0, 0, 26, '#ffd060', 0.45); F(Path().E(0, 0, 15, 15), d); F(Path().E(0, 0, 13, 13), f);
    if (!g) { F(Path().blob([[-4, -7], [4, -7], [5, 2], [3, 7], [-3, 7], [-5, 2]]), darken(f, 0.25), { lw: 0.4 }); pen.eye(-2, -3.5, 1.4, '#3a3a3a'); pen.eye(2.2, -3.5, 1.4, '#3a3a3a'); F(Path().poly([[-0.6, -1.6], [0.6, -1.6], [0, 0]]), d, { glow: true }); Ln(Path().M(7, -8).Q(9, 0, 7, 8), '#5a8a4a', 1); }
    else { F(Path().poly([[-1.4, -9], [1.4, -9], [1.4, -1.5], [8, -1.5], [8, 1.5], [1.4, 1.5], [1.4, 9], [-1.4, 9], [-1.4, 1.5], [-8, 1.5], [-8, -1.5], [-1.4, -1.5]]), d, { lw: 0.4 }); F(Path().E(0, 0, 3, 3), '#2a1a60', { lw: 0.4 }); }
    if (pen.mode !== 'vase') Ln(Path().M(-9, -6).Q(-5, -11, 1, -11.5), lighten(f, 0.6), 1.2); }
  if (k === 'ambrosia') { pen.glow(0, -2, 22, '#ffe080', 0.4); F(Path().M(-12, 6).L(-11, -2).Q(0, -5, 11, -2).L(12, 6).Q(0, 9, -12, 6).Z(), '#e8a838'); F(Path().E(0, -2, 11, 3.2), '#f8d070');
    for (let i = -2; i <= 2; i++) for (let j = 0; j < 2; j++) F(Path().poly([[i * 4 - 1.6, 1 + j * 3], [i * 4, -0.2 + j * 3], [i * 4 + 1.6, 1 + j * 3], [i * 4 + 1.6, 2.4 + j * 3], [i * 4, 3.4 + j * 3], [i * 4 - 1.6, 2.4 + j * 3]]), '#f0b840', { lw: 0.3 });
    F(Path().M(-3, -4).Q(-4, -10, 0, -12).Q(1, -8, 4, -9).Q(4, -4, 0, -3.5).Z(), '#fff0c0', { lw: 0.35 }); }
  if (k === 'nectar') { F(Path().M(-13, -6).Q(0, -2, 13, -6).Q(11, 3, 0, 4).Q(-11, 3, -13, -6).Z(), '#c89a40'); F(Path().E(0, -5.5, 12.4, 2.2), '#8a1a30', { lw: 0.4 }); F(Path().M(-1.6, 3.6).L(1.6, 3.6).L(1.2, 11).L(-1.2, 11).Z(), '#c89a40'); F(Path().E(0, 12, 6, 1.6), '#c89a40');
    for (const sd of [-1, 1]) Ln(Path().M(sd * 12, -5).Q(sd * 17, -6, sd * 14, -1), '#c89a40', 1); if (pen.mode !== 'vase') { Ln(Path().M(-7, -6).Q(-2, -4.5, 3, -6.4), '#ff7090', 0.6); for (let j = 0; j < 3; j++) F(Path().E(-3 + j * 3, -10 - j * 1.5, 0.8, 0.8), '#ffb0c0', { glow: true }); } }
  if (k === 'potion' || k === 'venom') { const liq = k === 'potion' ? '#e03848' : '#8a3ad0'; pen.glow(0, 2, 18, liq, 0.4); F(Path().M(-2.6, -12).L(2.6, -12).L(2.6, -6).Q(10, -3, 10, 4).Q(10, 12, 0, 12).Q(-10, 12, -10, 4).Q(-10, -3, -2.6, -6).Z(), 'rgba(220,235,255,0.9)', { flat: true });
    x.save(); Path().M(-9.6, 1).Q(0, -1, 9.6, 1).Q(10, 11.6, 0, 11.6).Q(-10, 11.6, -9.6, 1).Z().trace(x); x.clip(); F(Path().M(-12, 0).L(12, 0).L(12, 14).L(-12, 14).Z(), liq, { noline: true }); x.restore();
    F(Path().M(-3, -14).L(3, -14).L(3, -11).L(-3, -11).Z(), '#8a6040'); if (pen.mode !== 'vase') { Ln(Path().M(-7, 2).Q(-7.6, 7, -4, 9.6), '#ffffff', 0.9); for (let j = 0; j < 3; j++) F(Path().E(-2 + j * 2.6, 5 - j * 1.6, 0.9, 0.9), lighten(liq, 0.5), { glow: true }); }
    if (k === 'venom') { pen.eye(-2, 6, 0.9, '#1a0c20'); pen.eye(2, 6, 0.9, '#1a0c20'); Ln(Path().M(-2.4, 8.6).Q(0, 7.6, 2.4, 8.6), '#1a0c20', 0.5); } }
  if (k === 'pelt') { x.save(); x.scale(0.78, 0.78); x.translate(4, 4); const hide = '#c89a50';
    F(Path().M(-14, -2).L(-20, 6).L(-15, 8).L(-10, 3).Q(0, 6, 10, 3).L(15, 8).L(20, 6).L(14, -2).Q(16, -8, 12, -10).L(16, -16).L(11, -17).L(8, -11).Q(0, -13, -8, -11).L(-11, -17).L(-16, -16).L(-12, -10).Q(-16, -6, -14, -2).Z(), hide);
    if (pen.mode !== 'vase') { F(Path().E(0, -4, 9, 4), lighten(hide, 0.22), { flat: true, noline: true, alpha: 0.7 }); for (let j = 0; j < 5; j++) Ln(Path().M(-8 + j * 4, -9).Q(-7 + j * 4, -4, -8.5 + j * 4, 1), '#a87a38', 0.45); }
    const pts = []; for (let j = 0; j < 16; j++) { const a2 = j / 16 * Math.PI * 2, r = j % 2 ? 7 : 9; pts.push([Math.cos(a2) * r, -16 + Math.sin(a2) * r]); } F(Path().blob(pts), '#8a5a20');
    F(Path().E(0, -16, 5.4, 5.8), hide); F(Path().E(0, -13, 3, 2.2), lighten(hide, 0.3), { lw: 0.35 }); pen.eye(-2, -17.5, 0.85, '#c8901a'); pen.eye(2, -17.5, 0.85, '#c8901a'); F(Path().E(0, -13.8, 1.2, 0.8), '#1d130e', { flat: true, noline: true }); x.restore(); }
  if (k === 'feather') { const P1 = Path().M(1, 14).Q(-10, 2, -2, -16).Q(4, -8, 6, 2).Q(5, 8, 1, 14).Z(); F(P1, '#b8a888'); if (pen.mode !== 'vase') for (let j = 0; j < 7; j++) Ln(Path().M(0.6 + j * 0.3, 10 - j * 3.6).L(-5 + j * 0.6, 6 - j * 3.4), j % 2 ? '#8a7a60' : '#d8ccb0', 0.4);
    Ln(Path().M(1.6, 16).Q(1, 0, -1.6, -15), '#efe6d0', 0.6); for (let j = 0; j < 3; j++) F(Path().E(-2 + j * 0.6, -4 + j * 5, 1, 0.6), '#3a3020', { flat: true, noline: true }); }
  if (k === 'amphora') { const cl = '#c2603a', bk = '#1b1210'; F(Path().M(-3, -14).L(3, -14).L(2.6, -10).Q(10, -8, 10, 0).Q(9, 9, 2.6, 12).L(4, 15).L(-4, 15).L(-2.6, 12).Q(-9, 9, -10, 0).Q(-10, -8, -2.6, -10).Z(), cl, { inkCol: bk });
    for (const sd of [-1, 1]) Ln(Path().M(sd * 2.8, -12).Q(sd * 9, -13, sd * 7.4, -6), bk, 1); if (pen.mode !== 'vase') { F(Path().M(-9.6, -2).Q(0, 0, 9.6, -2).L(9.4, 3).Q(0, 5, -9.4, 3).Z(), bk, { noline: true }); for (let j = -3; j <= 3; j++) F(Path().E(j * 2.6, 0.6, 0.8, 1.6), cl, { flat: true, noline: true }); Ln(Path().M(-6, -6).Q(-7, 2, -5, 7), lighten(cl, 0.35), 1); } }
  if (k === 'torch') { F(Path().M(-1.4, 16).L(1.4, 16).L(2, -4).L(-2, -4).Z(), '#7a5a3a'); F(Path().M(-3.4, -4).L(3.4, -4).L(3, -8).L(-3, -8).Z(), '#4a3424'); pen.glow(0, -16, 22, '#ffa040', 0.55);
    F(Path().M(-4, -8).Q(-6, -16, -1, -26).Q(0, -19, 2, -20).Q(6, -14, 4, -8).Z(), '#ff7a20', { glow: true }); F(Path().M(-2, -8).Q(-3, -14, 0, -20).Q(2, -14, 2.4, -8).Z(), '#ffd040', { glow: true }); F(Path().E(0, -11, 1.4, 2.4), '#fff4c0', { glow: true }); }
  if (k === 'laurel') { for (const sd of [-1, 1]) { Ln(Path().M(0, 10).Q(sd * 15, 4, sd * 9, -12), '#5a7a30', 0.7); for (let j = 0; j < 8; j++) { const t = j / 7, px = sd * (1 + Math.sin(t * 2.6) * 12), py = 10 - t * 21; F(Path().E(px + sd * 1.6, py, 2.8, 1.2, sd * (0.6 + t)), j % 2 ? '#4a8a3a' : '#6aa84a', { lw: 0.3 }); } }
    F(Path().M(-1.6, 9).L(1.6, 9).L(3, 15).L(0, 13).L(-3, 15).Z(), '#c0392b', { lw: 0.3 }); }
  if (k === 'ember') { F(Path().M(-12, 4).L(12, 4).L(10, 12).L(-10, 12).Z(), '#8a5a3a'); F(Path().E(0, 4, 12, 2.4), '#5a3a24'); pen.glow(0, -4, 22, '#ff8a20', 0.5); for (let j = 0; j < 5; j++) F(Path().M(-8 + j * 4, 4).Q(-10 + j * 4, -6 - (j % 2) * 5, -7 + j * 4, -12 - (j % 3) * 3).Q(-5 + j * 4, -4, -5 + j * 4, 4).Z(), j % 2 ? '#ff6a10' : '#ffb030', { glow: true }); F(Path().E(0, 0, 3, 2), '#fff0b0', { glow: true }); }
  if (k === 'moly') { Ln(Path().M(0, 14).Q(-1, 2, 0, -8), '#3a6a2a', 0.9); for (const sd of [-1, 1]) F(Path().M(0, 2).Q(sd * 6, -2, sd * 9, 2).Q(sd * 5, 4, 0, 3).Z(), '#4a8a3a', { lw: 0.3 }); for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2; F(Path().E(Math.cos(a) * 3.6, -10 + Math.sin(a) * 3.6, 2.6, 1.6, a), '#f6f2ea', { lw: 0.3 }); } F(Path().E(0, -10, 1.6, 1.6), '#e8c040');
    for (let j = 0; j < 5; j++) Ln(Path().M(0, 14).Q(-4 + j * 2, 16, -5 + j * 2.5, 19), '#151010', 0.6); }
  if (k === 'winds') { pen.glow(4, -6, 20, '#c8e8ff', 0.4); F(Path().blob([[-11, 2], [-8, -8], [0, -10], [8, -7], [11, 3], [6, 12], [-6, 12]]), '#a87a50'); F(Path().M(-3, -10).L(3, -10).L(4, -15).L(-4, -15).Z(), '#a87a50'); F(Path().M(-4.6, -12.6).L(4.6, -12.6).L(4.6, -11).L(-4.6, -11).Z(), '#c0392b', { lw: 0.3 });
    if (pen.mode !== 'vase') for (let j = 0; j < 3; j++) Ln(Path().M(5, -15 - j * 3).Q(12, -18 - j * 3, 14, -12 - j * 4).Q(16, -8 - j * 4, 12, -8 - j * 4), '#d8f0ff', 0.9); }
  if (k === 'ichor') { pen.glow(0, 0, 18, '#ffd060', 0.5); F(Path().M(0, -14).Q(9, -2, 8, 4).Q(6, 11, 0, 11).Q(-6, 11, -8, 4).Q(-9, -2, 0, -14).Z(), '#f0c040'); F(Path().E(-3, 2, 1.8, 3), '#fff4c0', { glow: true }); }
  if (k === 'star') { pen.glow(0, 0, 24, '#a8c8ff', 0.5); const P1 = Path(); for (let j = 0; j < 10; j++) { const a = j / 10 * Math.PI * 2 - Math.PI / 2, r = j % 2 ? 5 : 13; j ? P1.L(Math.cos(a) * r, Math.sin(a) * r) : P1.M(Math.cos(a) * r, Math.sin(a) * r); } P1.Z(); F(P1, '#dfe8ff'); F(Path().E(0, 0, 3, 3), '#ffffff', { glow: true }); if (pen.mode !== 'vase') for (const [sx, sy] of [[-14, -10], [12, -14], [15, 9], [-12, 12]]) F(Path().E(sx, sy, 0.8, 0.8), '#ffffff', { glow: true }); }
  x.restore(); return { top: [0, Y - 16] }; }

// ── per-style touches for foes: Goth thorns and pale glow, Metal horns, spikes and fire eyes ──
function styleTouch(pen, st, a, s) { if (!a || pen.mode === 'vase') return; const F = pen.fill, Ln = pen.line;
  if (st === 'metal') { if (a.eye) { pen.glow(a.eye[0], a.eye[1], 6, '#ff3a10', 0.8); F(Path().E(a.eye[0], a.eye[1], 1.2, 0.9), '#ffd040', { glow: true }); }
    if (a.head && !a.noHorns) { const [hx, hy] = a.head, r = (a.hr || 5); for (const sd of [-1, 1]) F(Path().M(hx + sd * r * 0.5, hy + r * 0.5).Q(hx + sd * r * 1.9, hy - r * 0.2, hx + sd * r * 1.5, hy - r * 1.8).Q(hx + sd * r * 1.1, hy - r * 0.4, hx + sd * r * 0.1, hy + r * 0.3).Z(), '#e8e0d0', { lw: 0.45 }); } }
  if (st === 'goth') { if (a.eye) pen.glow(a.eye[0], a.eye[1], 5, '#c080ff', 0.6); if (a.head && s.rig === rigHuman) { const [hx, hy] = a.head, r = a.hr || 5; for (let k = -2; k <= 2; k++) F(Path().poly([[hx + k * r * 0.45 - 0.7, hy + r * 0.2], [hx + k * r * 0.5, hy - r * 0.5 - (k % 2 ? 0 : 1.2)], [hx + k * r * 0.45 + 0.7, hy + r * 0.2]]), '#2a1838', { lw: 0.3 }); } }
  if (st === 'cyber' && a.top) { /* weapons draw their own neon */ } }
