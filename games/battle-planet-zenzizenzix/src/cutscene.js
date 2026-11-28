// =====================================================================
// CUTSCENES — the prologue. Stages and actors are drawn in a 960×540 space
// on the two print layers; balloons and captions go on the overlay.
// Past scenes print as 1870 engravings, the villain's lair in noir ink.
// =====================================================================
const CS = 2.35; // hero scale in cutscenes
const hid = w => w === 'A' ? CUT.a : CUT.b;
function hero(F, w, x, y, face, pose, t, o = {}) { drawHero(F, hid(w), x, y, face, CS * (o.s || 1), pose, t, o); return [x, y - heroHeight(hid(w), CS * (o.s || 1)) - 6]; }
function talkPose(t, who, me, base) { return who === me ? POSES.chat(t) : base; }
function sky(B, top, mid, bot, y1) { const g0 = B.createLinearGradient(0, 0, 0, y1); g0.addColorStop(0, top); g0.addColorStop(.6, mid); g0.addColorStop(1, bot); B.fillStyle = g0; B.fillRect(0, 0, 960, y1); }
function stars(B, n, h, t, seed = 1) { for (let i = 0; i < n; i++) { const x = (i * 137.5 + seed * 71) % 960, y = (i * 61.7 + seed * 13) % h, tw = Math.sin(t * 2 + i) > .7; B.fillStyle = tw ? '#fff' : '#c8c8f0'; B.fillRect(x, y, tw ? 2 : 1.4, tw ? 2 : 1.4); } }
function gearShape(c, x, y, r, rot, col = '#ffd86a', glow = 0) { if (glow) { c.fillStyle = `rgba(255,220,120,${glow * .4})`; c.beginPath(); c.arc(x, y, r * 2.2, 0, 7); c.fill(); } c.fillStyle = col; c.beginPath(); for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2 + rot, rr = k % 2 ? r * .72 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.5; c.stroke(); c.fillStyle = '#8a5a1a'; c.beginPath(); c.arc(x, y, r * .3, 0, 7); c.fill(); }
function groundBand(B, y, col, line) { B.fillStyle = col; B.fillRect(0, y, 960, 540 - y); if (line) { B.fillStyle = line; for (let k = 0; k < 9; k++) B.fillRect(0, y + 12 + k * k * 2.2, 960, 1.5); } }

