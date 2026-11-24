// The scene: the Havre quay at dawn, Amiral Remords and Marge la Roadie
// against a squad. Everything is choreographed on an 8-second loop.
const W = 960, H = 540, HZ = 258, PIER = 332, K = 2;
let LANG = 'fr'; try { LANG = localStorage.getItem('bp-lang') || 'fr'; } catch (e) {}
const STYLES = [
  { n: 'I', inkw: 1.25, fr: ['Âge d’argent', 'Trame Ben-Day, quadrichromie mal calée, papier journal jauni.', 'Très lisible, couleurs franches, l’« illustré du dimanche ». Les trames bougent avec les personnages : tout grouille. Risque : décor chargé derrière les combats.'], en: ['Silver Age', 'Ben-Day dots, misregistered four-colour print, yellowed newsprint.', 'Very readable, bold colours, the Sunday-funnies feel. The dots move with the actors, so everything crawls. Risk: busy backgrounds behind the fights.'] },
  { n: 'II', inkw: .45, fr: ['Ligne claire', 'Trait égal partout, aplats, pas d’ombres portées.', 'Lisibilité maximale, élégant, très franco-belge. Peu de texture : il faudra des décors très riches pour que ça vive.'], en: ['Ligne claire', 'One even line everywhere, flat colours, no cast shadows.', 'The most readable, elegant, very Franco-Belgian. Little texture, so the sets must be rich to feel alive.'] },
  { n: 'III', inkw: 1.6, fr: ['Encre noire', 'Grands noirs, hachures, une seule couleur d’accent.', 'Énorme caractère. Le rouge peut devenir un code de jeu (danger, tir ami). Risque : des silhouettes qui se perdent dans le noir.'], en: ['Noir ink', 'Big blacks, hatching, a single spot colour.', 'Huge character. The red can become a game signal (danger, friendly fire). Risk: silhouettes lost in the blacks.'] },
  { n: 'IV', inkw: 1.1, fr: ['Trames manga', 'Noir et blanc, trames, lignes de vitesse sur les coups.', 'Les coups claquent vraiment. Sans couleur, distinguer les deux joueurs et les ennemis demandera des silhouettes très typées.'], en: ['Manga tones', 'Black and white, screentones, speed lines on hits.', 'Hits really land. Without colour, telling the two players and the enemies apart needs very distinct silhouettes.'] },
  { n: 'V', inkw: .7, fr: ['SF 1977', 'Hachures fines, pastels délavés, grain d’aquarelle.', 'Le plus « planète étrange », le plus poétique. Moins de punch pour un jeu de baston, mais un monde inoubliable.'], en: ['SF 1977', 'Fine hatching, washed-out pastels, watercolour grain.', 'The most alien-planet, the most poetic. Less punch for a brawler, but an unforgettable world.'] }
];
const TXT = {
  fr: { caption: 'LE HAVRE, À L’AUBE. ILS DÉBARQUENT…', zone: 'ZONE 1 · VAGUE 2', am: 'Au suivant, moussaillon !', d: 'Ha ! Ha ! Debout, Gaston !', f: 'Remontez-moi !!', c: 'Maman !', br: 'GRRRR !', mg: 'C’est tout ?', sfx: ['PAF !', 'VLAN !', 'BADABOUM !', 'KRAK !', 'BOUM !', 'SCHLAK !', 'BRAOUM !', 'ESQUIVE !', 'PAN !', 'TCHAC !', 'BING !'] },
  en: { caption: 'LE HAVRE, AT DAWN. THEY’RE LANDING…', zone: 'ZONE 1 · WAVE 2', am: 'Next, deckhand!', d: 'Ha! Ha! Get up, Gaston!', f: 'Pull me up!!', c: 'Mommy!', br: 'GRRRR!', mg: 'That all?', sfx: ['POW!', 'WHAM!', 'KABOOM!', 'KRAK!', 'BOOM!', 'THWACK!', 'KA-BLAM!', 'DODGE!', 'BANG!', 'SMACK!', 'BONK!'] }
};

// ---- actors -------------------------------------------------------------
const AM = { look: heroLook('amiral'), s: 2.6 }, MG = { look: heroLook('marge'), s: 2.6 };
const GA = { look: makeGoonLook('trooper', 7), s: 2.5 }, BR = { look: makeGoonLook('brute', 3), s: 2.45 };
const GC = { look: makeGoonLook('trooper', 22), s: 2.1 }, GD = { look: makeGoonLook('trooper', 41), s: 2.1 }, GE = { look: makeGoonLook('trooper', 15), s: 2.15 };
const GF = { look: makeGoonLook('trooper', 58), s: 1.7 }, GG = { look: makeGoonLook('gunner', 12), s: 2.15 };
GA.look.name = 'Gaston'; BR.look.wpn = 'hammer'; GD.look.wpn = 'knife'; GE.look.wpn = 'wrench';
const ACT = [AM, MG, GA, BR, GC, GD, GE, GG];
for (const a of [...ACT, GF]) a.cur = POSES.idle(0);

