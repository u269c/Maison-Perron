// =====================================================================
// CUTSCENES, WORLD 3 — Villen-Hüüs in Calve-Hair's chair; Calve-Hair's defeat, his story as a silent film, the
// police, and a shave in prison.
// =====================================================================
const SITP = (t = 0) => PZ({ ry: 10, sp: -.05, nk: Math.sin(t * .8) * .05, aF: [.55, 1.2], aB: [.45, 1.2], lF: [1.55, -1.55], lB: [1.45, -1.5] });
const CALVE_BALD = (() => { const L = calveLook(); L.behind = null; const h = L.head; L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr; c.fillStyle = OUT; c.beginPath(); c.ellipse(x + R * .1, y, R * .92 + INKW, R * 1.1 + INKW, -.1, 0, 7); c.fill(); c.fillStyle = L.skin; c.beginPath(); c.ellipse(x + R * .1, y, R * .92, R * 1.1, -.1, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(x - R * .2, y - R * .7, R * .35, R * .15, -.3, 0, 7); c.fill(); poly(c, [[x + R * .85, y - R * .15], [x + R * 1.45, y + R * .35], [x + R * .9, y + R * .45]], L.skin); c.fillStyle = '#140c08'; c.fillRect(x + R * .55, y - R * .25, 1.6, 1.4);
  c.fillStyle = '#2a140c'; c.beginPath(); c.moveTo(x + R * .55, y + R * .55); c.quadraticCurveTo(x + R * .95, y + R * .45, x + R * 1.2, y + R * .7); c.quadraticCurveTo(x + R * .95, y + R * .6, x + R * .55, y + R * .62); c.fill(); if (o.shout) { c.fillStyle = '#3a0c10'; c.fillRect(x + R * .6, y + R * .72, R * .45, R * .3); } }; return L; })();
const BARBER = (() => { const L = badgerLook(41); L.top = '#f4f0e8'; L.arms = '#f4f0e8'; return L; })();
function stageSalonCut(B, t) {
  B.fillStyle = '#f4c8d8'; B.fillRect(0, 0, 960, 400); for (let x = 0; x < 960; x += 40) { B.fillStyle = '#ecb8cc'; B.fillRect(x, 0, 4, 400); }
  for (let x = 60; x < 900; x += 220) { lr(B, x, 90, 150, 180, '#c8963a'); lr(B, x + 8, 98, 134, 164, '#d8ecf4'); for (let k = 0; k < 9; k++) { B.fillStyle = '#fff6c8'; B.strokeStyle = LCI; B.beginPath(); B.arc(x + 8 + k * 17, 84, 5, 0, 7); B.fill(); B.stroke(); } }
  B.fillStyle = '#c8963a'; B.fillRect(0, 0, 960, 20); for (let y = 400; y < 540; y += 28) for (let x = (y / 28 % 2) * 28; x < 960; x += 56) { B.fillStyle = '#1a1a22'; B.fillRect(x, y, 28, 28); } B.fillStyle = '#f4f0e8'; for (let y = 400; y < 540; y += 28) for (let x = ((y / 28 + 1) % 2) * 28; x < 960; x += 56) B.fillRect(x, y, 28, 28); }
function stagePrison(B, t) { B.fillStyle = '#8a8a90'; B.fillRect(0, 0, 960, 400); for (let y = 0; y < 400; y += 30) for (let x = (y / 30 % 2) * 40; x < 960; x += 80) { B.strokeStyle = '#6a6a72'; B.strokeRect(x, y, 80, 30); } B.fillStyle = '#5a5a62'; B.fillRect(0, 400, 960, 140);
  lr(B, 700, 80, 120, 80, '#3a3a42'); for (let k = 0; k < 6; k++) lr(B, 704 + k * 20, 84, 4, 72, '#8a8a92'); }   // the barred window
