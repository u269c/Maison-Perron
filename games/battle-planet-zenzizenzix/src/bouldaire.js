// =====================================================================
// BOULDAIRE — World 3: the planet of fashion. Its goons and its boss, CALVE-HAIR.
//   Stylists (apprentices in salon smocks): combs, straight razors and shears (cuts bleed), hot curling irons (a
//     scorching shove). Blowers: a hair dryer that blasts a gust which shoves you across the street. Sprayers: lob a
//     can of hairspray that bursts into a pink cloud (dizzy).
//   Hares (mutant, huge, with styled fur — quiffs, perms, dyed mohawks, curlers in their ears): fast, they pounce from
//     afar and land on you, and now and then thump the floor with a big foot (a shockwave).
//   Blaireaux (badgers — and in French a blaireau is also a shaving brush): stocky, tough, blow-dried fur. They swing a
//     giant shaving brush (it lathers you up: slower), lob foam that leaves a slippery lather puddle, and burrow under
//     the floor to pop up beneath you with an uppercut.
//   CALVE-HAIR: slim, taller than anyone, two golden scissors, very long hair that swirls around him. Scissor cuts
//     (only the bleeding hurts), long-leg kicks (a strong shove), the hair tornado (pushes back, dizzy; break it with a
//     charge or a thrown object), and a hairspray cloud that heals him (15 %, at most every 20 s, any hit stops it).
// =====================================================================
ETYPES.stylist = { hp: 9, spd: 50, reach: 22, dmg: 1, wind: .36, cd: 1.0 };
ETYPES.blower = { hp: 7, spd: 40, reach: 0, dmg: 0, wind: .6, cd: 2.6, ranged: 1 };
ETYPES.sprayer = { hp: 7, spd: 42, reach: 0, dmg: 0, wind: .75, cd: 3.2, ranged: 1 };
ETYPES.hare = { hp: 10, spd: 74, reach: 22, dmg: 1, wind: .3, cd: 1.0 };
ETYPES.badger = { hp: 24, spd: 30, reach: 30, dmg: 2, wind: .55, cd: 1.6 };
ETYPES.calve = { hp: 190, spd: 54, reach: 40, dmg: 0, wind: .4, cd: 1.0 };
STATUS.lather = { dur: 3.5 };   // covered in shaving foam: 35 % slower, no damage
const W3T = { stylist: 1, blower: 1, sprayer: 1, hare: 1, badger: 1, calve: 1 };
const isRanged = e => e.type === 'gunner' || !!(ETYPES[e.type] && ETYPES[e.type].ranged);
let HITKIND = null;   // set to 'throw' while a thrown object lands a hit

