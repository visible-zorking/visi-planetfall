
/* Return the initial sourceloc to display. */
export function sourceloc_start() : string
{
    return 'H:308:1:333:0';  // 'verbs.zil', lines 308-332
}

// Presentation order. Filenames must match game-info!
export const sourcefile_presentation_list: string[] = [
    'planetfall.zil',
    'compone.zil',
    'comptwo.zil',
    'globals.zil',
    'parser.zil',
    'syntax.zil',
    'verbs.zil',
    'misc.zil',
];

// The Planetfall translation table.
const winany = (window as any);
export const gamedat_translation_addrs = winany.gamedat_translation_addrs as Map<number, string>;

