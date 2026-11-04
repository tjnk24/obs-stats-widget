import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import {COMPATIBILITY_FILE_NAME} from '../../serveTestRelease/consts.ts';
import {
    DOCK_WAIT_MS,
    MEDIAMTX_CONFIG_PATH,
    MEDIAMTX_DIRECTORY,
    MEDIAMTX_EXECUTABLE,
    OBS_PROCESS_NAME,
    SERVE_RELEASE_SCRIPT,
    SERVED_DIRECTORY,
} from '../consts.ts';
import {prepareDock} from '../dock/prepareDock.ts';

import {findStandProcesses} from './findStandProcesses.ts';
import {spawnObs} from './spawnObs.ts';
import {waitFor} from './waitFor.ts';

export const startStand = async () => {
    const running = findStandProcesses().map(({name}) => name);

    if (!running.includes(path.basename(MEDIAMTX_EXECUTABLE))) {
        spawn(MEDIAMTX_EXECUTABLE, [MEDIAMTX_CONFIG_PATH], {cwd: MEDIAMTX_DIRECTORY, detached: true, stdio: 'ignore'}).unref();
    }

    if (!running.includes('node.exe') && fs.existsSync(path.join(SERVED_DIRECTORY, COMPATIBILITY_FILE_NAME))) {
        spawn(process.execPath, [SERVE_RELEASE_SCRIPT, SERVED_DIRECTORY], {detached: true, stdio: 'ignore'}).unref();
    }

    if (!running.includes(OBS_PROCESS_NAME)) {
        spawnObs();
    }

    await waitFor('the dock in OBS', async () => {
        await prepareDock();

        return true;
    }, DOCK_WAIT_MS);

    console.log('Stand is running');
};
