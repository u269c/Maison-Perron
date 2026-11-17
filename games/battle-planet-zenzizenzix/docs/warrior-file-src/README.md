# The warrior file: sources

`../warrior-file.html` is the historical record of how the Battle Planet roster was chosen.
It is one self-contained HTML file with a tab per stage, built from these parts:

- `template.html`: the page, the tab bar, tab 1 (the problem) and tab 3 (the picks)
- `war_js2.js`, `war_css.css`: the 50 warriors and the concept-art kit (tab 2)
- `an_js.js`, `an_css.css`, `an_body.html`: the round-2 analysis (tab 4)

Rebuild with `python3 build.py`. To add a stage, add a link in the tab bar and a
`<section class="tab" id="...">` in `template.html`.
