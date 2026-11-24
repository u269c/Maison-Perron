// =====================================================================
// PAUSE — a controller drawn on screen, with arrows to what each button does.
// (Replaces the controls text that used to sit under the game.)
// =====================================================================
function drawPauseControls(ox, oy, u) {
  const fr = LANG !== 'en', X = v => ox + v * u, Y = v => oy + v * u, K = '#0a0710';
  out.fillStyle = 'rgba(10,7,16,.78)'; out.fillRect(ox, oy, VW * u, VH * u);
  txt(T[LANG].paused, X(320), Y(18), 22 * u, '#fff', 'center');
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
    [[250, 160], [150, 172], L('Bouger', 'Move'), L('2× avant : charge · 2× arrière : esquive', '2× forward: charge · 2× back: dodge')],
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
  txt(L('Clavier — J1 : W A S D · Espace saute · F frappe · G spécial · Q change · 1 2 3 4 ordres    J2 : flèches · Maj droite · K · L · P', 'Keyboard — P1: W A S D · Space jump · F attack · G special · Q switch · 1 2 3 4 orders    P2: arrows · Right Shift · K · L · P'), X(320), Y(298), 6 * u, '#b8acd0', 'center');
  txt(L(`Échap / Start : reprendre   ·   Entrée : passer un dialogue   ·   B : décor ${Math.round(DIM * 100)} %   ·   V : vibration ${RUMBLE_ON ? 'oui' : 'non'}   ·   L : English`, `Esc / Start: resume   ·   Enter: skip a line   ·   B: backdrop ${Math.round(DIM * 100)} %   ·   V: rumble ${RUMBLE_ON ? 'on' : 'off'}   ·   L: Français`), X(320), Y(318), 7 * u, '#fff', 'center');
  if (!solo) txt(L('Les ordres (L1 R1 L2 R2) servent quand l’ordinateur joue ton partenaire.', 'Orders (L1 R1 L2 R2) work when the computer plays your partner.'), X(320), Y(336), 5.5 * u, '#8a7ea8', 'center');
}
