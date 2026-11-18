// ═══ ACT I: the Argolid road, Tiryns, Nemea ═══
// ── the lands ──
LANDS.argolid = { w: 2800, title: { fr: 'L’Argolide', en: 'The Argolid', el: 'Η Αργολίδα' }, music: 'argolid',
  ground: [[0, 214], [260, 220], [520, 226], [800, 222], [1100, 216], [1380, 220], [1620, 226], [1900, 218], [2200, 212], [2500, 216], [2800, 220]],
  plats: [{ x: 1040, w: 46, h: 16 }, { x: 1960, w: 60, h: 10, thin: true }],
  sky: (x, w, h, P) => { paintSky(x, w, h, ['#5c86c8', '#7aa2d6', '#a0c0e0', '#cad6e2', '#ecdcc0', '#f6e2b4'], 176); paintSun(x, 360, 44, 11, P.sun); },
  far: (x, w, h, P, r) => paintRange(x, r, w, 186, [[80, 50, 120], [260, 66, 150], [470, 44, 130], [640, 58, 140]], P, 84),
  mid: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 194, 26, '#8c9a66', P.hillL, P.hillD); for (let k = 10; k < w; k += 9 + r() * 12) { const gy = yAt(pts, k); if (r() < 0.6) paintOlive(x, r, k, gy + 3, 0.35 + r() * 0.15, P); else paintCypress(x, k, gy + 4, 9 + r() * 7, P); }
    // Tiryns on its rock, far off to the east
    const tx = w - 120, ty = yAt(pts, tx); poly(x, [[tx - 60, ty + 4], [tx - 40, ty - 14], [tx + 40, ty - 16], [tx + 64, ty + 4]], '#9a8a70'); rect(x, tx - 38, ty - 24, 76, 10, '#b8a888'); for (let k = 0; k < 8; k++) rect(x, tx - 36 + k * 10, ty - 28, 5, 4, '#b8a888'); },
  near: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 206, 14, '#7c9458', P.hillL, P.hillD, 3);
    for (let k = 0; k < w; k += 16 + r() * 10) { const gy = yAt(pts, k) + 5; if ((k / 300 | 0) % 3 === 1) { for (let j = 0; j < 3; j++) rect(x, k + j * 4, gy - 9 - r() * 3, 1.5, 9, '#d8b860'); } else if (r() < 0.55) paintOlive(x, r, k, gy, 0.55 + r() * 0.2, P); else if (r() < 0.3) paintCypress(x, k, gy, 26 + r() * 14, P); } },
  back: (x, w, h, P, r, L) => { const G = (px) => groundY(L, px);
    for (let k = 30; k < w; k += 70 + r() * 80) { if (Math.abs(k - 700) < 90 || Math.abs(k - 1500) < 70) continue; const q = r(); if (q < 0.5) paintOlive(x, r, k, G(k) + 2, 0.9 + r() * 0.5, P); else if (q < 0.7) paintCypress(x, k, G(k) + 2, 50 + r() * 26, P); else if (q < 0.85) paintRocks(x, r, k, G(k), 1.2 + r() * 0.6, P); else paintStoneWall(x, r, k, k + 60, G(k), 10, P); }
    paintStall(x, 700, G(700), P); paintWell(x, 1500, G(1500), P); paintPlane(x, r, 1440, G(1440), 1.3, P); paintShrine(x, 2350, G(2350), P); paintHerm(x, 300, G(300), P);
    paintGround(x, r, L, P, 0, w); },
  birds: true, eagles: true, butterflies: [[400, 200], [1200, 190], [2000, 196]], leaves: [], dust: true, smoke: [[2350, 182]] };
LANDS.tiryns = { w: 2000, title: { fr: 'Tirynthe', en: 'Tiryns', el: 'Τίρυνθα' }, music: 'tiryns',
  ground: [[0, 222], [300, 220], [700, 218], [1100, 216], [1500, 214], [1800, 216], [2000, 218]], plats: [],
  sky: (x, w, h, P) => { paintSky(x, w, h, ['#6088c4', '#80a6d4', '#a6c2de', '#d0d8e0', '#eedcc0', '#f4dcb0'], 176); paintSun(x, 300, 50, 10, P.sun); },
  far: (x, w, h, P, r) => paintRange(x, r, w, 182, [[120, 56, 140], [340, 48, 130], [520, 62, 150]], P, 80),
  mid: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 190, 20, '#8a9a6a', P.hillL, P.hillD); for (let k = 10; k < w; k += 12 + r() * 14) { const gy = yAt(pts, k); if (r() < 0.5) paintOlive(x, r, k, gy + 3, 0.35, P); else paintCypress(x, k, gy + 4, 10 + r() * 6, P); } },
  near: (x, w, h, P, r) => { // the upper citadel: walls and roofs above the lower town
    const base = 200; paintCyclopean(x, r, 0, w, base + 4, 46, P); for (let k = 40; k < w; k += 120 + r() * 80) paintHouse(x, r, k, base - 40, 40 + r() * 20, 30, P, { side: 6 }); },
  back: (x, w, h, P, r, L) => { const G = (px) => groundY(L, px);
    paintCyclopean(x, r, 0, 120, G(60), 70, P); paintLionGate(x, 190, G(190), P);
    for (const [hx, hw] of [[330, 70], [520, 60], [1080, 64], [1650, 70]]) paintHouse(x, r, hx, G(hx + hw / 2), hw, 52, P);
    paintStall(x, 760, G(760), P); paintAmphorae(x, 860, G(860), 4, P); paintHearth(x, 980, G(980), P);
    for (let k = 0; k < 6; k++) paintColumn(x, 1260 + k * 44, G(1260 + k * 44), 64, P); rect(x, 1240, G(1300) - 70, 240, 8, P.stoneL); poly(x, [[1236, G(1300) - 70], [1360, G(1300) - 96], [1484, G(1300) - 70]], P.stone);
    paintPithos(x, 1520, G(1520), 1.05, P, true); paintAmphorae(x, 1600, G(1600), 3, P);
    paintCyclopean(x, r, 1880, 2000, G(1940), 70, P); rect(x, 1930, G(1930) - 48, 30, 48, '#1c1612'); rect(x, 1926, G(1930) - 54, 38, 7, P.stoneL);
    paintGround(x, r, L, Object.assign({}, P, { grass: '#9a9a5c', grassL: '#b8b070' }), 0, w); },
  fires: [[980, 210, 1]], lights: [], birds: true, dust: true, smoke: [[980, 196]], butterflies: [] };
