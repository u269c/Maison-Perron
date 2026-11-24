#!/usr/bin/env python3
"""Builds mocks/comic-styles.html from page.html, ../actors.js, shader.js, scene.js."""
import pathlib
here = pathlib.Path(__file__).parent
page = (here / 'page.html').read_text()
for tag, f in [('/*ACTORS*/', here.parent / 'actors.js'), ('/*SHADER*/', here / 'shader.js'), ('/*SCENE*/', here / 'scene.js')]:
    assert tag in page, tag
    page = page.replace(tag, f.read_text())
out = here.parent.parent / 'comic-styles.html'
out.write_text(page)
print(out, len(page))