function barberChair(F, x, y, s = 1) { lr(F, x - 6 * s, y - 50 * s, 12 * s, 50 * s, '#c8c8d0'); lr(F, x - 40 * s, y - 70 * s, 80 * s, 20 * s, '#c8203a'); lr(F, x - 40 * s, y - 150 * s, 18 * s, 82 * s, '#c8203a'); lr(F, x - 50 * s, y - 6 * s, 100 * s, 8 * s, '#8a8a92'); }
function buildBouldIntro(st) { const lines = st.intro;
  return [{ style: 1, floor: 400, lines, draw(B, F, t, li, lt, S) { stageSalonCut(B, t); const cur = lines[li] || {}; const leave = S.leave !== undefined ? S.T - S.leave : -1;
    if (leave < 1.4) { const vx = leave > 0 ? 470 + leave * 360 : 470; barberChair(F, 470, 470); drawRig(F, vx, 470, leave > 0 ? 1 : -1, CS * 1.05, VILLEN, leave > 0 ? POSES.walk(t, 1.4) : SITP(t), t, { shout: cur.who === 'VH', gear: li < 2, cane: li >= 2 }); S.anchor.VH = [vx, 470 - 180];
      if (leave <= 0) { F.fillStyle = 'rgba(244,240,232,.9)'; F.strokeStyle = LCI; F.beginPath(); F.moveTo(vx - 24, 470 - 70); F.lineTo(vx + 24, 470 - 70); F.lineTo(vx + 38, 470 - 26); F.lineTo(vx - 36, 470 - 26); F.closePath(); F.fill(); F.stroke(); } }   // the salon gown, a bib
    const cp = cur.who === 'CAL' ? PZ({ ry: 1, sp: .15, nk: .1, aF: [1.8 + Math.sin(t * 12) * .25, .9], aB: [1.6, 1.0], lF: [.3, -.1], lB: [-.2, -.05] }) : POSES.idle(t, 2);
    drawRig(F, 300, 470, 1, CS * 1.1, CALVE, cp, t, { shout: cur.who === 'CAL', snip: cur.who === 'CAL', hs: Math.sin(t * .9) * .2, hy: 0 }); S.anchor.CAL = [300, 470 - 230];
    if (leave < 1.4) { const mx = 760 + Math.max(0, leave) * 300; drawRig(F, mx, 470, leave > 0 ? 1 : -1, CS, MADAME, cur.who === 'MMF' ? POSES.check(t) : POSES.idle(t, 7), t, {}); S.anchor.MMF = [mx, 470 - 90]; }
    if (li >= 2) gearShape(F, 330, 470 - 120, 6, t, '#ffd86a', .6);
  }, on(l, i, S) { if (i === lines.length - 1) S.leave = S.T + 1.2; } }]; }
// Calve-Hair's story plays as a silent film, in two halves: Madame Metal Face walks into it halfway (level 3½ follows).
function calveScenes() {
  const client = makeGoonLook('trooper', 512); client.helm = 'cap';
  return [
    (F, t) => { barberChair(F, 520, 470, .9); drawRig(F, 520, 470, -1, CS, client, SITP(t), t, {}); drawRig(F, 380, 470, 1, CS * 1.05, CALVE, PZ({ ry: 1, sp: .15, aF: [1.8 + Math.sin(t * 12) * .25, .9], aB: [1.6, 1.0] }), t, { snip: true }); for (let k = 0; k < 4; k++) { F.fillStyle = '#fffbe0'; F.fillRect(470 + Math.sin(t * 3 + k) * 60, 260 + k * 20, 3, 3); } },
    (F, t) => { drawRig(F, 480, 470, 1, CS * 1.05, CALVE, POSES.flex(t), t, {}); for (let k = 0; k < 4; k++) { const fl = Math.sin(t * 9 + k * 2) > .6; drawRig(F, 200 + k * 60 + (k > 1 ? 340 : 0), 470, k > 1 ? -1 : 1, CS * .9, makeGoonLook('trooper', 520 + k), POSES.point(t + k), t, {}); if (fl) { F.fillStyle = '#ffffff'; F.beginPath(); F.arc(210 + k * 60 + (k > 1 ? 330 : 0), 300, 12, 0, 7); F.fill(); } } },
    (F, t) => { lr(F, 160, 420, 640, 20, '#d8d0c0'); for (let k = 0; k < 3; k++) { const L = makeGoonLook('trooper', 540 + k); L.helm = 'visorup'; L.skin = '#e0b090'; drawRig(F, 220 + ((t * 60 + k * 200) % 520), 420, 1, CS * .9, L, POSES.walk(t + k, .8), t, {}); } drawRig(F, 860, 470, -1, CS, CALVE, POSES.cower(t), t, {}); },
    (F, t) => { for (let k = 0; k < 3; k++) barberChair(F, 220 + k * 200, 470, .8); drawRig(F, 760, 470, -1, CS, CALVE, POSES.walk(t * .3, .4), t, {}); limb(F, [[700, 470], [740, 380]], 3, '#6a4426'); },
    (F, t) => { lr(F, 520, 230, 160, 200, '#c8963a'); lr(F, 530, 240, 140, 180, '#b8c8d0'); drawRig(F, 420, 470, 1, CS * 1.05, CALVE, POSES.kneel(t), t, {}); for (let k = 0; k < 3; k++) { F.fillStyle = '#9ac8e8'; F.beginPath(); F.arc(470 + k * 4, 300 + ((t * 80 + k * 30) % 90), 3, 0, 7); F.fill(); } },
    (F, t) => { drawRig(F, 400, 470, 1, CS * 1.05, CALVE, POSES.cheer(t * .5), t, {}); drawRig(F, 580, 470, -1, CS * 1.05, VILLEN, POSES.point(t), t, { cane: true }); }
  ];
}
function pushFilm(shots, st, k, scenes) {
  shots.push({ style: 3, floor: -999, lines: [st.film[k]], film: true, cardOnly: true, minDur: 0, draw(B, F, t) { B.fillStyle = '#0c0a08'; B.fillRect(0, 0, 960, 540); } });
  shots.push({ style: 3, floor: 400, lines: [], film: true, minDur: 2.2, draw(B, F, t) { filmStage(B); scenes[k](F, t); } }); }
