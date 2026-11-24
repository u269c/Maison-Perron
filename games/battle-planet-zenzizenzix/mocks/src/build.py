# Builds ../level1-havre.html (one self-contained file) from the parts here.
import os
H = os.path.dirname(os.path.abspath(__file__)); os.chdir(H)
core = open('core.js').read().replace('/*WARRIORS*/', open('warriors.js').read())
# bg.js and sprites.js need the core's constants, so they go after the constants but before the game starts
split = core.index('newGame(); resize(); helpBar();')
js = core[:split] + '\n' + open('bg.js').read() + '\n' + open('sprites.js').read() + '\n' + core[split:]
open(os.path.join(H, '..', 'level1-havre.html'), 'w').write(open('page.html').read().replace('/*JS*/', js))
print('built', len(js) // 1024, 'KB')