// ---- looks ---------------------------------------------------------------------------------------------------------
const SMOCKS = ['#e86aa0', '#6ad8c0', '#1a1a22', '#f4f0e8', '#a87ad8', '#ffb04a'], DYES = ['#ff4f8a', '#4fd8ff', '#ffd23f', '#7a4ad8', '#f4f0e8', '#2a1a14', '#e8402a', '#7dff8a'];
function hairdo(c, x, y, r, kind, col, t, flow = 0) {
  switch (kind) {
    case 'quiff': poly(c, [[x - r * .9, y - r * .4], [x - r * .7, y - r * 1.1], [x + r * .2, y - r * 1.5], [x + r * 1.5 + flow * -2, y - r * 1.45], [x + r * 1.1, y - r * .9], [x + r * .5, y - r * .7]], col); break;
    case 'beehive': c.fillStyle = OUT; c.beginPath(); c.ellipse(x - r * .1, y - r * 1.3, r * .95 + INKW, r * 1.3 + INKW, 0, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.ellipse(x - r * .1, y - r * 1.3, r * .95, r * 1.3, 0, 0, 7); c.fill();
      c.strokeStyle = shadeC(col, -.25); c.lineWidth = .7; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(x - r * .1, y - r * 1.3, r * (.3 + k * .22), 3.6, 5.8); c.stroke(); } break;
    case 'mohawk': for (let k = 0; k < 5; k++) poly(c, [[x - r * .7 + k * r * .32, y - r * .75], [x - r * .62 + k * r * .32 - flow, y - r * 1.9 - (k % 2) * 2], [x - r * .42 + k * r * .32, y - r * .8]], col); break;
    case 'perm': for (let k = 0; k < 9; k++) { const a = Math.PI * (1.05 + k * .11); disc(c, x + Math.cos(a) * r * 1.0, y + Math.sin(a) * r * 1.0, r * .42, col); } break;
    case 'bob': poly(c, [[x - r * 1.15, y + r * .5], [x - r * 1.1, y - r * .7], [x - r * .2, y - r * 1.2], [x + r * .9, y - r * .9], [x + r * 1.15, y - r * .2], [x + r * .5, y - r * .6], [x - r * .5, y - r * .4], [x - r * .8, y + r * .5]], col); break;
    case 'slick': poly(c, [[x - r * 1.05, y - r * .1], [x - r * .9, y - r * .9], [x + r * .1, y - r * 1.15], [x + r * .9, y - r * .75], [x + r * .2, y - r * .65], [x - r * .6, y - r * .3]], col); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = .6; c.beginPath(); c.moveTo(x - r * .6, y - r * .8); c.lineTo(x + r * .3, y - r * .95); c.stroke(); break;
    case 'bouffant': c.fillStyle = OUT; c.beginPath(); c.ellipse(x - r * .25, y - r * .75, r * 1.35 + INKW, r * 1.0 + INKW, -.2, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.ellipse(x - r * .25, y - r * .75, r * 1.35, r * 1.0, -.2, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(x - r * .1, y - r * 1.2, r * .6, r * .25, -.3, 0, 7); c.fill(); break;
  } }
function stylistLook(seed, type) {
  const L = makeGoonLook('trooper', seed); let s = seed * 7 + 3; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280, pick = a => a[(r() * a.length) | 0];
  const smock = pick(SMOCKS), dye = pick(DYES), doK = pick(['quiff', 'beehive', 'mohawk', 'perm', 'bob', 'slick']); L.top = smock; L.armour = smock; L.arms = shadeC(smock, -.08); L.legs = pick(['#1a1a22', '#2a2a3a', '#e8e0d0']); L.legB = L.legs; L.under = L.legs; L.hand = L.skin;
  L.wpn = type === 'blower' ? 'dryer' : type === 'sprayer' ? 'spray' : pick(['comb', 'razor', 'shears', 'curler']); L.acc = []; L.shoulder = 'none';
  L.torso = (c, S, tor) => { c.fillStyle = shadeC(smock, -.2); c.fillRect(S.chest[0] - 1, S.chest[1] + 2, 1.2, (S.hip[1] - S.chest[1]) - 2);   // smock seam
    c.fillStyle = '#efe6d2'; c.fillRect(S.chest[0] + 2, S.chest[1] + 5, 4, 3); c.fillStyle = smock === '#1a1a22' ? '#e86aa0' : '#1a1a22'; c.font = 'bold 2.5px sans-serif'; c.fillText('✂', S.chest[0] + 2.4, S.chest[1] + 7.6); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr; disc(c, x, y, R, L.skin, rim); hairdo(c, x, y, R, doK, dye, t, o.flow || 0); if (Math.sin(t * 1.3 + seed) < .985) eye(c, x + R * .5, y - R * .1);
    if (seed % 3 === 0) { c.fillStyle = OUT; c.fillRect(x + R * .15, y - R * .3, R * .9, R * .32); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(x + R * .2, y - R * .28, R * .3, 1); }   // shades
    c.fillStyle = '#c83a5a'; c.fillRect(x + R * .45, y + R * .5, R * .4, o.shout ? R * .35 : 1); };
  L.weapon = (c, S, p, t, o) => { const [hx, hy] = S.aF[2], a = S.handAng, dx = Math.sin(a), dy = Math.cos(a), along = (l0, l1) => [[hx + dx * l0, hy + dy * l0], [hx + dx * l1, hy + dy * l1]];
    switch (L.wpn) {
      case 'comb': limb(c, along(-1, 12), 2.6, '#1a1a22'); for (let k = 2; k < 12; k += 1.5) { c.fillStyle = '#1a1a22'; c.fillRect(hx + dx * k + dy * 1.4, hy + dy * k - dx * 1.4, 1, 1); c.fillRect(hx + dx * k + dy * 2.6, hy + dy * k - dx * 2.6, .8, .8); } break;
      case 'razor': limb(c, along(-1, 4), 2, '#efe6d2'); limb(c, along(4, 11), 1.6, '#e8eef4'); c.fillStyle = '#ffffff'; c.fillRect(hx + dx * 8 - .5, hy + dy * 8 - .5, 1, 1); break;
      case 'shears': for (const sg of [-1, 1]) limb(c, [[hx, hy], [hx + dx * 11 + dy * sg * 1.5, hy + dy * 11 - dx * sg * 1.5]], 1.2, '#d8dce4'); disc(c, hx - dy * 2, hy + dx * 2, 1.6, '#e86aa0'); break;
      case 'curler': limb(c, along(-2, 4), 2.4, '#2a2a30'); limb(c, along(4, 12), 2, '#c8c8d0'); c.fillStyle = `rgba(255,${120 + Math.sin(t * 9) * 40 | 0},40,.85)`; c.beginPath(); c.arc(hx + dx * 12, hy + dy * 12, 1.8, 0, 7); c.fill(); break;
      case 'dryer': poly(c, [[hx - dy * 2 - dx * 2, hy + dx * 2 - dy * 2], [hx + dx * 3, hy + dy * 3], [hx + dx * 3 + dy * 5, hy + dy * 3 - dx * 5], [hx - dx * 6 + dy * 6, hy - dy * 6 - dx * 6], [hx - dx * 9 + dy * 4, hy - dy * 9 - dx * 4]], smock === '#1a1a22' ? '#e86aa0' : '#f4f0e8');
        disc(c, hx - dx * 8 + dy * 5, hy - dy * 8 - dx * 5, 2.4, '#3a3a40'); if (o.muzzle) { c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = .8; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(hx + dx * 4 + dy * (4 + k), hy + dy * 4 - dx * (4 + k)); c.lineTo(hx + dx * 14 + dy * (3 + k * 2), hy + dy * 14 - dx * (3 + k * 2)); c.stroke(); } } break;
      case 'spray': poly(c, [[hx - 2.4, hy - 7], [hx + 2.4, hy - 7], [hx + 2.4, hy + 3], [hx - 2.4, hy + 3]], '#e86aa0'); c.fillStyle = '#d8dce4'; c.fillRect(hx - 1.2, hy - 9, 2.4, 2); c.fillStyle = '#ffffff'; c.fillRect(hx - 2, hy - 4, 4, 2); break;
    } };
  return L; }
function hareLook(seed) {
  let s = seed * 13 + 5; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280, pick = a => a[(r() * a.length) | 0];
  const fur = pick(['#f4f0e8', '#c8a070', '#9a8a7a', '#e8c8a0', '#5a4a40']), belly = shadeC(fur, .35), dye = pick(DYES), doK = pick(['quiff', 'mohawk', 'perm', 'bouffant']), ear2 = pick(['bow', 'curlers', 'ring', 'none']), sc = 1.12 + r() * .15;
  const L = { type: 'hare', seed, b: BONES(sc, { head: 1.18, leg: 1.3, arm: .9, wide: .92, tall: .95 }), top: fur, arms: fur, legs: fur, legB: shadeC(fur, -.12), skin: fur, hand: belly, boots: shadeC(fur, -.25), wpn: 'paws', persona: { brave: r(), lazy: r(), jumpy: .9, show: r() }, name: pick(NAMES), voice: 300 };
  L.foot = (c, f, k, col) => { c.fillStyle = OUT; c.beginPath(); c.ellipse(f[0] + 4, f[1] - 1.5, 7 + INKW, 2.6 + INKW, 0, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.ellipse(f[0] + 4, f[1] - 1.5, 7, 2.6, 0, 0, 7); c.fill(); };
  L.behind = (c, S, p, t, o) => { disc(c, S.hip[0] - L.b.hw - 2, S.hip[1] - 2 + Math.sin(t * 8) * .5, 3.4, belly); };   // the cotton tail
  L.torso = (c, S, tor) => { poly(c, [[lerp(tor[0][0], tor[1][0], .45), tor[0][1] + 3], [tor[1][0] - 1, tor[1][1] + 3], [tor[2][0] - 1, tor[2][1] - 2], [lerp(tor[3][0], tor[2][0], .45), tor[3][1] - 2]], belly); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr, fl = o.flow || 0, tw = Math.sin(t * 3 + seed) * .08;
    for (const [dx0, a0, len] of [[-.35, -.25 + tw, 2.3], [.15, .05 - tw, 2.1]]) { const a = a0 - fl * .3, bx = x + R * dx0, by = y - R * .6, tx = bx + Math.sin(a) * R * len, ty = by - Math.cos(a) * R * len;
      limb(c, [[bx, by], [tx, ty]], R * .62, fur, rim, R * .5); limb(c, [[bx + .3, by - R * .3], [tx + Math.sin(a) * -1, ty + 1.5]], R * .26, '#f0a0b0');
      if (ear2 === 'curlers' && dx0 > 0) { for (let k = 0; k < 2; k++) disc(c, lerp(bx, tx, .4 + k * .3), lerp(by, ty, .4 + k * .3), 1.6, k ? '#ff7ab0' : '#7ad8ff'); }
      if (ear2 === 'bow' && dx0 < 0) { poly(c, [[tx - 3, ty + 3], [tx, ty + 4.5], [tx - 3, ty + 6]], dye); poly(c, [[tx + 3, ty + 3], [tx, ty + 4.5], [tx + 3, ty + 6]], dye); }
      if (ear2 === 'ring' && dx0 > 0) { c.strokeStyle = '#ffd23f'; c.lineWidth = .8; c.beginPath(); c.arc(lerp(bx, tx, .3) + 1.4, lerp(by, ty, .3), 1.3, 0, 7); c.stroke(); } }
    c.fillStyle = OUT; c.beginPath(); c.ellipse(x + R * .2, y, R * 1.15 + INKW, R * .95 + INKW, -.15, 0, 7); c.fill(); c.fillStyle = fur; c.beginPath(); c.ellipse(x + R * .2, y, R * 1.15, R * .95, -.15, 0, 7); c.fill();
    c.fillStyle = belly; c.beginPath(); c.ellipse(x + R * .85, y + R * .35, R * .5, R * .4, 0, 0, 7); c.fill();   // muzzle
    hairdo(c, x - R * .1, y + R * .1, R * .8, doK, dye, t, fl);
    c.fillStyle = '#f07090'; c.beginPath(); c.arc(x + R * 1.25, y + R * .15, R * .18, 0, 7); c.fill();
    if (Math.sin(t * 1.1 + seed) < .985) { c.fillStyle = '#c82a2a'; c.fillRect(x + R * .45, y - R * .25, 2, 2); c.fillStyle = '#140c08'; c.fillRect(x + R * .55, y - R * .2, 1, 1); }   // mutant red eyes
    c.fillStyle = '#ffffff'; c.fillRect(x + R * .95, y + R * .55, 1.6, o.shout ? 2.6 : 2); c.strokeStyle = OUT; c.lineWidth = .4; c.strokeRect(x + R * .95, y + R * .55, 1.6, 2);
    c.strokeStyle = 'rgba(30,20,20,.6)'; c.lineWidth = .4; for (const dy0 of [-.1, .15]) { c.beginPath(); c.moveTo(x + R * 1.1, y + R * (.25 + dy0)); c.lineTo(x + R * 1.9, y + R * (.1 + dy0 * 2)); c.stroke(); } };
  L.weapon = null; return L; }
function badgerLook(seed) {
  let s = seed * 17 + 11; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280, pick = a => a[(r() * a.length) | 0];
  const fur = pick(['#8a8a90', '#7a7468', '#9a9488', '#6a6a72']), dye = pick(['#f4f0e8', '#ffd23f', '#ff8ab0', '#c8c8d0', '#a8d8ff']), doK = pick(['bouffant', 'slick', 'quiff']), sc = 1.22 + r() * .12;
  const L = { type: 'badger', seed, b: BONES(sc, { wide: 1.6, leg: .78, arm: 1.25, head: 1.12, tall: .82 }), top: fur, arms: shadeC(fur, -.1), legs: '#2a2a30', legB: '#22222a', skin: fur, hand: '#2a2a30', boots: '#1a1a1e', wpn: 'brush', persona: { brave: .9, lazy: r(), jumpy: .1, show: r() }, name: pick(NAMES), voice: 110 };
  L.foot = (c, f, k, col) => { c.fillStyle = OUT; c.fillRect(f[0] - 3, f[1] - 3, 10, 4); c.fillStyle = col; c.fillRect(f[0] - 2, f[1] - 2, 8, 2); c.fillStyle = '#efe6d2'; for (let k2 = 0; k2 < 3; k2++) c.fillRect(f[0] + 5 + k2 * .1, f[1] - 2.5 + k2 * 1.2, 2, .6); };
  L.torso = (c, S, tor) => { c.fillStyle = 'rgba(255,255,255,.18)'; for (let k = 0; k < 6; k++) c.fillRect(lerp(tor[0][0], tor[3][0], k / 6) + 2, lerp(tor[0][1], tor[3][1], k / 6) + 1, 3, .7);   // brushed fur
    c.fillStyle = '#1a1a1e'; c.fillRect(S.hip[0] - L.b.hw, S.hip[1] - 4, L.b.hw * 2, 2.4); c.fillStyle = '#ffd23f'; c.fillRect(S.hip[0] - 1.5, S.hip[1] - 4.5, 3, 3); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr;
    poly(c, [[x - R * .95, y + R * .6], [x - R * 1.0, y - R * .55], [x - R * .2, y - R * 1.0], [x + R * .7, y - R * .6], [x + R * 1.7, y + R * .15], [x + R * 1.6, y + R * .55], [x + R * .6, y + R * .9]], '#1a1a1e', rim);   // the black mask, the long snout
    poly(c, [[x - R * .9, y - R * .35], [x - R * .1, y - R * .95], [x + R * 1.55, y + R * .05], [x + R * 1.5, y + R * .2], [x - R * .2, y - R * .5]], '#f4f0e8');   // the white stripe
    poly(c, [[x - R * .95, y + R * .25], [x + R * .2, y + R * .2], [x + R * .6, y + R * .85], [x - R * .6, y + R * .7]], '#f4f0e8');
    disc(c, x + R * 1.72, y + R * .3, R * .22, '#0c0a0c');
    hairdo(c, x - R * .35, y - R * .1, R * .85, doK, dye, t, o.flow || 0);
    if (Math.sin(t * 1.2 + seed) < .985) { c.fillStyle = '#ffd23f'; c.fillRect(x + R * .55, y - R * .1, 1.6, 1.4); }
    disc(c, x - R * .55, y - R * .85, R * .22, '#1a1a1e');
    if (o.shout) { c.fillStyle = '#3a1014'; c.fillRect(x + R * 1.0, y + R * .5, R * .5, R * .3); } };
  L.weapon = (c, S, p, t, o) => { const [hx, hy] = S.aF[2], a = S.handAng, dx = Math.sin(a), dy = Math.cos(a);   // a giant shaving brush: a blaireau
    limb(c, [[hx - dx * 3, hy - dy * 3], [hx + dx * 7, hy + dy * 7]], 3, '#c8963a'); c.fillStyle = '#efe6d2'; c.fillRect(hx + dx * 7 - 2, hy + dy * 7 - 2, 4, 4);
    c.fillStyle = OUT; c.beginPath(); c.ellipse(hx + dx * 13, hy + dy * 13, 5.6 + INKW, 4.4 + INKW, a, 0, 7); c.fill(); c.fillStyle = '#5a4a3a'; c.beginPath(); c.ellipse(hx + dx * 13, hy + dy * 13, 5.6, 4.4, a, 0, 7); c.fill();
    c.fillStyle = '#ffffff'; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(hx + dx * (15 + Math.sin(k * 2) * 2) + dy * (k - 2) * 1.6, hy + dy * (15 + Math.cos(k) * 2) - dx * (k - 2) * 1.6, 1.8, 0, 7); c.fill(); } };
  return L; }
// CALVE-HAIR himself
function calveLook() {
  const L = { b: BONES(1.42, { wide: .82, leg: 1.55, arm: 1.25, tall: 1.18, head: .95 }), top: '#c8205a', arms: '#c8205a', legs: '#f4f0e8', legB: '#d8d0c4', skin: '#d8a070', hand: '#d8a070', boots: '#1a1418', seed: 13, name: 'Calve-Hair', wpn: 'scissors', voice: 140 };
  const HAIR = '#3a1a10', HAIR2 = '#5a2a18', GOLD = '#ffd23f';
  L.foot = (c, f, k, col) => { poly(c, [[f[0] - 3, f[1]], [f[0] + 9, f[1]], [f[0] + 4, f[1] - 2.6], [f[0] - 3, f[1] - 2.6]], col); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(f[0], f[1] - 2.2, 4, .6); };   // pointy patent shoes
  // the hair: a curtain of long strands down his back that streams and swirls; in the tornado it becomes a vortex
  L.behind = (c, S, p, t, o) => { const [x, y] = S.head, R = L.b.hr, m = MO(o), spin = o.tornado || 0;
    if (spin > 0) { for (let k = 0; k < 14; k++) { const a0 = t * 14 + k * .45, rad = 8 + (k % 5) * 3.5; c.strokeStyle = k % 2 ? HAIR : HAIR2; c.lineWidth = 2.4 - (k % 3) * .5; c.beginPath();
        for (let j = 0; j <= 10; j++) { const u = j / 10, a = a0 + u * 2.6, rr2 = rad + u * 10 * spin, yy = y + R * .5 + u * 30 + Math.sin(a * 2) * 2; const px = x + Math.cos(a) * rr2, py = yy + Math.sin(a) * rr2 * .25; j ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); } return; }
    for (let k = 0; k < 11; k++) { const z = (k - 5) * .16; strand(c, x - R * .5 + z * 2, y - R * .2 + Math.abs(z) * 3, streamA(-.12 - Math.abs(z) * .3, m, 1.1) + Math.sin(t * 1.3 + k) * .08 + (o.swirl || 0) * Math.sin(t * 3 + k * .7), 30 + (k % 3) * 5, 7, 3.2, .8, k % 2 ? HAIR : HAIR2, -.3 - m.hs * .4 + Math.sin(t * .9 + k) * .2, .12, t, k * .6, k % 3 === 0 ? '#8a4a2a' : null); } };
  L.torso = (c, S, tor) => { // a tight satin shirt open at the collar, gold chains, a white belt with a golden buckle
    poly(c, [[S.chest[0] + 1, S.chest[1] + .5], [S.chest[0] + 5, S.chest[1] + .5], [S.chest[0] + 3, S.chest[1] + 7]], L.skin);
    c.strokeStyle = GOLD; c.lineWidth = .8; c.beginPath(); c.arc(S.chest[0] + 2.5, S.chest[1] + 1.5, 3.5, .3, Math.PI - .5); c.stroke(); c.beginPath(); c.arc(S.chest[0] + 2.5, S.chest[1] + 2.5, 5, .4, Math.PI - .6); c.stroke(); disc(c, S.chest[0] + 3, S.chest[1] + 7.2, 1.2, GOLD);
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(tor[0][0] + 2, tor[0][1] + 2); c.lineTo(tor[3][0] + 3, tor[3][1] - 3); c.stroke();
    c.fillStyle = '#f4f0e8'; c.fillRect(S.hip[0] - L.b.hw, S.hip[1] - 3, L.b.hw * 2, 2); c.fillStyle = GOLD; c.fillRect(S.hip[0] - 1.5, S.hip[1] - 3.5, 3, 3); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr, m = MO(o);
    if (o.flat) { poly(c, [[x - R * 1.15, y + R * 1.6], [x - R * 1.1, y - R * .9], [x, y - R * 1.15], [x + R * 1.2, y - R * .7], [x + R * 1.25, y + R * 1.7]], HAIR); return; }   // beaten: his hair falls flat over his face
    c.fillStyle = OUT; c.beginPath(); c.ellipse(x + R * .1, y, R * .92 + INKW, R * 1.1 + INKW, -.1, 0, 7); c.fill(); c.fillStyle = L.skin; c.beginPath(); c.ellipse(x + R * .1, y, R * .92, R * 1.1, -.1, 0, 7); c.fill();   // a long face
    poly(c, [[x + R * .85, y - R * .15], [x + R * 1.45, y + R * .35], [x + R * .9, y + R * .45]], L.skin);   // the Roman nose
    c.fillStyle = '#2a140c'; c.fillRect(x + R * .25, y - R * .45, R * .7, R * .14);   // the arched brow
    if (Math.sin(t * 1.2) < .985) { c.fillStyle = '#140c08'; c.fillRect(x + R * .55, y - R * .25, 1.6, 1.4); }
    c.fillStyle = '#2a140c'; c.beginPath(); c.moveTo(x + R * .55, y + R * .55); c.quadraticCurveTo(x + R * .95, y + R * .45, x + R * 1.2, y + R * .7); c.quadraticCurveTo(x + R * .95, y + R * .6, x + R * .55, y + R * .62); c.fill();   // the pencil moustache
    if (o.shout) { c.fillStyle = '#3a0c10'; c.fillRect(x + R * .6, y + R * .72, R * .45, R * .3); }
    // the crown of his hair: a high, glossy swept-back wave
    poly(c, [[x - R * 1.0, y + R * .2], [x - R * 1.05, y - R * .8], [x - R * .3, y - R * 1.45], [x + R * .7 - m.hs, y - R * 1.5], [x + R * 1.15, y - R * 1.0], [x + R * .4, y - R * .85], [x - R * .3, y - R * .4]], HAIR, rim);
    c.strokeStyle = '#8a4a2a'; c.lineWidth = .8; c.beginPath(); c.moveTo(x - R * .6, y - R * 1.1); c.quadraticCurveTo(x + R * .1, y - R * 1.5, x + R * .8, y - R * 1.25); c.stroke(); };
  L.weapon = (c, S, p, t, o) => { for (const A of [S.aF, S.aB]) { const [hx, hy] = A[2], a = A === S.aF ? S.handAng : S.aB[0] + (p.aB ? p.aB[1] : 0), dx = Math.sin(a), dy = Math.cos(a), open = o.snip ? Math.abs(Math.sin(t * 22)) * .5 : .12;
      for (const sg of [-1, 1]) { const bx = Math.sin(a + sg * open), by = Math.cos(a + sg * open); limb(c, [[hx, hy], [hx + bx * 15, hy + by * 15]], 1.5, '#ffe88a'); }   // the golden blades
      c.strokeStyle = GOLD; c.lineWidth = 1.2; for (const sg of [-1, 1]) { c.beginPath(); c.arc(hx - dx * 2 + dy * sg * 2, hy - dy * 2 - dx * sg * 2, 1.8, 0, 7); c.stroke(); } } };
  L.handF = true; L.handB = true; return L; }
const CALVE = calveLook();

// ---- spawning --------------------------------------------------------------------------------------------------------
function bouldSpawn(e, from) {
  if (e.type === 'stylist' || e.type === 'blower' || e.type === 'sprayer') e.look = stylistLook(SEEDN++, e.type);
  if (e.type === 'hare') { e.look = hareLook(SEEDN++); e.hopT = Math.random() * 6; }
  if (e.type === 'badger') { e.look = badgerLook(SEEDN++); e.burCD = 3 + Math.random() * 3; e.foamCD = 2 + Math.random() * 3; }
  if (e.type === 'calve') { e.look = CALVE; e.x = scr.barX || camX + VW * .8; e.z = 40; e.y = 0; e.state = 'intro'; e.inv = 99; e.healCD = 10; e.torCD = 6; e.ot = 0; WORLD.boss = e; WORLD.calve = e; WORLD.oscar = e;
    musicPlay('bouldaire', true); if (typeof STORY3 !== 'undefined' && STORY3) playLines(STORY3.calve, false); }
}
const CALVE_SAY = {
  intro: [['Bienvenue au Salon Calve-Hair. Shampoing, coupe… et coups.', 'Asseyez-vous. Ou allongez-vous, c’est pareil.'], ['Welcome to Salon Calve-Hair. Shampoo, cut… and a beating.', 'Take a seat. Or lie down, same thing.']],
  snip: [['Un petit rafraîchissement ?', 'On égalise !', 'Snip snip !', 'Juste les pointes…'], ['A little trim?', 'Let’s even it out!', 'Snip snip!', 'Just the ends…']],
  kick: [['Mes jambes sont plus longues que vos carrières !', 'Hop !', 'Pas sur les chaussures !'], ['My legs are longer than your careers!', 'Hop!', 'Not on the shoes!']],
  tornado: [['BRUSHING TOTAL !', 'Tourbillon de soie !', 'Admirez le volume !'], ['TOTAL BLOW-DRY!', 'Whirlwind of silk!', 'Behold the volume!']],
  spray: [['Un peu de laque…', 'Ça fixe tout. Même les bleus.', 'Tenue extra-forte !'], ['A little hairspray…', 'It holds everything. Even bruises.', 'Extra-strong hold!']],
  stopped: [['Mon brushing !', 'On ne touche pas à la laque !', 'BARBARE !'], ['My blow-dry!', 'Never touch the hairspray!', 'BARBARIAN!']],
  dazed: [['Ma… ma raie…', 'Où est mon peigne ?'], ['My… my parting…', 'Where’s my comb?']]
};
const cSay = k => { const v = CALVE_SAY[k], q = (Math.random() * v[0].length) | 0; return LANG === "en" ? v[1][q] : v[0][q]; };

// ---- the goons' special moves (run before the ordinary soldier logic; true = handled this frame) ---------------------
function w3Pre(e, dt, p) {
  const dx = p.x - e.x, dz = p.z - e.z, ad = Math.abs(dx);
  if (e.type === 'hare') {
    if (e.state === 'crouch') { e.t2 -= dt; e.face = Math.sign(dx) || e.face; if (e.t2 <= 0) { e.state = 'pounce'; const T = .62; e.vy = 300; e.y = .5; e.pvx = (p.x - e.face * 12 - e.x) / T; e.pvz = (p.z - e.z) / T; SFX.jump('raccoon', e.x); } return true; }
    if (e.state === 'pounce') { e.x += e.pvx * dt; e.z = Math.max(0, Math.min(DEPTH, e.z + e.pvz * dt)); if (e.y <= 0 && e.vy <= 0) { e.state = 'walk'; e.cd = 1.2; dustAt(e.x, e.z); WORLD.shake = Math.max(WORLD.shake, 2); SFX.land('raccoon', e.x, .6);
        for (const q of players) if (q.ko <= 0 && Math.abs(q.x - e.x) < 22 && Math.abs(q.z - e.z) < 14 && q.y < 20) { if (hitPlayer(q, 1, e.face, e)) { q.vx = e.face * 200; } } } return true; }
    if (e.state === 'stompW') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'strike'; e.t2 = .25; fx.push({ k: 'ring', x: e.x, z: e.z, max: 80, t: .45, col: '#f4f0e8' }); quake(4); puff(e.x, e.z, 6, 0, 1.2); SFX.land('cyborg', e.x, 1); inkHit(e.x, e.z, 6, true);
        for (const q of players) if (q.ko <= 0 && q.y < 4 && Math.hypot(q.x - e.x, (q.z - e.z) * 2) < 80) { if (hitPlayer(q, 1, Math.sign(q.x - e.x) || 1, e)) { q.vx = (Math.sign(q.x - e.x) || 1) * 240; q.vy = 150; q.y = Math.max(1, q.y); } } e.cd = 1.4; } return true; }
    if (e.cd <= 0 && e.y <= 0 && inView(e, 30)) { e.hopT -= dt * 4;
      if (ad > 70 && ad < 170 && Math.abs(dz) < 40 && Math.random() < dt * 1.6) { e.state = 'crouch'; e.t2 = .38; e.face = Math.sign(dx) || 1; return true; }
      if (ad < 70 && Math.abs(dz) < 30 && e.hopT <= 0 && Math.random() < dt * .8) { e.state = 'stompW'; e.t2 = .55; e.hopT = 7 + Math.random() * 4; quip(e, LANG === 'fr' ? '*TAP TAP*' : '*THUMP THUMP*', 1); return true; } }
    return false; }
  if (e.type === 'badger') { e.burCD -= dt; e.foamCD -= dt;
    if (e.state === 'dig') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'under'; e.t2 = 1.3; e.under = 1; } if (Math.random() < dt * 20) splinters(e.x, e.z, 1, '#c8b8a0', .3); return true; }
    if (e.state === 'under') { e.t2 -= dt; const sp = 120; e.x += Math.sign(dx) * Math.min(ad, sp * dt); e.z += Math.sign(dz) * Math.min(Math.abs(dz), sp * .6 * dt); if (Math.random() < dt * 14) splinters(e.x, e.z, 1, '#b8a890', .2);
      if (e.t2 <= 0 || (ad < 8 && Math.abs(dz) < 6)) { e.state = 'popup'; e.t2 = .35; e.under = 0; } return true; }
    if (e.state === 'popup') { if (!e.popped) { e.popped = 1; e.vy = 220; e.y = .5; quake(5); splinters(e.x, e.z, 14, '#d8ccb8', .8); fx.push({ k: 'ring', x: e.x, z: e.z, max: 40, t: .3, col: '#e8dcc8' }); SFX.smash('rubble', .4, e.x); inkHit(e.x, e.z, 30, true);
        for (const q of players) if (q.ko <= 0 && Math.abs(q.x - e.x) < 22 && Math.abs(q.z - e.z) < 14) { if (hitPlayer(q, 1, e.face, e)) { q.vy = 280; q.y = Math.max(1, q.y); q.vx = e.face * 80; } } }
      e.t2 -= dt; if (e.t2 <= 0 && e.y <= 0) { e.state = 'walk'; e.popped = 0; e.cd = 1; e.burCD = 7 + Math.random() * 4; } return true; }
    if (e.cd <= 0 && e.y <= 0 && inView(e, 30)) {
      if (e.burCD <= 0 && ad > 80 && Math.random() < dt * 1.2) { e.state = 'dig'; e.t2 = .5; e.inv = 1.9; quip(e, LANG === 'fr' ? 'Je creuse !' : 'Digging in!', 1); return true; }
      if (e.foamCD <= 0 && ad > 60 && ad < 220 && Math.random() < dt * 1.2) { e.foamCD = 5 + Math.random() * 3; e.cd = 1.4; const T = Math.max(.45, Math.min(.9, ad / 240)); fx.push({ k: 'foamball', x: e.x + e.face * 10, z: e.z, y: 46, vx: (p.x - e.x) / T, vz: (p.z - e.z) / T, vy: 210, t: 3, rot: 0 }); jolt(e, 1.2, -1.4, -1); SFX.swish('squelch', .6, e.x); return true; } }
    return false; }
  return false; }