// ---- stages ---------------------------------------------------------------
function stageHavre(B, t, opt = {}) {
  sky(B, '#1a2650', '#c07878', '#f2b880', 258);
  stars(B, 50, 130, t);
  // the giant planet and its ring
  B.save(); B.translate(220, 140); B.rotate(-.25); B.beginPath(); B.arc(0, 0, 130, 0, 7); B.save(); B.clip(); const bands = ['#f0d8a8', '#d8a878', '#f4e4bc', '#b8805a', '#e8c090', '#c89068']; for (let i = 0, y = -130; y < 130; i++) { B.fillStyle = bands[i % 6]; B.fillRect(-130, y, 260, 24); y += 20 + (i * 7) % 9; } B.fillStyle = 'rgba(20,10,40,.45)'; B.beginPath(); B.arc(-50, 40, 140, 0, 7); B.fill(); B.restore(); B.strokeStyle = OUT; B.lineWidth = 2; B.stroke(); B.strokeStyle = 'rgba(240,210,170,.75)'; B.lineWidth = 8; B.beginPath(); B.ellipse(0, 0, 220, 38, 0, 0, Math.PI); B.stroke(); B.restore();
  B.fillStyle = '#ffe2a0'; B.beginPath(); B.arc(480, 258, 32, Math.PI, 0); B.fill();
  // cliff, town, lighthouse
  poly(B, [[560, 258], [610, 232], [720, 214], [960, 208], [960, 258]], '#4a3a52');
  for (let i = 0, x = 612; x < 880; i++) { const w = 18 + (i * 7) % 10, h = 22 + (i * 13) % 26, y = 236 - (x > 700 ? 18 : 6); poly(B, [[x, y], [x + w, y], [x + w, y - h], [x + w / 2, y - h - 12], [x, y - h]], ['#d8b098', '#b89a8a', '#e8c8a0', '#9a8a9a'][i % 4]); B.fillStyle = Math.sin(i * 3 + Math.floor(t * .5)) > 0 ? '#ffd870' : '#3a2a3a'; B.fillRect(x + 4, y - h + 6, 4, 5); x += w + 3; }
  poly(B, [[896, 214], [912, 214], [909, 148], [899, 148]], '#f0ece4'); B.fillStyle = '#c83a32'; B.fillRect(898, 160, 12, 7); B.fillRect(899, 180, 11, 7); B.fillStyle = '#ffe890'; B.fillRect(899, 141, 10, 7);
  const bc = Math.cos(t * 1.1); B.save(); B.globalCompositeOperation = 'lighter'; B.fillStyle = `rgba(255,240,170,${.15 + .3 * Math.abs(bc)})`; B.beginPath(); B.moveTo(904, 144); B.lineTo(904 + bc * 420, 120); B.lineTo(904 + bc * 420, 168); B.fill(); B.restore();
  const sg = B.createLinearGradient(0, 258, 0, 340); sg.addColorStop(0, '#8a7a9a'); sg.addColorStop(1, '#2a3a5c'); B.fillStyle = sg; B.fillRect(0, 258, 960, 82);
  for (let r = 0; r < 8; r++) for (let k = 0; k < 12; k++) { const x = ((k * 97 + r * 41 + t * (10 + r * 6)) % 1000) - 20; B.fillStyle = r < 4 ? '#b8a8c0' : '#6a7a9a'; B.fillRect(x, 262 + r * 9, 6 + r * 2, 1.5); }
  if (!opt.noPier) { let y = 340; for (let i = 0; y < 540; i++) { const h = 10 + i * 3; B.fillStyle = i % 2 ? '#8a6a4a' : '#7a5c40'; B.fillRect(0, y, 960, h); B.fillStyle = '#4a3424'; B.fillRect(0, y + h - 1.5, 960, 1.5); y += h; } for (let k = 0; k < 13; k++) { B.fillStyle = '#3a2a22'; B.fillRect(k * 78 + 20, 318, 9, 26); } }
}
function stageFortress(B, t, S) {
  sky(B, '#1a0e1e', '#5a1e2a', '#c8582a', 380); stars(B, 30, 160, t, 3);
  for (let k = 0; k < 7; k++) { B.fillStyle = 'rgba(40,20,30,.6)'; B.beginPath(); B.arc((k * 170 + t * 12) % 1100 - 60, 120 + (k * 37) % 80, 50 + k * 6, 0, 7); B.fill(); }
  // walls and towers
  poly(B, [[0, 380], [0, 250], [140, 250], [140, 210], [190, 210], [190, 250], [520, 250], [520, 380]], '#2a1a24'); for (let k = 0; k < 13; k++) { B.fillStyle = '#2a1a24'; B.fillRect(k * 40, 238, 22, 14); }
  // the clock tower, its face spinning backwards until it breaks
  poly(B, [[640, 380], [650, 120], [790, 120], [800, 380]], '#3a2232'); poly(B, [[630, 124], [720, 40], [810, 124]], '#24141e');
  const broken = S.shatter !== undefined, cx = 720, cy = 200;
  disc(B, cx, cy, 58, broken ? '#2a1a1a' : '#f0e2b8'); if (!broken) { for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; B.fillStyle = OUT; B.fillRect(cx + Math.cos(a) * 48 - 2, cy + Math.sin(a) * 48 - 2, 4, 4); } const a1 = -t * 2.4, a2 = -t * .4; B.strokeStyle = OUT; B.lineWidth = 4; B.beginPath(); B.moveTo(cx, cy); B.lineTo(cx + Math.cos(a1) * 44, cy + Math.sin(a1) * 44); B.moveTo(cx, cy); B.lineTo(cx + Math.cos(a2) * 30, cy + Math.sin(a2) * 30); B.stroke(); B.fillStyle = 'rgba(255,200,120,.25)'; B.beginPath(); B.arc(cx, cy, 70 + Math.sin(t * 8) * 4, 0, 7); B.fill(); }
  else { B.strokeStyle = '#f0e2b8'; B.lineWidth = 2; for (let k = 0; k < 6; k++) { const a = k * 1.1; B.beginPath(); B.moveTo(cx, cy); B.lineTo(cx + Math.cos(a) * 56, cy + Math.sin(a) * 56); B.stroke(); } }
  groundBand(B, 380, '#3a2a2a', '#2a1c1c');
  for (let k = 0; k < 5; k++) { const x = 60 + k * 210, fl = Math.sin(t * 13 + k) * 4; B.fillStyle = '#ff8a2a'; B.beginPath(); B.moveTo(x - 14, 392); B.quadraticCurveTo(x, 360 - fl, x + 14, 392); B.fill(); B.fillStyle = '#ffd060'; B.beginPath(); B.moveTo(x - 7, 392); B.quadraticCurveTo(x, 372 - fl, x + 7, 392); B.fill(); }
}
function stagePalace(B, t) {
  B.fillStyle = '#e8d8b8'; B.fillRect(0, 0, 960, 400); B.fillStyle = '#d8c4a0'; B.fillRect(0, 0, 960, 60);
  for (let k = 0; k < 9; k++) { const x = 30 + k * 115; poly(B, [[x, 400], [x, 70], [x + 34, 70], [x + 34, 400]], '#f4ecd8'); B.fillStyle = 'rgba(120,90,60,.25)'; B.fillRect(x + 24, 70, 10, 330); poly(B, [[x - 8, 70], [x + 42, 70], [x + 38, 58], [x - 4, 58]], '#e0d0b0'); }
  for (let k = 0; k < 4; k++) { const x = 110 + k * 230, w = Math.sin(t * 1.5 + k) * 3; poly(B, [[x, 80], [x + 60, 80], [x + 60 + w, 250], [x + 30, 232], [x + w, 250]], '#a8282a'); B.strokeStyle = '#e8c060'; B.lineWidth = 2; B.beginPath(); B.moveTo(x + 30, 120); B.lineTo(x + 30, 170); B.moveTo(x + 14, 132); B.lineTo(x + 46, 132); B.stroke(); B.beginPath(); B.arc(x + 14, 146, 7, 0, Math.PI); B.arc(x + 46, 146, 7, 0, Math.PI); B.stroke(); }
  for (let y = 400; y < 540; y += 24) for (let x = 0; x < 960; x += 48) { B.fillStyle = ((x / 48 + y / 24) % 2) ? '#c8b088' : '#efe2c8'; B.fillRect(x, y, 48, 24); }
  poly(B, [[330, 400], [630, 400], [650, 430], [310, 430]], '#a8282a'); poly(B, [[400, 370], [560, 370], [580, 400], [380, 400]], '#c83a32');
}
function stageWorld(B, t, w) {
  const [c1, c2] = w.col; sky(B, c2, c1, c1, 400);
  switch (w.id) {
    case 'doree': for (let k = 0; k < 8; k++) { const x = (k * 160 + t * 20) % 1100 - 80, y = 120 + (k * 53) % 200; B.fillStyle = '#ffe08a'; for (let j = 0; j < 4; j++) { B.beginPath(); B.arc(x + j * 26, y - Math.sin(j) * 10, 24, 0, 7); B.fill(); } } break;
    case 'embrume': for (let k = 0; k < 10; k++) { B.fillStyle = 'rgba(200,190,220,.25)'; B.fillRect(0, 140 + k * 25 + Math.sin(t + k) * 6, 960, 12); } poly(B, [[560, 400], [560, 180], [880, 180], [880, 400]], '#2a2234'); B.fillStyle = Math.sin(t * 9) > -.6 ? '#ff4f8a' : '#5a1a3a'; B.font = 'bold 44px sans-serif'; B.fillText('BAR', 650, 250); break;
    case 'brasier': poly(B, [[200, 400], [430, 150], [500, 150], [760, 400]], '#3a1a12'); B.fillStyle = '#ff6a1a'; B.beginPath(); B.ellipse(465, 152, 36, 8, 0, 0, 7); B.fill(); for (let k = 0; k < 6; k++) { B.fillStyle = k % 2 ? '#ffb040' : '#ff5a1a'; B.beginPath(); B.arc(465 + Math.sin(t * 3 + k) * 20, 140 - ((t * 60 + k * 30) % 120), 6, 0, 7); B.fill(); } B.fillStyle = '#ff7a2a'; B.fillRect(440, 160, 16, 240); break;
    case 'fumerolle': { const h = Math.max(0, Math.sin(t * 1.7)) * 260; B.fillStyle = 'rgba(230,250,250,.85)'; B.beginPath(); B.moveTo(450, 400); B.quadraticCurveTo(470, 400 - h, 500, 400); B.fill(); for (let k = 0; k < 8; k++) { B.fillStyle = 'rgba(220,240,240,.5)'; B.beginPath(); B.arc(470 + Math.sin(k + t) * 30, 380 - h * (k / 8), 20 + k * 3, 0, 7); B.fill(); } break; }
    case 'crepuscule': B.fillStyle = '#ffd890'; B.fillRect(0, 0, 480, 400); B.fillStyle = '#141838'; B.fillRect(480, 0, 480, 400); stars(B, 40, 380, t, 9); B.fillStyle = '#fff2b0'; B.beginPath(); B.arc(240, 200, 50, 0, 7); B.fill(); B.fillStyle = '#e0e8ff'; for (let k = 0; k < 5; k++) poly(B, [[560 + k * 80, 400], [585 + k * 80, 280 - k * 10], [610 + k * 80, 400]], '#cfe0f0'); break;
    case 'anneau': B.strokeStyle = '#5a6a80'; B.lineWidth = 30; B.beginPath(); B.arc(480, 900, 820, Math.PI * 1.15, Math.PI * 1.85); B.stroke(); for (let k = 0; k < 10; k++) { B.fillStyle = Math.sin(k * 2 + Math.floor(t)) > 0 ? '#ffd870' : '#3a4050'; B.fillRect(120 + k * 75, 200 + Math.abs(k - 4.5) * 14, 30, 22); } poly(B, [[620, 400], [630, 330], [760, 330], [770, 400]], '#4a6a4a'); poly(B, [[612, 334], [778, 334], [770, 316], [620, 316]], '#3a5a3a'); break;
    case 'havre': stageHavre(B, t, { noPier: true }); break;
    case 'inconnue': stars(B, 120, 400, t, 5); B.fillStyle = 'rgba(255,255,255,.15)'; B.font = 'bold 200px Georgia, serif'; B.fillText('?', 400, 300); break;
  }
  groundBand(B, 400, w.id === 'brasier' ? '#2a1410' : w.id === 'inconnue' ? '#14141e' : shadeC(c2, .1), shadeC(c2, -.2));
}
function stageRetire(B, F, t, prop, ox, me, who, li, lt, S) { // one half of the split screen
  const x0 = ox, cx = ox + 240; B.save(); B.beginPath(); B.rect(ox, 0, 480, 540); B.clip(); F.save(); F.beginPath(); F.rect(ox, 0, 480, 540); F.clip();
  const talk = who === me, base = POSES.idle(t, me === 'A' ? 1 : 4); let pose = talk ? POSES.chat(t) : base, hx = cx, o = {}, fl = 400;
  switch (prop) {
    case 'ship': sky(B, '#3a5a8a', '#f2c8a0', '#f2c8a0', 330); B.fillStyle = '#3a5a7a'; B.fillRect(x0, 330, 480, 210); poly(B, [[x0 + 40, 400], [x0 + 440, 400], [x0 + 400, 470], [x0 + 80, 470]], '#6a4426'); B.fillStyle = '#efe6d2'; B.fillRect(x0 + 300, 300, 120, 30); B.fillStyle = '#a8302a'; B.font = 'bold 16px Georgia'; B.fillText(LANG === 'fr' ? 'LE REGRET GOURMAND' : 'THE GOURMET REGRET', x0 + 120, 392); poly(B, [[x0 + 220, 400], [x0 + 222, 230], [x0 + 230, 230], [x0 + 228, 400]], '#4a2a16'); fl = 400; pose = talk ? POSES.chat(t) : POSES.check(t); break;
    case 'bingo': B.fillStyle = '#c8b898'; B.fillRect(x0, 0, 480, 400); for (let k = 0; k < 15; k++) { B.fillStyle = (k * 7 + Math.floor(t * 2)) % 5 === 0 ? '#ffd23f' : '#efe6d2'; B.beginPath(); B.arc(x0 + 60 + (k % 5) * 30, 80 + Math.floor(k / 5) * 30, 12, 0, 7); B.fill(); } B.fillStyle = '#141010'; B.fillRect(x0 + 330, 300, 60, 100); B.fillStyle = '#3a2a2a'; B.beginPath(); B.arc(x0 + 360, 340, 20, 0, 7); B.fill(); B.fillStyle = '#8a7a5a'; B.fillRect(x0, 400, 480, 140); pose = talk ? POSES.point(t) : POSES.tap(t); break;
    case 'pottery': B.fillStyle = '#a88a6a'; B.fillRect(x0, 0, 480, 400); for (let k = 0; k < 6; k++) { B.fillStyle = ['#c87a4a', '#a8603a', '#d89a6a'][k % 3]; B.beginPath(); B.ellipse(x0 + 60 + k * 30, 150, 12, 18, 0, 0, 7); B.fill(); } B.fillStyle = '#6a5040'; B.fillRect(x0, 400, 480, 140); poly(B, [[x0 + 300, 400], [x0 + 330, 380], [x0 + 370, 380], [x0 + 400, 400]], '#5a4a3a'); B.fillStyle = '#c87a4a'; B.beginPath(); B.ellipse(x0 + 350, 372 - Math.abs(Math.sin(t)) * 4, 16 + Math.sin(t * 3) * 3, 12, 0, 0, 7); B.fill(); pose = POSES.kneel(t); hx = cx - 20; break;
    case 'flats': sky(B, '#3a4a7a', '#f2b880', '#f2b880', 300); B.fillStyle = '#c8a080'; B.fillRect(x0, 300, 480, 240); for (let k = 0; k < 8; k++) { B.fillStyle = 'rgba(255,230,190,.35)'; B.fillRect(x0 + ((k * 90 + t * 40) % 480), 330 + k * 22, 40, 2); } o.speed = 1; o.walk = t * 8; hx = cx + Math.sin(t * .8) * 120; fl = 470; break;
    case 'guitar': B.fillStyle = '#d8c8a8'; B.fillRect(x0, 0, 480, 400); B.fillStyle = '#4a6a4a'; B.fillRect(x0 + 40, 60, 200, 110); B.fillStyle = '#efe6d2'; B.font = '14px Georgia'; B.fillText('♪ ♫ ♪', x0 + 100, 120); poly(B, [[x0 + 420, 400], [x0 + 424, 80], [x0 + 430, 80], [x0 + 434, 400]], '#8a8a92'); B.fillStyle = '#8a7a5a'; B.fillRect(x0, 400, 480, 140); for (let k = 0; k < 3; k++) { const kx = x0 + 300 + k * 40; disc(F, kx, 430, 8, '#e0b090'); limb(F, [[kx, 438], [kx, 460]], 6, ['#4a6aa8', '#a84a6a', '#6aa84a'][k]); } o.swing = 1; pose = talk ? POSES.chat(t) : POSES.tap(t); hx = cx - 60; break;
    case 'park': sky(B, '#7ab0d8', '#c8e0e8', '#c8e0e8', 330); B.fillStyle = '#6a9a4a'; B.fillRect(x0, 330, 480, 210); for (let k = 0; k < 4; k++) { const tx = x0 + 40 + k * 120; B.fillStyle = '#5a3a1a'; B.fillRect(tx, 250, 10, 90); B.fillStyle = '#4a8a3a'; B.beginPath(); B.arc(tx + 5, 240, 34, 0, 7); B.fill(); } const sq = (t * 60) % 600 - 60; B.fillStyle = '#a8603a'; B.beginPath(); B.ellipse(x0 + sq, 440, 8, 5, 0, 0, 7); B.fill(); o.s = 1.5; fl = 430; break;
    case 'fridge': B.fillStyle = '#e8e0d0'; B.fillRect(x0, 0, 480, 400); B.fillStyle = '#c8c8d0'; B.fillRect(x0 + 300, 150, 120, 250); for (let k = 0; k < 24; k++) { B.fillStyle = ['#c83a3a', '#3a6ac8', '#e8c040', '#3aa85a'][k % 4]; B.fillRect(x0 + 306 + (k % 6) * 18, 160 + Math.floor(k / 6) * 26 + Math.sin(t * 3 + k) * (k % 5 === 0 ? 2 : 0), 10, 10); } B.fillStyle = '#b8a888'; B.fillRect(x0, 400, 480, 140); pose = talk ? POSES.chat(t) : POSES.flex(t); hx = cx - 60; break;
    case 'knit': B.fillStyle = '#c8a888'; B.fillRect(x0, 0, 480, 400); B.fillStyle = '#8a5a4a'; B.fillRect(x0, 400, 480, 140); poly(B, [[x0 + 160, 400], [x0 + 160, 300], [x0 + 300, 300], [x0 + 300, 400]], '#6a3a3a'); for (let k = 0; k < 9; k++) { B.fillStyle = ['#c84a4a', '#4a8ac8', '#e8c040', '#5aa85a', '#c87ad8'][k % 5]; B.fillRect(x0 + 330 + (k % 3) * 34, 390 - Math.floor(k / 3) * 20, 32, 18); } for (let k = 0; k < 3; k++) { F.fillStyle = ['#c84a4a', '#4a8ac8', '#e8c040'][k]; F.beginPath(); F.arc(x0 + 120 + k * 22, 460, 10, 0, 7); F.fill(); } pose = POSES.kneel(t); pose.aF = [1.2 + Math.sin(t * 8) * .15, 1.3]; pose.aB = [1, 1.4 + Math.cos(t * 8) * .15]; break;
    case 'spa': B.fillStyle = '#b87a4a'; B.fillRect(x0, 0, 240, 400); for (let k = 0; k < 12; k++) { B.fillStyle = 'rgba(80,40,20,.4)'; B.fillRect(x0, k * 34, 240, 2); } B.fillStyle = '#cfe8f4'; B.fillRect(x0 + 240, 0, 240, 400); for (let k = 0; k < 8; k++) for (let j = 0; j < 6; j++) { B.fillStyle = 'rgba(255,255,255,.6)'; B.fillRect(x0 + 244 + j * 40, k * 50 + 4, 36, 2); } for (let k = 0; k < 6; k++) { B.fillStyle = 'rgba(255,255,255,.5)'; B.beginPath(); B.arc(x0 + 60 + k * 25, 300 - ((t * 30 + k * 40) % 200), 12, 0, 7); B.fill(); } B.fillStyle = '#7a6a5a'; B.fillRect(x0, 400, 480, 140); pose = talk ? POSES.chat(t) : POSES.stretch(t); break;
    case 'pond': sky(B, '#8ab8d8', '#d8e8e8', '#d8e8e8', 330); B.fillStyle = '#7aa85a'; B.fillRect(x0, 330, 480, 210); B.fillStyle = '#4a7a9a'; B.beginPath(); B.ellipse(x0 + 240, 450, 180, 40, 0, 0, 7); B.fill(); const jx = x0 + 480 - ((t * 140) % 560); disc(F, jx, 380, 7, '#e0b090'); limb(F, [[jx, 388], [jx, 412]], 6, '#c83a3a'); limb(F, [[jx, 412], [jx - 6 + Math.sin(t * 20) * 6, 428]], 3, '#2a2a3a'); o.speed = 1; o.atk = Math.sin(t * 6) > 0; hx = jx + 60; fl = 420; break;
    case 'junk': B.fillStyle = '#a89878'; B.fillRect(x0, 0, 480, 400); for (let k = 0; k < 20; k++) { B.fillStyle = ['#7a6a5a', '#5a6a7a', '#8a5a3a', '#a8a8b0'][k % 4]; B.fillRect(x0 + 20 + (k % 5) * 50, 200 + Math.floor(k / 5) * 48, 40 + (k % 3) * 6, 36); } B.fillStyle = '#efe6d2'; B.fillRect(x0 + 280, 60, 170, 40); B.fillStyle = '#a8302a'; B.font = 'bold 22px Georgia'; B.fillText(LANG === 'fr' ? 'BROCANTE' : 'JUNK SHOP', x0 + 300, 88); B.fillStyle = '#6a5a4a'; B.fillRect(x0, 400, 480, 140); pose = talk ? POSES.point(t) : POSES.scratch(t); hx = cx + 80; break;
    case 'cabin': sky(B, '#5a7aa8', '#f2c8a0', '#f2c8a0', 320); B.fillStyle = '#3a5a7a'; B.fillRect(x0, 320, 480, 60); poly(B, [[x0 + 20, 320], [x0 + 20, 220], [x0 + 90, 170], [x0 + 160, 220], [x0 + 160, 320]], '#6a4426'); B.fillStyle = '#4a7a3a'; B.fillRect(x0, 380, 480, 160); poly(B, [[x0 + 220, 360], [x0 + 380, 360], [x0 + 360, 372], [x0 + 240, 372]], '#a8302a'); B.fillStyle = '#2a2a2a'; B.fillRect(x0 + 340, 400, 50, 30); for (let k = 0; k < 4; k++) { B.fillStyle = 'rgba(200,200,200,.5)'; B.beginPath(); B.arc(x0 + 365 + Math.sin(t * 2 + k) * 6, 390 - ((t * 30 + k * 20) % 80), 8 + k * 2, 0, 7); B.fill(); } pose = talk ? POSES.salute(t) : POSES.check(t); hx = cx + 50; break;
  }
  S.anchor[me] = hero(F, me, hx, fl + 40, me === 'A' ? 1 : -1, pose, t, o);
  B.restore(); F.restore();
}
function stageLair(B, t) {
  B.fillStyle = '#6a5a78'; B.fillRect(0, 0, 960, 540);
  for (let k = 0; k < 14; k++) { B.fillStyle = k % 2 ? '#7a6a88' : '#5a4a68'; B.beginPath(); B.arc((k * 97) % 960, 40 + (k * 53) % 120, 60 + k * 4, 0, 7); B.fill(); }
  for (let k = 0; k < 2; k++) { const x = 170 + k * 520; poly(B, [[x, 120], [x + 180, 120], [x + 180, 240], [x, 240]], '#2a2a3a'); B.fillStyle = '#b8d8f0'; B.fillRect(x + 8, 128, 164, 104); }
  poly(B, [[400, 400], [400, 220], [430, 180], [530, 180], [560, 220], [560, 400]], '#3a1a2a'); B.fillStyle = '#c8963a'; B.fillRect(420, 230, 120, 6);
  B.fillStyle = '#4a3e52'; B.fillRect(0, 400, 960, 140); B.fillStyle = '#4a3a3a'; B.fillRect(620, 380, 90, 20); B.fillStyle = '#8a7a6a'; B.beginPath(); B.ellipse(665, 378, 16, 5, 0, 0, 7); B.fill(); for (let k = 0; k < 3; k++) { B.fillStyle = 'rgba(200,200,220,.35)'; B.beginPath(); B.arc(665 + Math.sin(t * 2 + k) * 4, 365 - ((t * 20 + k * 12) % 36), 5, 0, 7); B.fill(); }
}

