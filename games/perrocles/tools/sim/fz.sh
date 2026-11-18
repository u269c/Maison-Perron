#!/bin/bash
# A batch of full playthroughs, Prologue to the end card, with screenshots.
# usage: fz.sh tag profile n first-seed parallel [chaos 0|1|2] [reload-probability]
#   profile: kid | hard | mash, add H for Heroic (kidH, hardH)
#   chaos:   0 no monkey, 1 light monkey, 2 heavy monkey
# results: $OUT/<tag>/<profile>-c<chaos>.jsonl and screenshots; summarise with fzr.py
cd "$(dirname "$0")"; OUT=${OUT:-/tmp/fz}; mkdir -p "$OUT/$1"
START=full UNTIL=zzz BUDGET=1 TMAX=6000 REALMAX=480 CHAOS=${6:-0} RELOAD=${7:-0} SHOTS="$OUT/$1" python3 run.py $2 $3 $4 $5 20 "$OUT/$1/$2-c${6:-0}.jsonl"