LANDS.nemea = { w: 3000, title: { fr: 'Némée', en: 'Nemea', el: 'Νεμέα' }, music: 'nemea',
  ground: [[0, 216], [300, 222], [600, 214], [900, 220], [1200, 210], [1500, 214], [1800, 206], [2100, 212], [2400, 218], [2600, 222], [3000, 222]],
  plats: [{ x: 760, w: 60, h: 14 }, { x: 1620, w: 54, h: 18 }, { x: 2160, w: 80, h: 10, thin: true }],
  sky: (x, w, h, P) => { paintSky(x, w, h, ['#7a9ac8', '#9ab4d4', '#bccbd8', '#dcd8c8', '#f0d8a8', '#f4cc90'], 170); paintSun(x, 140, 40, 13, '#fff0c0'); },
  far: (x, w, h, P, r) => paintRange(x, r, w, 186, [[100, 40, 160], [300, 56, 140], [520, 38, 170]], Object.assign({}, P, { far: '#a8a0a0', farL: '#c8bcb0', farD: '#887c80', snow: '#c8bcb0', snowD: '#a89c98' }), 78),
  mid: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 196, 24, '#a8a070', '#c4b884', '#8a8458'); for (let k = 20; k < w; k += 20 + r() * 30) { const gy = yAt(pts, k); if (r() < 0.4) paintDeadTree(x, r, k, gy + 3, 0.4, P); else paintRocks(x, r, k, gy + 2, 0.5, P); } },
  near: (x, w, h, P, r) => { const pts = paintHills(x, r, w, 208, 12, '#9a9464', '#b8ac78', '#7a744e', 3); for (let k = 0; k < w; k += 26 + r() * 30) { const gy = yAt(pts, k) + 5; if (r() < 0.35) paintDeadTree(x, r, k, gy, 0.8 + r() * 0.3, P); else if (r() < 0.5) paintThorns(x, r, k, gy, P); else paintRocks(x, r, k, gy, 0.9, P); } },
  back: (x, w, h, P, r, L) => { const G = (px) => groundY(L, px); const DP = Object.assign({}, P, { grass: '#9a9458', grassL: '#b8ae6a', grassD: '#7a7444', dirt: '#c8a878', dirtL: '#dcc092' });
    for (let k = 60; k < 2500; k += 90 + r() * 90) { const q = r(); if (q < 0.4) paintDeadTree(x, r, k, G(k), 1.4 + r() * 0.5, P); else if (q < 0.65) paintRocks(x, r, k, G(k), 1.6 + r() * 0.8, P); else if (q < 0.8) paintThorns(x, r, k, G(k), P); else paintCypress(x, k, G(k) + 2, 40 + r() * 20, P); }
    paintCave(x, r, 2820, G(2820), P); paintShrine(x, 1400, G(1400), P);
    for (const k of [520, 1880]) { line(x, k, G(k), k + 3, G(k) - 3, '#e8e0d0', 1.3); ell(x, k + 5, G(k) - 3, 2.4, 1.8, '#e8e0d0'); } // old bones: the lion has been busy
    paintGround(x, r, L, DP, 0, w); },
  birds: true, eagles: true, butterflies: [], leaves: [], dust: true, smoke: [] };

// ── the new voices ──
Object.assign(VOICES, { oldwoman: { notes: ['G4', 'Bb4', 'A4', 'F4'], wave: 'sine', gain: 0.045 }, hermes: { notes: ['C5', 'E5', 'G5', 'A5', 'E5'], wave: 'triangle', gain: 0.035 }, eurystheus: { notes: ['F5', 'E5', 'Db5', 'C5'], wave: 'square', gain: 0.022 } });
Object.assign(NAMES, { oldwoman: T('La vieille femme', 'The old woman', 'Η γριά'), hermes: T('Le marchand', 'The merchant', 'Ο έμπορος'), eurystheus: T('Eurysthée', 'Eurystheus', 'Ευρυσθέας'), guard: T('Le garde', 'The guard', 'Ο φρουρός'), bandit: T('Le brigand', 'The bandit', 'Ο ληστής'), hestia: T('Hestia', 'Hestia', 'Εστία') });
Object.assign(SPK, { oldwoman: '#6a4a7a', hermes: '#3a6a8a', eurystheus: '#7a3a6a', guard: '#8a4a3a', bandit: '#5a4a3a', hestia: '#a8582a' });

// ── obols: the coin of the road ──
function dropObols(x, y, n) { for (let i = 0; i < n; i++) G.objs.push({ kind: 'obol', x: x + (Math.random() - 0.5) * 10, y: y - 6, vx: (Math.random() - 0.5) * 70, vy: -90 - Math.random() * 60, t: 0 }); }
function obolTick(dt) { const h = G.hero; for (const o of G.objs) { if ((o.kind !== 'obol' && o.kind !== 'heart') || o.got) continue; o.t += dt; const fy = groundY(G.L, o.x) - 2; if (o.y < fy || o.vy < 0) { o.vy += 520 * dt; o.x += o.vx * dt; o.y += o.vy * dt; if (o.y >= fy) { o.y = fy; o.vy = o.vy > 60 ? -o.vy * 0.35 : 0; o.vx *= 0.5; } }
  if (o.t > 0.3 && h && Math.abs(o.x - h.x) < 12 && Math.abs(o.y - (h.y - 12)) < 22) { o.got = true; if (o.kind === 'heart') { h.hp = Math.min(HEROS.maxHp, h.hp + 1); Audio.sfx('ichor'); rumble(60, 0.2, 0.3); for (let i = 0; i < 5; i++) G.parts.push({ x: o.x, y: o.y, vx: (Math.random() - 0.5) * 30, vy: -50 - Math.random() * 30, life: 0.6, max: 0.6, kind: 'gold', g: 40 }); continue; } Save.d.obols = (Save.d.obols || 0) + 1; Save.save(); Audio.sfx('coin'); UI.obolPop = 0.4; for (let i = 0; i < 4; i++) G.parts.push({ x: o.x, y: o.y, vx: (Math.random() - 0.5) * 40, vy: -40 - Math.random() * 30, life: 0.5, max: 0.5, kind: 'gold', g: 80 }); } } }
// a heart now and then, more often when you need one
function heartChance(base) { const h = G.hero; if (Save.d.heroic) return h && h.hp <= 1 && Math.random() < 0.25; return h && h.hp < HEROS.maxHp && Math.random() < base + (h.hp <= 2 ? 0.3 : h.hp <= 3 ? 0.1 : 0); }
function dropHeart(x, y) { G.objs.push({ kind: 'heart', x, y: y - 6, vx: (Math.random() - 0.5) * 40, vy: -120, t: 0 }); }
const _breakObj = breakObj; breakObj = function (o) { _breakObj(o); if (o.obols) { dropObols(o.x, o.y, o.obols); if (heartChance(0.12)) dropHeart(o.x, o.y); } };
const _damage = damage; damage = function (a, dmg, dir) { const was = a.alive; _damage(a, dmg, dir); if (was && !a.alive && a.obols) { dropObols(a.x, a.y - 8, a.obols); if (heartChance(0.06)) dropHeart(a.x, a.y - 8); } };
function potsAt(list, n = 1) { for (const px of list) G.objs.push({ kind: 'pot', breakable: true, x: px, y: groundY(G.L, px), h: 12, obols: n + (Math.random() < 0.35 ? 1 : 0) }); }

// ── reading a god's painted name adds their page (Pan and Athena have their own scenes) ──
const PAGE_OF = { hermes: 'hermes', oldwoman: 'hera', hestia: 'hestia' };
function nameWatch() { if (G.script || G.dialog || G.world !== 'g') return; const h = G.hero; for (const a of G.actors) { const pg = PAGE_OF[a.id]; if (pg && !Save.d.book.includes(pg) && !a.hidden && Math.abs(a.x - h.x) < 150) { addPage(pg); bark(h, tr(T('… ' + CAST[a.id].god.name + ' ?', '…' + CAST[a.id].god.name + '?', '…' + CAST[a.id].god.name + ';'))); } } }

