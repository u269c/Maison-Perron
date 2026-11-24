// =====================================================================
// RUMBLE — what the controllers feel. Each event is a short pattern of pulses on the two motors
// (strong = the heavy low motor, weak = the light buzzy one), queued per player and played in time.
// Strong, light or off from the pause menu.
// =====================================================================
let RUMBLE_ON = true;   // kept for older code; the real setting is AUD.rumble: 'strong' | 'light' | 'off'
const RUMQ = [[], []], RUMT = [0, 0];
function rumPlay(i, strong, weak, ms) { const md = typeof AUD !== 'undefined' ? AUD.rumble : 'strong'; if (md === 'off') return; const k = md === 'light' ? .4 : 1; strong *= k; weak *= k; ms *= md === 'light' ? .7 : 1; try { const pad = typeof padOf === 'function' ? padOf(i) : null; pad && pad.vibrationActuator && pad.vibrationActuator.playEffect('dual-rumble', { startDelay: 0, duration: ms, strongMagnitude: Math.min(1, strong), weakMagnitude: Math.min(1, weak) }); } catch (e) {} }
// steps: [at ms, strong, weak, duration ms]; a new pattern replaces a weaker one in progress
function rum(i, steps, prio = 1) { if (i == null || i < 0 || i > 1) return; if (RUMQ[i].length && (RUMQ[i].prio || 0) > prio) return; RUMQ[i] = steps.map(s => ({ at: RUMT[i] + s[0] / 1000, s: s[1], w: s[2], ms: s[3] })); RUMQ[i].prio = prio; }
function rumTick(dt) { for (let i = 0; i < 2; i++) { RUMT[i] += dt; const q = RUMQ[i]; while (q.length && q[0].at <= RUMT[i]) { const st = q.shift(); rumPlay(i, st.s, st.w, st.ms); } if (!q.length) q.prio = 0; } }
const RUM = {
  hit: (i, dmg, friendly) => rum(i, friendly ? [[0, .55, .3, 70], [110, .55, .3, 90]] : [[0, .35 + dmg * .2, .5, 90 + dmg * 40], [140, .15, .25, 70]], 2),
  ko: i => rum(i, [[0, 1, 1, 260], [330, .6, .4, 160], [600, .35, .2, 220], [950, .15, .1, 300]], 5),
  fall: i => rum(i, [[0, .2, .5, 200], [300, .6, .4, 220]], 3),
  revived: i => rum(i, [[0, .15, .2, 70], [150, .3, .3, 80], [310, .55, .5, 140]], 3),
  dizzy: i => { const st = []; for (let k = 0; k < 12; k++) st.push([k * 250, k % 2 ? .4 : 0, k % 2 ? 0 : .55, 120]); rum(i, st, 2); },
  dizzyThump: i => rum(i, [[0, .7, .3, 120]], 3),
  poison: i => rum(i, [[0, .15, .6, 220]], 2), poisonTick: i => rum(i, [[0, 0, .35, 90], [130, 0, .2, 60]], 1),
  bleed: i => rum(i, [[0, .6, .3, 110]], 2), bleedTick: i => rum(i, [[0, .35, .15, 60], [150, .3, .1, 60]], 1),   // a heartbeat
  connect: i => rum(i, [[0, .1, .28, 45]], 1), finisher: i => rum(i, [[0, .9, .6, 170], [200, .3, .2, 90]], 3),
  special: i => rum(i, [[0, .1, .35, 160], [180, .25, .45, 160]], 2),
  dodge: i => rum(i, [[0, 0, .45, 55]], 1), counter: i => rum(i, [[0, .55, .35, 90]], 2),
  lift: i => rum(i, [[0, .18, .15, 60]], 1), throwIt: i => rum(i, [[0, .3, .2, 80]], 1),
  quake: amt => { for (let i = 0; i < 2; i++) if (players[i] && players[i].ko <= 0) rum(i, [[0, Math.min(1, amt / 10), Math.min(1, amt / 14), 120 + amt * 15]], 1); }
};
let rumShake = 0;
function rumShakeWatch() { const s = WORLD.shake || 0; if (s >= 6 && rumShake < 6) RUM.quake(s); rumShake = s; }