const seg = (t, a, b) => t >= a && t < b, sp = (t, a, b) => clamp01((t - a) / (b - a));
function choreo(t) {
  const T4 = t % 4, T8 = t % 8, cyc = Math.floor(t / 4);
  const boom = seg(T8, 6.2, 7.7), bs = T8 - 6.2;
  // Amiral and Gaston: three-hit combo, Gaston flies, lies there, gets up
  let ax = 300, ap, gx = 372, gy = 444, gp, gRot = 0, gLie = 1, amo = {};
  if (seg(T4, 0, .42)) ap = POSES.jab(sp(T4, 0, .42)); else if (seg(T4, .55, .97)) ap = POSES.cross(sp(T4, .55, .97)); else if (seg(T4, 1.15, 1.7)) ap = POSES.swing(sp(T4, 1.15, 1.7));
  else if (seg(T4, 2.3, 3.4)) { ap = POSES.point(t); amo.shout = 1; } else ap = POSES.guard(t, 1);
  if (seg(T4, .12, .55)) { gp = POSES.hurt(sp(T4, .12, .55), cyc * 2); gx += 6 * ease(sp(T4, .12, .3)); }
  else if (seg(T4, .55, .67)) { gp = POSES.guard(t, 2); gx += 6; }
  else if (seg(T4, .67, 1.1)) { gp = POSES.hurt(sp(T4, .67, 1.1), cyc * 2 + 1); gx += 6 + 6 * ease(sp(T4, .67, .85)); }
  else if (seg(T4, 1.1, 1.32)) { gp = POSES.guard(t, 3); gx += 12; }
  else if (seg(T4, 1.32, 1.9)) { const s = sp(T4, 1.32, 1.9); gp = POSES.tumble(s, cyc); gx += 12 + 70 * s; gy -= Math.sin(s * Math.PI) * 46; gRot = -1.4 * s; }
  else if (seg(T4, 1.9, 3.0)) { const s = T4 - 1.9; gp = POSES.down(t, cyc); gx += 82; gy -= Math.max(0, Math.sin(Math.min(1, s / .22) * Math.PI)) * 7; gLie = cyc % 2 ? -1 : 1; }
  else if (seg(T4, 3.0, 3.6)) { gp = POSES.getup(sp(T4, 3, 3.6), cyc); gx += 82; }
  else { const s = sp(T4, 3.6, 4); gp = POSES.walk(t, .8); gx += 82 * (1 - s); }
  if (gRot) gp.rot = gRot;
  // Marge and the brute: he swings, she dodges, charges, kicks
  let mx = 560, mp, mgo = {}, bx = 650, bp;
  if (seg(T4, .7, 1.0)) { mp = POSES.backstep(); mx -= 30 * ease(sp(T4, .7, .9)); }
  else if (seg(T4, 1.0, 1.3)) { mp = POSES.guard(t, 4); mx -= 30; }
  else if (seg(T4, 1.3, 1.58)) { mp = POSES.charge(t); mx += -30 + 60 * ease(sp(T4, 1.3, 1.58)); }
  else if (seg(T4, 1.95, 2.38)) { mp = POSES.kick(sp(T4, 1.95, 2.38)); mx += 30; mgo.shout = 1; }
  else if (seg(T4, 2.45, 3.4)) { mp = POSES.flex(t); mx += 30; mgo.shout = T4 < 3.1 ? 1 : 0; }
  else if (seg(T4, 3.4, 4)) { mp = POSES.walk(t, .6); mx += 30 * (1 - sp(T4, 3.4, 4)); }
  else { mp = POSES.guard(t, 5); if (T4 >= 1.58 && T4 < 1.95) mx += 30; }
  if (seg(T4, 0, .75)) bp = POSES.windHeavy(sp(T4, 0, .75)); else if (seg(T4, .75, 1.15)) bp = POSES.strikeHeavy(sp(T4, .75, 1.15));
  else if (seg(T4, 1.55, 1.95)) { bp = POSES.hurt(sp(T4, 1.55, 1.95), 3); bx += 18 * ease(sp(T4, 1.55, 1.75)); }
  else if (seg(T4, 1.95, 2.12)) { bp = POSES.guard(t, 6); bx += 18; }
  else if (seg(T4, 2.12, 2.6)) { bp = POSES.hurt(sp(T4, 2.12, 2.6), 1); bx += 18 + 12 * ease(sp(T4, 2.12, 2.3)); }
  else if (seg(T4, 2.6, 3.3)) { bp = POSES.bang(t); bx += 30; }
  else if (seg(T4, 3.3, 4)) { bp = POSES.walk(t, .7); bx += 30 * (1 - sp(T4, 3.3, 4)); }
  else { bp = POSES.guard(t, 7); if (T4 >= 1.15 && T4 < 1.55) bx += 0; }
  // the squad waiting its turn
  const fid = (tt, list, len) => list[Math.floor(tt / len) % list.length];
  let cp, dp, ep, gg, ggo = {};
  if (boom) { cp = bs < .4 ? POSES.flinch(sp(bs, 0, .4)) : POSES.cower(t); dp = bs < .35 ? POSES.flinch(sp(bs, 0, .35)) : POSES.lookUp(t); ep = bs < .3 ? POSES.flinch(sp(bs, 0, .3)) : POSES.cower(t + 1); gg = bs < 1 ? POSES.cower(t + 2) : POSES.getup(sp(bs, 1, 1.5), 2); }
  else {
    const f = fid(t + 1, ['scratch', 'idle', 'stretch', 'idle', 'yawn'], 1.6); cp = f === 'idle' ? POSES.idle(t, 3) : POSES[f](t);
    dp = seg(T4, 1.4, 2.9) ? POSES.laugh(t) : fid(t, ['chat', 'idle', 'chat', 'look'], 1.3) === 'idle' ? POSES.idle(t, 5) : POSES[fid(t, ['chat', 'idle', 'chat', 'look'], 1.3)](t);
    const e = fid(t + .5, ['check', 'tap', 'idle', 'look'], 2); ep = e === 'idle' ? POSES.idle(t, 7) : POSES[e](t);
    const fireT = (t % 1.3); gg = fireT < .18 ? POSES.recoil(fireT / .18) : POSES.aim(); ggo.muzzle = fireT < .06;
  }
  return { am: [ax, 440, 1, ap, amo], ga: [gx, gy, -1, gp, { lieDir: gLie }], mg: [mx, 470, 1, mp, mgo], br: [bx, 474, -1, bp, {}],
    gc: [770, 392, -1, cp, {}], gd: [470, 386, -1, dp, {}], ge: [178, 398, 1, ep, {}], gg: [826, 380, -1, gg, ggo], T4, T8, cyc, boom, bs };
}