// the ranged goons' shots
function w3Shot(e) { const p = targetOf(e); if (!p) return;
  if (e.type === 'blower') { fx.push({ k: 'gust', x: e.x + e.face * 16, z: e.z, y: 36, vx: e.face * 250, t: 1.6, hit: new Set() }); SFX.swish('fire', .8, e.x); try { sNoise(SND.now(), .7, .14, 600, 2400, 'bandpass', .8); } catch (er) {} }
  if (e.type === 'sprayer') { const dx = p.x - e.x, T = Math.max(.4, Math.min(.85, Math.abs(dx) / 260)); fx.push({ k: 'scan', x: e.x + e.face * 10, z: e.z, y: 50, vx: dx / T, vz: (p.z - e.z) / T, vy: 220, t: 3, rot: 0 }); SFX.swish('light', .5, e.x); } }
// what a melee hit does on top of the damage
function w3OnHit(e, q) { const w = e.look && e.look.wpn;
  if (w === 'razor' || w === 'shears' || (w === 'comb' && Math.random() < .3)) addStatus(q, 'bleed');
  if (w === 'curler') { q.vx = e.face * 260; puff(q.x, q.z, 3, e.face, .8); fx.push({ k: 'smoke2', x: q.x, z: q.z, y: 40, vx: 0, vy: 30, t: .8, T: .8, r: 4 }); }
  if (w === 'brush') addStatus(q, 'lather'); }

