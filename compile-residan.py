#!/usr/bin/env python3

import json
import re

entries = []

pat = re.compile('^([0-9A-F]+):([A-Z0-9-]+:)?(.*)$')

def parse(infl):
    addr = None
    globname = None
    textls = None
    for ln in infl.readlines():
        ln = ln.rstrip()
        if not ln:
            if addr:
                obj = {}
                if globname:
                    obj['glob'] = globname
                obj['text'] = '\n'.join(textls)
                entry = (addr, obj)
                entries.append(entry)
                addr = None
                textls = None
        else:
            if not addr:
                match = pat.match(ln)
                if not match:
                    raise Exception('not a definition line')
                addr = match.group(1)
                globname = match.group(2)
                text = match.group(3)
                addr = int(addr, 16)
                if globname:
                    globname = globname.replace(':', '')
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
