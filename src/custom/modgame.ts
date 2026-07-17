import { unpack_address } from '../visi/gametypes';
import { GnustoEngine, ZState } from '../visi/zstate';
import { gamedat_routine_names, gamedat_global_names, gamedat_string_map } from '../visi/gamedat';

export type SpecificPlanetfall = {
    get_cmove_table: (addr: number) => number[];
};

export function get_specifics(engine: GnustoEngine, state: ZState): SpecificPlanetfall
{
    function get_cmove_table(addr: number) : number[]
    {
        console.log('### get_cmove_table', addr);
        return [1, 2, 3];
    }

    return { get_cmove_table };
}

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    return null;
}