function filmStage(B) { B.fillStyle = '#d8d0c0'; B.fillRect(0, 0, 960, 400); B.fillStyle = '#a89a88'; B.fillRect(0, 400, 960, 140); for (let x = 0; x < 960; x += 80) { B.fillStyle = 'rgba(80,70,60,.4)'; B.fillRect(x, 120, 50, 280); } }
// part one: he kneels, the police come for the gear, the film starts… and she walks into it
function buildCalveEnd(st) { const shots = [], scenes = calveScenes();
  shots.push({ style: 1, floor: 400, lines: st.down, draw(B, F, t, li, lt, S) { stageSalonCut(B, t); drawRig(F, 480, 470, -1, CS * 1.15, CALVE, POSES.kneel(t), t, { flat: true }); S.anchor.CAL = [480, 470 - 170];
    S.anchor.A = hero(F, 'A', 260, 470, 1, POSES.guard(t, 1), t); S.anchor.B = hero(F, 'B', 720, 476, -1, POSES.guard(t, 2), t); } });
  shots.push({ style: 1, floor: 400, lines: st.handover, draw(B, F, t, li, lt, S) { stageSalonCut(B, t); const cur = st.handover[li] || {}, walk = Math.min(1, S.T / 1.6), px = 1000 - walk * 300;
    drawRig(F, px, 470, -1, CS, POLICE[0], walk < 1 ? POSES.walk(t, 1) : cur.who === 'POL' ? POSES.chat(t) : POSES.idle(t, 3), t, { shout: cur.who === 'POL' }); drawRig(F, px + 80, 476, -1, CS, POLICE[1], walk < 1 ? POSES.walk(t + .3, 1) : POSES.salute(t), t, {}); S.anchor.POL = [px, 470 - 170];
    drawRig(F, 480, 470, -1, CS * 1.15, CALVE, li >= 1 && li < 2 ? PZ({ ry: 9, sp: .45, nk: .3, aF: [1.6, .3], aB: [-.2, .6], lF: [1.4, -1.6], lB: [-.6, -2.3] }) : POSES.kneel(t), t, { flat: true, shout: cur.who === 'CAL' }); S.anchor.CAL = [480, 470 - 170];
    if (li >= 1) gearShape(F, li >= 2 ? px - 24 : 540, li >= 2 ? 360 : 340, 8, t, '#ffd86a', .8);
    S.anchor.A = hero(F, 'A', 260, 470, 1, talkPose(t, cur.who, 'A', POSES.idle(t, 1)), t); S.anchor.B = hero(F, 'B', 170, 480, 1, talkPose(t, cur.who, 'B', POSES.idle(t, 2)), t); } });
  for (let k = 0; k < 3; k++) pushFilm(shots, st, k, scenes);
  shots.push({ style: 3, floor: -999, lines: [{ who: 'NAR', card: true, fr: 'Et puis…', en: 'And then…' }], film: true, cardOnly: true, minDur: 0, draw(B) { B.fillStyle = '#0c0a08'; B.fillRect(0, 0, 960, 540); } });
  shots.push({ style: 3, floor: 400, lines: st.intrude, film: true, minDur: 3.4, draw(B, F, t, li, lt, S) { filmStage(B); scenes[3](F, t); const u = Math.min(1, S.T / 1.8), mx = 1000 - u * 470;   // a tiny figure with glasses walks into the old film
    drawRig(F, mx, 470, -1, CS * 1.05, MADAME, u < 1 ? POSES.walk(t, 1.2) : POSES.check(t), t, {}); S.anchor.MMF = [mx, 470 - 100]; } });
  shots.push(...buildTheft(st));
  return shots; }
