# Release formats for future Maison Perron games

*Decided 25 November 2026; revised the same day: the poster is now the PNG layer, the PICO-8 cartridge and SVG poster are dropped. Applies to new games; existing games are not retrofitted unless decided per game.*

A Maison Perron game is still **one self-contained HTML file**. From now on that file is also several other files at once
(a *polyglot*): rename it and it becomes something else. One download, four things:

| Rename to | You get |
|---|---|
| `.html` | **The game**, as always. Open it and play. |
| `.pdf` | **The book of the game**: the story as told in the game, how to play, and how the game was made. |
| `.mp3` | **The soundtrack**, every theme back to back, from the game's own music engine. |
| `.png` | **The movie poster**: a hand-painted 1980s one-sheet. |

The launcher and each game's README offer the file under each name (same bytes, different extension), for example
*Jouer · Le livre · La musique · L'affiche*.

## What goes in each

**`.html` — the game.** Unchanged rules: no dependencies, art drawn in code, music synthesized live, FR first.

**`.pdf` — the book.** Printable, illustrated with frames rendered by the game itself (headless), in the game's art style.
1. **The story**: the story as the game tells it, with the cutscenes and dialogue as a script, in both languages.
2. **How to play**: controls (keyboard, touch, gamepad), rules, characters, worlds and levels, items, tips; the secret codes on
   a last page, upside down.
3. **How this game was made**: the design notes, the decisions and why, the tools and the process (including playtest bots
   and numbers), the music engine, credits.

**`.mp3` — the soundtrack.** The music engine rendered offline: each world's theme, the boss themes, the title. One MP3
stream with ID3 tags (title, artist *Les Productions Maison Perron*, cover art = the poster) and a chapter per track
(ID3 `CHAP` frames), so players that know chapters show the track list.

**`.png` — the movie poster.** A full one-sheet in the style of the hand-painted 1980s posters, portrait 2:3
(1200 × 1800): a painted key art scene with the heroes and the villain, dramatic lighting, the title treatment, a tagline,
and the credit block at the bottom. Painted in code like the rest of the game, but as a painting, not flat vector art:
layered brush strokes, airbrushed gradients and rim light, canvas grain. The game's own renderer paints it (a poster scene
it can draw on request), rendered headless at build time, so it matches the game and needs no outside art. It is also the
PNG layer of the polyglot: the poster's pixels are the file's image data, so the image you see when you open the `.png` is
the same file that plays as the game.

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
IDAT…          the poster's pixels
IEND                                          ← PNG ends
after IEND:    the PDF index and trailer, then -->     ← PDF's %%EOF in the last 1024 bytes
```

## The build step

A shared tool, `tools/polyglot/` (to write with the first game that uses it), takes the game's single HTML file, the book
(pages written as data and rendered to PDF), the rendered soundtrack, and the rendered poster, and writes the polyglot. It
must check, every build:

- the file opens as each format: the game runs in a headless browser with no errors, the PDF parses and shows every page,
  the MP3 decodes the full duration, the PNG decodes to the poster;
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
- **Image sites recompress pictures.** Posting the poster on social media works as a poster, but the copy people get back
  is only the image: the game, book and music are stripped. The full thing travels as a file, not a post.
- **Size.** A painted poster at 1200 × 1800 is a few megabytes of PNG, on top of the game and the MP3. Keep the
  soundtrack bitrate modest (128 kbps is plenty for synthesized music) and check the total against the launcher's needs.
