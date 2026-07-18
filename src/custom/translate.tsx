import React from 'react';
import { useState, useEffect } from 'react';

import { get_translation_list } from './modgame';
import { Commentary } from '../visi/widgets';

export function TranslatePage()
{
    const [ translationList, setTranslationList ] = useState(get_translation_list());

    useEffect(() => {
        function evhan_list(ev: Event) {
            let list: string[] = (ev as CustomEvent).detail;
            setTranslationList(list);
        };
        window.addEventListener('translation-list-update', evhan_list);
        return () => {
            window.removeEventListener('translation-list-update', evhan_list);
        };
    });
    
    let counter = 0;
    let ells = translationList.map((text) => (
        <p key={ counter++ } className="Translation">{ text }</p>
    ));
    
    return (
        <div className="ScrollContent">
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
            </div>
        </div>
    );
}