// ---- CALVE-HAIR's fight ----------------------------------------------------------------------------------------------
function updateCalve(e, dt) {
  const p = targetOf(e); e.ot += dt; e.healCD -= dt; e.cd -= dt; e.torCD -= dt; e.y = 0; e.vy = 0;
  if (e.state === 'kneel') return;
  if (e.state === 'intro') { e.face = -1; if (e.ot > 2.8) { e.state = 'walk'; e.inv = 0; e.cd = 1; } return; }
  if (!p) return; const dx = p.x - e.x, dz = p.z - e.z, ad = Math.abs(dx);
  if (e.state === 'dazed') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'walk'; e.cd = .6; } return; }
  if (e.state === 'spray') { e.t2 -= dt; e.face = Math.sign(dx) || e.face; if (Math.random() < dt * 18) fx.push({ k: 'hspray', x: e.x + (Math.random() - .5) * 30, z: e.z, y: 100 + Math.random() * 30, t: 1.4, T: 1.4, r: 6 + Math.random() * 6, from: e });
    if (e.t2 <= 0) { e.hp = Math.min(e.max, e.hp + e.max * .15); fx.push({ k: 'plus', x: e.x, z: e.z, t: 1 }); pop(e.x, e.z, 130, '+15 %', '#7dffc0'); e.state = 'walk'; e.healCD = 20; e.cd = .8; SFX.heal(e.x); } return; }
  if (e.state === 'wind') { e.t2 -= dt; e.face = Math.sign(dx) || e.face; if (e.t2 <= 0) { if (e.act === 'tornado') { e.state = 'tornado'; e.t2 = 2.8; e.thit = new Set(); quake(3); } else { e.state = 'strike'; e.t2 = e.act === 'snip' ? .55 : .3; e.hitDone = new Set(); calveStrikeFx(e); } } return; }
  if (e.state === 'strike') { e.t2 -= dt;
    if (e.act === 'snip') { for (const q of players) if (q.ko <= 0 && !e.hitDone.has(q) && Math.abs(q.z - e.z) < 14 && (q.x - e.x) * e.face > -6 && Math.abs(q.x - e.x) < 50 && Math.abs(q.y - e.y) < 50) { e.hitDone.add(q); if (q.dodge > 0) { hitPlayer(q, 0, 0, null); continue; } hitPlayer(q, 0, e.face, e); addStatus(q, 'bleed'); }
      if (Math.random() < dt * 14) fx.push({ k: 'snip', x: e.x + e.face * (30 + Math.random() * 14), z: e.z, y: 60 + Math.random() * 24, t: .18, T: .18, a: Math.random() * 6, face: e.face }); }
    if (e.act === 'kick' && e.t2 < .22 && !e.kicked) { e.kicked = 1; for (const q of players) if (q.ko <= 0 && Math.abs(q.z - e.z) < 16 && (q.x - e.x) * e.face > -6 && Math.abs(q.x - e.x) < 82 && Math.abs(q.y - e.y) < 60) { if (hitPlayer(q, 1, e.face, e)) { q.vx = e.face * 400; q.vy = 170; q.y = Math.max(1, q.y); } }
      fx.push({ k: 'kickarc', x: e.x + e.face * 40, z: e.z, y: 64, face: e.face, t: .2, T: .2 }); }
    if (e.t2 <= 0) { e.state = 'walk'; e.kicked = 0; e.cd = .7 + Math.random() * .7; } return; }
  if (e.state === 'tornado') { e.t2 -= dt; e.x += Math.sign(dx) * Math.min(ad, 70 * dt); e.z += Math.sign(dz) * Math.min(Math.abs(dz), 34 * dt); e.x = Math.max(camX + 40, Math.min(camX + VW - 40, e.x)); e.face = Math.floor(e.ot * 12) % 2 ? 1 : -1;
    if (Math.random() < dt * 30) fx.push({ k: 'puff', x: e.x + (Math.random() - .5) * 50, z: e.z + (Math.random() - .5) * 10, y: 2, vx: (Math.random() - .5) * 120, vy: 20, r: 3 + Math.random() * 3, t: .5, T: .6 });
    for (const q of players) if (q.ko <= 0 && Math.abs(q.x - e.x) < 64 && Math.abs(q.z - e.z) < 24 && q.y < 70) { const s = Math.sign(q.x - e.x) || 1; q.vx = s * 360; if (!e.thit.has(q)) { e.thit.add(q); if (q.dodge <= 0) { hitPlayer(q, 0, s, e); q.vy = 140; q.y = Math.max(1, q.y); addStatus(q, 'dizzy'); } } }
    for (const b of BREAK) if (!b.broken && !b.held && b.size !== 'l' && Math.abs(b.x - e.x) < 50 && Math.abs(b.z - e.z) < 20 && !b.thrown) { b.vx = (Math.sign(b.x - e.x) || 1) * 200; }
    for (const o of enemies) if (o !== e && !o.dead && Math.abs(o.x - e.x) < 50 && Math.abs(o.z - e.z) < 20) { o.vx = (Math.sign(o.x - e.x) || 1) * 300; o.vy = 160; o.y = Math.max(1, o.y); }
    if (e.t2 <= 0) { e.state = 'walk'; e.torCD = 10 + Math.random() * 3; e.cd = 1; } return; }
  if (!inView(e, 34)) { const tw = Math.sign(camX + VW / 2 - e.x); e.x += tw * ETYPES.calve.spd * 1.6 * dt; e.face = tw; e.walk += dt * 9; e.mv = 1; e.cd = Math.max(e.cd, .5); return; }
  // walking: he likes kicking distance
  e.face = Math.sign(dx) || e.face; const want = ad < 44 ? -1 : ad > 76 ? 1 : 0, mx = want * Math.sign(dx), mz = Math.abs(dz) > 6 ? Math.sign(dz) : 0;
  const nx = e.x + mx * ETYPES.calve.spd * dt; if (nx > camX + 30 && nx < camX + VW - 30) e.x = nx; e.z = Math.max(0, Math.min(DEPTH, e.z + mz * 30 * dt)); if (mx || mz) { e.walk += dt * 7; e.mv = 1; }
  if (e.cd > 0) return;
  if (e.healCD <= 0 && e.hp < e.max * .75) { e.state = 'spray'; e.t2 = 1.8; quip(e, cSay('spray'), 1.8); return; }
  const near = players.filter(q => q.ko <= 0 && Math.abs(q.x - e.x) < 110).length;
  if (e.torCD <= 0 && (near >= 2 || Math.random() < .3)) { e.state = 'wind'; e.act = 'tornado'; e.t2 = .7; quip(e, cSay('tornado'), 1.6); return; }
  if (ad < 52 && Math.abs(dz) < 12) { e.state = 'wind'; e.act = Math.random() < .7 ? 'snip' : 'kick'; e.t2 = e.act === 'snip' ? .32 : .45; if (Math.random() < .4) quip(e, cSay(e.act), 1.3); return; }
  if (ad < 90 && Math.abs(dz) < 14) { e.state = 'wind'; e.act = 'kick'; e.t2 = .45; if (Math.random() < .35) quip(e, cSay('kick'), 1.3); return; }
  e.cd = .3; }
