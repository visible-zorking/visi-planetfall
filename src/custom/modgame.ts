import { unpack_address } from '../visi/gametypes';
import { GnustoEngine, ZState } from '../visi/zstate';
import { gamedat_routine_names, gamedat_global_names, gamedat_string_map } from '../visi/gamedat';
import { gamedat_translation_addrs } from './info';

export type SpecificPlanetfall = {
    get_cmove_table: (addr: number) => number[];
};

export function get_specifics(engine: GnustoEngine, state: ZState): SpecificPlanetfall
{
    function get_cmove_table(addr: number) : number[]
    {
        let res = [];
        for (let ix=0; ix<12; ix++) {
            res.push(engine.getWord(addr+2*ix));
        }
        return res;
    }

    return { get_cmove_table };
}

let translation_list: string[] = [];
const MAX_LIST = 40;

export function update_translation_list(ev: Event)
{
    let detail: ZState = (ev as CustomEvent).detail;

    let newentries = [];
    
    for (let addr of detail.strings) {
        let text = gamedat_translation_addrs.get(addr);
        if (!text)
            continue;
        if (translation_list.length && translation_list[translation_list.length-1] == text) 
            continue;
        newentries.push(text);
    }

    if (newentries.length)
        translation_list = [ ...translation_list, ...newentries ];

    if (translation_list.length > MAX_LIST)
        translation_list = translation_list.slice(translation_list.length - MAX_LIST);

    window.dispatchEvent(new CustomEvent('translation-list-update', { detail: translation_list }));
}

export function get_translation_list(): string[]
{
    return translation_list;
}

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    return null;
}

