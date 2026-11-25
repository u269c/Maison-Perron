# Playtest bots

Headless bots that play the real game loop (renders stubbed, ~200× real time) to find stuck states and measure difficulty.

- `bot.js` — injected into the page: replaces `readInput` with a bot (`dumb` = random mashing, `naive` = walks right and fights, `good` = dodges, charges, throws, solves the sky puzzles), counts hits, KOs, falls, screen restarts, and records a snapshot whenever nothing progresses for 45 s of game time.
- `run.py jobs.json out.jsonl [workers]` — jobs are `{level, kind, solo, pair: [id, id], seed, cap, campaign?}`.
- `ana.py out.jsonl` — the per-level table: clear rate, times, restarts, KOs, falls, hits per minute, stuck episodes; then boss fights (damage taken, KOs, restarts, fight time per boss) and re-falls (a fall within 3 s of a respawn).
- `PT_HTML=/path/to/build.html python3 run.py …` runs the jobs against another build (to compare before and after).

Needs Playwright with Chrome (`/usr/bin/google-chrome`).
