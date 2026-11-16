#!/usr/bin/env python3
"""Refresh the version / last-update line on each card of the launcher (index.html).

For every <div class="stamp" data-file="..."> in index.html, this reads:
  - data-ver : the game's VERSION constant (e.g. VERSION = '1.16.0'), if it has one
  - data-date: the date of the last commit that touched the game file
  - data-rev : that commit's short id (shown when the game has no VERSION)

Run it from anywhere inside the repo after a game changes, then commit index.html:

    python3 tools/stamp-launcher.py

The page also refreshes these values live when served from GitHub Pages; the baked-in
values are what you see when opening index.html straight from disk.
"""
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(subprocess.check_output(['git', 'rev-parse', '--show-toplevel'], text=True).strip())
INDEX = ROOT / 'index.html'
VERSION_RE = re.compile(r"""\bVERSION\s*=\s*['"]v?(\d[^'"]*)['"]""")
STAMP_RE = re.compile(r'<div class="stamp" data-file="([^"]+)"[^>]*></div>')


def stamp(match: re.Match) -> str:
    rel = match.group(1)
    path = ROOT / rel
    if not path.is_file():
        sys.exit(f'stamp-launcher: {rel} does not exist')
    m = VERSION_RE.search(path.read_text(encoding='utf-8', errors='replace'))
    ver = m.group(1) if m else ''
    log = subprocess.check_output(['git', 'log', '-1', '--format=%aI %h', '--', rel], cwd=ROOT, text=True).split()
    date, rev = (log + ['', ''])[:2]
    print(f'  {rel:45} v{ver or "-":10} {date} {rev}')
    return f'<div class="stamp" data-file="{rel}" data-ver="{ver}" data-date="{date}" data-rev="{rev}"></div>'


def main() -> None:
    html = INDEX.read_text(encoding='utf-8')
    new, n = STAMP_RE.subn(stamp, html)
    if n == 0:
        sys.exit('stamp-launcher: no stamp lines found in index.html')
    if new != html:
        INDEX.write_text(new, encoding='utf-8')
        print(f'updated {n} cards in index.html')
    else:
        print('index.html already up to date')


if __name__ == '__main__':
    main()