// ---- the shots ---------------------------------------------------------
const CUT = { shots: [], i: 0, t: 0, li: -1, lt: 0, fade: 0, S: null, a: '', b: '', done: null };
function lineDur(l) { if (!l) return 0; const s = l[LANG] || ''; return Math.min(6.5, Math.max(l.who === 'NAR' ? 2.6 : 1.9, 1.1 + s.length * .052)); }
function buildShots(st) {
  const shots = [];
  // 1. the past: the last battle, the Clock breaks, he runs, we count the pieces
  const vhDefeat = st.past.findIndex(l => l.who === 'VH');
  shots.push({ style: 6, floor: 380, lines: st.past, draw(B, F, t, li, lt, S) {
    stageFortress(B, t, S);
    const fighting = li <= 0, cur = st.past[li] || {};
    // the soldiers going down in the first seconds
    for (let k = 0; k < 4; k++) { const L = S.goons[k], t0 = k * .7 + .4, a = S.T - t0; let x = 430 + k * 55, y = 450 + (k % 2) * 18, pose;
      if (a < 0) pose = POSES.guard(t, k); else if (a < .55) { pose = POSES.tumble(a / .55, k); pose.rot = -a * 4; x += a * 160; y -= Math.sin(a / .55 * Math.PI) * 60; } else { pose = POSES.down(t, k); x += 88; }
      drawRig(F, x, y, -1, CS * .95, L, pose, t, { lieDir: k % 2 ? 1 : -1 }); }
    const ap = fighting ? (Math.floor(S.T * 2.4) % 3 === 0 ? POSES.jab((S.T * 2.4) % 1) : Math.floor(S.T * 2.4) % 3 === 1 ? POSES.cross((S.T * 2.4) % 1) : POSES.swing((S.T * 2.4) % 1)) : null;
    const pieces = S.pieces !== undefined;
    S.anchor.A = hero(F, 'A', 330, 450, 1, ap || talkPose(t, cur.who, 'A', pieces ? POSES.look(t) : POSES.guard(t, 1)), t, { atk: fighting });
    S.anchor.B = hero(F, 'B', 220, 468, 1, fighting ? (Math.floor(S.T * 2 + 1) % 2 ? POSES.kick((S.T * 2) % 1) : POSES.jab((S.T * 2) % 1)) : talkPose(t, cur.who, 'B', POSES.idle(t, 3)), t, { atk: fighting });
    // Villen-Hüüs: fights, kneels, runs to his pod
    let vx = 660, vp = fighting ? POSES.strikeMelee((S.T * 1.3) % 1) : POSES.kneel(t), vo = { cane: true, flow: 0 };
    if (S.flee !== undefined) { const a = S.T - S.flee; vx = 660 + Math.min(1, a / 1.1) * 190; vp = a < 1.1 ? POSES.flee(t) : null; }
    if (vp) { drawRig(F, vx, 440, S.flee !== undefined ? 1 : -1, CS, VILLEN, vp, t, { ...vo, shout: cur.who === 'VH' }); S.anchor.VH = [vx, 440 - 170]; }
    const podY = S.flee === undefined ? 0 : Math.max(0, (S.T - S.flee - 1.2) * 260); poly(F, [[840, 452 - podY], [880, 452 - podY], [886, 400 - podY], [860, 370 - podY], [834, 400 - podY]], '#4a3a52'); F.fillStyle = '#ffd86a'; F.fillRect(852, 396 - podY, 16, 10);
    if (podY > 0) { F.fillStyle = '#ffb040'; F.beginPath(); F.moveTo(846, 452 - podY); F.lineTo(860, 500 - podY + Math.random() * 20); F.lineTo(874, 452 - podY); F.fill(); }
    // the Clock in pieces: eight gears on the ground, a ninth slipping into the pod
    if (S.shatter !== undefined) { const a = S.T - S.shatter; for (let k = 0; k < 8; k++) { const tx = 200 + k * 85, ty = 492 + (k % 3) * 10, u = Math.min(1, a / 1.2); gearShape(F, lerp(720, tx, u), lerp(200, ty, u) - Math.sin(u * Math.PI) * 120, 8, t * (1 - u) * 6, '#ffd86a', pieces ? .6 + Math.sin(t * 5 + k) * .4 : 0); }
      const u9 = Math.min(1, a / 1.6); if (S.flee === undefined || S.T - S.flee < 1.2) gearShape(F, lerp(720, 690, u9), lerp(200, 430, u9) - Math.sin(u9 * Math.PI) * 60, 7, t * 4, '#ffd86a'); }
  }, on(l, i, S) { if (i === vhDefeat) { S.shatter = S.T; WORLD.noir = .9; SHAKE_CUT = .6; INKFX.push({ k: 'acc', x: 720, y: 200, t: 0 }, { k: 'sfx', text: LANG === 'fr' ? 'KRAKABOUM !' : 'KRAKABOOM!', x: 700, y: 120, size: 44, t: 0, strong: true }); } if (l.ev === 'flee') S.flee = S.T; if (l.ev === 'pieces') S.pieces = S.T; }, init(S) { S.goons = [0, 1, 2, 3].map(k => makeGoonLook('trooper', 900 + k * 7)); } });
  // 2. the ceremony
  shots.push({ style: 6, floor: 400, lines: st.cer, draw(B, F, t, li, lt, S) {
    stagePalace(B, t); const cur = st.cer[li] || {};
    const toward = S.recv === 'B' ? 1 : -1;
    drawRig(F, 480, 372, toward, CS * 1.05, EMPEROR, cur.who === 'CEL' ? POSES.chat(t) : POSES.idle(t, 2), t, { shout: cur.who === 'CEL' && /!/.test(cur[LANG] || '') }); S.anchor.CEL = [480, 372 - 165];
    for (const w of ['A', 'B']) { const x = w === 'A' ? 360 : 600, cheering = S.cheer !== undefined && S.T - S.cheer < 2, got = S.medal[w] !== undefined && S.T - S.medal[w] < 1.4;
      const pose = cheering || got ? POSES.cheer(t + (w === 'A' ? 0 : .3)) : talkPose(t, cur.who, w, POSES.salute(t)); S.anchor[w] = hero(F, w, x, 432, w === 'A' ? 1 : -1, pose, t);
      if (S.medal[w] !== undefined) { const hh = heroHeight(hid(w), CS); F.fillStyle = '#c83a3a'; F.fillRect(x - 2, 432 - hh * .62 - 10, 4, 10); gearShape(F, x, 432 - hh * .62, 5, 0, '#ffd23f', .3); } }
    if (S.aside !== undefined) { const a = S.T - S.aside, x = Math.max(780, 1010 - a * 160); drawRig(F, x, 450, -1, CS, COMMANDER, x > 780 ? POSES.walk(t, 1) : cur.who === 'CMD' ? POSES.chat(t) : POSES.idle(t), t, { shout: cur.who === 'CMD' }); S.anchor.CMD = [x, 450 - 140]; }
    // the crowd, bobbing and cheering
    for (let r = 0; r < 2; r++) for (let k = 0; k < 15; k++) { const x = k * 66 + (r ? 33 : 0) + Math.sin(k) * 8, jump = S.cheer !== undefined && S.T - S.cheer < 2.5 ? Math.abs(Math.sin(t * 9 + k)) * 14 : Math.sin(t * 2 + k) * 2, y = 540 - r * 26 - jump;
      disc(F, x, y - 22, 14, ['#e0b090', '#c88a62', '#a86a4a', '#f0c8a0', '#7a4a32'][(k + r) % 5]); poly(F, [[x - 18, y + 10], [x - 14, y - 8], [x + 14, y - 8], [x + 18, y + 10]], ['#5a6aa8', '#a85a5a', '#5aa86a', '#a8a85a', '#8a5aa8'][(k * 3 + r) % 5]);
      if (S.cheer !== undefined && S.T - S.cheer < 2.5 && (k + r) % 3 === 0) limb(F, [[x + 10, y - 6], [x + 16, y - 30 - jump * .3]], 4, '#e0b090'); }
    if (S.cheer !== undefined) { const a = S.T - S.cheer; for (let k = 0; k < 60; k++) { const x = (k * 97 + a * 30 * (k % 3 - 1)) % 960, y = (a * (80 + k % 5 * 30) + k * 31) % 540; F.fillStyle = ['#ffd23f', '#e8302a', '#3a8ac8', '#5ac85a'][k % 4]; F.fillRect(x, y, 6, 3); } }
  }, on(l, i, S) { if (l.ev === 'medalA' || l.ev === 'medalB') { const w = l.ev.slice(5); S.recv = w; S.medal[w] = S.T + .6; } if (l.ev === 'cheer') { S.cheer = S.T; INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'HOURRA !' : 'HOORAY!', x: 480, y: 120, size: 40, t: 0 }); } if (l.ev === 'aside') S.aside = S.T; }, init(S) { S.medal = {}; } });
  // 3. the hiding montage: one quick panel per world
  st.hide.forEach((h, k) => { const lines = [{ who: 'NAR', ...h.cap }, ...(h.line ? [h.line] : [])]; const who = h.line ? h.line.who : (k % 2 ? 'B' : 'A');
    shots.push({ style: 6, floor: 400, lines, minDur: 2.2, fast: true, draw(B, F, t, li, lt, S) {
      stageWorld(B, t, h.world); const cur = lines[li] || {}, other = who === 'A' ? 'B' : 'A';
      S.anchor[other] = hero(F, other, 300, 460, 1, talkPose(t, cur.who, other, POSES.look(t)), t);
      const kneel = S.T < 1.6; S.anchor[who] = hero(F, who, 480, 470, -1, kneel ? POSES.kneel(t) : talkPose(t, cur.who, who, POSES.idle(t, 2)), t);
      const sink = Math.min(1, Math.max(0, (S.T - .6) / 1.2)); if (sink < 1) gearShape(F, 456, 470 + sink * 20, 8 * (1 - sink * .6), t * 2, '#ffd86a', 1 - sink);
    } }); });
  // 4. thirty years of peace: the split screen
  const ret = st.ret, rlines = [ret.cap, { who: 'NAR', side: 'L', ...ret.A.cap }, ret.A.line, { who: 'NAR', side: 'R', ...ret.B.cap }, ret.B.line, ...ret.pair];
  shots.push({ style: 4, floor: 440, lines: rlines, split: true, draw(B, F, t, li, lt, S) { const cur = rlines[li] || {};
    stageRetire(B, F, t, VOICE[CUT.a].retire.prop, 0, 'A', cur.who, li, lt, S); stageRetire(B, F, t, VOICE[CUT.b].retire.prop, 480, 'B', cur.who, li, lt, S); } });
  // 5. the lair: he talks, she listens
  shots.push({ style: 2, floor: 400, lines: st.lair, draw(B, F, t, li, lt, S) {
    const cur = st.lair[li] || {}, z = S.zoom !== undefined ? 1 + Math.min(1, (S.T - S.zoom) / 1.2) * 1.6 : 1, zx = 560, zy = 280;
    B.save(); F.save(); for (const c of [B, F]) { c.translate(zx, zy); c.scale(z, z); c.translate(-zx, -zy); }
    stageLair(B, t);
    // his two old enemies on the wall screens
    for (const [w, x] of [['A', 260], ['B', 780]]) { F.save(); F.beginPath(); F.rect(x - 82, 128, 164, 104); F.clip(); hero(F, w, x, 250, w === 'A' ? 1 : -1, POSES.idle(t, 1), t, { s: .55 }); F.restore(); }
    const talking = cur.who === 'VH', pace = talking && S.zoom === undefined ? Math.sin(S.T * .7) : S.lastPace || 0; if (talking) S.lastPace = pace;
    const vx = 480 + pace * 90, vface = Math.cos(S.T * .7) * (talking ? 1 : 0) > 0 ? 1 : -1;
    const vp = S.zoom !== undefined ? PZ({ sp: -.1, nk: -.3, aF: [2.6, .5], aB: [.3, .5], lF: [.2, -.1], lB: [-.2, -.1] }) : talking ? (Math.abs(Math.cos(S.T * .7)) > .3 ? POSES.walk(S.T * .45, .6) : POSES.bang(t)) : POSES.idle(t, 2);
    drawRig(F, vx, 452, S.zoom !== undefined ? 1 : vface, CS * 1.05, VILLEN, vp, t, { shout: talking, gear: S.zoom !== undefined, cane: S.zoom === undefined }); S.anchor.VH = [vx, 452 - 170];
    const mp = cur.who === 'MMF' ? POSES.check(t) : POSES.idle(t, 7); drawRig(F, 760, 452, -1, CS, MADAME, mp, t, { smile: /sourit|smiles/.test(cur[LANG] || '') }); S.anchor.MMF = [760, 452 - 90];
    B.restore(); F.restore();
  }, on(l, i, S) { if (l.ev === 'gear') { S.zoom = S.T; WORLD.noir = .9; INKFX.push({ k: 'acc', x: 560, y: 280, t: 0 }); } } });
  // 6. the 3×3 grid: he takes the gears back, one world at a time; square 7 is home
  const glines = [{ who: 'NAR', fr: 'Un rouage. Puis deux. Puis six…', en: 'One gear. Then two. Then six…' }];
  shots.push({ style: 4, floor: -999, lines: glines, minDur: 7.4, grid: true, draw(B, F, t, li, lt, S) {
    B.fillStyle = '#f4ead8'; B.fillRect(0, 0, 960, 540);
    const zoom = Math.max(0, Math.min(1, (S.T - 5.9) / 1.2)), z = ease(zoom), pw = 300, ph = 165, gx = 15, gy = 15;
    const tx = gx + 0 * (pw + gx), ty = gy + 2 * (ph + gy); // square 7: bottom row, left
    for (const c of [B, F]) { c.save(); const sc = lerp(1, 960 / pw, z); c.translate(lerp(0, -tx * sc, z), lerp(0, -ty * sc, z)); c.scale(sc, sc); }
    for (let k = 0; k < 9; k++) { const col = k % 3, row = (k / 3) | 0, x = gx + col * (pw + gx), y = gy + row * (ph + gy), shown = S.T > k * .78 + .2;
      B.save(); B.beginPath(); B.rect(x, y, pw, ph); B.clip(); B.fillStyle = '#0c0a10'; B.fillRect(x, y, pw, ph);
      if (k < 7 && shown) { const w = WORLDS8[k === 6 ? 6 : k]; B.translate(x, y); B.scale(pw / 960, ph / 540); stageWorld(B, t + k, w); B.restore();
        F.save(); F.beginPath(); F.rect(x, y, pw, ph); F.clip(); F.translate(x, y); F.scale(pw / 960, ph / 540);
        const a = S.T - (k * .78 + .2), punch = a < .9; drawRig(F, 480, 470, -1, CS * 1.1, VILLEN, punch ? POSES.strikeHeavy((a * 1.6) % 1) : PZ({ sp: -.1, nk: -.3, aF: [2.6, .5], aB: [.3, .5] }), t, { gear: !punch, shout: true });
        if (punch && a > .35) for (let j = 0; j < 6; j++) { F.fillStyle = '#5a4a3a'; F.fillRect(380 - j * 20 - a * 80, 440 - Math.sin(j + a * 6) * 60, 14, 10); }
        if (k < 6) { F.fillStyle = '#0c0a10'; F.font = 'bold 54px Impact, sans-serif'; F.fillText(String(k + 1), 30, 70); }
        F.restore(); }
      else { B.restore(); if (k === 7) { B.fillStyle = '#3a3a5a'; B.font = 'bold 90px Georgia'; B.fillText('?', x + 125, y + 115); } if (k === 8) gearShape(B, x + pw / 2, y + ph / 2, 26, t, '#5a4a2a'); }
      B.strokeStyle = OUT; B.lineWidth = 4; B.strokeRect(x, y, pw, ph); }
    for (const c of [B, F]) c.restore();
    S.anchor = {};
  } });
  return shots;
}
let SHAKE_CUT = 0;
function startPrologue(a, b, story, done) { startCut(a, b, buildShots(story), done); }
function startCut(a, b, shots, done) { CUT.a = a; CUT.b = b; CUT.shots = shots; CUT.i = -1; CUT.done = done; nextShot(); }
function nextShot() { CUT.i++; CUT.li = -1; CUT.t = 0; CUT.lt = 0; CUT.S = { T: 0, anchor: {} }; const sh = CUT.shots[CUT.i]; if (!sh) { const d = CUT.done; CUT.done = null; d && d(); return; } sh.init && sh.init(CUT.S); CUT.fade = 1; advanceLine(); }
function advanceLine() { const sh = CUT.shots[CUT.i]; CUT.li++; CUT.lt = 0; const l = sh.lines[CUT.li]; if (l && sh.on) sh.on(l, CUT.li, CUT.S); }
function updateCut(dt, inputs) {
  const sh = CUT.shots[CUT.i]; if (!sh) return; CUT.t += dt; CUT.lt += dt; CUT.S.T += dt; CUT.fade = Math.max(0, CUT.fade - dt * 3); SHAKE_CUT = Math.max(0, SHAKE_CUT - dt); WORLD.noir = Math.max(0, (WORLD.noir || 0) - dt * 3);
  if (inputs.some(i => i.start) || pressed.has('Enter') || pressed.has('Escape')) { CUT.i = CUT.shots.length - 1; const d = CUT.done; CUT.done = null; d && d(); return; }
  const l = sh.lines[CUT.li], adv = inputs.some(i => i.a || i.j) && CUT.lt > .3;
  if (l && (CUT.lt > lineDur(l) || adv)) advanceLine();
  else if (!l && CUT.S.T >= (sh.minDur || 0)) nextShot();
}
function renderCut() {
  const sh = CUT.shots[CUT.i]; if (!sh) return; const t = time;
  INKW = STYLE_INK[sh.style] || 1;
  bgX.setTransform(1, 0, 0, 1, 0, 0); bgX.clearRect(0, 0, RW, RH); fgX.setTransform(1, 0, 0, 1, 0, 0); fgX.clearRect(0, 0, RW, RH);
  const j = SHAKE_CUT > 0 ? (Math.random() - .5) * SHAKE_CUT * 20 : 0; bgX.setTransform(2, 0, 0, 2, j, j); fgX.setTransform(2, 0, 0, 2, j, j);
  sh.draw(bgX, fgX, t, CUT.li, CUT.lt, CUT.S);
  if (GL) GL.draw(bgH, fgH, sh.style, t, 2, Math.max(.92, DIM), WORLD.noir || 0, sh.floor * 2); else { const c = cv.getContext('2d'); c.drawImage(bgH, 0, 0); c.drawImage(fgH, 0, 0); }
  out.setTransform(1, 0, 0, 1, 0, 0); out.clearRect(0, 0, RW, RH); out.setTransform(2, 0, 0, 2, 0, 0);
  drawInk();
  const l = sh.lines[CUT.li], fl = sh.style === 6 ? 4 : sh.style === 2 ? 2 : 4;
  if (l && l.card) titleCard(out, l[LANG]); else if (l) { if (l.who === 'NAR') caption(out, fl, l[LANG], l.side === 'R' ? 494 : 14, sh.split ? 470 : 14); else { const a = CUT.S.anchor[l.who]; if (a) balloon(out, fl, l[LANG], a[0], a[1], a[0] < 480 ? 1 : -1, /!!|[A-ZÉÈÀ]{6,}/.test(l[LANG]), 230); } }
  if (sh.film) filmOverlay(out, t);
  if (sh.split) { out.fillStyle = '#f4ead8'; out.fillRect(476, 0, 8, 540); out.strokeStyle = OUT; out.lineWidth = 3; out.strokeRect(2, 2, 474, 536); out.strokeRect(484, 2, 474, 536); }
  out.strokeStyle = OUT; out.lineWidth = 5; out.strokeRect(2.5, 2.5, 955, 535);
  out.font = '600 12px Georgia, serif'; out.textAlign = 'right'; out.fillStyle = 'rgba(255,255,255,.8)'; out.strokeStyle = 'rgba(0,0,0,.7)'; out.lineWidth = 3; const hint = LANG === 'fr' ? 'Frapper ou sauter : suivant · Entrée / Start : passer' : 'Attack or jump: next · Enter / Start: skip'; out.strokeText(hint, 948, 530); out.fillText(hint, 948, 530); out.textAlign = 'left';
  if (CUT.fade > 0) { out.fillStyle = `rgba(0,0,0,${CUT.fade})`; out.fillRect(0, 0, 960, 540); }
  out.setTransform(1, 0, 0, 1, 0, 0);
}
const STYLE_INK = { 2: 1.6, 4: .7, 6: .8, 17: 1.25 };