// ---- particles ---------------------------------------------------------
let PT = [];
const R1 = (a, b) => a + Math.random() * (b - a);
function dust(x, y, n = 8, big = 1) { for (let i = 0; i < n; i++) PT.push({ k: 'dust', x: x + R1(-10, 10), y, vx: R1(-60, 60) * big, vy: R1(-30, -5), r: R1(4, 8) * big, life: 0, max: R1(.4, .8) }); }
function spark(x, y) { PT.push({ k: 'star', x, y, life: 0, max: .18, r: 18 }); for (let i = 0; i < 6; i++) PT.push({ k: 'spk', x, y, vx: R1(-220, 220), vy: R1(-200, 60), life: 0, max: R1(.15, .3) }); }
function boomFx(x, y) { PT.push({ k: 'flash', x, y, life: 0, max: .5 }); for (let i = 0; i < 16; i++) PT.push({ k: 'deb', x, y: y - 14, vx: R1(-260, 260), vy: R1(-420, -120), rot: R1(0, 6), vr: R1(-12, 12), life: 0, max: 1.6, gy: y + R1(-6, 30) }); for (let i = 0; i < 12; i++) PT.push({ k: 'smoke', x: x + R1(-20, 20), y: y - R1(10, 40), vx: R1(-15, 15), vy: R1(-40, -15), r: R1(10, 20), life: 0, max: R1(1.4, 2.6) }); }
function stepPT(dt) { for (const p of PT) { p.life += dt; if (p.vx !== undefined) { p.x += p.vx * dt; p.y += p.vy * dt; } if (p.k === 'dust') { p.vx *= .9; p.vy *= .9; } if (p.k === 'spk') p.vy += 600 * dt; if (p.k === 'deb') { p.vy += 900 * dt; p.rot += p.vr * dt; if (p.y > p.gy) { p.y = p.gy; p.vy *= -.3; p.vx *= .6; p.vr *= .5; } } } PT = PT.filter(p => p.life < p.max); }
function drawPT(c, front) { for (const p of PT) { const a = 1 - p.life / p.max;
  if (p.k === 'dust') { c.fillStyle = `rgba(200,180,150,${a * .8})`; c.beginPath(); c.arc(p.x, p.y, p.r * (1 + p.life * 2), 0, 7); c.fill(); }
  if (p.k === 'smoke') { c.fillStyle = `rgba(60,52,58,${a * .85})`; c.beginPath(); c.arc(p.x, p.y, p.r * (1 + p.life), 0, 7); c.fill(); }
  if (p.k === 'spk') { c.strokeStyle = '#fff4c0'; c.lineWidth = 2; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * .03, p.y - p.vy * .03); c.stroke(); }
  if (p.k === 'star') { const r = p.r * (1.3 - a * .3); c.beginPath(); for (let i = 0; i < 16; i++) { const rr = i % 2 ? r * .4 : r, an = i / 16 * Math.PI * 2; c.lineTo(p.x + Math.cos(an) * rr, p.y + Math.sin(an) * rr); } c.closePath(); c.fillStyle = '#fff8d8'; c.fill(); c.strokeStyle = OUT; c.lineWidth = 2; c.stroke(); }
  if (p.k === 'flash') { const r = 30 + p.life * 220; c.fillStyle = `rgba(255,250,220,${a})`; c.beginPath(); c.arc(p.x, p.y - 20, r * .5, 0, 7); c.fill(); const fr = 20 + Math.min(1, p.life * 6) * 60 * a; c.fillStyle = `rgba(255,170,40,${a})`; c.beginPath(); c.arc(p.x, p.y - 30, fr, 0, 7); c.fill(); c.fillStyle = `rgba(255,236,120,${a})`; c.beginPath(); c.arc(p.x, p.y - 30, fr * .55, 0, 7); c.fill(); }
  if (p.k === 'deb') { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = '#6a4a2a'; c.strokeStyle = OUT; c.lineWidth = 1.5; c.fillRect(-6, -2, 12, 4); c.strokeRect(-6, -2, 12, 4); c.restore(); } } }