// ── Delphi now opens east, onto the Argolid ──
function setupArgolid() { const m = addActor('mentor', 20, { name: 'mentor', brain: 'follow', talk: mentorArgolidTalk });
  addActor('hermes', 690, { name: 'hermes', brain: 'idle', talk: hermesTalk }).face = -1;
  const ow = addActor('oldwoman', 1530, { name: 'oldwoman', brain: 'idle', talk: oldwomanTalk }); ow.face = -1;
  addActor('sheep', 1100, { brain: 'graze', range: 60 }); addActor('goat', 1180, { brain: 'graze', range: 50 }); addActor('hen', 1600, { brain: 'hen', range: 40 });
  for (const [bx, i] of [[2160, 0], [2290, 1]]) addActor(i ? 'bandit2' : 'bandit', bx, { name: 'bandit' + i, brain: 'bandit', foe: true, hp: 3, maxHp: 3, w: 12, h: 34, z: 2, obols: 2, introFlag: 'bandits1' }); /* they talk before they fight */
  potsAt([420, 980, 1260, 1880, 2480]);
  G.zones.push({ x0: 560, x1: 640, when: () => !flag('hermes'), run: () => runScene('hermes', sceneHermes) });
  G.zones.push({ x0: 1380, x1: 1440, when: () => !flag('well'), run: () => runScene('well', sceneWell) });
  G.zones.push({ x0: 2050, x1: 2100, when: () => !flag('bandits1'), run: () => runScene('bandits1', function* () { const m = byName('mentor'); G.check = { x: 2000 }; yield SAY('bandit', 'sly', T('Belle sacoche, petit. Et le vieux a l’air d’avoir des sandales neuves.', 'Nice satchel, kid. And the old man looks like he’s got new sandals.', 'Ωραίο σακίδιο, μικρέ. Κι ο γέρος φαίνεται να ’χει καινούργια σανδάλια.'), { who: 'bandit0' }); yield SAY(m, 'sly', T('Elles ont trois cents ans. Mais je les aime beaucoup.', 'They’re three hundred years old. But I’m very fond of them.', 'Είναι τριακοσίων χρονών. Αλλά τα αγαπώ πολύ.')); flag('bandits1', true); m.stay = 2040; }, { mode: 'bubble' }) });
  G.zones.push({ x0: 2560, x1: 2620, when: () => G.actors.filter((a) => a.foe && a.alive).length === 0 && byName('mentor').stay, run: () => { byName('mentor').stay = null; } });
  G.zones.push({ x0: 2760, x1: 2800, run: () => goLand('tiryns', 40) }); G.check = { x: 40 };
  if (!flag('argolid')) runSceneNext('argolidIn', function* () { yield* fade$('in', 1); yield* card$(LANDS.argolid.title, T('La route de Tirynthe', 'The road to Tiryns', 'Ο δρόμος για την Τίρυνθα'), 3); flag('argolid', true);
    yield SAY('mentor', 'neutral', T('L’Argolide. Les meilleures olives de Grèce, et les pires rois.', 'The Argolid. The best olives in Greece, and the worst kings.', 'Η Αργολίδα. Οι καλύτερες ελιές της Ελλάδας, κι οι χειρότεροι βασιλιάδες.')); }); }
function* mentorArgolidTalk() { const r = Math.random(); yield SAY('mentor', 'think', r < 0.33 ? T('Tirynthe a été bâtie par des Cyclopes, dit-on. Personne ne leur a demandé la permission de dire ça.', 'They say the Cyclopes built Tiryns. Nobody asked the Cyclopes.', 'Λένε πως την Τίρυνθα την έχτισαν Κύκλωπες. Κανείς δεν ρώτησε τους Κύκλωπες.') : r < 0.66 ? T('Garde tes oboles. Les marchands de la route ont des mains rapides et des sourires plus rapides encore.', 'Mind your obols. Road merchants have quick hands and quicker smiles.', 'Πρόσεχε τους οβολούς σου. Οι έμποροι του δρόμου έχουν γρήγορα χέρια και πιο γρήγορα χαμόγελα.') : T('Regarde les inconnus avec l’Œil. Tous. On ne sait jamais qui marche sur nos routes.', 'Look at strangers through the Eye. All of them. You never know who walks our roads.', 'Κοίτα τους αγνώστους με το Μάτι. Όλους. Ποτέ δεν ξέρεις ποιος περπατά στους δρόμους μας.')); }
// Hermes at his stall: the sword someone has already paid for
function* sceneHermes() { const h = G.hero, hm = byName('hermes'), m = byName('mentor'); yield* walkTo$(h, hm.x - 34, 50); face(h, hm); face(hm, h);
  yield SAY(hm, 'grin', T('Un client ! Ou un voleur. J’aime les deux, en général c’est moi.', 'A customer! Or a thief. I like both. Usually they’re me.', 'Πελάτης! Ή κλέφτης. Μ’ αρέσουν και οι δύο. Συνήθως είμαι εγώ.'));
  yield SAY('hero', 'think', T('Vous vendez des épées ?', 'Do you sell swords?', 'Πουλάτε σπαθιά;'));
  yield SAY(hm, 'sly', T('J’en vends une. Celle-là. Un xiphos de bronze, équilibré comme une rumeur. Six oboles.', 'I sell one. That one. A bronze xiphos, balanced like a rumour. Six obols.', 'Πουλάω ένα. Εκείνο. Ξίφος χάλκινο, ζυγισμένο σαν φήμη. Έξι οβολοί.'));
  yield SAY(hm, 'think', T('… Attends. Non. Celle-là est déjà payée. Quelqu’un est passé ce matin, a payé, et a dit : « pour le garçon qui viendra avec le vieux ».', '…Wait. No. That one’s already paid for. Someone came by this morning, paid, and said: “for the boy who comes with the old man.”', '…Στάσου. Όχι. Αυτό είναι ήδη πληρωμένο. Κάποιος πέρασε το πρωί, πλήρωσε κι είπε: «για το αγόρι που θα ’ρθει με τον γέρο».'));
  yield SAY('hero', 'surprised', T('Qui ?', 'Who?', 'Ποιος;'));
  yield SAY(hm, 'tender', T('Je ne peux pas le dire. C’est la seule chose que je n’aie jamais refusé de vendre : un nom.', 'I can’t say. It’s the one thing I’ve never been willing to sell: a name.', 'Δεν μπορώ να πω. Είναι το μόνο πράγμα που δεν δέχτηκα ποτέ να πουλήσω: ένα όνομα.'));
  yield* anim$(hm, 'give'); h.weapon = 'xiphos'; flag('xiphos', true); G.hint = { text: T('{swap} change d’arme : gourdin ou xiphos', '{swap} switches weapon: club or xiphos', '{swap} αλλάζει όπλο: ρόπαλο ή ξίφος'), t: 0, dur: 7 }; G.toast = { text: T('Xiphos de bronze', 'Bronze xiphos', 'Χάλκινο ξίφος'), t: 0 }; Audio.sfx('page'); rumbleFx('pickup'); G.hint = { text: T('{atk} frapper à l’épée · la massue reste meilleure contre les bêtes coriaces', '{atk} strike with the sword · the club is still better against tough hides', '{atk} χτύπα με το σπαθί · το ρόπαλο είναι καλύτερο για σκληρά τομάρια'), t: 0, dur: 7 };
  yield SAY(m, 'think', T('Hm.', 'Hm.', 'Χμ.'));
  flag('hermes', true); paintScene('act1', 'hermes'); }
