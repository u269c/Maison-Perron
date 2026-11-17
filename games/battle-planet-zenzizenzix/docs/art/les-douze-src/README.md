# Les Douze: painted hero cards

`../les-douze.html` shows the twelve warriors of the merged roster as big painted cards.
Each painting is generated from code, so any card can be tweaked and repainted.

- `heroes.js`: every hero's card text, stats, and **brief** (the painting prompt)
- `scenes.js`: one scene per hero, laid out as shapes, following its brief (`amiral.js` holds the Amiral's)
- `kit.js`: shared pieces (skies, planets, smoke, lightning, Villen-Hüüs's soldiers, figure parts)
- `engine.js`: the brush (layered strokes in a 17th-century palette, then varnish)
- `page.html`: the gallery template

To change a painting: edit its brief in `heroes.js`, change its scene in `scenes.js`, then
`python3 build.py <id>` (for example `python3 build.py marge`). Images land in `../les-douze/`.
Running `python3 build.py` with no id repaints all twelve. For realistic paintings made with an image generator, see `prompts.md`: an image saved as `../les-douze/final/<id>.jpg` replaces the generated one (`python3 build.py --no-paint`). Each card also has a "Repaint
with a new seed" button that repaints the same scene with different brushwork in the browser.
