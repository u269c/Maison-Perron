"""Print the whole spoken script of Perroclès, in play order, as Markdown.

    python3 tools/script.py            # writes docs/script/fr.md, en.md and el.md
    python3 tools/script.py en         # prints one language to the terminal

It reads the source modules (source/src/6*.js, the story files, which are
numbered in play order) and pulls out every T('français', 'English',
'ελληνικά') with who says it. Use it to proofread the story as a story: read
one language top to bottom and ask at each line whether a child would follow.

The speaker is worked out from the code around the line (m = byName('mentor')
and so on), so a few labels are approximate. Lines marked ◇ are choices,
lines in italics are pop-ups, hints and title cards, and lines marked ~ are
barks: short things said while you keep playing.
"""
import glob, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'source', 'src')
OUT = os.path.join(HERE, '..', 'docs', 'script')
LANGS = {'fr': 0, 'en': 1, 'el': 2}
STR = r"'((?:[^'\\]|\\.)*)'"
TRE = re.compile(r"T\(\s*" + STR + r"\s*,\s*" + STR + r"\s*,\s*" + STR + r"\s*\)")
FN = re.compile(r"^(?:const\s+\w+\s*=\s*\w+;\s*\w+\s*=\s*)?function\*?\s*([A-Za-z0-9_$]*)|^function\*?\s+([A-Za-z0-9_$]+)")
NAME = re.compile(r"(\w+): \{ fr: " + STR + r", en: " + STR + r", el: " + STR + r" \}")
PARTS = [('62', {'fr': 'Prologue : Oloosson', 'en': 'Prologue: Oloosson', 'el': 'Πρόλογος: Ολοοσσών'}),
         ('64', {'fr': 'Acte I : Delphes', 'en': 'Act I: Delphi', 'el': 'Πράξη Α΄: Δελφοί'}),
         ('66', {'fr': 'Acte I : la route, Tirynthe, Némée', 'en': 'Act I: the road, Tiryns, Nemea', 'el': 'Πράξη Α΄: ο δρόμος, Τίρυνθα, Νεμέα'}),
         ('67', {'fr': 'Acte I : pendant les combats', 'en': 'Act I: during the fights', 'el': 'Πράξη Α΄: στις μάχες'}),
         ('68', {'fr': 'Acte I : Lerne, et les retours chez le roi', 'en': 'Act I: Lerna, and reporting to the king', 'el': 'Πράξη Α΄: Λέρνα, και οι αναφορές στον βασιλιά'}),
         ('69', {'fr': 'Acte I : l’Arcadie', 'en': 'Act I: Arcadia', 'el': 'Πράξη Α΄: Αρκαδία'}),
         ('6a', {'fr': 'Acte I : les écuries d’Augias', 'en': 'Act I: the Augean stables', 'el': 'Πράξη Α΄: οι στάβλοι του Αυγεία'}),
         ('6b', {'fr': 'Acte II : Argos, le navire, le Cyclope', 'en': 'Act II: Argos, the ship, the Cyclops', 'el': 'Πράξη Β΄: Άργος, το καράβι, ο Κύκλωπας'}),
         ('6c', {'fr': 'Acte II : Éole et Circé', 'en': 'Act II: Aeolus and Circe', 'el': 'Πράξη Β΄: Αίολος και Κίρκη'}),
         ('6d', {'fr': 'Acte II : les Sirènes, Charybde et Scylla', 'en': 'Act II: the Sirens, Scylla and Charybdis', 'el': 'Πράξη Β΄: Σειρήνες, Σκύλλα και Χάρυβδη'}),
         ('6e', {'fr': 'Acte II : la Crète', 'en': 'Act II: Crete', 'el': 'Πράξη Β΄: Κρήτη'}),
         ('6f', {'fr': 'Acte III : le rivage, Lemnos, les Hespérides', 'en': 'Act III: the shore, Lemnos, the Hesperides', 'el': 'Πράξη Γ΄: η ακτή, Λήμνος, Εσπερίδες'}),
         ('6g', {'fr': 'Acte III : le Caucase et les Enfers', 'en': 'Act III: the Caucasus and the Underworld', 'el': 'Πράξη Γ΄: Καύκασος και Κάτω Κόσμος'}),
         ('6h', {'fr': 'Acte IV : l’Etna, l’Héraion, l’Olympe', 'en': 'Act IV: Etna, the Heraion, Olympus', 'el': 'Πράξη Δ΄: Αίτνα, Ηραίο, Όλυμπος'})]


def names():
    out = {}
    for f in sorted(glob.glob(os.path.join(SRC, '*.js'))):
        for m in NAME.finditer(open(f, encoding='utf-8').read()):
            out.setdefault(m.group(1), (m.group(2), m.group(3), m.group(4)))
    return out