function* hermesTalk() { const hm = byName('hermes'), ob = Save.d.obols || 0;
  yield SAY(hm, 'happy', T('Toujours ouvert. Sauf quand je vole.', 'Always open. Except when I’m flying.', 'Πάντα ανοιχτά. Εκτός όταν πετάω.'));
  const c = yield CHOOSE([{ text: T('Du nectar (3 oboles)', 'Nectar (3 obols)', 'Νέκταρ (3 οβολοί)'), stance: 'heart' }, { text: T('Qui a payé l’épée ?', 'Who paid for the sword?', 'Ποιος πλήρωσε το σπαθί;'), stance: 'cunning' }, { text: T('Juste regarder', 'Just looking', 'Απλώς κοιτάζω'), stance: 'force' }]);
  if (c === 0) { if (ob >= 3) { Save.d.obols = ob - 3; Save.d.nectar = (Save.d.nectar || 0) + 1; Save.save(); Audio.sfx('coin'); yield SAY(hm, 'grin', T('Une gorgée et ça repart. Pas plus d’une, ça rend poète.', 'One gulp and you’re mended. No more than one, it makes you a poet.', 'Μια γουλιά και γιατρεύεσαι. Όχι παραπάνω, σε κάνει ποιητή.')); G.hint = { text: T('Le nectar se boit tout seul quand tu n’as plus qu’un cœur', 'Nectar drinks itself when you’re down to one heart', 'Το νέκταρ πίνεται μόνο του όταν σου μείνει μία καρδιά'), t: 0, dur: 6 }; }
    else yield SAY(hm, 'sly', T('Trois oboles. Tu en as ' + ob + '. Je suis le dieu du commerce, pas de la charité.', 'Three obols. You have ' + ob + '. I trade, I don’t do charity.', 'Τρεις οβολοί. Έχεις ' + ob + '. Εμπορεύομαι, δεν κάνω φιλανθρωπίες.')); }
  else if (c === 1) yield SAY(hm, 'tender', T('Quelqu’un qui boite un peu, et qui a de très grandes mains. C’est tout ce que tu auras.', 'Someone with a bit of a limp, and very large hands. That’s all you’re getting.', 'Κάποιος που κουτσαίνει λίγο κι έχει πολύ μεγάλα χέρια. Μόνο αυτό θα μάθεις.'));
  else yield SAY(hm, 'happy', T('Regarder ne coûte rien. Pour l’instant.', 'Looking’s free. For now.', 'Το να κοιτάς είναι δωρεάν. Προς το παρόν.')); }
// the old woman at the well: Hera, hiring the hero to find the hidden child (who is him)
function* sceneWell() { const h = G.hero, ow = byName('oldwoman'), m = byName('mentor'); m.stay = 1300; yield* walkTo$(h, ow.x - 40, 50); face(h, ow); face(ow, h); G.letterbox = 1;
  const O = (e, t) => SAY(ow, e, t), B = (e, t) => SAY('hero', e, t);
  yield O('sly', T('Toi. Le garçon au visage honnête. Tire-moi de l’eau. Mon dos a des opinions, aujourd’hui.', 'You. Boy with the honest face. Draw me some water. My back has opinions today.', 'Εσύ. Το αγόρι με το τίμιο πρόσωπο. Βγάλε μου νερό. Η μέση μου έχει απόψεις σήμερα.'));
  yield* walkTo$(h, 1500 - 14, 40); yield* anim$(h, 'pick'); Audio.sfx('splash'); yield* walkTo$(h, ow.x - 26, 40); face(h, ow);
  yield B('happy', T('Voilà, grand-mère.', 'Of course, grandmother.', 'Ορίστε, γιαγιά.'));
  yield O('surprised', T('Comment m’as-tu appelée ?', 'What did you call me?', 'Πώς με είπες;'));
  yield B('shy', T('Grand-mère ? C’est ce qu’on dit, chez moi. Aux vieilles personnes. Aux plus âgées. À tout le monde.', 'Grandmother? It’s what we say at home. To anyone old. Older. To anyone.', 'Γιαγιά; Έτσι λέμε στο χωριό. Σε όποιον είναι γέρος. Μεγαλύτερος. Σε όλους.'));
  yield* anim$(ow, 'pick'); yield WAIT(0.6);
  yield O('think', T('Hm. C’est un bon mot. Personne ne me l’a jamais dit. Tu peux continuer à t’en servir.', 'Hm. It’s a good word. Nobody has used it on me before. You may keep using it.', 'Χμ. Καλή λέξη. Κανείς δεν μου την είπε ποτέ. Μπορείς να τη λες.'));
  yield B('neutral', T('Vous voyagez seule ?', 'Are you travelling alone?', 'Ταξιδεύετε μόνη;'));
  yield O('cross', T('Je cherche quelqu’un. Un enfant. Qu’on m’a caché, très impoliment, pendant douze ans.', 'I am looking for someone. A child. Hidden from me, very rudely, for twelve years.', 'Ψάχνω κάποιον. Ένα παιδί. Μου το έκρυψαν, πολύ αγενώς, δώδεκα χρόνια.'));
  yield B('sad', T('C’est terrible. Il est de votre famille ?', 'That’s terrible. Is he your family?', 'Τι φρικτό. Είναι από την οικογένειά σας;'));
  yield O('cross', T('C’est une erreur de ma famille. J’ai l’intention de la corriger.', 'He is a mistake of my family’s. I intend to correct it.', 'Είναι ένα λάθος της οικογένειάς μου. Σκοπεύω να το διορθώσω.'));
  yield B('grin', T('Je suis doué pour retrouver les choses. J’ai retrouvé une chèvre, une fois, partie depuis deux jours.', 'I’m good at finding things. I found a goat once that had been gone two days.', 'Είμαι καλός στο να βρίσκω πράγματα. Βρήκα μια φορά μια κατσίκα, χαμένη δυο μέρες.'));
  yield O('neutral', T('Une chèvre.', 'A goat.', 'Μια κατσίκα.'));
  yield B('neutral', T('Elle était dans un arbre.', 'She was in a tree.', 'Ήταν πάνω σε δέντρο.'));
  yield WAIT(1.0);
  yield O('sly', T('Oui. Tu feras l’affaire. Trouve-moi cet enfant caché, petit, et je te donnerai ce que tu voudras. Je suis plus riche que je n’en ai l’air.', 'Yes. You’ll do. Find my hidden child, boy, and I will give you whatever you ask. I am richer than I look.', 'Ναι. Κάνεις. Βρες μου το κρυμμένο παιδί, μικρέ, και θα σου δώσω ό,τι ζητήσεις. Είμαι πιο πλούσια απ’ όσο δείχνω.'));
  yield B('shy', T('Je n’ai pas besoin d’être payé, grand-mère.', 'I don’t need paying, grandmother.', 'Δεν θέλω πληρωμή, γιαγιά.'));
  yield O('think', T('Tout le monde a besoin d’être payé. C’est comme ça qu’on sait où on en est avec les gens.', 'Everyone needs paying. It’s how you know where you stand with them.', 'Όλοι θέλουν πληρωμή. Έτσι ξέρεις πού στέκεσαι μαζί τους.'));
  yield* anim$(ow, 'give'); h.feather = true; flag('feather', true); G.toast = { text: T('Une plume de paon', 'A peacock feather', 'Ένα φτερό παγωνιού'), t: 0 }; Audio.sfx('page'); rumbleFx('pickup');
  yield O('neutral', T('Montre ça à n’importe quelle porte.', 'Show this at any door.', 'Δείξ’ το σε οποιαδήποτε πόρτα.'));
  G.letterbox = 0; m.stay = null; flag('well', true); paintScene('act1', 'well');
  yield SAY(m, 'think', T('… Une plume de paon. Garde-la bien. Et garde-toi bien, aussi.', '…A peacock feather. Keep it safe. And keep yourself safe, while you’re at it.', '…Φτερό παγωνιού. Φύλαξέ το καλά. Και φύλαξε κι εσένα.')); }
