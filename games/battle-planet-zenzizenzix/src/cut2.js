// =====================================================================
// CUTSCENES, WORLD 2 — Villen-Hüüs hands Oscar the gear; Oscar's defeat,
// his story as a scratched silent film, the Empire police.
// =====================================================================
function policeLook(seed) { const L = { b: BONES(1.05, { wide: 1.1 }), top: '#2a3a6a', arms: '#2a3a6a', legs: '#1a2448', legB: '#141c3a', skin: ['#d8a07a', '#a86a4a', '#e0b090'][seed % 3], boots: '#0c0a0c', foot: bootFoot };
  L.torso = (c, S) => { c.fillStyle = '#e8c060'; c.fillRect(S.chest[0] + 1, S.chest[1] + 3, 3, 3); c.fillStyle = '#c8c8d0'; c.fillRect(S.hip[0] - 6, S.hip[1] - 4, 12, 2); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, r = L.b.hr; disc(c, x, y, r, L.skin, rim); poly(c, [[x - r * 1.05, y - r * .3], [x - r * .9, y - r * 1.25], [x + r * .9, y - r * 1.25], [x + r * 1.05, y - r * .3]], '#1a2448', rim); c.fillStyle = '#1a1a1a'; c.fillRect(x - r * .2, y - r * .35, r * 1.6, 2); c.fillStyle = '#e8c060'; c.fillRect(x - r * .1, y - r * .95, 3, 3); eye(c, x + r * .5, y - r * .1); };
  return L; }