function calveStrikeFx(e) { if (e.act === 'snip') SFX.swish('blade', .8, e.x); else { SFX.swish('heavy', 1, e.x); SFX.voice('amiral', 'effort', e.x); } }
// may this hit land on him? The tornado shrugs off everything but a charge or a thrown object, which break it.
function calveCanHit(e, src) {
  if (e.state !== 'tornado' && e.state !== 'wind' || e.act !== 'tornado') return true;
  if (e.state === 'wind') return true;
  const charge = src && src.dash > 0, thrown = HITKIND === 'throw';
  if (charge || thrown) { e.state = 'dazed'; e.t2 = 1.8; e.torCD = 9; quip(e, cSay('dazed'), 1.6); pop(e.x, e.z, 130, LANG === 'fr' ? 'TORNADE BRISÉE !' : 'TORNADO BROKEN!', '#ffd23f'); quake(6); camPunch(e.x, e.z, 20, .08); for (let k = 0; k < 5; k++) fx.push({ k: 'starfall', x: e.x + (k - 2) * 6, z: e.z, y: 120, vy: 30 + k * 10, vx: (k - 2) * 25, t: .9 }); return true; }
  if (src && src.w) { src.vx = (Math.sign(src.x - e.x) || 1) * 300; pop(e.x, e.z, 120, LANG === 'fr' ? 'REPOUSSÉ !' : 'DEFLECTED!', '#ff8ab0');
    e.bounced = (e.bounced || 0) + 1; if (e.bounced >= 3 && time - (e.hintT || -99) > 25) { e.hintT = time; e.bounced = 0; banner(LANG === 'fr' ? 'La tornade ! Foncez (→→) ou lancez-lui quelque chose !' : 'The tornado! Charge (→→) or throw something at him!', -1, true, '#ffd23f'); } }   // three punches bounced off: tell them how
  return false; }