function* oldwomanTalk() { const ow = byName('oldwoman'); yield SAY(ow, 'sly', Math.random() < 0.5 ? T('Tu ne l’as pas encore trouvé ? Les jeunes, de nos jours.', 'Not found him yet? The young, these days.', 'Δεν τον βρήκες ακόμα; Οι νέοι σήμερα.') : T('Va, va. L’enfant ne va pas se trouver tout seul.', 'Go on. The child won’t find himself.', 'Άντε. Το παιδί δεν θα βρεθεί μόνο του.')); }

// ── Tiryns ──
// Hestia, at the hearth: the one god nobody looks for
function* hestiaTalk() { const hs = byName('hestia'), H = { mode: 'heart' };
  if (!flag('hestiaMet')) { flag('hestiaMet', true); face(G.hero, hs);
    yield SAY(hs, 'surprised', T('Oh. Tu me vois. Ça n’arrive presque jamais. Assieds-toi, si tu veux. Le feu ne demande rien.', 'Oh. You can see me. That almost never happens. Sit down, if you like. The fire doesn’t ask for anything.', 'Α. Με βλέπεις. Σχεδόν ποτέ δεν συμβαίνει. Κάτσε, αν θες. Η φωτιά δεν ζητάει τίποτα.'));
    yield SAY('hero', 'think', T('Vous êtes… qui ?', 'You are… who?', 'Ποια είστε…;'));
    yield SAY(hs, 'tender', T('Celle qui reste. Tout le monde part, revient, repart. Moi, je garde le feu allumé pour quand ils reviennent.', 'The one who stays. Everyone leaves, comes back, leaves again. I keep the fire lit for when they come back.', 'Αυτή που μένει. Όλοι φεύγουν, γυρίζουν, ξαναφεύγουν. Εγώ κρατάω τη φωτιά αναμμένη για όταν γυρίσουν.'));
    yield SAY('hero', 'tender', T('Ma mère aussi, elle garde le feu.', 'My mother keeps the fire too.', 'Κι η μητέρα μου κρατάει τη φωτιά.'), H);
    yield SAY(hs, 'sly', T('Je sais. Je suis passée chez elle. C’est un bon foyer. Il fume un peu à gauche.', 'I know. I’ve been by her house. It’s a good hearth. It smokes a little on the left.', 'Το ξέρω. Πέρασα από το σπίτι της. Καλή εστία. Καπνίζει λίγο από αριστερά.'));
    return; }
  const L = [T('Je suis l’aînée et la cadette de ma famille, en même temps. Les repas de famille sont compliqués.', 'I’m both the eldest and the youngest in my family. Family dinners are complicated.', 'Είμαι η μεγαλύτερη και η μικρότερη της οικογένειάς μου, ταυτόχρονα. Τα οικογενειακά τραπέζια είναι περίπλοκα.'),
    T('Le roi tremble dans sa jarre. Le feu, lui, ne tremble pas. Va.', 'The king shakes in his jar. The fire doesn’t. Go on.', 'Ο βασιλιάς τρέμει στο πιθάρι του. Η φωτιά δεν τρέμει. Πήγαινε.'),
    T('Si tu as froid en route, pense à une cuisine. Ça marche mieux qu’on ne croit.', 'If you get cold on the road, think of a kitchen. It works better than you’d think.', 'Αν κρυώσεις στον δρόμο, σκέψου μια κουζίνα. Πιάνει καλύτερα απ’ ό,τι νομίζεις.')];
  yield SAY(hs, 'tender', L[(G.hestiaN = ((G.hestiaN || 0) + 1)) % L.length]); }
function setupTiryns() { const m = addActor('mentor', 20, { name: 'mentor', brain: 'follow', talk: mentorTirynsTalk });
  addActor('guard', 250, { name: 'guard', brain: 'idle', talk: guardTalk }).face = -1; addActor('guard', 1910, { name: 'guard2', brain: 'idle' }).face = -1;
  addActor('presser', 700, { brain: 'work', barks: [T('Des figues ! Des figues de Lerne !', 'Figs! Figs from Lerna!', 'Σύκα! Σύκα από τη Λέρνα!')] });
  addActor('waterwoman', 1080, { brain: 'fetch', x1: 1160, barks: [T('Paraît que le roi n’est pas sorti de sa jarre depuis l’hiver.', 'They say the king hasn’t left his jar since winter.', 'Λένε πως ο βασιλιάς δεν βγήκε απ’ το πιθάρι του από τον χειμώνα.')] });
  addActor('kid1', 860, { brain: 'kids' }); addActor('cat', 1620, { brain: 'idle', fixY: groundY(G.L, 1620) - 1, restAnim: 'idle' }); addActor('hen', 520, { brain: 'hen', range: 50 });
  addActor('hestia', 990, { name: 'hestia', brain: 'idle', godOnly: true, mistless: true, talk: hestiaTalk }).face = 1;
  addActor('eurystheus', 1520, { name: 'eurystheus', brain: null, hidden: true, z: 0 });
  G.zones.push({ x0: 1380, x1: 1440, when: () => !flag('labours'), run: () => runScene('eurystheus', sceneEurystheus) });
  G.zones.push({ x0: 1940, x1: 2000, when: () => flag('labours'), run: () => { const n = nextLabour(); if (n) goLand(n, 40); else { G.hero.x = 1920; bark(byName('mentor'), tr(T('Plus rien par là. Pour l’instant.', 'Nothing more that way. For now.', 'Τίποτα πια από εκεί. Προς το παρόν.'))); } } });
  if (!G.reportOf && Save.d.report) G.reportOf = Save.d.report; if (G.reportOf) runSceneNext('report', sceneReport);
  G.zones.push({ x0: 1880, x1: 1900, when: () => !flag('labours'), repeat: true, run: () => { G.hero.x = 1870; bark(byName('guard2'), tr(T('Pas sans ordre du roi.', 'Not without the king’s order.', 'Όχι χωρίς διαταγή του βασιλιά.'))); } });
  G.check = { x: 60 };
  if (!flag('tiryns')) runSceneNext('tirynsIn', function* () { yield* fade$('in', 1); yield* card$(LANDS.tiryns.title, T('La ville aux murs de géants', 'The city with giants’ walls', 'Η πόλη με τα τείχη των γιγάντων'), 3); flag('tiryns', true);
    const g = byName('guard'), h = G.hero; yield* walkTo$(h, g.x - 34, 50); face(h, g);
    yield SAY(g, 'cross', T('Halte. Qui entre à Tirynthe ?', 'Halt. Who enters Tiryns?', 'Αλτ. Ποιος μπαίνει στην Τίρυνθα;'), { who: 'guard' });
    if (flag('feather')) { yield* anim$(h, 'give'); yield SAY(g, 'surprised', T('… Une plume de paon. Ah. Bien sûr. Entrez. Entrez, je vous en prie. Et… dites-lui que j’étais poli.', '…A peacock feather. Ah. Of course. Go in. Please, go in. And… tell her I was polite.', '…Φτερό παγωνιού. Α. Βεβαίως. Περάστε. Παρακαλώ, περάστε. Και… πείτε της πως ήμουν ευγενικός.'), { who: 'guard' }); yield SAY('hero', 'think', T('Dire à qui ?', 'Tell who?', 'Να πω σε ποια;')); }
    else yield SAY(g, 'neutral', T('Un vieux et un gamin. Entrez. Le roi reçoit dans sa jarre.', 'An old man and a boy. Go in. The king receives in his jar.', 'Ένας γέρος κι ένα παιδί. Περάστε. Ο βασιλιάς δέχεται στο πιθάρι του.'), { who: 'guard' });
    g.x += 30; }); }
