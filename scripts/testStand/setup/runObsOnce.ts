import fs from 'node:fs';
import path from 'node:path';

import {
    DOCK_WAIT_MS, OBS_LOADED_LOG_TEXT, OBS_LOGS_DIRECTORY,
} from '../consts.ts';
import {spawnObs} from '../processes/spawnObs.ts';
import {stopStand} from '../processes/stopStand.ts';
import {waitFor} from '../processes/waitFor.ts';

export const runObsOnce = async () => {
    spawnObs();

    await waitFor('the first start of OBS', () => (
        fs.readdirSync(OBS_LOGS_DIRECTORY).some(name => fs.readFileSync(path.join(OBS_LOGS_DIRECTORY, name), 'utf8').includes(OBS_LOADED_LOG_TEXT))
    ), DOCK_WAIT_MS);

    await stopStand({isObsOnly: true});
};
