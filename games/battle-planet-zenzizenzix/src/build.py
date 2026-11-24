#!/usr/bin/env python3
"""Builds ../battle-planet-zenzizenzix.html, the game, as one self-contained file.

Shared parts come from the mocks: the warriors, the skeleton actors, the
level screens and the print shader."""
import os, re, sys
H = os.path.dirname(os.path.abspath(__file__)); M = os.path.join(H, '..', 'mocks', 'src')
rd = lambda *p: open(os.path.join(*p)).read()
bg = rd(M, 'bg.js').replace('const SCREENS = [S1, S2, S3, S4];', 'let SCREENS = [S1, S2, S3, S4];')
game = rd(H, 'game.js').replace('/*WARRIORS*/', rd(M, 'warriors.js')).replace('/*RENDER*/', '').replace('/*GAMEEXTRA*/', '')
parts = [rd(M, 'actors.js'), rd(M, 'comic', 'shader.js'), rd(H, 'ink.js'), game, bg, rd(H, 'bg2.js'), rd(H, 'levels.js'), rd(H, 'looks.js'), rd(H, 'status.js'), rd(H, 'breakables.js'), rd(H, 'carry.js'), rd(H, 'soif.js'), rd(H, 'combos.js'), rd(H, 'anim.js'), rd(H, 'dress.js'), rd(H, 'specials.js'), rd(H, 'moves.js'), rd(H, 'rumble.js'), rd(H, 'audio.js'), rd(H, 'sfx.js'), rd(H, 'setpieces.js'), rd(H, 'buddy.js'), rd(H, 'padmap.js'), rd(H, 'story.js'), rd(H, 'play.js'), rd(H, 'cutscene.js'), rd(H, 'cut2.js'), rd(H, 'flow.js'), rd(H, 'model3d.js'), rd(H, 'select.js')]
js = '\n'.join(parts)
# guard against two modules declaring the same top-level name (a silent override in a plain script)
names = re.findall(r'^(?:function|const|let|var)\s+([A-Za-z_$][\w$]*)', js, re.M)
for m in re.finditer(r'^(?:const|let|var)\s+([^;\n]*)', js, re.M):
    d = m.group(1)
    for _ in range(6): d = re.sub(r"\([^()]*\)|\[[^\[\]]*\]|\{[^{}]*\}|`[^`]*`|'[^']*'|\"[^\"]*\"", '', d)
    names += [n for n in re.findall(r'(?:^|,\s*)([A-Za-z_$][\w$]*)\s*=', d)][1:]
dup = sorted({n for n in names if names.count(n) > 1})
if dup: print('duplicate top-level names:', dup); sys.exit(1)
out = os.path.join(H, '..', 'battle-planet-zenzizenzix.html')
open(out, 'w').write(rd(H, 'page.html').replace('/*JS*/', js))
print('built', out, len(js) // 1024, 'KB')