function* guardTalk() { yield SAY('guard', 'neutral', T('Le roi ? Tout au fond, après les colonnes. Il vit dans une grande jarre de bronze. Oui, une jarre. Frappez dessus avant de lui parler, sinon il a si peur qu’il se cogne la tête.', 'The king? Right at the end, past the columns. He lives in a big bronze jar. Yes, a jar. Knock on it before you talk to him, or he gets such a fright he bumps his head.', 'Ο βασιλιάς; Στο βάθος, μετά τις κολόνες. Ζει σε ένα μεγάλο χάλκινο πιθάρι. Ναι, πιθάρι. Χτυπήστε το πριν του μιλήσετε, αλλιώς τρομάζει τόσο που χτυπάει το κεφάλι του.'), { who: 'guard' }); }
function* mentorTirynsTalk() { yield SAY('mentor', 'think', Math.random() < 0.5 ? T('Le foyer, là. Regarde-le avec l’Œil, un jour. Il n’est jamais tout à fait vide.', 'The hearth there. Look at it through the Eye sometime. It’s never quite empty.', 'Η εστία εκεί. Κοίτα την κάποτε με το Μάτι. Ποτέ δεν είναι εντελώς άδεια.') : T('Eurysthée a fait trembler Héraclès, autrefois. Depuis le fond d’une jarre. C’est un talent.', 'Eurystheus once had Heracles trembling. From the bottom of a jar. It’s a gift.', 'Ο Ευρυσθέας έκανε κάποτε τον Ηρακλή να τρέμει. Από τον πάτο ενός πιθαριού. Είναι χάρισμα.')); }
// Eurystheus, dead and terrified, handing out labours from his bronze jar
function* sceneEurystheus() { const h = G.hero, m = byName('mentor'), e = byName('eurystheus'); yield* walkTo$(h, 1495, 50); /* knuckles on the bronze */ face(h, e); G.letterbox = 1;
  yield SAY(m, 'sly', T('Eurysthée, roi de Tirynthe. Mort depuis trois cents ans, et toujours aussi peureux. Frappe.', 'Eurystheus, king of Tiryns. Dead three hundred years, and still frightened. Knock.', 'Ο Ευρυσθέας, βασιλιάς της Τίρυνθας. Νεκρός τριακόσια χρόνια, και πάντα φοβιτσιάρης. Χτύπα.'));
  // the knock: polite, then less polite
  const rap = () => { Audio.sfx('step'); rumble(40, 0.2, 0.2); }; setTimeout(rap, 300); setTimeout(rap, 530); setTimeout(rap, 760); yield* anim$(h, 'knock'); yield WAIT(1.1);
  yield SAY('hero', 'think', T('…', '…', '…'));
  yield SAY(m, 'neutral', T('Plus fort. Il est mort, pas sourd. Enfin, un peu sourd.', 'Louder. He’s dead, not deaf. Well, a bit deaf.', 'Πιο δυνατά. Πέθανε, δεν κουφάθηκε. Καλά, λίγο κουφός είναι.'));
  setTimeout(rap, 300); setTimeout(rap, 530); setTimeout(rap, 760); yield* anim$(h, 'knock'); yield WAIT(1.2);
  yield SAY(m, 'sly', T('Bon. Pousse-toi.', 'Right. Step aside.', 'Λοιπόν. Κάνε στην άκρη.')); yield* walkTo$(h, 1440, 40); face(h, e); yield* walkTo$(m, 1463, 50); face(m, e); /* a staff's length from the jar */
  later(0.45, () => { Audio.sfx('clang'); Audio.sfx('smash'); G.shake = 0.7; rumble(450, 1, 0.8); for (let i = 0; i < 10; i++) G.parts.push({ x: 1508 + (Math.random() - 0.5) * 10, y: groundY(G.L, 1508) - 40 - Math.random() * 20, vx: (Math.random() - 0.5) * 80, vy: -40 - Math.random() * 50, life: 0.7, max: 0.7, kind: 'dust', g: 200 }); });
  yield* anim$(m, 'whack'); yield WAIT(0.15);
  e.hidden = false; e.peek = 0; e.anim = 'idle'; G.peekE = e; for (let k = 0; k <= 10; k++) { e.peek = k / 10 * 0.6; yield WAIT(0.015); } yield WAIT(0.2);
  yield SAY(e, 'surprised', T('QUOI ?! Qui frappe comme un forcené ? Si c’est encore un héros, je ne suis pas là. Je suis une jarre.', 'WHAT?! Who’s knocking like a madman? If it’s another hero, I’m not in. I’m a jar.', 'ΤΙ;! Ποιος χτυπάει σαν τρελός; Αν είναι πάλι ήρωας, δεν είμαι εδώ. Είμαι πιθάρι.'));
  for (let k = 0; k <= 10; k++) { e.peek = 0.6 - k / 10 * 0.15; yield WAIT(0.03); } yield* walkTo$(m, 1430, 40); face(m, e);
  yield SAY('hero', 'neutral', T('C’est la Pythie qui nous envoie. Les bêtes d’Héraclès sont réveillées.', 'The Pythia sent us. Heracles’ beasts are awake again.', 'Μας στέλνει η Πυθία. Τα θηρία του Ηρακλή ξύπνησαν.'));
  for (let k = 0; k <= 10; k++) { e.peek = 0.45 + k / 10 * 0.45; yield WAIT(0.03); }
  yield SAY(e, 'sad', T('Je le sais bien ! Je les entends la nuit. Le lion de Némée rugit, l’hydre de Lerne siffle, le sanglier d’Érymanthe… mâche. Bruyamment.', 'I know! I hear them at night. The Nemean lion roars, the Lernaean hydra hisses, the Erymanthian boar… chews. Loudly.', 'Το ξέρω! Τα ακούω τη νύχτα. Το λιοντάρι της Νεμέας βρυχάται, η Λερναία Ύδρα σφυρίζει, ο κάπρος του Ερύμανθου… μασάει. Δυνατά.'));
  yield SAY(e, 'cross', T('Héraclès les avait tous battus. Pour moi ! Et maintenant elle les a tirés des étoiles, et qui doit s’en occuper ? Un roi mort dans une jarre.', 'Heracles beat them all. For me! And now she’s pulled them down from the stars, and who has to deal with it? A dead king in a jar.', 'Ο Ηρακλής τα νίκησε όλα. Για μένα! Και τώρα εκείνη τα κατέβασε απ’ τ’ αστέρια, και ποιος πρέπει να τα βγάλει πέρα; Ένας νεκρός βασιλιάς σε πιθάρι.'));
  yield SAY('hero', 'think', T('Elle ?', 'She?', 'Εκείνη;'));
  yield SAY(e, 'surprised', T('Je n’ai rien dit. Les jarres ne disent rien.', 'I said nothing. Jars say nothing.', 'Δεν είπα τίποτα. Τα πιθάρια δεν λένε τίποτα.'));
  const c = yield CHOOSE([{ text: T('Donnez-moi la plus grosse bête que vous ayez.', 'Give me the biggest beast you’ve got.', 'Δώσε μου το μεγαλύτερο θηρίο που έχεις.'), stance: 'force' }, { text: T('Lequel peut-on faire sans se faire manger ?', 'Which one can be done without getting eaten?', 'Ποιο μπορεί να γίνει χωρίς να σε φάνε;'), stance: 'cunning' }, { text: T('Vous allez bien, là-dedans ?', 'Are you all right in there?', 'Είστε καλά εκεί μέσα;'), stance: 'heart' }]);
  flag('stance', ['force', 'cunning', 'heart'][c] || 'force');
  if (c === 0) yield SAY(e, 'happy', T('Un volontaire ! Je ne savais pas que ça existait encore. Le lion, alors. Le lion de Némée. Les lames rebondissent sur sa peau. Comme ma dignité.', 'A volunteer! I didn’t know they still made those. The lion, then. The Nemean lion. Blades bounce off its hide. Like my dignity.', 'Εθελοντής! Δεν ήξερα πως υπάρχουν ακόμα. Το λιοντάρι, λοιπόν. Της Νεμέας. Οι λεπίδες γλιστρούν στο τομάρι του. Όπως η αξιοπρέπειά μου.'));
  else if (c === 1) yield SAY(e, 'think', T('Aucun. Mais le plus malin, ce serait l’hydre : elle a beaucoup de têtes, et aucune ne réfléchit. Lerne d’abord.', 'None. But the clever choice would be the hydra: it has lots of heads, and none of them thinks. Lerna first.', 'Κανένα. Αλλά το έξυπνο θα ήταν η Ύδρα: έχει πολλά κεφάλια, και κανένα δεν σκέφτεται. Πρώτα η Λέρνη.'));
  else yield SAY(e, 'tender', T('… Personne ne m’a demandé ça depuis trois cents ans. Non. Je ne vais pas bien. C’est l’Arcadie qui m’empêche de dormir : le sanglier mâche, les oiseaux claquent. Si tu pouvais commencer par là…', '…Nobody has asked me that in three hundred years. No. I’m not all right. It’s Arcadia that keeps me awake: the boar chews, the birds clank. If you could start there…', '…Κανείς δεν με ρώτησε αυτό τριακόσια χρόνια. Όχι. Δεν είμαι καλά. Η Αρκαδία δεν μ’ αφήνει να κοιμηθώ: ο κάπρος μασάει, τα πουλιά κροταλίζουν. Αν μπορούσες ν’ αρχίσεις από εκεί…'));
  yield SAY(e, 'neutral', assignLine(nextLabour()));
  for (let k = 0; k <= 10; k++) { e.peek = 0.9 * (1 - k / 10); yield WAIT(0.03); } e.hidden = true; Audio.sfx('clang');
  yield SAY(m, 'happy', T('Il t’aime bien. Ça se voit à la vitesse à laquelle il s’est caché.', 'He likes you. You can tell by how fast he hid.', 'Σε συμπάθησε. Φαίνεται απ’ το πόσο γρήγορα κρύφτηκε.'));
  G.letterbox = 0; flag('labours', true); paintScene('act1', 'eurystheus'); G.hint = { text: gateHint(nextLabour()), t: 0, dur: 6 }; }

