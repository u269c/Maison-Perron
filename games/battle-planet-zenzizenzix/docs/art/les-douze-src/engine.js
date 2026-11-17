// ---- 2. repaint it with brushstrokes ----
function paint(src, ctx, focalBoxes = []) {
  const d = src.data;
  const refCanvas = document.createElement('canvas'); refCanvas.width = W; refCanvas.height = H; const rc = refCanvas.getContext('2d', { willReadFrequently: true });
  const srcCanvas = document.createElement('canvas'); srcCanvas.width = W; srcCanvas.height = H; srcCanvas.getContext('2d').putImageData(src, 0, 0);
  const ref = px => { rc.filter = px ? `blur(${px}px)` : 'none'; rc.clearRect(0, 0, W, H); rc.drawImage(srcCanvas, 0, 0); return rc.getImageData(0, 0, W, H).data; };
  const idx = (x, y) => ((Math.min(H - 1, Math.max(0, y | 0)) * W) + Math.min(W - 1, Math.max(0, x | 0))) * 4;
  const toHsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const dd = mx - mn; s = l > .5 ? dd / (2 - mx - mn) : dd / (mx + mn); h = mx === r ? (g - b) / dd + (g < b ? 6 : 0) : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4; h /= 6; } return [h, s, l]; };
  const hsl = (h, s, l) => `hsl(${((h % 1 + 1) % 1 * 360).toFixed(1)},${(Math.max(0, Math.min(1, s)) * 100).toFixed(1)}%,${(Math.max(0, Math.min(1, l)) * 100).toFixed(1)}%)`;
  function colour(R, x, y, jit) {
    const i = idx(x, y); let r = R[i], g = R[i + 1], b = R[i + 2];
    let best = PAL[0], bd = 1e9; for (const p of PAL) { const dd = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2; if (dd < bd) { bd = dd; best = p; } }
    r += (best[0] - r) * .2; g += (best[1] - g) * .2; b += (best[2] - b) * .2;
    let [h, s, l] = toHsl(r, g, b);
    h += (rnd() - .5) * .035 * jit; s *= 1 + (rnd() - .5) * .3 * jit; l += (rnd() - .5) * .1 * jit;
    if (rnd() < .05) { if (l < .34) { h = .64 + (rnd() - .5) * .05; s = Math.min(Math.max(s, .18), .32); } else if (l > .6) { h = .11 + (rnd() - .5) * .04; s = Math.max(s, .45); l += .02; } }
    return hsl(h, s, l);
  }
  function layer(R, size, step, len, thresh, alpha, jit, box) {
    // gradient of this reference, for stroke direction
    const lum = i => .3 * R[i] + .59 * R[i + 1] + .11 * R[i + 2];
    const grad = (x, y) => { x = Math.min(W - 3, Math.max(2, x | 0)); y = Math.min(H - 3, Math.max(2, y | 0)); return [lum(idx(x + 2, y)) - lum(idx(x - 2, y)), lum(idx(x, y + 2)) - lum(idx(x, y - 2))]; };
    const cur = thresh ? ctx.getImageData(0, 0, W, H).data : null; const pts = [];
    const [bx, by, bw, bh] = box || [0, 0, W, H];
    for (let y = by; y < by + bh; y += step) for (let x = bx; x < bx + bw; x += step) {
      const px = x + (rnd() - .5) * step, py = y + (rnd() - .5) * step;
      if (thresh) { // only where the canvas still differs from the reference (detail goes where it's needed)
        let diff = 0; for (let k = 0; k < 3; k++) { const i = idx(px + (rnd() - .5) * step, py + (rnd() - .5) * step); diff += Math.abs(cur[i] - R[i]) + Math.abs(cur[i + 1] - R[i + 1]) + Math.abs(cur[i + 2] - R[i + 2]); }
        if (diff / 3 < thresh) continue; }
      pts.push([px, py]);
    }
    for (let i = pts.length - 1; i > 0; i--) { const j = rnd() * (i + 1) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [x0, y0] of pts) {
      // a curved stroke that follows the edges (perpendicular to the gradient)
      ctx.strokeStyle = colour(R, x0, y0, jit); ctx.globalAlpha = alpha * (.7 + rnd() * .3); ctx.lineWidth = size * (.65 + rnd() * .7);
      const L = len * (.6 + rnd() * .8), segs = 4, sl = L / segs; let x = x0, y = y0, la = null;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let k = 0; k < segs; k++) {
        const [gx, gy] = grad(x, y); let a; const m = Math.hypot(gx, gy);
        if (m < 3) a = (y < 620 ? -.12 : .06) + Math.sin(x * .008 + y * .011) * .45 + (rnd() - .5) * .3; else a = Math.atan2(gy, gx) + Math.PI / 2;
        if (la !== null && Math.cos(a - la) < 0) a += Math.PI; la = a;
        x += Math.cos(a) * sl; y += Math.sin(a) * sl; ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = '#7a5232'; ctx.fillRect(0, 0, W, H); // warm imprimatura
  layer(ref(16), 34, 20, 70, 0, .85, 1.3);
  layer(ref(8), 18, 10, 40, 26, .85, 1.15);
  layer(ref(3.5), 9, 6, 22, 24, .9, 1);
  layer(ref(1.2), 4.5, 3, 11, 30, .95, .8);
  const R0 = ref(0); focalBoxes.forEach(b => layer(R0, 2.6, 2, 7, 20, .95, .5, b));
  // impasto highlights on the brightest spots
  for (let i = 0; i < 3500; i++) { const x = rnd() * W, y = rnd() * H, j = idx(x, y); const l = .3 * d[j] + .59 * d[j + 1] + .11 * d[j + 2]; if (l > 222) { ctx.fillStyle = `rgba(255,248,226,${.25 + rnd() * .45})`; ctx.beginPath(); ctx.ellipse(x, y, 3 + rnd() * 5, 1.5, rnd() * Math.PI, 0, Math.PI * 2); ctx.fill(); } }
}

// ---- 3. varnish, canvas weave, vignette ----
function finish(ctx) {
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(232,196,128,.22)'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  const v = ctx.createRadialGradient(W * .45, H * .45, H * .3, W * .5, H * .5, H * .85); v.addColorStop(0, 'rgba(20,12,6,0)'); v.addColorStop(1, 'rgba(20,12,6,.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  const img = ctx.getImageData(0, 0, W, H), p = img.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; const weave = ((x % 4 < 2) !== (y % 4 < 2) ? 2.5 : -2.5) + (rnd() - .5) * 6; for (let k = 0; k < 3; k++) { let v = p[i + k] / 255; v = v < .5 ? 2 * v * v * .95 + v * .05 * 2 : 1 - 2 * (1 - v) * (1 - v) * .95 - (1 - v) * .05 * 2; v = .82 * (p[i + k] / 255) + .18 * v; p[i + k] = v * 255 + weave; } }
  ctx.putImageData(img, 0, 0);
  // a few cracks of craquelure, very faint
  ctx.strokeStyle = 'rgba(30,20,10,.08)'; ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) { let x = rnd() * W, y = rnd() * H; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (rnd() - .5) * 40; y += (rnd() - .5) * 40; ctx.lineTo(x, y); } ctx.stroke(); }
}

