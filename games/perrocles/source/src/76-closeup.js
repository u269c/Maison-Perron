// ═══ CLOSE-UPS: scene cutaways painted at 8× the pixel density, on the high-res layer ═══
// A close-up is baked once into an 8× canvas (8 real pixels per game pixel), then drawn over the whole
// screen each frame with its few living touches (glows, twinkles) drawn on top at full resolution.
const CU_RES = 8, CLOSEUPS = {}, CU_CACHE = {};
function closeupCanvas(kind) { if (CU_CACHE[kind]) return CU_CACHE[kind]; const C = CLOSEUPS[kind]; if (!C) return null;
  const c = mkC(LW * CU_RES, LH * CU_RES), x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.scale(CU_RES, CU_RES); C.bake(x); CU_CACHE[kind] = c; return c; }
function closeupForDisplay(kind) { const src = closeupCanvas(kind); if (!src) return null; const w = Math.round(DISP.w), h = Math.round(DISP.h), k = 'd:' + kind; let d = CU_CACHE[k]; if (d && d.width === w && d.height === h) return d;
  d = mkC(w, h); let cur = src; while (cur.width / 2 > w) { const t = mkC(Math.round(cur.width / 2), Math.round(cur.height / 2)), tx = t.getContext('2d'); tx.imageSmoothingQuality = 'high'; tx.drawImage(cur, 0, 0, t.width, t.height); cur = t; } const dx = d.getContext('2d'); dx.imageSmoothingQuality = 'high'; dx.drawImage(cur, 0, 0, w, h); CU_CACHE[k] = d; return d; }
function drawCutawayHi(c) { const K = G.cutaway, C = CLOSEUPS[K.kind]; if (!C) return false; const img = closeupForDisplay(K.kind); if (!img) return false;
  const s = DISP.s, a = Math.min(1, K.t / 0.8), z = 1 + Math.min(1, K.t / 9) * 0.05; // fade in, and a slow push in
  c.save(); c.beginPath(); c.rect(DISP.x, DISP.y, DISP.w, DISP.h); c.clip(); c.globalAlpha = a; c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'low';
  const fx = C.focus ? C.focus[0] : LW / 2, fy = C.focus ? C.focus[1] : LH / 2; c.translate(DISP.x + fx * s, DISP.y + fy * s); c.scale(z, z); c.translate(-fx * s, -fy * s);
  c.drawImage(img, 0, 0, DISP.w, DISP.h); c.scale(s, s); if (C.live) C.live(c, K.t); c.restore();
  // what the low layer would have drawn on top (dialogue frame, letterbox, fades), crisp pixels over the painting
  const ov = closeupCanvas.ov || (closeupCanvas.ov = mkC(LW, LH)), ox = ov.getContext('2d'); ox.setTransform(1, 0, 0, 1, 0, 0); ox.clearRect(0, 0, LW, LH); const dt = NOW.dt; NOW.dt = 0; try { drawDialogLow(ox); drawOverlaysLow(ox); } finally { NOW.dt = dt; }
  c.imageSmoothingEnabled = false; c.drawImage(ov, DISP.x, DISP.y, DISP.w, DISP.h); return true; }