// ── Nemea ──
function setupNemea() { const m = addActor('mentor', 20, { name: 'mentor', brain: 'follow', talk: mentorNemeaTalk });
  for (const [wx, i] of [[640, 0], [760, 1]]) addActor('wolf', wx, { name: 'nwolf' + i, brain: 'wolf', foe: true, hp: 2, maxHp: 2, w: 18, h: 20, range: 60, z: 2, obols: 1 });
  for (const [bx, i] of [[1180, 0], [1300, 1], [1960, 2]]) addActor(i % 2 ? 'bandit2' : 'bandit', bx, { name: 'nbandit' + i, brain: 'bandit', foe: true, hp: 3, maxHp: 3, w: 12, h: 34, z: 2, obols: 2 });
  for (const [wx, i] of [[2240, 2], [2320, 3]]) addActor('wolf', wx, { name: 'nwolf' + i, brain: 'wolf', foe: true, hp: 2, maxHp: 2, w: 18, h: 20, range: 60, z: 2, obols: 1 });
  potsAt([380, 1050, 1540, 2080, 2420], 1);
  G.zones.push({ x0: 1400, x1: 1440, run: () => { if (!G.check || G.check.x < 1400) { G.check = { x: 1420 }; G.toast = { plain: true, text: T('L’autel : un lieu sûr · tes cœurs reviennent', 'The shrine: a safe place · your hearts come back', 'Ο βωμός: ασφαλές μέρος · οι καρδιές σου γυρίζουν'), t: 0 }; G.hero.hp = HEROS.maxHp; Audio.sfx('ichor'); rumbleFx('pickup'); } } });
  G.zones.push({ x0: 2520, x1: 2560, when: () => !flag('lion'), run: () => runScene('lionIn', sceneLionIn) });
  G.zones.push({ x0: 2770, x1: 2800, when: () => flag('lion') && !G.denTold, run: () => { G.denTold = true; bark(byName('mentor') || G.hero, tr(T('Il ne ressortira plus. Là-dedans, il n’y a que des os.', 'He won’t come out again. There’s nothing in there but bones.', 'Δεν θα ξαναβγεί. Εκεί μέσα έχει μόνο κόκαλα.'))); } });
  G.check = { x: 40 };
  if (!flag('nemea')) runSceneNext('nemeaIn', function* () { yield* fade$('in', 1); yield* card$(LANDS.nemea.title, T('Premier travail : le lion', 'First labour: the lion', 'Πρώτος άθλος: το λιοντάρι'), 3); flag('nemea', true);
    yield SAY('mentor', 'neutral', T('Némée. Rien ne pousse ici depuis que le lion est revenu. Même les chardons ont l’air inquiets.', 'Nemea. Nothing has grown here since the lion came back. Even the thistles look nervous.', 'Νεμέα. Τίποτα δεν φυτρώνει εδώ από τότε που γύρισε το λιοντάρι. Ακόμα κι οι γαϊδουράγκαθες φαίνονται ανήσυχες.')); }); }