function calveHit(e, src) { if (e.state === 'spray') { e.state = 'walk'; e.healCD = 20; e.cd = .6; quip(e, cSay('stopped'), 1.8); pop(e.x, e.z, 130, LANG === 'fr' ? 'INTERROMPU !' : 'INTERRUPTED!', '#ffd23f'); } }
function calveDown(e) { e.state = 'kneel'; e.inv = 99; e.hp = 1; WORLD.oscarDownT = time; for (const o of enemies) if (o !== e && !o.dead) o.flee = 99; fx = fx.filter(f => !['gust', 'scan', 'foamball', 'hspray'].includes(f.k)); for (const p of players) p.st = [];
  banner(LANG === 'fr' ? 'CALVE-HAIR À GENOUX' : 'CALVE-HAIR KNEELS', -1, true, '#ffd23f'); inkAccent(e.x, e.z, 60); SFX.goon(e, 'down'); }

// ---- poses ---------------------------------------------------------------------------------------------------------
function bouldPose(e) { const t = time;
  if (e.type === 'calve') {
    if (e.state === 'kneel') return POSES.kneel(t);
    if (e.state === 'intro') return e.ot < 1.6 ? PZ({ ry: .5, sp: -.15, nk: -.2, aF: [2.4, 1.9], aB: [.6, 1.6], lF: [.25, -.1], lB: [-.2, -.08] }) : POSES.flex(t);   // a hand through his hair, then the pose
    if (e.state === 'dazed') { const q = POSES.idle(t, 1); q.rot = Math.sin(t * 5) * .1; q.nk = Math.sin(t * 6) * .3; q.aF = [.4, .3]; q.aB = [-.3, .2]; return q; }
    if (e.state === 'spray') { const q = POSES.idle(t, 2); q.aF = [3.0, .3 + Math.sin(t * 18) * .1]; q.aB = [.8, 1.8]; q.sp = -.12; q.nk = -.2; return q; }
    if (e.state === 'tornado') return PZ({ ry: 1, sp: 0, aF: [1.6, .05], aB: [1.6, .05], lF: [.2, -.2], lB: [-.2, -.2], rot: Math.sin(t * 30) * .04 });
    if (e.state === 'wind') { const s = 1 - Math.max(0, e.t2) / (e.act === 'snip' ? .32 : e.act === 'kick' ? .45 : .7);
      if (e.act === 'snip') return PZ({ ry: 2, sp: -.1, aF: [2.2 + s * .3, 1.5], aB: [2.0, 1.6], lF: [.4, -.3], lB: [-.4, -.3] });
      if (e.act === 'kick') return PZ({ ry: 1, sp: -.35 * s, nk: .1, aF: [1.0, .8], aB: [-.6, .4], lF: [.6 + s * 1.2, -2.2 * s], lB: [-.15, -.05] });
      return PZ({ ry: 6 * s, sp: .3, nk: .2, aF: [.6, .2], aB: [.5, .2], lF: [.5, -.9], lB: [-.4, -.8] }); }
    if (e.state === 'strike') { if (e.act === 'snip') { const k = Math.sin(t * 26); return PZ({ ry: 2, sp: .25, nk: -.1, aF: [1.55 + k * .4, .15], aB: [1.4 - k * .4, .2], lF: [.6, -.5], lB: [-.5, -.1] }); }
      return PZ({ ry: 0, sp: -.5, nk: .25, aF: [.9, .5], aB: [-.9, .3], lF: [2.05, -.05], lB: [-.1, -.02] }); }   // the long leg, straight out at head height
    if (e.mv) { const q = POSES.walk(e.walk / 9, .75); q.sp = -.08; return q; }
    return Math.sin(t * .7) > .5 ? PZ({ ry: .5, sp: -.12, nk: -.25, aF: [2.6, 2.2], aB: [.9, 2.0], lF: [.3, -.05], lB: [-.05, -.02] }) : fightStance(t, 13, false); }
  if (e.type === 'hare') {
    if (e.state === 'crouch') return PZ({ ry: 8, sp: .7, nk: -.3, aF: [.6, .2], aB: [.4, .3], lF: [.9, -1.6], lB: [-.4, -1.4] });
    if (e.state === 'pounce') return PZ({ air: 1, sp: .5, nk: -.2, aF: [1.6, .1], aB: [1.4, .2], lF: [1.0, -.4], lB: [-1.0, -.1] });
    if (e.state === 'stompW') { const s = 1 - Math.max(0, e.t2) / .55; return PZ({ ry: 1, sp: -.1, aF: [.8, .8], aB: [-.4, .6], lF: [.4 + s * .4, -1.6 * s], lB: [-.1, -.05] }); }
    if (e.state === 'strike' && e.t2 > .2) return PZ({ ry: 4, sp: .3, aF: [.6, .4], aB: [.5, .4], lF: [.5, -.05], lB: [-.4, -.4] });
    if (e.mv && !e.dead && e.state === 'walk') { const ph = e.walk * .9, h = Math.max(0, Math.sin(ph)); return PZ({ ry: -h * 6, sp: .3, nk: -.15, aF: [.9, .9], aB: [.7, 1.0], lF: [.5 - h * .4, -.6 - h * .5], lB: [.2 - h * .4, -.5 - h * .5] }); }   // hops instead of steps
    return null; }
  if (e.type === 'badger') {
    if (e.state === 'dig') { const q = POSES.crouch(1); q.aF = [.2 + Math.sin(time * 30) * .5, .3]; q.aB = [.1 - Math.sin(time * 30) * .5, .3]; return q; }
    if (e.state === 'popup') return PZ({ air: e.y > 2 ? 1 : 0, sp: .1, aF: [2.9, .1], aB: [2.6, .3], lF: [.3, -.5], lB: [-.2, -.5] });
    return null; }
  return null; }
function calveO(e, o) { if (e.type !== 'calve') return; o.tornado = e.state === 'tornado' ? 1 : 0; o.snip = e.state === 'strike' && e.act === 'snip' || e.state === 'wind' && e.act === 'snip'; o.flat = e.state === 'kneel';
  o.swirl = e.state === 'wind' && e.act === 'tornado' ? .6 : .15; o.shout = QUIPS.some(q => q.obj === e) || (DLG.cur && DLG.cur.who === 'CAL'); if (o.flow !== undefined) { o.hs = Math.max(-.6, Math.min(1.3, -(e.vx || 0) / 200 + (e.mv ? .25 : 0) + Math.sin(time * 1.1) * .15)); o.hy = 0; } }