// ── the night vision: on Olympus, a veiled queen on her throne looks down at a new light at the mountain's foot ──
CLOSEUPS.olympus = { focus: [300, 150],
  bake(x) { const g = x.createRadialGradient(170, 120, 10, 170, 120, 360); g.addColorStop(0, '#d67446'); g.addColorStop(0.6, CLAY_V); g.addColorStop(1, '#9e4a2c'); x.fillStyle = g; x.fillRect(0, 0, LW, LH);
    // meander bands top and bottom, as on the vases
    x.fillStyle = BLACK_V; x.fillRect(0, 0, LW, 9); x.fillRect(0, LH - 9, LW, 9); x.strokeStyle = CLAY_V; x.lineWidth = 0.6; for (const by of [4.5, LH - 4.5]) for (let k = 0; k < LW; k += 8) { x.beginPath(); x.moveTo(k, by + 2); x.lineTo(k, by - 2); x.lineTo(k + 5, by - 2); x.lineTo(k + 5, by + 1); x.lineTo(k + 2.5, by + 1); x.stroke(); }
    // stars, small and many
    let r = 7; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647; x.fillStyle = WHITE_V; for (let i = 0; i < 110; i++) { const sx = rnd() * LW, sy = 12 + rnd() * 120, sr = 0.18 + rnd() * 0.35; x.beginPath(); x.arc(sx, sy, sr, 0, TAU); x.fill(); }
    // far ridges of Thessaly, and the valley where Oloosson sleeps
    const ridge = (base, amp, f, ph, col) => { x.fillStyle = col; x.beginPath(); x.moveTo(0, LH); for (let k = 0; k <= LW; k += 2) x.lineTo(k, base - Math.abs(Math.sin(k / f + ph)) * amp - Math.sin(k / 17 + ph) * 2.5); x.lineTo(LW, LH); x.fill(); };
    ridge(196, 34, 64, 0.6, '#5a2a1a'); ridge(214, 22, 41, 2.1, '#3a1c12'); x.fillStyle = BLACK_V; x.fillRect(0, 226, LW, LH - 226);
    // the village: a handful of roofs, one lamp lit
    for (const [hx, hw, hh] of [[96, 9, 6], [107, 7, 5], [116, 10, 7], [128, 8, 5], [137, 6, 4]]) { x.fillStyle = BLACK_V; x.fillRect(hx, 226 - hh, hw, hh); x.beginPath(); x.moveTo(hx - 1.5, 226 - hh); x.lineTo(hx + hw / 2, 226 - hh - 3.5); x.lineTo(hx + hw + 1.5, 226 - hh); x.fill(); x.strokeStyle = CLAY_V; x.lineWidth = 0.35; x.stroke(); }
    x.fillStyle = GOLD_V; x.fillRect(119, 221, 1.6, 1.8);
    // Olympus: the great dark peak, with strata scratched in and white cloud bands
    x.fillStyle = BLACK_V; x.beginPath(); x.moveTo(205, LH); x.bezierCurveTo(235, 210, 262, 196, 282, 182); x.lineTo(300, 176); x.bezierCurveTo(330, 168, 400, 166, 430, 174); x.bezierCurveTo(456, 182, 470, 200, LW, 206); x.lineTo(LW, LH); x.fill();
    x.strokeStyle = CLAY_V; x.lineWidth = 0.45; for (let i = 0; i < 9; i++) { const yy = 186 + i * 8; x.beginPath(); x.moveTo(236 + i * 6, yy); x.bezierCurveTo(300, yy - 6 + i, 380, yy - 4, LW, yy + 4 - i); x.stroke(); }
    for (const [cx, cy, w] of [[250, 204, 70], [430, 196, 80], [330, 214, 60]]) { x.fillStyle = WHITE_V; x.globalAlpha = 0.9; x.beginPath(); x.moveTo(cx - w / 2, cy); for (let k = 0; k <= 6; k++) x.quadraticCurveTo(cx - w / 2 + (k + 0.5) * w / 7, cy - 6 - (k % 2) * 3, cx - w / 2 + (k + 1) * w / 7, cy); x.closePath(); x.fill(); x.globalAlpha = 1; x.strokeStyle = BLACK_V; x.lineWidth = 0.35; x.stroke(); }
    // the throne: tall back, lion feet, a footstool; a peacock behind it, for those who know
    const ty = 176, pen = Pen(x, 'vase', palette({ pal: {} }, 'classic'), { vaseFig: BLACK_V, vaseLine: CLAY_V, white: true, vlw: 0.42 });
    x.save(); x.translate(404, ty); x.scale(-1.5, 1.5);
    { x.fillStyle = BLACK_V; x.strokeStyle = CLAY_V; x.lineWidth = 0.35; x.beginPath(); x.moveTo(26, -16); for (let i = 0; i <= 14; i++) { const an = -Math.PI * 0.98 + i * Math.PI * 0.07; x.lineTo(26 + Math.cos(an) * 30, -18 + Math.sin(an) * 26); } x.closePath(); x.fill(); x.stroke();
      for (let i = 0; i <= 14; i++) { const an = -Math.PI * 0.98 + i * Math.PI * 0.07; x.beginPath(); x.moveTo(26, -17); x.lineTo(26 + Math.cos(an) * 29, -18 + Math.sin(an) * 25); x.stroke(); }
      for (const [rr, n] of [[0.9, 12], [0.66, 9], [0.42, 6]]) for (let i = 0; i < n; i++) { const an = -Math.PI * 0.98 + (i + 0.5) / n * Math.PI * 0.98, ex = 26 + Math.cos(an) * 30 * rr, ey = -18 + Math.sin(an) * 26 * rr; x.fillStyle = WHITE_V; x.beginPath(); x.ellipse(ex, ey, 1.7, 1.35, an, 0, TAU); x.fill(); x.fillStyle = CLAY_V; x.beginPath(); x.ellipse(ex, ey, 1.0, 0.8, an, 0, TAU); x.fill(); x.fillStyle = BLACK_V; x.beginPath(); x.ellipse(ex, ey, 0.45, 0.4, 0, 0, TAU); x.fill(); } }
    pen.fill(Path().E(26, -12, 5, 4), BLACK_V); pen.fill(Path().M(28, -15).Q(31, -24, 29, -28).Q(27, -24, 26, -15).Z(), BLACK_V); pen.fill(Path().E(29.4, -28.5, 1.8, 1.5), BLACK_V); pen.fill(Path().M(29, -30).L(29.5, -33).L(30, -30).Z(), BLACK_V);
    pen.fill(Path().M(-16, 0).L(-15, -6).L(-14, -50).Q(-13, -56, -8, -56).Q(-4, -56, -4, -50).L(-4, -16).L(10, -16).L(12, -13).L(12, 0).L(9, 0).L(9, -10).L(-12, -10).L(-12, 0).Z(), BLACK_V);
    for (const lx of [-13, 10.5]) pen.fill(Path().E(lx, -1, 2.4, 1.6), BLACK_V); pen.line(Path().M(-12, -13).L(10, -13), CLAY_V, 0.4); pen.line(Path().M(-11, -48).L(-11, -18), CLAY_V, 0.35); pen.line(Path().M(-7, -48).L(-7, -18), CLAY_V, 0.35);
    pen.fill(Path().M(13, 0).L(14, -4).L(26, -4).L(27, 0).Z(), BLACK_V);
    // the queen, seated and veiled, one hand reaching toward the light far below
    const B = body(PR.adult), [a, f] = reach(B, B.SF, [19, B.sh + 13.5 + 9], -1);
    rigHuman(pen, { robe: 'long', female: true, veil: true, crown: true, hair: 'long', scepter: true, drop: 13.5, feet: [16, 18.5], lean: 0.06, nod: 0.16, arm: a, fore: f, arm2: 0.35, fore2: 1.2, upright: true }, palette({ pal: {} }, 'classic'), PR.adult);
    x.restore();
    // the thread of sight: a faint dotted line from her hand to the light
    x.fillStyle = WHITE_V; x.globalAlpha = 0.35; for (let i = 0; i < 26; i++) { const k = i / 26, px = lerp(364, 124, k), py = lerp(150, 216, k) + Math.sin(k * Math.PI) * -22; x.beginPath(); x.arc(px, py, 0.45, 0, TAU); x.fill(); } x.globalAlpha = 1; },
  live(c, t) { // the new light pulses; a few stars twinkle; a wisp of cloud drifts
    const k = (Math.sin(t * 3.2) + 1) / 2, gx = 119.8, gy = 221.6; const g = c.createRadialGradient(gx, gy, 0, gx, gy, 10 + 6 * k); g.addColorStop(0, 'rgba(255,236,170,0.95)'); g.addColorStop(0.25, 'rgba(240,190,90,0.55)'); g.addColorStop(1, 'rgba(240,190,90,0)'); c.fillStyle = g; c.beginPath(); c.arc(gx, gy, 16 + 6 * k, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,240,190,' + (0.35 + 0.4 * k) + ')'; c.lineWidth = 0.3; for (let i = 0; i < 8; i++) { const an = i * TAU / 8 + t * 0.3, r1 = 3, r2 = 7 + 5 * k + (i % 2) * 3; c.beginPath(); c.moveTo(gx + Math.cos(an) * r1, gy + Math.sin(an) * r1); c.lineTo(gx + Math.cos(an) * r2, gy + Math.sin(an) * r2); c.stroke(); }
    c.fillStyle = WHITE_V; for (let i = 0; i < 9; i++) { const sx = (i * 53 + 31) % 200 + 20, sy = 20 + (i * 37) % 90, tw = Math.max(0, Math.sin(t * 2.4 + i * 1.7)); if (tw > 0.2) { c.globalAlpha = tw; c.fillRect(sx - 1.2 * tw, sy - 0.12, 2.4 * tw, 0.24); c.fillRect(sx - 0.12, sy - 1.2 * tw, 0.24, 2.4 * tw); } } c.globalAlpha = 1;
    const wx = 180 + ((t * 4) % 340) - 60; c.globalAlpha = 0.5; c.fillStyle = WHITE_V; c.beginPath(); c.ellipse(wx, 150, 26, 2.2, 0, 0, TAU); c.fill(); c.globalAlpha = 1; } };
