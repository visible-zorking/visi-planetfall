
/* Return the initial sourceloc to display. */
export function sourceloc_start() : string
{
    return 'J:78:1:101:0';  // 'gverbs.zil', lines 78-100
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