// she steps out of the film into colour, takes the gear with a form in triplicate, and runs for the cranes
function buildTheft(st) { const shots = [], scenes = calveScenes();
  shots.push({ style: 1, floor: 400, lines: st.theft, draw(B, F, t, li, lt, S) { stageSalonCut(B, t); const cur = st.theft[li] || {};
    lr(B, 300, 100, 360, 230, '#3a3430'); B.save(); B.beginPath(); B.rect(306, 106, 348, 218); B.clip(); B.filter = 'grayscale(1) sepia(.35)'; B.translate(306, 106); B.scale(348 / 960, 218 / 540); filmStage(B); scenes[3](B, t); B.restore(); B.filter = 'none';   // the film, still running on the wall
    B.fillStyle = 'rgba(255,250,230,.12)'; B.beginPath(); B.moveTo(306, 106); B.lineTo(654, 106); B.lineTo(960, 0); B.lineTo(0, 0); B.fill();
    const u = Math.min(1, S.T / 1.4), run = li >= 5 ? (li > 5 ? 1 : Math.min(1, lt / .9)) : 0, mx = 480 + u * 120 + run * 520, my = 300 + u * 170, ms = CS * (.6 + u * .45);
    const pose = run > 0 ? POSES.run(t, 1.4) : u < 1 ? POSES.walk(t, 1) : cur.who === 'MMF' ? POSES.check(t) : POSES.idle(t, 7), dm = c => drawRig(c, mx, my, run > 0 ? 1 : -1, ms, MADAME, pose, t, { smile: li === 5 });
    F.save(); F.beginPath(); F.rect(306, 106, 348, 218); F.clip(); F.filter = 'grayscale(1) sepia(.35)'; dm(F); F.restore(); F.filter = 'none';
    F.save(); F.beginPath(); F.rect(0, 0, 960, 540); F.rect(306, 106, 348, 218); F.clip('evenodd'); dm(F); F.restore(); S.anchor.MMF = [mx, my - 100];
    drawRig(F, 760, 470, -1, CS, POLICE[0], cur.who === 'POL' ? POSES.chat(t) : li === 1 ? POSES.check(t) : POSES.idle(t, 3), t, { shout: cur.who === 'POL' }); drawRig(F, 840, 476, -1, CS, POLICE[1], POSES.idle(t, 5), t, {}); S.anchor.POL = [760, 470 - 170];
    if (li < 2) gearShape(F, 736, 360, 8, t, '#ffd86a', .8); else if (run < 1) gearShape(F, mx + (run > 0 ? 14 : -14), my - 60, 8, t, '#ffd86a', .8);
    if (li === 1) { lr(F, 712, 352, 22, 28, '#f4f0e8'); for (let k = 0; k < 3; k++) { F.fillStyle = ['#ffffff', '#f8e8a0', '#f8c0d0'][k]; F.fillRect(716 + k * 2, 356 + k * 2, 14, 18); } }   // the forms, in triplicate
    drawRig(F, 380, 470, -1, CS * 1.15, CALVE, POSES.kneel(t), t, { flat: true, shout: cur.who === 'CAL' }); S.anchor.CAL = [380, 470 - 170];
    S.anchor.A = hero(F, 'A', 230, 470, 1, cur.who === 'A' && li >= 7 ? POSES.point(t) : talkPose(t, cur.who, 'A', POSES.idle(t, 1)), t); S.anchor.B = hero(F, 'B', 130, 480, 1, talkPose(t, cur.who, 'B', POSES.idle(t, 2)), t); } });
  shots.push({ style: 1, floor: 430, lines: st.chase, minDur: 3, draw(B, F, t, li, lt, S) { sky(B, '#5aa6e8', '#a8d4f0', '#f0e8dc', 430); B.fillStyle = '#d8ccb8'; B.fillRect(0, 430, 960, 110);
    for (let x = 0; x < 960; x += 120) lr(B, x, 330, 100, 100, '#f4c8d8'); lr(B, 0, 320, 960, 12, '#c8963a');
    const mx0 = 790; B.fillStyle = '#e8b830'; B.fillRect(mx0 - 40, 0, 12, 430); B.fillRect(mx0 + 40, 0, 12, 430); B.strokeStyle = LCI; B.lineWidth = 1.5; B.strokeRect(mx0 - 40, -2, 12, 432); B.strokeRect(mx0 + 40, -2, 12, 432); for (let y = 10; y < 430; y += 40) { B.beginPath(); B.moveTo(mx0 - 28, y); B.lineTo(mx0 + 40, y + 40); B.stroke(); B.beginPath(); B.moveTo(mx0 - 28, y); B.lineTo(mx0 + 40, y); B.stroke(); }
    const u = Math.min(1, S.T / 1.3), mx = 200 + u * (mx0 - 200), my = 470 - Math.max(0, S.T - 1.3) * 260;
    drawRig(F, mx, my, 1, CS, MADAME, u < 1 ? POSES.run(t, 1.5) : CLIMBP(t * 14), t, {}); gearShape(F, mx + 10, my - 64, 6, t, '#ffd86a', .6);
    const hx = Math.min(640, 40 + S.T * 300); hero(F, 'A', hx, 470, 1, POSES.run(t, 1.3), t); hero(F, 'B', hx - 90, 476, 1, POSES.run(t + .2, 1.3), t); } });
  return shots; }
