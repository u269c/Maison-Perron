# Les Douze: render every painting, then build the gallery page.
#   python3 build.py            -> render all + build
#   python3 build.py marge papi -> re-render only those, then build
import os, sys, base64, json
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
OUTDIR = os.path.join(HERE, '..', 'les-douze'); os.makedirs(OUTDIR, exist_ok=True)
scenes = open('scenes.js').read()
if '/*AMIRAL*/' in scenes: scenes = scenes.replace('/*AMIRAL*/', open('amiral.js').read())
JS = open('kit.js').read() + '\n' + scenes + '\n' + open('engine.js').read() + '\n' + open('heroes.js').read()
HARNESS = '<!DOCTYPE html><html><body><script>' + JS + '''
function paintHero(id) { const h = HEROES.find(x => x.id === id); seed = h.seed; const { img, focal } = SCENES[id]();
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d', { willReadFrequently: true });
  seed = h.seed + 1; paint(img, ctx, focal); finish(ctx); return cv.toDataURL('image/jpeg', .86); }
</script></body></html>'''
open('/tmp/les-douze-harness.html', 'w').write(HARNESS)
ids = sys.argv[1:] or [h for h in json.loads(open('ids.json').read())]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file:///tmp/les-douze-harness.html'); pg.wait_for_timeout(300)
    for i in ids:
        d = pg.evaluate(f"paintHero('{i}')")
        open(os.path.join(OUTDIR, i + '.jpg'), 'wb').write(base64.b64decode(d.split(',')[1])); print('painted', i, errs)
    b.close()
# gallery
imgs = {i: 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(OUTDIR, i + '.jpg'), 'rb').read()).decode() for i in json.loads(open('ids.json').read())}
page = open('page.html').read().replace('/*IMAGES*/', 'const IMAGES = ' + json.dumps(imgs) + ';').replace('/*JS*/', JS)
open(os.path.join(HERE, '..', 'les-douze.html'), 'w').write(page); print('built les-douze.html', len(page) // 1024, 'KB')