// ---- background --------------------------------------------------------
function planet(c, t) { const x = 215, y = 140, r = 140;
  c.save(); c.translate(x, y); c.rotate(-.25);
  c.strokeStyle = 'rgba(240,210,170,.55)'; c.lineWidth = 9; c.beginPath(); c.ellipse(0, 0, 232, 40, 0, Math.PI, Math.PI * 2); c.stroke(); c.strokeStyle = 'rgba(200,150,120,.5)'; c.lineWidth = 5; c.beginPath(); c.ellipse(0, 0, 252, 46, 0, Math.PI, Math.PI * 2); c.stroke();
  c.beginPath(); c.arc(0, 0, r, 0, 7); c.save(); c.clip();
  const bands = ['#f0d8a8', '#d8a878', '#f4e4bc', '#b8805a', '#e8c090', '#c89068', '#f0dcb0', '#a87050', '#e0b488'];
  let yy = -r; for (let i = 0; yy < r; i++) { const h = 18 + (i * 37 % 23); c.fillStyle = bands[i % bands.length]; c.beginPath(); c.moveTo(-r, yy); for (let xx = -r; xx <= r; xx += 20) c.lineTo(xx, yy + Math.sin(xx * .03 + i + t * .15) * 3); c.lineTo(r, yy + h + 4); c.lineTo(-r, yy + h + 4); c.fill(); yy += h; }
  c.fillStyle = '#c86a4a'; c.beginPath(); c.ellipse(40 + Math.sin(t * .1) * 4, 34, 22, 10, 0, 0, 7); c.fill(); c.fillStyle = '#e89a6a'; c.beginPath(); c.ellipse(42 + Math.sin(t * .1) * 4, 32, 12, 5, 0, 0, 7); c.fill();
  const g = c.createRadialGradient(60, -50, r * .2, 0, 0, r * 1.15); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, 'rgba(20,10,40,.1)'); g.addColorStop(1, 'rgba(20,10,40,.75)'); c.fillStyle = g; c.fillRect(-r, -r, r * 2, r * 2); c.restore();
  c.strokeStyle = OUT; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke();
  c.strokeStyle = 'rgba(240,210,170,.75)'; c.lineWidth = 9; c.beginPath(); c.ellipse(0, 0, 232, 40, 0, 0, Math.PI); c.stroke(); c.strokeStyle = 'rgba(200,150,120,.7)'; c.lineWidth = 5; c.beginPath(); c.ellipse(0, 0, 252, 46, 0, 0, Math.PI); c.stroke();
  c.restore(); }
function house(c, x, w, h, col, t, i) { const y = 236 - (x > 700 ? 18 : 6); poly(c, [[x, y], [x + w, y], [x + w, y - h], [x + w / 2, y - h - 12], [x, y - h]], col); c.fillStyle = '#5a3438'; c.beginPath(); c.moveTo(x - 2, y - h); c.lineTo(x + w / 2, y - h - 13); c.lineTo(x + w + 2, y - h); c.fill();
  for (let r = 0; r < Math.floor(h / 12); r++) for (let k = 0; k < 2; k++) { const on = Math.sin(i * 7.3 + r * 3.1 + k * 5 + Math.floor(t * .5 + i) * 2.1) > .1; c.fillStyle = on ? '#ffd870' : '#3a2a3a'; c.fillRect(x + 3 + k * (w - 9), y - h + 4 + r * 12, 4, 5); } }
