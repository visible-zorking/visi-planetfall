import { unpack_address, ObjectData } from '../visi/gametypes';
import { GnustoEngine, ZState, ZStatePlus } from '../visi/zstate';
import { gamedat_ids, gamedat_object_ids, gamedat_roominfo_names, gamedat_routine_names, gamedat_global_names, gamedat_string_map } from '../visi/gamedat';
import { OptPosition, ExtraToggle, ScrollCenterInfo } from '../visi/map';
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

function offset_for_room(zstate: ZStatePlus, locname: string): OptPosition
{
    switch (locname) {
        
    case 'ESCAPE-POD':
        if (zstate.globals[211] >= 15)       // TRIP-COUNTER
            return { x:127, y:179.9 };
        else if (zstate.globals[212] >= 5)   // BLOWUP-COUNTER
            return { x:46, y:90 };
        else
            return null;

    case 'UPPER-ELEVATOR':
        if (zstate.globals[104])   // UPPER-ELEVATOR-UP
            return { x:58.21, y:-71.44 };
        else
            return null;

    case 'LOWER-ELEVATOR':
        if (!zstate.globals[105])  // LOWER-ELEVATOR-UP
            return { x:55.56, y:39.69 };
        else
            return null;

    case 'CRYO-ELEVATOR':
        if (zstate.globals[43])    // CRYO-SCORE-FLAG
            return { x:-37.04, y:55.56 };
        else
            return null;

    case 'SHUTTLE-CAR-BETTY':
    case 'BETTY-CONTROL-WEST':
    case 'BETTY-CONTROL-EAST':
        // SHUTTLE-MOVING && (BETTY-CONTROL-WEST || BETTY-CONTROL-EAST)...
        if (zstate.globals[202] && (zstate.globals[0] == 197 || zstate.globals[0] == 198)) {
            let dist = zstate.globals[199];  // SHUTTLE-COUNTER
            if (!zstate.globals[203])   // BETTY-AT-KALAMONTEE
                return { x:-105.833 * (dist+1) / 25, y:0 };
            else
                return { x:-105.833 * (24-dist) / 25, y:0 };
        }
        else {
            if (zstate.globals[203])   // BETTY-AT-KALAMONTEE
                return { x:-105.833, y:0 }
            else
                return null;
        }

    case 'SHUTTLE-CAR-ALFIE':
    case 'ALFIE-CONTROL-WEST':
    case 'ALFIE-CONTROL-EAST':
        // SHUTTLE-MOVING && (ALFIE-CONTROL-WEST || ALFIE-CONTROL-EAST)...
        if (zstate.globals[202] && (zstate.globals[0] == 200 || zstate.globals[0] == 202)) {
            let dist = zstate.globals[199];  // SHUTTLE-COUNTER
            if (zstate.globals[204])   // ALFIE-AT-KALAMONTEE
                return { x:105.833 * (dist+1) / 25, y:0 };
            else
                return { x:105.833 * (24-dist) / 25, y:0 };
        }
        else {
            if (!zstate.globals[204])   // ALFIE-AT-KALAMONTEE
                return { x:105.833, y:0 }
            else
                return null;
        }

    default:
        return null;
    }
}

function transform_for(zstate: ZStatePlus, locname: string): string
{
    let pos = offset_for_room(zstate, locname);
    if (!pos)
        return '';

    return 'translate('+pos.x+','+pos.y+')';
}

export function map_adjustments(zstate: ZStatePlus): ExtraToggle[]
{
    let pod_moved = (zstate.globals[212] >= 5); // BLOWUP-COUNTER

    let ls = [];

    if (true) {
        let zobj = zstate.objects[gamedat_ids.FLOYD-1];
        let obj = gamedat_object_ids.get(gamedat_ids.FLOYD);
        let mobcen: OptPosition = null;
        let mobloc: ObjectData|undefined;
        if (zobj.parent) {
            mobloc = gamedat_object_ids.get(zobj.parent);
            if (mobloc) {
                let throomobj = gamedat_roominfo_names.get(mobloc.name);
                if (throomobj) {
                    mobcen = throomobj.bottom;
                }
            }
        }
        if (mobcen && mobloc) {
            let posx = mobcen.x;
            let posy = mobcen.y;
            
            let mtransform = 'translate('+posx+','+posy+')';
            ls.push({ id:'mob-floyd', class:'', transform:mtransform });
        }
        else {
            ls.push({ id:'mob-floyd', class:'Offstage' });
        }
    }

    ls.push({ id:'r-escape-pod', transform:transform_for(zstate, 'ESCAPE-POD') });
    ls.push({ id:'r-upper-elevator', transform:transform_for(zstate, 'UPPER-ELEVATOR') });
    ls.push({ id:'r-lower-elevator', transform:transform_for(zstate, 'LOWER-ELEVATOR') });
    ls.push({ id:'r-cryo-elevator', transform:transform_for(zstate, 'CRYO-ELEVATOR') });
    
    ls.push({ id:'r-shuttle-car-alfie', transform:transform_for(zstate, 'SHUTTLE-CAR-ALFIE') });
    ls.push({ id:'r-alfie-control-east', transform:transform_for(zstate, 'ALFIE-CONTROL-EAST') });
    ls.push({ id:'r-alfie-control-west', transform:transform_for(zstate, 'ALFIE-CONTROL-WEST') });
    ls.push({ id:'r-shuttle-car-betty', transform:transform_for(zstate, 'SHUTTLE-CAR-BETTY') });
    ls.push({ id:'r-betty-control-east', transform:transform_for(zstate, 'BETTY-CONTROL-EAST') });
    ls.push({ id:'r-betty-control-west', transform:transform_for(zstate, 'BETTY-CONTROL-WEST') });
    
    return ls;
}

export function map_scrollcenter(zstate: ZStatePlus, locname: string): ScrollCenterInfo
{
    let offset = offset_for_room(zstate, locname);
    if (!offset)
        return null;

    let roomobj = gamedat_roominfo_names.get(locname);
    if (roomobj) {
        let pos = { x: roomobj.center.x + offset.x, y: roomobj.center.y + offset.y };
        return { pos: pos };
    }
    
    return null;
}
