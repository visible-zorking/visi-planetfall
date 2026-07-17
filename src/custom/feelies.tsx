import React from 'react';

import { ExtWebLink } from './about';

export function FeeliesPage()
{
    return (
        <div className="ScrollContent">
            <div className="FeeliesPage">
                <h2>Life in the Stellar Patrol</h2>
                <p>
                    <i>Planetfall</i> came with a packet of over-the-top
                    recruiting material for the Stellar Patrol. However,
                    nothing in the package was intended as copy
                    protection or even critical background material.
                    The opening paragraph of the game tells you everything
                    you need to know.
                </p>
                <p>
                    To browse a scanned version of the manual and
                    feelies, visit the{' '}
                    <ExtWebLink url={ 'https://infodoc.plover.net/manuals/planetfa.pdf' } text={ 'InfoDoc Project' } />.
                    For high-resolution scans, visit the{' '}
                    <ExtWebLink url={ 'https://archive.org/details/Infocom_Planetfall_Apple' } text={ 'Internet Archive' } />.
                </p>
                <h2>Special commands</h2>
                <p>
                    The only special feature of <i>Planetfall</i>&#x2019;s
                    commands is that time is measured in
                    &#x201C;millichrons&#x201D; instead of turns.
                    Different actions take different amounts of time.
                    A simple <code>GET</code> might take only seven
                    millichrons (about a minute); walking down a long
                    hallway might take 150 or more. You will require
                    regular food and sleep, so try not to waste time.
                </p>
                <p>
                    The status line displays the current time of day,
                    from 0000 (midnight) to 5000 (noon) to 9999 (about
                    to be midnight again).
                    Don&#x2019;t lose your chronometer!
                </p>
            </div>
        </div>
    );
}
