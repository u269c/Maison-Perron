// ═══ INPUT: keyboard and controllers → actions ═══
// Keyboard: arrows/WASD move · Space/W/↑ jump · X or J club · C or K sling · E or ↓ talk/use · V the Owl's Eye · Enter confirm · Esc pause
// Controller: A jump/confirm · X club/talk · Y sling · B back · L2+R2 together the Owl's Eye · Start pause
const KEYS = { ArrowLeft: ['left'], ArrowRight: ['right'], ArrowUp: ['up', 'jump'], ArrowDown: ['down', 'use'], KeyA: ['left'], KeyD: ['right'], KeyW: ['up', 'jump'], KeyS: ['down', 'use'], Space: ['jump', 'ok'],
  KeyX: ['atk'], KeyJ: ['atk'], KeyC: ['shoot'], KeyK: ['shoot'], KeyE: ['use', 'ok'], KeyV: ['eye'], Enter: ['ok'], NumpadEnter: ['ok'], Escape: ['pause', 'back'], KeyL: ['lang'], KeyQ: ['swap'], KeyR: ['swap2'], Tab: ['book'], KeyP: ['pause'] };
const Input = { kb: {}, pad: {}, latch: {}, bot: {}, device: 'kb', padOn: false, held: {},
  down(a) { return !!(this.kb[a] || this.pad[a] || this.bot[a]); }, hit(a) { return !!this.latch[a]; }, end() { this.latch = {}; this.click = null; }, press(a) { this.latch[a] = true; },
  setBot(a, on) { if (on && !this.bot[a]) this.latch[a] = true; this.bot[a] = on; }, any() { for (const a in this.latch) if (this.latch[a] && a !== 'lang') return true; return false; } };
addEventListener('keydown', (e) => { const as = KEYS[e.code]; Audio.ensure(); Input.device = 'kb'; if (!as) return; if (!e.repeat) for (const a of as) Input.press(a); for (const a of as) Input.kb[a] = true; e.preventDefault(); });
addEventListener('keyup', (e) => { const as = KEYS[e.code]; if (as) for (const a of as) Input.kb[a] = false; });
addEventListener('blur', () => { Input.kb = {}; });
cv.addEventListener('pointerdown', (e) => { Audio.ensure(); const r = cv.getBoundingClientRect(); Input.click = { x: ((e.clientX - r.left) * DISP.dpr - DISP.x) / DISP.s, y: ((e.clientY - r.top) * DISP.dpr - DISP.y) / DISP.s }; Input.press('ok'); Input.press('click'); });
// Controllers. Standard layout (Chrome, Edge, Safari): 0 ✕/A · 1 ○/B · 2 □/X · 3 △/Y · 4 L1 · 5 R1 · 6 L2 · 7 R2 · 8 Create/Share · 9 Options · 10 L3 · 11 R3 · 12-15 d-pad · 16 PS · 17 touchpad.
// PlayStation pads reported without the standard layout (often Firefox) are remapped from their raw HID order: □ ✕ ○ △ L1 R1 L2 R2 Share Options L3 R3 PS Touchpad, d-pad on a hat axis.
const PS_RAW = [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, -1, -1, -1, -1, 12, 13];
function padKindOf(id) { const s = (id || '').toLowerCase(); if (/xbox|045e|xinput/.test(s)) return 'xbox'; if (/054c|dualsense|dualshock|playstation|wireless controller|ps4|ps5/.test(s)) return /0ce6|0df2|dualsense|ps5/.test(s) ? 'ps5' : 'ps4'; return 'xbox'; }
function readPad(gp) { const std = gp.mapping === 'standard', kind = padKindOf(gp.id), raw = (i) => { const b = gp.buttons[i]; return !!b && (b.pressed || b.value > 0.5); };
  const b = (i) => { if (std || kind === 'xbox') return raw(i); const r = PS_RAW[i]; return r >= 0 ? raw(r) : false; };
  let ax = gp.axes[0] || 0, ay = gp.axes[1] || 0, du = b(12), dd = b(13), dl = b(14), dr = b(15);
  if (!std && kind !== 'xbox') { const hat = gp.axes.length > 9 ? gp.axes[9] : null; if (hat != null && hat >= -1.05 && hat <= 1.05) { const k = Math.round((hat + 1) * 3.5) % 8; du = k === 7 || k <= 1; dr = k >= 1 && k <= 3; dd = k >= 3 && k <= 5; dl = k >= 5 && k <= 7; } else if (gp.axes.length >= 8) { dl = gp.axes[6] < -0.5; dr = gp.axes[6] > 0.5; du = gp.axes[7] < -0.5; dd = gp.axes[7] > 0.5; } }
  return { b, ax, ay, du, dd, dl, dr, kind }; }
