// =====================================================================
// PAUSE — a controller drawn on screen, with arrows to what each button does.
// (Replaces the controls text that used to sit under the game.)
// =====================================================================
// ---- the settings, on the right of the pause screen: up/down to choose, left/right to change ----
const PMENU = { sel: 0, pz: 0, px: 0 };
const PITEMS = [
  { k: 'music', l: ['Musique', 'Music'], v: () => bar10(AUD.music), adj: d => { AUD.music = clampV(AUD.music + d * .1); saveAud(); } },
  { k: 'sfx', l: ['Effets', 'Sound effects'], v: () => bar10(AUD.sfx), adj: d => { AUD.sfx = clampV(AUD.sfx + d * .1); saveAud(); SND.hit(.5); } },
  { k: 'mute', l: ['Son', 'Sound'], v: () => AUD.mute ? (LANG === 'fr' ? 'coupé' : 'off') : (LANG === 'fr' ? 'activé' : 'on'), adj: () => { AUD.mute = !AUD.mute; saveAud(); } },
  { k: 'rumble', l: ['Vibration', 'Rumble'], v: () => ({ strong: ['forte', 'strong'], light: ['légère', 'light'], off: ['non', 'off'] })[AUD.rumble][LANG === 'en' ? 1 : 0], adj: d => { const o = ['strong', 'light', 'off'], i = (o.indexOf(AUD.rumble) + (d || 1) + 3) % 3; AUD.rumble = o[i]; saveAud(); if (AUD.rumble !== 'off') rum(0, [[0, .6, .6, 160]], 9); } },
  { k: 'dim', l: ['Décor', 'Backdrop'], v: () => Math.round(DIM * 100) + ' %', adj: d => { DIM = Math.max(.5, Math.min(1, Math.round((DIM + d * .125) * 1000) / 1000)); try { localStorage.setItem('bp-dim', DIM); } catch (e) {} } },
  { k: 'lang', l: ['Langue', 'Language'], v: () => LANG === 'fr' ? 'Français' : 'English', adj: () => toggleLang() }
];
const clampV = v => Math.max(0, Math.min(1, Math.round(v * 10) / 10)), bar10 = v => '▮'.repeat(Math.round(v * 10)) + '▯'.repeat(10 - Math.round(v * 10));
function pauseMenuInput(inp) { const zE = Math.abs(inp.z) > .5 ? Math.sign(inp.z) : 0, xE = inp.tap || (Math.abs(inp.x) > .5 ? Math.sign(inp.x) : 0);
  if (zE && zE !== PMENU.pz) { PMENU.sel = (PMENU.sel + zE + PITEMS.length) % PITEMS.length; beep(520, .04, 'square', .03); }
  const xNow = Math.abs(inp.x) > .5 ? Math.sign(inp.x) : 0; if (xNow && xNow !== PMENU.px || inp.tap && !xNow) PITEMS[PMENU.sel].adj(xNow || inp.tap);
  if (inp.a || inp.j) PITEMS[PMENU.sel].adj(1);
  PMENU.pz = zE; PMENU.px = xNow; }
function drawPauseMenu(ox, oy, u) { const X = v => ox + v * u, Y = v => oy + v * u, fr = LANG === 'fr';
  out.fillStyle = 'rgba(30,20,48,.85)'; out.fillRect(X(458), Y(64), 172 * u, 188 * u); out.strokeStyle = '#ffd23f'; out.lineWidth = 1.5 * u; out.strokeRect(X(458), Y(64), 172 * u, 188 * u);
  txt(fr ? 'RÉGLAGES' : 'SETTINGS', X(544), Y(70), 9 * u, '#ffd23f', 'center');
  PITEMS.forEach((it, i) => { const y = 92 + i * 25, on = i === PMENU.sel; if (on) { out.fillStyle = 'rgba(255,210,63,.18)'; out.fillRect(X(462), Y(y - 4), 164 * u, 21 * u); }
    txt(it.l[fr ? 0 : 1], X(468), Y(y), 7 * u, on ? '#fff' : '#c8bce0'); txt((on ? '◀ ' : '') + it.v() + (on ? ' ▶' : ''), X(622), Y(y + 8), 6.5 * u, on ? '#ffd23f' : '#9a8eb8', 'right'); });
  txt(fr ? '▲▼ choisir · ◀▶ régler' : '▲▼ choose · ◀▶ adjust', X(544), Y(240), 5.5 * u, '#8a7ea8', 'center'); }
