import React from 'react';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import { TranslationEntry } from './info';
import { get_translation_list } from './modgame';
import { Commentary } from '../visi/widgets';
import { check_commentary } from '../visi/combuild';

export function TranslatePage()
{
    const [ translationList, setTranslationList ] = useState(get_translation_list());
    let noderef = useRefDiv();

    useEffect(() => {
        function evhan_list(ev: Event) {
            let list: TranslationEntry[] = (ev as CustomEvent).detail;
            setTranslationList(list);
        };
        window.addEventListener('translation-list-update', evhan_list);
        return () => {
            window.removeEventListener('translation-list-update', evhan_list);
        };
    });

    useLayoutEffect(() => {
        if (noderef.current) {
            let nod = noderef.current;
            let nodparent = noderef.current.parentElement;
            if (nod && nodparent)
                nod.scrollTop = nod.scrollHeight - nodparent.scrollHeight;
        }
    }, [translationList]);
    
    let counter = 0;
    let ells = translationList.map((ent) => {
        let comel = null;
        if (ent.glob && check_commentary(ent.glob, 'GLOB')) {
            comel = (
                <Commentary topic={ 'GLOB:'+ent.glob } />
            );
        }
        return (
            <p key={ counter++ } className="Translation">
                { comel }
                { ent.text }
            </p>
        );
    });
    
    return (
        <div className="ScrollContent" ref={ noderef }>
            <div className="TranslatePage">
                <p>
                    <Commentary topic={ 'PHONETIC' } />
                    This page shows a running translation of the Residan
                    text that you find on signs, computer displays, and
                    so forth.
                    (It&#x2019;s not that it&#x2019;s hard to read; it&#x2019;s
                    just <em>annoying</em>.)
                </p>
                <hr/>
                { ells }
                <p>&nbsp;</p>
            </div>
        </div>
    );
}

const useRefDiv = () => useRef<HTMLDivElement>(null);

