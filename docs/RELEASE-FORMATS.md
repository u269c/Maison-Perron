# Release formats for future Maison Perron games

*Decided 25 November 2026. Applies to new games; existing games are not retrofitted unless decided per game.*

A Maison Perron game is still **one self-contained HTML file**. From now on that file is also several other files at once
(a *polyglot*): rename it and it becomes something else. One download, five things:

| Rename to | You get |
|---|---|
| `.html` | **The game**, as always. Open it and play. |
| `.pdf` | **The book of the game**: the story as told in the game, how to play, and how the game was made. |
| `.mp3` | **The soundtrack**, every theme back to back, from the game's own music engine. |
| `.p8.png` | **The cartridge**: a cartridge label image in the PICO-8 style. |
| `.svg` | **The movie poster**: a hand-painted 1980s one-sheet. *A separate file, see below.* |

The launcher and each game's README offer the file under each name (same bytes, different extension), for example
*Jouer · Le livre · La musique · La cartouche · L'affiche*.

## What goes in each

**`.html` — the game.** Unchanged rules: no dependencies, art drawn in code, music synthesized live, FR first.

**`.pdf` — the book.** Printable, illustrated with frames rendered by the game itself (headless), in the game's art style.
1. **The story**: the story as the game tells it, with the cutscenes and dialogue as a script, in both languages.
2. **How to play**: controls (keyboard, touch, gamepad), rules, characters, worlds and levels, items, tips; the secret codes on
   a last page, upside down.
3. **How this game was made**: the design notes, the decisions and why, the tools and the process (including playtest bots
   and numbers), the music engine, credits.

**`.mp3` — the soundtrack.** The music engine rendered offline: each world's theme, the boss themes, the title. One MP3
stream with ID3 tags (title, artist *Les Productions Maison Perron*, cover art = the cartridge label) and a chapter per track
(ID3 `CHAP` frames), so players that know chapters show the track list.

**`.p8.png` — the cartridge.** A PNG of a cartridge in the PICO-8 tradition (a label painted for the game, the title, the
studio). PICO-8 stores its own code inside the image; ours carries a JavaScript game instead, so **PICO-8 itself won't load
it**. The name is a nod; the README says so. Renamed to `.html`, it plays.

**`.svg` — the movie poster.** A full one-sheet in the style of the hand-painted 1980s posters: a painted key art scene with
the heroes and the villain, dramatic lighting, the title treatment, a tagline, and the credit block at the bottom. Painted
with SVG gradients and filters (turbulence and displacement for brush texture), not flat vector art.

## How the bytes fit together

Each format reads a different part of the file:

- **PNG** must start at byte 0 with its signature, ends at the `IEND` chunk, ignores unknown ancillary chunks (lower-case
  first letter) and ignores anything after `IEND`.
- **PDF** looks for `%PDF-` within the first 1024 bytes, finds its index from the end (`startxref` … `%%EOF` in the last
  1024 bytes), and skips anything between objects when the index is correct.
- **MP3** players skip leading bytes until they find the first audio frame sync.
- **HTML** parsers read from the top and skip everything inside `<!-- … -->`.

So the file is laid out like this:

```
PNG signature, IHDR                         ← PNG starts at byte 0
chunk "htMl":  <!doctype html><meta charset=utf-8><!--      ← HTML starts; everything binary from here is in comments
               %PDF-1.7 … the book's objects (pages, text, images)   ← PDF header within the first 1024 bytes
chunk "muSc":  the MP3 frames                ← MP3 players resync here
chunk "gaMe":  --> <style>…</style><script>… the game …</script> <!--
IDAT…          the cartridge label pixels
IEND                                          ← PNG ends
after IEND:    the PDF index and trailer, then -->     ← PDF's %%EOF in the last 1024 bytes
```

### The poster is a separate file

An SVG is XML, which must be clean text from its first byte; the PNG signature and the MP3 and image data contain bytes
XML forbids. So the poster **cannot share bytes** with the other formats. It ships as `<game>-affiche.svg` next to the game.
(If one download is wanted, a ZIP layer can be added to the polyglot to carry the poster: ZIP finds its index at the end of
the file, which fits in the trailer area. Not decided yet.)

## The build step

A shared tool, `tools/polyglot/` (to write with the first game that uses it), takes the game's single HTML file, the book
(pages written as data and rendered to PDF), the rendered soundtrack, and the cartridge art, and writes the polyglot. It
must check, every build:

- the file opens as each format: the game runs in a headless browser with no errors, the PDF parses and shows every page,
  the MP3 decodes the full duration, the PNG decodes to the label;
- no `-->` (or `--!>`) appears inside the binary parts that sit in HTML comments: PDF streams use text-safe encodings and
  standard fonts, and the MP3 encoder is nudged (padding, bitrate per frame) until the bytes are clean;
- the PDF index offsets are right after everything is assembled.
- the game copes with what the browser sees first: the PNG signature and header come before `<!doctype html>`, so the page
  is in quirks mode and those bytes show as a little text at the top. The game's first script removes leading text nodes,
  and its layout must not depend on standards mode (canvas games are fine; test it).

## Caveats

- **Strict readers.** Chrome, Firefox's PDF viewer and Acrobat are lenient about leading bytes; macOS Preview and some
  phone viewers need testing. MP3 players vary in how far they scan for the first frame.
- **Security filters.** Mail gateways and some antivirus tools treat polyglot files as suspicious (malware uses the same
  tricks). Hosting is fine; emailing the file may get it quarantined.
- **Image sites recompress pictures**, which destroys everything but the label. The cartridge travels as a file, not a post.