function* mentorNemeaTalk() { yield SAY('mentor', 'think', Math.random() < 0.5 ? T('L’épée glissera sur lui. La massue, elle, le sonnera. Et un lion sonné, ça se prend à bras-le-corps.', 'The sword will slide off him. The club will ring his bell. And a lion with its bell rung can be wrestled.', 'Το σπαθί θα γλιστρήσει πάνω του. Το ρόπαλο θα τον ζαλίσει. Κι ένα ζαλισμένο λιοντάρι παλεύεται.') : T('Quand il se ramasse et remue la queue, il va bondir. Saute, ou recule.', 'When he crouches and twitches his tail, he’s about to pounce. Jump, or back off.', 'Όταν μαζεύεται και κουνάει την ουρά, θα πηδήξει. Πήδα ή κάνε πίσω.')); }
function* sceneLionIn() { const h = G.hero, m = byName('mentor'); if (h.hp < HEROS.maxHp && !Save.d.heroic) { h.hp = HEROS.maxHp; Audio.sfx('ichor'); } m.stay = 2460; G.letterbox = 1; yield* walkTo$(h, 2600, 50); face(h, { x: 2900 });
  const L = addActor('lion', 2830, { name: 'lion', brain: 'lion', foe: true, boss: true, hp: LION.hp * (Save.d.heroic ? 1.25 : 1), maxHp: LION.hp * (Save.d.heroic ? 1.25 : 1), w: 46, h: 30, z: 2, x0: 2830 }); L.face = -1; L.scripted = true; L.hidden = false; L.alpha = 0;
  for (let k = 0; k <= 20; k++) { L.alpha = k / 20; yield WAIT(0.04); } L.alpha = 1; yield* walkTo$(L, 2760, 30, 'walk'); Audio.sfx('roar'); rumbleFx('reveal'); G.shake = 0.5; yield* anim$(L, 'roar');
  yield SAY(m, 'cross', T('Le voilà. La massue sonne, l’épée rebondit. Quand il titube, attrape-le !', 'There he is. The club rings him, the sword bounces. When he staggers, grab him!', 'Να τος. Το ρόπαλο τον ζαλίζει, το σπαθί γλιστρά. Όταν παραπατήσει, άρπαξέ τον!'));
  L.scripted = false; G.letterbox = 0; G.bounds = [2470, 2960]; G.check = { x: 2560 }; G.check = { x: 2500 }; G.boss = { a: L, name: T('Le lion de Némée', 'The Nemean Lion', 'Το λιοντάρι της Νεμέας'), t: 0 }; Audio.playMusic('lion'); G.hint = { text: T('{atk} la massue le sonne · quand il titube, {atk} pour l’empoigner', '{atk} the club stuns him · when he staggers, {atk} to grab him', '{atk} το ρόπαλο τον ζαλίζει · όταν παραπατά, {atk} για να τον αρπάξεις'), t: 0, dur: 8 }; }
function* sceneLionDown() { if (G.hero.bossClub) { G.hero.bossClub = false; if (flag('xiphos')) G.hero.weapon = 'xiphos'; } const h = G.hero, m = byName('mentor'), L = byName('lion'); G.boss = null; G.bounds = null; Audio.playMusic('nemea'); G.letterbox = 1; m.stay = null; yield WAIT(1.2);
  yield* walkTo$(h, L.x - 30, 40); face(h, L);
  // the beast rises into the sky as Leo: the scene holds, the old man comes over, the view tilts up into the dusk
  yield* walkTo$(m, h.x - 26, 70); face(m, L);
  yield SAY(m, 'tender', T('Attends. Ne bouge pas. Regarde-le bien.', 'Wait. Don’t move. Watch him.', 'Περίμενε. Μην κουνιέσαι. Κοίτα τον καλά.'));
  yield SAY(m, 'think', T('Ces bêtes-là ne meurent pas comme les autres. Héraclès les avait vaincues, et Zeus les avait mises dans le ciel. Quelqu’un est allé les y chercher.', 'These beasts don’t die like others. Heracles beat them, and Zeus set them in the sky. Someone went up and fetched them down.', 'Αυτά τα θηρία δεν πεθαίνουν σαν τα άλλα. Ο Ηρακλής τα νίκησε κι ο Δίας τα έβαλε στον ουρανό. Κάποιος ανέβηκε και τα κατέβασε.'));
  yield SAY(m, 'tender', T('Maintenant, il rentre chez lui.', 'Now he’s going home.', 'Τώρα γυρίζει σπίτι του.'));
  L.fadeToStars = true; yield* constellation$('leo', L.x, L.y - 18); L.hidden = true;
  yield SAY(m, 'tender', T('Les soirs d’été, cherche-le au-dessus de l’horizon. Il ne bougera plus de là. Elle l’en avait tiré, il y retourne.', 'On summer evenings, look for him above the horizon. He won’t leave it again. She pulled him down; he’s gone back.', 'Τα καλοκαιρινά βράδια, ψάξε τον πάνω απ’ τον ορίζοντα. Δεν θα φύγει πια από εκεί. Εκείνη τον κατέβασε· ξαναγύρισε.'));
  yield* constellationEnd$();
  G.objs.push({ kind: 'peltItem', x: L.x, y: L.y }); yield* walkTo$(h, L.x - 10, 40); yield* anim$(h, 'pick'); G.objs = G.objs.filter((o) => o.kind !== 'peltItem'); h.pelt = true; flag('pelt', true); HEROS.maxHp = 7; h.hp = HEROS.maxHp; CAST.hero.o.peltWorn = true; rebake('hero'); rumbleFx('pickup');
  G.toast = { text: T('La peau du lion de Némée · armure : +2 ♥', 'The Nemean lion’s pelt · armour: +2 ♥', 'Το τομάρι του λιονταριού · πανοπλία: +2 ♥'), t: 0 };
  yield SAY('hero', 'think', T('Qui, *elle* ?', 'Who’s *she*?', 'Ποια *εκείνη*;'));
  yield SAY(m, 'sly', T('Quelqu’un qui va être de très mauvaise humeur ce soir. Viens. Eurysthée va s’évanouir. Deux fois.', 'Someone who’ll be in a very bad mood tonight. Come on. Eurystheus is going to faint. Twice.', 'Κάποια που θα ’χει πολύ κακή διάθεση απόψε. Έλα. Ο Ευρυσθέας θα λιποθυμήσει. Δυο φορές.'));
  G.letterbox = 0; flag('lion', true); paintScene('act1', 'lion'); yield WAIT(0.8); labourDone('nemea'); }

// ── wiring: enter the new lands, keep the Delphi exit, watch names, collect obols ──
const ACT1_SETUP = { argolid: setupArgolid, tiryns: setupTiryns, nemea: setupNemea };
const _enterAct1 = enterLand; enterLand = function (id, x) { if (!ACT1_SETUP[id]) return _enterAct1(id, x); loadLand(id, 'day', { x }); G.camLock = null; G.extraLights = []; G.bounds = null; G.boss = null; ACT1_SETUP[id](); Save.d.at = { land: id, x }; Save.save(); };
