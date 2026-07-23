#!/usr/bin/env python3

import json

with open('src/game/strings.js') as infl:
    dat = infl.read()

pos = dat.index('=')
dat = dat[ pos+1 : -2 ]

arr = json.loads(dat)
arr.sort()

for tup in arr:
    addr, text, pos = tup[0:3]
    ltext = text.lower()
    if 'aa' in ltext or 'uu' in ltext or 'ii' in ltext or 'xe ' in ltext or 'praj' in ltext or 'planateree' in ltext:
        text = text.strip()
        text = text.replace('\n\n', '\n')
        text = text.replace('\n\n', '\n')
        text = text.replace('\n', '\n\t')
        print('%X: %s' % (addr, text,))
        print()
        