// the hair tornado, drawn big in front of him: rings of whipping strands, dust at his feet, wind lines
function calveOverlay(e, x, y) { if (e.type !== 'calve' || e.dead) return; const t = time;
  if (e.state === 'tornado') { g.save(); g.lineCap = 'round';
    for (let ring = 0; ring < 4; ring++) { const h = 14 + ring * 26, R = 30 + ring * 9 + Math.sin(t * 7 + ring) * 4;
      for (let k = 0; k < 5; k++) { const a0 = t * (13 - ring * 1.5) + k * 1.26 + ring; g.beginPath(); for (let j = 0; j <= 8; j++) { const a = a0 + j * .16, px = x + Math.cos(a) * R, py = y - h + Math.sin(a) * R * .28 - j * .8; j ? g.lineTo(px, py) : g.moveTo(px, py); }
        const front = Math.sin(a0 + .6) > 0; g.strokeStyle = OUT; g.lineWidth = 4.2; g.globalAlpha = front ? 1 : .55; g.stroke(); g.strokeStyle = k % 2 ? '#5a2a18' : '#3a1a10'; g.lineWidth = 2.6; g.stroke(); } }
    g.globalAlpha = 1; g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1.2; for (let k = 0; k < 6; k++) { const a = -t * 9 + k * 1.05, R = 56 + (k % 2) * 10; g.beginPath(); g.arc(x, y - 50, R, a, a + .7); g.stroke(); }
    g.fillStyle = 'rgba(232,220,200,.5)'; g.beginPath(); g.ellipse(x, y, 58, 10, 0, 0, 7); g.fill(); g.restore(); }
  else if (e.state === 'wind' && e.act === 'tornado') { const s = 1 - Math.max(0, e.t2) / .7; g.save(); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1; for (let k = 0; k < 8; k++) { const a = k * .785 + t * 4, R = 70 * (1 - s) + 20; g.beginPath(); g.moveTo(x + Math.cos(a) * R, y - 50 + Math.sin(a) * R * .4); g.lineTo(x + Math.cos(a) * (R - 12), y - 50 + Math.sin(a) * (R - 12) * .4); g.stroke(); } g.restore(); }
  else if (e.state === 'dazed') { for (let k = 0; k < 4; k++) { const a = t * 4 + k * 1.57; star5(g, x + Math.cos(a) * 14, y - 128 + Math.sin(a) * 3, 3, '#ffe86a'); } } }
// a badger under the floor is a moving mound of broken tiles
function bouldDraw(e) { if (!e.under || e.dead) return false; const x = e.x - camX, y = sy(e.z, 0); g.fillStyle = 'rgba(20,10,10,.3)'; g.beginPath(); g.ellipse(x, y, 14, 4, 0, 0, 7); g.fill();
  for (let k = 0; k < 7; k++) { const a = k * .9 + time * 3; poly(g, [[x - 12 + k * 4, y], [x - 10 + k * 4 + Math.sin(a), y - 4 - (k % 3) * 2 - Math.abs(Math.sin(time * 10 + k)) * 2], [x - 7 + k * 4, y]], k % 2 ? '#c8b8a0' : '#a89880'); } return true; }

// ---- projectiles and clouds -------------------------------------------------------------------------------------------
function bouldFx(f, dt) {
  if (f.k === 'gust') { f.x += f.vx * dt; for (const q of players) if (q.ko <= 0 && !f.hit.has(q) && Math.abs(q.x - f.x) < 18 && Math.abs(q.z - f.z) < 16) { f.hit.add(q); if (q.dodge > 0) { hitPlayer(q, 0, 0, null); continue; } q.vx = Math.sign(f.vx) * 420; q.vy = 90; q.y = Math.max(1, q.y); jolt(q, -2, 2); pop(q.x, q.z, q.y + 70, LANG === 'fr' ? 'PFFFOUU !' : 'WHOOSH!', '#d8f0ff'); RUM.hit(q.i, 1, false); }
    for (const b of BREAK) if (!b.broken && !b.held && b.size !== 'l' && Math.abs(b.x - f.x) < 18 && Math.abs(b.z - f.z) < 16) b.vx = Math.sign(f.vx) * 160;
    if (blocked(f.x, f.z, 10)) f.t = 0; return true; }
  if (f.k === 'scan' || f.k === 'foamball') { f.x += f.vx * dt; f.z = Math.max(0, Math.min(DEPTH, f.z + f.vz * dt)); f.vy -= GRAV * dt; f.y += f.vy * dt; f.rot += dt * 14;
    let hq = null; for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < 12 && Math.abs(q.z - f.z) < 12 && f.y < q.y + 56 && f.y > q.y - 4) hq = q;
    if (hq && hq.dodge > 0) { hitPlayer(hq, 0, 0, null); hq = null; }
    if (hq || f.y <= 0) { f.t = 0;
      if (f.k === 'scan') { fx.push({ k: 'pinkcloud', x: f.x, z: f.z, t: 1.2, T: 1.2 }); for (const q of players) if (q.ko <= 0 && q.dodge <= 0 && Math.abs(q.x - f.x) < 34 && Math.abs(q.z - f.z) < 20) addStatus(q, 'dizzy'); try { sNoise(SND.now(), .5, .2, 3000, 6000, 'highpass', .8); } catch (e) {}
        INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'PSCHHHT !' : 'PSSSHHT!', x: (f.x - camX) * 1.5, y: sy(f.z, 40) * 1.5, size: 20, t: 0, rot: -.1 }); }
      else { fx.push({ k: 'lather', x: f.x, z: f.z, t: 6, T: 6 }); if (hq) addStatus(hq, 'lather'); SFX.impact('squelch', .6, f.x); } } return true; }
  if (f.k === 'lather') { for (const q of players) if (q.ko <= 0 && q.y < 3 && Math.abs(q.x - f.x) < 26 && Math.abs(q.z - f.z) < 12 && !hasSt(q, 'lather')) addStatus(q, 'lather'); return true; }
  if (f.k === 'hspray') { if (f.from && !f.from.dead) { f.x += (f.from.x - f.x) * dt * 3; f.z = f.from.z; } f.y += 10 * dt; return true; }   // the cloud follows him
  if (f.k === 'pinkcloud' || f.k === 'snip' || f.k === 'kickarc') return true;
  return false; }
function drawBouldFx(f) { const x = f.x - camX, y = sy(f.z, f.y || 0), a = f.T ? Math.max(0, f.t / f.T) : 1;
  if (f.k === 'gust') { g.save(); g.strokeStyle = 'rgba(230,245,255,.75)'; g.lineWidth = 1.2; for (let k = 0; k < 6; k++) { const yy = y - 10 + k * 4 + Math.sin(time * 20 + k) * 1.5, l = 14 + (k % 3) * 6; g.beginPath(); g.moveTo(x - Math.sign(f.vx) * l, yy); g.quadraticCurveTo(x, yy - 3, x + Math.sign(f.vx) * 4, yy); g.stroke(); }
    g.fillStyle = 'rgba(230,245,255,.25)'; g.beginPath(); g.ellipse(x, y, 16, 12, 0, 0, 7); g.fill(); g.restore(); return true; }
  if (f.k === 'scan') { g.save(); g.translate(x, y); g.rotate(f.rot); poly(g, [[-2.6, -6], [2.6, -6], [2.6, 6], [-2.6, 6]], '#e86aa0'); g.fillStyle = '#d8dce4'; g.fillRect(-1.3, -8, 2.6, 2); g.restore(); g.fillStyle = 'rgba(20,10,10,.25)'; g.fillRect(x - 3, sy(f.z, 0), 6, 1.5); return true; }
  if (f.k === 'foamball') { g.fillStyle = OUT; g.beginPath(); g.arc(x, y, 5.4, 0, 7); g.fill(); g.fillStyle = '#ffffff'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + Math.cos(k * 1.6 + f.rot) * 2, y + Math.sin(k * 1.6 + f.rot) * 2, 3, 0, 7); g.fill(); } g.fillStyle = 'rgba(20,10,10,.25)'; g.fillRect(x - 4, sy(f.z, 0), 8, 1.5); return true; }
  if (f.k === 'lather') { const yy = sy(f.z, 0), fade = Math.min(1, f.t); g.save(); g.globalAlpha = fade; g.fillStyle = 'rgba(255,255,255,.85)'; for (let k = 0; k < 9; k++) { g.beginPath(); g.ellipse(x - 20 + k * 5, yy + Math.sin(k * 2.1) * 3, 6, 3, 0, 0, 7); g.fill(); } g.fillStyle = 'rgba(200,230,255,.6)'; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(x - 16 + k * 7, yy - 2 + Math.sin(time * 3 + k) * 1, 1.4, 0, 7); g.fill(); } g.restore(); return true; }
  if (f.k === 'pinkcloud') { const r = (1 - a) * 34 + 8; g.save(); for (let k = 0; k < 10; k++) { const an = k * .63, rr2 = r * (.5 + (k % 3) * .25); g.fillStyle = `rgba(255,${150 + (k % 3) * 30},${200 + (k % 2) * 30},${a * .55})`; g.beginPath(); g.arc(x + Math.cos(an) * rr2, sy(f.z, 18 + (k % 4) * 8 + (1 - a) * 16) + Math.sin(an) * rr2 * .3, 7 + (k % 3) * 3, 0, 7); g.fill(); } g.restore(); return true; }
  if (f.k === 'hspray') { g.save(); g.fillStyle = `rgba(255,200,230,${a * .45})`; g.beginPath(); g.arc(x, y, f.r * (1.4 - a * .4), 0, 7); g.fill(); g.restore(); return true; }
  if (f.k === 'snip') { g.save(); g.strokeStyle = `rgba(255,240,180,${a})`; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x - Math.cos(f.a) * 10, y - Math.sin(f.a) * 5); g.lineTo(x + Math.cos(f.a) * 10, y + Math.sin(f.a) * 5); g.stroke(); g.strokeStyle = `rgba(255,255,255,${a})`; g.lineWidth = .6; g.stroke(); g.restore(); return true; }
  if (f.k === 'kickarc') { g.save(); g.strokeStyle = `rgba(255,255,255,${a * .8})`; g.lineWidth = 3; g.beginPath(); g.arc(x - f.face * 30, y + 6, 36, f.face > 0 ? -1.1 : Math.PI + .1, f.face > 0 ? -.1 : Math.PI + 1.1); g.stroke(); g.restore(); return true; }
  return false; }