function bg(c, t, F) {
  const g = c.createLinearGradient(0, 0, 0, HZ); g.addColorStop(0, '#1a2650'); g.addColorStop(.45, '#4a4a78'); g.addColorStop(.75, '#c07878'); g.addColorStop(1, '#f2b880'); c.fillStyle = g; c.fillRect(0, 0, W, HZ);
  for (let i = 0; i < 70; i++) { const x = (i * 137.5) % W, y = (i * 61.7) % 140, tw = Math.sin(t * 2 + i) > .7; c.fillStyle = tw ? '#ffffff' : '#c8c8f0'; c.fillRect(x, y, tw ? 2 : 1.4, tw ? 2 : 1.4); }
  planet(c, t);
  disc(c, 780, 58, 20, '#e0dcd0'); c.fillStyle = '#b8b0a4'; c.beginPath(); c.arc(774, 54, 5, 0, 7); c.arc(788, 64, 3, 0, 7); c.fill();
  // sun on the horizon
  c.fillStyle = 'rgba(255,220,150,.35)'; c.beginPath(); c.arc(480, HZ, 70, Math.PI, 0); c.fill(); c.fillStyle = '#ffe2a0'; c.beginPath(); c.arc(480, HZ, 34, Math.PI, 0); c.fill();
  for (let i = 0; i < 6; i++) { const x = ((i * 190 + t * (8 + i * 2)) % (W + 240)) - 120, y = 150 + (i * 23) % 70; c.fillStyle = '#f2c0a0'; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(x + k * 16, y - Math.sin(k * 1.3) * 8, 14 - Math.abs(k - 2) * 2, 0, 7); c.fill(); } c.fillStyle = '#b87a80'; c.fillRect(x - 10, y + 4, 80, 5); }
  // the cliff and the town, the lighthouse
  poly(c, [[560, HZ], [610, 232], [660, 226], [720, 214], [960, 208], [960, HZ]], '#4a3a52');
  const cols = ['#d8b098', '#b89a8a', '#e8c8a0', '#9a8a9a', '#c8a0a0'];
  for (let i = 0, x = 612; x < 880; i++) { const w = 18 + (i * 7) % 10, h = 22 + (i * 13) % 26; house(c, x, w, h, cols[i % 5], t, i); x += w + 3; }
  poly(c, [[896, 214], [912, 214], [909, 148], [899, 148]], '#f0ece4'); for (let k = 0; k < 3; k++) { c.fillStyle = '#c83a32'; c.fillRect(898 + k * .5, 160 + k * 18, 12 - k, 7); }
  c.fillStyle = '#3a3040'; c.fillRect(896, 140, 16, 8); c.fillStyle = '#ffe890'; c.fillRect(899, 141, 10, 6);
  const ba = t * 1.1, bc = Math.cos(ba); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,240,170,${.18 + .3 * Math.abs(bc)})`; c.beginPath(); c.moveTo(904, 144); c.lineTo(904 + bc * 420, 120); c.lineTo(904 + bc * 420, 168); c.fill(); c.restore();
  // the sea
  const sg = c.createLinearGradient(0, HZ, 0, PIER); sg.addColorStop(0, '#8a7a9a'); sg.addColorStop(1, '#2a3a5c'); c.fillStyle = sg; c.fillRect(0, HZ, W, PIER - HZ);
  for (let r = 0; r < 10; r++) { const y = HZ + 4 + r * r * .8 + r * 2, len = 6 + r * 2, spd = 10 + r * 6; c.fillStyle = r < 4 ? '#b8a8c0' : '#6a7a9a'; for (let k = 0; k < 14; k++) { const x = ((k * 97 + r * 41 + t * spd * (r % 2 ? 1 : -1)) % (W + 40) + W + 40) % (W + 40) - 20; c.fillRect(x, y + Math.sin(t * 2 + k) * 1, len, 1.5); } }
  for (let k = 0; k < 9; k++) { const y = HZ + 6 + k * 8, w2 = 14 + k * 6 + Math.sin(t * 3 + k) * 6; c.fillStyle = 'rgba(255,230,170,.75)'; c.fillRect(480 - w2 / 2, y, w2, 2); }
  const bxp = 360 + Math.sin(t * .2) * 25, byp = HZ + 16 + Math.sin(t * 1.5) * 1.5; c.save(); c.translate(bxp, byp); c.rotate(Math.sin(t * 1.5) * .06); poly(c, [[-16, 0], [16, 0], [11, 6], [-12, 6]], '#5a3a2a'); poly(c, [[0, -1], [0, -30], [14, -3]], '#f0e6d4'); poly(c, [[-1, -3], [-1, -24], [-11, -3]], '#d8c8b0'); c.restore();
  // the dropship and its searchlight
  const sx = 690 + Math.sin(t * .5) * 14, sy = 102 + Math.sin(t * 1.3) * 5;
  c.save(); c.globalCompositeOperation = 'lighter'; const la = Math.sin(t * .7) * 140; const lg = c.createLinearGradient(sx, sy, sx + la, PIER + 120); lg.addColorStop(0, 'rgba(255,250,210,.35)'); lg.addColorStop(1, 'rgba(255,250,210,.08)'); c.fillStyle = lg; c.beginPath(); c.moveTo(sx - 6, sy + 18); c.lineTo(sx + la - 80, PIER + 140); c.lineTo(sx + la + 80, PIER + 140); c.lineTo(sx + 6, sy + 18); c.fill(); c.restore();
  F.ship = [sx, sy];
  c.save(); c.translate(sx, sy); c.rotate(Math.sin(t * .9) * .05);
  for (const ex of [-46, 40]) { const fl = 14 + Math.random() * 8; c.fillStyle = '#9fdcff'; c.beginPath(); c.moveTo(ex - 6, 14); c.lineTo(ex, 14 + fl); c.lineTo(ex + 6, 14); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(ex - 3, 14); c.lineTo(ex, 14 + fl * .6); c.lineTo(ex + 3, 14); c.fill(); }
  poly(c, [[-80, 0], [-60, -16], [50, -18], [86, -4], [70, 10], [-66, 12]], '#3a3044'); poly(c, [[-60, -16], [50, -18], [40, -10], [-50, -9]], '#5a4a66');
  c.fillStyle = '#c8963a'; c.fillRect(-60, 2, 120, 3); poly(c, [[52, -14], [80, -5], [64, -3]], '#ffcf6a');
  poly(c, [[-54, 8], [-38, 8], [-40, 16], [-52, 16]], '#2a2234'); poly(c, [[32, 8], [48, 8], [46, 16], [34, 16]], '#2a2234');
  for (let k = 0; k < 5; k++) { c.fillStyle = Math.sin(t * 4 + k) > 0 ? '#ff5a3a' : '#5a1a14'; c.fillRect(-40 + k * 18, -6, 4, 3); } c.restore();
  // gulls
  for (let i = 0; i < 4; i++) { const x = ((t * (34 + i * 9) + i * 260) % (W + 80)) - 40, y = 190 + i * 18 + Math.sin(t * .8 + i) * 10, f = Math.sin(t * 8 + i * 2) * 5; c.strokeStyle = '#f4f0ea'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(x - 9, y - f); c.quadraticCurveTo(x - 4, y - 4, x, y); c.quadraticCurveTo(x + 4, y - 4, x + 9, y - f); c.stroke(); }
}
function pier(c, t) {
  for (let k = 0; k < 13; k++) { const x = k * 78 + 20; c.fillStyle = '#3a2a22'; c.fillRect(x, PIER - 22, 9, 26); c.fillStyle = '#5a4434'; c.fillRect(x, PIER - 24, 9, 4); if (k < 12) { c.strokeStyle = '#a8946a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x + 4, PIER - 18); c.quadraticCurveTo(x + 43, PIER - 8 + Math.sin(t + k) * 1.5, x + 82, PIER - 18); c.stroke(); } }
  let y = PIER; for (let i = 0; y < H; i++) { const h = 9 + i * 2.6; c.fillStyle = i % 2 ? '#8a6a4a' : '#7a5c40'; c.fillRect(0, y, W, h); c.fillStyle = '#4a3424'; c.fillRect(0, y + h - 1.5, W, 1.5); for (let k = 0; k < 8; k++) { const x = ((k * 173 + i * 61) % W); c.fillRect(x, y, 1.5, h); c.fillStyle = '#5a4430'; c.fillRect(x + 6, y + h * .4, 10 + i, 1); c.fillStyle = '#4a3424'; } y += h; }
}
function props(c, t, Fx) { const L = [];
  L.push([350, () => { poly(c, [[68, 350], [112, 350], [114, 392], [66, 392]], '#6a4a2e'); c.fillStyle = '#3a2a1a'; c.fillRect(66, 360, 48, 3); c.fillRect(66, 380, 48, 3); }]);
  L.push([340, () => { c.fillStyle = OUT; c.fillRect(37, 230, 8, 112); c.fillStyle = '#2a2420'; c.fillRect(38, 230, 6, 112); poly(c, [[30, 214], [52, 214], [49, 232], [33, 232]], '#2a2420'); const fl = .7 + Math.sin(t * 13) * .15 + Math.sin(t * 7) * .1; c.fillStyle = `rgba(255,${200 + fl * 40 | 0},120,1)`; c.fillRect(35, 218, 12, 11); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,200,120,${.14 * fl})`; c.beginPath(); c.arc(41, 224, 46, 0, 7); c.fill(); c.restore(); }]);
  L.push([352, () => { disc(c, 475, 344, 9, '#2a2a30'); c.fillStyle = '#2a2a30'; c.fillRect(468, 336, 14, 10); c.strokeStyle = '#c8b080'; c.lineWidth = 3; c.beginPath(); c.ellipse(500, 352, 14, 5, 0, 0, 7); c.stroke(); c.beginPath(); c.ellipse(500, 350, 10, 3.5, 0, 0, 7); c.stroke(); }]);
  L.push([362, () => { poly(c, [[600, 344], [652, 344], [654, 366], [598, 366]], '#7a5a3a'); for (let k = 0; k < 6; k++) { const wig = Math.sin(t * 9 + k * 2) > .9 ? -2 : 0; poly(c, [[606 + k * 7, 342 + wig], [614 + k * 7, 338 + wig], [618 + k * 7, 343 + wig]], k % 2 ? '#b8c8d8' : '#9ab0c4'); } }]);
  L.push([348, () => { c.fillStyle = '#4a5a4a'; for (let k = 0; k < 7; k++) { c.beginPath(); c.ellipse(170 + k * 6, 346 - Math.sin(k) * 4, 14, 6, .2 * k, 0, 7); c.fill(); } c.strokeStyle = '#2a3a2a'; c.lineWidth = .8; for (let k = 0; k < 8; k++) { c.beginPath(); c.moveTo(160 + k * 7, 340); c.lineTo(166 + k * 7, 352); c.stroke(); } }]);
  if (!Fx.boom) L.push([412, () => { poly(c, [[862, 374], [912, 374], [914, 412], [860, 412]], '#8a6a3a'); c.strokeStyle = '#5a3a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(862, 374); c.lineTo(912, 412); c.moveTo(912, 374); c.lineTo(862, 412); c.stroke(); c.fillStyle = '#c83a2a'; c.font = 'bold 9px sans-serif'; c.fillText('TNT', 876, 396); }]);
  else L.push([412, () => { c.fillStyle = '#2a1a14'; c.beginPath(); c.ellipse(887, 410, 34, 8, 0, 0, 7); c.fill(); poly(c, [[872, 410], [876, 396], [880, 410]], '#3a2a1a'); poly(c, [[894, 410], [900, 400], [903, 410]], '#3a2a1a'); }]);
  return L; }

// ---- HUD (drawn into the scene so the print style applies) -------------
function hudScene(c, t, st) { const box = (x, look, hp, flip) => { c.save(); c.beginPath(); c.arc(x, 40, 26, 0, 7); c.fillStyle = '#f4ead8'; c.fill(); c.clip(); drawRig(c, x - 2 * flip, 112, flip, 2.1, look, POSES.idle(t, flip > 0 ? 1 : 4), t, {}); c.restore(); c.lineWidth = 4; c.strokeStyle = OUT; c.beginPath(); c.arc(x, 40, 26, 0, 7); c.stroke();
    const bx = flip > 0 ? x + 32 : x - 32 - 150; c.fillStyle = OUT; c.fillRect(bx - 2, 46, 154, 14); for (let k = 0; k < 10; k++) { c.fillStyle = k / 10 < hp ? (k < 3 ? '#e8402a' : '#f2c040') : '#4a3a3a'; c.fillRect(bx + (flip > 0 ? k : 9 - k) * 15, 48, 13, 10); } };
  box(42, AM.look, .8, 1); box(W - 42, MG.look, .6, -1); }

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
function balloon(c, si, text, hx, hy, side = 1, shout = 0) {
  const fs = si === 4 ? 13 : 14; c.font = si === 4 ? `italic 600 ${fs}px Georgia, serif` : `bold ${fs}px "Comic Neue", "Trebuchet MS", "DejaVu Sans", sans-serif`; if (si === 0 || si === 2) c.font = `bold ${fs}px "Arial Narrow", "DejaVu Sans Condensed", "DejaVu Sans", sans-serif`;
  const lines = wrap(c, text.toUpperCase(), 130), w = Math.max(...lines.map(l => c.measureText(l).width)) + 22, h = lines.length * (fs + 3) + 14;
  const bx = hx + side * 28 - (side < 0 ? w : 0), by = hy - 50 - h;
  const fill = si === 4 ? '#f6ecd4' : '#ffffff', ink = si === 4 ? '#3a2420' : '#0c0810';
  c.save(); c.lineWidth = 2.5; c.strokeStyle = ink; c.fillStyle = fill;
  c.beginPath(); const tx = hx + side * 14; c.moveTo(bx + w / 2 - 8, by + h - 2); c.lineTo(tx, hy - 18); c.lineTo(bx + w / 2 + 8, by + h - 2); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); if (shout) { burst(c, bx + w / 2, by + h / 2, w * .62, h * .78, 12, 0, fill, ink, 2.5); }
  else if (si === 1 || si === 4) { c.roundRect ? c.roundRect(bx, by, w, h, 8) : c.rect(bx, by, w, h); c.fill(); c.stroke(); }
  else if (si === 2) { c.rect(bx, by, w, h); c.fill(); c.stroke(); }
  else { c.ellipse(bx + w / 2, by + h / 2, w * .58, h * .66, 0, 0, 7); c.fill(); c.stroke(); }
  c.fillStyle = fill; c.fillRect(bx + w / 2 - 6, by + h - 6, 12, 6);
  c.fillStyle = ink; c.textAlign = 'center'; c.textBaseline = 'top'; lines.forEach((l, i) => c.fillText(l, bx + w / 2, by + 7 + i * (fs + 3)));
  c.restore(); }
function caption(c, si, text, x, y) {
  c.font = si === 4 ? 'italic 600 13px Georgia, serif' : si === 1 ? 'bold 13px "Trebuchet MS", sans-serif' : 'bold 13px "Arial Narrow", "DejaVu Sans Condensed", sans-serif'; const w = c.measureText(text).width + 20;
  const bgc = ['#ffe880', '#ffffff', '#0c0a0c', '#ffffff', '#f2e2c0'][si], fg = si === 2 ? '#f4ece0' : si === 4 ? '#3a2420' : '#0c0810';
  c.fillStyle = bgc; c.fillRect(x, y, w, 26); c.lineWidth = 2.5; c.strokeStyle = si === 4 ? '#3a2420' : '#0c0810'; c.strokeRect(x, y, w, 26); c.fillStyle = fg; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(text, x + 10, y + 13); }
function speedLines(c, x, y, a) { c.save(); c.globalAlpha = a; c.fillStyle = '#080808'; for (let i = 0; i < 70; i++) { const an = i / 70 * Math.PI * 2 + (i * 13 % 7) * .01, r0 = 150 + (i * 53 % 90), r1 = 900, w = .006 + (i * 7 % 5) * .002; c.beginPath(); c.moveTo(x + Math.cos(an - w) * r1, y + Math.sin(an - w) * r1); c.lineTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0); c.lineTo(x + Math.cos(an + w) * r1, y + Math.sin(an + w) * r1); c.fill(); } c.restore(); }

