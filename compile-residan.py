#!/usr/bin/env python3

import json

entries = []

def parse(infl):
    addr = None
    textls = None
    for ln in infl.readlines():
        ln = ln.rstrip()
        if not ln:
            if addr:
                entry = (addr, '\n'.join(textls))
                entries.append(entry)
                addr = None
                textls = None
        else:
            if not addr:
                addr, _, text = ln.partition(':')
                if not text:
                    raise Exception('missing text')
                addr = int(addr, 16)
                text = text.strip()
                textls = [ text ]
            else:
                ln = ln.replace('\t', '')
                textls.append(ln)

with open('gamedat/translated-text') as infl:
    parse(infl)

with open('src/game/translation.js', 'w') as fl:
    fl.write('window.gamedat_translationtables = ');
    json.dump(entries, fl)
    fl.write(';\n')
