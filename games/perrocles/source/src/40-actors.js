// ═══ ACTORS: everyone who moves. Animation picks frames by time, or by distance for walks (no skidding). ═══
const GRAV = 820, RUN = 104, WALK_NPC = 26, JUMP_V = 292;
function mkActor(id, x, o = {}) { const c = CAST[id]; return Object.assign({ id, x, y: 0, vx: 0, vy: 0, face: 1, anim: c.kind === 'snake' ? 'idle' : (c.sits ? 'sit' : 'idle'), at: 0, dist: 0, ground: true, habitAt: 2 + Math.random() * 6, habit: null, hp: 3, z: 0, brain: null, mem: {}, w: c.kind === 'human' ? 12 : 16, h: c.kind === 'human' ? 52 : 22, alive: true, name: null, talk: null }, o); }
function setAnim(a, name, keep) { if (a.anim === name) return; if (!keep) a.at = 0; a.anim = name; }
const isMoving = (a) => Math.abs(a.vx) > 4;
function animDef(a) { return animsFor(CAST[a.id].kind)[a.anim]; }
// which frame to show now
function frameIndex(a) { const A = animDef(a); if (!A) return 0; const c = CAST[a.id], sz = sizeOf(a.id, G.world);
  if (A.stride) return Math.floor(a.dist / strideOf(A.stride, 1, sz) * A.n);
  if (A.qstride) return Math.floor(a.dist / (QGAITS[A.qstride].L * UPX * sz) * A.n);
  if (A.fstride) return Math.floor(a.dist / (A.fstride * UPX) * A.n);
  if (A.sstride) return Math.floor(a.dist / (A.sstride * UPX) * A.n);
  if (A.n === 1) return 0; const k = a.at / (A.dur || 1); return A.loop ? Math.floor(k * A.n) : Math.min(A.n - 1, Math.floor(k * A.n)); }
const animDone = (a) => { const A = animDef(a); if (!A || A.stride || A.qstride || A.fstride || A.sstride) return false; if (A.loop) return a.busy ? a.at >= (A.dur || (A.n / (A.fps || 10))) : false; return a.at >= (A.dur || 0); };
// the habits: an idle actor plays one now and then, then goes back to standing
function lifeTick(a, dt) { const c = CAST[a.id]; if (a.habit) { if (animDone(a)) { a.habit = null; setAnim(a, a.restAnim || (c.sits ? 'sit' : 'idle')); a.habitAt = NOW.t + 3 + Math.random() * 7; } return; }
  if (isMoving(a) || a.busy || a.nohabit) return; if (NOW.t > a.habitAt) { const set = c.kind === 'human' ? HABIT_SETS[c.habits] : c.kind === 'beast' ? BHABIT_SETS[c.habits] : c.kind === 'fowl' ? ['peck', 'scratch', 'peck', 'flap'] : null; if (!set || c.sits) { a.habitAt = NOW.t + 5; return; }
    const pick = set[Math.floor(Math.random() * set.length)]; a.habit = pick; setAnim(a, pick); if (c.kind === 'beast' && (pick === 'bleat') && Math.random() < 0.6 && onScreen(a)) Audio.sfx('bleat'); if (c.kind === 'fowl' && Math.random() < 0.3 && onScreen(a)) Audio.sfx('cluck'); } }