// ---- the frame ---------------------------------------------------------
const scv = document.createElement('canvas'); scv.width = W * K; scv.height = H * K; const sc = scv.getContext('2d');
const fcv = document.createElement('canvas'); fcv.width = W * K; fcv.height = H * K; const fc = fcv.getContext('2d');
let prevT = 0, shake = 0;
const crossed = (p, n, at, len) => { const a = p % len, b = n % len; return a < b ? (at > a && at <= b) : (at > a || at <= b); };
function simulate(t, dt) {
  const ev = (at, len) => crossed(prevT, t, at, len) && t > prevT;
  if (ev(.14, 4)) spark(355, 352); if (ev(.7, 4)) spark(360, 345); if (ev(1.32, 4)) { spark(370, 340); shake = .3; } if (ev(1.95, 4)) dust(460, 444, 12, 1.4);
  if (ev(.92, 4)) { dust(540, 470, 14, 1.6); shake = .2; } if (ev(1.4, 4)) dust(520, 470, 6); if (ev(1.55, 4)) spark(625, 405); if (ev(2.1, 4)) spark(640, 395); if (ev(3.05, 4)) dust(450, 444, 6);
  if (ev(6.2, 8)) { boomFx(887, 410); shake = .6; }
  if (crossed(prevT, t, .02, 1.3) && t > prevT && !(t % 8 > 6.2 && t % 8 < 7.7)) PT.push({ k: 'spk', x: 790, y: 330, vx: 40, vy: -120, life: 0, max: .5 });
  stepPT(dt); shake = Math.max(0, shake - dt);
  const CH = choreo(t), sm = 1 - Math.exp(-dt * 22);
  for (const [a, key] of [[AM, 'am'], [GA, 'ga'], [MG, 'mg'], [BR, 'br'], [GC, 'gc'], [GD, 'gd'], [GE, 'ge'], [GG, 'gg']]) { const [x, y, face, pose, o] = CH[key]; a.flow = lerp(a.flow || 0, (x - (a.x ?? x)) / Math.max(dt, .001) / 200, .2); a.x = x; a.y = y; a.face = face; a.o = o; a.cur = blendPose(a.cur, pose, sm); }
  GF.cur = blendPose(GF.cur, Math.sin(t * 1.7) > .6 ? POSES.flail(t) : POSES.dropping(t), sm);
  prevT = t; return CH;
}
function render(t, si, CH, ov) {
  INKW = (STYLES[si] || { inkw: 1 }).inkw;
  const sh = shake > 0 ? shake * 10 : 0, jx = R1(-sh, sh), jy = R1(-sh, sh); let c = sc; c.setTransform(K, 0, 0, K, jx * K, jy * K);
  const F = {}; bg(c, t, F); pier(c, t);
  c = fc; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W * K, H * K); c.setTransform(K, 0, 0, K, jx * K, jy * K);
  // the soldier hanging under the ship
  const [sx, sy] = F.ship, swing = Math.sin(t * 1.7) * .28, ln = 130, rx = sx + Math.sin(swing) * ln, ry = sy + 14 + Math.cos(swing) * ln;
  c.strokeStyle = '#2a2420'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(sx, sy + 14); c.lineTo(rx, ry); c.stroke();
  const SF = solve(GF.look.b, GF.cur); drawRig(c, rx - SF.aF[2][0] * GF.s, ry - SF.aF[2][1] * GF.s, 1, GF.s, GF.look, GF.cur, t, {});
  const L = props(c, t, CH);
  for (const a of ACT) L.push([a.y, () => { c.fillStyle = 'rgba(30,18,20,.35)'; c.beginPath(); c.ellipse(a.x, a.y, 16 * a.s / 2.5 * (a.cur.lie ? 1.8 : 1), 4, 0, 0, 7); c.fill(); drawRig(c, a.x, a.y, a.face, a.s, a.look, a.cur, t, { ...a.o, flow: -a.flow * a.face }); }]);
  L.sort((p, q) => p[0] - q[0]); for (const [, f] of L) f();
  drawPT(c);
  hudScene(c, t);
  // overlay
  const o = ov; o.setTransform(K, 0, 0, K, 0, 0); o.clearRect(0, 0, W, H); const X = TXT[LANG], T4 = CH.T4, T8 = CH.T8, cyc = CH.cyc;
  if (si === 3) { for (const [at, x, y] of [[.14, 355, 352], [.7, 360, 345], [1.32, 370, 340], [1.55, 625, 405], [2.1, 640, 395]]) { const age = T4 - at; if (age >= 0 && age < .22) speedLines(o, x, y, 1 - age / .22); } if (T8 > 6.2 && T8 < 6.5) speedLines(o, 887, 390, 1 - (T8 - 6.2) / .3); }
  const S = X.sfx, list = [[.14, S[cyc % 2 ? 9 : 0], 345, 300, 26], [.7, S[cyc % 2 ? 10 : 1], 372, 288, 28], [1.32, S[2], 395, 238, 34], [.92, S[3], 545, 432, 24], [.82, S[7], 480, 372, 15], [1.55, S[4], 650, 330, 28], [2.1, S[5], 668, 326, 28]];
  for (const [at, txt, x, y, s] of list) { const age = T4 - at; if (age >= 0 && age < .7) sfx(o, si, txt, x, y, s, age, (at * 7 % 3 - 1) * .12); }
  if (T8 > 6.2 && T8 < 7.0) sfx(o, si, S[6], 850, 296, 42, T8 - 6.2, .08);
  { const fireT = t % 1.3; if (fireT < .3 && !CH.boom) sfx(o, si, S[8], 800, 318, 15, fireT, -.2); }
  if (T4 > 2.35 && T4 < 3.4) balloon(o, si, X.am, AM.x + 6, AM.y - 115, -1);
  if (T4 > 1.5 && T4 < 2.85) balloon(o, si, X.d, GD.x - 6, GD.y - 90, 1);
  if (T8 > 2.4 && T8 < 4.4) balloon(o, si, X.f, (F.ship[0] + Math.sin(swing) * 130) + 10, F.ship[1] + 120, 1, 1);
  if (T8 > 6.6 && T8 < 7.7) balloon(o, si, X.c, GC.x, GC.y - 70, -1, 1);
  if (T4 > .05 && T4 < .7) balloon(o, si, X.br, BR.x + 10, BR.y - 135, 1, 1);
  if (T4 > 2.5 && T4 < 3.3) balloon(o, si, X.mg, MG.x - 10, MG.y - 130, -1);
  caption(o, si, X.caption, 14, H - 40);
  o.font = fnt(si, 12); o.textBaseline = 'top'; const nm = (txt, x, al) => { o.textAlign = al; o.lineWidth = 3.5; o.strokeStyle = si === 4 ? '#3a2420' : '#0c0810'; o.strokeText(txt, x, 26); o.fillStyle = si === 2 || si === 3 ? '#ffffff' : '#ffe680'; o.fillText(txt, x, 26); };
  nm('AMIRAL REMORDS', 76, 'left'); nm('MARGE LA ROADIE', W - 76, 'right');
  o.textAlign = 'center'; o.font = fnt(si, 13); o.lineWidth = 3.5; o.strokeStyle = '#0c0810'; o.strokeText(X.zone, W / 2, 16); o.fillStyle = '#ffffff'; o.fillText(X.zone, W / 2, 16);
  o.lineWidth = 5; o.strokeStyle = si === 4 ? '#3a2420' : '#0c0810'; o.strokeRect(2.5, 2.5, W - 5, H - 5);
}