function pollPads() { const pads = navigator.getGamepads ? navigator.getGamepads() : []; const p = {}; Input.axisX = 0;
  for (const gp of pads) { if (!gp || !gp.connected && gp.connected !== undefined) continue; const P = readPad(gp), b = P.b, ax = Math.abs(P.ax) > 0.2 ? P.ax : 0, ay = P.ay;
    if (!Input.padOn || Input.padKind !== P.kind) { Input.padKind = P.kind; Input.padName = gp.id; } Input.padOn = true;
    p.left = P.dl || ax < -0.35; p.right = P.dr || ax > 0.35; p.up = P.du || ay < -0.6; p.down = P.dd || ay > 0.6; p.jump = b(0); p.ok = b(0); p.atk = b(2); p.use = b(2) || P.dd;
    p.shoot = b(3); p.back = b(1); p.pause = b(9); p.book = b(8); p.eye = (b(6) && b(7)) || b(17); p.pgl = b(4); p.pgr = b(5); p.swap = b(5); p.swap2 = b(4); p.lt = b(6); p.rt = b(7);
    if (!P.dl && !P.dr && ax) Input.axisX = ax; break; }
  for (const a in p) if (p[a] && !Input.pad[a]) { Input.press(a); Input.device = 'pad'; Audio.ensure(); } Input.pad = p; }
addEventListener('gamepadconnected', (e) => { const k = padKindOf(e.gamepad.id); Input.padKind = k; Input.padOn = true; UI.padNote = { k, t: 0 }; });
addEventListener('gamepaddisconnected', () => { Input.padOn = false; UI.padNote = { k: 'off', t: 0 }; Input.pad = {}; if (G.scene === 'play' && !G.paused && !G.endCard) { G.paused = true; UI.menu = 'pause'; UI.sel = 0; } });
// rumble patterns for the cool moments: [ms, strong, weak, pause-after] steps
const RUMBLES = { land: [[70, 0.55, 0.3]], swing: [[35, 0, 0.22]], kill: [[90, 0.8, 0.6, 60], [170, 0.35, 0.8]], smash: [[80, 0.45, 0.75]], slingWhirl: [[22, 0, 0.18]], slingLoose: [[55, 0.25, 0.65]],
  pickup: [[55, 0.15, 0.6, 70], [70, 0.3, 0.9]], reveal: [[120, 0.65, 0.2, 150], [240, 0.95, 0.45]], page: [[45, 0, 0.4]], wolves: [[380, 0.35, 0.05]], thud: [[90, 0.6, 0.15]], heartbeat: [[90, 0.7, 0.1, 120], [140, 0.9, 0.2]], mercy: [[220, 0.6, 0.6]] };
function rumbleFx(name) { const P = RUMBLES[name]; if (!P) return; let at = 0; for (const [ms, st, wk, gap = 0] of P) { const go = () => rumble(ms, st, wk); if (at === 0) go(); else setTimeout(go, at); at += ms + gap; } }
let RUMBLE_OK = true; function rumble(ms, s = 0.5, w = 0.5) { if (!Save.d.rumble || !RUMBLE_OK) return; try { for (const gp of navigator.getGamepads()) if (gp && gp.vibrationActuator) { gp.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: s, weakMagnitude: w }); break; } } catch (e) { RUMBLE_OK = false; } }