const onScreen = (a) => a.x > G.cam.x - 40 && a.x < G.cam.x + LW + 40;
// ground under an actor: the terrain, or the top of a ledge it stands on
function floorAt(L, x, y, prevY, thinOK = true) { let f = groundY(L, x); for (const p of L.plats) { if (p.wall && !p.top) continue; const top = groundY(L, p.x + p.w / 2) - p.h; if (x >= p.x - 2 && x <= p.x + p.w + 2 && prevY <= top + 2 && top < f) { if (p.thin && !thinOK) continue; f = top; } } return f; }
// simple walking for everyone but the hero: move toward a target x at a speed, on the ground
function walkTo(a, tx, sp, dt, anim) { const d = tx - a.x; if (Math.abs(d) < 2) { a.vx = 0; return true; } a.face = Math.sign(d); a.vx = a.face * sp; const st = Math.min(Math.abs(d), sp * dt); a.x += a.face * st; a.dist += st; if (a.habit) { a.habit = null; } setAnim(a, anim || (CAST[a.id].kind === 'beast' ? (sp > 60 ? 'run' : sp > 36 ? 'trot' : 'walk') : sp > 70 ? 'run' : 'walk'), true); return false; }
function standStill(a) { a.vx = 0; if (!a.habit && !a.busy && ['walk', 'run', 'trot', 'slither', 'sneak'].includes(a.anim)) setAnim(a, a.restAnim || (CAST[a.id].sits ? 'sit' : 'idle')); }
// brains
const BRAINS = {
  idle: (a, dt) => standStill(a),
  wander: (a, dt) => { const m = a.mem; if (m.tx == null || (m.wait != null && NOW.t > m.wait && Math.abs(a.x - m.tx) < 3)) { m.tx = a.x0 + (Math.random() - 0.5) * (a.range || 80); m.wait = null; } if (m.wait == null) { if (walkTo(a, m.tx, a.speed || WALK_NPC, dt)) m.wait = NOW.t + 3 + Math.random() * 6; } else standStill(a); },
  follow: (a, dt) => { const h = G.hero, tgt = h.x - h.face * 34, d = Math.abs(tgt - a.x); if (a.stay) { if (d < 60 && h.x > a.stay) { } walkTo(a, Math.min(tgt, a.stay), 60, dt) && standStill(a); return; } if (d > 90) walkTo(a, tgt, 118, dt); else if (d > 26 && (isMoving(h) || d > 50)) walkTo(a, tgt, d > 50 ? 80 : 40, dt); else { standStill(a); if (!a.habit && !isMoving(a)) a.face = Math.sign(h.x - a.x) || a.face; } },
  graze: (a, dt) => BRAINS.wander(a, dt),
  hen: (a, dt) => { const m = a.mem; if (m.tx == null || NOW.t > (m.next || 0)) { m.tx = a.x0 + (Math.random() - 0.5) * (a.range || 40); m.next = NOW.t + 2 + Math.random() * 4; } if (Math.abs(a.x - m.tx) > 2 && !a.habit) walkTo(a, m.tx, 18, dt); else standStill(a); },
  kids: (a, dt) => { const m = a.mem; if (m.tx == null || Math.abs(a.x - m.tx) < 3) { m.tx = a.x0 + (Math.random() < 0.5 ? -1 : 1) * (30 + Math.random() * 60); m.pause = NOW.t + (Math.random() < 0.4 ? 1.5 + Math.random() * 3 : 0); } if (NOW.t < m.pause) { standStill(a); return; } walkTo(a, m.tx, 74, dt, 'run'); },
  fetch: (a, dt) => { const m = a.mem; if (!m.phase) { m.phase = 'go'; m.t = 0; } if (m.phase === 'go') { if (walkTo(a, a.x1, WALK_NPC, dt)) { m.phase = 'draw'; setAnim(a, 'pick'); a.busy = true; } } else if (m.phase === 'draw') { if (animDone(a)) { a.busy = false; m.phase = 'back'; } } else if (m.phase === 'back') { if (walkTo(a, a.x0, WALK_NPC, dt)) { m.phase = 'rest'; m.until = NOW.t + 6 + Math.random() * 6; } } else { standStill(a); if (NOW.t > m.until) m.phase = 'go'; } },
  weave: (a, dt) => { a.vx = 0; if (!a.habit && a.anim !== 'loom' && !a.talking) setAnim(a, 'loom'); },
  work: (a, dt) => { const m = a.mem; if (!a.habit && !a.talking && NOW.t > (m.next || 0)) { setAnim(a, 'pick'); a.habit = 'pick'; m.next = NOW.t + 4 + Math.random() * 3; } else standStill(a); },
};
function actorTick(a, dt) { a.at += dt; if (a.brain && BRAINS[a.brain] && !a.scripted) BRAINS[a.brain](a, dt); if (CAST[a.id].kind !== 'snake') lifeTick(a, dt); if (!a.airborne) a.y = a.fixY != null ? a.fixY : floorAt(G.L, a.x, a.y - 1, a.y + 4); }
// ── drawing an actor in either world ──
function frameOf(a) { const w = G.world === 'g' && (CAST[a.id].god || a === G.hero) ? 'g' : 'm'; let f = frameAt(a.id, a.anim, w, frameIndex(a)); if (!f) { f = frameAt(a.id, CAST[a.id].sits ? 'sit' : 'idle', w, 0, true); } return { f, w }; }
// a mortal in the God's view is a soft silhouette: one blurred rest frame per character is enough (and cheap)
const MIST_OF = new Map(); function mistFor(a) { let m = MIST_OF.get(a.id); if (m) return m; const f = frameAt(a.id, CAST[a.id].sits ? 'sit' : 'idle', 'm', 0, true); if (!f) return null; m = mistOf(f); MIST_OF.set(a.id, m); return m; }
function drawActor(x, a, camx, world) { if (a.hidden) return; const c = CAST[a.id]; const { f } = frameOf(a); if (!f) return; let img = f; const ghost = world === 'g' && !c.god && a !== G.hero;
  if (ghost) { if (a.mistless) return; img = mistFor(a) || mistOf(f); const bob = Math.sin(NOW.t * 1.6 + a.x * 0.1) * 1.2; x.globalAlpha = 0.8; blit(x, img, a.x - camx, a.y + bob, a.face); x.globalAlpha = 1; return; }
  if (a.flash > 0 && a.alive !== false) { x.globalAlpha = (Math.floor(NOW.t * 30) % 2) ? 0.35 : 1; } if (a.deadT > 0.7) x.globalAlpha = Math.max(0, 1 - (a.deadT - 0.7) / 0.85); blit(x, img, a.x - camx, a.y, a.face); x.globalAlpha = 1; }
function blit(x, f, sxp, syp, face) { const px = Math.round(sxp), py = Math.round(syp); if (face >= 0) x.drawImage(f.c, px - f.ox, py - f.oy); else { x.save(); x.translate(px, 0); x.scale(-1, 1); x.drawImage(f.c, -f.ox, py - f.oy); x.restore(); } }
// a painted name beside a god in the God's view, letters stacked down the figure like on a vase
function paintedName(x, a, camx) { const c = CAST[a.id]; if (!c.god || G.world !== 'g') return; const hy = a.y - 66 * c.god.sz, nx = Math.round(a.x - camx - a.face * 14 - (a.face < 0 ? 6 : 0)); (G.tags || (G.tags = {}))[a.id + (a.name || '')] = { s: c.god.name, x: a.x - camx, y: hy, face: a.face, sz: c.god.sz }; }
