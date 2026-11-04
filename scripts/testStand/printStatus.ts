import fs from 'node:fs';
import path from 'node:path';

import {INSTALL_STATE_FILES, MEDIAMTX_PATHS_URL} from './consts.ts';
import {findDockTarget} from './dock/findDockTarget.ts';
import {getDockText} from './dock/getDockText.ts';
import {sendObsRequest} from './obs/sendObsRequest.ts';
import {findStandProcesses} from './processes/findStandProcesses.ts';

export const printStatus = async () => {
    console.log(`Processes: ${findStandProcesses().map(({name}) => name).join(', ') || 'none'}`);

    INSTALL_STATE_FILES.forEach(filePath => {
        console.log(`${path.basename(filePath)}: ${fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').trim() : '-'}`);
    });

    try {
        console.log(`Dock: ${(await findDockTarget())?.url ?? 'not open'}`);
        console.log(await getDockText());
        console.log(`Stream: ${JSON.stringify(await sendObsRequest('GetStreamStatus'))}`);
        console.log(`RTMP server: ${await (await fetch(MEDIAMTX_PATHS_URL)).text()}`);
    } catch (error) {
        console.log(`OBS: ${String(error)}`);
    }
};