// part two, after level 3½: back down in the salon, the film picks up where it stopped; the gear is gone
function buildTourEnd(st) { const shots = [], scenes = calveScenes();
  shots.push({ style: 1, floor: 400, lines: st.back, draw(B, F, t, li, lt, S) { stageSalonCut(B, t); const cur = st.back[li] || {};
    drawRig(F, 480, 470, -1, CS * 1.15, CALVE, POSES.kneel(t), t, { flat: true, shout: cur.who === 'CAL' }); S.anchor.CAL = [480, 470 - 170];
    drawRig(F, 720, 470, -1, CS, POLICE[0], cur.who === 'POL' ? POSES.chat(t) : POSES.idle(t, 3), t, { shout: cur.who === 'POL' }); S.anchor.POL = [720, 470 - 170]; lr(F, 690, 360, 18, 24, '#f4f0e8');
    S.anchor.A = hero(F, 'A', 280, 470, 1, talkPose(t, cur.who, 'A', POSES.idle(t * 2.5, 1)), t); S.anchor.B = hero(F, 'B', 180, 480, 1, talkPose(t, cur.who, 'B', POSES.idle(t * 2.5, 2)), t); } });
  for (let k = 3; k < 6; k++) pushFilm(shots, st, k, scenes);
  shots.push({ style: 1, floor: 400, lines: st.after, draw(B, F, t, li, lt, S) { stageSalonCut(B, t); const cur = st.after[li] || {}; drawRig(F, 480, 470, -1, CS * 1.15, CALVE, POSES.kneel(t), t, { flat: li === 0, shout: cur.who === 'CAL' }); S.anchor.CAL = [480, 470 - 170];
    S.anchor.A = hero(F, 'A', 300, 470, 1, talkPose(t, cur.who, 'A', POSES.idle(t, 1)), t); S.anchor.B = hero(F, 'B', 680, 476, -1, talkPose(t, cur.who, 'B', POSES.idle(t, 2)), t); } });
  shots.push({ style: 1, floor: 400, lines: st.police2, draw(B, F, t, li, lt, S) { stageSalonCut(B, t); const cur = st.police2[li] || {};
    drawRig(F, 620, 470, -1, CS, POLICE[0], cur.who === 'POL' ? POSES.chat(t) : POSES.idle(t, 3), t, { shout: cur.who === 'POL' }); drawRig(F, 700, 476, -1, CS, POLICE[1], POSES.salute(t), t, {}); S.anchor.POL = [620, 470 - 170];
    drawRig(F, 480, 470, -1, CS * 1.15, CALVE, cur.who === 'CAL' ? POSES.chat(t) : POSES.idle(t, 2), t, { shout: cur.who === 'CAL' }); S.anchor.CAL = [480, 470 - 240];
    S.anchor.A = hero(F, 'A', 300, 470, 1, talkPose(t, cur.who, 'A', POSES.idle(t, 1)), t); S.anchor.B = hero(F, 'B', 200, 480, 1, talkPose(t, cur.who, 'B', POSES.idle(t, 2)), t); } });
  shots.push({ style: 1, floor: 400, lines: st.prison, minDur: 2, draw(B, F, t, li, lt, S) { stagePrison(B, t); const bald = li >= 3; barberChair(F, 480, 470);
    drawRig(F, 480, 470, -1, CS * 1.1, bald ? CALVE_BALD : CALVE, SITP(t), t, { shout: (st.prison[li] || {}).who === 'CAL', hs: 0, hy: 0 }); S.anchor.CAL = [470, 470 - 220];
    F.fillStyle = '#f4f0e8'; F.strokeStyle = LCI; F.beginPath(); F.moveTo(452, 470 - 72); F.lineTo(508, 470 - 72); F.lineTo(524, 470 - 24); F.lineTo(436, 470 - 24); F.closePath(); F.fill(); F.stroke();
    const bp = li >= 2 ? PZ({ ry: 1, sp: .2, aF: [2.0 + Math.sin(t * 10) * .3, .8], aB: [1.2, 1.0] }) : POSES.idle(t, 4); drawRig(F, 600, 470, -1, CS * 1.05, BARBER, bp, t, {}); S.anchor.BAD = [600, 470 - 150];
    if (li >= 2 && !bald) for (let k = 0; k < 6; k++) { F.strokeStyle = '#3a1a10'; F.lineWidth = 2; const y0 = 360 + ((t * 120 + k * 40) % 110); F.beginPath(); F.moveTo(470 + k * 6, y0); F.quadraticCurveTo(480 + k * 6, y0 + 8, 470 + k * 6, y0 + 16); F.stroke(); }
    if (bald) { F.fillStyle = '#ffffff'; for (let k = 0; k < 5; k++) { F.beginPath(); F.arc(430 + k * 20, 300 + Math.sin(t * 3 + k) * 6, 3, 0, 7); F.fill(); } } } });
  shots.push({ style: 1, floor: 380, lines: st.end2, minDur: 4, draw(B, F, t, li, lt, S) { sky(B, '#4a7ab8', '#e8a888', '#f4ead8', 380); B.fillStyle = '#e8dcc8'; B.fillRect(0, 380, 960, 160);
    F.save(); F.globalAlpha = .3; gearShape(F, 480, 300, 80, t * .2, '#c8c8c8', 0); F.restore(); F.fillStyle = OUT; F.font = 'bold 90px Georgia'; F.textAlign = 'center'; F.fillText('?', 480, 332); F.textAlign = 'left';
    const sx = 1060 - Math.min(S.T, 9) * 130; F.save(); F.translate(sx, 120); poly(F, [[-70, 0], [60, -6], [84, 4], [60, 14], [-60, 16]], '#3a2a4a'); F.strokeStyle = '#e8c040'; F.lineWidth = 2; F.beginPath(); F.moveTo(10, 14); F.lineTo(10, 80); F.stroke(); F.restore(); drawRig(F, sx + 10, 150, -1, CS * .7, MADAME, POSES.dropping(t), t, {}); } });
  return shots; }
