// =====================================================================
// DRESS — the warriors' hair and clothes, with secondary motion.
// Hair, coat tails, capes, skirts, ribbons and dangling things are chains of segments that trail behind the body:
// they stream back when the warrior runs (o.hs), lift when falling and drop when jumping (o.hy), and keep a gentle
// wave of their own. The caller sets o.hs / o.hy from a spring (see motionFor); without them, things just breathe.
// Local space: x forward, y down; angles as in the rig (0 down, +PI/2 forward, PI up).
// =====================================================================
function strand(c, x, y, a, len, n, w0, w1, col, bend = 0, wave = .08, t = 0, ph = 0, hi) {
  const pts = [[x, y]]; let ang = a;
  for (let i = 1; i <= n; i++) { ang += bend / n + Math.sin(t * 4.2 - i * .9 + ph) * wave * (i / n + .3); x += Math.sin(ang) * len / n; y += Math.cos(ang) * len / n; pts.push([x, y]); }
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (const pass of [0, 1]) for (let i = 1; i < pts.length; i++) { const w = w0 + (w1 - w0) * (i - 1) / (pts.length - 1);
    c.strokeStyle = pass ? col : OUT; c.lineWidth = pass ? w : w + 2 * INKW; c.beginPath(); c.moveTo(pts[i - 1][0], pts[i - 1][1]); c.lineTo(pts[i][0], pts[i][1]); c.stroke(); }
  if (hi) { c.strokeStyle = hi; c.lineWidth = Math.max(.6, w0 * .28); c.beginPath(); c.moveTo(pts[0][0] - .6, pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.lineTo(pts[i][0] - .6, pts[i][1]); c.stroke(); }
  return pts;
}
// a cloth panel hanging from two points: left and right edges trail like strands, filled between, with fold lines
function cloth(c, p0, p1, a, len, n, col, dk, o, t, ph = 0, flare = 0) {
  const edge = (p, k) => { const pts = [p]; let ang = a, x = p[0], y = p[1]; for (let i = 1; i <= n; i++) { ang += Math.sin(t * 4 - i * .8 + ph + k) * .07 * (i / n + .2); x += Math.sin(ang) * len / n + (k ? 1 : -1) * flare / n; y += Math.cos(ang) * len / n; pts.push([x, y]); } return pts; };
  const L = edge(p0, 0), R = edge(p1, 1.3), shape = [...L, ...R.slice().reverse()];
  poly(c, shape, col); c.strokeStyle = dk; c.lineWidth = .7; for (let f = 1; f < 3; f++) { c.beginPath(); for (let i = 1; i < L.length; i++) { const u = f / 3, px = L[i][0] + (R[i][0] - L[i][0]) * u, py = L[i][1] + (R[i][1] - L[i][1]) * u; i === 1 ? c.moveTo(px, py) : c.lineTo(px, py); } c.stroke(); }
  return { L, R };
}
const MO = o => ({ hs: Math.max(-.6, Math.min(1.3, o.hs || 0)), hy: Math.max(-1, Math.min(1, o.hy || 0)) });
// streaming angle for something that hangs at rest angle a0: running pushes it back toward horizontal, falling lifts it
const streamA = (a0, m, k = 1) => a0 - m.hs * .95 * k - m.hy * .6 * k;

function dressUp(L, id) {
  const R = () => L.b.hr, head0 = L.head, behind0 = L.behind, back0 = L.back, torso0 = L.torso, front0 = L.front, legFront0 = L.legFront;
  switch (id) {
    // ---------------- AMIRAL REMORDS: long coat tails, a plume on the tricorn, fringed epaulettes ----------------
    case 'amiral':
      L.behind = (c, S, p, t, o) => { const m = MO(o), h = S.hip; const T = cloth(c, [h[0] - 6.5, h[1] - 5], [h[0] + 1, h[1] - 5], streamA(-.15, m), 21, 5, '#2c3c86', '#141c44', o, t, 0, -3.5);
        c.strokeStyle = '#e0b45a'; c.lineWidth = 1.1; for (const E of [T.L, T.R]) { c.beginPath(); E.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); }
        c.beginPath(); c.moveTo(T.L[5][0], T.L[5][1]); c.lineTo(T.R[5][0], T.R[5][1]); c.stroke(); c.fillStyle = '#e0b45a'; c.fillRect(h[0] - 6, h[1] - 3, 7, 1.2); };
      L.head = (c, S, p, t, o, rim) => { head0(c, S, p, t, o, rim); const m = MO(o), [x, y] = S.head, r = R(); strand(c, x - r * .6, y - r * 1.55, streamA(PI_ - .9, m, .8) + Math.PI * 0, 9, 4, 2.6, .6, '#f4ece0', -.9, .12, t, 1, '#ffffff'); };
      L.torso = (c, S, tor, p, t, o) => { torso0(c, S, tor, p, t, o); const m = MO(o); for (const sx of [-4, 5]) for (let k = 0; k < 3; k++) strand(c, S.chest[0] + sx - 1.5 + k * 1.5, S.chest[1] + 3, streamA(0, m, .4), 3, 2, .7, .5, '#f2d58a', 0, .05, t, k); };
      break;
    // ---------------- MARGE LA ROADIE: the stage crew — gelled pink mohawk, bare tattooed arms, khaki cargo pants,
    // a tool belt with gaffer tape, a headset round her neck, a backstage pass ----------------
    case 'marge': Object.assign(L, { top: '#1c1616', arms: '#e8b088', legs: '#8a7a52', legB: '#6a5c3c', boots: '#2a1e14' });
      L.head = (c, S, p, t, o, rim) => { const m = MO(o), [x, y] = S.head, r = R(); disc(c, x, y, r, L.skin, rim);
        c.fillStyle = '#c8a07a'; c.beginPath(); c.arc(x - r * .2, y - r * .1, r * .85, Math.PI * 1.05, Math.PI * 1.9); c.fill();   // shaved sides
        for (let k = 0; k < 6; k++) { const ph = -1 + k * .32, rx = x + Math.sin(ph) * r * .95, ry = y - Math.cos(ph) * r * .95; strand(c, rx, ry, Math.PI - ph * 1.05 - m.hs * .35 - m.hy * .15 + Math.sin(t * 3 + k) * .03, 8 + (k % 2) * 2.5 + (k === 3 ? 2 : 0), 3, 3.4, .5, k % 2 ? '#ff4f8a' : '#ff6aa0', -m.hs * .5, .02, t, k, '#ffc0d8'); }
        eye(c, x + r * .45, y - r * .15); c.fillStyle = '#3a1410'; if (o.shout || p.nk > .2) { c.fillRect(x + r * .3, y + r * .4, r * .65, r * .45); } else { c.fillStyle = '#8a3a2a'; c.fillRect(x + r * .45, y + r * .5, r * .4, .9); }
        c.fillStyle = '#e8c77a'; c.beginPath(); c.arc(x - r * .1, y + r * .15, .9, 0, 7); c.fill(); c.beginPath(); c.arc(x + r * .05, y + r * .4, .7, 0, 7); c.fill(); };
      L.torso = (c, S, tor, p, t, o) => { const m = MO(o);
        c.fillStyle = '#efe6d2'; c.font = 'bold 3px sans-serif'; c.textAlign = 'center'; c.save(); c.translate((S.chest[0] + S.hip[0]) / 2 + 1, (S.chest[1] + S.hip[1]) / 2 - 1); c.rotate(-p.sp * .8); c.fillText('CREW', 0, 0); c.restore();
        c.strokeStyle = '#2a2a2e'; c.lineWidth = 1.4; c.beginPath(); c.arc(S.neck[0] + .5, S.neck[1] + 1.5, 3.4, .2, Math.PI - .2); c.stroke(); disc(c, S.neck[0] + 3.6, S.neck[1] + 2.4, 1.6, '#3a3a40');   // headset
        const lp = strand(c, S.neck[0], S.neck[1] + 2, streamA(.05, m, .5), 7, 3, .5, .5, '#3a6ad8', 0, .06, t); c.save(); c.translate(lp[3][0], lp[3][1]); c.rotate(-m.hs * .5 + Math.sin(t * 3) * .08); poly(c, [[-1.6, 0], [1.6, 0], [1.6, 4], [-1.6, 4]], '#f4f0e6'); c.fillStyle = '#c83a2a'; c.fillRect(-1.6, 0, 3.2, 1.2); c.restore();
        c.fillStyle = '#4a3a26'; c.fillRect(S.hip[0] - 6, S.hip[1] - 3, 12, 2.2); c.fillStyle = '#c8a050'; c.fillRect(S.hip[0] + 1, S.hip[1] - 3, 2, 2.2); };
      L.behind = (c, S, p, t, o) => { const m = MO(o), h = S.hip; c.save(); c.translate(h[0] - 5, h[1] - 1); c.rotate(m.hs * .5 + Math.sin(t * 5) * .1); disc(c, 0, 4, 3, '#9a9aa2'); disc(c, 0, 4, 1.4, '#2a2a2e'); c.restore(); };   // gaffer tape on the belt
      L.legFront = (c, S) => { const k = S.kF, h = S.hip; poly(c, [[(h[0] + k[0]) / 2 - 2.5, (h[1] + k[1]) / 2 - 1.5], [(h[0] + k[0]) / 2 + 2.5, (h[1] + k[1]) / 2 - 1.5], [(h[0] + k[0]) / 2 + 2.5, (h[1] + k[1]) / 2 + 3], [(h[0] + k[0]) / 2 - 2.5, (h[1] + k[1]) / 2 + 3]], '#7a6a44'); };
      L.front = (c, S) => { const [s0, e, hd] = S.aF; c.strokeStyle = '#2a4a8a'; c.lineWidth = .9; c.beginPath(); c.moveTo(s0[0] + (e[0] - s0[0]) * .3, s0[1] + (e[1] - s0[1]) * .3); c.lineTo(s0[0] + (e[0] - s0[0]) * .55 + 1, s0[1] + (e[1] - s0[1]) * .55); c.stroke(); c.fillStyle = '#c83a5a'; c.beginPath(); c.arc(e[0] + (hd[0] - e[0]) * .4, e[1] + (hd[1] - e[1]) * .4, 1.2, 0, 7); c.fill(); };
      break;
    // ---------------- RUBY TONNERRE: the punk guitarist — long flame-red hair that streams behind her, a cropped studded
    // leather jacket over a white tee, a red tartan skirt that swings, black tights, a cream guitar ----------------
    case 'ruby': Object.assign(L, { top: '#141014', arms: '#141014', legs: '#1a1620', legB: '#121018', boots: '#0c0a0c' });
      L.back = (c, S, p, t, o) => { back0 && back0(c, S, p, t, o); const m = MO(o), [x, y] = S.head, r = R();
        disc(c, x - r * .25, y - r * .15, r * 1.18, '#c82024');   // the mass of hair behind the head
        const hm = cloth(c, [x - r * .2, y - r * 1.1], [x - r * .55, y + r * .7], streamA(-.25, m) - .15, 20, 6, '#c82024', '#8a1418', o, t, .5, -4);   // the sheet of hair down her back
        c.strokeStyle = OUT; c.lineWidth = INKW; c.beginPath(); hm.L.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
        for (let k = 0; k < 8; k++) strand(c, x - r * .3 - k * .5, y - r * .9 + k * 1.15, streamA(-.3 - k * .05, m), 16 + (k % 3) * 3.5, 6, 4.4, 1.2, k % 2 ? '#d8282a' : '#ea3a30', -.25 - m.hs * .3, .1, t, k * .7, k % 3 === 0 ? '#ff8a6a' : null); };
      L.head = (c, S, p, t, o, rim) => { const m = MO(o), [x, y] = S.head, r = R(); disc(c, x, y, r, L.skin, rim);
        poly(c, [[x - r * 1.05, y - r * .1], [x - r * .9, y - r * .95], [x + r * .1, y - r * 1.2], [x + r * 1.05, y - r * .55], [x + r * .7, y - r * .35], [x + r * .2, y - r * .6], [x - r * .3, y - r * .3]], '#e0302a');
        strand(c, x + r * .7, y - r * .55, .35 - m.hs * .3, 5, 3, 2, .6, '#ea3a30', .2, .1, t, 3);   // the fringe
        eye(c, x + r * .45, y - r * .1); c.fillStyle = '#2a1414'; c.fillRect(x + r * .3, y - r * .32, r * .5, .6);
        if (o.shout) { c.fillStyle = '#3a1410'; c.fillRect(x + r * .4, y + r * .4, r * .5, r * .35); } else { c.fillStyle = '#b8283a'; c.fillRect(x + r * .45, y + r * .5, r * .4, .9); }
        c.fillStyle = '#d8dce0'; c.beginPath(); c.arc(x - r * .15, y + r * .2, .8, 0, 7); c.fill(); };
      L.torso = (c, S, tor) => { poly(c, [[S.chest[0] + 1, S.chest[1] + 1], [S.chest[0] + 5, S.chest[1] + 1], [(S.chest[0] + S.hip[0]) / 2 + 4.5, (S.chest[1] + S.hip[1]) / 2 + 3], [(S.chest[0] + S.hip[0]) / 2, (S.chest[1] + S.hip[1]) / 2 + 3]], '#f2eee6');
        c.fillStyle = '#c8ccd2'; for (let k = 0; k < 4; k++) c.fillRect(tor[0][0] + 1 + k * 1.8, tor[0][1] - .5, 1, 1); c.strokeStyle = '#8a8a90'; c.lineWidth = .6; c.beginPath(); c.moveTo(S.chest[0] + .5, S.chest[1] + 1); c.lineTo((S.chest[0] + S.hip[0]) / 2 - .5, (S.chest[1] + S.hip[1]) / 2 + 3); c.stroke(); };
      L.legFront = (c, S, p, t, o) => { const m = MO(o), h = S.hip, hw = L.b.hw, sw = Math.sin(t * 6) * .06 + (S.fF[0] - S.fB[0]) * .015;
        const { L: Le, R: Ri } = cloth(c, [h[0] - hw - .5, h[1] - 1], [h[0] + hw + .5, h[1] - 1], streamA(.05, m, .35) + sw, 9, 3, '#b8202a', '#5a1014', o, t, 0, 5);
        c.strokeStyle = 'rgba(20,10,10,.55)'; c.lineWidth = .7; for (let f = 1; f < 4; f++) { c.beginPath(); c.moveTo(Le[0][0] + (Ri[0][0] - Le[0][0]) * f / 4, Le[0][1]); c.lineTo(Le[3][0] + (Ri[3][0] - Le[3][0]) * f / 4, Le[3][1]); c.stroke(); }
        c.strokeStyle = 'rgba(255,220,120,.55)'; c.beginPath(); c.moveTo(Le[1][0], Le[1][1]); c.lineTo(Ri[1][0], Ri[1][1]); c.stroke(); c.fillStyle = '#141014'; c.fillRect(h[0] - hw - .5, h[1] - 2, hw * 2 + 1, 1.6); };
      L.weapon = (c, S, p, t, o) => { if (!o.swing) return; const [hx, hy] = S.aF[2], a = S.handAng, dx = Math.sin(a), dy = Math.cos(a); limb(c, [[hx - dx * 2, hy - dy * 2], [hx + dx * 14, hy + dy * 14]], 2, '#2a1a10'); disc(c, hx + dx * 16, hy + dy * 16, 5, '#efe6d2', '#ffffff'); c.fillStyle = '#141014'; c.beginPath(); c.arc(hx + dx * 16, hy + dy * 16, 2.4, 0, 7); c.fill(); };
      L.back = ((b) => (c, S, p, t, o) => { if (!o.swing) { limb(c, [[S.chest[0] - 6, S.chest[1] - 2], [S.hip[0] + 4, S.hip[1] + 2]], 2, '#2a1a10'); disc(c, S.hip[0] - 1, S.hip[1] - 2, 4.5, '#efe6d2'); c.fillStyle = '#141014'; c.beginPath(); c.arc(S.hip[0] - 1, S.hip[1] - 2, 2, 0, 7); c.fill(); } b(c, S, p, t, { ...o, swing: 1 }); })(L.back);
      break;
    // ---------------- THE BIG CYBORG: cables from the back of the skull ----------------
    case 'cyborg':
      L.behind = (c, S, p, t, o) => { const m = MO(o), [x, y] = S.head, r = R(); for (let k = 0; k < 3; k++) { const pts = strand(c, x - r * .7, y - r * .1 + k * 1.6, streamA(-.5 - k * .15, m, .7), 13 + k * 3, 5, 1.6, 1.2, '#2a2a30', -.4, .08, t, k); c.fillStyle = (Math.sin(t * 6 + k) > 0) ? '#ff7a2a' : '#ffb04a'; c.beginPath(); c.arc(pts[5][0], pts[5][1], 1.2, 0, 7); c.fill(); } };
      break;
    // ---------------- DOCTEUR MAGNÉTO: a short cape and the mask's ribbon tails ----------------
    case 'magneto':
      L.behind = (c, S, p, t, o) => { const m = MO(o), ch = S.chest, sw = L.b.sw; cloth(c, [ch[0] - sw, ch[1]], [ch[0] + sw * .3, ch[1] - 1], streamA(-.12, m), 26, 6, '#2a3a7a', '#141c44', o, t, 0, -6);
        const [x, y] = S.head, r = R(); for (let k = 0; k < 2; k++) strand(c, x - r * .8, y - r * .3 + k * 1.5, streamA(-.9 - k * .2, m, .8), 9 + k * 2, 4, 1.6, .7, '#c82a2a', -.3, .12, t, k * 2); };
      break;
    // ---------------- DOC SUTURE: a long field coat, a red-cross armband, a stethoscope, loose strands from the bun ----------------
    case 'doc': Object.assign(L, { top: '#d8d2bc', arms: '#d0caae' });
      L.behind = (c, S, p, t, o) => { const m = MO(o), h = S.hip; cloth(c, [h[0] - 6, h[1] - 4], [h[0] + 4, h[1] - 4], streamA(-.1, m), 19, 5, '#cbc4aa', '#9a9478', o, t, .5, -5); };
      L.head = (c, S, p, t, o, rim) => { head0(c, S, p, t, o, rim); const m = MO(o), [x, y] = S.head, r = R(); for (let k = 0; k < 2; k++) strand(c, x - r * 1.1, y - r * .6 + k * 2, streamA(-.2, m, .7), 6, 3, .8, .5, '#cfc8bc', .2, .15, t, k * 3); };
      L.torso = (c, S, tor, p, t, o) => { torso0 && torso0(c, S, tor, p, t, o); const m = MO(o); c.strokeStyle = '#2a2a2e'; c.lineWidth = .9; c.beginPath(); c.moveTo(S.neck[0] - 2, S.neck[1] + 1); c.quadraticCurveTo(S.chest[0] + 2, S.chest[1] + 6 + m.hs, S.neck[0] + 3, S.neck[1] + 1); c.stroke(); disc(c, S.chest[0] + 1.5 - m.hs, S.chest[1] + 6.5, 1.2, '#b8b8c0');
        c.strokeStyle = 'rgba(80,70,50,.5)'; c.lineWidth = .7; c.beginPath(); c.moveTo(S.chest[0] + .5, S.chest[1] + 1); c.lineTo(S.hip[0] + .5, S.hip[1] + 1); c.stroke(); };
      L.front = (c, S) => { front0 && front0(c, S); const [s0, e] = S.aF, mx = s0[0] + (e[0] - s0[0]) * .55, my = s0[1] + (e[1] - s0[1]) * .55; disc(c, mx, my, 2.4, '#f4f0e6'); c.fillStyle = '#d83a3a'; c.fillRect(mx - .4, my - 1.6, .8, 3.2); c.fillRect(mx - 1.6, my - .4, 3.2, .8); };
      break;
    // ---------------- JEAN-LOUIS CARNAGE: dog tags on a chain, the helmet strap ----------------
    case 'soldier':
      L.torso = (c, S, tor, p, t, o) => { torso0(c, S, tor, p, t, o); const m = MO(o), pts = strand(c, S.neck[0] + 1, S.neck[1] + 1, streamA(.1, m, .5), 6, 3, .5, .5, '#b8b8c0', 0, .1, t); c.save(); c.translate(pts[3][0], pts[3][1]); c.rotate(-m.hs * .5); poly(c, [[-1.3, 0], [1.3, 0], [1.3, 2.6], [-1.3, 2.6]], '#d8d8e0'); c.restore(); };
      L.head = (c, S, p, t, o, rim) => { head0(c, S, p, t, o, rim); const [x, y] = S.head, r = R(); c.strokeStyle = '#2a2a1a'; c.lineWidth = .8; c.beginPath(); c.moveTo(x - r * .9, y); c.quadraticCurveTo(x - r * .2, y + r * 1.2, x + r * .4, y + r * .9); c.stroke(); };
      break;
    // ---------------- THE SPACE RACCOON: a big fluffy ringed tail that streams behind ----------------
    case 'raccoon':
      L.behind = (c, S, p, t, o) => { const m = MO(o), h = S.hip; const pts = strand(c, h[0] - 2, h[1], streamA(-1.2, m, .5), 18, 7, 6, 4, '#8a7a6a', -.9 - m.hs * .3, .1, t, 0, '#b8aa98');
        for (let k = 2; k < 7; k += 2) { c.strokeStyle = '#2a2420'; c.lineWidth = 5.4 - k * .25; c.lineCap = 'butt'; c.beginPath(); c.moveTo(pts[k][0], pts[k][1]); c.lineTo(pts[k + 1][0], pts[k + 1][1]); c.stroke(); } c.lineCap = 'round'; c.fillStyle = '#2a2420'; c.beginPath(); c.arc(pts[7][0], pts[7][1], 2.4, 0, 7); c.fill(); };
      break;
    // ---------------- DEMI: a two-tone scarf streaming from the neck, flame and frost ----------------
    case 'demi':
      L.head = (c, S, p, t, o, rim) => { const m = MO(o); strand(c, S.neck[0] - 2, S.neck[1], streamA(-.9, m), 18, 6, 3.4, 1.4, '#e05a1a', -.5, .16, t, 0, '#ffb040'); strand(c, S.neck[0] - 2, S.neck[1] + 1.5, streamA(-.75, m), 16, 6, 3, 1.2, '#7aa8d8', -.4, .16, t, 1.7, '#e8f6ff'); head0(c, S, p, t, o, rim); };
      break;
  }
  return L;
}
const PI_ = Math.PI;
// the springs that drive it, per fighter: blown back by running, lifted by falling, a kick on landing and on hits
function motionFor(o, spd, face, vy, air, dt) { const M = o.mo || (o.mo = { hs: 0, vs: 0, hy: 0, vy: 0 }); if (dt <= 0) return M;
  const tgtS = Math.max(-.5, Math.min(1.2, spd * face / 130)), tgtY = air ? Math.max(-1, Math.min(1, -vy / 260)) : 0;
  M.vs += (-(M.hs - tgtS) * 70 - M.vs * 6) * dt; M.hs += M.vs * dt; M.vy += (-(M.hy - tgtY) * 60 - M.vy * 5) * dt; M.hy += M.vy * dt; return M; }