// ---- the salon's and the boulevard's breakables, and Bouldaire's food -------------------------------------------------
Object.assign(BK, { dryer: { size: 'm', hp: 5, w: 20, d: 16, h: 32, col: '#f0a0c0' }, mirror: { size: 'm', hp: 3, w: 18, d: 10, h: 34, col: '#c8963a' }, barber: { size: 'l', hp: 12, w: 30, d: 22, h: 26, col: '#c8203a', solid: 1 },
  planter: { size: 'm', hp: 4, w: 18, d: 18, h: 30, col: '#e8e0d0', food: .4 }, mannequin: { size: 's', hp: 2, w: 12, d: 10, h: 30, col: '#f4e8d8' }, rack: { size: 'l', hp: 8, w: 40, d: 16, h: 28, col: '#c8c8d0', solid: 1, food: .4 },
  perfume: { size: 's', hp: 1, w: 18, d: 12, h: 14, col: '#e8a0d8' }, trolley: { size: 'm', hp: 5, w: 22, d: 16, h: 22, col: '#c8ccd2', food: .5 } });
Object.assign(BK_SC, { dryer: 1.5, mirror: 1.7, barber: 1.6, planter: 1.5, mannequin: 1.9, rack: 1.6, perfume: 1.3, trolley: 1.6 });
Object.assign(MAT, { dryer: 'metal', mirror: 'glass', barber: 'metal', planter: 'pot', mannequin: 'pot', rack: 'metal', perfume: 'glass', trolley: 'metal' });
FOODS.bouldaire = ['croissant', 'gelato', 'macaron'];
const BK3_DRAW = {
  dryer: (g, W, H, c, dk, lt) => { limb(g, [[0, 0], [0, -H * .55]], 2, '#8a8a92'); poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2 - 3, -3], [-W / 2 + 3, -3]], '#5a5a62'); poly(g, [[-W / 2, -H * .55], [W / 2 + 2, -H * .6], [W / 2, -H], [-W / 2 - 2, -H * .92]], c); g.fillStyle = lt; g.fillRect(-W / 2 + 2, -H * .9, W - 4, 2); g.fillStyle = '#2a2a30'; g.fillRect(-W / 2 + 3, -H * .62, W - 6, 2); },
  mirror: (g, W, H, c, dk, lt) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); poly(g, [[-W / 2 + 2, -2], [W / 2 - 2, -2], [W / 2 - 2, -H + 2], [-W / 2 + 2, -H + 2]], '#b8d8e8'); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.moveTo(-W / 2 + 4, -H + 6); g.lineTo(-W / 2 + 9, -H + 6); g.lineTo(-W / 2 + 4, -H + 16); g.fill(); },
  barber: (g, W, H, c, dk, lt) => { poly(g, [[-4, 0], [4, 0], [3, -H * .35], [-3, -H * .35]], '#c8c8d0'); poly(g, [[-W / 2, -H * .35], [W / 2, -H * .35], [W / 2, -H * .55], [-W / 2, -H * .55]], c); poly(g, [[-W / 2, -H * .55], [-W / 2 + 6, -H * .55], [-W / 2 + 6, -H], [-W / 2, -H]], c); g.fillStyle = '#c8c8d0'; g.fillRect(-W / 2 + 6, -H * .7, W - 8, 2); g.fillStyle = lt; g.fillRect(-W / 2 + 1, -H + 2, 4, H * .3); },
  planter: (g, W, H, c, dk, lt) => { poly(g, [[-W / 2 + 2, 0], [W / 2 - 2, 0], [W / 2, -H * .4], [-W / 2, -H * .4]], c); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .45; limb(g, [[0, -H * .4], [Math.cos(a) * W * .5, -H * .4 + Math.sin(a) * H * .5], [Math.cos(a) * W * .9, -H * .4 + Math.sin(a) * H * .65 + 4]], 1.6, k % 2 ? '#3a8a4a' : '#4aa85a'); } },
  mannequin: (g, W, H, c, dk) => { limb(g, [[0, 0], [0, -H * .3]], 1.5, '#5a5a62'); poly(g, [[-W / 2, -H * .3], [W / 2, -H * .3], [W / 2 - 1, -H * .78], [-W / 2 + 1, -H * .78]], c); disc(g, 0, -H * .88, W * .32, c); g.fillStyle = '#e86aa0'; g.fillRect(-W / 2, -H * .7, W, 2); },
  rack: (g, W, H, c, dk) => { limb(g, [[-W / 2 + 2, 0], [-W / 2 + 2, -H]], 1.4, c); limb(g, [[W / 2 - 2, 0], [W / 2 - 2, -H]], 1.4, c); limb(g, [[-W / 2, -H], [W / 2, -H]], 1.4, c); for (let k = 0; k < 6; k++) poly(g, [[-W / 2 + 4 + k * 6, -H + 1], [-W / 2 + 9 + k * 6, -H + 1], [-W / 2 + 10 + k * 6, -H * .35], [-W / 2 + 3 + k * 6, -H * .35]], ['#e86aa0', '#6ad8c0', '#ffd23f', '#a87ad8', '#f4f0e8', '#e8402a'][k]); },
  perfume: (g, W, H, c) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .35], [-W / 2, -H * .35]], '#f4f0e8'); for (let k = 0; k < 3; k++) { poly(g, [[-W / 2 + 2 + k * 6, -H * .35], [-W / 2 + 6 + k * 6, -H * .35], [-W / 2 + 6 + k * 6, -H * .85], [-W / 2 + 2 + k * 6, -H * .85]], ['#e8a0d8', '#ffd23f', '#9adcff'][k]); g.fillStyle = '#c8963a'; g.fillRect(-W / 2 + 3 + k * 6, -H, 2, H * .15); } },
  trolley: (g, W, H, c) => { g.strokeStyle = OUT; g.lineWidth = 1.6; g.strokeRect(-W / 2, -H, W, H * .7); g.strokeStyle = c; g.lineWidth = .8; for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(-W / 2 + k * W / 5, -H); g.lineTo(-W / 2 + k * W / 5, -H * .3); g.stroke(); } limb(g, [[-W / 2, -H], [-W / 2 - 5, -H - 3]], 1.4, '#e86aa0'); disc(g, -W / 2 + 3, -2, 2, '#2a2a30'); disc(g, W / 2 - 3, -2, 2, '#2a2a30'); }
};
function drawFood3(f, x, Y) {
  if (f.k === 'croissant') { g.fillStyle = OUT; g.beginPath(); g.arc(x, Y + 2, 7.4, Math.PI * 1.05, Math.PI * 1.95); g.lineTo(x + 5, Y + 3); g.arc(x, Y + 2, 4, Math.PI * 1.9, Math.PI * 1.1, true); g.fill(); g.fillStyle = '#e0a050'; g.beginPath(); g.arc(x, Y + 2, 6.4, Math.PI * 1.08, Math.PI * 1.92); g.lineTo(x + 4.4, Y + 2.6); g.arc(x, Y + 2, 4.6, Math.PI * 1.9, Math.PI * 1.1, true); g.fill(); g.strokeStyle = '#a86a2a'; g.lineWidth = .6; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(x - 3 + k * 3, Y - 4); g.lineTo(x - 2 + k * 3, Y - 1); g.stroke(); } return true; }
  if (f.k === 'gelato') { poly(g, [[x - 3.5, Y], [x + 3.5, Y], [x, Y + 8]], '#d8a050'); disc(g, x - 1.5, Y - 2, 3.4, '#ff9ab8'); disc(g, x + 1.8, Y - 3, 3, '#9ae8c0'); return true; }
  if (f.k === 'macaron') { disc(g, x, Y - 2, 4.4, '#ff8ab8'); g.fillStyle = '#f4f0e8'; g.fillRect(x - 4.4, Y - 2.4, 8.8, 1.4); disc(g, x + 7, Y - 1, 3.4, '#a8e8a0'); g.fillStyle = '#f4f0e8'; g.fillRect(x + 3.6, Y - 1.4, 6.8, 1.2); return true; }
  return false; }
