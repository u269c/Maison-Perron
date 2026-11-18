// ═══ GODS' NAMES: little clay tablets with fine, smooth lettering, drawn on the high-res layer ═══
// The God's view paints a name beside each revealed god, as on real vases. Pixel letters were hard to read,
// so each name is pressed into a small tablet of unfired clay, crisp at any screen size.
function drawNameTagsHi(c) { const T = G.tags; if (!T || !(G.tagA > 0)) return; const s = DISP.s; c.save(); c.beginPath(); c.rect(DISP.x, DISP.y, DISP.w, DISP.h); c.clip(); c.globalAlpha = Math.min(1, G.tagA * 1.4);
  for (const k in T) { const t = T[k], fs = 6.2 * s; c.font = `600 ${fs}px ${TXT.head}`; const sp = 0.9 * s, w = [...t.s].reduce((acc, ch) => acc + c.measureText(ch).width + sp, -sp), pw = w + 7 * s, ph = fs + 4.6 * s;
    const cx = DISP.x + (t.x - t.face * (13 + pw / s / 2)) * s, cy = DISP.y + (t.y + 4) * s, x0 = cx - pw / 2, y0 = cy - ph / 2, r = 1.8 * s;
    const rr = (dx, dy, w2, h2) => { c.beginPath(); c.moveTo(x0 + dx + r, y0 + dy); c.arcTo(x0 + dx + w2, y0 + dy, x0 + dx + w2, y0 + dy + h2, r); c.arcTo(x0 + dx + w2, y0 + dy + h2, x0 + dx, y0 + dy + h2, r); c.arcTo(x0 + dx, y0 + dy + h2, x0 + dx, y0 + dy, r); c.arcTo(x0 + dx, y0 + dy, x0 + dx + w2, y0 + dy, r); c.closePath(); };
    c.fillStyle = 'rgba(27,18,16,0.35)'; rr(0.8 * s, 1 * s, pw, ph); c.fill(); // its shadow on the vase
    const g = c.createLinearGradient(x0, y0, x0, y0 + ph); g.addColorStop(0, '#ecd9b8'); g.addColorStop(1, '#d4b88e'); c.fillStyle = g; rr(0, 0, pw, ph); c.fill();
    c.lineWidth = Math.max(1, 0.5 * s); c.strokeStyle = '#8a5a34'; c.stroke(); c.strokeStyle = 'rgba(255,248,230,0.7)'; c.lineWidth = Math.max(1, 0.35 * s); c.beginPath(); c.moveTo(x0 + r, y0 + 0.6 * s); c.lineTo(x0 + pw - r, y0 + 0.6 * s); c.stroke();
    // the letters, pressed in: a dark groove with a light lip below it
    c.textBaseline = 'middle'; let lx = cx - w / 2; const ly = cy + 0.3 * s; for (const ch of t.s) { c.fillStyle = 'rgba(255,246,226,0.75)'; c.fillText(ch, lx, ly + 0.45 * s); c.fillStyle = '#3a2416'; c.fillText(ch, lx, ly); lx += c.measureText(ch).width + sp; } }
  c.restore(); }
