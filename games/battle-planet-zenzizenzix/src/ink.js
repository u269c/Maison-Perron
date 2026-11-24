// =====================================================================
// INK — comic lettering, balloons, captions, speed lines, impact rays.
// Drawn on the overlay in a 960×540 space (the overlay is scaled by 2).
// =====================================================================
// ---- comic overlay: SFX, balloons, captions, speed lines -----------------
const FONT = ['900 {s}px Impact, "Arial Black", "DejaVu Sans", sans-serif', 'bold {s}px "Trebuchet MS", "DejaVu Sans", sans-serif', '900 {s}px Impact, "Arial Black", "DejaVu Sans", sans-serif', '900 italic {s}px Impact, "Arial Black", "DejaVu Sans", sans-serif', '600 {s}px Georgia, "DejaVu Serif", serif'];
const fnt = (si, s) => (FONT[si] || FONT[0]).replace('{s}', s);
function burst(c, x, y, rx, ry, n, rot, fill, stroke, lw) { c.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot + i / (n * 2) * Math.PI * 2, k = i % 2 ? .62 + ((i * 37) % 7) / 40 : 1; c.lineTo(x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k); } c.closePath(); c.fillStyle = fill; c.fill(); c.lineJoin = 'miter'; c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
function sfx(c, si, text, x, y, size, age, rot = -.12) {
  const pop = age < .07 ? age / .07 * 1.3 : Math.max(1, 1.3 - (age - .07) * 3), alpha = age > .5 ? Math.max(0, 1 - (age - .5) / .2) : 1; if (alpha <= 0) return;
  c.save(); c.globalAlpha = alpha; c.translate(x, y); c.rotate(rot); c.scale(pop, pop); c.font = fnt(si, size); c.textAlign = 'center'; c.textBaseline = 'middle'; const w = c.measureText(text).width;
  if (si === 0) { burst(c, 0, 0, w * .66 + 12, size * 1.15, 11, .2, '#fff6a0', OUT, 2.5); c.lineWidth = 6; c.strokeStyle = OUT; c.strokeText(text, 0, 0); c.fillStyle = '#e8302a'; c.fillText(text, 3, 3); c.fillStyle = '#ffd23f'; c.fillText(text, 0, 0); }
  if (si === 1) { c.lineWidth = 4; c.strokeStyle = '#1a1418'; c.strokeText(text, 0, 0); c.fillStyle = '#d8282a'; c.fillText(text, 0, 0); }
  if (si === 2) { c.fillStyle = '#c81a14'; c.beginPath(); c.moveTo(-w * .65, size * .5); c.lineTo(-w * .5, -size * .7); c.lineTo(w * .65, -size * .5); c.lineTo(w * .5, size * .7); c.fill(); c.lineWidth = 8; c.strokeStyle = '#0a0808'; c.strokeText(text, 0, 0); c.fillStyle = '#f6f0e6'; c.fillText(text, 0, 0); }
  if (si === 3) { c.transform(1, 0, -.25, 1, 0, 0); c.lineWidth = 10; c.strokeStyle = '#080808'; c.strokeText(text, 0, 0); c.fillStyle = '#ffffff'; c.fillText(text, 0, 0); }
  if (si === 4) { c.lineWidth = 5; c.strokeStyle = '#3a2420'; c.strokeText(text, 2, 2); c.lineWidth = 2; c.strokeStyle = '#2a1818'; c.strokeText(text, 0, 0); c.fillStyle = '#f0c060'; c.fillText(text, 0, 0); }
  c.restore(); }