def scene_title(fn):
    s = re.sub(r'^(scene|setup|_scene|_setup|_)', '', fn or '')
    s = re.sub(r'(Talk|In|Tick)$', lambda m: ' (' + m.group(1).lower() + ')', s)
    return re.sub(r'(?<=[a-z])(?=[A-Z0-9])', ' ', s).strip() or fn


def script(lang):
    li, NM, out = LANGS[lang], names(), []

    def who(key, vars_):
        key = vars_.get(key, key)
        for k in (key, re.sub(r'[A-Z0-9]+$', '', key), key.lower()):
            if k in NM:
                return NM[k][li]
        return key[:1].upper() + key[1:]

    for prefix, title in PARTS:
        f = glob.glob(os.path.join(SRC, prefix + '-*.js'))[0]
        out.append('\n## ' + title[lang] + '\n')
        cur, vars_, shown = None, {}, None
        for line in open(f, encoding='utf-8'):
            m = FN.match(line)
            if m and (m.group(1) or m.group(2)):
                cur, vars_ = m.group(1) or m.group(2), {}
            for v in re.finditer(r"(\w+) = (?:byName|addActor)\('(\w+)'", line):
                vars_[v.group(1)] = v.group(2)
            for v in re.finditer(r"(\w+) = \{ name: '(\w+)'", line):
                vars_['@' + v.group(1)] = v.group(2)
            for t in TRE.finditer(line):
                text = t.group(li + 1).replace("\\'", "'")
                if not text:
                    continue
                pre, post = line[max(0, t.start() - 70):t.start()], line[t.end():t.end() + 40]
                if cur != shown:
                    out.append('\n### ' + scene_title(cur) + '\n'); shown = cur
                say = re.search(r"(?:SAY|O|B)\((?:\{ id: '(\w+)' \}|'(\w+)'|(\w+))?,?\s*(?:'\w+',\s*)?$", pre)
                brk = re.search(r"bark\((?:byName\('(\w+)'\)[^,]*|G\.(hero)|(\w+)),\s*tr\($", pre)
                if say and 'CHOOSE' not in pre:
                    key = say.group(1) or say.group(2) or say.group(3) or ('oldwoman' if 'O(' in pre else 'hero')
                    if key in ('sly', 'happy', 'think', 'neutral', 'cross', 'sad', 'tender', 'surprised', 'grin', 'shy'):
                        key = 'oldwoman' if re.search(r"\bO\('\w+',\s*$", pre) else 'hero'
                    nm = re.search(r"^[^;]*?name: '(\w+)'", post) or re.search(r"^, (\w+)\)", post)
                    if nm:
                        key = vars_.get('@' + nm.group(1), nm.group(1)) if nm.group(1) in NM or '@' + nm.group(1) in vars_ else key
                    out.append(f'**{who(key, vars_)}** — {text}  ')
                elif brk:
                    out.append(f'~ **{who(brk.group(1) or brk.group(2) or brk.group(3), vars_)}** — {text}  ')
                elif 'text: ' in pre[-8:] and ('stance' in post or 'CHOOSE' in line[:t.start()][-400:]):
                    out.append(f'◇ {text}  ')
                else:
                    out.append(f'*{text}*  ')
    return '\n'.join(out) + '\n'


HEAD = {'fr': '# Perroclès : le texte complet\n\nTout ce qui se dit dans le jeu, dans l’ordre où on le joue. Fichier généré par `tools/script.py` : ne pas le corriger ici, mais dans `source/src/`.\n\n> **Divulgâche** toute l’histoire.\n',
        'en': '# Perroclès: the full script\n\nEverything said in the game, in the order you play it. Generated by `tools/script.py`: fix lines in `source/src/`, not here.\n\n> **Spoils** the whole story.\n',
        'el': '# Περροκλής: όλο το κείμενο\n\nΌ,τι λέγεται στο παιχνίδι, με τη σειρά που παίζεται. Παράγεται από το `tools/script.py`: οι διορθώσεις γίνονται στο `source/src/`, όχι εδώ.\n\n> **Αποκαλύπτει** όλη την ιστορία.\n'}

if __name__ == '__main__':
    if len(sys.argv) > 1:
        sys.stdout.write(HEAD[sys.argv[1]] + script(sys.argv[1]))
    else:
        os.makedirs(OUT, exist_ok=True)
        for lang in LANGS:
            body = HEAD[lang] + script(lang)
            open(os.path.join(OUT, lang + '.md'), 'w', encoding='utf-8').write(body)
            print('wrote docs/script/' + lang + '.md', body.count('\n'), 'lines')
