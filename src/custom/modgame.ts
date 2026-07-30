import { unpack_address } from '../visi/gametypes';
import { GnustoEngine, ZState, ZStatePlus } from '../visi/zstate';
import { gamedat_routine_names, gamedat_global_names, gamedat_string_map } from '../visi/gamedat';
import { OptPosition, ExtraToggle } from '../visi/map';
import { TranslationEntry, gamedat_translation_addrs } from './info';

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

let translation_list: TranslationEntry[] = [];
const MAX_LIST = 40;

export function update_translation_list(ev: Event)
{
    let detail: ZState = (ev as CustomEvent).detail;

    let newentries = [];
    
    for (let addr of detail.strings) {
        let ent = gamedat_translation_addrs.get(addr);
        if (!ent)
            continue;
        if (translation_list.length && translation_list[translation_list.length-1].text == ent.text) 
            continue;
        newentries.push(ent);
    }

    if (newentries.length)
        translation_list = [ ...translation_list, ...newentries ];

    if (translation_list.length > MAX_LIST)
        translation_list = translation_list.slice(translation_list.length - MAX_LIST);

    window.dispatchEvent(new CustomEvent('translation-list-update', { detail: translation_list }));
}

export function get_translation_list(): TranslationEntry[]
{
    return translation_list;
}

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    return null;
}

const escape_pod_shift = { x:127, y:179.9 };
const escape_pod_half_shift = { x:46, y:90 };

function transform_for(pos: OptPosition): string
{
    if (!pos)
        return '';

    return 'translate('+pos.x+','+pos.y+')';
}

export function map_adjustments(zstate: ZStatePlus): ExtraToggle[]
{
    let pod_moved = (zstate.globals[212] >= 5); // BLOWUP-COUNTER

    let ls = [];

    let escape_pod: OptPosition = null;
    if (zstate.globals[211] >= 15)       // TRIP-COUNTER
        escape_pod = escape_pod_shift;
    else if (zstate.globals[212] >= 5)   // BLOWUP-COUNTER
        escape_pod = escape_pod_half_shift;
    
    ls.push({ id:'r-escape-pod', transform:transform_for(escape_pod) });

    return ls;
}
