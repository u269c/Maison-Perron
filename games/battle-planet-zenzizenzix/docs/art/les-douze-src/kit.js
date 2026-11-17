// =====================================================================
// LES DOUZE — painting kit
// Each scene lays out shapes on a canvas; paint() then repaints them with
// brushstrokes in a 17th-century palette; finish() varnishes.
// =====================================================================
const W = 1200, H = 900;
let seed = 1717;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const PAL = ['#efe6d2', '#e8c77a', '#c8933a', '#a8642a', '#5a3a22', '#c8402a', '#8a2a3a', '#2a3a7a', '#4a6aa8', '#3a7a6a', '#1e1a18', '#7a6a4a', '#d9b48a'].map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);

function kit(g) {
  const lin = (x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
  const rad = (x, y, r0, r1, stops) => { const gr = g.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
  const fill = (d, f) => { g.fillStyle = f; g.fill(typeof d === 'string' ? new Path2D(d) : d); };
  const C = (x, y, r, f) => { g.beginPath(); g.arc(x, y, Math.max(.1, r), 0, Math.PI * 2); g.fillStyle = f; g.fill(); };
  const E = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, Math.PI * 2); g.fillStyle = f; g.fill(); };
  const line = (pts, w, col) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); };
  const curve = (x0, y0, cx, cy, x1, y1, w, col) => { g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(cx, cy, x1, y1); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.stroke(); };
  const soft = (px, fn) => { g.save(); g.filter = `blur(${px}px)`; fn(); g.restore(); };
  const glow = fn => { g.save(); g.globalCompositeOperation = 'lighter'; fn(); g.restore(); };
  const poly = (pts, f) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = f; g.fill(); };
  // tapered limb through points, widths w0 -> w1
  const limb = (pts, w0, w1, col) => { const n = pts.length, Lp = [], Rp = [];
    for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]; let dx = b[0] - a[0], dy = b[1] - a[1]; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m; const w = (w0 + (w1 - w0) * i / (n - 1)) / 2; Lp.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); Rp.push([pts[i][0] + dy * w, pts[i][1] - dx * w]); }
    poly(Lp.concat(Rp.reverse()), col); for (let i = 0; i < n; i++) C(pts[i][0], pts[i][1], (w0 + (w1 - w0) * i / (n - 1)) / 2, col); };
  const sky = stops => { g.fillStyle = lin(0, 0, 0, H * .72, stops); g.fillRect(0, 0, W, H); };
  const stars = (n, y1 = 300, a = .6) => { for (let i = 0; i < n; i++) C(rnd() * W, rnd() * y1, rnd() * 1.5 + .3, `rgba(239,230,210,${(.25 + rnd() * .6) * a})`); };
  const hazeBands = (n, y0, y1, rgb, a = .35) => soft(26, () => { for (let i = 0; i < n; i++) E(rnd() * W, y0 + rnd() * (y1 - y0), 200 + rnd() * 240, 22 + rnd() * 30, `rgba(${rgb},${a})`, (rnd() - .5) * .25); });
  const halo = (x, y, r, inner = '255,248,226', outer = '236,180,100') => soft(8, () => { g.fillStyle = rad(x, y, 0, r, [[0, `rgba(${inner},1)`], [.07, `rgba(${inner},.95)`], [.25, `rgba(${outer},.6)`], [.6, `rgba(${outer},.18)`], [1, `rgba(${outer},0)`]]); g.fillRect(x - r, y - r, r * 2, r * 2); });
  // the banded giant (Havre's sky)
  const giant = (x, y, r, dark = 'rgba(12,16,40,.85)', a = 1) => soft(3, () => { g.save(); g.globalAlpha = a; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
    g.fillStyle = rad(x - r * .3, y - r * .3, r * .08, r * 1.15, [[0, '#f6e0ae'], [.4, '#dca862'], [.78, '#9a562a'], [1, '#3a2216']]); g.fillRect(x - r, y - r, r * 2, r * 2);
    for (let i = 0; i < 9; i++) { const yy = y - r + (i + .5) * r * 2 / 9, h = r * (.03 + rnd() * .06); g.globalAlpha = .5 * a; E(x, yy, r * 1.25, h, ['#a8642a', '#c8933a', '#6a3a1e', '#e0b066'][i % 4], -.14); }
    g.globalAlpha = .75 * a; E(x - r * .3, y + r * .25, r * .2, r * .08, '#8a3020', -.14); g.globalAlpha = a;
    g.fillStyle = rad(x + r * .7, y + r * .4, r * .3, r * 1.3, [[0, 'rgba(0,0,0,0)'], [1, dark]]); g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); });
  const billow = (x, y, r, lit, tint = [254, 240, 210]) => { const [a, b, c] = tint; g.fillStyle = rad(x - r * .35, y - r * .4, r * .05, r * 1.05, [[0, lit ? `rgba(${a},${b},${c},1)` : `rgba(${a * .8 | 0},${b * .78 | 0},${c * .78 | 0},1)`], [.55, lit ? `rgba(${a * .83 | 0},${b * .77 | 0},${c * .7 | 0},.95)` : `rgba(${a * .54 | 0},${b * .52 | 0},${c * .52 | 0},.9)`], [1, `rgba(${a * .43 | 0},${b * .4 | 0},${c * .38 | 0},0)`]]); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); };
  const embers = (x0, y0, w, h, n, rgb = [255, 170, 80]) => glow(() => { for (let i = 0; i < n; i++) C(x0 + rnd() * w, y0 + rnd() * h, .8 + rnd() * 2.6, `rgba(${rgb[0]},${rgb[1] - 30 + rnd() * 60 | 0},${rgb[2] - 20 + rnd() * 40 | 0},${.45 + rnd() * .5})`); });
  const shock = (x, y, rx, ry, n, col = '255,230,180') => { for (let i = 1; i <= n; i++) { g.beginPath(); g.ellipse(x, y, rx * i / n, ry * i / n, 0, 0, Math.PI * 2); g.strokeStyle = `rgba(${col},${.9 - i / n * .6})`; g.lineWidth = 6 - i * 4 / n; g.stroke(); } };
  const bolt = (x0, y0, x1, y1, col = '220,235,255') => { const pts = [[x0, y0]]; const n = 9; for (let i = 1; i < n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t + (rnd() - .5) * 60, y0 + (y1 - y0) * t + (rnd() - .5) * 20]); } pts.push([x1, y1]);
    glow(() => { soft(10, () => line(pts, 18, `rgba(${col},.55)`)); line(pts, 5, `rgba(${col},1)`); line(pts, 2, 'rgba(255,255,255,1)'); const k = 2 + rnd() * 4 | 0; line([pts[k], [pts[k][0] + (rnd() - .5) * 120, pts[k][1] + 40 + rnd() * 60]], 2.5, `rgba(${col},.9)`); }); };
  // Villen-Hüüs's soldier. rot in radians, s scale, lit: rim colour
  const goon = (x, y, rot, s, o = {}) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s * (o.flip ? -1 : 1), s);
    const body = o.body || '#241c22', armour = o.armour || '#342a3a';
    fill('M-14 -40 L-26 0 L-12 0 L0 -26 L12 0 L26 0 L14 -40 Z', body); fill('M-18 -86 Q0 -96 18 -86 L16 -38 L-16 -38 Z', o.lit ? lin(-18, 0, 18, 0, [[0, armour], [1, o.lit]]) : armour); C(2, -102, 15, body);
    line([[14, -76], [46, -92]], 9, body); line([[-14, -76], [-42, -58]], 9, body); line([[46, -92], [70, -110]], 5, '#151015');
    g.fillStyle = o.visor || '#ff6a3a'; g.fillRect(-8, -106, 22, 6);
    if (o.ice) { g.fillStyle = 'rgba(190,225,250,.55)'; g.fillRect(-34, -124, 70, 128); line([[-34, -124], [36, -124], [36, 4]], 2, 'rgba(240,250,255,.8)'); }
    g.restore(); };
  // head in profile. face: 1 looks right, -1 looks left
  const head = (x, y, r, face, o) => { const f = face; g.save(); g.translate(x, y); g.scale(f, 1);
    const skin = o.skin || '#c8906a', shade = o.shade || '#6a4028';
    if (o.hairBack) fill(`M${-r * .9} ${-r * .3} Q${-r * 1.2} ${r * .8} ${-r * .4} ${r * 1.1} L0 ${r * .6} Z`, o.hairBack);
    fill(`M${-r} ${-r * .1} Q${-r} ${-r * 1.05} 0 ${-r} Q${r * .95} ${-r} ${r} ${-r * .15} Q${r * 1.02} ${r * .1} ${r * .98} ${r * .3} L${r * 1.28} ${r * .5} L${r * .98} ${r * .62} Q${r * .9} ${r} ${r * .2} ${r * 1.05} Q${-r * .8} ${r} ${-r} ${r * .3} Z`, lin(-r, 0, r * 1.3, 0, [[0, shade], [.5, skin], [1, o.light || skin]]));
    if (o.mask) fill(`M${-r * .2} ${-r * .7} Q${r * .8} ${-r * .8} ${r * 1.02} ${-r * .1} L${r * .98} ${r * .35} Q${r * .3} ${r * .5} ${-r * .2} ${r * .3} Z`, o.mask);
    E(r * .55, -r * .22, r * .14, r * .1, o.eye || '#1a100a'); if (o.eyeGlow) glow(() => soft(3, () => C(r * .55, -r * .22, r * .3, o.eyeGlow))); else C(r * .6, -r * .25, r * .045, '#fff8e8');
    line([[r * .35, -r * .45], [r * .8, -r * .5]], r * .1, o.brow || 'rgba(40,24,14,.8)');
    if (o.mouth === 'open') fill(`M${r * .55} ${r * .62} Q${r * .85} ${r * .6} ${r * 1.0} ${r * .66} Q${r * .9} ${r * .95} ${r * .62} ${r * .9} Z`, '#3a1410'); else line([[r * .62, r * .72], [r * .95, r * .7]], r * .07, 'rgba(70,30,20,.8)');
    if (o.beard) fill(`M${-r * .2} ${r * .5} Q${r * .5} ${r * .7} ${r * .95} ${r * .8} Q${r * .8} ${r * 1.8} ${r * .2} ${r * 2.1} Q${-r * .3} ${r * 1.6} ${-r * .2} ${r * .5} Z`, o.beard);
    if (o.moustache) fill(`M${r * .55} ${r * .58} Q${r * 1.0} ${r * .45} ${r * 1.15} ${r * .8} Q${r * .9} ${r * .7} ${r * .55} ${r * .7} Z`, o.moustache);
    if (o.hair) fill(`M${-r * 1.02} ${-r * .05} Q${-r * 1.1} ${-r * 1.15} ${r * .1} ${-r * 1.1} Q${r * .85} ${-r * 1.05} ${r * .95} ${-r * .5} Q${r * .3} ${-r * .75} ${-r * .3} ${-r * .55} Q${-r * .7} ${-r * .2} ${-r * .6} ${r * .4} Z`, o.hair);
    if (o.mohawk) { for (let i = 0; i < 6; i++) { const a = -2.6 + i * .32; const bx = Math.cos(a) * r * .95, by = Math.sin(a) * r * .95; poly([[bx - r * .14, by + r * .05], [bx + Math.cos(a) * r * .9, by + Math.sin(a) * r * .9], [bx + r * .14, by + r * .08]], o.mohawk); } }
    if (o.cap) { fill(`M${-r * 1.02} ${-r * .25} Q${-r * .9} ${-r * 1.25} ${r * .2} ${-r * 1.2} Q${r * .95} ${-r * 1.1} ${r * 1.02} ${-r * .45} L${r * 1.6} ${-r * .35} L${r} ${-r * .25} Z`, o.cap); }
    if (o.helmet) { fill(`M${-r * 1.15} ${-r * .05} Q${-r * 1.15} ${-r * 1.35} ${r * .1} ${-r * 1.32} Q${r * 1.2} ${-r * 1.25} ${r * 1.2} ${-r * .1} L${r * 1.3} ${-r * .02} L${-r * 1.25} ${r * .02} Z`, o.helmet); line([[-r * 1.2, 0], [r * 1.3, -r * .02]], r * .12, 'rgba(0,0,0,.35)'); }
    if (o.hood) fill(`M${-r * 1.4} ${r * 1.4} Q${-r * 1.6} ${-r * 1.4} ${r * .1} ${-r * 1.5} Q${r * 1.4} ${-r * 1.3} ${r * 1.45} ${r * .2} Q${r * 1.1} ${-r * .6} ${r * .1} ${-r * .8} Q${-r * .9} ${-r * .6} ${-r * .9} ${r * 1.4} Z`, o.hood);
    g.restore(); };
  return { lin, rad, fill, C, E, line, curve, soft, glow, poly, limb, sky, stars, hazeBands, halo, giant, billow, embers, shock, bolt, goon, head };
}
function canvasFor() { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; return [cv, cv.getContext('2d')]; }