function drawPauseControls(ox, oy, u) {
  out.fillStyle = 'rgba(10,7,16,.78)'; out.fillRect(ox, oy, VW * u, VH * u);
  txt(T[LANG].paused, ox + 320 * u, oy + 18 * u, 22 * u, '#fff', 'center');
  drawPauseMenu(ox, oy, u);
  drawPadMap(ox - 30 * u, oy + 26 * u, u * .8, u);
}
function drawPadMap(ox, oy, u, u0) {
  const fr = LANG !== 'en', X = v => ox + v * u, Y = v => oy + v * u, K = '#0a0710';
  out.save(); out.lineJoin = 'round';
  // body: outline every piece thick, then fill, so it reads as one shape
  const shapes = [() => out.roundRect(X(205), Y(145), 230 * u, 74 * u, 32 * u), () => out.ellipse(X(242), Y(222), 30 * u, 46 * u, -.38, 0, 7), () => out.ellipse(X(398), Y(222), 30 * u, 46 * u, .38, 0, 7)];
  const shoulders = [[226, 120, 46, 14, 'L2'], [222, 133, 54, 13, 'L1'], [368, 120, 46, 14, 'R2'], [364, 133, 54, 13, 'R1']];
  out.fillStyle = '#4a4458'; out.strokeStyle = K; out.lineWidth = 3 * u;
  for (const [x, y, w, h] of shoulders) { out.beginPath(); out.roundRect(X(x), Y(y), w * u, h * u, 5 * u); out.fill(); out.stroke(); }
  out.lineWidth = 6 * u; for (const s of shapes) { out.beginPath(); s(); out.stroke(); }
  out.fillStyle = '#e8e0d0'; for (const s of shapes) { out.beginPath(); s(); out.fill(); }
  for (const [x, y, w, h, n] of shoulders) txt(n, X(x + w / 2), Y(y + 2), 7 * u, '#fff', 'center', false);
  // d-pad
  out.fillStyle = '#3a3448'; out.fillRect(X(244), Y(160), 12 * u, 34 * u); out.fillRect(X(233), Y(171), 34 * u, 12 * u);
  // face buttons: triangle, circle, cross, square
  const face = [[390, 160, '#4ab890', '△'], [405, 175, '#e8505a', '○'], [390, 190, '#4a8ae8', '✕'], [375, 175, '#e87ab8', '□']];
  for (const [x, y, c, s] of face) { out.beginPath(); out.arc(X(x), Y(y), 7.5 * u, 0, 7); out.fillStyle = '#2a2436'; out.fill(); txt(s, X(x), Y(y - 5.5), 9 * u, c, 'center', false); }
  // sticks, select, start
  for (const x of [288, 352]) { out.beginPath(); out.arc(X(x), Y(204), 12 * u, 0, 7); out.fillStyle = '#2a2436'; out.fill(); out.beginPath(); out.arc(X(x), Y(204), 8 * u, 0, 7); out.fillStyle = '#4a4458'; out.fill(); }
  out.fillStyle = '#5a5468'; out.beginPath(); out.roundRect(X(290), Y(157), 14 * u, 6 * u, 3 * u); out.fill(); out.beginPath(); out.roundRect(X(336), Y(157), 14 * u, 6 * u, 3 * u); out.fill();
  // arrows: [from x,y] → [label x,y], label, sub-label, solo-only
  const L = (f, e) => fr ? f : e, solo = CPU;
  const marks = [
    [[250, 160], [150, 172], L('Bouger', 'Move'), L('2× ▶ charge · 2× ◀ esquive', '2× ▶ charge · 2× ◀ dodge')],
    [[234, 121], [150, 92], L('L2 · Tiens bon !', 'L2 · Hold here!'), L('ordre au partenaire', 'partner order'), 1],
    [[226, 139], [150, 128], L('L1 · À moi !', 'L1 · To me!'), L('ordre au partenaire', 'partner order'), 1],
    [[297, 157], [262, 72], L('Changer', 'Switch'), ''],
    [[343, 157], [378, 72], 'Pause', ''],
    [[406, 121], [490, 92], L('R2 · Libre !', 'R2 · Free!'), L('ordre au partenaire', 'partner order'), 1],
    [[414, 139], [490, 122], L('R1 · Fonce !', 'R1 · Charge!'), L('ordre au partenaire', 'partner order'), 1],
    [[375, 168], [490, 150], L('Frapper', 'Attack'), L('3 coups de suite : combo', '3 in a row: combo'), 0, [375, 152]],
    [[412, 175], [490, 180], L('Spécial', 'Special'), L('quand la jauge est pleine', 'when the meter is full')],
    [[397, 192], [490, 212], L('Sauter', 'Jump'), '']
  ];
  for (const [a, b, t1, t2, so, via] of marks) {
    const dim = so && !solo, col = dim ? '#6a5e88' : '#ffd23f', right = b[0] > 320;
    out.strokeStyle = col; out.lineWidth = 1.6 * u; out.beginPath(); out.moveTo(X(b[0] + (right ? -4 : 4)), Y(b[1] + 5)); if (via) out.lineTo(X(via[0]), Y(via[1])); out.lineTo(X(a[0]), Y(a[1])); out.stroke();
    out.fillStyle = col; out.beginPath(); out.arc(X(a[0]), Y(a[1]), 2.4 * u, 0, 7); out.fill();
    const al = b[0] === 262 || b[0] === 378 ? 'center' : right ? 'left' : 'right', bx = al === 'center' ? b[0] : b[0];
    txt(t1, X(bx), Y(b[1] - (al === 'center' ? 12 : 0)), 9 * u, dim ? '#8a7ea8' : '#fff', al);
    if (t2) txt(t2, X(bx), Y(b[1] + 10), 5.5 * u, dim ? '#6a5e88' : '#c8bce0', al);
  }
  out.restore();
  ox = ox + 30 * u0; oy = oy - 26 * u0; u = u0;
  txt(L('Clavier — J1 : W A S D · Espace saute · F frappe · G spécial · Q change · 1 2 3 4 ordres    J2 : flèches · Maj droite · K · L · P', 'Keyboard — P1: W A S D · Space jump · F attack · G special · Q switch · 1 2 3 4 orders    P2: arrows · Right Shift · K · L · P'), X(320), Y(298), 6 * u, '#b8acd0', 'center');
  txt(L('Échap / Start : reprendre   ·   Entrée : passer un dialogue', 'Esc / Start: resume   ·   Enter: skip a line'), X(320), Y(318), 7 * u, '#fff', 'center');
  if (!solo) txt(L('Les ordres (L1 R1 L2 R2) servent quand l’ordinateur joue ton partenaire.', 'Orders (L1 R1 L2 R2) work when the computer plays your partner.'), X(320), Y(336), 5.5 * u, '#8a7ea8', 'center');
}
