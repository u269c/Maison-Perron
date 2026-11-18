// ═══ CORE: the 480×270 pixel screen, the display, saving ═══
const LW = 480, LH = 270;
const cv = document.getElementById('c'), dctx = cv.getContext('2d');
const screen = mkC(LW, LH), sx = screen.getContext('2d'); sx.imageSmoothingEnabled = false;
const DISP = { s: 2, x: 0, y: 0, w: 960, h: 540, dpr: 1 };
function layout() { const dpr = Math.min(window.devicePixelRatio || 1, 2), W = Math.round(innerWidth * dpr), H = Math.round(innerHeight * dpr); cv.width = W; cv.height = H;
  let s = Math.min(W / LW, H / LH); if (s >= 2) s = Math.floor(s * 2) / 2; DISP.s = s; DISP.w = Math.round(LW * s); DISP.h = Math.round(LH * s); DISP.x = Math.round((W - DISP.w) / 2); DISP.y = Math.round((H - DISP.h) / 2); DISP.dpr = dpr; dctx.imageSmoothingEnabled = false; }
addEventListener('resize', layout); layout();
const Save = { key: 'perrocles:v04', d: { lang: 'fr', music: true, sfx: true, rumble: true, book: [], vases: {}, flags: {}, at: null },
  load() { try { const j = JSON.parse(localStorage.getItem(this.key) || 'null'); if (j) Object.assign(this.d, j); } catch (e) { } },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) { } } };
Save.load();
const NOW = { t: 0, dt: 1 / 60, frame: 0 };
const R2 = (x) => Math.round(x);
const choose = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];
