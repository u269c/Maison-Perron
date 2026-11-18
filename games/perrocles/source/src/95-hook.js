// ═══ TEST HOOK: lets the test scripts drive the game ═══
window.GAME = { G, Input, Save, CAST, flag, startGame, enterLand, loadLand, setupOloosson, toggleWorld, runScene, LANDS, BAKED, BAKE_Q,
  press(a, ms = 80) { Input.setBot(a, true); setTimeout(() => Input.setBot(a, false), ms); }, hold(a, on) { Input.setBot(a, on); },
  skipDialog() { if (G.dialog) { if (G.dialog.choices) { G.dialog.done = true; G.dialog.result = G.dialog.sel; } else { G.dialog.shown = G.dialog.parsed.length; G.dialog.done = true; endLine(G.dialog); } } },
  state() { const h = G.hero; return { scene: G.scene, land: G.land, tod: G.tod, world: G.world, x: h && Math.round(h.x), y: h && Math.round(h.y), hp: h && h.hp, script: G.script && G.script.name, dialog: !!G.dialog, flags: Object.keys(G.flags), paused: G.paused, menu: UI.menu, skip: !!(G.script && G.script.skip), q: BAKE_Q.length, book: Save.d.book, vases: Save.d.vases }; } };
// test-only: GAME.auto = true fast-forwards dialogue (choices take GAME.pick, default 0)
(function autoLoop() { const d = G.dialog; if (window.GAME.auto && d && !d.done && d.t > 0.04 && !(d.choices && window.GAME.pick === -1)) { if (d.choices) { d.sel = window.GAME.pick || 0; } window.GAME.skipDialog(); } requestAnimationFrame(autoLoop); })();
