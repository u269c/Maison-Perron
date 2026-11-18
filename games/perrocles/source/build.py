"""Build Perroclès into one self-contained HTML file.

    python3 build.py                 # writes ../perrocles.html
    python3 build.py /tmp/test.html  # or anywhere you like

The drawing kit (kit/) comes first, then every module in src/ in file-name
order, all pasted into shell.html where it says /*__GAME__*/. No minifying,
no bundler, no dependencies: the output is the game.
"""
import glob, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = ['_core.js', '_pxhelpers.js', '_vec.js', '_items.js', '_render.js']

kit = '\n'.join(f'// ── kit: {k} ──\n' + open(os.path.join(HERE, 'kit', k), encoding='utf-8').read() for k in KIT)
parts = sorted(glob.glob(os.path.join(HERE, 'src', '*.js')))
js = kit + '\n' + '\n'.join(f'// ── file: {os.path.basename(p)} ──\n' + open(p, encoding='utf-8').read() for p in parts)
html = open(os.path.join(HERE, 'shell.html'), encoding='utf-8').read().replace('/*__GAME__*/', js)
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'perrocles.html')
open(out, 'w', encoding='utf-8').write(html)
print('built', os.path.normpath(out), len(html) // 1024, 'KB')
