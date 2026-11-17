// =====================================================================
// LES DOUZE — the twelve scenes. Each returns { img, focal }.
// focal = boxes [x, y, w, h] that get the finest brush (faces, hands).
// =====================================================================
const SCENES = {};

// ---------------------------------------------------------------------
SCENES.marge = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, billow, embers, shock, goon, head } = K;
  // a smoky punk club on Embrume
  g.fillStyle = lin(0, 0, 0, H, [[0, '#1a0e0c'], [.45, '#4a2216'], [.75, '#8a4222'], [1, '#2a140c']]); g.fillRect(0, 0, W, H);
  soft(30, () => { for (let i = 0; i < 14; i++) E(rnd() * W, 80 + rnd() * 500, 260, 60, `rgba(${200 + rnd() * 40 | 0},${110 + rnd() * 40 | 0},${50 + rnd() * 30 | 0},.25)`); });
  // trusses and stage lights
  line([[0, 70], [W, 50]], 14, '#140a08'); for (let i = 0; i < 14; i++) line([[i * 90, 64 - i * 1.4], [i * 90 + 45, 76 - i * 1.4]], 3, '#2a1a12');
  [[260, 'rgba(255,120,170,.38)', 560], [520, 'rgba(255,200,110,.42)', 760], [820, 'rgba(255,120,170,.3)', 980], [1060, 'rgba(255,220,150,.36)', 700]].forEach(([x, col, tx]) => { glow(() => soft(14, () => poly([[x - 10, 66], [x + 10, 66], [tx + 150, H], [tx - 150, H]], col))); C(x, 70, 13, '#ffe8c0'); glow(() => soft(8, () => C(x, 72, 30, 'rgba(255,230,180,.8)'))); });
  // the floor, glossy with light
  fill('M0 700 L1200 680 L1200 900 L0 900 Z', lin(0, 680, 0, H, [[0, '#4a2a1a'], [1, '#140a06']]));
  glow(() => soft(20, () => { E(560, 760, 260, 30, 'rgba(255,150,170,.25)'); E(860, 790, 260, 36, 'rgba(255,200,120,.3)'); }));
  // speaker stack, left
  for (let i = 0; i < 4; i++) { const y = 260 + i * 140; fill(`M60 ${y} L300 ${y - 6} L300 ${y + 132} L60 ${y + 138} Z`, lin(60, 0, 300, 0, [[0, '#0e0a08'], [1, '#2e221c']])); [[120, y + 70], [240, y + 66]].forEach(([cx, cy]) => { C(cx, cy, 48, '#1a1210'); C(cx, cy, 40, '#2a1e18'); C(cx, cy, 14, '#0c0806'); C(cx - 12, cy - 14, 6, 'rgba(255,200,150,.25)'); }); line([[60, y], [300, y - 6]], 3, 'rgba(255,200,140,.4)'); }
  // the crowd of soldiers, knocked flat by the shockwave
  shock(820, 815, 380, 54, 5, '255,210,150');
  [[640, 810, -1.45, 1.15], [960, 830, 1.5, 1.2], [1110, 790, 1.1, 1.1], [600, 730, -.7, 1.0], [1050, 680, -1.1, 1.0], [1160, 700, .5, .95], [700, 690, -.3, .9], [900, 660, .2, .85], [1000, 600, -.4, .8], [800, 620, .3, .8]].forEach(([x, y, r, sc], i) => goon(x, y, r, sc, { lit: i % 2 ? '#c86a4a' : '#e08a5a' }));
  // Big Bertha, landing
  fill('M720 690 L900 680 L908 808 L726 818 Z', lin(720, 0, 908, 0, [[0, '#120c0a'], [1, '#3a2a22']])); C(790, 748, 42, '#1e1612'); C(790, 748, 14, '#0a0604'); C(862, 744, 28, '#1e1612'); line([[720, 690], [900, 680]], 3, 'rgba(255,220,160,.6)');
  glow(() => soft(16, () => E(815, 810, 220, 40, 'rgba(255,200,130,.7)')));
  // Marge, mid-dive, arms spread
  limb([[478, 260], [400, 190], [330, 150]], 44, 34, '#2a1e2e'); limb([[470, 250], [380, 230], [300, 196]], 42, 32, '#3a2a3a'); // legs (torn tights)
  for (let i = 0; i < 8; i++) line([[330 + i * 18, 160 + i * 12], [340 + i * 18, 174 + i * 12]], 2, 'rgba(240,200,200,.35)');
  E(318, 140, 34, 22, '#120c0c', -.5); E(292, 186, 34, 22, '#120c0c', -.3); // boots
  poly([[440, 200], [650, 236], [676, 380], [456, 336]], lin(440, 0, 660, 0, [[0, '#14100e'], [.6, '#2e2622'], [1, '#5a4a40']])); // leather jacket
  for (let i = 0; i < 9; i++) C(480 + i * 20, 230 + i * 6 + (i % 2) * 4, 3, '#e8c77a');
  line([[640, 250], [660, 360]], 4, 'rgba(255,220,170,.7)');
  limb([[620, 262], [700, 180], [770, 128]], 30, 22, '#2a2220'); C(782, 120, 15, '#d9a07a'); // front arm up
  limb([[600, 340], [690, 400], [760, 420]], 30, 22, '#221a18'); C(772, 422, 15, '#c08a62'); // back arm down
  head(716, 300, 48, 1, { skin: '#e0a880', shade: '#8a5034', light: '#f6c8a0', mouth: 'open', mohawk: '#ff4f8a', hair: '#ff4f8a', brow: 'rgba(60,20,30,.9)' });
  glow(() => line([[690, 258], [730, 262], [748, 300]], 3, 'rgba(255,220,180,.7)'));
  embers(300, 200, 900, 600, 80, [255, 190, 140]);
  g.fillStyle = rad(600, 400, 280, 860, [[0, 'rgba(10,6,4,0)'], [1, 'rgba(10,6,4,.65)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[640, 230, 160, 140], [290, 120, 400, 240], [600, 620, 560, 240]] };
};

// ---------------------------------------------------------------------
SCENES.cyborg = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, sky, embers, goon, head, halo } = K;
  sky([[0, '#140606'], [.4, '#4a0e0a'], [.75, '#a8341a'], [1, '#e86a2a']]);
  soft(24, () => { for (let i = 0; i < 16; i++) E(rnd() * W, rnd() * 450, 220 + rnd() * 200, 40, `rgba(${30 + rnd() * 40 | 0},${10 + rnd() * 20 | 0},10,.5)`); });
  // volcano with a glowing crater
  fill('M640 560 L900 230 L960 222 L1200 520 L1200 600 L640 600 Z', lin(0, 220, 0, 600, [[0, '#2a1010'], [1, '#120808']]));
  glow(() => { soft(30, () => C(930, 220, 120, 'rgba(255,110,40,.6)')); line([[930, 230], [900, 330], [920, 420], [880, 540]], 8, 'rgba(255,120,40,.9)'); line([[940, 236], [990, 360], [1010, 470]], 6, 'rgba(255,110,40,.8)'); });
  halo(930, 210, 300, '255,200,120', '220,80,30');
  // basalt plain and lava rivers
  fill('M0 600 L1200 580 L1200 900 L0 900 Z', lin(0, 580, 0, H, [[0, '#3a1810'], [.4, '#1e0e0a'], [1, '#0e0604']]));
  [[600, 8], [660, 14], [740, 22], [840, 30]].forEach(([y, w], i) => glow(() => { const pts = []; for (let x = -20; x <= W + 20; x += 60) pts.push([x, y + Math.sin(x * .006 + i) * 18 + (rnd() - .5) * 8]); soft(10, () => line(pts, w * 2.2, 'rgba(255,90,30,.55)')); line(pts, w * .6, 'rgba(255,200,110,.95)'); }));
  // the lava trail behind him
  glow(() => { soft(14, () => line([[0, 840], [180, 830], [360, 820], [440, 815]], 60, 'rgba(255,90,30,.7)')); line([[0, 842], [200, 832], [420, 818]], 14, 'rgba(255,230,150,1)'); for (let i = 0; i < 14; i++) { const x = rnd() * 420, y = 820 + rnd() * 20; soft(3, () => poly([[x - 8, y], [x, y - 30 - rnd() * 40], [x + 8, y]], 'rgba(255,170,60,.8)')); } });
  // soldiers thrown up and crushed down
  [[900, 360, -2.4, 1.1], [1050, 520, 2.6, 1.0], [860, 810, 1.55, 1.15], [1120, 760, -.5, 1.0], [1000, 280, 1.9, .9]].forEach(([x, y, r, sc]) => { glow(() => soft(12, () => C(x, y - 50, 60, 'rgba(255,120,50,.35)'))); goon(x, y, r, sc, { lit: '#ff8a3a', armour: '#5a3a3a', body: '#3a2424' }); });
  // the cyborg: huge, low, charging right
  const steel = lin(300, 0, 700, 0, [[0, '#1a1a1e'], [.55, '#4a4a52'], [1, '#8a8a92']]);
  limb([[420, 600], [330, 700], [250, 820]], 74, 56, '#2a2a30'); E(232, 832, 56, 22, '#141418'); // back leg
  limb([[500, 600], [590, 690], [600, 820]], 78, 60, '#3a3a42'); E(620, 832, 60, 22, '#1a1a1e'); // front leg
  poly([[380, 420], [560, 340], [660, 420], [600, 620], [400, 640]], steel); // torso
  // lava-rock seams glowing through the steel
  glow(() => { [[[420, 460], [470, 520], [450, 600]], [[520, 380], [560, 470], [600, 560]], [[600, 440], [630, 520]], [[330, 700], [300, 760]], [[590, 700], [600, 780]]].forEach(p => { soft(5, () => line(p, 12, 'rgba(255,100,30,.7)')); line(p, 3.5, 'rgba(255,210,120,1)'); }); });
  limb([[420, 450], [340, 540], [300, 600]], 50, 40, '#2e2e34'); C(296, 612, 30, '#22222a'); // back arm swinging
  // the robotic arm, forward, with a huge fist
  limb([[610, 410], [700, 440], [790, 452]], 56, 46, lin(600, 0, 800, 0, [[0, '#3a3a42'], [1, '#9a9aa2']]));
  for (let i = 0; i < 4; i++) line([[640 + i * 36, 418 + i * 6], [640 + i * 36, 462 + i * 6]], 4, 'rgba(10,10,14,.6)');
  E(828, 452, 46, 40, lin(790, 0, 870, 0, [[0, '#4a4a52'], [1, '#c8c8d0']])); line([[812, 420], [812, 486]], 4, 'rgba(10,10,14,.6)'); line([[836, 418], [838, 488]], 4, 'rgba(10,10,14,.6)');
  // head: half steel plate, half broken face
  head(626, 330, 50, 1, { skin: '#8a6a5a', shade: '#3a2a24', light: '#b88a70', mask: lin(560, 0, 680, 0, [[0, '#2a2a30'], [1, '#9a9aa2']]), eye: '#ff3a1a', eyeGlow: 'rgba(255,60,20,.9)', mouth: 'shut', brow: 'rgba(20,20,24,.9)' });
  glow(() => line([[590, 290], [640, 282], [676, 306]], 3, 'rgba(255,180,100,.8)'));
  // underlight from the lava
  glow(() => soft(30, () => E(480, 700, 300, 120, 'rgba(255,90,30,.25)')));
  embers(0, 100, 1200, 760, 160, [255, 150, 60]);
  g.fillStyle = rad(560, 450, 300, 860, [[0, 'rgba(10,4,2,0)'], [1, 'rgba(10,4,2,.6)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[560, 260, 140, 140], [760, 400, 130, 110], [380, 340, 300, 300]] };
};

// ---------------------------------------------------------------------
SCENES.amiral = () => { const [cv, g] = canvasFor(); const { lin, rad, fill, C, E, line, curve, soft, glow } = kit(g);
/*AMIRAL*/
  return { img: g.getImageData(0, 0, W, H), focal: [[340, 180, 220, 250], [500, 60, 300, 200], [600, 610, 420, 220], [250, 300, 260, 520]] };
};

// ---------------------------------------------------------------------
SCENES.papi = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, sky, giant, embers, goon, head, halo } = K;
  sky([[0, '#16304a'], [.45, '#4a6a7a'], [.78, '#e0a070'], [1, '#f6d0a0']]);
  K.stars(40, 200, .5);
  giant(300, 250, 270, 'rgba(22,48,74,.8)');
  soft(40, () => { g.globalAlpha = .3; C(300, 250, 300, '#f0d090'); g.globalAlpha = 1; });
  halo(1000, 520, 360, '255,246,220', '240,170,100');
  // tidal flats: wet sand mirroring the sky
  fill('M0 560 L1200 540 L1200 900 L0 900 Z', lin(0, 540, 0, H, [[0, '#d8a878'], [.2, '#9a8a7a'], [1, '#3a3a40']]));
  for (let i = 0; i < 12; i++) { const y = 570 + i * i * 2.6 + i * 5; soft(2, () => E(rnd() * W, y, 200 + rnd() * 300, 3 + i * .6, `rgba(${240 - i * 6},${200 - i * 6},${160 - i * 4},.5)`)); }
  soft(20, () => E(300, 640, 260, 30, 'rgba(240,200,140,.35)'));
  // soldiers bouncing into the air from the stomp
  goon(900, 470, -.6, .95, { lit: '#e8a070' }); goon(1010, 380, .9, .85, { lit: '#e8a070' }); goon(1110, 560, -1.8, .8);
  // the tidewalker: tall stilt legs, long neck
  const hide = lin(400, 0, 760, 0, [[0, '#5a4a2a'], [.6, '#9a8a4a'], [1, '#d8c890']]);
  [[[470, 360], [420, 520], [450, 800]], [[520, 370], [560, 560], [520, 810]], [[620, 370], [700, 540], [700, 760], [740, 800]], [[660, 360], [760, 500], [820, 640], [860, 790]]].forEach((p, i) => { limb(p, 22, 12, i % 2 ? '#3a3020' : '#5a4a30'); E(p[p.length - 1][0], p[p.length - 1][1] + 4, 20, 6, '#2a2418'); });
  // splash and shock where the front foot lands
  K.shock(860, 800, 220, 30, 4, '250,240,220'); soft(3, () => { for (let i = 0; i < 30; i++) { const a = -Math.PI * rnd(), r = 40 + rnd() * 90; C(860 + Math.cos(a) * r, 780 + Math.sin(a) * r * .8, 2 + rnd() * 4, 'rgba(240,248,255,.8)'); } });
  E(560, 340, 170, 62, hide); for (let i = 0; i < 14; i++) C(440 + rnd() * 240, 320 + rnd() * 40, 6 + rnd() * 10, 'rgba(60,50,30,.35)');
  limb([[700, 320], [780, 270], [850, 250]], 40, 22, hide); E(880, 252, 40, 22, '#a89a5a', -.1); E(900, 244, 5, 4, '#1a1208'); line([[912, 262], [960, 270]], 2, 'rgba(60,50,30,.8)'); line([[912, 266], [956, 280]], 2, 'rgba(60,50,30,.8)');
  line([[440, 300], [690, 296]], 4, 'rgba(255,240,200,.6)');
  // the rocket on the saddle, firing back
  poly([[420, 280], [500, 272], [504, 300], [420, 306]], lin(0, 272, 0, 306, [[0, '#d8d8d0'], [1, '#6a6a68']])); line([[430, 276], [430, 304]], 3, '#a83a2a');
  glow(() => { soft(10, () => E(330, 290, 110, 34, 'rgba(255,170,80,.8)')); E(380, 290, 50, 14, 'rgba(255,250,220,1)'); });
  soft(6, () => { for (let i = 0; i < 8; i++) K.billow(200 - i * 30, 290 + (rnd() - .5) * 40, 30 + i * 6, true, [230, 220, 210]); });
  // saddle and Papi, leaning into the charge with his walker as a lance
  fill('M500 300 Q560 270 620 296 L612 316 L504 318 Z', '#6a2a1a');
  limb([[560, 270], [610, 300], [600, 340]], 22, 16, '#3a3a44'); // leg on the saddle
  poly([[530, 196], [600, 186], [612, 280], [544, 288]], lin(530, 0, 612, 0, [[0, '#5a1e1a'], [.6, '#9a3a2a'], [1, '#c86a4a']])); // cardigan
  for (let i = 0; i < 4; i++) C(596, 210 + i * 18, 3, '#e8c77a');
  // the walker, held forward like a lance
  line([[640, 230], [800, 196]], 6, '#d8dcd8'); line([[640, 262], [800, 228]], 6, '#c8ccc8'); line([[800, 196], [800, 228]], 6, '#d8dcd8'); line([[760, 204], [770, 236]], 4, '#b8bcb8'); E(806, 236, 8, 6, '#3a3a3a');
  limb([[596, 210], [640, 236], [652, 240]], 18, 14, '#7a2a20'); C(654, 240, 9, '#e0b090');
  limb([[548, 214], [600, 250], [644, 262]], 18, 14, '#6a2418'); C(646, 262, 9, '#d0a080');
  head(586, 160, 30, 1, { skin: '#e0b090', shade: '#8a5a3a', light: '#f6d0b0', moustache: '#f4f0e8', mouth: 'open', cap: '#4a4a3a', brow: 'rgba(240,240,232,.9)' });
  line([[560, 128], [610, 124]], 2, 'rgba(255,240,200,.6)');
  embers(0, 0, 1200, 700, 30, [255, 230, 180]);
  g.fillStyle = rad(620, 420, 320, 880, [[0, 'rgba(10,8,12,0)'], [1, 'rgba(10,8,12,.55)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[540, 120, 140, 130], [520, 180, 300, 120], [820, 210, 130, 80]] };
};

// ---------------------------------------------------------------------
SCENES.ruby = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, sky, bolt, goon, head } = K;
  sky([[0, '#0c1418'], [.4, '#1e3a40'], [.75, '#4a7a78'], [1, '#9ac8c0']]);
  // storm clouds
  soft(16, () => { for (let i = 0; i < 30; i++) K.billow(rnd() * W, 40 + rnd() * 220, 80 + rnd() * 120, rnd() > .6, [120, 150, 160]); });
  // steaming teal sea far below
  fill('M0 560 L1200 540 L1200 900 L0 900 Z', lin(0, 540, 0, H, [[0, '#6aa8a4'], [.5, '#2a5a5a'], [1, '#0e2a2c']]));
  soft(18, () => { for (let i = 0; i < 9; i++) E(160 + rnd() * 1000, 470 + rnd() * 80, 30 + rnd() * 30, 140 + rnd() * 80, 'rgba(230,245,240,.35)'); });
  // the lower ledge where the soldiers stand
  fill('M560 700 L1200 650 L1200 900 L520 900 Z', lin(0, 650, 0, H, [[0, '#2a3a38'], [1, '#0a1212']]));
  // stunned soldiers, struck by lightning
  [[700, 712], [820, 700], [940, 690], [1060, 678]].forEach(([x, y], i) => { bolt(x - 20 + rnd() * 40, 0, x + 4, y - 100); goon(x, y, (rnd() - .5) * .3, 1, { lit: '#bfe8ff', visor: '#bfe8ff' }); glow(() => soft(16, () => C(x, y - 60, 70, 'rgba(180,220,255,.35)'))); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + i; glow(() => C(x + Math.cos(a) * 28, y - 140 + Math.sin(a) * 8, 4, 'rgba(255,240,160,.9)')); } });
  // the cliff, foreground left
  fill('M0 520 L180 500 L360 560 L520 600 L560 900 L0 900 Z', lin(0, 500, 0, H, [[0, '#3a4644'], [.3, '#1e2826'], [1, '#080c0c']]));
  line([[0, 520], [180, 500], [360, 560], [520, 600]], 4, 'rgba(200,240,255,.5)');
  // rain
  for (let i = 0; i < 220; i++) { const x = rnd() * W, y = rnd() * H; line([[x, y], [x - 10, y + 26]], 1.2, `rgba(220,240,240,${.15 + rnd() * .25})`); }
  // Ruby, guitar raised to the storm
  limb([[350, 420], [300, 500], [270, 600]], 30, 24, '#2a3a5a'); E(262, 606, 26, 12, '#0c0a0a');
  limb([[380, 420], [430, 500], [470, 590]], 30, 24, '#344a6a'); E(482, 596, 26, 12, '#0c0a0a');
  for (let i = 0; i < 5; i++) line([[300 + i * 6, 470 + i * 20], [316 + i * 6, 476 + i * 20]], 2, 'rgba(220,230,240,.6)');
  poly([[330, 280], [410, 276], [420, 430], [330, 434]], lin(330, 0, 420, 0, [[0, '#0e0c0c'], [.6, '#2a2624'], [1, '#6a6a70']]));
  for (let i = 0; i < 6; i++) C(410, 292 + i * 22, 3, '#d8dce0');
  limb([[340, 290], [310, 220], [330, 150]], 22, 18, '#1e1a1a'); C(334, 142, 11, '#e0b090');
  limb([[400, 290], [440, 220], [440, 160]], 22, 18, '#2a2626'); C(440, 152, 11, '#f0c8a0');
  // the guitar, held high
  g.save(); g.translate(390, 120); g.rotate(-.35);
  E(0, 0, 70, 44, lin(-70, 0, 70, 0, [[0, '#6a0e14'], [.5, '#c82a2a'], [1, '#ff6a5a']])); E(-14, 0, 14, 10, '#1a0a0a'); line([[50, -6], [200, -10]], 12, '#2a1a10'); poly([[196, -22], [236, -18], [236, 4], [196, 2]], '#1a0e08');
  for (let k = 0; k < 4; k++) line([[-30, -6 + k * 4], [220, -14 + k * 3]], 1, 'rgba(240,240,220,.8)');
  g.restore();
  glow(() => { soft(20, () => C(560, 60, 90, 'rgba(200,230,255,.7)')); });
  bolt(600, 0, 560, 70); bolt(470, 70, 560, 70);
  head(372, 236, 30, 1, { skin: '#f0c8a0', shade: '#8a6048', light: '#fde0c0', mouth: 'open', mohawk: '#e0302a', hair: '#c82a24', brow: 'rgba(60,20,20,.9)' });
  glow(() => line([[350, 210], [390, 204], [404, 230]], 2.5, 'rgba(200,235,255,.9)'));
  g.fillStyle = rad(560, 420, 300, 860, [[0, 'rgba(4,8,10,0)'], [1, 'rgba(4,8,10,.6)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[330, 190, 100, 100], [300, 60, 360, 140], [660, 560, 460, 180]] };
};

// ---------------------------------------------------------------------
SCENES.spora = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, sky, giant, goon, embers } = K;
  sky([[0, '#1a1638'], [.45, '#4a3a5a'], [.78, '#c8885a'], [1, '#e8b880']]);
  giant(940, 210, 200, 'rgba(26,22,56,.85)', .7);
  K.hazeBands(10, 300, 600, '200,170,150', .3);
  // marsh water and reeds
  fill('M0 600 L1200 590 L1200 900 L0 900 Z', lin(0, 590, 0, H, [[0, '#b88a6a'], [.3, '#4a4a4a'], [1, '#141818']]));
  soft(4, () => { for (let i = 0; i < 26; i++) E(rnd() * W, 610 + rnd() * 260, 80 + rnd() * 160, 2 + rnd() * 3, 'rgba(240,210,170,.35)'); });
  soft(1.5, () => { for (let c = 0; c < 9; c++) { const cx = rnd() * W, cy = 604 + rnd() * 30; for (let i = 0; i < 9; i++) { const x = cx + (rnd() - .5) * 70, h = 50 + rnd() * 150, lean = (rnd() - .4) * 50; K.curve(x, cy, x + lean * .3, cy - h * .6, x + lean, cy - h, 2 + rnd() * 2.5, 'rgba(26,30,20,.9)'); if (rnd() < .35) E(x + lean, cy - h, 3, 12, 'rgba(60,40,24,.9)', lean * .01); } } });
  // mist
  soft(30, () => { for (let i = 0; i < 10; i++) E(rnd() * W, 600 + rnd() * 120, 300, 40, 'rgba(230,210,200,.25)'); });
  // the partner healing inside the cloud (the Amiral, small, left)
  glow(() => soft(20, () => C(190, 720, 90, 'rgba(140,255,170,.35)')));
  goon(190, 790, 0, .9, { body: '#1c2856', armour: '#2a3a7a', visor: '#e8dcc4' });
  for (let i = 0; i < 6; i++) glow(() => { const x = 150 + rnd() * 80, y = 640 + rnd() * 120; line([[x, y - 6], [x, y + 6]], 2.5, 'rgba(160,255,190,.9)'); line([[x - 6, y], [x + 6, y]], 2.5, 'rgba(160,255,190,.9)'); });
  // the soldiers, rooted by vines
  [[560, 800], [700, 780], [840, 800], [980, 770]].forEach(([x, y]) => { goon(x, y, (rnd() - .5) * .2, 1, { lit: '#c8a060' }); for (let k = 0; k < 5; k++) { const vx = x - 24 + k * 12; line([[vx, y + 6], [vx + (rnd() - .5) * 30, y - 40 - rnd() * 40], [vx + (rnd() - .5) * 20, y - 70 - rnd() * 30]], 3 + rnd() * 2, '#3a7a3a'); glow(() => C(vx + (rnd() - .5) * 20, y - 50 - rnd() * 40, 3, 'rgba(200,255,140,.9)')); } });
  // the spore cloud falling
  glow(() => { soft(30, () => poly([[480, 420], [700, 420], [1060, 760], [440, 760]], 'rgba(220,240,150,.18)')); for (let i = 0; i < 260; i++) { const t = rnd(), x = 480 + t * 220 + (rnd() - .5) * (100 + t * 500), y = 420 + rnd() * 360; C(x, y, .8 + rnd() * 2.4, `rgba(${230 + rnd() * 25 | 0},${220 + rnd() * 35 | 0},${110 + rnd() * 60 | 0},${.5 + rnd() * .5})`); } });
  // Spora: a floating dome of moss over a jelly body, with hanging tendrils
  for (let i = 0; i < 18; i++) { const x0 = 430 + i * 16, len = 120 + rnd() * 200; const pts = [[x0, 380]]; for (let k = 1; k <= 5; k++) pts.push([x0 + Math.sin(k + i) * 16, 380 + len * k / 5]); limb(pts, 6, 2, i % 3 ? 'rgba(200,150,190,.75)' : 'rgba(80,140,70,.9)'); glow(() => C(pts[5][0], pts[5][1], 3, 'rgba(255,220,240,.9)')); }
  E(580, 380, 200, 70, lin(0, 330, 0, 450, [[0, 'rgba(230,180,220,.85)'], [1, 'rgba(140,90,150,.6)']]));
  glow(() => soft(14, () => E(580, 400, 180, 50, 'rgba(255,190,230,.35)')));
  g.save(); g.beginPath(); g.ellipse(580, 340, 210, 150, 0, Math.PI, Math.PI * 2); g.lineTo(790, 360); g.ellipse(580, 360, 210, 40, 0, 0, Math.PI); g.closePath(); g.fillStyle = rad(520, 240, 20, 260, [[0, '#9ac86a'], [.5, '#4a7a3a'], [1, '#1e3a1e']]); g.fill(); g.clip();
  for (let i = 0; i < 160; i++) C(370 + rnd() * 420, 190 + rnd() * 180, 6 + rnd() * 14, `rgba(${40 + rnd() * 80 | 0},${90 + rnd() * 90 | 0},${30 + rnd() * 40 | 0},.6)`);
  g.restore();
  glow(() => { for (let i = 0; i < 40; i++) { const a = Math.PI + rnd() * Math.PI, r = rnd() * 190; C(580 + Math.cos(a) * r, 350 + Math.sin(a) * r * .7, 2 + rnd() * 3, 'rgba(220,255,150,.9)'); } soft(4, () => { C(540, 280, 9, 'rgba(255,240,160,1)'); C(610, 284, 9, 'rgba(255,240,160,1)'); }); });
  line([[380, 330], [470, 220], [580, 196], [700, 214]], 3, 'rgba(255,220,170,.55)');
  // fireflies
  embers(0, 300, 1200, 600, 60, [220, 255, 150]);
  g.fillStyle = rad(580, 460, 300, 860, [[0, 'rgba(8,8,14,0)'], [1, 'rgba(8,8,14,.6)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[400, 200, 360, 200], [520, 690, 520, 140]] };
};

// ---------------------------------------------------------------------
SCENES.magneto = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, goon, head, embers } = K;
  // inside the asteroid market station
  g.fillStyle = lin(0, 0, 0, H, [[0, '#120e14'], [.5, '#2a1e20'], [1, '#0e0a0a']]); g.fillRect(0, 0, W, H);
  // the big round window: stars and Dorée
  g.save(); g.beginPath(); g.arc(940, 230, 210, 0, Math.PI * 2); g.clip(); g.fillStyle = '#05040c'; g.fillRect(700, 0, 500, 460); K.stars(80, 460, 1);
  g.fillStyle = rad(1000, 300, 10, 180, [[0, '#fff1c4'], [.4, '#e8b03a'], [1, '#6a4a10']]); C(1010, 320, 150, g.fillStyle); for (let i = 0; i < 6; i++) { g.globalAlpha = .4; E(1010, 200 + i * 48, 170, 10, '#b07a14', -.1); } g.globalAlpha = 1; g.restore();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; line([[940 + Math.cos(a) * 60, 230 + Math.sin(a) * 60], [940 + Math.cos(a) * 214, 230 + Math.sin(a) * 214]], 6, '#1a1416'); }
  g.beginPath(); g.arc(940, 230, 212, 0, Math.PI * 2); g.strokeStyle = '#3a2e2a'; g.lineWidth = 20; g.stroke();
  // stalls with awnings and lanterns
  [[60, 480, '#8a2a2a'], [300, 470, '#2a5a5a'], [560, 500, '#8a6a1a']].forEach(([x, y, col]) => { poly([[x, y], [x + 200, y - 10], [x + 220, y + 40], [x - 10, y + 50]], col); for (let k = 0; k < 6; k++) line([[x + k * 36, y - 2], [x + k * 36 + 6, y + 46]], 2, 'rgba(255,240,200,.25)'); fill(`M${x} ${y + 50} L${x + 210} ${y + 40} L${x + 214} ${y + 200} L${x + 4} ${y + 206} Z`, '#1e1614'); for (let k = 0; k < 4; k++) C(x + 30 + k * 50, y + 120, 12, `rgba(${180 + rnd() * 60 | 0},${100 + rnd() * 80 | 0},60,.8)`); });
  for (let i = 0; i < 9; i++) { const x = 40 + i * 130, y = 380 + (i % 2) * 24; line([[x, 330], [x, y]], 1.5, '#3a2e2a'); E(x, y + 14, 12, 16, '#ffb860'); glow(() => soft(12, () => C(x, y + 14, 40, 'rgba(255,170,80,.5)'))); }
  // floor
  fill('M0 700 L1200 690 L1200 900 L0 900 Z', lin(0, 690, 0, H, [[0, '#3a2e2a'], [1, '#100c0a']])); for (let i = 0; i < 10; i++) line([[i * 140 - 100, 900], [600 + (i * 140 - 700) * .3, 700]], 1.5, 'rgba(255,220,180,.12)');
  // the heap of soldiers being pulled through the air
  const pull = [[760, 360, -1.2, .9], [860, 300, .7, .85], [940, 420, 2.2, .9], [1040, 330, -2.4, .8], [820, 480, 1.4, .85], [1000, 520, -.4, .8]];
  glow(() => { pull.forEach(([x, y]) => { for (let k = 0; k < 2; k++) { const pts = []; for (let t = 0; t <= 1; t += .1) pts.push([620 + (x - 620) * t, 380 + (y - 60 - 380) * t + Math.sin(t * Math.PI) * (k ? -40 : 30)]); soft(6, () => line(pts, 10, 'rgba(80,170,255,.4)')); line(pts, 2.2, 'rgba(200,235,255,.9)'); } }); });
  pull.forEach(([x, y, r, s]) => goon(x, y, r, s, { lit: '#6ab4ff' }));
  [[700, 260], [900, 220], [1100, 440], [1080, 600]].forEach(([x, y]) => { poly([[x, y], [x + 30, y - 6], [x + 34, y + 22], [x + 4, y + 26]], '#5a4026'); });
  // Docteur Magnéto: huge, masked, magnet gauntlet raised
  limb([[400, 580], [350, 680], [320, 820]], 56, 44, '#2a3a7a'); E(306, 830, 40, 16, '#0e0a0a');
  limb([[470, 580], [530, 690], [560, 820]], 56, 44, '#34488a'); E(576, 830, 40, 16, '#0e0a0a');
  poly([[360, 360], [520, 350], [530, 600], [370, 610]], lin(360, 0, 530, 0, [[0, '#7a4a30'], [.6, '#c8885a'], [1, '#f0c098']])); // bare chest
  fill('M372 372 L410 364 Q450 420 492 360 L522 356 L526 600 L374 606 Z', lin(372, 0, 526, 0, [[0, '#141e46'], [.6, '#2a3a7a'], [1, '#5a6ab8']])); // wrestling singlet, V-neck
  line([[410, 364], [450, 420], [492, 360]], 4, '#c8963a');
  line([[440, 370], [446, 420]], 4, 'rgba(90,50,30,.5)'); K.curve(400, 400, 420, 412, 440, 404, 3, 'rgba(90,50,30,.5)'); K.curve(450, 400, 470, 410, 494, 398, 3, 'rgba(90,50,30,.5)');
  fill('M420 470 L480 466 L482 520 L422 524 Z', '#c8963a'); C(450, 494, 16, '#f2cc6a'); C(450, 494, 7, '#c82a2a');
  fill('M372 590 L528 584 L530 610 L370 616 Z', '#c8963a');
  limb([[380, 380], [320, 470], [330, 560]], 44, 36, '#a86a44'); C(332, 572, 22, '#c08058');
  limb([[510, 376], [580, 330], [630, 280]], 46, 38, '#b8784e');
  // the gauntlet
  E(650, 262, 42, 38, lin(610, 0, 690, 0, [[0, '#3a3a4a'], [1, '#9aa8c8']])); glow(() => { soft(20, () => C(660, 258, 80, 'rgba(90,180,255,.7)')); C(660, 258, 18, 'rgba(230,245,255,1)'); });
  head(450, 316, 42, 1, { skin: '#c8885a', shade: '#6a3a24', light: '#f0b890', mask: lin(410, 0, 500, 0, [[0, '#6a0e14'], [.5, '#c82a2a'], [1, '#f0c860']]), mouth: 'open', eye: '#f6f0e0', brow: 'rgba(240,200,80,.9)' });
  glow(() => line([[476, 286], [496, 300], [494, 330]], 3, 'rgba(160,210,255,.8)'));
  embers(600, 180, 560, 460, 90, [140, 200, 255]);
  g.fillStyle = rad(600, 420, 300, 860, [[0, 'rgba(6,4,6,0)'], [1, 'rgba(6,4,6,.6)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[400, 260, 130, 120], [600, 210, 110, 110], [700, 220, 400, 360]] };
};

// ---------------------------------------------------------------------
SCENES.doc = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, curve, soft, glow, poly, limb, sky, goon, head, embers, billow } = K;
  sky([[0, '#020205'], [.6, '#16141c'], [1, '#3a3430']]); K.stars(260, 520, 1);
  // flares hanging in the black sky
  [[300, 120], [760, 80], [1040, 160]].forEach(([x, y]) => { glow(() => { soft(10, () => C(x, y, 22, 'rgba(255,250,235,.85)')); C(x, y, 6, 'rgba(255,255,250,1)'); }); soft(6, () => { for (let k = 0; k < 5; k++) C(x + k * 4, y - 20 - k * 22, 8 + k * 3, 'rgba(200,196,190,.25)'); }); line([[x, y], [x + 10, y - 60]], 2, 'rgba(220,210,200,.4)'); });
  // crater ridges, rocky ground
  fill('M0 560 Q200 500 420 540 Q700 590 900 520 Q1060 480 1200 520 L1200 900 L0 900 Z', lin(0, 480, 0, H, [[0, '#4a4440'], [.4, '#26221e'], [1, '#0c0a08']]));
  fill('M560 680 Q800 620 1200 640 L1200 900 L560 900 Z', lin(0, 620, 0, H, [[0, '#3a3430'], [1, '#100e0c']]));
  soft(10, () => { for (let i = 0; i < 18; i++) billow(500 + rnd() * 700, 480 + rnd() * 140, 40 + rnd() * 60, rnd() > .5, [200, 190, 180]); });
  // enemy fire from the ridge
  [[1000, 560], [1120, 540], [880, 580]].forEach(([x, y]) => { goon(x, y, -.1, .7, { flip: 1, lit: '#c87050' }); glow(() => line([[x - 40, y - 70], [x - 300 - rnd() * 200, y - 20 + rnd() * 120]], 2, 'rgba(255,90,60,.85)')); });
  // the soldier, kneeling, reaching for the kit
  limb([[860, 760], [820, 800], [800, 840]], 26, 20, '#3a4a2a'); limb([[880, 760], [920, 800], [950, 800]], 26, 20, '#4a5a32');
  poly([[840, 680], [900, 676], [904, 770], [846, 774]], lin(840, 0, 904, 0, [[0, '#2a3a20'], [1, '#6a7a4a']]));
  limb([[890, 690], [920, 640], [930, 600]], 18, 14, '#4a5a32'); C(932, 594, 9, '#d09a70');
  head(872, 650, 24, -1, { skin: '#d09a70', shade: '#6a4028', helmet: '#3a4a2a', mouth: 'open' });
  // the med-kit arc
  glow(() => { const pts = []; for (let t = 0; t <= 1; t += .05) pts.push([470 + (930 - 470) * t, 300 - Math.sin(t * Math.PI) * 220 + (580 - 300) * t]); soft(8, () => line(pts, 16, 'rgba(160,255,190,.35)')); line(pts, 3, 'rgba(220,255,230,.9)'); });
  poly([[700, 120], [740, 114], [744, 146], [704, 150]], '#efe6d2'); line([[722, 120], [724, 146]], 6, '#3a8a4a'); line([[708, 134], [740, 132]], 6, '#3a8a4a');
  glow(() => soft(10, () => C(722, 134, 40, 'rgba(180,255,200,.5)')));
  glow(() => soft(20, () => C(930, 590, 70, 'rgba(160,255,190,.35)')));
  // Doc Suture, throwing
  limb([[380, 560], [330, 660], [300, 800]], 34, 26, '#4a4a32'); E(290, 808, 30, 12, '#141008');
  limb([[420, 560], [470, 650], [520, 790]], 34, 26, '#5a5a3a'); E(532, 798, 30, 12, '#141008');
  poly([[350, 380], [450, 370], [460, 570], [356, 580]], lin(350, 0, 460, 0, [[0, '#3a3a24'], [.6, '#6a6a40'], [1, '#9a9a6a']]));
  line([[360, 390], [450, 560]], 8, '#5a3a22'); poly([[420, 520], [470, 516], [474, 566], [424, 570]], '#6a4426'); // satchel
  poly([[440, 400], [464, 398], [466, 430], [442, 432]], '#efe6d2'); line([[452, 402], [453, 428]], 4, '#3a8a4a'); line([[444, 415], [462, 414]], 4, '#3a8a4a'); // armband
  limb([[360, 400], [300, 460], [270, 520]], 26, 20, '#4a4a2e'); C(266, 530, 12, '#c08a62');
  limb([[440, 392], [470, 330], [470, 300]], 26, 20, '#6a6a40'); C(470, 292, 12, '#e0b090');
  head(400, 336, 32, 1, { skin: '#e0b090', shade: '#7a5038', light: '#f6d0b0', hair: '#bfb8ac', hairBack: '#a8a092', mouth: 'open', brow: 'rgba(160,150,140,.9)' });
  C(370, 304, 14, '#b8b0a4');
  glow(() => line([[420, 306], [434, 330]], 2.5, 'rgba(255,220,180,.7)'));
  embers(0, 300, 1200, 400, 50, [255, 200, 150]);
  g.fillStyle = rad(560, 420, 320, 880, [[0, 'rgba(2,2,4,0)'], [1, 'rgba(2,2,4,.6)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[350, 280, 140, 120], [680, 100, 90, 70], [820, 580, 140, 120]] };
};

// ---------------------------------------------------------------------
SCENES.demi = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, goon, head, embers } = K;
  // day on the left, night on the right
  g.fillStyle = lin(0, 0, W, 0, [[0, '#f08a3a'], [.35, '#c8502a'], [.5, '#6a3a5a'], [.62, '#2a2a5a'], [1, '#0c1030']]); g.fillRect(0, 0, W, H);
  g.fillStyle = lin(0, 0, 0, H, [[0, 'rgba(0,0,0,.35)'], [.6, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H);
  for (let i = 0; i < 120; i++) C(640 + rnd() * 560, rnd() * 500, rnd() * 1.5 + .3, `rgba(230,240,255,${.3 + rnd() * .6})`);
  // the motionless sun, low on the left horizon
  K.halo(80, 600, 520, '255,246,210', '240,120,50');
  // ground: scorched rock left, ice right
  fill('M0 620 L600 600 L600 900 L0 900 Z', lin(0, 600, 0, H, [[0, '#6a2a14'], [1, '#1e0a06']]));
  fill('M600 600 L1200 620 L1200 900 L600 900 Z', lin(0, 600, 0, H, [[0, '#9ab8d8'], [.5, '#3a5a7a'], [1, '#0c1a2a']]));
  for (let i = 0; i < 7; i++) { const x = 700 + rnd() * 480, h = 120 + rnd() * 260; poly([[x - 20, 620], [x + (rnd() - .5) * 20, 620 - h], [x + 22, 620]], lin(x - 20, 0, x + 22, 0, [[0, '#4a6a9a'], [1, '#d8ecff']])); }
  for (let i = 0; i < 6; i++) { const x = 40 + rnd() * 500, h = 60 + rnd() * 120; poly([[x - 30, 622], [x, 622 - h], [x + 30, 622]], '#3a1a10'); glow(() => line([[x, 622 - h], [x + 6, 622 - h * .5]], 2, 'rgba(255,140,60,.8)')); }
  soft(30, () => { E(300, 640, 400, 50, 'rgba(255,170,90,.3)'); E(900, 640, 400, 50, 'rgba(170,210,255,.3)'); });
  // a soldier burning (left) and one frozen solid (right)
  goon(240, 780, .3, 1.05, { lit: '#ff8a3a' }); glow(() => { for (let i = 0; i < 12; i++) { const x = 220 + rnd() * 50, y = 680 + rnd() * 90; soft(3, () => poly([[x - 10, y + 10], [x, y - 30 - rnd() * 30], [x + 10, y + 10]], 'rgba(255,150,50,.85)')); } });
  goon(960, 790, -.1, 1.05, { ice: 1, lit: '#bfe0ff', visor: '#9fd8ff' });
  // streams: fire from her left hand, frost from her right
  glow(() => { soft(14, () => line([[470, 470], [370, 560], [270, 700]], 60, 'rgba(255,120,40,.55)')); line([[470, 470], [370, 560], [270, 700]], 12, 'rgba(255,230,150,.9)'); });
  glow(() => { soft(14, () => line([[730, 470], [840, 580], [950, 720]], 60, 'rgba(120,190,255,.5)')); line([[730, 470], [840, 580], [950, 720]], 10, 'rgba(230,245,255,.95)'); for (let i = 0; i < 20; i++) { const t = rnd(); C(730 + 220 * t + (rnd() - .5) * 40, 470 + 250 * t + (rnd() - .5) * 40, 2 + rnd() * 2, 'rgba(240,250,255,.9)'); } });
  // Demi: hooded, the cloak half flame, half frost
  fill('M600 300 Q560 300 540 340 Q500 360 498 420 Q470 600 400 860 L600 860 Z', lin(400, 0, 600, 0, [[0, '#6a1a0a'], [.6, '#c84a1a'], [1, '#f08a3a']]));
  fill('M600 300 Q640 300 660 340 Q700 360 702 420 Q730 600 800 860 L600 860 Z', lin(600, 0, 800, 0, [[0, '#cfe4f6'], [.5, '#6a90c0'], [1, '#2a3a6a']]));
  K.curve(520, 440, 560, 640, 520, 860, 3, 'rgba(60,10,0,.5)'); K.curve(680, 440, 640, 640, 680, 860, 3, 'rgba(20,30,60,.5)'); line([[600, 330], [600, 860]], 3, 'rgba(255,240,230,.5)');
  glow(() => { for (let i = 0; i < 16; i++) { const y = 380 + rnd() * 460, x = 470 + rnd() * 40; soft(3, () => poly([[x - 12, y + 12], [x - 28 - rnd() * 30, y - 20 - rnd() * 30], [x + 4, y]], 'rgba(255,150,50,.85)')); } });
  for (let i = 0; i < 16; i++) { const y = 400 + rnd() * 450, x = 712 + rnd() * 20; poly([[x - 5, y], [x + 2, y + 18 + rnd() * 20], [x + 7, y]], 'rgba(240,250,255,.9)'); }
  limb([[540, 370], [490, 410], [450, 450], [470, 470]], 34, 24, '#a83a14'); C(468, 474, 14, '#e0a070'); // fire arm, sleeve flaring
  limb([[660, 370], [710, 410], [750, 450], [730, 470]], 34, 24, '#5a7aaa'); C(732, 474, 14, '#c8d8e8'); // frost arm
  // the hood, face in shadow, one eye each colour
  poly([[528, 310], [600, 206], [672, 310], [662, 392], [538, 392]], '#1a0e0e');
  fill('M528 312 Q600 186 672 312 L662 346 Q600 270 538 346 Z', lin(540, 0, 660, 0, [[0, '#a83a14'], [.5, '#6a3a5a'], [1, '#6a90c0']]));
  E(600, 332, 40, 46, '#140a0c');
  glow(() => { soft(4, () => { C(586, 326, 7, 'rgba(255,150,60,1)'); C(616, 326, 7, 'rgba(160,220,255,1)'); }); C(586, 326, 2.5, '#fff'); C(616, 326, 2.5, '#fff'); });
  embers(0, 200, 600, 600, 70, [255, 160, 70]); embers(600, 200, 600, 600, 70, [200, 230, 255]);
  g.fillStyle = rad(600, 460, 300, 860, [[0, 'rgba(4,4,8,0)'], [1, 'rgba(4,4,8,.6)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[540, 220, 120, 170], [440, 360, 320, 160]] };
};

// ---------------------------------------------------------------------
SCENES.bernache = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, sky, giant, goon, embers } = K;
  sky([[0, '#2a2a4a'], [.45, '#8a5a5a'], [.75, '#f0a860'], [1, '#ffd890']]);
  giant(860, 560, 260, 'rgba(42,42,74,.7)');
  K.halo(300, 520, 360, '255,246,210', '250,180,100');
  // the lake
  fill('M0 600 L1200 590 L1200 900 L0 900 Z', lin(0, 590, 0, H, [[0, '#e8b070'], [.3, '#7a6a6a'], [1, '#1e2430']]));
  soft(3, () => { for (let i = 0; i < 40; i++) E(rnd() * W, 610 + rnd() * 280, 60 + rnd() * 200, 2 + rnd() * 3, 'rgba(255,220,170,.45)'); });
  // reeds, foreground and far shore
  soft(1.2, () => { for (let i = 0; i < 60; i++) { const x = rnd() < .5 ? rnd() * 260 : 940 + rnd() * 260, y = 820 + rnd() * 80, h = 100 + rnd() * 220; line([[x, y], [x + (rnd() - .5) * 30, y - h]], 3, 'rgba(24,20,14,.9)'); if (rnd() < .4) E(x, y - h, 4, 16, '#3a2414'); } });
  // the honk: a visible blast of sound
  for (let i = 1; i <= 6; i++) { g.beginPath(); g.ellipse(840, 400, 50 + i * 60, 30 + i * 46, 0, -.9, .9); g.strokeStyle = `rgba(255,245,220,${.75 - i * .1})`; g.lineWidth = 9 - i; g.stroke(); }
  // soldiers tumbling and running, splashing
  goon(1000, 470, 1.2, .9, { lit: '#f0b070' }); goon(1080, 640, -.9, .95, { lit: '#f0b070' }); goon(1150, 520, 2.4, .8); goon(940, 680, .5, .9);
  soft(2, () => { for (let i = 0; i < 40; i++) C(900 + rnd() * 300, 640 + rnd() * 80, 2 + rnd() * 4, 'rgba(240,248,255,.75)'); });
  // Bernache: wings up and wide, neck stretched, beak open
  const wing = (s) => { g.save(); g.translate(540, 480); g.scale(s, 1); const grd = lin(0, 0, 360, -320, [[0, '#6a5a4a'], [.6, '#9a8a78'], [1, '#d8ccb8']]);
    fill('M0 0 C80 -120 200 -260 360 -330 C330 -260 320 -200 300 -160 C270 -140 250 -100 230 -60 C180 -40 120 -10 60 30 Z', grd);
    for (let k = 0; k < 7; k++) line([[60 + k * 40, -20 - k * 30], [150 + k * 34, -150 - k * 26]], 2.5, 'rgba(40,30,24,.55)');
    for (let k = 0; k < 6; k++) poly([[250 + k * 14, -150 - k * 30], [310 + k * 10, -190 - k * 26], [280 + k * 12, -130 - k * 30]], '#3a3028');
    g.restore(); };
  wing(-1); wing(1);
  E(560, 540, 160, 82, lin(0, 460, 0, 620, [[0, '#9a8a7a'], [.5, '#6a5a4a'], [1, '#3a3028']])); E(640, 560, 80, 50, lin(0, 520, 0, 610, [[0, '#f0e8d8'], [1, '#bfb4a0']]));
  poly([[400, 520], [340, 500], [360, 540]], '#1e1a16'); // tail
  limb([[660, 500], [740, 450], [800, 420]], 46, 30, '#141210'); // neck
  E(822, 410, 38, 28, '#141210', -.3);
  fill('M800 418 Q822 392 846 404 Q840 428 812 432 Z', '#f6f0e4'); // chin strap
  poly([[852, 396], [910, 384], [868, 410]], '#2a2420'); poly([[852, 412], [906, 420], [866, 420]], '#2a2420'); // beak open
  fill('M856 404 L900 400 L900 410 L858 412 Z', '#a8302a');
  C(832, 400, 4.5, '#ffd040'); C(833, 399, 1.6, '#000');
  limb([[540, 610], [520, 680]], 10, 8, '#2a2420'); limb([[600, 610], [620, 680]], 10, 8, '#2a2420');
  soft(2, () => { for (let i = 0; i < 30; i++) C(500 + rnd() * 160, 670 + rnd() * 20, 2 + rnd() * 3, 'rgba(240,248,255,.8)'); });
  // drifting feathers
  for (let i = 0; i < 9; i++) { const x = 200 + rnd() * 800, y = 120 + rnd() * 400; E(x, y, 10, 3, 'rgba(230,220,200,.85)', rnd() * 3); }
  line([[400, 130], [540, 250], [700, 120]], 3, 'rgba(255,230,180,.0)');
  glow(() => { line([[230, 230], [400, 400]], 3, 'rgba(255,230,180,.5)'); line([[870, 230], [700, 400]], 3, 'rgba(255,230,180,.5)'); });
  g.fillStyle = rad(600, 450, 320, 880, [[0, 'rgba(10,8,12,0)'], [1, 'rgba(10,8,12,.55)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[780, 370, 140, 80], [480, 460, 220, 140]] };
};

// ---------------------------------------------------------------------
SCENES.raccoon = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, goon, head, embers } = K;
  // inside the ring station: the floor curves up behind
  g.fillStyle = lin(0, 0, 0, H, [[0, '#0c0c1a'], [.5, '#2a2440'], [1, '#14101a']]); g.fillRect(0, 0, W, H);
  // ceiling window strip with stars and the star
  fill('M0 40 Q600 -40 1200 40 L1200 120 Q600 50 0 120 Z', '#05040c');
  for (let i = 0; i < 80; i++) { const x = rnd() * W; C(x, 50 + rnd() * 50 - Math.sin(x / W * Math.PI) * 40, rnd() * 1.4 + .3, 'rgba(240,240,255,.8)'); }
  K.halo(860, 70, 320, '255,250,230', '200,170,255');
  for (let i = 0; i < 10; i++) line([[i * 130, 40 - Math.sin(i * 130 / W * Math.PI) * 60], [i * 130, 120 - Math.sin(i * 130 / W * Math.PI) * 60]], 8, '#1a1626');
  // the curved habitat floor with little buildings rising up both sides
  fill('M0 300 Q300 640 600 660 Q900 640 1200 300 L1200 900 L0 900 Z', lin(0, 300, 0, H, [[0, '#5a5070'], [.6, '#2a2438'], [1, '#100c16']]));
  for (let i = 0; i < 26; i++) { const t = rnd(), side = rnd() < .5 ? -1 : 1, x = 600 + side * (100 + t * 480), y = 650 - (t * t) * 340; const w = 30 + rnd() * 30, h = 30 + rnd() * 50; g.save(); g.translate(x, y); g.rotate(side * t * .9); fill(`M${-w / 2} 0 L${w / 2} 0 L${w / 2} ${-h} L${-w / 2} ${-h} Z`, `rgba(${60 + rnd() * 40 | 0},${50 + rnd() * 30 | 0},${80 + rnd() * 40 | 0},.95)`); for (let k = 0; k < 3; k++) glow(() => C(-w / 4 + k * w / 4, -h / 2, 2.5, 'rgba(255,210,140,.9)')); g.restore(); }
  fill('M0 720 Q600 680 1200 720 L1200 900 L0 900 Z', lin(0, 680, 0, H, [[0, '#4a4258'], [1, '#14101a']]));
  for (let i = 0; i < 12; i++) line([[i * 110, 900], [600 + (i * 110 - 600) * .4, 700]], 1.5, 'rgba(220,200,255,.12)');
  // soldiers on the floor, hit by the blaster
  [[800, 760], [920, 750], [1040, 770], [1120, 740]].forEach(([x, y], i) => { goon(x, y, (i % 2 ? .3 : -.2) * (1 + rnd()), 1, { lit: '#ff9a5a' }); });
  [[810, 700], [930, 690], [1050, 710]].forEach(([x, y]) => { glow(() => { line([[600, 330], [x, y]], 3.5, 'rgba(120,255,200,.95)'); soft(6, () => line([[600, 330], [x, y]], 12, 'rgba(120,255,200,.35)')); soft(10, () => C(x, y, 30, 'rgba(255,220,150,.8)')); }); });
  // the raccoon on his rocket pack
  glow(() => { soft(12, () => poly([[470, 400], [500, 400], [440, 640], [380, 640]], 'rgba(120,200,255,.55)')); poly([[476, 400], [496, 400], [462, 520], [446, 520]], 'rgba(240,250,255,.95)'); });
  soft(6, () => { for (let i = 0; i < 9; i++) K.billow(420 - i * 14 + rnd() * 30, 560 + i * 34, 24 + i * 6, true, [200, 200, 220]); });
  poly([[450, 300], [510, 296], [512, 400], [452, 404]], lin(450, 0, 512, 0, [[0, '#3a3a40'], [1, '#9a9aa8']])); C(480, 300, 18, '#5a5a66'); // rocket pack
  limb([[520, 380], [500, 450], [470, 500]], 22, 16, '#c8862a'); limb([[540, 380], [580, 440], [570, 500]], 22, 16, '#e0a040'); E(466, 506, 16, 9, '#2a2a2a'); E(574, 506, 16, 9, '#2a2a2a');
  poly([[500, 290], [570, 284], [580, 390], [506, 396]], lin(500, 0, 580, 0, [[0, '#8a5a1a'], [.6, '#d8962a'], [1, '#f8c870']])); // space suit
  poly([[520, 320], [552, 318], [554, 350], [522, 352]], '#6a7a8a'); C(538, 336, 6, '#a83a2a');
  // striped tail
  for (let k = 0; k < 6; k++) { const t = k / 6; C(500 - t * 90, 380 + t * 40 - Math.sin(t * 3) * 20, 18 - k * 1.5, k % 2 ? '#2a2420' : '#8a7a6a'); }
  limb([[560, 300], [590, 320], [606, 330]], 18, 14, '#d8962a'); // arm with blaster
  poly([[596, 318], [640, 314], [640, 330], [598, 336]], '#3a3a44'); glow(() => soft(4, () => C(642, 322, 9, 'rgba(140,255,210,1)')));
  // raccoon head: grey fur, black mask, ears
  // raccoon head: round grey face, rounded ears, black mask band, white brows and muzzle
  E(512, 214, 14, 16, '#5a5450'); E(512, 216, 7, 9, '#2a2420'); E(566, 212, 14, 16, '#7a726c'); E(566, 214, 7, 9, '#3a3430');
  E(540, 254, 40, 34, lin(500, 0, 580, 0, [[0, '#6a625c'], [.5, '#a8a098'], [1, '#d8d0c8']]));
  fill('M496 252 Q520 232 540 246 Q560 232 584 250 Q578 268 560 266 Q540 258 520 266 Q502 268 496 252 Z', '#141210');
  fill('M506 240 Q522 230 536 238 L534 242 Q520 236 508 244 Z', '#f2ece4'); fill('M546 238 Q560 228 576 238 L574 244 Q560 236 548 242 Z', '#f2ece4');
  E(522, 252, 6, 5, '#f6e8b0'); C(523, 252, 2.4, '#000'); E(560, 252, 6, 5, '#f6e8b0'); C(561, 252, 2.4, '#000');
  E(556, 280, 22, 13, '#efe8de'); E(572, 274, 7, 5, '#141210'); fill('M550 288 Q562 296 574 288 Q566 300 554 296 Z', '#5a1a14');
  glow(() => line([[520, 218], [560, 214], [574, 240]], 2.5, 'rgba(220,210,255,.8)'));
  embers(300, 200, 900, 600, 60, [180, 255, 220]);
  g.fillStyle = rad(600, 420, 300, 860, [[0, 'rgba(4,2,8,0)'], [1, 'rgba(4,2,8,.6)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[500, 190, 110, 110], [440, 280, 220, 140], [780, 660, 300, 120]] };
};

// ---------------------------------------------------------------------
SCENES.soldier = () => { const [cv, g] = canvasFor(); const K = kit(g); const { lin, rad, fill, C, E, line, soft, glow, poly, limb, sky, goon, head, embers, billow } = K;
  sky([[0, '#4a3008'], [.4, '#a8761a'], [.75, '#f0c060'], [1, '#fff0b8']]);
  K.halo(820, 300, 440, '255,252,230', '255,210,110');
  // the golden cloud sea
  soft(8, () => { for (let i = 0; i < 50; i++) billow(rnd() * W, 560 + rnd() * 160, 70 + rnd() * 110, rnd() > .3, [255, 230, 160]); });
  // flare stacks in the distance
  [[160, 380], [1060, 420]].forEach(([x, y]) => { poly([[x - 12, 620], [x - 6, y], [x + 6, y], [x + 12, 620]], '#3a2a10'); glow(() => { soft(14, () => E(x, y - 40, 30, 60, 'rgba(255,140,40,.8)')); E(x, y - 30, 12, 30, 'rgba(255,240,180,1)'); }); soft(10, () => { for (let k = 0; k < 6; k++) billow(x + k * 20, y - 100 - k * 40, 30 + k * 8, false, [140, 120, 100]); }); });
  // the rig platform: grating, rail, rivets
  fill('M0 680 L1200 640 L1200 900 L0 900 Z', lin(0, 640, 0, H, [[0, '#5a4a30'], [.5, '#3a2e1c'], [1, '#14100a']]));
  for (let i = 0; i < 30; i++) line([[i * 44 - 60, 900], [600 + (i * 44 - 660) * .4, 660]], 2, 'rgba(20,14,8,.5)');
  for (let i = 0; i < 9; i++) { const y = 690 + i * i * 2.4 + i * 4; line([[0, y + 10], [W, y - 30 + i * 2]], 2, 'rgba(20,14,8,.5)'); }
  line([[0, 600], [1200, 560]], 6, '#2a2010'); line([[0, 640], [1200, 600]], 4, '#2a2010'); for (let i = 0; i < 16; i++) line([[i * 80, 600 - i * 2.7], [i * 80, 680 - i * 2.7]], 5, '#2a2010');
  line([[0, 600], [1200, 560]], 2, 'rgba(255,230,160,.6)');
  // RAGE: the shockwave from his roar
  for (let i = 1; i <= 7; i++) { g.beginPath(); g.ellipse(520, 400, 60 + i * 70, 50 + i * 48, 0, -1.1, 1.1); g.strokeStyle = `rgba(255,${120 - i * 8},${60 - i * 4},${.85 - i * .1})`; g.lineWidth = 12 - i; g.stroke(); }
  glow(() => soft(30, () => C(460, 420, 160, 'rgba(255,80,40,.35)')));
  // soldiers blasted back, one going over the rail
  goon(860, 600, -.9, .95, { lit: '#ffb060' }); goon(980, 520, -1.6, .9, { lit: '#ffb060' }); goon(1100, 470, -2.3, .85); goon(1060, 660, -1.3, .9, { lit: '#ffb060' });
  // the soldier, roaring: green camouflage, helmet, fists clenched
  const camo = (pts) => { poly(pts, '#4a5a2e'); for (let i = 0; i < 12; i++) { const [x, y] = pts[rnd() * pts.length | 0]; E(x + (rnd() - .5) * 40, y + (rnd() - .5) * 40, 10 + rnd() * 10, 6 + rnd() * 6, ['#2a3418', '#6a7a40', '#3a2a18'][i % 3], rnd() * 3); } };
  limb([[380, 600], [320, 700], [290, 820]], 40, 32, '#4a5a2e'); E(278, 830, 36, 14, '#14100a');
  limb([[420, 600], [480, 700], [520, 820]], 40, 32, '#56663a'); E(534, 830, 36, 14, '#14100a');
  g.save(); g.beginPath(); g.moveTo(350, 400); g.lineTo(460, 380); g.lineTo(470, 610); g.lineTo(354, 616); g.closePath(); g.clip(); camo([[350, 400], [460, 380], [470, 610], [354, 616]]); g.restore();
  line([[352, 470], [468, 460]], 12, '#2a2010'); line([[350, 560], [470, 552]], 10, '#3a2a18');
  limb([[362, 412], [292, 436], [270, 372]], 32, 28, '#4a5a2e'); C(268, 362, 18, '#c87050'); // fists up, out wide
  limb([[452, 404], [532, 426], [552, 364]], 32, 28, '#56663a'); C(554, 354, 18, '#d88060');
  for (let i = 0; i < 18; i++) E(360 + rnd() * 100, 400 + rnd() * 200, 8 + rnd() * 9, 5 + rnd() * 5, ['#2a3418', '#6a7a40', '#3a2a18'][i % 3], rnd() * 3);
  head(452, 340, 44, 1, { skin: '#d86a4a', shade: '#7a2a1a', light: '#f09070', helmet: '#3a4a24', mouth: 'open', brow: 'rgba(40,10,6,.9)' });
  glow(() => { line([[400, 300], [450, 294], [476, 316]], 3, 'rgba(255,220,160,.8)'); soft(8, () => C(440, 340, 50, 'rgba(255,60,40,.25)')); });
  embers(500, 200, 700, 500, 80, [255, 200, 120]);
  g.fillStyle = rad(600, 420, 300, 860, [[0, 'rgba(10,6,2,0)'], [1, 'rgba(10,6,2,.55)']]); g.fillRect(0, 0, W, H);
  return { img: g.getImageData(0, 0, W, H), focal: [[380, 280, 130, 120], [280, 390, 240, 200], [820, 440, 340, 240]] };
};