function wrap(c, text, maxw) { const words = text.split(' '), lines = []; let cur = ''; for (const w of words) { const tt = cur ? cur + ' ' + w : w; if (c.measureText(tt).width > maxw && cur) { lines.push(cur); cur = w; } else cur = tt; } lines.push(cur); return lines; }
function balloon(c, si, text, hx, hy, side = 1, shout = 0, maxw = 150, alpha = 1) {
  const fs = si === 4 ? 13 : 14; c.font = si === 4 ? `italic 600 ${fs}px Georgia, serif` : `bold ${fs}px "Comic Neue", "Trebuchet MS", "DejaVu Sans", sans-serif`; if (si === 0 || si === 2) c.font = `bold ${fs}px "Arial Narrow", "DejaVu Sans Condensed", "DejaVu Sans", sans-serif`;
  const lines = wrap(c, text.toUpperCase(), maxw), w = Math.max(...lines.map(l => c.measureText(l).width)) + 22, h = lines.length * (fs + 3) + 14;
  let bx = hx + side * 28 - (side < 0 ? w : 0), by = hy - 50 - h; bx = Math.max(10, Math.min(950 - w, bx)); by = Math.max(10, by);
  const fill = si === 4 ? '#f6ecd4' : '#ffffff', ink = si === 4 ? '#3a2420' : '#0c0810';
  c.save(); c.globalAlpha = alpha; c.lineWidth = 2.5; c.strokeStyle = ink; c.fillStyle = fill;
  c.beginPath(); const tx = hx + side * 6, mx = Math.max(bx + 14, Math.min(bx + w - 14, hx)); c.moveTo(mx - 8, by + h - 2); c.lineTo(tx, hy - 14); c.lineTo(mx + 8, by + h - 2); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); if (shout) { burst(c, bx + w / 2, by + h / 2, w * .62, h * .78, 12, 0, fill, ink, 2.5); }
  else if (si === 1 || si === 4) { c.roundRect ? c.roundRect(bx, by, w, h, 8) : c.rect(bx, by, w, h); c.fill(); c.stroke(); }
  else if (si === 2) { c.rect(bx, by, w, h); c.fill(); c.stroke(); }
  else { c.ellipse(bx + w / 2, by + h / 2, w * .58, h * .66, 0, 0, 7); c.fill(); c.stroke(); }
  c.fillStyle = fill; c.fillRect(mx - 6, by + h - 6, 12, 6);
  c.fillStyle = ink; c.textAlign = 'center'; c.textBaseline = 'top'; lines.forEach((l, i) => c.fillText(l, bx + w / 2, by + 7 + i * (fs + 3)));
  c.restore(); }
function caption(c, si, text, x, y) {
  c.font = si === 4 ? 'italic 600 13px Georgia, serif' : si === 1 ? 'bold 13px "Trebuchet MS", sans-serif' : 'bold 13px "Arial Narrow", "DejaVu Sans Condensed", sans-serif'; const w = c.measureText(text).width + 20;
  const bgc = ['#ffe880', '#ffffff', '#0c0a0c', '#ffffff', '#f2e2c0'][si], fg = si === 2 ? '#f4ece0' : si === 4 ? '#3a2420' : '#0c0810';
  c.fillStyle = bgc; c.fillRect(x, y, w, 26); c.lineWidth = 2.5; c.strokeStyle = si === 4 ? '#3a2420' : '#0c0810'; c.strokeRect(x, y, w, 26); c.fillStyle = fg; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, x + 10, y + 13); }
let ACC = true;
function noirAt(t) { if (!ACC) return 0; const T4 = t % 4, T8 = t % 8; let n = 0; for (const at of [1.32, 1.55]) { const a = T4 - at; if (a >= 0 && a < .2) n = Math.max(n, 1 - a / .2); } const b = T8 - 6.2; if (b >= 0 && b < .3) n = Math.max(n, 1 - b / .3); return n * .85; }
function impact(c, x, y, age, big = 1) { const k = Math.min(1, age / .08), a = 1 - age / .35; if (a <= 0) return; c.save(); c.globalAlpha = a; c.translate(x, y);
  for (let i = 0; i < 18; i++) { const an = i / 18 * Math.PI * 2 + (i * 7 % 5) * .05, r0 = 14 * big, r1 = (60 + (i * 37 % 50)) * big * (.4 + k * .8), w = .07 + (i % 3) * .03; c.fillStyle = i % 3 === 0 ? '#c81a14' : '#0a0808'; c.beginPath(); c.moveTo(Math.cos(an - w) * r0, Math.sin(an - w) * r0); c.lineTo(Math.cos(an) * r1, Math.sin(an) * r1); c.lineTo(Math.cos(an + w) * r0, Math.sin(an + w) * r0); c.fill(); }
  c.restore(); }
function speedLines(c, x, y, a) { c.save(); c.globalAlpha = a; for (let i = 0; i < 70; i++) { c.fillStyle = i % 9 === 0 ? '#c81a14' : '#080808'; const an = i / 70 * Math.PI * 2 + (i * 13 % 7) * .01, r0 = 150 + (i * 53 % 90), r1 = 900, w = .006 + (i * 7 % 5) * .002; c.beginPath(); c.moveTo(x + Math.cos(an - w) * r1, y + Math.sin(an - w) * r1); c.lineTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0); c.lineTo(x + Math.cos(an + w) * r1, y + Math.sin(an + w) * r1); c.fill(); } c.restore(); }