const POLICE = [policeLook(0), policeLook(1)];
function stageSoifPort(B, t) {
  sky(B, '#5a2a5a', '#f0705a', '#ffc070', 330);
  B.fillStyle = '#fff2c0'; B.beginPath(); B.arc(700, 300, 46, Math.PI, 0); B.fill();
  for (let i = 0; i < 4; i++) { const x = 80 + i * 240; B.fillStyle = '#3a1a2a'; B.fillRect(x, 120, 8, 210); B.fillRect(x + 70, 120, 8, 210); B.fillRect(x - 40, 110, 170, 12); }
  for (let x = 0; x < 960; x += 64) for (let k = 0; k < 1 + (x * 7) % 3; k++) { B.fillStyle = ['#a83a2a', '#2a5a8a', '#3a7a4a', '#c8902a'][(x / 64 + k) % 4]; B.fillRect(x + 2, 310 - k * 22, 60, 20); }
  B.fillStyle = '#3a6a8a'; B.fillRect(0, 330, 960, 50); for (let k = 0; k < 30; k++) { B.fillStyle = 'rgba(255,220,170,.6)'; B.fillRect((k * 71 + t * 20) % 960, 340 + (k % 4) * 9, 14, 2); }
  B.fillStyle = '#8a7a68'; B.fillRect(0, 380, 960, 160); for (let x = 0; x < 960; x += 48) { B.fillStyle = 'rgba(40,30,20,.3)'; B.fillRect(x, 380, 1.5, 160); }
}
function stageSaloon(B, t) {
  for (let x = 0; x < 960; x += 12) { B.fillStyle = (x / 12) % 2 ? '#6a3a22' : '#5e321c'; B.fillRect(x, 0, 12, 400); }
  B.fillStyle = '#3a1e10'; B.fillRect(0, 0, 960, 26); B.fillStyle = '#4a2a16'; B.fillRect(0, 110, 960, 14); B.fillStyle = '#7a4a2a'; B.fillRect(0, 76, 960, 6); for (let x = 0; x < 960; x += 18) { B.fillStyle = '#5a3220'; B.fillRect(x + 4, 82, 4, 28); }
  B.fillStyle = '#2a1a14'; B.fillRect(540, 170, 400, 110); B.fillStyle = '#8ab0c0'; B.fillRect(556, 180, 368, 90); for (let k = 0; k < 2; k++) for (let j = 0; j < 30; j++) { B.fillStyle = ['#5a8a4a', '#8a3a2a', '#c8a04a', '#3a5a8a'][(j + k) % 4]; B.fillRect(560 + j * 12, 290 + k * 30, 6, 18); }
  B.fillStyle = '#c8963a'; B.fillRect(500, 350, 460, 8); B.fillStyle = '#5a2e18'; B.fillRect(500, 358, 460, 42);
  for (let y = 400; y < 540; y += 14) { B.fillStyle = (y / 14) % 2 ? '#7a5030' : '#6a4426'; B.fillRect(0, y, 960, 14); }
}
function filmOverlay(c, t) { // scratches, dust, flicker, vignette
  const fl = .06 + Math.random() * .08; c.fillStyle = `rgba(255,250,235,${fl})`; c.fillRect(0, 0, 960, 540);
  for (let k = 0; k < 3; k++) if (Math.random() < .6) { const x = Math.random() * 960; c.strokeStyle = 'rgba(30,25,20,.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + (Math.random() - .5) * 20, 540); c.stroke(); }
  for (let k = 0; k < 14; k++) { c.fillStyle = Math.random() < .5 ? 'rgba(20,15,10,.6)' : 'rgba(255,255,240,.6)'; c.fillRect(Math.random() * 960, Math.random() * 540, 1 + Math.random() * 3, 1 + Math.random() * 3); }
  const vg = c.createRadialGradient(480, 270, 180, 480, 270, 560); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.75)'); c.fillStyle = vg; c.fillRect(0, 0, 960, 540);
}
function titleCard(c, text) { // a silent-film intertitle
  c.fillStyle = '#0c0a08'; c.fillRect(0, 0, 960, 540); c.strokeStyle = '#e8e0cc'; c.lineWidth = 3; c.strokeRect(120, 110, 720, 320); c.lineWidth = 1; c.strokeRect(132, 122, 696, 296);
  for (const [x, y] of [[120, 110], [840, 110], [120, 430], [840, 430]]) { c.beginPath(); c.arc(x, y, 10, 0, 7); c.stroke(); }
  c.fillStyle = '#efe8d4'; c.font = 'italic 600 30px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; const lines = wrap(c, text, 620); lines.forEach((l, i) => c.fillText(l, 480, 270 + (i - (lines.length - 1) / 2) * 42)); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
}
const KIDOSCAR = (() => { const L = oscarLook(); L.b = BONES(.78, { wide: 1.15, head: 1.2 }); L.top = '#5a6a8a'; return L; })();
function buildSoifIntro(st) {
  const lines = st.intro;
  return [{ style: 0, floor: 380, lines, draw(B, F, t, li, lt, S) {
    stageSoifPort(B, t); const cur = lines[li] || {};
    const leave = S.leave !== undefined ? S.T - S.leave : -1;
    drawRig(F, 380, 470, 1, CS * 1.2, OSCAR, cur.who === 'OSC' ? POSES.chat(t) : li >= 1 ? POSES.salute(t) : POSES.idle(t, 2), t, { shout: cur.who === 'OSC' }); S.anchor.OSC = [380, 470 - 190];
    if (leave < 1.2) { const vx = 560 + Math.max(0, leave) * 300; drawRig(F, vx, 460, leave > 0 ? 1 : -1, CS * 1.05, VILLEN, leave > 0 ? POSES.walk(t, 1.4) : cur.who === 'VH' ? POSES.chat(t) : POSES.idle(t, 1), t, { shout: cur.who === 'VH', gear: li < 1, cane: li >= 1 }); S.anchor.VH = [vx, 460 - 175];
      drawRig(F, vx + 90, 460, -1, CS, MADAME, cur.who === 'MMF' ? POSES.check(t) : POSES.idle(t, 7), t, {}); S.anchor.MMF = [vx + 90, 460 - 90]; }
    if (li >= 1) gearShape(F, 404, 470 - 110, 6, t, '#ffd86a', .6);
    if (leave > .8) { const dy = (leave - .8) * 120; F.save(); F.translate(820, 170 - dy); F.scale(2.4, 2.4); F.fillStyle = '#1e1820'; F.beginPath(); F.moveTo(-40, 0); F.lineTo(30, -8); F.lineTo(44, 0); F.lineTo(30, 10); F.lineTo(-36, 12); F.closePath(); F.fill(); F.fillStyle = '#9fdcff'; F.fillRect(-19, 14, 4, 6 + Math.random() * 3); F.fillRect(11, 14, 4, 6 + Math.random() * 3); F.restore(); }
  }, on(l, i, S) { if (i === lines.length - 1) S.leave = S.T + 1.2; } }];
}
function buildOscarEnd(st) {
  const shots = [];
  shots.push({ style: 0, floor: 400, lines: st.down, draw(B, F, t, li, lt, S) { stageSaloon(B, t); drawRig(F, 480, 470, -1, CS * 1.25, OSCAR, POSES.kneel(t), t, { shout: true }); S.anchor.OSC = [480, 470 - 150];
    S.anchor.A = hero(F, 'A', 260, 470, 1, POSES.guard(t, 1), t); S.anchor.B = hero(F, 'B', 700, 476, -1, POSES.guard(t, 2), t); } });
  // the film: a card, then its little scene
  const scenes = [
    (F, t) => { limb(F, [[300, 430], [560, 430]], 6, '#6a4a2a'); limb(F, [[320, 430], [320, 470]], 4, '#4a2a16'); limb(F, [[540, 430], [540, 470]], 4, '#4a2a16'); drawRig(F, 430, 470, 1, CS, KIDOSCAR, POSES.kneel(t), t, {}); for (let k = 0; k < 3; k++) { F.fillStyle = '#5a4a3a'; F.beginPath(); F.ellipse(200 + k * 260 + Math.sin(t) * 10, 200 + k * 30, 30, 8, 0, 0, 7); F.fill(); } },
    (F, t) => { drawRig(F, 380, 470, 1, CS * .95, KIDOSCAR, POSES.idle(t, 1), t, {}); for (let k = 0; k < 3; k++) drawRig(F, 520 + k * 70, 470, -1, CS, makeGoonLook('trooper', 300 + k), k === 1 ? POSES.laugh(t) : POSES.chat(t + k), t, {}); },
    (F, t) => { const ph = (t * 1.6) % 1; drawRig(F, 420, 470, 1, CS * 1.15, OSCAR, ph < .5 ? POSES.jab(ph * 2) : POSES.cross((ph - .5) * 2), t, {}); const q = POSES.hurt(ph, 2); drawRig(F, 520 + ph * 20, 470, -1, CS, makeGoonLook('trooper', 330), q, t, {}); drawRig(F, 640, 470, -1, CS, makeGoonLook('trooper', 331), POSES.cheer(t), t, {}); },
    (F, t) => { drawRig(F, 450, 470, 1, CS * 1.15, OSCAR, POSES.cower(t), t, {}); drawRig(F, 300, 470, 1, CS, POLICE[0], POSES.point(t), t, {}); drawRig(F, 610, 470, -1, CS, POLICE[1], POSES.point(t), t, {}); },
    (F, t) => { drawRig(F, 380, 470, 1, CS * 1.15, OSCAR, POSES.kneel(t), t, {}); for (let k = 0; k < 9; k++) limb(F, [[260 + k * 30, 180], [260 + k * 30, 480]], 4, '#3a3a3a'); drawRig(F, 640, 470, -1, CS * 1.05, VILLEN, POSES.chat(t), t, { cane: true }); },
    (F, t) => { drawRig(F, 400, 470, 1, CS * 1.15, OSCAR, POSES.cheer(t * .5), t, {}); drawRig(F, 560, 470, -1, CS * 1.05, VILLEN, POSES.point(t), t, { cane: true }); }
  ];
  st.film.forEach((card, k) => {
    shots.push({ style: 3, floor: -999, lines: [card], film: true, cardOnly: true, minDur: 0, draw(B, F, t) { B.fillStyle = '#0c0a08'; B.fillRect(0, 0, 960, 540); } });
    shots.push({ style: 3, floor: 400, lines: [], film: true, minDur: 2.2, draw(B, F, t) { B.fillStyle = '#d8d0c0'; B.fillRect(0, 0, 960, 400); B.fillStyle = '#a89a88'; B.fillRect(0, 400, 960, 140); for (let x = 0; x < 960; x += 80) { B.fillStyle = 'rgba(80,70,60,.4)'; B.fillRect(x, 120, 50, 280); } scenes[k](F, t); } });
  });
  shots.push({ style: 0, floor: 400, lines: st.after, draw(B, F, t, li, lt, S) { stageSaloon(B, t); const cur = st.after[li] || {}; drawRig(F, 480, 470, -1, CS * 1.25, OSCAR, cur.who === 'OSC' ? POSES.kneel(t) : POSES.kneel(t), t, { shout: cur.who === 'OSC' }); S.anchor.OSC = [480, 470 - 150];
    S.anchor.A = hero(F, 'A', 300, 470, 1, talkPose(t, cur.who, 'A', POSES.idle(t, 1)), t); S.anchor.B = hero(F, 'B', 680, 476, -1, talkPose(t, cur.who, 'B', POSES.idle(t, 2)), t); } });
  shots.push({ style: 0, floor: 400, lines: st.police, draw(B, F, t, li, lt, S) { stageSaloon(B, t); const cur = st.police[li] || {}, walk = Math.min(1, S.T / 1.6);
    const px = 1000 - walk * 380; drawRig(F, px, 470, -1, CS, POLICE[0], walk < 1 ? POSES.walk(t, 1) : cur.who === 'POL' ? POSES.chat(t) : POSES.idle(t, 3), t, { shout: cur.who === 'POL' }); drawRig(F, px + 80, 476, -1, CS, POLICE[1], walk < 1 ? POSES.walk(t + .3, 1) : POSES.salute(t), t, {}); S.anchor.POL = [px, 470 - 150];
    const stand = li >= 1; drawRig(F, 480, 470, -1, CS * 1.25, OSCAR, stand ? (cur.who === 'OSC' ? POSES.chat(t) : POSES.idle(t, 2)) : POSES.kneel(t), t, { shout: cur.who === 'OSC' }); S.anchor.OSC = [480, 470 - (stand ? 200 : 150)];
    if (li >= 1) gearShape(F, li >= 2 ? 330 : 440, li >= 2 ? 400 : 380, 7, t, '#ffd86a', .8);
    S.anchor.A = hero(F, 'A', 300, 470, 1, talkPose(t, cur.who, 'A', POSES.idle(t, 1)), t); S.anchor.B = hero(F, 'B', 200, 480, 1, talkPose(t, cur.who, 'B', POSES.idle(t, 2)), t); } });
  shots.push({ style: 0, floor: 380, lines: st.end, minDur: 3, draw(B, F, t) { stageSoifPort(B, t); gearShape(F, 480, 300, 40 + Math.sin(t * 2) * 3, t * .5, '#ffd86a', .8); } });
  return shots;
}
